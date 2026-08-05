import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { staggerContainer, fadeUp, clipReveal } from '@/lib/animations';
import { ServiceModal, type ServiceInfo } from './ServiceModal';

/* ─────────────────────────────────────────
   ANIMATED VISUALS — one per service
───────────────────────────────────────── */

/** 01 · Web Design — miniature page layout assembles on hover */
function WebDesignVisual({ hovered, hue }: { hovered: boolean; hue: number }) {
  const accent = `hsl(${hue} 80% 55%)`;
  const muted = `hsl(${hue} 80% 55% / 0.18)`;
  const blocks = [
    { x: 8, y: 8, w: 140, h: 10, delay: 0 },     // nav
    { x: 8, y: 28, w: 96, h: 7, delay: 0.05 },   // hero h1
    { x: 8, y: 41, w: 64, h: 5, delay: 0.1 },    // hero sub
    { x: 8, y: 56, w: 32, h: 10, delay: 0.15 },  // cta
    { x: 8, y: 78, w: 44, h: 40, delay: 0.2 },   // card 1
    { x: 60, y: 78, w: 44, h: 40, delay: 0.27 }, // card 2
    { x: 112, y: 78, w: 44, h: 40, delay: 0.34 },// card 3
  ];
  return (
    <svg viewBox="0 0 160 128" className="w-full h-full" fill="none">
      {/* Browser chrome */}
      <rect x="0" y="0" width="160" height="128" rx="4" fill={`hsl(${hue} 80% 55% / 0.04)`} />
      <rect x="0" y="0" width="160" height="16" rx="4" fill={`hsl(${hue} 80% 55% / 0.07)`} />
      {[20, 32, 44].map((cx, i) => (
        <circle key={i} cx={cx} cy={8} r={3} fill={`hsl(${hue} 80% 55% / ${i === 0 ? 0.5 : 0.2})`} />
      ))}
      {/* URL bar */}
      <rect x="60" y="4" width="90" height="8" rx="2" fill={`hsl(${hue} 80% 55% / 0.08)`} />

      {/* Content blocks */}
      {blocks.map((b, i) => (
        <motion.rect
          key={i}
          x={b.x}
          y={b.y + 16}
          width={b.w}
          height={b.h}
          rx="2"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: hovered ? 1 : 0.55, scaleX: 1 }}
          transition={{ duration: 0.4, delay: b.delay + (hovered ? 0 : 0.3), ease: [0.16, 1, 0.3, 1] }}
          fill={i === 3 ? accent : i >= 4 ? muted : `hsl(0 0% 100% / ${i === 0 ? 0.12 : 0.07})`}
          style={{ transformOrigin: `${b.x}px ${b.y + 16 + b.h / 2}px` }}
        />
      ))}

      {/* Cursor blink */}
      <motion.rect
        x={8}
        y={57}
        width={2}
        height={10}
        rx="1"
        fill={accent}
        animate={{ opacity: hovered ? [1, 0, 1] : [0.4, 0.1, 0.4] }}
        transition={{ repeat: Infinity, duration: hovered ? 0.7 : 1.8, ease: 'linear' }}
      />

      {/* Scan line on hover */}
      <motion.rect
        x={0} y={16} width={160} height={2} rx={1}
        fill={`hsl(${hue} 80% 55% / 0.3)`}
        animate={hovered ? { y: [16, 128, 16], opacity: [0.5, 0, 0.5] } : { opacity: 0 }}
        transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
      />
    </svg>
  );
}

