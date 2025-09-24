import { NextResponse } from 'next/server'
import { getAllRestaurants, getRestaurantsByCategory, getRestaurantsByArea, getRestaurantsByAreaAndCategory } from '../../../services/restaurantService.js'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const area = searchParams.get('area')
    
    let restaurants
    
    if (area && category) {
      // 지역과 카테고리 모두 필터링
      restaurants = await getRestaurantsByAreaAndCategory(area, category)
    } else if (area) {
      // 지역만 필터링
      restaurants = await getRestaurantsByArea(area)
    } else if (category) {
      // 카테고리만 필터링
      restaurants = await getRestaurantsByCategory(category)
    } else {
      // 전체 조회
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
