import { readFileSync } from 'fs';

const SCORE_MAP = {
  '과제 1': 10,
  '과제 2': 10,
  '과제 3': 10,
  '과제 4': 10,
  '과제 5': 10,
  '과제 6': 10,
  '과제 7': 10,
  '과제 8': 10,
  '과제 9': 10,
  '과제 10': 10,
};

const LABEL_MAP = {
  '과제 1': 'localStorage 초기값 불러오기',
  '과제 2': 'cart 변경 시 localStorage 자동 저장',
  '과제 3': 'addToCart (추가 / 수량 증가)',
  '과제 4': 'removeFromCart (상품 삭제)',
  '과제 5': 'updateQuantity (수량 변경)',
  '과제 6': 'clearCart (전체 비우기)',
  '과제 7': '빈 장바구니 메시지',
  '과제 8': '수량 +/- 버튼 연결',
  '과제 9': '삭제 버튼 연결',
  '과제 10': '결제하기 버튼 (심화)',
};

const raw = readFileSync('week1-react/test-results.json', 'utf8');
const report = JSON.parse(raw);

// 각 describe 블록(과제 N)별 통과 여부 집계
const suiteResults = {};
for (const file of report.testResults) {
  for (const t of file.assertionResults) {
    const suite = t.ancestorTitles[0]; // "과제 N: ..." 형태
    if (!suite) continue;
    const match = suite.match(/^(과제 \d+)/);
    if (!match) continue;
    const key = match[1];
    if (!suiteResults[key]) suiteResults[key] = { passed: 0, failed: 0 };
    if (t.status === 'passed') suiteResults[key].passed++;
    else suiteResults[key].failed++;
  }
}

// 채점
let total = 0;
const rows = [];
for (const [key, score] of Object.entries(SCORE_MAP)) {
  const r = suiteResults[key];
  const passed = r ? r.failed === 0 : false;
  const earned = passed ? score : 0;
  total += earned;
  const icon = passed ? '✅' : '❌';
  rows.push(`| ${key} | ${LABEL_MAP[key]} | ${icon} | ${earned}점 |`);
}

const summary = `## 🏆 채점 결과

| 과제 | 내용 | 통과 | 점수 |
|------|------|:----:|-----:|
${rows.join('\n')}

---
**총점: ${total} / 100점**
${total === 100 ? '\n🎉 완벽합니다!' : total >= 90 ? '\n👏 거의 다 왔어요!' : total >= 70 ? '\n💪 잘 하고 있어요!' : '\n📚 조금 더 해봐요!'}

<details>
<summary>테스트 상세 결과 보기</summary>

\`\`\`
총 테스트: ${report.numTotalTests}개
통과: ${report.numPassedTests}개
실패: ${report.numFailedTests}개
\`\`\`
</details>
`;

process.stdout.write(summary);
