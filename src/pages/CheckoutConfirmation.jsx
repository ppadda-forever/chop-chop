import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import BottomNavigation from '../components/BottomNavigation';

const CheckoutConfirmation = () => {
  const navigate = useNavigate();

  // Mock order data
  const orderItems = [
    { name: 'Kimchi Fried Rice', quantity: 1, price: 12.99 },
    { name: 'Spicy Tteokbokki', quantity: 1, price: 9.99 },
    { name: 'Bulgogi Bibimbap', quantity: 1, price: 14.99 }
  ];

  const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 2.99;
  const total = subtotal + deliveryFee;

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleConfirmOrder = () => {
    // Process final order confirmation
    console.log('Final order confirmed');
    // Navigate to order success page or home
    navigate('/');
  };

  return (
    <div className="bg-chop-cream min-h-screen flex flex-col">
      <Header title="Checkout" showBackButton={true} />
      
      <div className="flex-1">
        {/* Order Summary */}
        <div className="px-4 py-4">
          <h2 className="text-lg font-bold text-chop-brown mb-4 font-jakarta">
            Order Summary
          </h2>
          
          <div className="space-y-0">
            {orderItems.map((item, index) => (
              <div key={index} className="bg-chop-cream h-18 flex items-center justify-between px-4 py-2">
                <div className="flex flex-col">
                  <span className="font-medium text-chop-brown text-base">
                    {item.name}
                  </span>
                  <span className="text-chop-light-brown text-sm">
                    x{item.quantity}
                  </span>
                </div>
                <span className="text-chop-brown text-base">
                  ${item.price.toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Price Breakdown */}
          <div className="space-y-0">
            <div className="bg-chop-cream h-14 flex items-center justify-between px-4">
              <span className="text-chop-brown text-base">Subtotal</span>
              <span className="text-chop-brown text-base">${subtotal.toFixed(2)}</span>
            </div>
            <div className="bg-chop-cream h-14 flex items-center justify-between px-4">
              <span className="text-chop-brown text-base">Delivery Fee</span>
              <span className="text-chop-brown text-base">${deliveryFee.toFixed(2)}</span>
            </div>
            <div className="bg-chop-cream h-14 flex items-center justify-between px-4">
              <span className="text-chop-brown text-base">Total</span>
              <span className="text-chop-brown text-base">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Special Requests */}
        <div className="px-4 py-4">
          <h2 className="text-lg font-bold text-chop-brown mb-4 font-jakarta">
            Special Requests
          </h2>
          <div className="w-full h-36 p-4 border border-chop-border rounded-lg bg-chop-cream text-chop-brown">
            No special requests
          </div>
        </div>

        {/* Payment Method */}
        <div className="px-4 py-4">
          <h2 className="text-lg font-bold text-chop-brown mb-4 font-jakarta">
            Payment Method
          </h2>
          <div className="flex items-center justify-between p-4 border border-chop-border rounded-lg bg-white">
            <span className="text-chop-brown text-sm font-medium">PayPal</span>
            <div className="w-5 h-5 rounded-full bg-chop-orange border-2 border-chop-orange">
              <div className="w-full h-full rounded-full bg-white m-0.5"></div>
            </div>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="px-4 py-4">
          <h2 className="text-lg font-bold text-chop-brown mb-4 font-jakarta">
            Delivery Address
          </h2>
          <div className="w-full h-8 p-4 border border-chop-border rounded-lg bg-chop-cream text-chop-brown">
            123 Seoul Street, Gangnam-gu, Seoul
          </div>
        </div>

        {/* Entry Instructions */}
        <div className="px-4 py-4">
          <div className="w-full h-14 p-4 border border-chop-border rounded-lg bg-chop-cream text-chop-brown">
            Entry Instructions (Optional)
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <div className="bg-gray-100 border-2 border-chop-orange p-2">
        <div className="bg-white rounded-lg p-5 text-center">
          <h3 className="text-xl font-bold text-chop-brown mb-2 font-jakarta">
            Confirm your order
          </h3>
          <p className="text-sm font-medium text-chop-brown mb-4">
            Once confirmed, orders cannot be canceled or refunded. Please review carefully before proceeding.
          </p>
          
          <div className="flex gap-3">
            <button 
              onClick={handleGoBack}
              className="flex-1 bg-chop-border text-chop-brown py-3 rounded-lg font-bold text-base hover:bg-gray-200 transition-colors"
            >
              Go back
            </button>
            <button 
              onClick={handleConfirmOrder}
              className="flex-1 bg-chop-orange text-white py-3 rounded-lg font-bold text-base hover:bg-orange-600 transition-colors"
            >
              Confirm order
            </button>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default CheckoutConfirmation;
