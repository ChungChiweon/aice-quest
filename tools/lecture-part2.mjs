/**
 * AICE 어소시에이트 실기 — Part 2 강의자료 (PPTX)
 *
 *   node tools/lecture-part2.mjs
 *   → 강의자료/판다스1_11-15차시.pptx · 판다스2_16-20차시.pptx
 *
 * 예제 데이터는 앱 퀘스트가 가정하는 lol_ranked_games.csv(승률·KDA·골드획득량…)로 통일한다.
 * 실행 결과는 5행짜리 작은 표를 직접 만들어 정확한 값으로 보여준다 — 학생이 따라 쳐도 같은 답이 나오게.
 * 실습 장의 3단계는 앱 그대로: STEP 1 코드 소환 → STEP 2 파라미터 적용 → STEP 3 실행·차트.
 */
import { resolve } from "node:path";
import { OUT, C, KO, MONO, T, chip, head, codeBlock, outBlock, card, numberRow, practiceSlide, makeDeck } from "./lecture-kit.mjs";

/* 다섯 차시가 공유하는 연습용 표 — 슬라이드마다 이걸 만들어 쓴다 */
const DF = "import pandas as pd\ndf = pd.DataFrame({\n    '티어': ['골드', '실버', '골드', '브론즈', '실버'],\n    '승률': [58, 47, 61, 39, 52],\n    'KDA': [3.2, 2.1, 3.8, 1.5, 2.6]\n})";
const DF_OUT = "    티어  승률  KDA\n0   골드  58  3.2\n1   실버  47  2.1\n2   골드  61  3.8\n3  브론즈  39  1.5\n4   실버  52  2.6";
const S = {};

S[11] = {
  no: 11, title: "CSV 파일 로드와 결과 저장", sub: "하드디스크의 표를 메모리로 읽고, 작업 뒤 index=False 로 깨끗하게 저장", funcs: ["pd.read_csv()", "df.to_csv()"],
  aice: "1번 문제 100%", note: "Part 2 시작. 실기 첫 문제는 언제나 read_csv. 마지막 저장에서 index=False 를 빼면 0점 — 이 한 줄이 오늘의 핵심.",
  slides: [
    (s) => { head(s, "오늘 배우면 AICE에서 이렇게 쓴다", 11);
      card(s, 0.5, 1.5, 4.35, 1.6, { title: "실기 1번 문제", body: "df = pd.read_csv('data.csv') — 시험지 첫 줄. 이게 안 되면 뒤가 전부 0점." });
      card(s, 5.15, 1.5, 4.35, 1.6, { title: "결과 제출", body: "df.to_csv('result.csv', index=False) — 정제한 표를 파일로. 채점기는 이 파일을 읽는다." });
      card(s, 0.5, 3.3, 9, 1.7, { tone: "amber", title: "오늘 막을 사고", body: "index=False 를 빼면 0, 1, 2… 순번 열이 파일에 같이 저장된다. 다음에 읽으면 'Unnamed: 0' 이라는 쓸모없는 열이 생기고, 채점기는 열 개수가 다르다고 0점 처리한다." }); },
    (s) => { head(s, "pd.read_csv() — 파일을 표(DataFrame)로 읽는다", 11);
      codeBlock(s, "import pandas as pd\ndf = pd.read_csv('lol_ranked_games.csv', encoding='utf-8')\nprint(type(df))\nprint(df.shape)       # (행, 열)\nprint(df.head(3))", 0.5, 1.5, 5.6, 2.1, 12.5);
      outBlock(s, "<class 'pandas.core.frame.DataFrame'>\n(1000, 6)\n   티어  승률  KDA  골드획득량  CS점수  피해량\n0  골드  58  3.2   12400   210  18500\n1  실버  47  2.1    9800   160  14200\n2  골드  61  3.8   13100   230  19900", 0.5, 3.75, 5.6, 1.4, 9);
      card(s, 6.35, 1.5, 3.15, 3.65, { title: "기억할 것", body: "• import pandas as pd 가 첫 줄\n• 파일 이름은 따옴표 안, 확장자까지\n• encoding='utf-8' 이 기본. 한글이 깨지면 'cp949'\n• 결과는 DataFrame — 행·열이 있는 표\n• 읽자마자 shape 와 head 로 확인" }); },
    (s) => { head(s, "df.to_csv() — 표를 파일로 저장한다", 11);
      codeBlock(s, "df.to_csv('result_clean.csv', index=False)   # 순번 열 제외\n\n# 확인: 다시 읽어 보면 열이 그대로다\ncheck = pd.read_csv('result_clean.csv')\nprint(check.columns.tolist())", 0.5, 1.5, 5.6, 1.7, 12.5);
      outBlock(s, "['티어', '승률', 'KDA', '골드획득량', 'CS점수', '피해량']", 0.5, 3.3, 5.6, 0.7, 11);
      codeBlock(s, "df.to_csv('bad.csv')            # index=False 를 뺐다\nprint(pd.read_csv('bad.csv').columns.tolist())\n# ['Unnamed: 0', '티어', '승률', …]  ← 쓰레기 열", 0.5, 4.1, 5.6, 1.05, 9.5);
      card(s, 6.35, 1.5, 3.15, 3.65, { tone: "green", title: "기억할 것", body: "• index=False — 순번 열을 저장하지 않는다\n• 파일 이름은 문제에서 시키는 그대로\n• encoding 은 읽을 때와 같게\n• 저장 뒤 다시 읽어 열 목록을 확인하는 습관" }); },
    (s) => { head(s, "인코딩 — 한글이 깨지는 유일한 이유", 11);
      codeBlock(s, "df = pd.read_csv('data.csv', encoding='utf-8')\n# UnicodeDecodeError: 'utf-8' codec can't decode …", 0.5, 1.5, 4.35, 1.4, 12);
      codeBlock(s, "df = pd.read_csv('data.csv', encoding='cp949')\n# 한글 윈도우(엑셀)가 저장한 파일은 이쪽", 5.15, 1.5, 4.35, 1.4, 12);
      card(s, 0.5, 3.1, 4.35, 2.0, { tone: "red", title: "utf-8 로 안 열리면", body: "에러 메시지에 'utf-8' 과 'decode' 가 보이면 파일이 cp949 다. 시험에서는 문제지에 인코딩을 알려 준다 — 그대로 쓴다." });
      card(s, 5.15, 3.1, 4.35, 2.0, { tone: "green", title: "둘 다 실패하면", body: "encoding='euc-kr' 또는 'latin1'. 실기에서는 거의 utf-8 아니면 cp949 둘 중 하나다." }); },
    (s) => { head(s, "흔한 실수 3가지", 11);
      numberRow(s, [
        { t: "index=False 누락", d: "가장 흔한 0점 사유. to_csv 를 쓸 때는 손이 자동으로 index=False 를 치게 만든다." },
        { t: "파일 이름·경로 오타", d: "FileNotFoundError. 문제지의 파일명을 복사해서 붙인다. 확장자 .csv 까지." },
        { t: "결과를 변수에 안 받음", d: "pd.read_csv('a.csv') 만 쓰면 읽고 버린다. df = 를 붙여야 표가 남는다." },
      ], 1.6);
      codeBlock(s, "df = pd.read_csv('lol_ranked_games.csv')       # 변수에 받는다\n# …전처리…\ndf.to_csv('result_clean.csv', index=False)     # 반드시 index=False", 0.5, 3.4, 9, 1.7, 12.5); },
    (s) => { head(s, "AICE 실기 패턴 — 시작과 끝", 11);
      codeBlock(s, "# [문제 1] 데이터를 읽어 df 에 저장하시오\nimport pandas as pd\ndf = pd.read_csv('data.csv')\n\n# … 문제 2~10: 전처리·모델 …\n\n# [마지막 문제] 결과를 result.csv 로 저장하시오 (인덱스 제외)\ndf.to_csv('result.csv', index=False)", 0.5, 1.5, 5.6, 2.9, 12);
      card(s, 6.35, 1.5, 3.15, 2.9, { title: "왜 이 둘부터인가", body: "실기 50분 중 첫 2분과 마지막 2분이 이 두 줄이다. 중간을 아무리 잘해도 이 둘이 틀리면 파일이 없거나 열이 어긋나 채점이 안 된다." });
      T(s, "오늘 이후 모든 차시의 코드는 'df 가 이미 읽혀 있다' 고 가정하고 시작한다.", { x: 0.5, y: 4.55, w: 9, h: 0.4, fontSize: 12.5, color: C.ink2 }); },
    (s) => practiceSlide(s, 11, [
      "「read_csv & to_csv 파이프라인 조립」 버튼 → 파일을 읽고 index=False 로 저장하는 네 줄이 나타난다.",
      "데이터셋(롤·쇼핑몰·넷플릭스), 인코딩(utf-8·cp949), index(False·True)를 고르고 「파라미터 적용」. index 를 True 로 바꾸면 코드가 어떻게 되는지 본다.",
      "「파이프라인 실행」 → 데이터셋별 행 수 비교 차트. 실습 뒤 index 는 반드시 False 로 되돌려 둔다.",
    ], [
      { q: "to_csv 에서 index=False 를 빼면 생기는 열 이름은?", a: "답: Unnamed: 0" },
      { q: "한글 파일이 utf-8 로 안 열릴 때 쓰는 인코딩은?", a: "답: cp949" },
    ]),
  ],
  wrapTitle: "read_csv 로 시작하고, to_csv(index=False) 로 끝낸다",
  wrap: ["df = pd.read_csv('파일.csv', encoding='utf-8') — 변수에 받는다", "한글이 깨지면 encoding='cp949'", "df.to_csv('결과.csv', index=False) — index=False 는 필수", "읽은 직후 shape·head, 저장 직후 다시 읽어 열 확인"],
  next: "12차시 head() vs tail() — 표의 위와 아래 엿보기",
};

