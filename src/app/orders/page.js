'use client'

import React from 'react'
import Header from '../../components/Header'
import BottomNavigation from '../../components/BottomNavigation'

export default function Orders() {
  // Mock order data
  const orders = [
    {
      id: '12345',
      restaurant: '김치찌개 전문점',
      status: 'Delivered',
      date: '2024-01-15',
      total: 18000,
      items: ['김치찌개', '된장찌개']
    },
    {
      id: '12344',
      restaurant: '양념치킨 전문점',
      status: 'In Progress',
      date: '2024-01-14',
      total: 25000,
      items: ['양념치킨', '후라이드 치킨']
    },
    {
      id: '12343',
      restaurant: '불고기 덮밥집',
      status: 'Delivered',
      date: '2024-01-13',
      total: 15600,
      items: ['불고기 덮밥']
    }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'text-green-600 bg-green-100'
      case 'In Progress':
        return 'text-blue-600 bg-blue-100'
      case 'Cancelled':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="bg-chop-cream min-h-screen flex flex-col">
      <Header title="My Orders" showBackButton={false} />
      
      <div className="flex-1 px-4 py-5">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">📋</span>
            </div>
            <h3 className="text-lg font-medium text-chop-brown mb-2 font-jakarta">
              No orders yet
            </h3>
            <p className="text-chop-gray text-center mb-4">
              Start ordering delicious food from your favorite restaurants!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium text-chop-brown font-jakarta">
                      {order.restaurant}
                    </h3>
                    <p className="text-sm text-chop-gray">
                      Order #{order.id} • {order.date}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                
                <div className="mb-3">
                  <p className="text-sm text-chop-brown mb-1">Items:</p>
                  <p className="text-sm text-chop-gray">
                    {order.items.join(', ')}
                  </p>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-chop-orange font-bold">
                    ₩{order.total.toLocaleString()}
                  </span>
                  {order.status === 'Delivered' && (
                    <button className="text-chop-brown text-sm font-medium">
                      Reorder
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  )
}
