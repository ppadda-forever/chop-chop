'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '../../contexts/CartContext'
import Header from '../../components/Header'
import BottomNavigation from '../../components/BottomNavigation'

export default function Checkout() {
  const router = useRouter()
  const { items, getTotalPrice, getCartItemsByRestaurant, clearCart } = useCart()
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [notes, setNotes] = useState('')
  
  const cartGroups = getCartItemsByRestaurant()
  const subtotal = getTotalPrice()
  const deliveryFee = 3000
  const total = subtotal + deliveryFee

  const handleOrder = () => {
    // Order logic here
    console.log('Order placed:', {
      items,
      paymentMethod,
      deliveryAddress,
      notes,
      total
    })
    clearCart() // Clear cart after successful order
    router.push('/checkout-confirmation')
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
          <textarea
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            placeholder="Enter your delivery address..."
            className="w-full p-3 border border-chop-border rounded-lg text-chop-brown"
            rows={3}
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

      {/* Place Order Button */}
      <div className="px-4 py-3 bg-chop-cream border-t border-chop-border">
        <button 
          onClick={handleOrder}
          className="w-full bg-chop-orange text-white py-3 rounded-lg font-bold text-base hover:bg-orange-600 transition-colors"
        >
          Place Order (₩{total.toLocaleString()})
        </button>
      </div>

      <BottomNavigation />
    </div>
  )
}
