import { RECRUIT, LINKS } from '../data/config';

function getRecruitStatus() {
  const now = new Date();
  const start = new Date(RECRUIT.start);
  const end = new Date(RECRUIT.end);
  if (now < start) {
    return { status: 'upcoming' as const, label: '모집 예정', color: 'bg-yellow-400 text-yellow-900' };
  }
  if (now <= end) {
    return { status: 'open' as const, label: '모집 중', color: 'bg-green-400 text-green-900' };
  }
  return { status: 'closed' as const, label: '모집 마감', color: 'bg-gray-400 text-gray-900' };
}

export default function JoinSection() {
  const recruit = getRecruitStatus();

  return (
    <section id="join" className="bg-[#111111] py-24 px-6">
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center gap-16">
        {/* 좌측 로고 */}
        <div className="flex-1 flex justify-center">
          <img
            src="/logos/3.png"
            alt="NL 로고"
            className="max-w-xs w-full opacity-90"
          />
        </div>
        {/* 우측 텍스트 */}
        <div className="flex-1 flex flex-col gap-6">
          <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full w-fit ${recruit.color}`}>
            {recruit.label}
          </span>
          <h2
            className="font-black text-white leading-tight"
            style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)' }}
          >
            NL과 함께<br />성장할 준비가<br />되셨나요?
          </h2>
          <p className="text-gray-400 leading-relaxed">
            컴퓨터공학을 사랑하는 누구든 환영합니다.<br />
            모집 기간: {RECRUIT.start} ~ {RECRUIT.end}
          </p>
          <div className="flex flex-wrap gap-3">
            {recruit.status === 'open' ? (
              <a
                href={LINKS.apply}
                className="bg-[#4F46E5] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#4338CA] transition-colors text-sm"
              >
                지원서 작성하기 →
              </a>
            ) : (
              <button
                disabled
                className="bg-gray-700 text-gray-500 font-semibold px-6 py-3 rounded-lg text-sm cursor-not-allowed"
              >
                {recruit.status === 'upcoming' ? '모집 시작 전' : '모집이 마감되었습니다'}
              </button>
            )}
            <a
              href={LINKS.instagram}
              className="border border-gray-600 text-gray-300 font-semibold px-6 py-3 rounded-lg hover:border-white hover:text-white transition-colors text-sm"
            >
              인스타그램 →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
