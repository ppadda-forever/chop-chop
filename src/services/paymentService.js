// 결제 서비스
import { getCachedExchangeRate } from '../lib/exchangeRateCache'

/**
 * PayPal 결제 처리
 * @param {Object} orderData - 주문 데이터
 * @param {number} total - 총 결제 금액 (KRW)
 * @param {function} setLoading - 로딩 상태 설정 함수
 * @param {function} onSuccess - 성공 콜백
 * @param {function} onError - 에러 콜백
 */
export const processPayPalPayment = async (orderData, total, setLoading, onSuccess, onError) => {
  try {
    setLoading(true)
    
    // 환율 정보 가져오기
    let exchangeRate
    let usdAmount
    
    try {
      exchangeRate = await getCachedExchangeRate()
      usdAmount = parseFloat((total * exchangeRate.krwToUsd).toFixed(2))
    } catch (error) {
      console.error('Failed to fetch exchange rate:', error)
      // 폴백: 고정 환율 사용
      exchangeRate = { krwToUsd: 0.00077 } // 대략 1300 KRW = 1 USD
      usdAmount = parseFloat((total / 1300).toFixed(2))
    }
    
    // PayPal 주문 생성
    const response = await fetch('/api/paypal/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: usdAmount.toFixed(2),
        currency: 'USD',
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `PayPal 주문 생성 실패 (${response.status})`)
    }

    const order = await response.json()
    
    if (!order.id) {
      throw new Error('PayPal 주문 ID를 받지 못했습니다.')
    }

    console.log('PayPal order created successfully:', order.id)

    // PayPal 결제 완료 후 주문 생성을 위해 주문 데이터를 localStorage에 저장
    localStorage.setItem('pendingOrder', JSON.stringify(orderData))
    localStorage.setItem('paypalOrderId', order.id)
    
    // PayPal 결제 페이지로 리다이렉트 (환경에 따라 다른 URL)
    const isLive = process.env.NEXT_PUBLIC_PAYPAL_ENVIRONMENT === 'live'
    const paypalBaseUrl = isLive ? 'https://www.paypal.com' : 'https://www.sandbox.paypal.com'
    const paypalUrl = `${paypalBaseUrl}/checkoutnow?token=${order.id}`
    console.log('Redirecting to PayPal:', paypalUrl)
    window.location.href = paypalUrl
    
  } catch (error) {
    console.error('Error processing PayPal payment:', error)
    setLoading(false) // 에러 발생 시에만 로딩 상태 해제
    if (onError) {
      onError(error)
    } else {
      alert(`PayPal 결제 시작 실패: ${error.message}`)
    }
  }
  // PayPal의 경우 finally 블록에서 setLoading(false)를 호출하지 않음
}

/**
 * PayPal 결제 완료 후 주문 생성
 * @param {Object} paymentResult - PayPal 결제 결과
 * @param {function} setLoading - 로딩 상태 설정 함수
 * @param {function} onSuccess - 성공 콜백
 * @param {function} onError - 에러 콜백
 */
export const createOrderAfterPayPalPayment = async (paymentResult, setLoading, onSuccess, onError) => {
  try {
    setLoading(true)
    
    // localStorage에서 주문 데이터 가져오기
    const pendingOrderData = localStorage.getItem('pendingOrder')
    if (!pendingOrderData) {
      throw new Error('주문 데이터를 찾을 수 없습니다.')
    }
    
    const orderData = JSON.parse(pendingOrderData)
    
    // PayPal 결제 정보 추가 (paymentStatus는 제외)
    const finalOrderData = {
      ...orderData,
      paymentMethod: 'paypal',
      paypalOrderId: paymentResult.orderID,
      paypalCaptureId: paymentResult.captureID,
      paymentDetails: {
        ...orderData.paymentDetails,
        paypal: {
          orderID: paymentResult.orderID,
          captureID: paymentResult.captureID,
          amount: paymentResult.amount,
          status: paymentResult.status
        }
      }
    }
    
    // 1. 주문 생성 (PENDING 상태)
    const orderResponse = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(finalOrderData),
    })

    if (!orderResponse.ok) {
      const errorData = await orderResponse.json()
      throw new Error(errorData.error || 'Failed to create order')
    }

    const order = await orderResponse.json()
    
    // 2. PayPal 결제 완료 상태로 업데이트
    const paymentUpdateResponse = await fetch(`/api/orders/${order.id}/payment-status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentStatus: 'COMPLETED',
        paypalOrderId: paymentResult.orderID,
        paypalCaptureId: paymentResult.captureID,
        paymentDetails: {
          ...orderData.paymentDetails,
          paypal: {
            orderID: paymentResult.orderID,
            captureID: paymentResult.captureID,
            amount: paymentResult.amount,
            status: paymentResult.status,
            completedAt: new Date().toISOString()
          }
        }
      }),
    })

    if (!paymentUpdateResponse.ok) {
      console.error('Failed to update payment status, but order was created')
    }

    const updatedOrder = await paymentUpdateResponse.json()
    
    // localStorage 정리
    localStorage.removeItem('pendingOrder')
    localStorage.removeItem('paypalOrderId')
    
    if (onSuccess) {
      onSuccess(updatedOrder)
    }
    
  } catch (error) {
    console.error('Error creating order after PayPal payment:', error)
    if (onError) {
      onError(error)
    } else {
      alert(`주문 생성 실패: ${error.message}`)
    }
  } finally {
    setLoading(false)
  }
}

/**
 * 카드 결제 처리 (기본 주문 처리)
 * @param {Object} orderData - 주문 데이터
 * @param {function} setLoading - 로딩 상태 설정 함수
 * @param {function} onSuccess - 성공 콜백
 * @param {function} onError - 에러 콜백
 */
export const processCardPayment = async (orderData, setLoading, onSuccess, onError) => {
  try {
    setLoading(true)
    
    // 1. 주문 생성 (PENDING 상태)
    const orderResponse = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    })

    if (!orderResponse.ok) {
      const errorData = await orderResponse.json()
      throw new Error(errorData.error || 'Failed to create order')
    }

    const order = await orderResponse.json()
    
    // 2. 카드 결제는 성공으로 간주하고 결제 상태 업데이트
    const paymentUpdateResponse = await fetch(`/api/orders/${order.id}/payment-status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentStatus: 'COMPLETED',
        paymentDetails: {
          method: 'card',
          completedAt: new Date().toISOString()
        }
      }),
    })

    if (!paymentUpdateResponse.ok) {
      console.error('Failed to update payment status, but order was created')
    }

    const updatedOrder = await paymentUpdateResponse.json()
    
    if (onSuccess) {
      onSuccess(updatedOrder)
    }
    
  } catch (error) {
    console.error('Error processing card payment:', error)
    if (onError) {
      onError(error)
    } else {
      alert(`주문 처리 실패: ${error.message}`)
    }
  } finally {
    setLoading(false)
  }
}

/**
 * 결제 수단별 결제 처리 라우터
 * @param {string} paymentMethod - 결제 수단
 * @param {Object} orderData - 주문 데이터
 * @param {number} total - 총 결제 금액 (KRW)
 * @param {function} setLoading - 로딩 상태 설정 함수
 * @param {function} onSuccess - 성공 콜백
 * @param {function} onError - 에러 콜백
 */
export const processPayment = async (paymentMethod, orderData, total, setLoading, onSuccess, onError) => {
  switch (paymentMethod) {
    case 'paypal':
      await processPayPalPayment(orderData, total, setLoading, onSuccess, onError)
      break
    case 'card':
    default:
      await processCardPayment(orderData, setLoading, onSuccess, onError)
      break
  }
}