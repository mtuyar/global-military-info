import React, { useState, useMemo } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup, Marker } from "react-simple-maps";
import { motion } from "framer-motion";
import { Plus, Minus, Maximize } from "lucide-react";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Approximate centroids for labeling top countries
const countryCentroids: Record<string, [number, number]> = {
  "United States of America": [-98, 39],
  "China": [104, 35],
  "Russia": [90, 62],
  "India": [79, 22],
  "United Kingdom": [-3, 54],
  "France": [2, 46],
  "South Korea": [128, 36],
  "Japan": [138, 37],
  "Turkey": [33, 39],
  "Germany": [10, 51],
  "Italy": [12, 43],
  "Egypt": [30, 27],
  "Brazil": [-52, -14],
  "Iran": [53, 33],
  "Australia": [134, -25],
  "Israel": [35, 31.5],
  "Indonesia": [118, -3],
  "Pakistan": [69, 30],
  "Saudi Arabia": [45, 24],
  "Taiwan": [121, 24],
  "Poland": [20, 52],
  "Ukraine": [32, 49],
  "Canada": [-106, 56],
  "Spain": [-4, 40],
  "Thailand": [101, 15],
  "Vietnam": [108, 16],
  "Mexico": [-102, 24],
  "Nigeria": [8, 10],
  "Argentina": [-64, -34],
  "Colombia": [-74, 4],
};

function getScoreColor(score: number): string {
  if (score >= 90) return "rgba(255, 59, 48, 0.85)";
  if (score >= 80) return "rgba(255, 149, 0, 0.80)";
  if (score >= 70) return "rgba(255, 204, 0, 0.75)";
  if (score >= 55) return "rgba(212, 175, 55, 0.60)";
  if (score >= 40) return "rgba(142, 142, 147, 0.50)";
  if (score >= 25) return "rgba(100, 120, 140, 0.40)";
  return "rgba(80, 90, 100, 0.30)";
}

function getScoreHoverColor(score: number): string {
  if (score >= 90) return "rgba(255, 59, 48, 1)";
  if (score >= 80) return "rgba(255, 149, 0, 1)";
  if (score >= 70) return "rgba(255, 204, 0, 0.95)";
  if (score >= 55) return "rgba(212, 175, 55, 0.85)";
  if (score >= 40) return "rgba(142, 142, 147, 0.70)";
  if (score >= 25) return "rgba(100, 120, 140, 0.60)";
  return "rgba(80, 90, 100, 0.50)";
}

function getRankBadgeColor(rank: number): string {
  if (rank === 1) return "#FF3B30";
  if (rank === 2) return "#FF6B35";
  if (rank === 3) return "#FF9500";
  if (rank <= 5) return "#FFCC00";
  if (rank <= 10) return "#d4af37";
  return "#8E8E93";
}

// Check if two label positions are too close at the current zoom
function wouldOverlap(
  coords1: [number, number],
  coords2: [number, number],
  zoom: number
): boolean {
  const dx = (coords1[0] - coords2[0]);
  const dy = (coords1[1] - coords2[1]);
  const dist = Math.sqrt(dx * dx + dy * dy);
  // At low zoom, need more distance. At high zoom, countries are spread out so less needed
  const threshold = 18 / Math.sqrt(zoom);
  return dist < threshold;
}

interface WorldMapProps {
  onCountryClick: (countryName: string, countryCode: string) => void;
  selectedCountry: string | null;
  globalScores?: Record<string, number>;
  scoreText?: string;
  rankedList?: { name: string; rank: number }[];
}

