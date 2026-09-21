/**
 * AICE 어소시에이트 실기 — Part 1 강의자료 (PPTX)
 *
 *   node tools/make-lecture-pptx.mjs
 *   → 강의자료/파이썬기초1_1-5차시.pptx · 파이썬기초2_6-10차시.pptx
 *
 * 내용은 heung/index.html 의 퀘스트(코드 템플릿·파라미터·버튼 이름)와 같은 예제를 쓴다.
 * 학생이 앱에서 조립하는 코드가 그대로 슬라이드에 나오게 — 수업과 실습이 어긋나지 않도록.
 * 실습 장의 3단계는 앱 그대로: STEP 1 코드 소환 → STEP 2 파라미터 적용 → STEP 3 실행·차트.
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

/* 팔레트 — 앱(indigo 4f46e5)과 같은 계열. 어두운 표지·구분·정리, 흰 본문 */
const C = {
  navy: "1E1B4B", indigo: "4F46E5", indigoSoft: "EEF2FF", ink: "0F172A", ink2: "334155", gray: "64748B",
  line: "E2E8F0", white: "FFFFFF", green: "059669", greenSoft: "ECFDF5", red: "DC2626", redSoft: "FEF2F2",
  amber: "D97706", amberSoft: "FFFBEB", code: "0B1020", codeText: "E5E7EB", codeKw: "93C5FD", codeStr: "FCD34D",
};
const KO = "Malgun Gothic";
const MONO = "Courier New";

/* ── 슬라이드 조각 ─────────────────────────────────────── */
const T = (slide, text, o) => slide.addText(text, { isTextBox: true, fontFace: KO, margin: 0, ...o });

function chip(s, text, x, y, w, h = 0.6, size = 20) {
  s.addShape("roundRect", { x, y, w, h, fill: { color: C.indigo }, line: { color: C.indigo }, rectRadius: 0.12 });
  T(s, text, { x, y, w, h, fontSize: size, bold: true, color: C.white, fontFace: MONO, align: "center", valign: "middle" });
}
function head(s, title, no) {
  s.background = { color: C.white };
  T(s, typeof no === "number" ? `${no}차시` : String(no), { x: 0.5, y: 0.35, w: 3, h: 0.3, fontSize: 11, bold: true, color: C.indigo, charSpacing: 2 });
  T(s, title, { x: 0.5, y: 0.6, w: 9, h: 0.7, fontSize: 28, bold: true, color: C.ink });
}
function pageNo(s, i, n) { T(s, `${i} / ${n}`, { x: 8.7, y: 5.2, w: 0.8, h: 0.25, fontSize: 9, color: C.gray, align: "right" }); }

