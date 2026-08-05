import { useState } from 'react';
import { motion } from 'framer-motion';
import { Cursor } from '@/components/Cursor';
import { Loader } from '@/components/Loader';
import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { ProjectsGrid } from '@/components/ProjectsGrid';
import { Roadmap } from '@/components/Roadmap';
import { Services } from '@/components/Services';
import { Team } from '@/components/Team';
import { Contact } from '@/components/Contact';
import { useSEO, BASE_TITLE } from '@/hooks/useSEO';

/**
 * Session-aware loader: shows on the very first visit per session,
 * then skips on back-navigation from project pages.
 */
function getInitialStarted() {
  try {
    return sessionStorage.getItem('zilk-loaded') === 'true';
  } catch {
    return false;
  }
}

export function Home() {
  const [started, setStarted] = useState(getInitialStarted);

  useSEO({
    title: BASE_TITLE,
    description:
      'Zilk Co. is a premium software engineering agency that builds digital businesses — web apps, mobile apps, enterprise software, and SaaS products crafted to the highest standard.',
  });

  const handleLoaderComplete = () => {
    try {
      sessionStorage.setItem('zilk-loaded', 'true');
    } catch { /* ignore */ }
    setStarted(true);
  };

  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="grain min-h-screen bg-background"
    >
      <Cursor />
      <Loader onComplete={handleLoaderComplete} />
      <Navigation started={started} />

      {/* tabIndex={-1} lets the skip link programmatically focus this element */}
      <main id="main-content" tabIndex={-1} className="outline-none">
        <Hero started={started} />
        <ProjectsGrid />
        <Services />
        <Roadmap />
        <Team />
        <Contact />
      </main>
    </motion.div>
  );
}
