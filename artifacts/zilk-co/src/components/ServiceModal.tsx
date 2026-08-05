import { useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ExternalLink } from 'lucide-react';
import { useLocation } from 'wouter';
import { PROJECTS } from '@/data/projects';

/* ─────────────────────────────────────────
   TYPES
───────────────────────────────────────── */
export interface ServiceInfo {
  id: string;
  number: string;
  title: string;
  category: string;
  description: string;
  accentHue: number;
  Visual: React.FC<{ hovered: boolean; hue: number }>;
}

interface TechItem { name: string; category: string }
interface WorkflowStep { phase: string; title: string; description: string }
interface UseCase { title: string; description: string }
interface BusinessValue { icon: string; title: string; description: string }

interface ServiceDetail {
  overview: [string, string];
  businessValue: BusinessValue[];
  technologies: TechItem[];
  workflow: WorkflowStep[];
  clientUseCases: UseCase[];
  relatedProjectIds: string[];
}

/* ─────────────────────────────────────────
   EXTENDED SERVICE DATA
───────────────────────────────────────── */
const SERVICE_DETAILS: Record<string, ServiceDetail> = {
  'web-design': {
    overview: [
      'Websites that function as your highest-performing salesperson — open 24/7, built to rank, and engineered to convert from first impression to checkout.',
      'We own the full stack: information architecture, visual design, performance engineering, and deployment. No handoffs, no gaps, no excuses.',
    ],
    businessValue: [
      { icon: '↑', title: 'Higher Conversion', description: 'Structured UX and persuasion patterns that turn visitors into leads and customers.' },
      { icon: '◎', title: 'Search Visibility', description: 'Semantic HTML, Core Web Vitals 90+, and structured data that search engines reward.' },
      { icon: '⚡', title: 'Sub-second Loads', description: 'Edge-deployed, optimized assets, and lazy loading that eliminate bounce from slow pages.' },
    ],
    technologies: [
      { name: 'React', category: 'UI' }, { name: 'TypeScript', category: 'Language' },
      { name: 'Vite', category: 'Build' }, { name: 'Tailwind CSS', category: 'Styling' },
      { name: 'Framer Motion', category: 'Animation' }, { name: 'Next.js', category: 'Framework' },
      { name: 'Stripe', category: 'Payments' }, { name: 'AI Integration', category: 'Intelligence' },
    ],
    workflow: [
      { phase: '01', title: 'Discovery', description: 'Goals, audience, competitive audit, and content inventory.' },
      { phase: '02', title: 'Architecture', description: 'Sitemap, user flows, and information hierarchy.' },
      { phase: '03', title: 'Design', description: 'High-fidelity Figma with full responsive states.' },
      { phase: '04', title: 'Build', description: 'Pixel-precise implementation with performance focus.' },
      { phase: '05', title: 'Ship', description: 'CI/CD pipeline, domain setup, and launch.' },
    ],
    clientUseCases: [
      { title: 'Business Websites', description: 'Authority-building presences for professional services, agencies, and consultancies.' },
      { title: 'Landing Pages', description: 'High-conversion single-page experiences for campaigns and product launches.' },
      { title: 'E-Commerce Stores', description: 'Full-featured online stores with cart, checkout, and inventory management.' },
      { title: 'Portfolio Sites', description: 'Curated showcases for creatives, studios, and design-led businesses.' },
    ],
    relatedProjectIds: ['coffee-shop', 'construction-simple'],
  },
  'mobile-apps': {
    overview: [
      'Native-quality iOS and Android apps built with React Native and Expo — one codebase, two stores, zero compromise on performance or feel.',
      'From gesture physics to push notifications and offline sync, we build apps that users actually keep installed.',
    ],
    businessValue: [
      { icon: '⬡', title: 'One Codebase', description: 'Ship to App Store and Google Play simultaneously without maintaining two separate codebases.' },
      { icon: '◈', title: 'Native Performance', description: 'Smooth 60fps animations and native UI components that feel indistinguishable from platform-native apps.' },
      { icon: '⟳', title: 'OTA Updates', description: 'Push critical fixes and features without waiting for app store review cycles.' },
    ],
    technologies: [
      { name: 'React Native', category: 'Core' }, { name: 'Expo', category: 'Platform' },
      { name: 'TypeScript', category: 'Language' }, { name: 'Reanimated 3', category: 'Animation' },
      { name: 'Expo Router', category: 'Navigation' }, { name: 'MMKV', category: 'Storage' },
      { name: 'RevenueCat', category: 'Payments' }, { name: 'EAS Build', category: 'Deploy' },
    ],
    workflow: [
      { phase: '01', title: 'Scoping', description: 'Platform targets, feature set, and app store requirements.' },
      { phase: '02', title: 'UX Design', description: 'Platform-specific flows adhering to iOS/Android guidelines.' },
      { phase: '03', title: 'Development', description: 'Component-first build with shared business logic.' },
      { phase: '04', title: 'Testing', description: 'Device testing, TestFlight, and internal tracks.' },
      { phase: '05', title: 'Launch', description: 'App store submission, metadata, and ASO.' },
    ],
    clientUseCases: [
      { title: 'Consumer Apps', description: 'Lifestyle, productivity, and utility apps designed for mass-market adoption.' },
      { title: 'Business Tools', description: 'Internal tools that give field teams, sales reps, and managers mobile access to core systems.' },
      { title: 'Marketplace Apps', description: 'Two-sided platforms connecting buyers and sellers with real-time features.' },
      { title: 'Subscription Products', description: 'Monetized apps with paywalls, free trials, and recurring revenue via RevenueCat.' },
    ],
    relatedProjectIds: ['medical-erp'],
  },
  'enterprise-software': {
    overview: [
      'ERP systems, inventory platforms, and management tools built to handle the complexity of real business operations — not stripped-down demos.',
      'Full-stack PostgreSQL backends, real-time dashboards, and role-based access control engineered for teams that can\'t afford downtime.',
    ],
    businessValue: [
      { icon: '⬡', title: 'Single Source of Truth', description: 'Replace disconnected spreadsheets with one unified platform where every department works from live data.' },
      { icon: '◉', title: 'Real-time Visibility', description: 'Live dashboards surface KPIs, inventory levels, and financial data at the moment decisions get made.' },
      { icon: '⛨', title: 'Access Control', description: 'Granular role-based permissions keep sensitive data in the right hands — and out of the wrong ones.' },
    ],
    technologies: [
      { name: 'React', category: 'UI' }, { name: 'Node.js', category: 'Backend' },
      { name: 'PostgreSQL', category: 'Database' }, { name: 'Express', category: 'API' },
      { name: 'Drizzle ORM', category: 'ORM' }, { name: 'Recharts', category: 'Charts' },
      { name: 'JWT', category: 'Auth' }, { name: 'Redis', category: 'Cache' },
    ],
    workflow: [
      { phase: '01', title: 'Process Audit', description: 'Map existing workflows, data flows, and pain points across departments.' },
      { phase: '02', title: 'Data Modelling', description: 'Design relational schema to represent the full business domain.' },
      { phase: '03', title: 'API Design', description: 'Contract-first REST API with typed schemas and validation.' },
      { phase: '04', title: 'Build', description: 'Parallel frontend and backend development with continuous integration.' },
      { phase: '05', title: 'Migration', description: 'Data import, staff onboarding, and phased rollout.' },
    ],
    clientUseCases: [
      { title: 'Inventory Management', description: 'Real-time stock tracking across warehouses with automatic reorder triggers and expiry alerts.' },
      { title: 'Financial Reporting', description: 'P&L, cash flow, and expense dashboards that replace manual spreadsheet compilations.' },
      { title: 'CRM Systems', description: 'Client history, purchase patterns, outstanding balances, and relationship management in one view.' },
      { title: 'Operations Platforms', description: 'Workflow automation, task assignment, and audit trails for compliance-sensitive industries.' },
    ],
    relatedProjectIds: ['medical-erp'],
  },
  'ui-ux': {
    overview: [
      'Design systems and interfaces that hold together at scale — every component, token, and interaction documented and deliberate.',
      'From discovery research through Figma handoff to interactive prototype, we design products that developers love building and users love using.',
    ],
    businessValue: [
      { icon: '⬡', title: 'Faster Development', description: 'A solid design system cuts frontend development time by 30–50% by eliminating design inconsistency and decision-making overhead.' },
      { icon: '◐', title: 'Brand Coherence', description: 'Every screen, component, and interaction reinforces the same visual identity and tone.' },
      { icon: '↑', title: 'Reduced Churn', description: 'Interfaces that are genuinely intuitive reduce support burden and increase user retention.' },
    ],
    technologies: [
      { name: 'Figma', category: 'Design' }, { name: 'Tokens Studio', category: 'Tokens' },
      { name: 'Storybook', category: 'Docs' }, { name: 'Tailwind CSS', category: 'Styling' },
      { name: 'shadcn/ui', category: 'Components' }, { name: 'Radix UI', category: 'Primitives' },
      { name: 'Lottie', category: 'Animation' }, { name: 'Zod', category: 'Validation' },
    ],
    workflow: [
      { phase: '01', title: 'Research', description: 'User interviews, competitor analysis, and journey mapping.' },
      { phase: '02', title: 'Information Architecture', description: 'Navigation structure, content hierarchy, and screen inventory.' },
      { phase: '03', title: 'Wireframes', description: 'Low-fidelity layouts iterated rapidly based on feedback.' },
      { phase: '04', title: 'Visual Design', description: 'Full Figma build with design tokens, components, and variants.' },
      { phase: '05', title: 'Handoff', description: 'Developer-ready specs, interaction docs, and prototype walkthroughs.' },
    ],
    clientUseCases: [
      { title: 'Design System Creation', description: 'Token-based component libraries that scale across products and teams without drifting.' },
      { title: 'Product Redesigns', description: 'Structured modernisation of legacy products with measurable usability improvements.' },
      { title: 'Brand Identity to Web', description: 'Translation of brand guidelines into a coherent digital design language.' },
      { title: 'Prototype-First Pitches', description: 'Clickable Figma prototypes for investor or client presentations before a line of code is written.' },
    ],
    relatedProjectIds: ['coffee-shop', 'construction-animated'],
  },
  'saas': {
    overview: [
      'Multi-tenant platforms, analytics dashboards, and subscription products engineered for growth from day one — not retrofitted after product-market fit.',
      'Authentication, billing, metered usage, feature flags, and team management all handled before your first customer signs up.',
    ],
    businessValue: [
      { icon: '⬡', title: 'Recurring Revenue', description: 'Subscription billing with Stripe, free trials, plan tiers, and upgrade/downgrade flows built in from day one.' },
      { icon: '⊞', title: 'Multi-tenancy', description: 'Isolated workspaces per organisation with shared infrastructure — every customer gets a clean slate.' },
      { icon: '◈', title: 'Analytics Built-in', description: 'Usage metrics, feature adoption, and cohort analysis surfaced directly in the product.' },
    ],
    technologies: [
      { name: 'React', category: 'UI' }, { name: 'Node.js', category: 'Backend' },
      { name: 'PostgreSQL', category: 'Database' }, { name: 'Stripe', category: 'Billing' },
      { name: 'Redis', category: 'Cache' }, { name: 'BullMQ', category: 'Queues' },
      { name: 'Clerk', category: 'Auth' }, { name: 'AI Integration', category: 'Intelligence' },
    ],
    workflow: [
      { phase: '01', title: 'Product Definition', description: 'Feature scoping, pricing model, and user persona definition.' },
      { phase: '02', title: 'Architecture', description: 'Multi-tenant schema design, API surface, and billing integration planning.' },
      { phase: '03', title: 'Core Build', description: 'Auth, billing, team management, and core product feature set.' },
      { phase: '04', title: 'Dashboard', description: 'Analytics, settings, onboarding flow, and admin panel.' },
      { phase: '05', title: 'Launch', description: 'Beta access, feedback loop, and growth instrumentation.' },
    ],
    clientUseCases: [
      { title: 'B2B Platforms', description: 'Workspace-per-company SaaS with role-based access, team invites, and organization management.' },
      { title: 'Analytics Dashboards', description: 'Data-heavy products where insights are the core value proposition.' },
      { title: 'API Products', description: 'Developer-facing platforms with usage-based billing, API keys, and documentation portals.' },
      { title: 'Internal Tools as Products', description: 'Internal operational software productised and sold to peers in the same industry.' },
    ],
    relatedProjectIds: ['medical-erp'],
  },
  'motion': {
    overview: [
      'Motion design that communicates ideas words alone can\'t — scroll sequences that guide attention, transitions that imply meaning, and micro-interactions that signal quality.',
      'We treat animation as a design language. Every easing curve, duration, and timing offset is chosen with purpose — not copied from a template.',
    ],
    businessValue: [
      { icon: '◑', title: 'Perceived Quality', description: 'Polished motion raises the perceived value of a product, justifying premium positioning and pricing.' },
      { icon: '↓', title: 'Reduced Cognitive Load', description: 'Smooth transitions help users understand state changes and navigate complex UIs without confusion.' },
      { icon: '◎', title: 'Brand Differentiation', description: 'A distinctive motion signature makes a product instantly recognisable and harder to copy.' },
    ],
    technologies: [
      { name: 'Framer Motion', category: 'React' }, { name: 'GSAP', category: 'Core' },
      { name: 'ScrollTrigger', category: 'GSAP Plugin' }, { name: 'Lottie', category: 'Vector' },
      { name: 'Three.js', category: '3D' }, { name: 'CSS Animations', category: 'Native' },
      { name: 'React Spring', category: 'Physics' }, { name: 'SVG Animation', category: 'Illustration' },
    ],
    workflow: [
      { phase: '01', title: 'Motion Audit', description: 'Inventory of existing interactions and identification of motion opportunities.' },
      { phase: '02', title: 'Storyboard', description: 'Frame-by-frame specification of key animations with timing and easing notes.' },
      { phase: '03', title: 'Prototype', description: 'Interactive motion prototype for stakeholder review before full implementation.' },
      { phase: '04', title: 'Implement', description: 'Production-quality animation code with performance profiling at 60fps.' },
      { phase: '05', title: 'Refine', description: 'Timing calibration, device testing, and reduced-motion accessibility pass.' },
    ],
    clientUseCases: [
      { title: 'Scroll-driven Experiences', description: 'Cinematic sequences where content reveals and transforms as users scroll through the narrative.' },
      { title: 'Loading & Transition States', description: 'Animated skeletons, page transitions, and micro-interactions that eliminate perceived wait time.' },
      { title: 'Brand Animations', description: 'Logo reveals, hero sequences, and animated brand moments for launches and campaigns.' },
      { title: 'Interactive Storytelling', description: 'Immersive product pages and case study presentations where motion carries the narrative.' },
    ],
    relatedProjectIds: ['construction-animated'],
  },
};

