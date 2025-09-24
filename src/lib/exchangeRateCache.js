// 환율 캐싱 시스템
let exchangeRateCache = null
let cacheExpiry = null
const CACHE_DURATION = 5 * 60 * 1000 // 5분 캐시

/**
 * 캐시된 환율 조회 또는 새로 가져오기
 * @returns {Promise<Object>} 환율 정보
 */
export async function getCachedExchangeRate() {
  const now = new Date()
  
  // 캐시가 유효한 경우
  if (exchangeRateCache && cacheExpiry && now < cacheExpiry) {
    console.log('Using cached exchange rate')
    return exchangeRateCache
  }
  
  // 새로운 환율 가져오기
  console.log('Fetching new exchange rate')
  const { getCurrentExchangeRate } = await import('./exchangeRate')
  exchangeRateCache = await getCurrentExchangeRate()
  cacheExpiry = new Date(now.getTime() + CACHE_DURATION)
  
  return exchangeRateCache
}

/**
 * 캐시 초기화
 */
export function clearExchangeRateCache() {
  exchangeRateCache = null
  cacheExpiry = null
}
