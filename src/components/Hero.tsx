import { useState, useRef, useCallback, useEffect, type RefObject } from 'react';
import { Link } from 'react-router-dom';
import { SPLINE_URL } from '../data/config';

// ── 색상 팔레트 ──────────────────────────────────────────────
const COLORS: Record<string, string> = {
  kw:  '#C792EA',
  key: '#82AAFF',
  str: '#C3E88D',
  num: '#F78C6C',
  cmt: '#546E7A',
  op:  '#89DDFF',
  pl:  '#EEFFFF',
};


// ── 코드 토큰 정의 (\n 포함) ─────────────────────────────────
type Token = { c: string; v: string };

const CODE_TOKENS: Token[] = [
  { c: 'cmt', v: '// club.config.ts\n' },
  { c: 'pl',  v: '\n' },
  { c: 'kw',  v: 'export const ' },
  { c: 'key', v: 'NL' },
  { c: 'op',  v: ' = {\n' },
  { c: 'pl',  v: '  ' }, { c: 'key', v: 'name'    }, { c: 'op', v: ':    ' }, { c: 'str', v: '"Network Leader"' }, { c: 'op', v: ',\n' },
  { c: 'pl',  v: '  ' }, { c: 'key', v: 'since'   }, { c: 'op', v: ':   ' }, { c: 'num', v: '2019'             }, { c: 'op', v: ',\n' },
  { c: 'pl',  v: '  ' }, { c: 'key', v: 'members' }, { c: 'op', v: ': '  }, { c: 'num', v: '32'               }, { c: 'op', v: ',\n' },
  { c: 'pl',  v: '  ' }, { c: 'key', v: 'mission' }, { c: 'op', v: ': '  }, { c: 'str', v: '"함께 성장하기"'      }, { c: 'op', v: ',\n' },
  { c: 'pl',  v: '  ' }, { c: 'key', v: 'stack'   }, { c: 'op', v: ':   [' },
    { c: 'str', v: '"C++"' }, { c: 'op', v: ', ' },
    { c: 'str', v: '"Python"' }, { c: 'op', v: ', ' },
    { c: 'str', v: '"JS"' },
  { c: 'op', v: '],\n' },
  { c: 'op', v: '};' },
];

// ── 토큰 → { char, color }[] 평탄화 ──────────────────────────
type CharColor = { char: string; color: string };

const CHAR_COLORS: CharColor[] = CODE_TOKENS.flatMap(tok =>
  [...tok.v].map(char => ({ char, color: COLORS[tok.c] ?? '#EEFFFF' }))
);

// ── 줄별로 분리 (offset = CHAR_COLORS 내 해당 줄 시작 인덱스) ─
type Line = { chars: CharColor[]; offset: number };

function buildLines(): Line[] {
  const lines: Line[] = [];
  let offset = 0;
  let current: CharColor[] = [];
  for (let i = 0; i < CHAR_COLORS.length; i++) {
    if (CHAR_COLORS[i].char === '\n') {
      lines.push({ chars: current, offset });
      offset += current.length + 1; // +1 은 \n 자리
      current = [];
    } else {
      current.push(CHAR_COLORS[i]);
    }
  }
  if (current.length > 0) lines.push({ chars: current, offset });
  return lines;
}

const LINES = buildLines();

const MOBILE_MQ = '(max-width: 767px)';
/** 1024×600 등: 전체 레이어 Spline 대신 우측 슬롯에만 3D(중앙·축소), 터미널은 생략 */
const SHORT_WIDE_MQ = '(min-width: 1024px) and (max-height: 600px)';

type HeroCodeTerminalProps = {
  termRef: RefObject<HTMLDivElement | null>;
  focused: boolean;
  setFocused: (v: boolean) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  typed: string;
  progress: number;
  isDone: boolean;
  compact?: boolean;
};

