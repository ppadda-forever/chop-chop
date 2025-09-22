import { NextResponse } from 'next/server'
import { getAllRestaurants, getRestaurantsByCategory } from '../../../services/restaurantService.js'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    
    let restaurants
    if (category) {
      restaurants = await getRestaurantsByCategory(category)
    } else {
      restaurants = await getAllRestaurants()
    }
    
    return NextResponse.json(restaurants)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch restaurants' },
      { status: 500 }
    )
  }
}