/** 02 · Mobile App — phone frame with animated screen content */
function MobileVisual({ hovered, hue }: { hovered: boolean; hue: number }) {
  const accent = `hsl(${hue} 80% 55%)`;
  const rows = [
    { w: 100, delay: 0 },
    { w: 72, delay: 0.07 },
    { w: 88, delay: 0.14 },
    { w: 56, delay: 0.21 },
  ];
  return (
    <svg viewBox="0 0 160 128" className="w-full h-full" fill="none">
      {/* Background */}
      <rect x="0" y="0" width="160" height="128" fill={`hsl(${hue} 80% 55% / 0.03)`} />

      {/* Phone frame */}
      <rect x="44" y="4" width="72" height="120" rx="10" fill={`hsl(0 0% 100% / 0.04)`} stroke={`hsl(${hue} 80% 55% / 0.3)`} strokeWidth="1.5" />

      {/* Notch */}
      <rect x="68" y="4" width="24" height="8" rx="4" fill={`hsl(${hue} 80% 55% / 0.5)`} />

      {/* Status dots */}
      {[54, 64, 74].map((x, i) => (
        <circle key={i} cx={x + 28} cy={20} r={1.5} fill={`hsl(0 0% 100% / 0.25)`} />
      ))}

      {/* Screen header */}
      <rect x="52" y="28" width="32" height="6" rx="2" fill={`hsl(0 0% 100% / 0.12)`} />

      {/* Content rows */}
      {rows.map((r, i) => (
        <motion.rect
          key={i}
          x={52}
          y={42 + i * 14}
          width={r.w}
          height={7}
          rx="2"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1, opacity: hovered ? 1 : 0.6 }}
          transition={{ duration: 0.5, delay: r.delay + (hovered ? 0 : 0.2), ease: [0.16, 1, 0.3, 1] }}
          fill={i === 0 ? `hsl(0 0% 100% / 0.14)` : `hsl(${hue} 80% 55% / 0.15)`}
          style={{ transformOrigin: '52px 0' }}
        />
      ))}

      {/* Big action button */}
      <motion.rect
        x="54" y="98" width="52" height="14" rx="7"
        fill={accent}
        animate={{ opacity: hovered ? 1 : 0.6, scaleX: hovered ? 1.04 : 1 }}
        transition={{ duration: 0.3 }}
        style={{ transformOrigin: '80px 105px' }}
      />

      {/* Home indicator */}
      <rect x="72" y="118" width="16" height="3" rx="1.5" fill={`hsl(0 0% 100% / 0.2)`} />

      {/* Notification badge on hover */}
      <motion.g animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0 }} transition={{ type: 'spring', stiffness: 280, damping: 18 }} style={{ transformOrigin: '108px 28px' }}>
        <circle cx="108" cy="28" r="8" fill={`hsl(0 72% 55%)`} />
        <text x="108" y="32" textAnchor="middle" fill="white" fontSize="7" fontFamily="monospace">1</text>
      </motion.g>
    </svg>
  );
}

