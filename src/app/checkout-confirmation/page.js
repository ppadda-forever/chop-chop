'use client'

import React, { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Header from '../../components/Header'
import BottomNavigation from '../../components/BottomNavigation'
import { useLanguage } from '../../contexts/LanguageContext'
import { getTranslatedField, t } from '../../utils/translation'

function CheckoutConfirmationContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { currentLanguage } = useLanguage()
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
    return '35-55 minutes'
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
        <Header title={t('confirmation', 'title', currentLanguage)} showBackButton={false} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-chop-brown">{t('common', 'loading', currentLanguage)}</div>
        </div>
        <BottomNavigation />
      </div>
    )
  }

  // PayPal 결제 중인 경우
  if (isPayPalPayment && isPaymentProcessing && !isPaymentCompleted) {
    return (
      <div className="bg-chop-cream min-h-screen flex flex-col">
        <Header title={t('confirmation', 'paymentProcessing', currentLanguage)} showBackButton={false} />
        
        <div className="flex-1 px-4 py-5">
          {/* 결제 중 메시지 */}
          <div className="bg-white rounded-lg p-6 text-center mb-6">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-orange-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-chop-brown mb-2 font-jakarta">
              {t('confirmation', 'processingPayment', currentLanguage)}
            </h1>
            <p className="text-chop-gray mb-4">
              {t('confirmation', 'processingPaymentMessage', currentLanguage)}
            </p>
            <div className="text-sm text-chop-gray">
              {paymentStatus?.statusMessage || t('confirmation', 'checkingStatus', currentLanguage)}
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
                {t('confirmation', 'orderInfo', currentLanguage)}
              </h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-chop-brown">{t('confirmation', 'paymentMethod', currentLanguage)}</span>
                  <span className="text-chop-brown">PayPal</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-chop-brown">{t('confirmation', 'orderAmount', currentLanguage)}</span>
                  <span className="text-chop-brown">{formatPrice(orderInfo.subtotal || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-chop-brown">{t('cart', 'serviceFee', currentLanguage)}</span>
                  <span className="text-chop-brown">{formatPrice(orderInfo.serviceFee || 0)}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-chop-brown font-semibold">{t('confirmation', 'totalAmount', currentLanguage)}</span>
                  <span className="text-chop-orange font-bold">
                    {formatPrice(orderInfo.totalAmount || 0)}
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
      <Header title={t('confirmation', 'title', currentLanguage)} showBackButton={false} />
      
      <div className="flex-1 px-4 py-5 pb-56">
        {/* Success Message */}
        <div className="bg-white rounded-lg p-6 text-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-chop-brown mb-2 font-jakarta">
            {t('confirmation', 'title', currentLanguage)}
          </h1>
          <p className="text-chop-gray mb-4">
            {t('confirmation', 'success', currentLanguage)}
          </p>
          {orderId && (
            <p className="text-sm text-chop-gray">
              {t('confirmation', 'orderId', currentLanguage)}#{orderId.slice(-8)}
            </p>
          )}
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-lg p-4 mb-6">
          <h2 className="text-lg font-bold text-chop-brown mb-3 font-jakarta">
            {t('confirmation', 'orderSummary', currentLanguage)}
          </h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-chop-brown">{t('confirmation', 'estimatedDelivery', currentLanguage)}</span>
              <span className="text-chop-brown">{getDeliveryTimeEstimate()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-chop-brown">{t('checkout', 'paymentMethod', currentLanguage)}</span>
              <span className="text-chop-brown">
                {getPaymentMethodDisplay(orderInfo?.paymentMethod)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-chop-brown">{t('cart', 'subtotal', currentLanguage)}</span>
              <span className="text-chop-brown">
                {orderInfo ? formatPrice(orderInfo.subtotal) : '₩0'}
              </span>
            </div>
            {orderInfo && orderInfo.serviceFee && orderInfo.serviceFee > 0 && (
              <div className="flex justify-between">
                <span className="text-chop-brown">{t('cart', 'serviceFee', currentLanguage)}</span>
                <span className="text-chop-brown">{formatPrice(orderInfo.serviceFee)}</span>
              </div>
            )}
            <div className="flex justify-between border-t pt-2">
              <span className="text-chop-brown font-semibold">{t('cart', 'total', currentLanguage)}</span>
              <span className="text-chop-orange font-bold">
                {orderInfo ? formatPrice(orderInfo.totalAmount) : '₩0'}
              </span>
            </div>
          </div>
        </div>

        {/* Delivery Information */}
        {orderInfo && orderInfo.accommodation && (
          <div className="bg-white rounded-lg p-4 mb-6">
            <h2 className="text-lg font-bold text-chop-brown mb-3 font-jakarta">
              {t('checkout', 'deliveryInfo', currentLanguage)}
            </h2>
            <div className="space-y-2">
              <div>
                <span className="text-sm text-chop-gray">{t('checkout', 'location', currentLanguage)}:</span>
                <p className="text-chop-brown font-medium">
                  {currentLanguage === 'ko' 
                    ? orderInfo.accommodation.name 
                    : (orderInfo.accommodation.nameEn || orderInfo.accommodation.name)}
                </p>
              </div>
              <div>
                <span className="text-sm text-chop-gray">{t('checkout', 'address', currentLanguage)}:</span>
                <p className="text-chop-brown">{currentLanguage === 'ko' ? orderInfo.accommodation.address : (orderInfo.accommodation.addressEn || orderInfo.accommodation.address)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Special Notes */}
        {orderInfo && orderInfo.notes && (
          <div className="bg-white rounded-lg p-4 mb-6">
            <h2 className="text-lg font-bold text-chop-brown mb-3 font-jakarta">
              {t('checkout', 'specialInstructions', currentLanguage)}
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
                {t('confirmation', 'importantNotice', currentLanguage)}
              </h3>
              <p className="text-sm text-yellow-700">
                {t('confirmation', 'importantNoticeMessage', currentLanguage)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Action Buttons above BottomNavigation */}
      <div className="fixed bottom-20 left-0 right-0 px-4 py-3 bg-chop-cream border-t border-chop-border z-20">
        <div className="space-y-3">
          <button 
            onClick={() => router.push('/orders')}
            className="w-full bg-chop-orange text-white py-3 rounded-lg font-bold text-base hover:bg-orange-600 transition-colors shadow-lg"
          >
            {t('confirmation', 'viewOrderStatus', currentLanguage)}
          </button>
          <button 
            onClick={() => {
              // localStorage에서 주문 정보 제거 (선택사항)
              localStorage.removeItem('lastOrderInfo')
              router.push('/')
            }}
            className="w-full bg-white text-chop-brown py-3 rounded-lg font-bold text-base border border-chop-border hover:bg-gray-50 transition-colors"
          >
            {t('confirmation', 'continueShopping', currentLanguage)}
          </button>
        </div>
      </div>

      <BottomNavigation />
    </div>
  )
}

export default function CheckoutConfirmation() {
  const { currentLanguage } = useLanguage()
  return (
    <Suspense fallback={
      <div className="bg-chop-cream min-h-screen flex flex-col">
        <Header title={t('confirmation', 'title', currentLanguage)} showBackButton={false} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-chop-brown">{t('common', 'loading', currentLanguage)}</div>
        </div>
        <BottomNavigation />
      </div>
    }>
      <CheckoutConfirmationContent />
    </Suspense>
  )
}