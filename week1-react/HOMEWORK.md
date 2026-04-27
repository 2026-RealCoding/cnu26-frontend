# 과제: 장바구니 기능 구현

## 목표

Week 1에서 배운 내용을 활용해 쇼핑몰에 장바구니 기능을 직접 구현합니다.

---

## 구현해야 할 것

### 필수

| 번호 | 파일 | 내용 |
|---|---|---|
| 과제 1 | `hooks/useCart.js` | localStorage에서 장바구니 초기값 불러오기 |
| 과제 2 | `hooks/useCart.js` | cart 변경 시 localStorage에 자동 저장 |
| 과제 3 | `hooks/useCart.js` | `addToCart` — 상품 추가 (이미 있으면 수량 증가) |
| 과제 4 | `hooks/useCart.js` | `removeFromCart` — 상품 삭제 |
| 과제 5 | `hooks/useCart.js` | `updateQuantity` — 수량 변경 |
| 과제 6 | `hooks/useCart.js` | `clearCart` — 전체 비우기 |
| 과제 7 | `components/CartView.jsx` | 빈 장바구니 상태 처리 |
| 과제 8 | `components/CartView.jsx` | 수량 +/- 버튼 연결 |
| 과제 9 | `components/CartView.jsx` | 삭제 버튼 연결 |
| - | `components/ProductCard.jsx` | `onAddToCart` prop 추가 및 버튼 연결 |
| - | `components/ProductList.jsx` | `onAddToCart` prop 받아서 ProductCard에 전달 |
| - | `App.jsx` | useCart 연결, CartView 렌더링 |

### 심화

| 번호 | 파일 | 내용 |
|---|---|---|
| 과제 10 | `components/CartView.jsx` | 결제하기 버튼 — 장바구니 비우고 완료 메시지 표시 |

---

## 배운 개념과 연결

| 배운 것 | 이번 과제에서 쓰는 곳 |
|---|---|
| `useState` | cart 배열 상태 관리 |
| `useEffect` + `localStorage` | 새로고침 후에도 장바구니 유지 |
| 커스텀 훅 | `useCart` 훅으로 로직 분리 |
| Props / 콜백 Props | App → ProductList → ProductCard로 함수 전달 |
| 조건부 렌더링 | cartOpen 상태에 따라 CartView 표시/숨김 |

---

## 파일 구조

```
수정할 파일:
├── src/
│   ├── App.jsx                      ← useCart 연결, CartView 렌더링
│   ├── hooks/
│   │   └── useCart.js               ← 장바구니 로직 구현 (메인 과제)
│   └── components/
│       ├── CartView.jsx             ← 장바구니 UI 연결
│       ├── ProductCard.jsx          ← 담기 버튼 연결
│       └── ProductList.jsx          ← onAddToCart prop 전달
```

---

## 실행 방법

```bash
cd week1-react
npm install
npm run dev
```

브라우저 `http://localhost:3000` 접속

---

## 완성 시 동작

1. 상품 카드의 "🛒 담기" 버튼 클릭 → 장바구니에 추가
2. 헤더의 🛒 버튼 클릭 → 장바구니 패널 열림
3. 수량 +/- 버튼으로 수량 조절
4. ✕ 버튼으로 상품 삭제
5. 페이지 새로고침 후에도 장바구니 내용 유지
6. (심화) 결제하기 버튼 → 완료 메시지 + 장바구니 초기화
