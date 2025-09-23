'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getPopularMenuItems, getAccommodationByQrCode } from '../services/clientApi'
import Header from '../components/Header'
import BottomNavigation from '../components/BottomNavigation'

export default function Home() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [popularItems, setPopularItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState('English')
  const [accommodation, setAccommodation] = useState(null)

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳' }
  ]

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language.name)
    setIsLanguageDropdownOpen(false)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        let currentAccommodation = null
        
        // QR 코드 파라미터 확인
        const qrCode = searchParams.get('qr')
        
        if (qrCode) {
          try {
            const accommodationData = await getAccommodationByQrCode(qrCode)
            setAccommodation(accommodationData)
            currentAccommodation = accommodationData
            // 숙소 정보를 sessionStorage에 저장
            sessionStorage.setItem('accommodation', JSON.stringify(accommodationData))
          } catch (error) {
            console.error('Invalid QR code:', error)
          }
        } else {
          // QR 코드가 없으면 sessionStorage에서 기존 숙소 정보 확인
          const savedAccommodation = sessionStorage.getItem('accommodation')
          if (savedAccommodation) {
            try {
              currentAccommodation = JSON.parse(savedAccommodation)
              setAccommodation(currentAccommodation)
            } catch (error) {
              console.error('Error parsing saved accommodation:', error)
            }
          }
        }

        // 인기 메뉴 아이템 조회 (숙소 지역이 있으면 해당 지역의 메뉴만)
        const area = currentAccommodation?.area
        const items = await getPopularMenuItems(area)
        setPopularItems(items)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [searchParams])

  const heroImage = 'https://images.unsplash.com/photo-1590301157890-4810ed352733?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80'

  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* Custom Header with Logo */}
      <div className="bg-white px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left spacer */}
          <div className="w-12"></div>
          
          {/* Center Logo */}
          <div className="flex flex-col items-center">
            <img 
              src="/icon.png" 
              alt="Chop Chop" 
              className="h-12 w-14 object-contain"
            />
          </div>
          
          {/* Right Language Selector */}
          <div className="relative">
            <button
              onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 20 20" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M10 0.25C4.61522 0.25 0.25 4.61522 0.25 10C0.25 15.3848 4.61522 19.75 10 19.75C15.3848 19.75 19.75 15.3848 19.75 10C19.7443 4.61758 15.3824 0.255684 10 0.25ZM7.52781 13.75H12.4722C11.9688 15.4694 11.125 17.0191 10 18.2397C8.875 17.0191 8.03125 15.4694 7.52781 13.75ZM7.1875 12.25C6.93875 10.7603 6.93875 9.23969 7.1875 7.75H12.8125C13.0612 9.23969 13.0612 10.7603 12.8125 12.25H7.1875ZM1.75 10C1.74935 9.23916 1.85441 8.48192 2.06219 7.75H5.66781C5.44406 9.24166 5.44406 10.7583 5.66781 12.25H2.06219C1.85441 11.5181 1.74935 10.7608 1.75 10ZM12.4722 6.25H7.52781C8.03125 4.53062 8.875 2.98094 10 1.76031C11.125 2.98094 11.9688 4.53062 12.4722 6.25ZM14.3322 7.75H17.9378C18.3541 9.22112 18.3541 10.7789 17.9378 12.25H14.3322C14.5559 10.7583 14.5559 9.24166 14.3322 7.75ZM17.3472 6.25H14.0256C13.6429 4.74392 13.0001 3.31623 12.1263 2.03125C14.3838 2.63793 16.28 4.17014 17.3472 6.25ZM7.87375 2.03125C6.9999 3.31623 6.35712 4.74392 5.97437 6.25H2.65281C3.71999 4.17014 5.61618 2.63793 7.87375 2.03125ZM2.65281 13.75H5.97437C6.35712 15.2561 6.9999 16.6838 7.87375 17.9688C5.61618 17.3621 3.71999 15.8299 2.65281 13.75ZM12.1263 17.9688C13.0001 16.6838 13.6429 15.2561 14.0256 13.75H17.3472C16.28 15.8299 14.3838 17.3621 12.1263 17.9688Z" fill="#0F1417"/>
              </svg>
            </button>

            {/* Language Dropdown */}
            {isLanguageDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-chop-border rounded-lg shadow-lg z-50">
                {languages.map((language) => (
                  <button
                    key={language.code}
                    onClick={() => handleLanguageSelect(language)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                      selectedLanguage === language.name ? 'bg-chop-cream' : ''
                    }`}
                  >
                    <span className="text-lg">{language.flag}</span>
                    <span className="text-sm font-medium text-chop-brown">
                      {language.name}
                    </span>
                    {selectedLanguage === language.name && (
                      <svg className="w-4 h-4 text-chop-orange ml-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Accommodation Info Banner (if QR scanned) */}
      {accommodation && (
        <div className="bg-chop-cream px-4 py-3 border-b border-chop-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-chop-orange rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-chop-dark-brown">
                Delivering to: {accommodation.name}
              </p>
              <p className="text-xs text-chop-brown">
                {accommodation.address}
              </p>
            </div>
          </div>
        </div>
      )}
      
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

        {/* Recommended Dishes Section */}
        <div className="px-4 py-5">
          <h2 className="text-xl font-bold text-chop-brown mb-4 font-jakarta">
            Recommended Dishes
          </h2>
          
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="text-chop-brown">Loading...</div>
            </div>
          ) : (
            <div className="flex gap-3 overflow-x-auto pb-4">
              {popularItems.map((item) => (
                <div 
                  key={item.id} 
                  className="flex-shrink-0 w-40 cursor-pointer"
                  onClick={() => router.push(`/restaurant/${item.restaurant.id}`)}
                >
                  <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div 
                      className="h-40 bg-cover bg-center"
                      style={{ backgroundImage: `url(${item.image})` }}
                    />
                    <div className="p-3">
                      <h3 className="font-medium text-chop-brown text-sm mb-1 font-jakarta">
                        {item.name}
                      </h3>
                      <p className="text-chop-gray text-xs mb-2 line-clamp-2">
                        {item.description}
                      </p>
                      <p className="text-chop-orange font-bold text-sm mb-1">
                        ₩{item.basePrice.toLocaleString()}
                      </p>
                      <p className="text-chop-gray text-xs">
                        from {item.restaurant.name}
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
