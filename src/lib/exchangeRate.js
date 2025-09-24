// 실시간 환율 API 서비스
const EXCHANGE_API_KEY = process.env.EXCHANGE_RATE_API_KEY || 'free'
const EXCHANGE_API_URL = 'https://api.exchangerate-api.com/v4/latest/KRW'

/**
 * KRW를 USD로 변환 (실시간 환율 사용)
 * @param {number} krwAmount - KRW 금액
 * @returns {Promise<number>} USD 금액 (소수점 2자리)
 */
export async function convertKrwToUsd(krwAmount) {
  try {
    const response = await fetch(EXCHANGE_API_URL)
    if (!response.ok) {
      throw new Error('Failed to fetch exchange rate')
    }
    
    const data = await response.json()
    const exchangeRate = data.rates.USD
    
    if (!exchangeRate) {
      throw new Error('USD exchange rate not found')
    }
    
    const usdAmount = (krwAmount / exchangeRate).toFixed(2)
    console.log(`Exchange rate: 1 KRW = ${exchangeRate} USD`)
    console.log(`Converted: ₩${krwAmount.toLocaleString()} → $${usdAmount}`)
    
    return parseFloat(usdAmount)
  } catch (error) {
    console.error('Error fetching exchange rate:', error)
    // 폴백: 고정 환율 사용
    const fallbackRate = 1300
    console.warn(`Using fallback rate: ${fallbackRate}`)
    return parseFloat((krwAmount / fallbackRate).toFixed(2))
  }
}

/**
 * USD를 KRW로 변환 (실시간 환율 사용)
 * @param {number} usdAmount - USD 금액
 * @returns {Promise<number>} KRW 금액
 */
export async function convertUsdToKrw(usdAmount) {
  try {
    const response = await fetch(EXCHANGE_API_URL)
    if (!response.ok) {
      throw new Error('Failed to fetch exchange rate')
    }
    
    const data = await response.json()
    const exchangeRate = data.rates.USD
    
    if (!exchangeRate) {
      throw new Error('USD exchange rate not found')
    }
    
    const krwAmount = Math.round(usdAmount * exchangeRate)
    console.log(`Exchange rate: 1 USD = ${(1/exchangeRate).toFixed(2)} KRW`)
    console.log(`Converted: $${usdAmount} → ₩${krwAmount.toLocaleString()}`)
    
    return krwAmount
  } catch (error) {
    console.error('Error fetching exchange rate:', error)
    // 폴백: 고정 환율 사용
    const fallbackRate = 1300
    console.warn(`Using fallback rate: ${fallbackRate}`)
    return Math.round(usdAmount * fallbackRate)
  }
}

/**
 * 현재 환율 조회
 * @returns {Promise<Object>} 환율 정보
 */
export async function getCurrentExchangeRate() {
  try {
    const response = await fetch(EXCHANGE_API_URL)
    if (!response.ok) {
      throw new Error('Failed to fetch exchange rate')
    }
    
    const data = await response.json()
    return {
      krwToUsd: data.rates.USD,
      usdToKrw: 1 / data.rates.USD,
      lastUpdated: data.date,
      base: data.base
    }
  } catch (error) {
    console.error('Error fetching exchange rate:', error)
    return {
      krwToUsd: 0.00077, // 대략 1300 KRW = 1 USD
      usdToKrw: 1300,
      lastUpdated: new Date().toISOString(),
      base: 'KRW'
    }
  }
}
