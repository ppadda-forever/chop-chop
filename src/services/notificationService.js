/**
 * Notification service for sending order alerts through various channels
 */

/**
 * Send Discord notification for new order
 * @param {Object} order - Order object with all details
 * @param {string} webhookUrl - Discord webhook URL
 */
export async function sendDiscordOrderNotification(order, webhookUrl) {
  if (!webhookUrl) {
    console.warn('Discord webhook URL not configured')
    return
  }

  try {
    // Format order items for display
    const orderItemsText = order.orderItems.map(item => {
      const options = item.optionSelections?.map(opt => opt.menuOption.name).join(', ')
      const optionText = options ? ` (${options})` : ''
      return `• ${item.menuItem.name}${optionText} x${item.quantity} - ₩${item.unitPrice.toLocaleString()}`
    }).join('\n')

    // Calculate total with delivery fee
    const totalWithDelivery = order.totalAmount + order.deliveryFee

    // Create rich embed for Discord
    const embed = {
      title: "🍽️ 새로운 주문이 들어왔습니다!",
      color: 0xFF6B35, // Orange color
      timestamp: new Date(order.createdAt).toISOString(),
      fields: [
        {
          name: "📋 주문 정보",
          value: `**주문 번호:** ${order.id}\n**결제 방법:** ${order.paymentMethod}\n**결제 상태:** ${order.paymentStatus}`,
          inline: false
        },
        {
          name: "🏨 숙소 정보",
          value: `**숙소명:** ${order.accommodation.name}\n**주소:** ${order.accommodation.address}`,
          inline: false
        },
        {
          name: "🛒 주문 내역",
          value: orderItemsText,
          inline: false
        },
        {
          name: "💰 금액 정보",
          value: `**주문 금액:** ₩${order.totalAmount.toLocaleString()}\n**배달비:** ₩${order.deliveryFee.toLocaleString()}\n**총 금액:** ₩${totalWithDelivery.toLocaleString()}`,
          inline: true
        }
      ],
      footer: {
        text: "ChopChop 주문 알림"
      }
    }

    // Add notes if present
    if (order.notes) {
      embed.fields.push({
        name: "📝 요청사항",
        value: order.notes,
        inline: false
      })
    }

    // Add restaurant info if available
    if (order.orderItems[0]?.menuItem?.restaurant) {
      embed.fields.splice(2, 0, {
        name: "🏪 레스토랑",
        value: order.orderItems[0].menuItem.restaurant.name,
        inline: true
      })
    }

    const payload = {
      content: `@here 새로운 주문 알림! 총 금액: ₩${totalWithDelivery.toLocaleString()}`,
      embeds: [embed]
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      throw new Error(`Discord webhook failed: ${response.status} ${response.statusText}`)
    }

    console.log(`Discord notification sent for order ${order.id}`)
  } catch (error) {
    console.error('Failed to send Discord notification:', error)
    // Don't throw error to avoid breaking order creation
  }
}

/**
 * Send Slack notification for new order
 * @param {Object} order - Order object with all details
 * @param {string} webhookUrl - Slack webhook URL
 */
export async function sendSlackOrderNotification(order, webhookUrl) {
  if (!webhookUrl) {
    console.warn('Slack webhook URL not configured')
    return
  }

  try {
    const orderItemsText = order.orderItems.map(item => {
      const options = item.optionSelections?.map(opt => opt.menuOption.name).join(', ')
      const optionText = options ? ` (${options})` : ''
      return `• ${item.menuItem.name}${optionText} x${item.quantity} - ₩${item.unitPrice.toLocaleString()}`
    }).join('\n')

    const totalWithDelivery = order.totalAmount + order.deliveryFee

    const payload = {
      text: `🍽️ 새로운 주문 알림! 총 금액: ₩${totalWithDelivery.toLocaleString()}`,
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: "🍽️ 새로운 주문이 들어왔습니다!"
          }
        },
        {
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: `*주문 번호:*\n${order.id}`
            },
            {
              type: "mrkdwn",
              text: `*결제 방법:*\n${order.paymentMethod}`
            },
            {
              type: "mrkdwn",
              text: `*숙소:*\n${order.accommodation.name}`
            },
            {
              type: "mrkdwn",
              text: `*총 금액:*\n₩${totalWithDelivery.toLocaleString()}`
            }
          ]
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*주문 내역:*\n${orderItemsText}`
          }
        }
      ]
    }

    if (order.notes) {
      payload.blocks.push({
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*요청사항:*\n${order.notes}`
        }
      })
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      throw new Error(`Slack webhook failed: ${response.status} ${response.statusText}`)
    }

    console.log(`Slack notification sent for order ${order.id}`)
  } catch (error) {
    console.error('Failed to send Slack notification:', error)
  }
}

