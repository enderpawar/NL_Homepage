# NL Homepage — 성능 최적화 기록

> 이 문서는 히어로 섹션 스크롤 프레임 드랍 및 Spline 3D 로딩 안정성 문제를 해결하는 과정에서 적용한 모든 최적화 내용을 기록한다.

---

## 목차

1. [배경 및 문제 정의](#1-배경-및-문제-정의)
2. [최적화 1 — 스크롤 렌더링 성능](#2-최적화-1--스크롤-렌더링-성능)
3. [최적화 2 — Spline WebGL 메모리 관리](#3-최적화-2--spline-webgl-메모리-관리)
4. [최적화 3 — 카운트업 애니메이션](#4-최적화-3--카운트업-애니메이션)
5. [버그 수정 — Spline 로딩 안정성 (Issue #4)](#5-버그-수정--spline-로딩-안정성-issue-4)
6. [코드 품질 개선](#6-코드-품질-개선)
7. [최적화 효과 요약](#7-최적화-효과-요약)

---

## 1. 배경 및 문제 정의

### 증상

- 저사양 기기(노트북 등)에서 히어로 섹션을 스크롤로 벗어날 때 **프레임 드랍(jank)** 발생
- 스크롤 중 **RAM 사용량 급증** 후 유지
- 새로고침 시 **일정 확률로 Spline 3D 모델이 로딩되지 않는 현상** (Issue #4)

### 환경

- React + TypeScript (Vite)
- Tailwind CSS
- Spline 3D: WebGL 기반 cross-origin iframe embed
- 대상 기기: 저사양 노트북 포함 일반 데스크톱/태블릿

---

## 2. 최적화 1 — 스크롤 렌더링 성능

### 2-1. `scroll-behavior` 범위 축소

**파일**: `src/index.css`

```diff
- * { scroll-behavior: smooth; }
+ html { scroll-behavior: smooth; }
```

**원인**: `*` 셀렉터로 전체 적용 시 브라우저의 네이티브 fast-scroll 최적화 경로가 우회된다. 모든 요소가 smooth scroll을 강제받아 저사양 기기에서 스크롤 이벤트마다 추가 레이아웃 연산이 발생했다.

**효과**: `html`로 범위를 좁혀 앵커 이동(`#about` 등)에만 smooth scroll이 적용되고, 일반 페이지 스크롤은 브라우저 native 경로를 타도록 복원했다.

---

### 2-2. GPU 합성 레이어 미리 분리

**파일**: `src/index.css` — `.hero-spline-frame`

```diff
  .hero-spline-frame {
    position: absolute;
    ...
+   will-change: transform;
+   transform: translateZ(0);
  }
```

**원인**: `.hero-spline-frame`에 GPU 합성 힌트가 없어 스크롤 중 브라우저가 Spline iframe을 포함한 레이어를 매 프레임마다 재합성(re-compositing)했다. 이 재합성 비용이 메인 스레드에서 발생하며 스크롤 성능에 영향을 줬다.

**효과**:
- `will-change: transform` — 브라우저에 GPU 합성 레이어를 미리 할당하도록 힌트 제공
- `transform: translateZ(0)` — 레이어 분리를 강제하여 스크롤 중 재합성 비용 제거
- Spline이 이미 WebGL(GPU) 기반이므로 GPU 메모리 추가 부담은 무시 수준

---

## 3. 최적화 2 — Spline WebGL 메모리 관리

**파일**: `src/components/Hero.tsx`

### 문제

Spline은 WebGL 기반 3D 엔진으로, iframe이 DOM에 존재하는 한 뷰포트에서 보이지 않아도 **GPU에서 3D 씬 렌더링 루프를 지속**한다. 히어로 섹션(`h-screen`)을 스크롤로 완전히 벗어난 이후에도 GPU/RAM 점유가 유지됐다. `overflow-y-clip`은 시각적으로 가릴 뿐, WebGL 렌더링 루프는 멈추지 않는다.

### 해결: IntersectionObserver + src 해제

```tsx
const [splineActive, setSplineActive] = useState(true);

useEffect(() => {
  const el = heroRef.current;
  if (!el) return;
  let timeout = 0;
  let observer: IntersectionObserver | null = null;

  // 2000ms 딜레이: 브라우저 scroll restoration 완료 후에 관찰 시작
  const setupDelay = window.setTimeout(() => {
    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          clearTimeout(timeout);
          setSplineActive(true);
        } else {
          // 800ms 딜레이: 빠른 scroll-back 시 재로드 비용 방지
          timeout = window.setTimeout(() => setSplineActive(false), 800);
        }
      },
      { threshold: 0 }
    );
    observer.observe(el);
  }, 2000);

  return () => {
    clearTimeout(setupDelay);
    clearTimeout(timeout);
    observer?.disconnect();
  };
}, []);

// iframe
<iframe src={splineActive ? SPLINE_URL : ''} ... />
```

**핵심 동작**:
- 히어로가 뷰포트에서 벗어나면 800ms 후 `src=''` → 브라우저가 WebGL 컨텍스트 즉시 해제
- 다시 스크롤 올리면 `src` 복원 → Spline 재로드
- **2000ms 시작 딜레이**: 브라우저 scroll restoration이 완료되기 전에 observer가 발동하여 `splineActive=false`로 잘못 전환되는 레이스 조건 방지
- **800ms 비활성화 딜레이**: 사용자가 히어로 경계에서 빠르게 scroll-back 시 불필요한 Spline 재로드(WebGL init ~500ms) 방지

---

## 4. 최적화 3 — 카운트업 애니메이션

**파일**: `src/components/StatsBanner.tsx`

### 문제

```ts
// 변경 전
const timer = setInterval(() => {
  cur += step;
  if (cur >= target) { setCount(target); clearInterval(timer); }
  else setCount(cur);
}, 20); // 초당 50회 강제 실행
```

4개의 `CountUp` 컴포넌트가 각각 20ms 간격 `setInterval`을 실행했다. 스크롤 중 `IntersectionObserver`가 발동하는 순간 4개가 동시에 시작되어 Spline WebGL + 스크롤 + `setInterval×4`가 한 프레임 내에서 경합했다.

추가로 `let raf: number`로 선언된 미초기화 변수가 정리 함수에서 `cancelAnimationFrame(raf)`에 사용되어 TypeScript 타입 안전성 위반이 있었다.

### 해결: `requestAnimationFrame` 기반 애니메이션

```ts
// 변경 후
let raf = 0;
const tick = (now: number) => {
  const progress = Math.min((now - start) / duration, 1);
  setCount(Math.round(progress * target));
  if (progress < 1) raf = requestAnimationFrame(tick);
};
raf = requestAnimationFrame(tick);
return () => cancelAnimationFrame(raf);
```

**효과**:
- `requestAnimationFrame`은 브라우저의 실제 렌더링 사이클(~60fps)에 맞춰 실행
- 탭이 백그라운드이거나 스크롤 중 렌더러가 바쁠 때 **자동으로 실행을 미뤄** 메인 스레드 경합 해소
- `setInterval(20ms)`(강제 50fps)에서 브라우저 주도 스케줄링으로 전환
- `let raf = 0` 초기화로 cleanup의 타입 안전성 확보

---

## 5. 버그 수정 — Spline 로딩 안정성 (Issue #4)

> **이슈**: 새로고침 시 일정 확률로 3D 모델이 로딩되지 않는 버그

### 원인 분석

| 실패 모드 | 기존 동작 |
|---|---|
| Spline HTTP 오류 (4xx/5xx) | `onError` → 2초 후 **무한** 재시도 |
| WebGL 무음(silent) 초기화 실패 | **감지 불가** → 흰 공백 유지 |
| 정상 로딩 중 (1.5~2.5초) | **시각적 피드백 없음** → 흰 공백 |

**핵심 제약**: Spline iframe은 cross-origin(`my.spline.design`)이므로 WebGL 렌더링 완료를 부모에서 감지할 수 없다. `onError`는 HTTP 레벨 실패만 감지하며, `onLoad`는 iframe HTML 문서 로드 시점(~500-1000ms)에 발화하고 WebGL 준비 완료(~1500-2500ms)와는 다르다.

### 해결 전략

> `gradientBg`를 항상 base layer로 렌더링 → iframe을 `opacity: 0`으로 시작 → `onLoad` 시 fade-in.
> WebGL 무음 실패 시 공백 iframe 아래로 gradient가 자동 폴백.

### 상태 흐름

```
페이지 로드
  ├─ gradientBg 즉시 표시 (항상 렌더링)
  ├─ shimmerPlaceholder 표시 (splineLoaded=false & retries<3)
  └─ iframe opacity:0 으로 백그라운드 로드
        │
        ▼ onLoad 발화 (~500-1000ms)
        setSplineLoaded(true)
        opacity 0 → 1 (0.8s transition)
        shimmer 언마운트
        │
        ▼ [성공] Spline 표시, gradient가 하단 레이어로 유지

 ─ HTTP 실패 경로 ───────────────────────────────────────────
        onError → retries < 3: 지수 백오프 (2s/4s/6s) → splineKey++
                  splineLoaded 리셋 → shimmer 재표시 → 새 iframe 로드
                retries >= 3: 종료 → gradient 영구 표시

 ─ WebGL 무음 실패 경로 ─────────────────────────────────────
        onError 발화 안 함, onLoad 발화 → opacity:1 전환
        iframe 내부는 공백이지만 gradient가 하단 레이어로 보임
        → 사용자에게는 gradient 배경으로 표시 (자연스러운 폴백)
```

### 구현 내용

**`src/components/Hero.tsx`**

```tsx
const MAX_RETRIES = 3;
const [splineLoaded,  setSplineLoaded]  = useState(false);
const [splineRetries, setSplineRetries] = useState(0);

// 재시도 시 로딩 상태 리셋
useEffect(() => { setSplineLoaded(false); }, [splineKey]);

// onLoad: fade-in 트리거
const handleSplineLoad = () => setSplineLoaded(true);

// onError: 지수 백오프 재시도, 3회 초과 시 종료
const handleSplineError = () => {
  if (splineRetries >= MAX_RETRIES) return;
  const backoffMs = (splineRetries + 1) * 2000; // 2s, 4s, 6s
  window.setTimeout(() => {
    setSplineRetries(r => r + 1);
    setSplineKey(k => k + 1);
  }, backoffMs);
};

// 렌더링 구조
{gradientBg}  {/* 항상 표시 */}
{showFullBleedSpline && !splineLoaded && splineRetries < MAX_RETRIES && shimmerPlaceholder}
{showFullBleedSpline && (
  <iframe
    key={splineKey}
    src={splineActive ? SPLINE_URL : ''}
    style={{
      opacity: splineLoaded ? 1 : 0,
      transition: splineLoaded ? 'opacity 0.8s ease' : 'none',
    }}
    onLoad={handleSplineLoad}
    onError={handleSplineError}
  />
)}
```

**`src/index.css`** — shimmer 애니메이션

```css
@keyframes splineShimmer {
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
}

.hero-spline-shimmer {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    rgba(79, 70, 229, 0.04) 0%,
    rgba(79, 70, 229, 0.10) 40%,
    rgba(6, 182, 212, 0.07) 60%,
    rgba(79, 70, 229, 0.04) 100%
  );
  background-size: 200% 100%;
  animation: splineShimmer 2.2s ease-in-out infinite;
  pointer-events: none;
  z-index: 1;
}
```

shimmer 색상은 `gradientBg`의 인디고/시안 계열과 통일. 강도(0.04~0.10)를 낮게 유지해 로딩 힌트 수준에 그치도록 설계.

---

## 6. 코드 품질 개선

### 6-1. `let raf: number` 미초기화 수정

**파일**: `src/components/StatsBanner.tsx`

```diff
- let raf: number;
+ let raf = 0;
```

`let raf: number` 선언 시 실제 값은 `undefined`이나 TypeScript 타입은 `number`로 표기되어 타입 불일치가 발생했다. `cancelAnimationFrame(undefined)`는 silently ignore되므로 런타임 오류는 없으나, 클린업 함수의 타입 안전성을 확보하기 위해 `0`으로 초기화했다.

### 6-2. IntersectionObserver 재사용 가능성 검토

기존 `src/hooks/useInView.ts` 훅과의 재사용을 검토했으나, 두 훅의 시맨틱이 다르다:

| | `useInView` | Hero의 IntersectionObserver |
|---|---|---|
| 방향성 | 단방향 (한 번 `true`, 이후 유지) | 양방향 (`true` ↔ `false`) |
| 용도 | 스크롤 진입 시 한 번 애니메이션 실행 | Spline 활성/비활성 토글 |

`useInView`를 수정하면 `StatsBanner` 등 기존 사용처에서 애니메이션이 재시작되는 부작용이 발생하므로 Hero 전용 로직으로 분리 유지.

---

## 7. 최적화 효과 요약

| 항목 | 변경 전 | 변경 후 |
|---|---|---|
| 히어로 이탈 후 GPU 점유 | Spline WebGL 지속 실행 | 800ms 후 WebGL 컨텍스트 해제 |
| 스크롤 렌더링 경로 | `*` smooth로 native fast-scroll 우회 | `html`로 한정, native 경로 복원 |
| Spline 합성 레이어 | 스크롤 중 매 프레임 재합성 | GPU 레이어 미리 분리 |
| CountUp 스케줄링 | `setInterval(20ms)` 강제 50fps × 4 | `requestAnimationFrame` 브라우저 주도 |
| Spline 로딩 중 UI | 흰 공백 1.5~2.5초 | shimmer placeholder 표시 |
| Spline 로딩 실패 (HTTP) | 무한 재시도 | 최대 3회, 지수 백오프 (2s/4s/6s) |
| WebGL 무음 실패 | 흰 공백 영구 유지 | gradient fallback 자동 표시 |
| scroll restoration 레이스 | `splineActive` 오탐 가능성 | 2000ms 딜레이로 안전 구간 확보 |

### 변경된 파일

| 파일 | 변경 성격 |
|---|---|
| `src/components/Hero.tsx` | Spline 렌더링 안정성, IntersectionObserver, 로딩 상태 관리 |
| `src/components/StatsBanner.tsx` | CountUp 스케줄링 개선, 타입 안전성 |
| `src/index.css` | scroll-behavior, GPU 레이어 힌트, shimmer 애니메이션 |
