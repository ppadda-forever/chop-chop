'use client'

import React, { useState, useEffect } from 'react'
import Header from '../../components/Header'
import BottomNavigation from '../../components/BottomNavigation'

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders')
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
        label: 'Order Placed',
        isCompleted: true,
        isActive: status === 'PENDING'
      },
      {
        id: 'delivered',
        label: 'Delivered',
        isCompleted: status === 'DELIVERED',
        isActive: status === 'DELIVERED'
      }
    ]
    return steps
  }

  const getEstimatedTime = (status) => {
    if (status === 'DELIVERED') {
      return 'Delivered successfully!'
    } else if (status === 'PENDING') {
      return 'Expected in 25-35 minutes'
    }
    return 'Time will be updated soon'
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      })
    }
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
      return orderItems[0].menuItem.restaurant.name
    }
    return 'Unknown Restaurant'
  }

  if (loading) {
    return (
      <div className="bg-chop-cream min-h-screen flex flex-col">
        <Header title="My Orders" showBackButton={false} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-chop-brown">Loading...</div>
        </div>
        <BottomNavigation />
      </div>
    )
  }

  return (
    <div className="bg-[#fcfaf7] min-h-screen flex flex-col">
      <Header title="Order Tracking" showBackButton={false} />
      
      <div className="flex-1">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 px-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">📦</span>
            </div>
            <h3 className="text-lg font-medium text-chop-brown mb-2 font-jakarta">
              No orders yet
            </h3>
            <p className="text-chop-gray text-center mb-4">
              Start ordering delicious food from your favorite restaurants!
            </p>
          </div>
        ) : (
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
                      {order.status === 'DELIVERED' && (
                        <div className="px-3 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          🎉 Delivered
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Order Tracking Steps */}
                  <div className="px-6 py-5">
                    <div className="space-y-4">
                      {trackingSteps.map((step, stepIndex) => (
                        <div key={step.id} className="flex gap-4 items-start">
                          <div className="flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                              step.isCompleted 
                                ? 'bg-chop-brown border-chop-brown' 
                                : 'bg-white border-gray-300'
                            }`}>
                              {step.isCompleted && (
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                                </svg>
                              )}
                            </div>
                            {stepIndex < trackingSteps.length - 1 && (
                              <div className="w-0.5 h-12 bg-gray-200 mt-2" />
                            )}
                          </div>
                          <div className="flex-1 min-h-[32px] flex flex-col justify-center">
                            <h3 className="font-semibold text-chop-brown text-base">
                              {step.label}
                            </h3>
                            {step.id === 'placed' && (
                              <p className="text-chop-gray text-sm mt-1">
                                Order #{order.id.slice(-8)} • {formatDate(order.createdAt)} at {formatTime(order.createdAt)}
                              </p>
                            )}
                            {step.id === 'delivered' && step.isCompleted && (
                              <p className="text-green-600 text-sm mt-1 font-medium">
                                Successfully delivered!
                              </p>
                            )}
                            {step.id === 'delivered' && !step.isCompleted && (
                              <p className="text-chop-orange text-sm mt-1 font-medium">
                                Expected in 25-35 minutes
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
                        Order Details
                      </h3>
                      <div className="space-y-4">
                        {order.orderItems.map((item, index) => (
                          <div key={index} className="border-b border-gray-200 pb-3 last:border-b-0 last:pb-0">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-base text-chop-brown font-medium">{item.menuItem.name}</span>
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
                                          {option.menuOption.name}
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
                          <span className="text-chop-gray">Subtotal:</span>
                          <span className="text-chop-brown">₩{(order.totalAmount - order.deliveryFee).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-chop-gray">Delivery fee:</span>
                          <span className="text-chop-brown">₩{order.deliveryFee.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-3">
                          <span className="text-chop-brown">Total:</span>
                          <span className="text-chop-orange">₩{order.totalAmount.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  )
}
