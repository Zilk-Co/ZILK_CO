import { useState, useRef, useEffect, useCallback, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, Loader2, MapPin, Mail, Clock, Globe, Phone } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { staggerContainer, fadeUp, clipReveal, drawLine } from '@/lib/animations';

/* ─────────────────────────────────────────
   EMAILJS CONFIG — Replace with your values
   Get these from: https://www.emailjs.com/
   ───────────────────────────────────────── */
const EMAILJS_SERVICE_ID  = 'service_xpxi6mj';
const EMAILJS_TEMPLATE_ID = 'template_akfran7';
const EMAILJS_PUBLIC_KEY  = 'OOamvlmb4fHu8-GeK';

/* ─────────────────────────────────────────
   SECURITY: Input length limits
   ───────────────────────────────────────── */
const MAX_NAME = 100;
const MAX_EMAIL = 254;
const MAX_MESSAGE = 2000;
const COOLDOWN_MS = 60_000;

/** Strip HTML tags to prevent injection */
function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, '').trim();
}

/* ─────────────────────────────────────────
   TYPES
───────────────────────────────────────── */
type SubmitState = 'idle' | 'loading' | 'success' | 'error';

interface FormState {
  name: string;
  email: string;
  projectType: string;
  budget: string;
  timeline: string;
  country: string;
  message: string;
}

/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */
const PROJECT_TYPES = [
  { value: 'web', label: 'Web Design' },
  { value: 'mobile', label: 'Mobile App' },
  { value: 'erp', label: 'Enterprise ERP' },
  { value: 'uiux', label: 'UI / UX Design' },
  { value: 'saas', label: 'SaaS Platform' },
  { value: 'motion', label: 'Motion & Brand' },
];

const BUDGETS = [
  { value: 'starter', label: 'Starter', sub: '$100 – $200' },
  { value: 'growth', label: 'Growth', sub: '$500 – $600' },
  { value: 'scale', label: 'Scale', sub: '$2K – $5K' },
  { value: 'enterprise', label: 'Enterprise', sub: '$10K – $20K' },
];

const TIMELINES = [
  { value: 'sprint', label: 'Sprint', sub: '1 – 2 Months' },
  { value: 'standard', label: 'Standard', sub: '3 – 6 Months' },
  { value: 'extended', label: 'Extended', sub: '6 – 12 Months' },
  { value: 'partnership', label: 'Partnership', sub: 'Ongoing' },
];

const COUNTRIES = [
  'Nigeria', 'United States', 'United Kingdom', 'Canada', 'Australia',
  'Germany', 'France', 'Netherlands', 'Sweden', 'Norway',
  'United Arab Emirates', 'Saudi Arabia', 'Qatar', 'Kenya', 'Ghana',
  'South Africa', 'India', 'Pakistan', 'Singapore', 'New Zealand', 'Brazil',
  'Mexico', 'Spain', 'Italy', 'Switzerland', 'Japan',
];

