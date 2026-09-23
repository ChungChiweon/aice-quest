/**
 * AICE 어소시에이트 실기 — 21~30차시 강의자료 (PPTX)
 *
 *   node tools/lecture-part3.mjs
 *   → 강의자료/판다스3_21-25차시.pptx · 시각화_26-30차시.pptx
 *
 * 21~25 는 Part 2 후반(인코딩·스케일링·집계·정렬), 26~30 은 Part 3 EDA 시각화.
 * 예제 표는 Part 2 와 같은 다섯 줄(티어·포지션·승률·골드)로 통일해 실행 결과가 정확히 맞게 했다.
 * 실습 장의 3단계는 앱 그대로: STEP 1 코드 소환 → STEP 2 파라미터 적용 → STEP 3 실행·차트.
 */
import { resolve } from "node:path";
import { OUT, C, KO, MONO, T, chip, head, codeBlock, outBlock, card, numberRow, practiceSlide, makeDeck } from "./lecture-kit.mjs";

/* 다섯 차시가 공유하는 연습용 표 */
const DF = "import pandas as pd\ndf = pd.DataFrame({\n    '티어': ['골드', '실버', '골드', '브론즈', '실버'],\n    '포지션': ['탑', '미드', '미드', '탑', '정글'],\n    '승률': [58, 47, 61, 39, 52],\n    '골드': [12400, 9800, 13100, 8200, 10500]\n})";
const S = {};

S[21] = {
  no: 21, title: "글자를 숫자로 라벨 인코딩", sub: "컴퓨터는 '골드·실버·브론즈' 를 못 읽는다 — 0, 1, 2 로 바꿔 준다", funcs: ["LabelEncoder()", "fit_transform()"],
  aice: "인코딩 공식", note: "13차시 info 에서 object 였던 범주 열을 여기서 숫자로. 22차시 원-핫과 무엇이 다른지가 핵심.",
  slides: [
    (s) => { head(s, "오늘 배우면 AICE에서 이렇게 쓴다", 21);
      card(s, 0.5, 1.5, 4.35, 1.6, { title: "정답(y) 열 인코딩", body: "승/패 같은 정답 글자를 0/1 로. y = le.fit_transform(df['승패']) — 분류 모델의 입력 형식." });
      card(s, 5.15, 1.5, 4.35, 1.6, { title: "순서가 있는 범주", body: "브론즈<실버<골드 처럼 등급에 순서가 있으면 라벨 인코딩이 맞다. 크기 비교가 의미를 가진다." });
      card(s, 0.5, 3.3, 9, 1.7, { tone: "amber", title: "오늘 막을 사고", body: "순서 없는 범주(포지션 탑·미드·정글)에 라벨 인코딩을 쓰면 모델이 '정글(2)이 탑(0)보다 2배 크다' 고 착각한다. 그때는 22차시 원-핫." }); },
    (s) => { head(s, "LabelEncoder — 글자를 0부터 번호로", 21);
      codeBlock(s, "from sklearn.preprocessing import LabelEncoder\nle = LabelEncoder()\ndf['티어'] = le.fit_transform(df['티어'])\nprint('변환된 고유 클래스 목록:', le.classes_)\nprint(df[['티어']].head(3))", 0.5, 1.5, 5.6, 2.1, 12);
      outBlock(s, "변환된 고유 클래스 목록: ['골드' '브론즈' '실버']\n   티어\n0    0\n1    2\n2    0", 0.5, 3.75, 5.6, 1.4, 10);
      card(s, 6.35, 1.5, 3.15, 3.65, { title: "기억할 것", body: "• import 는 sklearn.preprocessing\n• le = LabelEncoder() 로 도구를 만들고\n• fit_transform(열) 로 바꾼다\n• classes_ 는 번호 순서대로의 원래 이름\n• 가나다 순으로 0, 1, 2 가 붙는다" }); },
    (s) => { head(s, "fit · transform · fit_transform", 21);
      codeBlock(s, "le.fit(df['티어'])          # 어떤 값들이 있나 '배운다'\nle.transform(df['티어'])    # 배운 대로 '바꾼다'\nle.fit_transform(df['티어']) # 둘을 한 번에 (실기에서 쓰는 것)", 0.5, 1.5, 9, 1.5, 12.5);
      card(s, 0.5, 3.2, 4.35, 1.9, { title: "훈련 데이터는 fit_transform", body: "값의 목록을 배우면서 동시에 바꾼다. 처음 만나는 데이터에 쓴다." });
      card(s, 5.15, 3.2, 4.35, 1.9, { tone: "green", title: "시험 데이터는 transform 만", body: "훈련 때 배운 번호를 그대로 써야 한다. 시험 데이터에 또 fit 하면 번호가 달라져 예측이 엉망이 된다." }); },
    (s) => { head(s, "라벨 인코딩 vs 원-핫 인코딩 — 언제 무엇을", 21);
      const rows = [["", "라벨 인코딩 (21차시)", "원-핫 인코딩 (22차시)"], ["결과", "한 열, 0·1·2…", "여러 열, 0 또는 1"], ["쓰는 곳", "순서 있는 범주 · 정답(y) 열", "순서 없는 범주 · 입력(X) 열"], ["예", "브론즈<실버<골드, 승/패", "포지션 탑·미드·정글"], ["위험", "없는 순서를 만들어 낸다", "범주가 많으면 열이 폭발한다"]];
      s.addTable(rows.map((r, ri) => r.map((c, ci) => ({ text: c, options: { bold: ri === 0 || ci === 0, fill: { color: ri === 0 ? C.indigoSoft : (ri % 2 ? "F8FAFC" : C.white) }, color: ri === 0 ? C.indigo : C.ink, fontFace: KO, fontSize: 12, align: ci === 0 ? "left" : "center", valign: "middle" } }))),
        { x: 0.5, y: 1.5, w: 9, colW: [2, 3.5, 3.5], rowH: 0.52, border: { type: "solid", color: C.line, pt: 0.75 } });
      card(s, 0.5, 4.25, 9, 0.85, { tone: "amber", title: "한 줄 기준: 크기 비교가 말이 되면 라벨, 안 되면 원-핫", body: null }); },
    (s) => { head(s, "흔한 실수 3가지", 21);
      numberRow(s, [
        { t: "시험 데이터에 fit_transform", d: "훈련과 다른 번호가 붙는다. 시험 데이터는 le.transform(…) 만." },
        { t: "결측치가 남아 있음", d: "NaN 이 있으면 에러. 18차시 fillna 로 먼저 채운다. 순서: 결측 → 인코딩 → 스케일링." },
        { t: "열을 안 덮어씀", d: "le.fit_transform(df['티어']) 만 쓰면 df 는 그대로. df['티어'] = 로 받는다." },
      ], 1.6);
      codeBlock(s, "le = LabelEncoder()\ndf['티어'] = le.fit_transform(df['티어'])       # 훈련\ntest['티어'] = le.transform(test['티어'])        # 시험 — fit 하지 않는다", 0.5, 3.4, 9, 1.7, 12); },
    (s) => { head(s, "AICE 실기 패턴 — 글자 열 전부 인코딩", 21);
      codeBlock(s, "from sklearn.preprocessing import LabelEncoder\nobj_cols = df.select_dtypes(include='object').columns   # 13차시\nfor col in obj_cols:\n    le = LabelEncoder()\n    df[col] = le.fit_transform(df[col])\nprint(df.dtypes)", 0.5, 1.5, 5.6, 2.4, 12);
      outBlock(s, "티어      int64\n포지션     int64\n승률      int64\n골드      int64", 0.5, 4.05, 5.6, 1.1, 10.5);
      card(s, 6.35, 1.5, 3.15, 3.65, { title: "왜 열마다 le 를 새로", body: "인코더 하나가 한 열의 값 목록을 기억한다. 돌려쓰면 앞 열의 목록이 덮여 번호가 뒤섞인다." }); },
    (s) => practiceSlide(s, 21, [
      "「라벨 인코더 파이프라인 조립」 버튼 → LabelEncoder 를 만들어 열 하나를 바꾸고 classes_ 를 찍는 코드가 나타난다.",
      "인코딩 대상 열(티어·포지션·성별)과 변환 순서 기준을 고르고 「파라미터 적용」. 티어를 고르면 0·1·2 가 어느 등급에 붙을지 먼저 말한다 (가나다 순).",
      "「파이프라인 실행」 → 범주가 0·1·2 로 치환된 분포 차트. 포지션을 골라 보고 '정글이 탑의 몇 배' 가 말이 되는지 짝과 이야기한다.",
    ], [
      { q: "훈련은 fit_transform, 시험 데이터는?", a: "답: transform 만" },
      { q: "포지션(탑·미드·정글)에 라벨 인코딩을 쓰면?", a: "답: 없는 순서가 생긴다 → 원-핫이 맞다" },
    ]),
  ],
  wrapTitle: "글자를 0·1·2 로 — 순서가 있을 때",
  wrap: ["le = LabelEncoder() → df['열'] = le.fit_transform(df['열'])", "classes_ 로 번호 순서 확인. 가나다 순으로 0부터", "시험 데이터는 transform 만 — fit 하면 번호가 달라진다", "순서 없는 범주는 22차시 원-핫으로"],
  next: "22차시 pd.get_dummies() — 열을 가로로 펼치기",
};