S[12] = {
  no: 12, title: "상위권 vs 하위권 데이터 엿보기", sub: "수십만 행을 다 열면 노트북이 뻗는다 — 위에서 n개, 아래서 n개만", funcs: ["df.head()", "df.tail()"],
  aice: "시작 직후 훑기", note: "시험 시작하자마자 head(3). 열 이름과 값의 생김새를 눈으로 확인하는 습관을 오늘 심는다.",
  slides: [
    (s) => { head(s, "오늘 배우면 AICE에서 이렇게 쓴다", 12);
      card(s, 0.5, 1.5, 4.35, 1.6, { title: "데이터 첫인상", body: "df.head(3) — 열 이름, 값의 종류(글자/숫자), 이상한 값이 있는지 3초 만에 본다." });
      card(s, 5.15, 1.5, 4.35, 1.6, { title: "정렬 뒤 확인", body: "sort_values 한 뒤 head 는 상위권, tail 은 하위권. 25차시 정렬과 짝이다." });
      card(s, 0.5, 3.3, 9, 1.7, { tone: "amber", title: "오늘 막을 사고", body: "print(df) 로 전체를 찍으면 수만 행이 출력되어 노트북이 멈추거나 답을 못 찾는다. 항상 head/tail 로 잘라서 본다." }); },
    (s) => { head(s, "df.head(n) — 위에서 n행", 12);
      codeBlock(s, DF + "\nprint(df.head(3))\nprint(df.head())      # n 을 비우면 5행", 0.5, 1.5, 5.6, 2.4, 10.5);
      outBlock(s, "   티어  승률  KDA\n0  골드  58  3.2\n1  실버  47  2.1\n2  골드  61  3.8", 0.5, 4.05, 5.6, 1.1, 10);
      card(s, 6.35, 1.5, 3.15, 3.65, { title: "기억할 것", body: "• 괄호 안 숫자 = 행 수, 기본 5\n• 원본은 그대로, 잘라낸 '복사본' 을 돌려준다\n• 열 이름과 값 생김새를 보는 용도\n• 왼쪽 0, 1, 2 는 인덱스(행 번호)" }); },
    (s) => { head(s, "df.tail(n) — 아래에서 n행", 12);
      codeBlock(s, "print(df.tail(2))\n\n# 특정 열만 골라서 보기\nprint(df.tail(2)[['승률', 'KDA']])", 0.5, 1.5, 5.6, 1.8, 12.5);
      outBlock(s, "    티어  승률  KDA\n3  브론즈  39  1.5\n4   실버  52  2.6\n\n   승률  KDA\n3  39  1.5\n4  52  2.6", 0.5, 3.45, 5.6, 1.7, 9.5);
      card(s, 6.35, 1.5, 3.15, 3.65, { tone: "green", title: "기억할 것", body: "• 마지막 행들 — 파일 끝에 합계 줄이나 쓰레기 줄이 붙어 있는지 확인하는 용도\n• 인덱스가 3, 4 로 유지된다 (0부터 다시 세지 않는다)\n• [['열', '열']] 대괄호 두 겹 = 열 여러 개" }); },
    (s) => { head(s, "head · tail · sample — 세 가지 엿보기", 12);
      const rows = [["", "head(n)", "tail(n)", "sample(n)"], ["어디서", "맨 위", "맨 아래", "무작위"], ["언제", "열·값 생김새 확인", "끝에 이상한 줄 확인", "치우침 없이 훑기"], ["기본 n", "5", "5", "1"]];
      s.addTable(rows.map((r, ri) => r.map((c, ci) => ({ text: c, options: { bold: ri === 0 || ci === 0, fill: { color: ri === 0 ? C.indigoSoft : (ri % 2 ? "F8FAFC" : C.white) }, color: ri === 0 ? C.indigo : C.ink, fontFace: ri === 0 && ci > 0 ? MONO : KO, fontSize: 12.5, align: ci === 0 ? "left" : "center", valign: "middle" } }))),
        { x: 0.5, y: 1.5, w: 9, colW: [2, 2.33, 2.33, 2.34], rowH: 0.5, border: { type: "solid", color: C.line, pt: 0.75 } });
      card(s, 0.5, 3.75, 9, 1.35, { tone: "amber", title: "시험 시작 30초 루틴", body: "df.shape → df.head(3) → df.info()  (13차시)  — 이 셋을 찍고 나서 문제를 읽기 시작한다." }); },
    (s) => { head(s, "흔한 실수 3가지", 12);
      numberRow(s, [
        { t: "괄호 빼먹기", d: "df.head 는 함수 자체를 가리킨다. df.head() 처럼 괄호까지 써야 실행된다." },
        { t: "head 결과를 원본으로 착각", d: "df.head(3) 은 복사본. df 는 여전히 전체. 3행만 쓰려면 top = df.head(3) 으로 받는다." },
        { t: "print 없이 두 개", d: "노트북 셀에서 df.head(); df.tail() 을 쓰면 마지막 것만 보인다. 둘 다 보려면 print()." },
      ], 1.6);
      codeBlock(s, "top = df.head(3)          # 복사본을 변수에\nprint(len(df), len(top))  # 5 3  ← 원본은 그대로", 0.5, 3.4, 9, 1.7, 12.5); },
    (s) => { head(s, "AICE 실기 패턴 — 상위·하위 비교", 12);
      codeBlock(s, "ranked = df.sort_values('승률', ascending=False)   # 25차시\ntop = ranked.head(2)\nbottom = ranked.tail(2)\nprint('상위 평균 승률:', top['승률'].mean())\nprint('하위 평균 승률:', bottom['승률'].mean())", 0.5, 1.5, 5.6, 2.3, 12);
      outBlock(s, "상위 평균 승률: 59.5\n하위 평균 승률: 43.0", 0.5, 3.95, 5.6, 1.15, 11);
      card(s, 6.35, 1.5, 3.15, 3.6, { title: "앱 12차시 차트가 이것", body: "상위 n명 vs 하위 n명 평균 승률 격차. n 을 키우면 격차가 줄어든다 — 평균이 가운데로 모이니까." }); },
    (s) => practiceSlide(s, 12, [
      "「head & tail 미리보기 코드 조립」 버튼 → 상위 n·하위 n 행의 승률·KDA 를 찍는 코드가 나타난다.",
      "head n(3~10)·tail n(3~10)을 슬라이더로 정하고 「파라미터 적용」. n 을 키우면 상·하위 평균 격차가 어떻게 될지 먼저 말한다.",
      "「파이프라인 실행」 → 상위 n명 vs 하위 n명 평균 승률 막대. n=3 과 n=10 을 비교해 본다.",
    ], [
      { q: "df.head() 의 기본 행 수는?", a: "답: 5", mono: true },
      { q: "df.tail(2) 의 인덱스는 0, 1 로 나오나?", a: "답: 아니오 — 원래 번호(3, 4)가 유지된다" },
    ]),
  ],
  wrapTitle: "전체를 찍지 말고 head·tail 로 잘라 본다",
  wrap: ["df.head(n) — 위에서 n행, 기본 5. 열 이름과 값 생김새 확인", "df.tail(n) — 아래서 n행. 끝에 붙은 이상한 줄 확인", "둘 다 복사본 — 원본 df 는 그대로", "시작 루틴: shape → head(3) → info()"],
  next: "13차시 df.info() vs df.shape — 데이터 건강검진",
};

