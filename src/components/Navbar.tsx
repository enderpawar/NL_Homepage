import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';


const NAV_ITEMS = [
  { label: '활동소개', to: '/activity' },
  { label: '임원소개', to: '/executives' },
  { label: '블로그',   to: '/blog' },
];

export default function Navbar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const mobileToggleButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    // 라우트 변경 시 드롭다운 닫기
    setMobileMenuOpen(false);

    // 라우트 변경 시 스크롤 영역을 최상단으로 초기화
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const onPointerDown = (e: PointerEvent) => {
      const el = dropdownRef.current;
      if (!el) return;
      const target = e.target instanceof Node ? e.target : null;
      if (!target) return;

      // 토글 버튼(햄버거/X)은 "드롭다운 밖 클릭"으로 처리하지 않음.
      // 그렇지 않으면 pointerdown에서 먼저 닫히고, button onClick의 토글이 다시 열어버리는 현상이 생길 수 있음.
      const btn = mobileToggleButtonRef.current;
      if (btn && btn.contains(target)) return;

      if (!el.contains(target)) setMobileMenuOpen(false);
    };

    window.addEventListener('pointerdown', onPointerDown);
    return () => window.removeEventListener('pointerdown', onPointerDown);
  }, [mobileMenuOpen]);

  return (
    <nav
      className="fixed left-0 right-0 top-0 z-50 border-b border-[#E5E7EB] bg-white shadow-sm"
    >
      <div className="relative mx-auto flex h-16 w-full max-w-[1200px] items-center px-4 sm:px-6">
        {/* 좌측 로고 */}
        <div className="flex-1 flex items-center">
          <Link to="/" className="flex items-center gap-2">
            <img
              src={`${import.meta.env.BASE_URL}logos/1.png`}
              alt="NL 아이콘"
              width={36}
              height={36}
              className="rounded-lg"
            />
            <span className="font-bold text-lg text-[#111111] tracking-tight hidden sm:inline">
              Network Leader
            </span>
            <span className="font-black text-lg text-[#111111] tracking-tight inline sm:hidden">
              Network Leader
            </span>
          </Link>
        </div>

        {/* 데스크톱 메뉴(가운데 정렬) */}
        <ul className="hidden md:flex flex-none items-center gap-6 tablet:gap-8 lg:gap-12 text-sm font-medium">
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
          <Link
            to="/join"
            className="hidden md:inline-flex bg-[#4F46E5] text-white font-semibold px-4 py-2 rounded-lg hover:bg-[#4338CA] transition-colors text-sm lg:text-base lg:py-2.5"
          >
            지원하기
          </Link>
          {/* 모바일: 햄버거 버튼 + 드롭다운 */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] transition-colors"
            ref={mobileToggleButtonRef}
            aria-label={mobileMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(v => !v)}
          >
            <span aria-hidden="true" className="w-5 h-5 relative block">
              <span className={`absolute left-0 right-0 h-[2px] bg-white rounded transition-transform duration-200 ${mobileMenuOpen ? 'top-2.5 rotate-45' : 'top-[4px]'}`} />
              <span className={`absolute left-0 right-0 h-[2px] bg-white rounded transition-opacity duration-200 ${mobileMenuOpen ? 'opacity-0' : 'opacity-100'} top-[11px]`} />
              <span className={`absolute left-0 right-0 h-[2px] bg-white rounded transition-transform duration-200 ${mobileMenuOpen ? 'top-2.5 -rotate-45' : 'top-[18px]'}`} />
            </span>
          </button>

          {mobileMenuOpen && (
            <div
              ref={dropdownRef}
              className="md:hidden absolute right-4 top-16 mt-2 w-[240px] bg-white border border-[#E5E7EB] rounded-xl shadow-lg overflow-hidden sm:right-6"
            >
              <div className="px-3 py-2 border-b border-[#E5E7EB]">
                <div className="text-sm font-bold text-[#111111]">NL 메뉴</div>
                <div className="text-xs text-[#555555]">활동/임원/블로그/지원하기</div>
              </div>
              <div className="p-2">
                {NAV_ITEMS.map(item => {
                  const active = location.pathname === item.to;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                        active
                          ? 'bg-[#EEF2FF] text-[#4F46E5] font-semibold'
                          : 'text-[#555555] hover:bg-[#F9FAFB] hover:text-[#4F46E5]'
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}

                <div className="mt-2 pt-2 border-t border-[#E5E7EB]">
                  <Link
                    to="/join"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                      location.pathname === '/join'
                        ? 'bg-[#4F46E5] text-white font-semibold'
                        : 'bg-[#EEF2FF] text-[#4F46E5] font-semibold hover:bg-[#E0E7FF] hover:text-[#4338CA]'
                    }`}
                  >
                    지원하기
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
