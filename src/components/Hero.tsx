import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SPLINE_URL } from '../data/config';
import HeroCodeDisplay from './HeroCodeDisplay';

const MOBILE_MQ    = '(max-width: 767px)';
/** 1024×600 등 짧은 화면: Spline을 우측 슬롯에만 배치 */
const SHORT_WIDE_MQ = '(min-width: 1024px) and (max-height: 600px)';

// ── Hero 컴포넌트 ─────────────────────────────────────────────
export default function Hero({ onBoot }: { onBoot?: () => void }) {
  const [isMobile,   setIsMobile]   = useState(false);
  const [isShortWide, setIsShortWide] = useState(false);


  // 미디어 쿼리 감지
  useEffect(() => {
    const mqM = window.matchMedia(MOBILE_MQ);
    const mqS = window.matchMedia(SHORT_WIDE_MQ);
    const sync = () => {
      setIsMobile(mqM.matches);
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
    add(mqS, sync);
    return () => { rem(mqM, sync); rem(mqS, sync); };
  }, []);

  const showFullBleedSpline = !isMobile && !isShortWide;
  const showSplineRightSlot = !isMobile && isShortWide;

  // ── 배경 그라디언트 (Spline 없을 때) ─────────────────────────
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
      id="top"
      className="relative h-screen w-full overflow-x-clip overflow-y-clip bg-white"
    >
      {/* Spline 3D 배경 */}
      {showFullBleedSpline ? (
        <iframe
          src={SPLINE_URL}
          frameBorder={0}
          title="NL 3D 인터랙티브"
          className="hero-spline-frame"
        />
      ) : (
        gradientBg
      )}

      {/* ── 짧은 화면: 텍스트 좌측 + Spline 우측 슬롯 ─────────── */}
      {isShortWide ? (
        <div className="absolute inset-0 z-10 flex min-h-0 flex-row items-center gap-3 pt-16 pb-3 pl-5 pr-5 lg:gap-6 lg:pl-8 lg:pr-8 pointer-events-none">
          <div className="flex min-h-0 min-w-0 flex-1 basis-0 flex-col gap-3 lg:gap-4 pointer-events-none">
            {textBlock}
          </div>
          <div className="flex min-h-0 min-w-0 flex-1 basis-0 items-center justify-center pointer-events-auto">
            {showSplineRightSlot && (
              <div className="hero-spline-slot w-full shadow-sm ring-1 ring-[#E5E7EB]/80">
                <iframe
                  src={SPLINE_URL}
                  frameBorder={0}
                  title="NL 3D 인터랙티브"
                  className="hero-spline-iframe-fit"
                />
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ── 일반 레이아웃: 텍스트 + 부트 터미널 좌측 ─────────── */
        <div
          className="absolute inset-y-0 left-0 flex w-full pointer-events-none pt-20 pb-8 md:w-[52%] md:pt-22 md:pb-10 lg:pt-24 lg:pb-12"
          style={{ zIndex: 10, alignItems: 'safe center' }}
        >
          <div className="mx-auto flex w-full max-w-xl flex-col gap-4 px-8 md:max-w-none md:mx-0 md:pl-16 md:pr-8 lg:pl-24 lg:pr-6 md:gap-4 lg:gap-5">
            {textBlock}
            <div className="pointer-events-auto">
              <HeroCodeDisplay onBoot={onBoot} />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
