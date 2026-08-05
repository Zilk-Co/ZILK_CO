import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export function Cursor() {
  const [pos, setPos] = useState({ x: -200, y: -200 });
  const [isPointer, setIsPointer] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    // Only activate on devices with a precise pointer (mouse/trackpad)
    if (!window.matchMedia('(pointer: fine)').matches) return;
    setSupported(true);

    const onMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      const target = e.target as Element | null;
      if (target) {
        const tag = target.tagName.toLowerCase();
        const isLink = tag === 'a' || tag === 'button' || !!target.closest('a, button');
        setIsPointer(isLink);
      }
    };

    const onLeave = () => setIsHidden(true);
    const onEnter = () => setIsHidden(false);

    window.addEventListener('mousemove', onMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);
    document.documentElement.addEventListener('mouseenter', onEnter);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      document.documentElement.removeEventListener('mouseenter', onEnter);
    };
  }, []);

  if (!supported) return null;

  return (
    <>
      {/* Inner dot — instant tracking, mix-blend-difference inverts colors */}
      <motion.div
        className="fixed top-0 left-0 z-[99999] pointer-events-none"
        style={{
          x: pos.x - 4,
          y: pos.y - 4,
          opacity: isHidden ? 0 : 1,
          mixBlendMode: 'difference',
        }}
        transition={{ duration: 0 }}
      >
        <motion.div
          className="rounded-full bg-foreground"
          animate={{
            width: isPointer ? 10 : 8,
            height: isPointer ? 10 : 8,
          }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
        />
      </motion.div>

      {/* Outer ring — lagging spring follower */}
      <motion.div
        className="fixed top-0 left-0 z-[99998] pointer-events-none"
        animate={{
          x: pos.x - 22,
          y: pos.y - 22,
          opacity: isHidden ? 0 : 1,
        }}
        transition={{
          x: { type: 'spring', stiffness: 180, damping: 24, mass: 0.5 },
          y: { type: 'spring', stiffness: 180, damping: 24, mass: 0.5 },
          opacity: { duration: 0.15 },
        }}
      >
        <motion.div
          className="rounded-full border border-foreground/20"
          animate={{
            width: isPointer ? 52 : 44,
            height: isPointer ? 52 : 44,
          }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        />
      </motion.div>
    </>
  );
}
