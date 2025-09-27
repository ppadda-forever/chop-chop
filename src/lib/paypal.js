import { paypalConfig } from '../config/paypal'

// PayPal API 기본 URL
const PAYPAL_API_BASE = paypalConfig.apiBaseUrl

/**
 * PayPal 액세스 토큰 생성 (공통 함수)
 */
export async function generateAccessToken() {
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

/**
 * PayPal 주문 생성
 */
export async function createPayPalOrder(amount, currency) {
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
      return_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/paypal-success`,
      cancel_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/paypal-cancel`,
      shipping_preference: 'NO_SHIPPING',
      user_action: 'PAY_NOW',
      brand_name: 'Chop Chop',
    },
  }

  const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      'PayPal-Request-Id': `${Date.now()}`,
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

/**
 * PayPal 주문 캡처 (결제 승인)
 */
export async function capturePayPalOrder(orderID) {
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

/**
 * PayPal 주문 상세 정보 조회
 */
export async function getPayPalOrderDetails(orderID) {
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

/**
 * PayPal 웹훅 이벤트 검증
 */
export async function verifyPayPalWebhook(headers, body, webhookId) {
  try {
    const accessToken = await generateAccessToken()

    const verificationData = {
      auth_algo: headers['paypal-auth-algo'],
      cert_id: headers['paypal-cert-id'],
      transmission_id: headers['paypal-transmission-id'],
      transmission_sig: headers['paypal-transmission-sig'],
      transmission_time: headers['paypal-transmission-time'],
      webhook_id: webhookId,
      webhook_event: body,
    }

    const response = await fetch(
      `${PAYPAL_API_BASE}/v1/notifications/verify-webhook-signature`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(verificationData),
      }
    )

    if (!response.ok) {
      console.error('PayPal webhook verification failed:', response.status)
      return false
    }

    const result = await response.json()
    return result.verification_status === 'SUCCESS'
  } catch (error) {
    console.error('Error verifying PayPal webhook:', error)
    return false
  }
}