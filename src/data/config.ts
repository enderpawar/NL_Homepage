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

const DAY_MS = 24 * 60 * 60 * 1000;

function parseRecruitDate(value: string, endOfDay = false) {
  const [year, month, day] = value.split('-').map(Number);
  return endOfDay
    ? new Date(year, month - 1, day, 23, 59, 59, 999)
    : new Date(year, month - 1, day, 0, 0, 0, 0);
}

function toStartOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function getRecruitStatus() {
  const now = new Date();
  const start = parseRecruitDate(RECRUIT.start);
  const end = parseRecruitDate(RECRUIT.end, true);
  if (now < start) return { label: '모집 예정', badge: 'bg-yellow-400 text-yellow-900' };
  if (now <= end)  return { label: '모집 중',   badge: 'bg-green-400 text-green-900'  };
  return              { label: '모집 마감', badge: 'bg-gray-400 text-gray-900'    };
}

export function getRecruitCountdown() {
  const today = toStartOfDay(new Date());
  const start = parseRecruitDate(RECRUIT.start);
  const end = parseRecruitDate(RECRUIT.end);

  if (today < start) {
    const days = Math.round((start.getTime() - today.getTime()) / DAY_MS);
    return { text: `모집 시작까지 D-${days}`, tone: 'text-yellow-300' };
  }

  if (today <= end) {
    const days = Math.round((end.getTime() - today.getTime()) / DAY_MS);
    return { text: `모집 마감까지 D-${days}`, tone: 'text-green-300' };
  }

  const days = Math.round((today.getTime() - end.getTime()) / DAY_MS);
  return { text: `모집 마감 후 ${days}일`, tone: 'text-gray-400' };
}

export const ANNOUNCEMENT = {
  show: false,
  text: '🎉 2025년 신입 부원 모집 중! 지금 바로 지원하세요',
  link: 'https://forms.gle/example',
};
