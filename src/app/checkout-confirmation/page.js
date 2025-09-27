'use client'

import React, { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Header from '../../components/Header'
import BottomNavigation from '../../components/BottomNavigation'

function CheckoutConfirmationContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')
  const paypalProcessing = searchParams.get('paypalProcessing') === 'true'
  const [orderInfo, setOrderInfo] = useState(null)
  const [paymentStatus, setPaymentStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [statusCheckInterval, setStatusCheckInterval] = useState(null)

  useEffect(() => {
    const fetchOrderInfo = async () => {
      if (orderId) {
        try {
          // API에서 실제 주문 정보 가져오기
          const response = await fetch(`/api/orders/${orderId}`)
          if (response.ok) {
            const orderData = await response.json()
            setOrderInfo(orderData)
          } else {
            console.error('Failed to fetch order info')
          }
        } catch (error) {
          console.error('Error fetching order info:', error)
        }
      } else {
        // orderId가 없는 경우 localStorage에서 fallback
        try {
          const savedOrderInfo = localStorage.getItem('lastOrderInfo')
          if (savedOrderInfo) {
            const parsedOrderInfo = JSON.parse(savedOrderInfo)
            setOrderInfo(parsedOrderInfo)
          }
        } catch (error) {
          console.error('Error parsing order info from localStorage:', error)
        }
      }
      setLoading(false)
    }

    fetchOrderInfo()
  }, [orderId])

  useEffect(() => {
    // orderId가 있으면 결제 상태 확인
    if (orderId) {
      checkPaymentStatus()
      
      // PayPal 결제인 경우 주기적으로 상태 확인
      const interval = setInterval(checkPaymentStatus, 3000) // 3초마다 확인
      setStatusCheckInterval(interval)
      
      return () => {
        if (interval) {
          clearInterval(interval)
        }
      }
    }
  }, [orderId])

  const checkPaymentStatus = async () => {
    if (!orderId) return
    
    try {
      // 주문 정보를 다시 가져와서 최신 결제 상태 확인
      const response = await fetch(`/api/orders/${orderId}`)
      if (response.ok) {
        const orderData = await response.json()
        setOrderInfo(orderData)
        setPaymentStatus({
          status: orderData.paymentStatus,
          isCompleted: orderData.paymentStatus === 'COMPLETED',
          isFailed: orderData.paymentStatus === 'FAILED'
        })
        
        // 결제가 완료되면 상태 확인 중단
        if (orderData.paymentStatus === 'COMPLETED' || orderData.paymentStatus === 'FAILED') {
          if (statusCheckInterval) {
            clearInterval(statusCheckInterval)
            setStatusCheckInterval(null)
          }
        }
      }
    } catch (error) {
      console.error('Error checking payment status:', error)
    }
  }

  const getPaymentMethodDisplay = (method) => {
    switch (method) {
      case 'paypal':
        return 'PayPal'
      case 'card':
        return 'Credit Card'
      default:
        return method || 'Credit Card'
    }
  }

  const getDeliveryTimeEstimate = () => {
    return '35-45 minutes'
  }

  const formatPrice = (price) => {
    return `₩${price.toLocaleString()}`
  }

  // 결제 처리 중인지 확인
  const isPaymentProcessing = paymentStatus?.isProcessing || false
  const isPaymentCompleted = paymentStatus?.isCompleted || false
  const isPayPalPayment = orderInfo?.paymentMethod === 'paypal'

  if (loading) {
    return (
      <div className="bg-chop-cream min-h-screen flex flex-col">
        <Header title="Order Confirmed" showBackButton={false} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-chop-brown">Loading...</div>
        </div>
        <BottomNavigation />
      </div>
    )
  }

  // PayPal 결제 중인 경우
  if (isPayPalPayment && isPaymentProcessing && !isPaymentCompleted) {
    return (
      <div className="bg-chop-cream min-h-screen flex flex-col">
        <Header title="Payment Processing" showBackButton={false} />
        
        <div className="flex-1 px-4 py-5">
          {/* 결제 중 메시지 */}
          <div className="bg-white rounded-lg p-6 text-center mb-6">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-orange-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-chop-brown mb-2 font-jakarta">
              결제 중입니다
            </h1>
            <p className="text-chop-gray mb-4">
              PayPal에서 결제를 처리하고 있습니다. 잠시만 기다려주세요.
            </p>
            <div className="text-sm text-chop-gray">
              {paymentStatus?.statusMessage || '결제 상태를 확인하는 중...'}
            </div>
          </div>

          {/* 로딩 인디케이터 */}
          <div className="bg-white rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>

          {/* 주문 정보 미리보기 */}
          {orderInfo && (
            <div className="bg-white rounded-lg p-4">
              <h2 className="text-lg font-bold text-chop-brown mb-3 font-jakarta">
                주문 정보
              </h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-chop-brown">결제 수단</span>
                  <span className="text-chop-brown">PayPal</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-chop-brown">주문 금액</span>
                  <span className="text-chop-brown">{formatPrice(orderInfo.totalAmount || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-chop-brown">배달비</span>
                  <span className="text-chop-brown">{formatPrice(orderInfo.deliveryFee || 0)}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-chop-brown font-semibold">총 금액</span>
                  <span className="text-chop-orange font-bold">
                    {formatPrice((orderInfo.totalAmount || 0) + (orderInfo.deliveryFee || 0))}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <BottomNavigation />
      </div>
    )
  }

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
          {orderId && (
            <p className="text-sm text-chop-gray">
              Order ID: #{orderId.slice(-8)}
            </p>
          )}
        </div>

        {/* Order Items */}
        {orderInfo && orderInfo.orderItems && orderInfo.orderItems.length > 0 && (
          <div className="bg-white rounded-lg p-4 mb-6">
            <h2 className="text-lg font-bold text-chop-brown mb-3 font-jakarta">
              Order Items
            </h2>
            <div className="space-y-4">
              {orderInfo.orderItems.map((orderItem, index) => (
                <div key={index} className="border-b border-gray-100 pb-3 last:border-b-0">
                  <div className="flex justify-between items-start">
                    <div className="text-right">
                      <div className="text-chop-brown font-semibold">
                        {formatPrice(orderItem.unitPrice * orderItem.quantity)}
                      </div>
                      <div className="text-sm text-chop-gray">
                        ₩{orderItem.unitPrice.toLocaleString()} × {orderItem.quantity}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Order Details */}
        <div className="bg-white rounded-lg p-4 mb-6">
          <h2 className="text-lg font-bold text-chop-brown mb-3 font-jakarta">
            Order Summary
          </h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-chop-brown">Estimated Delivery</span>
              <span className="text-chop-brown">{getDeliveryTimeEstimate()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-chop-brown">Payment Method</span>
              <span className="text-chop-brown">
                {getPaymentMethodDisplay(orderInfo?.paymentMethod)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-chop-brown">Subtotal</span>
              <span className="text-chop-brown">
                {orderInfo ? formatPrice(orderInfo.totalAmount) : '₩0'}
              </span>
            </div>
            {orderInfo && orderInfo.deliveryFee && orderInfo.deliveryFee > 0 && (
              <div className="flex justify-between">
                <span className="text-chop-brown">Delivery Fee</span>
                <span className="text-chop-brown">{formatPrice(orderInfo.deliveryFee)}</span>
              </div>
            )}
            <div className="flex justify-between border-t pt-2">
              <span className="text-chop-brown font-semibold">Total Amount</span>
              <span className="text-chop-orange font-bold">
                {orderInfo ? formatPrice((orderInfo.totalAmount || 0) + (orderInfo.deliveryFee || 0)) : '₩0'}
              </span>
            </div>
          </div>
        </div>

        {/* Delivery Information */}
        {orderInfo && orderInfo.accommodation && (
          <div className="bg-white rounded-lg p-4 mb-6">
            <h2 className="text-lg font-bold text-chop-brown mb-3 font-jakarta">
              Delivery Information
            </h2>
            <div className="space-y-2">
              <div>
                <span className="text-sm text-chop-gray">Location:</span>
                <p className="text-chop-brown font-medium">{orderInfo.accommodation.name}</p>
              </div>
              <div>
                <span className="text-sm text-chop-gray">Address:</span>
                <p className="text-chop-brown">{orderInfo.accommodation.address}</p>
              </div>
            </div>
          </div>
        )}

        {/* Special Notes */}
        {orderInfo && orderInfo.notes && (
          <div className="bg-white rounded-lg p-4 mb-6">
            <h2 className="text-lg font-bold text-chop-brown mb-3 font-jakarta">
              Special Instructions
            </h2>
            <p className="text-chop-brown">{orderInfo.notes}</p>
          </div>
        )}

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
            onClick={() => {
              // localStorage에서 주문 정보 제거 (선택사항)
              localStorage.removeItem('lastOrderInfo')
              router.push('/')
            }}
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