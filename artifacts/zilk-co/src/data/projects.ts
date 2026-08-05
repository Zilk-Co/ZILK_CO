import medicalErpImg from '@assets/project-medical-erp.png';
import coffeeShopImg from '@assets/project-coffee-shop.png';
import constructionSimpleImg from '@assets/project-construction-simple.png';
import constructionAnimatedImg from '@assets/project-construction-animated.png';
import cvPlatformImg from '@assets/project-cv-platform.png';

export interface Feature {
  number: string;
  title: string;
  description: string;
}

export interface ProjectData {
  id: string;
  index: number;
  title: string;
  category: string;
  description: string;
  year: string;
  duration: string;
  type: string;
  overview: [string, string];
  challenge: string;
  challengeQuote: string;
  solution: string;
  solutionPoints: string[];
  features: Feature[];
  tech: string[];
  status: 'Live' | 'In Development' | 'Beta';
  url: string;
  image: string;
  imagePosition: string;
  featured: boolean;
  accentHue: number;
}

export const PROJECTS: ProjectData[] = [
  {
    id: 'medical-erp',
    index: 1,
    title: 'Medical ERP System',
    category: 'Enterprise Software',
    description:
      'Full-stack ERP platform for medical inventory management, sales tracking, and real-time financial reporting.',
    year: '2024',
    duration: '3 Months',
    type: 'Enterprise Software',
    overview: [
      'A medical distribution company needed to replace their spreadsheet-based operations with a real-time digital platform. We engineered a complete ERP system that manages their entire business — from inventory to invoicing — in one unified interface.',
      'The platform serves as the company\'s operational backbone, processing hundreds of transactions daily across inventory, sales, and finance departments. Every decision in the business now happens with live data.',
    ],
    challenge:
      'The client was managing a complex medical distribution business entirely through spreadsheets. With no central data source, inventory discrepancies were common, financial reporting took days to compile, and scaling the business was structurally impossible without a fundamental rethink of how data moved through the organization.',
    challengeQuote:
      'We were running a ₦500M business on Excel. Every decision was three days behind reality.',
    solution:
      'We built a full-stack ERP platform purpose-built for medical distribution. The system unifies inventory, sales, client management, and financial reporting into a single real-time interface. Recharts-powered dashboards surface insights that previously took days to compile — now available at a glance.',
    solutionPoints: [
      'Real-time inventory visibility across all product categories and locations',
      'Automated financial reporting with P&L and cash flow dashboards',
      'Sales tracking by product, region, and client with drill-down analytics',
      'Product expiry alerts and low-stock warning thresholds',
    ],
    features: [
      {
        number: '01',
        title: 'Live Inventory',
        description: 'Real-time stock levels, movement logs, and category breakdowns — updated on every transaction.',
      },
      {
        number: '02',
        title: 'Sales Analytics',
        description: 'Revenue by product, client, and region. Trend lines, comparisons, and exportable reports.',
      },
      {
        number: '03',
        title: 'Financial Dashboard',
        description: 'P&L statements, cash flow visualization, and expense tracking in a single view.',
      },
      {
        number: '04',
        title: 'Client CRM',
        description: 'Full client history, outstanding balances, purchase patterns, and contact management.',
      },
      {
        number: '05',
        title: 'Expiry Alerts',
        description: 'Automated warnings for products approaching expiry, with batch and lot tracking.',
      },
      {
        number: '06',
        title: 'Role-Based Access',
        description: 'Granular permissions for sales, warehouse, and finance teams. JWT-secured sessions.',
      },
    ],
    tech: ['React', 'Node.js', 'Express', 'PostgreSQL', 'Recharts', 'Tailwind CSS', 'JWT'],
    status: 'Live',
    url: 'https://medical-erp-software.vercel.app/',
    image: medicalErpImg,
    imagePosition: 'object-top',
    featured: true,
    accentHue: 185,
  },

  {
    id: 'coffee-shop',
    index: 2,
    title: 'Coffee Shop Website',
    category: 'Web Design · Commerce',
    description:
      'Elegant branded storefront with online ordering, menu management, and loyalty integrations for a specialty coffee brand.',
    year: '2024',
    duration: '6 Weeks',
    type: 'Web Design & Commerce',
    overview: [
      'A specialty coffee brand needed an online presence as refined as their in-store experience. We designed and built a dark, editorial website that captures the warmth and quality of their brand while enabling direct online ordering.',
      'Every detail — from typography to motion — was chosen to communicate premium craftsmanship. The result is a website that feels like the coffee itself: rich, considered, and memorable.',
    ],
    challenge:
      'Specialty coffee brands live and die by perception. The client\'s existing website felt generic — it failed to communicate the craft, sourcing story, or personality that makes their coffee worth seeking out. They needed a digital presence that matched the experience of walking into their shop.',
    challengeQuote:
      'Our coffee is exceptional. Our website made us look like a franchise.',
    solution:
      'We created an immersive, dark-themed web experience built around the brand\'s visual identity. The design uses warm amber tones, editorial typography, and subtle animations to translate the in-store feeling into pixels. An integrated ordering system makes purchasing as frictionless as the espresso is smooth.',
    solutionPoints: [
      'Brand identity system fully translated to a web-first design language',
      'Online ordering with cart, customizations, and Stripe-powered checkout',
      'Animated menu with category filtering and rich product photography',
      'Mobile-first responsive design optimized for on-the-go ordering',
    ],
    features: [
      {
        number: '01',
        title: 'Online Ordering',
        description: 'Full cart and checkout with Stripe integration. Customizations, quantities, and order confirmation.',
      },
      {
        number: '02',
        title: 'Animated Menu',
        description: 'Category-filtered menu with smooth transitions and rich product imagery.',
      },
      {
        number: '03',
        title: 'Brand Identity',
        description: 'Typography, color palette, and motion language built to match the in-store brand experience.',
      },
      {
        number: '04',
        title: 'Mobile-First',
        description: 'Designed for the phone-first customer. Fast, touch-friendly, and optimized for conversion.',
      },
      {
        number: '05',
        title: 'Performance',
        description: 'Optimized assets, lazy loading, and edge deployment for sub-second load times.',
      },
    ],
    tech: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Stripe', 'PostgreSQL'],
    status: 'Live',
    url: 'https://ee-coffe-shop.vercel.app/',
    image: coffeeShopImg,
    imagePosition: 'object-top',
    featured: false,
    accentHue: 30,
  },

  {
    id: 'construction-simple',
    index: 3,
    title: 'Construction Co. Website',
    category: 'Web Design',
    description:
      'Professional multi-section website for a construction and engineering firm with project galleries and quote flow.',
    year: '2024',
    duration: '4 Weeks',
    type: 'Web Design',
    overview: [
      'A construction and engineering firm needed a professional website that reflected the quality of their physical work. We built a clean, authoritative digital presence with structured project galleries, service breakdowns, and a clear path to quote requests.',
      'The design language is deliberately minimal — letting their project photography carry the weight while the structure communicates reliability and expertise. Built for enterprise decision-makers who evaluate credibility in seconds.',
    ],
    challenge:
      'Construction firms are consistently let down by generic websites that look like templates. The client wanted to win enterprise contracts — but their digital presence wasn\'t competing at that level. First impressions drive decisions, and the old site wasn\'t making one.',
    challengeQuote:
      'We close 7-figure contracts but our website looked like a 2010 WordPress theme.',
    solution:
      'We delivered a professional, performance-first website with structured information architecture designed to convert enterprise visitors. Project galleries showcase completed work clearly, service pages communicate precise scope, and the quote flow is optimized to generate qualified leads.',
    solutionPoints: [
      'Structured project portfolio with filterable category galleries',
      'Service detail pages with clear scope definitions and deliverables',
      'Optimized lead capture and structured quote request flow',
      'Performance-first build scoring 95+ on Core Web Vitals',
    ],
    features: [
      {
        number: '01',
        title: 'Project Portfolio',
        description: 'Filterable gallery showcasing completed projects with photography, scope, and outcomes.',
      },
      {
        number: '02',
        title: 'Service Pages',
        description: 'Structured service breakdowns with clear deliverables designed to pre-qualify leads.',
      },
      {
        number: '03',
        title: 'Quote Flow',
        description: 'Multi-step quote request form that captures project requirements before first contact.',
      },
      {
        number: '04',
        title: 'Performance',
        description: '95+ Core Web Vitals score. Fast loads, optimized images, edge-deployed globally.',
      },
      {
        number: '05',
        title: 'SEO Foundation',
        description: 'Semantic HTML, structured data, and meta optimization for organic discovery.',
      },
      {
        number: '06',
        title: 'Mobile-Responsive',
        description: 'Fully responsive across all breakpoints. Decision-makers on mobile convert too.',
      },
    ],
    tech: ['React', 'Tailwind CSS', 'Framer Motion', 'React Hook Form', 'REST API'],
    status: 'Live',
    url: 'https://construction-protfolio-simple.vercel.app/',
    image: constructionSimpleImg,
    imagePosition: 'object-top',
    featured: false,
    accentHue: 210,
  },

  {
    id: 'construction-animated',
    index: 4,
    title: 'Animated Construction Website',
    category: 'Web Design · Motion',
    description:
      'Cinematic, animation-first portfolio with scroll-triggered transitions, parallax hero, and immersive project reveals.',
    year: '2024',
    duration: '8 Weeks',
    type: 'Web Design & Motion',
    overview: [
      'This project was a creative challenge: take a construction firm and make them feel like a luxury brand. We built a cinematic, animation-first website that uses motion as the primary design medium — transforming a commoditized industry into a premium digital experience.',
      'The result competes with agency websites from New York and London. Visitors don\'t browse it — they experience it. Every scroll, every hover, every transition was choreographed with intention.',
    ],
    challenge:
      'The construction industry is saturated with identical corporate websites. The client wanted to command attention in a competitive market where their craftsmanship was exceptional but their digital presence was invisible. The brief was unambiguous: make it feel like nothing else in the industry.',
    challengeQuote:
      'We build structures that last 100 years. Our website should feel like it too.',
    solution:
      'We built a motion-first website using GSAP and Framer Motion to create scroll-choreographed sequences, cinematic parallax heroes, and immersive project reveals. Every interaction was designed as part of a larger visual narrative — not decoration, but direction. The result is less website, more experience.',
    solutionPoints: [
      'GSAP-powered scroll choreography with precise timing control',
      'Cinematic parallax hero with full-bleed photography and text overlays',
      'Immersive project reveal sequences using clip-path animations',
      'Custom cursor and micro-interactions on every interactive element',
    ],
    features: [
      {
        number: '01',
        title: 'Scroll Choreography',
        description: 'GSAP ScrollTrigger sequences that unfold the narrative as you scroll — precise, smooth, deliberate.',
      },
      {
        number: '02',
        title: 'Cinematic Hero',
        description: 'Full-viewport parallax hero with layered photography, text reveals, and ambient motion.',
      },
      {
        number: '03',
        title: 'Project Reveals',
        description: 'Clip-path and mask animations that introduce project photography with cinematic impact.',
      },
      {
        number: '04',
        title: 'Custom Cursor',
        description: 'Context-aware cursor that transforms on hover — a signature interaction layer throughout.',
      },
      {
        number: '05',
        title: 'Page Transitions',
        description: 'Smooth full-screen wipe transitions between pages that maintain momentum.',
      },
      {
        number: '06',
        title: 'Motion System',
        description: 'A unified animation language — easing curves, durations, and timing all consistent.',
      },
    ],
    tech: ['React', 'GSAP', 'Framer Motion', 'Tailwind CSS', 'TypeScript', 'REST API'],
    status: 'Live',
    url: 'https://construction-protfolio-animated.vercel.app/',
    image: constructionAnimatedImg,
    imagePosition: 'object-top',
    featured: true,
    accentHue: 240,
  },

  {
    id: 'cv-platform',
    index: 5,
    title: 'Professional CV Platform',
    category: 'SaaS Platform',
    description:
      'A SaaS platform that turns any profile into a polished portfolio or CV — 10+ themes, 40+ export formats, and AI-assisted structuring.',
    year: '2025',
    duration: '6 Weeks',
    type: 'SaaS Platform',
    overview: [
      'A web platform built to make professional portfolios effortless. Enter your details and get a complete portfolio, or upload an existing CV and have it transformed into a modern, export-ready document — with 10+ themes and 40+ export formats to choose from.',
      'Beyond generation, the platform ships with AI integration for smarter content structuring and an HR management system that streamlines how resumes and candidates are handled. It turns the resume-building workflow into a single, automated pipeline.',
    ],
    challenge:
      'Most people struggle with resume design and formatting — and the tools that help are either bloated, generic, or charge per template. The goal was a platform where producing a stunning, recruiter-ready portfolio or CV is not a design exercise but a few minutes of data entry.',
    challengeQuote:
      'People shouldn\'t need a design degree to get a recruiter to open their resume.',
    solution:
      'We built a two-path platform: create a portfolio from scratch by entering details, or paste an existing CV and let the system rebuild it across 10+ professionally designed themes. AI integration helps structure content, while 40+ export formats cover everything from PDF to recruiter-optimized versions. A built-in HR management system closes the loop for teams hiring at scale.',
    solutionPoints: [
      'Two-path workflow — build a portfolio from details or convert an existing CV',
      '10+ professionally designed themes with one-click switching',
      '40+ CV export formats for every recruiter and ATS requirement',
      'AI-assisted content structuring and professional phrasing',
      'HR management system for resume collection and candidate tracking',
    ],
    features: [
      {
        number: '01',
        title: 'Portfolio Builder',
        description: 'Enter your details once and get a complete, polished portfolio — sections, layout, and styling handled automatically.',
      },
      {
        number: '02',
        title: 'CV Import & Rebuild',
        description: 'Paste an existing CV and the platform rebuilds it across every theme in seconds. No manual reformatting.',
      },
      {
        number: '03',
        title: '10+ Themes',
        description: 'A theme library spanning minimal, editorial, bold, and executive styles — switch with one click.',
      },
      {
        number: '04',
        title: '40+ Export Formats',
        description: 'Export to PDF, DOCX, ATS-friendly formats, and more — covering every recruiter and portal requirement.',
      },
      {
        number: '05',
        title: 'AI Integration',
        description: 'AI-assisted content structuring, professional phrasing, and role-relevant keyword suggestions.',
      },
      {
        number: '06',
        title: 'HR Management',
        description: 'Resume collection, candidate sorting, and shortlisting built in for teams hiring at scale.',
      },
    ],
    tech: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'AI Integration', 'PDF Rendering'],
    status: 'Live',
    url: 'https://cv-protfolio-hub.vercel.app/',
    image: cvPlatformImg,
    imagePosition: 'object-top',
    featured: false,
    accentHue: 260,
  },
];

/** Lookup by ID */
export function getProject(id: string): ProjectData | undefined {
  return PROJECTS.find((p) => p.id === id);
}

/** Get the next project (wraps around) */
export function getNextProject(id: string): ProjectData {
  const idx = PROJECTS.findIndex((p) => p.id === id);
  return PROJECTS[(idx + 1) % PROJECTS.length];
}
