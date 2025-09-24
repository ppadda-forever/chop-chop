# Chop Chop - Korean Food Delivery App

A modern food delivery web application built with Next.js and Prisma, featuring Korean cuisine and local Seoul restaurants with full database integration, QR code-based accommodation selection, and real-time order tracking.

## Features

- **Home Page**: Welcome screen with hero section and popular dishes from database
- **Restaurants Page**: Browse restaurants by category with real-time filtering
- **Restaurant Menu**: View individual restaurant menus with dynamic options
- **Menu Customization**: Size, spice level, and add-on options
- **Shopping Cart**: Persistent cart with restaurant grouping and minimum order validation
- **Checkout Flow**: Complete order placement with accommodation-based delivery
- **Order Tracking**: Real-time order status with timeline visualization
- **QR Code Integration**: Accommodation selection via QR code scanning
- **Time-based Order Filtering**: Smart order history based on accommodation and time windows
- **Database Integration**: Full Prisma + Supabase integration
- **Order Notifications**: Discord webhook integration for instant order alerts
- **Responsive Design**: Mobile-first design optimized for food delivery
- **Modern UI**: Clean, Korean-inspired design with warm colors

## Tech Stack

- **Next.js 14** - Full-stack React framework with App Router
- **React 18** - Frontend framework
- **Tailwind CSS** - Utility-first CSS framework
- **Prisma** - Database ORM
- **Supabase** - PostgreSQL database
- **Plus Jakarta Sans** - Modern typography
- **Context API** - State management for cart and accommodation

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd chop-chop
```

2. Install dependencies:
```bash
npm install
```

3. Set up Supabase database:
   - Create a new project at [Supabase](https://supabase.com)
   - Copy your database URL from Settings → Database
   - Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
   DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
   ```

4. Set up the database:
```bash
# Push the schema to your database
npx prisma db push

# Seed the database with sample data
npx prisma db seed
```

5. Start the development server:
```bash
npm run dev
```

6. Open your browser and navigate to `http://localhost:3000`

### Optional: Set up Order Notifications

To receive instant Discord notifications when orders are placed:

1. Create a Discord webhook (see `NOTIFICATION_SETUP.md` for detailed instructions)
2. Add to your `.env.local` file:
   ```env
   DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN
   ```
3. Test the notification:
   ```bash
   curl -X POST http://localhost:3000/api/test-notification
   ```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma db push` - Push schema to database
- `npx prisma db seed` - Seed database with sample data
- `npx prisma studio` - Open Prisma Studio

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── accommodations/
│   │   ├── analytics/
│   │   ├── menu-items/
│   │   ├── orders/
│   │   └── restaurants/
│   ├── cart/              # Shopping cart page
│   ├── checkout/          # Checkout flow
│   ├── checkout-confirmation/
│   ├── help/              # Help page
│   ├── menu-item/         # Individual menu item pages
│   ├── orders/            # Order tracking page
│   ├── restaurant/        # Individual restaurant pages
│   ├── restaurants/        # Restaurant listing page
│   ├── globals.css        # Global styles
│   ├── layout.js          # Root layout
│   └── page.js            # Home page
├── components/             # Reusable UI components
│   ├── BottomNavigation.jsx
│   └── Header.jsx
├── contexts/              # React Context providers
│   └── CartContext.js      # Shopping cart state management
├── services/              # API services
│   ├── accommodationService.js
│   ├── analyticsService.js
│   ├── api.js
│   ├── clientApi.js
│   ├── menuService.js
│   ├── mockApi.js
│   ├── orderService.js
│   └── restaurantService.js
├── lib/                   # Utility libraries
│   └── prisma.js          # Prisma client
├── data/                  # Mock data and constants
│   └── mockData.js
└── utils/                 # Utility functions
    └── analytics.js       # Analytics tracking

prisma/
├── migrations/            # Database migrations
├── schema.prisma         # Database schema
└── seed.js               # Database seeding script
```

## Design System

The app uses a custom color palette inspired by Korean aesthetics:

- **Primary Orange**: `#f56326` - Call-to-action buttons
- **Cream Background**: `#fcfaf7` - Main background color
- **Brown Text**: `#1c120d` - Primary text color
- **Light Brown**: `#9c614a` - Secondary text color
- **Red Accent**: `#994d52` - Restaurant category text

## Features Implemented

✅ **Home Page**
- Hero section with welcome message
- Popular dishes from database
- Navigation to restaurants

✅ **Restaurants Page**
- Category filtering (Korean, Japanese, Italian, etc.)
- Restaurant listings with images and details from database
- Navigation to individual restaurant menus

✅ **Restaurant Menu Page**
- Restaurant hero image
- Menu items with descriptions and prices from database
- Add to cart functionality
- Order button with total price

✅ **Menu Customization**
- Dynamic menu customization options
- Size, spice level, and add-on selections
- Real-time price calculation
- Database-driven option management

✅ **Shopping Cart**
- Persistent cart with restaurant grouping
- Minimum order amount validation
- Real-time price calculation
- Context-based state management

✅ **Checkout Flow**
- Complete order placement process
- Accommodation-based delivery address
- Payment method selection
- Order confirmation with real order ID

✅ **Order Tracking**
- Real-time order status visualization
- Timeline-based progress tracking
- Order history with time-based filtering
- Status indicators (Pending, Delivered, Cancelled)

✅ **QR Code Integration**
- Accommodation selection via QR code scanning
- Session-based accommodation storage
- Automatic address population

✅ **Time-based Order Filtering**
- Smart order history based on accommodation
- Time window logic (11am cutoff)
- Yesterday 3pm to today 11am / Today 11am to tomorrow

✅ **Database Integration**
- Full Prisma + Supabase integration
- Real-time data fetching
- Comprehensive data models
- Seed data for testing

✅ **Navigation**
- Bottom navigation bar
- Header with back button and cart icon
- Next.js App Router for page navigation

## Key Features

### 🛒 Shopping Cart System
- Restaurant-grouped cart items
- Minimum order validation
- Real-time price calculation
- Persistent cart state

### 📱 QR Code Integration
- Accommodation selection via QR scanning
- Automatic address population
- Session-based accommodation storage

### 📦 Order Management
- Complete checkout flow
- Real order ID generation
- Order status tracking (Pending, Delivered, Cancelled)
- Time-based order filtering

### 🏨 Accommodation-based Delivery
- Smart order history based on accommodation
- Time window logic (11am cutoff)
- Yesterday 3pm to today 11am / Today 11am to tomorrow

## Future Enhancements

- User authentication and profiles
- Real payment integration
- Restaurant reviews and ratings
- Search functionality
- Location-based delivery
- Push notifications
- Multi-language support
- Advanced analytics dashboard

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
