/**
 * Test utility for notification system
 * Run this to test your notification setup without placing a real order
 */

import { sendOrderNotifications } from '../services/notificationService.js'

// Mock order data for testing
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

/**
 * Test Discord notification
 */
export async function testDiscordNotification() {
  if (!process.env.DISCORD_WEBHOOK_URL) {
    console.error('❌ DISCORD_WEBHOOK_URL not configured in environment variables')
    return false
  }

  console.log('🧪 Testing Discord notification...')
  
  try {
    const config = {
      discord: {
        webhookUrl: process.env.DISCORD_WEBHOOK_URL
      }
    }
    
    await sendOrderNotifications(mockOrder, config)
    console.log('✅ Discord notification test completed')
    return true
  } catch (error) {
    console.error('❌ Discord notification test failed:', error.message)
    return false
  }
}

/**
 * Test Slack notification
 */
export async function testSlackNotification() {
  if (!process.env.SLACK_WEBHOOK_URL) {
    console.error('❌ SLACK_WEBHOOK_URL not configured in environment variables')
    return false
  }

  console.log('🧪 Testing Slack notification...')
  
  try {
    const config = {
      slack: {
        webhookUrl: process.env.SLACK_WEBHOOK_URL
      }
    }
    
    await sendOrderNotifications(mockOrder, config)
    console.log('✅ Slack notification test completed')
    return true
  } catch (error) {
    console.error('❌ Slack notification test failed:', error.message)
    return false
  }
}

/**
 * Test Telegram notification
 */
export async function testTelegramNotification() {
  if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) {
    console.error('❌ TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not configured')
    return false
  }

  console.log('🧪 Testing Telegram notification...')
  
  try {
    const config = {
      telegram: {
        botToken: process.env.TELEGRAM_BOT_TOKEN,
        chatId: process.env.TELEGRAM_CHAT_ID
      }
    }
    
    await sendOrderNotifications(mockOrder, config)
    console.log('✅ Telegram notification test completed')
    return true
  } catch (error) {
    console.error('❌ Telegram notification test failed:', error.message)
    return false
  }
}

/**
 * Test all configured notification channels
 */
export async function testAllNotifications() {
  console.log('🚀 Starting notification system tests...\n')
  
  const results = {
    discord: await testDiscordNotification(),
    slack: await testSlackNotification(),
    telegram: await testTelegramNotification()
  }
  
  console.log('\n📊 Test Results:')
  console.log('================')
  Object.entries(results).forEach(([channel, success]) => {
    const status = success ? '✅ PASS' : '❌ FAIL'
    console.log(`${channel.toUpperCase()}: ${status}`)
  })
  
  const passCount = Object.values(results).filter(Boolean).length
  const totalCount = Object.values(results).length
  
  console.log(`\n🎯 Overall: ${passCount}/${totalCount} channels working`)
  
  if (passCount === 0) {
    console.log('\n⚠️  No notification channels are configured.')
    console.log('📖 Please check NOTIFICATION_SETUP.md for setup instructions.')
  }
  
  return results
}

// If running this file directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testAllNotifications()
}
