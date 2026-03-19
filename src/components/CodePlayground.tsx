import { useState, useRef } from 'react';
import { useInView } from '../hooks/useInView';

// 토큰 타입별 색상
const C: Record<string, string> = {
  kw:    '#C792EA', // keyword: def, const, for, int
  fn:    '#82AAFF', // function name
  str:   '#C3E88D', // string
  num:   '#F78C6C', // number
  cmt:   '#546E7A', // comment
  op:    '#89DDFF', // operator/punctuation
  plain: '#EEFFFF', // plain text
  var:   '#F07178', // variable/identifier
  type:  '#FFCB6B', // type
};

type Token = { c: string; v: string };
type Line = Token[];

interface Program {
  tab: string;
  lang: string;
  lines: Line[];
  output: string[];
}

const PROGRAMS: Program[] = [
  {
    tab: 'hello_nl.py',
    lang: 'Python',
    lines: [
      [{ c: 'cmt', v: '# NL 동아리 환영 메시지' }],
      [],
      [{ c: 'kw', v: 'def ' }, { c: 'fn', v: 'greet' }, { c: 'op', v: '(' }, { c: 'var', v: 'name' }, { c: 'op', v: '):' }],
      [{ c: 'plain', v: '    ' }, { c: 'kw', v: 'return ' }, { c: 'str', v: 'f"환영합니다, {name}님! 🎉"' }],
      [],
      [{ c: 'var', v: 'members' }, { c: 'op', v: ' = [' }, { c: 'str', v: '"김철수"' }, { c: 'op', v: ', ' }, { c: 'str', v: '"이영희"' }, { c: 'op', v: ', ' }, { c: 'str', v: '"박민준"' }, { c: 'op', v: ']' }],
      [{ c: 'kw', v: 'for ' }, { c: 'var', v: 'm' }, { c: 'kw', v: ' in ' }, { c: 'var', v: 'members' }, { c: 'op', v: ':' }],
      [{ c: 'plain', v: '    ' }, { c: 'fn', v: 'print' }, { c: 'op', v: '(' }, { c: 'fn', v: 'greet' }, { c: 'op', v: '(' }, { c: 'var', v: 'm' }, { c: 'op', v: '))' }],
    ],
    output: ['환영합니다, 김철수님! 🎉', '환영합니다, 이영희님! 🎉', '환영합니다, 박민준님! 🎉'],
  },
  {
    tab: 'club.js',
    lang: 'JavaScript',
    lines: [
      [{ c: 'cmt', v: '// NL 동아리 정보' }],
      [],
      [{ c: 'kw', v: 'const ' }, { c: 'var', v: 'NL' }, { c: 'op', v: ' = {' }],
      [{ c: 'plain', v: '  ' }, { c: 'fn', v: 'name' }, { c: 'op', v: ': ' }, { c: 'str', v: '"Network Leader"' }, { c: 'op', v: ',' }],
      [{ c: 'plain', v: '  ' }, { c: 'fn', v: 'members' }, { c: 'op', v: ': ' }, { c: 'num', v: '32' }, { c: 'op', v: ',' }],
      [{ c: 'plain', v: '  ' }, { c: 'fn', v: 'since' }, { c: 'op', v: ': ' }, { c: 'num', v: '2019' }, { c: 'op', v: ',' }],
      [{ c: 'plain', v: '  ' }, { c: 'fn', v: 'motto' }, { c: 'op', v: ': ' }, { c: 'str', v: '"함께 성장하기"' }],
      [{ c: 'op', v: '};' }],
      [],
      [{ c: 'var', v: 'console' }, { c: 'op', v: '.' }, { c: 'fn', v: 'log' }, { c: 'op', v: '(`${' }, { c: 'var', v: 'NL.name' }, { c: 'op', v: '} — ${' }, { c: 'var', v: 'NL.members' }, { c: 'op', v: '} 명 | since ${' }, { c: 'var', v: 'NL.since' }, { c: 'op', v: '}`)' }],
    ],
    output: ['Network Leader — 32명 | since 2019'],
  },
  {
    tab: 'study.cpp',
    lang: 'C++',
    lines: [
      [{ c: 'op', v: '#include ' }, { c: 'str', v: '<iostream>' }],
      [{ c: 'kw', v: 'using namespace ' }, { c: 'type', v: 'std' }, { c: 'op', v: ';' }],
      [],
      [{ c: 'type', v: 'int ' }, { c: 'fn', v: 'main' }, { c: 'op', v: '() {' }],
      [{ c: 'plain', v: '  ' }, { c: 'var', v: 'cout' }, { c: 'op', v: ' << ' }, { c: 'str', v: '"🚀 NL 스터디 시작!"' }, { c: 'op', v: ' << ' }, { c: 'var', v: 'endl' }, { c: 'op', v: ';' }],
      [{ c: 'plain', v: '  ' }, { c: 'kw', v: 'for' }, { c: 'op', v: '(' }, { c: 'type', v: 'int ' }, { c: 'var', v: 'i' }, { c: 'op', v: '=' }, { c: 'num', v: '1' }, { c: 'op', v: '; ' }, { c: 'var', v: 'i' }, { c: 'op', v: '<=' }, { c: 'num', v: '4' }, { c: 'op', v: '; ' }, { c: 'var', v: 'i' }, { c: 'op', v: '++) {' }],
      [{ c: 'plain', v: '    ' }, { c: 'var', v: 'cout' }, { c: 'op', v: ' << i << ' }, { c: 'str', v: '"주차 완료 ✓"' }, { c: 'op', v: ' << ' }, { c: 'var', v: 'endl' }, { c: 'op', v: ';' }],
      [{ c: 'plain', v: '  ' }, { c: 'op', v: '}' }],
      [{ c: 'plain', v: '  ' }, { c: 'kw', v: 'return ' }, { c: 'num', v: '0' }, { c: 'op', v: ';' }],
      [{ c: 'op', v: '}' }],
    ],
    output: ['🚀 NL 스터디 시작!', '1주차 완료 ✓', '2주차 완료 ✓', '3주차 완료 ✓', '4주차 완료 ✓'],
  },
];

