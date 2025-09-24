// src/utils/analytics.js
let sessionId = null

// 세션 ID 초기화
export function initializeSession() {
  if (typeof window !== 'undefined') {
    sessionId = sessionStorage.getItem('analyticsSessionId')
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      sessionStorage.setItem('analyticsSessionId', sessionId)
    }
  }
  return sessionId
}

// 이벤트 추적
export async function trackEvent(eventType, eventData = {}) {
  if (!sessionId) {
    initializeSession()
  }
  
  try {
    await fetch('/api/analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId,
        eventType,
        eventData,
      }),
    })
  } catch (error) {
    console.error('Analytics tracking failed:', error)
  }
}

// 세션 단위 중복 방지 유틸
function isMarked(key) {
  if (typeof window === 'undefined') return false
  try {
    return sessionStorage.getItem(key) === '1'
  } catch {
    return false
  }
}

function markOnce(key) {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.setItem(key, '1')
  } catch {
    // ignore quota errors
  }
}

function getAccommodationIdFromSession() {
  if (typeof window === 'undefined') return null
  try {
    const saved = sessionStorage.getItem('accommodation')
    if (!saved) return null
    const obj = JSON.parse(saved)
    return obj?.id || null
  } catch {
    return null
  }
}

// 특정 이벤트 추적 함수들
export const analytics = {
  trackQREntry: (accommodationId) => trackEvent('QR_ENTRY', { accommodationId }),
  trackCartAdd: (menuItemId, restaurantId) => trackEvent('CART_ADD_ITEM', { menuItemId, restaurantId }),
  // 세션당 최초 장바구니 담기만 기록
  trackCartAddOncePerSession: (menuItemId, restaurantId) => {
    const key = 'analytics:firstCartAdd:session'
    if (!isMarked(key)) {
      markOnce(key)
      return trackEvent('CART_ADD_ITEM', { menuItemId, restaurantId, mode: 'session-first' })
    }
  },
  // 세션+숙소 단위 최초 장바구니 담기만 기록
  trackCartAddOncePerSessionPerAccommodation: (menuItemId, restaurantId) => {
    const accommodationId = getAccommodationIdFromSession()
    const key = `analytics:firstCartAdd:session:acc:${accommodationId || 'none'}`
    if (!isMarked(key)) {
      markOnce(key)
      return trackEvent('CART_ADD_ITEM', { menuItemId, restaurantId, accommodationId, mode: 'session-accommodation-first' })
    }
  },
  trackCheckoutView: () => trackEvent('CHECKOUT_VIEW'),
  // 세션+숙소 단위 최초 체크아웃 방문만 기록
  trackCheckoutViewOncePerSessionPerAccommodation: () => {
    const accommodationId = getAccommodationIdFromSession()
    const key = `analytics:checkoutView:session:acc:${accommodationId || 'none'}`
    if (!isMarked(key)) {
      markOnce(key)
      return trackEvent('CHECKOUT_VIEW', { accommodationId, mode: 'session-accommodation-first' })
    }
  },
  trackOrderPlaceClick: (totalAmount) => trackEvent('ORDER_PLACE_CLICK', { totalAmount }),
  trackOrderComplete: (orderId, totalAmount) => trackEvent('ORDER_COMPLETE', { orderId, totalAmount }),
}