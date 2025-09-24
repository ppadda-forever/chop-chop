'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const Header = ({ title, showBackButton = false }) => {
  const router = useRouter();
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳' }
  ];

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language.name);
    setIsLanguageDropdownOpen(false);
    // 여기에 언어 변경 로직 추가 가능
  };

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
        
        {/* Language Selector */}
        <div className="relative">
          <button
            onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M10 0.25C4.61522 0.25 0.25 4.61522 0.25 10C0.25 15.3848 4.61522 19.75 10 19.75C15.3848 19.75 19.75 15.3848 19.75 10C19.7443 4.61758 15.3824 0.255684 10 0.25ZM7.52781 13.75H12.4722C11.9688 15.4694 11.125 17.0191 10 18.2397C8.875 17.0191 8.03125 15.4694 7.52781 13.75ZM7.1875 12.25C6.93875 10.7603 6.93875 9.23969 7.1875 7.75H12.8125C13.0612 9.23969 13.0612 10.7603 12.8125 12.25H7.1875ZM1.75 10C1.74935 9.23916 1.85441 8.48192 2.06219 7.75H5.66781C5.44406 9.24166 5.44406 10.7583 5.66781 12.25H2.06219C1.85441 11.5181 1.74935 10.7608 1.75 10ZM12.4722 6.25H7.52781C8.03125 4.53062 8.875 2.98094 10 1.76031C11.125 2.98094 11.9688 4.53062 12.4722 6.25ZM14.3322 7.75H17.9378C18.3541 9.22112 18.3541 10.7789 17.9378 12.25H14.3322C14.5559 10.7583 14.5559 9.24166 14.3322 7.75ZM17.3472 6.25H14.0256C13.6429 4.74392 13.0001 3.31623 12.1263 2.03125C14.3838 2.63793 16.28 4.17014 17.3472 6.25ZM7.87375 2.03125C6.9999 3.31623 6.35712 4.74392 5.97437 6.25H2.65281C3.71999 4.17014 5.61618 2.63793 7.87375 2.03125ZM2.65281 13.75H5.97437C6.35712 15.2561 6.9999 16.6838 7.87375 17.9688C5.61618 17.3621 3.71999 15.8299 2.65281 13.75ZM12.1263 17.9688C13.0001 16.6838 13.6429 15.2561 14.0256 13.75H17.3472C16.28 15.8299 14.3838 17.3621 12.1263 17.9688Z" fill="#0F1417"/>
            </svg>
          </button>

          {/* Dropdown Menu */}
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
  );
};

export default Header;