S[22] = {
  no: 22, title: "원-핫 인코딩으로 열 펼치기", sub: "'탑=0, 미드=1, 바텀=2' 라고 하면 컴퓨터가 크기로 착각한다 — 열을 펼쳐 0/1 로", funcs: ["pd.get_dummies()", "drop_first=True"],
  aice: "drop_first 함정", note: "21차시와 짝. drop_first=True 를 왜 쓰는지(다중공선성)를 그림 없이 말로 이해시키는 게 오늘의 어려운 부분.",
  slides: [
    (s) => { head(s, "오늘 배우면 AICE에서 이렇게 쓴다", 22);
      card(s, 0.5, 1.5, 4.35, 1.6, { title: "순서 없는 범주 처리", body: "포지션·결제수단·지역처럼 크기 비교가 말이 안 되는 열은 전부 원-핫." });
      card(s, 5.15, 1.5, 4.35, 1.6, { title: "한 줄로 전체 변환", body: "df = pd.get_dummies(df, columns=['포지션'], drop_first=True, dtype=int)" });
      card(s, 0.5, 3.3, 9, 1.7, { tone: "amber", title: "오늘 막을 사고", body: "회귀 모델에서 drop_first 를 빼면 열들이 서로 완벽히 예측 가능해져(다중공선성) 계수가 불안정해진다. 실기 단골 감점." }); },
    (s) => { head(s, "get_dummies — 값마다 열 하나씩", 22);
      codeBlock(s, DF + "\ndf2 = pd.get_dummies(df, columns=['포지션'], drop_first=False, dtype=int)\nprint(df2[['포지션_미드', '포지션_정글', '포지션_탑']])", 0.5, 1.5, 5.6, 2.35, 10);
      outBlock(s, "   포지션_미드  포지션_정글  포지션_탑\n0        0        0       1\n1        1        0       0\n2        1        0       0\n3        0        0       1\n4        0        1       0", 0.5, 3.95, 5.6, 1.2, 8);
      card(s, 6.35, 1.5, 3.15, 3.65, { title: "기억할 것", body: "• columns=['열'] — 리스트\n• 값이 3개면 열 3개가 생긴다\n• 자기 값에만 1, 나머지는 0\n• dtype=int 를 안 쓰면 True/False 로 나온다\n• 원래 열은 사라진다" }); },
    (s) => { head(s, "drop_first=True — 첫 열을 버린다", 22);
      codeBlock(s, "df3 = pd.get_dummies(df, columns=['포지션'], drop_first=True, dtype=int)\nprint([c for c in df3.columns if '포지션' in c])", 0.5, 1.5, 5.6, 1.4, 11.5);
      outBlock(s, "['포지션_정글', '포지션_탑']", 0.5, 3.05, 5.6, 0.75, 11);
      card(s, 0.5, 3.85, 5.6, 1.3, { tone: "green", title: "미드는 어디 갔나", body: "정글 0, 탑 0 이면 미드다. 열 하나가 없어도 정보는 그대로." });
      card(s, 6.35, 1.5, 3.15, 3.6, { title: "왜 버리나", body: "세 열을 더하면 항상 1 이다. 즉 한 열은 나머지로 계산되는 '군더더기'.\n\n회귀 모델은 이런 열이 있으면 계수를 못 정한다. 트리 계열은 덜 민감하지만, 실기는 True 로 통일." }); },
    (s) => { head(s, "열이 몇 개나 늘어나나", 22);
      codeBlock(s, "print(len(df.columns))                              # 4\nprint(len(pd.get_dummies(df, columns=['포지션'], drop_first=False).columns))  # 6\nprint(len(pd.get_dummies(df, columns=['포지션'], drop_first=True).columns))   # 5", 0.5, 1.5, 9, 1.6, 11);
      card(s, 0.5, 3.3, 4.35, 1.8, { title: "계산", body: "원래 4열 − 포지션 1열 + 값 3개 = 6열.\ndrop_first 면 하나 덜해 5열." });
      card(s, 5.15, 3.3, 4.35, 1.8, { tone: "red", title: "범주가 많으면 폭발", body: "값이 100개인 열(도시 이름 등)에 쓰면 열이 100개 늘어난다. 그럴 땐 상위 몇 개만 남기고 나머지는 '기타' 로 묶는다." }); },
    (s) => { head(s, "흔한 실수 3가지", 22);
      numberRow(s, [
        { t: "결과를 안 받음", d: "pd.get_dummies(df, …) 만 쓰면 df 는 그대로. df = pd.get_dummies(…) 로 받는다." },
        { t: "훈련·시험 열 불일치", d: "시험 데이터에만 없는 값이 있으면 열 개수가 달라져 fit 에러. 두 표를 합쳐 인코딩하거나 reindex 로 맞춘다." },
        { t: "dtype 미지정", d: "판다스 최신 버전은 True/False 로 만든다. 모델에 넣으려면 dtype=int." },
      ], 1.6);
      codeBlock(s, "df = pd.get_dummies(df, columns=['포지션'], drop_first=True, dtype=int)\nprint(df.dtypes.value_counts())", 0.5, 3.4, 9, 1.7, 12.5); },
    (s) => { head(s, "AICE 실기 패턴 — 범주 열 한 번에", 22);
      codeBlock(s, "obj_cols = df.select_dtypes(include='object').columns.tolist()\nprint('범주 열:', obj_cols)\n\ndf = pd.get_dummies(df, columns=obj_cols, drop_first=True, dtype=int)\nprint('인코딩 후 열 수:', len(df.columns))\nprint(df.head(2))", 0.5, 1.5, 5.6, 2.5, 12);
      outBlock(s, "범주 열: ['티어', '포지션']\n인코딩 후 열 수: 6", 0.5, 4.15, 5.6, 1.0, 11);
      card(s, 6.35, 1.5, 3.15, 3.65, { title: "21 vs 22 선택", body: "정답(y) 열 → 21차시 라벨.\n입력(X)의 순서 없는 범주 → 22차시 원-핫.\n\n실기에서는 문제가 방법을 지정해 주는 경우가 많다. 없으면 이 기준." }); },
    (s) => practiceSlide(s, 22, [
      "「get_dummies 열 확장 파이프라인 조립」 버튼 → 범주 열을 펼치고 열 수를 전후로 찍는 코드가 나타난다.",
      "타깃 열(포지션 4범주·티어 3범주·결제수단 3범주)과 drop_first(True·False)를 고르고 「파라미터 적용」. 열이 몇 개 늘어날지 먼저 계산한다.",
      "「파이프라인 실행」 → 인코딩 전후 열 수 막대. drop_first 를 껐다 켰다 하며 차이가 1 인 것을 확인한다.",
    ], [
      { q: "값이 4개인 열을 drop_first=True 로 펼치면 열은 몇 개?", a: "답: 3개" },
      { q: "drop_first 를 쓰는 이유는?", a: "답: 다중공선성 — 한 열이 나머지로 계산되니까" },
    ]),
  ],
  wrapTitle: "순서 없는 범주는 열을 펼쳐 0/1 로",
  wrap: ["df = pd.get_dummies(df, columns=['열'], drop_first=True, dtype=int)", "값 n개 → 열 n개, drop_first 면 n−1개", "회귀에서 drop_first 를 빼면 다중공선성 감점", "범주가 아주 많으면 열 폭발 — 상위만 남기고 기타로"],
  next: "23차시 StandardScaler vs MinMaxScaler — 숫자 체급 맞추기",
};

