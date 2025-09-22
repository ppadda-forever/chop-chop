import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRestaurantById } from '../services/clientApi';
import Header from '../components/Header';
import BottomNavigation from '../components/BottomNavigation';

const RestaurantMenu = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        setLoading(true);
        const data = await getRestaurantById(id);
        setRestaurant(data);
      } catch (error) {
        console.error('Error fetching restaurant:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRestaurant();
    }
  }, [id]);

  const addToCart = (item) => {
    setCart(prev => {
      const existingItem = prev.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.basePrice * item.quantity), 0);
  };

  if (loading) {
    return (
      <div className="bg-chop-cream min-h-screen flex items-center justify-center">
        <p className="text-chop-brown">Loading...</p>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="bg-chop-cream min-h-screen flex items-center justify-center">
        <p className="text-chop-brown">Restaurant not found</p>
      </div>
    );
  }

  return (
    <div className="bg-chop-cream min-h-screen flex flex-col">
      <Header title={restaurant.name} showBackButton={true} />
      
      <div className="flex-1">
        {/* Restaurant Hero Image */}
        <div 
          className="h-56 bg-cover bg-center"
          style={{ backgroundImage: `url(${restaurant.image})` }}
        />

        {/* Menu Section */}
        <div className="px-4 py-5">
          <h2 className="text-xl font-bold text-chop-brown mb-4 font-jakarta">
            Menu
          </h2>
          
          <div className="space-y-0">
            {restaurant.menuItems.map((item) => (
              <div key={item.id} className="bg-chop-cream min-h-[72px] flex items-center justify-between px-4 py-2">
                <div 
                  className="flex gap-4 items-center flex-1 cursor-pointer"
                  onClick={() => navigate(`/menu-item/${item.id}`)}
                >
                  <div 
                    className="w-14 h-14 rounded-lg bg-cover bg-center flex-shrink-0"
                    style={{ backgroundImage: `url(${item.image})` }}
                  />
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-chop-brown text-base mb-1 font-jakarta">
                      {item.name} (₩{item.basePrice.toLocaleString()})
                    </h3>
                    <p className="text-chop-light-brown text-sm">
                      {item.description}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => addToCart(item)}
                  className="bg-chop-orange w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 hover:bg-orange-600 transition-colors"
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Order Button */}
      {cart.length > 0 && (
        <div className="px-4 py-3 bg-chop-cream border-t border-chop-border">
          <button 
            onClick={() => navigate('/checkout')}
            className="w-full bg-chop-orange text-white py-3 rounded-lg font-bold text-base hover:bg-orange-600 transition-colors"
          >
            Order Now (₩{getTotalPrice().toLocaleString()})
          </button>
        </div>
      )}

      <BottomNavigation />
    </div>
  );
};

export default RestaurantMenu;
