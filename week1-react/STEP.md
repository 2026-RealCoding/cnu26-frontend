# Step 04: 커스텀 훅 — useAuth

> **브랜치:** `week1/step-04`
> **수정 파일:** `src/hooks/useAuth.js`

---

## 학습 목표

- React 커스텀 훅의 개념과 만드는 방법을 이해한다.
- 인증 상태(로그인/로그아웃)를 훅으로 캡슐화하는 패턴을 익힌다.
- `localStorage`와 React 상태(`useState`)를 함께 사용하는 방법을 구현한다.

---

## 핵심 개념 설명

### 커스텀 훅이란?

`useState`, `useEffect` 등 React 훅을 조합해 **재사용 가능한 로직**을 만드는 함수다.
반드시 이름이 `use`로 시작해야 한다.

#### 왜 커스텀 훅으로 분리하나?

```js
// ❌ 컴포넌트 안에 인증 로직 직접 구현
function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) getMe().then(setUser).catch(...);
  }, []);

  const login = async (name, email) => {
    let foundUser = await findUserByName(name);
    if (!foundUser) foundUser = await signUp(name, email);
    const { token } = await loginWithUserId(foundUser.id);
    localStorage.setItem('token', token);
    setUser(foundUser);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // 이 모든 코드가 App 컴포넌트 안에 있으면...
  // → App이 너무 커진다
  // → 다른 컴포넌트에서 로그인 상태가 필요할 때 재사용이 불가능하다
  return <div>...</div>;
}
```

```js
// ✅ 커스텀 훅으로 분리
function App() {
  const { user, isLoggedIn, login, logout } = useAuth();
  // 인증 로직이 어떻게 동작하는지 App은 몰라도 된다
  // 필요한 값과 함수만 꺼내서 쓰면 된다
  return <div>...</div>;
}
```

#### 커스텀 훅의 규칙

- 이름은 반드시 `use`로 시작해야 한다 (`useAuth`, `useForm`, `useFetch` 등)
- React 훅(`useState`, `useEffect` 등)을 내부에서 자유롭게 사용할 수 있다
- 일반 함수와 다르게, React가 이 함수를 훅으로 인식해 상태 관리를 연결해준다

> "`use`로 시작하지 않으면 React가 훅으로 인식하지 못해 내부에서 `useState` 등을 사용할 때 에러가 납니다."

#### 커스텀 훅 vs 일반 함수

| | 커스텀 훅 | 일반 함수 |
|---|---|---|
| 이름 | `use`로 시작 | 제한 없음 |
| React 훅 사용 | ✅ 가능 | ❌ 불가 |
| 상태(state) 보유 | ✅ 가능 | ❌ 불가 |
| 사용 위치 | 컴포넌트 / 다른 훅 내부 | 어디서든 |
| 예시 | `useAuth`, `useEffect` | `loginWithUserId`, `signUp` |

---

### loginWithUserId로 토큰을 받는 이유

이 앱의 백엔드는 **비밀번호 인증이 없다.** `userId`를 알고 있다는 것 자체가 인증이다.

```
1. findUserByName('홍길동')
   → GET /users/search?name=홍길동
   → 응답: { id: 3, name: '홍길동' }

2. loginWithUserId(3)
   → POST /users/login { userId: 3 }
   → 응답: { token: 'eyJ...' }   ← 서버가 JWT 토큰 발급

3. const { token } = await loginWithUserId(foundUser.id)
   → 응답 객체에서 token만 구조 분해로 꺼냄
   → localStorage.setItem('token', token) 으로 저장
```

> "실제 서비스라면 비밀번호나 OAuth 인증이 추가되겠지만, 이 강의에서는 인증 흐름 자체를 익히는 데 집중하기 위해 단순화한 구조입니다."

---

### localStorage + useState 동기화

```
앱 시작 → localStorage에 token 있음?
  → 있음: getMe(token) 호출 → user 상태 복원
  → 없음: user = null → 로그인 화면 표시

로그인 성공 → localStorage.setItem('token', token) + setUser(foundUser)
로그아웃    → localStorage.removeItem('token') + setUser(null)
```

---

## 프로젝트 구조

```
src/
├── api/
│   ├── client.js       ✅ Step 01 완성
│   ├── auth.js         ✅ Step 02 완성
│   └── shop.js         ✅ Step 03 완성
├── hooks/
│   └── useAuth.js      📝 이번 Step — 인증 상태 커스텀 훅
└── components/
    ├── LoginForm.jsx
    └── ProductList.jsx
```

---

## 주요 코드

```js
// src/hooks/useAuth.js

export function useAuth() {
  const [user, setUser] = useState(null);

  // 앱 시작 시 토큰이 있으면 유저 정보 복원
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getMe().then(setUser).catch(() => localStorage.removeItem('token'));
    }
  }, []);

  const login = async (name, email) => {
    let foundUser = await findUserByName(name);
    if (!foundUser) {
      if (!email) throw new Error('처음 방문이시군요! 이메일을 입력해주세요');
      foundUser = await signUp(name, email);
    }
    const { token } = await loginWithUserId(foundUser.id); // ← [실습 4-b]
    localStorage.setItem('token', token);                   // ← [실습 4-b]
    setUser(foundUser);                                     // ← [실습 4-b]
  };

  const logout = () => {
    localStorage.removeItem('token');  // ← [실습 4-c]
    setUser(null);                     // ← [실습 4-c]
  };

  return { user, isLoggedIn: !!user, login, logout };
}
```

**핵심 포인트:**
- `isLoggedIn: !!user` — `user`가 `null`이면 `false`, 객체이면 `true`로 변환.
- 반환값만 보면 컴포넌트는 내부 구현을 몰라도 된다.

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

1. **구현 전:** 로그인 후 새로고침 시 다시 로그인 화면으로 돌아가는지 확인
2. **구현 후:** 새로고침해도 로그인 상태 유지 확인 (localStorage에서 복원)
3. **Application 탭:** 로그아웃 후 Local Storage에서 `token` 삭제 확인
4. **React DevTools:** `useAuth` 훅의 `user` 상태 변화 실시간 확인

---

## 핵심 정리

> **커스텀 훅(`useAuth`)은 인증과 관련된 모든 로직을 한 곳에 모아 컴포넌트를 단순하게 만든다. localStorage와 React 상태를 함께 관리하는 이 패턴은 Week 2(Next.js)에서 localStorage 대신 쿠키 + 서버 쿠키 읽기로 대체된다.**
