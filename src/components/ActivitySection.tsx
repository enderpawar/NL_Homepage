import { useInView } from '../hooks/useInView';
import { ACTIVITIES } from '../data/activities';

const ICONS: Record<string, string> = {
  menuBook: 'menu_book',
  code: 'code',
  mic: 'mic',
  rocket: 'rocket_launch',
};

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
          <div className="flex items-center justify-center gap-3 mb-4">
            <span
              aria-hidden="true"
              className="material-symbols-outlined"
              style={{ color: '#4F46E5', fontSize: '1.9rem' }}
            >
              local_activity
            </span>
            <h2 className="font-black text-[#111111]" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)' }}>
              주요 활동
            </h2>
          </div>
          <p className="text-[#555555] text-base tablet:text-lg">NL에서 경험할 수 있는 다양한 활동들을 소개합니다.</p>
        </div>

        <div ref={cardsRef.ref} className="grid grid-cols-1 tablet:grid-cols-2 gap-4 tablet:gap-5 lg:gap-6">
          {ACTIVITIES.map((act, i) => (
            <div
              key={act.title}
              className="flex flex-col tablet:flex-row gap-4 tablet:gap-5 lg:gap-6 p-5 tablet:p-6 lg:p-8 rounded-2xl border border-[#E5E7EB] hover:border-[#4F46E5] hover:shadow-md transition-all duration-700"
              style={{
                opacity: cardsRef.inView ? 1 : 0,
                transform: cardsRef.inView ? 'translateY(0)' : 'translateY(32px)',
                transitionDelay: `${i * 100}ms`,
              }}
            >
              {(() => {
                const iconName = ICONS[act.icon] ?? 'menu_book';
                return (
                  <div className="shrink-0">
                    <div className="w-14 h-14 rounded-2xl bg-[#EEF2FF] border border-[#E0E7FF] flex items-center justify-center">
                      <span
                        aria-hidden="true"
                        className="material-symbols-outlined"
                        style={{ fontSize: '1.8rem', color: '#4F46E5' }}
                      >
                        {iconName}
                      </span>
                    </div>
                  </div>
                );
              })()}
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-bold text-[#111111] text-xl">{act.title}</h3>
                  <span className="text-xs text-[#4F46E5] bg-[#EEF2FF] px-2 py-0.5 rounded-full font-medium">
                    {act.desc}
                  </span>
                </div>
                <p className="text-[#555555] leading-relaxed">{act.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
