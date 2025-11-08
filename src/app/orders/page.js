'use client'

import React, { useState, useEffect } from 'react'
import Header from '../../components/Header'
import BottomNavigation from '../../components/BottomNavigation'
import { useLanguage } from '../../contexts/LanguageContext'
import { t, getTranslatedField } from '../../utils/translation'

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const { currentLanguage } = useLanguage()

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // sessionStorage에서 accommodation 정보 가져오기
        const savedAccommodation = sessionStorage.getItem('accommodation')
        const accommodationId = savedAccommodation ? JSON.parse(savedAccommodation).id : null
        
        const url = accommodationId ? `/api/orders?accommodationId=${accommodationId}` : '/api/orders'
        const response = await fetch(url)
        if (response.ok) {
          const data = await response.json()
          setOrders(data)
        } else {
          console.error('Failed to fetch orders')
        }
      } catch (error) {
        console.error('Error fetching orders:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const getOrderTrackingSteps = (status) => {
    const steps = [
      {
        id: 'placed',
        label: t('orders', 'orderPlaced', currentLanguage),
        isCompleted: true,
        isActive: status === 'PENDING'
      },
      {
        id: 'delivered',
        label: t('orders', 'delivered', currentLanguage),
        isCompleted: status === 'DELIVERED',
        isActive: status === 'DELIVERED'
      }
    ]
    if (status === 'CANCELLED') {
      // For cancelled orders, show a terminal cancelled state instead of delivered
      return [
        steps[0],
        {
          id: 'cancelled',
          label: t('orders', 'cancelled', currentLanguage),
          isCompleted: true,
          isActive: true
        }
      ]
    }
    return steps
  }

  const getEstimatedTime = (status) => {
    if (status === 'DELIVERED') {
      return t('orders', 'successfullyDelivered', currentLanguage)
    } else if (status === 'PENDING') {
      return t('orders', 'expectedTime', currentLanguage)
    } else if (status === 'CANCELLED') {
      return t('orders', 'orderCancelled', currentLanguage)
    }
    return 'Time will be updated soon'
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', { 
      year: 'numeric',
      month: '2-digit', 
      day: '2-digit' 
    })
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    })
  }

  const getRestaurantName = (orderItems) => {
    if (orderItems.length > 0 && orderItems[0].menuItem?.restaurant) {
      return getTranslatedField(orderItems[0].menuItem.restaurant, 'name', currentLanguage)
    }
    return t('orders', 'unknownRestaurant', currentLanguage)
  }

  if (loading) {
    return (
      <div className="bg-chop-cream min-h-screen flex flex-col">
        <Header title={t('orders', 'myOrders', currentLanguage)} showBackButton={false} />
        <div className="flex-1 flex items-center justify-center pb-20">
          <div className="text-chop-brown">{t('common', 'loading', currentLanguage)}</div>
        </div>
        <BottomNavigation />
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="bg-chop-cream min-h-screen flex flex-col">
        <Header title={t('orders', 'title', currentLanguage)} showBackButton={false} />
        
        <div className="flex-1 flex flex-col items-center justify-center px-4 pb-20">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <span className="text-4xl">📄</span>
          </div>
          <h2 className="text-xl font-bold text-chop-brown mb-2 font-jakarta">
            {t('orders', 'noOrders', currentLanguage)}
          </h2>
          <p className="text-chop-gray text-center mb-6">
            {t('orders', 'noOrdersMessage', currentLanguage)}
          </p>
        </div>

        <BottomNavigation />
      </div>
    )
  }

  return (
    <div className="bg-chop-cream min-h-screen flex flex-col">
      <Header title={t('orders', 'title', currentLanguage)} showBackButton={false} />
      
      <div className="flex-1 pb-20">
        <div className="px-4 py-5 space-y-6">
            {orders.map((order, orderIndex) => {
              const trackingSteps = getOrderTrackingSteps(order.status)
              const restaurantName = getRestaurantName(order.orderItems)
              
              return (
                <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  {/* Order Header */}
                  <div className="bg-gradient-to-r from-chop-orange to-orange-500 px-6 py-4">
                    <div className="flex justify-between items-center">
                      <h2 className="text-white font-bold text-lg font-jakarta">
                        {restaurantName}
                      </h2>
                    </div>
                  </div>

                  {/* Order Tracking Steps */}
                  <div className="px-6 py-5">
                    <div className="space-y-4">
                      {trackingSteps.map((step, stepIndex) => (
                        <div key={step.id} className="flex gap-4 items-start">
                          <div className="flex flex-col items-center">
                            <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                              step.id === 'cancelled'
                                ? 'bg-red-100 border-red-400'
                                : step.id === 'delivered' && step.isCompleted
                                  ? 'bg-green-500 border-green-500 shadow-lg shadow-green-200'
                                  : step.isCompleted
                                    ? 'bg-chop-brown border-chop-brown'
                                    : 'bg-white border-black'
                            }`}>
                              {step.id === 'cancelled' ? (
                                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              ) : (
                                step.isCompleted && (
                                  <svg className={`${step.id === 'delivered' ? 'w-6 h-6' : 'w-5 h-5'} text-white`} fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                                  </svg>
                                )
                              )}
                            </div>
                            {stepIndex < trackingSteps.length - 1 && (
                              <div className={`w-0.5 h-12 mt-2 ${
                                step.isCompleted ? 'bg-chop-brown' : 'bg-gray-300'
                              }`} />
                            )}
                          </div>
                          <div className="flex-1 min-h-[32px] flex flex-col justify-center">
                            <h3 className={`font-semibold text-base ${
                              step.id === 'delivered' && step.isCompleted 
                                ? 'text-green-600' 
                                : 'text-chop-brown'
                            }`}>
                              {step.label}
                            </h3>
                            {step.id === 'placed' && (
                              <p className="text-chop-gray text-sm mt-1">
                                {t('orders', 'orderNumber', currentLanguage)}: #{order.id.slice(-8)} • {formatDate(order.createdAt)} {formatTime(order.createdAt)}
                              </p>
                            )}
                            {step.id === 'delivered' && step.isCompleted && (
                              <div className="mt-2 bg-orange-50 border-2 border-orange-400 rounded-lg p-3">
                                <div className="flex items-center gap-2">
                                  <svg className="w-5 h-5 text-orange-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                  </svg>
                                  <p className="text-orange-700 text-sm font-bold">
                                    {t('orders', 'pickupFood', currentLanguage)}
                                  </p>
                                </div>
                              </div>
                            )}
                            {step.id === 'delivered' && !step.isCompleted && (
                              <p className="text-chop-orange text-sm mt-1 font-medium">
                                {t('orders', 'expectedTime', currentLanguage)}
                              </p>
                            )}
                            {step.id === 'cancelled' && (
                              <p className="text-red-600 text-sm mt-1 font-medium">
                                {t('orders', 'orderCancelled', currentLanguage)}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="px-6 pb-5">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-chop-brown mb-3 text-base">
                        {t('orders', 'orderDetails', currentLanguage)}
                      </h3>
                      <div className="space-y-4">
                        {order.orderItems.map((item, index) => (
                          <div key={index} className="border-b border-gray-200 pb-3 last:border-b-0 last:pb-0">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-base text-chop-brown font-medium">{getTranslatedField(item.menuItem, 'name', currentLanguage)}</span>
                                  <span className="text-sm text-chop-orange font-medium">
                                    ×{item.quantity}
                                  </span>
                                </div>
                                
                                {/* Menu Options */}
                                {item.optionSelections && item.optionSelections.length > 0 && (
                                  <div className="ml-8 space-y-1">
                                    {item.optionSelections.map((option, optionIndex) => (
                                      <div key={optionIndex} className="flex items-center gap-2">
                                        <span className="text-xs text-gray-400">•</span>
                                        <span className="text-sm text-chop-gray">
                                          {getTranslatedField(option.menuOption, 'name', currentLanguage)}
                                          {option.menuOption.price > 0 && (
                                            <span className="text-chop-orange ml-1">
                                              (+₩{option.menuOption.price.toLocaleString()})
                                            </span>
                                          )}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                
                                {/* Unit Price */}
                                <div className="ml-8 mt-1">
                                  <span className="text-xs text-chop-gray">
                                    ₩{item.unitPrice.toLocaleString()}
                                  </span>
                                </div>
                              </div>
                              <div className="text-right ml-4">
                                <span className="text-base text-chop-brown font-semibold">
                                  ₩{(item.unitPrice * item.quantity).toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Order Summary */}
                      <div className="border-t border-gray-200 mt-4 pt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-chop-gray">{t('cart', 'subtotal', currentLanguage)}:</span>
                          <span className="text-chop-brown">₩{order.subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-chop-gray">{t('cart', 'serviceFee', currentLanguage)}:</span>
                          <span className="text-chop-brown">₩{order.serviceFee.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-3">
                          <span className="text-chop-brown">{t('cart', 'total', currentLanguage)}:</span>
                          <span className="text-chop-orange">₩{order.totalAmount.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
        </div>
      </div>

      <BottomNavigation />
    </div>
  )
}
