'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getRestaurants, getRestaurantsByCategory } from '../../services/clientApi'
import Header from '../../components/Header'
import BottomNavigation from '../../components/BottomNavigation'
import { useLanguage } from '../../contexts/LanguageContext'
import { getTranslatedField, t } from '../../utils/translation'

export default function Restaurants() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)
  const [accommodation, setAccommodation] = useState(null)
  const { currentLanguage } = useLanguage()

  const categories = [
    'KOREAN', 'CHICKEN', 'BUNSIK', 'PIZZA', 'ASIAN', 'BURGERS', 
    'DESSERTS', 'GRILLED', 'JOKBAL', 'STEW', 'SEAFOOD', 'SALADS', 
    'MEXICAN', 'VEGAN', 'HALAL'
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // sessionStorage에서 숙소 정보 확인
        const savedAccommodation = sessionStorage.getItem('accommodation')
        let currentAccommodation = null
        
        if (savedAccommodation) {
          currentAccommodation = JSON.parse(savedAccommodation)
          setAccommodation(currentAccommodation)
        }

        // 숙소가 있으면 해당 지역만, 없으면 전체 또는 카테고리별
        const area = currentAccommodation?.area
        const data = await getRestaurants(selectedCategory, area)
        setRestaurants(data)
      } catch (error) {
        console.error('Error fetching restaurants:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [selectedCategory])

  const handleCategoryClick = (category) => {
    // 같은 카테고리를 클릭하면 해제, 다른 카테고리를 클릭하면 선택
    setSelectedCategory(selectedCategory === category ? null : category)
  }

  return (
    <div className="bg-chop-cream min-h-screen flex flex-col">
      <Header title={t('restaurants', 'title', currentLanguage)} />
      
      <div className="flex-1 pb-20">
        {/* Category Filters */}
        <div className="px-3 py-3">
          <div className="flex gap-3 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? 'bg-orange-500 text-white' // 선택된 카테고리는 주황색
                    : 'bg-chop-light-gray text-chop-dark-brown'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Restaurant List */}
        <div className="px-4">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="text-chop-brown">{t('common', 'loading', currentLanguage)}</div>
            </div>
          ) : restaurants.length === 0 ? (
            <div className="flex justify-center items-center h-40">
              <div className="text-chop-brown">No restaurants found in this category</div>
            </div>
          ) : (
            restaurants.map((restaurant) => (
              <div 
                key={restaurant.id}
                onClick={() => router.push(`/restaurant/${restaurant.id}`)}
                className="bg-chop-cream min-h-[72px] flex items-center gap-4 px-4 py-2 mb-0 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div 
                  className="w-14 h-14 rounded-lg bg-cover bg-center flex-shrink-0"
                  style={{ backgroundImage: `url(${restaurant.image})` }}
                />
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-chop-dark-brown text-base mb-1 font-jakarta">
                    {getTranslatedField(restaurant, 'name', currentLanguage)}
                  </h3>
                  <p className="text-chop-red text-sm">
                    {restaurant.category} · {t('restaurants', 'minOrder', currentLanguage)} ₩{restaurant.minOrderAmount.toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <BottomNavigation />
    </div>
  )
}
