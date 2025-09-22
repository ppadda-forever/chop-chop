import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')
  
  // Test database connection
  try {
    await prisma.$connect()
    console.log('✅ Database connected successfully')
  } catch (error) {
    console.error('❌ Database connection failed:', error.message)
    return
  }

  // Clear existing data
  console.log('🗑️ Clearing existing data...')
  await prisma.orderOptionSelection.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.menuOption.deleteMany()
  await prisma.menuItem.deleteMany()
  await prisma.restaurant.deleteMany()
  await prisma.accommodation.deleteMany()
  console.log('✅ Existing data cleared')

  // 1. 숙소 데이터 생성
  const accommodations = await Promise.all([
    prisma.accommodation.create({
      data: {
        name: '강남 호텔',
        nameEn: 'Gangnam Hotel',
        address: '서울시 강남구 테헤란로 123',
        area: 'GANGNAM',
        hostName: '김호텔',
        hostPhone: '02-1234-5678',
        hostEmail: 'gangnam@hotel.com',
        qrCode: 'QR_GANGNAM_001',
        description: '강남 중심가의 편리한 호텔입니다.'
      }
    }),
    prisma.accommodation.create({
      data: {
        name: '명동 게스트하우스',
        nameEn: 'Myeongdong Guesthouse',
        address: '서울시 중구 명동길 456',
        area: 'MYEONGDONG',
        hostName: '박게스트',
        hostPhone: '02-2345-6789',
        hostEmail: 'myeongdong@guest.com',
        qrCode: 'QR_MYEONGDONG_002',
        description: '명동 관광지 근처의 아늑한 게스트하우스입니다.'
      }
    }),
    prisma.accommodation.create({
      data: {
        name: '홍대 호스텔',
        nameEn: 'Hongdae Hostel',
        address: '서울시 마포구 홍익로 789',
        area: 'HONGDAE',
        hostName: '이호스텔',
        hostPhone: '02-3456-7890',
        hostEmail: 'hongdae@hostel.com',
        qrCode: 'QR_HONGDAE_003',
        description: '홍대의 젊은 에너지가 느껴지는 호스텔입니다.'
      }
    })
  ])

  console.log('✅ Accommodations created:', accommodations.length)

  // 2. 레스토랑 데이터 생성
  const restaurants = await Promise.all([
    prisma.restaurant.create({
      data: {
        name: "김치찌개 전문점",
        nameEn: "Kimchi Stew House",
        nameJp: "キムチチゲ専門店",
        nameCn: "泡菜汤专门店",
        areas: ['GANGNAM', 'MYEONGDONG'],
        category: 'KOREAN',
        image: 'http://localhost:3845/assets/022787118fd78cb566b22005f5ad4838434e4b1e.png',
        minOrderAmount: 15000,
        isActive: true
      }
    }),
    prisma.restaurant.create({
      data: {
        name: "불고기 덮밥집",
        nameEn: "Bulgogi Bowl House",
        nameJp: "プルコギ丼屋",
        nameCn: "烤肉盖饭店",
        areas: ['GANGNAM', 'HONGDAE'],
        category: 'KOREAN',
        image: 'http://localhost:3845/assets/4b2974d8422b76790b77f1646bf9b9faf6fde9d0.png',
        minOrderAmount: 12000,
        isActive: true
      }
    }),
    prisma.restaurant.create({
      data: {
        name: "양념치킨 전문점",
        nameEn: "Yangnyeom Chicken House",
        nameJp: "ヤンニョムチキン専門店",
        nameCn: "调味炸鸡专门店",
        areas: ['HONGDAE', 'MYEONGDONG'],
        category: 'CHICKEN',
        image: 'http://localhost:3845/assets/be8cc8da87b99ca2ec3292ffe888d5e3def8be22.png',
        minOrderAmount: 18000,
        isActive: true
      }
    }),
    prisma.restaurant.create({
      data: {
        name: "떡볶이 포차",
        nameEn: "Tteokbokki Stall",
        nameJp: "トッポッキ屋台",
        nameCn: "炒年糕摊",
        areas: ['GANGNAM', 'HONGDAE', 'MYEONGDONG'],
        category: 'BUNSIK',
        image: 'http://localhost:3845/assets/4b2974d8422b76790b77f1646bf9b9faf6fde9d0.png',
        minOrderAmount: 8000,
        isActive: true
      }
    }),
    prisma.restaurant.create({
      data: {
        name: "일본식 라멘집",
        nameEn: "Japanese Ramen House",
        nameJp: "日本ラーメン店",
        nameCn: "日式拉面店",
        areas: ['GANGNAM', 'ITAEWON'],
        category: 'ASIAN',
        image: 'http://localhost:3845/assets/a1563db6423be213da8c0180e465b77ff08f8d72.png',
        minOrderAmount: 12000,
        isActive: true
      }
    }),
    prisma.restaurant.create({
      data: {
        name: "이탈리안 피자",
        nameEn: "Italian Pizza House",
        nameJp: "イタリアンピザ店",
        nameCn: "意大利披萨店",
        areas: ['GANGNAM', 'HONGDAE'],
        category: 'PIZZA',
        image: 'http://localhost:3845/assets/04eabca8d4744c7876b28cca858d0c339639085b.png',
        minOrderAmount: 20000,
        isActive: true
      }
    })
  ])

  console.log('✅ Restaurants created:', restaurants.length)

  // 3. 메뉴 아이템 데이터 생성
  const menuItems = []

  // 김치찌개 전문점 메뉴
  const kimchiRestaurant = restaurants[0]
  const kimchiMenuItems = await Promise.all([
    prisma.menuItem.create({
      data: {
        restaurantId: kimchiRestaurant.id,
        name: '김치찌개',
        nameEn: 'Kimchi Stew',
        nameJp: 'キムチチゲ',
        nameCn: '泡菜汤',
        description: '매콤하고 시원한 김치찌개',
        descriptionEn: 'Spicy and refreshing kimchi stew',
        descriptionJp: '辛くて爽やかなキムチチゲ',
        descriptionCn: '辛辣清爽的泡菜汤',
        basePrice: 13000,
        image: 'http://localhost:3845/assets/a1563db6423be213da8c0180e465b77ff08f8d72.png',
        isPopular: true,
        isAvailable: true
      }
    }),
    prisma.menuItem.create({
      data: {
        restaurantId: kimchiRestaurant.id,
        name: '된장찌개',
        nameEn: 'Doenjang Stew',
        nameJp: 'テンジャンチゲ',
        nameCn: '大酱汤',
        description: '구수한 된장찌개',
        descriptionEn: 'Rich and savory doenjang stew',
        descriptionJp: 'コクのあるテンジャンチゲ',
        descriptionCn: '浓郁的大酱汤',
        basePrice: 12000,
        image: 'http://localhost:3845/assets/387cac7cf5de9526e0f1a6c973829841ad12060c.png',
        isPopular: false,
        isAvailable: true
      }
    })
  ])

  // 불고기 덮밥집 메뉴
  const bulgogiRestaurant = restaurants[1]
  const bulgogiMenuItems = await Promise.all([
    prisma.menuItem.create({
      data: {
        restaurantId: bulgogiRestaurant.id,
        name: '불고기 덮밥',
        nameEn: 'Bulgogi Bowl',
        nameJp: 'プルコギ丼',
        nameCn: '烤肉盖饭',
        description: '달콤한 불고기와 밥의 조화',
        descriptionEn: 'Perfect harmony of sweet bulgogi and rice',
        descriptionJp: '甘いプルコギとご飯の調和',
        descriptionCn: '甜烤肉与米饭的完美搭配',
        basePrice: 15600,
        image: 'http://localhost:3845/assets/387cac7cf5de9526e0f1a6c973829841ad12060c.png',
        isPopular: true,
        isAvailable: true
      }
    }),
    prisma.menuItem.create({
      data: {
        restaurantId: bulgogiRestaurant.id,
        name: '갈비 덮밥',
        nameEn: 'Galbi Bowl',
        nameJp: 'カルビ丼',
        nameCn: '排骨盖饭',
        description: '부드러운 갈비와 밥',
        descriptionEn: 'Tender galbi with rice',
        descriptionJp: '柔らかいカルビとご飯',
        descriptionCn: '嫩排骨配米饭',
        basePrice: 18000,
        image: 'http://localhost:3845/assets/be8cc8da87b99ca2ec3292ffe888d5e3def8be22.png',
        isPopular: false,
        isAvailable: true
      }
    })
  ])

  // 양념치킨 전문점 메뉴
  const chickenRestaurant = restaurants[2]
  const chickenMenuItems = await Promise.all([
    prisma.menuItem.create({
      data: {
        restaurantId: chickenRestaurant.id,
        name: '양념치킨',
        nameEn: 'Yangnyeom Chicken',
        nameJp: 'ヤンニョムチキン',
        nameCn: '调味炸鸡',
        description: '달콤매콤한 양념치킨',
        descriptionEn: 'Sweet and spicy yangnyeom chicken',
        nameJp: '甘辛いヤンニョムチキン',
        nameCn: '甜辣调味炸鸡',
        basePrice: 10400,
        image: 'http://localhost:3845/assets/be8cc8da87b99ca2ec3292ffe888d5e3def8be22.png',
        isPopular: true,
        isAvailable: true
      }
    }),
    prisma.menuItem.create({
      data: {
        restaurantId: chickenRestaurant.id,
        name: '후라이드 치킨',
        nameEn: 'Fried Chicken',
        nameJp: 'フライドチキン',
        nameCn: '炸鸡',
        description: '바삭한 후라이드 치킨',
        descriptionEn: 'Crispy fried chicken',
        nameJp: 'サクサクのフライドチキン',
        nameCn: '酥脆炸鸡',
        basePrice: 9500,
        image: 'http://localhost:3845/assets/4b2974d8422b76790b77f1646bf9b9faf6fde9d0.png',
        isPopular: false,
        isAvailable: true
      }
    })
  ])

  // 떡볶이 포차 메뉴
  const tteokbokkiRestaurant = restaurants[3]
  const tteokbokkiMenuItems = await Promise.all([
    prisma.menuItem.create({
      data: {
        restaurantId: tteokbokkiRestaurant.id,
        name: '떡볶이',
        nameEn: 'Tteokbokki',
        nameJp: 'トッポッキ',
        nameCn: '炒年糕',
        description: '매콤한 떡볶이',
        descriptionEn: 'Spicy tteokbokki',
        nameJp: '辛いトッポッキ',
        nameCn: '辣炒年糕',
        basePrice: 19500,
        image: 'http://localhost:3845/assets/4b2974d8422b76790b77f1646bf9b9faf6fde9d0.png',
        isPopular: true,
        isAvailable: true
      }
    }),
    prisma.menuItem.create({
      data: {
        restaurantId: tteokbokkiRestaurant.id,
        name: '순대',
        nameEn: 'Sundae',
        nameJp: 'スンデ',
        nameCn: '血肠',
        description: '고소한 순대',
        descriptionEn: 'Savory sundae',
        nameJp: '香ばしいスンデ',
        nameCn: '香浓血肠',
        basePrice: 8000,
        image: 'http://localhost:3845/assets/a1563db6423be213da8c0180e465b77ff08f8d72.png',
        isPopular: false,
        isAvailable: true
      }
    })
  ])

  menuItems.push(...kimchiMenuItems, ...bulgogiMenuItems, ...chickenMenuItems, ...tteokbokkiMenuItems)

  console.log('✅ Menu items created:', menuItems.length)

  // 4. 메뉴 옵션 데이터 생성
  const menuOptions = []

  // 모든 메뉴 아이템에 공통 옵션 추가
  for (const menuItem of menuItems) {
    const options = await Promise.all([
      // 크기 옵션
      prisma.menuOption.create({
        data: {
          menuItemId: menuItem.id,
          type: 'SIZE',
          name: '일반',
          nameEn: 'Regular',
          nameJp: 'レギュラー',
          nameCn: '普通',
          price: 0,
          isRequired: true,
          isActive: true,
          sortOrder: 1
        }
      }),
      prisma.menuOption.create({
        data: {
          menuItemId: menuItem.id,
          type: 'SIZE',
          name: '대',
          nameEn: 'Large',
          nameJp: 'ラージ',
          nameCn: '大',
          price: 2000,
          isRequired: false,
          isActive: true,
          sortOrder: 2
        }
      }),
      // 매운맛 옵션 (한식 메뉴에만)
      ...(menuItem.name.includes('김치') || menuItem.name.includes('떡볶이') || menuItem.name.includes('양념') ? [
        prisma.menuOption.create({
          data: {
            menuItemId: menuItem.id,
            type: 'SPICY',
            name: '순한맛',
            nameEn: 'Mild',
            nameJp: 'マイルド',
            nameCn: '微辣',
            price: 0,
            isRequired: true,
            isActive: true,
            sortOrder: 3
          }
        }),
        prisma.menuOption.create({
          data: {
            menuItemId: menuItem.id,
            type: 'SPICY',
            name: '중간맛',
            nameEn: 'Medium',
            nameJp: 'ミディアム',
            nameCn: '中辣',
            price: 0,
            isRequired: false,
            isActive: true,
            sortOrder: 4
          }
        }),
        prisma.menuOption.create({
          data: {
            menuItemId: menuItem.id,
            type: 'SPICY',
            name: '매운맛',
            nameEn: 'Spicy',
            nameJp: 'スパイシー',
            nameCn: '辣',
            price: 0,
            isRequired: false,
            isActive: true,
            sortOrder: 5
          }
        })
      ] : []),
      // 추가 옵션
      prisma.menuOption.create({
        data: {
          menuItemId: menuItem.id,
          type: 'ADDITIONAL',
          name: '추가 소스',
          nameEn: 'Extra Sauce',
          nameJp: '追加ソース',
          nameCn: '额外酱料',
          price: 1000,
          isRequired: false,
          isActive: true,
          sortOrder: 6
        }
      }),
      prisma.menuOption.create({
        data: {
          menuItemId: menuItem.id,
          type: 'ADDITIONAL',
          name: '단무지',
          nameEn: 'Pickled Radish',
          nameJp: 'タクアン',
          nameCn: '萝卜泡菜',
          price: 500,
          isRequired: false,
          isActive: true,
          sortOrder: 7
        }
      })
    ])
    menuOptions.push(...options)
  }

  console.log('✅ Menu options created:', menuOptions.length)

  console.log('🎉 Seed completed successfully!')
  console.log(`📊 Summary:`)
  console.log(`   - Accommodations: ${accommodations.length}`)
  console.log(`   - Restaurants: ${restaurants.length}`)
  console.log(`   - Menu Items: ${menuItems.length}`)
  console.log(`   - Menu Options: ${menuOptions.length}`)
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
