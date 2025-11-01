'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext()

export const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸', suffix: 'En' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵', suffix: 'Jp' },
  { code: 'cn', name: 'Chinese', flag: '🇨🇳', suffix: 'Cn' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷', suffix: '' }
]

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en')

  // Load language preference from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('chop-chop-language')
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage)
    }
  }, [])

  // Save language preference to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('chop-chop-language', currentLanguage)
  }, [currentLanguage])

  const changeLanguage = (languageCode) => {
    setCurrentLanguage(languageCode)
  }

  const getCurrentLanguage = () => {
    return languages.find(lang => lang.code === currentLanguage) || languages[0]
  }

  const value = {
    currentLanguage,
    changeLanguage,
    getCurrentLanguage,
    languages
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

