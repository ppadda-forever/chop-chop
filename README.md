# Chop Chop - Korean Food Delivery App

A modern food delivery web application built with React and Prisma, featuring Korean cuisine and local Seoul restaurants with full database integration.

## Features

- **Home Page**: Welcome screen with hero section and popular dishes from database
- **Restaurants Page**: Browse restaurants by category with real-time filtering
- **Restaurant Menu**: View individual restaurant menus with dynamic options
- **Menu Customization**: Size, spice level, and add-on options
- **Database Integration**: Full Prisma + Supabase integration
- **Responsive Design**: Mobile-first design optimized for food delivery
- **Modern UI**: Clean, Korean-inspired design with warm colors

## Tech Stack

- **React 18** - Frontend framework
- **Vite** - Build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Prisma** - Database ORM
- **Supabase** - PostgreSQL database
- **Plus Jakarta Sans** - Modern typography

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd chop-chop-2
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
npm run db:push

# Seed the database with sample data
npm run db:seed
```

5. Start the development server:
```bash
npm run dev
```

6. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run db:push` - Push schema to database
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Prisma Studio

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── BottomNavigation.jsx
│   └── Header.jsx
├── pages/              # Main application pages
│   ├── Home.jsx
│   ├── Restaurants.jsx
│   ├── RestaurantMenu.jsx
│   ├── MenuOption.jsx
│   ├── Checkout.jsx
│   ├── CheckoutConfirmation.jsx
│   └── Help.jsx
├── services/           # API services
│   └── api.js
├── lib/               # Utility libraries
│   └── prisma.js
├── data/              # Mock data and constants
│   └── mockData.js
├── App.jsx            # Main application component
├── main.jsx          # Application entry point
└── index.css         # Global styles

prisma/
├── schema.prisma     # Database schema
└── seed.js          # Database seeding script
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

✅ **Menu Option Page**
- Dynamic menu customization options
- Size, spice level, and add-on selections
- Real-time price calculation
- Database-driven option management

✅ **Database Integration**
- Full Prisma + Supabase integration
- Real-time data fetching
- Comprehensive data models
- Seed data for testing

✅ **Navigation**
- Bottom navigation bar
- Header with back button and cart icon
- React Router for page navigation

## Future Enhancements

- User authentication and profiles
- Real payment integration
- Order tracking and history
- Restaurant reviews and ratings
- Search functionality
- Location-based delivery
- Push notifications

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