S[23] = {
  no: 23, title: "데이터 값 정규화와 표준화 스케일링", sub: "키 180 과 KDA 3.5 를 그대로 주면 큰 숫자만 보고 판단한다 — 체급을 맞춘다", funcs: ["StandardScaler()", "MinMaxScaler()"],
  aice: "모델 전 필수", note: "왜 스케일링이 필요한지: 거리 기반 모델(KNN·SVM)과 신경망은 큰 숫자에 끌려간다. 트리 계열은 영향이 적다는 것까지.",
  slides: [
    (s) => { head(s, "오늘 배우면 AICE에서 이렇게 쓴다", 23);
      card(s, 0.5, 1.5, 4.35, 1.6, { title: "딥러닝 입력 전", body: "41~46차시 신경망은 입력이 0 근처여야 학습이 된다. 스케일링 없이는 손실이 안 줄어든다." });
      card(s, 5.15, 1.5, 4.35, 1.6, { title: "거리 기반 모델", body: "KNN·SVM 은 숫자 크기를 그대로 거리로 쓴다. 골드(12400)가 KDA(3.5)를 덮어 버린다." });
      card(s, 0.5, 3.3, 9, 1.7, { tone: "amber", title: "오늘 막을 사고", body: "시험 데이터에 fit_transform 을 또 쓰면 훈련과 다른 기준으로 눌린다. 훈련은 fit_transform, 시험은 transform — 21차시와 같은 규칙." }); },
    (s) => { head(s, "StandardScaler — 평균 0, 표준편차 1", 23);
      codeBlock(s, "from sklearn.preprocessing import StandardScaler\nscaler = StandardScaler()\ndf[['승률', '골드']] = scaler.fit_transform(df[['승률', '골드']])\nprint(df[['승률', '골드']].round(2))\nprint('평균:', df['승률'].mean().round(2))", 0.5, 1.5, 5.6, 2.0, 11);
      outBlock(s, "     승률    골드\n0   0.78  0.68\n1  -0.55 -0.63\n2   1.13  1.05\n3  -1.51 -1.23\n4   0.15  0.13\n평균: 0.0", 0.5, 3.6, 5.6, 1.55, 9);
      card(s, 6.35, 1.5, 3.15, 3.65, { title: "기억할 것", body: "• (값 − 평균) ÷ 표준편차\n• 결과는 −3 ~ +3 근처, 평균 0\n• 음수가 나오는 게 정상\n• 이상치가 있어도 완전히 안 눌린다\n• 실기 기본값은 이쪽" }); },
    (s) => { head(s, "MinMaxScaler — 0 과 1 사이로", 23);
      codeBlock(s, "from sklearn.preprocessing import MinMaxScaler\nscaler = MinMaxScaler()\ndf[['승률', '골드']] = scaler.fit_transform(df[['승률', '골드']])\nprint(df[['승률', '골드']].round(2))", 0.5, 1.5, 5.6, 1.9, 11);
      outBlock(s, "     승률    골드\n0  0.86  0.86\n1  0.36  0.33\n2  1.00  1.00\n3  0.00  0.00\n4  0.59  0.47", 0.5, 3.55, 5.6, 1.6, 10);
      card(s, 6.35, 1.5, 3.15, 3.65, { tone: "green", title: "기억할 것", body: "• (값 − 최솟값) ÷ (최댓값 − 최솟값)\n• 가장 작은 값이 0, 가장 큰 값이 1\n• 이미지 픽셀(0~255)에 자주 쓴다\n• 이상치가 있으면 나머지가 좁은 구간에 뭉친다" }); },
    (s) => { head(s, "둘을 언제 쓰나", 23);
      const rows = [["", "StandardScaler", "MinMaxScaler"], ["결과 범위", "평균 0, 대개 −3~3", "0 ~ 1"], ["이상치", "덜 민감", "민감 — 나머지가 뭉침"], ["쓰는 곳", "대부분의 모델, 실기 기본", "이미지 픽셀, 범위가 정해진 값"], ["음수", "생긴다", "안 생긴다"]];
      s.addTable(rows.map((r, ri) => r.map((c, ci) => ({ text: c, options: { bold: ri === 0 || ci === 0, fill: { color: ri === 0 ? C.indigoSoft : (ri % 2 ? "F8FAFC" : C.white) }, color: ri === 0 ? C.indigo : C.ink, fontFace: KO, fontSize: 12, align: ci === 0 ? "left" : "center", valign: "middle" } }))),
        { x: 0.5, y: 1.5, w: 9, colW: [2.2, 3.4, 3.4], rowH: 0.52, border: { type: "solid", color: C.line, pt: 0.75 } });
      card(s, 0.5, 4.25, 9, 0.85, { tone: "amber", title: "트리 계열(32·38차시)은 스케일링이 거의 필요 없다 — 크기가 아니라 순서로 나누니까", body: null }); },
    (s) => { head(s, "흔한 실수 3가지", 23);
      numberRow(s, [
        { t: "정답(y) 까지 스케일링", d: "분류 문제의 y 는 건드리지 않는다. 입력 X 의 숫자 열만." },
        { t: "시험 데이터에 fit", d: "훈련의 평균·표준편차를 그대로 써야 한다. 시험은 transform 만." },
        { t: "2차원 형태 아님", d: "scaler 는 (행, 열) 2차원을 받는다. 열 하나면 df[['열']] 처럼 대괄호 두 겹 (15차시)." },
      ], 1.6);
      codeBlock(s, "scaler = StandardScaler()\nX_train[num_cols] = scaler.fit_transform(X_train[num_cols])   # 훈련\nX_test[num_cols] = scaler.transform(X_test[num_cols])         # 시험", 0.5, 3.4, 9, 1.7, 11.5); },
    (s) => { head(s, "AICE 실기 패턴 — 숫자 열만 골라 스케일링", 23);
      codeBlock(s, "from sklearn.preprocessing import StandardScaler\nnum_cols = X.select_dtypes(include='number').columns   # 13차시\nscaler = StandardScaler()\nX[num_cols] = scaler.fit_transform(X[num_cols])\nprint(X[num_cols].describe().loc[['mean', 'std']].round(2))", 0.5, 1.5, 5.6, 2.4, 11.5);
      outBlock(s, "        승률   골드\nmean   0.0  0.0\nstd    1.12 1.12", 0.5, 4.05, 5.6, 1.1, 10.5);
      card(s, 6.35, 1.5, 3.15, 3.65, { title: "순서 정리", body: "16 결측 확인 → 18 채우기 → 21·22 인코딩 → 23 스케일링 → 31 분할.\n\n인코딩이 먼저다. 글자가 남아 있으면 스케일러가 에러를 낸다." }); },
    (s) => practiceSlide(s, 23, [
      "「스케일러 변환 파이프라인 조립」 버튼 → 스케일러를 만들어 두 열을 변환하는 코드가 나타난다.",
      "알고리즘(StandardScaler·MinMaxScaler)과 압축 강도를 고르고 「파라미터 적용」. MinMax 를 고르면 결과가 어느 범위에 들어올지 먼저 말한다 (0~1).",
      "「파이프라인 실행」 → 스케일링 전(들쑥날쑥) vs 후(정렬) 분포. 두 스케일러를 번갈아 눌러 모양 차이를 본다.",
    ], [
      { q: "StandardScaler 의 결과 평균은?", a: "답: 0 (표준편차 1)" },
      { q: "시험 데이터에 쓰는 메서드는?", a: "답: transform (fit 하지 않는다)" },
    ]),
  ],
  wrapTitle: "숫자 체급을 맞춘다 — 표준화 또는 정규화",
  wrap: ["scaler = StandardScaler() → X[num] = scaler.fit_transform(X[num])", "Standard 는 평균 0·표준편차 1, MinMax 는 0~1", "시험 데이터는 transform 만. y 는 건드리지 않는다", "순서: 결측 → 인코딩 → 스케일링 → 분할"],
  next: "24차시 groupby · agg — 그룹별로 묶어 통계 내기",
};

S[24] = {
  no: 24, title: "그룹별 묶기와 다중 통계 집계", sub: "'탑 유저와 미드 유저 중 누가 골드를 더 버나' — 묶고(groupby) 계산한다(agg)", funcs: ["df.groupby()", "df.agg()"],
  aice: "EDA 단골", note: "엑셀의 피벗테이블과 같은 것. 14차시 describe 가 '전체', 오늘은 '그룹별'.",
  slides: [
    (s) => { head(s, "오늘 배우면 AICE에서 이렇게 쓴다", 24);
      card(s, 0.5, 1.5, 4.35, 1.6, { title: "집단별 특성 파악", body: "df.groupby('포지션')['골드'].mean() — EDA 서술형 문제의 근거 숫자를 만든다." });
      card(s, 5.15, 1.5, 4.35, 1.6, { title: "파생변수 만들기", body: "그룹 평균을 원래 표에 붙여 '평균 대비 내 골드' 같은 새 열을 만든다." });
      card(s, 0.5, 3.3, 9, 1.7, { tone: "amber", title: "오늘 막을 사고", body: "groupby 결과는 그룹 이름이 인덱스가 된다. 그대로 저장하면 열이 하나 빈다 — reset_index() 로 다시 열로 꺼낸다(25차시와 짝)." }); },
    (s) => { head(s, "groupby('열')['대상'].통계()", 24);
      codeBlock(s, DF + "\nprint(df.groupby('포지션')['골드'].mean())", 0.5, 1.5, 5.6, 2.25, 10);
      outBlock(s, "포지션\n미드    11450.0\n정글    10500.0\n탑     10300.0\nName: 골드, dtype: float64", 0.5, 3.85, 5.6, 1.3, 9.5);
      card(s, 6.35, 1.5, 3.15, 3.65, { title: "읽는 법", body: "• groupby('포지션') — 같은 포지션끼리 묶는다\n• ['골드'] — 볼 열\n• .mean() — 무엇을 계산할지\n• 결과는 그룹 이름이 인덱스\n• mean·sum·max·min·count 전부 된다" }); },
    (s) => { head(s, "agg — 열마다 다른 통계를 한 번에", 24);
      codeBlock(s, "group_stat = df.groupby('포지션').agg({'승률': 'mean', '골드': 'max'})\nprint(group_stat)\n\n# 한 열에 여러 통계\nprint(df.groupby('포지션')['골드'].agg(['mean', 'max', 'count']))", 0.5, 1.5, 5.6, 2.1, 11);
      outBlock(s, "       승률     골드\n포지션\n미드   54.0  13100\n정글   52.0  10500\n탑    48.5  12400", 0.5, 3.75, 5.6, 1.4, 9.5);
      card(s, 6.35, 1.5, 3.15, 3.65, { tone: "green", title: "기억할 것", body: "• agg({'열': '통계'}) — 중괄호 딕셔너리\n• agg(['mean', 'max']) — 대괄호면 한 열에 여러 개\n• 통계 이름은 따옴표 안 문자열\n• 표(DataFrame)로 나온다" }); },
    (s) => { head(s, "reset_index — 그룹 이름을 다시 열로", 24);
      codeBlock(s, "g = df.groupby('포지션')['골드'].mean()\nprint(type(g), g.index.tolist())\n\ng2 = df.groupby('포지션')['골드'].mean().reset_index()\nprint(g2)", 0.5, 1.5, 5.6, 2.0, 11.5);
      outBlock(s, "<class 'pandas.core.series.Series'> ['미드', '정글', '탑']\n  포지션       골드\n0  미드  11450.0\n1  정글  10500.0\n2   탑  10300.0", 0.5, 3.65, 5.6, 1.5, 9);
      card(s, 6.35, 1.5, 3.15, 3.65, { title: "왜 필요한가", body: "그룹 이름이 인덱스로 가 있으면 '포지션' 이 열이 아니라서 그래프나 저장에서 빠진다. reset_index() 한 줄로 평범한 표가 된다." }); },
    (s) => { head(s, "흔한 실수 3가지", 24);
      numberRow(s, [
        { t: "열 이름 오타", d: "groupby('포지션 ') 처럼 공백 하나면 KeyError. df.columns 로 정확한 이름을 본다." },
        { t: "agg 에 함수 호출", d: "agg({'골드': mean()}) 는 에러. 따옴표 문자열 'mean' 또는 함수 이름 np.mean." },
        { t: "결과를 그래프에 바로", d: "인덱스가 그룹 이름이면 x축이 비어 보인다. reset_index() 뒤에 plot." },
      ], 1.6);
      codeBlock(s, "stat = df.groupby('포지션').agg({'승률': 'mean', '골드': 'max'}).reset_index()\nprint(stat.columns.tolist())   # ['포지션', '승률', '골드']", 0.5, 3.4, 9, 1.7, 11.5); },
    (s) => { head(s, "AICE 실기 패턴 — 그룹 평균을 원래 표에 붙이기", 24);
      codeBlock(s, "avg = df.groupby('포지션')['골드'].transform('mean')   # 행마다 그 그룹의 평균\ndf['골드_그룹평균'] = avg\ndf['골드_대비'] = (df['골드'] / avg).round(2)\nprint(df[['포지션', '골드', '골드_그룹평균', '골드_대비']])", 0.5, 1.5, 5.6, 2.1, 10.5);
      outBlock(s, "  포지션     골드  골드_그룹평균  골드_대비\n0   탑  12400   10300.0   1.20\n1  미드   9800   11450.0   0.86\n2  미드  13100   11450.0   1.14", 0.5, 3.75, 5.6, 1.4, 8.5);
      card(s, 6.35, 1.5, 3.15, 3.65, { title: "transform 과 agg", body: "agg 는 그룹당 한 줄로 줄이고, transform 은 원래 행 수를 유지한 채 그룹 값을 채워 준다. 파생변수는 transform." }); },
    (s) => practiceSlide(s, 24, [
      "「groupby & agg 집계 파이프라인 조립」 버튼 → 그룹별 승률 평균과 골드 집계를 내는 코드가 나타난다.",
      "그룹 기준 열(포지션·티어·승패)과 골드 집계 방식(mean·max·sum)을 고르고 「파라미터 적용」. sum 을 고르면 숫자가 얼마나 커질지 먼저 말한다.",
      "「파이프라인 실행」 → 그룹별 평균 승률과 집계 지표 막대. 티어로 묶으면 승률 차이가 더 뚜렷한지 본다.",
    ], [
      { q: "포지션별 골드 평균을 내는 한 줄은?", a: "답: df.groupby('포지션')['골드'].mean()", mono: true },
      { q: "그룹 이름을 다시 열로 만드는 메서드는?", a: "답: reset_index()" },
    ]),
  ],
  wrapTitle: "묶고(groupby) 계산한다(agg)",
  wrap: ["df.groupby('열')['대상'].mean() — 그룹별 통계", "agg({'열': '통계'}) 로 열마다 다르게, agg(['a','b']) 로 여러 개", "결과는 그룹이 인덱스 — reset_index() 로 열로 꺼낸다", "행 수를 유지하며 그룹 값을 붙이려면 transform('mean')"],
  next: "25차시 sort_values · reset_index — 줄 세우고 번호 다시 매기기",
};

