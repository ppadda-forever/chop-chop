import { prisma } from '../lib/prisma.js'

/**
 * 모든 숙소를 조회합니다
 * @returns {Promise<Array>} 숙소 목록
 */
export async function getAllAccommodations() {
  try {
    const accommodations = await prisma.accommodation.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return accommodations
  } catch (error) {
    console.error('Error fetching accommodations:', error)
    throw new Error('Failed to fetch accommodations')
  }
}

/**
 * ID로 특정 숙소를 조회합니다
 * @param {string} id - 숙소 ID
 * @returns {Promise<Object>} 숙소 정보
 */
export async function getAccommodationById(id) {
  try {
    const accommodation = await prisma.accommodation.findUnique({
      where: { id },
      include: {
        orders: {
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
        }
      }
    })
    
    if (!accommodation) {
      throw new Error('Accommodation not found')
    }
    
    return accommodation
  } catch (error) {
    console.error('Error fetching accommodation:', error)
    throw new Error('Failed to fetch accommodation')
  }
}

/**
 * QR 코드로 숙소를 조회합니다
 * @param {string} qrCode - QR 코드
 * @returns {Promise<Object>} 숙소 정보
 */
export async function getAccommodationByQrCode(qrCode) {
  try {
    const accommodation = await prisma.accommodation.findUnique({
      where: { qrCode },
      include: {
        orders: {
          where: {
            status: {
              in: ['PENDING', 'CONFIRMED']
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
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })
    
    if (!accommodation) {
      throw new Error('Accommodation not found')
    }
    
    return accommodation
  } catch (error) {
    console.error('Error fetching accommodation by QR code:', error)
    throw new Error('Failed to fetch accommodation')
  }
}

/**
 * 지역별 숙소를 조회합니다
 * @param {string} area - 지역
 * @returns {Promise<Array>} 해당 지역의 숙소 목록
 */
export async function getAccommodationsByArea(area) {
  try {
    const accommodations = await prisma.accommodation.findMany({
      where: { area },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return accommodations
  } catch (error) {
    console.error('Error fetching accommodations by area:', error)
    throw new Error('Failed to fetch accommodations by area')
  }
}

/**
 * 숙소를 생성합니다
 * @param {Object} accommodationData - 숙소 데이터
 * @returns {Promise<Object>} 생성된 숙소 정보
 */
export async function createAccommodation(accommodationData) {
  try {
    const accommodation = await prisma.accommodation.create({
      data: accommodationData
    })
    
    return accommodation
  } catch (error) {
    console.error('Error creating accommodation:', error)
    throw new Error('Failed to create accommodation')
  }
}

/**
 * 숙소 정보를 업데이트합니다
 * @param {string} id - 숙소 ID
 * @param {Object} updateData - 업데이트할 데이터
 * @returns {Promise<Object>} 업데이트된 숙소 정보
 */
export async function updateAccommodation(id, updateData) {
  try {
    const accommodation = await prisma.accommodation.update({
      where: { id },
      data: updateData
    })
    
    return accommodation
  } catch (error) {
    console.error('Error updating accommodation:', error)
    throw new Error('Failed to update accommodation')
  }
}

/**
 * 숙소를 삭제합니다
 * @param {string} id - 숙소 ID
 * @returns {Promise<Object>} 삭제된 숙소 정보
 */
export async function deleteAccommodation(id) {
  try {
    const accommodation = await prisma.accommodation.delete({
      where: { id }
    })
    
    return accommodation
  } catch (error) {
    console.error('Error deleting accommodation:', error)
    throw new Error('Failed to delete accommodation')
  }
}

/**
 * 숙소 통계를 조회합니다
 * @returns {Promise<Object>} 숙소 통계 정보
 */
export async function getAccommodationStats() {
  try {
    const [totalAccommodations, areaStats] = await Promise.all([
      prisma.accommodation.count(),
      prisma.accommodation.groupBy({
        by: ['area'],
        _count: {
          area: true
        }
      })
    ])
    
    return {
      totalAccommodations,
      areaStats: areaStats.map(stat => ({
        area: stat.area,
        count: stat._count.area
      }))
    }
  } catch (error) {
    console.error('Error fetching accommodation stats:', error)
    throw new Error('Failed to fetch accommodation statistics')
  }
}
