# Step 01 강연 스크립트 — `client.js` 라이브코딩

## 오프닝 (1~2분)

> "오늘 첫 번째 실습은 `src/api/client.js` 파일입니다. 딱 두 줄만 채우면 되는데, 이 두 줄이 앱 전체 인증의 핵심입니다."

---

## 1부: 왜 공통 클라이언트가 필요한가? (3~5분)

**먼저 파일 구조를 보여주며 설명:**

```
src/api/
  client.js   ← 지금 작업할 파일
  auth.js     ← 로그인/회원가입 API
  shop.js     ← 상품 검색 API
```

> "auth.js 열어보면 `import { get, post } from './client'` 이렇게 되어 있죠. shop.js도 마찬가지입니다."
>
> "모든 API 요청이 `client.js`를 거쳐서 나갑니다. 왜 이렇게 할까요?"
>
> "만약 토큰을 auth.js에도 붙이고, shop.js에도 붙이면... 나중에 토큰 로직이 바뀔 때 모든 파일을 다 고쳐야 합니다. `client.js` 한 곳에만 두면 여기만 수정하면 됩니다. 이게 **관심사 분리(Separation of Concerns)**입니다."

---

## 2부: localStorage 설명 (3분)

**브라우저 개발자 도구 → Application → Local Storage 탭 열어서 보여주기**

> "localStorage는 브라우저가 제공하는 key-value 저장소입니다. 탭을 닫아도, 새로고침을 해도 데이터가 남아 있습니다."

**콘솔에서 직접 타이핑하며 시연:**

```js
localStorage.setItem('token', 'eyJhbGc...')  // 저장
localStorage.getItem('token')                 // 읽기
localStorage.removeItem('token')              // 삭제
```

> "로그인 성공하면 서버에서 토큰을 줍니다. 그걸 여기다 저장해 두고, 이후 API 요청마다 꺼내서 헤더에 담아 보내는 겁니다."

**JWT 인증 흐름:**

```
1. POST /users/login → 서버: { token: 'eyJ...' }
2. localStorage.setItem('token', token)   ← 저장
3. 이후 모든 요청: Authorization: Bearer eyJ...   ← 자동 포함
4. 서버: 헤더 확인 → OK면 데이터, 실패면 401
```

---

## 3부: 라이브코딩 — TODO 1 (5분)

**`client.js` 열고 TODO 주석 찾기:**

```js
const token = null; // TODO: localStorage에서 토큰 가져오기
```

> "null이라고 하드코딩 되어 있죠. 여기에 localStorage에서 실제로 읽어오는 코드를 넣으면 됩니다."

**학생들에게 먼저 물어보기:**
> "어떻게 쓸 것 같으세요?"

**직접 타이핑:**

```js
const token = localStorage.getItem('token');
```

> "끝입니다. 토큰이 없으면 `null`을 반환하고, 있으면 문자열로 반환합니다."

---

## 4부: 라이브코딩 — TODO 2 (7분)

**현재 headers 코드 보여주기:**

```js
const headers = {
  'Content-Type': 'application/json',
  // ← 여기에 Authorization 헤더를 조건부로 추가해야 함
  ...options.headers,
};
```

> "토큰이 있을 때만 Authorization 헤더를 붙여야 합니다. 토큰이 없는데 헤더를 보내면 어떻게 될까요? 서버마다 다르지만, 잘못된 토큰 형식으로 판단해서 오히려 에러가 날 수 있습니다."

**스프레드 + 단축 평가 패턴 설명:**

> "`&&` 연산자 아시죠? 왼쪽이 falsy면 오른쪽을 평가하지 않습니다."

**콘솔에서 직접 확인:**

```js
null && { Authorization: 'Bearer xxx' }      // → null
'eyJ...' && { Authorization: 'Bearer xxx' }  // → { Authorization: 'Bearer xxx' }
```

> "그리고 `...`(스프레드)으로 객체를 펼칩니다. null을 스프레드하면 아무것도 추가되지 않습니다."

**직접 타이핑:**

```js
const headers = {
  'Content-Type': 'application/json',
  ...(token && { Authorization: `Bearer ${token}` }),
  ...options.headers,
};
```

**표로 정리:**

| token 값 | `token && {...}` | 헤더 포함? |
|---|---|---|
| `null` | `null` → 스프레드 무효 | X |
| `'eyJhbGc...'` | `{ Authorization: 'Bearer ...' }` | O |

---

## 5부: 동작 확인 (3분)

**개발자 도구 Network 탭 열고 앱에서 로그인 시도:**

1. 구현 전 — 로그인 후 상품 목록 API 호출 시 **401 에러** 발생하는지 확인
2. 구현 후 — Application → Local Storage에 `token` 키가 저장되는지 확인
3. Network 탭 → `/api/shop/search` 요청 헤더에 `Authorization: Bearer ...` 포함되는지 확인

---

## 마무리 (2분)

> "오늘 핵심 두 가지입니다."
>
> "첫째, **공통 클라이언트**. 토큰 처리 로직을 한 곳에 두면 auth.js, shop.js는 토큰을 몰라도 됩니다."
>
> "둘째, **조건부 스프레드 패턴**. `...(condition && { key: value })` — JavaScript에서 자주 쓰는 패턴이니 익혀두세요."
>
> "Week 2 Next.js에서는 이 토큰을 localStorage 대신 **쿠키**에 저장합니다. 서버에서도 읽어야 하기 때문입니다. 오늘 배운 개념이 거기서 어떻게 달라지는지 비교해보면 재미있을 겁니다."
