/**
 * AICE 어소시에이트 실기 — 6·7·8·9차시 강의자료 (PPTX)
 *
 *   node tools/make-lecture-pptx.mjs
 *   → 강의자료/06차시_append_extend.pptx … 09차시_def_return.pptx
 *
 * 내용은 heung/index.html 의 퀘스트(코드 템플릿·파라미터)와 같은 예제를 쓴다.
 * 학생이 앱에서 조립하는 코드가 그대로 슬라이드에 나오게 — 수업과 실습이 어긋나지 않도록.
 */
import { createRequire } from "node:module";
import { mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const require = createRequire("file:///C:/Users/user/Documents/BusanForeign/package.json");
const PptxGenJS = require("pptxgenjs");

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = resolve(ROOT, "강의자료");
mkdirSync(OUT, { recursive: true });

/* 팔레트 — 앱(indigo 4f46e5)과 같은 계열. 어두운 표지·정리, 흰 본문 */
const C = {
  navy: "1E1B4B", indigo: "4F46E5", indigoSoft: "EEF2FF", ink: "0F172A", ink2: "334155", gray: "64748B",
  line: "E2E8F0", white: "FFFFFF", green: "059669", greenSoft: "ECFDF5", red: "DC2626", redSoft: "FEF2F2",
  amber: "D97706", amberSoft: "FFFBEB", code: "0B1020", codeText: "E5E7EB", codeKw: "93C5FD", codeStr: "FCD34D",
};
const KO = "Malgun Gothic";
const MONO = "Courier New";

/* ── 공통 조각 ─────────────────────────────────────────── */
function deck() {
  const p = new PptxGenJS();
  p.layout = "LAYOUT_16x9";   // 10 × 5.625 in
  p.author = "정지원";
  return p;
}
const T = (slide, text, o) => slide.addText(text, { isTextBox: true, fontFace: KO, margin: 0, ...o });

function cover(p, no, title, sub, kicker) {
  const s = p.addSlide();
  s.background = { color: C.navy };
  T(s, `${no}차시`, { x: 0.6, y: 0.6, w: 3, h: 0.4, fontSize: 14, bold: true, color: "A5B4FC", charSpacing: 2 });
  T(s, title, { x: 0.6, y: 1.5, w: 8.8, h: 1.2, fontSize: 40, bold: true, color: C.white });
  T(s, sub, { x: 0.6, y: 2.75, w: 8.8, h: 0.6, fontSize: 18, color: "C7D2FE" });
  /* 두 함수 이름을 큰 코드 칩으로 */
  const [a, b] = kicker;
  chip(s, a, 0.6, 3.7, 2.6); T(s, "vs", { x: 3.35, y: 3.7, w: 0.5, h: 0.6, fontSize: 18, color: "A5B4FC", align: "center", valign: "middle" });
  chip(s, b, 3.95, 3.7, 2.6);
  T(s, "AICE 어소시에이트 실기 · 파이썬 기초 · 흥해공고", { x: 0.6, y: 4.9, w: 8.8, h: 0.3, fontSize: 11, color: "818CF8" });
  return s;
}
function chip(s, text, x, y, w) {
  s.addShape("roundRect", { x, y, w, h: 0.6, fill: { color: C.indigo }, line: { color: C.indigo }, rectRadius: 0.12 });
  T(s, text, { x, y, w, h: 0.6, fontSize: 20, bold: true, color: C.white, fontFace: MONO, align: "center", valign: "middle" });
}
function head(s, title, no) {
  s.background = { color: C.white };
  T(s, `${no}차시`, { x: 0.5, y: 0.35, w: 2, h: 0.3, fontSize: 11, bold: true, color: C.indigo, charSpacing: 2 });
  T(s, title, { x: 0.5, y: 0.6, w: 9, h: 0.7, fontSize: 28, bold: true, color: C.ink });
}
function pageNo(s, i, n) { T(s, `${i} / ${n}`, { x: 8.7, y: 5.2, w: 0.8, h: 0.25, fontSize: 9, color: C.gray, align: "right" }); }

/* 코드 블록 — 간단한 색 입히기: 키워드·문자열 */
const KW = /\b(for|in|if|elif|else|while|break|continue|def|return|print|range|enumerate|len|import|True|False|None)\b/g;
/* 글자 크기는 상자 높이에 맞춘다 — 줄 수가 적은 상자가 비어 보이지 않게. 최대 16pt, 가로도 넘치지 않는 크기로 */
function fitSize(code, w, h, max = 16) {
  const lines = code.split("\n");
  const longest = Math.max(...lines.map((l) => [...l].reduce((n, ch) => n + (/[가-힣]/.test(ch) ? 2.1 : 1), 0)));
  const byH = ((h - 0.28) * 72) / (lines.length * 1.32);
  const byW = ((w - 0.4) * 72) / (longest * 0.64);
  return Math.max(9, Math.min(max, byH, byW));
}
function codeBlock(s, code, x, y, w, h, size = 12) {
  size = Math.max(size, fitSize(code, w, h, 16));
  s.addShape("roundRect", { x, y, w, h, fill: { color: C.code }, line: { color: C.code }, rectRadius: 0.08 });
  const runs = [];
  const lines = code.split("\n");
  lines.forEach((ln, li) => {
    /* 문자열 → 키워드 순으로 토막낸다 */
    const parts = ln.split(/('[^']*'|f'[^']*')/);
    parts.forEach((pt) => {
      if (!pt) return;
      if (/^f?'/.test(pt)) { runs.push({ text: pt, options: { color: C.codeStr } }); return; }
      let last = 0; let m;
      const re = new RegExp(KW.source, "g");
      while ((m = re.exec(pt))) {
        if (m.index > last) runs.push({ text: pt.slice(last, m.index), options: { color: C.codeText } });
        runs.push({ text: m[0], options: { color: C.codeKw, bold: true } });
        last = m.index + m[0].length;
      }
      if (last < pt.length) runs.push({ text: pt.slice(last), options: { color: C.codeText } });
    });
    if (li < lines.length - 1) runs.push({ text: "", options: { breakLine: true } });
  });
  s.addText(runs, { isTextBox: true, x: x + 0.18, y: y + 0.12, w: w - 0.36, h: h - 0.24, fontFace: MONO, fontSize: size, color: C.codeText, valign: "top", margin: 0, lineSpacingMultiple: 1.15 });
}
function outBlock(s, out, x, y, w, h, size = 11) {
  size = Math.max(size, fitSize(out, w, h - 0.3, 14));
  s.addShape("roundRect", { x, y, w, h, fill: { color: C.greenSoft }, line: { color: "A7F3D0" }, rectRadius: 0.08 });
  T(s, "실행 결과", { x: x + 0.18, y: y + 0.08, w: 2, h: 0.25, fontSize: 9, bold: true, color: C.green, charSpacing: 1 });
  T(s, out, { x: x + 0.18, y: y + 0.36, w: w - 0.36, h: h - 0.44, fontSize: size, fontFace: MONO, color: C.ink, valign: "top", lineSpacingMultiple: 1.15 });
}
function card(s, x, y, w, h, { title, body, tone = "indigo", mono = false, big = null }) {
  const fill = { indigo: C.indigoSoft, green: C.greenSoft, red: C.redSoft, amber: C.amberSoft, gray: "F8FAFC" }[tone];
  const ink = { indigo: C.indigo, green: C.green, red: C.red, amber: C.amber, gray: C.ink2 }[tone];
  s.addShape("roundRect", { x, y, w, h, fill: { color: fill }, line: { color: fill }, rectRadius: 0.1 });
  if (big) T(s, big, { x: x + 0.25, y: y + 0.15, w: w - 0.5, h: 0.6, fontSize: 30, bold: true, color: ink, fontFace: mono ? MONO : KO });
  T(s, title, { x: x + 0.25, y: y + (big ? 0.8 : 0.18), w: w - 0.5, h: 0.4, fontSize: 15, bold: true, color: ink, fontFace: mono ? MONO : KO });
  if (body) T(s, body, { x: x + 0.25, y: y + (big ? 1.2 : 0.6), w: w - 0.5, h: h - (big ? 1.35 : 0.75), fontSize: 12.5, color: C.ink2, valign: "top", lineSpacingMultiple: 1.25 });
}
function bullets(s, items, x, y, w, h, size = 14) {
  s.addText(items.map((t, i) => ({ text: t, options: { bullet: true, breakLine: i < items.length - 1, paraSpaceAfter: 6 } })),
    { isTextBox: true, x, y, w, h, fontFace: KO, fontSize: size, color: C.ink2, valign: "top", margin: 0 });
}
function numberRow(s, items, y) {
  /* 번호 원 + 굵은 제목 + 설명, 가로 3~4칸 */
  const n = items.length, gap = 0.25, w = (9 - gap * (n - 1)) / n;
  items.forEach((it, i) => {
    const x = 0.5 + i * (w + gap);
    s.addShape("ellipse", { x, y, w: 0.45, h: 0.45, fill: { color: C.indigo }, line: { color: C.indigo } });
    T(s, String(i + 1), { x, y, w: 0.45, h: 0.45, fontSize: 14, bold: true, color: C.white, align: "center", valign: "middle" });
    T(s, it.t, { x: x + 0.6, y, w: w - 0.6, h: 0.45, fontSize: 14, bold: true, color: C.ink, valign: "middle" });
    T(s, it.d, { x, y: y + 0.55, w, h: 1.55, fontSize: 12, color: C.ink2, valign: "top", lineSpacingMultiple: 1.2 });
  });
}
function quiz(s, qs) {
  qs.forEach((q, i) => {
    const y = 1.5 + i * 1.2;
    s.addShape("roundRect", { x: 0.5, y, w: 9, h: 1.05, fill: { color: "F8FAFC" }, line: { color: C.line }, rectRadius: 0.08 });
    T(s, `Q${i + 1}`, { x: 0.7, y: y + 0.12, w: 0.6, h: 0.35, fontSize: 13, bold: true, color: C.indigo });
    T(s, q.q, { x: 1.3, y: y + 0.12, w: 8, h: 0.4, fontSize: 13.5, bold: true, color: C.ink, fontFace: q.mono ? MONO : KO });
    T(s, q.a, { x: 1.3, y: y + 0.55, w: 8, h: 0.4, fontSize: 12, color: C.green });
  });
}
function wrap(s, no, title, points, next) {
  s.background = { color: C.navy };
  T(s, `${no}차시 정리`, { x: 0.6, y: 0.5, w: 3, h: 0.3, fontSize: 11, bold: true, color: "A5B4FC", charSpacing: 2 });
  T(s, title, { x: 0.6, y: 0.85, w: 8.8, h: 0.7, fontSize: 26, bold: true, color: C.white });
  points.forEach((pt, i) => {
    const y = 1.85 + i * 0.75;
    s.addShape("ellipse", { x: 0.6, y: y + 0.05, w: 0.4, h: 0.4, fill: { color: C.indigo }, line: { color: C.indigo } });
    T(s, String(i + 1), { x: 0.6, y: y + 0.05, w: 0.4, h: 0.4, fontSize: 13, bold: true, color: C.white, align: "center", valign: "middle" });
    T(s, pt, { x: 1.15, y, w: 8.2, h: 0.55, fontSize: 15, color: "E0E7FF", valign: "middle" });
  });
  T(s, `다음 차시 → ${next}`, { x: 0.6, y: 4.85, w: 8.8, h: 0.35, fontSize: 12, color: "818CF8" });
}

/* ═══════════════ 6차시 append vs extend ═══════════════ */
function deck6() {
  const p = deck(); const no = 6; let i = 0; const N = 10;
  const s1 = cover(p, no, "리스트 단일 추가 vs 묶음 확장", "가방에 아이템 하나 넣기 vs 박스째 쏟아붓기", ["append()", "extend()"]);
  s1.addNotes("도입 1분: '가방에 사과 1개 vs 사과 박스' 비유로 시작. 오늘 목표는 리스트 안에 리스트가 들어가는 사고를 막는 것.");

  let s = p.addSlide(); head(s, "오늘 배우면 AICE에서 이렇게 쓴다", no); pageNo(s, ++i + 1, N);
  card(s, 0.5, 1.5, 4.35, 1.6, { tone: "indigo", title: "교차검증 점수 누적", body: "for 반복문 안에서 scores.append(score) — 실기 정답 코드에 그대로 나오는 패턴", mono: false });
  card(s, 5.15, 1.5, 4.35, 1.6, { tone: "indigo", title: "결측치 대체 목록 합치기", body: "여러 컬럼 이름 리스트를 하나로 — cols.extend(more_cols)" });
  card(s, 0.5, 3.3, 9, 1.7, { tone: "amber", title: "오늘 막을 사고", body: "append(리스트) 를 쓰면 리스트 안에 리스트가 통째로 들어간다. 나중에 len() 이나 인덱스가 전부 어긋난다 — 실기에서 가장 흔한 오답 원인." });

  s = p.addSlide(); head(s, "append() — 아이템 하나를 원소로 덧붙인다", no); pageNo(s, ++i + 1, N);
  codeBlock(s, "inventory = ['기본검', '물약']\ninventory.append('전설의활')\nprint(inventory)\nprint(len(inventory))", 0.5, 1.5, 5.2, 2.2, 13);
  outBlock(s, "['기본검', '물약', '전설의활']\n3", 0.5, 3.85, 5.2, 1.2);
  card(s, 5.95, 1.5, 3.55, 3.55, { tone: "indigo", title: "기억할 것", body: "• 괄호 안의 것이 통째로 원소 1개가 된다\n• 그래서 len 은 딱 1 늘어난다\n• 리스트를 넣으면 리스트가 원소가 된다\n  → [1, 2, [3, 4]]  (중첩!)" });

  s = p.addSlide(); head(s, "extend() — 다른 리스트의 알맹이를 꺼내 붙인다", no); pageNo(s, ++i + 1, N);
  codeBlock(s, "inventory = ['기본검', '물약']\ninventory.extend(['보석_1', '보석_2'])\nprint(inventory)\nprint(len(inventory))", 0.5, 1.5, 5.2, 2.2, 13);
  outBlock(s, "['기본검', '물약', '보석_1', '보석_2']\n4", 0.5, 3.85, 5.2, 1.2);
  card(s, 5.95, 1.5, 3.55, 3.55, { tone: "green", title: "기억할 것", body: "• 괄호 안은 반드시 '여러 개' (리스트·튜플·문자열)\n• 알맹이 개수만큼 len 이 늘어난다\n• 문자열을 넣으면 글자 하나하나가 들어간다\n  extend('abc') → 'a', 'b', 'c'  (주의!)" });

  s = p.addSlide(); head(s, "같은 재료, 다른 결과 — 나란히 비교", no); pageNo(s, ++i + 1, N);
  codeBlock(s, "a = [1, 2]\na.append([3, 4])\nprint(a)      # [1, 2, [3, 4]]\nprint(len(a)) # 3", 0.5, 1.5, 4.35, 1.9, 12.5);
  codeBlock(s, "b = [1, 2]\nb.extend([3, 4])\nprint(b)      # [1, 2, 3, 4]\nprint(len(b)) # 4", 5.15, 1.5, 4.35, 1.9, 12.5);
  card(s, 0.5, 3.6, 4.35, 1.4, { tone: "red", title: "append → 중첩 리스트", body: "3번째 원소가 [3, 4] 라는 '리스트 한 덩어리'. a[2][0] 처럼 두 번 파고 들어가야 3이 나온다." });
  card(s, 5.15, 3.6, 4.35, 1.4, { tone: "green", title: "extend → 평평한 리스트", body: "3, 4 가 각각 원소. 실기에서 원하는 모양은 거의 항상 이쪽." });

  s = p.addSlide(); head(s, "흔한 실수 3가지", no); pageNo(s, ++i + 1, N);
  numberRow(s, [
    { t: "append 에 리스트", d: "scores.append([90, 85]) → 원소가 1개(리스트)로 들어감. 두 점수를 각각 넣고 싶으면 extend." },
    { t: "extend 에 문자열", d: "names.extend('철수') → '철', '수' 로 쪼개짐. 이름 하나는 append('철수')." },
    { t: "결과를 변수에 받기", d: "x = a.append(1) 은 x 가 None. 두 함수 모두 리스트를 '제자리에서' 바꾸고 아무것도 돌려주지 않는다." },
  ], 1.6);
  codeBlock(s, "x = scores.append(90)\nprint(x)   # None  ← 이미 scores 가 바뀌었다", 0.5, 3.45, 9, 1.5, 13);

  s = p.addSlide(); head(s, "AICE 실기 패턴 — 교차검증 점수 모으기", no); pageNo(s, ++i + 1, N);
  codeBlock(s, "scores = []\nfor fold in range(5):\n    score = 80 + fold * 2    # 폴드별 점수\n    scores.append(score)\nprint(scores)\nprint('평균:', sum(scores) / len(scores))", 0.5, 1.5, 5.6, 2.45, 12.5);
  outBlock(s, "[80, 82, 84, 86, 88]\n평균: 84.0", 0.5, 4.1, 5.6, 1.05, 11);
  card(s, 6.35, 1.5, 3.15, 3.65, { tone: "indigo", title: "왜 append 인가", body: "반복마다 점수가 '하나' 나온다. 하나씩 덧붙이니 append.\n\n반대로 두 실험의 점수 리스트를 합칠 때는 all_scores.extend(scores)." });

  s = p.addSlide(); head(s, "실습 — 앱 6차시 (10분)", no); pageNo(s, ++i + 1, N);
  numberRow(s, [
    { t: "STEP 1 코드 소환", d: "「append & extend 리스트 조립」 버튼을 누르면 코드가 나타난다. 다섯 줄을 소리 내어 읽는다." },
    { t: "STEP 2 파라미터 적용", d: "append 로 넣을 단일 템(전설의활·마법지팡이·방패)과 extend 박스 알맹이 수(1~4)를 고르고 「파라미터 적용」. 코드가 바뀌는 걸 본다." },
    { t: "STEP 3 실행 · 차트", d: "「파이프라인 실행」 → 막대 셋: 기본 2 → append 후 3 → extend 후 3+박스 수. 누르기 전에 마지막 숫자를 먼저 말해 보기." },
  ], 1.6);
  card(s, 0.5, 3.3, 9, 1.8, { tone: "amber", title: "도전 과제", body: "박스를 4개로 올렸을 때 extend 대신 append 를 쓰면 슬롯이 몇 개가 될까?\n(답: 4개 — 박스 하나가 원소 1개로 들어간다) 짝과 답을 맞춰 보세요." });

  s = p.addSlide(); head(s, "확인 퀴즈", no); pageNo(s, ++i + 1, N);
  quiz(s, [
    { q: "a = [1]; a.append([2, 3]); len(a) 는?", a: "답: 2 — [1, [2, 3]]. 리스트가 원소 1개로 들어갔다.", mono: true },
    { q: "b = [1]; b.extend([2, 3]); b 는?", a: "답: [1, 2, 3] — 알맹이가 각각 들어갔다.", mono: true },
    { q: "이름 하나를 추가할 때 append 와 extend 중 무엇을 쓰나?", a: "답: append('이름'). extend 는 글자를 쪼갠다." },
  ]);

  s = p.addSlide(); wrap(s, no, "append 는 하나, extend 는 알맹이 전부", [
    "append(x) — x 가 통째로 원소 1개. len +1",
    "extend(리스트) — 알맹이가 각각 원소. len +N",
    "둘 다 돌려주는 값은 None — 결과를 변수에 받지 않는다",
    "실기 패턴: 반복문 안 scores.append(score)",
  ], "7차시 pop() vs remove() — 순번으로 꺼내기 vs 이름으로 삭제");
  return p.writeFile({ fileName: resolve(OUT, "06차시_append_extend.pptx") });
}

/* ═══════════════ 7차시 pop vs remove ═══════════════ */
function deck7() {
  const p = deck(); const no = 7; let i = 0; const N = 9;
  const s1 = cover(p, no, "순번으로 꺼내기 vs 이름으로 삭제", "'맨 뒤에 있는 놈 나와' vs '어뷰저 삭제해'", ["pop()", "remove()"]);
  s1.addNotes("도입: 대기열(큐) 비유. 번호표로 부르는 것과 이름으로 부르는 것의 차이.");

  let s = p.addSlide(); head(s, "오늘 배우면 AICE에서 이렇게 쓴다", no); pageNo(s, ++i + 1, N);
  card(s, 0.5, 1.5, 4.35, 1.6, { tone: "indigo", title: "마지막 열(정답 라벨) 떼어내기", body: "cols = list(df.columns); target = cols.pop(-1) — 실기에서 빈출하는 정답 코드" });
  card(s, 5.15, 1.5, 4.35, 1.6, { tone: "indigo", title: "쓸모없는 컬럼 이름 빼기", body: "features.remove('id') — 이름을 알 때는 remove 가 한 줄" });
  card(s, 0.5, 3.3, 9, 1.7, { tone: "amber", title: "오늘 막을 사고", body: "없는 값을 remove 하면 ValueError 로 프로그램이 멈춘다. 지우기 전에 'in' 으로 있는지 확인하는 습관." });

  s = p.addSlide(); head(s, "pop(인덱스) — 위치로 꺼내고, 꺼낸 값을 돌려준다", no); pageNo(s, ++i + 1, N);
  codeBlock(s, "queue = ['유저A', '유저B', '유저C', '어뷰저', '유저D']\nout_user = queue.pop(-1)\nprint('꺼낸 값:', out_user)\nprint('남은 큐:', queue)", 0.5, 1.5, 5.6, 2.1, 12.5);
  outBlock(s, "꺼낸 값: 유저D\n남은 큐: ['유저A', '유저B', '유저C', '어뷰저']", 0.5, 3.75, 5.6, 1.3, 11);
  card(s, 6.35, 1.5, 3.15, 3.55, { tone: "indigo", title: "기억할 것", body: "• 괄호 안은 '몇 번째' — 0부터 센다\n• -1 은 맨 뒤, 비우면 맨 뒤\n• 꺼낸 값을 변수에 받을 수 있다 (remove 와 가장 큰 차이)\n• 인덱스가 범위를 벗어나면 IndexError" });

  s = p.addSlide(); head(s, "remove(값) — 이름으로 찾아 첫 번째 것을 지운다", no); pageNo(s, ++i + 1, N);
  codeBlock(s, "queue = ['유저A', '유저B', '유저C', '어뷰저', '유저D']\nqueue.remove('어뷰저')\nprint('정제 후:', queue)", 0.5, 1.5, 5.6, 1.7, 12.5);
  outBlock(s, "정제 후: ['유저A', '유저B', '유저C', '유저D']", 0.5, 3.35, 5.6, 0.8, 11);
  codeBlock(s, "queue.remove('없는유저')\n# ValueError: list.remove(x): x not in list", 0.5, 4.3, 5.6, 0.85, 11.5);
  card(s, 6.35, 1.5, 3.15, 3.65, { tone: "green", title: "기억할 것", body: "• 괄호 안은 '값' 자체\n• 같은 값이 여러 개면 맨 앞 하나만\n• 돌려주는 값은 None\n• 없는 값이면 ValueError → 먼저\n  if '어뷰저' in queue: 로 확인" });

  s = p.addSlide(); head(s, "한눈에 비교", no); pageNo(s, ++i + 1, N);
  const rows = [
    ["", "pop(i)", "remove(x)", "del lst[i]"],
    ["무엇으로 찾나", "위치(인덱스)", "값", "위치(인덱스)"],
    ["돌려주는 값", "꺼낸 원소", "None", "없음 (문장)"],
    ["없을 때", "IndexError", "ValueError", "IndexError"],
    ["실기 쓰임", "cols.pop(-1)", "cols.remove('id')", "del cols[0]"],
  ];
  s.addTable(rows.map((r, ri) => r.map((c, ci) => ({ text: c, options: { bold: ri === 0 || ci === 0, fill: { color: ri === 0 ? C.indigoSoft : (ri % 2 ? "F8FAFC" : C.white) }, color: ri === 0 ? C.indigo : C.ink, fontFace: ri > 0 && ci > 0 ? MONO : KO, fontSize: 12.5, align: ci === 0 ? "left" : "center", valign: "middle" } }))),
    { x: 0.5, y: 1.5, w: 9, colW: [2, 2.33, 2.33, 2.34], rowH: 0.5, border: { type: "solid", color: C.line, pt: 0.75 } });
  card(s, 0.5, 4.2, 9, 0.9, { tone: "amber", title: "한 줄 요약: 값을 '받아서 쓰려면' pop, 그냥 '없애려면' remove", body: null });

  s = p.addSlide(); head(s, "흔한 실수 3가지", no); pageNo(s, ++i + 1, N);
  numberRow(s, [
    { t: "이미 꺼낸 걸 또 지움", d: "pop(1) 로 '유저B' 를 꺼낸 뒤 remove('유저B') → ValueError. 순서를 바꾸거나 in 으로 확인." },
    { t: "remove 결과를 변수에", d: "x = lst.remove('a') → x 는 None. 값이 필요하면 pop 을 쓴다." },
    { t: "반복문 안에서 지우기", d: "for x in lst: lst.remove(x) 는 원소를 건너뛴다. 새 리스트를 만들거나 복사본으로 돈다." },
  ], 1.6);
  codeBlock(s, "target = '어뷰저'\nif target in queue:\n    queue.remove(target)\nelse:\n    print('이미 없음')", 0.5, 3.4, 9, 1.7, 12);

  s = p.addSlide(); head(s, "AICE 실기 패턴 — 정답 라벨 떼어내기", no); pageNo(s, ++i + 1, N);
  codeBlock(s, "cols = ['age', 'income', 'score', 'churn']   # df.columns 라고 치자\ntarget = cols.pop(-1)     # 마지막 열 = 정답(y)\nfeatures = cols           # 나머지 = 입력(X)\nprint('y:', target)\nprint('X:', features)", 0.5, 1.5, 5.6, 2.4, 12.5);
  outBlock(s, "y: churn\nX: ['age', 'income', 'score']", 0.5, 4.05, 5.6, 1.05, 11);
  card(s, 6.35, 1.5, 3.15, 3.6, { tone: "indigo", title: "왜 pop 인가", body: "정답 열 이름을 '받아서' 뒤에 y = df[target] 로 써야 하니까. remove 는 이름을 돌려주지 않는다." });

  s = p.addSlide(); head(s, "실습 — 앱 7차시 (10분) · 확인 퀴즈", no); pageNo(s, ++i + 1, N);
  numberRow(s, [
    { t: "STEP 1 코드 소환", d: "「pop & remove 삭제 파이프라인 조립」 버튼 → 큐 5명에서 pop 한 명, remove 한 명 하는 코드가 나타난다." },
    { t: "STEP 2 파라미터 적용", d: "pop 인덱스(맨 앞·맨 뒤·세 번째)와 remove 대상(어뷰저·유저B)을 고르고 「파라미터 적용」. 남을 큐를 먼저 종이에 적는다." },
    { t: "STEP 3 실행 · 차트", d: "「파이프라인 실행」 → 다섯 막대 중 주황 = pop 으로 꺼낸 사람, 빨강 = remove 로 지운 사람. 종이와 맞는지 확인." },
  ], 1.5);
  [{ q: "lst = [5, 6, 7]; v = lst.pop(0); v 와 lst 는?", a: "답: v = 5, lst = [6, 7]" }, { q: "lst = [1, 2, 1]; lst.remove(1); lst 는?", a: "답: [2, 1] — 맨 앞 하나만 지운다" }].forEach((q, k) => {
    const y = 3.35 + k * 0.9;
    s.addShape("roundRect", { x: 0.5, y, w: 9, h: 0.8, fill: { color: "F8FAFC" }, line: { color: C.line }, rectRadius: 0.08 });
    T(s, `Q${k + 1}`, { x: 0.7, y: y + 0.1, w: 0.6, h: 0.3, fontSize: 13, bold: true, color: C.indigo });
    T(s, q.q, { x: 1.3, y: y + 0.1, w: 8, h: 0.3, fontSize: 13, bold: true, color: C.ink, fontFace: MONO });
    T(s, q.a, { x: 1.3, y: y + 0.42, w: 8, h: 0.3, fontSize: 12, color: C.green });
  });

  s = p.addSlide(); wrap(s, no, "값이 필요하면 pop, 없애기만 하면 remove", [
    "pop(i) — 위치로 꺼내고 그 값을 돌려준다. -1 은 맨 뒤",
    "remove(x) — 값으로 찾아 맨 앞 하나를 지운다. None 을 돌려준다",
    "없는 값 remove → ValueError. 먼저 if x in lst 로 확인",
    "실기 패턴: target = cols.pop(-1) 로 정답 열 분리",
  ], "8차시 for / while vs break — 반복 루프와 탈출 조건문");
  return p.writeFile({ fileName: resolve(OUT, "07차시_pop_remove.pptx") });
}

/* ═══════════════ 8차시 for/while vs break ═══════════════ */
function deck8() {
  const p = deck(); const no = 8; let i = 0; const N = 9;
  const s1 = cover(p, no, "반복 루프와 탈출 조건문", "정해진 횟수만큼 도는 for, 조건이 끝날 때까지 도는 while, 그리고 안전벨트 break", ["for / while", "break"]);
  s1.addNotes("도입: 딥러닝 학습은 '반복'이다. 에포크(epoch) 라는 말을 오늘 처음 소개. 얼리스탑 = break.");

  let s = p.addSlide(); head(s, "오늘 배우면 AICE에서 이렇게 쓴다", no); pageNo(s, ++i + 1, N);
  card(s, 0.5, 1.5, 4.35, 1.6, { tone: "indigo", title: "에포크 반복", body: "모델 학습은 같은 데이터를 여러 번(epoch) 돈다. for epoch in range(n) 이 그 뼈대" });
  card(s, 5.15, 1.5, 4.35, 1.6, { tone: "indigo", title: "얼리스탑(EarlyStopping)", body: "손실이 더 안 줄면 멈춘다 — 조건을 보고 break 하는 것과 같은 원리" });
  card(s, 0.5, 3.3, 9, 1.7, { tone: "amber", title: "오늘 막을 사고", body: "끝나는 조건이 없는 while 은 영원히 돈다(무한 루프). 노트북이 멈추면 대부분 이것. 조건 변수를 반드시 바꾸거나 break 를 둔다." });

  s = p.addSlide(); head(s, "for — 정해진 범위를 한 바퀴씩", no); pageNo(s, ++i + 1, N);
  codeBlock(s, "for epoch in range(1, 4):\n    print(f'학습 중... epoch {epoch}')\nprint('끝')", 0.5, 1.5, 5.6, 1.6, 13);
  outBlock(s, "학습 중... epoch 1\n학습 중... epoch 2\n학습 중... epoch 3\n끝", 0.5, 3.25, 5.6, 1.5, 11);
  card(s, 6.35, 1.5, 3.15, 3.25, { tone: "indigo", title: "기억할 것", body: "• range(1, 4) 는 1, 2, 3 — 끝 숫자는 빠진다\n• 몇 번 돌지 '미리' 안다\n• 들여쓰기된 줄만 반복된다\n• 리스트도 바로 돌 수 있다\n  for x in [10, 20, 30]:" });

  s = p.addSlide(); head(s, "while — 조건이 참인 동안 계속", no); pageNo(s, ++i + 1, N);
  codeBlock(s, "loss = 1.0\nepoch = 0\nwhile loss > 0.3:\n    epoch += 1\n    loss = loss * 0.7   # 30%씩 감소\n    print(f'epoch {epoch}: loss {loss:.2f}')\nprint('목표 도달')", 0.5, 1.5, 5.6, 2.1, 12);
  outBlock(s, "epoch 1: loss 0.70\nepoch 2: loss 0.49\nepoch 3: loss 0.34\nepoch 4: loss 0.24\n목표 도달", 0.5, 3.7, 5.6, 1.45, 10);
  card(s, 6.35, 1.5, 3.15, 3.65, { tone: "green", title: "기억할 것", body: "• 몇 번 돌지 '모를 때' 쓴다\n• 조건이 거짓이 되는 순간 빠져나온다\n• 안에서 조건 변수(loss)가 바뀌어야 한다 — 안 바뀌면 무한 루프\n• for 보다 위험하니 실기에선 for 가 기본" });

  s = p.addSlide(); head(s, "break — 조건을 만나면 즉시 탈출", no); pageNo(s, ++i + 1, N);
  codeBlock(s, "max_epoch = 16\nstop_point = 7\nfor epoch in range(1, max_epoch + 1):\n    if epoch == stop_point:\n        print(f'조기 종료! (epoch {epoch}에서 break)')\n        break\n    print(f'정상 학습 중... epoch {epoch}')", 0.5, 1.5, 5.6, 2.3, 12);
  outBlock(s, "정상 학습 중... epoch 1\n…\n정상 학습 중... epoch 6\n조기 종료! (epoch 7에서 break)", 0.5, 3.9, 5.6, 1.25, 10);
  card(s, 6.35, 1.5, 3.15, 3.65, { tone: "red", title: "기억할 것", body: "• 16번 돌 계획이었지만 7에서 끝\n• break 아래 줄은 그 바퀴에서 실행 안 됨\n• 가장 안쪽 반복문 하나만 빠져나온다\n• 짝: continue — 이번 바퀴만 건너뛰고 계속" });

  s = p.addSlide(); head(s, "break vs continue — 헷갈리는 짝", no); pageNo(s, ++i + 1, N);
  codeBlock(s, "for n in range(1, 6):\n    if n == 3:\n        break\n    print(n)\n# 1 2  ← 3에서 완전히 멈춤", 0.5, 1.5, 4.35, 1.9, 12.5);
  codeBlock(s, "for n in range(1, 6):\n    if n == 3:\n        continue\n    print(n)\n# 1 2 4 5  ← 3만 건너뜀", 5.15, 1.5, 4.35, 1.9, 12.5);
  card(s, 0.5, 3.6, 4.35, 1.5, { tone: "red", title: "break = 반복문 종료", body: "얼리스탑, '찾았으니 그만', 오류가 나면 중단" });
  card(s, 5.15, 3.6, 4.35, 1.5, { tone: "green", title: "continue = 이번 바퀴만 패스", body: "결측치 행 건너뛰기, 조건에 안 맞는 데이터 무시" });

  s = p.addSlide(); head(s, "흔한 실수 3가지", no); pageNo(s, ++i + 1, N);
  numberRow(s, [
    { t: "range 끝 숫자", d: "range(1, 10) 은 9까지. 10번 돌리려면 range(1, 11) 또는 range(10)." },
    { t: "무한 루프", d: "while True: 안에 break 가 없거나, 조건 변수를 안 바꾸면 영원히 돈다. 노트북 ■ 버튼으로 중단." },
    { t: "들여쓰기", d: "반복할 줄은 4칸 들여쓰기. 한 줄이라도 빠지면 반복문 밖에서 한 번만 실행된다." },
  ], 1.6);
  codeBlock(s, "n = 0\nwhile n < 3:\n    print(n)\n    # n += 1 을 잊으면 0이 무한히 찍힌다", 0.5, 3.4, 9, 1.7, 12);

  s = p.addSlide(); head(s, "실습 — 앱 8차시 (10분) · 확인 퀴즈", no); pageNo(s, ++i + 1, N);
  numberRow(s, [
    { t: "STEP 1 코드 소환", d: "「반복문 & 탈출 조건식 조립」 버튼 → max_epoch 와 stop_point 가 든 for 문이 나타난다." },
    { t: "STEP 2 파라미터 적용", d: "최대 반복 수(10~20)와 조기 탈출 기준(4~12)을 슬라이더로 정하고 「파라미터 적용」. '정상 학습 중' 이 몇 줄 찍힐지 먼저 말한다 (기준 − 1)." },
    { t: "STEP 3 실행 · 차트", d: "「파이프라인 실행」 → 점선 = 원래 계획한 횟수, 파란 막대 = 실제 돈 횟수, 빨간 막대 = break 가 걸린 회차." },
  ], 1.5);
  [{ q: "for i in range(3): print(i) 의 출력은?", a: "답: 0 1 2 — 0부터, 3은 빠진다" }, { q: "break 와 continue 중 '이번 바퀴만 건너뛰기' 는?", a: "답: continue" }].forEach((q, k) => {
    const y = 3.35 + k * 0.9;
    s.addShape("roundRect", { x: 0.5, y, w: 9, h: 0.8, fill: { color: "F8FAFC" }, line: { color: C.line }, rectRadius: 0.08 });
    T(s, `Q${k + 1}`, { x: 0.7, y: y + 0.1, w: 0.6, h: 0.3, fontSize: 13, bold: true, color: C.indigo });
    T(s, q.q, { x: 1.3, y: y + 0.1, w: 8, h: 0.3, fontSize: 13, bold: true, color: C.ink, fontFace: k === 0 ? MONO : KO });
    T(s, q.a, { x: 1.3, y: y + 0.42, w: 8, h: 0.3, fontSize: 12, color: C.green });
  });

  s = p.addSlide(); wrap(s, no, "횟수를 알면 for, 모르면 while, 멈출 조건은 break", [
    "for x in range(n) — n번, 끝 숫자는 빠진다",
    "while 조건: — 조건이 거짓이 될 때까지. 조건 변수를 꼭 바꾼다",
    "break — 즉시 탈출 (얼리스탑), continue — 이번 바퀴만 건너뜀",
    "실기 패턴: for epoch in range(epochs) 로 학습 반복",
  ], "9차시 def vs return — 사용자 정의 함수와 결과 반환");
  return p.writeFile({ fileName: resolve(OUT, "08차시_for_while_break.pptx") });
}

/* ═══════════════ 9차시 def vs return ═══════════════ */
function deck9() {
  const p = deck(); const no = 9; let i = 0; const N = 9;
  const s1 = cover(p, no, "사용자 정의 함수와 결과 반환", "공식을 자판기로 만드는 def, 결과를 뱉어내는 return", ["def", "return"]);
  s1.addNotes("도입: 자판기 비유 — 동전(입력)을 넣으면 콜라(출력). 같은 계산을 100번 하면 함수로 만든다.");

  let s = p.addSlide(); head(s, "오늘 배우면 AICE에서 이렇게 쓴다", no); pageNo(s, ++i + 1, N);
  card(s, 0.5, 1.5, 4.35, 1.6, { tone: "indigo", title: "열 전체에 내 규칙 적용", body: "df['등급'] = df['점수'].apply(my_func) — 함수를 만들어 두면 판다스가 한 줄씩 넣어 준다" });
  card(s, 5.15, 1.5, 4.35, 1.6, { tone: "indigo", title: "전처리 함수 재사용", body: "훈련 데이터와 시험 데이터에 똑같은 전처리 — 함수 하나를 두 번 부른다" });
  card(s, 0.5, 3.3, 9, 1.7, { tone: "amber", title: "오늘 막을 사고", body: "return 을 빼먹으면 함수가 None 을 돌려준다. apply 결과 열이 전부 None 이면 십중팔구 이것." });

  s = p.addSlide(); head(s, "def — 규칙에 이름을 붙인다", no); pageNo(s, ++i + 1, N);
  codeBlock(s, "def calculate_price(price, tax_rate=0.1):\n    tax = price * tax_rate\n    total = price + tax\n    return price, tax, total\n\nbase, vat, final_price = calculate_price(25000)\nprint(f'원가:{base}원, 세금:{vat}원 -> 최종:{final_price}원')", 0.5, 1.5, 5.6, 2.6, 12);
  outBlock(s, "원가:25000원, 세금:2500.0원 -> 최종:27500.0원", 0.5, 4.25, 5.6, 0.8, 11);
  card(s, 6.35, 1.5, 3.15, 3.55, { tone: "indigo", title: "구조 읽기", body: "• def 이름(입력들):\n• 안쪽은 들여쓰기\n• tax_rate=0.1 은 기본값 — 안 주면 0.1\n• 정의만 해선 안 돌아간다. 이름(값) 으로 '불러야' 실행" });

  s = p.addSlide(); head(s, "return — 계산 결과를 밖으로 보낸다", no); pageNo(s, ++i + 1, N);
  codeBlock(s, "def grade(score):\n    if score >= 90:\n        return 'A'\n    return 'B'        # 위 return 에서 끝났으면 여기 안 옴\n\nprint(grade(95), grade(70))", 0.5, 1.5, 4.35, 2.2, 12);
  outBlock(s, "A B", 0.5, 3.85, 4.35, 0.7, 11);
  codeBlock(s, "def grade_bad(score):\n    if score >= 90:\n        result = 'A'\n    # return 이 없다!\n\nprint(grade_bad(95))   # None", 5.15, 1.5, 4.35, 2.2, 12);
  outBlock(s, "None", 5.15, 3.85, 4.35, 0.7, 11);
  card(s, 0.5, 4.7, 9, 0.5, { tone: "red", title: "return 을 만나는 순간 함수는 끝난다 · return 이 없으면 None", body: null });

  s = p.addSlide(); head(s, "여러 값 돌려주기와 받기", no); pageNo(s, ++i + 1, N);
  codeBlock(s, "def stats(nums):\n    return min(nums), max(nums), sum(nums) / len(nums)\n\nlo, hi, avg = stats([80, 90, 75])   # 세 칸으로 받기\nprint(lo, hi, avg)\n\nresult = stats([80, 90, 75])        # 튜플로 받기\nprint(result, result[2])", 0.5, 1.5, 5.6, 2.6, 11.5);
  outBlock(s, "75 90 81.66666666666667\n(75, 90, 81.66666666666667) 81.66666666666667", 0.5, 4.2, 5.6, 0.95, 10);
  card(s, 6.35, 1.5, 3.15, 3.65, { tone: "green", title: "기억할 것", body: "• return a, b, c 는 튜플 하나를 돌려준다\n• 받는 쪽 변수 개수를 맞추면 한 번에 풀린다\n• 개수가 다르면 ValueError\n• 9차시 앱 코드의 base, vat, final_price 가 이 형태" });

  s = p.addSlide(); head(s, "AICE 실기 패턴 — apply 로 열 전체에 적용", no); pageNo(s, ++i + 1, N);
  codeBlock(s, "import pandas as pd\ndf = pd.DataFrame({'score': [95, 82, 67]})\n\ndef to_tier(score):\n    if score >= 90:\n        return 'CHALLENGER'\n    elif score >= 70:\n        return 'GOLD'\n    return 'BRONZE'\n\ndf['tier'] = df['score'].apply(to_tier)\nprint(df)", 0.5, 1.5, 5.6, 3.6, 11.5);
  outBlock(s, "   score        tier\n0     95  CHALLENGER\n1     82        GOLD\n2     67      BRONZE", 6.35, 1.5, 3.15, 1.5, 10);
  card(s, 6.35, 3.15, 3.15, 1.95, { tone: "indigo", title: "5차시 + 9차시", body: "if-elif-else 로 판정하던 걸 함수로 싸서 apply 에 넘긴다. 실기 파생변수 문제의 정석." });

  s = p.addSlide(); head(s, "흔한 실수 3가지", no); pageNo(s, ++i + 1, N);
  numberRow(s, [
    { t: "return 대신 print", d: "print 는 화면에 보여줄 뿐 값을 돌려주지 않는다. apply 에 쓰면 열이 None 으로 찬다." },
    { t: "정의만 하고 안 부름", d: "def 만 쓰면 아무 일도 안 일어난다. 이름(값) 으로 호출해야 실행." },
    { t: "괄호 빼먹기", d: "df['score'].apply(to_tier()) 처럼 괄호를 붙이면 결과값을 넘기게 됨. 함수 이름만 넘긴다." },
  ], 1.6);
  codeBlock(s, "def f(x):\n    print(x * 2)      # 화면에만 나옴\nv = f(3)\nprint(v)              # None", 0.5, 3.4, 9, 1.7, 12);

  s = p.addSlide(); head(s, "실습 — 앱 9차시 (10분) · 확인 퀴즈", no); pageNo(s, ++i + 1, N);
  numberRow(s, [
    { t: "STEP 1 코드 소환", d: "「def & return 커스텀 계산기 조립」 버튼 → calculate_price 함수 정의와 호출 코드가 나타난다." },
    { t: "STEP 2 파라미터 적용", d: "기본 원가(10000·25000·50000)와 세율(0.05~0.20)을 고르고 「파라미터 적용」. 최종 금액을 먼저 암산한다 (원가 × (1+세율))." },
    { t: "STEP 3 실행 · 차트", d: "「파이프라인 실행」 → 원가 + 세금 = 최종 결제액 막대. 암산과 같은지, 세율을 바꾸면 세금 막대만 변하는지 본다." },
  ], 1.5);
  [{ q: "def f(): x = 1  →  print(f()) 의 출력은?", a: "답: None — return 이 없다" }, { q: "return a, b 를 받을 때 변수는 몇 개?", a: "답: 2개 (또는 튜플 하나로)" }].forEach((q, k) => {
    const y = 3.35 + k * 0.9;
    s.addShape("roundRect", { x: 0.5, y, w: 9, h: 0.8, fill: { color: "F8FAFC" }, line: { color: C.line }, rectRadius: 0.08 });
    T(s, `Q${k + 1}`, { x: 0.7, y: y + 0.1, w: 0.6, h: 0.3, fontSize: 13, bold: true, color: C.indigo });
    T(s, q.q, { x: 1.3, y: y + 0.1, w: 8, h: 0.3, fontSize: 13, bold: true, color: C.ink, fontFace: k === 0 ? MONO : KO });
    T(s, q.a, { x: 1.3, y: y + 0.42, w: 8, h: 0.3, fontSize: 12, color: C.green });
  });

  s = p.addSlide(); wrap(s, no, "def 로 규칙을 만들고, return 으로 값을 돌려준다", [
    "def 이름(입력, 기본값=…): — 정의. 호출해야 실행된다",
    "return 값 — 함수를 끝내고 값을 돌려준다. 없으면 None",
    "return a, b, c — 튜플. 받는 변수 개수를 맞춘다",
    "실기 패턴: df['열'].apply(내함수) — 괄호 없이 이름만",
  ], "10차시 reshape — 배열 차원 변형");
  return p.writeFile({ fileName: resolve(OUT, "09차시_def_return.pptx") });
}

await deck6(); await deck7(); await deck8(); await deck9();
console.log("PPTX 4개 생성 →", OUT);
