# Step 03: 상품 검색 API — encodeURIComponent

> **브랜치:** `week1/step-03`
> **수정 파일:** `src/api/shop.js`

---

## 학습 목표

- GET 요청에서 query parameter를 올바르게 조합하는 방법을 익힌다.
- `encodeURIComponent()`로 한글/특수문자를 URL-safe 형태로 변환하는 이유를 이해한다.
- 템플릿 리터럴로 동적 URL을 만드는 패턴을 체득한다.

---

## 핵심 개념 설명

### Query Parameter란?

URL 뒤에 `?key=value` 형태로 데이터를 전달하는 방법이다. GET 요청에서 검색 조건, 필터, 페이지 번호 등을 서버에 넘길 때 사용한다.

```
https://example.com/shop/search?query=맥북&display=12
                               ↑
                               ? 뒤부터 query parameter
                               key=value 쌍을 & 로 연결
```

- `?` — query parameter 시작을 알리는 구분자
- `query=맥북` — key: `query`, value: `맥북`
- `&` — 여러 파라미터를 이어줄 때 사용
- `display=12` — key: `display`, value: `12`

```js
// 코드로 만드는 방법
const query = '맥북';
const display = 12;
const url = `/shop/search?query=${query}&display=${display}`;
// 결과: '/shop/search?query=맥북&display=12'
```

---

### 템플릿 리터럴 (Template Literal)

백틱(`` ` ``)으로 감싸고 `${}` 안에 변수를 넣어 문자열을 만드는 문법이다.

```js
const name = '홍길동';
const count = 3;

// ❌ 일반 문자열 — 연결이 복잡하고 가독성이 떨어짐
const msg = '안녕하세요, ' + name + '님! 상품이 ' + count + '개 있습니다.';

// ✅ 템플릿 리터럴 — 변수를 바로 끼워 넣을 수 있어 직관적
const msg = `안녕하세요, ${name}님! 상품이 ${count}개 있습니다.`;
```

URL을 만들 때 특히 유용하다.

```js
// ❌ 문자열 연결
const url = '/shop/search?query=' + encodeURIComponent(query) + '&display=' + display;

// ✅ 템플릿 리터럴
const url = `/shop/search?query=${encodeURIComponent(query)}&display=${display}`;
```

---

### URL 인코딩이 필요한 이유

URL에는 ASCII 문자만 안전하게 사용할 수 있다. 한글을 그대로 넣으면 브라우저나 서버에 따라 깨질 수 있다.

```js
// ❌ 인코딩 없음 — 서버에서 인식 실패 가능
/shop/search?query=맥북

// ✅ 인코딩 적용 — 항상 안전
/shop/search?query=%EB%A7%A5%EB%B6%81
```

`encodeURIComponent('맥북')` → `'%EB%A7%A5%EB%B6%81'`

### display 파라미터

```js
searchProducts('맥북', 12)
// → GET /shop/search?query=%EB%A7%A5%EB%B6%81&display=12
```

`display`는 결과 개수를 지정한다. 기본값 12는 한 화면에 딱 맞는 카드 수다.

---

## 프로젝트 구조

```
src/
├── api/
│   ├── client.js       ✅ Step 01 완성
│   ├── auth.js         ✅ Step 02 완성
│   └── shop.js         📝 이번 Step — 상품 검색 API
├── hooks/
│   └── useAuth.js
└── components/
    ├── LoginForm.jsx
    └── ProductList.jsx
```

---

## 주요 코드

```js
// src/api/shop.js

export async function searchProducts(query, display = 12) {
  return get(`/shop/search?query=${encodeURIComponent(query)}&display=${display}`);
  // 예시: searchProducts('맥북')
  // → GET /api/shop/search?query=%EB%A7%A5%EB%B6%81&display=12
  // → Vite proxy → http://localhost:8080/shop/search?...
  // → 네이버 쇼핑 API 결과 반환
}
```

**핵심 포인트:**
- 템플릿 리터럴(`` ` `` )로 경로와 파라미터를 깔끔하게 조합한다.
- `get()` 함수는 Step 01의 `client.js`에서 토큰 헤더를 자동으로 추가한다.

---

## Next.js에서는 어떻게?

Week 1의 `searchProducts`는 브라우저에서 실행되어 Vite 프록시를 통해 백엔드로 간다.
Week 2에서는 **서버(Server Component)에서 직접** 백엔드를 호출한다.

```
Week 1: 브라우저 → Vite 프록시(/api) → 백엔드
Week 2: 서버(Next.js) → 백엔드 직접 (CORS 없음)
```

#### Week 1 vs Week 2 코드 비교

```js
// Week 1 — src/api/shop.js (브라우저에서 실행)
export async function searchProducts(query, display = 12) {
  return get(`/shop/search?query=${encodeURIComponent(query)}&display=${display}`);
}
```

```ts
// Week 2 — lib/api.ts (서버에서 실행)
export async function searchProducts(query: string, display = 12): Promise<ShoppingItem[]> {
  const res = await fetch(
    `${BACKEND_URL}/shop/search?query=${encodeURIComponent(query)}&display=${display}`,
    { next: { revalidate: 60 } }  // 60초마다 캐시 갱신 (ISR)
  );
  if (!res.ok) throw new Error('상품 검색 실패');
  return res.json();
}
```

**달라진 점:**
- `encodeURIComponent()` 사용법은 동일하다 — 서버에서도 URL 인코딩이 필요하다.
- `next: { revalidate: 60 }` — Next.js 전용 옵션. 60초마다 서버에서 데이터를 다시 가져온다(ISR).
- 서버에서 실행되므로 CORS 오류가 없고, `BACKEND_URL`(환경변수)을 안전하게 사용할 수 있다.

#### Server Component에서 데이터 패칭

```tsx
// app/shop/page.tsx — Server Component (async 함수)
export default async function ShopPage({ searchParams }) {
  const query = searchParams.query ?? '맥북';
  const products = await searchProducts(query);  // useEffect 없이 바로 호출
  
  return (
    <div>
      {products.map(product => <ProductCard key={product.productId} product={product} />)}
    </div>
  );
}
```

> "Week 1에서는 `useEffect`로 마운트 후 데이터를 가져왔지만, Week 2 Server Component에서는 `async/await`으로 렌더링 전에 데이터를 미리 받아옵니다. 로딩 상태를 관리할 필요가 없습니다."

---

## 프로젝트 실행법

```bash
cd week1-react
npm install      # 최초 1회
npm run dev      # 개발 서버 시작
```

브라우저에서 `http://localhost:3000` 접속.

> 백엔드 서버(`localhost:8080`)가 실행 중이어야 상품 검색이 동작한다.

---

## 확인할 것들

1. **구현 전:** 로그인 후 상품 목록 화면에서 상품이 뜨지 않거나 에러 발생 확인
2. **구현 후:** 검색창에 한글 입력 → 검색 버튼 클릭 → 상품 목록 표시 확인
3. **Network 탭:** `/api/shop/search?query=%EB%A7%A5...` 형태로 요청 가는지 확인
4. **콘솔:** `encodeURIComponent('맥북')` 직접 실행해 결과 확인

---

## 핵심 정리

> **`encodeURIComponent()`는 한글처럼 URL에 안전하지 않은 문자를 `%XX` 형태로 변환한다. 이 처리 없이 한글을 URL에 넣으면 서버에 따라 다르게 처리되어 예측 불가능한 버그가 생긴다. Week 2(Next.js)에서는 동일한 함수가 서버(Server Component)에서 실행되어 CORS 걱정 없이 백엔드를 직접 호출하고, `revalidate` 옵션으로 캐시까지 제어할 수 있다.**
