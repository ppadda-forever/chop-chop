import { prisma } from '../lib/prisma.js'

/**
 * 주문을 생성합니다
 * @param {Object} orderData - 주문 데이터
 * @returns {Promise<Object>} 생성된 주문 정보
 */
export async function createOrder(orderData) {
  try {
    const { accommodationId, orderItems, paymentMethod, notes } = orderData
    
    // 총 금액 계산
    const totalAmount = orderItems.reduce((sum, item) => {
      return sum + (item.unitPrice * item.quantity)
    }, 0)
    
    const order = await prisma.order.create({
      data: {
        accommodationId,
        totalAmount,
        deliveryFee: 3000, // 기본 배달비
        paymentMethod,
        notes,
        orderItems: {
          create: orderItems.map(item => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            optionSelections: {
              create: item.optionSelections?.map(option => ({
                menuOptionId: option.menuOptionId
              })) || []
            }
          }))
        }
      },
      include: {
        orderItems: {
          include: {
            menuItem: true,
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
    
    return order
  } catch (error) {
    console.error('Error creating order:', error)
    throw new Error('Failed to create order')
  }
}

/**
 * ID로 주문을 조회합니다
 * @param {string} id - 주문 ID
 * @returns {Promise<Object>} 주문 정보
 */
export async function getOrderById(id) {
  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: {
          include: {
            menuItem: true,
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
      throw new Error('Order not found')
    }
    
    return order
  } catch (error) {
    console.error('Error fetching order:', error)
    throw new Error('Failed to fetch order')
  }
}

/**
 * 숙소별 주문을 조회합니다
 * @param {string} accommodationId - 숙소 ID
 * @returns {Promise<Array>} 주문 목록
 */
export async function getOrdersByAccommodation(accommodationId) {
  try {
    const orders = await prisma.order.findMany({
      where: { accommodationId },
      include: {
        orderItems: {
          include: {
            menuItem: true,
            optionSelections: {
              include: {
                menuOption: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return orders
  } catch (error) {
    console.error('Error fetching orders:', error)
    throw new Error('Failed to fetch orders')
  }
}

/**
 * 주문 상태를 업데이트합니다
 * @param {string} id - 주문 ID
 * @param {string} status - 새로운 상태
 * @returns {Promise<Object>} 업데이트된 주문 정보
 */
export async function updateOrderStatus(id, status) {
  try {
    const order = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        orderItems: {
          include: {
            menuItem: true,
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
    
    return order
  } catch (error) {
    console.error('Error updating order status:', error)
    throw new Error('Failed to update order status')
  }
}

/**
 * 결제 상태를 업데이트합니다
 * @param {string} id - 주문 ID
 * @param {string} paymentStatus - 새로운 결제 상태
 * @returns {Promise<Object>} 업데이트된 주문 정보
 */
export async function updatePaymentStatus(id, paymentStatus) {
  try {
    const order = await prisma.order.update({
      where: { id },
      data: { paymentStatus },
      include: {
        orderItems: {
          include: {
            menuItem: true,
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
    
    return order
  } catch (error) {
    console.error('Error updating payment status:', error)
    throw new Error('Failed to update payment status')
  }
}

/**
 * 모든 주문을 조회합니다 (관리자용)
 * @param {Object} filters - 필터 옵션
 * @returns {Promise<Array>} 주문 목록
 */
export async function getAllOrders(filters = {}) {
  try {
    const where = {}
    
    if (filters.status) {
      where.status = filters.status
    }
    
    if (filters.paymentStatus) {
      where.paymentStatus = filters.paymentStatus
    }
    
    if (filters.startDate && filters.endDate) {
      where.createdAt = {
        gte: new Date(filters.startDate),
        lte: new Date(filters.endDate)
      }
    }
    
    const orders = await prisma.order.findMany({
      where,
      include: {
        orderItems: {
          include: {
            menuItem: true,
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
    
    return orders
  } catch (error) {
    console.error('Error fetching all orders:', error)
    throw new Error('Failed to fetch orders')
  }
}

/**
 * 주문 통계를 조회합니다
 * @returns {Promise<Object>} 주문 통계 정보
 */
export async function getOrderStats() {
  try {
    const [
      totalOrders,
      pendingOrders,
      completedOrders,
      totalRevenue
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({
        where: { status: 'PENDING' }
      }),
      prisma.order.count({
        where: { status: 'DELIVERED' }
      }),
      prisma.order.aggregate({
        where: { paymentStatus: 'COMPLETED' },
        _sum: { totalAmount: true }
      })
    ])
    
    return {
      totalOrders,
      pendingOrders,
      completedOrders,
      totalRevenue: totalRevenue._sum.totalAmount || 0
    }
  } catch (error) {
    console.error('Error fetching order stats:', error)
    throw new Error('Failed to fetch order statistics')
  }
}
