import { motion } from "framer-motion";

interface HeroProps {
  onExplore: () => void;
  t: any;
}

export default function Hero({ onExplore, t }: HeroProps) {
  return (
    <section className="relative h-[100dvh] w-full flex flex-col items-center justify-center overflow-hidden px-4">
      {/* Ambient background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,_rgba(255,255,255,0.05)_0%,_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_80%,_rgba(212,175,55,0.08)_0%,_transparent_50%)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 sm:px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <h2 className="text-[10px] sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em] text-white/50 mb-4 sm:mb-6 font-medium">
            {t.heroSub}
          </h2>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
          className="text-4xl sm:text-6xl md:text-8xl font-serif font-light tracking-tight leading-[0.9] mb-6 sm:mb-8"
        >
          <span className="text-gradient">{t.heroTitle1}</span>
          <br />
          <span className="italic text-gradient-gold">{t.heroTitle2}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
          className="text-sm sm:text-lg md:text-xl text-white/60 max-w-2xl font-light leading-relaxed mb-8 sm:mb-12 px-2"
        >
          {t.heroDesc}
        </motion.p>

        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
          onClick={onExplore}
          className="group relative px-6 sm:px-8 py-3 sm:py-4 rounded-full overflow-hidden active:scale-95 transition-transform"
        >
          <div className="absolute inset-0 bg-white/5 backdrop-blur-md border border-white/10 rounded-full transition-all duration-300 group-hover:bg-white/10 group-hover:border-white/20" />
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_center,_rgba(212,175,55,0.2)_0%,_transparent_70%)]" />
          <span className="relative z-10 flex items-center gap-2 sm:gap-3 text-xs sm:text-sm uppercase tracking-widest font-medium">
            {t.heroBtn}
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </span>
        </motion.button>
      </div>

      {/* Scroll indicator - hidden on mobile */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 flex-col items-center gap-2 hidden sm:flex"
      >
        <div className="w-[1px] h-16 bg-gradient-to-b from-white/0 via-white/20 to-white/0" />
      </motion.div>
    </section>
  );
}
