# Step 01: API 클라이언트 — localStorage 토큰 인증

> **브랜치:** `week1/step-01`
> **수정 파일:** `src/api/client.js`

---

## 학습 목표

- 모든 HTTP 요청이 거치는 **공통 클라이언트**가 왜 필요한지 이해한다.
- `localStorage`에서 JWT 토큰을 읽어 요청 헤더에 자동으로 추가하는 방법을 구현한다.
- 스프레드 연산자(`...`)와 단축 평가(`&&`)로 **조건부 헤더**를 추가하는 패턴을 익힌다.

---

## 핵심 개념 설명

### localStorage란?

`localStorage` 읽기 전용 속성을 사용하면 Document 출처의 `Storage` 객체에 접근할 수 있습니다. 저장한 데이터는 브라우저 세션 간에 공유됩니다.

브라우저가 제공하는 key-value 저장소로, 탭을 닫아도 데이터가 유지된다.

```js
localStorage.setItem('token', 'eyJhbGc...');  // 저장
localStorage.getItem('token');                 // 읽기 → 'eyJhbGc...'
localStorage.removeItem('token');              // 삭제
```

로그인 성공 시 서버에서 받은 JWT 토큰을 여기에 저장하고, 이후 모든 API 요청에서 꺼내 쓴다.

### 개발자 도구에서 확인하는 방법 (step-02 구현 이후 확인 가능)

로그인 후 아래 경로에서 토큰 저장 여부를 직접 확인할 수 있다.

```
Chrome DevTools (F12)
  → Application 탭
  → 좌측 Storage > Local Storage
  → http://localhost:3000 선택
  → Key: token, Value: eyJ... 확인
```

Network 탭에서 요청 헤더도 확인할 수 있다.

```
Network 탭
  → /api/shop/search 요청 클릭
  → Headers > Request Headers
  → Authorization: Bearer eyJ... 포함 여부 확인
```

콘솔에서 직접 읽거나 삭제해 인증 상태를 테스트할 수도 있다.

```js
// 콘솔에서 실행
localStorage.getItem('token');    // 현재 저장된 토큰 확인
localStorage.removeItem('token'); // 토큰 삭제 → 로그아웃 상태 시뮬레이션
```

### JWT(Bearer Token) 인증 흐름

```
1. 로그인 → POST /users/login → 서버가 { token: 'eyJ...' } 반환
2. localStorage.setItem('token', token)  ← 저장
3. 이후 모든 API 요청: Authorization: Bearer eyJ...  ← 헤더에 자동 포함
4. 서버: 헤더 검증 → 통과하면 데이터 반환, 실패하면 401
```

### 스프레드 연산자(`...`)란?

스프레드 연산자는 배열이나 객체를 펼쳐서 다른 배열/객체 안에 합치는 문법이다.

```js
// 객체 합치기
const a = { x: 1 };
const b = { y: 2 };
const c = { ...a, ...b }; // → { x: 1, y: 2 }

// 기존 객체에 속성 추가
const base = { 'Content-Type': 'application/json' };
const extended = { ...base, Authorization: 'Bearer eyJ...' };
// → { 'Content-Type': 'application/json', Authorization: 'Bearer eyJ...' }
```

같은 키가 있으면 뒤에 오는 값이 덮어쓴다. 이 특성을 이용해 `options.headers`로 기본 헤더를 재정의할 수 있다.

```js
const headers = {
  "Content-Type": "application/json", // 기본값
  ...options.headers,                 // 호출 측에서 덮어쓸 수 있음
};
```

### 조건부 헤더 패턴

`&&` 단축 평가와 스프레드 연산자를 조합하면 조건에 따라 헤더를 선택적으로 추가할 수 있다.

```js
// token이 null이면 빈 객체 {} 가 스프레드됨 → 헤더 없음
// token이 있으면 { Authorization: 'Bearer ...' } 가 스프레드됨 → 헤더 추가
...(token && { Authorization: `Bearer ${token}` })
```

**단계별로 풀어보면:**

