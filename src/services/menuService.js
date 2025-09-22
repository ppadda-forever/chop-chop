import { prisma } from '../lib/prisma.js'

/**
 * 모든 메뉴 아이템을 조회합니다
 * @returns {Promise<Array>} 메뉴 아이템 목록
 */
export async function getAllMenuItems() {
  try {
    const menuItems = await prisma.menuItem.findMany({
      where: {
        isAvailable: true
      },
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
            category: true
          }
        },
        menuOptions: {
          where: {
            isActive: true
          },
          orderBy: {
            sortOrder: 'asc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return menuItems
  } catch (error) {
    console.error('Error fetching all menu items:', error)
    throw new Error('Failed to fetch menu items')
  }
}

/**
 * ID로 특정 메뉴 아이템을 조회합니다
 * @param {string} id - 메뉴 아이템 ID
 * @returns {Promise<Object>} 메뉴 아이템 정보
 */
export async function getMenuItemById(id) {
  try {
    const menuItem = await prisma.menuItem.findUnique({
      where: {
        id: id,
        isAvailable: true
      },
      include: {
        restaurant: true,
        menuOptions: {
          where: {
            isActive: true
          },
          orderBy: {
            sortOrder: 'asc'
          }
        }
      }
    })
    
    if (!menuItem) {
      throw new Error('Menu item not found')
    }
    
    return menuItem
  } catch (error) {
    console.error('Error fetching menu item by ID:', error)
    throw new Error('Failed to fetch menu item')
  }
}

/**
 * 인기 메뉴 아이템을 조회합니다
 * @param {number} limit - 조회할 메뉴 아이템 수 (기본값: 6)
 * @returns {Promise<Array>} 인기 메뉴 아이템 목록
 */
export async function getPopularMenuItems(limit = 6) {
  try {
    const menuItems = await prisma.menuItem.findMany({
      where: {
        isPopular: true,
        isAvailable: true
      },
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
            category: true
          }
        },
        menuOptions: {
          where: {
            isActive: true
          },
          orderBy: {
            sortOrder: 'asc'
          }
        }
      },
      take: limit,
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return menuItems
  } catch (error) {
    console.error('Error fetching popular menu items:', error)
    throw new Error('Failed to fetch popular menu items')
  }
}

/**
 * 특정 레스토랑의 메뉴 아이템을 조회합니다
 * @param {string} restaurantId - 레스토랑 ID
 * @returns {Promise<Array>} 해당 레스토랑의 메뉴 아이템 목록
 */
export async function getMenuItemsByRestaurant(restaurantId) {
  try {
    const menuItems = await prisma.menuItem.findMany({
      where: {
        restaurantId: restaurantId,
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
      },
      orderBy: {
        isPopular: 'desc',
        createdAt: 'desc'
      }
    })
    
    return menuItems
  } catch (error) {
    console.error('Error fetching menu items by restaurant:', error)
    throw new Error('Failed to fetch menu items by restaurant')
  }
}

/**
 * 카테고리별 메뉴 아이템을 조회합니다
 * @param {string} category - 카테고리
 * @param {number} limit - 조회할 메뉴 아이템 수 (기본값: 10)
 * @returns {Promise<Array>} 해당 카테고리의 메뉴 아이템 목록
 */
export async function getMenuItemsByCategory(category, limit = 10) {
  try {
    const menuItems = await prisma.menuItem.findMany({
      where: {
        isAvailable: true,
        restaurant: {
          category: category,
          isActive: true
        }
      },
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
            category: true
          }
        },
        menuOptions: {
          where: {
            isActive: true
          },
          orderBy: {
            sortOrder: 'asc'
          }
        }
      },
      take: limit,
      orderBy: {
        isPopular: 'desc',
        createdAt: 'desc'
      }
    })
    
    return menuItems
  } catch (error) {
    console.error('Error fetching menu items by category:', error)
    throw new Error('Failed to fetch menu items by category')
  }
}

/**
 * 가격대별 메뉴 아이템을 조회합니다
 * @param {number} minPrice - 최소 가격
 * @param {number} maxPrice - 최대 가격
 * @returns {Promise<Array>} 해당 가격대의 메뉴 아이템 목록
 */
export async function getMenuItemsByPriceRange(minPrice, maxPrice) {
  try {
    const menuItems = await prisma.menuItem.findMany({
      where: {
        isAvailable: true,
        basePrice: {
          gte: minPrice,
          lte: maxPrice
        }
      },
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
            category: true
          }
        },
        menuOptions: {
          where: {
            isActive: true
          },
          orderBy: {
            sortOrder: 'asc'
          }
        }
      },
      orderBy: {
        basePrice: 'asc'
      }
    })
    
    return menuItems
  } catch (error) {
    console.error('Error fetching menu items by price range:', error)
    throw new Error('Failed to fetch menu items by price range')
  }
}

/**
 * 메뉴 아이템을 검색합니다
 * @param {string} searchTerm - 검색어
 * @returns {Promise<Array>} 검색된 메뉴 아이템 목록
 */
export async function searchMenuItems(searchTerm) {
  try {
    const menuItems = await prisma.menuItem.findMany({
      where: {
        isAvailable: true,
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
          },
          {
            description: {
              contains: searchTerm,
              mode: 'insensitive'
            }
          }
        ]
      },
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
            category: true
          }
        },
        menuOptions: {
          where: {
            isActive: true
          },
          orderBy: {
            sortOrder: 'asc'
          }
        }
      },
      orderBy: {
        isPopular: 'desc',
        createdAt: 'desc'
      }
    })
    
    return menuItems
  } catch (error) {
    console.error('Error searching menu items:', error)
    throw new Error('Failed to search menu items')
  }
}