const KW = /\b(for|in|if|elif|else|while|break|continue|def|return|print|range|enumerate|len|sum|int|float|type|import|as|True|False|None)\b/g;
/* 글자 크기는 상자에 맞춘다 — 줄 수가 적은 상자가 비어 보이지 않게. 최대 16pt, 가로도 넘치지 않는 크기로 */
function fitSize(code, w, h, max = 16) {
  const lines = code.split("\n");
  const longest = Math.max(...lines.map((l) => [...l].reduce((n, ch) => n + (/[가-힣]/.test(ch) ? 2.1 : 1), 0)));
  const byH = ((h - 0.28) * 72) / (lines.length * 1.32);
  const byW = ((w - 0.4) * 72) / (longest * 0.7);
  return Math.max(8, Math.min(max, byH, byW));
}
function codeBlock(s, code, x, y, w, h, size = 12) {
  size = Math.max(size, fitSize(code, w, h, 16));
  s.addShape("roundRect", { x, y, w, h, fill: { color: C.code }, line: { color: C.code }, rectRadius: 0.08 });
  const runs = [];
  const lines = code.split("\n");
  lines.forEach((ln, li) => {
    const parts = ln.split(/('[^']*'|f'[^']*'|#.*$)/);
    parts.forEach((pt) => {
      if (!pt) return;
      if (/^f?'/.test(pt)) { runs.push({ text: pt, options: { color: C.codeStr } }); return; }
      if (/^#/.test(pt)) { runs.push({ text: pt, options: { color: "94A3B8" } }); return; }
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
function card(s, x, y, w, h, { title, body, tone = "indigo" }) {
  const fill = { indigo: C.indigoSoft, green: C.greenSoft, red: C.redSoft, amber: C.amberSoft, gray: "F8FAFC" }[tone];
  const ink = { indigo: C.indigo, green: C.green, red: C.red, amber: C.amber, gray: C.ink2 }[tone];
  s.addShape("roundRect", { x, y, w, h, fill: { color: fill }, line: { color: fill }, rectRadius: 0.1 });
  T(s, title, { x: x + 0.25, y: y + 0.18, w: w - 0.5, h: 0.4, fontSize: 15, bold: true, color: ink });
  if (body) T(s, body, { x: x + 0.25, y: y + 0.6, w: w - 0.5, h: h - 0.75, fontSize: 12.5, color: C.ink2, valign: "top", lineSpacingMultiple: 1.25 });
}
function numberRow(s, items, y, dh = 1.55) {
  const n = items.length, gap = 0.25, w = (9 - gap * (n - 1)) / n;
  items.forEach((it, i) => {
    const x = 0.5 + i * (w + gap);
    s.addShape("ellipse", { x, y, w: 0.45, h: 0.45, fill: { color: C.indigo }, line: { color: C.indigo } });
    T(s, String(i + 1), { x, y, w: 0.45, h: 0.45, fontSize: 14, bold: true, color: C.white, align: "center", valign: "middle" });
    T(s, it.t, { x: x + 0.6, y, w: w - 0.6, h: 0.45, fontSize: 14, bold: true, color: C.ink, valign: "middle" });
    T(s, it.d, { x, y: y + 0.55, w, h: dh, fontSize: 12, color: C.ink2, valign: "top", lineSpacingMultiple: 1.2 });
  });
}
function quizRows(s, qs, y0 = 3.35, gap = 0.9) {
  qs.forEach((q, k) => {
    const y = y0 + k * gap;
    s.addShape("roundRect", { x: 0.5, y, w: 9, h: gap - 0.1, fill: { color: "F8FAFC" }, line: { color: C.line }, rectRadius: 0.08 });
    T(s, `Q${k + 1}`, { x: 0.7, y: y + 0.1, w: 0.6, h: 0.3, fontSize: 13, bold: true, color: C.indigo });
    T(s, q.q, { x: 1.3, y: y + 0.1, w: 8, h: 0.3, fontSize: 13, bold: true, color: C.ink, fontFace: q.mono ? MONO : KO });
    T(s, q.a, { x: 1.3, y: y + 0.42, w: 8, h: 0.3, fontSize: 12, color: C.green });
  });
}
/* 실습 안내 + 퀴즈 한 장. 앱의 3단계 이름을 그대로 쓴다 */
function practiceSlide(s, no, steps, qs, minutes = 10) {
  head(s, `실습 — 앱 ${no}차시 (${minutes}분) · 확인 퀴즈`, no);
  numberRow(s, [
    { t: "STEP 1 코드 소환", d: steps[0] },
    { t: "STEP 2 파라미터 적용", d: steps[1] },
    { t: "STEP 3 실행 · 차트", d: steps[2] },
  ], 1.5, 1.6);
  quizRows(s, qs, 3.35, 0.9);
}

/* ── 덱 골격 ───────────────────────────────────────────── */
/* 슬라이드는 먼저 함수로 모아 두고(총 장수를 알아야 쪽 번호를 찍는다) 마지막에 한 번에 그린다 */
function makeDeck(partNo, partTitle, partSub, sessions) {
  const p = new PptxGenJS();
  p.layout = "LAYOUT_16x9";
  p.author = "정지원";
  const plan = [];

  /* 파트 표지 */
  plan.push((s) => {
    s.background = { color: C.navy };
    T(s, "AICE 어소시에이트 실기 · Part 1", { x: 0.6, y: 0.6, w: 6, h: 0.4, fontSize: 14, bold: true, color: "A5B4FC", charSpacing: 2 });
    T(s, partTitle, { x: 0.6, y: 1.4, w: 8.8, h: 1.1, fontSize: 44, bold: true, color: C.white });
    T(s, partSub, { x: 0.6, y: 2.55, w: 8.8, h: 0.6, fontSize: 18, color: "C7D2FE" });
    sessions.forEach((se, i) => {
      const x = 0.6 + i * 1.76;
      s.addShape("roundRect", { x, y: 3.4, w: 1.6, h: 1.1, fill: { color: "312E81" }, line: { color: "4338CA" }, rectRadius: 0.1 });
      T(s, `${se.no}차시`, { x: x + 0.12, y: 3.48, w: 1.4, h: 0.3, fontSize: 11, bold: true, color: "A5B4FC" });
      T(s, `${se.funcs[0]}\n${se.funcs[1]}`, { x: x + 0.12, y: 3.78, w: 1.4, h: 0.68, fontSize: 12, bold: true, color: C.white, fontFace: MONO, valign: "top" });
    });
    T(s, "흥해공고 · 강사 정지원", { x: 0.6, y: 4.9, w: 8.8, h: 0.3, fontSize: 11, color: "818CF8" });
  });

  /* 파트 개요 */
  plan.push((s, i, n) => {
    head(s, `${partTitle} — 다섯 차시 한눈에`, `Part ${partNo}`); pageNo(s, i, n);
    sessions.forEach((se, k) => {
      const y = 1.45 + k * 0.72;
      s.addShape("roundRect", { x: 0.5, y, w: 9, h: 0.62, fill: { color: k % 2 ? C.white : "F8FAFC" }, line: { color: C.line }, rectRadius: 0.08 });
      T(s, `${se.no}차시`, { x: 0.7, y, w: 0.9, h: 0.62, fontSize: 12, bold: true, color: C.indigo, valign: "middle" });
      T(s, se.title, { x: 1.6, y, w: 3.6, h: 0.62, fontSize: 14, bold: true, color: C.ink, valign: "middle" });
      T(s, `${se.funcs[0]}  ·  ${se.funcs[1]}`, { x: 5.2, y, w: 2.3, h: 0.62, fontSize: 11.5, color: C.ink2, fontFace: MONO, valign: "middle" });
      T(s, se.aice, { x: 7.5, y, w: 1.9, h: 0.62, fontSize: 10.5, color: C.gray, valign: "middle" });
    });
    T(s, "차시마다: 개념 두 개 → 비교 → 흔한 실수 → 실기 패턴 → 앱 실습(10분) → 퀴즈", { x: 0.5, y: 5.1, w: 8, h: 0.3, fontSize: 10.5, color: C.gray });
  });

  for (const se of sessions) {
    /* 차시 구분 */
    plan.push((s, i, n) => {
      s.background = { color: C.navy };
      T(s, `${se.no}차시`, { x: 0.6, y: 0.6, w: 3, h: 0.4, fontSize: 14, bold: true, color: "A5B4FC", charSpacing: 2 });
      T(s, se.title, { x: 0.6, y: 1.5, w: 8.8, h: 1.2, fontSize: 40, bold: true, color: C.white });
      T(s, se.sub, { x: 0.6, y: 2.75, w: 8.8, h: 0.6, fontSize: 18, color: "C7D2FE" });
      chip(s, se.funcs[0], 0.6, 3.7, 2.6); T(s, "vs", { x: 3.35, y: 3.7, w: 0.5, h: 0.6, fontSize: 18, color: "A5B4FC", align: "center", valign: "middle" });
      chip(s, se.funcs[1], 3.95, 3.7, 2.6);
      T(s, `${i} / ${n}`, { x: 8.7, y: 5.2, w: 0.8, h: 0.25, fontSize: 9, color: "6366F1", align: "right" });
      if (se.note) s.addNotes(se.note);
    });
    se.slides.forEach((fn) => plan.push((s, i, n) => { fn(s); pageNo(s, i, n); }));
    /* 차시 정리 */
    plan.push((s, i, n) => {
      s.background = { color: C.navy };
      T(s, `${se.no}차시 정리`, { x: 0.6, y: 0.5, w: 3, h: 0.3, fontSize: 11, bold: true, color: "A5B4FC", charSpacing: 2 });
      T(s, se.wrapTitle, { x: 0.6, y: 0.85, w: 8.8, h: 0.7, fontSize: 26, bold: true, color: C.white });
      se.wrap.forEach((pt, k) => {
        const y = 1.85 + k * 0.75;
        s.addShape("ellipse", { x: 0.6, y: y + 0.05, w: 0.4, h: 0.4, fill: { color: C.indigo }, line: { color: C.indigo } });
        T(s, String(k + 1), { x: 0.6, y: y + 0.05, w: 0.4, h: 0.4, fontSize: 13, bold: true, color: C.white, align: "center", valign: "middle" });
        T(s, pt, { x: 1.15, y, w: 8.2, h: 0.55, fontSize: 15, color: "E0E7FF", valign: "middle" });
      });
      T(s, `다음 → ${se.next}`, { x: 0.6, y: 4.85, w: 8, h: 0.35, fontSize: 12, color: "818CF8" });
      T(s, `${i} / ${n}`, { x: 8.7, y: 5.2, w: 0.8, h: 0.25, fontSize: 9, color: "6366F1", align: "right" });
    });
  }

  const n = plan.length;
  plan.forEach((fn, k) => fn(p.addSlide(), k + 1, n));
  return { p, n };
}

/* ═══════════════ 차시 데이터 ═══════════════ */
const S = {};

S[1] = {
  no: 1, title: "화면 출력과 자료형 검사", sub: "화면에 내보내는 print, 종류를 확인하는 type — 개발자의 평생 짝꿍", funcs: ["print()", "type()"],
  aice: "디버깅 출력", note: "도입: 컴퓨터는 글자인지 숫자인지 모르면 멍때린다. 오늘은 '보여주기'와 '확인하기' 두 동작.",
  slides: [
    (s) => { head(s, "오늘 배우면 AICE에서 이렇게 쓴다", 1);
      card(s, 0.5, 1.5, 4.35, 1.6, { title: "중간 결과 확인", body: "전처리 한 단계마다 print(df.shape) 로 행·열 수를 찍어 본다. 실기 정답 코드의 절반은 print 다." });
      card(s, 5.15, 1.5, 4.35, 1.6, { title: "자료형 진단", body: "type(x) 로 글자인지 숫자인지 먼저 본다. '100' 과 100 은 다른 것." });
      card(s, 0.5, 3.3, 9, 1.7, { tone: "amber", title: "오늘 막을 사고", body: "숫자처럼 보이는데 글자(str)인 데이터로 계산하면 '100' + '100' = '100100'. 에러조차 안 나고 조용히 틀린다. type 으로 잡는다." }); },
    (s) => { head(s, "print() — 화면에 보여준다", 1);
      codeBlock(s, "name = 'AI 도전자 홍길동'\nprint('도전자:', name)\nprint('도전자:', name, sep='-')\nprint('도전자:', name, end='!\\n')", 0.5, 1.5, 5.6, 2.1, 12.5);
      outBlock(s, "도전자: AI 도전자 홍길동\n도전자:-AI 도전자 홍길동\n도전자: AI 도전자 홍길동!", 0.5, 3.75, 5.6, 1.35, 11);
      card(s, 6.35, 1.5, 3.15, 3.6, { title: "기억할 것", body: "• 쉼표로 여러 개를 한 줄에\n• sep = 사이에 끼울 기호 (기본은 띄어쓰기)\n• end = 끝에 붙일 기호 (기본은 줄바꿈 \\n)\n• 따옴표 안은 글자 그대로, 밖은 변수" }); },
    (s) => { head(s, "type() — 무슨 종류인지 알려준다", 1);
      codeBlock(s, "print(type('100'))\nprint(type(100))\nprint(type(3.14))\nprint(type([1, 2, 3]))\nprint(type(True))", 0.5, 1.5, 5.6, 2.1, 12.5);
      outBlock(s, "<class 'str'>\n<class 'int'>\n<class 'float'>\n<class 'list'>\n<class 'bool'>", 0.5, 3.75, 5.6, 1.35, 10.5);
      card(s, 6.35, 1.5, 3.15, 3.6, { tone: "green", title: "다섯 가지만 외우기", body: "str 글자\nint 정수\nfloat 소수\nlist 목록\nbool 참/거짓\n\n따옴표가 있으면 무조건 str." }); },
    (s) => { head(s, "같은 100, 다른 종류", 1);
      codeBlock(s, "a = '100'\nb = 100\nprint(a + a)   # '100100'\nprint(b + b)   # 200", 0.5, 1.5, 4.35, 1.7, 12.5);
      codeBlock(s, "print(type(a))  # <class 'str'>\nprint(type(b))  # <class 'int'>\nprint(a == b)   # False", 5.15, 1.5, 4.35, 1.7, 12.5);
      card(s, 0.5, 3.4, 4.35, 1.7, { tone: "red", title: "글자 100 은 '이어 붙이기'", body: "+ 가 덧셈이 아니라 연결이 된다. 에러가 안 나서 더 위험하다." });
      card(s, 5.15, 3.4, 4.35, 1.7, { tone: "green", title: "숫자 100 은 '더하기'", body: "계산하려면 숫자여야 한다. 다음 차시에서 글자를 숫자로 바꾸는 int·float 를 배운다." }); },
    (s) => { head(s, "흔한 실수 3가지", 1);
      numberRow(s, [
        { t: "따옴표 짝 안 맞음", d: "print('안녕) → SyntaxError. 여는 따옴표와 닫는 따옴표는 같은 종류로." },
        { t: "변수를 따옴표 안에", d: "print('name') 은 글자 name 을 찍는다. 변수 값을 찍으려면 print(name)." },
        { t: "대문자 Print", d: "파이썬은 대소문자를 구분한다. Print, PRINT 는 없는 이름 → NameError." },
      ], 1.6);
      codeBlock(s, "name = '홍길동'\nprint('name')   # name\nprint(name)     # 홍길동", 0.5, 3.4, 9, 1.7, 12.5); },
    (s) => { head(s, "AICE 실기 패턴 — 단계마다 찍어서 확인", 1);
      codeBlock(s, "raw = '85'\nprint('원본:', raw, type(raw))       # 들어온 게 뭔지\nvalue = int(raw)\nprint('변환:', value, type(value))   # 바꾼 게 맞는지\nprint('계산:', value + 15)", 0.5, 1.5, 5.6, 2.3, 12);
      outBlock(s, "원본: 85 <class 'str'>\n변환: 85 <class 'int'>\n계산: 100", 0.5, 3.95, 5.6, 1.15, 11);
      card(s, 6.35, 1.5, 3.15, 3.6, { title: "왜 이렇게 하나", body: "실기 채점은 결과만 본다. 중간에 어디서 틀렸는지는 print 로 내가 찾아야 한다.\n\n값과 type 을 나란히 찍는 습관이 시간을 아낀다." }); },
    (s) => practiceSlide(s, 1, [
      "「print() 기본 문장 생성」 버튼 → 닉네임을 sep·end 와 함께 찍고 type 을 확인하는 코드가 나타난다.",
      "닉네임을 바꾸고, sep(- ★ : /)과 end(! 完 ^^) 를 골라 「파라미터 적용」. 출력 줄이 어떻게 달라질지 먼저 말한다.",
      "「파이프라인 실행」 → 터미널에 실제 출력 두 줄이 찍히고, print 가 찍은 글자 수 막대가 뜬다. sep·end 를 바꾸면 막대가 변한다.",
    ], [
      { q: "print('a', 'b', sep='-') 의 출력은?", a: "답: a-b", mono: true },
      { q: "type('3.14') 는 float 인가?", a: "답: 아니오 — 따옴표가 있으니 str" },
    ]),
  ],
  wrapTitle: "print 로 보여주고, type 으로 확인한다",
  wrap: ["print(a, b, sep=, end=) — 쉼표로 여러 개, sep 은 사이, end 는 끝", "type(x) — str · int · float · list · bool 다섯 가지", "따옴표가 있으면 글자. '100' + '100' 은 '100100'", "실기 습관: 단계마다 print(값, type(값))"],
  next: "2차시 int() vs float() — 글자를 숫자로",
};

S[2] = {
  no: 2, title: "정수와 소수점 변환", sub: "글자 '100' 을 계산 가능한 숫자로 — 딱딱한 int, 둥둥 뜨는 float", funcs: ["int()", "float()"],
  aice: "수치형 변환", note: "1차시 끝에서 본 '100100' 사고를 해결하는 차시.",
  slides: [
    (s) => { head(s, "오늘 배우면 AICE에서 이렇게 쓴다", 2);
      card(s, 0.5, 1.5, 4.35, 1.6, { title: "입력값을 숫자로", body: "CSV 에서 읽은 '85' 는 글자다. int('85') 로 바꿔야 평균을 낼 수 있다." });
      card(s, 5.15, 1.5, 4.35, 1.6, { title: "정밀도 맞추기", body: "나눗셈·비율은 float. 개수·순번은 int. 모델은 대부분 float 를 받는다." });
      card(s, 0.5, 3.3, 9, 1.7, { tone: "amber", title: "오늘 막을 사고", body: "int('3.5') 는 ValueError 로 죽는다. 소수점이 있는 글자는 float 로 먼저 바꾸고, 정수가 필요하면 int(float('3.5')) 두 단계." }); },
    (s) => { head(s, "int() — 소수점 없는 정수로", 2);
      codeBlock(s, "raw_val = '85'\nint_val = int(raw_val)\nprint(int_val + 15)      # 100\nprint(int(3.99))         # 3  ← 반올림이 아니라 버림", 0.5, 1.5, 5.6, 2.1, 12.5);
      outBlock(s, "100\n3", 0.5, 3.75, 5.6, 1.35, 11);
      card(s, 6.35, 1.5, 3.15, 3.6, { title: "기억할 것", body: "• 글자 → 정수: int('85')\n• 소수 → 정수: int(3.99) 는 3 (버림)\n• 반올림은 round(3.99) → 4\n• int('3.5') 는 에러" }); },
    (s) => { head(s, "float() — 소수점이 있는 실수로", 2);
      codeBlock(s, "raw_val = '85'\nfloat_val = float(raw_val) + 0.5\nprint(float_val)         # 85.5\nprint(float('3.5'))      # 3.5\nprint(10 / 4)            # 2.5  ← 나눗셈은 항상 float", 0.5, 1.5, 5.6, 2.1, 12.5);
      outBlock(s, "85.5\n3.5\n2.5", 0.5, 3.75, 5.6, 1.35, 11);
      card(s, 6.35, 1.5, 3.15, 3.6, { tone: "green", title: "기억할 것", body: "• 글자 → 실수: float('3.5')\n• 정수 → 실수: float(85) 는 85.0\n• / 나눗셈 결과는 언제나 float\n• // 는 몫(정수), % 는 나머지" }); },
    (s) => { head(s, "원시값 → int → float, 나란히", 2);
      codeBlock(s, "raw_val = '85'\nint_val = int(raw_val)\nfloat_val = float(raw_val) + 0.5\nprint('정수 변환:', int_val, '소수 변환:', float_val)\nprint(type(raw_val), type(int_val), type(float_val))", 0.5, 1.5, 9, 1.9, 12.5);
      outBlock(s, "정수 변환: 85 소수 변환: 85.5\n<class 'str'> <class 'int'> <class 'float'>", 0.5, 3.55, 9, 0.9, 11);
      T(s, "앱 2차시 STEP 1 에서 조립되는 코드가 이것이다. 원시값을 고르고 가산 소수를 바꾸면 세 막대가 어떻게 변하는지 본다.", { x: 0.5, y: 4.6, w: 9, h: 0.5, fontSize: 12.5, color: C.ink2 }); },
    (s) => { head(s, "흔한 실수 3가지", 2);
      numberRow(s, [
        { t: "int('3.5')", d: "소수점 글자는 int 로 바로 못 바꾼다. float 로 먼저 → int(float('3.5')) = 3." },
        { t: "int 는 반올림이 아니다", d: "int(3.99) = 3. 반올림은 round(). 점수 계산에서 1점이 사라진다." },
        { t: "숫자 아닌 글자", d: "int('85점') → ValueError. 단위·공백을 먼저 떼야 한다: int('85점'.replace('점', ''))." },
      ], 1.6);
      codeBlock(s, "print(int(float('3.5')))   # 3\nprint(round(3.5), round(3.49))   # 4 3", 0.5, 3.4, 9, 1.7, 12.5); },
    (s) => { head(s, "AICE 실기 패턴 — 문자 열을 숫자 열로", 2);
      codeBlock(s, "scores = ['80', '90', '75']         # CSV 에서 읽으면 이렇게 글자로 온다\nnums = []\nfor s in scores:\n    nums.append(int(s))\nprint(nums, sum(nums))", 0.5, 1.5, 5.6, 2.2, 12);
      outBlock(s, "[80, 90, 75] 245", 0.5, 3.85, 5.6, 0.8, 11);
      card(s, 6.35, 1.5, 3.15, 3.15, { title: "판다스에서는", body: "df['score'] = df['score'].astype(int)\n\n한 줄로 열 전체를 바꾼다. 원리는 오늘 배운 int 와 같다." }); },
    (s) => practiceSlide(s, 2, [
      "「형변환 기본 연산식 조립」 버튼 → 원시 글자 값을 int 와 float 로 바꿔 찍는 코드가 나타난다.",
      "원시값(85·100·45·60)과 가산 소수(0.1~0.9)를 고르고 「파라미터 적용」. float 결과가 몇이 될지 먼저 말한다.",
      "「파이프라인 실행」 → 원시값 · int · float 세 막대. float 막대만 가산 소수만큼 높다.",
    ], [
      { q: "int('7.9') 의 결과는?", a: "답: ValueError — float('7.9') 로 먼저", mono: true },
      { q: "int(7.9) 와 round(7.9) 는?", a: "답: 7 과 8", mono: true },
    ]),
  ],
  wrapTitle: "계산하려면 숫자여야 한다 — int 와 float",
  wrap: ["int('85') — 글자를 정수로. int(3.99) 는 3 (버림)", "float('3.5') — 글자를 실수로. 나눗셈 결과는 항상 float", "int('3.5') 는 에러 — float 를 거친다", "실기 패턴: 반복문 안 nums.append(int(s)), 판다스는 astype(int)"],
  next: "3차시 sum() vs len() — 총합과 개수로 평균 내기",
};

S[3] = {
  no: 3, title: "데이터 총합과 개수 측정", sub: "총점을 사람 수로 나누면 평균 — sum 과 len 한 줄", funcs: ["sum()", "len()"],
  aice: "평균 공식", note: "평균 = 총합 / 개수. 판다스 mean() 의 속을 보는 차시.",
  slides: [
    (s) => { head(s, "오늘 배우면 AICE에서 이렇게 쓴다", 3);
      card(s, 0.5, 1.5, 4.35, 1.6, { title: "평균 계산", body: "avg = sum(data) / len(data). 판다스 mean() 이 속으로 하는 일이 이것." });
      card(s, 5.15, 1.5, 4.35, 1.6, { title: "데이터 크기 확인", body: "len(df) 는 행 수. 분할·삭제 뒤에 몇 개 남았는지 len 으로 센다." });
      card(s, 0.5, 3.3, 9, 1.7, { tone: "amber", title: "오늘 막을 사고", body: "빈 리스트의 평균 → len 이 0 이라 ZeroDivisionError. 결측치를 다 지운 뒤 평균을 내면 자주 터진다. 개수를 먼저 확인." }); },
    (s) => { head(s, "sum() — 몽땅 더한다", 3);
      codeBlock(s, "scores = [80, 90, 75, 95]\ntotal = sum(scores)\nprint('총점:', total)\nprint(sum([1.5, 2.5]))      # 소수도 된다\nprint(sum(['a', 'b']))      # 글자는 에러", 0.5, 1.5, 5.6, 2.1, 12.5);
      outBlock(s, "총점: 340\n4.0\nTypeError: unsupported operand …", 0.5, 3.75, 5.6, 1.35, 10.5);
      card(s, 6.35, 1.5, 3.15, 3.6, { title: "기억할 것", body: "• 리스트(숫자) 를 받아 합을 돌려준다\n• 글자 리스트는 못 더한다\n• 2차시 int 변환이 먼저인 이유" }); },
    (s) => { head(s, "len() — 알맹이 개수를 센다", 3);
      codeBlock(s, "scores = [80, 90, 75, 95]\nprint(len(scores))      # 4\nprint(len('hello'))     # 5  ← 글자 수\nprint(len([]))          # 0", 0.5, 1.5, 5.6, 2.1, 12.5);
      outBlock(s, "4\n5\n0", 0.5, 3.75, 5.6, 1.35, 11);
      card(s, 6.35, 1.5, 3.15, 3.6, { tone: "green", title: "기억할 것", body: "• 리스트·글자·표 무엇이든 '몇 개' 를 센다\n• 빈 것은 0\n• len(df) 는 행 수, len(df.columns) 는 열 수" }); },
    (s) => { head(s, "평균 공식 — 앱 3차시 코드", 3);
      codeBlock(s, "scores = [80, 90, 75, 95]\ntotal = sum(scores)\ncount = len(scores)\naverage = total / count\nprint(f'총점: {total}, 개수: {count}, 평균: {average:.1f}')", 0.5, 1.5, 5.6, 2.2, 12.5);
      outBlock(s, "총점: 340, 개수: 4, 평균: 85.0", 0.5, 3.85, 5.6, 0.8, 11);
      card(s, 6.35, 1.5, 3.15, 3.15, { title: "f-string 읽기", body: "f'…{변수}…' — 중괄호 안 변수가 값으로 바뀐다.\n{average:.1f} 는 소수 첫째 자리까지." }); },
    (s) => { head(s, "흔한 실수 3가지", 3);
      numberRow(s, [
        { t: "0 으로 나누기", d: "빈 리스트는 len 이 0 → ZeroDivisionError. if len(data) > 0: 을 앞에 둔다." },
        { t: "글자 섞인 리스트", d: "['80', 90] 처럼 하나라도 글자면 sum 이 TypeError. 전부 int 로 먼저." },
        { t: "len 대신 count", d: "count 는 '특정 값이 몇 번' 이다. 전체 개수는 len." },
      ], 1.6);
      codeBlock(s, "data = []\nif len(data) > 0:\n    print(sum(data) / len(data))\nelse:\n    print('데이터 없음')", 0.5, 3.4, 9, 1.7, 12); },
    (s) => { head(s, "AICE 실기 패턴 — 판다스 mean() 과 같은 답", 3);
      codeBlock(s, "import pandas as pd\ndf = pd.DataFrame({'score': [80, 90, 75, 95]})\n\nprint(sum(df['score']) / len(df['score']))   # 85.0  직접\nprint(df['score'].mean())                    # 85.0  판다스", 0.5, 1.5, 5.6, 2.2, 12);
      outBlock(s, "85.0\n85.0", 0.5, 3.85, 5.6, 0.9, 11);
      card(s, 6.35, 1.5, 3.15, 3.25, { title: "왜 둘 다 아나", body: "실기에서는 mean() 을 쓴다. 하지만 결측치가 섞이면 mean() 은 자동으로 빼고 계산하고, sum/len 은 NaN 이 된다. 차이를 알아야 결측치 차시가 이해된다." }); },
    (s) => practiceSlide(s, 3, [
      "「sum() & len() 평균 공식 조립」 버튼 → 점수 네 개의 총점·개수·평균을 찍는 코드가 나타난다.",
      "마지막 시험 보너스 점수(50~100)를 슬라이더로 정하고 「파라미터 적용」. 평균이 오를지 내릴지 먼저 말한다.",
      "「파이프라인 실행」 → 점수 막대 네 개와 빨간 평균선(sum ÷ len). 보너스를 50 으로 내리면 선이 얼마로 내려오는지 확인.",
    ], [
      { q: "sum([1, 2, 3]) / len([1, 2, 3]) 은?", a: "답: 2.0 (나눗셈이라 float)", mono: true },
      { q: "len('AICE') 는?", a: "답: 4", mono: true },
    ]),
  ],
  wrapTitle: "평균 = sum ÷ len",
  wrap: ["sum(리스트) — 숫자만 더한다. 글자가 섞이면 에러", "len(무엇이든) — 개수. 빈 것은 0", "빈 리스트 평균은 ZeroDivisionError — len 먼저 확인", "실기 패턴: df['열'].mean() 이 같은 일을 한다"],
  next: "4차시 range() vs enumerate() — 범위 만들기와 순번 붙이기",
};

S[4] = {
  no: 4, title: "연속 범위 생성과 순번 매기기", sub: "1부터 100까지 손으로 안 친다 — range 로 뽑고 enumerate 로 번호표", funcs: ["range()", "enumerate()"],
  aice: "에포크 반복", note: "8차시 반복문의 재료. range 의 세 파라미터를 오늘 확실히.",
  slides: [
    (s) => { head(s, "오늘 배우면 AICE에서 이렇게 쓴다", 4);
      card(s, 0.5, 1.5, 4.35, 1.6, { title: "에포크 반복", body: "for epoch in range(1, 11): — 딥러닝 학습 10회. range 가 없으면 반복문이 없다." });
      card(s, 5.15, 1.5, 4.35, 1.6, { title: "인덱스 + 값 동시에", body: "for i, col in enumerate(df.columns): — 몇 번째 열인지와 열 이름을 같이 받는다." });
      card(s, 0.5, 3.3, 9, 1.7, { tone: "amber", title: "오늘 막을 사고", body: "range(1, 10) 은 9까지다. 끝 숫자는 빠진다. '10번 돌렸는데 9번만 돈다' 의 원인 1위." }); },
    (s) => { head(s, "range(start, stop, step) — 숫자를 뽑는다", 4);
      codeBlock(s, "print(list(range(5)))          # [0, 1, 2, 3, 4]\nprint(list(range(1, 6)))       # [1, 2, 3, 4, 5]\nprint(list(range(1, 10, 3)))   # [1, 4, 7]\nprint(list(range(10, 0, -2)))  # [10, 8, 6, 4, 2]", 0.5, 1.5, 5.6, 2.1, 12.5);
      outBlock(s, "[0, 1, 2, 3, 4]\n[1, 2, 3, 4, 5]\n[1, 4, 7]\n[10, 8, 6, 4, 2]", 0.5, 3.75, 5.6, 1.35, 10.5);
      card(s, 6.35, 1.5, 3.15, 3.6, { title: "기억할 것", body: "• 하나만 쓰면 0부터 그 앞까지\n• 둘이면 start 부터 stop 앞까지\n• 셋째는 간격(step). 음수면 거꾸로\n• stop 은 절대 포함 안 됨" }); },
    (s) => { head(s, "enumerate() — 번호표를 붙여 준다", 4);
      codeBlock(s, "items = ['롤', '배그', '발로란트', '오버워치']\nfor idx, item in enumerate(items, start=1):\n    print(f'{idx}위 종목: {item}')", 0.5, 1.5, 5.6, 1.7, 12.5);
      outBlock(s, "1위 종목: 롤\n2위 종목: 배그\n3위 종목: 발로란트\n4위 종목: 오버워치", 0.5, 3.35, 5.6, 1.75, 11);
      card(s, 6.35, 1.5, 3.15, 3.6, { tone: "green", title: "기억할 것", body: "• (번호, 값) 두 개를 한꺼번에 받는다\n• start= 로 첫 번호를 정한다 (기본 0)\n• 번호는 항상 1씩 — step 은 없다\n• 순번이 필요한 반복은 전부 enumerate" }); },
    (s) => { head(s, "range 와 enumerate 는 하는 일이 다르다", 4);
      codeBlock(s, "# 숫자만 필요할 때\nfor n in range(1, 4):\n    print(n)        # 1 2 3", 0.5, 1.5, 4.35, 1.7, 12.5);
      codeBlock(s, "# 목록의 값 + 순번이 필요할 때\nfor i, x in enumerate(['a', 'b']):\n    print(i, x)     # 0 a / 1 b", 5.15, 1.5, 4.35, 1.7, 12.5);
      card(s, 0.5, 3.4, 4.35, 1.7, { title: "range = 숫자 공장", body: "start·stop·step 을 내가 정한다. 에포크, 횟수, 인덱스 번호." });
      card(s, 5.15, 3.4, 4.35, 1.7, { tone: "green", title: "enumerate = 번호표 기계", body: "이미 있는 목록에 0, 1, 2… 를 붙여 준다. start 만 정할 수 있다." }); },
    (s) => { head(s, "흔한 실수 3가지", 4);
      numberRow(s, [
        { t: "끝 숫자 포함이라 착각", d: "range(1, 10) 은 9까지. 10까지 원하면 range(1, 11)." },
        { t: "range 에 소수", d: "range(0, 1, 0.1) 은 TypeError. 정수만 된다. 소수 간격은 넘파이 np.arange." },
        { t: "enumerate 순서 바꿈", d: "for item, idx in enumerate(…) 라고 쓰면 이름만 바뀐 것. 첫 번째가 번호, 두 번째가 값." },
      ], 1.6);
      codeBlock(s, "for i in range(1, 11):    # 1 ~ 10, 열 번\n    pass\nfor idx, x in enumerate(['a']):   # idx 가 번호", 0.5, 3.4, 9, 1.7, 12.5); },
    (s) => { head(s, "AICE 실기 패턴 — 열 번호와 이름을 같이", 4);
      codeBlock(s, "cols = ['age', 'income', 'score', 'churn']\nfor i, col in enumerate(cols):\n    print(i, col)\n\nfor epoch in range(1, 4):\n    print(f'epoch {epoch}/3 학습 중')", 0.5, 1.5, 5.6, 2.4, 12);
      outBlock(s, "0 age\n1 income\n2 score\n3 churn\nepoch 1/3 학습 중\nepoch 2/3 학습 중\nepoch 3/3 학습 중", 0.5, 4.05, 5.6, 1.1, 9);
      card(s, 6.35, 1.5, 3.15, 3.65, { title: "어디서 다시 나오나", body: "8차시 반복문·break 가 range 위에서 돈다.\n45차시 딥러닝 에포크가 정확히 이 모양이다." }); },
    (s) => practiceSlide(s, 4, [
      "「range & enumerate 루프 조립」 버튼 → 종목 4개에 순번을 붙이는 enumerate 문과 range 문이 나타난다.",
      "순번 시작 번호표(1·0·10)와 반복 증가 간격(1~3)을 고르고 「파라미터 적용」. enumerate 줄과 range 줄 중 어느 게 바뀌는지 본다.",
      "「파이프라인 실행」 → 진한 막대 = enumerate 순번(1씩), 연한 막대 = range 값(step씩). step 을 3 으로 올리면 연한 막대만 벌어진다.",
    ], [
      { q: "list(range(2, 8, 2)) 는?", a: "답: [2, 4, 6]", mono: true },
      { q: "enumerate(['x','y'], start=5) 의 첫 번호는?", a: "답: 5", mono: true },
    ]),
  ],
  wrapTitle: "range 는 숫자를 만들고, enumerate 는 번호표를 붙인다",
  wrap: ["range(start, stop, step) — stop 은 빠진다. 정수만", "enumerate(목록, start=) — (번호, 값) 쌍. 번호는 1씩", "10번 돌리려면 range(1, 11) 또는 range(10)", "실기 패턴: for epoch in range(n), for i, col in enumerate(cols)"],
  next: "5차시 if-elif vs else — 조건에 따라 갈라지기",
};

S[5] = {
  no: 5, title: "조건문과 다중 분기", sub: "90점 이상은 다이아, 70점은 골드, 나머지는 브론즈 — 분류의 첫걸음", funcs: ["if-elif", "else"],
  aice: "파생변수 범주화", note: "AI 가 데이터를 분류(Classification)하는 원리를 손으로 해 보는 차시.",
  slides: [
    (s) => { head(s, "오늘 배우면 AICE에서 이렇게 쓴다", 5);
      card(s, 0.5, 1.5, 4.35, 1.6, { title: "파생변수 만들기", body: "점수 → 등급, 나이 → 연령대. 커트라인으로 데이터를 묶는 게 if-elif-else 다." });
      card(s, 5.15, 1.5, 4.35, 1.6, { title: "분류 모델의 원리", body: "'확률 0.5 이상이면 승리' — 모델이 하는 판정도 결국 if 하나다." });
      card(s, 0.5, 3.3, 9, 1.7, { tone: "amber", title: "오늘 막을 사고", body: "조건 순서를 잘못 쓰면 첫 조건에서 다 걸린다. if score >= 70 을 먼저 쓰면 95점도 GOLD 가 된다. 높은 기준부터." }); },
    (s) => { head(s, "if — 조건이 참이면 실행", 5);
      codeBlock(s, "score = 85\nif score >= 80:\n    print('합격')\nprint('끝')        # 들여쓰기 밖 → 항상 실행", 0.5, 1.5, 5.6, 1.9, 12.5);
      outBlock(s, "합격\n끝", 0.5, 3.55, 5.6, 1.0, 11);
      card(s, 6.35, 1.5, 3.15, 3.05, { title: "기억할 것", body: "• 조건 끝에 콜론(:)\n• 실행할 줄은 4칸 들여쓰기\n• 비교: >= <= == != > <\n• 같다는 = 가 아니라 ==" }); },
    (s) => { head(s, "elif · else — 여러 갈래로", 5);
      codeBlock(s, "score = 85\nif score >= 90:\n    tier = 'CHALLENGER (최상위)'\nelif score >= 70:\n    tier = 'GOLD (우수)'\nelse:\n    tier = 'BRONZE (기초)'\nprint('최종 판정 티어:', tier)", 0.5, 1.5, 5.6, 2.6, 12.5);
      outBlock(s, "최종 판정 티어: GOLD (우수)", 0.5, 4.25, 5.6, 0.8, 11);
      card(s, 6.35, 1.5, 3.15, 3.55, { tone: "green", title: "기억할 것", body: "• 위에서부터 차례로 검사, 처음 참인 곳 하나만 실행\n• elif 는 몇 개든\n• else 는 '나머지 전부', 조건 없음\n• 85 는 90 미만이라 두 번째로" }); },
    (s) => { head(s, "순서가 답을 바꾼다", 5);
      codeBlock(s, "score = 95\nif score >= 70:       # 먼저 걸린다\n    tier = 'GOLD'\nelif score >= 90:     # 여기 못 온다\n    tier = 'CHALLENGER'\nprint(tier)           # GOLD  ← 틀림", 0.5, 1.5, 4.35, 2.7, 12.5);
      codeBlock(s, "score = 95\nif score >= 90:       # 높은 기준 먼저\n    tier = 'CHALLENGER'\nelif score >= 70:\n    tier = 'GOLD'\nprint(tier)           # CHALLENGER", 5.15, 1.5, 4.35, 2.7, 12.5);
      card(s, 0.5, 4.35, 4.35, 0.75, { tone: "red", title: "낮은 기준이 먼저 → 다 거기서 멈춤", body: null });
      card(s, 5.15, 4.35, 4.35, 0.75, { tone: "green", title: "높은 기준부터 내려온다", body: null }); },
    (s) => { head(s, "흔한 실수 3가지", 5);
      numberRow(s, [
        { t: "= 과 == 혼동", d: "if score = 90: 은 SyntaxError. 비교는 == 두 개. 하나는 '넣어라'." },
        { t: "콜론·들여쓰기 누락", d: "if score >= 90 (콜론 없음) → 에러. 아래 줄 들여쓰기 없음 → 항상 실행." },
        { t: "else 에 조건", d: "else score < 70: 은 에러. else 는 조건이 없다. 조건이 있으면 elif." },
      ], 1.6);
      codeBlock(s, "if score == 90:      # 비교\n    grade = 'A'      # 대입\nelse:                # 조건 없음", 0.5, 3.4, 9, 1.7, 12.5); },
    (s) => { head(s, "AICE 실기 패턴 — 등급 열 만들기", 5);
      codeBlock(s, "def to_tier(score):\n    if score >= 90:\n        return 'CHALLENGER'\n    elif score >= 70:\n        return 'GOLD'\n    else:\n        return 'BRONZE'\n\ndf['tier'] = df['score'].apply(to_tier)", 0.5, 1.5, 5.6, 2.9, 12);
      card(s, 6.35, 1.5, 3.15, 2.9, { title: "9차시에서 완성", body: "오늘의 if-elif-else 를 함수(def)로 싸서 apply 에 넘기면 열 전체가 등급으로 바뀐다. 실기 파생변수 문제의 정석." });
      T(s, "지금은 if-elif-else 세 줄의 순서만 정확히. def 와 apply 는 9차시.", { x: 0.5, y: 4.55, w: 9, h: 0.4, fontSize: 12.5, color: C.ink2 }); },
    (s) => practiceSlide(s, 5, [
      "「조건 분기 티어 판정기 조립」 버튼 → 점수를 세 등급으로 나누는 if-elif-else 코드가 나타난다.",
      "내 점수(30~100)와 커트라인 두 개(if 90·85·80, elif 70·60·50)를 고르고 「파라미터 적용」. 어느 등급이 될지 먼저 말한다.",
      "「파이프라인 실행」 → 내 점수 막대와 커트라인 두 줄. 초록 줄(if) 위면 CHALLENGER, 파란 줄(elif) 위면 GOLD. 커트라인을 낮추면 같은 점수가 등급이 오른다.",
    ], [
      { q: "score=70, if >=90 / elif >=70 / else 이면?", a: "답: elif 에 걸려 GOLD (70 은 70 이상)" },
      { q: "if x = 5: 가 안 되는 이유는?", a: "답: 비교는 == 이어야 한다" },
    ]),
  ],
  wrapTitle: "위에서부터 검사, 처음 참인 곳 하나만",
  wrap: ["if 조건: / elif 조건: / else: — 콜론과 들여쓰기", "높은 기준부터 쓴다. 낮은 기준이 먼저면 다 거기서 멈춘다", "== 는 비교, = 는 대입. else 에는 조건이 없다", "실기 패턴: 함수로 싸서 df['열'].apply(함수) — 9차시"],
  next: "파이썬 기초 2 — 6차시 append() vs extend()",
};

S[6] = {
  no: 6, title: "리스트 단일 추가 vs 묶음 확장", sub: "가방에 아이템 하나 넣기 vs 박스째 쏟아붓기", funcs: ["append()", "extend()"],
  aice: "점수 누적", note: "도입 1분: '가방에 사과 1개 vs 사과 박스' 비유. 오늘 목표는 리스트 안에 리스트가 들어가는 사고를 막는 것.",
  slides: [
    (s) => { head(s, "오늘 배우면 AICE에서 이렇게 쓴다", 6);
      card(s, 0.5, 1.5, 4.35, 1.6, { title: "교차검증 점수 누적", body: "for 반복문 안에서 scores.append(score) — 실기 정답 코드에 그대로 나오는 패턴" });
      card(s, 5.15, 1.5, 4.35, 1.6, { title: "결측치 대체 목록 합치기", body: "여러 컬럼 이름 리스트를 하나로 — cols.extend(more_cols)" });
      card(s, 0.5, 3.3, 9, 1.7, { tone: "amber", title: "오늘 막을 사고", body: "append(리스트) 를 쓰면 리스트 안에 리스트가 통째로 들어간다. 나중에 len() 이나 인덱스가 전부 어긋난다 — 실기에서 가장 흔한 오답 원인." }); },
    (s) => { head(s, "append() — 아이템 하나를 원소로 덧붙인다", 6);
      codeBlock(s, "inventory = ['기본검', '물약']\ninventory.append('전설의활')\nprint(inventory)\nprint(len(inventory))", 0.5, 1.5, 5.2, 2.2, 13);
      outBlock(s, "['기본검', '물약', '전설의활']\n3", 0.5, 3.85, 5.2, 1.2);
      card(s, 5.95, 1.5, 3.55, 3.55, { title: "기억할 것", body: "• 괄호 안의 것이 통째로 원소 1개가 된다\n• 그래서 len 은 딱 1 늘어난다\n• 리스트를 넣으면 리스트가 원소가 된다\n  → [1, 2, [3, 4]]  (중첩!)" }); },
    (s) => { head(s, "extend() — 다른 리스트의 알맹이를 꺼내 붙인다", 6);
      codeBlock(s, "inventory = ['기본검', '물약']\ninventory.extend(['보석_1', '보석_2'])\nprint(inventory)\nprint(len(inventory))", 0.5, 1.5, 5.2, 2.2, 13);
      outBlock(s, "['기본검', '물약', '보석_1', '보석_2']\n4", 0.5, 3.85, 5.2, 1.2);
      card(s, 5.95, 1.5, 3.55, 3.55, { tone: "green", title: "기억할 것", body: "• 괄호 안은 반드시 '여러 개' (리스트·튜플·문자열)\n• 알맹이 개수만큼 len 이 늘어난다\n• 문자열을 넣으면 글자 하나하나가 들어간다\n  extend('abc') → 'a', 'b', 'c'  (주의!)" }); },
    (s) => { head(s, "같은 재료, 다른 결과 — 나란히 비교", 6);
      codeBlock(s, "a = [1, 2]\na.append([3, 4])\nprint(a)      # [1, 2, [3, 4]]\nprint(len(a)) # 3", 0.5, 1.5, 4.35, 1.9, 12.5);
      codeBlock(s, "b = [1, 2]\nb.extend([3, 4])\nprint(b)      # [1, 2, 3, 4]\nprint(len(b)) # 4", 5.15, 1.5, 4.35, 1.9, 12.5);
      card(s, 0.5, 3.6, 4.35, 1.5, { tone: "red", title: "append → 중첩 리스트", body: "3번째 원소가 [3, 4] 라는 '리스트 한 덩어리'. a[2][0] 처럼 두 번 파고 들어가야 3이 나온다." });
      card(s, 5.15, 3.6, 4.35, 1.5, { tone: "green", title: "extend → 평평한 리스트", body: "3, 4 가 각각 원소. 실기에서 원하는 모양은 거의 항상 이쪽." }); },
    (s) => { head(s, "흔한 실수 3가지", 6);
      numberRow(s, [
        { t: "append 에 리스트", d: "scores.append([90, 85]) → 원소가 1개(리스트)로 들어감. 두 점수를 각각 넣고 싶으면 extend." },
        { t: "extend 에 문자열", d: "names.extend('철수') → '철', '수' 로 쪼개짐. 이름 하나는 append('철수')." },
        { t: "결과를 변수에 받기", d: "x = a.append(1) 은 x 가 None. 두 함수 모두 리스트를 '제자리에서' 바꾸고 아무것도 돌려주지 않는다." },
      ], 1.6);
      codeBlock(s, "x = scores.append(90)\nprint(x)   # None  ← 이미 scores 가 바뀌었다", 0.5, 3.45, 9, 1.5, 13); },
    (s) => { head(s, "AICE 실기 패턴 — 교차검증 점수 모으기", 6);
      codeBlock(s, "scores = []\nfor fold in range(5):\n    score = 80 + fold * 2    # 폴드별 점수\n    scores.append(score)\nprint(scores)\nprint('평균:', sum(scores) / len(scores))", 0.5, 1.5, 5.6, 2.45, 12.5);
      outBlock(s, "[80, 82, 84, 86, 88]\n평균: 84.0", 0.5, 4.1, 5.6, 1.05, 11);
      card(s, 6.35, 1.5, 3.15, 3.65, { title: "왜 append 인가", body: "반복마다 점수가 '하나' 나온다. 하나씩 덧붙이니 append.\n\n반대로 두 실험의 점수 리스트를 합칠 때는 all_scores.extend(scores)." }); },
    (s) => practiceSlide(s, 6, [
      "「append & extend 리스트 조립」 버튼을 누르면 코드가 나타난다. 다섯 줄을 소리 내어 읽는다.",
      "append 로 넣을 단일 템(전설의활·마법지팡이·방패)과 extend 박스 알맹이 수(1~4)를 고르고 「파라미터 적용」. 코드가 바뀌는 걸 본다.",
      "「파이프라인 실행」 → 막대 셋: 기본 2 → append 후 3 → extend 후 3+박스 수. 누르기 전에 마지막 숫자를 먼저 말해 보기.",
    ], [
      { q: "a = [1]; a.append([2, 3]); len(a) 는?", a: "답: 2 — [1, [2, 3]]", mono: true },
      { q: "이름 하나를 추가할 때 append 와 extend 중?", a: "답: append('이름'). extend 는 글자를 쪼갠다." },
    ]),
  ],
  wrapTitle: "append 는 하나, extend 는 알맹이 전부",
  wrap: ["append(x) — x 가 통째로 원소 1개. len +1", "extend(리스트) — 알맹이가 각각 원소. len +N", "둘 다 돌려주는 값은 None — 결과를 변수에 받지 않는다", "실기 패턴: 반복문 안 scores.append(score)"],
  next: "7차시 pop() vs remove() — 순번으로 꺼내기 vs 이름으로 삭제",
};

S[7] = {
  no: 7, title: "순번으로 꺼내기 vs 이름으로 삭제", sub: "'맨 뒤에 있는 놈 나와' vs '어뷰저 삭제해'", funcs: ["pop()", "remove()"],
  aice: "라벨 열 분리", note: "도입: 대기열(큐) 비유. 번호표로 부르는 것과 이름으로 부르는 것의 차이.",
  slides: [
    (s) => { head(s, "오늘 배우면 AICE에서 이렇게 쓴다", 7);
      card(s, 0.5, 1.5, 4.35, 1.6, { title: "마지막 열(정답 라벨) 떼어내기", body: "cols = list(df.columns); target = cols.pop(-1) — 실기에서 빈출하는 정답 코드" });
      card(s, 5.15, 1.5, 4.35, 1.6, { title: "쓸모없는 컬럼 이름 빼기", body: "features.remove('id') — 이름을 알 때는 remove 가 한 줄" });
      card(s, 0.5, 3.3, 9, 1.7, { tone: "amber", title: "오늘 막을 사고", body: "없는 값을 remove 하면 ValueError 로 프로그램이 멈춘다. 지우기 전에 'in' 으로 있는지 확인하는 습관." }); },
    (s) => { head(s, "pop(인덱스) — 위치로 꺼내고, 꺼낸 값을 돌려준다", 7);
      codeBlock(s, "queue = ['유저A', '유저B', '유저C', '어뷰저', '유저D']\nout_user = queue.pop(-1)\nprint('꺼낸 값:', out_user)\nprint('남은 큐:', queue)", 0.5, 1.5, 5.6, 2.1, 12.5);
      outBlock(s, "꺼낸 값: 유저D\n남은 큐: ['유저A', '유저B', '유저C', '어뷰저']", 0.5, 3.75, 5.6, 1.3, 11);
      card(s, 6.35, 1.5, 3.15, 3.55, { title: "기억할 것", body: "• 괄호 안은 '몇 번째' — 0부터 센다\n• -1 은 맨 뒤, 비우면 맨 뒤\n• 꺼낸 값을 변수에 받을 수 있다 (remove 와 가장 큰 차이)\n• 인덱스가 범위를 벗어나면 IndexError" }); },
    (s) => { head(s, "remove(값) — 이름으로 찾아 첫 번째 것을 지운다", 7);
      codeBlock(s, "queue = ['유저A', '유저B', '유저C', '어뷰저', '유저D']\nqueue.remove('어뷰저')\nprint('정제 후:', queue)", 0.5, 1.5, 5.6, 1.7, 12.5);
      outBlock(s, "정제 후: ['유저A', '유저B', '유저C', '유저D']", 0.5, 3.35, 5.6, 0.8, 11);
      codeBlock(s, "queue.remove('없는유저')\n# ValueError: list.remove(x): x not in list", 0.5, 4.3, 5.6, 0.85, 11.5);
      card(s, 6.35, 1.5, 3.15, 3.65, { tone: "green", title: "기억할 것", body: "• 괄호 안은 '값' 자체\n• 같은 값이 여러 개면 맨 앞 하나만\n• 돌려주는 값은 None\n• 없는 값이면 ValueError → 먼저\n  if '어뷰저' in queue: 로 확인" }); },
    (s) => { head(s, "한눈에 비교", 7);
      const rows = [["", "pop(i)", "remove(x)", "del lst[i]"], ["무엇으로 찾나", "위치(인덱스)", "값", "위치(인덱스)"], ["돌려주는 값", "꺼낸 원소", "None", "없음 (문장)"], ["없을 때", "IndexError", "ValueError", "IndexError"], ["실기 쓰임", "cols.pop(-1)", "cols.remove('id')", "del cols[0]"]];
      s.addTable(rows.map((r, ri) => r.map((c, ci) => ({ text: c, options: { bold: ri === 0 || ci === 0, fill: { color: ri === 0 ? C.indigoSoft : (ri % 2 ? "F8FAFC" : C.white) }, color: ri === 0 ? C.indigo : C.ink, fontFace: ri > 0 && ci > 0 ? MONO : KO, fontSize: 12.5, align: ci === 0 ? "left" : "center", valign: "middle" } }))),
        { x: 0.5, y: 1.5, w: 9, colW: [2, 2.33, 2.33, 2.34], rowH: 0.5, border: { type: "solid", color: C.line, pt: 0.75 } });
      card(s, 0.5, 4.2, 9, 0.9, { tone: "amber", title: "한 줄 요약: 값을 '받아서 쓰려면' pop, 그냥 '없애려면' remove", body: null }); },
    (s) => { head(s, "흔한 실수 3가지", 7);
      numberRow(s, [
        { t: "이미 꺼낸 걸 또 지움", d: "pop(1) 로 '유저B' 를 꺼낸 뒤 remove('유저B') → ValueError. 순서를 바꾸거나 in 으로 확인." },
        { t: "remove 결과를 변수에", d: "x = lst.remove('a') → x 는 None. 값이 필요하면 pop 을 쓴다." },
        { t: "반복문 안에서 지우기", d: "for x in lst: lst.remove(x) 는 원소를 건너뛴다. 새 리스트를 만들거나 복사본으로 돈다." },
      ], 1.6);
      codeBlock(s, "target = '어뷰저'\nif target in queue:\n    queue.remove(target)\nelse:\n    print('이미 없음')", 0.5, 3.4, 9, 1.7, 12); },
    (s) => { head(s, "AICE 실기 패턴 — 정답 라벨 떼어내기", 7);
      codeBlock(s, "cols = ['age', 'income', 'score', 'churn']   # df.columns 라고 치자\ntarget = cols.pop(-1)     # 마지막 열 = 정답(y)\nfeatures = cols           # 나머지 = 입력(X)\nprint('y:', target)\nprint('X:', features)", 0.5, 1.5, 5.6, 2.4, 12.5);
      outBlock(s, "y: churn\nX: ['age', 'income', 'score']", 0.5, 4.05, 5.6, 1.05, 11);
      card(s, 6.35, 1.5, 3.15, 3.6, { title: "왜 pop 인가", body: "정답 열 이름을 '받아서' 뒤에 y = df[target] 로 써야 하니까. remove 는 이름을 돌려주지 않는다." }); },
    (s) => practiceSlide(s, 7, [
      "「pop & remove 삭제 파이프라인 조립」 버튼 → 큐 5명에서 pop 한 명, remove 한 명 하는 코드가 나타난다.",
      "pop 인덱스(맨 앞·맨 뒤·세 번째)와 remove 대상(어뷰저·유저B)을 고르고 「파라미터 적용」. 남을 큐를 먼저 종이에 적는다.",
      "「파이프라인 실행」 → 다섯 막대 중 주황 = pop 으로 꺼낸 사람, 빨강 = remove 로 지운 사람. 종이와 맞는지 확인.",
    ], [
      { q: "lst = [5, 6, 7]; v = lst.pop(0); v 와 lst 는?", a: "답: v = 5, lst = [6, 7]", mono: true },
      { q: "lst = [1, 2, 1]; lst.remove(1); lst 는?", a: "답: [2, 1] — 맨 앞 하나만 지운다", mono: true },
    ]),
  ],
  wrapTitle: "값이 필요하면 pop, 없애기만 하면 remove",
  wrap: ["pop(i) — 위치로 꺼내고 그 값을 돌려준다. -1 은 맨 뒤", "remove(x) — 값으로 찾아 맨 앞 하나를 지운다. None 을 돌려준다", "없는 값 remove → ValueError. 먼저 if x in lst 로 확인", "실기 패턴: target = cols.pop(-1) 로 정답 열 분리"],
  next: "8차시 for / while vs break — 반복 루프와 탈출 조건문",
};

S[8] = {
  no: 8, title: "반복 루프와 탈출 조건문", sub: "정해진 횟수만큼 도는 for, 조건이 끝날 때까지 도는 while, 그리고 안전벨트 break", funcs: ["for / while", "break"],
  aice: "에포크·얼리스탑", note: "도입: 딥러닝 학습은 '반복'이다. 에포크(epoch) 라는 말을 오늘 처음 소개. 얼리스탑 = break.",
  slides: [
    (s) => { head(s, "오늘 배우면 AICE에서 이렇게 쓴다", 8);
      card(s, 0.5, 1.5, 4.35, 1.6, { title: "에포크 반복", body: "모델 학습은 같은 데이터를 여러 번(epoch) 돈다. for epoch in range(n) 이 그 뼈대" });
      card(s, 5.15, 1.5, 4.35, 1.6, { title: "얼리스탑(EarlyStopping)", body: "손실이 더 안 줄면 멈춘다 — 조건을 보고 break 하는 것과 같은 원리" });
      card(s, 0.5, 3.3, 9, 1.7, { tone: "amber", title: "오늘 막을 사고", body: "끝나는 조건이 없는 while 은 영원히 돈다(무한 루프). 노트북이 멈추면 대부분 이것. 조건 변수를 반드시 바꾸거나 break 를 둔다." }); },
    (s) => { head(s, "for — 정해진 범위를 한 바퀴씩", 8);
      codeBlock(s, "for epoch in range(1, 4):\n    print(f'학습 중... epoch {epoch}')\nprint('끝')", 0.5, 1.5, 5.6, 1.6, 13);
      outBlock(s, "학습 중... epoch 1\n학습 중... epoch 2\n학습 중... epoch 3\n끝", 0.5, 3.25, 5.6, 1.5, 11);
      card(s, 6.35, 1.5, 3.15, 3.25, { title: "기억할 것", body: "• range(1, 4) 는 1, 2, 3 — 끝 숫자는 빠진다\n• 몇 번 돌지 '미리' 안다\n• 들여쓰기된 줄만 반복된다\n• 리스트도 바로 돌 수 있다\n  for x in [10, 20, 30]:" }); },
    (s) => { head(s, "while — 조건이 참인 동안 계속", 8);
      codeBlock(s, "loss = 1.0\nepoch = 0\nwhile loss > 0.3:\n    epoch += 1\n    loss = loss * 0.7   # 30%씩 감소\n    print(f'epoch {epoch}: loss {loss:.2f}')\nprint('목표 도달')", 0.5, 1.5, 5.6, 2.1, 12);
      outBlock(s, "epoch 1: loss 0.70\nepoch 2: loss 0.49\nepoch 3: loss 0.34\nepoch 4: loss 0.24\n목표 도달", 0.5, 3.7, 5.6, 1.45, 10);
      card(s, 6.35, 1.5, 3.15, 3.65, { tone: "green", title: "기억할 것", body: "• 몇 번 돌지 '모를 때' 쓴다\n• 조건이 거짓이 되는 순간 빠져나온다\n• 안에서 조건 변수(loss)가 바뀌어야 한다 — 안 바뀌면 무한 루프\n• for 보다 위험하니 실기에선 for 가 기본" }); },
    (s) => { head(s, "break — 조건을 만나면 즉시 탈출", 8);
      codeBlock(s, "max_epoch = 16\nstop_point = 7\nfor epoch in range(1, max_epoch + 1):\n    if epoch == stop_point:\n        print(f'조기 종료! (epoch {epoch}에서 break)')\n        break\n    print(f'정상 학습 중... epoch {epoch}')", 0.5, 1.5, 5.6, 2.3, 12);
      outBlock(s, "정상 학습 중... epoch 1\n…\n정상 학습 중... epoch 6\n조기 종료! (epoch 7에서 break)", 0.5, 3.9, 5.6, 1.25, 10);
      card(s, 6.35, 1.5, 3.15, 3.65, { tone: "red", title: "기억할 것", body: "• 16번 돌 계획이었지만 7에서 끝\n• break 아래 줄은 그 바퀴에서 실행 안 됨\n• 가장 안쪽 반복문 하나만 빠져나온다\n• 짝: continue — 이번 바퀴만 건너뛰고 계속" }); },
    (s) => { head(s, "break vs continue — 헷갈리는 짝", 8);
      codeBlock(s, "for n in range(1, 6):\n    if n == 3:\n        break\n    print(n)\n# 1 2  ← 3에서 완전히 멈춤", 0.5, 1.5, 4.35, 1.9, 12.5);
      codeBlock(s, "for n in range(1, 6):\n    if n == 3:\n        continue\n    print(n)\n# 1 2 4 5  ← 3만 건너뜀", 5.15, 1.5, 4.35, 1.9, 12.5);
      card(s, 0.5, 3.6, 4.35, 1.5, { tone: "red", title: "break = 반복문 종료", body: "얼리스탑, '찾았으니 그만', 오류가 나면 중단" });
      card(s, 5.15, 3.6, 4.35, 1.5, { tone: "green", title: "continue = 이번 바퀴만 패스", body: "결측치 행 건너뛰기, 조건에 안 맞는 데이터 무시" }); },
    (s) => { head(s, "흔한 실수 3가지", 8);
      numberRow(s, [
        { t: "range 끝 숫자", d: "range(1, 10) 은 9까지. 10번 돌리려면 range(1, 11) 또는 range(10)." },
        { t: "무한 루프", d: "while True: 안에 break 가 없거나, 조건 변수를 안 바꾸면 영원히 돈다. 노트북 ■ 버튼으로 중단." },
        { t: "들여쓰기", d: "반복할 줄은 4칸 들여쓰기. 한 줄이라도 빠지면 반복문 밖에서 한 번만 실행된다." },
      ], 1.6);
      codeBlock(s, "n = 0\nwhile n < 3:\n    print(n)\n    # n += 1 을 잊으면 0이 무한히 찍힌다", 0.5, 3.4, 9, 1.7, 12); },
    (s) => practiceSlide(s, 8, [
      "「반복문 & 탈출 조건식 조립」 버튼 → max_epoch 와 stop_point 가 든 for 문이 나타난다.",
      "최대 반복 수(10~20)와 조기 탈출 기준(4~12)을 슬라이더로 정하고 「파라미터 적용」. '정상 학습 중' 이 몇 줄 찍힐지 먼저 말한다 (기준 − 1).",
      "「파이프라인 실행」 → 점선 = 원래 계획한 횟수, 파란 막대 = 실제 돈 횟수, 빨간 막대 = break 가 걸린 회차.",
    ], [
      { q: "for i in range(3): print(i) 의 출력은?", a: "답: 0 1 2 — 0부터, 3은 빠진다", mono: true },
      { q: "break 와 continue 중 '이번 바퀴만 건너뛰기' 는?", a: "답: continue" },
    ]),
  ],
  wrapTitle: "횟수를 알면 for, 모르면 while, 멈출 조건은 break",
  wrap: ["for x in range(n) — n번, 끝 숫자는 빠진다", "while 조건: — 조건이 거짓이 될 때까지. 조건 변수를 꼭 바꾼다", "break — 즉시 탈출 (얼리스탑), continue — 이번 바퀴만 건너뜀", "실기 패턴: for epoch in range(epochs) 로 학습 반복"],
  next: "9차시 def vs return — 사용자 정의 함수와 결과 반환",
};

S[9] = {
  no: 9, title: "사용자 정의 함수와 결과 반환", sub: "공식을 자판기로 만드는 def, 결과를 뱉어내는 return", funcs: ["def", "return"],
  aice: "apply 전처리", note: "도입: 자판기 비유 — 동전(입력)을 넣으면 콜라(출력). 같은 계산을 100번 하면 함수로 만든다.",
  slides: [
    (s) => { head(s, "오늘 배우면 AICE에서 이렇게 쓴다", 9);
      card(s, 0.5, 1.5, 4.35, 1.6, { title: "열 전체에 내 규칙 적용", body: "df['등급'] = df['점수'].apply(my_func) — 함수를 만들어 두면 판다스가 한 줄씩 넣어 준다" });
      card(s, 5.15, 1.5, 4.35, 1.6, { title: "전처리 함수 재사용", body: "훈련 데이터와 시험 데이터에 똑같은 전처리 — 함수 하나를 두 번 부른다" });
      card(s, 0.5, 3.3, 9, 1.7, { tone: "amber", title: "오늘 막을 사고", body: "return 을 빼먹으면 함수가 None 을 돌려준다. apply 결과 열이 전부 None 이면 십중팔구 이것." }); },
    (s) => { head(s, "def — 규칙에 이름을 붙인다", 9);
      codeBlock(s, "def calculate_price(price, tax_rate=0.1):\n    tax = price * tax_rate\n    total = price + tax\n    return price, tax, total\n\nbase, vat, final_price = calculate_price(25000)\nprint(f'원가:{base}원, 세금:{vat}원 -> 최종:{final_price}원')", 0.5, 1.5, 5.6, 2.6, 12);
      outBlock(s, "원가:25000원, 세금:2500.0원 -> 최종:27500.0원", 0.5, 4.25, 5.6, 0.8, 11);
      card(s, 6.35, 1.5, 3.15, 3.55, { title: "구조 읽기", body: "• def 이름(입력들):\n• 안쪽은 들여쓰기\n• tax_rate=0.1 은 기본값 — 안 주면 0.1\n• 정의만 해선 안 돌아간다. 이름(값) 으로 '불러야' 실행" }); },
    (s) => { head(s, "return — 계산 결과를 밖으로 보낸다", 9);
      codeBlock(s, "def grade(score):\n    if score >= 90:\n        return 'A'\n    return 'B'        # 위 return 에서 끝났으면 여기 안 옴\n\nprint(grade(95), grade(70))", 0.5, 1.5, 4.35, 2.2, 12);
      outBlock(s, "A B", 0.5, 3.85, 4.35, 0.7, 11);
      codeBlock(s, "def grade_bad(score):\n    if score >= 90:\n        result = 'A'\n    # return 이 없다!\n\nprint(grade_bad(95))   # None", 5.15, 1.5, 4.35, 2.2, 12);
      outBlock(s, "None", 5.15, 3.85, 4.35, 0.7, 11);
      card(s, 0.5, 4.7, 9, 0.5, { tone: "red", title: "return 을 만나는 순간 함수는 끝난다 · return 이 없으면 None", body: null }); },
    (s) => { head(s, "여러 값 돌려주기와 받기", 9);
      codeBlock(s, "def stats(nums):\n    return min(nums), max(nums), sum(nums) / len(nums)\n\nlo, hi, avg = stats([80, 90, 75])   # 세 칸으로 받기\nprint(lo, hi, avg)\n\nresult = stats([80, 90, 75])        # 튜플로 받기\nprint(result, result[2])", 0.5, 1.5, 5.6, 2.6, 11.5);
      outBlock(s, "75 90 81.66666666666667\n(75, 90, 81.66666666666667) 81.66666666666667", 0.5, 4.2, 5.6, 0.95, 10);
      card(s, 6.35, 1.5, 3.15, 3.65, { tone: "green", title: "기억할 것", body: "• return a, b, c 는 튜플 하나를 돌려준다\n• 받는 쪽 변수 개수를 맞추면 한 번에 풀린다\n• 개수가 다르면 ValueError\n• 9차시 앱 코드의 base, vat, final_price 가 이 형태" }); },
    (s) => { head(s, "AICE 실기 패턴 — apply 로 열 전체에 적용", 9);
      codeBlock(s, "import pandas as pd\ndf = pd.DataFrame({'score': [95, 82, 67]})\n\ndef to_tier(score):\n    if score >= 90:\n        return 'CHALLENGER'\n    elif score >= 70:\n        return 'GOLD'\n    return 'BRONZE'\n\ndf['tier'] = df['score'].apply(to_tier)\nprint(df)", 0.5, 1.5, 5.6, 3.6, 11.5);
      outBlock(s, "   score        tier\n0     95  CHALLENGER\n1     82        GOLD\n2     67      BRONZE", 6.35, 1.5, 3.15, 1.5, 10);
      card(s, 6.35, 3.15, 3.15, 1.95, { title: "5차시 + 9차시", body: "if-elif-else 로 판정하던 걸 함수로 싸서 apply 에 넘긴다. 실기 파생변수 문제의 정석." }); },
    (s) => { head(s, "흔한 실수 3가지", 9);
      numberRow(s, [
        { t: "return 대신 print", d: "print 는 화면에 보여줄 뿐 값을 돌려주지 않는다. apply 에 쓰면 열이 None 으로 찬다." },
        { t: "정의만 하고 안 부름", d: "def 만 쓰면 아무 일도 안 일어난다. 이름(값) 으로 호출해야 실행." },
        { t: "괄호 빼먹기", d: "df['score'].apply(to_tier()) 처럼 괄호를 붙이면 결과값을 넘기게 됨. 함수 이름만 넘긴다." },
      ], 1.6);
      codeBlock(s, "def f(x):\n    print(x * 2)      # 화면에만 나옴\nv = f(3)\nprint(v)              # None", 0.5, 3.4, 9, 1.7, 12); },
    (s) => practiceSlide(s, 9, [
      "「def & return 커스텀 계산기 조립」 버튼 → calculate_price 함수 정의와 호출 코드가 나타난다.",
      "기본 원가(10000·25000·50000)와 세율(0.05~0.20)을 고르고 「파라미터 적용」. 최종 금액을 먼저 암산한다 (원가 × (1+세율)).",
      "「파이프라인 실행」 → 원가 + 세금 = 최종 결제액 막대. 암산과 같은지, 세율을 바꾸면 세금 막대만 변하는지 본다.",
    ], [
      { q: "def f(): x = 1  →  print(f()) 의 출력은?", a: "답: None — return 이 없다", mono: true },
      { q: "return a, b 를 받을 때 변수는 몇 개?", a: "답: 2개 (또는 튜플 하나로)" },
    ]),
  ],
  wrapTitle: "def 로 규칙을 만들고, return 으로 값을 돌려준다",
  wrap: ["def 이름(입력, 기본값=…): — 정의. 호출해야 실행된다", "return 값 — 함수를 끝내고 값을 돌려준다. 없으면 None", "return a, b, c — 튜플. 받는 변수 개수를 맞춘다", "실기 패턴: df['열'].apply(내함수) — 괄호 없이 이름만"],
  next: "10차시 np.array() vs reshape() — 넘파이 배열과 차원",
};

S[10] = {
  no: 10, title: "넘파이 배열 생성과 차원 변경", sub: "리스트는 AI 가 읽기엔 느리다 — 넘파이로 행렬을 만들고 reshape 으로 모양을 바꾼다", funcs: ["np.array()", "reshape()"],
  aice: "입력 차원 맞추기", note: "Part 1 마지막. 리스트 → 배열 → 2차원. fit 에러의 90% 가 차원 문제라는 걸 심어 준다.",
  slides: [
    (s) => { head(s, "오늘 배우면 AICE에서 이렇게 쓴다", 10);
      card(s, 0.5, 1.5, 4.35, 1.6, { title: "모델 입력은 2차원", body: "sklearn 의 fit(X, y) 는 X 가 (행, 열) 2차원이어야 한다. 1차원이면 에러." });
      card(s, 5.15, 1.5, 4.35, 1.6, { title: "reshape(-1, 1)", body: "열이 하나뿐인 데이터를 2차원으로 — X.values.reshape(-1, 1). 실기 빈출 정답 한 줄." });
      card(s, 0.5, 3.3, 9, 1.7, { tone: "amber", title: "오늘 막을 사고", body: "ValueError: Expected 2D array, got 1D array instead — 에러 메시지에 답이 있다. reshape(-1, 1) 로 차원을 맞춘다. 6개를 (4, 2) 로 바꾸려 하면 개수가 안 맞아 또 에러." }); },
    (s) => { head(s, "np.array() — 리스트를 넘파이 배열로", 10);
      codeBlock(s, "import numpy as np\narr1d = np.array([10, 20, 30, 40, 50, 60])\nprint(arr1d)\nprint(arr1d.shape)      # (6,)  ← 1차원, 6개\nprint(arr1d * 2)        # 전체에 한 번에 계산", 0.5, 1.5, 5.6, 2.1, 12.5);
      outBlock(s, "[10 20 30 40 50 60]\n(6,)\n[ 20  40  60  80 100 120]", 0.5, 3.75, 5.6, 1.35, 11);
      card(s, 6.35, 1.5, 3.15, 3.6, { title: "기억할 것", body: "• import numpy as np 가 첫 줄\n• 리스트와 달리 * 2 가 원소마다 적용\n• shape 는 (행, 열) 모양. (6,) 는 1차원\n• 리스트 [1,2] * 2 는 [1,2,1,2] 였다" }); },
    (s) => { head(s, "reshape() — 개수는 그대로, 모양만 바꾼다", 10);
      codeBlock(s, "matrix = arr1d.reshape(2, 3)\nprint('1차원 원본 shape:', arr1d.shape)\nprint('변환된 2차원 shape:', matrix.shape)\nprint(matrix)", 0.5, 1.5, 5.6, 1.8, 12.5);
      outBlock(s, "1차원 원본 shape: (6,)\n변환된 2차원 shape: (2, 3)\n[[10 20 30]\n [40 50 60]]", 0.5, 3.45, 5.6, 1.65, 11);
      card(s, 6.35, 1.5, 3.15, 3.6, { tone: "green", title: "기억할 것", body: "• 2 × 3 = 6 — 곱이 원래 개수와 같아야 한다\n• (3, 2) (6, 1) (1, 6) 전부 가능\n• (4, 2) 는 8개라 에러\n• -1 을 쓰면 '알아서 계산해' — reshape(-1, 1) 은 (6, 1)" }); },
    (s) => { head(s, "같은 여섯 개, 네 가지 모양", 10);
      const shapes = [["(2, 3)", "[[10 20 30]\n [40 50 60]]", "2행 3열"], ["(3, 2)", "[[10 20]\n [30 40]\n [50 60]]", "3행 2열"], ["(6, 1)", "[[10]\n [20]\n …\n [60]]", "6행 1열 — 모델 입력"], ["(1, 6)", "[[10 20 30 40 50 60]]", "1행 6열"]];
      /* (1, 6) 은 한 줄이 길어 상자를 넓게 준다 */
      const ws = [1.85, 1.85, 1.85, 2.95]; let x = 0.5;
      shapes.forEach(([sh, m, d], i) => { const w = ws[i]; chip(s, sh, x, 1.5, w, 0.5, 15); codeBlock(s, m, x, 2.1, w, 1.7, 10); T(s, d, { x, y: 3.9, w, h: 0.4, fontSize: 12, bold: true, color: C.ink, align: "center" }); x += w + 0.2; });
      card(s, 0.5, 4.4, 9, 0.7, { tone: "amber", title: "실기에서 쓰는 건 거의 (6, 1) — 열 하나짜리 2차원. reshape(-1, 1) 로 만든다", body: null }); },
    (s) => { head(s, "흔한 실수 3가지", 10);
      numberRow(s, [
        { t: "개수 안 맞는 reshape", d: "6개를 (4, 2) 로 → ValueError: cannot reshape array of size 6 into shape (4,2). 곱을 먼저 확인." },
        { t: "리스트에 reshape", d: "[1, 2, 3].reshape(3, 1) → AttributeError. np.array 로 먼저 바꾼다." },
        { t: "shape 에 괄호", d: "arr.shape() 는 에러. shape 는 함수가 아니라 속성 — 괄호 없이 arr.shape." },
      ], 1.6);
      codeBlock(s, "X = np.array([1, 2, 3])\nprint(X.shape)                 # (3,)\nprint(X.reshape(-1, 1).shape)  # (3, 1)  ← 모델에 넣을 모양", 0.5, 3.4, 9, 1.7, 12.5); },
    (s) => { head(s, "AICE 실기 패턴 — fit 에러 한 줄로 해결", 10);
      codeBlock(s, "from sklearn.linear_model import LinearRegression\nX = df['hours'].values          # (100,)  1차원\ny = df['score'].values\n\nmodel = LinearRegression()\n# model.fit(X, y)              # ValueError: Expected 2D array\nmodel.fit(X.reshape(-1, 1), y)  # OK  (100, 1)", 0.5, 1.5, 5.6, 2.9, 11.5);
      card(s, 6.35, 1.5, 3.15, 2.9, { title: "왜 -1 인가", body: "행 수는 데이터마다 다르니 '알아서' 하라고 -1. 열은 1 로 고정.\n\n39차시 선형회귀에서 이 줄이 그대로 나온다." });
      T(s, "에러 메시지에 'Expected 2D array' 가 보이면 생각할 것 없이 reshape(-1, 1).", { x: 0.5, y: 4.55, w: 9, h: 0.4, fontSize: 12.5, color: C.ink2 }); },
    (s) => practiceSlide(s, 10, [
      "「넘파이 행렬 및 reshape 조립」 버튼 → 6개짜리 배열을 2차원으로 바꾸는 코드가 나타난다.",
      "변환할 구조((2,3)·(3,2)·(6,1)·(1,6))를 고르고 「파라미터 적용」. 행렬이 몇 행 몇 열로 찍힐지 먼저 말한다.",
      "「파이프라인 실행」 → 행 × 열 구조 차트. (6,1) 을 골라 세로로 긴 모양이 '모델 입력' 모양임을 확인.",
    ], [
      { q: "np.array([1,2,3,4]).reshape(2, 2).shape 는?", a: "답: (2, 2)", mono: true },
      { q: "6개를 reshape(4, 2) 하면?", a: "답: ValueError — 4×2=8 ≠ 6" },
    ]),
  ],
  wrapTitle: "np.array 로 배열, reshape 으로 모양 — 개수는 그대로",
  wrap: ["np.array(리스트) — 원소마다 계산되는 배열. shape 로 모양 확인", "reshape(행, 열) — 행 × 열 = 원래 개수. -1 은 자동 계산", "모델 입력은 2차원 — 1차원이면 reshape(-1, 1)", "Part 1 끝. 다음은 판다스로 진짜 데이터를 다룬다"],
  next: "Part 2. 판다스 & 정제 — 11차시 CSV 파일 로드와 결과 저장",
};

/* ═══════════════ 두 덱 ═══════════════ */
const r1 = makeDeck(1, "파이썬 기초 1", "1~5차시 · 출력과 자료형 · 숫자 변환 · 합과 개수 · 범위와 순번 · 조건문", [S[1], S[2], S[3], S[4], S[5]]);
await r1.p.writeFile({ fileName: resolve(OUT, "파이썬기초1_1-5차시.pptx") });
const r2 = makeDeck(2, "파이썬 기초 2", "6~10차시 · 리스트 추가와 삭제 · 반복과 탈출 · 함수 · 넘파이 배열", [S[6], S[7], S[8], S[9], S[10]]);
await r2.p.writeFile({ fileName: resolve(OUT, "파이썬기초2_6-10차시.pptx") });
console.log(`PPTX 2개 생성 — 기초1 ${r1.n}장 · 기초2 ${r2.n}장 → ${OUT}`);
