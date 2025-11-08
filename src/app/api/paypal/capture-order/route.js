import { NextResponse } from 'next/server'
import { capturePayPalOrder } from '../../../../lib/paypal'

export async function POST(request) {
  try {
    console.log('=== PayPal Capture Order API ===')
    const { orderID } = await request.json()
    console.log('1. Order ID received:', orderID)

    // 입력값 검증
    if (!orderID) {
      console.error('❌ Order ID is missing')
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      )
    }

    // PayPal 주문 캡처 (결제 승인)
    console.log('2. Calling PayPal capture API...')
    const captureData = await capturePayPalOrder(orderID)

    console.log('3. PayPal payment captured:', captureData.id)
    console.log('4. Capture status:', captureData.status)

    // 결제 상태 확인
    const captureStatus = captureData.purchase_units[0]?.payments?.captures[0]?.status

    if (captureStatus === 'COMPLETED') {
      // 결제 성공
      console.log('5. ✅ Payment COMPLETED')
      console.log('6. Capture ID:', captureData.purchase_units[0].payments.captures[0].id)
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
      console.error('5. ❌ Payment NOT completed. Status:', captureStatus)
      console.error('6. Capture data:', JSON.stringify(captureData, null, 2))
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
    console.error('❌ Error capturing PayPal payment:', error)
    console.error('Error message:', error.message)
    console.error('Error stack:', error.stack)
    
    return NextResponse.json(
      { 
        error: 'Failed to capture PayPal payment',
        details: error.message 
      },
      { status: 500 }
    )
  }
}