/* ─────────────────────────────────────────
   PROCESS DIAGRAM
───────────────────────────────────────── */
function ProcessDiagram({
  steps,
  accentHue,
}: {
  steps: WorkflowStep[];
  accentHue: number;
}) {
  const accent = `hsl(${accentHue} 80% 55%)`;
  const accentMuted = `hsl(${accentHue} 80% 55% / 0.15)`;

  return (
    <div className="w-full">
      {/* Mobile: vertical stack */}
      <div className="flex flex-col gap-0 md:hidden">
        {steps.map((step, i) => (
          <motion.div
            key={step.phase}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.07, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex gap-4 pb-6 relative"
          >
            {/* Vertical connector */}
            {i < steps.length - 1 && (
              <div
                className="absolute left-5 top-10 w-px h-full"
                style={{ background: `hsl(${accentHue} 80% 55% / 0.12)` }}
              />
            )}
            {/* Number bubble */}
            <div
              className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-mono text-[11px] z-10"
              style={{ background: accentMuted, border: `1px solid hsl(${accentHue} 80% 55% / 0.3)`, color: accent }}
            >
              {step.phase}
            </div>
            <div className="pt-1.5">
              <div className="font-display font-bold text-foreground text-[15px] leading-tight mb-1">{step.title}</div>
              <div className="text-[13px] text-foreground/45 leading-relaxed font-light">{step.description}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Desktop: horizontal flow */}
      <div className="hidden md:flex items-start gap-0 w-full overflow-x-auto pb-2">
        {steps.map((step, i) => (
          <motion.div
            key={step.phase}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-start flex-1 min-w-0"
          >
            <div className="flex flex-col items-center flex-1 min-w-0 px-1">
              {/* Phase bubble */}
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center font-mono text-[10px] mb-3 flex-shrink-0"
                style={{ background: accentMuted, border: `1px solid hsl(${accentHue} 80% 55% / 0.3)`, color: accent }}
              >
                {step.phase}
              </div>
              <div className="font-display font-bold text-foreground text-[13px] leading-tight mb-1.5 text-center">{step.title}</div>
              <div className="text-[12px] text-foreground/38 leading-relaxed text-center font-light">{step.description}</div>
            </div>

            {/* Arrow connector */}
            {i < steps.length - 1 && (
              <div className="flex-shrink-0 flex items-center mt-4">
                <div className="w-6 h-px" style={{ background: `hsl(${accentHue} 80% 55% / 0.2)` }} />
                <svg width="6" height="8" viewBox="0 0 6 8" fill="none">
                  <path d="M0 0L6 4L0 8" stroke={`hsl(${accentHue} 80% 55% / 0.35)`} strokeWidth="1" />
                </svg>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   RELATED PROJECT CARD (mini)
───────────────────────────────────────── */
function RelatedProjectCard({ projectId, onNavigate }: { projectId: string; onNavigate: (id: string) => void }) {
  const project = PROJECTS.find(p => p.id === projectId);
  if (!project) return null;

  return (
    <motion.button
      whileHover={{ y: -3 }}
      transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
      onClick={() => onNavigate(project.id)}
      className="group flex flex-col rounded-[5px] overflow-hidden border text-left w-full"
      style={{ borderColor: `hsl(${project.accentHue} 80% 55% / 0.15)`, background: `hsl(${project.accentHue} 80% 55% / 0.04)` }}
    >
      <div className="h-32 overflow-hidden bg-secondary relative">
        <img
          src={project.image}
          alt={project.title}
          loading="lazy"
          className="w-full h-full object-cover object-top group-hover:scale-[1.04] transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>
      <div className="p-3 flex items-center justify-between gap-2">
        <div>
          <div className="font-display font-bold text-foreground text-[13px] leading-tight">{project.title}</div>
          <div className="font-mono text-[10px] text-foreground/35 tracking-wider mt-0.5">{project.category}</div>
        </div>
        <ExternalLink size={12} className="text-foreground/25 group-hover:text-foreground/60 transition-colors flex-shrink-0" />
      </div>
    </motion.button>
  );
}

/* ─────────────────────────────────────────
   SECTION LABEL
───────────────────────────────────────── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-mono text-[10px] tracking-[0.28em] uppercase text-foreground/30 mb-5 flex items-center gap-2">
      <span className="block w-4 h-px bg-foreground/15" />
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN MODAL
───────────────────────────────────────── */
interface ServiceModalProps {
  service: ServiceInfo | null;
  onClose: () => void;
}

export function ServiceModal({ service, onClose }: ServiceModalProps) {
  const [, navigate] = useLocation();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Lock body scroll
  useEffect(() => {
    if (service) {
      document.body.style.overflow = 'hidden';
      scrollRef.current?.scrollTo(0, 0);
    }
    return () => { document.body.style.overflow = ''; };
  }, [service]);

  const detail = service ? SERVICE_DETAILS[service.id] : null;
  const accent = service ? `hsl(${service.accentHue} 80% 55%)` : '';
  const accentMuted = service ? `hsl(${service.accentHue} 80% 55% / 0.1)` : '';

  const handleContactClick = () => {
    onClose();
    setTimeout(() => {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    }, 350);
  };

  const handleProjectNavigate = (id: string) => {
    onClose();
    setTimeout(() => navigate(`/work/${id}`), 350);
  };

  return createPortal(
    <AnimatePresence>
      {service && detail && (
        <>
          {/* ── Backdrop ── */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-[9998] bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* ── Modal panel ── */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ type: 'spring', stiffness: 340, damping: 38, mass: 0.9 }}
            className="fixed z-[9999] flex flex-col overflow-hidden inset-2 sm:inset-3 md:inset-[3vh_3vw]"
            style={{
              background: 'hsl(240 9% 10%)',
              borderRadius: '14px',
              boxShadow: '0 40px 120px rgba(0,0,0,0.8), 0 0 0 1px hsl(0 0% 100% / 0.07)',
            }}
          >
            {/* Accent top line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.25, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-0 left-0 right-0 h-[2px] origin-left z-10"
              style={{ background: `linear-gradient(90deg, ${accent}, hsl(${service.accentHue} 80% 55% / 0.3))` }}
            />

            {/* ── Top bar ── */}
            <div className="flex-shrink-0 flex items-center justify-between px-4 sm:px-6 md:px-10 py-3 md:py-4 border-b border-foreground/[0.05]">
              <div className="flex items-center gap-3">
                <span
                  className="font-mono text-[10px] tracking-[0.28em] uppercase"
                  style={{ color: accent }}
                >
                  {service.number}
                </span>
                <span className="w-px h-3.5 bg-foreground/15" />
                <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-foreground/35">
                  {service.category}
                </span>
              </div>

              <button
                onClick={onClose}
                aria-label="Close"
                className="flex items-center justify-center w-9 h-9 rounded-full border border-foreground/[0.09] hover:border-foreground/25 hover:bg-foreground/[0.05] transition-all duration-200 text-foreground/50 hover:text-foreground"
              >
                <X size={15} />
              </button>
            </div>

            {/* ── Scrollable body ── */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto">
              <div className="max-w-5xl mx-auto px-5 sm:px-6 md:px-10 py-8 md:py-14">

                {/* ── HERO ── */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  className="mb-12 md:mb-16"
                >
                  <div className="grid md:grid-cols-[1fr_280px] gap-6 md:gap-16 items-start">
                    {/* Title block */}
                    <div>
                      <h2
                        className="font-display font-extrabold tracking-tight leading-[0.88] mb-5"
                        style={{ fontSize: 'clamp(2.4rem, 6vw, 5rem)' }}
                      >
                        {service.title}
                      </h2>
                      <p className="text-[15px] md:text-[16px] text-foreground/50 leading-[1.75] font-light max-w-xl">
                        {service.description}
                      </p>
                    </div>

                    {/* Animated visual */}
                    <div
                      className="w-full h-48 md:h-56 rounded-[8px] overflow-hidden flex-shrink-0"
                      style={{ background: `linear-gradient(135deg, hsl(${service.accentHue} 80% 55% / 0.08), transparent)`, border: `1px solid hsl(${service.accentHue} 80% 55% / 0.12)` }}
                    >
                      <service.Visual hovered={true} hue={service.accentHue} />
                    </div>
                  </div>
                </motion.div>

                {/* ── OVERVIEW ── */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="mb-14"
                >
                  <SectionLabel>Overview</SectionLabel>
                  <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                    {detail.overview.map((para, i) => (
                      <p key={i} className="text-[14.5px] text-foreground/55 leading-[1.8] font-light border-l-2 pl-5"
                        style={{ borderColor: `hsl(${service.accentHue} 80% 55% / 0.25)` }}>
                        {para}
                      </p>
                    ))}
                  </div>
                </motion.div>

                {/* ── BUSINESS VALUE ── */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.22, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="mb-14"
                >
                  <SectionLabel>Business Value</SectionLabel>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                    {detail.businessValue.map((v, i) => (
                      <motion.div
                        key={v.title}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.26 + i * 0.06, duration: 0.4 }}
                        className="rounded-[6px] p-5 flex flex-col gap-3"
                        style={{ background: accentMuted, border: `1px solid hsl(${service.accentHue} 80% 55% / 0.12)` }}
                      >
                        <span className="text-2xl" style={{ color: accent }}>{v.icon}</span>
                        <div>
                          <div className="font-display font-bold text-foreground text-[14px] mb-2">{v.title}</div>
                          <p className="text-[12.5px] text-foreground/45 leading-relaxed font-light">{v.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* ── PROCESS DIAGRAM ── */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.28, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="mb-14"
                >
                  <SectionLabel>Development Workflow</SectionLabel>
                  <div
                    className="rounded-[8px] p-4 md:p-8"
                    style={{ background: 'hsl(240 11% 7%)', border: '1px solid hsl(0 0% 100% / 0.05)' }}
                  >
                    <ProcessDiagram steps={detail.workflow} accentHue={service.accentHue} />
                  </div>
                </motion.div>

                {/* ── TECHNOLOGIES ── */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.31, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="mb-14"
                >
                  <SectionLabel>Technologies</SectionLabel>
                  <div className="flex flex-wrap gap-2">
                    {detail.technologies.map((tech, i) => (
                      <motion.div
                        key={tech.name}
                        initial={{ opacity: 0, scale: 0.88 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.32 + i * 0.03, duration: 0.3 }}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-[3px]"
                        style={{ background: 'hsl(0 0% 100% / 0.04)', border: '1px solid hsl(0 0% 100% / 0.08)' }}
                      >
                        <span className="font-mono text-[10px] tracking-wider text-foreground/70">{tech.name}</span>
                        <span className="font-mono text-[9px] tracking-wider px-1.5 py-0.5 rounded-[2px]"
                          style={{ color: accent, background: `hsl(${service.accentHue} 80% 55% / 0.1)` }}>
                          {tech.category}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* ── CLIENT USE CASES ── */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.34, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="mb-14"
                >
                  <SectionLabel>Typical Client Situations</SectionLabel>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    {detail.clientUseCases.map((uc, i) => (
                      <motion.div
                        key={uc.title}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.36 + i * 0.05, duration: 0.35 }}
                        className="rounded-[6px] p-5"
                        style={{ background: 'hsl(0 0% 100% / 0.03)', border: '1px solid hsl(0 0% 100% / 0.06)' }}
                      >
                        <div className="flex items-start gap-3 mb-2">
                          <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: accent }} />
                          <div className="font-display font-bold text-foreground text-[14px]">{uc.title}</div>
                        </div>
                        <p className="text-[12.5px] text-foreground/40 leading-relaxed font-light ml-4">{uc.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* ── RELATED WORK ── */}
                {detail.relatedProjectIds.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.38, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-14"
                  >
                    <SectionLabel>Related Portfolio Work</SectionLabel>
                    <div className={`grid gap-4 ${detail.relatedProjectIds.length === 1 ? 'grid-cols-1 max-w-sm' : 'grid-cols-1 sm:grid-cols-2'}`}>
                      {detail.relatedProjectIds.map((id) => (
                        <RelatedProjectCard key={id} projectId={id} onNavigate={handleProjectNavigate} />
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* ── CTA ── */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="mb-8"
                >
                  <div
                    className="rounded-[10px] p-6 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 md:gap-6"
                    style={{ background: `linear-gradient(135deg, hsl(${service.accentHue} 80% 55% / 0.1), hsl(${service.accentHue} 80% 55% / 0.04))`, border: `1px solid hsl(${service.accentHue} 80% 55% / 0.2)` }}
                  >
                    <div>
                      <div className="font-mono text-[10px] tracking-[0.22em] uppercase mb-2" style={{ color: accent }}>
                        Ready to Start?
                      </div>
                      <h3 className="font-display font-extrabold text-foreground text-[1.4rem] md:text-[1.7rem] leading-tight tracking-tight">
                        Let's build your<br />{service.title} project.
                      </h3>
                    </div>
                    <button
                      onClick={handleContactClick}
                      className="group flex-shrink-0 inline-flex items-center gap-3 px-7 py-4 rounded-[5px] font-mono text-[11px] tracking-[0.16em] uppercase font-semibold transition-all duration-200 hover:scale-[1.03] active:scale-[0.99]"
                      style={{ background: accent, color: 'hsl(240 11% 5%)' }}
                    >
                      Start a Conversation
                      <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform duration-200" />
                    </button>
                  </div>
                </motion.div>

              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