S[13] = {
  no: 13, title: "데이터 구조 크기와 자료형 진단", sub: "shape 로 몇 행 몇 열인지 재고, info 로 빈칸과 자료형을 엑스레이 찍는다", funcs: ["df.info()", "df.shape"],
  aice: "결측 컬럼 특정", note: "info 출력의 Non-Null Count 를 읽는 법이 오늘의 전부. 이걸 읽어야 16~18차시 결측치 처리가 된다.",
  slides: [
    (s) => { head(s, "오늘 배우면 AICE에서 이렇게 쓴다", 13);
      card(s, 0.5, 1.5, 4.35, 1.6, { title: "결측치 있는 열 찾기", body: "df.info() 의 Non-Null Count 가 행 수보다 작은 열 = 구멍 난 열. 16차시 처리 대상." });
      card(s, 5.15, 1.5, 4.35, 1.6, { title: "숫자인 척하는 글자 찾기", body: "Dtype 이 object 인데 숫자 열이면 20차시 astype 대상. 모델에 못 넣는다." });
      card(s, 0.5, 3.3, 9, 1.7, { tone: "amber", title: "오늘 막을 사고", body: "info 를 안 찍고 바로 모델을 만들면 'could not convert string to float' 에러. 원인은 object 열 하나. info 한 번이면 시작 전에 보인다." }); },
    (s) => { head(s, "df.shape — (행, 열) 크기", 13);
      codeBlock(s, DF + "\nprint(df.shape)        # (5, 3)\nprint(df.shape[0])     # 5  행 수\nprint(df.shape[1])     # 3  열 수\nprint(len(df))         # 5  행 수 (3차시 len)", 0.5, 1.5, 5.6, 2.3, 10.5);
      outBlock(s, "(5, 3)\n5\n3\n5", 0.5, 3.9, 5.6, 1.25, 10);
      card(s, 6.35, 1.5, 3.15, 3.65, { title: "기억할 것", body: "• 괄호가 없다 — 함수가 아니라 속성\n• (행, 열) 순서. 튜플이라 [0] [1] 로 꺼낸다\n• 10차시 넘파이 shape 와 같은 것\n• 전처리 전후로 찍어 행이 몇 개 줄었는지 센다" }); },
    (s) => { head(s, "df.info() — 열마다 개수와 자료형", 13);
      codeBlock(s, "df.loc[1, 'KDA'] = None      # 구멍 하나 만들기\ndf.info()", 0.5, 1.5, 5.6, 1.1, 12.5);
      outBlock(s, "RangeIndex: 5 entries, 0 to 4\nData columns (total 3 columns):\n #   Column  Non-Null Count  Dtype\n---  ------  --------------  -----\n 0   티어      5 non-null      object\n 1   승률      5 non-null      int64\n 2   KDA     4 non-null      float64", 0.5, 2.75, 5.6, 2.4, 9.5);
      card(s, 6.35, 1.5, 3.15, 3.65, { tone: "green", title: "읽는 법", body: "• entries 5 = 행 수\n• Non-Null Count 가 5보다 작은 열 = 결측치 있음 → KDA 에 1개\n• Dtype: int64·float64 숫자, object 글자\n• print 없이 df.info() 만 써도 출력된다" }); },
    (s) => { head(s, "info 한 장으로 다음 차시 할 일이 정해진다", 13);
      const rows = [["info 에서 보이는 것", "뜻", "어디서 처리"], ["Non-Null < entries", "그 열에 결측치(NaN)", "16·17·18차시 isna·dropna·fillna"], ["Dtype object 인 숫자 열", "'100' 처럼 글자로 굳은 숫자", "20차시 astype"], ["Dtype object 인 범주 열", "티어·포지션 같은 글자", "21·22차시 인코딩"], ["entries 가 예상보다 적음", "읽을 때 행이 빠짐", "11차시 read_csv 옵션 확인"]];
      s.addTable(rows.map((r, ri) => r.map((c, ci) => ({ text: c, options: { bold: ri === 0, fill: { color: ri === 0 ? C.indigoSoft : (ri % 2 ? "F8FAFC" : C.white) }, color: ri === 0 ? C.indigo : C.ink, fontFace: ci === 0 && ri > 0 ? MONO : KO, fontSize: 12, align: "left", valign: "middle" } }))),
        { x: 0.5, y: 1.5, w: 9, colW: [3, 3, 3], rowH: 0.52, border: { type: "solid", color: C.line, pt: 0.75 } });
      T(s, "info 는 진단서다. 처방(처리)은 뒤 차시에서 — 오늘은 읽을 줄만 알면 된다.", { x: 0.5, y: 4.35, w: 9, h: 0.4, fontSize: 12.5, color: C.ink2 }); },
    (s) => { head(s, "흔한 실수 3가지", 13);
      numberRow(s, [
        { t: "shape 에 괄호", d: "df.shape() → TypeError. shape 는 속성이라 괄호 없음. 반대로 info 는 함수라 괄호 필수." },
        { t: "print(df.info())", d: "info 는 화면에 직접 찍고 None 을 돌려준다. print 로 싸면 마지막에 None 이 하나 더 찍힐 뿐이다." },
        { t: "Non-Null 을 결측 수로 착각", d: "Non-Null Count 는 '정상' 개수다. 결측 수 = entries − Non-Null. 4 non-null 이면 결측 1." },
      ], 1.6);
      codeBlock(s, "print(df.shape)    # 속성 — 괄호 없음\ndf.info()          # 함수 — 괄호 있음, print 불필요", 0.5, 3.4, 9, 1.7, 12.5); },
    (s) => { head(s, "AICE 실기 패턴 — 시작 30초 진단", 13);
      codeBlock(s, "df = pd.read_csv('data.csv')\nprint(df.shape)                   # 크기\nprint(df.head(3))                 # 생김새\ndf.info()                         # 구멍·자료형\nprint(df.select_dtypes(include='number').columns.tolist())   # 숫자 열만", 0.5, 1.5, 5.6, 2.3, 11.5);
      outBlock(s, "['승률', 'KDA']", 0.5, 3.95, 5.6, 0.8, 11);
      card(s, 6.35, 1.5, 3.15, 3.25, { title: "select_dtypes", body: "include='number' 로 숫자 열만, include='object' 로 글자 열만 골라낸다. 앱 13차시 코드 마지막 줄이 이것 — 숫자 열 개수를 센다." }); },
    (s) => practiceSlide(s, 13, [
      "「info & shape 진단 코드 조립」 버튼 → shape 를 찍고 info 를 부르고 숫자 열 개수를 세는 코드가 나타난다.",
      "verbose(True·False)와 집중 검사 타입(전체·수치형·범주형)을 고르고 「파라미터 적용」. verbose=False 면 info 가 무엇을 생략할지 먼저 말한다.",
      "「파이프라인 실행」 → 수치형 vs 문자열 열 구성비 차트. 문자열 열이 왜 모델에 바로 못 들어가는지 짝과 이야기한다.",
    ], [
      { q: "df.shape 가 (1000, 6) 이면 행·열은?", a: "답: 1000행 6열", mono: true },
      { q: "entries 1000, 어떤 열이 955 non-null 이면 결측치는?", a: "답: 45개" },
    ]),
  ],
  wrapTitle: "shape 로 크기, info 로 구멍과 자료형",
  wrap: ["df.shape — (행, 열). 괄호 없음. len(df) 는 행 수", "df.info() — 열마다 Non-Null Count 와 Dtype. 괄호 있음, print 불필요", "Non-Null < entries 이면 결측치. object 인 숫자 열은 형변환 대상", "시작 루틴: shape → head(3) → info()"],
  next: "14차시 describe() vs value_counts() — 숫자 요약과 글자 빈도",
};

S[14] = {
  no: 14, title: "수치 요약 통계와 카테고리 빈도", sub: "숫자 열은 평균·최댓값·사분위수로 압축, 글자 열은 '골드 몇 명, 실버 몇 명' 으로 센다", funcs: ["df.describe()", "value_counts()"],
  aice: "이상치 눈치채기", note: "describe 의 75% 와 max 차이로 이상치를 눈치채는 게 오늘의 팁. 29차시 상자그림과 이어진다.",
  slides: [
    (s) => { head(s, "오늘 배우면 AICE에서 이렇게 쓴다", 14);
      card(s, 0.5, 1.5, 4.35, 1.6, { title: "이상치 감지", body: "describe() 에서 75% 는 61 인데 max 가 990 이면 극단값이 있다. 29차시에서 그림으로 확인." });
      card(s, 5.15, 1.5, 4.35, 1.6, { title: "불균형 확인", body: "value_counts() 로 승/패가 900:100 이면 불균형 데이터 — 37차시 F1-Score 가 필요한 이유." });
      card(s, 0.5, 3.3, 9, 1.7, { tone: "amber", title: "오늘 막을 사고", body: "describe() 는 숫자 열만 요약한다. 글자 열(티어)이 안 보인다고 당황하지 말 것 — 글자 열은 value_counts 로 센다. 둘은 짝이다." }); },
    (s) => { head(s, "df.describe() — 숫자 열 요약 통계", 14);
      codeBlock(s, DF + "\nprint(df.describe())", 0.5, 1.5, 5.6, 1.75, 10.5);
      outBlock(s, "          승률       KDA\ncount   5.000000  5.000000\nmean   51.400000  2.640000\nstd     8.734987  0.893308\nmin    39.000000  1.500000\n25%    47.000000  2.100000\n50%    52.000000  2.600000\n75%    58.000000  3.200000\nmax    61.000000  3.800000", 0.5, 3.35, 5.6, 1.8, 8);
      card(s, 6.35, 1.5, 3.15, 3.65, { title: "여덟 줄 읽기", body: "• count 개수 · mean 평균 · std 표준편차\n• min 최소 · max 최대\n• 25% 50% 75% — 줄 세웠을 때 1/4, 절반, 3/4 지점\n• 50% 가 중앙값(median)\n• 글자 열(티어)은 빠진다" }); },
    (s) => { head(s, "value_counts() — 글자 열의 값별 개수", 14);
      codeBlock(s, "print(df['티어'].value_counts())\nprint(df['티어'].value_counts(normalize=True))   # 비율", 0.5, 1.5, 5.6, 1.4, 12.5);
      outBlock(s, "티어\n골드     2\n실버     2\n브론즈    1\nName: count, dtype: int64\n\n티어\n골드     0.4\n실버     0.4\n브론즈    0.2", 0.5, 3.05, 5.6, 2.1, 9.5);
      card(s, 6.35, 1.5, 3.15, 3.65, { tone: "green", title: "기억할 것", body: "• 열 하나에 붙인다: df['열'].value_counts()\n• 많은 순으로 정렬돼 나온다\n• normalize=True 면 개수 대신 비율(합 1.0)\n• 승/패 열에 쓰면 클래스 불균형이 바로 보인다" }); },
    (s) => { head(s, "describe 로 이상치 눈치채기", 14);
      codeBlock(s, "df2 = df.copy()\ndf2.loc[4, '승률'] = 990          # 잘못 입력된 값\nprint(df2['승률'].describe()[['mean', '50%', '75%', 'max']])", 0.5, 1.5, 5.6, 1.5, 12);
      outBlock(s, "mean    239.0\n50%      58.0\n75%      61.0\nmax     990.0", 0.5, 3.15, 5.6, 1.3, 10.5);
      card(s, 6.35, 1.5, 3.15, 2.95, { tone: "red", title: "신호", body: "75% 는 61 인데 max 가 990 — 3/4 지점까지 61 이하였다는 뜻이니 990 은 혼자 튀는 값. 평균(239)이 중앙값(58)과 크게 벌어진 것도 같은 신호." });
      T(s, "승률이 990% 일 수는 없다. 이상치는 29차시 상자그림으로 그리고, 지우거나 바로잡는다.", { x: 0.5, y: 4.6, w: 9, h: 0.4, fontSize: 12.5, color: C.ink2 }); },
    (s) => { head(s, "흔한 실수 3가지", 14);
      numberRow(s, [
        { t: "value_counts 를 df 에", d: "df.value_counts() 는 행 전체 조합을 센다. 열 하나를 골라 df['열'].value_counts()." },
        { t: "describe 에 글자 열 기대", d: "글자 열은 기본으로 빠진다. 보고 싶으면 df.describe(include='object') — count·unique·top·freq 가 나온다." },
        { t: "50% 와 mean 혼동", d: "50% 는 중앙값(가운데 값), mean 은 평균. 이상치가 있으면 둘이 크게 달라진다." },
      ], 1.6);
      codeBlock(s, "print(df.describe(include='object'))   # 글자 열 요약\n#        티어\n# count    5\n# unique   3\n# top     골드\n# freq     2", 0.5, 3.4, 9, 1.7, 11); },
    (s) => { head(s, "AICE 실기 패턴 — 타깃 분포 확인", 14);
      codeBlock(s, "print(df['승패'].value_counts())            # 개수\nprint(df['승패'].value_counts(normalize=True).round(2))   # 비율\n\n# 승 0.9 / 패 0.1 처럼 치우쳐 있으면 → 정확도 대신 F1 (37차시)", 0.5, 1.5, 5.6, 1.9, 12);
      outBlock(s, "승패\n승    900\n패    100\n\n승패\n승    0.9\n패    0.1", 0.5, 3.55, 5.6, 1.6, 9.5);
      card(s, 6.35, 1.5, 3.15, 3.65, { title: "왜 먼저 보나", body: "정답이 90% 가 '승' 이면, 무조건 '승' 이라고 찍는 모델도 정확도 90% 다. value_counts 한 줄이 그 함정을 미리 알려 준다." }); },
    (s) => practiceSlide(s, 14, [
      "「describe & value_counts 코드 조립」 버튼 → 요약 통계와 범주 빈도를 찍는 코드가 나타난다.",
      "빈도를 셀 열(티어·포지션·승패), 백분위(0.1/0.9 등), normalize(False·True)를 고르고 「파라미터 적용」. normalize=True 면 숫자가 어떻게 바뀔지 먼저 말한다.",
      "「파이프라인 실행」 → 고른 열의 항목별 빈도 막대. 가장 많은 항목과 가장 적은 항목의 비를 말해 본다.",
    ], [
      { q: "describe() 의 50% 줄은 무엇인가?", a: "답: 중앙값(median)" },
      { q: "value_counts(normalize=True) 의 합은?", a: "답: 1.0", mono: true },
    ]),
  ],
  wrapTitle: "숫자는 describe, 글자는 value_counts",
  wrap: ["df.describe() — count·mean·std·min·25%·50%·75%·max. 숫자 열만", "df['열'].value_counts() — 값별 개수, 많은 순. normalize=True 면 비율", "75% 와 max 가 크게 벌어지면 이상치 신호", "실기 패턴: 타깃 열 value_counts 로 불균형 먼저 확인"],
  next: "15차시 loc vs iloc — 이름표로 집기 vs 번호로 자르기",
};

