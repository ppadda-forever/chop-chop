import { NextResponse } from 'next/server'
import { paypalConfig } from '../../../../config/paypal'

// PayPal API 기본 URL
const PAYPAL_API_BASE = paypalConfig.apiBaseUrl

// PayPal 액세스 토큰 생성
async function generateAccessToken() {
  try {
    if (!paypalConfig.clientId || !paypalConfig.clientSecret) {
      throw new Error('PayPal client credentials are missing')
    }

    const auth = Buffer.from(
      `${paypalConfig.clientId}:${paypalConfig.clientSecret}`
    ).toString('base64')

    const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
      method: 'POST',
      body: 'grant_type=client_credentials',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to generate PayPal access token')
    }

    const data = await response.json()
    return data.access_token
  } catch (error) {
    console.error('Error generating PayPal access token:', error)
    throw error
  }
}

// PayPal 주문 생성
async function createPayPalOrder(amount, currency = 'KRW') {
  const accessToken = await generateAccessToken()

  const requestBody = {
    intent: 'CAPTURE',
    purchase_units: [
      {
        amount: {
          currency_code: currency,
          value: amount.toString(),
        },
        description: 'ChopChop Food Order',
      },
    ],
    application_context: {
      return_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/checkout-confirmation`,
      cancel_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/checkout`,
      shipping_preference: 'NO_SHIPPING',
      user_action: 'PAY_NOW',
      brand_name: 'ChopChop',
    },
  }

  const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      'PayPal-Request-Id': `${Date.now()}`, // 중복 요청 방지
    },
    body: JSON.stringify(requestBody),
  })

  if (!response.ok) {
    const errorData = await response.json()
    console.error('PayPal create order error:', errorData)
    throw new Error(`PayPal API error: ${response.status}`)
  }

  return response.json()
}

// API 핸들러
export async function POST(request) {
  try {
    const { amount, currency = 'KRW' } = await request.json()

    // 입력값 검증
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Valid amount is required' },
        { status: 400 }
      )
    }

    // PayPal 주문 생성
    const order = await createPayPalOrder(amount, currency)

    console.log('PayPal order created:', order.id)

    return NextResponse.json(order)
  } catch (error) {
    console.error('Error creating PayPal order:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to create PayPal order',
        details: error.message 
      },
      { status: 500 }
    )
  }
}
