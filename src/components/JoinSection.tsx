import { RECRUIT, LINKS, getRecruitStatus } from '../data/config';

export default function JoinSection() {
  const recruit = getRecruitStatus();

  return (
    <section id="join" className="bg-[#111111] py-16 tablet:py-20 lg:py-24 px-4 tablet:px-6 lg:px-6">
      <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row items-center gap-10 tablet:gap-12 lg:gap-16 text-center lg:text-left">
        {/* 좌측 로고 */}
        <div className="flex-1 flex justify-center w-full">
          <img
            src={`${import.meta.env.BASE_URL}logos/3.png`}
            alt="NL 로고"
            className="max-w-[220px] tablet:max-w-xs w-full opacity-90"
          />
        </div>
        {/* 우측 텍스트 */}
        <div className="flex-1 flex flex-col gap-5 tablet:gap-6 w-full items-center lg:items-start">
          <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full w-fit shrink-0 ${recruit.badge}`}>
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
          <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
            <a
              href={LINKS.apply}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#4F46E5] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#4338CA] transition-colors text-sm"
            >
              지원서 작성하기 →
            </a>
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
