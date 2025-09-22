'use client'

import React from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../contexts/CartContext';

const Header = ({ title, showBackButton = false, showCartButton = false }) => {
  const router = useRouter();
  const { getTotalItems } = useCart();
  const cartItemCount = getTotalItems();

  return (
    <div className="bg-chop-cream px-4 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {showBackButton && (
            <button 
              onClick={() => router.back()}
              className="mr-4 p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <h1 className="text-lg font-bold text-chop-brown font-jakarta">
            {title}
          </h1>
        </div>
        
        {showCartButton && (
          <button 
            onClick={() => router.push('/cart')}
            className="p-2 relative"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
            </svg>
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-chop-orange text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;
