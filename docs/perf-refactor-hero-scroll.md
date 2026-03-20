# 성능 리팩토링 보고서 — Hero 섹션 스크롤 프레임 드랍 개선

**날짜**: 2026-03-20
**대상 환경**: 저사양 기기 (노트북 등) 스크롤 시 프레임 드랍 / RAM 급증
**변경 파일**: `src/index.css`, `src/components/Hero.tsx`, `src/components/StatsBanner.tsx`

---

## 문제 요약

히어로 섹션에서 아래로 스크롤 시 다음 증상 발생:

- 스크롤 중 프레임 드랍 (jank)
- RAM 사용량 급증 및 유지
- 저사양 기기에서 페이지 전반 버벅임

---

## 원인 분석

### 1순위 — Spline iframe의 지속적 WebGL 렌더링

**파일**: `src/components/Hero.tsx`, `src/index.css`

Spline은 WebGL 기반 3D 엔진이다. 히어로 섹션을 스크롤로 완전히 벗어난 이후에도 iframe이 DOM에 살아있어 GPU에서 3D 씬 렌더링을 계속 유지했다. `overflow-y-clip`은 시각적으로 가릴 뿐, WebGL 렌더링 루프는 멈추지 않는다.

xl 뷰포트에서는 iframe 크기가 뷰포트를 초과(`width: 124%`, `height: 112%`)하도록 설정되어 있어 GPU 부하가 더욱 컸다.

```css
/* xl 이상: 뷰포트를 초과하는 크기로 렌더링 */
.hero-spline-frame {
  width: 124%;
  height: 112%;
}
```

### 2순위 — `scroll-behavior: smooth` 전역 적용

**파일**: `src/index.css`

```css
* { scroll-behavior: smooth; }
```

`*` 셀렉터로 전체 적용 시 브라우저의 네이티브 fast-scroll 최적화 경로를 우회한다. 저사양 기기에서는 Spline WebGL과 겹쳐 스크롤마다 jank가 발생한다.

### 3순위 — StatsBanner CountUp의 `setInterval` 4개 동시 실행

**파일**: `src/components/StatsBanner.tsx`

```ts
const timer = setInterval(() => { ... }, 20); // 초당 50회 강제 실행
```

스크롤 중 IntersectionObserver가 발동하는 순간, 4개의 `CountUp` 컴포넌트가 동시에 20ms 간격의 setInterval을 시작한다. Spline WebGL + 스크롤 처리 + setInterval×4가 한 프레임 내에서 경합하여 병목이 발생한다.

### 4순위 — GPU 합성 레이어 미분리

**파일**: `src/index.css`

`.hero-spline-frame`에 `will-change`가 없어 브라우저가 Spline iframe을 별도의 GPU 합성 레이어로 미리 분리하지 못했다. 스크롤 중 레이어 재합성(re-compositing)이 발생하여 메인 스레드에 영향을 줬다.

---

## 변경 내역

### `src/index.css`

#### 1. `scroll-behavior` 범위 축소

```diff
- * { scroll-behavior: smooth; }
+ html { scroll-behavior: smooth; }
```

`*` → `html`로 범위를 축소하여 브라우저의 네이티브 스크롤 최적화가 정상 동작하도록 복원했다.

#### 2. `.hero-spline-frame`에 GPU 레이어 힌트 추가

```diff
  .hero-spline-frame {
    position: absolute;
    ...
+   will-change: transform;
+   transform: translateZ(0);
  }
```

`will-change: transform`으로 브라우저에 GPU 합성 레이어를 미리 할당하도록 힌트를 제공했다. `translateZ(0)`은 레이어 분리를 강제하여 스크롤 중 재합성 비용을 제거한다.

---

### `src/components/Hero.tsx`

#### Spline iframe — 뷰포트 이탈 시 WebGL 렌더링 중지

`IntersectionObserver`로 히어로 섹션의 가시성을 감지하고, 뷰포트 밖으로 나가면 iframe `src`를 빈 문자열로 교체한다. 브라우저는 src가 없는 iframe의 WebGL 컨텍스트를 즉시 해제한다.

```diff
- import { useState, useEffect } from 'react';
+ import { useState, useEffect, useRef } from 'react';

  export default function Hero({ onBoot }) {
+   const [splineActive, setSplineActive] = useState(true);
+   const heroRef = useRef<HTMLElement>(null);

+   useEffect(() => {
+     const el = heroRef.current;
+     if (!el) return;
+     const observer = new IntersectionObserver(
+       ([entry]) => setSplineActive(entry.isIntersecting),
+       { threshold: 0 }
+     );
+     observer.observe(el);
+     return () => observer.disconnect();
+   }, []);

-   <section id="top" ...>
+   <section ref={heroRef} id="top" ...>

-   <iframe src={SPLINE_URL} ... />
+   <iframe src={splineActive ? SPLINE_URL : ''} ... />
```

`threshold: 0` 설정으로 섹션이 1px라도 뷰포트에 걸쳐 있으면 활성 상태를 유지하고, 완전히 벗어날 때만 해제한다. 다시 스크롤을 올리면 src가 복원되어 Spline이 재로드된다.

---

### `src/components/StatsBanner.tsx`

#### `setInterval` → `requestAnimationFrame` 교체

```diff
  useEffect(() => {
    if (!active) return;
-   let cur = 0;
-   const step = Math.max(1, Math.ceil(target / 60));
-   const timer = setInterval(() => {
-     cur += step;
-     if (cur >= target) { setCount(target); clearInterval(timer); }
-     else setCount(cur);
-   }, 20);
-   return () => clearInterval(timer);
+   const duration = 1200;
+   const start = performance.now();
+   let raf: number;
+   const tick = (now: number) => {
+     const progress = Math.min((now - start) / duration, 1);
+     setCount(Math.round(progress * target));
+     if (progress < 1) raf = requestAnimationFrame(tick);
+   };
+   raf = requestAnimationFrame(tick);
+   return () => cancelAnimationFrame(raf);
  }, [active, target]);
```

`setInterval(20ms)`는 브라우저 프레임과 무관하게 초당 50회 강제 실행된다. `requestAnimationFrame`은 브라우저의 실제 렌더링 사이클(보통 60fps)에 맞춰 실행되며, 탭이 백그라운드이거나 스크롤 중 렌더러가 바쁠 때는 자동으로 실행을 미뤄 메인 스레드 경합을 줄인다.

---

## 예상 효과

| 항목 | 변경 전 | 변경 후 |
|---|---|---|
| 히어로 이탈 후 GPU 사용 | Spline WebGL 지속 실행 | WebGL 컨텍스트 즉시 해제 |
| 스크롤 중 메인 스레드 경합 | setInterval×4 + 스크롤 동시 실행 | rAF가 스크롤 프레임에 양보 |
| 스크롤 렌더링 경로 | `*` smooth로 최적화 우회 | 네이티브 fast-scroll 복원 |
| Spline iframe 합성 레이어 | 스크롤 중 재합성 발생 | GPU 레이어 미리 분리 |