/**
 * Send email notification for new order
 * @param {Object} order - Order object with all details
 * @param {Object} emailConfig - Email configuration (smtp settings, recipients)
 */
export async function sendEmailOrderNotification(order, emailConfig) {
  if (!emailConfig || !emailConfig.recipients || !emailConfig.smtp) {
    console.warn('Email configuration not provided')
    return
  }

  // Note: This is a basic structure. You'll need to install nodemailer
  // and configure SMTP settings for actual email sending
  console.log('Email notification would be sent for order:', order.id)
  console.log('Recipients:', emailConfig.recipients)
  
  // TODO: Implement actual email sending with nodemailer
  // const nodemailer = require('nodemailer')
  // const transporter = nodemailer.createTransporter(emailConfig.smtp)
  // await transporter.sendMail({ ... })
}

/**
 * Send SMS notification using Twilio
 * @param {Object} order - Order object with all details
 * @param {Object} smsConfig - SMS configuration (Twilio credentials, phone numbers)
 */
export async function sendSMSOrderNotification(order, smsConfig) {
  if (!smsConfig || !smsConfig.accountSid || !smsConfig.authToken) {
    console.warn('SMS configuration not provided')
    return
  }

  const totalWithDelivery = order.totalAmount + order.deliveryFee
  const message = `🍽️ 새 주문! ${order.accommodation.name}에서 ₩${totalWithDelivery.toLocaleString()} 주문 (${order.id})`

  console.log('SMS notification would be sent:', message)
  
  // TODO: Implement actual SMS sending with Twilio
  // const twilio = require('twilio')(smsConfig.accountSid, smsConfig.authToken)
  // await twilio.messages.create({ ... })
}

/**
 * Send Telegram notification
 * @param {Object} order - Order object with all details
 * @param {Object} telegramConfig - Telegram bot configuration (bot token, chat ID)
 */
export async function sendTelegramOrderNotification(order, telegramConfig) {
  if (!telegramConfig || !telegramConfig.botToken || !telegramConfig.chatId) {
    console.warn('Telegram configuration not provided')
    return
  }

  try {
    const orderItemsText = order.orderItems.map(item => {
      const options = item.optionSelections?.map(opt => opt.menuOption.name).join(', ')
      const optionText = options ? ` (${options})` : ''
      return `• ${item.menuItem.name}${optionText} x${item.quantity} - ₩${item.unitPrice.toLocaleString()}`
    }).join('\n')

    const totalWithDelivery = order.totalAmount + order.deliveryFee

    let message = `🍽️ *새로운 주문 알림!*\n\n`
    message += `📋 *주문 번호:* ${order.id}\n`
    message += `🏨 *숙소:* ${order.accommodation.name}\n`
    message += `💳 *결제:* ${order.paymentMethod} (${order.paymentStatus})\n\n`
    message += `🛒 *주문 내역:*\n${orderItemsText}\n\n`
    message += `💰 *총 금액:* ₩${totalWithDelivery.toLocaleString()}`
    
    if (order.notes) {
      message += `\n\n📝 *요청사항:* ${order.notes}`
    }

    const url = `https://api.telegram.org/bot${telegramConfig.botToken}/sendMessage`
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: telegramConfig.chatId,
        text: message,
        parse_mode: 'Markdown'
      })
    })

    if (!response.ok) {
      throw new Error(`Telegram API failed: ${response.status} ${response.statusText}`)
    }

    console.log(`Telegram notification sent for order ${order.id}`)
  } catch (error) {
    console.error('Failed to send Telegram notification:', error)
  }
}

/**
 * Send notification through all configured channels
 * @param {Object} order - Order object with all details
 * @param {Object} config - Notification configuration
 */
export async function sendOrderNotifications(order, config = {}) {
  const promises = []

  if (config.discord?.webhookUrl) {
    promises.push(sendDiscordOrderNotification(order, config.discord.webhookUrl))
  }

  if (config.slack?.webhookUrl) {
    promises.push(sendSlackOrderNotification(order, config.slack.webhookUrl))
  }

  if (config.email) {
    promises.push(sendEmailOrderNotification(order, config.email))
  }

  if (config.sms) {
    promises.push(sendSMSOrderNotification(order, config.sms))
  }

  if (config.telegram) {
    promises.push(sendTelegramOrderNotification(order, config.telegram))
  }

  // Send all notifications in parallel
  await Promise.allSettled(promises)
}