S[15] = {
  no: 15, title: "이름표 인덱싱 vs 컴퓨터 번호 슬라이싱", sub: "'승률, KDA 열 줘' 는 loc, '0번째부터 5번째 줄 줘' 는 iloc", funcs: ["df.loc[]", "df.iloc[]"],
  aice: "X = df.iloc[:, :-1]", note: "실기에서 가장 많이 틀리는 곳. loc 은 이름·끝 포함, iloc 은 번호·끝 미포함 — 이 두 줄만 남기면 된다.",
  slides: [
    (s) => { head(s, "오늘 배우면 AICE에서 이렇게 쓴다", 15);
      card(s, 0.5, 1.5, 4.35, 1.6, { title: "문제지(X)와 정답(y) 분리", body: "X = df.iloc[:, :-1] — 마지막 열만 빼고 전부. y = df.iloc[:, -1]. 31차시 첫 줄." });
      card(s, 5.15, 1.5, 4.35, 1.6, { title: "열 이름으로 골라내기", body: "df.loc[:, ['승률', 'KDA']] — 이름을 알 때. 시험 문제는 보통 열 이름을 준다." });
      card(s, 0.5, 3.3, 9, 1.7, { tone: "amber", title: "오늘 막을 사고", body: "loc 의 범위는 끝을 포함하고(0:2 → 3행), iloc 은 포함하지 않는다(0:2 → 2행). 같은 숫자를 써도 결과 행 수가 다르다 — 시험에서 한 행이 빠지거나 남는 원인." }); },
    (s) => { head(s, "df.loc[행, 열] — 이름표로 집는다", 15);
      codeBlock(s, DF + "\nprint(df.loc[0:2, ['승률', 'KDA']])   # 인덱스 0~2 (2 포함!)\nprint(df.loc[df['승률'] >= 55, '티어'])   # 조건으로", 0.5, 1.5, 5.6, 2.15, 10);
      outBlock(s, "   승률  KDA\n0  58  3.2\n1  47  2.1\n2  61  3.8\n\n0    골드\n2    골드", 0.5, 3.75, 5.6, 1.4, 9);
      card(s, 6.35, 1.5, 3.15, 3.65, { title: "기억할 것", body: "• 대괄호 [ ] — 함수가 아니다\n• [행 이름, 열 이름] 순서\n• 0:2 는 0, 1, 2 — 끝 포함\n• : 하나면 전부\n• 조건식(불리언)도 행 자리에 들어간다" }); },
    (s) => { head(s, "df.iloc[행번호, 열번호] — 순번으로 자른다", 15);
      codeBlock(s, "print(df.iloc[0:2, 0:3])      # 0,1행 × 0,1,2열 (끝 미포함)\nprint(df.iloc[:, :-1])        # 전부 × 마지막 열 빼고\nprint(df.iloc[-1, 1])         # 마지막 행, 두 번째 열 값", 0.5, 1.5, 5.6, 1.7, 12);
      outBlock(s, "   티어  승률  KDA\n0  골드  58  3.2\n1  실버  47  2.1\n\n    티어  승률\n0   골드  58\n…\n52", 0.5, 3.35, 5.6, 1.8, 9);
      card(s, 6.35, 1.5, 3.15, 3.65, { tone: "green", title: "기억할 것", body: "• i = integer, 번호는 0부터\n• 0:2 는 0, 1 — 끝 미포함 (파이썬 슬라이싱과 같다)\n• -1 은 마지막. :-1 은 마지막 빼고 전부\n• 열 이름을 몰라도, 열이 몇 개든 :-1 이면 된다" }); },
    (s) => { head(s, "같은 0:2 인데 결과가 다르다", 15);
      codeBlock(s, "df.loc[0:2, '승률']\n# 0    58\n# 1    47\n# 2    61   ← 3행. 이름 0~2 포함", 0.5, 1.5, 4.35, 1.8, 12.5);
      codeBlock(s, "df.iloc[0:2, 1]\n# 0    58\n# 1    47      ← 2행. 번호 0,1 만", 5.15, 1.5, 4.35, 1.8, 12.5);
      card(s, 0.5, 3.5, 4.35, 1.6, { title: "loc = 이름표, 끝 포함", body: "행 인덱스가 0,1,2… 여도 그건 '이름' 이다. 열도 이름(문자)으로 쓴다." });
      card(s, 5.15, 3.5, 4.35, 1.6, { tone: "green", title: "iloc = 번호, 끝 미포함", body: "리스트 슬라이싱과 똑같이 센다. 열도 번호(0, 1, 2)로 쓴다." }); },
    (s) => { head(s, "흔한 실수 3가지", 15);
      numberRow(s, [
        { t: "iloc 에 열 이름", d: "df.iloc[:, '승률'] → 에러. iloc 은 번호만. 이름을 쓰려면 loc." },
        { t: "대괄호 대신 소괄호", d: "df.loc(0, '승률') 은 함수 호출이 아니다. 반드시 df.loc[0, '승률']." },
        { t: "열 하나를 대괄호 한 겹으로", d: "df.loc[:, '승률'] 은 Series(한 줄), df.loc[:, ['승률']] 은 DataFrame(표). 모델 X 는 표여야 한다." },
      ], 1.6);
      codeBlock(s, "X = df.iloc[:, :-1]       # 표 (2차원) — 마지막 열 제외\ny = df.iloc[:, -1]        # Series (1차원) — 마지막 열", 0.5, 3.4, 9, 1.7, 12.5); },
    (s) => { head(s, "AICE 실기 패턴 — X, y 분리 두 가지 방법", 15);
      codeBlock(s, "# 방법 1: 번호로 — 마지막 열이 정답일 때\nX = df.iloc[:, :-1]\ny = df.iloc[:, -1]\n\n# 방법 2: 이름으로 — 정답 열 이름을 알 때\nX = df.drop(columns=['승패'])      # 19차시\ny = df['승패']\nprint(X.shape, y.shape)", 0.5, 1.5, 5.6, 2.9, 12);
      outBlock(s, "(1000, 5) (1000,)", 0.5, 4.55, 5.6, 0.6, 11);
      card(s, 6.35, 1.5, 3.15, 3.65, { title: "31차시에서 다시", body: "train_test_split(X, y) 에 그대로 넣는다. X 가 (행, 열) 2차원, y 가 (행,) 1차원인 것을 shape 로 확인하는 습관." }); },
    (s) => practiceSlide(s, 15, [
      "「loc & iloc 인덱싱 코드 조립」 버튼 → loc 으로 열 두 개, iloc 으로 행·열 번호를 자르는 코드가 나타난다.",
      "loc 열 A·B(승률·KDA·골드획득량·CS점수·피해량)와 iloc 행 수(3~15)를 고르고 「파라미터 적용」. iloc[0:6] 이 몇 행인지 먼저 말한다 (6행, 0~5).",
      "「파이프라인 실행」 → 고른 두 열의 평균 비교 막대. 열을 바꿔 가며 어느 지표가 큰지 본다.",
    ], [
      { q: "df.loc[0:3] 과 df.iloc[0:3] 의 행 수는?", a: "답: 4행과 3행", mono: true },
      { q: "마지막 열만 빼고 전부 고르는 iloc 식은?", a: "답: df.iloc[:, :-1]", mono: true },
    ]),
  ],
  wrapTitle: "이름이면 loc(끝 포함), 번호면 iloc(끝 미포함)",
  wrap: ["df.loc[행이름, 열이름] — 대괄호. 0:2 는 3행. 조건식도 됨", "df.iloc[행번호, 열번호] — 0:2 는 2행. -1 은 마지막", "열 하나 [ ] 는 Series, [[ ]] 는 DataFrame", "실기 패턴: X = df.iloc[:, :-1], y = df.iloc[:, -1]"],
  next: "판다스 2 — 16차시 isna() vs notna() — 구멍 찾기",
};