/** 03 · Enterprise — dashboard bars and numbers */
function EnterpriseVisual({ hovered, hue }: { hovered: boolean; hue: number }) {
  const accent = `hsl(${hue} 80% 55%)`;
  const bars = [
    { h: 48, label: '94%', altH: 72, altL: '98%' },
    { h: 72, label: '71%', altH: 40, altL: '82%' },
    { h: 32, label: '58%', altH: 60, altL: '67%' },
    { h: 56, label: '83%', altH: 88, altL: '91%' },
    { h: 80, label: '90%', altH: 52, altL: '88%' },
  ];
  return (
    <svg viewBox="0 0 160 128" className="w-full h-full" fill="none">
      <rect x="0" y="0" width="160" height="128" fill={`hsl(${hue} 80% 55% / 0.03)`} />

      {/* Top KPI row */}
      {[
        { label: 'Revenue', val: hovered ? '₦8.4M' : '₦7.1M', x: 8 },
        { label: 'Orders', val: hovered ? '2,341' : '1,893', x: 60 },
        { label: 'Margin', val: hovered ? '34%' : '28%', x: 112 },
      ].map((kpi, i) => (
        <g key={i}>
          <text x={kpi.x} y={14} fill={`hsl(0 0% 100% / 0.28)`} fontSize="5" fontFamily="monospace" letterSpacing="0.08em">{kpi.label}</text>
          <motion.text x={kpi.x} y={26} fill={accent} fontSize="9" fontFamily="monospace" fontWeight="bold"
            animate={{ opacity: 1 }} key={`${kpi.val}-${i}`}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >{kpi.val}</motion.text>
        </g>
      ))}

      {/* Divider */}
      <line x1="0" y1="34" x2="160" y2="34" stroke={`hsl(0 0% 100% / 0.06)`} strokeWidth="1" />

      {/* Bar chart */}
      <g transform="translate(16, 36)">
        {bars.map((bar, i) => {
          const h = hovered ? bar.altH : bar.h;
          const label = hovered ? bar.altL : bar.label;
          return (
            <g key={i} transform={`translate(${i * 24}, 0)`}>
              {/* Track */}
              <rect x={0} y={0} width={16} height={88} rx="2" fill={`hsl(0 0% 100% / 0.04)`} />
              {/* Bar */}
              <motion.rect
                x={0}
                y={88 - h}
                width={16}
                height={h}
                rx="2"
                animate={{ y: 88 - h, height: h }}
                transition={{ duration: 0.6, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                fill={i === 1 ? accent : `hsl(${hue} 80% 55% / ${0.25 + i * 0.07})`}
              />
              {/* Label */}
              <motion.text
                x={8} y={-4}
                textAnchor="middle"
                fill={`hsl(0 0% 100% / 0.35)`}
                fontSize="5"
                fontFamily="monospace"
                animate={{ opacity: 1 }}
                key={label}
              >
                {label}
              </motion.text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}

/** 04 · UI/UX — design tokens and moving cursor */
function UIUXVisual({ hovered, hue }: { hovered: boolean; hue: number }) {
  const accent = `hsl(${hue} 80% 55%)`;
  return (
    <svg viewBox="0 0 160 128" className="w-full h-full" fill="none">
      <rect x="0" y="0" width="160" height="128" fill={`hsl(${hue} 80% 55% / 0.03)`} />

      {/* Grid lines */}
      {[32, 64, 96, 128].map(x => (
        <line key={x} x1={x} y1={0} x2={x} y2={128} stroke={`hsl(0 0% 100% / 0.04)`} strokeWidth="1" />
      ))}
      {[32, 64, 96].map(y => (
        <line key={y} x1={0} y1={y} x2={160} y2={y} stroke={`hsl(0 0% 100% / 0.04)`} strokeWidth="1" />
      ))}

      {/* Color swatches */}
      {[
        { x: 12, y: 12, size: 28, fill: accent },
        { x: 48, y: 12, size: 20, fill: `hsl(${hue + 40} 60% 45% / 0.7)` },
        { x: 76, y: 12, size: 14, fill: `hsl(${hue - 30} 50% 65% / 0.5)` },
      ].map((s, i) => (
        <motion.rect key={i} x={s.x} y={s.y} width={s.size} height={s.size} rx="3"
          fill={s.fill}
          animate={{ opacity: hovered ? 1 : 0.7, scale: hovered && i === 0 ? 1.08 : 1 }}
          transition={{ duration: 0.3, delay: i * 0.04 }}
          style={{ transformOrigin: `${s.x + s.size / 2}px ${s.y + s.size / 2}px` }}
        />
      ))}

      {/* Typography specimen */}
      <text x="12" y="58" fill={`hsl(0 0% 100% / 0.55)`} fontSize="16" fontFamily="serif" fontWeight="bold" fontStyle="italic">Aa</text>
      <text x="44" y="58" fill={`hsl(0 0% 100% / 0.2)`} fontSize="10" fontFamily="monospace">Bb Cc</text>

      {/* Component frames */}
      <rect x="12" y="66" width="60" height="20" rx="3" stroke={`hsl(0 0% 100% / 0.1)`} strokeWidth="1" fill={`hsl(${hue} 80% 55% / 0.08)`} />
      <rect x="80" y="66" width="40" height="20" rx="3" stroke={accent} strokeWidth="1" strokeDasharray="3 2" fill="none" />

      {/* Button mockup */}
      <rect x="12" y="94" width="60" height="20" rx="10" fill={accent} opacity={hovered ? 1 : 0.7} />
      <text x="42" y="107" textAnchor="middle" fill="black" fontSize="6" fontFamily="monospace" fontWeight="bold">Get Started</text>

      {/* Spacing annotation */}
      <line x1="76" y1="94" x2="76" y2="114" stroke={`hsl(${hue} 80% 55% / 0.4)`} strokeWidth="0.5" />
      <line x1="160" y1="94" x2="160" y2="114" stroke={`hsl(${hue} 80% 55% / 0.4)`} strokeWidth="0.5" />
      <line x1="76" y1="104" x2="160" y2="104" stroke={`hsl(${hue} 80% 55% / 0.4)`} strokeWidth="0.5" strokeDasharray="2 2" />
      <text x="118" y="112" textAnchor="middle" fill={`hsl(${hue} 80% 55% / 0.6)`} fontSize="5" fontFamily="monospace">84px</text>

      {/* Cursor arrow */}
      <motion.g
        animate={hovered
          ? { x: [0, 30, 50, 30, 0], y: [0, -20, 10, 30, 0] }
          : { x: [0, 5, 0], y: [0, 3, 0] }
        }
        transition={{ duration: hovered ? 2.5 : 3, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '110px 55px' }}
      >
        <path d="M 110 55 L 110 72 L 114 67 L 118 75 L 120 74 L 116 66 L 122 64 Z"
          fill="white" stroke="black" strokeWidth="0.5" opacity={0.9} />
      </motion.g>
    </svg>
  );
}

/** 05 · SaaS — node graph with traveling pulses */
function SaaSVisual({ hovered, hue }: { hovered: boolean; hue: number }) {
  const accent = `hsl(${hue} 80% 55%)`;
  const nodes = [
    { cx: 80, cy: 20, r: 7 },   // central top
    { cx: 30, cy: 55, r: 5 },
    { cx: 130, cy: 55, r: 5 },
    { cx: 20, cy: 100, r: 4 },
    { cx: 80, cy: 108, r: 6 },
    { cx: 140, cy: 100, r: 4 },
    { cx: 55, cy: 78, r: 4 },
    { cx: 105, cy: 78, r: 4 },
  ];
  const edges = [
    [0, 1], [0, 2], [1, 3], [1, 6], [2, 5], [2, 7], [6, 4], [7, 4],
  ];
  return (
    <svg viewBox="0 0 160 128" className="w-full h-full" fill="none">
      <rect x="0" y="0" width="160" height="128" fill={`hsl(${hue} 80% 55% / 0.03)`} />

      {/* Edges */}
      {edges.map(([a, b], i) => {
        const na = nodes[a], nb = nodes[b];
        return (
          <g key={i}>
            <line x1={na.cx} y1={na.cy} x2={nb.cx} y2={nb.cy}
              stroke={`hsl(${hue} 80% 55% / 0.15)`} strokeWidth="1" />
            {/* Traveling pulse */}
            <motion.circle
              r={2}
              fill={accent}
              animate={{
                cx: [na.cx, nb.cx, na.cx],
                cy: [na.cy, nb.cy, na.cy],
                opacity: hovered ? [0, 1, 0] : [0, 0.5, 0],
              }}
              transition={{
                duration: hovered ? 1.0 : 2.2,
                delay: i * 0.18,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          </g>
        );
      })}

      {/* Nodes */}
      {nodes.map((n, i) => (
        <g key={i}>
          {/* Outer ring */}
          <motion.circle
            cx={n.cx} cy={n.cy} r={n.r + 4}
            stroke={accent}
            strokeWidth="0.5"
            fill="none"
            animate={{ opacity: hovered ? [0.3, 0.7, 0.3] : [0.1, 0.25, 0.1], scale: hovered ? [1, 1.15, 1] : 1 }}
            transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity }}
            style={{ transformOrigin: `${n.cx}px ${n.cy}px` }}
          />
          {/* Core */}
          <circle cx={n.cx} cy={n.cy} r={n.r}
            fill={i === 0 ? accent : `hsl(${hue} 80% 55% / 0.35)`}
            stroke={`hsl(${hue} 80% 55% / 0.4)`}
            strokeWidth="1"
          />
        </g>
      ))}

      {/* Labels on hover */}
      <motion.g animate={{ opacity: hovered ? 1 : 0 }} transition={{ duration: 0.3 }}>
        <text x="80" y="12" textAnchor="middle" fill="currentColor" className="text-foreground/40" fontSize="4.5" fontFamily="monospace">CORE</text>
        <text x="80" y="120" textAnchor="middle" fill="currentColor" className="text-foreground/40" fontSize="4.5" fontFamily="monospace">CLIENT</text>
      </motion.g>
    </svg>
  );
}

/** 06 · Motion & Animation — layered sine waves */
// WavePath must live at module level — defining it inside MotionVisual
// causes React to treat it as a new component type on every render,
// which unmounts/remounts the motion element and resets the animation.
function WavePath({
  amplitude,
  frequency,
  yOffset,
  phase,
  opacity,
  strokeWidth,
  speed,
  accent,
}: {
  amplitude: number;
  frequency: number;
  yOffset: number;
  phase: number;
  opacity: number;
  strokeWidth: number;
  speed: number;
  accent: string;
}) {
  const points = Array.from({ length: 33 }, (_, i) => {
    const x = i * 5;
    const y = yOffset + amplitude * Math.sin((i * frequency + phase) * Math.PI);
    return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
  }).join(' ');

  return (
    <motion.path
      d={points}
      stroke={accent}
      strokeWidth={strokeWidth}
      fill="none"
      opacity={opacity}
      animate={{ translateX: [0, -160] }}
      transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
    />
  );
}

function MotionVisual({ hovered, hue }: { hovered: boolean; hue: number }) {
  const accent = `hsl(${hue} 80% 55%)`;

  return (
    <svg viewBox="0 0 160 128" className="w-full h-full overflow-hidden" fill="none" style={{ overflow: 'hidden' }}>
      <defs>
        <clipPath id="wave-clip">
          <rect x="0" y="0" width="160" height="128" />
        </clipPath>
      </defs>
      <rect x="0" y="0" width="160" height="128" fill={`hsl(${hue} 80% 55% / 0.04)`} />

      <g clipPath="url(#wave-clip)">
        {/* Wave layers — repeated so the loop looks seamless */}
        {[0, 160, 320].map(offset => (
          <g key={offset} transform={`translate(${offset}, 0)`}>
            <WavePath accent={accent} amplitude={hovered ? 28 : 18} frequency={0.5} yOffset={44} phase={0} opacity={hovered ? 0.7 : 0.45} strokeWidth={2} speed={hovered ? 2.5 : 5} />
            <WavePath accent={accent} amplitude={hovered ? 20 : 12} frequency={0.7} yOffset={64} phase={1.2} opacity={hovered ? 0.5 : 0.28} strokeWidth={1.5} speed={hovered ? 3.5 : 7} />
            <WavePath accent={accent} amplitude={hovered ? 14 : 8} frequency={0.9} yOffset={84} phase={2.4} opacity={hovered ? 0.35 : 0.18} strokeWidth={1} speed={hovered ? 2.0 : 4} />
          </g>
        ))}
      </g>

      {/* Horizontal axis */}
      <line x1="0" y1="64" x2="160" y2="64" stroke={`hsl(0 0% 100% / 0.05)`} strokeWidth="1" />

      {/* "Frequency" labels */}
      <motion.g animate={{ opacity: hovered ? 1 : 0 }} transition={{ duration: 0.4 }}>
        {[0, 40, 80, 120, 160].map((x, i) => (
          <line key={i} x1={x} y1={2} x2={x} y2={8} stroke={`hsl(${hue} 80% 55% / 0.5)`} strokeWidth="1" />
        ))}
        <text x="80" y="16" textAnchor="middle" fill={`hsl(${hue} 80% 55% / 0.6)`} fontSize="4.5" fontFamily="monospace">440 Hz</text>
      </motion.g>

      {/* Amplitude callout on hover */}
      <motion.g animate={{ opacity: hovered ? 1 : 0 }} transition={{ duration: 0.35 }}>
        <line x1="6" y1="16" x2="6" y2="112" stroke={`hsl(${hue} 80% 55% / 0.3)`} strokeWidth="0.5" strokeDasharray="2 2" />
        <text x="10" y="68" fill={`hsl(${hue} 80% 55% / 0.5)`} fontSize="4.5" fontFamily="monospace">AMP</text>
      </motion.g>
    </svg>
  );
}

/* ─────────────────────────────────────────
   SERVICE DATA
───────────────────────────────────────── */
type VisualComponent = React.FC<{ hovered: boolean; hue: number }>;

interface Service {
  id: string;
  number: string;
  title: string;
  category: string;
  description: string;
  accentHue: number;
  Visual: VisualComponent;
}

const SERVICES: Service[] = [
  {
    id: 'web-design',
    number: '01',
    title: 'Web Design & Development',
    category: 'Frontend · Full-stack',
    description:
      'Pixel-perfect websites that load fast, rank well, and convert visitors into clients. From landing pages to complex multi-page applications.',
    accentHue: 185,
    Visual: WebDesignVisual,
  },
  {
    id: 'mobile-apps',
    number: '02',
    title: 'Mobile Applications',
    category: 'iOS · Android · Expo',
    description:
      'Native-quality iOS and Android applications built with React Native and Expo. Smooth, performant, and deployed to both app stores.',
    accentHue: 35,
    Visual: MobileVisual,
  },
  {
    id: 'enterprise-software',
    number: '03',
    title: 'Enterprise Software',
    category: 'ERP · Inventory · Management',
    description:
      'ERP systems, inventory platforms, and management tools built for scale. Full-stack with PostgreSQL, real-time dashboards, and role-based access.',
    accentHue: 265,
    Visual: EnterpriseVisual,
  },
  {
    id: 'ui-ux',
    number: '04',
    title: 'UI/UX Design',
    category: 'Figma · Design Systems',
    description:
      'Design systems and interfaces that are both beautiful and intuitive. From wireframes to polished Figma handoffs and interactive prototypes.',
    accentHue: 200,
    Visual: UIUXVisual,
  },
  {
    id: 'saas',
    number: '05',
    title: 'SaaS Development',
    category: 'Platforms · Dashboards',
    description:
      'Multi-tenant platforms, analytics dashboards, and subscription-based digital products — engineered for scale from day one.',
    accentHue: 150,
    Visual: SaaSVisual,
  },
  {
    id: 'motion',
    number: '06',
    title: 'Motion & Animation',
    category: 'GSAP · Framer Motion',
    description:
      'Cinematic scroll sequences, micro-interactions, and animated brand experiences. Motion as a design language, not decoration.',
    accentHue: 340,
    Visual: MotionVisual,
  },
];

/* ─────────────────────────────────────────
   SERVICE CARD
───────────────────────────────────────── */
function ServiceCard({ service, onOpen }: { service: Service; onOpen: () => void }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [spotlight, setSpotlight] = useState({ x: 0, y: 0, visible: false });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setSpotlight({ x: e.clientX - rect.left, y: e.clientY - rect.top, visible: true });
  };

  const { Visual, accentHue } = service;

  return (
    <motion.div
      ref={cardRef}
      variants={fadeUp}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setSpotlight(s => ({ ...s, visible: false })); }}
      onClick={onOpen}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
      className="group relative flex flex-col rounded-[6px] overflow-hidden border border-border bg-card cursor-pointer"
      style={{
        borderColor: hovered
          ? `hsl(${accentHue} 80% 55% / 0.3)`
          : undefined,
        boxShadow: hovered
          ? `0 0 0 1px hsl(${accentHue} 80% 55% / 0.12), 0 0 80px hsl(${accentHue} 80% 55% / 0.1), 0 24px 60px rgba(0,0,0,0.5)`
          : undefined,
        transition: 'border-color 0.35s, box-shadow 0.35s',
      }}
      data-testid={`service-card-${service.id}`}
    >
      {/* ── Cursor spotlight ── */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none rounded-[inherit] transition-opacity duration-500"
        style={{
          opacity: spotlight.visible ? 1 : 0,
          background: `radial-gradient(400px circle at ${spotlight.x}px ${spotlight.y}px, hsl(${accentHue} 80% 55% / 0.09), transparent 60%)`,
        }}
      />

      {/* ── Animated visual area ── */}
      <div
        className="relative z-[3] h-48 overflow-hidden flex-shrink-0"
        style={{
          background: `linear-gradient(135deg, hsl(${accentHue} 80% 55% / 0.06) 0%, transparent 60%)`,
        }}
      >
        {/* Bottom fade into card body */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-card z-10 pointer-events-none" />

        {/* Corner accent glow */}
        <motion.div
          className="absolute top-0 right-0 w-32 h-32 rounded-bl-full pointer-events-none"
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          style={{ background: `radial-gradient(circle at top right, hsl(${accentHue} 80% 55% / 0.15), transparent 70%)` }}
        />

        {/* The visual itself */}
        <div className="absolute inset-0 p-4">
          <Visual hovered={hovered} hue={accentHue} />
        </div>
      </div>

      {/* ── Card body ── */}
      <div className="relative z-[3] flex flex-col gap-4 p-6 flex-1">
        {/* Number + category */}
        <div className="flex items-center justify-between">
          <span
            className="font-mono text-[10px] tracking-[0.24em] uppercase"
            style={{ color: `hsl(${accentHue} 80% 55% / 0.7)` }}
          >
            {service.number}
          </span>
          <span className="font-mono text-[9px] tracking-[0.12em] uppercase text-foreground/25">
            {service.category}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-display font-bold text-foreground text-[1.1rem] leading-tight tracking-tight">
          {service.title}
        </h3>

        {/* Accent divider that draws on hover */}
        <div className="h-px bg-border overflow-hidden">
          <motion.div
            className="h-full"
            style={{ background: `hsl(${accentHue} 80% 55%)` }}
            animate={{ scaleX: hovered ? 1 : 0, transformOrigin: 'left' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>

        {/* Description */}
        <p className="text-[13px] text-foreground/40 leading-relaxed font-light flex-1">
          {service.description}
        </p>

        {/* Footer CTA */}
        <div className="flex items-center justify-between pt-1 mt-auto">
          <motion.span
            className="font-mono text-[10px] tracking-[0.16em] uppercase text-foreground/40"
            animate={{ color: hovered ? `hsl(${accentHue} 80% 55%)` : undefined }}
            transition={{ duration: 0.25 }}
          >
            Learn More
          </motion.span>
          <motion.div
            className="text-foreground/40"
            animate={{
              x: hovered ? 3 : 0,
              color: hovered ? `hsl(${accentHue} 80% 55%)` : undefined,
            }}
            transition={{ duration: 0.25 }}
          >
            <ArrowRight size={12} />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   SECTION HEADER
───────────────────────────────────────── */
function ServicesHeader() {
  return (
    <motion.div
      variants={staggerContainer(0.1, 0)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      className="mb-10 md:mb-20"
    >
      <motion.div variants={fadeUp} className="flex items-center gap-3 mb-6">
        <motion.span
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="block h-px w-8 bg-primary origin-left"
        />
        <span className="font-mono text-[11px] tracking-[0.28em] uppercase text-primary/80">
          What We Do
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
              Built For
            </motion.h2>
          </div>
          <div className="overflow-hidden">
            <motion.h2
              variants={clipReveal}
              className="font-display font-extrabold tracking-tight leading-[0.88]"
              style={{ fontSize: 'clamp(2.8rem, 5.5vw, 5.5rem)' }}
            >
              <span className="text-foreground/40">Every</span>
              <span className="text-primary"> Layer</span>
              <span className="text-primary">.</span>
            </motion.h2>
          </div>
        </div>

        <motion.p
          variants={fadeUp}
          className="text-[14.5px] text-foreground/38 max-w-sm font-light leading-[1.75]"
        >
          From the first pixel to the deepest database query — six disciplines,
          one studio. We own the full stack so nothing gets lost in translation.
          Every project also ships with AI-powered features — smart search, guided navigation,
          and personalized experiences that help your clients find exactly what they need.
        </motion.p>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────────── */
export function Services() {
  const [activeService, setActiveService] = useState<ServiceInfo | null>(null);

  return (
    <>
      <section
        id="services"
        className="relative bg-background border-t border-border py-16 md:py-32 overflow-hidden"
      >
        {/* Subtle background */}
        <div className="absolute inset-0 dot-grid opacity-25 pointer-events-none" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 80% 50% at 50% 100%, hsl(185 82% 50% / 0.04), transparent)',
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 md:px-10">
          <ServicesHeader />

          {/* 3-col grid */}
          <motion.div
            variants={staggerContainer(0.08, 0.05)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
          >
            {SERVICES.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onOpen={() => setActiveService(service as ServiceInfo)}
              />
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
        </div>
      </section>

      <ServiceModal
        service={activeService}
        onClose={() => setActiveService(null)}
      />
    </>
  );
}
