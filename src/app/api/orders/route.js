import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

export async function POST(request) {
  try {
    const body = await request.json()
    const { items, paymentMethod, notes, total, deliveryFee, accommodationId, paymentDetails } = body

    // accommodationId 유효성 확인 및 조회
    let resolvedAccommodationId = accommodationId
    if (!resolvedAccommodationId) {
      // fallback: 기존 로직 유지 (개발/시드 환경)
      const fallback = await prisma.accommodation.findFirst()
      if (!fallback) {
        return NextResponse.json(
          { error: 'No accommodation found. Please seed the database.' },
          { status: 400 }
        )
      }
      resolvedAccommodationId = fallback.id
    } else {
      const exists = await prisma.accommodation.findUnique({ where: { id: resolvedAccommodationId } })
      if (!exists) {
        return NextResponse.json(
          { error: 'Invalid accommodationId' },
          { status: 400 }
        )
      }
    }

    // PayPal 결제 정보 처리
    let paymentStatus = 'PENDING'
    let paypalOrderId = null
    let paypalCaptureId = null

    if (paymentMethod === 'paypal' && paymentDetails) {
      // PayPal 결제 성공 시 상태 업데이트
      if (paymentDetails.success && paymentDetails.status === 'COMPLETED') {
        paymentStatus = 'COMPLETED'
        paypalOrderId = paymentDetails.orderID
        paypalCaptureId = paymentDetails.captureID
      }
    }

    // 주문 생성
    const order = await prisma.order.create({
      data: {
        accommodationId: resolvedAccommodationId,
        totalAmount: total - deliveryFee, // 배달비 제외한 실제 주문 금액
        deliveryFee: deliveryFee,
        paymentMethod,
        paymentStatus,
        notes,
        paypalOrderId,
        paypalCaptureId,
        paymentDetails: paymentDetails || null,
        orderItems: {
          create: items.map((item) => ({
            menuItemId: item.id,
            quantity: item.quantity,
            unitPrice: item.totalPrice,
            optionSelections: {
              create: Object.keys(item.selectedOptions || {}).map((optionId) => ({
                menuOptionId: optionId,
              })),
            },
          })),
        },
      },
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

    console.log('Order created:', order.id, 'Payment status:', paymentStatus)

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const accommodationId = searchParams.get('accommodationId')

    // 시간 기반 필터링 로직
    const now = new Date()
    const currentHour = now.getHours()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    let startDate, endDate
    if (currentHour >= 11) {
      // 오전 11시 이후: 오늘 오전 11시 이후 주문만
      startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 11, 0, 0)
      endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 0, 0, 0)
    } else {
      // 오전 11시 이전: 어제 오후 3시부터 오늘 오전 11시까지
      startDate = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 15, 0, 0)
      endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 11, 0, 0)
    }

    const where = {
      createdAt: {
        gte: startDate,
        lt: endDate
      }
    }

    // accommodationId가 있으면 해당 숙소의 주문만 필터링
    if (accommodationId) {
      where.accommodationId = accommodationId
    }

    const orders = await prisma.order.findMany({
      where,
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
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log(`Found ${orders.length} orders for accommodation ${accommodationId || 'all'} in time range ${startDate.toISOString()} to ${endDate.toISOString()}`)
    return NextResponse.json(orders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}
