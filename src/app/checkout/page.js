'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '../../contexts/CartContext'
import Header from '../../components/Header'
import BottomNavigation from '../../components/BottomNavigation'
import { analytics } from '../../utils/analytics'

export default function Checkout() {
  const router = useRouter()
  const { items, getTotalPrice, getCartItemsByRestaurant, clearCart, checkMinOrderAmount } = useCart()
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [notes, setNotes] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [accommodation, setAccommodation] = useState(null)
  
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
      setDeliveryAddress(accommodationData.address)
    }
    // 체크아웃 방문 추적 (세션+숙소 기준 최초 1회)
    analytics.trackCheckoutViewOncePerSessionPerAccommodation()
  }, [])

  const handleOrder = async () => {
    // 최소 주문 금액 체크
    const minOrderCheck = checkMinOrderAmount();
    if (!minOrderCheck.isValid) {
      alert(minOrderCheck.message);
      return;
    }

    analytics.trackOrderPlaceClick(total) // 버튼 클릭 시점 추적

    setIsLoading(true);
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          paymentMethod,
          notes,
          total,
          deliveryFee,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to place order');
      }

      // 주문 완료 추적
      const order = await response.json()
      analytics.trackOrderComplete(order.id, total)

      clearCart() // Clear cart after successful order
      router.push(`/checkout-confirmation?orderId=${encodeURIComponent(order.id)}`)
    } catch (error) {
      console.error('Order failed:', error);
      alert(`Order failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="bg-chop-cream min-h-screen flex flex-col">
      <Header title="Checkout" showBackButton={true} />
      
      <div className="flex-1 px-4 py-5">
        {/* Order Summary */}
        <div className="bg-white rounded-lg p-4 mb-4">
          <h2 className="text-lg font-bold text-chop-brown mb-3 font-jakarta">
            Order Summary
          </h2>
          
          {/* Cart Items */}
          <div className="space-y-3 mb-4">
            {cartGroups.map((group) => (
              <div key={group.restaurant.id}>
                <h3 className="font-medium text-chop-brown text-sm mb-2">
                  {group.restaurant.name}
                </h3>
                {group.items.map((item) => (
                  <div key={item.cartId} className="flex justify-between text-sm text-chop-gray ml-2">
                    <span>{item.name} x{item.quantity}</span>
                    <span>₩{(item.totalPrice * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
          
          <div className="space-y-2 border-t pt-3">
            <div className="flex justify-between">
              <span className="text-chop-brown">Subtotal</span>
              <span className="text-chop-brown">₩{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-chop-brown">Delivery Fee</span>
              <span className="text-chop-brown">₩{deliveryFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span className="text-chop-brown">Total</span>
              <span className="text-chop-orange">₩{total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-lg p-4 mb-4">
          <h2 className="text-lg font-bold text-chop-brown mb-3 font-jakarta">
            Payment Method
          </h2>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="radio"
                name="payment"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-3"
              />
              <span className="text-chop-brown">Credit Card</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="payment"
                value="cash"
                checked={paymentMethod === 'cash'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-3"
              />
              <span className="text-chop-brown">Cash on Delivery</span>
            </label>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="bg-white rounded-lg p-4 mb-4">
          <h2 className="text-lg font-bold text-chop-brown mb-3 font-jakarta">
            Delivery Address
          </h2>
          {accommodation && (
            <div className="mb-2 p-2 bg-chop-cream rounded-lg">
              <p className="text-sm text-chop-brown">
                <strong>{accommodation.name}</strong> - Address auto-filled from QR scan
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
            Special Instructions
          </h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any special instructions for your order..."
            className="w-full p-3 border border-chop-border rounded-lg text-chop-brown"
            rows={3}
          />
        </div>
      </div>

      {/* Minimum Order Warning */}
      {!minOrderCheck.isValid && items.length > 0 && (
        <div className="px-4 py-3 bg-yellow-50 border-t border-yellow-200">
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

      {/* Place Order Button */}
      <div className="px-4 py-3 bg-chop-cream border-t border-chop-border">
        <button 
          onClick={handleOrder}
          disabled={isLoading || items.length === 0 || !minOrderCheck.isValid}
          className="w-full bg-chop-orange text-white py-3 rounded-lg font-bold text-base hover:bg-orange-600 transition-colors disabled:bg-gray-400"
        >
          {isLoading ? 'Placing Order...' : `Place Order (₩${total.toLocaleString()})`}
        </button>
      </div>

      <BottomNavigation />
    </div>
  )
}
