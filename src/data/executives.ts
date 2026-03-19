import type { Executive } from '../types';

// 임원진 교체 시 이 배열만 수정
export const EXECUTIVES: Executive[] = [
  {
    name: '홍길동',
    role: '회장',
    img: '',
    bio: '동아리의 방향을 잡고, 구성원들이 더 멀리 나아갈 수 있도록 이끕니다.',
    highlights: ['대외 협력', '운영 총괄', '성장 전략'],
  },
  {
    name: '김철수',
    role: '부회장',
    img: '',
    bio: '프로젝트와 운영을 함께 리딩하며, 팀 간 조율을 책임집니다.',
    highlights: ['팀 리딩', '일정 관리', '리소스 조율'],
  },
  {
    name: '이영희',
    role: '총무',
    img: '',
    bio: '행사와 커뮤니케이션을 매끄럽게 운영해 분위기를 탄탄히 잡습니다.',
    highlights: ['행사 운영', '홍보 지원', '원활한 소통'],
  },
  {
    name: '박민준',
    role: '학술부장',
    img: '',
    bio: '학술 콘텐츠를 기획하고 스터디의 깊이를 더해갑니다.',
    highlights: ['세미나 기획', '스터디 운영', '학술 성장'],
  },
];
