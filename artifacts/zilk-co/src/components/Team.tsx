import { useState } from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, fadeUp, clipReveal, drawLine } from '@/lib/animations';

/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */
interface TeamMember {
  initials: string;
  name: string;
  position: string;
  description: string;
  expertise: string[];
  tagline: string;
  hue: number;
  avatar?: string;
}

const FOUNDERS: TeamMember[] = [
  {
    initials: 'MU',
    name: 'Mustafa',
    position: 'Founder',
    description:
      'Leads company direction, product vision, and technical architecture while ensuring every project meets enterprise standards.',
    expertise: ['Vision', 'Strategy', 'Software Architecture'],
    tagline: 'Building software that lasts.',
    hue: 185,
    avatar: '/mustafa-founder.jpg',
  },
  {
    initials: 'AY',
    name: 'Ayaan',
    position: 'Founder',
    description:
      'Coordinates projects, manages operations, and ensures smooth collaboration between clients and the engineering team.',
    expertise: ['Operations', 'Product Management', 'Client Communication'],
    tagline: 'Every project, on time.',
    hue: 210,
  },
];

const TEAM: TeamMember[] = [
  {
    initials: 'AL',
    name: 'Ali',
    position: 'Software Engineer',
    description:
      'Builds modern web applications, APIs, databases, and scalable software systems.',
    expertise: ['Frontend', 'Backend', 'Systems'],
    tagline: 'Code that stands up to scale.',
    hue: 265,
  },
  {
    initials: 'AG',
    name: 'Agha',
    position: 'Marketing',
    description:
      'Develops marketing strategies, strengthens the brand, and manages client relationships.',
    expertise: ['Brand Strategy', 'Growth', 'Client Relations'],
    tagline: 'Stories that build trust.',
    hue: 35,
  },
  {
    initials: 'SH',
    name: 'Shehwar',
    position: 'Security Manager',
    description:
      'Focuses on application security, infrastructure reliability, and maintaining secure development standards.',
    expertise: ['Cyber Security', 'Infrastructure', 'Best Practices'],
    tagline: 'Secure by design.',
    hue: 150,
  },
  {
    initials: 'AH',
    name: 'Ahmed',
    position: 'Personal Advisor',
    description:
      'Provides strategic guidance for business decisions, long-term planning, and company growth.',
    expertise: ['Business Strategy', 'Planning', 'Consulting'],
    tagline: 'Clarity at every decision.',
    hue: 340,
  },
];

