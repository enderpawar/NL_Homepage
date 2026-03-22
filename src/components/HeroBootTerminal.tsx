import { useState, useEffect, useRef, useCallback } from 'react';

// ── 터미널 프롬프트 ──────────────────────────────────────────────
const PROMPT_USER = 'guest@nl';

const COMMANDS: { dir: string; cmd: string }[] = [
  { dir: '~',                     cmd: 'cd NL_NetworkLeader_CLUB' },
  { dir: 'NL_NetworkLeader_CLUB', cmd: 'node index.js --boot' },
];

// ── ASCII 아트 ───────────────────────────────────────────────────
// 아스키 아트 변경 시 https://patorjk.com/software/taag/ 에서 복사 후 백틱 사이에 붙여넣기
const ASCII_ART: readonly string[] = String.raw`
 /$$          /$$$$$$$$ /$$   /$$  /$$$$$$  /$$   /$$ /$$$$$$$$ /$$$$$$$$        /$$$$$$   /$$$$$$  /$$$$$$$  /$$$$$$$$  /$$$$$$                           
|  $$        | $$_____/| $$  / $$ /$$__  $$| $$  | $$|__  $$__/| $$_____/       /$$__  $$ /$$__  $$| $$__  $$| $$_____/ /$$__  $$                          
 \  $$       | $$      |  $$/ $$/| $$  \__/| $$  | $$   | $$   | $$            | $$  \__/| $$  \ $$| $$  \ $$| $$      | $$  \__/                          
  \  $$      | $$$$$    \  $$$$/ | $$      | $$  | $$   | $$   | $$$$$         | $$      | $$  | $$| $$  | $$| $$$$$   |  $$$$$$                           
   /$$/      | $$__/     >$$  $$ | $$      | $$  | $$   | $$   | $$__/         | $$      | $$  | $$| $$  | $$| $$__/    \____  $$                          
  /$$/       | $$       /$$/\  $$| $$    $$| $$  | $$   | $$   | $$            | $$    $$| $$  | $$| $$  | $$| $$       /$$  \ $$                          
 /$$/        | $$$$$$$$| $$  \ $$|  $$$$$$/|  $$$$$$/   | $$   | $$$$$$$$      |  $$$$$$/|  $$$$$$/| $$$$$$$/| $$$$$$$$|  $$$$$$//$$                       
|__/         |________/|__/  |__/ \______/  \______/    |__/   |________/       \______/  \______/ |_______/ |________/ \______/| $/                       
                                                                                                                                |_/                        
                                                                                                                                                           
                                                                                                                                                           
 /$$       /$$$$$$$$  /$$$$$$  /$$$$$$$        /$$$$$$$$ /$$   /$$ /$$$$$$$$       /$$   /$$ /$$$$$$$$ /$$$$$$$$ /$$      /$$  /$$$$$$  /$$$$$$$  /$$   /$$
| $$      | $$_____/ /$$__  $$| $$__  $$      |__  $$__/| $$  | $$| $$_____/      | $$$ | $$| $$_____/|__  $$__/| $$  /$ | $$ /$$__  $$| $$__  $$| $$  /$$/
| $$      | $$      | $$  \ $$| $$  \ $$         | $$   | $$  | $$| $$            | $$$$| $$| $$         | $$   | $$ /$$$| $$| $$  \ $$| $$  \ $$| $$ /$$/ 
| $$      | $$$$$   | $$$$$$$$| $$  | $$         | $$   | $$$$$$$$| $$$$$         | $$ $$ $$| $$$$$      | $$   | $$/$$ $$ $$| $$  | $$| $$$$$$$/| $$$$$/  
| $$      | $$__/   | $$__  $$| $$  | $$         | $$   | $$__  $$| $$__/         | $$  $$$$| $$__/      | $$   | $$$$_  $$$$| $$  | $$| $$__  $$| $$  $$  
| $$      | $$      | $$  | $$| $$  | $$         | $$   | $$  | $$| $$            | $$\  $$$| $$         | $$   | $$$/ \  $$$| $$  | $$| $$  \ $$| $$\  $$ 
| $$$$$$$$| $$$$$$$$| $$  | $$| $$$$$$$/         | $$   | $$  | $$| $$$$$$$$      | $$ \  $$| $$$$$$$$   | $$   | $$/   \  $$|  $$$$$$/| $$  | $$| $$ \  $$
|________/|________/|__/  |__/|_______/          |__/   |__/  |__/|________/      |__/  \__/|________/   |__/   |__/     \__/ \______/ |__/  |__/|__/  \__/
`.slice(1).split('\n');                                                                                                                                                                                                                                                         
                                                                                                                                                

