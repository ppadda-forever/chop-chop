/**
 * 현재 언어에 맞는 필드 값을 반환하는 유틸 함수
 * @param {Object} item - 번역이 필요한 객체 (Restaurant, MenuItem, MenuOption 등)
 * @param {string} fieldName - 기본 필드명 (예: 'name', 'description')
 * @param {string} languageCode - 언어 코드 ('en', 'ja', 'zh', 'ko')
 * @returns {string} - 번역된 값
 */
export const getTranslatedField = (item, fieldName, languageCode) => {
  if (!item) return ''
  
  // 한국어는 기본 필드 사용
  if (languageCode === 'ko' || !languageCode) {
    return item[fieldName] || ''
  }
  
  // 다른 언어는 필드명 + 언어코드 suffix
  const suffixMap = {
    'en': 'En',
    'ja': 'Jp',
    'zh': 'Cn'
  }
  
  const suffix = suffixMap[languageCode]
  if (!suffix) {
    return item[fieldName] || ''
  }
  
  // fieldName을 camelCase로 변환하여 suffix 추가
  const translatedFieldName = fieldName + suffix
  return item[translatedFieldName] || item[fieldName] || ''
}

/**
 * UI 텍스트 번역을 위한 객체
 */
export const translations = {
  // 공통
  common: {
    loading: {
      en: 'Loading...',
      ja: '読み込み中...',
      zh: '加载中...',
      ko: '로딩 중...'
    },
    orderNow: {
      en: 'Order Now',
      ja: '今すぐ注文',
      zh: '立即订购',
      ko: '지금 주문'
    },
    cart: {
      en: 'Cart',
      ja: 'カート',
      zh: '购物车',
      ko: '장바구니'
    },
    checkout: {
      en: 'Checkout',
      ja: 'お会計',
      zh: '结账',
      ko: '결제하기'
    },
    back: {
      en: 'Back',
      ja: '戻る',
      zh: '返回',
      ko: '뒤로'
    }
  },
  
  // 홈페이지
  home: {
    welcome: {
      en: 'Welcome to\nChop Chop',
      ja: 'Chop Chopへ\nようこそ',
      zh: '欢迎来到\nChop Chop',
      ko: 'Chop Chop에\n오신 것을 환영합니다'
    },
    heroDescription: {
      en: 'Your go-to for delicious food delivery in Seoul. Explore local flavors and enjoy a taste of Korea, delivered right to your door.',
      ja: 'ソウルでの美味しい料理配達サービス。地元の味を探求し、韓国の味をドアまでお届けします。',
      zh: '首尔美食外卖首选。探索当地风味，享受送货上门的韩国美食。',
      ko: '서울에서 맛있는 음식 배달의 최고 선택. 지역 맛을 탐험하고 문 앞까지 배달되는 한국의 맛을 즐기세요.'
    },
    recommendedDishes: {
      en: 'Recommended Dishes',
      ja: 'おすすめ料理',
      zh: '推荐菜品',
      ko: '추천 메뉴'
    },
    deliveringTo: {
      en: 'Delivering to:',
      ja: '配達先:',
      zh: '配送至:',
      ko: '배달 위치:'
    },
    from: {
      en: 'from',
      ja: 'より',
      zh: '来自',
      ko: '에서'
    }
  },
  
  // 레스토랑 목록
  restaurants: {
    title: {
      en: 'Restaurants',
      ja: 'レストラン',
      zh: '餐厅',
      ko: '레스토랑'
    },
    minOrder: {
      en: 'Min. order:',
      ja: '最小注文:',
      zh: '最低订单:',
      ko: '최소 주문:'
    },
    closed: {
      en: 'Closed',
      ja: '閉店',
      zh: '已关闭',
      ko: '영업 종료'
    }
  },
  
  // 레스토랑 상세
  restaurant: {
    menu: {
      en: 'Menu',
      ja: 'メニュー',
      zh: '菜单',
      ko: '메뉴'
    },
    minOrderAmount: {
      en: 'Minimum order amount:',
      ja: '最小注文金額:',
      zh: '最低订单金额:',
      ko: '최소 주문 금액:'
    },
    unavailable: {
      en: 'Unavailable',
      ja: '在庫切れ',
      zh: '暂不可用',
      ko: '품절'
    }
  },
  
  // 메뉴 아이템
  menuItem: {
    addToCart: {
      en: 'Add to Cart',
      ja: 'カートに追加',
      zh: '加入购物车',
      ko: '장바구니에 추가'
    },
    quantity: {
      en: 'Quantity',
      ja: '数量',
      zh: '数量',
      ko: '수량'
    },
    options: {
      en: 'Options',
      ja: 'オプション',
      zh: '选项',
      ko: '옵션'
    },
    required: {
      en: 'Required',
      ja: '必須',
      zh: '必选',
      ko: '필수'
    },
    total: {
      en: 'Total',
      ja: '合計',
      zh: '总计',
      ko: '합계'
    }
  },
  
  // 장바구니
  cart: {
    title: {
      en: 'Your Cart',
      ja: 'カート',
      zh: '购物车',
      ko: '장바구니'
    },
    empty: {
      en: 'Your cart is empty',
      ja: 'カートは空です',
      zh: '购物车为空',
      ko: '장바구니가 비어있습니다'
    },
    subtotal: {
      en: 'Subtotal',
      ja: '小計',
      zh: '小计',
      ko: '소계'
    },
    deliveryFee: {
      en: 'Delivery Fee',
      ja: '配達料',
      zh: '配送费',
      ko: '배달비'
    },
    total: {
      en: 'Total',
      ja: '合計',
      zh: '总计',
      ko: '합계'
    },
    proceedToCheckout: {
      en: 'Proceed to Checkout',
      ja: 'お会計に進む',
      zh: '进行结账',
      ko: '결제하기'
    },
    continueShopping: {
      en: 'Continue Shopping',
      ja: '買い物を続ける',
      zh: '继续购物',
      ko: '쇼핑 계속하기'
    },
    minOrderWarning: {
      en: 'Minimum order amount is',
      ja: '最小注文金額は',
      zh: '最低订单金额为',
      ko: '최소 주문 금액은'
    },
    pleaseAdd: {
      en: 'Please add',
      ja: 'さらに追加してください',
      zh: '请再添加',
      ko: '더 추가해주세요'
    },
    more: {
      en: 'more to your order.',
      ja: 'をご注文に追加してください。',
      zh: '以上商品。',
      ko: '원 이상 주문해주세요.'
    }
  },
  
  // 체크아웃
  checkout: {
    title: {
      en: 'Checkout',
      ja: 'お会計',
      zh: '结账',
      ko: '결제하기'
    },
    deliveryInfo: {
      en: 'Delivery Information',
      ja: '配達情報',
      zh: '配送信息',
      ko: '배달 정보'
    },
    location: {
      en: 'Location',
      ja: '場所',
      zh: '地点',
      ko: '위치'
    },
    selectLocation: {
      en: 'Select delivery location',
      ja: '配達先を選択',
      zh: '选择配送地点',
      ko: '배달 위치 선택'
    },
    specialInstructions: {
      en: 'Special Instructions',
      ja: '特別な指示',
      zh: '特殊说明',
      ko: '특별 요청사항'
    },
    paymentMethod: {
      en: 'Payment Method',
      ja: '支払い方法',
      zh: '支付方式',
      ko: '결제 방법'
    },
    creditCard: {
      en: 'Credit Card',
      ja: 'クレジットカード',
      zh: '信用卡',
      ko: '신용카드'
    },
    paypal: {
      en: 'PayPal',
      ja: 'PayPal',
      zh: 'PayPal',
      ko: 'PayPal'
    },
    orderSummary: {
      en: 'Order Summary',
      ja: '注文概要',
      zh: '订单摘要',
      ko: '주문 요약'
    },
    placeOrder: {
      en: 'Place Order',
      ja: '注文する',
      zh: '下单',
      ko: '주문하기'
    }
  },
  
  // 주문 확인
  confirmation: {
    title: {
      en: 'Order Confirmed!',
      ja: '注文が確認されました！',
      zh: '订单已确认！',
      ko: '주문 완료!'
    },
    success: {
      en: 'Your order has been successfully placed and is being prepared.',
      ja: 'ご注文は正常に受け付けられ、準備中です。',
      zh: '您的订单已成功提交并正在准备中。',
      ko: '주문이 성공적으로 접수되어 준비 중입니다.'
    },
    orderId: {
      en: 'Order ID:',
      ja: '注文ID:',
      zh: '订单号:',
      ko: '주문번호:'
    },
    orderItems: {
      en: 'Order Items',
      ja: '注文商品',
      zh: '订单商品',
      ko: '주문 상품'
    },
    estimatedDelivery: {
      en: 'Estimated Delivery',
      ja: '配達予定時間',
      zh: '预计送达',
      ko: '예상 배달 시간'
    },
    viewOrderStatus: {
      en: 'View Order Status',
      ja: '注文状況を確認',
      zh: '查看订单状态',
      ko: '주문 상태 보기'
    },
    continueShopping: {
      en: 'Continue Shopping',
      ja: '買い物を続ける',
      zh: '继续购物',
      ko: '쇼핑 계속하기'
    }
  }
}

/**
 * UI 텍스트 번역 가져오기
 * @param {string} category - 카테고리 (예: 'common', 'home', 'cart')
 * @param {string} key - 텍스트 키
 * @param {string} languageCode - 언어 코드
 * @returns {string} - 번역된 텍스트
 */
export const t = (category, key, languageCode = 'en') => {
  try {
    return translations[category]?.[key]?.[languageCode] || translations[category]?.[key]?.['en'] || key
  } catch (error) {
    console.error('Translation error:', error)
    return key
  }
}

