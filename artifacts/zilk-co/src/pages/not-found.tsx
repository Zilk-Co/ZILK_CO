import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { staggerContainer, fadeUp, clipReveal } from '@/lib/animations';

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background overflow-hidden relative">
      {/* Background texture */}
      <div className="absolute inset-0 dot-grid opacity-15 pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 50%, hsl(185 82% 50% / 0.04), transparent)',
        }}
      />

      <motion.div
        variants={staggerContainer(0.12, 0.05)}
        initial="hidden"
        animate="visible"
        className="relative z-10 text-center px-6"
      >
        {/* Giant 404 */}
        <div className="overflow-hidden mb-4">
          <motion.h1
            variants={clipReveal}
            className="font-display font-extrabold leading-[0.82] tracking-tight text-foreground/[0.06]"
            style={{ fontSize: 'clamp(8rem, 22vw, 18rem)' }}
          >
            404
          </motion.h1>
        </div>

        {/* Primary heading */}
        <div className="overflow-hidden mb-3">
          <motion.h2
            variants={clipReveal}
            className="font-display font-extrabold text-foreground leading-[0.9] tracking-tight"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}
          >
            Lost in the Stack<span className="text-primary">.</span>
          </motion.h2>
        </div>

        {/* Description */}
        <motion.p
          variants={fadeUp}
          className="text-[14px] text-foreground/38 max-w-sm mx-auto font-light leading-relaxed mb-10"
        >
          The page you're looking for doesn't exist or has been moved.
          Let's get you back on track.
        </motion.p>

        {/* CTA */}
        <motion.div variants={fadeUp}>
          <a
            href="/"
            className="group relative inline-flex items-center gap-3 bg-foreground text-background font-mono text-[11px] tracking-[0.12em] uppercase font-semibold px-8 py-4 rounded-[3px] overflow-hidden hover:scale-[1.02] active:scale-[0.99] transition-transform duration-200"
          >
            <ArrowLeft
              size={13}
              className="relative z-10 group-hover:-translate-x-1 transition-transform duration-200"
            />
            <span className="relative z-10">Return Home</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
          </a>
        </motion.div>

        {/* Decorative ghost */}
        <motion.div
          variants={fadeUp}
          className="mt-16 font-mono text-[10px] tracking-[0.25em] uppercase text-foreground/12"
        >
          Error 404 · Page Not Found
        </motion.div>
      </motion.div>
    </div>
  );
}
