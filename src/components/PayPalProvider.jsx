'use client'

import { PayPalScriptProvider } from "@paypal/react-paypal-js"
import { paypalOptions, validatePayPalConfig } from "../config/paypal"

export default function PayPalProvider({ children }) {
  try {
    validatePayPalConfig()
  } catch (error) {
    console.error("PayPal configuration error:", error)
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 m-4">
        <h3 className="text-red-800 font-semibold">PayPal 설정 오류</h3>
        <p className="text-red-600 text-sm mt-1">
          PayPal 환경 변수가 설정되지 않았습니다. .env.local 파일을 확인해주세요.
        </p>
        <p className="text-red-600 text-xs mt-2">
          오류: {error.message}
        </p>
      </div>
    )
  }

  return (
    <PayPalScriptProvider options={paypalOptions}>
      {children}
    </PayPalScriptProvider>
  )
}
