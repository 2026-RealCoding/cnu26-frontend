# Step 05: 로그인 폼 — 제어 컴포넌트

> **브랜치:** `week1/step-05`
> **수정 파일:** `src/components/LoginForm.jsx`

---

## 학습 목표

- React에서 폼 입력값을 `useState`로 관리하는 **제어 컴포넌트** 패턴을 이해한다.
- `value`와 `onChange`를 연결해야 하는 이유를 직접 체험한다.
- 에러 상태(`error`)를 UI에 조건부로 표시하는 방법을 익힌다.

---

## 핵심 개념 설명

### Props란?

컴포넌트는 함수다. Props는 그 함수에 전달하는 **인자(argument)**다.

```jsx
// 부모 컴포넌트 — props를 전달
function App() {
  return <LoginForm onLogin={handleLogin} />;
}

// 자식 컴포넌트 — props를 받아서 사용
function LoginForm({ onLogin }) {
  // onLogin은 부모가 내려준 함수
}
```

> "일반 함수로 비유하면 이렇습니다."

```js
// 일반 함수
function greet(name) {
  return `안녕, ${name}!`;
}
greet('홍길동');  // name = '홍길동'

// 컴포넌트도 똑같다
function LoginForm({ onLogin }) { ... }
<LoginForm onLogin={handleLogin} />  // onLogin = handleLogin
```

#### Props 문법

```jsx
// 전달할 때 (부모)
<LoginForm onLogin={handleLogin} title="로그인" count={3} />

// 받을 때 (자식) — 구조 분해로 꺼내는 것이 관례
function LoginForm({ onLogin, title, count }) {
  // onLogin → handleLogin 함수
  // title   → '로그인' 문자열
  // count   → 3 숫자
}
```

- 문자열은 `"따옴표"`로, 그 외(함수, 숫자, 변수 등)는 `{중괄호}`로 전달한다.
- 구조 분해(`{ onLogin }`) 없이 받으면 `props.onLogin`처럼 접근한다.

#### Props vs State

| | Props | State |
|---|---|---|
| 누가 만드나 | 부모 컴포넌트 | 컴포넌트 본인 |
| 변경 가능? | ❌ 자식이 직접 수정 불가 | ✅ `setState`로 변경 가능 |
| 용도 | 부모 → 자식으로 데이터 전달 | 컴포넌트 내부 상태 관리 |
| 비유 | 함수의 매개변수 | 함수 내부의 변수 |

> "Props는 외부에서 받는 것, State는 내부에서 만드는 것입니다. 이 둘의 구분이 React 설계의 핵심입니다."

#### 이번 Step에서의 Props

```jsx
// App.jsx — 부모
<LoginForm onLogin={login} />
//          ↑
//   useAuth()에서 가져온 login 함수를 내려줌

// LoginForm.jsx — 자식
export default function LoginForm({ onLogin }) {
  //                                ↑
  //   받은 함수를 폼 제출 시 호출
  const handleSubmit = async (e) => {
    await onLogin(name, email);  // 부모의 login 함수 실행
  };
}
```

> "LoginForm은 로그인 **UI**만 담당하고, 실제 로그인 **로직**은 부모(App)가 가지고 있습니다. Props로 함수를 내려주는 이 패턴을 **콜백 Props**라고 합니다."

---

### useState란?

React 컴포넌트는 화면에 무언가를 표시하는 함수다. 그런데 일반 변수는 값이 바뀌어도 화면이 자동으로 바뀌지 않는다.

```jsx
// ❌ 일반 변수 — 값이 바뀌어도 화면은 그대로
function Counter() {
  let count = 0;
  return (
    <button onClick={() => { count += 1; console.log(count); }}>
      클릭: {count}  {/* 항상 0으로 보임 */}
    </button>
  );
}
```

> "버튼을 눌러도 화면의 숫자가 안 바뀌죠? React는 `count`가 바뀐 걸 모르기 때문입니다."

`useState`를 쓰면 React가 값 변화를 감지하고, 화면을 자동으로 다시 그려준다.

```jsx
// ✅ useState — 값이 바뀌면 화면도 자동으로 업데이트
function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      클릭: {count}  {/* 버튼 누를 때마다 숫자 증가 */}
    </button>
  );
}
```

