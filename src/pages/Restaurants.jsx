import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRestaurantsByCategory } from '../services/clientApi';
import Header from '../components/Header';
import BottomNavigation from '../components/BottomNavigation';

const Restaurants = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('KOREAN');
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    'KOREAN', 'CHICKEN', 'BUNSIK', 'PIZZA', 'ASIAN', 'BURGERS', 
    'DESSERTS', 'GRILLED', 'JOKBAL', 'STEW', 'SEAFOOD', 'SALADS', 
    'MEXICAN', 'VEGAN', 'HALAL'
  ];

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const data = await getRestaurantsByCategory(selectedCategory);
        setRestaurants(data);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [selectedCategory]);

  return (
    <div className="bg-chop-cream min-h-screen flex flex-col">
      <Header title="Restaurants" />
      
      <div className="flex-1">
        {/* Category Filters */}
        <div className="px-3 py-3">
          <div className="flex gap-3 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? 'bg-chop-light-gray text-chop-dark-brown'
                    : 'bg-chop-light-gray text-chop-dark-brown'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Restaurant List */}
        <div className="px-4">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="text-chop-brown">Loading...</div>
            </div>
          ) : restaurants.length === 0 ? (
            <div className="flex justify-center items-center h-40">
              <div className="text-chop-brown">No restaurants found in this category</div>
            </div>
          ) : (
            restaurants.map((restaurant) => (
              <div 
                key={restaurant.id}
                onClick={() => navigate(`/restaurant/${restaurant.id}`)}
                className="bg-chop-cream min-h-[72px] flex items-center gap-4 px-4 py-2 mb-0 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div 
                  className="w-14 h-14 rounded-lg bg-cover bg-center flex-shrink-0"
                  style={{ backgroundImage: `url(${restaurant.image})` }}
                />
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-chop-dark-brown text-base mb-1 font-jakarta">
                    {restaurant.name}
                  </h3>
                  <p className="text-chop-red text-sm">
                    {restaurant.category} · Minimum order: ₩{restaurant.minOrderAmount.toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Restaurants;
