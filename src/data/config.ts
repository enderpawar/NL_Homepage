export const SPLINE_URL = 'https://my.spline.design/cutecomputerfollowcursor-kA12qnqOtkDzxaSpjxRxxQe5/';

export const LINKS = {
  // ✏️ 구글폼 링크 — 매 모집 시즌마다 이 URL만 교체하면 전체 반영됩니다
  apply:     'https://forms.gle/example',
  kakao:     'https://open.kakao.com/example',
  instagram: 'https://instagram.com/nl_club',
  email:     'nl@example.ac.kr',
};

export const RECRUIT = {
  start: '2025-03-01',
  end:   '2025-03-15',
};

export function getRecruitStatus() {
  const now   = new Date();
  const start = new Date(RECRUIT.start);
  const end   = new Date(RECRUIT.end);
  if (now < start) return { label: '모집 예정', badge: 'bg-yellow-400 text-yellow-900' };
  if (now <= end)  return { label: '모집 중',   badge: 'bg-green-400 text-green-900'  };
  return              { label: '모집 마감', badge: 'bg-gray-400 text-gray-900'    };
}

export const ANNOUNCEMENT = {
  show: false,
  text: '🎉 2025년 신입 부원 모집 중! 지금 바로 지원하세요',
  link: 'https://forms.gle/example',
};
