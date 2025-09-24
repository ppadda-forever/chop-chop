# Order Notification Setup Guide

This guide will help you set up order notifications for your ChopChop food delivery app. When a new order is placed, you'll receive instant notifications through your preferred channels.

## Quick Start (Discord Webhook - Recommended)

### 1. Create Discord Webhook
1. Go to your Discord server
2. Click on server settings (gear icon)
3. Go to **Integrations** → **Webhooks**
4. Click **Create Webhook**
5. Choose the channel where you want notifications
6. Copy the **Webhook URL**

### 2. Configure Environment Variables
1. Create a `.env.local` file in your project root (or add to existing `.env.local`)
2. Add your Discord webhook URL:
```bash
# Discord Webhook for Order Notifications
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN

# Other existing environment variables
DATABASE_URL="file:./dev.db"
PAYPAL_CLIENT_ID=your_paypal_client_id_here
PAYPAL_CLIENT_SECRET=your_paypal_client_secret_here
PAYPAL_ENVIRONMENT=sandbox
```

### 3. Restart Development Server
After adding the environment variable, restart your development server:
```bash
npm run dev
```

### 4. Test It!
You can test the Discord notification in two ways:

**Option A: Test API Endpoint (Recommended)**
1. Start your development server: `npm run dev`
2. Visit: `http://localhost:3000/api/test-notification` 
3. Send a POST request to test the notification:
   ```bash
   curl -X POST http://localhost:3000/api/test-notification
   ```
4. Check your Discord channel for the test notification

**Option B: Place a Real Order**
Place a test order through your app and check your Discord channel for the notification.

## Supported Notification Channels

### 🎯 Discord (Recommended)
- **Pros**: Easy setup, free, rich formatting, instant notifications
- **Setup time**: 2 minutes
- **Cost**: Free

### 💬 Slack
- **Pros**: Professional, great for teams
- **Setup**: Create Slack app → Enable Incoming Webhooks
- **Environment variable**: `SLACK_WEBHOOK_URL`

### 📧 Email (SMTP)
- **Pros**: Universal, detailed notifications
- **Setup**: Configure SMTP settings (Gmail, Outlook, etc.)
- **Environment variables**:
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
NOTIFICATION_EMAIL_RECIPIENTS=admin@restaurant.com,manager@restaurant.com
```

### 📱 SMS (Twilio)
- **Pros**: Most immediate, works on any phone
- **Setup**: Create Twilio account → Get phone numbers
- **Cost**: ~$0.0075 per SMS
- **Environment variables**:
```bash
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_FROM=+1234567890
TWILIO_PHONE_TO=+1234567890
```

### 🤖 Telegram
- **Pros**: Free, instant, supports groups
- **Setup**: Create bot with @BotFather → Get chat ID
- **Environment variables**:
```bash
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id
```

## What Information is Included in Notifications?

Each notification includes:
- 📋 Order ID and timestamp
- 🏨 Accommodation/hotel information
- 🛒 Complete order details with quantities and prices
- 💰 Total amount including delivery fee
- 💳 Payment method and status
- 📝 Special requests/notes (if any)
- 🏪 Restaurant information

## Multiple Notification Channels

You can enable multiple notification channels simultaneously. For example:
- Discord for instant team notifications
- Email for record keeping
- SMS for critical alerts

Just add the environment variables for each channel you want to use.

## Troubleshooting

### Discord notifications not working?
1. Check if the webhook URL is correct
2. Verify the webhook hasn't been deleted
3. Check server logs for error messages

### Environment variables not loading?
1. Make sure `.env.local` is in the project root
2. Restart your development server after adding variables
3. Check that variable names match exactly

### Notifications not sending?
1. Check the browser/server console for error messages
2. Test webhook URLs manually (use curl or Postman)
3. Verify all required environment variables are set

## Security Notes

- Never commit webhook URLs or tokens to version control
- Use `.env.local` for local development
- Use secure environment variable management in production
- Regenerate webhooks/tokens if accidentally exposed

## Custom Notification Channels

Want to add more notification channels? Edit `/src/services/notificationService.js` and add your custom notification function. The service supports:

- Any webhook-based service
- Custom API integrations  
- Database logging
- File-based notifications

## Support

If you need help setting up notifications:
1. Check the console logs for detailed error messages
2. Test webhook URLs independently 
3. Verify environment variables are properly loaded
4. Make sure the notification service is imported correctly

Happy ordering! 🍽️
