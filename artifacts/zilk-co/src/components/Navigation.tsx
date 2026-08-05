import { useEffect, useState } from 'react';
import { motion, useMotionValueEvent, useScroll, useSpring } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useLocation } from 'wouter';

const NAV_LINKS = [
  { label: 'Work', href: '#work' },
  { label: 'Services', href: '#services' },
  { label: 'Blog', href: '/blog' },
  { label: 'Roadmap', href: '#roadmap' },
  { label: 'Contact', href: '#contact' },
];

function smoothScrollTo(href: string, navigate: (path: string) => void) {
  if (href.startsWith('/')) {
    navigate(href);
    return;
  }
  const id = href.replace('#', '');
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    // Section doesn't exist on this page (e.g. blog page) — go to home then scroll
    window.location.href = '/' + href;
  }
}

export function Navigation({ started }: { started: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const [, navigate] = useLocation();

  // Smooth spring for the progress bar
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28 });

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setScrolled(v > 0.02);
  });

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      {/* ── Scroll progress bar — very top of viewport ── */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-[60] h-[2px] bg-primary origin-left"
        style={{ scaleX: progress }}
      />

      {/* ── Navbar ── */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={started ? { y: 0, opacity: 1 } : { y: -80, opacity: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 will-change-transform ${
          scrolled
            ? 'glass border-b border-foreground/[0.07] py-4 shadow-md'
            : 'bg-transparent py-7'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between">

          {/* Logo */}
          <a
            href="/"
            className="flex items-center gap-2.5 group"
            data-testid="nav-logo"
            onClick={(e) => { e.preventDefault(); navigate('/'); }}
          >
            {/* Geometric mark */}
            <div className="relative w-7 h-7 flex-shrink-0">
              <div className="absolute inset-0 border border-primary/40 rounded-[3px] group-hover:border-primary/70 transition-colors duration-300" />
              <div className="absolute inset-[5px] bg-primary rounded-[1px] group-hover:scale-90 transition-transform duration-300" />
            </div>
            <span className="font-display font-bold text-[1.15rem] tracking-[0.06em] text-foreground">
              ZILK<span className="text-primary">.</span>CO
            </span>
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => { e.preventDefault(); smoothScrollTo(link.href, navigate); }}
                className="relative px-4 py-2 text-[12.5px] font-medium tracking-[0.02em] text-foreground/50 hover:text-foreground/90 transition-colors duration-300 group"
                data-testid={`nav-link-${link.label.toLowerCase()}`}
              >
                {link.label}
                <span className="absolute bottom-1.5 left-4 right-4 h-[1px] bg-primary/70 scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left" />
              </a>
            ))}

            {/* Divider */}
            <div className="w-px h-4 bg-foreground/10 mx-3" />

            {/* CTA */}
            <a
              href="#contact"
              onClick={(e) => { e.preventDefault(); smoothScrollTo('#contact', navigate); }}
              className="group relative flex items-center gap-2 px-5 py-2.5 overflow-hidden rounded-[3px] border border-foreground/[0.12] hover:border-primary/45 transition-all duration-350"
              style={{ boxShadow: 'inset 0 1px 0 hsl(0 0% 100% / 0.05)' }}
              data-testid="nav-cta"
            >
              <div className="absolute inset-0 bg-primary/[0.09] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative font-mono text-[10.5px] tracking-[0.14em] uppercase text-foreground/60 group-hover:text-foreground transition-colors duration-300">
                Start a Project
              </span>
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden relative z-[70] w-10 h-10 flex items-center justify-center text-foreground/70 hover:text-foreground transition-colors"
            aria-label="Toggle menu"
            data-testid="nav-mobile-toggle"
          >
            <motion.div
              animate={{ rotate: mobileOpen ? 90 : 0, opacity: mobileOpen ? 0 : 1 }}
              transition={{ duration: 0.2 }}
              className="absolute"
            >
              <Menu size={20} />
            </motion.div>
            <motion.div
              animate={{ rotate: mobileOpen ? 0 : -90, opacity: mobileOpen ? 1 : 0 }}
              transition={{ duration: 0.2 }}
              className="absolute"
            >
              <X size={20} />
            </motion.div>
          </button>
        </div>
      </motion.nav>

      {/* ── Mobile overlay menu ── */}
      <motion.div
        initial={false}
        animate={mobileOpen ? 'open' : 'closed'}
        variants={{
          open: { opacity: 1, scale: 1, pointerEvents: 'auto' as const },
          closed: { opacity: 0, scale: 0.98, pointerEvents: 'none' as const },
        }}
        transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-[60] glass flex flex-col justify-center px-10 md:hidden"
      >
        {/* Divider line */}
        <div className="absolute top-24 left-10 right-10 h-px bg-border" />

        <nav className="flex flex-col gap-6 mt-8">
          {NAV_LINKS.map((link, i) => (
            <motion.a
              key={link.label}
              href={link.href}
              onClick={(e) => { e.preventDefault(); smoothScrollTo(link.href, navigate); setMobileOpen(false); }}
              variants={{
                open: {
                  y: 0,
                  opacity: 1,
                  transition: { delay: 0.08 + i * 0.07, ease: [0.16, 1, 0.3, 1], duration: 0.5 },
                },
                closed: { y: 20, opacity: 0 },
              }}
              className="font-display font-extrabold text-foreground hover:text-primary transition-colors duration-300 tracking-tight leading-none"
              style={{ fontSize: 'clamp(2.8rem, 10vw, 4.5rem)' }}
            >
              {link.label}
            </motion.a>
          ))}
        </nav>

        <motion.div
          variants={{
            open: { y: 0, opacity: 1, transition: { delay: 0.42, duration: 0.45 } },
            closed: { y: 16, opacity: 0 },
          }}
          className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-start sm:items-center gap-6"
        >
          <a
            href="#contact"
            onClick={(e) => { e.preventDefault(); smoothScrollTo('#contact', navigate); setMobileOpen(false); }}
            className="inline-flex items-center gap-3 font-mono text-xs tracking-[0.18em] uppercase text-primary"
          >
            Start a Project →
          </a>
        </motion.div>
      </motion.div>
    </>
  );
}
