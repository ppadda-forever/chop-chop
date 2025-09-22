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
      const parsedCart = JSON.parse(savedCart)
      parsedCart.items.forEach(item => {
        dispatch({ type: 'ADD_TO_CART', payload: item })
      })
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
    
    Object.keys(selectedOptions).forEach(optionId => {
      const option = menuItem.menuOptions?.find(opt => opt.id === optionId)
      if (option) {
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
      const restaurantId = item.restaurant.id
      if (!restaurantGroups[restaurantId]) {
        restaurantGroups[restaurantId] = {
          restaurant: item.restaurant,
          items: []
        }
      }
      restaurantGroups[restaurantId].items.push(item)
    })
    return Object.values(restaurantGroups)
  }

  const value = {
    items: state.items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
    getCartItemsByRestaurant
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
