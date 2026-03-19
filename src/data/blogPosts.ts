// 블로그 글 목록 — Velog/Tistory 글 링크를 여기에 추가하세요
export interface BlogPost {
  title: string;
  summary: string;
  date: string;
  url: string;
  tags: string[];
  source: 'velog' | 'tistory' | 'other';
  author?: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    title: '알고리즘 스터디 후기: 백트래킹 완전 정복',
    summary: '이번 주 정기 스터디에서는 백트래킹 알고리즘을 깊이 파고들었습니다. N-Queen 문제부터 시작해 실전 문제까지 함께 풀어봤습니다.',
    date: '2025-03-10',
    url: 'https://velog.io',
    tags: ['Algorithm', 'C++', 'Study'],
    source: 'velog',
    author: '김○○',
  },
  {
    title: 'React로 만드는 나만의 포트폴리오 사이트',
    summary: 'NL 팀 프로젝트를 통해 React를 처음 접했습니다. 컴포넌트 설계부터 배포까지의 과정을 기록했습니다.',
    date: '2025-02-28',
    url: 'https://velog.io',
    tags: ['React', 'TypeScript', 'Project'],
    source: 'velog',
    author: '이○○',
  },
  {
    title: '2025 해커톤 참가 후기 — 24시간의 기록',
    summary: '처음 참가한 교내 해커톤에서 NL 팀원들과 함께 아이디어를 현실로 만들어낸 경험을 공유합니다.',
    date: '2025-02-15',
    url: 'https://tistory.com',
    tags: ['Hackathon', 'Teamwork', 'Backend'],
    source: 'tistory',
    author: '박○○',
  },
  {
    title: 'CS 스터디: 운영체제 프로세스 & 스레드 정리',
    summary: '운영체제 스터디에서 다룬 프로세스와 스레드의 차이, 컨텍스트 스위칭, 동기화 문제를 정리했습니다.',
    date: '2025-01-22',
    url: 'https://velog.io',
    tags: ['OS', 'CS', 'Study'],
    source: 'velog',
    author: '최○○',
  },
  {
    title: 'Git & GitHub 협업 플로우 — 팀 프로젝트 가이드',
    summary: 'NL 팀 프로젝트에서 사용하는 Git 브랜치 전략과 PR 리뷰 문화를 정리했습니다.',
    date: '2025-01-10',
    url: 'https://tistory.com',
    tags: ['Git', 'Collaboration', 'Guide'],
    source: 'tistory',
    author: '정○○',
  },
  {
    title: 'Python으로 시작하는 데이터 분석 입문',
    summary: 'pandas와 matplotlib를 활용해 공공데이터를 분석하는 세미나 내용을 정리했습니다.',
    date: '2024-12-05',
    url: 'https://velog.io',
    tags: ['Python', 'Data', 'Seminar'],
    source: 'velog',
    author: '강○○',
  },
];
