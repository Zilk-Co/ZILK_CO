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
}

const TEAM: TeamMember[] = [
  {
    initials: 'MU',
    name: 'Mustafa',
    position: 'Founder',
    description:
      'Leads company direction, product vision, and technical architecture while ensuring every project meets enterprise standards.',
    expertise: ['Vision', 'Strategy', 'Software Architecture'],
    tagline: 'Building software that lasts.',
    hue: 185,
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
   TEAM CARD
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
          {/* Initials avatar */}
          <div
            className="flex-shrink-0 w-12 h-12 rounded-[5px] flex items-center justify-center"
            style={{
              background: hovered ? accentMuted : 'hsl(0 0% 100% / 0.05)',
              border: `1px solid ${hovered ? `hsl(${member.hue} 70% 58% / 0.25)` : 'hsl(0 0% 100% / 0.08)'}`,
              transition: 'background 0.35s, border-color 0.35s',
            }}
          >
            <span
              className="font-display font-bold text-[13px] tracking-wider transition-colors duration-350"
              style={{ color: hovered ? accent : 'hsl(0 0% 100% / 0.45)' }}
            >
              {member.initials}
            </span>
          </div>

          {/* Name + position */}
          <div>
            <div className="font-display font-bold text-white text-[1.05rem] leading-tight tracking-tight">
              {member.name}
            </div>
            <div
              className="font-mono text-[9px] tracking-[0.22em] uppercase mt-1 transition-colors duration-300"
              style={{ color: hovered ? accent : 'hsl(0 0% 100% / 0.3)' }}
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
        <p className="text-[13px] text-white/42 leading-[1.75] font-light flex-1">
          {member.description}
        </p>

        {/* Expertise — plain text list, not pills */}
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          {member.expertise.map((tag, i) => (
            <span key={tag} className="flex items-center gap-1.5">
              <span
                className="font-mono text-[10px] tracking-[0.14em] uppercase transition-colors duration-300"
                style={{ color: hovered ? `hsl(${member.hue} 70% 62%)` : 'hsl(0 0% 100% / 0.28)' }}
              >
                {tag}
              </span>
              {i < member.expertise.length - 1 && (
                <span className="text-white/12 text-[8px]">·</span>
              )}
            </span>
          ))}
        </div>

        {/* Hover tagline — fades in */}
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
                  className="font-display font-extrabold text-white tracking-tight leading-[0.88]"
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
                  <span className="text-white/40">Team</span>
                  <span className="text-primary">.</span>
                </motion.h2>
              </div>
            </div>

            <motion.div variants={fadeUp} className="flex flex-col gap-2 max-w-sm">
              <p className="text-[14.5px] text-white/38 font-light leading-[1.75]">
                The people behind every product. A focused team with specialized expertise.
                Direct communication. No outsourcing.
              </p>
              <p className="text-[13px] text-white/22 font-light leading-relaxed">
                Every project is designed, engineered, and delivered by people you know.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={staggerContainer(0.07, 0.05)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
        >
          {TEAM.map((member, i) => (
            <TeamCard key={member.name} member={member} index={i} />
          ))}
        </motion.div>

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
