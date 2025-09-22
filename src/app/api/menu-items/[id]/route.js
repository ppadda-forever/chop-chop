import { NextResponse } from 'next/server'
import { getMenuItemById } from '../../../../services/menuService.js'

export async function GET(request, { params }) {
  try {
    const { id } = await params
    const menuItem = await getMenuItemById(id)
    
    return NextResponse.json(menuItem)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Menu item not found' },
      { status: 404 }
    )
  }
}
