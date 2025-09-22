'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getPopularMenuItems } from '../services/clientApi'
import Header from '../components/Header'
import BottomNavigation from '../components/BottomNavigation'

export default function Home() {
  const router = useRouter()
  const [popularItems, setPopularItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPopularItems = async () => {
      try {
        const items = await getPopularMenuItems()
        setPopularItems(items)
      } catch (error) {
        console.error('Error fetching popular items:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPopularItems()
  }, [])

  const heroImage = 'http://localhost:3845/assets/78f024ce7f20e63ca2612dae8b70848a74c3b4ec.png'

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Header title="Chop Chop" showCartButton={true} />
      
      <div className="flex-1">
        {/* Hero Section */}
        <div className="relative h-96 bg-gradient-to-r from-black/10 to-black/40">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-black/50" />
          
          <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">
            <h1 className="text-4xl font-extrabold text-white mb-2 font-jakarta">
              Welcome to<br />Chop Chop
            </h1>
            <p className="text-white text-sm mb-8 max-w-sm">
              Your go-to for delicious food delivery in Seoul. Explore local flavors and enjoy a taste of Korea, delivered right to your door.
            </p>
            <button 
              onClick={() => router.push('/restaurants')}
              className="bg-chop-orange text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-orange-600 transition-colors"
            >
              Order Now
            </button>
          </div>
        </div>

        {/* Popular Dishes Section */}
        <div className="px-4 py-5">
          <h2 className="text-xl font-bold text-chop-brown mb-4 font-jakarta">
            Popular Dishes
          </h2>
          
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="text-chop-brown">Loading...</div>
            </div>
          ) : (
            <div className="flex gap-3 overflow-x-auto pb-4">
              {popularItems.map((item) => (
                <div key={item.id} className="flex-shrink-0 w-40">
                  <div className="bg-white rounded-lg overflow-hidden shadow-sm">
                    <div 
                      className="h-40 bg-cover bg-center"
                      style={{ backgroundImage: `url(${item.image})` }}
                    />
                    <div className="p-3">
                      <h3 className="font-medium text-chop-brown text-sm mb-1 font-jakarta">
                        {item.name}
                      </h3>
                      <p className="text-chop-gray text-xs mb-2">
                        {item.description}
                      </p>
                      <p className="text-chop-orange font-bold text-sm">
                        ₩{item.basePrice.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <BottomNavigation />
    </div>
  )
}
