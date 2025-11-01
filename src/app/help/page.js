'use client'

import React, { useState, useMemo } from 'react'
import Header from '../../components/Header'
import BottomNavigation from '../../components/BottomNavigation'
import { useLanguage } from '../../contexts/LanguageContext'
import { t } from '../../utils/translation'

export default function Help() {
  const [expandedFAQ, setExpandedFAQ] = useState(null)
  const { currentLanguage } = useLanguage()

  const toggleFAQ = (index) => {
    setExpandedFAQ(expandedFAQ === index ? null : index)
  }

  const faqs = useMemo(() => [
    {
      question: t('help', 'deliveryTime', currentLanguage),
      answer: t('help', 'deliveryTimeAnswer', currentLanguage)
    },
    {
      question: t('help', 'paymentMethods', currentLanguage),
      answer: t('help', 'paymentMethodsAnswer', currentLanguage)
    },
    {
      question: t('help', 'cancelOrder', currentLanguage),
      answer: t('help', 'cancelOrderAnswer', currentLanguage)
    },
    {
      question: t('help', 'deliveryArea', currentLanguage),
      answer: t('help', 'deliveryAreaAnswer', currentLanguage)
    },
    {
      question: t('help', 'wrongOrder', currentLanguage),
      answer: t('help', 'wrongOrderAnswer', currentLanguage)
    }
  ], [currentLanguage])

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Header title={t('help', 'title', currentLanguage)} showBackButton={false} />
      
      <div className="flex-1 px-4 py-6 pb-20">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-chop-orange rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-chop-brown mb-2 font-jakarta">
            {t('help', 'howCanWeHelp', currentLanguage)}
          </h1>
          <p className="text-chop-gray text-base">
            {t('help', 'helpDescription', currentLanguage)}
          </p>
        </div>

        {/* Contact Us Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-chop-brown mb-4 font-jakarta">
            {t('help', 'contactUs', currentLanguage)}
          </h2>
          <div className="space-y-4">
            <a 
              href="https://www.instagram.com/chopchop_seoul/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-gray-50 rounded-xl p-4 flex items-center hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <div className="w-12 h-12 bg-chop-orange rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.40s-.644-1.44-1.439-1.44z"/>
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-chop-brown font-semibold text-base">{t('help', 'instagramDm', currentLanguage)}</p>
                <p className="text-chop-gray text-sm">@chopchop_seoul</p>
              </div>
              <svg className="w-5 h-5 text-chop-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>

        {/* FAQ Section */}
        <div>
          <h2 className="text-xl font-bold text-chop-brown mb-4 font-jakarta">
            {t('help', 'faq', currentLanguage)}
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-gray-50 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-100 transition-colors"
                >
                  <span className="text-chop-brown font-medium text-base pr-4">
                    {faq.question}
                  </span>
                  <svg 
                    className={`w-5 h-5 text-chop-gray transition-transform ${
                      expandedFAQ === index ? 'rotate-180' : ''
                    }`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {expandedFAQ === index && (
                  <div className="px-4 pb-4">
                    <p className="text-chop-gray text-sm leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  )
}