S[16] = {
  no: 16, title: "결측치(구멍) 탐색과 총합 집계", sub: "구멍(NaN)이 있으면 모델은 즉사한다 — isna 로 형광펜, .sum() 으로 개수", funcs: ["df.isna()", "df.notna()"],
  aice: "isna().sum() 족보", note: "13차시 info 로 '어느 열' 인지 봤다면, 오늘은 '몇 개' 인지. isna().sum() 한 줄이 전부.",
  slides: [
    (s) => { head(s, "오늘 배우면 AICE에서 이렇게 쓴다", 16);
      card(s, 0.5, 1.5, 4.35, 1.6, { title: "결측치 개수 세기", body: "df.isna().sum() — 열마다 구멍이 몇 개인지 한 줄. 삭제할지 채울지는 이 숫자를 보고 정한다." });
      card(s, 5.15, 1.5, 4.35, 1.6, { title: "정상 데이터 개수", body: "df['열'].notna().sum() — 반대로 멀쩡한 게 몇 개인지. 둘을 더하면 행 수." });
      card(s, 0.5, 3.3, 9, 1.7, { tone: "amber", title: "오늘 막을 사고", body: "결측치를 모른 채 fit 하면 'Input contains NaN' 으로 모델이 멈춘다. 17차시(삭제)·18차시(채우기) 어느 쪽이든, 오늘 세는 게 먼저다." }); },
    (s) => { head(s, "df.isna() — 구멍이면 True", 16);
      codeBlock(s, "import numpy as np\ndf = pd.DataFrame({'나이': [23, np.nan, 31, 27, np.nan],\n                   '소득': [300, 280, np.nan, 350, 310]})\nprint(df.isna())", 0.5, 1.5, 5.6, 1.8, 11);
      outBlock(s, "      나이     소득\n0  False  False\n1   True  False\n2  False   True\n3  False  False\n4   True  False", 0.5, 3.45, 5.6, 1.7, 9.5);
      card(s, 6.35, 1.5, 3.15, 3.65, { title: "기억할 것", body: "• NaN = Not a Number, 빈칸\n• isna() 는 같은 모양의 True/False 표\n• True 는 1 이라서 더할 수 있다 → 다음 장\n• isnull() 은 완전히 같은 함수" }); },
    (s) => { head(s, ".sum() 을 붙이면 개수가 된다", 16);
      codeBlock(s, "print(df.isna().sum())          # 열별 결측 개수\nprint(df.isna().sum().sum())    # 전체 결측 개수\nprint(df['나이'].notna().sum())  # 나이 열 정상 개수", 0.5, 1.5, 5.6, 1.6, 12.5);
      outBlock(s, "나이    2\n소득    1\ndtype: int64\n3\n3", 0.5, 3.25, 5.6, 1.9, 10.5);
      card(s, 6.35, 1.5, 3.15, 3.65, { tone: "green", title: "기억할 것", body: "• True 를 1 로 세니 sum 이 곧 개수\n• .sum() 한 번 = 열별, 두 번 = 전체\n• notna() 는 반대 — 정상 개수\n• isna().sum() + notna().sum() = 행 수 (5)" }); },
    (s) => { head(s, "결측 비율 — 삭제할지 채울지 정하는 기준", 16);
      codeBlock(s, "ratio = df.isna().mean()        # True 의 비율\nprint(ratio)\nprint((ratio * 100).round(1))    # 퍼센트로", 0.5, 1.5, 5.6, 1.4, 12.5);
      outBlock(s, "나이    0.4\n소득    0.2\ndtype: float64\n나이    40.0\n소득    20.0", 0.5, 3.05, 5.6, 1.4, 10.5);
      card(s, 6.35, 1.5, 3.15, 2.95, { title: "대략의 기준", body: "• 몇 % 이하 → 행을 지워도 됨 (17차시)\n• 수십 % → 채운다 (18차시)\n• 절반 넘음 → 열 자체를 버린다 (19차시)\n시험은 문제가 방법을 정해 준다." });
      T(s, "mean() 은 True 의 평균 = 비율. 앱 16차시 '백분율' 옵션이 이것이다.", { x: 0.5, y: 4.6, w: 9, h: 0.4, fontSize: 12.5, color: C.ink2 }); },
    (s) => { head(s, "흔한 실수 3가지", 16);
      numberRow(s, [
        { t: "== None 으로 비교", d: "df['나이'] == None 은 전부 False. NaN 은 == 로 못 찾는다. 반드시 isna()." },
        { t: "sum 안 붙이고 보기", d: "df.isna() 만 찍으면 True/False 표가 수천 행. 개수를 보려면 .sum()." },
        { t: "빈 문자열은 결측이 아님", d: "'' 나 ' ' 는 NaN 이 아니라 글자다. isna 에 안 잡힌다. replace('', np.nan) 으로 바꿔야 한다." },
      ], 1.6);
      codeBlock(s, "df['나이'].isna()          # 맞음\ndf['나이'] == np.nan        # 틀림 — 전부 False\ndf['나이'] == None          # 틀림 — 전부 False", 0.5, 3.4, 9, 1.7, 12.5); },
    (s) => { head(s, "AICE 실기 패턴 — 결측 열 목록 뽑기", 16);
      codeBlock(s, "missing = df.isna().sum()\nmissing = missing[missing > 0]          # 0 인 열은 빼고\nprint(missing.sort_values(ascending=False))\n\ncols_to_fix = missing.index.tolist()\nprint('처리할 열:', cols_to_fix)", 0.5, 1.5, 5.6, 2.3, 12);
      outBlock(s, "나이    2\n소득    1\ndtype: int64\n처리할 열: ['나이', '소득']", 0.5, 3.95, 5.6, 1.2, 10.5);
      card(s, 6.35, 1.5, 3.15, 3.65, { title: "왜 목록으로 뽑나", body: "18차시에서 for col in cols_to_fix: 로 돌며 채운다. 열이 30개여도 결측 있는 열만 골라 처리하니 코드가 짧아진다." }); },
    (s) => practiceSlide(s, 16, [
      "「isna & notna 결측치 스캔 조립」 버튼 → 열별 결측 총합과 타깃 열 정상 개수를 찍는 코드가 나타난다.",
      "검사 열(나이 45·소득 80·플레이시간 20)과 집계 방식(개수·백분율)을 고르고 「파라미터 적용」. 행이 1000이면 소득의 결측 비율이 몇 % 인지 먼저 말한다 (8%).",
      "「파이프라인 실행」 → 열별 결측 수량 막대. 가장 큰 열을 17·18차시에서 어떻게 할지 짝과 정해 본다.",
    ], [
      { q: "df.isna().sum().sum() 은 무엇을 세나?", a: "답: 표 전체의 결측치 개수", mono: true },
      { q: "NaN 을 == 로 찾을 수 있나?", a: "답: 없다 — isna() 로 찾는다" },
    ]),
  ],
  wrapTitle: "isna 로 찾고 sum 으로 센다",
  wrap: ["df.isna() — 구멍이면 True 인 같은 모양의 표. == 로는 못 찾는다", "df.isna().sum() — 열별 개수, .sum().sum() — 전체, .mean() — 비율", "notna() 는 반대. 둘을 더하면 행 수", "실기 패턴: missing[missing > 0].index 로 처리할 열 목록"],
  next: "17차시 dropna() — 구멍 난 행 지우기, 단 subset 으로 정밀하게",
};

