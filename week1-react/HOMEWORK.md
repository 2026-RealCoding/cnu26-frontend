# 과제: 장바구니 기능 구현

## 목표

Week 1에서 배운 내용을 활용해 쇼핑몰에 장바구니 기능을 직접 구현합니다.

---

## 구현해야 할 것

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
| 과제 10 ⭐ | `components/CartView.jsx` | 결제하기 버튼 — 장바구니 비우고 완료 메시지 표시 |
| - | `components/ProductCard.jsx` | `onAddToCart` prop 추가 및 버튼 연결 |
| - | `components/ProductList.jsx` | `onAddToCart` prop 받아서 ProductCard에 전달 |
| - | `App.jsx` | useCart 연결, CartView 렌더링 |

---

## 힌트

### 과제 1 — localStorage에서 초기값 불러오기

**사용 기능:** `useState`, `localStorage.getItem`, `JSON.parse`

`useState`의 초기값 자리에 바로 localStorage 읽기 코드를 넣을 수 있습니다.
localStorage는 문자열만 저장하므로, 읽을 때 `JSON.parse`로 배열로 변환해야 합니다.
저장된 값이 없으면 `null`이 반환되니 기본값(`[]`) 처리도 잊지 마세요.

---

### 과제 2 — cart 변경 시 localStorage에 자동 저장

**사용 기능:** `useEffect`, `localStorage.setItem`, `JSON.stringify`

`cart`가 바뀔 때마다 자동으로 실행되어야 한다면 어떤 Hook을 써야 할까요?
저장할 때는 `JSON.stringify`로 배열을 문자열로 변환해야 합니다.
의존성 배열을 잘 설정하면 cart가 바뀔 때만 실행됩니다.

---

### 과제 3 — addToCart (상품 추가)

**사용 기능:** `Array.find` (또는 `Array.some`), `Array.map`, 스프레드 연산자 `...`

React에서 배열 상태를 변경할 때는 기존 배열을 직접 수정하지 않고 **새 배열을 반환**해야 합니다.

- 이미 담긴 상품인지 확인하려면 `productId`를 기준으로 비교하세요.
- 이미 있으면 → `map()`으로 해당 아이템의 `quantity`만 +1한 새 배열을 만드세요.
- 처음 담는 상품이면 → 스프레드 연산자(`...`)로 기존 배열에 새 아이템을 추가하세요.

---

### 과제 4 — removeFromCart (상품 삭제)

**사용 기능:** `Array.filter`

배열에서 특정 조건의 아이템만 제거하려면 어떤 배열 메서드가 적합할까요?
`productId`가 일치하지 않는 아이템만 남긴 새 배열을 반환하면 됩니다.

---

### 과제 5 — updateQuantity (수량 변경)

**사용 기능:** `Array.map`, 스프레드 연산자 `...`

`quantity < 1`이면 아무것도 하지 않아야 합니다 (0개 방지).
해당 아이템만 수량을 바꾸고 나머지는 그대로 두려면 `map()`이 적합합니다.
객체를 복사할 때는 스프레드 연산자(`{ ...item, quantity: 새값 }`)를 활용하세요.

---

### 과제 6 — clearCart (전체 비우기)

**사용 기능:** `setCart`

`setCart`에 어떤 값을 넣으면 장바구니가 비워질까요?

---

### 과제 7 — 빈 장바구니 처리

**사용 기능:** 조건부 렌더링 (`if` 또는 `&&`)

`cart` 배열의 길이를 확인해서 비어있으면 안내 메시지를 먼저 보여주세요.
조건부 렌더링으로 처리하거나, 컴포넌트 상단에서 얼리 리턴하는 방법도 있습니다.
**주의: 자동 채점을 위해 `"장바구니가 비어있습니다"` 텍스트가 화면에 정확히 포함되어야 합니다.**

---

### 과제 8 — 수량 +/- 버튼 연결

**사용 기능:** `onClick`, `onUpdateQty`

각 버튼의 `onClick`에서 `onUpdateQty`를 호출하면 됩니다.
어떤 상품인지(`productId`)와 변경할 수량을 함께 전달해야 합니다.
현재 수량(`item.quantity`)에서 1을 더하거나 빼면 됩니다.

---

### 과제 9 — 삭제 버튼 연결

**사용 기능:** `onClick`, `onRemove`

`onClick`에서 `onRemove`를 호출하고, 어떤 상품을 삭제할지 알려줘야 합니다.

---

### 과제 10 (심화) — 결제하기 버튼

**사용 기능:** `onClick`, `onClear`, `alert` (또는 `useState`로 메시지 표시)

클릭 시 두 가지 일이 일어나야 합니다: 장바구니를 비우고, 완료 메시지를 보여주세요.
메시지는 `alert`를 써도 되고, `useState`로 화면에 표시해도 됩니다.

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

## 과제 제출 방법 (PR)

### 1단계 — 레포지토리 Fork

GitHub에서 아래 레포지토리를 본인 계정으로 Fork합니다.

> https://github.com/2026-RealCoding/cnu26-frontend

Fork 버튼은 레포지토리 우측 상단에 있습니다.

---

### 2단계 — Fork한 레포 Clone

```bash
git clone https://github.com/<본인-GitHub-아이디>/cnu26-frontend.git
cd cnu26-frontend
```

---

### 3단계 — 브랜치 생성

`homework` 브랜치를 기준으로 본인 브랜치를 만듭니다.
브랜치 이름은 반드시 **`학번-영문이름`** 형식으로 합니다.

```bash
git checkout homework
git checkout -b 202012345-honggildong
```

예시: `202012345-honggildong`, `202154321-kimjiyeon`

---

### 4단계 — 과제 구현 후 커밋 & 푸시

```bash
cd week1-react
npm install
npm run dev   # 브라우저에서 동작 확인
```

구현이 완료되면 변경사항을 커밋하고 본인 Fork에 푸시합니다.

```bash
git add .
git commit -m "feat: 장바구니 기능 구현"
git push origin 202312345-honggildong
```

---

### 5단계 — PR 생성

GitHub에서 본인 Fork의 브랜치 → **원본 레포의 `homework` 브랜치**로 Pull Request를 생성합니다.

**PR 제목 형식:** `[학번] 이름 - 실전코딩 과제 제출`
예시: `[202012345] 홍길동 - 실전코딩 과제 제출`

PR을 생성하면 이후에 PR에 채점된 답변을 받을 수 있습니다
채점용 테스트 기능을 만들어 둔 상태라 채점에 이의가 있다면 꼭 **김도헌 교수님 혹은 저의 슬랙 DM**으로 연락 부탁드립니다

---

## 브랜치 가져오는 방법

**처음 받는 경우 (clone 후)**
```bash
git clone <레포지토리 주소>
cd cnu26-frontend
git checkout homework
```

**이미 clone한 경우**
```bash
git fetch origin
git checkout homework
```

확인:
```bash
git branch   # * homework 가 보이면 성공
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

---

## 자동 채점 주의사항

구현 방식은 자유롭게 해도 되지만, 아래 두 가지는 반드시 지켜야 자동 채점이 통과됩니다.

| 항목 | 조건 |
|------|------|
| localStorage 키 이름 | 반드시 `'cart'` 로 저장할 것 (`localStorage.setItem('cart', ...)`) |
| 빈 장바구니 메시지 | 화면에 `"장바구니가 비어있습니다"` 텍스트가 포함되어야 함 |
