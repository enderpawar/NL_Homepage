import { ANNOUNCEMENT } from '../data/config';

export default function AnnouncementBar() {
  if (!ANNOUNCEMENT.show) return null;
  return (
    <div className="w-full bg-[#111111] text-white text-center py-2 px-4 text-sm">
      <a href={ANNOUNCEMENT.link} className="hover:underline">
        {ANNOUNCEMENT.text} →
      </a>
    </div>
  );
}
