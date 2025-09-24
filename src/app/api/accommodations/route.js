import { NextResponse } from 'next/server'
import { getAllAccommodations } from '../../../services/accommodationService.js'

export async function GET(request) {
  try {
    const accommodations = await getAllAccommodations()
    return NextResponse.json(accommodations)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch accommodations' },
      { status: 500 }
    )
  }
}