export default function WorldMap({ onCountryClick, selectedCountry, globalScores = {}, scoreText = "Score" }: WorldMapProps) {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [position, setPosition] = useState({ coordinates: [0, 20] as [number, number], zoom: 1 });
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth < 640);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Compute ranked countries from global scores (single source of truth)
  const rankedCountries = useMemo(() => {
    const entries = Object.entries(globalScores);
    if (entries.length === 0) return [];
    return entries
      .sort((a, b) => b[1] - a[1])
      .map(([name, score], index) => ({
        name,
        score,
        rank: index + 1,
        centroid: countryCentroids[name],
      }));
  }, [globalScores]);

  // Determine which badges to show based on zoom level, avoiding overlap
  const visibleBadges = useMemo(() => {
    let maxRank: number;
    if (position.zoom >= 8) maxRank = 50;
    else if (position.zoom >= 5) maxRank = 40;
    else if (position.zoom >= 3) maxRank = 30;
    else if (position.zoom >= 2) maxRank = 25;
    else if (position.zoom >= 1.5) maxRank = 20;
    else maxRank = 15;

    const candidates = rankedCountries
      .filter(c => c.rank <= maxRank && c.centroid)
      .sort((a, b) => a.rank - b.rank);

    const visible: typeof candidates = [];
    for (const c of candidates) {
      const overlaps = visible.some(v =>
        wouldOverlap(v.centroid!, c.centroid!, position.zoom)
      );
      if (!overlaps) {
        visible.push(c);
      }
    }
    return visible;
  }, [rankedCountries, position.zoom]);

  function handleZoomIn() {
    if (position.zoom >= 20) return;
    setPosition((pos) => ({ ...pos, zoom: Math.min(20, pos.zoom * 1.5) }));
  }

  function handleZoomOut() {
    if (position.zoom <= 1) return;
    setPosition((pos) => ({ ...pos, zoom: Math.max(1, pos.zoom / 1.5) }));
  }

  function handleReset() {
    setPosition({ coordinates: [0, 20], zoom: 1 });
  }

  function handleMoveEnd(pos: { coordinates: [number, number]; zoom: number }) {
    setPosition(pos);
  }

  const hasScores = Object.keys(globalScores).length > 0;

  // Badge size scales down aggressively with zoom
  const badgeScale = Math.max(0.35, 0.9 / position.zoom);



  return (
    <div className="w-full h-full relative overflow-hidden bg-transparent flex items-center justify-center touch-pan-x touch-pan-y">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="w-full h-full max-w-[1600px] mx-auto"
      >
        <ComposableMap
          projectionConfig={{
            scale: isMobile ? 200 : 160,
            center: [0, 15],
          }}
          className="w-full h-full"
        >
          <ZoomableGroup
            zoom={position.zoom}
            center={position.coordinates}
            onMoveEnd={handleMoveEnd}
            maxZoom={20}
          >
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="badgeShadow">
                <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodOpacity="0.5" />
              </filter>
            </defs>

            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const countryName = geo.properties.name;
                  const isSelected = selectedCountry === countryName;
                  const score = globalScores[countryName];

                  let defaultFill = "rgba(40, 44, 52, 0.6)";
                  let hoverFill = "rgba(60, 64, 72, 0.8)";
                  let strokeColor = "rgba(255,255,255,0.12)";

                  if (score !== undefined) {
                    defaultFill = getScoreColor(score);
                    hoverFill = getScoreHoverColor(score);
                    strokeColor = score >= 70 ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.15)";
                  }

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={(e) => {
                        setHoveredCountry(countryName);
                        const ranked = rankedCountries.find(r => r.name === countryName);
                        setTooltip({
                          text: `${countryName}${ranked ? ` — #${ranked.rank} (${ranked.score}/100)` : score !== undefined ? ` — ${scoreText}: ${score}/100` : ''}`,
                          x: e.clientX,
                          y: e.clientY
                        });
                      }}
                      onMouseMove={(e) => {
                        const ranked = rankedCountries.find(r => r.name === countryName);
                        setTooltip({
                          text: `${countryName}${ranked ? ` — #${ranked.rank} (${ranked.score}/100)` : score !== undefined ? ` — ${scoreText}: ${score}/100` : ''}`,
                          x: e.clientX,
                          y: e.clientY
                        });
                      }}
                      onMouseLeave={() => {
                        setHoveredCountry(null);
                        setTooltip(null);
                      }}
                      onClick={() => onCountryClick(countryName, geo.id)}
                      style={{
                        default: {
                          fill: isSelected ? "#d4af37" : defaultFill,
                          stroke: isSelected ? "#d4af37" : strokeColor,
                          strokeWidth: isSelected ? 1.5 : 0.4,
                          outline: "none",
                          transition: "all 0.4s ease",
                          filter: isSelected ? "url(#glow)" : "none",
                        },
                        hover: {
                          fill: isSelected ? "#e5c04b" : hoverFill,
                          stroke: isSelected ? "#e5c04b" : "rgba(255,255,255,0.4)",
                          strokeWidth: 1,
                          outline: "none",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                        },
                        pressed: {
                          fill: "#d4af37",
                          stroke: "#d4af37",
                          strokeWidth: 1.5,
                          outline: "none",
                        },
                      }}
                    />
                  );
                })
              }
            </Geographies>

            {/* Rank Markers — zoom-adaptive */}
            {hasScores && visibleBadges.map(({ name, rank, centroid }) => {
              const baseR = rank <= 3 ? 10 : rank <= 5 ? 8.5 : rank <= 10 ? 7 : 6;
              const r = baseR * badgeScale;
              const fontSize = (rank <= 3 ? 9 : rank <= 5 ? 8 : rank <= 10 ? 7 : 6) * badgeScale;

              return (
                <Marker key={name} coordinates={centroid!}>
                  <g
                    style={{ cursor: "pointer", filter: "url(#badgeShadow)" }}
                    onClick={() => onCountryClick(name, "")}
                  >
                    <circle
                      r={r}
                      fill={getRankBadgeColor(rank)}
                      fillOpacity={0.92}
                      stroke="rgba(0,0,0,0.6)"
                      strokeWidth={0.6 * badgeScale}
                    />
                    <text
                      textAnchor="middle"
                      dominantBaseline="central"
                      style={{
                        fontFamily: "Inter, system-ui, sans-serif",
                        fontSize: `${fontSize}px`,
                        fontWeight: 700,
                        fill: rank <= 3 ? "#fff" : "#000",
                        letterSpacing: "-0.5px",
                        pointerEvents: "none",
                      }}
                    >
                      {rank}
                    </text>
                  </g>
                </Marker>
              );
            })}
          </ZoomableGroup>
        </ComposableMap>
      </motion.div>

      {/* Map edge gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_50%,_var(--color-luxury-bg)_100%)]" />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[var(--color-luxury-bg)] to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-12 sm:h-8 bg-gradient-to-b from-[var(--color-luxury-bg)] to-transparent" />
      </div>

      {/* Legend */}
      {hasScores && (
        <div className="absolute bottom-14 left-3 sm:bottom-6 sm:left-6 z-30">
          <div className="glass-panel rounded-xl p-2.5 sm:p-4 shadow-lg">
            <div className="text-[8px] sm:text-[10px] tracking-wider text-white/40 font-medium mb-1.5 sm:mb-2">
              ASKERİ GÜÇ
            </div>
            <div className="flex flex-col gap-1 sm:gap-1.5">
              {[
                { color: "rgba(255, 59, 48, 0.85)", label: "90+" },
                { color: "rgba(255, 149, 0, 0.80)", label: "80-89" },
                { color: "rgba(255, 204, 0, 0.75)", label: "70-79" },
                { color: "rgba(212, 175, 55, 0.60)", label: "55-69" },
                { color: "rgba(142, 142, 147, 0.50)", label: "<55" },
              ].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-1.5 sm:gap-2">
                  <div className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-sm" style={{ backgroundColor: color }} />
                  <span className="text-[8px] sm:text-[10px] text-white/50 font-medium">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tooltip - desktop only */}
      {tooltip && (
        <div
          className="fixed z-50 pointer-events-none hidden md:block"
          style={{ left: tooltip.x + 15, top: tooltip.y + 15 }}
        >
          <div className="bg-black/85 text-white px-4 py-2.5 rounded-xl text-sm border border-white/10 backdrop-blur-xl shadow-2xl">
            <span className="font-medium">{tooltip.text}</span>
          </div>
        </div>
      )}

      {/* Zoom Controls */}
      <div className="absolute bottom-4 right-3 sm:bottom-6 sm:right-6 z-30 flex flex-col gap-1 sm:gap-2">
        <div className="glass-panel rounded-xl overflow-hidden flex flex-col shadow-lg">
          <button
            onClick={handleZoomIn}
            className="p-2 sm:p-3 bg-white/5 hover:bg-white/10 active:bg-white/15 transition-colors border-b border-white/10"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-white/80" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2 sm:p-3 bg-white/5 hover:bg-white/10 active:bg-white/15 transition-colors border-b border-white/10"
          >
            <Minus className="w-4 h-4 sm:w-5 sm:h-5 text-white/80" />
          </button>
          <button
            onClick={handleReset}
            className="p-2 sm:p-3 bg-white/5 hover:bg-white/10 active:bg-white/15 transition-colors"
          >
            <Maximize className="w-4 h-4 sm:w-5 sm:h-5 text-white/80" />
          </button>
        </div>
      </div>
    </div>
  );
}
