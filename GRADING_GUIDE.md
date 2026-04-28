# 과제 자동 채점 가이드

이 브랜치(`auto-grade`)는 학생 PR을 자동으로 채점하기 위한 브랜치입니다.  
**main / homework 브랜치와 무관하게 독립적으로 동작합니다.**

---

## 채점 구조

```
auto-grade 브랜치
├── .github/
│   ├── workflows/grade.yml       ← 채점 워크플로우 (수동 트리거)
│   └── scripts/grade.js          ← 점수 계산 + 마크다운 생성
└── week1-react/
    ├── package.json               ← vitest 포함
    ├── vite.config.js             ← test 환경 설정
    └── src/__tests__/
        ├── setup.js
        ├── useCart.test.js        ← 과제 1~6 채점
        └── CartView.test.jsx      ← 과제 7~10 채점
```

채점 시 동작 방식:
1. `auto-grade` 브랜치에서 테스트 파일을 가져옴
2. 학생 PR에서 구현 파일(`useCart.js`, `CartView.jsx` 등)만 덮어씌움
3. 테스트 실행 후 과제별 점수 계산
4. 해당 PR에 댓글로 결과 게시

---

## 사용법

### 사전 준비

이 브랜치(`auto-grade`)가 원격 저장소에 push되어 있어야 합니다.

```bash
git push origin auto-grade
```

---

### 채점 실행 (1건)

1. GitHub 레포지토리 → **Actions 탭** 클릭

2. 왼쪽 목록에서 **"과제 자동 채점"** 클릭

3. 오른쪽 **"Run workflow"** 버튼 클릭

4. `채점할 PR 번호` 입력 후 **"Run workflow"** 실행
   ```
   채점할 PR 번호: 5
   ```

5. 잠시 후 해당 PR에 채점 결과 댓글이 자동으로 달립니다.

---

### 채점 결과 예시

PR 댓글로 아래와 같이 표시됩니다:

```
## 🏆 채점 결과

| 과제 | 내용                        | 통과 | 점수 |
|------|-----------------------------|:----:|-----:|
| 과제 1 | localStorage 초기값 불러오기 |  ✅  |  10점 |
| 과제 2 | cart 변경 시 자동 저장       |  ✅  |  10점 |
| 과제 3 | addToCart (추가 / 수량 증가) |  ✅  |  10점 |
| 과제 4 | removeFromCart (상품 삭제)   |  ❌  |   0점 |
...

총점: 70 / 100점
```

재제출한 경우 **댓글이 업데이트**됩니다 (새 댓글로 중복 게시되지 않음).

---

### 여러 학생 한 번에 채점하기

PR 번호가 1~30번이라면 터미널에서 아래처럼 일괄 트리거할 수 있습니다:

```bash
# GitHub CLI(gh) 필요
for i in $(seq 1 30); do
  gh workflow run grade.yml -f pr_number=$i
  sleep 3   # API 요청 간격
done
```

---

## 브랜치 관리

### 원격에 push (테스트용)

```bash
git push origin auto-grade
```

### 테스트 후 원격에서만 삭제 (로컬은 유지)

```bash
git push origin --delete auto-grade
```

로컬 브랜치는 그대로 남아 있습니다. 확인:

```bash
git branch          # 로컬: auto-grade 있음
git branch -r       # 원격: origin/auto-grade 없음
```

### 제출기한 종료 후 다시 push

```bash
git push origin auto-grade
```

---

## 채점 기준

| 과제 | 파일 | 내용 | 점수 |
|------|------|------|-----:|
| 과제 1 | `hooks/useCart.js` | localStorage 초기값 불러오기 | 10점 |
| 과제 2 | `hooks/useCart.js` | cart 변경 시 localStorage 자동 저장 | 10점 |
| 과제 3 | `hooks/useCart.js` | addToCart (추가 / 수량 증가) | 10점 |
| 과제 4 | `hooks/useCart.js` | removeFromCart (상품 삭제) | 10점 |
| 과제 5 | `hooks/useCart.js` | updateQuantity (수량 변경) | 10점 |
| 과제 6 | `hooks/useCart.js` | clearCart (전체 비우기) | 10점 |
| 과제 7 | `components/CartView.jsx` | 빈 장바구니 메시지 | 10점 |
| 과제 8 | `components/CartView.jsx` | 수량 +/- 버튼 연결 | 10점 |
| 과제 9 | `components/CartView.jsx` | 삭제 버튼 연결 | 10점 |
| 과제 10 | `components/CartView.jsx` | 결제하기 버튼 (심화) | 10점 |
| **합계** | | | **100점** |
