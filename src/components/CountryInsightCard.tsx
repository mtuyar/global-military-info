import { motion, AnimatePresence } from "framer-motion";
import { CountryInsight } from "../types";
import { X, Shield, Users, Swords, Plane, Ship, Atom, Trophy, Sparkles, DollarSign } from "lucide-react";

interface CountryInsightCardProps {
  insight: CountryInsight | null;
  isLoading: boolean;
  onClose: () => void;
  error: string | null;
  t: any;
}

function StatItem({ icon: Icon, label, value, accent = false }: { icon: any; label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center gap-3 py-2.5 sm:py-3">
      <div className={`flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center ${accent ? 'bg-[#d4af37]/15 text-[#d4af37]' : 'bg-white/5 text-white/50'}`}>
        <Icon className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
      </div>
      <div className="flex flex-col min-w-0 flex-1">
        <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-white/40 font-medium">{label}</span>
        <span className={`text-sm sm:text-[15px] font-semibold truncate ${accent ? 'text-[#d4af37]' : 'text-white/90'}`}>{value}</span>
      </div>
    </div>
  );
}

export default function CountryInsightCard({ insight, isLoading, onClose, error, t }: CountryInsightCardProps) {
  return (
    <AnimatePresence>
      {(insight || isLoading || error) && (
        <>
          {/* Mobile backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-40 md:hidden"
          />

          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-50 md:bottom-auto md:left-auto md:right-8 lg:right-12 md:top-20 md:w-[440px] lg:w-[460px]"
          >
            {/* Mobile drag handle */}
            <div className="flex justify-center pt-3 pb-1 md:hidden">
              <div className="w-10 h-1 rounded-full bg-white/30" />
            </div>

            <div className="glass-panel rounded-t-3xl md:rounded-2xl relative overflow-hidden group max-h-[85vh] md:max-h-[calc(100vh-6rem)] overflow-y-auto">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2.5 sm:p-2 rounded-full bg-white/5 hover:bg-white/10 active:bg-white/15 transition-colors z-10"
              >
                <X className="w-5 h-5 sm:w-4 sm:h-4 text-white/60 hover:text-white" />
              </button>

              {/* Background glow */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-[#d4af37]/5 rounded-full blur-2xl pointer-events-none" />

              {isLoading ? (
                <div className="flex flex-col gap-5 animate-pulse p-6 sm:p-8">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white/10" />
                    <div className="flex flex-col gap-2 flex-1">
                      <div className="h-3 bg-white/10 rounded w-1/3" />
                      <div className="h-7 bg-white/10 rounded w-2/3" />
                    </div>
                  </div>
                  <div className="h-px w-full bg-white/10" />
                  <div className="space-y-3">
                    <div className="h-4 bg-white/10 rounded w-full" />
                    <div className="h-4 bg-white/10 rounded w-5/6" />
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="h-16 bg-white/5 rounded-xl" />
                    ))}
                  </div>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-10 text-center p-6 sm:p-8">
                  <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center mb-4">
                    <span className="text-red-400 text-2xl">!</span>
                  </div>
                  <h3 className="text-lg font-medium text-white/80 mb-2">{t.cardErrorTitle}</h3>
                  <p className="text-sm text-white/50">{error}</p>
                </div>
              ) : insight ? (
                <div className="flex flex-col">
                  {/* Header Section */}
                  <div className="p-6 sm:p-8 pb-0">
                    <div className="flex items-start gap-4 sm:gap-5 mb-4 pr-8">
                      <div className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-3xl sm:text-4xl shadow-inner">
                        {insight.emoji}
                      </div>
                      <div className="flex flex-col pt-0.5 min-w-0">
                        <span className="text-[10px] uppercase tracking-[0.2em] text-[#d4af37] font-semibold mb-1">
                          {insight.category}
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-serif font-light tracking-tight text-white leading-tight">
                          {insight.country}
                        </h2>
                        {insight.globalRank && (
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <Trophy className="w-3 h-3 text-[#d4af37]" />
                            <span className="text-xs text-[#d4af37] font-medium">
                              #{insight.globalRank}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Tagline & Highlight */}
                    <div className="mb-5">
                      <h3 className="text-base sm:text-lg font-medium text-white/90 leading-snug mb-2 italic">
                        "{insight.tagline}"
                      </h3>
                      <p className="text-sm sm:text-[15px] text-white/55 leading-relaxed font-light">
                        {insight.highlight}
                      </p>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                  {/* Stats Grid */}
                  <div className="px-6 sm:px-8 py-4">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
                      <StatItem icon={DollarSign} label="Savunma Bütçesi" value={insight.militaryBudget} accent />
                      <StatItem icon={Users} label="Aktif Personel" value={insight.activeMilitary} />
                      <StatItem icon={Shield} label="Yedek Kuvvet" value={insight.reserveMilitary} />
                      <StatItem icon={Swords} label="Tank / Zırhlı" value={insight.tanks} />
                      <StatItem icon={Plane} label="Savaş Uçağı" value={insight.aircraft} />
                      <StatItem icon={Ship} label="Deniz Gücü" value={insight.navalVessels} />
                      <StatItem icon={Atom} label="Nükleer" value={insight.nuclearWarheads} accent={insight.nuclearWarheads !== "0"} />
                    </div>
                  </div>

                  {/* Strengths Section */}
                  {insight.strengths && insight.strengths.length > 0 && (
                    <>
                      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                      <div className="px-6 sm:px-8 py-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                          <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-medium">Öne Çıkan Güçler</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {insight.strengths.map((strength, i) => (
                            <span
                              key={i}
                              className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/8 text-xs sm:text-[13px] text-white/70 font-medium"
                            >
                              {strength}
                            </span>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Footer */}
                  <div className="px-6 sm:px-8 py-4 border-t border-white/5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-widest text-white/25">
                        {t.cardFooter}
                      </span>
                      <div className="flex gap-1">
                        <div className="w-1 h-1 rounded-full bg-[#d4af37]/40" />
                        <div className="w-1 h-1 rounded-full bg-[#d4af37]/30" />
                        <div className="w-1 h-1 rounded-full bg-[#d4af37]/20" />
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