/* ─────────────────────────────────────────
   FOUNDER CARD — elevated, distinct
───────────────────────────────────────── */
function FounderCard({ member, index }: { member: TeamMember; index: number }) {
  const [hovered, setHovered] = useState(false);
  const accent = `hsl(${member.hue} 75% 58%)`;
  const accentFaint = `hsl(${member.hue} 75% 58% / 0.07)`;

  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex flex-col overflow-hidden"
      style={{
        borderRadius: '8px',
        border: `1px solid ${hovered ? `hsl(${member.hue} 75% 58% / 0.3)` : 'hsl(0 0% 100% / 0.1)'}`,
        background: hovered
          ? `hsl(${member.hue} 75% 58% / 0.05)`
          : 'hsl(0 0% 100% / 0.03)',
        transition: 'border-color 0.4s, background 0.4s',
      }}
    >
      {/* Top accent line — draws in on hover */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-[2px] origin-left"
        animate={{ scaleX: hovered ? 1 : 0, opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
      />

      {/* Subtle corner glow */}
      <motion.div
        className="absolute top-0 right-0 w-40 h-40 pointer-events-none"
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        style={{
          background: `radial-gradient(circle at top right, hsl(${member.hue} 75% 58% / 0.08), transparent 70%)`,
        }}
      />

      <div className="relative flex flex-col gap-6 p-8 md:p-10">
        {/* Top row: avatar + name + "Founder" badge */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-5">
            {/* Larger avatar */}
            <div
              className="flex-shrink-0 w-16 h-16 rounded-[6px] overflow-hidden flex items-center justify-center"
              style={{
                background: hovered ? accentFaint : 'hsl(0 0% 100% / 0.04)',
                border: `1px solid ${hovered ? `hsl(${member.hue} 75% 58% / 0.3)` : 'hsl(0 0% 100% / 0.09)'}`,
                transition: 'background 0.4s, border-color 0.4s',
              }}
            >
              {member.avatar ? (
                <img
                  src={member.avatar}
                  alt={member.name}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span
                  className="font-display font-bold text-[16px] tracking-wider"
                  style={{
                    color: hovered ? accent : 'hsl(0 0% 100% / 0.5)',
                    transition: 'color 0.3s',
                  }}
                >
                  {member.initials}
                </span>
              )}
            </div>

            {/* Name + role */}
            <div>
              <div
                className="font-display font-extrabold text-foreground leading-tight tracking-tight"
                style={{ fontSize: '1.25rem' }}
              >
                {member.name}
              </div>
              <div
                className="font-mono text-[9px] tracking-[0.24em] uppercase mt-1.5"
                style={{
                  color: hovered ? accent : 'hsl(0 0% 100% / 0.3)',
                  transition: 'color 0.3s',
                }}
              >
                {member.position}
              </div>
            </div>
          </div>

          {/* Founder chip */}
          <div
            className="flex-shrink-0 px-2.5 py-1 rounded-[3px] font-mono text-[9px] tracking-[0.2em] uppercase"
            style={{
              background: `hsl(${member.hue} 75% 58% / 0.1)`,
              border: `1px solid hsl(${member.hue} 75% 58% / 0.2)`,
              color: accent,
            }}
          >
            Founder
          </div>
        </div>

        {/* Divider */}
        <div
          className="h-px"
          style={{
            background: hovered
              ? `linear-gradient(90deg, hsl(${member.hue} 75% 58% / 0.35), transparent)`
              : 'hsl(0 0% 100% / 0.07)',
            transition: 'background 0.4s',
          }}
        />

        {/* Description */}
        <p className="text-[14px] text-foreground/45 leading-[1.8] font-light">
          {member.description}
        </p>

        {/* Expertise */}
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {member.expertise.map((tag, i) => (
            <span key={tag} className="flex items-center gap-2">
              <span
                className="font-mono text-[10px] tracking-[0.16em] uppercase"
                style={{
                  color: hovered ? `hsl(${member.hue} 75% 62%)` : 'hsl(0 0% 100% / 0.3)',
                  transition: 'color 0.3s',
                }}
              >
                {tag}
              </span>
              {i < member.expertise.length - 1 && (
                <span className="text-foreground/12 text-[8px]">·</span>
              )}
            </span>
          ))}
        </div>

        {/* Hover tagline */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 5 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="font-mono text-[9px] tracking-[0.2em] uppercase"
          style={{ color: `hsl(${member.hue} 75% 58% / 0.55)` }}
        >
          {member.tagline}
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   TEAM CARD — regular members
───────────────────────────────────────── */
function TeamCard({ member, index }: { member: TeamMember; index: number }) {
  const [hovered, setHovered] = useState(false);
  const accent = `hsl(${member.hue} 70% 58%)`;
  const accentMuted = `hsl(${member.hue} 70% 58% / 0.1)`;

  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex flex-col"
      style={{
        border: `1px solid ${hovered ? `hsl(${member.hue} 70% 58% / 0.22)` : 'hsl(0 0% 100% / 0.07)'}`,
        background: hovered ? `hsl(${member.hue} 70% 58% / 0.03)` : 'hsl(0 0% 100% / 0.015)',
        borderRadius: '6px',
        transition: 'border-color 0.35s, background 0.35s',
      }}
    >
      {/* Left accent rule — draws in on hover */}
      <motion.div
        className="absolute left-0 top-4 bottom-4 w-[2px] rounded-full origin-top"
        animate={{ scaleY: hovered ? 1 : 0, opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{ background: accent }}
      />

      <div className="flex flex-col gap-5 p-7">
        {/* Avatar + name row */}
        <div className="flex items-start gap-4">
          <div
            className="flex-shrink-0 w-12 h-12 rounded-[5px] flex items-center justify-center"
            style={{
              background: hovered ? accentMuted : 'hsl(0 0% 100% / 0.05)',
              border: `1px solid ${hovered ? `hsl(${member.hue} 70% 58% / 0.25)` : 'hsl(0 0% 100% / 0.08)'}`,
              transition: 'background 0.35s, border-color 0.35s',
            }}
          >
            <span
              className="font-display font-bold text-[13px] tracking-wider"
              style={{
                color: hovered ? accent : 'hsl(0 0% 100% / 0.45)',
                transition: 'color 0.3s',
              }}
            >
              {member.initials}
            </span>
          </div>

          <div>
            <div className="font-display font-bold text-foreground text-[1.05rem] leading-tight tracking-tight">
              {member.name}
            </div>
            <div
              className="font-mono text-[9px] tracking-[0.22em] uppercase mt-1"
              style={{
                color: hovered ? accent : 'hsl(0 0% 100% / 0.3)',
                transition: 'color 0.3s',
              }}
            >
              {member.position}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div
          className="h-px"
          style={{
            background: hovered
              ? `linear-gradient(90deg, hsl(${member.hue} 70% 58% / 0.3), transparent)`
              : 'hsl(0 0% 100% / 0.06)',
            transition: 'background 0.4s',
          }}
        />

        {/* Description */}
        <p className="text-[13px] text-foreground/42 leading-[1.75] font-light flex-1">
          {member.description}
        </p>

        {/* Expertise */}
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          {member.expertise.map((tag, i) => (
            <span key={tag} className="flex items-center gap-1.5">
              <span
                className="font-mono text-[10px] tracking-[0.14em] uppercase"
                style={{
                  color: hovered ? `hsl(${member.hue} 70% 62%)` : 'hsl(0 0% 100% / 0.28)',
                  transition: 'color 0.3s',
                }}
              >
                {tag}
              </span>
              {i < member.expertise.length - 1 && (
                <span className="text-foreground/12 text-[8px]">·</span>
              )}
            </span>
          ))}
        </div>

        {/* Hover tagline */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 4 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="font-mono text-[9px] tracking-[0.18em] uppercase"
          style={{ color: `hsl(${member.hue} 70% 58% / 0.55)` }}
        >
          {member.tagline}
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────────── */
export function Team() {
  return (
    <section
      id="team"
      className="relative bg-background border-t border-border py-24 md:py-32 overflow-hidden"
    >
      {/* Subtle grid texture */}
      <div className="absolute inset-0 dot-grid opacity-20 pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 0%, hsl(185 82% 50% / 0.03), transparent)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10">
        {/* Header */}
        <motion.div
          variants={staggerContainer(0.1, 0)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="mb-16 md:mb-20"
        >
          <motion.div variants={fadeUp} className="flex items-center gap-3 mb-6">
            <motion.span
              variants={drawLine}
              className="block h-px w-8 bg-primary origin-left"
            />
            <span className="font-mono text-[11px] tracking-[0.28em] uppercase text-primary/80">
              The People
            </span>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-end">
            <div>
              <div className="overflow-hidden">
                <motion.h2
                  variants={clipReveal}
                  className="font-display font-extrabold text-foreground tracking-tight leading-[0.88]"
                  style={{ fontSize: 'clamp(2.8rem, 5.5vw, 5.5rem)' }}
                >
                  Meet the
                </motion.h2>
              </div>
              <div className="overflow-hidden">
                <motion.h2
                  variants={clipReveal}
                  className="font-display font-extrabold tracking-tight leading-[0.88]"
                  style={{ fontSize: 'clamp(2.8rem, 5.5vw, 5.5rem)' }}
                >
                  <span className="text-foreground/40">Team</span>
                  <span className="text-primary">.</span>
                </motion.h2>
              </div>
            </div>

            <motion.div variants={fadeUp} className="flex flex-col gap-2 max-w-sm">
              <p className="text-[14.5px] text-foreground/38 font-light leading-[1.75]">
                The people behind every product. A focused team with specialized expertise.
                Direct communication. No outsourcing.
              </p>
              <p className="text-[13px] text-foreground/22 font-light leading-relaxed">
                Every project is designed, engineered, and delivered by people you know.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* ── Founders ── */}
        <div className="mb-16 md:mb-20">
          {/* Founders label */}
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3 mb-8"
          >
            <span className="font-mono text-[10px] tracking-[0.28em] uppercase text-foreground/25">
              Founders
            </span>
            <div className="flex-1 h-px bg-foreground/[0.06]" />
          </motion.div>

          <motion.div
            variants={staggerContainer(0.1, 0.05)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6"
          >
            {FOUNDERS.map((member, i) => (
              <FounderCard key={member.name} member={member} index={i} />
            ))}
          </motion.div>
        </div>

        {/* ── Team ── */}
        <div>
          {/* Team label */}
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3 mb-8"
          >
            <span className="font-mono text-[10px] tracking-[0.28em] uppercase text-foreground/25">
              Team
            </span>
            <div className="flex-1 h-px bg-foreground/[0.06]" />
          </motion.div>

          <motion.div
            variants={staggerContainer(0.07, 0.05)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6"
          >
            {TEAM.map((member, i) => (
              <TeamCard key={member.name} member={member} index={i} />
            ))}
          </motion.div>
        </div>

        {/* Footer rule */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-20 h-px bg-gradient-to-r from-transparent via-border to-transparent origin-center"
        />
      </div>
    </section>
  );
}
