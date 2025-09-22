// Mock API for testing when database is not available
import { restaurants, recommendedDishes } from '../data/mockData.js'

// Mock popular menu items (convert from recommended dishes)
export async function getPopularMenuItems() {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Convert recommended dishes to menu item format
    const popularItems = recommendedDishes.map(dish => ({
      id: dish.id,
      name: dish.name,
      description: dish.description,
      basePrice: 15000, // Default price
      image: dish.image,
      isPopular: true,
      isAvailable: true,
      restaurant: {
        id: dish.restaurantId,
        name: "Sample Restaurant"
      },
      menuOptions: []
    }))
    
    return popularItems
  } catch (error) {
    console.error('Error fetching popular menu items:', error)
    throw new Error('Failed to fetch popular menu items')
  }
}

// Mock restaurants
export async function getRestaurants() {
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    return restaurants.map(restaurant => ({
      ...restaurant,
      minOrderAmount: restaurant.minOrder,
      menuItems: restaurant.menu || []
    }))
  } catch (error) {
    console.error('Error fetching restaurants:', error)
    throw new Error('Failed to fetch restaurants')
  }
}

// Mock restaurant by ID
export async function getRestaurantById(id) {
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    const restaurant = restaurants.find(r => r.id === id)
    if (!restaurant) {
      throw new Error('Restaurant not found')
    }
    return {
      ...restaurant,
      minOrderAmount: restaurant.minOrder,
      menuItems: restaurant.menu || []
    }
  } catch (error) {
    console.error('Error fetching restaurant:', error)
    throw new Error('Failed to fetch restaurant')
  }
}

// Mock restaurants by category
export async function getRestaurantsByCategory(category) {
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    const filteredRestaurants = restaurants.filter(r => r.category === category)
    return filteredRestaurants.map(restaurant => ({
      ...restaurant,
      minOrderAmount: restaurant.minOrder,
      menuItems: restaurant.menu || []
    }))
  } catch (error) {
    console.error('Error fetching restaurants by category:', error)
    throw new Error('Failed to fetch restaurants by category')
  }
}

// Mock menu item by ID
export async function getMenuItemById(id) {
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Find menu item in all restaurants
    for (const restaurant of restaurants) {
      if (restaurant.menu) {
        const menuItem = restaurant.menu.find(item => item.id === id)
        if (menuItem) {
          return {
            ...menuItem,
            basePrice: menuItem.price,
            restaurant: {
              id: restaurant.id,
              name: restaurant.name
            },
            menuOptions: menuItem.options ? Object.entries(menuItem.options).map(([type, values], index) => 
              values.map((value, valueIndex) => ({
                id: `${type}-${valueIndex}`,
                type: type.toUpperCase(),
                name: value,
                nameEn: value,
                nameJp: value,
                nameCn: value,
                price: type === 'size' && value === 'Large' ? 2000 : 0,
                isRequired: type === 'size',
                isActive: true,
                sortOrder: valueIndex + 1
              }))
            ).flat() : []
          }
        }
      }
    }
    
    throw new Error('Menu item not found')
  } catch (error) {
    console.error('Error fetching menu item:', error)
    throw new Error('Failed to fetch menu item')
  }
}
