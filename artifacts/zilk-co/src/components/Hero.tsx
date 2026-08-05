import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { staggerContainer, clipReveal, fadeUp, fadeIn, drawLine } from '@/lib/animations';

/* ─── Marquee items ─── */
const MARQUEE_ITEMS = [
  'React', 'Node.js', 'PostgreSQL', 'TypeScript', 'Python',
  'Flutter', 'AWS', 'Enterprise Software', 'Digital Platforms',
  'Mobile Applications', 'ERP Systems', 'Web Architecture',
];

function MarqueeTrack() {
  const doubled = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="overflow-hidden animate-marquee-pause">
      <div className="animate-marquee">
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-6 pr-6">
            <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-foreground/28 whitespace-nowrap">
              {item}
            </span>
            <span className="text-primary/30 text-[8px]">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Blueprint geometric background ─── */
function BlueprintBackground({ mouseX, mouseY }: { mouseX: number; mouseY: number }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Dot grid */}
      <motion.div
        className="absolute inset-[-10%] dot-grid"
        style={{
          x: mouseX * -12,
          y: mouseY * -12,
          opacity: 0.9,
        }}
      />

      {/* Large blueprint arc — right side */}
      <motion.svg
        className="absolute right-[-8%] top-1/2 w-[min(650px,55vw)] h-[min(650px,55vw)] text-foreground opacity-[0.045]"
        style={{
          y: '-50%',
          x: mouseX * 8,
          translateY: mouseY * 5,
        }}
        viewBox="0 0 600 600"
        fill="none"
      >
        <circle cx="300" cy="300" r="290" stroke="currentColor" strokeWidth="0.6" />
        <circle cx="300" cy="300" r="210" stroke="currentColor" strokeWidth="0.4" />
        <circle cx="300" cy="300" r="130" stroke="currentColor" strokeWidth="0.4" />
        <circle cx="300" cy="300" r="50" stroke="currentColor" strokeWidth="0.6" />
        {/* Cross-hair lines */}
        <line x1="300" y1="5" x2="300" y2="595" stroke="currentColor" strokeWidth="0.4" />
        <line x1="5" y1="300" x2="595" y2="300" stroke="currentColor" strokeWidth="0.4" />
        {/* 45° diagonals */}
        <line x1="95" y1="95" x2="505" y2="505" stroke="currentColor" strokeWidth="0.25" strokeDasharray="4 6" />
        <line x1="505" y1="95" x2="95" y2="505" stroke="currentColor" strokeWidth="0.25" strokeDasharray="4 6" />
      </motion.svg>

      {/* Small accent arc — left side */}
      <motion.svg
        className="absolute left-[-5%] bottom-[15%] w-[min(280px,24vw)] h-[min(280px,24vw)] text-foreground opacity-[0.03]"
        style={{ x: mouseX * -5, y: mouseY * -4 }}
        viewBox="0 0 280 280"
        fill="none"
      >
        <circle cx="140" cy="140" r="130" stroke="currentColor" strokeWidth="0.5" />
        <circle cx="140" cy="140" r="80" stroke="currentColor" strokeWidth="0.4" strokeDasharray="3 5" />
      </motion.svg>

      {/* Ambient glow — top-center */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-[0.06]"
        style={{
          background: 'radial-gradient(ellipse, hsl(185 82% 50%) 0%, transparent 70%)',
          transform: `translateX(-50%) translateX(${mouseX * 20}px) translateY(${mouseY * 20}px)`,
        }}
      />
    </div>
  );
}

/* ─── Stats row ─── */
const STATS = [
  { value: '4+', label: 'Years Active' },
  { value: '10+', label: 'Projects Shipped' },
  { value: '4', label: 'Industries Served' },
  { value: '100%', label: 'Client Satisfaction' },
];

