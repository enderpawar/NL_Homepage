export interface Executive {
  name: string;
  role: string;
  img: string;
  bio?: string;
  highlights?: string[];
}

export interface Activity {
  title: string;
  desc: string;
  detail: string;
  icon: string;
}

export interface BlogPost {
  title: string;
  summary: string;
  date: string;
  url: string;
  tags: string[];
  source: 'velog' | 'tistory' | 'other';
  author?: string;
}
