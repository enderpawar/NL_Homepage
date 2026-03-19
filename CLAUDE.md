# NL (Network Leader) 동아리 홍보 페이지

## 프로젝트 개요

**NL(Network Leader)** 은 대학교 컴퓨터공학과 학술동아리입니다.
이 프로젝트는 신입생 모집을 위한 동아리 홍보 페이지(단일 HTML 파일 기반)를 구현합니다.
Spline 3D 인터랙티브 요소를 메인 히어로에 배치하여 신입생의 흥미와 관심을 유도하는 것이 핵심 목표입니다.

---

## 디자인 시스템

### 색상 팔레트
| 역할 | 색상 | 비고 |
|------|------|------|
| 배경 | `#FFFFFF` | 전체 배경은 흰색 |
| 주요 강조색 | `#4F46E5` (인디고/블루) | 로고의 N, L 강조색 |
| 텍스트 기본 | `#111111` | 거의 검정 |
| 텍스트 보조 | `#555555` | 설명 텍스트 |
| 블랙 포인트 | `#000000` | 로고 블랙 블록 |
| 구분선/보더 | `#E5E7EB` | 연한 회색 |

> **주의**: 퍼플 계열 색상(`#2D27A0` 등) 사용 금지. 인디고/블루 단일 계열로 통일.

### 타이포그래피
- 헤드라인: `font-weight: 900`, 대문자 위주, 크고 임팩트 있게
  - 히어로 헤드라인: `font-size: clamp(2.5rem, 5vw, 4rem)`, 줄간격 `line-height: 1.1`
  - 섹션 헤드라인: `font-size: clamp(1.8rem, 3vw, 2.5rem)`, 줄간격 `line-height: 1.2`
  - 카드 제목: `font-size: 1.25rem`, `font-weight: 700`
- 본문: `font-weight: 400~500`, 가독성 우선
  - 서브텍스트: `font-size: 1.1rem`, `color: #555555`, 줄간격 `1.6`
- 권장 폰트: `'Pretendard'` (한글) + `'Inter'` 또는 `'Space Grotesk'` (영문)
- Google Fonts / CDN으로 로드, `font-display: swap` 적용

### 레이아웃 원칙
- 최상단 공지 배너 (thin bar): `#111111` 배경 + 흰색 텍스트, 선택적으로 표시 (공지 없으면 숨김)
- Navbar: 흰색 배경, 좌측 로고, 우측 메뉴, 스크롤 시 `border-bottom: 1px solid #E5E7EB` 추가
- Hero: 좌측 텍스트(60%) + 우측 Spline(40%), 수직 중앙 정렬, min-height `100vh`
- CTA 버튼: 인디고(`#4F46E5`) 단색 배경, `border-radius: 8px`, hover 시 `#4338CA`로 어둡게
- 섹션 구분: 배경색 교차 (`#FFFFFF` ↔ `#F9FAFB`)로 자연스러운 분리
- 섹션 간 여백: `padding: 80px 24px` ~ `120px 24px`
- 최대 너비: `1200px`, 좌우 padding `24px`, 수평 중앙 정렬
- 모바일 반응형 지원 (breakpoint: 768px 기준 1열 전환)

### Webflow 레퍼런스 적용 원칙

Webflow 홈페이지의 다크 테마 구성을 화이트 테마로 변환하여 적용:

| Webflow 원본 (다크) | NL 홍보페이지 적용 (화이트) |
|---|---|
| 최상단 얇은 알림 배너 (어두운 배경) | 알림 배너: `#111111` 배경 + 흰색 텍스트 (포인트 유지) |
| 어두운 배경 네비게이션 | 흰색 배경 네비게이션 + 스크롤 시 border-bottom |
| 흰색 초대형 헤드라인 | 검정(`#111111`) 초대형 헤드라인 |
| 밝은 회색 서브텍스트 | `#555555` 서브텍스트 |
| 파란 단일 CTA 버튼 | 인디고(`#4F46E5`) CTA 버튼 |
| 우측 제품 스크린샷 | 우측 Spline 3D iframe |
| 어두운 전체 배경 | `#FFFFFF` 전체 배경 |

---

## 보유 에셋

