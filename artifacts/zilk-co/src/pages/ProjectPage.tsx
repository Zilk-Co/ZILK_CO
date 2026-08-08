import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, ArrowUpRight, CheckCircle2, ChevronDown } from 'lucide-react';
import { useLocation, useParams } from 'wouter';
import { Cursor } from '@/components/Cursor';
import { getProject, getNextProject, PROJECTS } from '@/data/projects';
import { staggerContainer, fadeUp, clipReveal, fadeIn, drawLine } from '@/lib/animations';

/* ─────────────────────────────────────────
   PAGE TRANSITION WRAPPER
───────────────────────────────────────── */
function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   BACK BUTTON — fixed, appears on scroll
───────────────────────────────────────── */
function BackButton() {
  const [, navigate] = useLocation();
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollY, 'change', (v) => setVisible(v > 80));

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          onClick={() => navigate('/')}
           className="fixed top-6 left-6 z-[200] flex items-center gap-2.5 px-4 py-2.5 rounded-[3px] glass border border-foreground/[0.08] hover:border-foreground/20 hover:bg-foreground/[0.06] transition-all duration-200 group"
          aria-label="Back to portfolio"
          data-testid="project-back-btn"
        >
          <ArrowLeft
            size={13}
            className="text-foreground/50 group-hover:text-foreground group-hover:-translate-x-0.5 transition-all duration-200"
          />
          <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-foreground/50 group-hover:text-foreground transition-colors duration-200">
            Back
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────
   HERO
