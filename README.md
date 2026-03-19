# NL (Network Leader) 홍보 페이지

이 프로젝트는 컴퓨터공학과 학술동아리 `NL(Network Leader)`의 신입생 모집 홍보 페이지입니다.  
Vite + React + TypeScript(엄격 모드) + Tailwind CSS로 구성되어 있으며, `Hero`에는 Spline 3D iframe을 사용합니다.

## 기능

- `Hero` 섹션: 코드 터미널 타이핑 효과 + Spline 3D 인터랙티브
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

프로덕션 빌드는 다음을 사용합니다.

```bash
npm run build
npm run preview
```

## 프로젝트 구조

- `src/components/`: UI 컴포넌트(섹션)
- `src/pages/`: 라우트 페이지(`Home`, `ActivityPage`, `ExecutivesPage`, `BlogPage`, `JoinPage`)
- `src/data/`: 교체 가능한 데이터만 모아둔 폴더
- `src/types/`: 공통 타입 정의

## 수정 포인트 (데이터만 교체)

대부분의 내용은 `src/data/`에서만 수정하면 됩니다.

- `src/data/config.ts`
  - `SPLINE_URL` (Hero에 사용되는 Spline URL)
  - `LINKS` (지원/소셜/이메일 링크 등)
  - `RECRUIT` (모집 시작/종료 날짜)
- `src/data/executives.ts`
  - 임원 카드(`현 임원진`) 정보
- `src/data/activities.ts`
  - 활동 소개 카드 정보
- `src/data/blogPosts.ts`
  - 블로그 카드 목록/태그/링크

## 모바일 고려 사항

- `Hero`의 Spline은 모바일에서 숨기고 간결한 배경으로 대체합니다(잘림/레이아웃 안정화).
- `Navbar`는 모바일에서 `Network Leader` 텍스트를 `NL`로 간단화하고, 햄버거 메뉴로 페이지 이동이 가능합니다.

## Spline 안내

`Hero` 컴포넌트는 `src/data/config.ts`의 `SPLINE_URL`을 사용해 iframe으로 씬을 로드합니다.

