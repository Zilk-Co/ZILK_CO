import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowUpRight, Clock, Tag } from 'lucide-react';
import { useLocation } from 'wouter';
import { Cursor } from '@/components/Cursor';
import { Navigation } from '@/components/Navigation';
import { BLOG_POSTS, getBlogPost, type BlogPost as StaticBlogPost } from '@/data/blog';
import { staggerContainer, fadeUp, clipReveal, drawLine } from '@/lib/animations';
import { useSEO } from '@/hooks/useSEO';
import { getPosts, getPostBySlug, type SanityPost } from '@/lib/sanity';
import { getApiPosts, getApiPost } from '@/lib/api';

/* ─────────────────────────────────────────
   BLOG LIST
───────────────────────────────────────── */
function BlogList() {
  const [, navigate] = useLocation();
  const [posts, setPosts] = useState<StaticBlogPost[]>(BLOG_POSTS);

  useEffect(() => {
    getApiPosts()
      .then((apiPosts) => {
        if (apiPosts.length > 0) {
          setPosts(apiPosts);
          return;
        }
        return getPosts().then((sanityPosts: SanityPost[]) => {
          if (sanityPosts.length > 0) {
            setPosts(sanityPosts.map((p) => ({
              slug: p.slug.current,
              title: p.title,
              excerpt: p.excerpt,
              date: new Date(p.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              readTime: p.readTime,
              category: p.category,
              content: p.content.map((b: any) => b.children?.[0]?.text ?? '').filter(Boolean),
            })));
          }
        });
      })
      .catch(() => {
        getPosts().then((sanityPosts: SanityPost[]) => {
          if (sanityPosts.length > 0) {
            setPosts(sanityPosts.map((p) => ({
              slug: p.slug.current,
              title: p.title,
              excerpt: p.excerpt,
              date: new Date(p.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              readTime: p.readTime,
              category: p.category,
              content: p.content.map((b: any) => b.children?.[0]?.text ?? '').filter(Boolean),
            })));
          }
        }).catch(() => {});
      });
  }, []);

  useSEO({
    title: 'Blog — Zilk Co.',
    description: 'Engineering insights, case studies, and innovation notes from the Zilk Co. team.',
  });

  return (
    <div className="min-h-screen bg-background relative">
      <Cursor />
      <Navigation started={true} />
      <div className="absolute inset-0 dot-grid opacity-15 pointer-events-none" />
      {/* Subtle radial gradient wash behind the header */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] pointer-events-none opacity-40"
        style={{
          background: 'radial-gradient(ellipse at center, hsl(var(--primary) / 0.06) 0%, transparent 70%)',
        }}
      />
      {/* Horizontal rule accent */}
      <div className="absolute top-28 left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/[0.06] to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-6 md:px-10 pt-32 pb-24">
        {/* Back button */}
        <motion.a
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          href="/"
          onClick={(e) => { e.preventDefault(); navigate('/'); }}
          className="inline-flex items-center gap-2 mb-16 font-mono text-[10px] tracking-[0.14em] uppercase text-foreground/40 hover:text-foreground transition-colors duration-300 group"
        >
          <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform duration-200" />
          Back to Home
        </motion.a>

        {/* Header */}
        <motion.div
          variants={staggerContainer(0.1, 0)}
          initial="hidden"
          animate="visible"
          className="mb-16"
        >
          <motion.div variants={fadeUp} className="flex items-center gap-3 mb-6">
            <motion.span variants={drawLine} className="block h-px w-8 bg-primary origin-left" />
            <span className="font-mono text-[11px] tracking-[0.28em] uppercase text-primary/80">
              Insights
            </span>
          </motion.div>

          <div className="overflow-hidden mb-3">
            <motion.h1
              variants={clipReveal}
              className="font-display font-extrabold text-foreground leading-[0.88] tracking-tight"
              style={{ fontSize: 'clamp(2.8rem, 6vw, 5rem)' }}
            >
              Engineering
            </motion.h1>
          </div>
          <div className="overflow-hidden">
            <motion.h1
              variants={clipReveal}
              className="font-display font-extrabold text-foreground/35 leading-[0.88] tracking-tight"
              style={{ fontSize: 'clamp(2.8rem, 6vw, 5rem)' }}
            >
              Notes<span className="text-primary">.</span>
            </motion.h1>
          </div>
        </motion.div>

        {/* Posts */}
        <motion.div
          variants={staggerContainer(0.08, 0.05)}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-6"
        >
          {posts.map((post) => (
            <motion.article
              key={post.slug}
              variants={fadeUp}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.25 }}
              onClick={() => navigate(`/blog/${post.slug}`)}
              className="group relative cursor-pointer rounded-[6px] border border-foreground/[0.07] bg-card p-6 md:p-8 hover:border-primary/25 hover:bg-foreground/[0.02] transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-foreground/[0.08] bg-foreground/[0.04] font-mono text-[9px] tracking-[0.14em] uppercase text-foreground/40">
                      <Tag size={9} />
                      {post.category}
                    </span>
                    <span className="font-mono text-[10px] text-foreground/20">{post.date}</span>
                    <span className="flex items-center gap-1 font-mono text-[10px] text-foreground/20">
                      <Clock size={9} />
                      {post.readTime}
                    </span>
                  </div>
                  <h2 className="font-display font-bold text-foreground text-[1.15rem] leading-tight tracking-tight mb-2 group-hover:text-primary transition-colors duration-300">
                    {post.title}
                  </h2>
                  <p className="text-[13px] text-foreground/38 leading-relaxed font-light max-w-xl">
                    {post.excerpt}
                  </p>
                </div>
                <div className="flex-shrink-0 w-10 h-10 rounded-full border border-foreground/[0.08] flex items-center justify-center group-hover:border-primary/40 group-hover:bg-primary/[0.06] transition-all duration-300">
                  <ArrowUpRight size={14} className="text-foreground/30 group-hover:text-primary transition-colors duration-300" />
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   BLOG POST PAGE
───────────────────────────────────────── */
function BlogPostPage({ slug }: { slug: string }) {
  const [, navigate] = useLocation();
  const [post, setPost] = useState<StaticBlogPost | undefined>(getBlogPost(slug));

  useEffect(() => {
    getApiPost(slug)
      .then((apiPost) => {
        if (apiPost) {
          setPost(apiPost);
          return;
        }
        return getPostBySlug(slug).then((sanityPost: SanityPost | null) => {
          if (sanityPost) {
            setPost({
              slug: sanityPost.slug.current,
              title: sanityPost.title,
              excerpt: sanityPost.excerpt,
              date: new Date(sanityPost.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              readTime: sanityPost.readTime,
              category: sanityPost.category,
              content: sanityPost.content.map((b: any) => b.children?.[0]?.text ?? '').filter(Boolean),
            });
          }
        });
      })
      .catch(() => {
        getPostBySlug(slug).then((sanityPost: SanityPost | null) => {
          if (sanityPost) {
            setPost({
              slug: sanityPost.slug.current,
              title: sanityPost.title,
              excerpt: sanityPost.excerpt,
              date: new Date(sanityPost.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              readTime: sanityPost.readTime,
              category: sanityPost.category,
              content: sanityPost.content.map((b: any) => b.children?.[0]?.text ?? '').filter(Boolean),
            });
          }
        }).catch(() => {});
      });
  }, [slug]);

  useSEO({
    title: post ? `${post.title} — Zilk Co.` : 'Post Not Found — Zilk Co.',
    description: post?.excerpt ?? '',
  });

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="font-mono text-sm text-foreground/40 mb-6">Post not found.</p>
          <button
            onClick={() => navigate('/blog')}
            className="font-mono text-xs tracking-widest uppercase text-primary hover:text-foreground transition-colors"
          >
            ← Back to Blog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      <Cursor />
      <Navigation started={true} />
      <div className="absolute inset-0 dot-grid opacity-15 pointer-events-none" />
      {/* Subtle radial glow behind article */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] pointer-events-none opacity-30"
        style={{
          background: 'radial-gradient(ellipse at center, hsl(var(--primary) / 0.05) 0%, transparent 70%)',
        }}
      />

      <article className="relative z-10 max-w-3xl mx-auto px-5 sm:px-6 md:px-10 pt-32 pb-24">
        {/* Back */}
        <motion.a
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          href="/blog"
          onClick={(e) => { e.preventDefault(); navigate('/blog'); }}
          className="inline-flex items-center gap-2 mb-12 font-mono text-[10px] tracking-[0.14em] uppercase text-foreground/40 hover:text-foreground transition-colors duration-300 group"
        >
          <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform duration-200" />
          All Posts
        </motion.a>

        {/* Meta */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-6"
        >
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-primary/20 bg-primary/[0.06] font-mono text-[9px] tracking-[0.14em] uppercase text-primary/80">
            <Tag size={9} />
            {post.category}
          </span>
          <span className="font-mono text-[10px] text-foreground/25">{post.date}</span>
          <span className="flex items-center gap-1 font-mono text-[10px] text-foreground/25">
            <Clock size={9} />
            {post.readTime}
          </span>
        </motion.div>

        {/* Title */}
        <div className="overflow-hidden mb-8">
          <motion.h1
            initial={{ y: '110%' }}
            animate={{ y: '0%' }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-extrabold text-foreground leading-[0.9] tracking-tight"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)' }}
          >
            {post.title}
          </motion.h1>
        </div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="h-px bg-border origin-left mb-10"
        />

        {/* Content */}
        <div className="flex flex-col gap-6">
          {post.content.map((para, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.06 }}
              className="text-[15px] text-foreground/50 leading-[1.85] font-light"
            >
              {para}
            </motion.p>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-16 pt-10 border-t border-border"
        >
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-foreground/25 mb-4">
            Enjoyed this read?
          </p>
          <a
            href="/"
            onClick={(e) => { e.preventDefault(); navigate('/'); }}
            className="group inline-flex items-center gap-3 bg-foreground text-background font-mono text-[11px] tracking-[0.12em] uppercase font-semibold px-8 py-4 rounded-[3px] overflow-hidden hover:scale-[1.02] active:scale-[0.99] transition-transform duration-200"
          >
            <span className="relative z-10">Start a Project</span>
            <ArrowUpRight size={13} className="relative z-10 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
          </a>
        </motion.div>
      </article>
    </div>
  );
}

/* ─────────────────────────────────────────
   EXPORTS
───────────────────────────────────────── */
export function BlogPage() {
  return <BlogList />;
}

export function BlogPost({ slug }: { slug: string }) {
  return <BlogPostPage slug={slug} />;
}