S[17] = {
  no: 17, title: "구멍 난 행 통째로 삭제하기", sub: "구멍 난 줄은 버린다 — 단, 아무 생각 없이 다 버리면 데이터가 반토막", funcs: ["df.dropna()", "subset=['col']"],
  aice: "타깃 열 결측 삭제", note: "dropna() 를 옵션 없이 쓰면 안 되는 이유를 숫자로 보여 준다. subset 이 오늘의 핵심.",
  slides: [
    (s) => { head(s, "오늘 배우면 AICE에서 이렇게 쓴다", 17);
      card(s, 0.5, 1.5, 4.35, 1.6, { title: "정답(타깃) 열 결측", body: "정답이 없는 행은 학습에 못 쓴다. df.dropna(subset=['승패']) 로 그 행만 지운다." });
      card(s, 5.15, 1.5, 4.35, 1.6, { title: "결측이 아주 적을 때", body: "1000행 중 3행이면 채우는 것보다 지우는 게 깔끔하다. 16차시 비율을 보고 결정." });
      card(s, 0.5, 3.3, 9, 1.7, { tone: "amber", title: "오늘 막을 사고", body: "df.dropna() 를 옵션 없이 쓰면 '어느 열이든 하나라도 비면' 행을 지운다. 열이 20개면 절반이 사라진다 — 데이터 손실 감점. 반드시 subset 으로 열을 지정한다." }); },
    (s) => { head(s, "df.dropna() — 옵션 없이 쓰면 이렇게 된다", 17);
      codeBlock(s, "df = pd.DataFrame({'나이': [23, np.nan, 31, 27, np.nan],\n                   '소득': [300, 280, np.nan, 350, 310],\n                   '승패': ['승', '패', '승', np.nan, '승']})\nclean = df.dropna()\nprint(len(df), '→', len(clean))\nprint(clean)", 0.5, 1.5, 5.6, 2.3, 11);
      outBlock(s, "5 → 1\n    나이    소득 승패\n0  23.0  300.0  승", 0.5, 3.95, 5.6, 1.2, 10.5);
      card(s, 6.35, 1.5, 3.15, 3.65, { tone: "red", title: "다섯 줄 중 한 줄만 남았다", body: "행마다 어느 열이든 NaN 이 하나만 있어도 지운다. 실제 데이터에서는 90% 가 날아가기도 한다. 이게 '반토막' 사고." }); },
    (s) => { head(s, "subset=['열'] — 그 열이 빈 행만 지운다", 17);
      codeBlock(s, "clean = df.dropna(subset=['승패'])       # 정답이 없는 행만\nprint(len(df), '→', len(clean))\nprint(clean)", 0.5, 1.5, 5.6, 1.4, 12.5);
      outBlock(s, "5 → 4\n    나이    소득 승패\n0  23.0  300.0  승\n1   NaN  280.0  패\n2  31.0    NaN  승\n4   NaN  310.0  승", 0.5, 3.05, 5.6, 2.1, 9.5);
      card(s, 6.35, 1.5, 3.15, 3.65, { tone: "green", title: "기억할 것", body: "• subset 은 리스트 — 열 여러 개도 됨\n• 지정한 열 기준으로만 판단\n• 나머지 열의 NaN 은 그대로 남는다 → 18차시에서 채운다\n• 결과는 새 표. 원본은 그대로" }); },
    (s) => { head(s, "how='any' vs how='all'", 17);
      codeBlock(s, "df.dropna(subset=['나이', '소득'], how='any')\n# 나이·소득 중 하나라도 비면 삭제 → 1, 2, 4행 삭제", 0.5, 1.5, 4.35, 1.4, 12);
      codeBlock(s, "df.dropna(subset=['나이', '소득'], how='all')\n# 나이·소득이 둘 다 비어야 삭제 → 삭제 없음", 5.15, 1.5, 4.35, 1.4, 12);
      card(s, 0.5, 3.1, 4.35, 2.0, { title: "any = 하나라도 (기본값)", body: "엄격하다. 지정한 열 중 하나라도 NaN 이면 그 행을 버린다." });
      card(s, 5.15, 3.1, 4.35, 2.0, { tone: "green", title: "all = 전부", body: "관대하다. 지정한 열이 전부 NaN 일 때만 버린다. 거의 빈 행을 걸러낼 때." }); },
    (s) => { head(s, "흔한 실수 3가지", 17);
      numberRow(s, [
        { t: "결과를 안 받음", d: "df.dropna(subset=['승패']) 만 쓰면 df 는 그대로. df = df.dropna(…) 로 받거나 inplace=True." },
        { t: "subset 에 문자열", d: "subset='승패' 도 동작은 하지만 리스트가 정석. 열 두 개면 반드시 ['a', 'b']." },
        { t: "인덱스가 비게 됨", d: "삭제 뒤 인덱스가 0, 1, 2, 4 로 빈다. 25차시 reset_index(drop=True) 로 다시 매긴다." },
      ], 1.6);
      codeBlock(s, "df = df.dropna(subset=['승패']).reset_index(drop=True)\nprint(df.index.tolist())    # [0, 1, 2, 3]", 0.5, 3.4, 9, 1.7, 12.5); },
    (s) => { head(s, "AICE 실기 패턴 — 타깃은 지우고, 입력은 채운다", 17);
      codeBlock(s, "# 1) 정답이 없는 행은 학습 불가 → 삭제\ndf = df.dropna(subset=['승패'])\n\n# 2) 입력 열의 결측은 지우지 말고 채운다 (18차시)\ndf['나이'] = df['나이'].fillna(df['나이'].mean())\n\nprint(df.isna().sum())", 0.5, 1.5, 5.6, 2.4, 12);
      outBlock(s, "나이    0\n소득    1\n승패    0", 0.5, 4.05, 5.6, 1.1, 10.5);
      card(s, 6.35, 1.5, 3.15, 3.65, { title: "왜 나누나", body: "정답이 없으면 그 행은 아무 정보도 못 준다 → 삭제. 입력 하나가 비었다고 행을 버리면 나머지 열의 정보까지 잃는다 → 채운다." }); },
    (s) => practiceSlide(s, 17, [
      "「dropna 정밀 삭제 파이프라인 조립」 버튼 → subset 과 how 를 넣은 dropna 와 전후 행 수를 찍는 코드가 나타난다.",
      "삭제 기준 열(나이·소득·승패결과)과 how(any·all)를 고르고 「파라미터 적용」. 16차시 결측 수(45·80·…)로 남을 행 수를 먼저 계산한다.",
      "「파이프라인 실행」 → 삭제 전 vs 후 행 수 막대. 기준 열을 소득으로 바꾸면 얼마나 더 줄어드는지 본다.",
    ], [
      { q: "df.dropna() 를 옵션 없이 쓰면 어떤 행이 지워지나?", a: "답: 어느 열이든 NaN 이 하나라도 있는 행 전부" },
      { q: "'승패' 열이 빈 행만 지우는 코드는?", a: "답: df.dropna(subset=['승패'])", mono: true },
    ]),
  ],
  wrapTitle: "dropna 는 반드시 subset 과 함께",
  wrap: ["df.dropna() 단독 — 하나라도 비면 삭제. 데이터 반토막", "df.dropna(subset=['열']) — 그 열이 빈 행만. how='all' 이면 전부 비어야", "결과를 df = 로 받는다. 삭제 뒤 reset_index(drop=True)", "실기 패턴: 타깃 열 결측은 지우고, 입력 열 결측은 채운다"],
  next: "18차시 fillna() — 구멍을 평균·중앙값으로 채우기",
};

S[18] = {
  no: 18, title: "결측치 채우기 (평균값 vs 중앙값)", sub: "데이터 하나가 소중하다 — 빈칸에 평균이나 중앙값을 채워 복구", funcs: ["df.fillna()", "mean() / median()"],
  aice: "100% 암기 코드", note: "df['나이'] = df['나이'].fillna(df['나이'].mean()) — 이 한 줄을 외우게 하는 게 목표. 평균 vs 중앙값 선택 기준은 이상치.",
  slides: [
    (s) => { head(s, "오늘 배우면 AICE에서 이렇게 쓴다", 18);
      card(s, 0.5, 1.5, 4.35, 1.6, { title: "숫자 열 결측 채우기", body: "df['나이'] = df['나이'].fillna(df['나이'].mean()) — 실기 빈출 1위. 그대로 외운다." });
      card(s, 5.15, 1.5, 4.35, 1.6, { title: "글자 열 결측 채우기", body: "최빈값: df['티어'].fillna(df['티어'].mode()[0]) — 가장 많은 값으로." });
      card(s, 0.5, 3.3, 9, 1.7, { tone: "amber", title: "오늘 막을 사고", body: "이상치가 있는 열을 평균으로 채우면 엉뚱한 값이 들어간다 (14차시 990 기억). 그럴 땐 중앙값(median). 문제가 지정해 주면 그대로, 아니면 이 기준으로 고른다." }); },
    (s) => { head(s, "fillna(값) — 빈칸을 그 값으로", 18);
      codeBlock(s, "df = pd.DataFrame({'나이': [23, np.nan, 31, 27, np.nan]})\nfill_val = df['나이'].mean()\nprint('평균:', fill_val)\ndf['나이'] = df['나이'].fillna(fill_val)\nprint(df['나이'].tolist())", 0.5, 1.5, 5.6, 2.1, 11.5);
      outBlock(s, "평균: 27.0\n[23.0, 27.0, 31.0, 27.0, 27.0]", 0.5, 3.75, 5.6, 1.4, 11);
      card(s, 6.35, 1.5, 3.15, 3.65, { title: "기억할 것", body: "• mean() 은 NaN 을 빼고 계산한다 (23+31+27)/3\n• fillna 는 새 열을 돌려준다 → 다시 대입\n• 채운 뒤 isna().sum() 이 0 인지 확인\n• 앱 18차시 코드가 정확히 이 세 줄" }); },
    (s) => { head(s, "평균 vs 중앙값 — 이상치가 있으면 중앙값", 18);
      codeBlock(s, "s = pd.Series([23, 25, 27, np.nan, 990])   # 990 은 오타\nprint('mean  :', s.mean())\nprint('median:', s.median())", 0.5, 1.5, 5.6, 1.4, 12.5);
      outBlock(s, "mean  : 266.25\nmedian: 26.0", 0.5, 3.05, 5.6, 1.0, 11);
      card(s, 0.5, 4.2, 5.6, 0.9, { tone: "red", title: "NaN 을 266 으로 채우면 나이가 266살이 된다", body: null });
      card(s, 6.35, 1.5, 3.15, 3.6, { tone: "green", title: "고르는 기준", body: "• 이상치 없음 → mean\n• 이상치 있음 / 치우침 → median\n• 글자 열 → mode()[0] (최빈값)\n• 0 이 의미 있는 열(구매수량) → fillna(0)\n\n14차시 describe 의 75%·max 로 판단" }); },
    (s) => { head(s, "열마다 다른 값으로 한 번에", 18);
      codeBlock(s, "df = pd.DataFrame({'나이': [23, np.nan, 31], '소득': [300, np.nan, 350], '티어': ['골드', np.nan, '실버']})\ndf['나이'] = df['나이'].fillna(df['나이'].median())\ndf['소득'] = df['소득'].fillna(df['소득'].mean())\ndf['티어'] = df['티어'].fillna(df['티어'].mode()[0])\nprint(df)", 0.5, 1.5, 9, 2.0, 11.5);
      outBlock(s, "    나이     소득  티어\n0  23.0  300.0  골드\n1  27.0  325.0  골드\n2  31.0  350.0  실버", 0.5, 3.65, 9, 1.45, 10.5); },
    (s) => { head(s, "흔한 실수 3가지", 18);
      numberRow(s, [
        { t: "대입을 안 함", d: "df['나이'].fillna(27) 만 쓰면 아무것도 안 바뀐다. df['나이'] = … 로 받는다 (inplace=True 도 가능하나 경고가 뜬다)." },
        { t: "mode() 에 [0] 누락", d: "mode() 는 Series 를 돌려준다 (최빈값이 여럿일 수 있어서). 값 하나를 쓰려면 mode()[0]." },
        { t: "전체 df.fillna(0)", d: "글자 열까지 0 이 들어간다. 열마다 맞는 값으로 따로 채운다." },
      ], 1.6);
      codeBlock(s, "df['나이'] = df['나이'].fillna(df['나이'].mean())    # 대입까지가 한 문장\nprint(df['나이'].isna().sum())                     # 0 확인", 0.5, 3.4, 9, 1.7, 12.5); },
    (s) => { head(s, "AICE 실기 패턴 — 결측 열 목록을 돌며 채우기", 18);
      codeBlock(s, "num_cols = df.select_dtypes(include='number').columns    # 13차시\nfor col in num_cols:\n    if df[col].isna().sum() > 0:                            # 16차시\n        df[col] = df[col].fillna(df[col].median())\n\nobj_cols = df.select_dtypes(include='object').columns\nfor col in obj_cols:\n    df[col] = df[col].fillna(df[col].mode()[0])\n\nprint(df.isna().sum().sum())    # 0", 0.5, 1.5, 5.6, 3.3, 11);
      card(s, 6.35, 1.5, 3.15, 3.3, { title: "13 · 16 · 18 이 한 코드", body: "select_dtypes 로 열을 나누고(13), isna 로 골라(16), fillna 로 채운다(18). 열이 몇 개든 같은 코드." });
      T(s, "마지막 줄이 0 이어야 모델에 넣을 수 있다.", { x: 0.5, y: 4.95, w: 9, h: 0.3, fontSize: 12.5, color: C.ink2 }); },
    (s) => practiceSlide(s, 18, [
      "「fillna 대치 파이프라인 조립」 버튼 → 통계값을 구해 fillna 로 채우고 결과를 찍는 세 줄이 나타난다.",
      "대상 열(나이·소득·플레이시간)과 방법(mean·median·0)을 고르고 「파라미터 적용」. mean 과 median 중 어느 쪽이 이상치에 강한지 먼저 말한다.",
      "「파이프라인 실행」 → 채우기 전후 완성도 차트(100% 복구). 방법을 바꿔도 완성도는 같다 — 값만 다르다는 걸 짚는다.",
    ], [
      { q: "이상치가 있는 열의 결측은 mean 과 median 중?", a: "답: median" },
      { q: "글자 열의 결측을 최빈값으로 채우는 식은?", a: "답: df['열'].fillna(df['열'].mode()[0])", mono: true },
    ]),
  ],
  wrapTitle: "fillna 는 '무엇으로' 가 전부 — mean · median · mode · 0",
  wrap: ["df['열'] = df['열'].fillna(df['열'].mean()) — 대입까지 한 문장", "이상치 있으면 median, 글자 열은 mode()[0], 0 이 의미 있으면 0", "채운 뒤 isna().sum().sum() 이 0 인지 확인", "실기 패턴: select_dtypes 로 나눠 for 문으로 전부 채운다"],
  next: "19차시 drop(axis=1) · rename — 열 버리기와 이름 바꾸기",
};

