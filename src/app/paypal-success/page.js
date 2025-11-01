'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createOrderAfterPayPalPayment } from '../../services/paymentService'
import { useCart } from '../../contexts/CartContext'

function PayPalSuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { clearCart } = useCart()
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
          // 결제 성공 - 주문 생성
          await createOrderAfterPayPalPayment(
            {
              orderID: result.orderID,
              captureID: result.captureID,
              amount: result.amount,
              status: 'COMPLETED'
            },
            setLoading,
            (order) => {
              // 주문 생성 성공 - 카트 비우기 및 확인 페이지로 이동
              clearCart()
              router.push(`/checkout-confirmation?orderId=${order.id}`)
            },
            (error) => {
              console.error('Order creation error:', error)
              setError(error.message)
            }
          )
        } else {
          throw new Error('Payment was not completed successfully')
        }
      } catch (error) {
        console.error('Payment processing error:', error)
        setError(error.message)
      }
    }

    processPayment()
  }, [searchParams, router])

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
      <div className="min-h-screen flex items-center justify-center bg-chop-cream">
        <div className="text-center px-4">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">결제 실패</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/checkout')}
            className="bg-chop-orange text-white px-6 py-3 rounded-lg font-bold hover:bg-orange-600 transition-colors"
          >
            다시 시도하기
          </button>
        </div>
      </div>
    )
  }

  return null // 성공 시 리다이렉트되므로 null 반환
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