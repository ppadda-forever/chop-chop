'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getMenuItemById } from '../../../services/clientApi'
import { useCart } from '../../../contexts/CartContext'
import Header from '../../../components/Header'
import BottomNavigation from '../../../components/BottomNavigation'

export default function MenuOption() {
  const { id } = useParams()
  const router = useRouter()
  const { addToCart } = useCart()
  const [menuItem, setMenuItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedOptions, setSelectedOptions] = useState({})
  const [quantity, setQuantity] = useState(1)

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
            initialOptions[option.id] = option.id
          }
          if (option.isRequired && option.type === 'SPICY') {
            initialOptions[option.id] = option.id
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
        <p className="text-chop-brown">Loading...</p>
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
      
      // For single-select options (SIZE, SPICY), replace the previous selection
      if (optionType === 'SIZE' || optionType === 'SPICY') {
        // Remove previous selection of the same type
        Object.keys(newOptions).forEach(key => {
          const option = menuItem.menuOptions.find(opt => opt.id === key)
          if (option && option.type === optionType) {
            delete newOptions[key]
          }
        })
        newOptions[optionId] = optionId
      } else {
        // For multi-select options (ADDITIONAL), toggle
        if (newOptions[optionId]) {
          delete newOptions[optionId]
        } else {
          newOptions[optionId] = optionId
        }
      }
      
      return newOptions
    })
  }

  const calculatePrice = () => {
    let totalPrice = menuItem.basePrice
    
    // Add selected options prices
    Object.keys(selectedOptions).forEach(optionId => {
      const option = menuItem.menuOptions.find(opt => opt.id === optionId)
      if (option) {
        totalPrice += option.price
      }
    })
    
    return totalPrice * quantity
  }

  const handleAddToCart = () => {
    addToCart(menuItem, selectedOptions, quantity)
    router.back() // Go back to menu
  }

  return (
    <div className="bg-chop-cream min-h-screen flex flex-col">
      <Header title={menuItem.restaurant.name} showBackButton={true} />
      
      <div className="flex-1">
        {/* Menu Item Hero Image */}
        <div 
          className="h-64 bg-cover bg-center"
          style={{ backgroundImage: `url(${menuItem.image})` }}
        />

        {/* Menu Item Title */}
        <div className="px-4 py-5">
          <h1 className="text-xl font-bold text-chop-brown mb-2 font-jakarta">
            {menuItem.name}
          </h1>
          <p className="text-chop-brown text-base">
            {menuItem.description}
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
                            <span className="text-chop-brown text-base">{option.name}</span>
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
                          {option.name}
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
        <div className="bg-chop-cream h-14 flex items-center justify-between px-4">
          <span className="text-chop-brown text-base">Quantity</span>
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

      {/* Add to Cart Button */}
      <div className="px-4 py-3 bg-chop-cream">
        <button 
          onClick={handleAddToCart}
          className="w-full bg-chop-orange text-white py-3 rounded-lg font-bold text-base hover:bg-orange-600 transition-colors"
        >
          Add to Cart (₩{calculatePrice().toLocaleString()})
        </button>
      </div>

      <BottomNavigation />
    </div>
  )
}
