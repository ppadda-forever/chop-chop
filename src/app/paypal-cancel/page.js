'use client'

import { useEffect } from 'react'

export default function PayPalCancel() {
  useEffect(() => {
    // 취소 메시지를 원래 페이지로 전송
    window.opener?.postMessage({
      type: 'PAYPAL_PAYMENT_CANCELLED'
    }, window.location.origin)
    
    // PayPal 창 닫기
    setTimeout(() => window.close(), 2000)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-yellow-500 text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">결제 취소됨</h1>
        <p className="text-gray-600 mb-4">결제가 취소되었습니다.</p>
        <p className="text-sm text-gray-500">이 창이 자동으로 닫힙니다...</p>
      </div>
    </div>
  )
}