S[19] = {
  no: 19, title: "불필요한 열 삭제와 컬럼명 변경", sub: "주민번호·ID 는 학습에 방해만 된다 — drop 으로 버리고 rename 으로 알기 쉽게", funcs: ["df.drop(axis=1)", "df.rename()"],
  aice: "axis=1 필수", note: "axis=1 을 빼면 행이 날아간다 — 이 대참사 하나만 막으면 된다. columns= 를 쓰면 axis 를 안 써도 된다는 것도.",
  slides: [
    (s) => { head(s, "오늘 배우면 AICE에서 이렇게 쓴다", 19);
      card(s, 0.5, 1.5, 4.35, 1.6, { title: "ID·이름 열 제거", body: "유저ID 같은 고유값은 예측에 도움이 안 되고 모델을 헷갈리게 한다. df = df.drop(columns=['유저ID'])." });
      card(s, 5.15, 1.5, 4.35, 1.6, { title: "X, y 분리 (방법 2)", body: "X = df.drop(columns=['승패']) — 정답 열만 뺀 나머지가 입력. 15차시에서 본 것." });
      card(s, 0.5, 3.3, 9, 1.7, { tone: "amber", title: "오늘 막을 사고", body: "df.drop('유저ID') 처럼 axis 를 빼면 '유저ID 라는 행' 을 찾다가 KeyError, 혹은 0번 행이 사라진다. 열을 지울 땐 axis=1 또는 columns= 를 쓴다." }); },
    (s) => { head(s, "df.drop(columns=[…]) — 열을 버린다", 19);
      codeBlock(s, DF.replace("'티어': ", "'유저ID': ['u01', 'u02', 'u03', 'u04', 'u05'],\n    '티어': ") + "\ndf = df.drop(columns=['유저ID'])       # 방법 1\n# df = df.drop('유저ID', axis=1)        # 방법 2 (같은 뜻)\nprint(df.columns.tolist())", 0.5, 1.5, 5.6, 2.7, 10);
      outBlock(s, "['티어', '승률', 'KDA']", 0.5, 4.35, 5.6, 0.75, 11);
      card(s, 6.35, 1.5, 3.15, 3.6, { title: "기억할 것", body: "• columns=['a', 'b'] — 리스트로 여러 개\n• axis=0 은 행, axis=1 은 열. columns= 를 쓰면 axis 불필요\n• 결과를 df = 로 받는다\n• 없는 열이면 KeyError → errors='ignore'" }); },
    (s) => { head(s, "df.rename(columns={옛: 새}) — 이름을 바꾼다", 19);
      codeBlock(s, "df = df.rename(columns={'승률': 'win_rate', 'KDA': 'kda'})\nprint(df.columns.tolist())\n\n# 전부 한 번에 바꾸기 (개수가 같아야 한다)\ndf.columns = ['tier', 'win_rate', 'kda']", 0.5, 1.5, 5.6, 2.0, 12);
      outBlock(s, "['티어', 'win_rate', 'kda']", 0.5, 3.65, 5.6, 0.75, 11);
      card(s, 6.35, 1.5, 3.15, 3.65, { tone: "green", title: "기억할 것", body: "• 중괄호 딕셔너리 {'옛이름': '새이름'}\n• 없는 이름은 조용히 무시된다 — 오타를 조심\n• 시험은 '열 이름을 ○○로 바꾸시오' 를 그대로 rename 으로\n• df.columns = 리스트 는 전체 교체" }); },
    (s) => { head(s, "axis=0 과 axis=1 — 한 번 보면 안 헷갈린다", 19);
      codeBlock(s, "df.drop(0, axis=0)          # 0번 행 삭제 (기본값)\ndf.drop(index=[0, 1])       # 0, 1번 행 삭제", 0.5, 1.5, 4.35, 1.3, 12);
      codeBlock(s, "df.drop('KDA', axis=1)      # KDA 열 삭제\ndf.drop(columns=['KDA'])    # 같은 뜻, 더 분명", 5.15, 1.5, 4.35, 1.3, 12);
      card(s, 0.5, 3.0, 4.35, 2.1, { title: "axis=0 = 행 방향 (위아래)", body: "인덱스 번호로 행을 지운다. 이상치 행을 지울 때 (29차시)." });
      card(s, 5.15, 3.0, 4.35, 2.1, { tone: "green", title: "axis=1 = 열 방향 (좌우)", body: "열 이름으로 열을 지운다. 실기에서 drop 은 거의 이쪽. columns= 를 쓰면 방향 실수가 없다." }); },
    (s) => { head(s, "흔한 실수 3가지", 19);
      numberRow(s, [
        { t: "axis 누락", d: "df.drop('KDA') → KeyError: 'KDA' (행에서 찾는다). columns=['KDA'] 로 쓰면 이 실수가 사라진다." },
        { t: "결과를 안 받음", d: "drop·rename 모두 새 표를 돌려준다. df = df.drop(…) 이 아니면 df 는 그대로." },
        { t: "rename 오타", d: "{'승율': 'win'} 처럼 옛 이름을 틀리면 에러 없이 아무것도 안 바뀐다. 바꾼 뒤 columns 를 찍어 확인." },
      ], 1.6);
      codeBlock(s, "df = df.drop(columns=['유저ID'])               # 받는다\ndf = df.rename(columns={'승률': 'win_rate'})   # 받는다\nprint(df.columns.tolist())                     # 확인한다", 0.5, 3.4, 9, 1.7, 12.5); },
    (s) => { head(s, "AICE 실기 패턴 — 입력 열 정리", 19);
      codeBlock(s, "# 예측에 쓸 수 없는 열 제거: 식별자, 정답 누설 열\ndrop_cols = ['유저ID', '가입일', '결제금액_사후']\ndf = df.drop(columns=drop_cols, errors='ignore')\n\n# 정답 분리\ny = df['승패']\nX = df.drop(columns=['승패'])\nprint(X.shape, y.shape)", 0.5, 1.5, 5.6, 2.8, 12);
      outBlock(s, "(1000, 5) (1000,)", 0.5, 4.45, 5.6, 0.65, 11);
      card(s, 6.35, 1.5, 3.15, 3.6, { title: "무엇을 버리나", body: "• 고유 ID — 행마다 다 달라 규칙이 없다\n• 정답을 미리 알려주는 열 — 시험에선 '누설'\n• 결측이 절반 넘는 열 (16차시)\nerrors='ignore' 는 없는 열이어도 에러 없이." }); },
    (s) => practiceSlide(s, 19, [
      "「drop & rename 컬럼 가공 조립」 버튼 → 열 하나를 지우고 old_score 를 새 이름으로 바꾸는 코드가 나타난다.",
      "지울 열(유저_고유ID·주민번호_해시·가입IP주소)과 새 이름(최종실기점수 등)을 고르고 「파라미터 적용」. 남을 열 목록을 먼저 말한다.",
      "「파이프라인 실행」 → 남은 핵심 열 비중 차트. 지운 열이 왜 예측에 쓸모없는지 한 줄로 설명해 본다.",
    ], [
      { q: "열 'KDA' 를 지우는 두 가지 식은?", a: "답: df.drop('KDA', axis=1) / df.drop(columns=['KDA'])", mono: true },
      { q: "rename 에서 옛 이름을 틀리면?", a: "답: 에러 없이 아무것도 안 바뀐다 — 확인 필요" },
    ]),
  ],
  wrapTitle: "열은 columns= 로 지우고, 이름은 딕셔너리로 바꾼다",
  wrap: ["df.drop(columns=['열']) — axis=1 과 같다. 행은 index=", "df.rename(columns={'옛': '새'}) — 오타는 조용히 무시된다", "둘 다 df = 로 받고, columns 를 찍어 확인", "실기 패턴: ID·누설 열 drop → X = df.drop(columns=['타깃'])"],
  next: "20차시 astype · to_datetime — 굳은 글자를 숫자·날짜로",
};

