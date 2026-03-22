import { useState, useEffect, useRef } from 'react';

const PROMPT_USER = 'guest@nl';

const COMMANDS: { dir: string; cmd: string }[] = [
  { dir: '~',                     cmd: 'cd NL_NetworkLeader_CLUB' },
  { dir: 'NL_NetworkLeader_CLUB', cmd: 'node index.js --boot' },
];

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

export default function HeroIntro({ onDone }: { onDone: () => void }) {
  const [doneCmds,   setDoneCmds]   = useState(0);
  const [charIdx,    setCharIdx]    = useState(0);
  const [asciiCount, setAsciiCount] = useState(0);
  const [phase, setPhase] = useState<'idle' | 'typing' | 'ascii' | 'done' | 'exiting'>('idle');
  // ASCII 아트 최장 행 기준 네이티브 너비(1rem 폰트 기준 ~1500px). 컨테이너 너비에 맞게 zoom 자동 계산
  const [asciiZoom, setAsciiZoom] = useState(0.65);

  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;
  const bodyRef = useRef<HTMLDivElement>(null);

  // 스크롤 최하단 유지
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  });

  // 뷰포트 너비 기반 ASCII 아트 zoom 계산
  // - iOS Safari에서 element.clientWidth는 overflow 콘텐츠 폭을 포함해 부정확할 수 있음
  // - document.documentElement.clientWidth는 실제 뷰포트 너비를 정확히 반환
  useEffect(() => {
    const ASCII_NATIVE_PX = 1500; // 155자 × ~9.6px(JetBrains Mono 1rem)
    const calc = () => {
      const vw = document.documentElement.clientWidth || window.innerWidth;
      // 터미널 컨테이너: vw의 96%, 내부 패딩 40px 제외, 5% 여유 마진
      const available = (vw * 0.96 - 40) * 0.95;
      const computed = Math.min(0.65, Math.max(0.10, available / ASCII_NATIVE_PX));
      setAsciiZoom(computed);
    };
    // iOS 방향 전환 후 뷰포트 크기 확정까지 약간의 딜레이 필요
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
    const t = setTimeout(() => setPhase('typing'), 200);
    return () => clearTimeout(t);
  }, []);

  // ② 글자 단위 타이핑 (빠르게)
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
      }, 300 + Math.random() * 100);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setCharIdx(i => i + 1), 40 + Math.random() * 30);
    return () => clearTimeout(t);
  }, [phase, doneCmds, charIdx]);

  // ③ ASCII — 전체 라인을 한 번에 마운트, CSS animation-delay로 순차 등장
  useEffect(() => {
    if (phase !== 'ascii') return;
    setAsciiCount(ASCII_ART.length);
    // 마지막 줄 delay + duration 이후 done으로 전환
    const totalMs = ASCII_ART.length * 40 + 400;
    const t = setTimeout(() => setPhase('done'), totalMs);
    return () => clearTimeout(t);
  }, [phase]);

  // ④ done → exiting (ASCII 아트 0.3s 더 노출 후 페이드아웃)
  useEffect(() => {
    if (phase !== 'done') return;
    const t = setTimeout(() => setPhase('exiting'), 1000);
    return () => clearTimeout(t);
  }, [phase]);

  // ⑤ exiting → 부모에 완료 알림
  useEffect(() => {
    if (phase !== 'exiting') return;
    const t = setTimeout(() => onDoneRef.current(), 700);
    return () => clearTimeout(t);
  }, [phase]);

  // ⑥ 5초 강제 종료 (애니메이션이 느릴 때 대비)
  useEffect(() => {
    const t = setTimeout(() => setPhase('exiting'), 5000);
    return () => clearTimeout(t);
  }, []);

  const currentCmd  = COMMANDS[doneCmds];
  const showAscii   = phase === 'ascii' || phase === 'done' || phase === 'exiting';
  const progressPct =
    phase === 'done' || phase === 'exiting' ? 100 :
    phase === 'ascii'  ? 20 + Math.round((asciiCount / ASCII_ART.length) * 80) :
    phase === 'typing' ? Math.round((doneCmds / COMMANDS.length) * 20) : 0;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#0D0D18',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: phase === 'exiting' ? 0 : 1,
        transition: 'opacity 700ms ease',
        pointerEvents: phase === 'exiting' ? 'none' : 'auto',
      }}
    >
      <div style={{ width: '96%', maxWidth: '1280px' }}>
        {/* 터미널 박스 */}
        <div
          className="rounded-xl overflow-hidden shadow-2xl w-full"
          style={{
            background: 'rgba(13,13,24,0.98)',
            border: '1px solid rgba(255,255,255,0.10)',
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
              {phase === 'ascii' ? '▶ running...' : (phase === 'done' || phase === 'exiting') ? '✓ exit 0' : ''}
            </span>
          </div>

          {/* 진행 바 */}
          <div className="h-px bg-white/5">
            <div
              className="h-full bg-[#818CF8] transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          {/* 터미널 바디 — iOS Safari 버그 대응:
              overflow-x:hidden + overflow-y:auto를 같은 요소에 쓰면 iOS에서 overflow-x:hidden이 무시됨.
              별도 래퍼에 overflow:hidden을 두고, 안쪽 요소는 overflow-y:auto만 담당. */}
          <div style={{ overflow: 'hidden' }}>
          <div
            ref={bodyRef}
            className="px-5 py-4 overflow-y-auto select-none terminal-body"
            style={{ maxHeight: '70vh' }}
          >
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

            {/* ASCII 아트 — 컨테이너 너비에 맞게 zoom 자동 조정 */}
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
                    fontKerning: 'none',
                    textRendering: 'optimizeSpeed',
                  }}
                >
                  {ASCII_ART.slice(0, asciiCount).map((line, i) => (
                    <span
                      key={i}
                      style={{
                        display: 'block',
                        animation: 'asciiLineReveal 320ms ease-out both',
                        animationDelay: `${i * 40}ms`,
                      }}
                    >
                      {line === '' ? '\u00A0' : line}
                    </span>
                  ))}
                </pre>
              </div>
            )}

          </div>
          </div>{/* overflow:hidden 래퍼 닫기 */}
        </div>
      </div>
    </div>
  );
}
