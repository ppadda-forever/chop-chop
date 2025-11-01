import { NextResponse } from 'next/server'
import { getAccommodationByQrCode } from '../../../../services/accommodationService.js'

export async function GET(request, { params }) {
  try {
    const { qrCode } = await params
    const accommodation = await getAccommodationByQrCode(qrCode)
    
    if (!accommodation) {
      return NextResponse.json(
        { error: 'Accommodation not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(accommodation)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch accommodation' },
      { status: 500 }
    )
  }
}
