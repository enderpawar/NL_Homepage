# NL — Network Leader 홍보 사이트

<img alt="NL 홍보 페이지 소개" src="https://github.com/enderpawar/NL_Homepage/blob/1ba5ca2131f66c7b381eb8d1543f70c3eb78a91c/docs/README%20%EC%86%8C%EA%B0%9C%ED%8E%98%EC%9D%B4%EC%A7%802.gif" />

**[→ 라이브 데모 보기](https://enderpawar.github.io/NL_Homepage/)**

컴퓨터공학과 학술동아리 **NL(Network Leader)** 의 신입생 모집 홍보 페이지입니다
React 19 + TypeScript + Vite 기반의 SPA로 구성되며, Spline 3D 인터랙션, 인터랙티브 터미널을 핵심 UX로 사용합니다.

---

## 목차

1. [기술 스택](#기술-스택)
2. [주요 기능](#주요-기능)
3. [프로젝트 구조](#프로젝트-구조)
4. [시작하기](#시작하기)
5. [배포](#배포)
6. [유지보수 가이드](#유지보수-가이드)
7. [터미널 명령어 레퍼런스](#터미널-명령어-레퍼런스)
8. [반응형 브레이크포인트](#반응형-브레이크포인트)
9. [아키텍처 결정 기록](#아키텍처-결정-기록)

---

## 기술 스택

| 분류 | 라이브러리 / 버전 |
|------|-----------------|
| UI 프레임워크 | React `^19.2` |
| 언어 | TypeScript `^5.9` (strict mode) |
| 빌드 툴 | Vite `^8.0` |
| 스타일링 | Tailwind CSS `^4.2` |
| 라우팅 | React Router DOM `^7.13` |
| 아이콘 | MUI Icons Material `^7.3` · Lucide React `^0.577` |
| 컴포넌트 | MUI Material `^7.3` |
| 3D 인터랙션 | Spline (iframe embed) |
| 배포 | GitHub Pages |

---

## 주요 기능

### 인트로 애니메이션
- 세션당 최초 1회 풀스크린 부트 인트로 재생 (`sessionStorage` 기반)
- 터미널에서 `/boot` 명령어 입력 또는 키보드 시퀀스 `/boot` 입력으로 언제든 재시작 가능

### Hero 섹션
- **Spline 3D** — 커서를 따라다니는 인터랙티브 3D 오브젝트 (데스크톱 1400px+)
- **인터랙티브 터미널** — 기본 상태에서는 동아리 소개 문구(JSDoc 형식) 표시, 클릭/터치 시 bash 스타일 인터랙티브 모드 전환
- Spline은 히어로 섹션이 뷰포트를 벗어나면 렌더링 자동 중지 (IntersectionObserver, 성능 최적화)
- Spline 로드 실패 시 지수 백오프 자동 재시도 (최대 3회: 2s / 4s / 6s)

### 페이지 구성 (React Router)

| 경로 | 페이지 | 설명 |
|------|--------|------|
| `/` | Home | Hero + About + Activity + Stats + Testimonials + Join |
| `/activity` | ActivityPage | 활동 소개 상세 |
| `/executives` | ExecutivesPage | 임원진 소개 |
| `/blog` | BlogPage | 부원 블로그 포스트 모음 |
| `/join` | JoinPage | 지원 안내 및 CTA |

### 공지 배너
- `src/data/config.ts`의 `ANNOUNCEMENT.show` 값으로 노출 여부 토글
- 공지가 없을 때는 DOM에서 완전히 제거되어 레이아웃에 영향 없음

### 모집 상태 자동 전환
- `RECRUIT.start` / `RECRUIT.end` 날짜 기반으로 "모집 예정" → "모집 중" → "모집 마감" 자동 전환

### 반응형 디자인
- 모바일(`≤767px`): Spline 숨김, 햄버거 메뉴
- 태블릿(`768px–1399px`): 텍스트 좌측 + 터미널 우측 2단 레이아웃
- 데스크톱(`≥1400px`): 풀블리드 Spline 배경 + 좌측 콘텐츠

---

## 프로젝트 구조

```
src/
├── components/             # 재사용 UI 컴포넌트
│   ├── AnnouncementBar.tsx # 최상단 공지 배너
│   ├── Navbar.tsx          # 고정 네비게이션 (스크롤 시 border 추가)
│   ├── Hero.tsx            # Spline + 터미널 레이아웃 조율
│   ├── HeroCodeDisplay.tsx # 인터랙티브 터미널 구현
│   ├── HeroBootTerminal.tsx # 인트로 부트 터미널 애니메이션
│   ├── HeroIntro.tsx       # 풀스크린 인트로 래퍼
│   ├── About.tsx           # 동아리 소개 섹션
│   ├── ActivitySection.tsx # 활동 소개 카드 섹션
│   ├── StatsBanner.tsx     # 통계 배너
│   ├── Testimonials.tsx    # 부원 후기
│   ├── JoinSection.tsx     # 지원 안내 CTA 섹션
│   ├── CodePlayground.tsx  # (추가 인터랙션용)
│   └── Footer.tsx          # 풋터
│
├── pages/                  # 라우트 단위 페이지
│   ├── Home.tsx
│   ├── ActivityPage.tsx
│   ├── ExecutivesPage.tsx
│   ├── BlogPage.tsx
│   └── JoinPage.tsx
│
├── data/                   # ✏️ 유지보수 시 이 폴더만 수정
│   ├── config.ts           # 링크, 모집 기간, 공지, Spline URL
│   ├── executives.ts       # 임원진 목록 (매년 교체)
│   ├── activities.ts       # 활동 카드 목록
│   ├── blogPosts.ts        # 블로그 포스트 목록
│   └── icons.ts            # 아이콘 매핑 유틸
│
├── hooks/
│   └── useInView.ts        # IntersectionObserver 커스텀 훅
│
├── types/
│   └── index.ts            # 공통 TypeScript 타입 정의
│
├── App.tsx                 # BrowserRouter + 라우팅 + 인트로 진입점
└── main.tsx
```

### 핵심 타입 정의 (`src/types/index.ts`)

```ts
export interface Executive {
  name: string;
  role: string;
  img: string;
  bio?: string;
  highlights?: string[];
}

export interface Activity {
  title: string;
  desc: string;
  detail: string;
  icon: string;
}

export interface BlogPost {
  title: string;
  summary: string;
  date: string;          // 'YYYY-MM-DD'
  url: string;
  tags: string[];
  source: 'velog' | 'tistory' | 'other';
  author?: string;
}
```

---

## 시작하기

### 요구 사항

- Node.js `≥18`
- npm `≥9`

### 개발 서버 실행

```bash
npm install
npm run dev
```

로컬 개발 서버가 `http://localhost:5173` 에서 실행됩니다.

### 프로덕션 빌드

```bash
npm run build
```

`tsc` 타입 검사 → Vite 번들링 → `404.html` 복사 (GitHub Pages SPA 라우팅 지원) 순서로 실행됩니다.
빌드 결과물은 `dist/` 디렉터리에 생성됩니다.

### 빌드 미리보기

```bash
npm run preview
```

---

## 배포

GitHub Pages에 자동 배포됩니다. `vite.config`의 `base` 경로와 GitHub 저장소 이름이 일치해야 합니다.

빌드 스크립트(`npm run build`)는 `dist/index.html`을 `dist/404.html`로 복사합니다.
이는 GitHub Pages에서 클라이언트 사이드 라우팅(`/activity`, `/blog` 등 직접 접근) 시 404 페이지로 fallback되는 방식을 활용해 SPA 라우팅을 정상 동작시키는 기법입니다.

---

## 유지보수 가이드

**TypeScript를 몰라도 됩니다.** `src/data/` 폴더 안의 파일만 수정하면 페이지 전체에 반영됩니다.

### `src/data/config.ts` — 링크·모집 기간·공지·Spline

```ts
// Spline 씬 교체 시 URL만 변경
export const SPLINE_URL = 'https://my.spline.design/...';

// 지원 폼·SNS 링크
export const LINKS = {
  apply:     'https://forms.gle/...',   // 구글폼
  kakao:     'https://open.kakao.com/...', // 카카오 오픈채팅
  instagram: 'https://instagram.com/...', // 인스타그램
  email:     'nl@example.ac.kr',
};

// 모집 기간 — 날짜 기반으로 모집 상태 자동 전환
export const RECRUIT = {
  start: '2025-03-01',  // 'YYYY-MM-DD'
  end:   '2025-03-15',
};

// 공지 배너 — show: false면 배너 완전히 숨김
export const ANNOUNCEMENT = {
  show: true,
  text: '🎉 2025년 신입 부원 모집 중! 지금 바로 지원하세요',
  link: 'https://forms.gle/...',
};
```

### `src/data/executives.ts` — 임원진 (매년 교체)

```ts
export const EXECUTIVES: Executive[] = [
  {
    name: '홍길동',
    role: '회장',
    img: '/members/hong.jpg',     // public/members/ 에 사진 추가
    bio: '한 줄 소개',
    highlights: ['키워드1', '키워드2', '키워드3'],
  },
  // ... 필요한 만큼 추가
];
```

> 사진 파일은 `public/members/` 디렉터리에 영문 파일명(예: `hong.jpg`)으로 저장하세요.

### `src/data/activities.ts` — 활동 카드

```ts
export const ACTIVITIES: Activity[] = [
  {
    title: '정기 스터디',
    desc:  '매주 화요일 진행',
    detail: '상세 설명 텍스트',
    icon:  'menuBook',   // src/data/icons.ts 의 키 값
  },
  // ...
];
```

### `src/data/blogPosts.ts` — 블로그 포스트

```ts
export const BLOG_POSTS: BlogPost[] = [
  {
    title:   '포스트 제목',
    summary: '한 줄 요약',
    date:    '2025-03-10',
    url:     'https://velog.io/@...',
    tags:    ['React', 'TypeScript'],
    source:  'velog',    // 'velog' | 'tistory' | 'other'
    author:  '작성자명',
  },
  // ...
];
```

자세한 수정 방법은 **[docs/MAINTENANCE.md](./docs/MAINTENANCE.md)** 를 참고하세요.

---

## 터미널 명령어 레퍼런스

Hero 섹션 터미널을 클릭하면 인터랙티브 모드로 전환됩니다.
`ESC` 키로 기본 문구 표시 모드로 복귀합니다.

| 명령어 | 동작 |
|--------|------|
| `cd 활동소개` · `cd activity` | `/activity` 페이지로 이동 |
| `cd 임원소개` · `cd executives` | `/executives` 페이지로 이동 |
| `cd 블로그` · `cd blog` | `/blog` 페이지로 이동 |
| `cd 지원하기` · `cd join` | `/join` 페이지로 이동 |
| `ls` | 페이지 목록 출력 |
| `date` | 현재 날짜 및 시간 출력 |
| `fortune` | 개발자 명언 랜덤 출력 |
| `cat README.md` | NL 소개 텍스트 출력 |
| `help` · `--help` | 사용 가능한 명령어 목록 |
| `hack` | ??? |
| `/boot` | 인트로 애니메이션 재시작 |
| `clear` | 터미널 히스토리 초기화 |
| `ESC` | 인터랙티브 모드 종료 |

> 한글 입력(IME)을 지원합니다. `cd 활동소개` 등 한글 명령어를 그대로 입력하세요.

---

## 반응형 브레이크포인트

| 구간 | 범위 | 레이아웃 |
|------|------|----------|
| 모바일 | `≤767px` | 1열 세로 · Spline 숨김 · 햄버거 메뉴 |
| 태블릿 | `768px–1399px` | 텍스트 좌측 + 터미널 우측 (Spline 숨김) |
| 짧은 화면 | `≥1024px` + `높이≤600px` | 태블릿 레이아웃과 동일 (Nest Hub 등 대응) |
| 데스크톱 | `≥1400px` | 풀블리드 Spline 배경 + 좌측 콘텐츠 블록 |

---

## 아키텍처 결정 기록

### Spline 렌더링 최적화
히어로 섹션이 뷰포트 밖으로 스크롤되면 `IntersectionObserver`로 iframe `src`를 비워 WebGL 렌더링을 중지합니다. 초기 로드 시 scroll restoration과의 레이스 컨디션을 방지하기 위해 관찰 시작을 2,000ms 지연합니다. 자세한 내용은 [`docs/perf-refactor-hero-scroll.md`](./docs/perf-refactor-hero-scroll.md)를 참고하세요.

### GitHub Pages SPA 라우팅
GitHub Pages는 서버 사이드 라우팅을 지원하지 않으므로, 빌드 후 `index.html`을 `404.html`로 복사합니다. 존재하지 않는 경로로 직접 접근 시 GitHub Pages가 `404.html`을 반환하고, React Router가 클라이언트에서 라우팅을 처리합니다.

### 데이터 / UI 분리 원칙
임원진·활동·블로그 포스트 등 주기적으로 교체되는 데이터는 모두 `src/data/`에 격리합니다. 컴포넌트는 타입만 의존하며, 데이터 변경이 UI 코드에 영향을 주지 않습니다.

### iOS/iPad 터치 키보드 지원
iOS Safari는 `setTimeout` 내부의 `focus()` 호출을 사용자 제스처로 인식하지 않아 키보드가 올라오지 않습니다. 이를 해결하기 위해 숨겨진 `<input>`을 항상 DOM에 마운트하고, `onTouchEnd` 핸들러에서 `e.preventDefault()` 후 동기적으로 `focus()`를 호출합니다. 또한 `font-size: 16px`를 지정하여 iOS의 자동 줌인을 방지합니다.
