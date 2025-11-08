'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '../../contexts/CartContext'
import Header from '../../components/Header'
import BottomNavigation from '../../components/BottomNavigation'
import { analytics } from '../../utils/analytics'
import { processPayment } from '../../services/paymentService'
import { useLanguage } from '../../contexts/LanguageContext'
import { getTranslatedField, t } from '../../utils/translation'

// 모든 결제 수단 정의
const ALL_PAYMENT_METHODS = {
  card: {
    id: 'card',
    name: 'Credit Card',
    description: 'Visa, Mastercard, etc.',
    requiresExchange: false,
  },
  paypal: {
    id: 'paypal',
    name: 'PayPal',
    description: 'Secure payment with PayPal',
    requiresExchange: true,
    logo: (
      <svg xmlns="http://www.w3.org/2000/svg" width="124" height="33" viewBox="0 0 124 33" fill="none">
        <path d="M46.211 6.74902H39.372C38.904 6.74902 38.506 7.08902 38.433 7.55102L35.667 25.088C35.612 25.434 35.88 25.746 36.231 25.746H39.496C39.964 25.746 40.362 25.406 40.435 24.943L41.181 20.213C41.253 19.75 41.652 19.41 42.119 19.41H44.284C48.789 19.41 51.389 17.23 52.068 12.91C52.374 11.02 52.081 9.53502 51.196 8.49502C50.224 7.35302 48.5 6.74902 46.211 6.74902ZM47 13.154C46.626 15.608 44.751 15.608 42.938 15.608H41.906L42.63 11.025C42.673 10.748 42.913 10.544 43.193 10.544H43.666C44.901 10.544 46.066 10.544 46.668 11.248C47.027 11.668 47.137 12.292 47 13.154Z" fill="#253B80"/>
        <path d="M66.654 13.075H63.379C63.1 13.075 62.859 13.279 62.816 13.556L62.671 14.472L62.442 14.14C61.733 13.111 60.152 12.767 58.574 12.767C54.955 12.767 51.864 15.508 51.262 19.353C50.949 21.271 51.394 23.105 52.482 24.384C53.48 25.56 54.908 26.05 56.607 26.05C59.523 26.05 61.14 24.175 61.14 24.175L60.994 25.085C60.939 25.433 61.207 25.745 61.556 25.745H64.506C64.975 25.745 65.371 25.405 65.445 24.942L67.215 13.733C67.271 13.388 67.004 13.075 66.654 13.075ZM62.089 19.449C61.773 21.32 60.288 22.576 58.394 22.576C57.443 22.576 56.683 22.271 56.195 21.693C55.711 21.119 55.527 20.302 55.681 19.392C55.976 17.537 57.486 16.24 59.351 16.24C60.281 16.24 61.037 16.549 61.535 17.132C62.034 17.721 62.232 18.543 62.089 19.449Z" fill="#253B80"/>
        <path d="M84.096 13.075H80.805C80.491 13.075 80.196 13.231 80.018 13.492L75.479 20.178L73.555 13.753C73.434 13.351 73.063 13.075 72.643 13.075H69.409C69.016 13.075 68.743 13.459 68.868 13.829L72.493 24.467L69.085 29.278C68.817 29.657 69.087 30.178 69.55 30.178H72.837C73.149 30.178 73.441 30.026 73.618 29.77L84.564 13.97C84.826 13.592 84.557 13.075 84.096 13.075Z" fill="#253B80"/>
        <path d="M94.992 6.74902H88.152C87.685 6.74902 87.287 7.08902 87.214 7.55102L84.448 25.088C84.393 25.434 84.661 25.746 85.01 25.746H88.52C88.846 25.746 89.125 25.508 89.176 25.184L89.961 20.213C90.033 19.75 90.432 19.41 90.899 19.41H93.063C97.569 19.41 100.168 17.23 100.848 12.91C101.155 11.02 100.86 9.53502 99.975 8.49502C99.004 7.35302 97.281 6.74902 94.992 6.74902ZM95.781 13.154C95.408 15.608 93.533 15.608 91.719 15.608H90.688L91.413 11.025C91.456 10.748 91.694 10.544 91.975 10.544H92.448C93.682 10.544 94.848 10.544 95.45 11.248C95.809 11.668 95.918 12.292 95.781 13.154Z" fill="#179BD7"/>
        <path d="M115.434 13.075H112.161C111.88 13.075 111.641 13.279 111.599 13.556L111.454 14.472L111.224 14.14C110.515 13.111 108.935 12.767 107.357 12.767C103.738 12.767 100.648 15.508 100.046 19.353C99.7339 21.271 100.177 23.105 101.265 24.384C102.265 25.56 103.691 26.05 105.39 26.05C108.306 26.05 109.923 24.175 109.923 24.175L109.777 25.085C109.722 25.433 109.99 25.745 110.341 25.745H113.29C113.757 25.745 114.155 25.405 114.228 24.942L115.999 13.733C116.053 13.388 115.785 13.075 115.434 13.075ZM110.869 19.449C110.555 21.32 109.068 22.576 107.174 22.576C106.225 22.576 105.463 22.271 104.975 21.693C104.491 21.119 104.309 20.302 104.461 19.392C104.758 17.537 106.266 16.24 108.131 16.24C109.061 16.24 109.817 16.549 110.315 17.132C110.816 17.721 111.014 18.543 110.869 19.449Z" fill="#179BD7"/>
        <path d="M119.295 7.23005L116.488 25.088C116.433 25.434 116.701 25.746 117.05 25.746H119.872C120.341 25.746 120.739 25.406 120.811 24.943L123.579 7.40705C123.634 7.06105 123.366 6.74805 123.017 6.74805H119.857C119.578 6.74905 119.338 6.95305 119.295 7.23005Z" fill="#179BD7"/>
        <path d="M7.26604 29.154L7.78904 25.832L6.62404 25.805H1.06104L4.92704 1.29205C4.93904 1.21805 4.97804 1.14905 5.03504 1.10005C5.09204 1.05105 5.16504 1.02405 5.24104 1.02405H14.621C17.735 1.02405 19.884 1.67205 21.006 2.95105C21.532 3.55105 21.867 4.17805 22.029 4.86805C22.199 5.59205 22.202 6.45705 22.036 7.51205L22.024 7.58905V8.26505L22.55 8.56305C22.993 8.79805 23.345 9.06705 23.615 9.37505C24.065 9.88805 24.356 10.54 24.479 11.313C24.606 12.108 24.564 13.054 24.356 14.125C24.116 15.357 23.728 16.43 23.204 17.308C22.722 18.117 22.108 18.788 21.379 19.308C20.683 19.802 19.856 20.177 18.921 20.417C18.015 20.653 16.982 20.772 15.849 20.772H15.119C14.597 20.772 14.09 20.96 13.692 21.297C13.293 21.641 13.029 22.111 12.948 22.625L12.893 22.924L11.969 28.779L11.927 28.994C11.916 29.062 11.897 29.096 11.869 29.119C11.844 29.14 11.808 29.154 11.773 29.154H7.26604Z" fill="#253B80"/>
        <path d="M23.048 7.66699C23.02 7.84599 22.988 8.02899 22.952 8.21699C21.715 14.568 17.483 16.762 12.078 16.762H9.32602C8.66502 16.762 8.10802 17.242 8.00502 17.894L6.59602 26.83L6.19702 29.363C6.13002 29.791 6.46002 30.177 6.89202 30.177H11.773C12.351 30.177 12.842 29.757 12.933 29.187L12.981 28.939L13.9 23.107L13.959 22.787C14.049 22.215 14.541 21.795 15.119 21.795H15.849C20.578 21.795 24.28 19.875 25.362 14.319C25.814 11.998 25.58 10.06 24.384 8.69699C24.022 8.28599 23.573 7.94499 23.048 7.66699Z" fill="#179BD7"/>
        <path d="M21.754 7.15103C21.565 7.09603 21.37 7.04603 21.17 7.00103C20.969 6.95703 20.763 6.91803 20.551 6.88403C19.809 6.76403 18.996 6.70703 18.125 6.70703H10.773C10.592 6.70703 10.42 6.74803 10.266 6.82203C9.927 6.98503 9.67501 7.30603 9.61401 7.69903L8.05 17.605L8.005 17.894C8.108 17.242 8.665 16.762 9.326 16.762H12.078C17.483 16.762 21.715 14.567 22.952 8.21703C22.989 8.02903 23.02 7.84603 23.048 7.66703C22.735 7.50103 22.396 7.35903 22.031 7.23803C21.941 7.20803 21.848 7.17903 21.754 7.15103Z" fill="#222D65"/>
        <path d="M9.61399 7.699C9.67499 7.306 9.92699 6.985 10.266 6.823C10.421 6.749 10.592 6.708 10.773 6.708H18.125C18.996 6.708 19.809 6.765 20.551 6.885C20.763 6.919 20.969 6.958 21.17 7.002C21.37 7.047 21.565 7.097 21.754 7.152C21.848 7.18 21.941 7.209 22.032 7.238C22.397 7.359 22.736 7.502 23.049 7.667C23.417 5.32 23.046 3.722 21.777 2.275C20.378 0.682 17.853 0 14.622 0H5.24199C4.58199 0 4.01899 0.48 3.91699 1.133L0.00998882 25.898C-0.0670112 26.388 0.310989 26.83 0.804989 26.83H6.59599L8.04999 17.605L9.61399 7.699Z" fill="#253B80"/>
      </svg>
    )
  }
}

