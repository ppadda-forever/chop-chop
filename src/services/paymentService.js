// 결제 서비스
import { getCachedExchangeRate } from '../lib/exchangeRateCache'

/**
 * PayPal 결제 처리
 * @param {number} total - 총 결제 금액 (KRW)
 * @param {function} setLoading - 로딩 상태 설정 함수
 * @param {function} onSuccess - 성공 콜백
 * @param {function} onError - 에러 콜백
 */
export const processPayPalPayment = async (total, setLoading, onSuccess, onError) => {
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

    // PayPal 결제 페이지로 리다이렉트
    const paypalUrl = `https://www.sandbox.paypal.com/checkoutnow?token=${order.id}`
    window.open(paypalUrl, '_blank', 'width=600,height=600,scrollbars=yes,resizable=yes')
    
    // 성공 콜백 호출 (필요한 경우)
    if (onSuccess) {
      onSuccess(order)
    }
    
  } catch (error) {
    console.error('Error processing PayPal payment:', error)
    if (onError) {
      onError(error)
    } else {
      alert(`PayPal 결제 시작 실패: ${error.message}`)
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
    
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to place order')
    }

    const order = await response.json()
    
    if (onSuccess) {
      onSuccess(order)
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
      await processPayPalPayment(total, setLoading, onSuccess, onError)
      break
    case 'card':
    default:
      await processCardPayment(orderData, setLoading, onSuccess, onError)
      break
  }
}