S[20] = {
  no: 20, title: "데이터 타입 강제 형변환과 무결성", sub: "숫자가 글자로 굳어 있거나 날짜가 문자열일 때 — astype 과 to_datetime", funcs: ["df.astype()", "pd.to_datetime()"],
  aice: "모델 입력 에러 방지", note: "2차시 int/float 의 판다스 버전. 13차시 info 에서 object 였던 숫자 열을 오늘 고친다. Part 2 전반부 마무리.",
  slides: [
    (s) => { head(s, "오늘 배우면 AICE에서 이렇게 쓴다", 20);
      card(s, 0.5, 1.5, 4.35, 1.6, { title: "object 숫자 열 고치기", body: "info 에서 '나이' 가 object 면 df['나이'] = df['나이'].astype('int32'). 안 고치면 fit 에서 에러." });
      card(s, 5.15, 1.5, 4.35, 1.6, { title: "날짜 열 만들기", body: "pd.to_datetime(df['date']) 로 바꿔야 연·월·요일을 뽑아 파생변수를 만든다." });
      card(s, 0.5, 3.3, 9, 1.7, { tone: "amber", title: "오늘 막을 사고", body: "astype('int') 는 결측(NaN)이 있으면 실패한다 (NaN 은 실수). 18차시로 먼저 채우거나 'float' 로 바꾼다. 순서: 결측 처리 → 형변환." }); },
    (s) => { head(s, "astype('타입') — 열 전체를 한 번에 바꾼다", 20);
      codeBlock(s, "df = pd.DataFrame({'나이': ['23', '31', '27'], '구매수량': ['2', '5', '1']})\nprint(df.dtypes)\ndf['나이'] = df['나이'].astype('int32')\ndf['구매수량'] = df['구매수량'].astype('int32')\nprint(df.dtypes)\nprint(df['나이'].mean())        # 이제 계산이 된다", 0.5, 1.5, 5.6, 2.25, 11);
      outBlock(s, "나이      object\n구매수량    object\n나이      int32\n구매수량    int32\n27.0", 0.5, 3.85, 5.6, 1.3, 9.5);
      card(s, 6.35, 1.5, 3.15, 3.65, { title: "기억할 것", body: "• 2차시 int() 의 열 버전\n• 'int32' 'int64' 'float32' 'float64' 'str'\n• object = 글자. 계산이 안 된다\n• 결과를 다시 대입\n• 바꾼 뒤 dtypes 로 확인" }); },
    (s) => { head(s, "pd.to_datetime() — 글자를 날짜로", 20);
      codeBlock(s, "df = pd.DataFrame({'date': ['2026-03-01', '2026-03-15', '없음']})\ndf['date'] = pd.to_datetime(df['date'], errors='coerce')\nprint(df['date'])\nprint(df['date'].dt.month)        # 월만 뽑기", 0.5, 1.5, 5.6, 1.9, 11.5);
      outBlock(s, "0   2026-03-01\n1   2026-03-15\n2          NaT\nName: date, dtype: datetime64[ns]\n0    3.0\n1    3.0\n2    NaN", 0.5, 3.55, 5.6, 1.6, 9.5);
      card(s, 6.35, 1.5, 3.15, 3.65, { tone: "green", title: "기억할 것", body: "• errors='coerce' — 못 바꾸는 값은 NaT(날짜의 NaN)로. 없으면 에러로 멈춤\n• 바꾸고 나면 .dt.year .dt.month .dt.dayofweek 로 파생변수\n• 글자 그대로면 '2026-03' 비교·정렬이 안 된다" }); },
    (s) => { head(s, "결측이 있는 열은 int 로 못 바꾼다", 20);
      codeBlock(s, "s = pd.Series(['23', None, '31'])\ns.astype('int32')\n# ValueError: cannot convert float NaN to integer", 0.5, 1.5, 4.35, 1.4, 11.5);
      codeBlock(s, "s = s.fillna('0').astype('int32')     # 먼저 채운다\n# 또는\ns = pd.to_numeric(s, errors='coerce')  # float 로, 못 바꾸면 NaN", 5.15, 1.5, 4.35, 1.4, 11.5);
      card(s, 0.5, 3.1, 4.35, 2.0, { tone: "red", title: "왜 안 되나", body: "NaN 은 실수(float)다. 정수 열에는 NaN 이 들어갈 자리가 없다. 그래서 int 변환이 거부된다." });
      card(s, 5.15, 3.1, 4.35, 2.0, { tone: "green", title: "순서", body: "16 isna → 18 fillna → 20 astype. 결측을 먼저 처리하고 형을 바꾼다. 급하면 float 로 바꾸면 NaN 이 살아남는다." }); },
    (s) => { head(s, "흔한 실수 3가지", 20);
      numberRow(s, [
        { t: "숫자 아닌 글자가 섞임", d: "'85점' '1,000' 같은 값이 있으면 astype 이 실패. replace 로 기호를 떼거나 pd.to_numeric(errors='coerce')." },
        { t: "df 전체 astype", d: "df.astype('int') 는 글자 열까지 바꾸려다 에러. 열 하나씩, 또는 df.astype({'나이': 'int32'})." },
        { t: "to_datetime 형식 미지정", d: "'03/01/2026' 처럼 월·일 순서가 모호하면 format='%m/%d/%Y' 를 준다. 아니면 엉뚱한 날짜가 된다." },
      ], 1.6);
      codeBlock(s, "df['금액'] = df['금액'].str.replace(',', '').astype('int64')   # '1,000' → 1000\ndf['date'] = pd.to_datetime(df['date'], format='%Y-%m-%d')", 0.5, 3.4, 9, 1.7, 12); },
    (s) => { head(s, "AICE 실기 패턴 — 날짜에서 파생변수", 20);
      codeBlock(s, "df['date'] = pd.to_datetime(df['date'], errors='coerce')\ndf['year'] = df['date'].dt.year\ndf['month'] = df['date'].dt.month\ndf['weekday'] = df['date'].dt.dayofweek       # 월=0 … 일=6\ndf['is_weekend'] = (df['weekday'] >= 5).astype('int32')   # 5차시 조건 → 0/1\n\ndf = df.drop(columns=['date'])                # 날짜 원본은 모델에 못 넣는다\nprint(df[['year', 'month', 'weekday', 'is_weekend']].head(2))", 0.5, 1.5, 5.6, 2.7, 11);
      outBlock(s, "   year  month  weekday  is_weekend\n0  2026      3        6           1\n1  2026      3        6           1", 0.5, 4.3, 5.6, 0.85, 8.5);
      card(s, 6.35, 1.5, 3.15, 3.65, { title: "왜 쪼개나", body: "모델은 '2026-03-01' 을 못 읽는다. 연·월·요일 숫자로 쪼개면 '주말에 승률이 높다' 같은 규칙을 배울 수 있다. 원본 날짜 열은 drop." }); },
    (s) => practiceSlide(s, 20, [
      "「astype & to_datetime 변환 조립」 버튼 → 숫자 열을 astype 으로, date 열을 to_datetime 으로 바꾸고 dtypes 를 찍는 코드가 나타난다.",
      "변환 열(나이·구매수량·랭킹점수)과 타입(int32·float32·int64)을 고르고 「파라미터 적용」. int32 와 int64 의 차이(메모리)를 먼저 말한다.",
      "「파이프라인 실행」 → 변환 전후 메모리 차트. object → int32 가 왜 작아지는지 짚는다 (글자는 무겁다).",
    ], [
      { q: "object 열을 정수로 바꾸는 식은?", a: "답: df['열'] = df['열'].astype('int32')", mono: true },
      { q: "NaN 이 있는 열을 int 로 바꾸면?", a: "답: ValueError — 먼저 fillna 하거나 float 로" },
    ]),
  ],
  wrapTitle: "결측을 먼저 처리하고, astype 으로 형을 맞춘다",
  wrap: ["df['열'] = df['열'].astype('int32') — object 숫자 열을 계산 가능하게", "pd.to_datetime(df['date'], errors='coerce') → .dt.year/.month/.dayofweek", "NaN 이 있으면 int 불가 — fillna 먼저, 또는 float", "실기 패턴: 날짜 → 연·월·요일 파생변수, 원본 날짜 열은 drop"],
  next: "Part 2 후반 — 21차시 라벨 인코딩 · 22차시 원-핫 인코딩",
};

/* ═══════════════ 두 덱 ═══════════════ */
const r1 = makeDeck(2, "판다스 1", "11~15차시 · CSV 읽기와 저장 · 엿보기 · 진단 · 요약과 빈도 · loc/iloc", [S[11], S[12], S[13], S[14], S[15]]);
await r1.p.writeFile({ fileName: resolve(OUT, "판다스1_11-15차시.pptx") });
const r2 = makeDeck(2, "판다스 2", "16~20차시 · 결측치 찾기 · 지우기 · 채우기 · 열 정리 · 형변환", [S[16], S[17], S[18], S[19], S[20]]);
await r2.p.writeFile({ fileName: resolve(OUT, "판다스2_16-20차시.pptx") });
console.log(`PPTX 2개 생성 — 판다스1 ${r1.n}장 · 판다스2 ${r2.n}장 → ${OUT}`);
