'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getRestaurants, getRestaurantsByCategory } from '../../services/clientApi'
import Header from '../../components/Header'
import BottomNavigation from '../../components/BottomNavigation'

export default function Restaurants() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState(null) // null로 변경
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)

  const categories = [
    'KOREAN', 'CHICKEN', 'BUNSIK', 'PIZZA', 'ASIAN', 'BURGERS', 
    'DESSERTS', 'GRILLED', 'JOKBAL', 'STEW', 'SEAFOOD', 'SALADS', 
    'MEXICAN', 'VEGAN', 'HALAL'
  ]

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true)
        const data = selectedCategory 
          ? await getRestaurantsByCategory(selectedCategory)
          : await getRestaurants() // 카테고리가 null이면 전체 레스토랑 가져오기
        setRestaurants(data)
      } catch (error) {
        console.error('Error fetching restaurants:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRestaurants()
  }, [selectedCategory])

  const handleCategoryClick = (category) => {
    // 같은 카테고리를 클릭하면 해제, 다른 카테고리를 클릭하면 선택
    setSelectedCategory(selectedCategory === category ? null : category)
  }

  return (
    <div className="bg-chop-cream min-h-screen flex flex-col">
      <Header title="Restaurants" />
      
      <div className="flex-1">
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
              <div className="text-chop-brown">Loading...</div>
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
                    {restaurant.name}
                  </h3>
                  <p className="text-chop-red text-sm">
                    {restaurant.category} · Minimum order: ₩{restaurant.minOrderAmount.toLocaleString()}
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
