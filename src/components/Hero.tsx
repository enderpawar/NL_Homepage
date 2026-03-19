import { useState, useRef, useCallback, useEffect } from 'react';
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

// ── Hero 컴포넌트 ─────────────────────────────────────────────
export default function Hero() {
  const [typed, setTyped]     = useState('');
  const [focused, setFocused] = useState(false);
  const termRef               = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const onChange = () => setIsMobile(mq.matches);
    onChange();
    // Safari 대응: addListener/removeListener 지원 케이스가 있어 분기 처리
    if (typeof mq.addEventListener === 'function') {
      mq.addEventListener('change', onChange);
      return () => mq.removeEventListener('change', onChange);
    }
    mq.addListener(onChange);
    return () => mq.removeListener(onChange);
  }, []);

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
      // Tab → 2 스페이스
      setTyped(t => t + '  ');
    } else if (e.key.length === 1) {
      setTyped(t => t + e.key);
    }
  }, [isDone]);

  return (
    <section
      id="top"
      className="relative h-screen w-full overflow-y-hidden overflow-x-hidden md:overflow-x-visible bg-white"
    >
      {/* 모바일에서는 3D를 숨기고 배경을 간결화(성능/잘림 방지) */}
      {!isMobile ? (
        <iframe
          src={SPLINE_URL}
          frameBorder={0}
          title="NL 3D 인터랙티브"
          style={{
            position: 'absolute',
            left: '-12%',
            top: '-6%',
            width: '124%',
            height: '112%',
            border: 'none',
            zIndex: 0,
          }}
        />
      ) : (
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 15% 10%, rgba(79,70,229,0.10) 0%, transparent 40%), radial-gradient(circle at 70% 60%, rgba(130,170,255,0.10) 0%, transparent 45%)',
          }}
        />
      )}

      {/* 좌측 오버레이 */}
      <div
        className="absolute inset-y-0 left-0 w-full md:w-1/2 flex items-center pointer-events-none"
        style={{ zIndex: 10, paddingTop: '64px' }}
      >
        <div className="w-full px-8 md:px-14 flex flex-col gap-5">

          {/* 배지 */}
          <span className="inline-block bg-[#EEF2FF]/90 backdrop-blur-sm text-[#4F46E5] text-xs font-semibold px-3 py-1 rounded-full w-fit tracking-wide uppercase border border-[#4F46E5]/20">
            NL -NetWork Leader
          </span>

          {/* 굵은 헤드라인 */}
          <h1 className="font-black text-[#111111] leading-[1.1]" style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)' }}>
            코드로 세상을<br />연결합니다
          </h1>

          {/* 서브텍스트 */}
          <p className="text-[#444444] text-[0.95rem] leading-relaxed">
            NL(Network Leader)은 컴퓨터공학과 학생들이<br />함께 배우고, 만들고, 성장하는 학술동아리입니다.
          </p>

          {/* CTA */}
          <div className="flex flex-wrap gap-3 pointer-events-auto">
            <a href="/join" className="bg-[#4F46E5] text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-[#4338CA] transition-colors text-sm shadow-md">지원하기</a>
            <a href="#about" className="border border-[#D1D5DB] bg-white/70 backdrop-blur-sm text-[#111111] font-semibold px-5 py-2.5 rounded-lg hover:border-[#4F46E5] hover:text-[#4F46E5] transition-colors text-sm">더 알아보기</a>
          </div>

          {/* ── 인터랙티브 코드 터미널 ─────────────────────── */}
          <div
            ref={termRef}
            tabIndex={0}
            onKeyDown={handleKeyDown}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onClick={() => termRef.current?.focus()}
            className="rounded-xl overflow-hidden shadow-xl outline-none pointer-events-auto cursor-text transition-all duration-200"
            style={{
              background: 'rgba(15,15,27,0.92)',
              backdropFilter: 'blur(14px)',
              border: `1px solid ${focused ? 'rgba(79,70,229,0.6)' : 'rgba(255,255,255,0.1)'}`,
              boxShadow: focused ? '0 0 0 2px rgba(79,70,229,0.2)' : undefined,
            }}
          >
            {/* 터미널 헤더 */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 select-none">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#28CA41]" />
                <span className="ml-3 font-mono text-xs text-white/30">club.config.ts</span>
              </div>
              <div className="flex items-center gap-3">
                {isDone ? (
                  <span className="font-mono text-xs text-[#28CA41]">✓ 완료!</span>
                ) : typed.length > 0 ? (
                  <span className="font-mono text-xs text-white/30">{progress}%</span>
                ) : (
                  <span className="font-mono text-xs text-white/25 animate-pulse">클릭 후 따라치기 →</span>
                )}
              </div>
            </div>

            {/* 진행 바 */}
            <div className="h-0.5 bg-white/5">
              <div
                className="h-full bg-[#4F46E5] transition-all duration-150"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* 코드 영역 */}
            <div className="px-5 py-4 select-none">
              <pre className="font-mono text-[0.78rem] leading-6">
                {LINES.map((line, lineIdx) => (
                  <div key={lineIdx} className="flex">
                    {/* 줄 번호 */}
                    <span className="text-white/20 w-5 shrink-0 text-right mr-4">{lineIdx + 1}</span>

                    {/* 글자들 */}
                    <span>
                      {line.chars.map((cc, ci) => {
                        const fi = line.offset + ci; // CHAR_COLORS 내 절대 인덱스
                        const beforeCursor = fi < typed.length;
                        const isCursor     = fi === typed.length;
                        const wrong        = beforeCursor && typed[fi] !== cc.char;

                        return (
                          <span
                            key={ci}
                            style={{
                              color: wrong ? '#FF5555' : cc.color,
                              // 타이핑 진행 구간에서 글자를 흐리게 처리하지 않고
                              // 토큰의 원본 컬러(cc.color)를 그대로 유지
                              opacity: 1,
                              backgroundColor:
                                isCursor && focused ? 'rgba(79,70,229,0.75)' :
                                wrong               ? 'rgba(255,85,85,0.18)' : 'transparent',
                              outline: isCursor && !focused ? '1px solid #4F46E5' : undefined,
                            }}
                          >
                            {/* 공백이 커서 위치면 보이게 */}
                            {cc.char === ' ' ? '\u00A0' : cc.char}
                          </span>
                        );
                      })}

                      {/* 커서가 줄 끝(\n 위치)에 있을 때 */}
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

                {/* 커서가 맨 마지막 글자 뒤에 있을 때 */}
                {typed.length === CHAR_COLORS.length && !isDone && null}
              </pre>
            </div>
          </div>
          {/* ────────────────────────────────────────────────── */}

        </div>
      </div>
    </section>
  );
}
