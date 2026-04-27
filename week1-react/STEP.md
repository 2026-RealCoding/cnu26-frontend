# Step 06: 상품 목록 — useState + useEffect

> **브랜치:** `week1/step-06`
> **수정 파일:** `src/components/ProductList.jsx`

---

## 학습 목표

- 컴포넌트 마운트 시 API를 호출하는 `useEffect` 패턴을 구현한다.
- 로딩(`loading`) / 에러(`error`) / 데이터(`products`) 3가지 상태를 함께 관리하는 방법을 익힌다.
- 의존성 배열(`[query]`)로 재검색을 트리거하는 원리를 이해한다.

---

## 핵심 개념 설명

### useEffect란?

**한 줄 요약: "화면이 그려진 직후에 실행할 코드를 담는 상자"**

---

#### 비유로 이해하기

식당을 생각해보세요.

```
손님이 앉는다 (렌더링)
  → 메뉴판을 가져다 준다 (화면 표시)
  → 주문을 받는다 (useEffect — 화면 표시 후에 할 일)
```

컴포넌트도 똑같아요.

```
화면을 그린다 (렌더링)
  → 브라우저에 표시한다
  → useEffect 실행 — 데이터 가져오기, 타이머 시작 등
```

> "화면을 먼저 그리고, 그 다음에 할 일을 처리한다. 이것이 useEffect의 핵심입니다."

---

#### 왜 필요한가?

이런 상황을 상상해보세요. 상품 목록 페이지에 들어왔을 때 서버에서 데이터를 가져와야 해요.

```jsx
function ProductList() {
  // 1. 일단 빈 화면을 먼저 그린다
  // 2. 화면이 나타난 직후 → 서버에 데이터 요청
  // 3. 데이터 도착 → 화면 업데이트
}
```

이 흐름을 구현할 때 쓰는 게 `useEffect`예요.

---

#### 왜 렌더링 안에서 바로 호출하면 안 되나?

```jsx
// ❌ 이렇게 하면 안 된다
function ProductList() {
  const [products, setProducts] = useState([]);

  // 렌더링마다 API 호출 → setProducts → 리렌더링 → API 호출 → 무한 루프
  searchProducts('맥북').then(setProducts);

  return <div>...</div>;
}
```

> "렌더링 중에 상태를 바꾸면 또 렌더링이 일어나고, 그 렌더링이 또 상태를 바꾸는 무한 루프에 빠집니다. useEffect는 이 문제를 막기 위해 렌더링이 끝난 후에 실행됩니다."

#### 기본 구조

```js
useEffect(() => {
  //  setup (부수 효과 실행)
}, [의존성]);
// ↑
// dependencies
// 두 번째 인자를 빠뜨리지 말 것 — 없으면 매 렌더링마다 실행됨
```

#### 의존성 배열 — "언제 다시 실행할까?"

두 번째 인자(`[]`)가 **"언제 다시 실행할지"** 를 결정한다.

```js
useEffect(() => { ... });          // ❌ 생략 — 렌더링마다 실행 (거의 항상 버그)
useEffect(() => { ... }, []);      // ✅ 처음 한 번만
useEffect(() => { ... }, [query]); // ✅ 처음 + query가 바뀔 때마다
```

식당 비유로 다시 보면:

```
[]        → "손님이 처음 앉을 때 한 번만 메뉴판을 가져다 준다"
[query]   → "손님이 앉거나, 원하는 메뉴가 바뀔 때마다 다시 가져다 준다"
생략       → "뭔가 바뀔 때마다 무조건 가져다 준다" → 난리남
```

| 의존성 배열 | 실행 시점 | 주의 |
|---|---|---|
| 생략 | 매 렌더링마다 | 거의 항상 버그. 사용 금지 |
| `[]` | 마운트 시 한 번만 | 초기 데이터 로딩에 적합 |
| `[query]` | 마운트 + `query`가 바뀔 때마다 | 검색어 변경 시 재호출에 적합 |

#### 실행 순서

```
1. 컴포넌트 함수 실행 (렌더링)
2. 화면에 결과물 반영 (DOM 업데이트)
3. useEffect 내부 코드 실행  ← 여기서 API 호출
4. 상태 변경 → 리렌더링 (1번으로 돌아감)
```

#### 1번으로 돌아간 다음엔?

4번에서 상태가 바뀌어 리렌더링(1번)이 일어나면, 이번엔 **바뀐 상태값**으로 컴포넌트 함수가 다시 실행된다.

```
[최초 렌더링]
1. products=[], loading=true 로 실행
2. "상품을 불러오는 중..." 화면에 표시
3. useEffect → searchProducts('맥북') API 호출

[API 응답 후]
4. setProducts(data), setLoading(false) 호출

[리렌더링 — 1번으로 돌아감]
1. products=[...상품목록], loading=false 로 다시 실행
2. 상품 카드 목록 화면에 표시
3. useEffect: 의존성(query)이 바뀌지 않았으므로 → 실행 안 함 ✅ 안정
```

> "리렌더링 후 useEffect가 무조건 다시 실행되는 게 아닙니다. **의존성 배열의 값이 바뀌었을 때만** 다시 실행됩니다. 바뀐 게 없으면 넘어갑니다. 이것이 무한 루프를 막는 핵심입니다."

#### 클린업(cleanup) 함수

useEffect는 함수를 반환할 수 있고, 이 함수는 컴포넌트가 사라지거나 effect가 재실행되기 직전에 호출된다.

