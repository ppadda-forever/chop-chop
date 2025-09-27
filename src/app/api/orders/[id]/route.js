import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

export async function GET(request, { params }) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      )
    }

    const order = await prisma.order.findUnique({
      where: {
        id: id
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

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch order',
        details: error.message 
      },
      { status: 500 }
    )
  }
}
