import { useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Hero from "./components/Hero";
import WorldMap from "./components/WorldMap";
import CountryInsightCard from "./components/CountryInsightCard";
import CompareCard from "./components/CompareCard";
import { CountryInsight } from "./types";
import { GitCompareArrows, X, Eye } from "lucide-react";

const translations = {
  tr: {
    heroSub: "PREMİUM BİR KEŞİF DENEYİMİ",
    heroTitle1: "Dünyayı",
    heroTitle2: "Keşfedin",
    heroDesc: "Herhangi bir ülkenin askeri kapasitesini ve savunma stratejilerini ortaya çıkarın. Küresel silahlı kuvvetler arasında yapay zeka destekli bir yolculuk.",
    heroBtn: "DÜNYA HARİTASINI GÖRÜNTÜLE",
    statsCountries: "ÜLKE",
    statsAI: "DESTEKLİ",
    statsData: "VERİ",
    mapTitle: "KÜRESEL SAVUNMA ATLASI",
    mapDesc: "Askeri kapasitesini görmek için bir ülke seçin.",
    analyzing: "Yapay zeka küresel savunma puanlarını analiz ediyor...",
    errorFetch: "Küresel savunma puanları alınamadı.",
    errorInsight: "Bu ülke analiz edilemedi. Lütfen tekrar deneyin.",
    scoreText: "Puan",
    cardErrorTitle: "Keşif Başarısız",
    cardFooter: "YAPAY ZEKA TARAFINDAN HAZIRLANDI",
    compareMode: "KARŞILAŞTIR",
    compareDesc: "İki ülke seçin",
    compareReady: "karşılaştır",
    viewMode: "İNCELE",
    compareSelect1: "1. ülkeyi seçin",
    compareSelect2: "2. ülkeyi seçin",
  },
  en: {
    heroSub: "A PREMIUM DISCOVERY EXPERIENCE",
    heroTitle1: "Explore the",
    heroTitle2: "World",
    heroDesc: "Uncover the military capabilities and defense strategies of any nation. An AI-curated journey through global armed forces.",
    heroBtn: "VIEW WORLD MAP",
    statsCountries: "COUNTRIES",
    statsAI: "POWERED",
    statsData: "DATA",
    mapTitle: "GLOBAL DEFENSE ATLAS",
    mapDesc: "Select a destination to reveal its military capabilities.",
    analyzing: "AI is analyzing global defense scores...",
    errorFetch: "Failed to analyze global defense scores.",
    errorInsight: "Failed to analyze this country. Please try again.",
    scoreText: "Score",
    cardErrorTitle: "Discovery Failed",
    cardFooter: "AI CURATED INSIGHT",
    compareMode: "COMPARE",
    compareDesc: "Select two countries",
    compareReady: "compare",
    viewMode: "EXPLORE",
    compareSelect1: "Select 1st country",
    compareSelect2: "Select 2nd country",
  }
};

export default function App() {
  const [language, setLanguage] = useState<'tr' | 'en'>('tr');
  const t = translations[language];

  const [showMap, setShowMap] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [insight, setInsight] = useState<CountryInsight | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cache, setCache] = useState<Record<string, CountryInsight>>({});

  const [globalScores, setGlobalScores] = useState<Record<string, number>>({});
  const [isScoring, setIsScoring] = useState(false);

  // Compare mode state
  const [compareMode, setCompareMode] = useState(false);
  const [compareCountryA, setCompareCountryA] = useState<string | null>(null);
  const [compareCountryB, setCompareCountryB] = useState<string | null>(null);
  const [compareInsightA, setCompareInsightA] = useState<CountryInsight | null>(null);
  const [compareInsightB, setCompareInsightB] = useState<CountryInsight | null>(null);
  const [compareLoadingA, setCompareLoadingA] = useState(false);
  const [compareLoadingB, setCompareLoadingB] = useState(false);

  const mapRef = useRef<HTMLDivElement>(null);

  // Compute rank from globalScores
  const getRankFromScores = useMemo(() => {
    const sorted = Object.entries(globalScores).sort((a, b) => b[1] - a[1]);
    const rankMap: Record<string, number> = {};
    sorted.forEach(([name], i) => { rankMap[name] = i + 1; });
    return rankMap;
  }, [globalScores]);

  const fetchInsight = async (countryName: string): Promise<CountryInsight | null> => {
    const cacheKey = `${countryName}-${language}`;
    if (cache[cacheKey]) {
      const cached = { ...cache[cacheKey] };
      if (getRankFromScores[countryName]) cached.globalRank = getRankFromScores[countryName];
      return cached;
    }

    try {
      const response = await fetch("/api/country-insight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ countryName, countryCode: "", language }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      if (getRankFromScores[countryName]) data.globalRank = getRankFromScores[countryName];
      setCache((prev) => ({ ...prev, [cacheKey]: data }));
      return data;
    } catch (err) {
      console.error("Insight fetch failed:", err);
      return null;
    }
  };

  const fetchGlobalScores = async () => {
    setIsScoring(true);
    setError(null);
    try {
      const response = await fetch("/api/global-defense-scores");
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || t.errorFetch);
      setGlobalScores(data);
    } catch (err: any) {
      console.error("Failed to fetch global scores", err);
      setError(err.message || t.errorFetch);
    } finally {
      setIsScoring(false);
    }
  };

  const handleExplore = () => {
    setShowMap(true);
    setTimeout(() => mapRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    if (Object.keys(globalScores).length === 0 && !error) fetchGlobalScores();
  };

  const handleCountryClick = async (countryName: string, countryCode: string) => {
    if (compareMode) {
      // Compare mode: select two countries
      if (!compareCountryA) {
        setCompareCountryA(countryName);
        setCompareLoadingA(true);
        const data = await fetchInsight(countryName);
        setCompareInsightA(data);
        setCompareLoadingA(false);
      } else if (!compareCountryB && countryName !== compareCountryA) {
        setCompareCountryB(countryName);
        setCompareLoadingB(true);
        const data = await fetchInsight(countryName);
        setCompareInsightB(data);
        setCompareLoadingB(false);
      }
      return;
    }

    // Normal mode
    if (selectedCountry === countryName) return;
    setSelectedCountry(countryName);
    setError(null);

    const cacheKey = `${countryName}-${language}`;
    if (cache[cacheKey]) {
      const cached = { ...cache[cacheKey] };
      if (getRankFromScores[countryName]) cached.globalRank = getRankFromScores[countryName];
      setInsight(cached);
      return;
    }

    setIsLoading(true);
    setInsight(null);

    try {
      const response = await fetch("/api/country-insight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ countryName, countryCode, language }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || t.errorInsight);
      if (getRankFromScores[countryName]) data.globalRank = getRankFromScores[countryName];
      setInsight(data);
      setCache((prev) => ({ ...prev, [cacheKey]: data }));
    } catch (err: any) {
      setError(err.message || t.errorInsight);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseCard = () => {
    setSelectedCountry(null);
    setInsight(null);
    setError(null);
  };

  const handleCloseCompare = () => {
    setCompareCountryA(null);
    setCompareCountryB(null);
    setCompareInsightA(null);
    setCompareInsightB(null);
  };

  const toggleCompareMode = () => {
    if (compareMode) {
      // Exit compare mode
      setCompareMode(false);
      handleCloseCompare();
    } else {
      // Enter compare mode
      setCompareMode(true);
      handleCloseCard();
    }
  };

  // Determine compare status text
  const compareStatusText = compareMode
    ? !compareCountryA ? t.compareSelect1
      : !compareCountryB ? `${compareCountryA} ✓ — ${t.compareSelect2}`
        : `${compareCountryA} vs ${compareCountryB}`
    : "";

  return (
    <div className="min-h-screen bg-[var(--color-luxury-bg)] text-white font-sans selection:bg-[var(--color-luxury-accent)] selection:text-black">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 mix-blend-overlay" />
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-black/80 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/80 to-transparent" />
      </div>

      {/* Language Toggle */}
      <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 flex items-center gap-1.5 sm:gap-2 bg-black/40 backdrop-blur-md p-1 rounded-full border border-white/10">
        <button onClick={() => setLanguage('tr')}
          className={`px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-medium transition-colors ${language === 'tr' ? 'bg-white/20 text-white' : 'text-white/50 hover:text-white'}`}>
          TR
        </button>
        <button onClick={() => setLanguage('en')}
          className={`px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-medium transition-colors ${language === 'en' ? 'bg-white/20 text-white' : 'text-white/50 hover:text-white'}`}>
          EN
        </button>
      </div>

      {/* Main Content */}
      <main className="relative z-10">
        <Hero onExplore={handleExplore} t={t} />

        <AnimatePresence>
          {showMap && (
            <motion.section
              ref={mapRef}
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative min-h-[100dvh] w-full flex flex-col items-center justify-center py-0 sm:py-20 px-0 sm:px-4"
            >
              <div className="absolute top-3 sm:top-12 left-1/2 -translate-x-1/2 text-center z-20 pointer-events-none w-full px-4">
                <h2 className="text-[9px] sm:text-sm tracking-[0.2em] sm:tracking-[0.4em] text-white/40 font-medium mb-0.5 sm:mb-2">
                  {t.mapTitle}
                </h2>
                <p className="text-white/60 font-light text-xs sm:text-lg">
                  {t.mapDesc}
                </p>
                {isScoring && (
                  <div className="mt-2 sm:mt-4 inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1 sm:py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-[var(--color-luxury-accent)] border-t-transparent rounded-full animate-spin" />
                    <span className="text-[10px] sm:text-sm text-white/70">{t.analyzing}</span>
                  </div>
                )}
              </div>

              {/* Compare mode toggle + status */}
              <div className="absolute top-3 sm:top-6 left-3 sm:left-6 z-30 flex flex-col gap-2">
                <button
                  onClick={toggleCompareMode}
                  className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[10px] sm:text-xs font-semibold tracking-wider transition-all ${compareMode
                      ? 'bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#d4af37]'
                      : 'bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10'
                    }`}
                >
                  {compareMode ? (
                    <>
                      <X className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      {t.viewMode}
                    </>
                  ) : (
                    <>
                      <GitCompareArrows className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      {t.compareMode}
                    </>
                  )}
                </button>

                {compareMode && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-black/60 backdrop-blur-md border border-[#d4af37]/20 rounded-xl px-3 py-2 text-[10px] sm:text-xs text-white/60 max-w-[200px] sm:max-w-none"
                  >
                    {compareStatusText}
                  </motion.div>
                )}
              </div>

              <div className="w-full max-w-[1400px] h-[100dvh] sm:h-[80vh] md:h-[85vh] relative z-10">
                <WorldMap
                  selectedCountry={compareMode ? (compareCountryB || compareCountryA) : selectedCountry}
                  onCountryClick={handleCountryClick}
                  globalScores={globalScores}
                  scoreText={t.scoreText}
                />
              </div>

              {/* Normal insight card (non-compare mode) */}
              {!compareMode && (
                <CountryInsightCard
                  insight={insight}
                  isLoading={isLoading}
                  error={error}
                  onClose={handleCloseCard}
                  t={t}
                />
              )}

              {/* Compare card */}
              {compareMode && (
                <CompareCard
                  countryA={compareInsightA}
                  countryB={compareInsightB}
                  isLoadingA={compareLoadingA}
                  isLoadingB={compareLoadingB}
                  onClose={handleCloseCompare}
                  t={t}
                />
              )}
            </motion.section>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
