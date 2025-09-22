'use client'

import React, { useState } from 'react'
import Header from '../../components/Header'
import BottomNavigation from '../../components/BottomNavigation'

export default function Help() {
  const [expandedFAQ, setExpandedFAQ] = useState(null)

  const toggleFAQ = (index) => {
    setExpandedFAQ(expandedFAQ === index ? null : index)
  }

  const faqs = [
    {
      question: "How long does delivery take?",
      answer: "Delivery typically takes 25-45 minutes depending on your location and restaurant."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept credit cards, debit cards, and cash on delivery."
    },
    {
      question: "Can I cancel my order?",
      answer: "You can cancel your order within 5 minutes of placing it. After that, please contact us directly."
    },
    {
      question: "Do you deliver to my area?",
      answer: "We deliver to most areas in Seoul. Check the restaurant page to see if delivery is available to your location."
    },
    {
      question: "What if my order is wrong or missing items?",
      answer: "Please contact us immediately and we'll make it right. We'll either redeliver the correct items or provide a full refund."
    }
  ]

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Header title="Help" showBackButton={false} />
      
      <div className="flex-1 px-4 py-6">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-chop-orange rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-chop-brown mb-2 font-jakarta">
            How can we help you?
          </h1>
          <p className="text-chop-gray text-base">
            Find answers to common questions or get in touch with our support team
          </p>
        </div>

        {/* Contact Us Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-chop-brown mb-4 font-jakarta">
            Contact Us
          </h2>
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-4 flex items-center">
              <div className="w-12 h-12 bg-chop-orange rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-chop-brown font-semibold text-base">Instagram DM</p>
                <p className="text-chop-gray text-sm">@chopchop_korea</p>
              </div>
              <svg className="w-5 h-5 text-chop-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div>
          <h2 className="text-xl font-bold text-chop-brown mb-4 font-jakarta">
            Frequently Asked Questions
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
