import { useInView } from '../hooks/useInView';
import { ACTIVITIES } from '../data/activities';

export default function ActivitySection() {
  const headRef  = useInView(0.1);
  const cardsRef = useInView(0.1);

  return (
    <section id="activity" className="bg-white py-24 px-6">
      <div className="max-w-[1200px] mx-auto">
        <div
          ref={headRef.ref}
          className="text-center mb-16 transition-all duration-700"
          style={{ opacity: headRef.inView ? 1 : 0, transform: headRef.inView ? 'translateY(0)' : 'translateY(20px)' }}
        >
          <h2 className="font-black text-[#111111] mb-4" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)' }}>
            주요 활동
          </h2>
          <p className="text-[#555555] text-lg">NL에서 경험할 수 있는 다양한 활동들을 소개합니다.</p>
        </div>

        <div ref={cardsRef.ref} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ACTIVITIES.map((act, i) => (
            <div
              key={act.title}
              className="flex gap-6 p-8 rounded-2xl border border-[#E5E7EB] hover:border-[#4F46E5] hover:shadow-md transition-all duration-700"
              style={{
                opacity: cardsRef.inView ? 1 : 0,
                transform: cardsRef.inView ? 'translateY(0)' : 'translateY(32px)',
                transitionDelay: `${i * 100}ms`,
              }}
            >
              <div className="text-5xl shrink-0">{act.icon}</div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-bold text-[#111111] text-xl">{act.title}</h3>
                  <span className="text-xs text-[#4F46E5] bg-[#EEF2FF] px-2 py-0.5 rounded-full font-medium">{act.desc}</span>
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
