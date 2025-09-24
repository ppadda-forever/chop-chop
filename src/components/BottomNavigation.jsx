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
    { 
      path: '/', 
      label: 'Home', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    { 
      path: '/restaurants', 
      label: 'Restaurants', 
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 18 20">
          <path fillRule="evenodd" clipRule="evenodd" d="M4 6.25V1.75C4 1.33579 4.33579 1 4.75 1C5.16421 1 5.5 1.33579 5.5 1.75V6.25C5.5 6.66421 5.16421 7 4.75 7C4.33579 7 4 6.66421 4 6.25ZM17.5 1.75V19C17.5 19.4142 17.1642 19.75 16.75 19.75C16.3358 19.75 16 19.4142 16 19V14.5H11.5C11.0858 14.5 10.75 14.1642 10.75 13.75C10.7848 11.9534 11.0117 10.1658 11.4269 8.4175C12.3438 4.62156 14.0819 2.07719 16.4547 1.06094C16.6863 0.961704 16.9524 0.985456 17.1628 1.12416C17.3732 1.26287 17.4999 1.49798 17.5 1.75ZM16 3.05312C12.9841 5.35656 12.3934 10.9675 12.2781 13H16V3.05312ZM8.48969 1.62719C8.44971 1.35915 8.26824 1.13353 8.01501 1.03701C7.76177 0.940492 7.47617 0.988093 7.26793 1.16152C7.05968 1.33495 6.9612 1.60723 7.01031 1.87375L7.75 6.30906C7.75 7.96592 6.40685 9.30906 4.75 9.30906C3.09315 9.30906 1.75 7.96592 1.75 6.30906L2.48875 1.87375C2.53786 1.60723 2.43938 1.33495 2.23114 1.16152C2.02289 0.988093 1.73729 0.940492 1.48406 1.03701C1.23082 1.13353 1.04936 1.35915 1.00938 1.62719L0.259375 6.12719C0.252958 6.16781 0.249823 6.20888 0.25 6.25C0.253094 8.44457 1.83658 10.3178 4 10.6862V19C4 19.4142 4.33579 19.75 4.75 19.75C5.16421 19.75 5.5 19.4142 5.5 19V10.6862C7.66343 10.3178 9.24691 8.44457 9.25 6.25C9.24987 6.20885 9.24642 6.16778 9.23969 6.12719L8.48969 1.62719Z" />
        </svg>
      )
    },
    { 
      path: '/cart', 
      label: 'Cart', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ), 
      showBadge: true 
    },
    { 
      path: '/orders', 
      label: 'Orders', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    { 
      path: '/help', 
      label: 'Help', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
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
              {item.icon}
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
