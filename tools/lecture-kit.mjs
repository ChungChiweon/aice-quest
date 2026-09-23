/**
 * 강의자료 PPTX 공통 조각 — 색·글꼴·코드 상자·카드·실습 장·덱 골격.
 * 차시 데이터는 make-lecture-pptx.mjs(Part 1)·lecture-part2.mjs(Part 2) 에 있다.
 */
import { createRequire } from "node:module";
import { mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const require = createRequire("file:///C:/Users/user/Documents/BusanForeign/package.json");
const PptxGenJS = require("pptxgenjs");

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const OUT = resolve(ROOT, "강의자료");
mkdirSync(OUT, { recursive: true });

/* 팔레트 — 앱(indigo 4f46e5)과 같은 계열. 어두운 표지·구분·정리, 흰 본문 */
export const C = {
  navy: "1E1B4B", indigo: "4F46E5", indigoSoft: "EEF2FF", ink: "0F172A", ink2: "334155", gray: "64748B",
  line: "E2E8F0", white: "FFFFFF", green: "059669", greenSoft: "ECFDF5", red: "DC2626", redSoft: "FEF2F2",
  amber: "D97706", amberSoft: "FFFBEB", code: "0B1020", codeText: "E5E7EB", codeKw: "93C5FD", codeStr: "FCD34D",
};
export const KO = "Malgun Gothic";
export const MONO = "Courier New";

/* ── 슬라이드 조각 ─────────────────────────────────────── */
export const T = (slide, text, o) => slide.addText(text, { isTextBox: true, fontFace: KO, margin: 0, ...o });

export function chip(s, text, x, y, w, h = 0.6, size = 20) {
  s.addShape("roundRect", { x, y, w, h, fill: { color: C.indigo }, line: { color: C.indigo }, rectRadius: 0.12 });
  T(s, text, { x, y, w, h, fontSize: Math.min(size, ((w - 0.2) * 72) / (text.length * 0.62)), bold: true, color: C.white, fontFace: MONO, align: "center", valign: "middle" });
}
export function head(s, title, no) {
  s.background = { color: C.white };
  T(s, typeof no === "number" ? `${no}차시` : String(no), { x: 0.5, y: 0.35, w: 3, h: 0.3, fontSize: 11, bold: true, color: C.indigo, charSpacing: 2 });
  T(s, title, { x: 0.5, y: 0.6, w: 9, h: 0.7, fontSize: title.length > 24 ? 23 : 28, bold: true, color: C.ink });
}
export function pageNo(s, i, n) { T(s, `${i} / ${n}`, { x: 8.7, y: 5.2, w: 0.8, h: 0.25, fontSize: 9, color: C.gray, align: "right" }); }

const KW = /\b(for|in|if|elif|else|while|break|continue|def|return|print|range|enumerate|len|sum|int|float|type|import|as|True|False|None)\b/g;
/* 글자 크기는 상자에 맞춘다 — 줄 수가 적은 상자가 비어 보이지 않게. 최대 16pt, 가로도 넘치지 않는 크기로 */
export function fitSize(code, w, h, max = 16, min = 8) {
  const lines = code.split("\n");
  const byH = ((h - 0.3) * 72) / (lines.length * 1.42);
  return Math.max(min, Math.min(max, byH, widthFit(code, w)));
}
/* 가로로 넘치지 않는 최대 글자 크기 — 한글은 라틴 두 글자 폭으로 잡는다 */
export function widthFit(code, w) {
  const longest = Math.max(...code.split("\n").map((l) => [...l].reduce((n, ch) => n + (/[가-힣]/.test(ch) ? 1.7 : 1), 0)));
  return ((w - 0.4) * 72) / (longest * 0.61);
}
export function codeBlock(s, code, x, y, w, h, size = 12) {
  size = Math.min(Math.max(size, fitSize(code, w, h, 16)), Math.max(8, widthFit(code, w)));   // 넘칠 만큼은 절대 키우지 않는다
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
export function outBlock(s, out, x, y, w, h, size = 11) {
  size = Math.min(Math.max(7, fitSize(out, w, h - 0.3, Math.max(size, 14), 7)), Math.max(7, widthFit(out, w)));   // 출력은 잘리느니 작게
  s.addShape("roundRect", { x, y, w, h, fill: { color: C.greenSoft }, line: { color: "A7F3D0" }, rectRadius: 0.08 });
  T(s, "실행 결과", { x: x + 0.18, y: y + 0.08, w: 2, h: 0.25, fontSize: 9, bold: true, color: C.green, charSpacing: 1 });
  T(s, out, { x: x + 0.18, y: y + 0.36, w: w - 0.36, h: h - 0.44, fontSize: size, fontFace: MONO, color: C.ink, valign: "top", lineSpacingMultiple: 1.15 });
}
export function card(s, x, y, w, h, { title, body, tone = "indigo" }) {
  const fill = { indigo: C.indigoSoft, green: C.greenSoft, red: C.redSoft, amber: C.amberSoft, gray: "F8FAFC" }[tone];
  const ink = { indigo: C.indigo, green: C.green, red: C.red, amber: C.amber, gray: C.ink2 }[tone];
  s.addShape("roundRect", { x, y, w, h, fill: { color: fill }, line: { color: fill }, rectRadius: 0.1 });
  T(s, title, { x: x + 0.25, y: y + 0.18, w: w - 0.5, h: 0.4, fontSize: 15, bold: true, color: ink });
  if (body) T(s, body, { x: x + 0.25, y: y + 0.6, w: w - 0.5, h: h - 0.75, fontSize: 12.5, color: C.ink2, valign: "top", lineSpacingMultiple: 1.25 });
}
export function numberRow(s, items, y, dh = 1.55) {
  const n = items.length, gap = 0.25, w = (9 - gap * (n - 1)) / n;
  items.forEach((it, i) => {
    const x = 0.5 + i * (w + gap);
    s.addShape("ellipse", { x, y, w: 0.45, h: 0.45, fill: { color: C.indigo }, line: { color: C.indigo } });
    T(s, String(i + 1), { x, y, w: 0.45, h: 0.45, fontSize: 14, bold: true, color: C.white, align: "center", valign: "middle" });
    T(s, it.t, { x: x + 0.6, y, w: w - 0.6, h: 0.45, fontSize: 14, bold: true, color: C.ink, valign: "middle" });
    T(s, it.d, { x, y: y + 0.55, w, h: dh, fontSize: 12, color: C.ink2, valign: "top", lineSpacingMultiple: 1.2 });
  });
}
export function quizRows(s, qs, y0 = 3.35, gap = 0.9) {
  qs.forEach((q, k) => {
    const y = y0 + k * gap;
    s.addShape("roundRect", { x: 0.5, y, w: 9, h: gap - 0.1, fill: { color: "F8FAFC" }, line: { color: C.line }, rectRadius: 0.08 });
    T(s, `Q${k + 1}`, { x: 0.7, y: y + 0.1, w: 0.6, h: 0.3, fontSize: 13, bold: true, color: C.indigo });
    T(s, q.q, { x: 1.3, y: y + 0.1, w: 8, h: 0.3, fontSize: 13, bold: true, color: C.ink, fontFace: q.mono ? MONO : KO });
    T(s, q.a, { x: 1.3, y: y + 0.42, w: 8, h: 0.3, fontSize: 12, color: C.green });
  });
}
/* 실습 안내 + 퀴즈 한 장. 앱의 3단계 이름을 그대로 쓴다 */
export function practiceSlide(s, no, steps, qs, minutes = 10) {
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
export function makeDeck(partNo, partTitle, partSub, sessions) {
  const p = new PptxGenJS();
  p.layout = "LAYOUT_16x9";
  p.author = "정지원";
  const plan = [];

  /* 파트 표지 */
  plan.push((s) => {
    s.background = { color: C.navy };
    T(s, `AICE 어소시에이트 실기 · Part ${partNo}`, { x: 0.6, y: 0.6, w: 6, h: 0.4, fontSize: 14, bold: true, color: "A5B4FC", charSpacing: 2 });
    T(s, partTitle, { x: 0.6, y: 1.4, w: 8.8, h: 1.1, fontSize: 44, bold: true, color: C.white });
    T(s, partSub, { x: 0.6, y: 2.55, w: 8.8, h: 0.6, fontSize: 18, color: "C7D2FE" });
    sessions.forEach((se, i) => {
      const x = 0.6 + i * 1.76;
      s.addShape("roundRect", { x, y: 3.4, w: 1.6, h: 1.1, fill: { color: "312E81" }, line: { color: "4338CA" }, rectRadius: 0.1 });
      T(s, `${se.no}차시`, { x: x + 0.12, y: 3.48, w: 1.4, h: 0.3, fontSize: 11, bold: true, color: "A5B4FC" });
      T(s, `${se.funcs[0]}\n${se.funcs[1]}`, { x: x + 0.12, y: 3.76, w: 1.42, h: 0.72, fontSize: Math.max(7.5, Math.min(11, 150 / Math.max(se.funcs[0].length, se.funcs[1].length))), bold: true, color: C.white, fontFace: MONO, valign: "top", lineSpacingMultiple: 1.05 });
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
      T(s, `${se.funcs[0]}  ·  ${se.funcs[1]}`, { x: 5.2, y, w: 2.3, h: 0.62, fontSize: 10, color: C.ink2, fontFace: MONO, valign: "middle" });
      T(s, se.aice, { x: 7.5, y, w: 1.9, h: 0.62, fontSize: 10.5, color: C.gray, valign: "middle" });
    });
    T(s, "차시마다: 개념 두 개 → 비교 → 흔한 실수 → 실기 패턴 → 앱 실습(10분) → 퀴즈", { x: 0.5, y: 5.1, w: 8, h: 0.3, fontSize: 10.5, color: C.gray });
  });

  for (const se of sessions) {
    /* 차시 구분 */
    plan.push((s, i, n) => {
      s.background = { color: C.navy };
      T(s, `${se.no}차시`, { x: 0.6, y: 0.6, w: 3, h: 0.4, fontSize: 14, bold: true, color: "A5B4FC", charSpacing: 2 });
      T(s, se.title, { x: 0.6, y: 1.5, w: 8.8, h: 1.2, fontSize: se.title.length > 15 ? 32 : 40, bold: true, color: C.white });
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
      T(s, se.wrapTitle, { x: 0.6, y: 0.85, w: 8.8, h: 0.7, fontSize: se.wrapTitle.length > 26 ? 21 : 26, bold: true, color: C.white });
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

