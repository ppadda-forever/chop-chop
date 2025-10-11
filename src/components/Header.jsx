'use client'

import React from 'react';
import { useRouter } from 'next/navigation';

const Header = ({ title, showBackButton = false }) => {
  const router = useRouter();

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
      </div>
    </div>
  );
};

export default Header;
