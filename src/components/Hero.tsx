import { motion } from "framer-motion";
import { Shield } from "lucide-react";

interface HeroProps {
  onExplore: () => void;
  t: any;
}

// Jet fighter flying along an SVG path with a smooth trail
function FighterJet({ delay = 0, pathId = "path1" }: { delay?: number; pathId?: string }) {
  const paths: Record<string, string> = {
    path1: "M-50,280 C200,200 400,350 600,180 S900,300 1100,150",
    path2: "M1150,450 C900,350 700,500 500,320 S200,450 -50,350",
    path3: "M-50,150 C150,250 350,100 550,250 S850,150 1100,280",
  };

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" preserveAspectRatio="none" viewBox="0 0 1100 700">
      <defs>
        <linearGradient id={`trail-${pathId}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="50%" stopColor="rgba(212,175,55,0.15)" />
          <stop offset="100%" stopColor="rgba(212,175,55,0.4)" />
        </linearGradient>
      </defs>
      {/* Trail */}
      <motion.path
        d={paths[pathId]}
        fill="none"
        stroke={`url(#trail-${pathId})`}
        strokeWidth="1.5"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: [0, 1, 1], opacity: [0, 0.6, 0] }}
        transition={{ duration: 5, delay: delay + 0.3, repeat: Infinity, repeatDelay: 6, ease: "easeInOut" }}
      />
      {/* Jet */}
      <motion.g
        initial={{ offsetDistance: "0%", opacity: 0 }}
        animate={{ offsetDistance: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
        transition={{ duration: 5, delay, repeat: Infinity, repeatDelay: 6, ease: "easeInOut" }}
        style={{ offsetPath: `path("${paths[pathId]}")`, offsetRotate: "auto" }}
      >
        <polygon points="0,-3 12,0 0,3 2,0" fill="rgba(212,175,55,0.8)" />
        <circle r="2" fill="rgba(212,175,55,0.6)" />
      </motion.g>
    </svg>
  );
}

// HUD Corner brackets
function HUDBracket({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) {
  const transforms: Record<string, string> = {
    tl: "", tr: "scaleX(-1)", bl: "scaleY(-1)", br: "scale(-1)",
  };
  const positions: Record<string, string> = {
    tl: "top-6 left-6 sm:top-10 sm:left-10",
    tr: "top-6 right-6 sm:top-10 sm:right-10",
    bl: "bottom-6 left-6 sm:bottom-10 sm:left-10",
    br: "bottom-6 right-6 sm:bottom-10 sm:right-10",
  };
  return (
    <motion.div
      className={`absolute ${positions[position]} pointer-events-none`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.2 }}
      transition={{ duration: 1.5, delay: 0.5 }}
    >
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" style={{ transform: transforms[position] }}>
        <path d="M0 15 L0 0 L15 0" stroke="rgba(212,175,55,0.5)" strokeWidth="1" />
        <circle cx="0" cy="0" r="2" fill="rgba(212,175,55,0.4)" />
      </svg>
    </motion.div>
  );
}

// Horizontal scan line sweeping down
function ScanLine() {
  return (
    <motion.div
      className="absolute left-0 right-0 h-[1px] pointer-events-none z-[2]"
      style={{ background: "linear-gradient(90deg, transparent 5%, rgba(212,175,55,0.12) 30%, rgba(212,175,55,0.2) 50%, rgba(212,175,55,0.12) 70%, transparent 95%)" }}
      initial={{ top: "0%" }}
      animate={{ top: ["0%", "100%"] }}
      transition={{ duration: 6, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
    />
  );
}

// HUD data readout text
function HUDReadout({ text, position, delay = 0 }: { text: string; position: string; delay?: number }) {
  return (
    <motion.div
      className={`absolute ${position} pointer-events-none font-mono`}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.15, 0.15, 0] }}
      transition={{ duration: 8, delay, repeat: Infinity, ease: "easeInOut" }}
    >
      <span className="text-[9px] sm:text-[10px] text-[#d4af37]/40 tracking-[0.2em]">{text}</span>
    </motion.div>
  );
}

// Tank icon SVG
function TankIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="12" width="20" height="6" rx="2" />
      <rect x="5" y="8" width="14" height="4" rx="1" />
      <line x1="19" y1="10" x2="23" y2="8" />
      <circle cx="6" cy="18" r="1.5" fill="currentColor" />
      <circle cx="10" cy="18" r="1.5" fill="currentColor" />
      <circle cx="14" cy="18" r="1.5" fill="currentColor" />
      <circle cx="18" cy="18" r="1.5" fill="currentColor" />
    </svg>
  );
}

