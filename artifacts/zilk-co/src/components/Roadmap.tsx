import { useRef } from 'react';
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useInView,
} from 'framer-motion';
import { staggerContainer, clipReveal, fadeUp } from '@/lib/animations';

/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */
interface RoadmapItem {
  id: string;
  index: string;
  title: string;
  category: string;
  description: string;
  quarter: string;
  status: 'Planning' | 'In Design' | 'In Development' | 'Upcoming';
  accentHue: number;
}

const ROADMAP: RoadmapItem[] = [
  {
    id: 'restaurant-website',
    index: '01',
    title: 'Restaurant Website',
    category: 'Web Design',
    description:
      'A premium digital presence for a restaurant brand — curated menus, online reservations, and an immersive atmosphere built to drive foot traffic and pre-orders.',
    quarter: 'Q3 2025',
    status: 'Planning',
    accentHue: 25,
  },
  {
    id: 'restaurant-app',
    index: '02',
    title: 'Restaurant App',
    category: 'Mobile Application',
    description:
      'A full-featured mobile ordering experience with table reservations, loyalty reward tracking, real-time kitchen status, and push notification updates.',
    quarter: 'Q4 2025',
    status: 'Planning',
    accentHue: 15,
  },
  {
    id: 'school-erp',
    index: '03',
    title: 'School ERP',
    category: 'Enterprise Software',
    description:
      'Complete school management system covering student enrollment, staff records, academic timetables, fee collection, grade reporting, and parent communication in one unified platform.',
    quarter: 'Q1 2026',
    status: 'In Design',
    accentHue: 185,
  },
  {
    id: 'hostel-erp',
    index: '04',
    title: 'Hostel ERP',
    category: 'Enterprise Software',
    description:
      'End-to-end hostel operations platform — room allocation, automated billing, maintenance request tracking, and resident management for large residential facilities.',
    quarter: 'Q1 2026',
    status: 'Planning',
    accentHue: 150,
  },
  {
    id: 'hotel-erp',
    index: '05',
    title: 'Hotel ERP',
    category: 'Enterprise Software',
    description:
      'Full-stack hotel management system with front desk operations, room reservations, housekeeping workflow, point-of-sale, and consolidated financial reporting.',
    quarter: 'Q2 2026',
    status: 'Upcoming',
    accentHue: 210,
  },
];

/* ─────────────────────────────────────────
   STATUS CONFIG
───────────────────────────────────────── */
const STATUS_CONFIG: Record<RoadmapItem['status'], { dot: string; text: string; bg: string }> = {
  Planning: {
    dot: 'bg-amber-400',
    text: 'text-amber-400/80',
    bg: 'bg-amber-400/[0.06] border-amber-400/20',
  },
  'In Design': {
    dot: 'bg-sky-400',
    text: 'text-sky-400/80',
    bg: 'bg-sky-400/[0.06] border-sky-400/20',
  },
  'In Development': {
    dot: 'bg-emerald-400',
    text: 'text-emerald-400/80',
    bg: 'bg-emerald-400/[0.06] border-emerald-400/20',
  },
  Upcoming: {
    dot: 'bg-violet-400',
    text: 'text-violet-400/80',
    bg: 'bg-violet-400/[0.06] border-violet-400/20',
  },
};

