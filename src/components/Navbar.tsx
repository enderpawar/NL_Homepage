import { useState, useEffect } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-[#E5E7EB] shadow-sm'
          : 'bg-white/60 backdrop-blur-sm'
      }`}
      style={{ top: 0 }}
    >
      <div className="max-w-[1200px] mx-auto px-4 h-14 flex items-center justify-between">
        {/* 좌측 로고 */}
        <a href="#top" className="flex items-center gap-2.5">
          <img src="/logos/1.png" alt="NL 아이콘" width={40} height={40} className="rounded-lg" />
          <span className="font-black text-xl tracking-tight text-[#111111]">NL</span>
        </a>
        {/* 우측 메뉴 + CTA */}
        <div className="hidden md:flex items-center gap-7">
          <ul className="flex items-center gap-7 text-sm font-medium">
            <li><a href="#about"    className="text-[#444444] transition-colors hover:text-[#4F46E5]">소개</a></li>
            <li><a href="#activity" className="text-[#444444] transition-colors hover:text-[#4F46E5]">활동</a></li>
          </ul>
          <a
            href="#join"
            className="bg-[#4F46E5] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#4338CA] transition-colors"
          >
            지원하기
          </a>
        </div>
        {/* 모바일 CTA */}
        <a href="#join" className="md:hidden bg-[#4F46E5] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#4338CA] transition-colors">
          지원하기
        </a>
      </div>
    </nav>
  );
}