/* ─────────────────────────────────────────
   PILL SELECTOR
───────────────────────────────────────── */
function PillSelector({
  options,
  value,
  onChange,
  cols = 2,
}: {
  options: { value: string; label: string; sub?: string }[];
  value: string;
  onChange: (v: string) => void;
  cols?: number;
}) {
  return (
    <div
      className={`grid gap-2 ${
        cols === 4
          ? 'grid-cols-2 sm:grid-cols-4'
          : cols === 3
          ? 'grid-cols-2 sm:grid-cols-3'
          : 'grid-cols-2'
      }`}
    >
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <motion.button
            key={opt.value}
            type="button"
            onClick={() => onChange(active ? '' : opt.value)}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="relative flex flex-col items-start gap-0.5 px-4 py-3 rounded-[4px] border text-left overflow-hidden transition-all duration-300"
            style={{
              borderColor: active
                ? 'hsl(185 82% 50% / 0.45)'
                : 'hsl(0 0% 100% / 0.07)',
              background: active
                ? 'hsl(185 82% 50% / 0.07)'
                : 'hsl(0 0% 100% / 0.02)',
              boxShadow: active
                ? '0 0 0 1px hsl(185 82% 50% / 0.15), 0 0 24px hsl(185 82% 50% / 0.07)'
                : 'none',
            }}
          >
            {/* Active corner mark */}
            <AnimatePresence>
              {active && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-2 right-2 w-4 h-4 rounded-full bg-primary flex items-center justify-center"
                >
                  <Check size={9} className="text-black" strokeWidth={3} />
                </motion.div>
              )}
            </AnimatePresence>

            <span
              className="font-display font-bold text-[13px] tracking-tight transition-colors duration-200"
              style={{ color: active ? 'hsl(185 82% 55%)' : 'hsl(0 0% 100% / 0.75)' }}
            >
              {opt.label}
            </span>
            {opt.sub && (
              <span
                className="font-mono text-[9px] tracking-[0.1em] uppercase transition-colors duration-200"
                style={{ color: active ? 'hsl(185 82% 55% / 0.6)' : 'hsl(0 0% 100% / 0.22)' }}
              >
                {opt.sub}
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────
   FORM INPUT
───────────────────────────────────────── */
function FormInput({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  required,
  maxLength,
}: {
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  maxLength?: number;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <label className="font-mono text-[10px] tracking-[0.2em] uppercase text-foreground/40">
        {label}
        {required && <span className="text-primary ml-1">*</span>}
      </label>
      <div className="relative">
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          required={required}
          maxLength={maxLength}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full bg-foreground/[0.03] border rounded-[4px] px-4 py-3 text-[14px] text-foreground/85 placeholder:text-foreground/20 outline-none transition-all duration-300 font-sans"
          style={{
            borderColor: focused
              ? 'hsl(185 82% 50% / 0.5)'
              : 'hsl(0 0% 100% / 0.08)',
            boxShadow: focused
              ? '0 0 0 3px hsl(185 82% 50% / 0.08), inset 0 1px 0 hsl(0 0% 100% / 0.04)'
              : 'inset 0 1px 0 hsl(0 0% 100% / 0.03)',
            background: focused ? 'hsl(0 0% 100% / 0.04)' : 'hsl(0 0% 100% / 0.02)',
          }}
        />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   COUNTRY SELECT — searchable combobox
───────────────────────────────────────── */
function CountrySelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listboxId = 'country-listbox';

  const filtered = query.trim()
    ? COUNTRIES.filter((c) => c.toLowerCase().includes(query.toLowerCase()))
    : COUNTRIES;

  // Close on outside click
  const handleOutside = useCallback((e: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
      setOpen(false);
      setQuery('');
      setActiveIdx(-1);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [handleOutside]);

  // Scroll active option into view
  useEffect(() => {
    if (activeIdx >= 0 && listRef.current) {
      const el = listRef.current.children[activeIdx] as HTMLElement;
      el?.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIdx]);

  const selectOption = (country: string) => {
    onChange(country);
    setOpen(false);
    setQuery('');
    setActiveIdx(-1);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setOpen(true);
        setActiveIdx(0);
      }
      return;
    }
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIdx((i) => Math.min(i + 1, filtered.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIdx((i) => Math.max(i - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (activeIdx >= 0 && filtered[activeIdx]) selectOption(filtered[activeIdx]);
        break;
      case 'Escape':
        setOpen(false);
        setQuery('');
        setActiveIdx(-1);
        break;
      case 'Tab':
        setOpen(false);
        setQuery('');
        setActiveIdx(-1);
        break;
    }
  };

  const inputFocused = open;
  const displayValue = open ? query : value;
  const optionId = (i: number) => `country-option-${i}`;

  return (
    <div className="flex flex-col gap-2" ref={containerRef}>
      <label
        htmlFor="country-input"
        className="font-mono text-[10px] tracking-[0.2em] uppercase text-foreground/40"
      >
        Country
      </label>

      <div className="relative">
        {/* Combobox input */}
        <input
          id="country-input"
          ref={inputRef}
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          aria-controls={listboxId}
          aria-activedescendant={activeIdx >= 0 ? optionId(activeIdx) : undefined}
          autoComplete="off"
          spellCheck={false}
          placeholder={value ? value : 'Select your country'}
          value={displayValue}
          onChange={(e) => {
            setQuery(e.target.value);
            setActiveIdx(0);
            if (!open) setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          className="w-full bg-foreground/[0.02] border rounded-[4px] px-4 py-3 text-[14px] outline-none transition-all duration-300 font-sans pr-10 cursor-pointer"
          style={{
            borderColor: inputFocused
              ? 'hsl(185 82% 50% / 0.5)'
              : 'hsl(0 0% 100% / 0.08)',
            boxShadow: inputFocused
              ? '0 0 0 3px hsl(185 82% 50% / 0.08)'
              : 'none',
            color: value && !open
              ? 'hsl(0 0% 100% / 0.85)'
              : open
              ? 'hsl(0 0% 100% / 0.85)'
              : 'hsl(0 0% 100% / 0.2)',
            background: inputFocused ? 'hsl(0 0% 100% / 0.04)' : 'hsl(0 0% 100% / 0.02)',
          }}
        />

        {/* Chevron toggle */}
        <button
          type="button"
          tabIndex={-1}
          aria-hidden="true"
          onClick={() => {
            if (open) {
              setOpen(false);
              setQuery('');
              setActiveIdx(-1);
            } else {
              setOpen(true);
              inputRef.current?.focus();
            }
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 pointer-events-auto"
        >
          <svg
            width="10" height="6" viewBox="0 0 10 6" fill="none"
            style={{
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s',
            }}
          >
            <path d="M1 1L5 5L9 1" stroke="hsl(0 0% 100% / 0.3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Dropdown */}
        <AnimatePresence>
          {open && (
            <motion.ul
              key="dropdown"
              ref={listRef}
              id={listboxId}
              role="listbox"
              aria-label="Countries"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="absolute z-50 left-0 right-0 mt-1.5 rounded-[4px] border border-border overflow-y-auto bg-popover shadow-lg"
              style={{
                maxHeight: '13rem',
              }}
            >
              {filtered.length === 0 ? (
                <li className="px-4 py-3 text-[13px] text-foreground/30 font-sans select-none">
                  No results for "{query}"
                </li>
              ) : (
                filtered.map((country, i) => {
                  const isActive = i === activeIdx;
                  const isSelected = country === value;
                  return (
                    <li
                      key={country}
                      id={optionId(i)}
                      role="option"
                      aria-selected={isSelected}
                      onMouseDown={(e) => { e.preventDefault(); selectOption(country); }}
                      onMouseEnter={() => setActiveIdx(i)}
                      className="px-4 py-2.5 text-[13px] font-sans cursor-pointer flex items-center justify-between transition-colors duration-100"
                      style={{
                        background: isActive
                          ? 'hsl(185 82% 50% / 0.1)'
                          : isSelected
                          ? 'hsl(185 82% 50% / 0.05)'
                          : 'transparent',
                        color: isSelected
                          ? 'hsl(185 82% 55%)'
                          : isActive
                          ? 'hsl(0 0% 100% / 0.9)'
                          : 'hsl(0 0% 100% / 0.6)',
                      }}
                    >
                      {country}
                      {isSelected && (
                        <Check size={12} className="flex-shrink-0" style={{ color: 'hsl(185 82% 55%)' }} />
                      )}
                    </li>
                  );
                })
              )}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   SUBMIT BUTTON
───────────────────────────────────────── */
function SubmitButton({ state }: { state: SubmitState }) {
  return (
    <motion.button
      type="submit"
      disabled={state !== 'idle'}
      whileHover={state === 'idle' ? { scale: 1.01 } : {}}
      whileTap={state === 'idle' ? { scale: 0.98 } : {}}
      transition={{ duration: 0.2 }}
      className="group relative w-full h-14 rounded-[4px] overflow-hidden font-display font-bold text-[14px] tracking-wide disabled:cursor-not-allowed"
      style={{
        background:
          state === 'success'
            ? 'hsl(150 70% 40%)'
            : state === 'error'
            ? 'hsl(0 72% 56%)'
            : 'hsl(185 82% 50%)',
        boxShadow:
          state === 'idle'
            ? '0 0 0 1px hsl(185 82% 50% / 0.3), 0 8px 32px hsl(185 82% 50% / 0.2)'
            : 'none',
        transition: 'background 0.4s, box-shadow 0.3s',
      }}
    >
      {/* Hover shimmer overlay */}
      <span
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: 'linear-gradient(105deg, transparent 30%, hsl(0 0% 100% / 0.12) 50%, transparent 70%)',
        }}
      />

      <AnimatePresence mode="wait">
        {state === 'idle' && (
          <motion.span
            key="idle"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="relative flex items-center justify-center gap-3 text-black"
          >
            Send Message
            <motion.span
              className="flex items-center"
              animate={{ x: 0 }}
              whileHover={{ x: 4 }}
              transition={{ duration: 0.2 }}
            >
              <ArrowRight size={16} strokeWidth={2.5} />
            </motion.span>
          </motion.span>
        )}

        {state === 'loading' && (
          <motion.span
            key="loading"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="relative flex items-center justify-center gap-2.5 text-black/80"
          >
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
              className="flex"
            >
              <Loader2 size={16} />
            </motion.span>
            Sending…
          </motion.span>
        )}

        {state === 'success' && (
          <motion.span
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="relative flex items-center justify-center gap-2.5 text-foreground"
          >
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.1 }}
            >
              <Check size={17} strokeWidth={2.5} />
            </motion.span>
            Message Received
          </motion.span>
        )}

        {state === 'error' && (
          <motion.span
            key="error"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="relative flex items-center justify-center gap-2.5 text-foreground"
          >
            Failed — Try Again
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

/* ─────────────────────────────────────────
   LEFT COLUMN
───────────────────────────────────────── */
function ContactLeft() {
  return (
    <motion.div
      variants={staggerContainer(0.1, 0)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      className="flex flex-col gap-10 relative"
    >
      {/* Section label */}
      <motion.div variants={fadeUp} className="flex items-center gap-3">
        <motion.span variants={drawLine} className="block h-px w-8 bg-primary origin-left" />
        <span className="font-mono text-[11px] tracking-[0.28em] uppercase text-primary/80">
          Get In Touch
        </span>
      </motion.div>

      {/* Headline */}
      <div>
        <div className="overflow-hidden">
          <motion.h2
            variants={clipReveal}
            className="font-display font-extrabold text-foreground leading-[0.88] tracking-tight"
            style={{ fontSize: 'clamp(3.2rem, 5.8vw, 6rem)' }}
          >
            Start a
          </motion.h2>
        </div>
        <div className="overflow-hidden">
          <motion.h2
            variants={clipReveal}
            className="font-display font-extrabold leading-[0.88] tracking-tight"
            style={{ fontSize: 'clamp(3.2rem, 5.8vw, 6rem)' }}
          >
            <span className="text-foreground/35">Project</span>
            <span className="text-primary">.</span>
          </motion.h2>
        </div>
      </div>

      {/* Sub copy */}
      <motion.p variants={fadeUp} className="text-[14px] text-foreground/40 leading-relaxed font-light max-w-xs">
        We take on a small number of projects each quarter — so we can go deep on every one.
        Tell us what you're building.
      </motion.p>

      {/* Divider */}
      <motion.div variants={drawLine} className="h-px bg-border" />

      {/* Contact details */}
      <motion.div variants={staggerContainer(0.07, 0)} className="flex flex-col gap-4">
        {[
          { Icon: MapPin, label: 'Location', value: 'Naval Colony, Karachi, Pakistan' },
          { Icon: Phone, label: 'Phone', value: '+92 312 278 7385' },
          { Icon: Mail, label: 'Email', value: 'zilkjiro@gmail.com' },
          { Icon: Globe, label: 'Web', value: 'zilkco.com' },
          { Icon: Clock, label: 'Response', value: 'Within 24 hours' },
        ].map(({ Icon, label, value }) => (
          <motion.div key={label} variants={fadeUp} className="flex items-center gap-4 group">
            <div className="w-8 h-8 rounded-full border border-foreground/[0.07] bg-foreground/[0.03] flex items-center justify-center flex-shrink-0 group-hover:border-primary/30 group-hover:bg-primary/[0.06] transition-all duration-300">
              <Icon size={13} className="text-foreground/30 group-hover:text-primary/70 transition-colors duration-300" />
            </div>
            <div>
              <p className="font-mono text-[9px] tracking-[0.18em] uppercase text-foreground/20 mb-0.5">
                {label}
              </p>
              <p className="text-[13px] text-foreground/55 font-light">
                {value}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* WhatsApp */}
      <motion.a
        variants={fadeUp}
        href="https://wa.me/923122787385"
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex items-center gap-3 px-5 py-3 rounded-[4px] border border-foreground/[0.08] bg-foreground/[0.03] hover:bg-emerald-500/[0.08] hover:border-emerald-400/30 transition-all duration-300 w-fit"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-emerald-400/70 group-hover:text-emerald-400 transition-colors duration-300">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        <div>
          <p className="font-mono text-[9px] tracking-[0.18em] uppercase text-foreground/20 mb-0.5">
            WhatsApp
          </p>
          <p className="text-[13px] text-foreground/55 font-light group-hover:text-emerald-400/80 transition-colors duration-300">
            +92 312 278 7385
          </p>
        </div>
      </motion.a>

      {/* Divider */}
      <motion.div variants={drawLine} className="h-px bg-border" />

      {/* Availability badge */}
      <motion.div variants={fadeUp} className="flex items-start gap-4">
        <div className="relative mt-1 flex-shrink-0">
          <span className="absolute w-3 h-3 rounded-full bg-emerald-400 opacity-40 animate-ping" />
          <span className="relative block w-3 h-3 rounded-full bg-emerald-400" />
        </div>
        <div>
          <p className="font-display font-bold text-[15px] text-foreground/80 mb-1">
            Now Accepting Projects
          </p>
          <p className="font-mono text-[10px] tracking-[0.12em] uppercase text-foreground/28">
            Q3 2025 · Limited Spots Remaining
          </p>
        </div>
      </motion.div>

      {/* Ghost decorative character */}
      <div
        className="absolute -bottom-8 -left-6 font-display font-extrabold select-none pointer-events-none leading-none"
        style={{
          fontSize: 'clamp(10rem, 18vw, 18rem)',
          color: 'hsl(185 82% 50% / 0.042)',
          lineHeight: 1,
        }}
        aria-hidden
      >
        Z
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   CONTACT FORM
───────────────────────────────────────── */
function ContactForm() {
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    projectType: '',
    budget: '',
    timeline: '',
    country: '',
    message: '',
  });
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [focused, setFocused] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [cooldown, setCooldown] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const turnstileRef = useRef<HTMLDivElement>(null);

  // Load Turnstile script
  useEffect(() => {
    if (document.querySelector('script[src*="challenges.cloudflare.com"]')) return;
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }, []);

  // Render Turnstile widget
  useEffect(() => {
    const interval = setInterval(() => {
      const grecaptcha = (window as any).turnstile;
      if (grecaptcha && turnstileRef.current && !turnstileRef.current.hasChildNodes()) {
        grecaptcha.render(turnstileRef.current, {
          sitekey: '0x4AAAAAAADnPIDROrmt1Wwj',
          callback: (token: string) => setTurnstileToken(token),
          'expired-callback': () => setTurnstileToken(''),
          theme: 'dark',
          appearance: 'interaction-only',
        });
        clearInterval(interval);
      }
    }, 200);
    return () => clearInterval(interval);
  }, []);

  const set = (key: keyof FormState) => (v: string) =>
    setForm((prev) => ({ ...prev, [key]: v }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitState !== 'idle' || cooldown) return;

    // Honeypot check — bots fill hidden fields, humans don't
    if (honeypot) return;

    // Input sanitization
    const cleanName = stripHtml(form.name).slice(0, MAX_NAME);
    const cleanEmail = stripHtml(form.email).slice(0, MAX_EMAIL);
    const cleanMessage = stripHtml(form.message).slice(0, MAX_MESSAGE);

    if (!cleanName || !cleanEmail || !cleanMessage) {
      setErrorMsg('Please fill in all required fields.');
      setTimeout(() => setSubmitState('idle'), 3000);
      return;
    }

    // Basic email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setErrorMsg('Please enter a valid email address.');
      setTimeout(() => setSubmitState('idle'), 3000);
      return;
    }

    setSubmitState('loading');
    setErrorMsg('');

    try {
      const projectLabel = PROJECT_TYPES.find(p => p.value === form.projectType)?.label ?? form.projectType;
      const budgetLabel  = BUDGETS.find(b => b.value === form.budget)?.label ?? form.budget;
      const timelineLabel = TIMELINES.find(t => t.value === form.timeline)?.label ?? form.timeline;

      // Send via EmailJS
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          name: cleanName,
          email: cleanEmail,
          country: stripHtml(form.country).slice(0, 100),
          project_type: projectLabel || 'Not specified',
          budget: budgetLabel || 'Not specified',
          timeline: timelineLabel || 'Not specified',
          message: cleanMessage,
        },
        { publicKey: EMAILJS_PUBLIC_KEY }
      );

      setSubmitState('success');
      setCooldown(true);
      setTimeout(() => setCooldown(false), COOLDOWN_MS);
      setForm({ name: '', email: '', projectType: '', budget: '', timeline: '', country: '', message: '' });
    } catch (err: any) {
      console.error('EmailJS error:', err);
      setSubmitState('error');
      setErrorMsg(err?.text || err?.message || 'Something went wrong. Please try again.');
      setTimeout(() => setSubmitState('idle'), 4000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
    >
      <div
        className="relative rounded-[6px] border border-foreground/[0.07] overflow-hidden bg-card"
      >
        {/* Top accent line */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

        {/* Corner glow */}
        <div
          className="absolute top-0 right-0 w-64 h-64 pointer-events-none"
          style={{ background: 'radial-gradient(circle at top right, hsl(185 82% 50% / 0.06), transparent 70%)' }}
        />

        <form ref={formRef} onSubmit={handleSubmit} className="relative z-10 p-6 md:p-8 flex flex-col gap-6">

          {/* Name + Email */}
          <motion.div
            variants={staggerContainer(0.07, 0)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <motion.div variants={fadeUp}>
              <FormInput label="Your Name" placeholder="Alex Johnson" value={form.name} onChange={set('name')} required maxLength={MAX_NAME} />
            </motion.div>
            <motion.div variants={fadeUp}>
              <FormInput label="Email Address" type="email" placeholder="alex@company.com" value={form.email} onChange={set('email')} required maxLength={MAX_EMAIL} />
            </motion.div>
          </motion.div>

          {/* Project Type */}
          <motion.div
            variants={staggerContainer(0.05, 0)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col gap-2.5"
          >
            <motion.label variants={fadeUp} className="font-mono text-[10px] tracking-[0.2em] uppercase text-foreground/35">
              Project Type
            </motion.label>
            <motion.div variants={fadeUp}>
              <PillSelector options={PROJECT_TYPES} value={form.projectType} onChange={set('projectType')} cols={3} />
            </motion.div>
          </motion.div>

          {/* Budget */}
          <motion.div
            variants={staggerContainer(0.05, 0)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col gap-2.5"
          >
            <motion.label variants={fadeUp} className="font-mono text-[10px] tracking-[0.2em] uppercase text-foreground/35">
              Budget Range
            </motion.label>
            <motion.div variants={fadeUp}>
              <PillSelector options={BUDGETS} value={form.budget} onChange={set('budget')} cols={4} />
            </motion.div>
          </motion.div>

          {/* Timeline */}
          <motion.div
            variants={staggerContainer(0.05, 0)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col gap-2.5"
          >
            <motion.label variants={fadeUp} className="font-mono text-[10px] tracking-[0.2em] uppercase text-foreground/35">
              Timeline
            </motion.label>
            <motion.div variants={fadeUp}>
              <PillSelector options={TIMELINES} value={form.timeline} onChange={set('timeline')} cols={4} />
            </motion.div>
          </motion.div>

          {/* Country */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            <CountrySelect value={form.country} onChange={set('country')} />
          </motion.div>

          {/* Message */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-2"
          >
            <label className="font-mono text-[10px] tracking-[0.2em] uppercase text-foreground/35">
              Tell Us More
            </label>
            <textarea
              rows={4}
              maxLength={MAX_MESSAGE}
              placeholder="Describe your project, goals, and anything else that would help us understand what you're building…"
              value={form.message}
              onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              className="w-full resize-none bg-foreground/[0.02] border rounded-[4px] px-4 py-3 text-[14px] text-foreground/85 placeholder:text-foreground/18 outline-none transition-all duration-300 font-sans leading-relaxed"
              style={{
                borderColor: focused
                  ? 'hsl(185 82% 50% / 0.5)'
                  : 'hsl(0 0% 100% / 0.08)',
                boxShadow: focused
                  ? '0 0 0 3px hsl(185 82% 50% / 0.08)'
                  : 'none',
                background: focused ? 'hsl(0 0% 100% / 0.04)' : 'hsl(0 0% 100% / 0.02)',
              }}
            />
          </motion.div>

          {/* Honeypot — hidden from humans, bots fill it */}
          <div className="absolute opacity-0 pointer-events-none h-0 overflow-hidden" aria-hidden="true">
            <label htmlFor="website">Leave this blank</label>
            <input
              id="website"
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>

          {/* Turnstile CAPTCHA */}
          <div ref={turnstileRef} className="flex justify-center" />

          {/* Submit */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <SubmitButton state={cooldown ? 'success' : submitState} />
          </motion.div>

          {/* Error message */}
          <AnimatePresence>
            {submitState === 'error' && errorMsg && (
              <motion.p
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="text-center font-mono text-[11px] tracking-wide text-red-400"
              >
                {errorMsg}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Footer note */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center font-mono text-[9px] tracking-[0.14em] uppercase text-foreground/18"
          >
            No spam · No commitments · We respond within 24h
          </motion.p>
        </form>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────────── */
export function Contact() {
  return (
    <section
      id="contact"
      className="relative bg-secondary border-t border-border py-24 md:py-36 overflow-hidden"
    >
      {/* Dot grid texture */}
      <div className="absolute inset-0 dot-grid opacity-20 pointer-events-none" />

      {/* Deep ambient radial */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 15% 50%, hsl(185 82% 50% / 0.05), transparent)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-16 lg:gap-24 items-start">
          <ContactLeft />
          <ContactForm />
        </div>
      </div>

      {/* Bottom wordmark */}
      <div className="relative z-10 mt-24 border-t border-border pt-10 max-w-7xl mx-auto px-6 md:px-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="font-display font-extrabold text-foreground/[0.06] text-[11px] tracking-[0.5em] uppercase select-none">
          Zilk Co. — Engineering Digital Businesses
        </p>
        <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-foreground/15 select-none">
          © {new Date().getFullYear()} Zilk Co. All rights reserved.
        </p>
      </div>
    </section>
  );
}
