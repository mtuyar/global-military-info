import React, { useState } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { motion } from "framer-motion";
import { Plus, Minus, Maximize } from "lucide-react";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface WorldMapProps {
  onCountryClick: (countryName: string, countryCode: string) => void;
  selectedCountry: string | null;
  globalScores?: Record<string, number>;
  scoreText?: string;
}

export default function WorldMap({ onCountryClick, selectedCountry, globalScores = {}, scoreText = "Score" }: WorldMapProps) {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [position, setPosition] = useState({ coordinates: [0, 20] as [number, number], zoom: 1 });
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);

  function handleZoomIn() {
    if (position.zoom >= 4) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom * 1.5 }));
  }

  function handleZoomOut() {
    if (position.zoom <= 1) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom / 1.5 }));
  }

  function handleReset() {
    setPosition({ coordinates: [0, 20], zoom: 1 });
  }

  function handleMoveEnd(position: { coordinates: [number, number]; zoom: number }) {
    setPosition(position);
  }

  return (
    <div className="w-full h-full relative overflow-hidden bg-transparent flex items-center justify-center touch-pan-x touch-pan-y">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="w-full h-full max-w-7xl mx-auto"
      >
        <ComposableMap
          projectionConfig={{
            scale: 140,
          }}
          className="w-full h-full"
        >
          <ZoomableGroup
            zoom={position.zoom}
            center={position.coordinates}
            onMoveEnd={handleMoveEnd}
            maxZoom={4}
          >
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const isSelected = selectedCountry === geo.properties.name;
                  const isHovered = hoveredCountry === geo.properties.name;
                  const score = globalScores[geo.properties.name];

                  let defaultFill = "rgba(255,255,255,0.15)";
                  let hoverFill = "rgba(255,255,255,0.25)";

                  if (score !== undefined) {
                    const opacity = 0.1 + (score / 100) * 0.8;
                    defaultFill = `rgba(212, 175, 55, ${opacity})`;
                    hoverFill = `rgba(212, 175, 55, ${Math.min(1, opacity + 0.2)})`;
                  }

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={(e) => {
                        setHoveredCountry(geo.properties.name);
                        setTooltip({
                          text: `${geo.properties.name}${score !== undefined ? ` - ${scoreText}: ${score}/100` : ''}`,
                          x: e.clientX,
                          y: e.clientY
                        });
                      }}
                      onMouseMove={(e) => {
                        setTooltip({
                          text: `${geo.properties.name}${score !== undefined ? ` - ${scoreText}: ${score}/100` : ''}`,
                          x: e.clientX,
                          y: e.clientY
                        });
                      }}
                      onMouseLeave={() => {
                        setHoveredCountry(null);
                        setTooltip(null);
                      }}
                      onClick={() => {
                        onCountryClick(geo.properties.name, geo.id);
                      }}
                      style={{
                        default: {
                          fill: isSelected ? "var(--color-luxury-accent)" : defaultFill,
                          stroke: isSelected ? "var(--color-luxury-accent)" : "rgba(255,255,255,0.3)",
                          strokeWidth: 0.5,
                          outline: "none",
                          transition: "all 0.3s ease",
                        },
                        hover: {
                          fill: isSelected ? "var(--color-luxury-accent)" : hoverFill,
                          stroke: isSelected ? "var(--color-luxury-accent)" : "rgba(255,255,255,0.5)",
                          strokeWidth: 1,
                          outline: "none",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                        },
                        pressed: {
                          fill: "var(--color-luxury-accent)",
                          stroke: "var(--color-luxury-accent)",
                          strokeWidth: 1,
                          outline: "none",
                        },
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
      </motion.div>

      {/* Map overlay gradient for depth */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_transparent_40%,_var(--color-luxury-bg)_100%)]" />

      {/* Tooltip - desktop only */}
      {tooltip && (
        <div
          className="fixed z-50 pointer-events-none bg-black/80 text-white px-3 py-1.5 rounded text-sm border border-white/10 backdrop-blur-sm shadow-xl hidden md:block"
          style={{ left: tooltip.x + 15, top: tooltip.y + 15 }}
        >
          {tooltip.text}
        </div>
      )}

      {/* Zoom Controls */}
      <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-30 flex flex-col gap-1.5 sm:gap-2">
        <div className="glass-panel rounded-xl overflow-hidden flex flex-col shadow-lg">
          <button
            onClick={handleZoomIn}
            className="p-2.5 sm:p-3 bg-white/5 hover:bg-white/10 active:bg-white/15 transition-colors border-b border-white/10"
            title="Zoom In"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-white/80" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2.5 sm:p-3 bg-white/5 hover:bg-white/10 active:bg-white/15 transition-colors border-b border-white/10"
            title="Zoom Out"
          >
            <Minus className="w-4 h-4 sm:w-5 sm:h-5 text-white/80" />
          </button>
          <button
            onClick={handleReset}
            className="p-2.5 sm:p-3 bg-white/5 hover:bg-white/10 active:bg-white/15 transition-colors"
            title="Reset Map"
          >
            <Maximize className="w-4 h-4 sm:w-5 sm:h-5 text-white/80" />
          </button>
        </div>
      </div>
    </div>
  );
}
