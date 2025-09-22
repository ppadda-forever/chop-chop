import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import BottomNavigation from '../components/BottomNavigation';

const Checkout = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('paypal');
  const [specialRequests, setSpecialRequests] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [entryInstructions, setEntryInstructions] = useState('');

  // Mock order data
  const orderItems = [
    { name: 'Kimchi Fried Rice', quantity: 1, price: 12.99 },
    { name: 'Spicy Tteokbokki', quantity: 1, price: 9.99 },
    { name: 'Bulgogi Bibimbap', quantity: 1, price: 14.99 }
  ];

  const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 2.99;
  const total = subtotal + deliveryFee;

  const handleConfirmOrder = () => {
    // Process order logic here
    console.log('Order confirmed:', {
      items: orderItems,
      paymentMethod,
      specialRequests,
      deliveryAddress,
      entryInstructions,
      total
    });
    navigate('/checkout-confirmation');
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
          <textarea
            value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
            placeholder="Any special instructions for your order?"
            className="w-full h-36 p-4 border border-chop-border rounded-lg bg-chop-cream text-chop-brown placeholder-chop-light-brown resize-none"
          />
        </div>

        {/* Payment Method */}
        <div className="px-4 py-4">
          <h2 className="text-lg font-bold text-chop-brown mb-4 font-jakarta">
            Payment Method
          </h2>
          <div className="space-y-3">
            <div 
              className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer ${
                paymentMethod === 'paypal' ? 'border-chop-orange bg-orange-50' : 'border-chop-border bg-white'
              }`}
              onClick={() => setPaymentMethod('paypal')}
            >
              <span className="text-chop-brown text-sm font-medium">PayPal</span>
              <div className={`w-5 h-5 rounded-full border-2 ${
                paymentMethod === 'paypal' ? 'bg-chop-orange border-chop-orange' : 'border-chop-border'
              }`}>
                {paymentMethod === 'paypal' && (
                  <div className="w-full h-full rounded-full bg-white m-0.5"></div>
                )}
              </div>
            </div>
            <div 
              className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer ${
                paymentMethod === 'credit' ? 'border-chop-orange bg-orange-50' : 'border-chop-border bg-white'
              }`}
              onClick={() => setPaymentMethod('credit')}
            >
              <span className="text-chop-brown text-sm font-medium">Credit Card</span>
              <div className={`w-5 h-5 rounded-full border-2 ${
                paymentMethod === 'credit' ? 'bg-chop-orange border-chop-orange' : 'border-chop-border'
              }`}>
                {paymentMethod === 'credit' && (
                  <div className="w-full h-full rounded-full bg-white m-0.5"></div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="px-4 py-4">
          <h2 className="text-lg font-bold text-chop-brown mb-4 font-jakarta">
            Delivery Address
          </h2>
          <input
            type="text"
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            placeholder="Enter your delivery address"
            className="w-full h-8 p-4 border border-chop-border rounded-lg bg-chop-cream text-chop-brown placeholder-chop-light-brown"
          />
        </div>

        {/* Entry Instructions */}
        <div className="px-4 py-4">
          <input
            type="text"
            value={entryInstructions}
            onChange={(e) => setEntryInstructions(e.target.value)}
            placeholder="Entry Instructions (Optional)"
            className="w-full h-14 p-4 border border-chop-border rounded-lg bg-chop-cream text-chop-brown placeholder-chop-light-brown"
          />
        </div>
      </div>

      {/* Confirm Order Button */}
      <div className="px-4 py-3 bg-chop-cream">
        <button 
          onClick={handleConfirmOrder}
          className="w-full bg-chop-orange text-white py-3 rounded-lg font-bold text-base hover:bg-orange-600 transition-colors"
        >
          Confirm Order
        </button>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Checkout;
