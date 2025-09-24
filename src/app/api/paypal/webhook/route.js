import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'
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

// PayPal 웹훅 이벤트 검증
async function verifyPayPalWebhook(headers, body, webhookId) {
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

// 결제 완료 처리
async function handlePaymentCompleted(event) {
  try {
    const resource = event.resource
    const orderId = resource.supplementary_data?.related_ids?.order_id

    if (!orderId) {
      console.warn('No order ID found in payment completion event')
      return
    }

    // 데이터베이스에서 주문 찾기
    const order = await prisma.order.findFirst({
      where: {
        paypalOrderId: orderId,
      },
    })

    if (!order) {
      console.warn(`Order not found for PayPal order ID: ${orderId}`)
      return
    }

    // 주문 상태 업데이트
    await prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        paymentStatus: 'COMPLETED',
        status: 'CONFIRMED',
        paypalCaptureId: resource.id,
        paymentDetails: {
          ...order.paymentDetails,
          webhookEvent: event,
          completedAt: new Date().toISOString(),
        },
      },
    })

    console.log(`Payment completed for order ${order.id}`)
  } catch (error) {
    console.error('Error handling payment completion:', error)
    throw error
  }
}

// 결제 실패 처리
async function handlePaymentFailed(event) {
  try {
    const resource = event.resource
    const orderId = resource.supplementary_data?.related_ids?.order_id

    if (!orderId) {
      console.warn('No order ID found in payment failed event')
      return
    }

    // 데이터베이스에서 주문 찾기
    const order = await prisma.order.findFirst({
      where: {
        paypalOrderId: orderId,
      },
    })

    if (!order) {
      console.warn(`Order not found for PayPal order ID: ${orderId}`)
      return
    }

    // 주문 상태 업데이트
    await prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        paymentStatus: 'FAILED',
        status: 'CANCELLED',
        paymentDetails: {
          ...order.paymentDetails,
          webhookEvent: event,
          failedAt: new Date().toISOString(),
        },
      },
    })

    console.log(`Payment failed for order ${order.id}`)
  } catch (error) {
    console.error('Error handling payment failure:', error)
    throw error
  }
}

// PayPal 웹훅 처리
export async function POST(request) {
  try {
    const body = await request.json()
    const headers = Object.fromEntries(request.headers.entries())

    console.log('PayPal webhook received:', body.event_type)

    // 웹훅 검증 (프로덕션에서는 필수)
    const webhookId = process.env.PAYPAL_WEBHOOK_ID
    if (webhookId && paypalConfig.environment === 'live') {
      const isValid = await verifyPayPalWebhook(headers, body, webhookId)
      if (!isValid) {
        console.error('PayPal webhook verification failed')
        return NextResponse.json(
          { error: 'Webhook verification failed' },
          { status: 401 }
        )
      }
    }

    // 이벤트 타입별 처리
    switch (body.event_type) {
      case 'PAYMENT.CAPTURE.COMPLETED':
        await handlePaymentCompleted(body)
        break

      case 'PAYMENT.CAPTURE.DENIED':
      case 'PAYMENT.CAPTURE.FAILED':
        await handlePaymentFailed(body)
        break

      case 'CHECKOUT.ORDER.APPROVED':
        console.log('Order approved:', body.resource.id)
        break

      case 'CHECKOUT.ORDER.COMPLETED':
        console.log('Order completed:', body.resource.id)
        break

      default:
        console.log(`Unhandled webhook event: ${body.event_type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing PayPal webhook:', error)
    return NextResponse.json(
      { 
        error: 'Failed to process webhook',
        details: error.message 
      },
      { status: 500 }
    )
  }
}
