'use client'

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useCart } from '../contexts/CartContext';

const BottomNavigation = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { getTotalItems } = useCart();
  const cartItemCount = getTotalItems();

  const navItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/restaurants', label: 'Restaurants', icon: '🍽️' },
    { path: '/cart', label: 'Cart', icon: '🛒', showBadge: true },
    { path: '/orders', label: 'Orders', icon: '📋' },
    { path: '/help', label: 'Help', icon: '❓' }
  ];

  const isActive = (path) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="bg-chop-cream border-t border-chop-border">
        <div className="flex items-center justify-around px-4 py-3">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={`flex flex-col items-center gap-1 relative ${
                isActive(item.path) 
                  ? 'text-chop-brown' 
                  : 'text-chop-light-brown'
              }`}
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="text-xs font-medium">{item.label}</span>
              {item.showBadge && cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-chop-orange text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
          ))}
        </div>
      <div className="h-5 bg-chop-cream"></div>
    </div>
  );
};

export default BottomNavigation;
