'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '../../contexts/CartContext'
import Header from '../../components/Header'
import BottomNavigation from '../../components/BottomNavigation'
import { useLanguage } from '../../contexts/LanguageContext'
import { getTranslatedField, t } from '../../utils/translation'

export default function Cart() {
  const router = useRouter()
  const { currentLanguage } = useLanguage()
  const { 
    items, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getTotalPrice, 
    getCartItemsByRestaurant 
  } = useCart()

  const cartGroups = getCartItemsByRestaurant()

  if (items.length === 0) {
    return (
      <div className="bg-chop-cream min-h-screen flex flex-col">
        <Header title={t('cart', 'title', currentLanguage)} showBackButton={true} />
        
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <span className="text-4xl">🛒</span>
          </div>
          <h2 className="text-xl font-bold text-chop-brown mb-2 font-jakarta">
            {t('cart', 'empty', currentLanguage)}
          </h2>
          <p className="text-chop-gray text-center mb-6">
            Add some delicious Korean food to get started!
          </p>
          <button 
            onClick={() => router.push('/restaurants')}
            className="bg-chop-orange text-white px-6 py-3 rounded-lg font-bold hover:bg-orange-600 transition-colors"
          >
            {t('cart', 'continueShopping', currentLanguage)}
          </button>
        </div>

        <BottomNavigation />
      </div>
    )
  }

  return (
    <div className="bg-chop-cream min-h-screen flex flex-col">
      <Header title={t('cart', 'title', currentLanguage)} showBackButton={true} />
      
      <div className="flex-1 px-4 py-5">
        {/* Cart Items by Restaurant */}
        <div className="space-y-6">
          {cartGroups.map((group) => (
            <div key={group.restaurant.id} className="bg-white rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-chop-brown font-jakarta">
                  {getTranslatedField(group.restaurant, 'name', currentLanguage)}
                </h2>
                <button
                  onClick={() => {
                    group.items.forEach(item => removeFromCart(item.cartId))
                  }}
                  className="text-chop-gray text-sm hover:text-chop-red"
                >
                  Remove all
                </button>
              </div>
              
              <div className="space-y-3">
                {group.items.map((item) => (
                  <div key={item.cartId} className="flex items-center gap-3">
                    <div 
                      className="w-16 h-16 rounded-lg bg-cover bg-center flex-shrink-0"
                      style={{ backgroundImage: `url(${item.image})` }}
                    />
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-chop-brown text-sm mb-1 font-jakarta">
                        {item.nameEn || item.nameJp || item.nameCn || item.name}
                      </h3>
                      
                      {/* Selected Options */}
                      {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                        <div className="text-xs text-chop-gray">
                          {Object.entries(item.selectedOptions).map(([optionId, option]) => {
                            if (option && option.name) {
                              return (
                                <div key={optionId} className="flex items-center gap-1">
                                  <span>•</span>
                                  <span>{getTranslatedField(option, 'name', currentLanguage)}</span>
                                  {option.price > 0 && (
                                    <span className="text-chop-orange">(+₩{option.price.toLocaleString()})</span>
                                  )}
                                </div>
                              )
                            }
                            return null
                          })}
                        </div>
                      )}
                      
                      <p className="text-chop-orange font-bold text-sm">
                        ₩{item.totalPrice.toLocaleString()}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                        className="w-7 h-7 rounded-full bg-chop-border flex items-center justify-center text-chop-brown font-medium"
                      >
                        -
                      </button>
                      <span className="w-6 text-center text-chop-brown font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                        className="w-7 h-7 rounded-full bg-chop-border flex items-center justify-center text-chop-brown font-medium"
                      >
                        +
                      </button>
                    </div>
                    
                    <button
                      onClick={() => removeFromCart(item.cartId)}
                      className="p-2 text-chop-gray hover:text-chop-red"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg p-4 mt-6">
          <h2 className="text-lg font-bold text-chop-brown mb-3 font-jakarta">
            {t('cart', 'subtotal', currentLanguage)}
          </h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-chop-brown">{t('cart', 'subtotal', currentLanguage)}</span>
              <span className="text-chop-brown">₩{getTotalPrice().toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-chop-brown">{t('cart', 'deliveryFee', currentLanguage)}</span>
              <span className="text-chop-brown">₩3,000</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span className="text-chop-brown">{t('cart', 'total', currentLanguage)}</span>
              <span className="text-chop-orange">₩{(getTotalPrice() + 3000).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Button */}
      <div className="px-4 py-3 bg-chop-cream border-t border-chop-border">
        <button 
          onClick={() => router.push('/checkout')}
          className="w-full bg-chop-orange text-white py-3 rounded-lg font-bold text-base hover:bg-orange-600 transition-colors"
        >
          {t('cart', 'proceedToCheckout', currentLanguage)} (₩{(getTotalPrice() + 3000).toLocaleString()})
        </button>
      </div>

      <BottomNavigation />
    </div>
  )
}
