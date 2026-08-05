import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface LoaderProps {
  onComplete: () => void;
}

// "ZILK CO." split into individual characters for staggered reveal
const CHARS = ['Z', 'I', 'L', 'K', '\u00A0', 'C', 'O', '.'];

export function Loader({ onComplete }: LoaderProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // 1.9 s of branding, then trigger exit animation
    const t = setTimeout(() => setVisible(false), 1900);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {visible && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[10000] bg-background flex flex-col items-center justify-center select-none"
          exit={{ y: '-100%' }}
          transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Wordmark — letter-by-letter clip reveal */}
          <div
            className="flex items-end"
            aria-label="Zilk Co."
          >
            {CHARS.map((char, i) => (
              <div key={i} className="overflow-hidden leading-none">
                <motion.span
                  initial={{ y: '115%' }}
                  animate={{ y: '0%' }}
                  transition={{
                    duration: 0.65,
                    delay: 0.05 + i * 0.055,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={`block font-display font-bold tracking-[0.14em] select-none ${
                    char === '.' ? 'text-primary' : 'text-foreground'
                  }`}
                  style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}
                >
                  {char}
                </motion.span>
              </div>
            ))}
          </div>

          {/* Tagline — fades in after the wordmark */}
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.75, ease: 'easeOut' }}
            className="mt-5 font-mono text-[11px] tracking-[0.3em] uppercase text-muted-foreground"
          >
            Engineering Digital Businesses
          </motion.p>

          {/* Progress bar */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-48 h-[1px] bg-border overflow-hidden">
            <motion.div
              className="h-full bg-primary origin-left"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.6, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
            />
          </div>

          {/* Bottom label */}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 1.2 }}
            className="absolute bottom-8 right-8 font-mono text-[10px] tracking-widest uppercase text-border"
          >
            © 2025
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
