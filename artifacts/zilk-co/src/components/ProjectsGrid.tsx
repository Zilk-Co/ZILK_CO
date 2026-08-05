import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, BookOpen } from 'lucide-react';
import { useLocation } from 'wouter';
import { staggerContainer, fadeUp, clipReveal } from '@/lib/animations';
import { PROJECTS as PROJECT_DATA } from '@/data/projects';

/* Derive the grid-facing shape from the shared data store */
type Project = (typeof PROJECT_DATA)[number];
const PROJECTS: Project[] = PROJECT_DATA;

/* ─────────────────────────────────────────
   STATUS BADGE
───────────────────────────────────────── */
function StatusBadge({ status }: { status: Project['status'] }) {
  const config = {
    Live: { dot: 'bg-emerald-400', text: 'text-emerald-400/80', label: 'Live' },
    Beta: { dot: 'bg-amber-400', text: 'text-amber-400/80', label: 'Beta' },
    'In Development': { dot: 'bg-sky-400', text: 'text-sky-400/80', label: 'In Dev' },
  }[status];

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-foreground/[0.07] bg-foreground/[0.04] backdrop-blur-sm">
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} animate-pulse`} />
      <span className={`font-mono text-[10px] tracking-[0.14em] uppercase ${config.text}`}>
        {config.label}
      </span>
    </span>
  );
}

/* ─────────────────────────────────────────
   CASE STUDY BUTTON — navigates to /work/:id
───────────────────────────────────────── */
function CaseStudyButton({ id }: { id: string }) {
  const [, navigate] = useLocation();
  return (
    <button
      onClick={(e) => { e.stopPropagation(); navigate(`/work/${id}`); }}
      data-testid={`case-study-${id}`}
      className="group relative inline-flex items-center gap-2 px-4 py-2.5 rounded-[3px] border border-foreground/[0.08] hover:border-primary/40 bg-foreground/[0.03] hover:bg-primary/[0.06] transition-all duration-200 overflow-hidden"
    >
      <BookOpen size={12} className="text-foreground/40 group-hover:text-primary/80 transition-colors duration-200 flex-shrink-0" />
      <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-foreground/40 group-hover:text-primary/80 transition-colors duration-200 whitespace-nowrap">
        Case Study
      </span>
    </button>
  );
}

/* ─────────────────────────────────────────
   SPOTLIGHT CARD
───────────────────────────────────────── */
function ProjectCard({ project, index }: { project: Project; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [spotlight, setSpotlight] = useState({ x: 0, y: 0, visible: false });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setSpotlight({ x: e.clientX - rect.left, y: e.clientY - rect.top, visible: true });
  };

  const handleMouseLeave = () => {
    setSpotlight((s) => ({ ...s, visible: false }));
    setHovered(false);
  };

  const imageHeight = project.featured ? 'h-64 md:h-80' : 'h-52 md:h-60';

  return (
    <motion.div
      ref={cardRef}
      variants={fadeUp}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setHovered(true)}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
      className={`
        relative group flex flex-col rounded-[6px] overflow-hidden
        border border-border bg-card cursor-pointer
        transition-[border-color,box-shadow] duration-500 shadow-md
        ${hovered
          ? 'border-foreground/[0.13]'
          : ''}
      `}
      data-testid={`project-card-${project.id}`}
    >
      {/* ── Spotlight glow layer ── */}
      <div
        className="absolute inset-0 z-[5] pointer-events-none rounded-[inherit] transition-opacity duration-500"
        style={{
          opacity: spotlight.visible ? 1 : 0,
          background: `radial-gradient(500px circle at ${spotlight.x}px ${spotlight.y}px, hsl(${project.accentHue} 80% 55% / 0.07), transparent 65%)`,
        }}
      />

      {/* ── Outer edge glow (ambient) ── */}
      <div
        className="absolute inset-0 z-[4] pointer-events-none rounded-[inherit] transition-opacity duration-700"
        style={{
          opacity: hovered ? 1 : 0,
          boxShadow: `inset 0 0 0 1px hsl(${project.accentHue} 80% 55% / 0.12)`,
        }}
      />

      {/* ── Screenshot image ── */}
      <div className={`relative ${imageHeight} flex-shrink-0 overflow-hidden bg-secondary`}>
        <motion.img
          src={project.image}
          alt={project.title}
          className={`w-full h-full object-cover ${project.imagePosition} transition-transform duration-700 ease-out ${hovered ? 'scale-[1.04]' : 'scale-100'}`}
          loading="lazy"
        />

        {/* Gradient vignette — bottom fade into card surface */}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />

        {/* Top-left: Category pill */}
        <div className="absolute top-4 left-4 z-10">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-background/80 backdrop-blur-md border border-foreground/[0.08]">
            <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-foreground/60">
              {project.category}
            </span>
          </span>
        </div>

        {/* Top-right: Status badge */}
        <div className="absolute top-4 right-4 z-10">
          <StatusBadge status={project.status} />
        </div>

        {/* Top-right corner accent — subtle diagonal */}
        <div
          className="absolute top-0 right-0 w-20 h-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at top right, hsl(${project.accentHue} 80% 55% / 0.15), transparent 70%)`,
          }}
        />
      </div>

      {/* ── Card body ── */}
      <div className="flex flex-col flex-1 p-5 md:p-6 gap-4 relative z-10">
        {/* Title */}
        <div>
          <h3 className="font-display font-bold text-lg md:text-xl text-foreground leading-tight tracking-tight group-hover:text-foreground transition-colors duration-200">
            {project.title}
          </h3>
          <p className="mt-2 text-[13px] text-foreground/45 leading-relaxed font-light">
            {project.description}
          </p>
        </div>

        {/* Tech tags */}
        <div className="flex flex-wrap gap-1.5">
          {project.tech.map((tag) => (
            <span
              key={tag}
              className="inline-flex px-2.5 py-1 rounded-[2px] bg-foreground/[0.03] border border-foreground/[0.09] font-mono text-[10px] tracking-[0.09em] text-foreground/45 hover:text-foreground/65 hover:border-foreground/[0.16] hover:bg-foreground/[0.05] transition-all duration-200"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-border to-transparent" />

        {/* CTA row */}
        <div className="flex items-center justify-between gap-3 mt-auto">
          <CaseStudyButton id={project.id} />

          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            data-testid={`view-live-${project.id}`}
            className="group/link inline-flex items-center gap-2 px-4 py-2.5 rounded-[3px] bg-foreground text-background font-mono text-[10px] tracking-[0.12em] uppercase font-semibold hover:scale-[1.03] active:scale-[0.99] transition-transform duration-150"
          >
            View Live
            <ArrowUpRight
              size={11}
              className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform duration-150"
            />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   SECTION HEADER
───────────────────────────────────────── */
function SectionHeader() {
  return (
    <motion.div
      variants={staggerContainer(0.1, 0)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      className="mb-16 md:mb-20"
    >
      {/* Eyebrow */}
      <motion.div variants={fadeUp} className="flex items-center gap-3 mb-6">
        <motion.span
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="block h-px w-8 bg-primary origin-left"
        />
        <span className="font-mono text-[11px] tracking-[0.28em] uppercase text-primary/80">
          Selected Work
        </span>
      </motion.div>

      {/* Heading */}
      <div className="overflow-hidden">
        <motion.h2
          variants={clipReveal}
          className="font-display font-extrabold tracking-tight text-foreground leading-[0.9]"
          style={{ fontSize: 'clamp(2.8rem, 5.5vw, 5.5rem)' }}
        >
          Work That
        </motion.h2>
      </div>
      <div className="overflow-hidden">
        <motion.h2
          variants={clipReveal}
          className="font-display font-extrabold tracking-tight leading-[0.9]"
          style={{ fontSize: 'clamp(2.8rem, 5.5vw, 5.5rem)' }}
        >
          <span className="text-foreground/50">Speaks</span>
          <span className="text-primary"> Itself</span>
          <span className="text-primary">.</span>
        </motion.h2>
      </div>

      {/* Sub-description */}
      <motion.p
        variants={fadeUp}
        className="mt-7 text-[14.5px] text-foreground/38 max-w-md font-light leading-[1.75]"
      >
        Four shipped products across enterprise software, web design, and motion —
        each one a proof of what we build for our clients.
      </motion.p>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   BENTO GRID
───────────────────────────────────────── */
export function ProjectsGrid() {
  return (
    <section
      id="work"
      className="relative bg-background border-t border-border py-24 md:py-32 overflow-hidden"
    >
      {/* Subtle background grid echo */}
      <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10">
        <SectionHeader />

        {/* Bento grid — 3 cols desktop, 2 tablet, 1 mobile */}
        <motion.div
          variants={staggerContainer(0.1, 0.05)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
        >
          {PROJECTS.map((project, i) => (
            <div
              key={project.id}
              className={project.featured ? 'sm:col-span-2 lg:col-span-2' : 'col-span-1'}
            >
              <ProjectCard project={project} index={i} />
            </div>
          ))}
        </motion.div>

        {/* Footer line */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-20 h-px bg-gradient-to-r from-transparent via-border to-transparent origin-center"
        />

        {/* Project count indicator */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 flex items-center justify-between text-foreground/20"
        >
          <span className="font-mono text-[11px] tracking-widest uppercase">
            {PROJECTS.length} Projects Shipped
          </span>
          <span className="font-mono text-[11px] tracking-widest uppercase">
            More Coming Soon
          </span>
        </motion.div>
      </div>
    </section>
  );
}
