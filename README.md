# [NL (Network Leader) 홍보 페이지](https://enderpawar.github.io/NL_Homepage/)

<img alt="image" src="https://github.com/enderpawar/NL_Homepage/blob/1ba5ca2131f66c7b381eb8d1543f70c3eb78a91c/docs/README%20%EC%86%8C%EA%B0%9C%ED%8E%98%EC%9D%B4%EC%A7%802.gif" />

이 프로젝트는 컴퓨터공학과 학술동아리 `NL(Network Leader)`의 신입생 모집 홍보 페이지입니다.
Vite + React + TypeScript(엄격 모드) + Tailwind CSS로 구성되어 있으며, `Hero`에는 Spline 3D iframe을 사용합니다.
## 기능
[![Uploading image.png…]()

- `Hero` 섹션: 인터랙티브 터미널 + Spline 3D
  - 터미널은 기본 상태에서 동아리 소개 문구(JSDoc 형식)를 즉시 표시
  - 클릭 시 인터랙티브 모드 전환 (`cd`, `ls`, `fortune` 등 명령어 지원)
  - ESC 키로 인터랙티브 모드 종료 후 기본 문구로 복귀
- `활동소개`, `임원소개`, `블로그`: 라우팅 기반 섹션 페이지
- 모바일: 햄버거 메뉴(드롭다운)로 페이지 이동
- 아이콘: `Material Symbols` 기반(모바일/반응형에서 안정적으로 렌더링)

## 사용 기술

- React + TypeScript (Vite)
- Tailwind CSS
- React Router
- Spline 3D (iframe embed)

## 시작하기

```bash
npm install
npm run dev
```

프로덕션 빌드:

```bash
npm run build
npm run preview
```

## 프로젝트 구조

- `src/components/`: UI 컴포넌트(섹션)
- `src/pages/`: 라우트 페이지(`Home`, `ActivityPage`, `ExecutivesPage`, `BlogPage`, `JoinPage`)
- `src/data/`: 교체 가능한 데이터만 모아둔 폴더
- `src/types/`: 공통 타입 정의

## 유지보수 (데이터만 교체)

**TypeScript를 몰라도 됩니다.** `src/data/` 폴더 안의 파일만 수정하면 됩니다.

| 파일 | 수정 내용 |
|------|----------|
| `src/data/config.ts` | 링크(지원폼·카카오·인스타), 모집 기간, 공지 배너 |
| `src/data/executives.ts` | 임원 카드 목록 (매년 교체) |
| `src/data/activities.ts` | 활동 소개 카드 목록 |
| `src/data/blogPosts.ts` | 블로그 글 목록/태그/링크 |

자세한 수정 방법은 **[docs/MAINTENANCE.md](./docs/MAINTENANCE.md)** 를 참고하세요.

## Hero 섹션 구조

```
Hero
├── 좌측 (52% 너비)
│   ├── NL 배지
│   ├── 헤드라인 ("코드로 세상을 연결합니다")
│   ├── 서브타이틀
│   ├── CTA 버튼 (지원하기 / 더 알아보기)
│   └── HeroCodeDisplay (인터랙티브 터미널)
│       ├── 기본: 동아리 소개 문구 즉시 표시
│       ├── 클릭: 인터랙티브 터미널 모드 전환
│       └── ESC: 기본 문구로 복귀
└── 우측 (Spline 3D iframe — 55% 너비, right: -2%)
```

## Hero section 터미널 명령어

인터랙티브 모드에서 사용 가능한 명령어:

| 명령어 | 동작 |
|--------|------|
| `cd 활동소개` / `cd activity` | 활동소개 페이지 이동 |
| `cd 임원소개` / `cd executives` | 임원소개 페이지 이동 |
| `cd 블로그` / `cd blog` | 블로그 페이지 이동 |
| `cd 지원하기` / `cd join` | 지원하기 페이지 이동 |
| `ls` | 페이지 목록 |
| `date` | 현재 날짜/시간 |
| `fortune` | 랜덤 명언 |
| `cat README.md` | NL 소개 |
| `hack` | ??? |
| `/boot` | 인트로 애니메이션 재시작 |
| `clear` | 터미널 초기화 |
| `ESC` | 기본 문구로 복귀 |

## 모바일 고려 사항

- `Hero`의 Spline은 모바일에서 숨기고 간결한 그라디언트 배경으로 대체합니다.
- `Navbar`의 목록들은 햄버거 메뉴로 페이지 이동이 가능합니다.

## Spline 안내

`Hero` 컴포넌트는 `src/data/config.ts`의 `SPLINE_URL`을 사용해 iframe으로 씬을 로드합니다.
씬 교체 시 해당 값만 수정하면 됩니다.
