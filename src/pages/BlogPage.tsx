import { useState } from 'react';
import { useInView } from '../hooks/useInView';
import { BLOG_POSTS } from '../data/blogPosts';
import type { BlogPost } from '../data/blogPosts';

const SOURCE_STYLE: Record<string, { label: string; color: string; bg: string }> = {
  velog:   { label: 'Velog',   color: '#20C997', bg: 'rgba(32,201,151,0.15)'  },
  tistory: { label: 'Tistory', color: '#FF5A4E', bg: 'rgba(255,90,78,0.15)'   },
  other:   { label: 'Blog',    color: '#82AAFF', bg: 'rgba(130,170,255,0.15)' },
};

// 전체 태그 추출
const ALL_TAGS = ['전체', ...Array.from(new Set(BLOG_POSTS.flatMap(p => p.tags)))];

function BlogCard({ post, featured = false }: { post: BlogPost; featured?: boolean }) {
  const src = SOURCE_STYLE[post.source] ?? SOURCE_STYLE.other;
  return (
    <a
      href={post.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group flex flex-col rounded-2xl overflow-hidden border border-white/10 hover:border-white/30 hover:shadow-2xl transition-all duration-500 ${
        featured ? 'md:col-span-2 md:flex-row' : ''
      }`}
      style={{ background: 'rgba(26,26,46,0.9)' }}
    >
      {/* featured 좌측 컬러 패널 */}
      {featured && (
        <div
          className="hidden md:flex flex-col items-center justify-center w-48 shrink-0 font-black text-6xl"
          style={{ background: `${src.color}18` }}
        >
          <span style={{ color: src.color }}>
            {post.source === 'velog' ? 'V' : post.source === 'tistory' ? 'T' : 'B'}
          </span>
        </div>
      )}

      {/* 카드 헤더 */}
      <div className="flex flex-col flex-1">
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-[#12121F]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ background: src.color }} />
            <span className="font-mono text-xs" style={{ color: src.color }}>{src.label}</span>
            {post.author && (
              <span className="font-mono text-xs text-white/25">· {post.author}</span>
            )}
          </div>
          <span className="font-mono text-xs text-white/25">{post.date}</span>
        </div>

        {/* 카드 본문 */}
        <div className="p-6 flex flex-col gap-3 flex-1">
          {featured && (
            <div className="flex items-center gap-2 font-mono text-xs text-[#4F46E5] mb-1">
              <span aria-hidden="true" className="material-symbols-outlined" style={{ fontSize: '1.05rem' }}>
                star_border
              </span>
              <span>추천 글</span>
            </div>
          )}
          <h3
            className={`font-bold text-white leading-snug group-hover:text-[#82AAFF] transition-colors ${
              featured ? 'text-xl' : 'text-base'
            }`}
          >
            {post.title}
          </h3>
          <p className="text-white/50 text-sm leading-relaxed flex-1 line-clamp-3">
            {post.summary}
          </p>
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

        <div className="px-6 py-3 border-t border-white/10 flex items-center justify-between">
          <span className="font-mono text-xs text-white/30 group-hover:text-white/60 transition-colors">
            글 읽기 →
          </span>
          <span className="w-2 h-2 rounded-full" style={{ background: src.color }} />
        </div>
      </div>
    </a>
  );
}

export default function BlogPage() {
  const [activeTag, setActiveTag] = useState('전체');
  const heroRef = useInView(0.1);
  const gridRef = useInView(0.05);

  const filtered =
    activeTag === '전체'
      ? BLOG_POSTS
      : BLOG_POSTS.filter(p => p.tags.includes(activeTag));

  const [featured, ...rest] = filtered;

  return (
    <div className="min-h-screen bg-[#0F0F1B]">

      {/* ── 히어로 배너 ── */}
      <div
        className="relative flex items-end pt-36 pb-16 px-6 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0F0F1B 0%, #0d1f3c 60%, #0F0F1B 100%)', minHeight: '300px' }}
      >
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              'linear-gradient(rgba(130,170,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(130,170,255,0.5) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="max-w-[1200px] mx-auto w-full relative z-10" ref={heroRef.ref}>
          <div
            className="transition-all duration-700"
            style={{
              opacity: heroRef.inView ? 1 : 0,
              transform: heroRef.inView ? 'translateY(0)' : 'translateY(30px)',
            }}
          >
            <div className="font-mono text-xs text-[#82AAFF] mb-3">{'// nl.blog'}</div>
            <h1
              className="font-black text-white mb-4"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 1.1 }}
            >
              NL 블로그
            </h1>
            <p className="text-white/50 text-lg">부원들이 직접 작성한 기술 블로그 글 모음입니다.</p>
          </div>
        </div>
      </div>

      {/* ── 필터 탭 ── */}
      <div className="sticky top-16 z-30 bg-[#0F0F1B]/90 backdrop-blur-md border-b border-white/10 px-6 py-4">
        <div className="max-w-[1200px] mx-auto flex gap-2 flex-wrap">
          {ALL_TAGS.map(tag => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className="font-mono text-xs px-3 py-1.5 rounded-lg transition-all duration-200"
              style={{
                background: activeTag === tag ? '#4F46E5' : 'rgba(255,255,255,0.07)',
                color: activeTag === tag ? '#fff' : 'rgba(255,255,255,0.5)',
              }}
            >
              {tag === '전체' ? tag : `#${tag}`}
            </button>
          ))}
        </div>
      </div>

      {/* ── 카드 그리드 ── */}
      <div ref={gridRef.ref} className="py-14 px-6">
        <div className="max-w-[1200px] mx-auto">
          {filtered.length === 0 ? (
            <p className="text-white/30 font-mono text-center py-20">해당 태그의 글이 없습니다.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured && (
                <div
                  className="md:col-span-2 lg:col-span-2 transition-all duration-700"
                  style={{
                    opacity: gridRef.inView ? 1 : 0,
                    transform: gridRef.inView ? 'translateY(0)' : 'translateY(32px)',
                  }}
                >
                  <BlogCard post={featured} featured />
                </div>
              )}
              {rest.map((post, i) => (
                <div
                  key={i}
                  className="transition-all duration-700"
                  style={{
                    opacity: gridRef.inView ? 1 : 0,
                    transform: gridRef.inView ? 'translateY(0)' : 'translateY(32px)',
                    transitionDelay: `${(i + 1) * 80}ms`,
                  }}
                >
                  <BlogCard post={post} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
