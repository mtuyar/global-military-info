import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Hero from "./components/Hero";
import WorldMap from "./components/WorldMap";
import CountryInsightCard from "./components/CountryInsightCard";
import { CountryInsight } from "./types";

const translations = {
  tr: {
    heroSub: "Premium Bir Keşif Deneyimi",
    heroTitle1: "Dünyayı",
    heroTitle2: "Keşfedin",
    heroDesc: "Herhangi bir ülkenin askeri kapasitesini ve savunma stratejilerini ortaya çıkarın. Küresel silahlı kuvvetler arasında yapay zeka destekli bir yolculuk.",
    heroBtn: "Yolculuğa Başla",
    mapTitle: "Küresel Savunma Atlası",
    mapDesc: "Askeri kapasitesini görmek için bir ülke seçin.",
    analyzing: "Yapay zeka küresel savunma puanlarını analiz ediyor...",
    errorFetch: "Küresel savunma puanları alınamadı.",
    errorInsight: "Bu ülke analiz edilemedi. Lütfen tekrar deneyin.",
    scoreText: "Puan",
    cardErrorTitle: "Keşif Başarısız",
    cardFooter: "Yapay Zeka Tarafından Hazırlandı",
  },
  en: {
    heroSub: "A Premium Discovery Experience",
    heroTitle1: "Explore the",
    heroTitle2: "World",
    heroDesc: "Uncover the military capabilities and defense strategies of any nation. An AI-curated journey through global armed forces.",
    heroBtn: "Begin Journey",
    mapTitle: "Global Defense Atlas",
    mapDesc: "Select a destination to reveal its military capabilities.",
    analyzing: "AI is analyzing global defense scores...",
    errorFetch: "Failed to analyze global defense scores.",
    errorInsight: "Failed to analyze this country. Please try again.",
    scoreText: "Score",
    cardErrorTitle: "Discovery Failed",
    cardFooter: "AI Curated Insight",
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

  const mapRef = useRef<HTMLDivElement>(null);

  const fetchGlobalScores = async () => {
    setIsScoring(true);
    setError(null);
    try {
      const response = await fetch("/api/global-defense-scores");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t.errorFetch);
      }

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
    setTimeout(() => {
      mapRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);

    if (Object.keys(globalScores).length === 0 && !error) {
      fetchGlobalScores();
    }
  };

  const handleCountryClick = async (countryName: string, countryCode: string) => {
    if (selectedCountry === countryName) return;

    setSelectedCountry(countryName);
    setError(null);

    const cacheKey = `${countryName}-${language}`;

    if (cache[cacheKey]) {
      setInsight(cache[cacheKey]);
      return;
    }

    setIsLoading(true);
    setInsight(null);

    try {
      const response = await fetch("/api/country-insight", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ countryName, countryCode, language }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t.errorInsight);
      }

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

  return (
    <div className="min-h-screen bg-[var(--color-luxury-bg)] text-white font-sans selection:bg-[var(--color-luxury-accent)] selection:text-black">
      {/* Fixed Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 mix-blend-overlay" />
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-black/80 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/80 to-transparent" />
      </div>

      {/* Language Toggle */}
      <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 flex items-center gap-1.5 sm:gap-2 bg-black/40 backdrop-blur-md p-1 rounded-full border border-white/10">
        <button
          onClick={() => setLanguage('tr')}
          className={`px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-medium transition-colors ${language === 'tr' ? 'bg-white/20 text-white' : 'text-white/50 hover:text-white'}`}
        >
          TR
        </button>
        <button
          onClick={() => setLanguage('en')}
          className={`px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-medium transition-colors ${language === 'en' ? 'bg-white/20 text-white' : 'text-white/50 hover:text-white'}`}
        >
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
                <h2 className="text-[9px] sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.4em] text-white/40 font-medium mb-0.5 sm:mb-2">
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

              <div className="w-full max-w-7xl h-[100dvh] sm:h-[65vh] md:h-[70vh] relative z-10">
                <WorldMap
                  selectedCountry={selectedCountry}
                  onCountryClick={handleCountryClick}
                  globalScores={globalScores}
                  scoreText={t.scoreText}
                />
              </div>

              <CountryInsightCard
                insight={insight}
                isLoading={isLoading}
                error={error}
                onClose={handleCloseCard}
                t={t}
              />
            </motion.section>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