───────────────────────────────────────── */
function ProjectHero({ project }: { project: ReturnType<typeof getProject> & {} }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const imgY = useTransform(scrollY, [0, 700], [0, 180]);
  const overlayOpacity = useTransform(scrollY, [0, 500], [0.6, 0.88]);
  const contentY = useTransform(scrollY, [0, 600], [0, 100]);
  const contentOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <section ref={ref} className="relative h-[100dvh] overflow-hidden" data-testid="project-hero">
      {/* Parallax image */}
      <motion.div className="absolute inset-0 scale-110" style={{ y: imgY }}>
        <img
          src={project.image}
          alt={project.title}
          className={`w-full h-full object-cover ${project.imagePosition}`}
        />
      </motion.div>

      {/* Layered overlays */}
      <motion.div
        className="absolute inset-0 bg-background"
        style={{ opacity: overlayOpacity }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
      <div className="absolute inset-0 grain pointer-events-none opacity-50" />

      {/* Content */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 h-full flex flex-col justify-end max-w-7xl mx-auto px-5 sm:px-6 md:px-10 pb-12 md:pb-16"
      >
        {/* Top row: index */}
        <div className="absolute top-8 right-8 font-mono text-[11px] tracking-[0.22em] uppercase text-foreground/25">
          {String(project.index).padStart(2, '0')} / {String(PROJECTS.length).padStart(2, '0')}
        </div>

        {/* Badges */}
        <motion.div
          variants={staggerContainer(0.1, 0.1)}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap items-center gap-3 mb-6"
        >
          <motion.span
            variants={fadeUp}
            className="inline-flex items-center px-3 py-1 rounded-full border border-foreground/[0.1] bg-foreground/[0.06] backdrop-blur-sm font-mono text-[10px] tracking-[0.16em] uppercase text-foreground/60"
          >
            {project.category}
          </motion.span>
          <motion.span variants={fadeUp} className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-emerald-400/70">
              {project.status}
            </span>
          </motion.span>
        </motion.div>

        {/* Giant title */}
        <div className="overflow-hidden mb-3">
          <motion.h1
            initial={{ y: '110%' }}
            animate={{ y: '0%' }}
            transition={{ duration: 1.0, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-extrabold text-foreground leading-[0.86] tracking-tight"
            style={{ fontSize: 'clamp(3rem, 8vw, 9rem)' }}
          >
            {project.title}
          </motion.h1>
        </div>

        {/* Meta row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-center gap-6 mt-4"
        >
          {[
            { label: 'Year', value: project.year },
            { label: 'Duration', value: project.duration },
            { label: 'Type', value: project.type },
          ].map((item) => (
            <div key={item.label} className="flex flex-col gap-0.5">
              <span className="font-mono text-[9px] tracking-[0.22em] uppercase text-foreground/30">
                {item.label}
              </span>
              <span className="font-mono text-[12px] text-foreground/70">{item.value}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        >
          <ChevronDown size={16} className="text-foreground/25" />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ─────────────────────────────────────────
   SECTION LABEL
───────────────────────────────────────── */
function SectionLabel({ number, text }: { number: string; text: string }) {
  return (
    <motion.div
      variants={fadeUp}
      className="flex items-center gap-3 mb-10 md:mb-14"
    >
      <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-primary/70">
        {number}
      </span>
      <motion.span
        variants={drawLine}
        className="block h-px w-12 bg-primary/40"
      />
      <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-foreground/30">
        {text}
      </span>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   OVERVIEW
───────────────────────────────────────── */
function ProjectOverview({ project }: { project: ReturnType<typeof getProject> & {} }) {
  return (
    <section className="bg-background py-16 md:py-32 border-t border-border" data-testid="project-overview">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-10">
        <motion.div
          variants={staggerContainer(0.09, 0)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          <SectionLabel number="01" text="Overview" />

          <div className="grid md:grid-cols-[2fr_3fr] gap-8 md:gap-20">
            {/* Left: heading */}
            <div>
              <div className="overflow-hidden">
                <motion.h2
                  variants={clipReveal}
                  className="font-display font-bold text-foreground leading-[0.9] tracking-tight"
                  style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)' }}
                >
                  About This
                </motion.h2>
              </div>
              <div className="overflow-hidden">
                <motion.h2
                  variants={clipReveal}
                  className="font-display font-bold text-foreground/40 leading-[0.9] tracking-tight"
                  style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)' }}
                >
                  Project
                </motion.h2>
              </div>
            </div>

            {/* Right: content */}
            <div className="flex flex-col gap-6">
              {project.overview.map((para, i) => (
                <motion.p
                  key={i}
                  variants={fadeUp}
                  className="text-[15px] md:text-base text-foreground/50 leading-relaxed font-light"
                >
                  {para}
                </motion.p>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   CHALLENGE
───────────────────────────────────────── */
function ProjectChallenge({ project }: { project: ReturnType<typeof getProject> & {} }) {
  return (
    <section className="bg-secondary py-16 md:py-32 border-t border-border" data-testid="project-challenge">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-10">
        <motion.div
          variants={staggerContainer(0.09, 0)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          <SectionLabel number="02" text="The Challenge" />

          <div className="grid md:grid-cols-[2fr_3fr] gap-8 md:gap-20">
            <div>
              <div className="overflow-hidden">
                <motion.h2
                  variants={clipReveal}
                  className="font-display font-bold text-foreground leading-[0.9] tracking-tight"
                  style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)' }}
                >
                  The
                </motion.h2>
              </div>
              <div className="overflow-hidden">
                <motion.h2
                  variants={clipReveal}
                  className="font-display font-bold text-foreground/40 leading-[0.9] tracking-tight"
                  style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)' }}
                >
                  Challenge
                </motion.h2>
              </div>
            </div>

            <div className="flex flex-col gap-8">
              <motion.p variants={fadeUp} className="text-[15px] md:text-base text-foreground/50 leading-relaxed font-light">
                {project.challenge}
              </motion.p>

              {/* Pull quote */}
              <motion.blockquote
                variants={fadeUp}
                className="relative pl-6 border-l-2 border-primary/60"
              >
                <p className="font-display font-semibold text-lg md:text-xl text-foreground/80 leading-snug italic">
                  "{project.challengeQuote}"
                </p>
                <cite className="mt-3 block font-mono text-[10px] tracking-[0.2em] uppercase text-foreground/30 not-italic">
                  — Client
                </cite>
              </motion.blockquote>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
    SOLUTION
───────────────────────────────────────── */
function ProjectSolution({ project }: { project: ReturnType<typeof getProject> & {} }) {
  return (
    <section className="bg-background py-16 md:py-32 border-t border-border" data-testid="project-solution">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-10">
        <motion.div
          variants={staggerContainer(0.09, 0)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          <SectionLabel number="03" text="The Solution" />

          <div className="grid md:grid-cols-[2fr_3fr] gap-8 md:gap-20">
            <div>
              <div className="overflow-hidden">
                <motion.h2
                  variants={clipReveal}
                  className="font-display font-bold text-foreground leading-[0.9] tracking-tight"
                  style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)' }}
                >
                  What
                </motion.h2>
              </div>
              <div className="overflow-hidden">
                <motion.h2
                  variants={clipReveal}
                  className="font-display font-bold text-foreground/40 leading-[0.9] tracking-tight"
                  style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)' }}
                >
                  We Built
                </motion.h2>
              </div>
            </div>

            <div className="flex flex-col gap-8">
              <motion.p variants={fadeUp} className="text-[15px] md:text-base text-foreground/50 leading-relaxed font-light">
                {project.solution}
              </motion.p>

              {/* Solution points */}
              <motion.ul
                variants={staggerContainer(0.08, 0)}
                className="flex flex-col gap-3"
              >
                {project.solutionPoints.map((point, i) => (
                  <motion.li
                    key={i}
                    variants={fadeUp}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2
                      size={15}
                      className="text-primary/70 mt-[2px] flex-shrink-0"
                    />
                    <span className="text-[14px] text-foreground/55 leading-relaxed font-light">
                      {point}
                    </span>
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
    RESULT
───────────────────────────────────────── */
function ProjectResult({ project }: { project: ReturnType<typeof getProject> & {} }) {
  return (
    <section className="bg-secondary py-16 md:py-32 border-t border-border" data-testid="project-result">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-10">
        <motion.div
          variants={staggerContainer(0.09, 0)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          <SectionLabel number="04" text="The Result" />

          <div className="grid md:grid-cols-[2fr_3fr] gap-8 md:gap-20">
            <div>
              <div className="overflow-hidden">
                <motion.h2
                  variants={clipReveal}
                  className="font-display font-bold text-foreground leading-[0.9] tracking-tight"
                  style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)' }}
                >
                  What
                </motion.h2>
              </div>
              <div className="overflow-hidden">
                <motion.h2
                  variants={clipReveal}
                  className="font-display font-bold text-foreground/40 leading-[0.9] tracking-tight"
                  style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)' }}
                >
                  Changed
                </motion.h2>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <motion.p variants={fadeUp} className="text-[15px] md:text-base text-foreground/50 leading-relaxed font-light">
                {project.result}
              </motion.p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   FEATURES
───────────────────────────────────────── */
function ProjectFeatures({ project }: { project: ReturnType<typeof getProject> & {} }) {
  return (
    <section
      className="bg-secondary py-16 md:py-32 border-t border-border"
      style={{
        backgroundImage: `radial-gradient(circle at 20% 50%, hsl(${project.accentHue} 80% 50% / 0.04) 0%, transparent 60%)`,
      }}
      data-testid="project-features"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <motion.div
          variants={staggerContainer(0.08, 0)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          <SectionLabel number="05" text="Key Features" />

          {/* Section heading */}
          <div className="overflow-hidden mb-14">
            <motion.h2
              variants={clipReveal}
              className="font-display font-bold tracking-tight leading-[0.9]"
              style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)' }}
            >
              <span className="text-foreground">What We </span>
              <span className="text-primary">Built</span>
              <span className="text-primary">.</span>
            </motion.h2>
          </div>

          {/* Feature grid */}
          <motion.div
            variants={staggerContainer(0.07, 0.1)}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5"
          >
            {project.features.map((feature) => (
              <motion.div
                key={feature.number}
                variants={fadeUp}
                whileHover={{ y: -3, transition: { duration: 0.25 } }}
                className="group relative flex flex-col gap-4 p-6 rounded-[4px] border border-foreground/[0.06] bg-card hover:border-foreground/[0.12] hover:bg-foreground/[0.03] transition-all duration-300"
                data-testid={`feature-${feature.number}`}
              >
                {/* Number */}
                <span
                  className="font-mono text-[11px] tracking-[0.18em] text-foreground/20 group-hover:text-primary/60 transition-colors duration-300"
                >
                  {feature.number}
                </span>

                {/* Title */}
                <h3 className="font-display font-bold text-[1.05rem] text-foreground leading-snug tracking-tight">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-[13px] text-foreground/40 leading-relaxed font-light">
                  {feature.description}
                </p>

                {/* Hover accent line */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-[1.5px] rounded-b-[4px] scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left"
                  style={{ background: `hsl(${project.accentHue} 80% 55% / 0.5)` }}
                />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
    TECHNOLOGY
───────────────────────────────────────── */
function ProjectTech({ project }: { project: ReturnType<typeof getProject> & {} }) {
  return (
    <section className="bg-background py-16 md:py-32 border-t border-border" data-testid="project-tech">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-10">
        <motion.div
          variants={staggerContainer(0.08, 0)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          <SectionLabel number="06" text="Technology" />

          <div className="grid md:grid-cols-[2fr_3fr] gap-8 md:gap-20 items-start">
            <div>
              <div className="overflow-hidden">
                <motion.h2
                  variants={clipReveal}
                  className="font-display font-bold text-foreground leading-[0.9] tracking-tight"
                  style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)' }}
                >
                  Built
                </motion.h2>
              </div>
              <div className="overflow-hidden">
                <motion.h2
                  variants={clipReveal}
                  className="font-display font-bold text-foreground/40 leading-[0.9] tracking-tight"
                  style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)' }}
                >
                  With
                </motion.h2>
              </div>
            </div>

            {/* Tech pills */}
            <motion.div
              variants={staggerContainer(0.06, 0.1)}
              className="flex flex-wrap gap-3"
            >
              {project.tech.map((t, i) => (
                <motion.span
                  key={t}
                  variants={fadeUp}
                   className="inline-flex items-center px-5 py-3 rounded-[3px] border border-foreground/[0.08] bg-foreground/[0.03] hover:bg-foreground/[0.06] hover:border-foreground/[0.15] transition-all duration-200"
                  style={{
                    transitionDelay: `${i * 30}ms`,
                  }}
                >
                  <span className="font-mono text-[12px] tracking-[0.08em] text-foreground/60 hover:text-foreground/80 transition-colors">
                    {t}
                  </span>
                </motion.span>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
    BUSINESS VALUE
───────────────────────────────────────── */
function ProjectBusinessValue({ project }: { project: ReturnType<typeof getProject> & {} }) {
  return (
    <section
      className="bg-secondary py-16 md:py-32 border-t border-border"
      style={{
        backgroundImage: `radial-gradient(circle at 80% 50%, hsl(${project.accentHue} 80% 50% / 0.04) 0%, transparent 60%)`,
      }}
      data-testid="project-business-value"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-10">
        <motion.div
          variants={staggerContainer(0.09, 0)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          <SectionLabel number="07" text="Business Value" />

          <div className="grid md:grid-cols-[2fr_3fr] gap-8 md:gap-20">
            <div>
              <div className="overflow-hidden">
                <motion.h2
                  variants={clipReveal}
                  className="font-display font-bold text-foreground leading-[0.9] tracking-tight"
                  style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)' }}
                >
                  Why It
                </motion.h2>
              </div>
              <div className="overflow-hidden">
                <motion.h2
                  variants={clipReveal}
                  className="font-display font-bold text-foreground/40 leading-[0.9] tracking-tight"
                  style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)' }}
                >
                  Matters
                </motion.h2>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <motion.p variants={fadeUp} className="text-[15px] md:text-base text-foreground/50 leading-relaxed font-light">
                {project.businessValue}
              </motion.p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   GALLERY
───────────────────────────────────────── */
function ProjectGallery({ project }: { project: ReturnType<typeof getProject> & {} }) {
  return (
    <section className="bg-secondary py-16 md:py-32 border-t border-border" data-testid="project-gallery">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-10">
        <motion.div
          variants={staggerContainer(0.09, 0)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          <SectionLabel number="08" text="Gallery" />

          {/* Full-width screenshot */}
          <motion.div
            variants={fadeUp}
            className="relative overflow-hidden rounded-[4px] border border-foreground/[0.06]"
          >
            {/* Browser chrome bar */}
            <div className="flex items-center gap-1.5 px-4 py-3 bg-card border-b border-border">
              {['bg-red-500/50', 'bg-amber-400/50', 'bg-emerald-400/50'].map((c, i) => (
                <div key={i} className={`w-2.5 h-2.5 rounded-full ${c}`} />
              ))}
              <div className="flex-1 mx-4">
                <div className="h-5 max-w-xs mx-auto rounded-full bg-foreground/[0.04] border border-foreground/[0.06] flex items-center justify-center">
                  <span className="font-mono text-[9px] text-foreground/25 tracking-[0.06em] truncate px-3">
                    {project.url}
                  </span>
                </div>
              </div>
            </div>

            <div className="relative aspect-[16/9] overflow-hidden">
              <img
                src={project.image}
                alt={`${project.title} screenshot`}
                loading="lazy"
                className={`w-full h-full object-cover ${project.imagePosition}`}
              />
              {/* Subtle bottom vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/30 via-transparent to-transparent pointer-events-none" />
            </div>
          </motion.div>

          {/* Caption */}
          <motion.p
            variants={fadeUp}
            className="mt-5 text-center font-mono text-[10px] tracking-[0.2em] uppercase text-foreground/20"
          >
            {project.title} — Live Production Build
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   CTA
───────────────────────────────────────── */
function ProjectCTA({ project }: { project: ReturnType<typeof getProject> & {} }) {
  return (
    <section className="bg-background py-16 md:py-32 border-t border-border" data-testid="project-cta">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-10">
        <motion.div
          variants={staggerContainer(0.1, 0)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="flex flex-col items-center text-center"
        >
          <motion.span
            variants={fadeUp}
            className="font-mono text-[11px] tracking-[0.28em] uppercase text-primary/70 mb-6"
          >
            See It Live
          </motion.span>

          <div className="overflow-hidden mb-10">
            <motion.h2
              variants={clipReveal}
              className="font-display font-extrabold text-foreground tracking-tight leading-[0.88]"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 6rem)' }}
            >
              Visit the Website.
            </motion.h2>
          </div>

          <motion.a
            variants={fadeUp}
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="project-visit-btn"
            className="group inline-flex items-center gap-3 bg-foreground text-background font-mono text-[12px] tracking-[0.12em] uppercase font-semibold px-10 py-5 rounded-[3px] hover:scale-[1.03] active:scale-[0.99] transition-transform duration-200 overflow-hidden relative"
          >
            <span className="relative z-10">{project.url.replace('https://', '').replace(/\/$/, '')}</span>
            <ArrowUpRight
              size={15}
              className="relative z-10 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200"
            />
            {/* Shimmer sweep */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/6 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   NEXT PROJECT TEASER
───────────────────────────────────────── */
function NextProjectTeaser({ currentId }: { currentId: string }) {
  const [, navigate] = useLocation();
  const next = getNextProject(currentId);
  const [hovered, setHovered] = useState(false);

  return (
    <section
      className="relative border-t border-border overflow-hidden cursor-pointer"
      onClick={() => navigate(`/work/${next.id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-testid="project-next"
      aria-label={`Next project: ${next.title}`}
    >
      {/* Background image with parallax */}
      <div className="absolute inset-0">
        <motion.img
          src={next.image}
          alt={next.title}
          animate={{ scale: hovered ? 1.06 : 1.02 }}
          transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
          className={`w-full h-full object-cover ${next.imagePosition}`}
        />
        <motion.div
          className="absolute inset-0 bg-background"
          animate={{ opacity: hovered ? 0.7 : 0.82 }}
          transition={{ duration: 0.4 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 md:px-10 py-16 md:py-28 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div>
          <span className="font-mono text-[10px] tracking-[0.26em] uppercase text-foreground/35 mb-3 block">
            Next Project
          </span>
          <h3
            className="font-display font-extrabold text-foreground leading-[0.9] tracking-tight"
            style={{ fontSize: 'clamp(2rem, 5vw, 5rem)' }}
          >
            {next.title}
          </h3>
          <p className="mt-3 font-mono text-[11px] tracking-[0.16em] uppercase text-foreground/35">
            {next.category}
          </p>
        </div>

        <motion.div
          animate={{
            x: hovered ? 8 : 0,
            backgroundColor: hovered ? 'hsl(0 0% 100%)' : 'transparent',
          }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0 w-16 h-16 rounded-full border border-foreground/20 flex items-center justify-center"
          style={{ color: hovered ? 'hsl(var(--background))' : 'hsl(var(--foreground))' }}
        >
          <ArrowRight size={20} />
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
export function ProjectPage() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const project = id ? getProject(id) : undefined;

  if (!project) {
    return (
      <PageShell>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <p className="font-mono text-sm text-foreground/40 mb-6">Project not found.</p>
            <button
              onClick={() => navigate('/')}
              className="font-mono text-xs tracking-widest uppercase text-primary hover:text-foreground transition-colors"
            >
              ← Back to Portfolio
            </button>
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="bg-background min-h-screen">
        <Cursor />
        <BackButton />

        <ProjectHero project={project} />
        <ProjectOverview project={project} />
        <ProjectChallenge project={project} />
        <ProjectSolution project={project} />
        <ProjectResult project={project} />
        <ProjectFeatures project={project} />
        <ProjectTech project={project} />
        <ProjectBusinessValue project={project} />
        <ProjectGallery project={project} />
        <ProjectCTA project={project} />
        <NextProjectTeaser currentId={project.id} />
      </div>
    </PageShell>
  );
}
