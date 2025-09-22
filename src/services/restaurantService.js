import { prisma } from '../lib/prisma.js'

/**
 * 모든 활성 레스토랑을 조회합니다
 * @returns {Promise<Array>} 레스토랑 목록
 */
export async function getAllRestaurants() {
  try {
    const restaurants = await prisma.restaurant.findMany({
      where: {
        isActive: true
      },
      include: {
        menuItems: {
          where: {
            isAvailable: true
          },
          include: {
            menuOptions: {
              where: {
                isActive: true
              },
              orderBy: {
                sortOrder: 'asc'
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return restaurants
  } catch (error) {
    console.error('Error fetching all restaurants:', error)
    throw new Error('Failed to fetch restaurants')
  }
}

/**
 * ID로 특정 레스토랑을 조회합니다
 * @param {string} id - 레스토랑 ID
 * @returns {Promise<Object>} 레스토랑 정보
 */
export async function getRestaurantById(id) {
  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: {
        id: id,
        isActive: true
      },
      include: {
        menuItems: {
          where: {
            isAvailable: true
          },
          include: {
            menuOptions: {
              where: {
                isActive: true
              },
              orderBy: {
                sortOrder: 'asc'
              }
            }
          }
        }
      }
    })
    
    if (!restaurant) {
      throw new Error('Restaurant not found')
    }
    
    return restaurant
  } catch (error) {
    console.error('Error fetching restaurant by ID:', error)
    throw new Error('Failed to fetch restaurant')
  }
}

/**
 * 카테고리별 레스토랑을 조회합니다
 * @param {string} category - 카테고리 (KOREAN, CHICKEN, etc.)
 * @returns {Promise<Array>} 해당 카테고리의 레스토랑 목록
 */
export async function getRestaurantsByCategory(category) {
  try {
    const restaurants = await prisma.restaurant.findMany({
      where: {
        category: category,
        isActive: true
      },
      include: {
        menuItems: {
          where: {
            isAvailable: true
          },
          take: 3 // 미리보기용으로 3개만
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return restaurants
  } catch (error) {
    console.error('Error fetching restaurants by category:', error)
    throw new Error('Failed to fetch restaurants by category')
  }
}

/**
 * 지역별 레스토랑을 조회합니다
 * @param {string} area - 지역 (GANGNAM, MYEONGDONG, etc.)
 * @returns {Promise<Array>} 해당 지역의 레스토랑 목록
 */
export async function getRestaurantsByArea(area) {
  try {
    const restaurants = await prisma.restaurant.findMany({
      where: {
        areas: {
          has: area
        },
        isActive: true
      },
      include: {
        menuItems: {
          where: {
            isAvailable: true
          },
          take: 3
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return restaurants
  } catch (error) {
    console.error('Error fetching restaurants by area:', error)
    throw new Error('Failed to fetch restaurants by area')
  }
}

/**
 * 인기 레스토랑을 조회합니다 (인기 메뉴가 있는 레스토랑)
 * @param {number} limit - 조회할 레스토랑 수 (기본값: 6)
 * @returns {Promise<Array>} 인기 레스토랑 목록
 */
export async function getPopularRestaurants(limit = 6) {
  try {
    const restaurants = await prisma.restaurant.findMany({
      where: {
        isActive: true,
        menuItems: {
          some: {
            isPopular: true,
            isAvailable: true
          }
        }
      },
      include: {
        menuItems: {
          where: {
            isPopular: true,
            isAvailable: true
          },
          take: 1 // 인기 메뉴 1개만
        }
      },
      take: limit,
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return restaurants
  } catch (error) {
    console.error('Error fetching popular restaurants:', error)
    throw new Error('Failed to fetch popular restaurants')
  }
}

/**
 * 레스토랑을 검색합니다 (이름으로)
 * @param {string} searchTerm - 검색어
 * @returns {Promise<Array>} 검색된 레스토랑 목록
 */
export async function searchRestaurants(searchTerm) {
  try {
    const restaurants = await prisma.restaurant.findMany({
      where: {
        isActive: true,
        OR: [
          {
            name: {
              contains: searchTerm,
              mode: 'insensitive'
            }
          },
          {
            nameEn: {
              contains: searchTerm,
              mode: 'insensitive'
            }
          }
        ]
      },
      include: {
        menuItems: {
          where: {
            isAvailable: true
          },
          take: 3
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return restaurants
  } catch (error) {
    console.error('Error searching restaurants:', error)
    throw new Error('Failed to search restaurants')
  }
}

/**
 * 레스토랑 통계를 조회합니다
 * @returns {Promise<Object>} 레스토랑 통계 정보
 */
export async function getRestaurantStats() {
  try {
    const [totalRestaurants, activeRestaurants, totalMenuItems] = await Promise.all([
      prisma.restaurant.count(),
      prisma.restaurant.count({
        where: { isActive: true }
      }),
      prisma.menuItem.count({
        where: { isAvailable: true }
      })
    ])
    
    const categoryStats = await prisma.restaurant.groupBy({
      by: ['category'],
      where: { isActive: true },
      _count: {
        category: true
      }
    })
    
    return {
      totalRestaurants,
      activeRestaurants,
      totalMenuItems,
      categoryStats: categoryStats.map(stat => ({
        category: stat.category,
        count: stat._count.category
      }))
    }
  } catch (error) {
    console.error('Error fetching restaurant stats:', error)
    throw new Error('Failed to fetch restaurant statistics')
  }
}