#### 문법 해부

```js
const [count, setCount] = useState(0);
//     ↑       ↑                  ↑
//  현재 값  값을 바꾸는 함수    초기값
```

- **`count`** — 현재 상태 값. 읽기 전용처럼 다뤄야 한다 (직접 수정 금지).
- **`setCount`** — 이 함수를 호출해야 React가 변화를 감지하고 화면을 다시 그린다.
- **`useState(0)`** — 컴포넌트가 처음 렌더링될 때 사용할 초기값.

> "setter 함수(`setCount`)를 통해서만 값을 바꿔야 한다는 게 핵심입니다. `count = 1` 이렇게 직접 바꾸면 React가 모릅니다."

#### 왜 배열 구조 분해로 받는가?

```js
// useState는 [현재값, setter함수] 배열을 반환한다
const state = useState(0);   // state = [0, ƒ]
const count = state[0];      // 0
const setCount = state[1];   // ƒ

// 구조 분해로 한 줄로 쓰는 것이 관례
const [count, setCount] = useState(0);
```

#### 상태가 바뀌면 무슨 일이 생기나?

```
setCount(1) 호출
  → React: "count 바뀐 거 감지!"
  → 컴포넌트 함수를 다시 실행
  → 새로운 count(=1)로 화면 재렌더링
```

> "컴포넌트 함수가 통째로 다시 실행되는 겁니다. 이 과정을 **리렌더링**이라고 합니다."

---

### [실습] Counter 컴포넌트 직접 만들어보기

개념을 설명만 듣는 것보다 직접 만들어보는 게 훨씬 빠릅니다. 아래 순서대로 따라해보세요.

#### Step 1 — `Counter.jsx` 파일 만들기

`src/components/Counter.jsx` 파일을 새로 만들고 아래 코드를 붙여넣으세요.

```jsx
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>카운터: {count}</h2>
      <button onClick={() => setCount(count + 1)}>+1 증가</button>
      <button onClick={() => setCount(count - 1)} style={{ marginLeft: '8px' }}>-1 감소</button>
      <button onClick={() => setCount(0)} style={{ marginLeft: '8px' }}>초기화</button>
    </div>
  );
}
```

#### Step 2 — `App.jsx`에 임시로 추가하기

`src/App.jsx`를 열고 상단에 import를 추가한 뒤, `<main>` 안에 `<Counter />`를 끼워 넣으세요.

```jsx
// App.jsx 상단에 추가
import Counter from './components/Counter';

// <main> 안에 추가 (기존 코드 위에)
<main className="main">
  <Counter />   {/* ← 임시 실습용 */}
  {isLoggedIn ? (
    <ProductList />
  ) : (
    <LoginForm onLogin={login} />
  )}
</main>
```

#### Step 3 — 브라우저에서 확인하기

개발 서버가 실행 중이 아니라면 터미널에서:

```bash
cd week1-react
npm run dev
```

브라우저 `http://localhost:3000` 접속 후 버튼을 눌러보세요.

**확인 포인트:**

| 실험 | 기대 결과 |
|---|---|
| `+1 증가` 버튼 클릭 | 숫자가 즉시 증가 |
| `초기화` 버튼 클릭 | 0으로 리셋 |
| `useState(0)`을 `useState(100)`으로 바꾸기 | 시작 숫자가 100으로 바뀜 |
| `setCount(count + 1)` 대신 `count += 1`로 바꾸기 | 화면이 안 바뀜 (리렌더링 없음 확인) |

#### 심화 실험 — 예상과 다른 값이 나온다면?

버튼 하나로 `+1`을 **세 번 연속** 호출해보세요.

```jsx
// Counter.jsx의 버튼을 아래로 바꾸기
<button onClick={() => {
  setCount(count + 1);
  setCount(count + 1);
  setCount(count + 1);
}}>
  +3 증가 (버그 있음)
</button>
```

> "세 번 호출했으니 3이 올라가야 할 것 같은데, 실제로는 1만 올라갑니다. 왜 그럴까요?"

**이유: React의 Batch 처리**

