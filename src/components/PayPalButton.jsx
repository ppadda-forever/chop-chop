'use client'

import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js"
import { useState } from "react"

export default function PayPalButton({ 
  amount, 
  currency = "KRW", 
  onSuccess, 
  onError, 
  onCancel,
  disabled = false 
}) {
  const [{ isPending }] = usePayPalScriptReducer()
  const [isProcessing, setIsProcessing] = useState(false)

  // PayPal 주문 생성
  const createOrder = async (data, actions) => {
    try {
      setIsProcessing(true)
      
      // 금액 검증
      if (!amount || amount <= 0) {
        throw new Error('유효하지 않은 결제 금액입니다.')
      }
      
      // 서버에서 PayPal 주문 생성
      const response = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount,
          currency: currency,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `PayPal 주문 생성 실패 (${response.status})`)
      }

      const order = await response.json()
      
      if (!order.id) {
        throw new Error('PayPal 주문 ID를 받지 못했습니다.')
      }
      
      console.log('PayPal order created successfully:', order.id)
      return order.id
    } catch (error) {
      console.error('Error creating PayPal order:', error)
      setIsProcessing(false)
      onError?.(error)
      throw error
    }
  }

  // PayPal 결제 승인
  const onApprove = async (data, actions) => {
    try {
      setIsProcessing(true)
      
      if (!data.orderID) {
        throw new Error('PayPal 주문 ID가 없습니다.')
      }
      
      // 서버에서 PayPal 결제 승인 처리
      const response = await fetch('/api/paypal/capture-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderID: data.orderID,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `PayPal 결제 승인 실패 (${response.status})`)
      }

      const details = await response.json()
      
      if (!details.success) {
        throw new Error('PayPal 결제 처리가 완료되지 않았습니다.')
      }
      
      console.log('PayPal payment captured successfully:', details.captureID)
      
      // 결제 성공 콜백 호출
      onSuccess?.(details, data)
    } catch (error) {
      console.error('Error capturing PayPal payment:', error)
      onError?.(error)
    } finally {
      setIsProcessing(false)
    }
  }

  // 에러 처리
  const onErrorHandler = (err) => {
    console.error('PayPal Checkout onError', err)
    onError?.(err)
    setIsProcessing(false)
  }

  // 취소 처리
  const onCancelHandler = (data) => {
    console.log('PayPal Checkout onCancel', data)
    onCancel?.(data)
    setIsProcessing(false)
  }

  if (isPending) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-chop-orange"></div>
        <span className="ml-2 text-chop-brown">PayPal 로딩 중...</span>
      </div>
    )
  }

  return (
    <div className="paypal-button-container">
      {isProcessing && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg z-10">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-chop-orange"></div>
            <span className="ml-2 text-chop-brown">결제 처리 중...</span>
          </div>
        </div>
      )}
      
      <PayPalButtons
        style={{
          layout: 'vertical',
          color: 'gold',
          shape: 'rect',
          label: 'paypal',
          height: 55,
        }}
        disabled={disabled || isProcessing}
        createOrder={createOrder}
        onApprove={onApprove}
        onError={onErrorHandler}
        onCancel={onCancelHandler}
        forceReRender={[amount, currency, disabled]}
      />
    </div>
  )
}