/* ─────────────────────────────────────────
   TIMELINE DOT
───────────────────────────────────────── */
function TimelineDot({ item, active }: { item: RoadmapItem; active: boolean }) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={active ? { scale: 1, opacity: 1 } : {}}
      transition={{ type: 'spring', stiffness: 280, damping: 20, delay: 0.1 }}
      className="relative flex items-center justify-center w-10 h-10 flex-shrink-0"
    >
      {/* Outer ring */}
      <motion.div
        animate={active ? { scale: [1, 1.35, 1], opacity: [0.5, 0, 0.5] } : {}}
        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut', delay: 0.6 }}
        className="absolute inset-0 rounded-full border"
        style={{ borderColor: `hsl(${item.accentHue} 80% 55% / 0.35)` }}
      />
      {/* Middle ring */}
      <div
        className="absolute w-7 h-7 rounded-full border"
        style={{ borderColor: `hsl(${item.accentHue} 80% 55% / 0.25)` }}
      />
      {/* Core dot */}
      <div
        className="w-3.5 h-3.5 rounded-full"
        style={{ background: `hsl(${item.accentHue} 80% 55%)` }}
      />
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   CONNECTOR LINE
───────────────────────────────────────── */
function Connector({ active, fromRight }: { active: boolean; fromRight?: boolean }) {
  return (
    <div className={`hidden md:flex items-center h-px w-10 flex-shrink-0 overflow-hidden ${fromRight ? 'flex-row-reverse' : ''}`}>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={active ? { scaleX: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="h-full w-full bg-border origin-left"
        style={{ transformOrigin: fromRight ? 'right' : 'left' }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────
   ROADMAP CARD
───────────────────────────────────────── */
function RoadmapCard({
  item,
  fromLeft,
  active,
}: {
  item: RoadmapItem;
  fromLeft: boolean;
  active: boolean;
}) {
  const cfg = STATUS_CONFIG[item.status];

  return (
    <motion.div
      initial={{ opacity: 0, x: fromLeft ? -36 : 36 }}
      animate={active ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative flex flex-col gap-4 p-5 md:p-7 rounded-[4px] border border-foreground/[0.07] bg-card hover:border-foreground/[0.13] hover:bg-foreground/[0.02] transition-all duration-500 overflow-hidden ${fromLeft ? 'md:text-right md:items-end' : ''}`}
      data-testid={`roadmap-card-${item.id}`}
    >
      {/* Large ghost index — decorative */}
      <span
        className="absolute -top-2 pointer-events-none font-display font-extrabold select-none leading-none"
        style={{
          fontSize: 'clamp(5rem, 10vw, 8rem)',
          color: `hsl(${item.accentHue} 80% 55% / 0.04)`,
          right: fromLeft ? 'auto' : '-0.1em',
          left: fromLeft ? '-0.1em' : 'auto',
        }}
      >
        {item.index}
      </span>

      {/* Top row: quarter + status */}
      <div className={`flex items-center gap-2.5 flex-wrap ${fromLeft ? 'md:flex-row-reverse' : ''}`}>
        <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-foreground/30">
          {item.quarter}
        </span>
        <span className="w-1 h-1 rounded-full bg-foreground/20 hidden sm:block" />
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-mono tracking-[0.12em] uppercase ${cfg.bg} ${cfg.text}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} flex-shrink-0`} />
          {item.status}
        </span>
      </div>

      {/* Category */}
      <div className={`flex items-center gap-2 ${fromLeft ? 'md:flex-row-reverse' : ''}`}>
        <motion.span
          initial={{ scaleX: 0 }}
          animate={active ? { scaleX: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="block h-px w-5 flex-shrink-0"
          style={{ background: `hsl(${item.accentHue} 80% 55% / 0.6)`, transformOrigin: fromLeft ? 'right' : 'left' }}
        />
        <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-foreground/35">
          {item.category}
        </span>
      </div>

      {/* Title */}
      <h3
        className="font-display font-extrabold text-foreground leading-tight tracking-tight"
        style={{ fontSize: 'clamp(1.3rem, 2.5vw, 1.75rem)' }}
      >
        {item.title}
      </h3>

      {/* Description */}
      <p className="text-[13px] text-foreground/40 leading-relaxed font-light">
        {item.description}
      </p>

      {/* Hover bottom accent */}
      <motion.div
        className={`absolute bottom-0 h-[1.5px] rounded-b-[4px] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ${fromLeft ? 'right-0 origin-right' : 'left-0 origin-left'}`}
        style={{
          background: `hsl(${item.accentHue} 80% 55% / 0.55)`,
          left: fromLeft ? 'auto' : 0,
          right: fromLeft ? 0 : 'auto',
          width: '100%',
        }}
      />
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   SINGLE TIMELINE ROW
───────────────────────────────────────── */
function TimelineRow({ item, isLeft }: { item: RoadmapItem; isLeft: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const active = useInView(ref, { once: true, margin: '-100px 0px' });

  return (
    <div
      ref={ref}
      className="relative flex items-start md:items-center gap-0 pb-10 last:pb-0"
    >
      {/* ── Mobile layout (flex: dot left, card right) ── */}
      <div className="flex items-start gap-4 w-full md:hidden">
        <div className="flex flex-col items-center pt-1 flex-shrink-0">
          <TimelineDot item={item} active={active} />
        </div>
        <div className="flex-1 pt-1">
          <RoadmapCard item={item} fromLeft={false} active={active} />
        </div>
      </div>

      {/* ── Desktop layout (center-line alternating) ── */}
      <div className="hidden md:flex w-full items-center">
        {/* Left card area */}
        <div className="flex-1 flex justify-end pr-0">
          {isLeft ? (
            <div className="w-full max-w-[440px]">
              <RoadmapCard item={item} fromLeft={true} active={active} />
            </div>
          ) : (
            <div className="w-full max-w-[440px]" />
          )}
        </div>

        {/* Left connector */}
        <Connector active={active && isLeft} fromRight />

        {/* Dot */}
        <TimelineDot item={item} active={active} />

        {/* Right connector */}
        <Connector active={active && !isLeft} />

        {/* Right card area */}
        <div className="flex-1 flex justify-start pl-0">
          {!isLeft ? (
            <div className="w-full max-w-[440px]">
              <RoadmapCard item={item} fromLeft={false} active={active} />
            </div>
          ) : (
            <div className="w-full max-w-[440px]" />
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   SECTION HEADER
───────────────────────────────────────── */
function RoadmapHeader() {
  return (
    <motion.div
      variants={staggerContainer(0.1, 0)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      className="mb-24 md:mb-32"
    >
      <motion.div variants={fadeUp} className="flex items-center gap-3 mb-6">
        <motion.span
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="block h-px w-8 bg-primary origin-left"
        />
        <span className="font-mono text-[11px] tracking-[0.28em] uppercase text-primary/80">
          What's Coming
        </span>
      </motion.div>

      <div className="overflow-hidden">
        <motion.h2
          variants={clipReveal}
          className="font-display font-extrabold text-foreground tracking-tight leading-[0.88]"
          style={{ fontSize: 'clamp(2.8rem, 5.5vw, 5.5rem)' }}
        >
          The Roadmap
        </motion.h2>
      </div>
      <div className="overflow-hidden">
        <motion.h2
          variants={clipReveal}
          className="font-display font-extrabold tracking-tight leading-[0.88]"
          style={{ fontSize: 'clamp(2.8rem, 5.5vw, 5.5rem)' }}
        >
          <span className="text-foreground/40">Ahead</span>
          <span className="text-primary">.</span>
        </motion.h2>
      </div>

      <motion.p
        variants={fadeUp}
        className="mt-7 text-[14.5px] text-foreground/38 max-w-lg font-light leading-[1.75]"
      >
        Six products in active planning and design — spanning web, mobile, and enterprise.
        Each one a new vertical, built to the same standard.
      </motion.p>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────────── */
export function Roadmap() {
  const sectionRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  /* Scroll-driven vertical line fill */
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start 0.85', 'end 0.25'],
  });
  const lineScaleY = useSpring(scrollYProgress, { stiffness: 60, damping: 22 });
  /* Gradient the line to fade out at the bottom */
  const lineOpacity = useTransform(scrollYProgress, [0.85, 1], [1, 0.4]);

  return (
    <section
      ref={sectionRef}
      id="roadmap"
      className="relative bg-secondary border-t border-border py-24 md:py-32 overflow-hidden"
    >
      {/* Background texture */}
      <div className="absolute inset-0 dot-grid opacity-20 pointer-events-none" />

      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, hsl(185 82% 50% / 0.04) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10">
        <RoadmapHeader />

        {/* Timeline container */}
        <div ref={timelineRef} className="relative">

          {/* ── Background vertical line (full height, static) ── */}
          {/* Mobile */}
          <div className="absolute left-5 top-0 h-full w-px bg-border -translate-x-1/2 md:hidden" />
          {/* Desktop */}
          <div className="absolute left-1/2 top-0 h-full w-px bg-border -translate-x-1/2 hidden md:block" />

          {/* ── Animated fill line ── */}
          {/* Mobile */}
          <motion.div
            style={{ scaleY: lineScaleY, transformOrigin: 'top', opacity: lineOpacity }}
            className="absolute left-5 top-0 h-full w-px -translate-x-1/2 md:hidden"
            aria-hidden
          >
            <div className="w-full h-full bg-gradient-to-b from-primary via-primary to-primary/30" />
          </motion.div>
          {/* Desktop */}
          <motion.div
            style={{ scaleY: lineScaleY, transformOrigin: 'top', opacity: lineOpacity }}
            className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 hidden md:block"
            aria-hidden
          >
            <div className="w-full h-full bg-gradient-to-b from-primary via-primary to-primary/30" />
          </motion.div>

          {/* ── Items ── */}
          {ROADMAP.map((item, i) => (
            <TimelineRow key={item.id} item={item} isLeft={i % 2 === 0} />
          ))}

          {/* ── Terminal cap ── */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ type: 'spring', stiffness: 200, damping: 18, delay: 0.2 }}
            className="flex justify-center pt-8"
          >
            <div className="relative flex items-center justify-center w-10 h-10">
              <div className="absolute inset-0 rounded-full border border-foreground/10 animate-pulse" />
              <div className="w-4 h-4 rounded-full bg-foreground/10 border border-foreground/20 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-foreground/30" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer note */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 flex items-center justify-center gap-3 text-foreground/20"
        >
          <div className="h-px flex-1 max-w-[120px] bg-gradient-to-r from-transparent to-border" />
          <span className="font-mono text-[10px] tracking-[0.22em] uppercase">
            6 Projects · 2025 – 2026
          </span>
          <div className="h-px flex-1 max-w-[120px] bg-gradient-to-l from-transparent to-border" />
        </motion.div>
      </div>
    </section>
  );
}
