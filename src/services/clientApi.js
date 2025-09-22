// Client-side API functions for Next.js

const API_BASE_URL = '/api'

// Restaurant API functions
export async function getRestaurants(category = null) {
  try {
    const url = category 
      ? `${API_BASE_URL}/restaurants?category=${category}`
      : `${API_BASE_URL}/restaurants`
    
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error('Failed to fetch restaurants')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching restaurants:', error)
    throw error
  }
}

export async function getRestaurantById(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/restaurants/${id}`)
    if (!response.ok) {
      throw new Error('Failed to fetch restaurant')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching restaurant:', error)
    throw error
  }
}

export async function getRestaurantsByCategory(category) {
  return getRestaurants(category)
}

// Menu API functions
export async function getPopularMenuItems() {
  try {
    const response = await fetch(`${API_BASE_URL}/menu-items?popular=true`)
    if (!response.ok) {
      throw new Error('Failed to fetch popular menu items')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching popular menu items:', error)
    throw error
  }
}

export async function getMenuItemById(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/menu-items/${id}`)
    if (!response.ok) {
      throw new Error('Failed to fetch menu item')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching menu item:', error)
    throw error
  }
}