S[25] = {
  no: 25, title: "데이터 값 정렬과 인덱스 초기화", sub: "승률 1등부터 줄을 세우면 번호표가 뒤죽박죽 — 0번부터 다시 뗀다", funcs: ["sort_values()", "reset_index(drop=True)"],
  aice: "정렬 뒤 필수", note: "Part 2 마무리. 12차시 head/tail 과 묶어 '정렬 → 상위 확인' 흐름을 완성한다.",
  slides: [
    (s) => { head(s, "오늘 배우면 AICE에서 이렇게 쓴다", 25);
      card(s, 0.5, 1.5, 4.35, 1.6, { title: "상위 n명 뽑기", body: "df.sort_values('승률', ascending=False).head(10) — 12차시 head 와 짝." });
      card(s, 5.15, 1.5, 4.35, 1.6, { title: "중요 특성 순위", body: "38차시 특성 중요도를 정렬해 '무엇이 승리에 결정적인가' 를 답한다." });
      card(s, 0.5, 3.3, 9, 1.7, { tone: "amber", title: "오늘 막을 사고", body: "정렬만 하고 reset_index 를 빼면 인덱스가 3, 0, 4, 1 순으로 남는다. 그 뒤 iloc[0] 과 loc[0] 이 다른 행을 가리켜 답이 틀린다." }); },
    (s) => { head(s, "sort_values(by=…, ascending=…)", 25);
      codeBlock(s, DF + "\ndf_sorted = df.sort_values(by='승률', ascending=False)\nprint(df_sorted[['티어', '승률']])", 0.5, 1.5, 5.6, 2.25, 10);
      outBlock(s, "    티어  승률\n2   골드  61\n0   골드  58\n4   실버  52\n1   실버  47\n3  브론즈  39", 0.5, 3.85, 5.6, 1.3, 8.5);
      card(s, 6.35, 1.5, 3.15, 3.65, { title: "기억할 것", body: "• by='열' — 기준 열\n• ascending=False 면 큰 값부터(1등부터)\n• True(기본)면 작은 값부터\n• 왼쪽 번호(2, 0, 4…)가 원래 인덱스 — 뒤섞였다\n• 결과를 변수에 받는다" }); },
    (s) => { head(s, "reset_index(drop=True) — 번호표를 다시", 25);
      codeBlock(s, "df_sorted = df_sorted.reset_index(drop=True)\nprint(df_sorted[['티어', '승률']])\nprint(df_sorted.index.tolist())", 0.5, 1.5, 5.6, 1.6, 12);
      outBlock(s, "    티어  승률\n0   골드  61\n1   골드  58\n2   실버  52\n3   실버  47\n4  브론즈  39\n[0, 1, 2, 3, 4]", 0.5, 3.25, 5.6, 1.9, 9);
      card(s, 6.35, 1.5, 3.15, 3.65, { tone: "green", title: "drop=True 가 핵심", body: "• drop=True — 옛 번호를 버린다 (원하는 것)\n• drop=False — 옛 번호가 'index' 라는 새 열로 남는다 (쓰레기 열)\n• 17차시 dropna 뒤에도 같이 쓴다" }); },
    (s) => { head(s, "여러 열로 정렬하기", 25);
      codeBlock(s, "df.sort_values(by=['티어', '승률'], ascending=[True, False])\n# 티어 가나다 순으로 묶고, 같은 티어 안에서는 승률 높은 순", 0.5, 1.5, 9, 1.3, 12);
      outBlock(s, "    티어  포지션  승률     골드\n2   골드   미드  61  13100\n0   골드    탑  58  12400\n3  브론즈    탑  39   8200\n4   실버   정글  52  10500\n1   실버   미드  47   9800", 0.5, 3.0, 9, 2.1, 10);
      T(s, "by 와 ascending 을 둘 다 리스트로, 개수를 맞춘다.", { x: 0.5, y: 5.2, w: 9, h: 0.3, fontSize: 11.5, color: C.gray }); },
    (s) => { head(s, "흔한 실수 3가지", 25);
      numberRow(s, [
        { t: "결과를 안 받음", d: "df.sort_values('승률') 만 쓰면 df 는 그대로. df = df.sort_values(…) 로 받는다." },
        { t: "drop 을 빼먹음", d: "reset_index() 만 쓰면 옛 번호가 'index' 열로 남는다. 저장하면 열 개수가 틀려 감점." },
        { t: "ascending 방향 착각", d: "1등부터 보고 싶으면 False. 기본값 True 는 작은 값부터라 꼴찌가 먼저 온다." },
      ], 1.6);
      codeBlock(s, "df = (df.sort_values(by='승률', ascending=False)\n        .reset_index(drop=True))      # 한 줄로 이어 쓰기", 0.5, 3.4, 9, 1.7, 12.5); },
    (s) => { head(s, "AICE 실기 패턴 — 상위권 뽑아 저장", 25);
      codeBlock(s, "top10 = (df.sort_values(by='승률', ascending=False)\n           .reset_index(drop=True)\n           .head(10))                      # 12차시\ntop10.to_csv('top10.csv', index=False)      # 11차시\nprint(top10[['티어', '승률']].head(3))", 0.5, 1.5, 5.6, 2.2, 11.5);
      outBlock(s, "   티어  승률\n0  골드  61\n1  골드  58\n2  실버  52", 0.5, 3.85, 5.6, 1.3, 10.5);
      card(s, 6.35, 1.5, 3.15, 3.65, { title: "11·12·25 가 한 줄", body: "정렬 → 인덱스 리셋 → 상위 n → 저장. 실기에서 '상위 10명을 뽑아 파일로 제출하시오' 문제의 정답 형태." }); },
    (s) => practiceSlide(s, 25, [
      "「sort_values & reset_index 정렬 조립」 버튼 → 기준 열로 정렬하고 인덱스를 리셋한 뒤 상위 3명을 찍는 코드가 나타난다.",
      "정렬 기준(승률·골드획득량·KDA)과 방향(False 내림차순·True 오름차순)을 고르고 「파라미터 적용」. False 면 누가 맨 위에 올지 먼저 말한다.",
      "「파이프라인 실행」 → 정렬된 상위 5명 스탯 차트. 방향을 True 로 바꾸면 차트가 어떻게 뒤집히는지 본다.",
    ], [
      { q: "1등부터 정렬하는 옵션은?", a: "답: ascending=False", mono: true },
      { q: "reset_index 에서 drop=True 를 빼면?", a: "답: 옛 번호가 'index' 열로 남는다" },
    ]),
  ],
  wrapTitle: "정렬 뒤에는 언제나 reset_index(drop=True)",
  wrap: ["df = df.sort_values(by='열', ascending=False) — 1등부터", "여러 열은 by=['a','b'], ascending=[True, False]", "df = df.reset_index(drop=True) — drop 을 빼면 쓰레기 열", "실기 패턴: 정렬 → 리셋 → head(n) → to_csv(index=False)"],
  next: "Part 3 EDA 시각화 — 26차시 plt.bar() vs plt.barh()",
};

