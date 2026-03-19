import { useInView } from '../hooks/useInView';
import { BLOG_POSTS } from '../data/blogPosts';

const SOURCE_STYLE: Record<string, { label: string; color: string; bg: string }> = {
  velog:   { label: 'Velog',   color: '#20C997', bg: 'rgba(32,201,151,0.15)' },
  tistory: { label: 'Tistory', color: '#FF5A4E', bg: 'rgba(255,90,78,0.15)'  },
  other:   { label: 'Blog',    color: '#82AAFF', bg: 'rgba(130,170,255,0.15)' },
};

export default function BlogPage() {
  const { ref, inView } = useInView(0.05);

  return (
    <div className="min-h-screen bg-[#0F0F1B] pt-24 pb-20 px-6">
      <div className="max-w-[1200px] mx-auto">

        {/* 헤드라인 */}
        <div className="mb-14">
          <div className="font-mono text-xs text-[#546E7A] mb-3">{'// nl.blog'}</div>
          <h1 className="font-black text-white mb-3" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
            NL 블로그
          </h1>
          <p className="text-white/40 font-mono text-sm">
            부원들이 직접 작성한 기술 블로그 글 모음입니다.
          </p>
        </div>

        {/* 카드 그리드 */}
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {BLOG_POSTS.map((post, i) => {
            const src = SOURCE_STYLE[post.source];
            return (
              <a
                key={i}
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col rounded-2xl overflow-hidden border border-white/10 hover:border-white/25 transition-all duration-700"
                style={{
                  background: 'rgba(26,26,46,0.8)',
                  opacity: inView ? 1 : 0,
                  transform: inView ? 'translateY(0)' : 'translateY(32px)',
                  transitionDelay: `${i * 80}ms`,
                }}
              >
                {/* 카드 상단 — 파일 탭 스타일 */}
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-[#12121F]">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs" style={{ color: src.color }}>{src.label}</span>
                    {post.author && (
                      <span className="font-mono text-xs text-white/25">· {post.author}</span>
                    )}
                  </div>
                  <span className="font-mono text-xs text-white/25">{post.date}</span>
                </div>

                {/* 카드 본문 */}
                <div className="p-6 flex flex-col gap-3 flex-1">
                  <h3 className="font-bold text-white text-base leading-snug group-hover:text-[#82AAFF] transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-white/50 text-sm leading-relaxed flex-1 line-clamp-3">
                    {post.summary}
                  </p>
                  {/* 태그 */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {post.tags.map(tag => (
                      <span
                        key={tag}
                        className="font-mono text-xs px-2 py-0.5 rounded"
                        style={{ color: src.color, background: src.bg }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 카드 푸터 */}
                <div className="px-6 py-3 border-t border-white/10 flex items-center justify-between">
                  <span className="font-mono text-xs text-white/25">글 읽기 →</span>
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: src.color }}
                  />
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
