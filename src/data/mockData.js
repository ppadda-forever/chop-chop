// Mock data for the Chop Chop app

export const categories = [
  'Korean',
  'Chicken', 
  'Bunsik',
  'Pizza',
  'Chinese',
  'Japanese'
];

export const restaurants = [
  {
    id: "1",
    name: "김치찌개 전문점",
    category: "Korean",
    minOrder: 15000,
    image: "http://localhost:3845/assets/022787118fd78cb566b22005f5ad4838434e4b1e.png",
    rating: 4.5,
    deliveryTime: "25-35 min",
    menu: [
      {
        id: "m1",
        name: "김치찌개",
        price: 13000,
        description: "매콤하고 시원한 김치찌개",
        image: "http://localhost:3845/assets/a1563db6423be213da8c0180e465b77ff08f8d72.png",
        options: {
          size: ['일반', '대'],
          spiceLevel: ['순한맛', '중간맛', '매운맛'],
          addOns: ['추가 소스', '단무지']
        }
      },
      {
        id: "m2",
        name: "된장찌개",
        price: 12000,
        description: "구수한 된장찌개",
        image: "http://localhost:3845/assets/387cac7cf5de9526e0f1a6c973829841ad12060c.png",
        options: {
          size: ['일반', '대'],
          addOns: ['추가 소스', '단무지']
        }
      }
    ]
  },
  {
    id: "2",
    name: "불고기 덮밥집",
    category: "Korean",
    minOrder: 12000,
    image: "http://localhost:3845/assets/4b2974d8422b76790b77f1646bf9b9faf6fde9d0.png",
    rating: 4.3,
    deliveryTime: "20-30 min",
    menu: [
      {
        id: "m3",
        name: "불고기 덮밥",
        price: 15600,
        description: "달콤한 불고기와 밥의 조화",
        image: "http://localhost:3845/assets/387cac7cf5de9526e0f1a6c973829841ad12060c.png",
        options: {
          size: ['일반', '대'],
          addOns: ['추가 소스', '단무지']
        }
      }
    ]
  },
  {
    id: "3",
    name: "양념치킨 전문점",
    category: "Chicken",
    minOrder: 18000,
    image: "http://localhost:3845/assets/be8cc8da87b99ca2ec3292ffe888d5e3def8be22.png",
    rating: 4.7,
    deliveryTime: "30-40 min",
    menu: [
      {
        id: "m4",
        name: "양념치킨",
        price: 10400,
        description: "달콤매콤한 양념치킨",
        image: "http://localhost:3845/assets/be8cc8da87b99ca2ec3292ffe888d5e3def8be22.png",
        options: {
          size: ['일반', '대'],
          spiceLevel: ['순한맛', '중간맛', '매운맛'],
          addOns: ['추가 소스', '단무지']
        }
      }
    ]
  },
  {
    id: "4",
    name: "떡볶이 포차",
    category: "Bunsik",
    minOrder: 8000,
    image: "http://localhost:3845/assets/4b2974d8422b76790b77f1646bf9b9faf6fde9d0.png",
    rating: 4.2,
    deliveryTime: "15-25 min",
    menu: [
      {
        id: "m5",
        name: "떡볶이",
        price: 19500,
        description: "매콤한 떡볶이",
        image: "http://localhost:3845/assets/4b2974d8422b76790b77f1646bf9b9faf6fde9d0.png",
        options: {
          size: ['일반', '대'],
          spiceLevel: ['순한맛', '중간맛', '매운맛'],
          addOns: ['추가 소스', '단무지']
        }
      }
    ]
  }
];

export const menuItems = [
  {
    id: 1,
    name: "Kimchi Stew",
    price: 13000,
    description: "Savory Korean dish with a spicy kick",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=200&h=200&fit=crop&crop=center",
    restaurantId: 1,
    category: "Main Course"
  },
  {
    id: 2,
    name: "Bulgogi Bowl",
    price: 15600,
    description: "Classic Korean comfort food with tender beef",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=200&h=200&fit=crop&crop=center",
    restaurantId: 1,
    category: "Main Course"
  },
  {
    id: 3,
    name: "Yangnyeom Chicken",
    price: 10400,
    description: "Crispy fried chicken with a sweet and spicy sauce",
    image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=200&h=200&fit=crop&crop=center",
    restaurantId: 1,
    category: "Main Course"
  },
  {
    id: 4,
    name: "Tteokbokki",
    price: 19500,
    description: "Spicy rice cakes with fish cakes and vegetables",
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=200&h=200&fit=crop&crop=center",
    restaurantId: 1,
    category: "Main Course"
  }
];

export const recommendedDishes = [
  {
    id: "rd1",
    name: "매운 떡볶이",
    description: "매콤한 떡볶이",
    image: "http://localhost:3845/assets/4b2974d8422b76790b77f1646bf9b9faf6fde9d0.png",
    price: 19500,
    restaurantId: "4"
  },
  {
    id: "rd2",
    name: "불고기 덮밥",
    description: "달콤한 불고기와 밥의 조화",
    image: "http://localhost:3845/assets/387cac7cf5de9526e0f1a6c973829841ad12060c.png",
    price: 15600,
    restaurantId: "2"
  },
  {
    id: "rd3",
    name: "양념치킨",
    description: "달콤매콤한 양념치킨",
    image: "http://localhost:3845/assets/be8cc8da87b99ca2ec3292ffe888d5e3def8be22.png",
    price: 10400,
    restaurantId: "3"
  }
];

export const heroImage = "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=500&fit=crop&crop=center";