```js
useEffect(() => {
  const timer = setInterval(() => console.log('tick'), 1000);

  return () => {
    clearInterval(timer); // 컴포넌트 언마운트 시 타이머 정리
  };
}, []);
```

> "이번 Step에서는 클린업이 없지만, 타이머나 이벤트 리스너를 쓸 때는 반드시 정리해야 메모리 누수를 막을 수 있습니다."

### 3가지 상태 관리

```js
const [products, setProducts] = useState([]); // ← 초기값: [] (null이면 .map() 에러)
const [loading, setLoading] = useState(true);  // ← 초기값: true (첫 로딩부터 시작)
const [error, setError] = useState(null);      // ← 초기값: null
```

이 세 상태는 항상 함께 다닌다: API 호출 시 `loading: true` → 완료 시 `loading: false` + 결과/에러 저장.

---

## 프로젝트 구조

```
src/
├── api/
│   ├── client.js       ✅ Step 01 완성
│   ├── auth.js         ✅ Step 02 완성
│   └── shop.js         ✅ Step 03 완성
├── hooks/
│   └── useAuth.js      ✅ Step 04 완성
└── components/
    ├── LoginForm.jsx   ✅ Step 05 완성
    └── ProductList.jsx 📝 이번 Step — 상품 목록 (useState + useEffect)
```

---

## 주요 코드

```jsx
// src/components/ProductList.jsx

export default function ProductList() {
  const [products, setProducts] = useState([]); // ← [실습 6-a]
  const [loading, setLoading] = useState(true);  // ← [실습 6-a]
  const [error, setError] = useState(null);      // ← [실습 6-a]
  const [query, setQuery] = useState('맥북');

  useEffect(() => {                              // ← [실습 6-b]
    setLoading(true);
    setError(null);

    searchProducts(query)
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [query]); // query가 바뀔 때마다 재실행

  return (
    <div>
      {loading && <p>상품을 불러오는 중...</p>}
      {error && <p>오류: {error}</p>}
      {!loading && !error && (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.productId} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
```

**핵심 포인트:**
- `loading`, `error`, `products` 세 상태로 UI의 세 가지 경우를 처리한다.
- `key={product.productId}`: 리스트 렌더링 시 React가 각 항목을 구분하는 필수 속성. 없으면 경고가 뜨고 렌더링 성능이 나빠진다.

---

## Next.js에서는 어떻게?

Week 1에서는 `useEffect`로 마운트 후 데이터를 가져오고 `loading/error/products` 3가지 상태를 직접 관리했다.
Week 2 Server Component에서는 **`async/await`으로 렌더링 전에 데이터를 미리 받아와** 이 복잡함이 사라진다.

#### Week 1 — Client Component (useState + useEffect)

```jsx
// 브라우저에서 실행 — 렌더링 후 데이터 패칭
export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    searchProducts(query)
      .then(data => { setProducts(data); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, [query]);

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>오류: {error}</p>;
  return products.map(p => <ProductCard key={p.productId} product={p} />);
}
```

#### Week 2 — Server Component (async/await)

```tsx
// 서버에서 실행 — 렌더링 전에 데이터를 이미 받아옴
export default async function ShopPage({ searchParams }) {
  const query = searchParams.query ?? '맥북';
  const products = await searchProducts(query);  // useEffect 없음, loading 없음

  return products.map(p => <ProductCard key={p.productId} product={p} />);
}
```

**무엇이 달라지나:**

| | Week 1 (Client) | Week 2 (Server) |
|---|---|---|
| 실행 위치 | 브라우저 | 서버 |
| 데이터 패칭 시점 | 렌더링 후 (useEffect) | 렌더링 전 (async/await) |
| 로딩 상태 관리 | 직접 (`loading` state) | 불필요 (데이터 준비 후 렌더링) |
| 에러 처리 | `try/catch` + `error` state | `error.tsx` 파일로 처리 |
| 사용자 경험 | 화면 먼저 → 데이터 채워짐 | 데이터 준비 후 화면 표시 |

> "서버 컴포넌트에서는 데이터가 없는 상태의 화면을 그릴 필요가 없습니다. 서버에서 데이터를 다 받아온 다음에 완성된 HTML을 브라우저로 보내기 때문입니다."

---

## 프로젝트 실행법

```bash
cd week1-react
npm install      # 최초 1회
npm run dev      # 개발 서버 시작
```

브라우저에서 `http://localhost:3000` 접속.

---

## 확인할 것들

1. **구현 전:** 로그인 후 상품 목록이 비어있거나 오류 발생 확인
2. **구현 후:** 로그인 시 '맥북' 상품 목록 자동 표시 확인
3. **검색 테스트:** 다른 검색어 입력 후 `query` 상태 바뀌면 `useEffect` 재실행되는지 확인
4. **의존성 배열 실험:** `[query]`를 `[]`로 바꾸면 검색이 어떻게 되는지 실험

---

## 핵심 정리

> **`useEffect`의 의존성 배열은 "이 값이 바뀔 때마다 다시 실행"을 선언적으로 표현한다. `loading/error/data` 3상태 패턴은 브라우저에서 비동기 데이터를 다루는 기본 구조다. Week 2(Next.js) Server Component에서는 `async/await`으로 서버에서 데이터를 먼저 받아온 뒤 렌더링하므로, 이 3가지 상태 관리가 필요 없어진다.**