S[26] = {
  no: 26, title: "세로 막대와 가로 막대 회전", sub: "표의 글자는 눈에 안 들어온다 — 막대로 세우고, 이름이 길면 눕힌다", funcs: ["plt.bar()", "plt.barh()"],
  aice: "시각화 2점", note: "Part 3 시작. matplotlib 세 줄 규칙(그리기 → 꾸미기 → show)을 여기서 심는다. 한글 폰트 설정도 오늘.",
  slides: [
    (s) => { head(s, "오늘 배우면 AICE에서 이렇게 쓴다", 26);
      card(s, 0.5, 1.5, 4.35, 1.6, { title: "범주별 비교", body: "24차시 groupby 결과를 막대로. '어느 포지션이 승률이 높은가' 를 한눈에." });
      card(s, 5.15, 1.5, 4.35, 1.6, { title: "배점이 있는 문제", body: "실기 시각화 문제는 그래프 종류·제목·라벨까지 채점한다. 2점짜리 단골." });
      card(s, 0.5, 3.3, 9, 1.7, { tone: "amber", title: "오늘 막을 사고", body: "한글 라벨이 □□□ 로 깨진다. plt.rc('font', family='Malgun Gothic') 한 줄을 맨 앞에 쓴다. 음수 부호가 깨지면 plt.rc('axes', unicode_minus=False)." }); },
    (s) => { head(s, "plt.bar — 세로 막대", 26);
      codeBlock(s, "import matplotlib.pyplot as plt\nplt.rc('font', family='Malgun Gothic')     # 한글 깨짐 방지\nplt.figure(figsize=(6, 4))\nplt.bar(['탑', '미드', '원딜', '서포터', '정글'],\n        [51.2, 53.8, 49.5, 48.0, 52.1], color='#4f46e5', alpha=0.8)\nplt.show()", 0.5, 1.5, 5.6, 2.4, 11);
      card(s, 6.35, 1.5, 3.15, 3.65, { title: "네 줄 규칙", body: "① import (한 번만)\n② figure(figsize=(가로, 세로)) — 크기\n③ bar(x, y, color=, alpha=) — 그리기\n④ show() — 화면에 내보내기\n\nalpha 는 투명도 0~1" });
      T(s, "x 자리에는 이름 리스트, y 자리에는 숫자 리스트. 개수가 같아야 한다.", { x: 0.5, y: 4.1, w: 5.6, h: 0.9, fontSize: 12, color: C.ink2 }); },
    (s) => { head(s, "plt.barh — 가로 막대", 26);
      codeBlock(s, "plt.barh(['서포터', '원딜', '탑', '정글', '미드'],\n         [48.0, 49.5, 51.2, 52.1, 53.8], color='#10b981')\nplt.xlabel('승률(%)')\nplt.show()", 0.5, 1.5, 5.6, 1.9, 11.5);
      card(s, 0.5, 3.55, 5.6, 1.55, { tone: "green", title: "언제 눕히나", body: "항목 이름이 길 때(회사명·지역명), 항목이 10개 넘을 때. 세로로 쓰면 글자가 겹치거나 기울어진다." });
      card(s, 6.35, 1.5, 3.15, 3.6, { title: "주의", body: "• barh 는 아래에서 위로 그린다 — 작은 값부터 넣어야 1등이 맨 위\n• x 축과 y 축이 바뀌니 xlabel 에 숫자 이름\n• 정렬은 25차시 sort_values 로 미리" }); },
    (s) => { head(s, "차트에 반드시 붙일 세 가지", 26);
      codeBlock(s, "plt.bar(x, y, color='#4f46e5')\nplt.title('포지션별 평균 승률', fontsize=14)   # 제목\nplt.xlabel('포지션')                          # x축 이름\nplt.ylabel('승률(%)')                         # y축 이름\nplt.show()", 0.5, 1.5, 5.6, 2.1, 12);
      card(s, 6.35, 1.5, 3.15, 2.1, { tone: "amber", title: "이 셋이 배점", body: "제목·축 이름이 없으면 '무슨 그래프인지 모른다' 로 감점. 30차시에서 범례까지 완성한다." });
      card(s, 0.5, 3.8, 9, 1.3, { title: "색은 하나로 충분하다", body: "막대마다 다른 색을 쓰면 '색이 의미가 있나?' 하고 헷갈린다. 강조할 하나만 다른 색으로 (앱 3차시 보너스 막대처럼)." }); },
    (s) => { head(s, "흔한 실수 3가지", 26);
      numberRow(s, [
        { t: "show() 누락", d: "주피터에서는 우연히 보이기도 하지만, 스크립트에서는 아무것도 안 뜬다. 마지막 줄은 plt.show()." },
        { t: "x·y 개수 불일치", d: "이름 5개에 숫자 4개면 ValueError. len 으로 세어 확인." },
        { t: "한글 폰트 미설정", d: "□□□ 로 깨진다. plt.rc('font', family='Malgun Gothic') 을 import 바로 뒤에." },
      ], 1.6);
      codeBlock(s, "import matplotlib.pyplot as plt\nplt.rc('font', family='Malgun Gothic')\nplt.rc('axes', unicode_minus=False)     # 음수 부호 깨짐 방지", 0.5, 3.4, 9, 1.7, 12); },
    (s) => { head(s, "AICE 실기 패턴 — groupby 결과를 막대로", 26);
      codeBlock(s, "stat = df.groupby('포지션')['승률'].mean().reset_index()   # 24차시\nstat = stat.sort_values('승률', ascending=False)           # 25차시\n\nplt.figure(figsize=(6, 4))\nplt.bar(stat['포지션'], stat['승률'], color='#4f46e5')\nplt.title('포지션별 평균 승률')\nplt.ylabel('승률(%)')\nplt.show()", 0.5, 1.5, 5.6, 2.9, 11.5);
      card(s, 6.35, 1.5, 3.15, 3.65, { title: "24 · 25 · 26 이 한 흐름", body: "묶어서 계산하고(24), 정렬하고(25), 그린다(26).\n\n실기 EDA 문제는 거의 이 세 줄 조합이다." }); },
    (s) => practiceSlide(s, 26, [
      "「막대 그래프 시각화 코드 조립」 버튼 → figure·bar·show 로 포지션별 승률을 그리는 코드가 나타난다.",
      "방향(bar 세로·barh 가로), 색(indigo·emerald·rose), 투명도(0.3~1.0)를 고르고 「파라미터 적용」. barh 로 바꾸면 코드의 어느 글자가 바뀌는지 본다.",
      "「파이프라인 실행」 → 포지션별 승률 막대. 투명도를 0.3 으로 낮춰 보고 발표용으로 적당한 값을 정해 본다.",
    ], [
      { q: "항목 이름이 길 때 쓰는 함수는?", a: "답: plt.barh (가로 막대)", mono: true },
      { q: "한글이 □□□ 로 나올 때 한 줄은?", a: "답: plt.rc('font', family='Malgun Gothic')", mono: true },
    ]),
  ],
  wrapTitle: "세로는 bar, 가로는 barh — 제목과 축 이름은 필수",
  wrap: ["plt.figure(figsize=) → plt.bar(x, y, color=, alpha=) → plt.show()", "이름이 길거나 항목이 많으면 barh (작은 값부터 넣는다)", "title·xlabel·ylabel 이 배점 — 빠뜨리면 감점", "한글은 plt.rc('font', family='Malgun Gothic')"],
  next: "27차시 scatter · hist — 관계와 분포 보기",
};

