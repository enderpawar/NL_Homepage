import type { Activity } from '../types';

// 활동 카드 추가 시 이 배열에만 항목 추가
export const ACTIVITIES: Activity[] = [
  {
    title: '정기 스터디',
    desc: '매주 화요일 진행',
    detail: 'CS 기초부터 심화 알고리즘, 웹/앱 개발까지 다양한 주제로 매주 함께 공부합니다.',
    icon: 'menuBook',
  },
  {
    title: '팀 프로젝트',
    desc: '학기당 1~2회',
    detail: '실제 서비스를 만드는 팀 프로젝트로 협업 경험과 포트폴리오를 쌓습니다.',
    icon: 'code',
  },
  {
    title: '기술 세미나',
    desc: '월 1회',
    detail: '선배 부원 및 외부 연사를 초청하여 최신 기술 트렌드와 실무 경험을 공유합니다.',
    icon: 'mic',
  },
  {
    title: '해커톤',
    desc: '연 1회',
    detail: '24시간 집중 개발로 아이디어를 현실로 만드는 경험을 합니다.',
    icon: 'rocket',
  },
];
