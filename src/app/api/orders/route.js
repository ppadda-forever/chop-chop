import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

export async function POST(request) {
  try {
    const body = await request.json()
    const { items, paymentMethod, notes, total, deliveryFee } = body

    // 첫 번째 숙소를 가져옵니다 (실제 앱에서는 사용자 세션에서 가져와야 함)
    const accommodation = await prisma.accommodation.findFirst()
    if (!accommodation) {
      return NextResponse.json(
        { error: 'No accommodation found. Please seed the database.' },
        { status: 400 }
      )
    }

    // 주문 생성
    const order = await prisma.order.create({
      data: {
        accommodationId: accommodation.id,
        totalAmount: total - deliveryFee, // 배달비 제외한 실제 주문 금액
        deliveryFee: deliveryFee,
        paymentMethod,
        notes,
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

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // 임시로 모든 주문을 반환하도록 수정 (디버깅용)
    const orders = await prisma.order.findMany({
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

    console.log('Found orders:', orders.length)
    return NextResponse.json(orders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}
