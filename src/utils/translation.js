/**
 * 현재 언어에 맞는 필드 값을 반환하는 유틸 함수
 * @param {Object} item - 번역이 필요한 객체 (Restaurant, MenuItem, MenuOption 등)
 * @param {string} fieldName - 기본 필드명 (예: 'name', 'description')
 * @param {string} languageCode - 언어 코드 ('en', 'ja', 'cn', 'ko')
 * @returns {string} - 번역된 값
 */
export const getTranslatedField = (item, fieldName, languageCode) => {
  if (!item) return null
  
  // 한국어는 기본 필드 사용
  if (languageCode === 'ko' || !languageCode) {
    return item[fieldName] || null
  }
  
  // 다른 언어는 필드명 + 언어코드 suffix
  const suffixMap = {
    'en': 'En',
    'ja': 'Jp',
    'cn': 'Cn'
  }
  
  const suffix = suffixMap[languageCode]
  if (!suffix) {
    return item[fieldName] || null
  }
  
  // fieldName을 camelCase로 변환하여 suffix 추가
  const translatedFieldName = fieldName + suffix
  // 특정 언어 필드가 없으면 null 반환 (fallback 제거)
  return item[translatedFieldName] || null
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
      cn: '加载中...',
      ko: '로딩 중...'
    },
    orderNow: {
      en: 'Order Now',
      ja: '今すぐ注文',
      cn: '立即订购',
      ko: '지금 주문'
    },
    cart: {
      en: 'Cart',
      ja: 'カート',
      cn: '购物车',
      ko: '장바구니'
    },
    checkout: {
      en: 'Checkout',
      ja: 'お会計',
      cn: '结账',
      ko: '결제하기'
    },
    back: {
      en: 'Back',
      ja: '戻る',
      cn: '返回',
      ko: '뒤로'
    }
  },
  
  // 홈페이지
  home: {
    welcome: {
      en: 'Welcome to\nChop Chop',
      ja: 'Chop Chopへ\nようこそ',
      cn: '欢迎来到\nChop Chop',
      ko: 'Chop Chop에\n오신 것을 환영합니다'
    },
    heroDescription: {
      en: 'Your go-to for delicious food delivery in Seoul. Explore local flavors and enjoy a taste of Korea, delivered right to your door.',
      ja: 'ソウルでの美味しい料理配達サービス。地元の味を探求し、韓国の味をドアまでお届けします。',
      cn: '首尔美食外卖首选。探索当地风味，享受送货上门的韩国美食。',
      ko: '서울에서 맛있는 음식 배달의 최고 선택. 지역 맛을 탐험하고 문 앞까지 배달되는 한국의 맛을 즐기세요.'
    },
    recommendedDishes: {
      en: 'Recommended Dishes',
      ja: 'おすすめ料理',
      cn: '推荐菜品',
      ko: '추천 메뉴'
    },
    deliveringTo: {
      en: 'Delivering to:',
      ja: '配達先:',
      cn: '配送至:',
      ko: '배달 위치:'
    },
    from: {
      en: 'from',
      ja: 'より',
      cn: '来自',
      ko: '에서'
    }
  },
  
  // 레스토랑 목록
  restaurants: {
    title: {
      en: 'Restaurants',
      ja: 'レストラン',
      cn: '餐厅',
      ko: '레스토랑'
    },
    minOrder: {
      en: 'Min. order:',
      ja: '最小注文:',
      cn: '最低订单:',
      ko: '최소 주문:'
    },
    closed: {
      en: 'Closed',
      ja: '閉店',
      cn: '已关闭',
      ko: '영업 종료'
    }
  },
  
  // 레스토랑 상세
  restaurant: {
    menu: {
      en: 'Menu',
      ja: 'メニュー',
      cn: '菜单',
      ko: '메뉴'
    },
    minOrderAmount: {
      en: 'Minimum order amount:',
      ja: '最小注文金額:',
      cn: '最低订单金额:',
      ko: '최소 주문 금액:'
    },
    unavailable: {
      en: 'Unavailable',
      ja: '在庫切れ',
      cn: '暂不可用',
      ko: '품절'
    }
  },
  
  // 메뉴 아이템
  menuItem: {
    addToCart: {
      en: 'Add to Cart',
      ja: 'カートに追加',
      cn: '加入购物车',
      ko: '장바구니에 추가'
    },
    quantity: {
      en: 'Quantity',
      ja: '数量',
      cn: '数量',
      ko: '수량'
    },
    options: {
      en: 'Options',
      ja: 'オプション',
      cn: '选项',
      ko: '옵션'
    },
    required: {
      en: 'Required',
      ja: '必須',
      cn: '必选',
      ko: '필수'
    },
    total: {
      en: 'Total',
      ja: '合計',
      cn: '总计',
      ko: '합계'
    }
  },
  
  // 장바구니
  cart: {
    title: {
      en: 'Your Cart',
      ja: 'カート',
      cn: '购物车',
      ko: '장바구니'
    },
    empty: {
      en: 'Your cart is empty',
      ja: 'カートは空です',
      cn: '购物车为空',
      ko: '장바구니가 비어있습니다'
    },
    emptyMessage: {
      en: 'Add some delicious Korean food to get started!',
      ja: '美味しい韓国料理をカートに追加しましょう！',
      cn: '添加一些美味的韩国菜开始吧！',
      ko: '맛있는 한국 음식을 추가해서 시작해보세요!'
    },
    subtotal: {
      en: 'Subtotal',
      ja: '小計',
      cn: '小计',
      ko: '소계'
    },
    deliveryFee: {
      en: 'Delivery Fee',
      ja: '配達料',
      cn: '配送费',
      ko: '배달비'
    },
    total: {
      en: 'Total',
      ja: '合計',
      cn: '总计',
      ko: '합계'
    },
    proceedToCheckout: {
      en: 'Proceed to Checkout',
      ja: 'お会計に進む',
      cn: '进行结账',
      ko: '결제하기'
    },
    continueShopping: {
      en: 'Continue Shopping',
      ja: '買い物を続ける',
      cn: '继续购物',
      ko: '쇼핑 계속하기'
    },
    minOrderWarning: {
      en: 'Minimum order amount is',
      ja: '最小注文金額は',
      cn: '最低订单金额为',
      ko: '최소 주문 금액은'
    },
    pleaseAdd: {
      en: 'Please add',
      ja: 'さらに追加してください',
      cn: '请再添加',
      ko: '더 추가해주세요'
    },
    more: {
      en: 'more to your order.',
      ja: 'をご注文に追加してください。',
      cn: '以上商品。',
      ko: '원 이상 주문해주세요.'
    },
    removeAll: {
      en: 'Remove all',
      ja: 'すべて削除',
      cn: '全部删除',
      ko: '전체 삭제'
    }
  },
  
  // 체크아웃
  checkout: {
    title: {
      en: 'Checkout',
      ja: 'お会計',
      cn: '结账',
      ko: '결제하기'
    },
    deliveryInfo: {
      en: 'Delivery Information',
      ja: '配達情報',
      cn: '配送信息',
      ko: '배달 정보'
    },
    location: {
      en: 'Location',
      ja: '場所',
      cn: '地点',
      ko: '위치'
    },
    address: {
      en: 'Address',
      ja: '住所',
      cn: '地址',
      ko: '주소'
    },
    selectLocation: {
      en: 'Select delivery location',
      ja: '配達先を選択',
      cn: '选择配送地点',
      ko: '배달 위치 선택'
    },
    specialInstructions: {
      en: 'Special Instructions',
      ja: '特別な指示',
      cn: '特殊说明',
      ko: '특별 요청사항'
    },
    specialInstructionsPlaceholder: {
      en: 'Any special instructions for your order...',
      ja: 'ご注文に関する特別なご要望...',
      cn: '订单的任何特殊说明...',
      ko: '주문에 대한 특별 요청사항...'
    },
    paymentMethod: {
      en: 'Payment Method',
      ja: '支払い方法',
      cn: '支付方式',
      ko: '결제 방법'
    },
    creditCard: {
      en: 'Credit Card',
      ja: 'クレジットカード',
      cn: '信用卡',
      ko: '신용카드'
    },
    paypal: {
      en: 'PayPal',
      ja: 'PayPal',
      cn: 'PayPal',
      ko: 'PayPal'
    },
    orderSummary: {
      en: 'Order Summary',
      ja: '注文概要',
      cn: '订单摘要',
      ko: '주문 요약'
    },
    placeOrder: {
      en: 'Place Order',
      ja: '注文する',
      cn: '下单',
      ko: '주문하기'
    }
  },
  
  // 주문 확인
  confirmation: {
    title: {
      en: 'Order Confirmed!',
      ja: '注文が確認されました！',
      cn: '订单已确认！',
      ko: '주문 완료!'
    },
    success: {
      en: 'Your order has been successfully placed and is being prepared.',
      ja: 'ご注文は正常に受け付けられ、準備中です。',
      cn: '您的订单已成功提交并正在准备中。',
      ko: '주문이 성공적으로 접수되어 준비 중입니다.'
    },
    orderId: {
      en: 'Order ID:',
      ja: '注文ID:',
      cn: '订单号:',
      ko: '주문번호:'
    },
    orderItems: {
      en: 'Order Items',
      ja: '注文商品',
      cn: '订单商品',
      ko: '주문 상품'
    },
    estimatedDelivery: {
      en: 'Estimated Delivery',
      ja: '配達予定時間',
      cn: '预计送达',
      ko: '예상 배달 시간'
    },
    viewOrderStatus: {
      en: 'View Order Status',
      ja: '注文状況を確認',
      cn: '查看订单状态',
      ko: '주문 상태 보기'
    },
    continueShopping: {
      en: 'Continue Shopping',
      ja: '買い物を続ける',
      cn: '继续购物',
      ko: '쇼핑 계속하기'
    },
    orderSummary: {
      en: 'Order Summary',
      ja: '注文概要',
      cn: '订单摘要',
      ko: '주문 요약'
    },
    importantNotice: {
      en: 'Important Notice',
      ja: '重要な注意',
      cn: '重要通知',
      ko: '중요 공지'
    },
    importantNoticeMessage: {
      en: 'Please continuously check your order status in Orders. When the status shows Delivered, please come outside to pick up your food.',
      ja: 'Ordersで注文状況を継続的に確認してください。ステータスがDeliveredと表示されたら、外に出て食べ物を取りに行ってください。',
      cn: '请持续在Orders中查看订单状态。当状态显示Delivered时，请到外面取餐。',
      ko: 'Orders에서 주문 현황을 계속적으로 확인하고 상태가 Delivered이면 문 밖에 음식을 가져와 주세요.'
    },
    paymentProcessing: {
      en: 'Payment Processing',
      ja: '決済処理中',
      cn: '支付处理中',
      ko: '결제 중'
    },
    processingPayment: {
      en: 'Processing Payment',
      ja: '決済処理中',
      cn: '正在处理支付',
      ko: '결제 중입니다'
    },
    processingPaymentMessage: {
      en: 'PayPal is processing your payment. Please wait a moment.',
      ja: 'PayPalが決済を処理しています。少々お待ちください。',
      cn: 'PayPal正在处理您的付款。请稍候。',
      ko: 'PayPal에서 결제를 처리하고 있습니다. 잠시만 기다려주세요.'
    },
    checkingStatus: {
      en: 'Checking payment status...',
      ja: '決済状況を確認中...',
      cn: '正在检查支付状态...',
      ko: '결제 상태를 확인하는 중...'
    },
    orderInfo: {
      en: 'Order Info',
      ja: '注文情報',
      cn: '订单信息',
      ko: '주문 정보'
    },
    paymentMethod: {
      en: 'Payment Method',
      ja: '支払い方法',
      cn: '支付方式',
      ko: '결제 수단'
    },
    orderAmount: {
      en: 'Order Amount',
      ja: '注文金額',
      cn: '订单金额',
      ko: '주문 금액'
    },
    deliveryFee: {
      en: 'Delivery Fee',
      ja: '配達料',
      cn: '配送费',
      ko: '배달비'
    },
    totalAmount: {
      en: 'Total Amount',
      ja: '合計金額',
      cn: '总金额',
      ko: '총 금액'
    }
  },
  
  // 주문 목록
  orders: {
    title: {
      en: 'Order Tracking',
      ja: '注文追跡',
      cn: '订单追踪',
      ko: '주문 추적'
    },
    myOrders: {
      en: 'My Orders',
      ja: '注文一覧',
      cn: '我的订单',
      ko: '내 주문'
    },
    noOrders: {
      en: 'No orders yet',
      ja: 'まだ注文がありません',
      cn: '暂无订单',
      ko: '주문이 없습니다'
    },
    noOrdersMessage: {
      en: 'Start ordering delicious food from your favorite restaurants!',
      ja: 'お気に入りのレストランから美味しい料理を注文しましょう！',
      cn: '从您最喜欢的餐厅开始订购美食吧！',
      ko: '좋아하는 레스토랑에서 맛있는 음식을 주문해보세요!'
    },
    orderPlaced: {
      en: 'Order Placed',
      ja: '注文済み',
      cn: '已下单',
      ko: '주문 완료'
    },
    delivered: {
      en: 'Delivered',
      ja: '配達完了',
      cn: '已送达',
      ko: '배달 완료'
    },
    cancelled: {
      en: 'Cancelled',
      ja: 'キャンセル済み',
      cn: '已取消',
      ko: '취소됨'
    },
    orderNumber: {
      en: 'Order',
      ja: '注文番号',
      cn: '订单号',
      ko: '주문번호'
    },
    at: {
      en: 'at',
      ja: 'に',
      cn: '于',
      ko: '에'
    },
    today: {
      en: 'Today',
      ja: '今日',
      cn: '今天',
      ko: '오늘'
    },
    yesterday: {
      en: 'Yesterday',
      ja: '昨日',
      cn: '昨天',
      ko: '어제'
    },
    successfullyDelivered: {
      en: 'Successfully delivered!',
      ja: '配達が完了しました！',
      cn: '送达成功！',
      ko: '배달 완료!'
    },
    pickupFood: {
      en: 'Please pick up your food at the front door!',
      ja: '玄関前で料理をお受け取りください！',
      cn: '请到门口取餐！',
      ko: '현관문 앞에서 음식을 가져가주세요!'
    },
    expectedTime: {
      en: 'Expected in 35-55 minutes',
      ja: '35-55分以内に配達予定',
      cn: '预计35-55分钟内',
      ko: '35-55분 내 예상'
    },
    orderCancelled: {
      en: 'This order was cancelled',
      ja: 'この注文はキャンセルされました',
      cn: '此订单已取消',
      ko: '이 주문은 취소되었습니다'
    },
    orderDetails: {
      en: 'Order Details',
      ja: '注文詳細',
      cn: '订单详情',
      ko: '주문 상세'
    },
    unknownRestaurant: {
      en: 'Unknown Restaurant',
      ja: '不明なレストラン',
      cn: '未知餐厅',
      ko: '알 수 없는 레스토랑'
    }
  },
  
  // 도움말
  help: {
    title: {
      en: 'Help',
      ja: 'ヘルプ',
      cn: '帮助',
      ko: '도움말'
    },
    howCanWeHelp: {
      en: 'How can we help you?',
      ja: '何かお手伝いできることはありますか？',
      cn: '我们能为您做什么？',
      ko: '무엇을 도와드릴까요?'
    },
    helpDescription: {
      en: 'Find answers to common questions or get in touch with our support team',
      ja: 'よくある質問の回答を見つけるか、サポートチームにお問い合わせください',
      cn: '查找常见问题答案或联系我们的支持团队',
      ko: '자주 묻는 질문에 대한 답을 찾거나 고객 지원팀에 문의하세요'
    },
    contactUs: {
      en: 'Contact Us',
      ja: 'お問い合わせ',
      cn: '联系我们',
      ko: '문의하기'
    },
    instagramDm: {
      en: 'Instagram DM',
      ja: 'Instagramダイレクトメッセージ',
      cn: 'Instagram DM',
      ko: 'Instagram DM'
    },
    faq: {
      en: 'Frequently Asked Questions',
      ja: 'よくある質問',
      cn: '常见问题',
      ko: '자주 묻는 질문'
    },
    deliveryTime: {
      en: 'How long does delivery take?',
      ja: '配達にどれくらい時間がかかりますか？',
      cn: '配送需要多长时间？',
      ko: '배달은 얼마나 걸리나요?'
    },
    deliveryTimeAnswer: {
      en: 'Delivery typically takes 35-55 minutes depending on your location and restaurant.',
      ja: '配達は通常、ご住所とレストランによって35-55分かかります。',
      cn: '配送通常需要35-55分钟，具体取决于您的位置和餐厅。',
      ko: '배달은 일반적으로 위치와 레스토랑에 따라 35-55분이 소요됩니다.'
    },
    paymentMethods: {
      en: 'What payment methods do you accept?',
      ja: 'どの支払い方法に対応していますか？',
      cn: '你们接受哪些支付方式？',
      ko: '어떤 결제 수단을 받나요?'
    },
    paymentMethodsAnswer: {
      en: 'We accept PayPal payments.',
      ja: 'PayPal決済に対応しています。',
      cn: '我们接受PayPal支付。',
      ko: '페이팔로 결제가 가능합니다.'
    },
    cancelOrder: {
      en: 'Can I cancel my order?',
      ja: '注文をキャンセルできますか？',
      cn: '我可以取消订单吗？',
      ko: '주문을 취소할 수 있나요?'
    },
    cancelOrderAnswer: {
      en: 'Cancellation is not possible after payment is completed.',
      ja: '決済完了後はキャンセルできません。',
      cn: '付款完成后无法取消。',
      ko: '결제가 완료된 다음에는 취소가 불가능합니다.'
    },
    deliveryArea: {
      en: 'Do you deliver to my area?',
      ja: '私の地域に配達していますか？',
      cn: '你们配送到我所在的地区吗？',
      ko: '제 지역까지 배달하나요?'
    },
    wrongOrder: {
      en: 'What if my order is wrong or missing items?',
      ja: '注文に間違いがあったり、品物が不足している場合は？',
      cn: '如果我的订单有误或缺货怎么办？',
      ko: '주문이 잘못되었거나 품목이 누락되면 어떻게 하나요?'
    },
    wrongOrderAnswer: {
      en: 'Please take a photo of the incorrectly delivered food and send it to us via Instagram DM. We will either redeliver the correct items or provide a full refund.',
      ja: '誤配達された料理の写真を撮って、Instagram DMでお送りください。正しい商品を再配達するか、全額返金いたします。',
      cn: '请拍摄错误配送的食物照片并通过Instagram DM发送给我们。我们将重新配送正确商品或全额退款。',
      ko: 'Instagram DM로 잘못 배달된 음식의 사진을 찍어 보내주세요. 정확한 품목을 재배달하거나 전액 환불해드립니다.'
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

