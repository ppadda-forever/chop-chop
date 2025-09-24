# PayPal 결제 통합 설정 가이드

## 1. PayPal 개발자 계정 설정

1. [PayPal Developer](https://developer.paypal.com/)에 접속
2. PayPal 계정으로 로그인
3. "My Apps & Credentials" 메뉴로 이동
4. "Create App" 버튼 클릭
5. 앱 정보 입력:
   - App Name: ChopChop
   - Merchant: 본인 계정 선택
   - Features: "Accept payments" 체크
6. Sandbox/Live 환경에서 Client ID와 Client Secret 복사

## 2. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일 생성:

```env
# Database
DATABASE_URL="file:./dev.db"

# PayPal Configuration (Sandbox - 테스트용)
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_sandbox_client_id_here
PAYPAL_CLIENT_SECRET=your_paypal_sandbox_client_secret_here
NEXT_PUBLIC_PAYPAL_ENVIRONMENT=sandbox
PAYPAL_API_BASE_URL=https://api.sandbox.paypal.com

# PayPal Webhook ID (선택사항 - 프로덕션에서 권장)
PAYPAL_WEBHOOK_ID=your_webhook_id_here

# Next.js URL (웹훅용)
NEXTAUTH_URL=http://localhost:3000
```

**프로덕션 환경에서는:**
```env
NEXT_PUBLIC_PAYPAL_ENVIRONMENT=live
PAYPAL_API_BASE_URL=https://api.paypal.com
```

## 3. 데이터베이스 마이그레이션

PayPal 결제 정보를 저장하기 위해 데이터베이스를 업데이트합니다:

```bash
npx prisma db push
```

또는

```bash
npx prisma migrate dev --name add-paypal-fields
```

## 4. PayPal 웹훅 설정 (선택사항)

### 개발 환경에서 웹훅 테스트:

1. [ngrok](https://ngrok.com/) 설치
2. 로컬 서버 터널링:
   ```bash
   ngrok http 3000
   ```
3. PayPal Developer Console에서 Webhook 생성:
   - Webhook URL: `https://your-ngrok-url.ngrok.io/api/paypal/webhook`
   - Events: 
     - `PAYMENT.CAPTURE.COMPLETED`
     - `PAYMENT.CAPTURE.DENIED`
     - `PAYMENT.CAPTURE.FAILED`
     - `CHECKOUT.ORDER.APPROVED`
     - `CHECKOUT.ORDER.COMPLETED`

### 프로덕션 환경:
- Webhook URL: `https://yourdomain.com/api/paypal/webhook`

## 5. 테스트

### PayPal 샌드박스 테스트 계정:

PayPal에서 제공하는 테스트 계정을 사용하여 결제를 테스트할 수 있습니다:

**구매자 계정 (Buyer):**
- Email: sb-buyer@personal.example.com
- Password: 자동 생성된 비밀번호

**판매자 계정 (Seller):**
- Email: sb-seller@business.example.com  
- Password: 자동 생성된 비밀번호

### 테스트 절차:

1. 애플리케이션 실행:
   ```bash
   npm run dev
   ```

2. 장바구니에 상품 추가
3. 체크아웃 페이지로 이동
4. PayPal 결제 방식 선택
5. PayPal 버튼 클릭
6. 팝업에서 샌드박스 계정으로 로그인
7. 결제 승인
8. 주문 완료 확인

## 6. 지원되는 통화

현재 설정: **KRW (한국 원)**

다른 통화 사용 시 `src/config/paypal.js`에서 `currency` 값 변경:

```javascript
export const paypalConfig = {
  // ...
  currency: "USD", // 또는 "EUR", "JPY" 등
}
```

## 7. 문제 해결

### 일반적인 오류:

1. **"PayPal configuration error"**
   - `.env.local` 파일의 환경 변수 확인
   - Client ID와 Client Secret이 올바른지 확인

2. **"Failed to create PayPal order"**
   - 네트워크 연결 확인
   - PayPal API 상태 확인
   - 액세스 토큰 생성 오류 로그 확인

3. **"Payment capture failed"**
   - 주문 ID가 유효한지 확인
   - PayPal 계정 잔액 확인 (샌드박스)

### 로그 확인:

개발자 도구의 Console과 Network 탭에서 오류 메시지를 확인하세요.

서버 로그는 터미널에서 확인할 수 있습니다.

## 8. 보안 고려사항

1. **환경 변수 보안:**
   - `.env.local` 파일을 Git에 커밋하지 마세요
   - Client Secret은 서버사이드에서만 사용

2. **웹훅 검증:**
   - 프로덕션에서는 반드시 웹훅 서명 검증 활성화
   - `PAYPAL_WEBHOOK_ID` 환경 변수 설정

3. **HTTPS 사용:**
   - 프로덕션에서는 반드시 HTTPS 사용
   - PayPal 웹훅은 HTTPS만 지원

## 9. 추가 기능

### 환불 처리:
향후 환불 기능이 필요한 경우, PayPal Refund API를 사용할 수 있습니다.

### 정기 결제:
구독 서비스의 경우 PayPal Subscriptions API를 통합할 수 있습니다.

### 다중 통화:
국제 서비스의 경우 사용자 위치에 따른 통화 자동 선택 기능을 구현할 수 있습니다.
