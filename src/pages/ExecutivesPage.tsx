import { useInView } from '../hooks/useInView';
import { EXECUTIVES } from '../data/executives';
import type { Executive } from '../types';

function ExecutiveCard({ name, role, img }: Executive) {
  return (
    <div className="flex flex-col items-center gap-4 p-8 bg-white rounded-2xl border border-[#E5E7EB] shadow-sm hover:shadow-lg transition-all">
      <div className="w-24 h-24 rounded-full bg-[#EEF2FF] flex items-center justify-center overflow-hidden">
        {img
          ? <img src={img} alt={name} className="w-full h-full object-cover" />
          : <span className="text-4xl">👤</span>}
      </div>
      <div className="text-center">
        <p className="font-bold text-[#111111] text-lg">{name}</p>
        <p className="text-sm text-[#4F46E5] font-mono mt-1">{role}</p>
      </div>
    </div>
  );
}

export default function ExecutivesPage() {
  const { ref, inView } = useInView(0.1);

  return (
    <div className="min-h-screen bg-white pt-24 pb-20 px-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="mb-14">
          <div className="font-mono text-xs text-[#546E7A] mb-3">{'// executives'}</div>
          <h1 className="font-black text-[#111111] mb-3" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
            임원진 소개
          </h1>
          <p className="text-[#555555] text-base">함께 NL을 이끌어가는 임원진입니다.</p>
        </div>
        <div
          ref={ref}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {EXECUTIVES.map((exec, i) => (
            <div
              key={exec.name}
              className="transition-all duration-700"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(32px)',
                transitionDelay: `${i * 100}ms`,
              }}
            >
              <ExecutiveCard {...exec} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