### 로고 이미지 (`CLUB LOGO IMG/`)
| 파일명 | 설명 | 용도 |
|--------|------|------|
| `1.png` | NL 아이콘 (라운드 사각형, 블루 그라디언트) | Favicon, 네비게이션 로고 |
| `2.png` | "NETWORK LEADER" 텍스트 로고 (가로형) | 네비게이션 바, 푸터 |
| `3.png` | NL 풀 로고 (가로형, 16:9 비율) | 히어로 섹션, 배너 |
| `3-1.png` | NL 풀 로고 (정방형에 가까운 비율) | 소개 섹션 |
| `4대3.png` | NL 풀 로고 (4:3 비율) | 일반 사용 |

> **배치 원칙**: 로고 이미지를 모든 섹션에 넣지 말 것. 디자인 완성도를 해치지 않는 선에서 적절한 위치에만 선택적으로 배치.

로고 구성 요소: 블루 입체 **NL** 글자 + 검정 블록 + 와이어프레임 지구본 + "NETWORK LEADER" 텍스트
(퍼플 계열 로고 이미지는 사용 제외)

### Spline 3D 인터랙티브 씬
```html
<iframe
  src='https://my.spline.design/cutecomputerfollowcursor-kA12qnqOtkDzxaSpjxRxxQe5/'
  frameborder='0'
  width='100%'
  height='100%'>
</iframe>
```
- 씬명: "Cute Computer Follow Cursor"
- 마우스 커서를 따라다니는 귀여운 3D 컴퓨터 오브젝트
- 히어로 섹션 우측 또는 전체 배경으로 배치

---

## 페이지 구조 (섹션 순서)

### 1. Navigation Bar
- 좌측: `1.png` 아이콘 + "NL" 또는 `2.png` 텍스트 로고
- 우측: 섹션 앵커 링크 (소개, 활동, 멤버, 지원하기)
- 스크롤 시 배경 blur 효과 적용 (`backdrop-filter: blur`)
- 고정(sticky) 네비게이션

### 2. Hero Section


### 3. About Section (동아리 소개)
- 중앙 정렬 헤드라인: `"NL이란?"`
- 3개 카드: 핵심 가치 소개 (예: 네트워킹 / 학습 / 성장)
- 각 카드: 아이콘 + 제목 + 설명
- **임원진 소개 카드 서브섹션 추가**:
  - 현재 임원진을 카드 형태로 표시 (사진, 이름, 역할)
  - 임원진은 매년 교체되므로, 카드 데이터를 JS 배열로 분리하여 유지보수 용이하게 구현
  ```js
  // 임원진 교체 시 이 배열만 수정
  const executives = [
    { name: "홍길동", role: "회장", img: "./members/hong.jpg" },
    // ...
  ];
  ```
- 배경: `#F9FAFB` (연한 회색)

### 4. Activity Section (활동 소개)
- 좌측 텍스트 + 우측 이미지/목록 형태
- 주요 활동 항목 (예: 스터디, 프로젝트, 세미나, 해커톤 등)
- **카드 확장성**: 정적 페이지이나 추후 활동 이미지 카드를 쉽게 추가할 수 있도록 카드 목록을 JS 배열로 관리
  ```js
  // 활동 카드 추가 시 이 배열에만 항목 추가
  const activities = [
    { title: "정기 스터디", desc: "매주 화요일", img: "./activities/study.jpg" },
    // ...
  ];
  ```
- 배경: 흰색

### 5. Member / Join Section (지원 안내)
- 모집 대상, 지원 방법, 일정 등
- `3.png` 또는 `logo_4x3.png` 로고 활용
- CTA 버튼: 지원 링크 (`LINKS.apply`로 연결)
- 모집 중 / 모집 마감 상태를 `RECRUIT` 날짜 객체 기반으로 자동 전환
- 배경: 인디고 계열 또는 검정 (포인트 섹션)

### 6. Footer
- `2.png` 텍스트 로고
- 소속 대학 / 학과 정보
- SNS 링크 아이콘: `LINKS` 객체에서 참조
- 저작권 연도: `new Date().getFullYear()` 자동 출력

---

## 구현 규칙

