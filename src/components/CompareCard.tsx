import { motion, AnimatePresence } from "framer-motion";
import { CountryInsight } from "../types";
import { X, Shield, Users, Swords, Plane, Ship, Atom, Trophy, DollarSign, ArrowRight, ArrowLeft } from "lucide-react";

interface CompareCardProps {
    countryA: CountryInsight | null;
    countryB: CountryInsight | null;
    isLoadingA: boolean;
    isLoadingB: boolean;
    onClose: () => void;
    t: any;
}

function CompareStatRow({ icon: Icon, label, valueA, valueB }: { icon: any; label: string; valueA: string; valueB: string }) {
    return (
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 py-2 border-b border-white/5 last:border-0">
            <div className="text-right">
                <span className="text-xs sm:text-sm font-semibold text-white/80">{valueA}</span>
            </div>
            <div className="flex flex-col items-center gap-0.5 px-2">
                <Icon className="w-3.5 h-3.5 text-[#d4af37]/60" />
                <span className="text-[8px] sm:text-[9px] text-white/30 font-medium tracking-wider text-center leading-tight">{label}</span>
            </div>
            <div className="text-left">
                <span className="text-xs sm:text-sm font-semibold text-white/80">{valueB}</span>
            </div>
        </div>
    );
}

function SkeletonCompare() {
    return (
        <div className="flex flex-col gap-4 animate-pulse p-6">
            <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
                <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-xl bg-white/10" />
                    <div className="h-5 bg-white/10 rounded w-24" />
                </div>
                <div className="text-white/20 text-xl font-bold">VS</div>
                <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-xl bg-white/10" />
                    <div className="h-5 bg-white/10 rounded w-24" />
                </div>
            </div>
            <div className="space-y-3 mt-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-8 bg-white/5 rounded" />
                ))}
            </div>
        </div>
    );
}

export default function CompareCard({ countryA, countryB, isLoadingA, isLoadingB, onClose, t }: CompareCardProps) {
    const isLoading = isLoadingA || isLoadingB;
    const isReady = countryA && countryB;

    return (
        <AnimatePresence>
            {(isReady || isLoading) && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/70 z-40"
                    />

                    <motion.div
                        initial={{ opacity: 0, y: 60, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 60, scale: 0.95 }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed bottom-0 left-0 right-0 z-50 md:bottom-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[560px] md:max-w-[90vw]"
                    >
                        {/* Mobile drag handle */}
                        <div className="flex justify-center pt-3 pb-1 md:hidden">
                            <div className="w-10 h-1 rounded-full bg-white/30" />
                        </div>

                        <div className="glass-panel rounded-t-3xl md:rounded-2xl relative overflow-hidden max-h-[88vh] md:max-h-[85vh] overflow-y-auto">
                            {/* Close */}
                            <button onClick={onClose}
                                className="absolute top-4 right-4 p-2.5 sm:p-2 rounded-full bg-white/5 hover:bg-white/10 active:bg-white/15 z-10">
                                <X className="w-5 h-5 sm:w-4 sm:h-4 text-white/60" />
                            </button>

                            {/* Glow */}
                            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-32 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />

                            {isLoading ? (
                                <SkeletonCompare />
                            ) : isReady ? (
                                <div className="p-5 sm:p-8">
                                    {/* Header — both countries */}
                                    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-5 mb-5 sm:mb-6">
                                        {/* Country A */}
                                        <div className="flex flex-col items-center text-center">
                                            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-2xl sm:text-3xl mb-2">
                                                {countryA.emoji}
                                            </div>
                                            <span className="text-[9px] sm:text-[10px] text-[#d4af37] font-semibold tracking-wider">
                                                #{countryA.globalRank}
                                            </span>
                                            <h3 className="text-base sm:text-lg font-serif font-light text-white leading-tight">
                                                {countryA.country}
                                            </h3>
                                            <span className="text-[9px] text-white/30 mt-0.5">{countryA.category}</span>
                                        </div>

                                        {/* VS badge */}
                                        <div className="flex flex-col items-center gap-1">
                                            <motion.div
                                                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-[#d4af37]/30 flex items-center justify-center bg-[#d4af37]/10"
                                                animate={{ scale: [1, 1.05, 1], borderColor: ["rgba(212,175,55,0.3)", "rgba(212,175,55,0.6)", "rgba(212,175,55,0.3)"] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                            >
                                                <span className="text-sm sm:text-base font-black text-[#d4af37]">VS</span>
                                            </motion.div>
                                        </div>

                                        {/* Country B */}
                                        <div className="flex flex-col items-center text-center">
                                            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-2xl sm:text-3xl mb-2">
                                                {countryB.emoji}
                                            </div>
                                            <span className="text-[9px] sm:text-[10px] text-[#d4af37] font-semibold tracking-wider">
                                                #{countryB.globalRank}
                                            </span>
                                            <h3 className="text-base sm:text-lg font-serif font-light text-white leading-tight">
                                                {countryB.country}
                                            </h3>
                                            <span className="text-[9px] text-white/30 mt-0.5">{countryB.category}</span>
                                        </div>
                                    </div>

                                    {/* Divider */}
                                    <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-4" />

                                    {/* Stats comparison */}
                                    <div className="flex flex-col">
                                        <CompareStatRow icon={DollarSign} label="BÜTÇE" valueA={countryA.militaryBudget} valueB={countryB.militaryBudget} />
                                        <CompareStatRow icon={Users} label="AKTİF" valueA={countryA.activeMilitary} valueB={countryB.activeMilitary} />
                                        <CompareStatRow icon={Shield} label="YEDEK" valueA={countryA.reserveMilitary} valueB={countryB.reserveMilitary} />
                                        <CompareStatRow icon={Swords} label="TANK" valueA={countryA.tanks} valueB={countryB.tanks} />
                                        <CompareStatRow icon={Plane} label="UÇAK" valueA={countryA.aircraft} valueB={countryB.aircraft} />
                                        <CompareStatRow icon={Ship} label="DENİZ" valueA={countryA.navalVessels} valueB={countryB.navalVessels} />
                                        <CompareStatRow icon={Atom} label="NÜKLEER" valueA={countryA.nuclearWarheads} valueB={countryB.nuclearWarheads} />
                                    </div>

                                    {/* Footer */}
                                    <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-center">
                                        <span className="text-[9px] tracking-widest text-white/20">{t.cardFooter}</span>
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
