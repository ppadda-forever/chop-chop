import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Restaurants from './pages/Restaurants';
import RestaurantMenu from './pages/RestaurantMenu';
import MenuOption from './pages/MenuOption';
import Checkout from './pages/Checkout';
import CheckoutConfirmation from './pages/CheckoutConfirmation';
import Help from './pages/Help';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/restaurant/:id" element={<RestaurantMenu />} />
          <Route path="/menu-item/:id" element={<MenuOption />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/checkout-confirmation" element={<CheckoutConfirmation />} />
          <Route path="/orders" element={<div className="min-h-screen bg-chop-cream flex items-center justify-center"><p className="text-chop-brown">Orders page coming soon!</p></div>} />
          <Route path="/help" element={<Help />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