### 기술 스택
- **프레임워크**: React + TypeScript (Vite 기반 프로젝트)
- **스타일링**: Tailwind CSS
- **언어**: TypeScript 엄격 모드 (`strict: true`)
- **Spline**: iframe 방식으로 embed
- 단일 HTML 파일 방식 사용 안 함

### 프로젝트 구조
```
src/
├── components/         # 재사용 UI 컴포넌트
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   ├── About.tsx
│   ├── ActivityCard.tsx
│   ├── ExecutiveCard.tsx
│   ├── JoinSection.tsx
│   └── Footer.tsx
├── data/               # 유지보수 데이터 (여기만 수정)
│   ├── executives.ts
│   ├── activities.ts
│   └── config.ts       # LINKS, RECRUIT, SPLINE_URL 등
├── types/              # 공통 TypeScript 타입 정의
│   └── index.ts
└── App.tsx
```

### 컴포넌트 설계 원칙
- 컴포넌트는 단일 책임 원칙 준수 (섹션 단위로 분리)
- Props는 TypeScript interface로 명시적 타입 정의
- 데이터는 `src/data/`에만 위치, 컴포넌트에 하드코딩 금지
- 예시:
  ```ts
  // src/types/index.ts
  export interface Executive {
    name: string;
    role: string;
    img: string;
  }

  export interface Activity {
    title: string;
    desc: string;
    img: string;
  }
  ```

### 코딩 컨벤션
- 한국어 주석 허용
- 이미지 경로: `./assets/` 하위 (Vite asset 처리)
- Spline iframe은 포인터 이벤트가 아래로 전달되지 않도록 주의
- **데이터와 UI 분리**: 임원진, 활동 카드 등 교체 가능성 있는 데이터는 `src/data/`에서 관리

### 유지보수 설계 원칙

모든 변경 가능한 데이터는 `src/data/` 하위 파일에서만 관리:

```ts
// src/data/config.ts — 씬 URL, 링크, 모집 기간
export const SPLINE_URL = 'https://my.spline.design/cutecomputerfollowcursor-kA12qnqOtkDzxaSpjxRxxQe5/';

export const LINKS = {
  apply:     'https://forms.gle/...',
  kakao:     'https://open.kakao.com/...',
  instagram: 'https://instagram.com/...',
  email:     'nl@example.ac.kr',
};

export const RECRUIT = {
  start: '2025-03-01',
  end:   '2025-03-15',
};
```

```ts
// src/data/executives.ts — 매년 이 파일만 교체
import type { Executive } from '../types';

export const EXECUTIVES: Executive[] = [
  { name: '홍길동', role: '회장',   img: '/members/hong.jpg' },
  { name: '김철수', role: '부회장', img: '/members/kim.jpg'  },
];
```

```ts
// src/data/activities.ts — 활동 추가 시 항목만 append
import type { Activity } from '../types';

export const ACTIVITIES: Activity[] = [
  { title: '정기 스터디', desc: '매주 화요일', img: '/activities/study.jpg'    },
  { title: '해커톤',      desc: '학기 1회',   img: '/activities/hackathon.jpg' },
];
```

### 이미지 파일 네이밍 규칙
- 한글 파일명 사용 금지 (인코딩 오류 방지)
- 기존 `4대3.png` → `logo_4x3.png` 으로 변경하여 사용
- 멤버 사진: `./members/{영문이름}.jpg`
- 활동 사진: `./activities/{영문명}.jpg`

### 성능 고려사항
- Spline iframe은 `loading="lazy"` 불필요 (히어로에 즉시 로드)
- 로고 이미지는 `width`, `height` 명시하여 레이아웃 시프트 방지
- 폰트는 `display=swap` 적용

### 접근성
- 모든 `<img>`에 `alt` 속성 필수
- 색상 대비 WCAG AA 기준 충족
- 키보드 포커스 스타일 유지

---

## 미결 사항 (추후 사용자 확인 필요)

- [ ] 동아리 정식 소개 문구 (한 줄 슬로건, 상세 소개)
- [ ] 주요 활동 목록 및 사진 자료
- [ ] 지원 링크 또는 SNS 링크 (카카오톡 오픈채팅, 인스타그램 등)
- [ ] 소속 대학교명
- [ ] 모집 기간 및 일정
- [ ] 임원진 정보 (이름, 역할, 사진)
