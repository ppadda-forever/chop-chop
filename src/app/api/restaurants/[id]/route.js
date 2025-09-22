import { NextResponse } from 'next/server'
import { getRestaurantById } from '../../../../services/restaurantService.js'

export async function GET(request, { params }) {
  try {
    const { id } = await params
    const restaurant = await getRestaurantById(id)
    
    return NextResponse.json(restaurant)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Restaurant not found' },
      { status: 404 }
    )
  }
}
