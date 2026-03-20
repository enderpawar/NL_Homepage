import { useInView } from '../hooks/useInView';
import { ACTIVITIES } from '../data/activities';
import { ACTIVITY_ICONS } from '../data/icons';

// 활동별 코드에디터 스타일 메타데이터 (About 섹션과 동일한 디자인 언어)
const ACTIVITY_DESIGN = [
  { file: 'study.weekly.ts',     color: '#818CF8' },
  { file: 'project.build.rs',    color: '#06B6D4' },
  { file: 'seminar.listen.py',   color: '#10B981' },
  { file: 'hackathon.sprint.sh', color: '#F59E0B' },
];

export default function ActivitySection() {
  const headRef  = useInView(0.1);
  const cardsRef = useInView(0.1);

  return (
    <section id="activity" className="bg-white py-16 tablet:py-20 lg:py-24 px-4 tablet:px-6 lg:px-6">
      <div className="max-w-[1200px] mx-auto">
        <div
          ref={headRef.ref}
          className="text-center mb-16 transition-all duration-700"
          style={{ opacity: headRef.inView ? 1 : 0, transform: headRef.inView ? 'translateY(0)' : 'translateY(20px)' }}
        >
          <div className="font-mono text-xs text-[#546E7A] mb-3">{'// activities'}</div>
          <h2 className="font-black text-[#111111] mb-4" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)' }}>
            주요 활동
          </h2>
          <p className="text-[#555555] text-base tablet:text-lg">NL에서 경험할 수 있는 다양한 활동들을 소개합니다.</p>
        </div>

        <div ref={cardsRef.ref} className="grid grid-cols-1 tablet:grid-cols-2 gap-4 tablet:gap-5 lg:gap-6">
          {ACTIVITIES.map((act, i) => {
            const design = ACTIVITY_DESIGN[i] ?? { file: 'activity.ts', color: '#818CF8' };
            const iconName = ACTIVITY_ICONS[act.icon] ?? 'menu_book';
            return (
              <div
                key={act.title}
                className="rounded-2xl overflow-hidden border border-[#E5E7EB] shadow-sm hover:shadow-lg transition-all duration-700"
                style={{
                  opacity: cardsRef.inView ? 1 : 0,
                  transform: cardsRef.inView ? 'translateY(0)' : 'translateY(32px)',
                  transitionDelay: `${i * 120}ms`,
                }}
              >
                {/* 코드 파일 탭 헤더 — About 섹션과 동일한 패턴 */}
                <div className="flex items-center gap-2 px-4 py-2.5 bg-[#F3F4F6] border-b border-[#E5E7EB]">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: design.color }} />
                  <span className="font-mono text-xs text-[#555555] truncate">{design.file}</span>
                  <span
                    className="ml-auto font-mono text-[0.65rem] font-semibold px-2 py-0.5 rounded-full shrink-0"
                    style={{ color: design.color, background: `${design.color}18`, border: `1px solid ${design.color}30` }}
                  >
                    {act.desc}
                  </span>
                </div>

                {/* 카드 바디 */}
                <div className="p-5 tablet:p-6 lg:p-7 bg-white flex gap-4 tablet:gap-5">
                  <div className="shrink-0">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ background: `${design.color}15`, border: `1px solid ${design.color}25` }}
                    >
                      <span
                        aria-hidden="true"
                        className="material-symbols-outlined"
                        style={{ fontSize: '1.5rem', color: design.color }}
                      >
                        {iconName}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-[#111111] text-xl mb-2">{act.title}</h3>
                    <p className="text-[#555555] leading-relaxed text-sm">{act.detail}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