function HeroCodeTerminal({
  termRef,
  focused,
  setFocused,
  handleKeyDown,
  typed,
  progress,
  isDone,
  compact,
}: HeroCodeTerminalProps) {
  return (
    <div
      ref={termRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onClick={() => termRef.current?.focus()}
      className={`rounded-xl overflow-hidden shadow-xl outline-none pointer-events-auto cursor-text transition-all duration-200 w-full ${compact ? 'max-h-[min(520px,calc(100dvh-6rem))] flex flex-col' : ''}`}
      style={{
        background: 'rgba(15,15,27,0.92)',
        backdropFilter: 'blur(14px)',
        border: `1px solid ${focused ? 'rgba(79,70,229,0.6)' : 'rgba(255,255,255,0.1)'}`,
        boxShadow: focused ? '0 0 0 2px rgba(79,70,229,0.2)' : undefined,
      }}
    >
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 select-none shrink-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57] shrink-0" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] shrink-0" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28CA41] shrink-0" />
          <span className="ml-3 font-mono text-xs text-white/30 truncate">club.config.ts</span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {isDone ? (
            <span className="font-mono text-xs text-[#28CA41]">✓ 완료!</span>
          ) : typed.length > 0 ? (
            <span className="font-mono text-xs text-white/30">{progress}%</span>
          ) : (
            <span className="font-mono text-xs text-white/25 animate-pulse hidden sm:inline">클릭 후 따라치기 →</span>
          )}
        </div>
      </div>

      <div className="h-0.5 bg-white/5 shrink-0">
        <div
          className="h-full bg-[#4F46E5] transition-all duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className={`px-5 py-4 select-none tablet:px-4 tablet:py-3 ${compact ? 'min-h-0 flex-1 overflow-y-auto' : ''}`}>
        <pre className={`font-mono text-[0.72rem] tablet:text-[0.74rem] lg:text-[0.78rem] leading-6 ${compact ? 'text-[0.68rem] leading-[1.35]' : ''}`}>
          {LINES.map((line, lineIdx) => (
            <div key={lineIdx} className="flex">
              <span className="text-white/20 w-5 shrink-0 text-right mr-4">{lineIdx + 1}</span>
              <span>
                {line.chars.map((cc, ci) => {
                  const fi = line.offset + ci;
                  const beforeCursor = fi < typed.length;
                  const isCursor     = fi === typed.length;
                  const wrong        = beforeCursor && typed[fi] !== cc.char;

                  return (
                    <span
                      key={ci}
                      style={{
                        color: wrong ? '#FF5555' : cc.color,
                        opacity: 1,
                        backgroundColor:
                          isCursor && focused ? 'rgba(79,70,229,0.75)' :
                          wrong               ? 'rgba(255,85,85,0.18)' : 'transparent',
                        outline: isCursor && !focused ? '1px solid #4F46E5' : undefined,
                      }}
                    >
                      {cc.char === ' ' ? '\u00A0' : cc.char}
                    </span>
                  );
                })}

                {line.offset + line.chars.length === typed.length && (
                  <span
                    style={{
                      display: 'inline-block',
                      width: '2px',
                      height: '0.9em',
                      backgroundColor: focused ? '#4F46E5' : 'transparent',
                      verticalAlign: 'text-bottom',
                    }}
                    className={focused ? 'animate-pulse' : ''}
                  />
                )}
              </span>
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
}

// ── Hero 컴포넌트 ─────────────────────────────────────────────
export default function Hero() {
  const [typed, setTyped]     = useState('');
  const [focused, setFocused] = useState(false);
  const termRef               = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isShortWide, setIsShortWide] = useState(false);

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
    return () => {
      rem(mqM, sync);
      rem(mqS, sync);
    };
  }, []);

  const showFullBleedSpline = !isMobile && !isShortWide;
  const showSplineRightSlot   = !isMobile && isShortWide;

  const progress = Math.round((typed.length / CHAR_COLORS.length) * 100);
  const isDone   = typed.length >= CHAR_COLORS.length;

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (isDone && e.key !== 'Backspace') return;

    if (e.key === 'Backspace') {
      setTyped(t => t.slice(0, -1));
    } else if (e.key === 'Enter') {
      setTyped(t => t + '\n');
    } else if (e.key === 'Tab') {
      setTyped(t => t + '  ');
    } else if (e.key.length === 1) {
      setTyped(t => t + e.key);
    }
  }, [isDone]);

  const gradientBg = (
    <div
      aria-hidden="true"
      className="absolute inset-0"
      style={{
        background:
          'radial-gradient(circle at 15% 10%, rgba(79,70,229,0.10) 0%, transparent 40%), radial-gradient(circle at 70% 60%, rgba(130,170,255,0.10) 0%, transparent 45%)',
      }}
    />
  );

  const textBlock = (
    <>
      <span className="inline-block bg-[#EEF2FF]/90 backdrop-blur-sm text-[#4F46E5] text-xs font-semibold px-3 py-1 rounded-full w-fit tracking-wide uppercase border border-[#4F46E5]/20">
        NL -NetWork Leader
      </span>
      <h1
        className="font-black text-[#111111] leading-[1.1] tablet:tracking-tight"
        style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)' }}
      >
        코드로 세상을<br />연결합니다
      </h1>
      <p className="text-[#444444] text-[0.95rem] tablet:text-[0.9rem] leading-relaxed">
        NL(Network Leader)은 컴퓨터공학과 학생들이<br />함께 배우고, 만들고, 성장하는 학술동아리입니다.
      </p>
      <div className="flex flex-wrap gap-3 pointer-events-auto">
        <Link
          to="/join"
          className="bg-[#4F46E5] text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-[#4338CA] transition-colors text-sm shadow-md"
        >
          지원하기
        </Link>
        <a href="#about" className="border border-[#D1D5DB] bg-white/70 backdrop-blur-sm text-[#111111] font-semibold px-5 py-2.5 rounded-lg hover:border-[#4F46E5] hover:text-[#4F46E5] transition-colors text-sm">더 알아보기</a>
      </div>
    </>
  );

  return (
    <section
      id="top"
      className="relative h-screen w-full overflow-x-clip overflow-y-clip bg-white"
    >
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

      {isShortWide ? (
        <div
          className="absolute inset-0 z-10 flex min-h-0 flex-row items-center gap-5 pt-20 pb-5 pl-6 pr-6 lg:gap-8 lg:pl-10 lg:pr-10 pointer-events-none"
        >
          <div className="flex min-h-0 min-w-0 flex-1 basis-0 flex-col gap-3 lg:gap-4 pointer-events-none">
            {textBlock}
          </div>
          <div className="flex min-h-0 min-w-0 flex-1 basis-0 items-center justify-center pointer-events-auto">
            {showSplineRightSlot ? (
              <div className="hero-spline-slot w-full shadow-sm ring-1 ring-[#E5E7EB]/80">
                <iframe
                  src={SPLINE_URL}
                  frameBorder={0}
                  title="NL 3D 인터랙티브"
                  className="hero-spline-iframe-fit"
                />
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        <div
          className="absolute inset-y-0 left-0 flex w-full pointer-events-none pt-20 pb-8 md:w-1/2 md:pt-22 md:pb-10 lg:pt-24 lg:pb-12"
          style={{ zIndex: 10, alignItems: 'safe center' }}
        >
          <div className="mx-auto flex w-full max-w-xl flex-col gap-4 px-8 md:max-w-none md:mx-0 md:px-10 lg:px-14 md:gap-4 lg:gap-5">
            {textBlock}
            <HeroCodeTerminal
              termRef={termRef}
              focused={focused}
              setFocused={setFocused}
              handleKeyDown={handleKeyDown}
              typed={typed}
              progress={progress}
              isDone={isDone}
            />
          </div>
        </div>
      )}
    </section>
  );
}
