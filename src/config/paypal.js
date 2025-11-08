// PayPal 환경 설정
const environment = process.env.NEXT_PUBLIC_PAYPAL_ENVIRONMENT || "sandbox"
const isLive = environment === "live"

// PayPal 설정
export const paypalConfig = {
  clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
  currency: "USD", // KRW는 PayPal에서 지원하지 않으므로 USD 사용
  environment: environment,
  apiBaseUrl: isLive 
    ? "https://api.paypal.com" 
    : "https://api.sandbox.paypal.com",
  checkoutUrl: isLive
    ? "https://www.paypal.com/checkoutnow"
    : "https://www.sandbox.paypal.com/checkoutnow",
  clientSecret: process.env.PAYPAL_CLIENT_SECRET,
}

// PayPal SDK 옵션
export const paypalOptions = {
  "client-id": paypalConfig.clientId,
  currency: paypalConfig.currency,
  intent: "capture",
  // "disable-funding": "credit,card", // 신용카드와 카드 결제 허용
  locale: "ko_KR",
}

// 환경 변수 검증
export const validatePayPalConfig = () => {
  if (!paypalConfig.clientId) {
    throw new Error("NEXT_PUBLIC_PAYPAL_CLIENT_ID is not defined")
  }
  if (!paypalConfig.clientSecret) {
    console.warn("PAYPAL_CLIENT_SECRET is not defined - server-side features may not work")
  }
  return true
}
