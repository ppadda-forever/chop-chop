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

// PayPal 주문 승인 및 결제 캡처
async function capturePayPalOrder(orderID) {
  const accessToken = await generateAccessToken()

  const response = await fetch(
    `${PAYPAL_API_BASE}/v2/checkout/orders/${orderID}/capture`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )

  if (!response.ok) {
    const errorData = await response.json()
    console.error('PayPal capture order error:', errorData)
    throw new Error(`PayPal capture failed: ${response.status}`)
  }

  return response.json()
}

// PayPal 주문 상세 정보 조회
async function getPayPalOrderDetails(orderID) {
  const accessToken = await generateAccessToken()

  const response = await fetch(
    `${PAYPAL_API_BASE}/v2/checkout/orders/${orderID}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )

  if (!response.ok) {
    const errorData = await response.json()
    console.error('PayPal get order error:', errorData)
    throw new Error(`Failed to get PayPal order: ${response.status}`)
  }

  return response.json()
}

// API 핸들러
export async function POST(request) {
  try {
    const { orderID } = await request.json()

    // 입력값 검증
    if (!orderID) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      )
    }

    // PayPal 주문 캡처 (결제 승인)
    const captureData = await capturePayPalOrder(orderID)

    console.log('PayPal payment captured:', captureData.id)

    // 결제 상태 확인
    const captureStatus = captureData.purchase_units[0]?.payments?.captures[0]?.status

    if (captureStatus === 'COMPLETED') {
      // 결제 성공
      return NextResponse.json({
        success: true,
        orderID: orderID,
        captureID: captureData.purchase_units[0].payments.captures[0].id,
        status: captureStatus,
        amount: captureData.purchase_units[0].payments.captures[0].amount,
        captureData: captureData,
      })
    } else {
      // 결제 실패
      return NextResponse.json(
        { 
          error: 'Payment capture failed',
          status: captureStatus,
          details: captureData 
        },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Error capturing PayPal payment:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to capture PayPal payment',
        details: error.message 
      },
      { status: 500 }
    )
  }
}
