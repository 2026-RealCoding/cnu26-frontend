# Step 02: 인증 API — 회원가입 & 로그인

> **브랜치:** `week1/step-02`
> **수정 파일:** `src/api/auth.js`

---

## 학습 목표

- REST API POST 요청을 함수로 추상화하는 방법을 이해한다.
- 회원가입 → 로그인 → 토큰 발급의 인증 플로우를 구현한다.
- `client.js`의 공통 `post()` 함수를 활용하는 패턴을 익힌다.

---

## 핵심 개념 설명

### HTTP 메서드 — GET vs POST

브라우저와 서버가 데이터를 주고받을 때 사용하는 규칙이다.

| 메서드 | 용도 | 데이터 위치 | 예시 |
|---|---|---|---|
| `GET` | 데이터 조회 | URL 뒤 (`?name=홍길동`) | 내 정보 조회, 상품 검색 |
| `POST` | 데이터 생성/전송 | 요청 본문(body, 외부에 노출 X) | 회원가입, 로그인 |

```js
// GET — URL에 데이터가 드러남 (민감 정보 X)
fetch('/users/search?name=홍길동')

// POST — body 안에 데이터를 넣어 전송
fetch('/users/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ userId: 3 }),
})
```

> "로그인 정보를 GET으로 보내면 URL에 사용자 정보가 노출됩니다. 생성/전송은 항상 POST를 씁니다."

---

### async / await

서버에 데이터를 요청하면 응답이 올 때까지 기다려야 한다. JavaScript는 기본적으로 기다리지 않고 다음 줄을 실행하는데, `async/await`으로 "여기서 기다려"라고 명시할 수 있다.

```js
// ❌ await 없이 — 응답 오기 전에 다음 줄이 실행됨
function login() {
  const user = fetchUser();   // 아직 데이터가 없는 Promise 객체가 담김
  console.log(user.name);     // undefined — 데이터가 도착하지 않았음
}

// ✅ async/await — 응답을 기다렸다가 다음 줄 실행
async function login() {
  const user = await fetchUser();  // 응답이 올 때까지 대기
  console.log(user.name);          // 정상 출력
}
```

- 함수 앞에 `async`를 붙여야 그 안에서 `await`을 쓸 수 있다.
- `await`는 Promise(비동기 작업)가 완료될 때까지 기다렸다가 결과값을 꺼내준다.
- `async` 함수는 항상 Promise를 반환한다. 호출하는 쪽에서도 `await`을 붙여야 결과값을 받는다.

> "이 강의에서 나오는 API 함수들이 모두 `async`인 이유가 바로 이것입니다. 서버 응답을 기다려야 하기 때문입니다."

---

### API 함수 추상화란?

`fetch`를 매번 직접 호출하는 대신, 기능별로 함수를 만들어 관리한다.

#### 추상화 없이 쓰면 어떤 일이 생기나?

```js
// useAuth.js에서 직접 fetch 호출
const res = await fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name, email }),
});
const user = await res.json();

// LoginForm.jsx에서도 또 직접 호출
const res = await fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name, email }),
});
```

> "같은 코드가 여러 곳에 흩어져 있으면, API 경로가 `/api/users`에서 `/api/members`로 바뀌는 순간 모든 파일을 찾아다니며 고쳐야 합니다."

#### 추상화 후

```js
// auth.js — 네트워크 세부사항을 여기에만 모아둠
export async function signUp(name, email) {
  return post('/users', { name, email });
}

// useAuth.js — 어떻게 보내는지 몰라도 됨
const user = await signUp(name, email);

// LoginForm.jsx — 마찬가지
const user = await signUp(name, email);
```

API 경로가 바뀌어도 `auth.js` 한 파일만 수정하면 나머지는 자동으로 반영된다.

#### 추상화의 3가지 이점

**1. 재사용** — 같은 API를 여러 곳에서 호출해도 함수 하나만 유지하면 된다.

**2. 가독성** — `fetch('/api/users/login', { method: 'POST', ... })` 보다 `loginWithUserId(id)` 가 의도가 명확하다.

**3. 변경 격리** — 백엔드 스펙이 바뀌어도 수정 범위가 `auth.js` 한 파일로 제한된다.

```
변경 전: POST /users/login  { userId }
변경 후: POST /auth/signin  { id }

→ auth.js 한 줄만 수정, useAuth.js / LoginForm.jsx는 손댈 필요 없음
```

#### 이번 Step의 파일 역할 분담

```
client.js   — "어떻게 보낼까" (HTTP 메서드, 헤더, 에러 처리)
auth.js     — "무엇을 보낼까" (엔드포인트, 요청 바디)
useAuth.js  — "언제 보낼까" (로그인 버튼 클릭, 앱 시작 시)
LoginForm   — "무엇을 보여줄까" (입력 폼 UI)
```

> "각 파일이 딱 하나의 질문에만 답하도록 나누는 것이 **단일 책임 원칙**입니다. 어느 파일을 열면 무엇이 있는지 예측 가능한 코드가 좋은 코드입니다."

### 인증 플로우

