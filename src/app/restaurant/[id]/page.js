'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getRestaurantById } from '../../../services/clientApi'
import { useCart } from '../../../contexts/CartContext'
import Header from '../../../components/Header'
import BottomNavigation from '../../../components/BottomNavigation'
import { useLanguage } from '../../../contexts/LanguageContext'
import { getTranslatedField, t } from '../../../utils/translation'

export default function RestaurantMenu() {
  const { id } = useParams()
  const router = useRouter()
  const { addToCart, getTotalPrice } = useCart()
  const [restaurant, setRestaurant] = useState(null)
  const [loading, setLoading] = useState(true)
  const { currentLanguage } = useLanguage()
  
  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        setLoading(true)
        const data = await getRestaurantById(id)
        setRestaurant(data)
      } catch (error) {
        console.error('Error fetching restaurant:', error)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchRestaurant()
    }
  }, [id])

  const handleAddToCart = (item) => {
    router.push(`/menu-item/${item.id}`)
  }

  if (loading) {
    return (
      <div className="bg-chop-cream min-h-screen flex items-center justify-center">
        <p className="text-chop-brown">{t('common', 'loading', currentLanguage)}</p>
      </div>
    )
  }

  if (!restaurant) {
    return (
      <div className="bg-chop-cream min-h-screen flex items-center justify-center">
        <p className="text-chop-brown">Restaurant not found</p>
      </div>
    )
  }

  return (
    <div className="bg-chop-cream min-h-screen flex flex-col">
      <Header title={getTranslatedField(restaurant, 'name', currentLanguage)} showBackButton={true} />
      
      <div className="flex-1">
        {/* Restaurant Hero Image */}
        <div 
          className="h-56 bg-cover bg-center"
          style={{ backgroundImage: `url(${restaurant.image})` }}
        />

        {/* Menu Section */}
        <div className="px-4 py-5">
          <h2 className="text-xl font-bold text-chop-brown mb-4 font-jakarta">
            {t('restaurant', 'menu', currentLanguage)}
          </h2>
          
          <div className="space-y-0">
            {restaurant.menuItems.map((item) => (
              <div key={item.id} className="bg-chop-cream min-h-[72px] flex items-center justify-between px-4 py-2">
                <div 
                  className="flex gap-4 items-center flex-1 cursor-pointer"
                  onClick={() => router.push(`/menu-item/${item.id}`)}
                >
                  <div 
                    className="w-14 h-14 rounded-lg bg-cover bg-center flex-shrink-0"
                    style={{ backgroundImage: `url(${item.image})` }}
                  />
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-chop-brown text-base mb-1 font-jakarta">
                      {getTranslatedField(item, 'name', currentLanguage)} (₩{item.basePrice.toLocaleString()})
                    </h3>
                    <p className="text-chop-light-brown text-sm">
                      {getTranslatedField(item, 'description', currentLanguage)}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => handleAddToCart(item)}
                  className="bg-chop-orange w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 hover:bg-orange-600 transition-colors"
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Order Button */}
      {getTotalPrice() > 0 && (
        <div className="px-4 py-3 bg-chop-cream border-t border-chop-border">
          <button 
            onClick={() => router.push('/cart')}
            className="w-full bg-chop-orange text-white py-3 rounded-lg font-bold text-base hover:bg-orange-600 transition-colors"
          >
            {t('common', 'cart', currentLanguage)} (₩{getTotalPrice().toLocaleString()})
          </button>
        </div>
      )}

      <BottomNavigation />
    </div>
  )
}
