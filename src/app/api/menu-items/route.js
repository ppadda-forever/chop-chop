import { NextResponse } from 'next/server'
import { getPopularMenuItems, getPopularMenuItemsByArea } from '../../../services/menuService.js'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const popular = searchParams.get('popular')
    const area = searchParams.get('area')
    
    let menuItems
    if (popular === 'true') {
      if (area) {
        menuItems = await getPopularMenuItemsByArea(area)
      } else {
        menuItems = await getPopularMenuItems()
      }
    } else {
      menuItems = []
    }
    
    return NextResponse.json(menuItems)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch menu items' },
      { status: 500 }
    )
  }
}
