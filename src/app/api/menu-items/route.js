import { NextResponse } from 'next/server'
import { getPopularMenuItems } from '../../../services/menuService.js'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const popular = searchParams.get('popular')
    
    let menuItems
    if (popular === 'true') {
      menuItems = await getPopularMenuItems()
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
