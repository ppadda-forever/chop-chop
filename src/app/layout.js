import './globals.css'
import { CartProvider } from '../contexts/CartContext'

export const metadata = {
  title: 'Chop Chop - Korean Food Delivery',
  description: 'Your go-to for delicious Korean food delivery in Seoul',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white">
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  )
}
