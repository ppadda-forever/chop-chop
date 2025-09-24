import { NextResponse } from 'next/server'
import { getCachedExchangeRate } from '../../../lib/exchangeRateCache'

export async function GET() {
  try {
    const exchangeRate = await getCachedExchangeRate()
    
    return NextResponse.json({
      success: true,
      data: exchangeRate
    })
  } catch (error) {
    console.error('Error fetching exchange rate:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch exchange rate',
      fallback: {
        krwToUsd: 0.00077,
        usdToKrw: 1300,
        lastUpdated: new Date().toISOString(),
        base: 'KRW'
      }
    }, { status: 500 })
  }
}
