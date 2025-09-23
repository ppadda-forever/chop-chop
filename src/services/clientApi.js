// Client-side API functions for Next.js

const API_BASE_URL = '/api'

// Restaurant API functions
export async function getRestaurants(category = null, area = null) {
  try {
    const params = new URLSearchParams()
    if (category) params.append('category', category)
    if (area) params.append('area', area)
    
    const url = `${API_BASE_URL}/restaurants${params.toString() ? `?${params.toString()}` : ''}`
    
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

export async function getRestaurantsByArea(area) {
  return getRestaurants(null, area)
}

// Accommodation API functions
export async function getAccommodationByQrCode(qrCode) {
  try {
    const response = await fetch(`${API_BASE_URL}/accommodations/${qrCode}`)
    if (!response.ok) {
      throw new Error('Failed to fetch accommodation')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching accommodation:', error)
    throw error
  }
}

// Menu API functions
export async function getPopularMenuItems(area = null) {
  try {
    const params = new URLSearchParams({ popular: 'true' })
    if (area) {
      params.append('area', area)
    }
    
    const response = await fetch(`${API_BASE_URL}/menu-items?${params.toString()}`)
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
