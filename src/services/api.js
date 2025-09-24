// Re-export from restaurant service
export { 
  getAllRestaurants as getRestaurants,
  getRestaurantById,
  getRestaurantsByCategory,
  getRestaurantsByArea,
  getPopularRestaurants,
  searchRestaurants,
  getRestaurantStats
} from './restaurantService.js'

// Re-export from menu service
export {
  getAllMenuItems,
  getMenuItemById,
  getPopularMenuItems,
  getMenuItemsByRestaurant,
  getMenuItemsByCategory,
  getMenuItemsByPriceRange,
  searchMenuItems
} from './menuService.js'

// Re-export from order service
export {
  createOrder,
  getOrderById,
  getOrdersByAccommodation,
  updateOrderStatus,
  updatePaymentStatus,
  getAllOrders,
  getOrderStats
} from './orderService.js'

// Re-export from accommodation service
export {
  getAllAccommodations as getAccommodations,
  getAccommodationById,
  getAccommodationByQrCode,
  getAccommodationsByArea,
  createAccommodation,
  updateAccommodation,
  deleteAccommodation,
  getAccommodationStats
} from './accommodationService.js'

