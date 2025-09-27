import { NextResponse } from 'next/server'
import { capturePayPalOrder } from '../../../../lib/paypal'

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