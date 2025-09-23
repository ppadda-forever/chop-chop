'use client'

import React, { createContext, useContext, useReducer, useEffect } from 'react'

const CartContext = createContext()

// Cart reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItem = state.items.find(item => 
        item.id === action.payload.id && 
        JSON.stringify(item.selectedOptions) === JSON.stringify(action.payload.selectedOptions)
      )
      
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id && 
            JSON.stringify(item.selectedOptions) === JSON.stringify(action.payload.selectedOptions)
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          )
        }
      }
      
      return {
        ...state,
        items: [...state.items, action.payload]
      }
    
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(item => item.cartId !== action.payload)
      }
    
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.cartId === action.payload.cartId
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      }
    
    case 'CLEAR_CART':
      return {
        ...state,
        items: []
      }
    
    default:
      return state
  }
}

// Initial state
const initialState = {
  items: []
}

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('chop-chop-cart')
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        if (parsedCart.items && Array.isArray(parsedCart.items)) {
          // restaurant 정보가 있는 아이템만 복원
          const validItems = parsedCart.items.filter(item => 
            item.restaurant && item.restaurant.id
          )
          validItems.forEach(item => {
            dispatch({ type: 'ADD_TO_CART', payload: item })
          })
        }
      } catch (error) {
        console.error('Error parsing saved cart:', error)
        // 잘못된 데이터가 있으면 localStorage 클리어
        localStorage.removeItem('chop-chop-cart')
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('chop-chop-cart', JSON.stringify(state))
  }, [state])

  const addToCart = (menuItem, selectedOptions = {}, quantity = 1) => {
    const cartId = `${menuItem.id}-${JSON.stringify(selectedOptions)}-${Date.now()}`
    const totalPrice = calculateItemPrice(menuItem, selectedOptions)
    
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        cartId,
        id: menuItem.id,
        name: menuItem.name,
        description: menuItem.description,
        image: menuItem.image,
        basePrice: menuItem.basePrice,
        selectedOptions,
        quantity,
        totalPrice,
        restaurant: menuItem.restaurant
      }
    })

    return { success: true }
  }

  const removeFromCart = (cartId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: cartId })
  }

  const updateQuantity = (cartId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(cartId)
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { cartId, quantity } })
    }
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const calculateItemPrice = (menuItem, selectedOptions) => {
    let totalPrice = menuItem.basePrice
    
    Object.values(selectedOptions).forEach(option => {
      if (option && option.price) {
        totalPrice += option.price
      }
    })
    
    return totalPrice
  }

  const getTotalPrice = () => {
    return state.items.reduce((total, item) => total + (item.totalPrice * item.quantity), 0)
  }

  const getTotalItems = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0)
  }

  const getCartItemsByRestaurant = () => {
    const restaurantGroups = {}
    state.items.forEach(item => {
      // 안전 검사: restaurant 정보가 있는지 확인
      if (item.restaurant && item.restaurant.id) {
        const restaurantId = item.restaurant.id
        if (!restaurantGroups[restaurantId]) {
          restaurantGroups[restaurantId] = {
            restaurant: item.restaurant,
            items: []
          }
        }
        restaurantGroups[restaurantId].items.push(item)
      }
    })
    return Object.values(restaurantGroups)
  }

  const checkMinOrderAmount = () => {
    if (state.items.length === 0) return { isValid: false, message: '장바구니가 비어있습니다.' }
    
    const restaurant = state.items[0].restaurant
    if (!restaurant) return { isValid: false, message: '레스토랑 정보를 찾을 수 없습니다.' }

    const totalPrice = getTotalPrice()
    const minOrderAmount = restaurant.minOrderAmount || 0

    if (totalPrice < minOrderAmount) {
      return {
        isValid: false,
        message: `Minimum order amount is ₩${minOrderAmount.toLocaleString()}. Please add ₩${(minOrderAmount - totalPrice).toLocaleString()} more to your order.`,
        currentAmount: totalPrice,
        minAmount: minOrderAmount,
        shortfall: minOrderAmount - totalPrice
      }
    }

    return { isValid: true }
  }

  const checkRestaurantRestriction = (newMenuItem) => {
    if (state.items.length === 0) return { isValid: true }
    
    const currentRestaurantId = state.items[0].restaurant?.id
    if (currentRestaurantId && currentRestaurantId !== newMenuItem.restaurant?.id) {
      return {
        isValid: false,
        message: `You can only order from one restaurant at a time. Clear your cart to order from "${newMenuItem.restaurant?.name}".`,
        currentRestaurant: state.items[0].restaurant?.name,
        newRestaurant: newMenuItem.restaurant?.name,
        needsClearCart: true
      }
    }

    return { isValid: true }
  }

  const value = {
    items: state.items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
    getCartItemsByRestaurant,
    checkMinOrderAmount,
    checkRestaurantRestriction
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