React는 같은 이벤트 핸들러 안의 `setState` 호출을 모아서(batch) **한 번에** 렌더링한다. 이때 `count`는 클릭 시점의 스냅샷 값으로 고정되어 있으므로 세 번 모두 같은 값을 더하게 된다.

```
// count가 0인 상태에서 클릭하면
setCount(0 + 1)  // count는 여전히 0 (아직 렌더링 안 됨)
setCount(0 + 1)  // count는 여전히 0
setCount(0 + 1)  // count는 여전히 0
→ 결과: 1  (세 번 다 같은 값)
```

**해결: 함수형 업데이트 (`prev => prev + 1`)**

이전 상태를 직접 참조하는 대신, setter에 **함수**를 넘기면 React가 항상 최신 값을 `prev`로 전달해 준다.

```jsx
<button onClick={() => {
  setCount(prev => prev + 1);
  setCount(prev => prev + 1);
  setCount(prev => prev + 1);
}}>
  +3 증가 (정상)
</button>
```

```
// count가 0인 상태에서 클릭하면
setCount(prev => prev + 1)  // prev=0 → 1
setCount(prev => prev + 1)  // prev=1 → 2
setCount(prev => prev + 1)  // prev=2 → 3
→ 결과: 3  ✅
```

**정리:**

| 방식 | 코드 | 언제 쓰나 |
|---|---|---|
| 값 직접 전달 | `setCount(count + 1)` | 현재 상태에만 의존할 때 |
| 함수형 업데이트 | `setCount(prev => prev + 1)` | 이전 상태를 기반으로 계산할 때 (연속 호출, 비동기 등) |

> "실무에서는 습관적으로 함수형 업데이트를 쓰는 개발자도 많습니다. 항상 안전하기 때문입니다."

#### Step 4 — React DevTools로 상태 관찰하기