S[27] = {
  no: 27, title: "상관 산점도와 구간 히스토그램", sub: "킬이 늘면 골드도 늘까 — 점을 흩뿌려 관계를 보고, 구간으로 쏠림을 본다", funcs: ["plt.scatter()", "plt.hist()"],
  aice: "관계 확인", note: "산점도는 '두 열의 관계', 히스토그램은 '한 열의 분포'. 이 구분이 오늘의 전부. 28차시 상관계수의 준비.",
  slides: [
    (s) => { head(s, "오늘 배우면 AICE에서 이렇게 쓴다", 27);
      card(s, 0.5, 1.5, 4.35, 1.6, { title: "두 열의 관계 (scatter)", body: "점이 오른쪽 위로 몰리면 같이 커진다는 뜻. 28차시 상관계수를 눈으로 먼저 확인." });
      card(s, 5.15, 1.5, 4.35, 1.6, { title: "한 열의 분포 (hist)", body: "점수가 어디에 몰려 있나, 한쪽으로 치우쳤나. 14차시 describe 를 그림으로." });
      card(s, 0.5, 3.3, 9, 1.7, { tone: "amber", title: "오늘 막을 사고", body: "점이 수천 개면 까맣게 뭉쳐 아무것도 안 보인다. alpha 를 0.3~0.5 로 낮춰 겹침을 드러낸다. 실기에서 alpha 를 주는 이유가 이것." }); },
    (s) => { head(s, "plt.scatter(x, y) — 두 열을 점으로", 27);
      codeBlock(s, "plt.figure(figsize=(6, 4))\nplt.scatter(df['킬수'], df['골드'], s=40, alpha=0.5, color='#4f46e5')\nplt.xlabel('Kill Count')\nplt.ylabel('Gold Earned')\nplt.title('킬 수와 골드의 관계')\nplt.show()", 0.5, 1.5, 5.6, 2.4, 11.5);
      card(s, 6.35, 1.5, 3.15, 3.65, { title: "기억할 것", body: "• x 와 y 에 각각 열 하나씩\n• s = 점 크기, alpha = 투명도\n• 두 열의 행 수가 같아야 한다\n• 오른쪽 위로 뻗으면 양의 관계\n• 흩어져 있으면 관계 없음" });
      T(s, "'킬이 많은 사람이 골드도 많다' 를 증명하는 가장 빠른 그림.", { x: 0.5, y: 4.1, w: 5.6, h: 0.9, fontSize: 12, color: C.ink2 }); },
    (s) => { head(s, "plt.hist(x, bins=) — 한 열을 구간으로", 27);
      codeBlock(s, "plt.hist(df['승률'], bins=10, color='#10b981', edgecolor='white')\nplt.xlabel('승률(%)')\nplt.ylabel('인원 수')\nplt.show()", 0.5, 1.5, 5.6, 1.9, 11.5);
      card(s, 0.5, 3.55, 5.6, 1.55, { tone: "green", title: "bins 가 핵심", body: "구간을 몇 칸으로 나눌지. 너무 적으면 뭉뚱그려지고, 너무 많으면 들쭉날쭉. 10~30 사이에서 조절." });
      card(s, 6.35, 1.5, 3.15, 3.6, { title: "무엇을 읽나", body: "• 봉우리가 하나인가 둘인가\n• 왼쪽/오른쪽으로 치우쳤나\n• 멀리 떨어진 막대 = 이상치 (29차시)\n\n14차시 mean 과 50% 가 다르면 여기서 치우침이 보인다" }); },
    (s) => { head(s, "scatter 와 hist — 무엇을 물을 때 쓰나", 27);
      const rows = [["", "scatter", "hist"], ["열 개수", "두 개 (x, y)", "한 개"], ["묻는 것", "둘이 같이 움직이나?", "값이 어디에 몰렸나?"], ["주요 옵션", "s(크기), alpha(투명도)", "bins(구간 수)"], ["다음 단계", "28차시 상관계수", "29차시 상자그림·이상치"]];
      s.addTable(rows.map((r, ri) => r.map((c, ci) => ({ text: c, options: { bold: ri === 0 || ci === 0, fill: { color: ri === 0 ? C.indigoSoft : (ri % 2 ? "F8FAFC" : C.white) }, color: ri === 0 ? C.indigo : C.ink, fontFace: KO, fontSize: 12, align: ci === 0 ? "left" : "center", valign: "middle" } }))),
        { x: 0.5, y: 1.5, w: 9, colW: [2.2, 3.4, 3.4], rowH: 0.52, border: { type: "solid", color: C.line, pt: 0.75 } });
      card(s, 0.5, 4.25, 9, 0.85, { tone: "amber", title: "문제에 '관계·상관' 이 있으면 scatter, '분포·쏠림' 이 있으면 hist", body: null }); },
    (s) => { head(s, "흔한 실수 3가지", 27);
      numberRow(s, [
        { t: "scatter 에 열 하나", d: "plt.scatter(df['승률']) 은 에러. x 와 y 둘 다 필요하다. 하나면 hist." },
        { t: "점이 뭉쳐 안 보임", d: "alpha 를 안 주면 까만 덩어리. alpha=0.3~0.5, 점이 아주 많으면 s 도 줄인다." },
        { t: "관계를 인과로 읽음", d: "'킬이 많아서 골드가 많다' 인지 '골드가 많아서 킬이 많다' 인지는 그림으로 알 수 없다. 같이 움직인다까지만." },
      ], 1.6);
      codeBlock(s, "plt.scatter(df['킬수'], df['골드'], s=20, alpha=0.3)   # 점이 많을 때", 0.5, 3.4, 9, 1.7, 12.5); },
    (s) => { head(s, "AICE 실기 패턴 — 한 화면에 두 그림", 27);
      codeBlock(s, "fig, axes = plt.subplots(1, 2, figsize=(10, 4))   # 1행 2열\n\naxes[0].scatter(df['킬수'], df['골드'], alpha=0.5)\naxes[0].set_title('킬 vs 골드')\n\naxes[1].hist(df['승률'], bins=10)\naxes[1].set_title('승률 분포')\n\nplt.tight_layout()\nplt.show()", 0.5, 1.5, 5.6, 3.0, 11);
      card(s, 6.35, 1.5, 3.15, 3.0, { title: "subplots 읽기", body: "(1, 2) 는 1행 2열. axes[0] 이 왼쪽, axes[1] 이 오른쪽.\n\naxes 에서는 plt.title 대신 set_title 을 쓴다." });
      T(s, "tight_layout() 은 그림끼리 겹치지 않게 간격을 자동으로 잡아 준다.", { x: 0.5, y: 4.65, w: 9, h: 0.4, fontSize: 12, color: C.ink2 }); },
    (s) => practiceSlide(s, 27, [
      "「산점도 & 히스토그램 조립」 버튼 → 킬 수와 골드의 산점도를 그리는 코드가 나타난다.",
      "점 크기(20~80)와 투명도(0.2~0.8)를 고르고 「파라미터 적용」. 점이 겹칠 때 어느 쪽을 낮춰야 하는지 먼저 말한다.",
      "「파이프라인 실행」 → 킬 수 vs 골드 산점도. 점들이 오른쪽 위로 뻗는지 보고 28차시 상관계수를 예상해 본다.",
    ], [
      { q: "한 열의 분포를 볼 때 쓰는 함수는?", a: "답: plt.hist", mono: true },
      { q: "점이 까맣게 뭉칠 때 낮추는 옵션은?", a: "답: alpha (투명도)" },
    ]),
  ],
  wrapTitle: "관계는 scatter, 분포는 hist",
  wrap: ["plt.scatter(x, y, s=, alpha=) — 두 열이 같이 움직이나", "plt.hist(x, bins=) — 한 열이 어디에 몰렸나", "점이 뭉치면 alpha 를 0.3~0.5 로", "subplots(1, 2) 로 두 그림을 한 화면에"],
  next: "28차시 corr · heatmap — 관계를 숫자와 색으로",
};

S[28] = {
  no: 28, title: "상관계수 계산과 열화상 히트맵", sub: "어떤 열이 승리에 결정적인가 — −1에서 +1까지 숫자로, 빨강·파랑 지도로", funcs: ["df.corr()", "sns.heatmap()"],
  aice: "특성 선택 족보", note: "27차시 산점도를 숫자로 바꾼 것. 0.7 이상이면 강하다는 감각과, 상관≠인과를 같이 심는다.",
  slides: [
    (s) => { head(s, "오늘 배우면 AICE에서 이렇게 쓴다", 28);
      card(s, 0.5, 1.5, 4.35, 1.6, { title: "타깃과 친한 열 찾기", body: "df.corr()['승패'].sort_values() — 정답과 상관이 높은 열이 좋은 입력." });
      card(s, 5.15, 1.5, 4.35, 1.6, { title: "겹치는 열 걸러내기", body: "두 입력이 0.9 이상이면 사실상 같은 정보. 하나는 버린다(19차시 drop)." });
      card(s, 0.5, 3.3, 9, 1.7, { tone: "amber", title: "오늘 막을 사고", body: "corr() 는 숫자 열만 계산한다. 글자 열은 조용히 빠진다 — 21·22차시 인코딩을 먼저 하면 그 열도 상관을 볼 수 있다." }); },
    (s) => { head(s, "df.corr() — 열끼리의 상관계수 표", 28);
      codeBlock(s, "corr_matrix = df[['승률', '킬수', '골드', '피해량']].corr(method='pearson')\nprint(corr_matrix.round(2))", 0.5, 1.5, 5.6, 1.4, 11.5);
      outBlock(s, "        승률   킬수    골드   피해량\n승률   1.00  0.82  0.76  0.71\n킬수   0.82  1.00  0.88  0.91\n골드   0.76  0.88  1.00  0.85\n피해량  0.71  0.91  0.85  1.00", 0.5, 3.05, 5.6, 2.1, 9.5);
      card(s, 6.35, 1.5, 3.15, 3.65, { title: "읽는 법", body: "• +1 에 가까우면 같이 커진다\n• −1 에 가까우면 하나가 크면 하나는 작다\n• 0 근처면 관계 없음\n• 대각선은 자기 자신이라 언제나 1.00\n• 표가 대칭이다" }); },
    (s) => { head(s, "sns.heatmap — 표를 색으로", 28);
      codeBlock(s, "import seaborn as sns\nsns.heatmap(corr_matrix, annot=True, cmap='coolwarm', fmt='.2f')\nplt.title('변수 간 상관계수')\nplt.show()", 0.5, 1.5, 5.6, 1.9, 12);
      card(s, 0.5, 3.55, 5.6, 1.55, { tone: "green", title: "세 옵션만 기억", body: "annot=True 숫자 표시 · cmap='coolwarm' 빨강-파랑 · fmt='.2f' 소수 둘째 자리" });
      card(s, 6.35, 1.5, 3.15, 3.6, { title: "왜 색으로", body: "열이 20개면 표가 400칸이다. 숫자만 보면 못 찾는다.\n\n빨간 칸(높은 상관)만 눈으로 골라내면 되니 실기에서 시간을 아낀다." }); },
    (s) => { head(s, "값을 어떻게 판단하나", 28);
      const rows = [["|상관계수|", "해석", "실기에서 할 일"], ["0.0 ~ 0.3", "거의 관계 없음", "그 입력은 도움이 적다"], ["0.3 ~ 0.7", "어느 정도 관계", "쓸 만한 입력"], ["0.7 ~ 0.9", "강한 관계", "타깃과면 좋다 · 입력끼리면 주의"], ["0.9 이상", "사실상 같은 정보", "입력끼리면 하나 버린다"]];
      s.addTable(rows.map((r, ri) => r.map((c, ci) => ({ text: c, options: { bold: ri === 0 || ci === 0, fill: { color: ri === 0 ? C.indigoSoft : (ri % 2 ? "F8FAFC" : C.white) }, color: ri === 0 ? C.indigo : C.ink, fontFace: ci === 0 && ri > 0 ? MONO : KO, fontSize: 12, align: ci === 0 ? "center" : "left", valign: "middle" } }))),
        { x: 0.5, y: 1.5, w: 9, colW: [1.8, 3.2, 4], rowH: 0.52, border: { type: "solid", color: C.line, pt: 0.75 } });
      card(s, 0.5, 4.25, 9, 0.85, { tone: "red", title: "상관이 높다고 원인은 아니다 — 아이스크림 판매와 익사 사고는 같이 오른다(둘 다 여름)", body: null }); },
    (s) => { head(s, "흔한 실수 3가지", 28);
      numberRow(s, [
        { t: "글자 열이 빠진 줄 모름", d: "corr() 결과에 티어·포지션이 없다. 인코딩(21·22차시)을 먼저 하면 들어온다." },
        { t: "seaborn 미import", d: "sns 는 seaborn. import seaborn as sns 를 빠뜨리면 NameError." },
        { t: "절댓값을 안 봄", d: "−0.85 는 +0.85 만큼 강하다. 정렬할 때 .abs() 를 씌워 큰 순으로 본다." },
      ], 1.6);
      codeBlock(s, "print(df.corr()['승률'].abs().sort_values(ascending=False).head(4))\n# 승률 1.00 · 킬수 0.82 · 골드 0.76 · 피해량 0.71", 0.5, 3.4, 9, 1.7, 11.5); },
    (s) => { head(s, "AICE 실기 패턴 — 타깃과 친한 열 고르기", 28);
      codeBlock(s, "corr_target = df.corr()['승패'].abs().sort_values(ascending=False)\nprint(corr_target.head(6))\n\nweak = corr_target[corr_target < 0.1].index.tolist()   # 거의 무관한 열\ndf = df.drop(columns=weak)                              # 19차시\nprint('남은 열:', len(df.columns))", 0.5, 1.5, 5.6, 2.2, 11.5);
      outBlock(s, "승패     1.00\n킬수     0.68\n골드     0.61\n피해량    0.55\n남은 열: 5", 0.5, 3.8, 5.6, 1.35, 9.5);
      card(s, 6.35, 1.5, 3.15, 3.65, { title: "이것이 특성 선택", body: "38차시 특성 중요도가 모델이 판단한 순위라면, 오늘은 통계가 판단한 순위다. 둘이 대체로 비슷하게 나온다." }); },
    (s) => practiceSlide(s, 28, [
      "「corr & heatmap 파이프라인 조립」 버튼 → 네 열의 상관 행렬을 만들고 히트맵을 그리는 코드가 나타난다.",
      "숫자 표시(annot True·False)와 컬러맵(coolwarm·Blues)을 고르고 「파라미터 적용」. annot=False 로 바꾸면 무엇이 사라지는지 먼저 말한다.",
      "「파이프라인 실행」 → 상관계수 히트맵. 가장 빨간 칸(대각선 제외)을 찾아 그 두 열이 왜 닮았는지 짝과 이야기한다.",
    ], [
      { q: "상관계수가 1.00 인 대각선은 무엇인가?", a: "답: 자기 자신과의 상관" },
      { q: "입력 두 열의 상관이 0.95 이면?", a: "답: 같은 정보 — 하나를 버린다" },
    ]),
  ],
  wrapTitle: "corr 로 숫자, heatmap 으로 한눈에",
  wrap: ["df.corr() — 숫자 열끼리의 상관계수 표. 글자 열은 빠진다", "sns.heatmap(corr, annot=True, cmap='coolwarm', fmt='.2f')", "|0.7| 이상 강함, |0.9| 이상이면 입력 하나는 버린다", "상관은 관계일 뿐 원인이 아니다"],
  next: "29차시 boxplot · IQR — 이상치 잡아내기",
};