export default function CodePlayground() {
  const { ref, inView } = useInView(0.15);
  const [activeIdx, setActiveIdx] = useState(0);
  const [running, setRunning] = useState(false);
  const [outputLines, setOutputLines] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);

  const program = PROGRAMS[activeIdx];

  function handleRun() {
    if (running) return;
    setOutputLines([]);
    setDone(false);
    setRunning(true);
    const lines = program.output;
    lines.forEach((line, i) => {
      setTimeout(() => {
        setOutputLines(prev => [...prev, line]);
        if (i === lines.length - 1) {
          setRunning(false);
          setDone(true);
        }
      }, 400 + i * 350);
    });
  }

  // 탭 전환 시 출력 초기화
  function selectTab(i: number) {
    setActiveIdx(i);
    setOutputLines([]);
    setDone(false);
    setRunning(false);
  }

  return (
    <section
      ref={ref}
      className="bg-[#0F0F1B] py-24 px-6 transition-all duration-700"
      style={{ opacity: inView ? 1 : 0 }}
    >
      <div className="max-w-[1200px] mx-auto">
        {/* 헤드라인 */}
        <div className="text-center mb-12">
          <h2
            className="font-black text-white mb-3"
            style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)' }}
          >
            직접 돌려보세요
          </h2>
          <p className="text-white/50 font-mono text-sm">// NL에서 배우는 언어들을 미리 체험해보세요</p>
        </div>

        {/* IDE 에디터 */}
        <div
          className="rounded-2xl overflow-hidden shadow-2xl border border-white/10 transition-all duration-700"
          style={{ transform: inView ? 'translateY(0)' : 'translateY(40px)' }}
        >
          {/* IDE 상단 탭 바 */}
          <div className="flex items-center bg-[#1A1A2E] border-b border-white/10 px-4 pt-3 gap-1">
            {/* 창 컨트롤 dots */}
            <div className="flex gap-1.5 mr-4">
              <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
              <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
              <span className="w-3 h-3 rounded-full bg-[#28CA41]" />
            </div>
            {PROGRAMS.map((p, i) => (
              <button
                key={p.tab}
                onClick={() => selectTab(i)}
                className={`px-4 py-2 text-xs font-mono rounded-t-lg transition-colors ${
                  activeIdx === i
                    ? 'bg-[#0F0F1B] text-white border-t border-x border-white/10'
                    : 'text-white/40 hover:text-white/70'
                }`}
              >
                {p.tab}
              </button>
            ))}
            <div className="ml-auto mb-2">
              <button
                onClick={handleRun}
                disabled={running}
                className="flex items-center gap-2 bg-[#4F46E5] hover:bg-[#4338CA] disabled:opacity-50 text-white text-xs font-mono font-bold px-4 py-1.5 rounded-lg transition-colors"
              >
                {running ? (
                  <><span className="animate-spin inline-block">⟳</span> Running...</>
                ) : (
                  <>▶ Run</>
                )}
              </button>
            </div>
          </div>

          {/* 에디터 + 출력 패널 */}
          <div className="flex flex-col md:flex-row" style={{ minHeight: '320px' }}>
            {/* 코드 패널 */}
            <div className="flex-1 bg-[#0F0F1B] p-6 overflow-auto">
              <pre className="font-mono text-sm leading-7">
                {program.lines.map((line, li) => (
                  <div key={li} className="flex">
                    <span className="select-none text-white/20 w-8 shrink-0 text-right mr-4">{li + 1}</span>
                    <span>
                      {line.length === 0 ? '\u00A0' : line.map((tok, ti) => (
                        <span key={ti} style={{ color: C[tok.c] }}>{tok.v}</span>
                      ))}
                    </span>
                  </div>
                ))}
              </pre>
            </div>

            {/* 출력 패널 */}
            <div className="md:w-72 bg-[#12121F] border-t md:border-t-0 md:border-l border-white/10 p-6 flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-[#28CA41]" />
                <span className="text-white/40 font-mono text-xs">OUTPUT</span>
                <span className="ml-auto text-white/30 font-mono text-xs">{program.lang}</span>
              </div>
              <div ref={outputRef} className="flex-1 font-mono text-sm text-[#A5D6A7] flex flex-col gap-2">
                {outputLines.length === 0 && !running && (
                  <span className="text-white/20 text-xs">// Run을 눌러 실행하세요</span>
                )}
                {running && outputLines.length === 0 && (
                  <span className="text-white/40 text-xs animate-pulse">실행 중...</span>
                )}
                {outputLines.map((line, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-[#28CA41] shrink-0">›</span>
                    <span>{line}</span>
                  </div>
                ))}
                {done && (
                  <div className="mt-2 text-white/30 text-xs border-t border-white/10 pt-2">
                    ✓ 프로세스 완료 (exit code 0)
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
