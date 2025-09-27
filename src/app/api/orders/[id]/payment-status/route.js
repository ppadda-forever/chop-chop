import { NextResponse } from 'next/server'
import { prisma } from '../../../../../lib/prisma'
import { sendOrderNotifications } from '../../../../../services/notificationService'

export async function PATCH(request, { params }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { paymentStatus, paypalOrderId, paypalCaptureId, paymentDetails } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      )
    }

    if (!paymentStatus) {
      return NextResponse.json(
        { error: 'Payment status is required' },
        { status: 400 }
      )
    }

    // 주문 존재 확인
    const existingOrder = await prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: {
          include: {
            menuItem: {
              include: {
                restaurant: true
              }
            },
            optionSelections: {
              include: {
                menuOption: true
              }
            }
          }
        },
        accommodation: true
      }
    })

    if (!existingOrder) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // 결제 상태 업데이트
    const updateData = {
      paymentStatus,
      paymentDetails: paymentDetails || existingOrder.paymentDetails
    }

    // PayPal 관련 정보 추가
    if (paypalOrderId) {
      updateData.paypalOrderId = paypalOrderId
    }
    if (paypalCaptureId) {
      updateData.paypalCaptureId = paypalCaptureId
    }

    // 결제 완료 시 주문 상태도 CONFIRMED로 업데이트
    if (paymentStatus === 'COMPLETED') {
      updateData.status = 'CONFIRMED'
    } else if (paymentStatus === 'FAILED') {
      updateData.status = 'CANCELLED'
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        orderItems: {
          include: {
            menuItem: {
              include: {
                restaurant: true
              }
            },
            optionSelections: {
              include: {
                menuOption: true
              }
            }
          }
        },
        accommodation: true
      }
    })

    console.log(`Payment status updated for order ${id}: ${paymentStatus}`)

    // 결제 완료 시 디스코드 알림 전송
    if (paymentStatus === 'COMPLETED') {
      try {
        const notificationConfig = {
          discord: {
            webhookUrl: process.env.DISCORD_WEBHOOK_URL
          }
        }

        // 디스코드 웹훅 URL이 설정되어 있는 경우에만 알림 전송
        if (process.env.DISCORD_WEBHOOK_URL) {
          console.log('Sending Discord notification for completed payment order:', id)
          // 비동기로 알림 전송
          sendOrderNotifications(updatedOrder, notificationConfig).catch(error => {
            console.error('Failed to send Discord notification:', error)
          })
          console.log('Discord notification queued for completed payment order:', id)
        } else {
          console.log('Discord webhook URL not configured - skipping notification')
        }
      } catch (notificationError) {
        console.error('Error setting up Discord notification:', notificationError)
      }
    }

    return NextResponse.json(updatedOrder)
  } catch (error) {
    console.error('Error updating payment status:', error)
    return NextResponse.json(
      { 
        error: 'Failed to update payment status',
        details: error.message 
      },
      { status: 500 }
    )
  }
}
