import { useInView } from '../hooks/useInView';
import { ACTIVITIES } from '../data/activities';

const ICONS: Record<string, string> = {
  menuBook: 'menu_book',
  code: 'code',
  mic: 'mic',
  rocket: 'rocket_launch',
};

const NL_BLUE = '#4F46E5';

const TIMELINE = [
  { month: '3월',  title: '신입 부원 모집 & OT',    desc: '동아리 소개 및 신입 부원 환영 오리엔테이션', color: NL_BLUE },
  { month: '4월',  title: '정기 스터디 시작',         desc: '주차별 주제를 정해 CS·개발 스터디 본격 운영', color: NL_BLUE },
  { month: '6월',  title: '미니 해커톤',              desc: '1학기 마무리 팀 프로젝트 발표 및 해커톤',     color: NL_BLUE },
  { month: '9월',  title: '2학기 스터디 재개',        desc: '심화 주제 및 신규 프로젝트 팀 결성',         color: NL_BLUE },
  { month: '11월', title: '연간 해커톤 & 발표',       desc: '한 해 성과를 공유하는 대규모 발표 행사',      color: NL_BLUE },
  { month: '12월', title: '수료식 & 네트워킹',        desc: '한 해를 마무리하는 파티 및 네트워킹',         color: NL_BLUE },
];

const STATS = [
  { value: '4+',   label: '주요 활동 종류' },
  { value: '52회', label: '연간 스터디 세션' },
  { value: '2회',  label: '해커톤' },
  { value: '100%', label: '성장 보장' },
];

export default function ActivityPage() {
  const heroRef  = useInView(0.1);
  const statsRef = useInView(0.2);
  const cardsRef = useInView(0.1);
  const timeRef  = useInView(0.1);

  return (
    <div className="min-h-screen bg-white">

      {/* ── 히어로 배너 ── */}
      <div
        className="relative flex items-end pt-36 pb-16 px-6 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0F0F1B 0%, #1A1A3E 60%, #0F0F1B 100%)', minHeight: '340px' }}
      >
        {/* 배경 그리드 패턴 */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'linear-gradient(rgba(79,70,229,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(79,70,229,0.4) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
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
            <div className="font-mono text-xs text-[#4F46E5] mb-3">{'// activities'}</div>
            <h1
              className="font-black text-white mb-4"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 1.1 }}
            >
              NL의<br />주요 활동
            </h1>
            <p className="text-white/50 text-lg max-w-xl">
              스터디·프로젝트·해커톤·세미나. NL에서 경험할 수 있는 모든 것을 소개합니다.
            </p>
          </div>
        </div>
      </div>

      {/* ── 통계 스트립 ── */}
      <div ref={statsRef.ref} className="bg-[#4F46E5] py-8 px-6">
        <div className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className="text-center transition-all duration-700"
              style={{
                opacity: statsRef.inView ? 1 : 0,
                transform: statsRef.inView ? 'translateY(0)' : 'translateY(20px)',
                transitionDelay: `${i * 100}ms`,
              }}
            >
              <p className="font-black text-white text-3xl">{s.value}</p>
              <p className="text-white/70 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── 활동 카드 그리드 ── */}
      <div ref={cardsRef.ref} className="py-20 px-6 bg-white">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-14">
            <div className="font-mono text-xs text-[#546E7A] mb-3">{'// main activities'}</div>
            <h2
              className="font-black text-[#111111]"
              style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)' }}
            >
              활동 상세
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ACTIVITIES.map((act, i) => (
              <div
                key={act.title}
                className="group rounded-2xl overflow-hidden border border-[#E5E7EB] hover:border-[#4F46E5] hover:shadow-xl transition-all duration-500"
                style={{
                  opacity: cardsRef.inView ? 1 : 0,
                  transform: cardsRef.inView ? 'translateY(0)' : 'translateY(32px)',
                  transitionDelay: `${i * 120}ms`,
                }}
              >
                {/* 카드 상단 컬러 바 */}
                <div className="h-1.5 bg-linear-to-r from-[#4F46E5] to-[#818CF8] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                <div className="p-8 flex gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-[#EEF2FF] border border-[#E0E7FF] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                        {(() => {
                          const iconName = ICONS[act.icon] ?? 'menu_book';
                          return (
                            <span
                              aria-hidden="true"
                              className="material-symbols-outlined"
                              style={{ fontSize: '1.9rem', color: '#4F46E5' }}
                            >
                              {iconName}
                            </span>
                          );
                        })()}
                      </div>
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="font-bold text-[#111111] text-xl">{act.title}</h3>
                      <span className="text-xs text-[#4F46E5] bg-[#EEF2FF] px-2 py-0.5 rounded-full font-mono">
                        {act.desc}
                      </span>
                    </div>
                    <p className="text-[#555555] leading-relaxed">{act.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 연간 타임라인 ── */}
      <div ref={timeRef.ref} className="py-20 px-6 bg-[#F9FAFB]">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-14">
            <div className="font-mono text-xs text-[#546E7A] mb-3">{'// annual schedule'}</div>
            <h2
              className="font-black text-[#111111]"
              style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)' }}
            >
              연간 일정
            </h2>
          </div>
          <div className="relative">
            {/* 중앙 선 */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0 border-l-2 border-dashed border-[rgba(79,70,229,0.55)] hidden md:block" />
            <div className="flex flex-col gap-8">
              {TIMELINE.map((item, i) => (
                <div
                  key={item.month}
                  className={`flex flex-col md:flex-row md:items-center items-stretch gap-4 transition-all duration-700 ${
                    i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                  style={{
                    opacity: timeRef.inView ? 1 : 0,
                    transform: timeRef.inView ? 'translateY(0)' : 'translateY(24px)',
                    transitionDelay: `${i * 100}ms`,
                  }}
                >
                  <div className={`w-full md:flex-1 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm hover:shadow-md transition-shadow inline-block w-full">
                      <p className="font-mono text-xs mb-1" style={{ color: item.color }}>
                        {item.month}
                      </p>
                      <h3 className="font-bold text-[#111111] text-lg mb-1">{item.title}</h3>
                      <p className="text-[#555555] text-sm">{item.desc}</p>
                    </div>
                  </div>
                  {/* 중앙 도트 */}
                  <div
                    className="w-5 h-5 rounded-full border-2 border-white shadow-md shrink-0 z-10 self-center"
                    style={{ background: item.color }}
                  />
                  <div className="flex-1 hidden md:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
