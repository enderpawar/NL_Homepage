import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { label: '활동소개', to: '/activity' },
  { label: '임원소개', to: '/executives' },
  { label: '블로그',   to: '/blog' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isHome = location.pathname === '/';

  return (
    <nav
      className={`fixed left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || !isHome
          ? 'bg-white border-b border-[#E5E7EB] shadow-sm'
          : 'bg-transparent'
      }`}
      style={{ top: 0 }}
    >
      <div className="w-full px-6 h-16 flex items-center">
        {/* 좌측 로고 */}
        <div className="flex-1 flex items-center">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logos/1.png" alt="NL 아이콘" width={36} height={36} className="rounded-lg" />
            <span className="font-bold text-lg text-[#111111] tracking-tight">NL</span>
          </Link>
        </div>

        {/* 데스크톱 메뉴(가운데 정렬) */}
        <ul className="hidden md:flex flex-none items-center gap-8 text-sm font-medium">
          {NAV_ITEMS.map(item => (
            <li key={item.to}>
              <Link
                to={item.to}
                className={`transition-colors hover:text-[#4F46E5] ${
                  location.pathname === item.to ? 'text-[#4F46E5] font-semibold' : 'text-[#555555]'
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* 우측 CTA */}
        <div className="flex-1 flex items-center justify-end">
          <a
            href={isHome ? '#join' : '/#join'}
            className="hidden md:inline-flex bg-[#4F46E5] text-white font-semibold px-4 py-2 rounded-lg hover:bg-[#4338CA] transition-colors"
          >
            지원하기
          </a>
          <a
            href={isHome ? '#join' : '/#join'}
            className="md:hidden bg-[#4F46E5] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#4338CA] transition-colors"
          >
            지원하기
          </a>
        </div>
      </div>
    </nav>
  );
}