```
1. signUp(name, email)
   → POST /users { name, email }
   → 응답: { id, name, email }

2. loginWithUserId(user.id)
   → POST /users/login { userId }
   → 응답: { token }

3. localStorage.setItem('token', token) ← Step 01에서 구현
   → 이후 모든 요청에 자동으로 Bearer 토큰 포함
```

---

## 프로젝트 구조

```
src/
├── api/
│   ├── client.js       ✅ Step 01 완성 — 공통 HTTP 클라이언트
│   ├── auth.js         📝 이번 Step — 회원가입 / 로그인
│   └── shop.js
├── hooks/
│   └── useAuth.js
└── components/
    ├── LoginForm.jsx
    └── ProductList.jsx
```

---

## 주요 코드

```js
// src/api/auth.js

// 회원가입: 이름과 이메일로 새 유저 생성
export async function signUp(name, email) {
  return post('/users', { name, email });
  // → POST http://localhost:8080/users
  // → 응답: { id: 1, name: '홍길동', email: 'hong@example.com' }
}

// 로그인: userId로 JWT 토큰 발급
export async function loginWithUserId(userId) {
  return post('/users/login', { userId });
  // → POST http://localhost:8080/users/login
  // → 응답: { token: 'eyJhbGc...' }
}

// 내 정보 조회 (토큰 필요 — client.js가 자동으로 헤더에 포함)
export async function getMe() {
  return get('/users/me');
}
```

**핵심 포인트:**
- `post()`, `get()` 은 Step 01에서 완성한 `client.js`의 공통 함수다.
- `signUp`과 `loginWithUserId`를 분리한 이유: 기존 유저는 회원가입 없이 바로 로그인 가능.
- `loginWithUserId`는 이번 Step에서 함수만 만들어 둔다. 실제로 호출하는 코드는 **Step 04**에서 `useAuth.js`의 `login` 함수 안에 연결된다.

```js
// useAuth.js — Step 04에서 완성될 부분
const login = async (name, email) => {
  let foundUser = await findUserByName(name);
  if (!foundUser) {
    foundUser = await signUp(name, email);   // Step 02에서 만든 함수
  }
  const { token } = await loginWithUserId(foundUser.id); // Step 02에서 만든 함수
  localStorage.setItem('token', token);
  setUser(await getMe());
};
```

---

## Next.js에서는 어떻게?

Week 1에서 `auth.js`에 만든 함수들이 Week 2(Next.js)에서는 `lib/api.ts`로 이어진다.
핵심 차이는 **어디서 실행되는가**다.

```
Week 1: 브라우저에서 실행 → Vite 프록시를 거쳐 백엔드 호출
Week 2: 서버에서 실행    → 백엔드를 직접 호출 (CORS 없음, 환경변수 안전)
```

#### Week 1 vs Week 2 코드 비교

```js
// Week 1 — src/api/auth.js (client.js의 post() 사용)
export async function signUp(name, email) {
  return post('/users', { name, email });
}
```

```ts
// Week 2 — lib/api.ts (fetch 직접 사용, 서버에서 실행)
export async function signUpUser(name: string, email: string): Promise<User> {
  const res = await fetch(`${BACKEND_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email }),
  });
  if (!res.ok) throw new Error('회원가입 실패');
  return res.json();
}
```

**달라진 점:**
- `client.js`의 `post()` 대신 `fetch()`를 직접 사용 — 서버 환경에서는 공통 클라이언트 없이 직접 호출이 더 명확하다.
- `BACKEND_URL`이 환경변수로 관리된다 — 브라우저에 노출되지 않아 API 키가 안전하다.
- 함수 구조(이름, 역할, 파라미터)는 Week 1과 거의 동일하다.

> "Week 1에서 '함수로 추상화'하는 습관을 들이면, Week 2에서 파일을 열었을 때 어디에 무엇이 있는지 바로 예측할 수 있습니다."

---

## 프로젝트 실행법

```bash
cd week1-react
npm install      # 최초 1회
npm run dev      # 개발 서버 시작
```

브라우저에서 `http://localhost:3000` 접속.

> 백엔드 서버(`localhost:8080`)가 실행 중이어야 로그인이 동작한다.

---

## 확인할 것들

1. **구현 전:** 로그인 버튼 클릭 시 콘솔에 에러 발생하는지 확인
2. **구현 후:** 이름 입력 → 로그인 → 상품 목록 화면으로 이동하는지 확인
3. **Network 탭:** `POST /api/users/login` 요청에서 응답 `{ token: '...' }` 확인
4. **Application 탭 → Local Storage:** `token` 키에 JWT 값 저장 확인

---

## 핵심 정리

> **API 함수를 `auth.js`에 추상화하면, 컴포넌트와 훅은 네트워크 세부사항을 몰라도 된다. `signUp`과 `loginWithUserId`를 분리하는 것처럼, 각 함수는 하나의 역할만 담당한다(단일 책임 원칙). Week 2(Next.js)에서는 동일한 함수 구조가 `lib/api.ts`로 이어지며, 브라우저 대신 서버에서 직접 백엔드를 호출한다.**
