import { useInView } from '../hooks/useInView';

const REVIEWS = [
  {
    name: '김○○',
    role: '23학번 · 현 부원',
    quote: '스터디를 통해 혼자서는 절대 못 배웠을 것들을 배웠어요. 선배들이 정말 친절하고, 같이 프로젝트 하면서 실력이 확 늘었습니다.',
    avatar: '🧑‍💻',
    color: '#82AAFF',
  },
  {
    name: '이○○',
    role: '22학번 · 현 부원',
    quote: '입학하자마자 NL에 들어온 게 대학 생활 최고의 선택이었어요. 해커톤에서 팀원들이랑 밤새 코딩한 기억이 아직도 생생합니다.',
    avatar: '👩‍💻',
    color: '#C3E88D',
  },
  {
    name: '박○○',
    role: '24학번 · 신입 부원',
    quote: '처음에는 실력이 부족할까봐 걱정했는데, 기초부터 차근차근 알려줘서 금방 적응했어요. 망설이지 말고 지원하세요!',
    avatar: '🙋',
    color: '#C792EA',
  },
];

export default function Testimonials() {
  const { ref, inView } = useInView(0.1);

  return (
    <section ref={ref} className="bg-[#0F0F1B] py-24 px-6">
      <div className="max-w-[1200px] mx-auto">
        <div
          className="text-center mb-16 transition-all duration-700"
          style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(20px)' }}
        >
          <div className="font-mono text-[#546E7A] text-sm mb-4">{'/* 부원들의 이야기 */'}</div>
          <h2 className="font-black text-white mb-3" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)' }}>
            부원들의 이야기
          </h2>
          <p className="text-white/40 text-base">NL에서 함께한 사람들의 솔직한 후기입니다.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((r, i) => (
            <div
              key={r.name}
              className="rounded-2xl overflow-hidden border border-white/10 flex flex-col transition-all duration-700"
              style={{
                background: 'rgba(26,26,46,0.8)',
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(32px)',
                transitionDelay: `${i * 150}ms`,
              }}
            >
              {/* 카드 상단 — 코드 파일 탭 */}
              <div className="flex items-center gap-2 px-4 py-2 border-b border-white/10 bg-[#12121F]">
                <span className="w-2 h-2 rounded-full" style={{ background: r.color }} />
                <span className="font-mono text-xs text-white/30">review_{i + 1}.md</span>
              </div>
              {/* 카드 바디 */}
              <div className="p-6 flex flex-col gap-4 flex-1">
                <p className="font-mono text-xs text-[#546E7A]">{'/**'}</p>
                <p className="text-white/70 text-sm leading-relaxed pl-2 border-l-2" style={{ borderColor: r.color }}>
                  {r.quote}
                </p>
                <p className="font-mono text-xs text-[#546E7A]">{'*/'}</p>
                <div className="flex items-center gap-3 pt-2 mt-auto">
                  <span className="text-2xl">{r.avatar}</span>
                  <div>
                    <p className="font-bold text-white text-sm">{r.name}</p>
                    <p className="font-mono text-xs text-white/30">{r.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