// ── 컴포넌트 ─────────────────────────────────────────────────────
export default function HeroBootTerminal({ onDone }: { onDone: () => void }) {
  const [doneCmds,   setDoneCmds]   = useState(0);
  const [charIdx,    setCharIdx]    = useState(0);
  const [asciiCount, setAsciiCount] = useState(0);
  const [phase, setPhase] = useState<'idle' | 'typing' | 'ascii' | 'done'>('idle');
  // ASCII 아트 최장 행 기준 네이티브 너비(1rem 폰트 기준 ~1500px). 컨테이너 너비에 맞게 zoom 자동 계산
  const [asciiZoom, setAsciiZoom] = useState(0.65);

  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;
  const bodyRef = useRef<HTMLDivElement>(null);

  // 스크롤 항상 최하단
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  });

  // 뷰포트 너비 기반 ASCII 아트 zoom 계산 (iOS Safari 대응)
  useEffect(() => {
    const ASCII_NATIVE_PX = 1500;
    const calc = () => {
      const vw = document.documentElement.clientWidth || window.innerWidth;
      const available = (vw * 0.96 - 40) * 0.95;
      const computed = Math.min(0.65, Math.max(0.10, available / ASCII_NATIVE_PX));
      setAsciiZoom(computed);
    };
    const onOrient = () => setTimeout(calc, 150);
    calc();
    window.addEventListener('resize', calc);
    window.addEventListener('orientationchange', onOrient);
    return () => {
      window.removeEventListener('resize', calc);
      window.removeEventListener('orientationchange', onOrient);
    };
  }, []);

  // ① 시작 딜레이
  useEffect(() => {
    const t = setTimeout(() => setPhase('typing'), 450);
    return () => clearTimeout(t);
  }, []);

  // ② 글자 단위 타이핑
  useEffect(() => {
    if (phase !== 'typing') return;
    const cur = COMMANDS[doneCmds];
    if (!cur) return;

    if (charIdx >= cur.cmd.length) {
      const t = setTimeout(() => {
        const next = doneCmds + 1;
        setDoneCmds(next);
        setCharIdx(0);
        if (next >= COMMANDS.length) setPhase('ascii');
      }, 360 + Math.random() * 80);
      return () => clearTimeout(t);
    }

    const t = setTimeout(() => setCharIdx(i => i + 1), 36 + Math.random() * 30);
    return () => clearTimeout(t);
  }, [phase, doneCmds, charIdx]);

  // ③ ASCII 라인 순차 출력
  useEffect(() => {
    if (phase !== 'ascii') return;

    if (asciiCount >= ASCII_ART.length) {
      const t = setTimeout(() => {
        setPhase('done');
        onDoneRef.current();
      }, 800);
      return () => clearTimeout(t);
    }

    const t = setTimeout(() => setAsciiCount(c => c + 1), asciiCount === 0 ? 160 : 26);
    return () => clearTimeout(t);
  }, [phase, asciiCount]);

  // ④ 클릭 건너뛰기
  const handleSkip = useCallback(() => {
    if (phase === 'done') return;
    setDoneCmds(COMMANDS.length);
    setAsciiCount(ASCII_ART.length);
    setPhase('done');
    onDoneRef.current();
  }, [phase]);

  const currentCmd = COMMANDS[doneCmds];
  const isDone     = phase === 'done';
  const showAscii  = phase === 'ascii' || isDone;

  // 진행 바 너비
  const progressPct =
    phase === 'done'   ? 100 :
    phase === 'ascii'  ? 20 + Math.round((asciiCount / ASCII_ART.length) * 80) :
    phase === 'typing' ? Math.round((doneCmds / COMMANDS.length) * 20) :
    0;

  return (
    <div
      className="rounded-xl overflow-hidden shadow-xl w-full"
      onClick={handleSkip}
      style={{
        background: 'rgba(13,13,24,0.96)',
        border: '1px solid rgba(255,255,255,0.10)',
        cursor: isDone ? 'default' : 'pointer',
      }}
    >
      {/* 타이틀 바 */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 select-none">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28CA41]" />
          <span className="ml-3 font-mono text-xs text-white/25">bash — 120×40</span>
        </div>
        <span className="font-mono text-[0.6rem] text-white/25">
          {phase === 'ascii' ? '▶ running...' : isDone ? '✓ exit 0' : ''}
        </span>
      </div>

      {/* 진행 바 */}
      <div className="h-px bg-white/5">
        <div
          className="h-full bg-[#818CF8] transition-all duration-300"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* 터미널 바디 — iOS Safari: overflow-x + overflow-y를 같은 요소에 쓰면 overflow-x가 무시됨
          overflow:hidden 래퍼로 분리해 가로 클리핑 보장 */}
      <div style={{ overflow: 'hidden' }}>
      <div
        ref={bodyRef}
        className="px-5 py-4 overflow-y-auto select-none"
        style={{ maxHeight: '460px' }}
      >
        {/* ── 명령어 히스토리 + 타이핑 라인 ───────────────────────
            <pre> 안에서 <span style="display:block"> 을 사용합니다.
            <div> 는 블록 레벨이라 공백 처리가 달라지므로 금지.      */}
        <pre
          style={{
            fontFamily: "'JetBrains Mono', 'Courier New', Courier, monospace",
            fontSize: '0.68rem',
            lineHeight: '1.65',
            whiteSpace: 'pre',
            margin: 0,
            color: 'rgba(255,255,255,0.88)',
          }}
        >
          {/* 완료된 명령어 */}
          {COMMANDS.slice(0, doneCmds).map((cmd, i) => (
            <span key={i} style={{ display: 'block' }}>
              <span style={{ color: '#10B981' }}>{PROMPT_USER}</span>
              <span style={{ color: 'rgba(255,255,255,0.28)' }}>:</span>
              <span style={{ color: '#818CF8' }}>
                {cmd.dir === '~' ? '~' : `~/${cmd.dir}`}
              </span>
              <span style={{ color: 'rgba(255,255,255,0.38)' }}>$ </span>
              <span>{cmd.cmd}</span>
            </span>
          ))}

          {/* 현재 입력 중 */}
          {phase === 'typing' && currentCmd && (
            <span style={{ display: 'block' }}>
              <span style={{ color: '#10B981' }}>{PROMPT_USER}</span>
              <span style={{ color: 'rgba(255,255,255,0.28)' }}>:</span>
              <span style={{ color: '#818CF8' }}>
                {currentCmd.dir === '~' ? '~' : `~/${currentCmd.dir}`}
              </span>
              <span style={{ color: 'rgba(255,255,255,0.38)' }}>$ </span>
              <span>{currentCmd.cmd.slice(0, charIdx)}</span>
              {/* 블록 커서 */}
              <span
                className="animate-pulse"
                style={{
                  display: 'inline-block',
                  width: '0.52em',
                  height: '1em',
                  background: '#818CF8',
                  verticalAlign: 'text-bottom',
                  marginLeft: '1px',
                }}
              />
            </span>
          )}
        </pre>

        {/* ── ASCII 아트 ────────────────────────────────────────────
          렌더링 원리:
          · font-size: 1rem (16px) 에서 선명하게 렌더링 후
            zoom: 0.38 로 레이아웃·시각 크기를 함께 38% 축소합니다.
          · 6px 직접 렌더링은 픽셀 스냅(3 or 4px/char) 오차가
            155자 × 1px = 최대 155px 열 정렬 붕괴를 유발합니다.
          · zoom 은 transform 과 달리 layout box 까지 축소하므로
            155 × 9.6px × 0.38 ≈ 565px — 터미널 폭 내 수용 가능. */}
        {showAscii && (
          <div style={{ zoom: asciiZoom, marginTop: '2px' }}>
            <pre
              style={{
                fontFamily: "'JetBrains Mono', 'Courier New', Courier, monospace",
                fontSize: '1rem',
                lineHeight: '1.3',
                whiteSpace: 'pre',
                margin: 0,
                padding: 0,
                color: '#10B981',
                /* 렌더링 힌트: 커닝/합자 비활성화 → 완전한 등폭 보장 */
                fontKerning: 'none',
                textRendering: 'optimizeSpeed',
              }}
            >
              {ASCII_ART.slice(0, asciiCount).map((line, i) => (
                <span
                  key={i}
                  style={{
                    display: 'block',
                    animation: 'asciiLineReveal 220ms ease-out both',
                  }}
                >
                  {line === '' ? '\u00A0' : line}
                </span>
              ))}
            </pre>
          </div>
        )}

        {/* ── 완료 후 최종 프롬프트 ──────────────────────────────── */}
        {isDone && (
          <pre
            style={{
              fontFamily: "'JetBrains Mono', 'Courier New', Courier, monospace",
              fontSize: '0.68rem',
              lineHeight: '1.65',
              whiteSpace: 'pre',
              margin: '6px 0 0 0',
            }}
          >
            <span>
              <span style={{ color: '#10B981' }}>{PROMPT_USER}</span>
              <span style={{ color: 'rgba(255,255,255,0.28)' }}>:</span>
              <span style={{ color: '#818CF8' }}>~/NL_NetworkLeader_CLUB</span>
              <span style={{ color: 'rgba(255,255,255,0.38)' }}>$ </span>
              <span
                className="animate-pulse"
                style={{
                  display: 'inline-block',
                  width: '0.52em',
                  height: '1em',
                  background: '#818CF8',
                  verticalAlign: 'text-bottom',
                }}
              />
            </span>
          </pre>
        )}

        {/* 건너뛰기 힌트 */}
        {!isDone && (
          <p
            className="text-center mt-3 text-white/15 select-none"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.58rem',
            }}
          >
            클릭하여 건너뛰기
          </p>
        )}
      </div>
      </div>{/* overflow:hidden 래퍼 닫기 */}
    </div>
  );
}
