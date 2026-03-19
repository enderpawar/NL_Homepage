import { useInView } from '../hooks/useInView';
import { EXECUTIVES } from '../data/executives';
import type { Executive } from '../types';

const VALUES = [
  { icon: '🌐', title: '네트워킹', desc: '다양한 사람들과 연결되고, 함께 성장하는 네트워크를 만듭니다.', file: 'networking.ts', color: '#82AAFF' },
  { icon: '📖', title: '학습',     desc: '정기 스터디와 세미나를 통해 CS 지식과 실무 기술을 함께 쌓습니다.', file: 'learning.py', color: '#C3E88D' },
  { icon: '🚀', title: '성장',     desc: '프로젝트와 해커톤으로 실전 경험을 쌓고 커리어를 함께 개척합니다.', file: 'growth.cpp', color: '#C792EA' },
];

function ExecutiveCard({ name, role, img }: Executive) {
  return (
    <div className="flex flex-col items-center gap-3 p-6 bg-white rounded-2xl border border-[#E5E7EB] shadow-sm hover:shadow-md transition-shadow">
      <div className="w-20 h-20 rounded-full bg-[#EEF2FF] flex items-center justify-center overflow-hidden">
        {img ? <img src={img} alt={name} className="w-full h-full object-cover" /> : <span className="text-3xl">👤</span>}
      </div>
      <div className="text-center">
        <p className="font-bold text-[#111111]">{name}</p>
        <p className="text-sm text-[#555555]">{role}</p>
      </div>
    </div>
  );
}

export default function About() {
  const headingRef = useInView(0.1);
  const cardsRef   = useInView(0.1);
  const execRef    = useInView(0.1);

  return (
    <section id="about" className="bg-white py-24 px-6">
      <div className="max-w-[1200px] mx-auto">
        <div
          ref={headingRef.ref}
          className="text-center mb-16 transition-all duration-700"
          style={{ opacity: headingRef.inView ? 1 : 0, transform: headingRef.inView ? 'translateY(0)' : 'translateY(20px)' }}
        >
          <div className="font-mono text-xs text-[#546E7A] mb-3">{'// about NL'}</div>
          <h2 className="font-black text-[#111111] mb-4" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)' }}>
            NL이란?
          </h2>
          <p className="text-[#555555] text-lg max-w-2xl mx-auto leading-relaxed">
            Network Leader, 줄여서 NL. 컴퓨터공학의 다양한 분야를 탐구하며<br className="hidden md:block" />
            서로를 이끌고 함께 발전하는 학술동아리입니다.
          </p>
        </div>

        {/* 핵심 가치 카드 — 코드 파일 스타일 */}
        <div ref={cardsRef.ref} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {VALUES.map((v, i) => (
            <div
              key={v.title}
              className="rounded-2xl overflow-hidden border border-[#E5E7EB] shadow-sm hover:shadow-lg transition-all duration-700"
              style={{
                opacity: cardsRef.inView ? 1 : 0,
                transform: cardsRef.inView ? 'translateY(0)' : 'translateY(32px)',
                transitionDelay: `${i * 120}ms`,
              }}
            >
              {/* 파일 탭 헤더 */}
              <div className="flex items-center gap-2 px-4 py-2.5 bg-[#F3F4F6] border-b border-[#E5E7EB]">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: v.color }} />
                <span className="font-mono text-xs text-[#555555]">{v.file}</span>
              </div>
              {/* 카드 내용 */}
              <div className="p-7 bg-white">
                <div className="text-4xl mb-4">{v.icon}</div>
                <h3 className="font-bold text-[#111111] text-xl mb-2">{v.title}</h3>
                <p className="text-[#555555] leading-relaxed text-sm">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 임원진 */}
        <div
          ref={execRef.ref}
          className="transition-all duration-700"
          style={{ opacity: execRef.inView ? 1 : 0, transform: execRef.inView ? 'translateY(0)' : 'translateY(20px)' }}
        >
          <div className="text-center mb-10">
            <div className="font-mono text-xs text-[#546E7A] mb-2">{'// executives'}</div>
            <h3 className="font-black text-[#111111] text-2xl mb-2">임원진 소개</h3>
            <p className="text-[#555555]">함께 NL을 이끌어가는 임원진입니다.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {EXECUTIVES.map(exec => <ExecutiveCard key={exec.name} {...exec} />)}
          </div>
        </div>
      </div>
    </section>
  );
}
