import { useInView } from '../hooks/useInView';
import { EXECUTIVES } from '../data/executives';
import type { Executive } from '../types';

const ROLE_COLORS: Record<string, string> = {
  '회장': '#82AAFF',
  '부회장': '#C3E88D',
  '총무': '#F78C6C',
  '학술부장': '#C792EA',
};

const ROLE_ICON_NAMES: Record<string, string> = {
  '회장': 'admin_panel_settings',
  '부회장': 'supervisor_account',
  '총무': 'assignment_ind',
  '학술부장': 'school',
};

const ROLE_DEFAULTS: Record<string, { bio: string; highlights: string[] }> = {
  '회장': {
    bio: '동아리의 방향을 잡고, 구성원들이 더 멀리 나아갈 수 있도록 이끕니다.',
    highlights: ['대외 협력', '운영 총괄', '성장 전략'],
  },
  '부회장': {
    bio: '프로젝트와 운영을 함께 리딩하며, 팀 간 조율을 책임집니다.',
    highlights: ['팀 리딩', '일정 관리', '리소스 조율'],
  },
  '총무': {
    bio: '행사와 커뮤니케이션을 매끄럽게 운영해 분위기를 탄탄히 잡습니다.',
    highlights: ['행사 운영', '홍보 지원', '원활한 소통'],
  },
  '학술부장': {
    bio: '학술 콘텐츠를 기획하고 스터디의 깊이를 더해갑니다.',
    highlights: ['세미나 기획', '스터디 운영', '학술 성장'],
  },
};

function ExecutiveCard({ name, role, img, bio, highlights }: Executive) {
  const color = ROLE_COLORS[role] ?? '#89DDFF';
  const roleIconName = ROLE_ICON_NAMES[role] ?? 'person';
  const bioText = bio ?? ROLE_DEFAULTS[role]?.bio ?? '함께 성장하는 NL을 만들고 있습니다.';
  const highlightItems = highlights ?? ROLE_DEFAULTS[role]?.highlights ?? [];

  return (
    <div
      className="group relative bg-white rounded-2xl overflow-hidden border border-[#E5E7EB] hover:border-[#E5E7EB] hover:shadow-2xl transition-all duration-500"
    >
      <div className="h-1.5" style={{ background: color }} />

      {/* 컬러 글로우 */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${color}33 0%, transparent 55%)`,
        }}
      />

      <div className="relative p-8 flex flex-col items-center gap-5">
        <div
          className="w-28 h-28 rounded-full flex items-center justify-center overflow-hidden shadow-lg ring-4 ring-white group-hover:scale-105 transition-transform duration-300"
          style={{ background: `${color}22`, border: `2px solid ${color}44` }}
        >
          {img ? (
            <img src={img} alt={name} className="w-full h-full object-cover" />
          ) : (
            <span
              aria-hidden="true"
              className="material-symbols-outlined"
              style={{ fontSize: '2.1rem', color }}
            >
              {roleIconName}
            </span>
          )}
        </div>

        <div className="text-center">
          <span
            className="inline-flex items-center gap-2 font-mono text-xs px-2.5 py-0.5 rounded-full mb-3"
            style={{ color, background: `${color}18` }}
          >
            <span aria-hidden="true" className="material-symbols-outlined" style={{ fontSize: '0.95rem' }}>
              {roleIconName}
            </span>
            {role}
          </span>
          <p className="font-black text-[#111111] text-xl">{name}</p>
          <p className="text-[#555555] text-sm leading-relaxed mt-2 line-clamp-2">
            {bioText}
          </p>
        </div>

        {highlightItems.length > 0 && (
          <div className="w-full">
            <div className="flex items-center justify-center gap-2 text-xs font-mono text-[#111111]/50 mb-3">
              <span aria-hidden="true" className="material-symbols-outlined" style={{ fontSize: '1rem', color }}>
                check_circle
              </span>
              주요 업무
            </div>
            <ul className="space-y-2">
              {highlightItems.slice(0, 3).map((item) => (
                <li
                  key={item}
                  className="flex items-start justify-center gap-2 text-sm text-[#555555] leading-relaxed"
                >
                  <span aria-hidden="true" style={{ color }}>
                    <span aria-hidden="true" className="material-symbols-outlined" style={{ fontSize: '1rem' }}>
                      check_circle
                    </span>
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ExecutivesPage() {
  const heroRef  = useInView(0.1);
  const cardsRef = useInView(0.1);
  const quoteRef = useInView(0.2);

  return (
    <div className="min-h-screen bg-white">

      {/* ── 히어로 배너 ── */}
      <div
        className="relative flex items-end min-h-[280px] tablet:min-h-[300px] lg:min-h-[320px] pt-32 tablet:pt-[8.5rem] lg:pt-36 pb-12 tablet:pb-14 lg:pb-16 px-4 tablet:px-6 lg:px-6 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0F0F1B 0%, #1a1a3e 60%, #0F0F1B 100%)' }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(79,70,229,0.6) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
        <div className="max-w-[1200px] mx-auto w-full relative z-10" ref={heroRef.ref}>
          <div
            className="transition-all duration-700"
            style={{
              opacity: heroRef.inView ? 1 : 0,
              transform: heroRef.inView ? 'translateY(0)' : 'translateY(30px)',
            }}
          >
            <div className="font-mono text-xs text-[#4F46E5] mb-3">{'// executives'}</div>
            <h1
              className="font-black text-white mb-4"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 1.1 }}
            >
              NL을 이끄는<br />임원진
            </h1>
            <p className="text-white/50 text-lg">함께 동아리를 만들어가는 임원진을 소개합니다.</p>
          </div>
        </div>
      </div>

      {/* ── 임원 카드 그리드 ── */}
      <div ref={cardsRef.ref} className="py-20 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
            {EXECUTIVES.map((exec, i) => (
              <div
                key={exec.name}
                className="transition-all duration-700"
                style={{
                  opacity: cardsRef.inView ? 1 : 0,
                  transform: cardsRef.inView ? 'translateY(0)' : 'translateY(32px)',
                  transitionDelay: `${i * 100}ms`,
                }}
              >
                <ExecutiveCard {...exec} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 인용 배너 ── */}
      <div ref={quoteRef.ref} className="bg-[#0F0F1B] py-20 px-6">
        <div
          className="max-w-[700px] mx-auto text-center transition-all duration-700"
          style={{
            opacity: quoteRef.inView ? 1 : 0,
            transform: quoteRef.inView ? 'translateY(0)' : 'translateY(20px)',
          }}
        >
          <div className="text-6xl text-[#4F46E5] font-black mb-6">"</div>
          <p className="text-white font-bold text-2xl leading-relaxed mb-6">
            우리는 코드를 짜는 것 이상으로,<br />함께 성장하는 문화를 만듭니다.
          </p>
          <p className="font-mono text-xs text-white/30">— NL, Network Leader</p>
        </div>
      </div>

    </div>
  );
}
