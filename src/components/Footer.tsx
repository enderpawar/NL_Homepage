import { LINKS } from '../data/config';

export default function Footer() {
  return (
    <footer className="bg-[#F9FAFB] border-t border-[#E5E7EB] py-12 px-6">
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start gap-2">
          <img src="/logos/2.png" alt="Network Leader 텍스트 로고" height={32} className="h-8 w-auto" />
          <p className="text-[#555555] text-sm">컴퓨터공학과 학술동아리 NL(Network Leader)</p>
        </div>
        <div className="flex items-center gap-6 text-sm text-[#555555]">
          <a href={`mailto:${LINKS.email}`} className="hover:text-[#111111] transition-colors">
            {LINKS.email}
          </a>
          <a href={LINKS.instagram} className="hover:text-[#111111] transition-colors">Instagram</a>
          <a href={LINKS.kakao} className="hover:text-[#111111] transition-colors">카카오톡</a>
        </div>
        <p className="text-[#555555] text-sm">© {new Date().getFullYear()} NL. All rights reserved.</p>
      </div>
    </footer>
  );
}