> 브라우저 확장 프로그램 [React Developer Tools](https://chromewebstore.google.com/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)가 설치되어 있으면 더욱 직관적으로 확인할 수 있습니다.

1. 개발자 도구(F12) → **Components** 탭 선택
2. 왼쪽 컴포넌트 트리에서 `Counter` 클릭
3. 오른쪽 패널에서 `count` 상태가 버튼 클릭마다 실시간으로 바뀌는 걸 확인

#### Step 5 — 실습 후 정리하기

실습이 끝나면 `App.jsx`에서 추가했던 두 줄을 지우고 `Counter.jsx` 파일도 삭제하세요.

```jsx
// App.jsx에서 제거
import Counter from './components/Counter';  // ← 삭제
<Counter />                                  // ← 삭제
```

---

### 제어 컴포넌트(Controlled Component)란?

HTML 기본 `<input>`은 자체적으로 값을 관리한다(비제어). 
React에서는 이 값을 **상태로 가져와 React가 제어**하는 것이 권장된다.

```jsx
// ❌ 비제어 (React가 값을 모름)
<input type="text" />

// ✅ 제어 컴포넌트 (React 상태가 값을 제어)
const [name, setName] = useState('');
<input
  value={name}
  onChange={(e) => setName(e.target.value)}
/>
```

#### `value` — React 상태를 input에 연결

```jsx
<input value={name} />
```

`value` prop은 input에 표시될 값을 React 상태로 고정한다. 사용자가 타이핑해도 `setName`을 호출하지 않으면 화면의 값이 바뀌지 않는다.

```
사용자 타이핑 → 브라우저가 input 값 바꾸려 함
              → React: "아니, value={name}으로 고정이야"
              → 화면은 그대로 (읽기 전용처럼 보임)
```

> "`value`만 연결하고 `onChange`를 빠뜨리면 아무리 타이핑해도 값이 안 바뀝니다. React가 경고를 띄우는 이유가 바로 이것입니다."

#### `onChange` — 사용자 입력을 상태에 반영

```jsx
<input onChange={(e) => setName(e.target.value)} />
```

사용자가 키를 누를 때마다 브라우저가 이 함수를 호출한다. `setName`으로 상태를 업데이트하면 React가 리렌더링하고, 새 값이 `value`에 반영된다.

```
사용자 타이핑 "홍"
  → onChange 호출 → setName('홍')
  → 리렌더링 → value={name} = '홍'
  → 화면에 "홍" 표시  ✅
```

#### `e` (이벤트 객체) — 브라우저가 전달하는 정보 꾸러미

`onChange`에 전달되는 `e`는 브라우저가 자동으로 넘겨주는 **이벤트 객체**다.

```jsx
onChange={(e) => {
  console.log(e);              // SyntheticEvent 객체 전체
  console.log(e.target);       // 이벤트가 발생한 DOM 요소 (<input>)
  console.log(e.target.value); // input에 현재 입력된 문자열  ← 이걸 씀
}}
```

- **`e.target`** — 이벤트가 발생한 요소. 여기서는 `<input>` DOM 노드.
- **`e.target.value`** — input에 현재 입력된 값. 타이핑마다 최신 문자열이 들어온다.

> "`e`라는 이름은 관례일 뿐입니다. `event`, `evt`로 써도 동작은 같습니다. 하지만 `e`가 가장 많이 쓰입니다."

**`e`가 담고 있는 주요 정보:**

| 프로퍼티 | 값 예시 | 설명 |
|---|---|---|
| `e.target.value` | `'홍길동'` | input에 입력된 현재 값 |
| `e.target.name` | `'username'` | input의 `name` 속성 (여러 input을 하나의 핸들러로 처리할 때 유용) |
| `e.type` | `'change'` | 이벤트 종류 |
| `e.preventDefault()` | — | 브라우저 기본 동작 막기 (폼 제출 시 페이지 새로고침 방지 등) |

#### `value` + `onChange` 함께 있어야 하는 이유

```
value만 있을 때:  React 상태 → input  (단방향, 읽기 전용)
onChange만 있을 때: input → React 상태  (단방향, 표시는 브라우저가 관리)
둘 다 있을 때:   React 상태 ↔ input  (양방향, 제어 컴포넌트 완성)
```

### 상태 초기값

```js
const [name, setName] = useState('');    // 문자열 → 초기값 '' (null 쓰면 경고 발생)
const [email, setEmail] = useState('');  // 문자열 → 초기값 ''
const [error, setError] = useState(null); // 없을 때 null, 있을 때 문자열
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
│   └── useAuth.js      ✅ Step 04 완성
└── components/
    ├── LoginForm.jsx   📝 이번 Step — 로그인 폼 제어 컴포넌트
    └── ProductList.jsx
```

---

## 주요 코드

```jsx
// src/components/LoginForm.jsx

export default function LoginForm({ onLogin }) {
  const [name, setName] = useState('');       // ← [실습 5]
  const [email, setEmail] = useState('');     // ← [실습 5]
  const [error, setError] = useState(null);   // ← [실습 5]
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();             // 폼 제출 시 페이지 새로고침 방지
    if (!name.trim()) {
      setError('이름을 입력해주세요');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await onLogin(name.trim(), email.trim() || undefined);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={name}                              // ← [실습 5 연결]
        onChange={(e) => setName(e.target.value)} // ← [실습 5 연결]
        placeholder="예: 홍길동"
      />
      {error && <p className="error-msg">{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? '처리 중...' : '로그인'}
      </button>
    </form>
  );
}
```

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

1. **구현 전:** 이름 입력란에 타이핑해도 값이 안 바뀌는지 확인 (읽기 전용 상태)
2. **구현 후:** 타이핑 시 즉시 반영, 빈 이름으로 제출 시 에러 메시지 표시 확인
3. **React DevTools:** 컴포넌트 선택 → `name` 상태가 타이핑마다 바뀌는지 실시간 확인
4. **e.preventDefault()** 제거 후 제출 시 어떤 현상이 발생하는지 실험

---

## 핵심 정리

> **제어 컴포넌트는 `value`와 `onChange`를 모두 연결해 React가 입력값을 완전히 제어하게 한다. 이 패턴 덕분에 입력값 검증, 에러 표시, 조건부 제출 같은 로직을 순수 JS로 다룰 수 있다. Week 2(Next.js)의 로그인 페이지도 완전히 동일한 패턴으로 구현된다.**