S[29] = {
  no: 29, title: "상자 그림과 이상치 탐지", sub: "평균 50% 방에 혼자 99% 가 끼면 평균이 망가진다 — 상자 밖으로 튄 점을 잡는다", funcs: ["sns.boxplot()", "IQR (1.5배)"],
  aice: "이상치 제거 공식", note: "14차시 75%·max 신호를 그림과 공식으로 확정한다. 사분위수 읽는 법이 오늘의 핵심.",
  slides: [
    (s) => { head(s, "오늘 배우면 AICE에서 이렇게 쓴다", 29);
      card(s, 0.5, 1.5, 4.35, 1.6, { title: "이상치 찾아 제거", body: "Q3 + 1.5×IQR 보다 큰 행을 지운다. 모델 성능이 눈에 띄게 오른다." });
      card(s, 5.15, 1.5, 4.35, 1.6, { title: "그룹별 분포 비교", body: "sns.boxplot(x='포지션', y='골드') — 포지션마다 상자를 나란히 그린다." });
      card(s, 0.5, 3.3, 9, 1.7, { tone: "amber", title: "오늘 막을 사고", body: "튄 값을 무조건 지우면 안 된다. 입력 오류(승률 990%)면 지우고, 진짜 고수(승률 85%)면 남긴다. 그림을 보고 판단한 뒤 지운다." }); },
    (s) => { head(s, "상자 그림 읽는 법", 29);
      const rows = [["부분", "뜻", "14차시 describe"], ["상자 아래", "Q1 — 아래에서 25% 지점", "25%"], ["상자 안 선", "중앙값 — 절반 지점", "50%"], ["상자 위", "Q3 — 아래에서 75% 지점", "75%"], ["수염 끝", "Q1−1.5×IQR ~ Q3+1.5×IQR", "—"], ["바깥 점", "이상치(outlier)", "max 가 여기 있으면 신호"]];
      s.addTable(rows.map((r, ri) => r.map((c, ci) => ({ text: c, options: { bold: ri === 0 || ci === 0, fill: { color: ri === 0 ? C.indigoSoft : (ri % 2 ? "F8FAFC" : C.white) }, color: ri === 0 ? C.indigo : C.ink, fontFace: KO, fontSize: 11.5, align: "left", valign: "middle" } }))),
        { x: 0.5, y: 1.5, w: 9, colW: [2.2, 4.3, 2.5], rowH: 0.48, border: { type: "solid", color: C.line, pt: 0.75 } });
      card(s, 0.5, 4.35, 9, 0.75, { title: "IQR = Q3 − Q1 — 가운데 절반이 퍼진 폭", body: null }); },
    (s) => { head(s, "sns.boxplot — 그려서 확인", 29);
      codeBlock(s, "import seaborn as sns\nsns.boxplot(data=df, y='골드획득량', whis=1.5)\nplt.title('골드 획득량 이상치 분포')\nplt.show()\n\n# 그룹별로 나란히\nsns.boxplot(data=df, x='포지션', y='골드획득량')", 0.5, 1.5, 5.6, 2.4, 11.5);
      card(s, 6.35, 1.5, 3.15, 3.65, { title: "기억할 것", body: "• y= 만 주면 전체 분포 하나\n• x= 를 주면 그룹별로 여러 상자\n• whis=1.5 가 기본 (수염 길이 배수)\n• whis 를 키우면 이상치로 잡히는 게 줄어든다\n• 점 하나하나가 한 행" }); },
    (s) => { head(s, "IQR 공식으로 직접 지우기", 29);
      codeBlock(s, "Q1 = df['골드'].quantile(0.25)\nQ3 = df['골드'].quantile(0.75)\nIQR = Q3 - Q1\nlow = Q1 - 1.5 * IQR\nhigh = Q3 + 1.5 * IQR\nprint(f'정상 범위: {low:.0f} ~ {high:.0f}')\n\nbefore = len(df)\ndf = df[(df['골드'] >= low) & (df['골드'] <= high)]\nprint(before, '→', len(df))", 0.5, 1.5, 5.6, 2.75, 11);
      outBlock(s, "정상 범위: 5550 ~ 15750\n5 → 5", 0.5, 4.35, 5.6, 0.8, 10);
      card(s, 6.35, 1.5, 3.15, 3.65, { title: "조건 두 개는 & 로", body: "and 가 아니라 &, 각 조건은 괄호로 감싼다. 판다스 규칙.\n\n지운 뒤 25차시 reset_index(drop=True) 를 잊지 않는다." }); },
    (s) => { head(s, "흔한 실수 3가지", 29);
      numberRow(s, [
        { t: "and 를 씀", d: "df[(a) and (b)] 는 에러. 판다스는 & (그리고) 와 | (또는). 각 조건에 괄호 필수." },
        { t: "무조건 삭제", d: "이상치가 전체의 10% 를 넘으면 지우지 말고 원인을 본다. 단위가 섞였거나(원/천원) 다른 집단일 수 있다." },
        { t: "정답 열의 이상치", d: "회귀 문제에서 y 의 극단값을 지우면 예측 범위가 좁아진다. 문제 지시를 따른다." },
      ], 1.6);
      codeBlock(s, "df = df[(df['골드'] >= low) & (df['골드'] <= high)].reset_index(drop=True)", 0.5, 3.4, 9, 1.7, 12); },
    (s) => { head(s, "AICE 실기 패턴 — 숫자 열 전부 점검", 29);
      codeBlock(s, "for col in df.select_dtypes(include='number').columns:\n    Q1, Q3 = df[col].quantile(0.25), df[col].quantile(0.75)\n    IQR = Q3 - Q1\n    n = ((df[col] < Q1 - 1.5 * IQR) | (df[col] > Q3 + 1.5 * IQR)).sum()\n    if n > 0:\n        print(f'{col}: 이상치 {n}개')", 0.5, 1.5, 5.6, 2.5, 11);
      outBlock(s, "골드: 12개\n피해량: 3개", 0.5, 4.15, 5.6, 1.0, 10.5);
      card(s, 6.35, 1.5, 3.15, 3.65, { title: "16차시와 같은 꼴", body: "isna().sum() 으로 결측을 세듯, 여기서는 이상치를 센다. 세고 나서 지울지 말지 정한다." }); },
    (s) => practiceSlide(s, 29, [
      "「boxplot 이상치 탐지 조립」 버튼 → 골드획득량의 상자 그림을 그리는 코드가 나타난다.",
      "수염 배율(whis 1.0~2.0)과 테마 색을 고르고 「파라미터 적용」. whis 를 2.0 으로 올리면 이상치 점이 늘지 줄지 먼저 말한다 (줄어든다).",
      "「파이프라인 실행」 → 사분위 상자와 바깥 점. 점이 몇 개인지 세어 보고 그 학생들이 '핵 유저' 인지 '입력 오류' 인지 이야기한다.",
    ], [
      { q: "IQR 은 무엇인가?", a: "답: Q3 − Q1 (가운데 절반의 폭)", mono: true },
      { q: "이상치 상한 공식은?", a: "답: Q3 + 1.5 × IQR", mono: true },
    ]),
  ],
  wrapTitle: "상자 밖 점이 이상치 — Q3 + 1.5×IQR",
  wrap: ["상자 = Q1·중앙값·Q3, 수염 끝 = ±1.5×IQR, 바깥 점 = 이상치", "sns.boxplot(data=df, y='열') · x= 를 주면 그룹별", "조건 결합은 & 와 | , 각 조건은 괄호", "지우기 전에 원인을 본다 — 오류면 삭제, 진짜면 유지"],
  next: "30차시 title · legend · savefig — 차트 서식 완성",
};

