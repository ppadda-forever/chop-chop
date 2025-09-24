import { NextResponse } from 'next/server'
import { sendOrderNotifications } from '../../../services/notificationService'

// 테스트용 목업 주문 데이터
const mockOrder = {
  id: 'test-order-' + Date.now(),
  accommodationId: 'test-accommodation-id',
  totalAmount: 25000,
  deliveryFee: 3000,
  status: 'PENDING',
  paymentMethod: 'paypal',
  paymentStatus: 'COMPLETED',
  notes: '문 앞에 놓아주세요. 벨 누르지 마세요.',
  createdAt: new Date().toISOString(),
  accommodation: {
    id: 'test-accommodation-id',
    name: '그랜드 호텔 서울',
    address: '서울시 강남구 테헤란로 123',
    qrCode: 'GRAND_HOTEL_SEOUL'
  },
  orderItems: [
    {
      id: 'item-1',
      menuItemId: 'menu-1',
      quantity: 2,
      unitPrice: 15000,
      menuItem: {
        id: 'menu-1',
        name: '불고기 버거',
        restaurant: {
          id: 'restaurant-1',
          name: '맘스터치'
        }
      },
      optionSelections: [
        {
          id: 'option-1',
          menuOption: {
            id: 'opt-1',
            name: '치즈 추가'
          }
        }
      ]
    },
    {
      id: 'item-2',
      menuItemId: 'menu-2',
      quantity: 1,
      unitPrice: 10000,
      menuItem: {
        id: 'menu-2',
        name: '감자튀김 (대)',
        restaurant: {
          id: 'restaurant-1',
          name: '맘스터치'
        }
      },
      optionSelections: []
    }
  ]
}

export async function POST(request) {
  try {
    console.log('Testing Discord notification...')
    
    // Discord 웹훅 URL 확인
    if (!process.env.DISCORD_WEBHOOK_URL) {
      return NextResponse.json({
        success: false,
        error: 'DISCORD_WEBHOOK_URL not configured in environment variables',
        message: 'Please add DISCORD_WEBHOOK_URL to your .env.local file'
      }, { status: 400 })
    }

    const notificationConfig = {
      discord: {
        webhookUrl: process.env.DISCORD_WEBHOOK_URL
      }
    }

    // 알림 전송 테스트
    await sendOrderNotifications(mockOrder, notificationConfig)

    console.log('Discord notification test completed successfully')
    
    return NextResponse.json({
      success: true,
      message: 'Discord notification sent successfully!',
      testOrder: {
        id: mockOrder.id,
        total: mockOrder.totalAmount + mockOrder.deliveryFee,
        items: mockOrder.orderItems.length
      }
    })
    
  } catch (error) {
    console.error('Discord notification test failed:', error)
    
    return NextResponse.json({
      success: false,
      error: error.message,
      message: 'Failed to send Discord notification. Check server logs for details.'
    }, { status: 500 })
  }
}

export async function GET(request) {
  return NextResponse.json({
    message: 'Discord Notification Test Endpoint',
    instructions: [
      '1. Configure DISCORD_WEBHOOK_URL in your .env.local file',
      '2. Send a POST request to this endpoint to test Discord notifications',
      '3. Check your Discord channel for the test notification'
    ],
    webhookConfigured: !!process.env.DISCORD_WEBHOOK_URL
  })
}
