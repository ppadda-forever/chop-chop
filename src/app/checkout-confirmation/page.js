'use client'

import React, { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Header from '../../components/Header'
import BottomNavigation from '../../components/BottomNavigation'

function CheckoutConfirmationContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')
  const token = searchParams.get('token')
  const payerId = searchParams.get('PayerID')
  
  const [orderCreated, setOrderCreated] = useState(false)
  const [orderData, setOrderData] = useState(null)

  useEffect(() => {
    // PayPal 결제 완료 후 주문 생성
    const createOrderFromPayPal = async () => {
      // PayPal 결제 완료 확인 (token과 PayerID가 있으면 PayPal 결제 완료)
      if (token && payerId && !orderCreated) {
        try {
          console.log('PayPal payment completed, creating order...', { token, payerId })
          
          // sessionStorage에서 주문 데이터 복원
          const savedOrderData = sessionStorage.getItem('pendingOrder')
          const savedAccommodation = sessionStorage.getItem('accommodation')
          
          if (!savedOrderData) {
            throw new Error('주문 데이터를 찾을 수 없습니다. 다시 주문해주세요.')
          }
          
          const orderData = JSON.parse(savedOrderData)
          const accommodation = savedAccommodation ? JSON.parse(savedAccommodation) : null
          
          // PayPal 결제 정보 추가
          const paymentDetails = {
            success: true,
            status: 'COMPLETED',
            orderID: token,
            captureID: payerId // PayerID를 captureID로 사용
          }
          
          // 주문 생성 API 호출
          const response = await fetch('/api/orders', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ...orderData,
              accommodationId: accommodation?.id || null,
              paymentDetails
            }),
          })
          
          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || '주문 생성에 실패했습니다.')
          }
          
          const createdOrder = await response.json()
          console.log('Order created successfully:', createdOrder.id)
          
          setOrderData(createdOrder)
          setOrderCreated(true)
          
          // 주문 생성 후 임시 데이터 정리
          sessionStorage.removeItem('pendingOrder')
          
        } catch (error) {
          console.error('Error creating order from PayPal:', error)
          alert('주문 생성에 실패했습니다: ' + error.message)
        }
      } else if (orderId) {
        // 이미 생성된 주문 ID가 있는 경우 (카드 결제 등)
        setOrderCreated(true)
        setOrderData({ id: orderId })
      }
    }
    
    createOrderFromPayPal()
  }, [token, payerId, orderId, orderCreated])


  return (
    <div className="bg-chop-cream min-h-screen flex flex-col">
      <Header title="Order Confirmed" showBackButton={false} />
      
      <div className="flex-1 px-4 py-5">
        {/* Success Message */}
        <div className="bg-white rounded-lg p-6 text-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-chop-brown mb-2 font-jakarta">
            Order Confirmed!
          </h1>
          <p className="text-chop-gray mb-4">
            Your order has been successfully placed and is being prepared.
          </p>
          {(orderData?.id || orderId) && (
            <p className="text-sm text-chop-gray">
              Order ID: #{(orderData?.id || orderId).slice(-8)}
            </p>
          )}
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-lg p-4 mb-6">
          <h2 className="text-lg font-bold text-chop-brown mb-3 font-jakarta">
            Order Details
          </h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-chop-brown">Estimated Delivery</span>
              <span className="text-chop-brown">25-35 minutes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-chop-brown">Payment Method</span>
              <span className="text-chop-brown">Credit Card</span>
            </div>
            <div className="flex justify-between">
              <span className="text-chop-brown">Total Amount</span>
              <span className="text-chop-orange font-bold">₩18,000</span>
            </div>
          </div>
        </div>

        {/* Warning Message */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-yellow-800 mb-1">
                Important Notice
              </h3>
              <p className="text-sm text-yellow-700">
                Please ensure someone is available to receive the order at the delivery address. 
                The delivery person will contact you when they arrive.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button 
            onClick={() => router.push('/orders')}
            className="w-full bg-chop-orange text-white py-3 rounded-lg font-bold text-base hover:bg-orange-600 transition-colors"
          >
            View Order Status
          </button>
          <button 
            onClick={() => router.push('/')}
            className="w-full bg-white text-chop-brown py-3 rounded-lg font-bold text-base border border-chop-border hover:bg-gray-50 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>

      <BottomNavigation />
    </div>
  )
}

export default function CheckoutConfirmation() {
  return (
    <Suspense fallback={
      <div className="bg-chop-cream min-h-screen flex flex-col">
        <Header title="Order Confirmed" showBackButton={false} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-chop-brown">Loading...</div>
        </div>
        <BottomNavigation />
      </div>
    }>
      <CheckoutConfirmationContent />
    </Suspense>
  )
}