S[30] = {
  no: 30, title: "차트 서식 완성 및 고화질 내보내기", sub: "제목과 범례가 없는 차트는 0점 — 꾸미고 저장해 보고서를 완성한다", funcs: ["plt.title() · legend()", "plt.savefig()"],
  aice: "감점 방지", note: "Part 3 마무리. 26~29차시에서 그린 그림에 옷을 입히는 차시. 저장 옵션 두 개(dpi, bbox_inches)가 실무 팁.",
  slides: [
    (s) => { head(s, "오늘 배우면 AICE에서 이렇게 쓴다", 30);
      card(s, 0.5, 1.5, 4.35, 1.6, { title: "시각화 문제 만점", body: "제목·축 이름·범례까지 채점표에 있다. 그림이 맞아도 이름이 없으면 깎인다." });
      card(s, 5.15, 1.5, 4.35, 1.6, { title: "결과물 제출", body: "plt.savefig('eda.png', dpi=300) — 파일로 내라는 문제가 자주 나온다." });
      card(s, 0.5, 3.3, 9, 1.7, { tone: "amber", title: "오늘 막을 사고", body: "savefig 를 show() 뒤에 쓰면 빈 이미지가 저장된다. show() 가 그림을 비우기 때문. 순서는 반드시 savefig → show." }); },
    (s) => { head(s, "꾸미기 네 줄", 30);
      codeBlock(s, "plt.plot(df['회차'], df['승률'], label='실제 승률', color='#4f46e5')\nplt.plot(df['회차'], df['예측'], label='예측 승률', color='#f43f5e')\n\nplt.title('AICE 정예반 EDA 분석', fontsize=14, fontweight='bold')\nplt.xlabel('회차')\nplt.ylabel('승률(%)')\nplt.legend(loc='upper right')\nplt.show()", 0.5, 1.5, 5.6, 2.7, 11.5);
      card(s, 6.35, 1.5, 3.15, 3.65, { title: "범례가 나오는 조건", body: "그릴 때 label='이름' 을 주고, 나중에 plt.legend() 를 불러야 한다.\n\n둘 중 하나만 있으면 범례가 안 나온다 — 실기 단골." }); },
    (s) => { head(s, "legend(loc=) — 범례 위치", 30);
      codeBlock(s, "plt.legend(loc='upper right')    # 우측 상단 (기본)\nplt.legend(loc='upper left')     # 좌측 상단\nplt.legend(loc='lower right')    # 우측 하단\nplt.legend(loc='best')           # 겹치지 않는 곳으로 자동", 0.5, 1.5, 5.6, 1.9, 11.5);
      card(s, 0.5, 3.55, 5.6, 1.55, { tone: "green", title: "고르는 요령", body: "선이 오른쪽 위로 올라가면 범례는 왼쪽 위(upper left)로. 데이터를 가리지 않는 자리를 고른다. 모르겠으면 'best'." });
      card(s, 6.35, 1.5, 3.15, 3.6, { title: "자주 쓰는 값", body: "upper right\nupper left\nlower right\nlower left\ncenter\nbest\n\n따옴표 안 문자열이다." }); },
    (s) => { head(s, "savefig — 파일로 저장", 30);
      codeBlock(s, "plt.savefig('final_eda_report.png', dpi=300, bbox_inches='tight')\nplt.show()      # 저장한 뒤에 보여준다", 0.5, 1.5, 9, 1.3, 12);
      card(s, 0.5, 3.0, 4.35, 2.1, { title: "dpi — 해상도", body: "300 은 인쇄용 고화질, 100 은 웹 표준. 실기에서 지정해 주면 그대로, 없으면 300." });
      card(s, 5.15, 3.0, 4.35, 2.1, { tone: "green", title: "bbox_inches='tight'", body: "제목이나 축 이름이 잘리지 않게 여백을 자동으로 맞춘다. 안 쓰면 긴 라벨이 잘린 채 저장된다." }); },
    (s) => { head(s, "흔한 실수 3가지", 30);
      numberRow(s, [
        { t: "show() 뒤에 savefig", d: "빈 이미지가 저장된다. 순서는 savefig → show. 가장 흔한 사고." },
        { t: "label 없이 legend", d: "'No artists with labels found' 경고만 뜨고 범례가 안 나온다. 그릴 때 label= 을 준다." },
        { t: "파일 이름·확장자", d: "문제가 지정한 이름 그대로. .png 를 빼면 확장자 없는 파일이 생겨 채점기가 못 찾는다." },
      ], 1.6);
      codeBlock(s, "plt.savefig('eda.png', dpi=300, bbox_inches='tight')   # 먼저 저장\nplt.show()                                             # 그다음 표시", 0.5, 3.4, 9, 1.7, 12); },
    (s) => { head(s, "AICE 실기 패턴 — 완성된 차트 한 벌", 30);
      codeBlock(s, "import matplotlib.pyplot as plt\nplt.rc('font', family='Malgun Gothic')          # 26차시\n\nstat = df.groupby('포지션')['승률'].mean().reset_index()   # 24차시\nplt.figure(figsize=(7, 4))\nplt.bar(stat['포지션'], stat['승률'], color='#4f46e5', label='평균 승률')\nplt.title('포지션별 평균 승률', fontsize=14, fontweight='bold')\nplt.xlabel('포지션'); plt.ylabel('승률(%)')\nplt.legend(loc='upper right')\nplt.savefig('eda.png', dpi=300, bbox_inches='tight')\nplt.show()", 0.5, 1.5, 9, 3.1, 11);
      card(s, 0.5, 4.75, 9, 0.5, { tone: "green", title: "폰트 → 데이터 → 그리기 → 꾸미기 → 저장 → 표시. 이 순서를 손에 익힌다", body: null }); },
    (s) => practiceSlide(s, 30, [
      "「제목·범례 및 저장 서식 조립」 버튼 → 선 그래프에 제목·범례를 달고 savefig 로 저장하는 코드가 나타난다.",
      "제목 문구, 범례 위치(upper right·upper left·lower right), 해상도(300·100)를 고르고 「파라미터 적용」. dpi 300 과 100 의 차이를 먼저 말한다.",
      "「파이프라인 실행」 → 제목과 범례가 붙은 최종 차트. Part 3 에서 배운 네 가지 그림 중 무엇을 보고서에 쓸지 정해 본다.",
    ], [
      { q: "savefig 와 show 의 순서는?", a: "답: savefig 먼저, show 나중" },
      { q: "범례가 안 나올 때 빠진 것은?", a: "답: 그릴 때의 label='이름'", mono: true },
    ]),
  ],
  wrapTitle: "제목·축·범례를 달고 저장해야 끝난다",
  wrap: ["plt.title(…, fontsize=14) · xlabel · ylabel — 배점 항목", "label='이름' + plt.legend(loc='…') 이 한 쌍", "plt.savefig('파일.png', dpi=300, bbox_inches='tight') 를 show 앞에", "Part 3 끝 — 다음은 머신러닝(31차시 X·y 분리)"],
  next: "Part 4. 머신러닝 — 31차시 문제지(X)와 정답지(y) 분리",
};

/* ═══════════════ 두 덱 ═══════════════ */
const r1 = makeDeck(2, "판다스 3", "21~25차시 · 라벨 인코딩 · 원-핫 · 스케일링 · 그룹 집계 · 정렬", [S[21], S[22], S[23], S[24], S[25]]);
await r1.p.writeFile({ fileName: resolve(OUT, "판다스3_21-25차시.pptx") });
const r2 = makeDeck(3, "EDA 시각화", "26~30차시 · 막대 · 산점도와 히스토그램 · 히트맵 · 상자 그림 · 서식과 저장", [S[26], S[27], S[28], S[29], S[30]]);
await r2.p.writeFile({ fileName: resolve(OUT, "시각화_26-30차시.pptx") });
console.log(`PPTX 2개 생성 — 판다스3 ${r1.n}장 · 시각화 ${r2.n}장 → ${OUT}`);