export default function Hero({ onExplore, t }: HeroProps) {
  return (
    <section className="relative h-[100dvh] w-full flex flex-col items-center justify-center overflow-hidden">
      {/* Dark atmospheric background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(15,15,20,1)_0%,_rgba(5,5,5,1)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,_rgba(212,175,55,0.04)_0%,_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,_rgba(255,59,48,0.02)_0%,_transparent_40%)]" />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 z-[1] pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(212,175,55,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(212,175,55,0.3) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Scan line */}
      <ScanLine />

      {/* HUD corner brackets */}
      <HUDBracket position="tl" />
      <HUDBracket position="tr" />
      <HUDBracket position="bl" />
      <HUDBracket position="br" />

      {/* HUD data readouts */}
      <HUDReadout text="SYS.ONLINE" position="top-8 left-16 sm:top-12 sm:left-20" delay={1} />
      <HUDReadout text="LAT 39.92°N" position="bottom-16 left-8 sm:bottom-14 sm:left-12" delay={2} />
      <HUDReadout text="LONG 32.85°E" position="bottom-12 left-8 sm:bottom-10 sm:left-12" delay={2.5} />
      <HUDReadout text="SCAN.ACTIVE" position="top-8 right-16 sm:top-12 sm:right-20" delay={3} />
      <HUDReadout text="TGT.LOCK" position="bottom-16 right-8 sm:bottom-14 sm:right-12" delay={4} />

      {/* Fighter jets with trails */}
      <div className="absolute inset-0 z-[1] overflow-hidden">
        <FighterJet delay={0} pathId="path1" />
        <FighterJet delay={6} pathId="path2" />
        <FighterJet delay={12} pathId="path3" />
      </div>

      {/* Radar circle animation */}
      <div className="absolute inset-0 z-[1] pointer-events-none flex items-center justify-center">
        <motion.div
          className="w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] rounded-full border border-[#d4af37]/[0.06]"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
        >
          {/* Radar sweep arm */}
          <motion.div
            className="absolute inset-0"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute top-1/2 left-1/2 w-1/2 h-px origin-left"
              style={{ background: "linear-gradient(90deg, rgba(212,175,55,0.2), transparent)" }} />
          </motion.div>
          {/* Inner rings */}
          <div className="absolute inset-[25%] rounded-full border border-[#d4af37]/[0.04]" />
          <div className="absolute inset-[50%] rounded-full border border-[#d4af37]/[0.03]" />
          {/* Center dot */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#d4af37]/30"
            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 sm:px-8 max-w-4xl mx-auto">
        {/* Top badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-5 sm:mb-7"
        >
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-[#d4af37]/15 bg-[#d4af37]/[0.03] backdrop-blur-sm">
            <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 4, repeat: Infinity }}>
              <Shield className="w-3.5 h-3.5 text-[#d4af37]/60" />
            </motion.div>
            <span className="text-[9px] sm:text-[11px] tracking-[0.15em] text-[#d4af37]/50 font-semibold">
              {t.heroSub}
            </span>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5 }}
          className="text-4xl sm:text-6xl md:text-8xl font-serif font-light tracking-tight leading-[0.9] mb-5 sm:mb-7"
        >
          <span className="text-gradient">{t.heroTitle1}</span>
          <br />
          <span className="italic text-gradient-gold">{t.heroTitle2}</span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-xs sm:text-base md:text-lg text-white/40 max-w-xl font-light leading-relaxed mb-8 sm:mb-10"
        >
          {t.heroDesc}
        </motion.p>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex items-center gap-8 sm:gap-12 mb-8 sm:mb-10"
        >
          {[
            { value: "195+", label: t.statsCountries || "ÜLKE" },
            { value: "AI", label: t.statsAI || "DESTEKLİ" },
            { value: "∞", label: t.statsData || "VERİ" },
          ].map(({ value, label }, i) => (
            <motion.div key={i} className="flex flex-col items-center"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 + i * 0.15 }}>
              <span className="text-xl sm:text-3xl font-bold text-[#d4af37]/70 font-mono">{value}</span>
              <span className="text-[7px] sm:text-[9px] tracking-[0.2em] text-white/25 font-semibold mt-1">{label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.3 }}
          onClick={onExplore}
          className="group relative px-8 sm:px-12 py-4 sm:py-5 overflow-hidden active:scale-95 transition-transform"
        >
          {/* Animated border */}
          <motion.div
            className="absolute inset-0 border-2 border-[#d4af37]/30"
            style={{ clipPath: "polygon(8px 0%, calc(100% - 8px) 0%, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0% calc(100% - 8px), 0% 8px)" }}
            animate={{ borderColor: ["rgba(212,175,55,0.25)", "rgba(212,175,55,0.5)", "rgba(212,175,55,0.25)"] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          />
          {/* Fill */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-[#d4af37]/10 via-[#d4af37]/5 to-[#d4af37]/10 group-hover:from-[#d4af37]/20 group-hover:via-[#d4af37]/10 group-hover:to-[#d4af37]/20 transition-all duration-500"
            style={{ clipPath: "polygon(8px 0%, calc(100% - 8px) 0%, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0% calc(100% - 8px), 0% 8px)" }}
          />
          {/* Sweep effect on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <motion.div
              className="absolute top-0 bottom-0 w-20 bg-gradient-to-r from-transparent via-[#d4af37]/15 to-transparent"
              animate={{ left: ["-20%", "120%"] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            />
          </div>
          <span className="relative z-10 flex items-center gap-3 sm:gap-4 text-[11px] sm:text-sm tracking-[0.12em] font-bold text-[#d4af37]">
            <TankIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            {t.heroBtn}
            <motion.svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"
              animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </motion.svg>
          </span>
        </motion.button>
      </div>

      {/* Bottom scan line */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px z-10 pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.4), transparent)" }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex-col items-center hidden sm:flex z-10"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-5 h-8 rounded-full border border-white/10 flex items-start justify-center p-1.5"
        >
          <div className="w-1 h-1.5 rounded-full bg-[#d4af37]/40" />
        </motion.div>
      </motion.div>
    </section>
  );
}
