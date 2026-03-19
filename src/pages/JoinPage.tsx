import { LINKS, RECRUIT } from '../data/config';

function getRecruitStatus() {
  const now   = new Date();
  const start = new Date(RECRUIT.start);
  const end   = new Date(RECRUIT.end);
  if (now < start) return { label: '모집 예정', badge: 'bg-yellow-400 text-yellow-900' };
  if (now <= end)  return { label: '모집 중',   badge: 'bg-green-400 text-green-900'  };
  return              { label: '모집 마감', badge: 'bg-gray-400 text-gray-900'    };
}

export default function JoinPage() {
  const recruit = getRecruitStatus();

  return (
    <div className="min-h-screen bg-[#F9FAFB] pt-24 pb-20 px-6">
      <div className="max-w-[800px] mx-auto flex flex-col gap-10">

        {/* 헤드라인 */}
        <div>
          <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-4 ${recruit.badge}`}>
            {recruit.label}
          </span>
          <h1 className="font-black text-[#111111] leading-tight mb-3" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
            NL과 함께<br />성장할 준비가 되셨나요?
          </h1>
          <p className="text-[#555555] text-base leading-relaxed">
            컴퓨터공학을 사랑하는 누구든 환영합니다.<br />
            모집 기간: <span className="font-semibold text-[#111111]">{RECRUIT.start} ~ {RECRUIT.end}</span>
          </p>
        </div>

        {/* 지원 방법 안내 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { step: '01', title: '지원서 작성', desc: '아래 구글폼 카드를 클릭하여 지원서를 작성합니다.' },
            { step: '02', title: '서류 검토',   desc: '제출된 지원서를 바탕으로 임원진이 검토합니다.' },
            { step: '03', title: '면접 안내',   desc: '합격자에 한해 개별 연락 후 면접을 진행합니다.' },
          ].map(s => (
            <div key={s.step} className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm">
              <div className="font-mono text-xs text-[#4F46E5] mb-2">{s.step}</div>
              <h3 className="font-bold text-[#111111] mb-1">{s.title}</h3>
              <p className="text-sm text-[#555555] leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* 구글폼 카드 — 클릭 시 구글폼으로 이동 */}
        <a
          href={LINKS.apply}
          target="_blank"
          rel="noopener noreferrer"
          className="group block bg-white rounded-2xl border-2 border-[#E5E7EB] hover:border-[#4F46E5] shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
        >
          {/* 카드 상단 컬러 바 */}
          <div className="h-2 bg-gradient-to-r from-[#4F46E5] to-[#818CF8]" />
          <div className="p-8 flex items-center justify-between gap-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                {/* Google Forms 아이콘 느낌 */}
                <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
                  <rect width="48" height="48" rx="8" fill="#4F46E5"/>
                  <rect x="13" y="14" width="22" height="3" rx="1.5" fill="white"/>
                  <rect x="13" y="22" width="22" height="3" rx="1.5" fill="white"/>
                  <rect x="13" y="30" width="14" height="3" rx="1.5" fill="white"/>
                </svg>
                <span className="font-bold text-[#111111] text-lg">2025 NL 신입 부원 지원서</span>
              </div>
              <p className="text-[#555555] text-sm">Google Forms · 약 5분 소요</p>
              <p className="font-mono text-xs text-[#4F46E5] mt-1 group-hover:underline">
                클릭하여 지원서 작성하기 →
              </p>
            </div>
            {/* 화살표 아이콘 */}
            <div className="shrink-0 w-12 h-12 rounded-full bg-[#EEF2FF] group-hover:bg-[#4F46E5] flex items-center justify-center transition-colors duration-300">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-[#4F46E5] group-hover:text-white transition-colors duration-300">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </div>
          </div>
        </a>

        {/* 문의 */}
        <div className="flex flex-col items-center gap-2 pt-2 text-center">
          <p className="text-[#555555] text-sm">지원 관련 문의</p>
          <div className="flex gap-4">
            <a href={`mailto:${LINKS.email}`} className="text-[#4F46E5] text-sm font-medium hover:underline">{LINKS.email}</a>
            <a href={LINKS.kakao} target="_blank" rel="noopener noreferrer" className="text-[#4F46E5] text-sm font-medium hover:underline">카카오톡 오픈채팅</a>
          </div>
        </div>

      </div>
    </div>
  );
}
