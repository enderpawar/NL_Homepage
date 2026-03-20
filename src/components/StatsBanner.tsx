import { useInView } from '../hooks/useInView';
import { useEffect, useState } from 'react';

const STATS = [
  { label: '창설',        value: 6,   suffix: '년', prefix: '',  color: '#82AAFF' },
  { label: '누적 프로젝트', value: 24,  suffix: '+',  prefix: '',  color: '#C3E88D' },
  { label: '현 부원',      value: 67,  suffix: '명',  prefix: '', color: '#C792EA' },
  { label: '스터디 세션',  value: 120, suffix: '+',  prefix: '',  color: '#F78C6C' },
];

function CountUp({ target, active }: { target: number; active: boolean }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let cur = 0;
    const step = Math.max(1, Math.ceil(target / 60));
    const timer = setInterval(() => {
      cur += step;
      if (cur >= target) { setCount(target); clearInterval(timer); }
      else setCount(cur);
    }, 20);
    return () => clearInterval(timer);
  }, [active, target]);
  return <>{count}</>;
}

export default function StatsBanner() {
  const { ref, inView } = useInView(0.3);

  return (
    <section ref={ref} className="bg-[#1A1A2E] py-12 tablet:py-14 lg:py-16 px-4 tablet:px-6 lg:px-6 border-y border-white/10">
      <div className="max-w-[1200px] mx-auto">
        {/* 터미널 명령어 헤더 */}
        <div className="font-mono text-xs text-white/30 mb-8 flex items-center gap-2">
          <span className="text-[#28CA41]">$</span>
          <span className="text-[#64B5F6]">nl</span>
          <span className="text-white/50">--stats --verbose</span>
        </div>
        <div className="grid grid-cols-2 tablet:grid-cols-2 lg:grid-cols-4 gap-5 tablet:gap-6 lg:gap-8">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className="flex flex-col gap-2 transition-all duration-700"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(24px)',
                transitionDelay: `${i * 120}ms`,
              }}
            >
              <div className="font-mono text-xs text-white/30 mb-1">// {s.label}</div>
              <p
                className="font-black font-mono leading-none"
                style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: s.color }}
              >
                {s.prefix}<CountUp target={s.value} active={inView} />{s.suffix}
              </p>
              <p className="text-white/40 text-sm font-mono">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