/* ─── Main Hero ─── */
export function Hero({ started }: { started: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const contentY = useTransform(scrollY, [0, 800], [0, 160]);
  const contentOpacity = useTransform(scrollY, [0, 500], [1, 0]);

  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth) - 0.5,
        y: (e.clientY / window.innerHeight) - 0.5,
      });
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <section
      ref={ref}
      className="relative min-h-[100dvh] flex flex-col overflow-hidden bg-background"
      id="hero"
    >
      <BlueprintBackground mouseX={mouse.x} mouseY={mouse.y} />

      {/* ── Main content ── */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 flex-1 flex flex-col justify-center max-w-7xl mx-auto w-full px-6 md:px-10 pt-28 pb-16"
      >
        <motion.div
          variants={staggerContainer(0.1, 0.05)}
          initial="hidden"
          animate={started ? 'visible' : 'hidden'}
          className="max-w-5xl"
        >
          {/* Eyebrow */}
          <motion.div
            variants={fadeUp}
            className="flex items-center gap-3 mb-10"
          >
            <motion.span
              variants={drawLine}
              className="block h-px w-8 bg-primary flex-shrink-0"
            />
            <span className="font-mono text-[11px] tracking-[0.28em] uppercase text-primary/80">
              Engineering Digital Businesses
            </span>
          </motion.div>

          {/* Heading — line-by-line clip reveal */}
          <h1
            className="font-display font-extrabold leading-[0.88] tracking-[-0.04em] text-foreground mb-10 select-none"
            style={{ fontSize: 'clamp(3.8rem, 9vw, 10rem)' }}
          >
            {/* Line 1 */}
            <span className="block overflow-hidden">
              <motion.span
                variants={clipReveal}
                className="block"
              >
                We Build
              </motion.span>
            </span>

            {/* Line 2 */}
            <span className="block overflow-hidden">
              <motion.span
                variants={clipReveal}
                className="block text-foreground/80"
              >
                Digital
              </motion.span>
            </span>

            {/* Line 3 */}
            <span className="block overflow-hidden">
              <motion.span
                variants={clipReveal}
                className="block"
              >
                Businesses<span className="text-primary">.</span>
              </motion.span>
            </span>
          </h1>

          {/* Description */}
          <motion.p
            variants={fadeUp}
            className="text-base md:text-lg text-foreground/45 max-w-md font-light leading-relaxed mb-12 font-sans"
          >
            Enterprise software, digital platforms, and mobile applications
            — built to perform at scale. We integrate AI to make your users' journey effortless.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeUp}
            className="flex flex-wrap items-center gap-4"
          >
            {/* Primary */}
            <a
              href="#work"
              onClick={(e) => { e.preventDefault(); document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="group relative inline-flex items-center gap-3 bg-foreground text-background font-mono text-[12px] tracking-[0.1em] uppercase font-semibold px-8 py-4 rounded-[3px] overflow-hidden hover:scale-[1.02] active:scale-[0.99] transition-transform duration-200"
              data-testid="hero-cta-work"
            >
              <span className="relative z-10">See Our Work</span>
              <ArrowRight
                size={14}
                className="relative z-10 group-hover:translate-x-1 transition-transform duration-200"
              />
              {/* Hover shimmer */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
            </a>

            {/* Secondary */}
            <a
              href="#contact"
              onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="group inline-flex items-center gap-2 font-mono text-[12px] tracking-[0.1em] uppercase text-foreground/50 hover:text-foreground border border-transparent hover:border-foreground/10 px-6 py-4 rounded-[3px] transition-all duration-200"
              data-testid="hero-cta-contact"
            >
              Start a Project
              <ArrowRight
                size={13}
                className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200"
              />
            </a>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* ── Marquee strip ── */}
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate={started ? 'visible' : 'hidden'}
        transition={{ delay: 1.2 }}
        className="relative z-10 border-y border-foreground/[0.05] py-3.5 overflow-hidden"
      >
        <MarqueeTrack />
      </motion.div>

      {/* ── Stats bar ── */}
      <motion.div
        variants={staggerContainer(0.08, 0.05)}
        initial="hidden"
        animate={started ? 'visible' : 'hidden'}
        className="relative z-10 border-t border-foreground/[0.05]"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-foreground/[0.05]">
            {STATS.map((stat) => (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                className="group py-6 px-6 md:px-8 flex flex-col gap-1 hover:bg-foreground/[0.02] transition-colors duration-300"
              >
                <span className="font-display font-bold text-xl text-foreground group-hover:text-primary transition-colors duration-300">
                  {stat.value}
                </span>
                <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-foreground/35">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Right-edge credential strip ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={started ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        className="absolute right-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-center gap-5 z-20"
      >
        {/* Availability pulse */}
        <div className="flex flex-col items-center gap-2.5">
          <div className="relative flex-shrink-0">
            <span className="absolute w-2 h-2 rounded-full bg-emerald-400 opacity-35 animate-ping" />
            <span className="relative block w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <span
            className="font-mono text-[9px] tracking-[0.28em] uppercase text-foreground/35"
            style={{ writingMode: 'vertical-rl' }}
          >
            Available Now
          </span>
        </div>

        {/* Divider */}
        <div className="w-px h-5 bg-foreground/[0.07]" />

        {/* Timezone */}
        <div className="flex flex-col items-center gap-2">
          <span
            className="font-mono text-[9px] tracking-[0.22em] uppercase text-foreground/20"
            style={{ writingMode: 'vertical-rl' }}
          >
            PKT · GMT+5
          </span>
        </div>

        {/* Divider */}
        <div className="w-px h-5 bg-foreground/[0.07]" />

        {/* Response time */}
        <div className="flex flex-col items-center gap-2">
          <span
            className="font-mono text-[9px] tracking-[0.22em] uppercase text-foreground/20"
            style={{ writingMode: 'vertical-rl' }}
          >
            24h Response
          </span>
        </div>
      </motion.div>
    </section>
  );
}
