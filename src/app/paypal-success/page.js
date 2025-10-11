'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

function PayPalSuccessContent() {
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const processPayment = async () => {
      try {
        const orderID = searchParams.get('token')
        
        if (!orderID) {
          throw new Error('Order ID not found')
        }

        // PayPal 주문 캡처
        const response = await fetch('/api/paypal/capture-order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ orderID }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Payment capture failed')
        }

        const result = await response.json()
        
        if (result.success) {
          // 결제 성공 - 원래 페이지로 돌아가서 확인 페이지로 이동
          window.opener?.postMessage({
            type: 'PAYPAL_PAYMENT_SUCCESS',
            orderID: result.orderID,
            captureID: result.captureID,
            amount: result.amount
          }, window.location.origin)
          
          // PayPal 창 닫기
          window.close()
        } else {
          throw new Error('Payment was not completed successfully')
        }
      } catch (error) {
        console.error('Payment processing error:', error)
        setError(error.message)
        
        // 에러 메시지를 원래 페이지로 전송
        window.opener?.postMessage({
          type: 'PAYPAL_PAYMENT_ERROR',
          error: error.message
        }, window.location.origin)
        
        // PayPal 창 닫기
        setTimeout(() => window.close(), 2000)
      } finally {
        setLoading(false)
      }
    }

    processPayment()
  }, [searchParams])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">결제를 처리하고 있습니다...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">결제 실패</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">이 창이 자동으로 닫힙니다...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-green-500 text-6xl mb-4">✅</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">결제 성공!</h1>
        <p className="text-gray-600 mb-4">결제가 완료되었습니다.</p>
        <p className="text-sm text-gray-500">이 창이 자동으로 닫힙니다...</p>
      </div>
    </div>
  )
}

export default function PayPalSuccess() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    }>
      <PayPalSuccessContent />
    </Suspense>
  )
}