```js
// 1. token이 null인 경우
null && { Authorization: 'Bearer ...' }  // → null (단축 평가로 우측 미평가)
...null                                   // → 아무것도 추가 안 됨

// 2. token이 있는 경우
'eyJ...' && { Authorization: 'Bearer eyJ...' }  // → { Authorization: 'Bearer eyJ...' }
...{ Authorization: 'Bearer eyJ...' }            // → 헤더에 Authorization 추가
```

| `token` 값 | `token && {...}` 결과 | 헤더 포함 여부 |
|---|---|---|
| `null` | `null` (falsy → 스프레드 안 됨) | X |
| `'eyJhbGc...'` | `{ Authorization: 'Bearer eyJ...' }` | O |

이 패턴을 if문으로 풀어 쓰면 아래와 같다. 스프레드 패턴이 더 간결하므로 실무에서 자주 쓰인다.

```js
// if문 버전 (동일한 동작)
if (token) {
  headers.Authorization = `Bearer ${token}`;
}
```

---

## 구현

`src/api/client.js`에서 `// TODO` 2곳을 완성하세요.

**TODO 1:** localStorage에서 토큰 읽기

```js
// Before (현재 상태)
const token = null;

// After (구현 후)
const token = localStorage.getItem('token');
```

**TODO 2:** 토큰이 있을 때만 Authorization 헤더 추가

```js
// headers 객체 안에 추가
...(token && { Authorization: `Bearer ${token}` }),
```

---

## 주요 코드

```js
// src/api/client.js

const BASE_URL = "/api"; // Vite proxy: /api/* → localhost:8080/*

async function request(path, options = {}) {
  const token = localStorage.getItem('token'); // ← [실습 1] 완성 후

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }), // ← [실습 1] 완성 후
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "API 오류" }));
    throw new Error(error.message ?? `HTTP ${response.status}`);
  }

  return response.json();
}

export const get  = (path)       => request(path);
export const post = (path, body) => request(path, { method: "POST", body: JSON.stringify(body) });
```

**핵심 포인트:**
- `client.js`는 `auth.js`, `shop.js` 등 모든 API 함수가 공통으로 사용하는 **단일 진입점**이다.
- 토큰 처리 로직이 여기 한 곳에 있으므로, 나머지 파일들은 토큰을 신경 쓸 필요 없다.

---

## 전체 흐름

```
LoginForm → useAuth.login() → auth.js:loginWithUserId()
  → client.js:post('/users/login')          // 아직 token 없음 → 헤더 없이 전송
  → 서버 응답: { token: 'eyJ...' }
  → localStorage.setItem('token', token)    // 저장

ProductList → shop.js:searchProducts()
  → client.js:get('/shop/search?...')
  → localStorage.getItem('token')           // 꺼내서
  → Authorization: Bearer eyJ...            // 헤더에 담아 전송
  → 서버: 토큰 검증 통과 → 상품 목록 반환
```

---

## 확인할 것들

1. `localStorage.getItem('token')` 구현 전: 로그인 후 상품 목록 API 호출 시 **401 에러** 발생하는지 확인
2. 구현 후: 브라우저 개발자 도구 → Application → Local Storage → `token` 키 저장 확인
3. Network 탭 → `/api/shop/search` 요청 헤더에 `Authorization: Bearer ...` 포함되는지 확인

> **참고:** 회원가입 및 로그인 기능은 **step-02에서 `auth.js`와 `useAuth.js`를 구현한 이후**에 정상 동작합니다. step-01에서는 토큰 헤더 처리 로직만 완성하는 것이 목표입니다.

---

## 핵심 정리

> **공통 클라이언트(`client.js`)에 토큰 처리를 한 곳에 두면, 나머지 API 함수들은 토큰을 몰라도 된다. 이것이 관심사 분리(Separation of Concerns)의 핵심이다. Week 2(Next.js)에서는 이 토큰을 localStorage 대신 쿠키에 저장하고, 서버에서도 읽을 수 있게 한다.**
