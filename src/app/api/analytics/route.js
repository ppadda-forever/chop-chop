// src/app/api/analytics/route.js
import { NextResponse } from 'next/server'
import { trackEvent } from '../../../services/analyticsService'

export async function POST(request) {
  try {
    const body = await request.json()
    const { sessionId, eventType, eventData } = body
    
    const clientIP = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    request.ip
    const userAgent = request.headers.get('user-agent')
    
    await trackEvent(eventType, sessionId, {
      ...eventData,
      ipAddress: clientIP,
      userAgent,
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json(
      { error: 'Failed to track event' },
      { status: 500 }
    )
  }
}