// 환경에 따라 결제 수단 필터링
// development: card + paypal
// production: paypal만
const getPaymentMethodsByEnvironment = () => {
  const isDevelopment = process.env.NODE_ENV === 'development'
  
  if (isDevelopment) {
    // 개발 환경: 모든 결제 수단
    return ALL_PAYMENT_METHODS
  } else {
    // 프로덕션 환경: PayPal만
    return {
      paypal: ALL_PAYMENT_METHODS.paypal
    }
  }
}

// 결제 수단별 설정
const PAYMENT_METHODS = getPaymentMethodsByEnvironment()

export default function Checkout() {
  const router = useRouter()
  const { currentLanguage } = useLanguage()
  const { items, getTotalPrice, getCartItemsByRestaurant, clearCart, checkMinOrderAmount } = useCart()
  // 첫 번째 사용 가능한 결제 수단을 기본값으로 설정 (dev: card, prod: paypal)
  const [paymentMethod, setPaymentMethod] = useState(Object.keys(PAYMENT_METHODS)[0])
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [notes, setNotes] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [accommodation, setAccommodation] = useState(null)
  const [exchangeRate, setExchangeRate] = useState(null)
  const [usdAmount, setUsdAmount] = useState(0)
  
  const cartGroups = getCartItemsByRestaurant()
  const subtotal = getTotalPrice()
  const deliveryFee = 3000
  const total = subtotal + deliveryFee
  const minOrderCheck = checkMinOrderAmount()

  useEffect(() => {
    // sessionStorage에서 숙소 정보 확인하고 주소 자동 입력
    const savedAccommodation = sessionStorage.getItem('accommodation')
    if (savedAccommodation) {
      const accommodationData = JSON.parse(savedAccommodation)
      setAccommodation(accommodationData)
      // 언어에 맞는 주소 설정
      const address = currentLanguage === 'ko' 
        ? accommodationData.address 
        : (accommodationData.addressEn || accommodationData.address)
      setDeliveryAddress(address)
    }
    // 체크아웃 방문 추적 (세션+숙소 기준 최초 1회)
    analytics.trackCheckoutViewOncePerSessionPerAccommodation()
  }, [currentLanguage])

  useEffect(() => {
    // 환율이 필요한 결제 수단인 경우 환율 조회
    const currentPaymentMethod = PAYMENT_METHODS[paymentMethod]
    if (currentPaymentMethod?.requiresExchange) {
      fetchExchangeRate()
    }
  }, [paymentMethod, total])

  // PayPal 리다이렉트 방식으로 변경했으므로 메시지 리스너 제거됨

  const fetchExchangeRate = async () => {
    try {
      const { getCachedExchangeRate } = await import('../../lib/exchangeRateCache')
      const rate = await getCachedExchangeRate()
      setExchangeRate(rate)
      
      // KRW를 USD로 변환
      const converted = (total * rate.krwToUsd).toFixed(2)
      setUsdAmount(parseFloat(converted))
    } catch (error) {
      console.error('Failed to fetch exchange rate:', error)
      // 폴백: 고정 환율 사용
      const fallbackRate = 1300
      const converted = (total / fallbackRate).toFixed(2)
      setUsdAmount(parseFloat(converted))
    }
  }

  // 주문 성공 처리
  const handleOrderSuccess = (order) => {
    // 주문 완료 추적
    analytics.trackOrderComplete(order.id, total)
    clearCart() // Clear cart after successful order
    router.push(`/checkout-confirmation?orderId=${encodeURIComponent(order.id)}`)
  }

  // 주문 실패 처리
  const handleOrderError = (error) => {
    console.error('Order failed:', error)
    alert(`Order failed: ${error.message}`)
  }

  // 결제 처리
  const handlePayment = async () => {
    // 최소 주문 금액 체크
    const minOrderCheck = checkMinOrderAmount()
    if (!minOrderCheck.isValid) {
      alert(minOrderCheck.message)
      return
    }

    analytics.trackOrderPlaceClick(total) // 버튼 클릭 시점 추적

    // 주문 데이터 준비
    const orderData = {
      items,
      paymentMethod,
      notes,
      total,
      deliveryFee,
      accommodationId: accommodation?.id || null,
    }

    // 결제 처리
    await processPayment(
      paymentMethod,
      orderData,
      total,
      setIsLoading,
      handleOrderSuccess,
      handleOrderError
    )
  }

  // 결제 수단별 색상 클래스
  const getPaymentMethodColor = (methodId) => {
    return {
      border: 'border-chop-orange',
      bg: 'bg-orange-50',
      hover: 'hover:border-orange-300'
    }
  }

  return (
    <div className="bg-chop-cream min-h-screen flex flex-col">
      <Header title={t('checkout', 'title', currentLanguage)} showBackButton={true} />
      
      <div className="flex-1 px-4 py-5 pb-56">
        {/* Order Summary */}
        <div className="bg-white rounded-lg p-4 mb-4">
          <h2 className="text-lg font-bold text-chop-brown mb-3 font-jakarta">
            {t('checkout', 'orderSummary', currentLanguage)}
          </h2>
          
          {/* Cart Items */}
          <div className="space-y-3 mb-4">
            {cartGroups.map((group) => (
              <div key={group.restaurant.id}>
                <h3 className="font-medium text-chop-brown text-sm mb-2">
                  {getTranslatedField(group.restaurant, 'name', currentLanguage)}
                </h3>
                {group.items.map((item) => (
                  <div key={item.cartId} className="flex justify-between text-sm text-chop-gray ml-2">
                    <span>{getTranslatedField(item, 'name', currentLanguage)} x{item.quantity}</span>
                    <span>₩{(item.totalPrice * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
          
          <div className="space-y-2 border-t pt-3">
            <div className="flex justify-between">
              <span className="text-chop-brown">{t('cart', 'subtotal', currentLanguage)}</span>
              <span className="text-chop-brown">₩{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-chop-brown">{t('cart', 'deliveryFee', currentLanguage)}</span>
              <span className="text-chop-brown">₩{deliveryFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span className="text-chop-brown">{t('cart', 'total', currentLanguage)}</span>
              <span className="text-chop-orange">₩{total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="bg-white rounded-lg p-4 mb-4">
          <h2 className="text-lg font-bold text-chop-brown mb-3 font-jakarta">
            {t('checkout', 'deliveryInfo', currentLanguage)}
          </h2>
          {accommodation && (
            <div className="mb-2 p-2 bg-chop-cream rounded-lg">
              <p className="text-sm text-chop-brown">
                <strong>{currentLanguage === 'ko' ? accommodation.name : (accommodation.nameEn || accommodation.name)}</strong> - Address auto-filled from QR scan
              </p>
            </div>
          )}
          <textarea
            value={deliveryAddress}
            onChange={(e) => accommodation ? null : setDeliveryAddress(e.target.value)}
            placeholder={accommodation ? "Address auto-filled from accommodation" : "Enter your delivery address..."}
            className={`w-full p-3 border border-chop-border rounded-lg text-chop-brown ${
              accommodation ? 'bg-gray-100 cursor-not-allowed' : ''
            }`}
            rows={3}
            disabled={!!accommodation}
          />
        </div>

        {/* Special Instructions */}
        <div className="bg-white rounded-lg p-4 mb-4">
          <h2 className="text-lg font-bold text-chop-brown mb-3 font-jakarta">
            {t('checkout', 'specialInstructions', currentLanguage)}
          </h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t('checkout', 'specialInstructionsPlaceholder', currentLanguage)}
            className="w-full p-3 border border-chop-border rounded-lg text-chop-brown"
            rows={3}
          />
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-lg p-4 mb-4">
          <h2 className="text-lg font-bold text-chop-brown mb-3 font-jakarta">
            {t('checkout', 'paymentMethod', currentLanguage)}
          </h2>
          <div className="space-y-3">
            {Object.values(PAYMENT_METHODS).map((method) => {
              const colors = getPaymentMethodColor(method.id)
              const isSelected = paymentMethod === method.id
              
              return (
                <label 
                  key={method.id}
                  className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                    isSelected 
                      ? `${colors.border} ${colors.bg} shadow-md` 
                      : `border-gray-200 ${colors.hover} hover:shadow-sm`
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method.id}
                    checked={isSelected}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-4 w-4 h-4"
                  />
                  <div className="flex items-center">
                    <div>
                      <div className="text-chop-brown font-semibold">
                        {method.logo ? method.logo : method.name}
                      </div>
                    </div>
                  </div>
                </label>
              )
            })}
          </div>

          {/* 환율이 필요한 결제 수단의 환율 정보 표시 */}
          {PAYMENT_METHODS[paymentMethod]?.requiresExchange && (
            <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="text-xs text-orange-800">
                결제 금액: ₩{total.toLocaleString()} (약 ${usdAmount.toFixed(2)} USD)
                {exchangeRate && (
                  <span className="block mt-1">
                    환율: 1 USD = {(1/exchangeRate.krwToUsd).toLocaleString()} KRW
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fixed Place Order Button above BottomNavigation */}
      <div className="fixed bottom-20 left-0 right-0 bg-chop-cream border-t border-chop-border z-20">
        {/* Minimum Order Warning */}
        {!minOrderCheck.isValid && items.length > 0 && (
          <div className="px-4 py-3 bg-yellow-50 border-b border-yellow-200">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">
                <p className="text-sm text-yellow-800 font-medium">
                  {minOrderCheck.message}
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="px-4 py-3">
          <button 
            onClick={handlePayment}
            disabled={
              isLoading || 
              items.length === 0 || 
              !minOrderCheck.isValid || 
              (PAYMENT_METHODS[paymentMethod]?.requiresExchange && !exchangeRate)
            }
            className="w-full bg-chop-orange text-white py-3 rounded-lg font-bold text-base hover:bg-orange-600 transition-colors disabled:bg-gray-400 shadow-lg"
          >
            {isLoading ? t('common', 'loading', currentLanguage) : 
             `${t('checkout', 'placeOrder', currentLanguage)} (₩${total.toLocaleString()})`}
          </button>
        </div>
      </div>

      <BottomNavigation />
    </div>
  )
}
