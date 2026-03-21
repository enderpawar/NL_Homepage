import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { SPLINE_URL } from '../data/config';
import HeroCodeDisplay from './HeroCodeDisplay';

const MOBILE_MQ    = '(max-width: 767px)';
/** 768px~1399px 태블릿 구간: full-bleed Spline 숨김 (iPad Pro 12.9" 가로까지 포함) */
const TABLET_WIDE_MQ = '(min-width: 768px) and (max-width: 1399px)';
/** 1024×600 등 짧은 화면 (Nest Hub 등) */
const SHORT_WIDE_MQ = '(min-width: 1024px) and (max-height: 600px)';
const MAX_RETRIES = 3;

// ── Hero 컴포넌트 ─────────────────────────────────────────────
export default function Hero({ onBoot }: { onBoot?: () => void }) {
  const [isMobile,     setIsMobile]     = useState(false);
  const [isTabletWide, setIsTabletWide] = useState(false);
  const [isShortWide,  setIsShortWide]  = useState(false);
  const [splineActive, setSplineActive] = useState(true);
  const [splineKey,    setSplineKey]    = useState(0);
  const [splineLoaded, setSplineLoaded] = useState(false);
  const [splineRetries, setSplineRetries] = useState(0);
  const heroRef = useRef<HTMLElement>(null);

  // 히어로 섹션이 뷰포트 밖으로 나가면 Spline WebGL 렌더링 중지.
  // 2000ms 후 관찰 시작: 브라우저 scroll restoration 완료 이후에 동작하여
  // 초기 로드 시 splineActive가 잘못 false로 전환되는 레이스 조건 방지.
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    let timeout = 0;
    let observer: IntersectionObserver | null = null;

    const setupDelay = window.setTimeout(() => {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            clearTimeout(timeout);
            setSplineActive(true);
          } else {
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

  // splineKey 변경(재시도) 시 로딩 상태 리셋
  useEffect(() => { setSplineLoaded(false); }, [splineKey]);

  // 미디어 쿼리 감지
  useEffect(() => {
    const mqM = window.matchMedia(MOBILE_MQ);
    const mqT = window.matchMedia(TABLET_WIDE_MQ);
    const mqS = window.matchMedia(SHORT_WIDE_MQ);
    const sync = () => {
      setIsMobile(mqM.matches);
      setIsTabletWide(mqT.matches);
      setIsShortWide(mqS.matches);
    };
    sync();
    const add = (mq: MediaQueryList, fn: () => void) => {
      if (typeof mq.addEventListener === 'function') mq.addEventListener('change', fn);
      else mq.addListener(fn);
    };
    const rem = (mq: MediaQueryList, fn: () => void) => {
      if (typeof mq.removeEventListener === 'function') mq.removeEventListener('change', fn);
      else mq.removeListener(fn);
    };
    add(mqM, sync);
    add(mqT, sync);
    add(mqS, sync);
    return () => { rem(mqM, sync); rem(mqT, sync); rem(mqS, sync); };
  }, []);

  // 풀-블리드 Spline은 데스크톱(1400px+)에서만 표시
  const showFullBleedSpline = !isMobile && !isTabletWide && !isShortWide;

  // iframe onLoad: HTML 문서 로드 완료 → fade-in 시작
  const handleSplineLoad = () => setSplineLoaded(true);

  // iframe onError: HTTP 실패 시 지수 백오프 재시도 (최대 3회: 2s/4s/6s)
  const handleSplineError = () => {
    if (splineRetries >= MAX_RETRIES) return;
    const backoffMs = (splineRetries + 1) * 2000;
    window.setTimeout(() => {
      setSplineRetries(r => r + 1);
      setSplineKey(k => k + 1);
    }, backoffMs);
  };

  // ── 배경 그라디언트 — 항상 렌더링: 로딩 중 + WebGL 실패 폴백 ──
  const gradientBg = (
    <div
      aria-hidden="true"
      className="absolute inset-0"
      style={{
        background:
          'radial-gradient(ellipse at 20% 15%, rgba(79,70,229,0.18) 0%, transparent 45%),' +
          'radial-gradient(ellipse at 75% 65%, rgba(6,182,212,0.12) 0%, transparent 45%),' +
          'radial-gradient(ellipse at 50% 100%, rgba(79,70,229,0.06) 0%, transparent 50%)',
      }}
    />
  );

  // shimmer: 로딩 중에만 표시, 재시도 한도 초과 시 숨김
  const shimmerPlaceholder = (
    <div aria-hidden="true" className="absolute inset-0 hero-spline-shimmer" />
  );

  // ── 좌측 텍스트 블록 ─────────────────────────────────────────
  const textBlock = (
    <>
      <span className="inline-flex items-center gap-1.5 bg-[#EEF2FF]/90 backdrop-blur-sm text-[#4F46E5] text-xs font-semibold px-3 py-1 rounded-full w-fit border border-[#4F46E5]/20">
        <span className="font-mono font-bold tracking-wider">NL</span>
        <span className="text-[#4F46E5]/40">·</span>
        <span className="tracking-wide">Network Leader</span>
      </span>
      <h1
        className="font-black text-[#111111] leading-[1.03] tablet:tracking-tight"
        style={{ fontSize: 'clamp(3rem, 6vw, 5rem)' }}
      >
        코드로 세상을
        <br />
        연결합니다
      </h1>
      <p className="text-[#444444] text-[0.95rem] tablet:text-[0.9rem] leading-relaxed">
        NL(Network Leader)은 컴퓨터공학과 학생들이<br />함께 배우고, 만들고, 성장하는 학술동아리입니다.
      </p>
      <div className="flex flex-wrap gap-3 pointer-events-auto">
        <Link
          to="/join"
          className="bg-[#4F46E5] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#4338CA] transition-colors text-base shadow-lg"
        >
          지원하기
        </Link>
        <a
          href="#about"
          className="border border-[#D1D5DB] bg-white/70 backdrop-blur-sm text-[#111111] font-semibold px-6 py-3 rounded-lg hover:border-[#4F46E5] hover:text-[#4F46E5] transition-colors text-base"
        >
          더 알아보기
        </a>
      </div>
    </>
  );

  return (
    <section
      ref={heroRef}
      id="top"
      className="relative h-screen w-full overflow-x-clip overflow-y-clip bg-white"
    >
      {/* 배경 그라디언트 — 항상 렌더링 */}
      {gradientBg}

      {/* Spline 로딩 shimmer (로드 전 + 재시도 한도 미초과 시) */}
      {showFullBleedSpline && !splineLoaded && splineRetries < MAX_RETRIES && (
        shimmerPlaceholder
      )}

      {/* Spline 풀-블리드 iframe — opacity로 fade-in 제어 */}
      {showFullBleedSpline && (
        <iframe
          key={splineKey}
          src={splineActive ? SPLINE_URL : ''}
          frameBorder={0}
          title="NL 3D 인터랙티브"
          className="hero-spline-frame"
          style={{
            opacity: splineLoaded ? 1 : 0,
            transition: splineLoaded ? 'opacity 0.8s ease' : 'none',
          }}
          onLoad={handleSplineLoad}
          onError={handleSplineError}
        />
      )}

      {/* 데스크톱 전용: Spline 위 그라디언트 오버레이
          Spline(z-index 0) 위, 콘텐츠(z-index 10) 아래에 위치.
          pointer-events none으로 Spline 마우스 인터랙션 유지.
          모바일·태블릿과 같은 색상 계열로 배경이 쨍하게 보이지 않도록 처리. */}
      {showFullBleedSpline && (
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 5,
            background:
              'radial-gradient(ellipse at 18% 22%, rgba(79,70,229,0.22) 0%, transparent 50%),' +
              'radial-gradient(ellipse at 74% 62%, rgba(6,182,212,0.15) 0%, transparent 48%),' +
              'radial-gradient(ellipse at 48% 96%, rgba(79,70,229,0.10) 0%, transparent 52%),' +
              'radial-gradient(ellipse at 90% 10%, rgba(79,70,229,0.07) 0%, transparent 38%)',
          }}
        />
      )}

      {/* ── 태블릿 가로 / 짧은 화면: 텍스트 좌측 + 터미널 우측 ── */}
      {(isShortWide || isTabletWide) ? (
        <div
          className="absolute inset-0 z-10 flex min-h-0 flex-row items-center pointer-events-none"
          style={{
            gap: isShortWide ? '0.75rem' : '2rem',
            padding: isShortWide ? '4rem 1.25rem 0.75rem' : '5rem 3rem 2rem 4rem',
          }}
        >
          {/* 좌측 텍스트 */}
          <div className="flex min-h-0 min-w-0 flex-1 basis-0 flex-col gap-3 lg:gap-4 pointer-events-none">
            {textBlock}
          </div>
          {/* 우측 터미널 */}
          <div className="flex min-h-0 min-w-0 flex-1 basis-0 items-center justify-center pointer-events-auto">
            <HeroCodeDisplay onBoot={onBoot} />
          </div>
        </div>
      ) : (
        /* ── 데스크톱 레이아웃: 텍스트 + 부트 터미널 좌측 ─────── */
        <div
          className="absolute inset-y-0 left-0 flex w-full pointer-events-none pt-20 pb-8 md:w-[52%] md:pt-22 md:pb-10 lg:pt-24 lg:pb-12"
          style={{ zIndex: 10, alignItems: 'safe center' }}
        >
          <div className="mx-auto flex w-full max-w-xl flex-col gap-4 px-8 md:max-w-none md:mx-0 md:pl-16 md:pr-8 lg:pl-24 lg:pr-6 md:gap-4 lg:gap-5">
            {textBlock}
            <div className="pointer-events-auto">
              <HeroCodeDisplay onBoot={onBoot} compact={isMobile} />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
