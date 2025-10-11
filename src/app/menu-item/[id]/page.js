'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getMenuItemById } from '../../../services/clientApi'
import { useCart } from '../../../contexts/CartContext'
import Header from '../../../components/Header'
import BottomNavigation from '../../../components/BottomNavigation'
import { useLanguage } from '../../../contexts/LanguageContext'
import { getTranslatedField, t } from '../../../utils/translation'

export default function MenuOption() {
  const { id } = useParams()
  const router = useRouter()
  const { addToCart, clearCart, checkRestaurantRestriction } = useCart()
  const [menuItem, setMenuItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedOptions, setSelectedOptions] = useState({})
  const [quantity, setQuantity] = useState(1)
  const [showRestaurantWarning, setShowRestaurantWarning] = useState(false)
  const { currentLanguage } = useLanguage()

  useEffect(() => {
    const fetchMenuItem = async () => {
      try {
        setLoading(true)
        const data = await getMenuItemById(id)
        setMenuItem(data)
        
        // Initialize selected options with default values
        const initialOptions = {}
        data.menuOptions.forEach(option => {
          if (option.isRequired && option.type === 'SIZE') {
            initialOptions[option.id] = option
          }
          if (option.isRequired && option.type === 'SPICY') {
            initialOptions[option.id] = option
          }
        })
        setSelectedOptions(initialOptions)
      } catch (error) {
        console.error('Error fetching menu item:', error)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchMenuItem()
    }
  }, [id])

  if (loading) {
    return (
      <div className="bg-chop-cream min-h-screen flex items-center justify-center">
        <p className="text-chop-brown">{t('common', 'loading', currentLanguage)}</p>
      </div>
    )
  }

  if (!menuItem) {
    return (
      <div className="bg-chop-cream min-h-screen flex items-center justify-center">
        <p className="text-chop-brown">Menu item not found</p>
      </div>
    )
  }

  const handleOptionChange = (optionId, optionType) => {
    setSelectedOptions(prev => {
      const newOptions = { ...prev }
      const option = menuItem.menuOptions.find(opt => opt.id === optionId)
      
      // For single-select options (SIZE, SPICY), replace the previous selection
      if (optionType === 'SIZE' || optionType === 'SPICY') {
        // Remove previous selection of the same type
        Object.keys(newOptions).forEach(key => {
          const existingOption = menuItem.menuOptions.find(opt => opt.id === key)
          if (existingOption && existingOption.type === optionType) {
            delete newOptions[key]
          }
        })
        newOptions[optionId] = option
      } else {
        // For multi-select options (ADDITIONAL), toggle
        if (newOptions[optionId]) {
          delete newOptions[optionId]
        } else {
          newOptions[optionId] = option
        }
      }
      
      return newOptions
    })
  }

  const calculatePrice = () => {
    let totalPrice = menuItem.basePrice
    
    // Add selected options prices
    Object.values(selectedOptions).forEach(option => {
      if (option && option.price) {
        totalPrice += option.price
      }
    })
    
    return totalPrice * quantity
  }

  const handleAddToCart = () => {
    // Check restaurant restriction when user tries to add to cart
    const restaurantRestriction = checkRestaurantRestriction(menuItem)
    
    if (!restaurantRestriction.isValid) {
      // Show warning message
      setShowRestaurantWarning(true)
    } else {
      // Add to cart and go back
      addToCart(menuItem, selectedOptions, quantity)
      router.back()
    }
  }

  const handleConfirmClearCart = () => {
    clearCart()
    addToCart(menuItem, selectedOptions, quantity)
    setShowRestaurantWarning(false)
    router.back()
  }

  const handleCancelWarning = () => {
    setShowRestaurantWarning(false)
  }

  return (
    <div className="bg-chop-cream min-h-screen flex flex-col">
      <Header title={getTranslatedField(menuItem.restaurant, 'name', currentLanguage)} showBackButton={true} />
      
      <div className="flex-1">
        {/* Menu Item Hero Image */}
        <div 
          className="h-64 bg-cover bg-center"
          style={{ backgroundImage: `url(${menuItem.image})` }}
        />

        {/* Menu Item Title */}
        <div className="px-4 py-5">
          <h1 className="text-xl font-bold text-chop-brown mb-2 font-jakarta">
            {getTranslatedField(menuItem, 'name', currentLanguage)}
          </h1>
          <p className="text-chop-brown text-base">
            {getTranslatedField(menuItem, 'description', currentLanguage)}
          </p>
        </div>

        {/* Dynamic Options based on menuOptions */}
        {menuItem.menuOptions && menuItem.menuOptions.length > 0 && (
          <div className="px-4 py-4">
            {['SIZE', 'SPICY', 'ADDITIONAL'].map(optionType => {
              const optionsOfType = menuItem.menuOptions.filter(option => option.type === optionType)
              if (optionsOfType.length === 0) return null

              return (
                <div key={optionType} className="mb-6">
                  <h2 className="text-lg font-bold text-chop-brown mb-4 font-jakarta">
                    {optionType === 'SIZE' ? 'Size' : 
                     optionType === 'SPICY' ? 'Spice Level' : 
                     'Add-ons'}
                  </h2>
                  
                  {optionType === 'ADDITIONAL' ? (
                    // Multi-select for additional options
                    <div className="space-y-3">
                      {optionsOfType.map((option) => (
                        <div key={option.id} className="flex items-center justify-between py-3">
                          <div className="flex-1">
                            <span className="text-chop-brown text-base">{getTranslatedField(option, 'name', currentLanguage)}</span>
                            {option.price > 0 && (
                              <span className="text-chop-orange text-sm ml-2">
                                +₩{option.price.toLocaleString()}
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => handleOptionChange(option.id, option.type)}
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                              selectedOptions[option.id]
                                ? 'bg-chop-orange border-chop-orange'
                                : 'border-chop-border bg-white'
                            }`}
                          >
                            {selectedOptions[option.id] && (
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    // Single-select for size and spice options
                    <div className="flex gap-3 flex-wrap">
                      {optionsOfType.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => handleOptionChange(option.id, option.type)}
                          className={`px-4 py-3 rounded-lg border text-sm font-medium transition-colors ${
                            selectedOptions[option.id]
                              ? 'border-chop-orange bg-chop-orange text-white'
                              : 'border-chop-border bg-white text-chop-brown'
                          }`}
                        >
                          {getTranslatedField(option, 'name', currentLanguage)}
                          {option.price > 0 && (
                            <span className="ml-1">+₩{option.price.toLocaleString()}</span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Quantity Selector */}
        <div className="px-4 py-4">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-chop-brown mb-4 font-jakarta">
              {t('menuItem', 'quantity', currentLanguage)}
            </h2>
          <div className="bg-chop-cream h-14 flex items-center justify-between px-4">
            <span></span>
            <div className="flex items-center gap-2">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-7 h-7 rounded-full bg-chop-border flex items-center justify-center text-chop-brown font-medium"
            >
              -
            </button>
            <span className="w-4 text-center text-chop-brown font-medium">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-7 h-7 rounded-full bg-chop-border flex items-center justify-center text-chop-brown font-medium"
            >
              +
            </button>
            </div>
          </div>
          </div>
        </div>
      </div>

      {/* Restaurant Restriction Warning - Only show when user tries to add */}
      {showRestaurantWarning && (
        <div className="px-4 py-3 bg-yellow-50 border-t border-yellow-200">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <p className="text-sm text-yellow-800 font-medium mb-3">
                You can only order from one restaurant at a time. Clear your cart to order from "{menuItem?.restaurant?.name}".
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleConfirmClearCart}
                  className="px-4 py-2 bg-chop-orange text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors"
                >
                  Clear Cart & Add Item
                </button>
                <button
                  onClick={handleCancelWarning}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add to Cart Button */}
      <div className="px-4 py-3 bg-chop-cream">
        <button 
          onClick={handleAddToCart}
          className="w-full bg-chop-orange text-white py-3 rounded-lg font-bold text-base hover:bg-orange-600 transition-colors"
        >
          {t('menuItem', 'addToCart', currentLanguage)} (₩{calculatePrice().toLocaleString()})
        </button>
      </div>

      <BottomNavigation />
    </div>
  )
}
