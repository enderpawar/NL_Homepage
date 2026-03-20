# NL 홍보 페이지 유지보수 가이드

> 이 문서는 TypeScript나 React를 몰라도 홍보 페이지 내용을 업데이트할 수 있도록 작성되었습니다.
> **데이터 교체는 `src/data/` 폴더만, 텍스트/이미지 교체는 아래 섹션별 안내를 따르세요.**

---

## 목차

1. [임원 정보 교체 (매년)](#1-임원-정보-교체-매년)
2. [활동 카드 수정](#2-활동-카드-수정)
3. [블로그 글 추가/삭제](#3-블로그-글-추가삭제)
4. [모집 기간 및 링크 변경](#4-모집-기간-및-링크-변경)
5. [공지 배너 켜고 끄기](#5-공지-배너-켜고-끄기)
6. [인트로 화면 ASCII 아트 교체](#6-인트로-화면-ascii-아트-교체)
7. [Hero 터미널 기본 문구 수정](#7-hero-터미널-기본-문구-수정)
8. [Hero 헤드라인 · 서브타이틀 수정](#8-hero-헤드라인--서브타이틀-수정)
9. [Spline 3D 씬 교체](#9-spline-3d-씬-교체)
10. [수정 후 배포 방법](#10-수정-후-배포-방법)

---

## 1. 임원 정보 교체 (매년)

**파일 위치**: `src/data/executives.ts`

### 수정 방법

파일을 열면 아래와 같은 형태로 임원 목록이 있습니다.

```ts
export const EXECUTIVES: Executive[] = [
  {
    name: '홍길동',           // 이름
    role: '회장',             // 직책
    img: '',                  // 사진 경로 (없으면 빈 문자열 유지)
    bio: '동아리의 방향을...',  // 한 줄 소개
    highlights: ['대외 협력', '운영 총괄', '성장 전략'],  // 태그 (최대 3개 권장)
  },
  // ... 나머지 임원
];
```

**Ctrl+F**로 기존 이름(예: `홍길동`)을 찾아 새 이름으로 교체하면 됩니다.

### 임원 추가하기

마지막 `},` 뒤에 아래 블록을 그대로 복사해서 붙여넣고 내용을 채우세요.

```ts
  {
    name: '새 이름',
    role: '역할',
    img: '',
    bio: '한 줄 소개를 여기에 작성합니다.',
    highlights: ['태그1', '태그2', '태그3'],
  },
```

> `],` 바로 앞에 붙여넣어야 합니다. 중괄호(`{}`)와 쉼표(`,`)를 그대로 유지하세요.

### 임원 삭제하기

삭제할 임원의 `{` 부터 닫는 `},` 까지 블록 전체를 선택해서 지우면 됩니다.

### 사진 추가하기

1. 사진 파일을 `public/members/` 폴더에 복사합니다. (예: `hong.jpg`)
2. `img: ''` 부분을 `img: '/members/hong.jpg'` 로 수정합니다.

> 파일명은 **영문+숫자**만 사용하세요. 한글 파일명은 오류가 날 수 있습니다.

---

## 2. 활동 카드 수정

**파일 위치**: `src/data/activities.ts`

### 수정 방법

```ts
export const ACTIVITIES: Activity[] = [
  {
    title: '정기 스터디',          // 카드 제목
    desc: '매주 화요일 진행',       // 짧은 부제
    detail: 'CS 기초부터 심화...',  // 카드 상세 설명
    icon: 'menuBook',              // 아이콘 (아래 목록 참고)
  },
  // ...
];
```

`title`, `desc`, `detail`은 Ctrl+F로 자유롭게 교체하면 됩니다.

### 사용 가능한 아이콘 목록

`icon` 필드는 아래 4가지 값 중에서만 골라야 합니다. 다른 값을 쓰면 아이콘이 표시되지 않습니다.

| 값 | 표시되는 아이콘 |
|----|----------------|
| `'menuBook'` | 책 아이콘 (스터디, 학습) |
| `'code'` | 코드 아이콘 (개발, 프로젝트) |
| `'mic'` | 마이크 아이콘 (세미나, 발표) |
| `'rocket'` | 로켓 아이콘 (해커톤, 도전) |

### 활동 카드 추가하기

```ts
  {
    title: '새 활동 이름',
    desc: '빈도 또는 부제',
    detail: '상세 설명을 여기에 작성합니다.',
    icon: 'code',
  },
```

---

## 3. 블로그 글 추가/삭제

**파일 위치**: `src/data/blogPosts.ts`

### 글 추가하기

`BLOG_POSTS` 배열 맨 앞(최신순)에 아래 블록을 복사해서 붙여넣고 내용을 채우세요.

```ts
  {
    title: '글 제목',
    summary: '글 요약 (2~3줄)',
    date: '2025-09-01',            // YYYY-MM-DD 형식
    url: 'https://velog.io/...',   // 글 원본 링크
    tags: ['태그1', '태그2'],
    source: 'velog',               // 'velog' | 'tistory' | 'other' 중 택1
    author: '홍길동',
  },
```

### 글 삭제하기

삭제할 글의 `{` 부터 닫는 `},` 까지 블록 전체를 선택해서 지우면 됩니다.

---

## 4. 모집 기간 및 링크 변경

**파일 위치**: `src/data/config.ts`

### 모집 기간 변경

```ts
export const RECRUIT = {
  start: '2025-03-01',   // 모집 시작일 (YYYY-MM-DD)
  end:   '2025-03-15',   // 모집 종료일 (YYYY-MM-DD)
};
```

날짜를 바꾸면 지원 섹션의 "모집 중 / 마감" 상태가 자동으로 전환됩니다.

### 링크 변경

```ts
export const LINKS = {
  apply:     'https://forms.gle/...',          // 구글폼 지원 링크
  kakao:     'https://open.kakao.com/...',     // 카카오 오픈채팅
  instagram: 'https://instagram.com/...',      // 인스타그램
  email:     'nl@example.ac.kr',               // 이메일
};
```

각 항목의 `'` 따옴표 안의 URL만 교체하면 됩니다.

---

## 5. 공지 배너 켜고 끄기

**파일 위치**: `src/data/config.ts`

페이지 최상단에 나타나는 얇은 공지 배너를 제어합니다.

```ts
export const ANNOUNCEMENT = {
  show: false,                                     // true 로 바꾸면 배너 표시
  text: '🎉 2025년 신입 부원 모집 중! 지금 바로 지원하세요',  // 배너 문구
  link: 'https://forms.gle/example',               // 클릭 시 이동할 링크
};
```

- 모집 시즌: `show: false` → `show: true`
- 모집 종료 후: `show: true` → `show: false`

---

## 6. 인트로 화면 ASCII 아트 교체

페이지 최초 진입 시 나타나는 부팅 화면(터미널)에서 "EXECUTE CODES / LEAD THE NETWORK" 문구를 큰 ASCII 아트로 보여줍니다. 동아리 이름이나 슬로건이 바뀌면 이 부분을 교체합니다.

### 교체 대상 파일 (2개 — 둘 다 수정해야 합니다)

| 파일 | 역할 |
|------|------|
| `src/components/HeroBootTerminal.tsx` | 메인 인트로 화면 (Hero 섹션에 내장) |
| `src/components/HeroIntro.tsx` | 전체화면 인트로 오버레이 |

두 파일 모두 동일한 `ASCII_ART` 상수를 가지고 있으며, **같은 내용으로 교체**해야 합니다.

### 교체 절차

**Step 1 — 새 ASCII 아트 생성**

아래 사이트에 접속합니다.
```
https://patorjk.com/software/taag/
```
- **Font**: `Big Money-nw` (현재 사용 중인 폰트, `$` 기호 사용)
- **Text**: 원하는 문구 입력 (줄바꿈 지원됨)
- 오른쪽 미리보기에서 확인 후 **Select & Copy** 버튼으로 전체 복사

> ⚠️ 폰트 종류마다 글자 너비가 다릅니다. 폰트를 바꾸면 레이아웃이 틀어질 수 있으므로
> `Big Money-nw` 폰트를 그대로 사용하는 것을 권장합니다.

**Step 2 — 파일에 붙여넣기**

`src/components/HeroBootTerminal.tsx` 파일을 열고, 아래 부분을 찾습니다.

```ts
const ASCII_ART: readonly string[] = String.raw`
 /$$          /$$$$$$$$ ...
 ...
`.slice(1).split('\n');
```

백틱(`` ` ``) 사이의 내용 전체를 지우고, 복사한 ASCII 아트를 붙여넣습니다.

```ts
// 수정 후 예시
const ASCII_ART: readonly string[] = String.raw`
(여기에 복사한 ASCII 아트 붙여넣기)
`.slice(1).split('\n');
```

> ⚠️ 주의사항:
> - 여는 백틱(`` ` ``) 바로 뒤에 줄바꿈이 있어야 합니다. `.slice(1)`이 첫 빈 줄을 제거합니다.
> - 닫는 백틱(`` ` ``) 바로 앞 줄까지가 아트 내용입니다.
> - ASCII 아트 안에 백틱(`` ` ``)이 포함된 경우 `\`` 로 이스케이프해야 합니다.

**Step 3 — HeroIntro.tsx 에도 동일하게 반복**

`src/components/HeroIntro.tsx` 를 열어 동일한 `ASCII_ART` 상수를 같은 내용으로 교체합니다.

### 인트로 화면 명령어 문구 수정

부팅 화면에서 ASCII 아트 전에 타이핑되는 명령어 두 줄도 바꿀 수 있습니다.
두 파일 공통으로 상단에 있는 `COMMANDS` 배열을 수정합니다.

```ts
const COMMANDS: { dir: string; cmd: string }[] = [
  { dir: '~',                     cmd: 'cd NL_NetworkLeader_CLUB' },
  { dir: 'NL_NetworkLeader_CLUB', cmd: 'node index.js --boot'    },
];
```

- `dir`: 프롬프트에 표시될 현재 디렉토리
- `cmd`: 타이핑되는 명령어 텍스트

---

## 7. Hero 터미널 기본 문구 수정

메인 Hero 섹션 좌측 하단에 있는 어두운 터미널 박스에 표시되는 동아리 소개 문구입니다.
클릭 전 기본 상태에서 보이는 내용이며, JSDoc 주석 형식으로 작성되어 있습니다.

**파일 위치**: `src/components/HeroCodeDisplay.tsx`

### 현재 문구 구조

파일 상단의 `CODE_TOKENS` 배열을 찾습니다.

```ts
const CODE_TOKENS: Token[] = [
  { c: 'cmt', v: '/**\n' },
  { c: 'cmt', v: ' * NL — ' }, { c: 'pl', v: 'Network Leader\n' },
  { c: 'cmt', v: ' * 컴퓨터공학과 학술동아리 · since ' }, { c: 'num', v: '2007\n' },
  { c: 'cmt', v: ' * 멤버 ' }, { c: 'num', v: '30' }, { c: 'cmt', v: '+명 · 스터디 · 프로젝트 · 해커톤\n' },
  { c: 'cmt', v: ' * ' }, { c: 'str', v: '"함께 배우고, 만들고, 성장하다"\n' },
  { c: 'cmt', v: ' */' },
];
```

### 색상 코드 의미

| 코드 | 색상 | 용도 |
|------|------|------|
| `'cmt'` | 회색 | 주석 (`//`, `/* */`) |
| `'pl'`  | 밝은 흰색 | 일반 텍스트 |
| `'num'` | 주황색 | 숫자 강조 |
| `'str'` | 초록색 | 문자열·인용구 강조 |
| `'kw'`  | 인디고 | 키워드 |
| `'key'` | 하늘색 | 키 이름 |

### 수정 방법

`v:` 뒤의 따옴표 안 텍스트만 바꾸면 됩니다. `\n`은 줄바꿈이므로 지우지 마세요.

```ts
// 예시: 멤버 수를 35명으로, 슬로건 변경
{ c: 'num', v: '35' },
{ c: 'str', v: '"새로운 슬로건을 여기에"\n' },
```

> 줄 수가 늘어나면 터미널 높이(`maxHeight`)를 함께 조정해야 합니다.
> `HeroCodeDisplay.tsx` 에서 `maxHeight: '230px'` 값을 올려주세요.

---

## 8. Hero 헤드라인 · 서브타이틀 수정

**파일 위치**: `src/components/Hero.tsx`

### 헤드라인 (큰 제목)

파일에서 아래 부분을 찾습니다.

```tsx
<h1 ...>
  코드로 세상을
  <br />
  연결합니다
</h1>
```

`코드로 세상을`과 `연결합니다` 부분을 원하는 문구로 교체합니다.
`<br />`은 줄바꿈이므로 그대로 두세요.

### 서브타이틀 (헤드라인 아래 작은 설명)

바로 아래 `<p>` 태그 안의 텍스트를 교체합니다.

```tsx
<p ...>
  NL(Network Leader)은 컴퓨터공학과 학생들이<br />함께 배우고, 만들고, 성장하는 학술동아리입니다.
</p>
```

---

## 9. Spline 3D 씬 교체

Hero 섹션 우측에 표시되는 인터랙티브 3D 오브젝트입니다.

**파일 위치**: `src/data/config.ts`

```ts
export const SPLINE_URL = 'https://my.spline.design/cutecomputerfollowcursor-.../';
```

Spline(spline.design)에서 새 씬을 만들고 **Share → Embed** 에서 iframe `src` URL을 복사한 뒤,
위 값만 교체하면 됩니다.

> - 씬은 마우스 커서를 따라오는 인터랙션이 있는 것이 자연스럽습니다.
> - 모바일에서는 Spline이 자동으로 숨겨지고 그라디언트 배경으로 대체됩니다.

---

## 10. 수정 후 배포 방법

파일을 수정한 뒤에는 다음 절차로 배포합니다.

### 로컬에서 미리보기

```bash
npm run dev
```

브라우저에서 `http://localhost:5173` 에 접속해 변경 사항을 확인합니다.

### 빌드 및 배포

```bash
npm run build
```

`dist/` 폴더가 생성되며, 이 폴더를 서버에 업로드하거나 GitHub Pages / Netlify 등에 배포합니다.

> Git을 사용하는 경우: 변경한 파일을 커밋하고 push하면 자동 배포 파이프라인이 실행됩니다.

---

## 파일 구조 요약

```
src/
├── data/                     ← 여기만 수정하면 되는 데이터 파일
│   ├── config.ts             ← 링크, 모집 기간, 공지 배너, Spline URL
│   ├── executives.ts         ← 임원 카드 목록 (매년 교체)
│   ├── activities.ts         ← 활동 소개 카드 목록
│   └── blogPosts.ts          ← 블로그 글 목록
│
└── components/               ← 텍스트·아트 교체가 필요한 경우에만 수정
    ├── Hero.tsx               ← 헤드라인, 서브타이틀
    ├── HeroCodeDisplay.tsx    ← 터미널 기본 문구 (CODE_TOKENS)
    ├── HeroBootTerminal.tsx   ← 인트로 ASCII 아트 (ASCII_ART) ← 매년 교체 대상
    └── HeroIntro.tsx          ← 인트로 ASCII 아트 (ASCII_ART) ← 매년 교체 대상
```

**일반적인 연간 유지보수 체크리스트:**
- [ ] `executives.ts` — 임원 교체
- [ ] `config.ts` — 모집 기간, 지원 링크 업데이트
- [ ] `HeroBootTerminal.tsx` + `HeroIntro.tsx` — ASCII 아트 슬로건 교체 (선택)
- [ ] `blogPosts.ts` — 지난 학기 활동 글 추가
