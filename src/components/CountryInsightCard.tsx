import { motion, AnimatePresence } from "framer-motion";
import { CountryInsight } from "../types";
import { X } from "lucide-react";

interface CountryInsightCardProps {
  insight: CountryInsight | null;
  isLoading: boolean;
  onClose: () => void;
  error: string | null;
  t: any;
}

export default function CountryInsightCard({ insight, isLoading, onClose, error, t }: CountryInsightCardProps) {
  return (
    <AnimatePresence>
      {(insight || isLoading || error) && (
        <motion.div
          initial={{ opacity: 0, x: 40, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 40, scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed top-24 right-6 md:right-12 z-50 w-[calc(100vw-3rem)] md:w-[420px] max-w-md"
        >
          <div className="glass-panel rounded-2xl p-8 relative overflow-hidden group">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors z-10"
            >
              <X className="w-4 h-4 text-white/60 hover:text-white" />
            </button>

            {/* Subtle glow effect */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />

            {isLoading ? (
              <div className="flex flex-col gap-6 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/10" />
                  <div className="flex flex-col gap-2 flex-1">
                    <div className="h-4 bg-white/10 rounded w-1/3" />
                    <div className="h-6 bg-white/10 rounded w-2/3" />
                  </div>
                </div>
                <div className="h-px w-full bg-white/10 my-2" />
                <div className="space-y-3">
                  <div className="h-4 bg-white/10 rounded w-full" />
                  <div className="h-4 bg-white/10 rounded w-5/6" />
                  <div className="h-4 bg-white/10 rounded w-4/6" />
                </div>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                  <span className="text-red-400 text-xl">!</span>
                </div>
                <h3 className="text-lg font-medium text-white/80 mb-2">{t.cardErrorTitle}</h3>
                <p className="text-sm text-white/50">{error}</p>
              </div>
            ) : insight ? (
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-start gap-5 mb-6">
                  <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-3xl shadow-inner">
                    {insight.emoji}
                  </div>
                  <div className="flex flex-col pt-1">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#d4af37] font-semibold mb-1">
                      {insight.category}
                    </span>
                    <h2 className="text-3xl font-serif font-light tracking-tight text-white mb-1">
                      {insight.country}
                    </h2>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px w-full bg-gradient-to-r from-white/20 via-white/5 to-transparent mb-6" />

                {/* Content */}
                <div className="flex flex-col gap-4">
                  <h3 className="text-lg font-medium text-white/90 leading-snug">
                    "{insight.tagline}"
                  </h3>
                  <p className="text-[15px] text-white/60 leading-relaxed font-light">
                    {insight.highlight}
                  </p>
                </div>

                {/* Footer accent */}
                <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-widest text-white/30">
                    {t.cardFooter}
                  </span>
                  <div className="flex gap-1">
                    <div className="w-1 h-1 rounded-full bg-white/20" />
                    <div className="w-1 h-1 rounded-full bg-white/20" />
                    <div className="w-1 h-1 rounded-full bg-white/20" />
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
