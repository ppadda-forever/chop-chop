import { NextResponse } from 'next/server'
import { createPayPalOrder } from '../../../../lib/paypal'

export async function POST(request) {
  try {
    const { amount, currency } = await request.json()

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