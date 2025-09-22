import React from 'react';
import Header from '../components/Header';
import BottomNavigation from '../components/BottomNavigation';

const Help = () => {
  const handleInstagramContact = () => {
    // Open Instagram in a new tab
    window.open('https://instagram.com/chopchop_seoul', '_blank');
  };

  return (
    <div className="bg-chop-cream min-h-screen flex flex-col">
      <Header title="Help" showBackButton={true} />
      
      <div className="flex-1">
        {/* Contact Us Section */}
        <div className="px-4 py-5">
          <h2 className="text-xl font-bold text-chop-brown mb-4 font-jakarta">
            Contact Us
          </h2>
          
          {/* Instagram Contact */}
          <div 
            className="bg-chop-cream min-h-[72px] flex items-center gap-4 px-4 py-2 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={handleInstagramContact}
          >
            <div className="bg-chop-border w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-chop-brown" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-chop-brown text-base mb-1 font-jakarta">
                Instagram DM (@chopchop_seoul)
              </h3>
              <p className="text-chop-light-brown text-sm">
                Contact us via Instagram DM for immediate assistance.
              </p>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-8">
            <h2 className="text-xl font-bold text-chop-brown mb-4 font-jakarta">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 border border-chop-border">
                <h3 className="font-medium text-chop-brown text-base mb-2 font-jakarta">
                  How do I place an order?
                </h3>
                <p className="text-chop-light-brown text-sm">
                  Browse restaurants, select your favorite dishes, customize your order, and proceed to checkout. You can pay with PayPal or credit card.
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 border border-chop-border">
                <h3 className="font-medium text-chop-brown text-base mb-2 font-jakarta">
                  What are your delivery areas?
                </h3>
                <p className="text-chop-light-brown text-sm">
                  We currently deliver to Seoul and surrounding areas. Delivery fees vary by location and are calculated at checkout.
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 border border-chop-border">
                <h3 className="font-medium text-chop-brown text-base mb-2 font-jakarta">
                  How long does delivery take?
                </h3>
                <p className="text-chop-light-brown text-sm">
                  Delivery times typically range from 25-45 minutes depending on the restaurant and your location. You'll see estimated delivery time when placing your order.
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 border border-chop-border">
                <h3 className="font-medium text-chop-brown text-base mb-2 font-jakarta">
                  Can I cancel my order?
                </h3>
                <p className="text-chop-light-brown text-sm">
                  Orders can be cancelled within 5 minutes of placement. Once confirmed and prepared, orders cannot be cancelled or refunded.
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 border border-chop-border">
                <h3 className="font-medium text-chop-brown text-base mb-2 font-jakarta">
                  What payment methods do you accept?
                </h3>
                <p className="text-chop-light-brown text-sm">
                  We accept PayPal and all major credit cards including Visa, MasterCard, and American Express.
                </p>
              </div>
            </div>
          </div>

          {/* Additional Help Options */}
          <div className="mt-8">
            <h2 className="text-xl font-bold text-chop-brown mb-4 font-jakarta">
              Need More Help?
            </h2>
            
            <div className="space-y-3">
              <div className="bg-white rounded-lg p-4 border border-chop-border">
                <h3 className="font-medium text-chop-brown text-base mb-1 font-jakarta">
                  📧 Email Support
                </h3>
                <p className="text-chop-light-brown text-sm">
                  support@chopchop.kr
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 border border-chop-border">
                <h3 className="font-medium text-chop-brown text-base mb-1 font-jakarta">
                  📞 Phone Support
                </h3>
                <p className="text-chop-light-brown text-sm">
                  +82-2-1234-5678 (Mon-Fri, 9AM-6PM KST)
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 border border-chop-border">
                <h3 className="font-medium text-chop-brown text-base mb-1 font-jakarta">
                  💬 Live Chat
                </h3>
                <p className="text-chop-light-brown text-sm">
                  Available 24/7 through our app
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Help;
