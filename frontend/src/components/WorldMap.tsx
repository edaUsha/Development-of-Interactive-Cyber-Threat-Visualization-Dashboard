import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ThreatData } from "@/data/mockThreats";

interface WorldMapProps {
  threats: ThreatData[];
}

// Simplified mercator projection
function project(lat: number, lng: number, w: number, h: number): [number, number] {
  const x = ((lng + 180) / 360) * w;
  const latRad = (lat * Math.PI) / 180;
  const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
  const y = h / 2 - (mercN / Math.PI) * (h / 2) * 0.8;
  return [x, y];
}

const severityColors: Record<string, string> = {
  critical: 'hsl(0, 72%, 55%)',
  high: 'hsl(20, 80%, 55%)',
  medium: 'hsl(45, 93%, 58%)',
  low: 'hsl(142, 70%, 45%)',
};

// Simplified world outline paths (continents)
const WORLD_PATHS = [
  // North America
  "M60,95 L80,70 L120,65 L155,70 L165,85 L155,110 L140,125 L120,130 L100,140 L85,135 L70,120 L60,105Z",
  // South America
  "M120,155 L135,150 L150,160 L155,180 L150,210 L140,235 L125,250 L115,240 L110,215 L105,190 L110,170Z",
  // Europe
  "M270,65 L285,55 L310,55 L330,60 L340,70 L335,85 L320,90 L305,85 L290,80 L275,75Z",
  // Africa
  "M270,105 L295,95 L320,100 L340,110 L345,130 L340,160 L325,185 L305,195 L285,190 L270,170 L265,145 L260,120Z",
  // Asia
  "M340,50 L380,35 L430,40 L470,50 L490,60 L500,80 L490,100 L470,110 L440,115 L410,110 L380,100 L355,85 L340,70Z",
  // Australia
  "M440,180 L470,175 L495,180 L505,195 L500,210 L480,215 L455,210 L440,195Z",
];

const WorldMap = ({ threats }: WorldMapProps) => {
  const [hoveredThreat, setHoveredThreat] = useState<ThreatData | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const W = 560;
  const H = 300;

  const attackLines = useMemo(() => {
    return threats.slice(0, 20).map((t) => {
      const [x1, y1] = project(t.attackerCoords[0], t.attackerCoords[1], W, H);
      const [x2, y2] = project(t.targetCoords[0], t.targetCoords[1], W, H);
      const mx = (x1 + x2) / 2;
      const my = Math.min(y1, y2) - 30 - Math.random() * 20;
      return { ...t, x1, y1, x2, y2, mx, my };
    });
  }, [threats]);

  return (
    <div className="cyber-card p-4 relative overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold" style={{ color: '#e9d5ff' }}>Global Threat Map</h2>
        <div className="flex items-center gap-3 text-[10px]">
          {Object.entries(severityColors).map(([level, color]) => (
            <div key={level} className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
              <span className="capitalize" style={{ color: '#a78bfa' }}>{level}</span>
            </div>
          ))}
        </div>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto"
        style={{ minHeight: 280 }}
      >
        {/* Grid */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#4c1d9530" strokeWidth="0.3" />
          </pattern>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <rect width={W} height={H} fill="#0f0a1e" />
        <rect width={W} height={H} fill="url(#grid)" />

        {/* Continents */}
        {WORLD_PATHS.map((d, i) => (
          <path key={i} d={d} fill="#2d1b69" stroke="#4c1d9540" strokeWidth="0.5" fillOpacity="0.7" />
        ))}

        {/* Attack Lines */}
        {attackLines.map((a) => (
          <g key={a.id}>
            <path
              d={`M ${a.x1} ${a.y1} Q ${a.mx} ${a.my} ${a.x2} ${a.y2}`}
              fill="none"
              stroke={severityColors[a.severity]}
              strokeWidth="1"
              strokeOpacity="0.6"
              className="attack-line"
              filter="url(#glow)"
            />
            {/* Origin dot */}
            <circle cx={a.x1} cy={a.y1} r="3" fill={severityColors[a.severity]} fillOpacity="0.8" filter="url(#glow)" />
            {/* Target dot */}
            <circle cx={a.x2} cy={a.y2} r="2.5" fill="#c4b5fd" fillOpacity="0.7" />
            {/* Invisible hover area */}
            <circle
              cx={a.x1}
              cy={a.y1}
              r="10"
              fill="transparent"
              className="cursor-pointer"
              onMouseEnter={(e) => {
                setHoveredThreat(a);
                const rect = (e.target as SVGElement).closest('svg')!.getBoundingClientRect();
                setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
              }}
              onMouseLeave={() => setHoveredThreat(null)}
            />
          </g>
        ))}

        {/* Pulsing active attacks */}
        {attackLines.slice(0, 5).map((a) => (
          <circle key={`pulse-${a.id}`} cx={a.x1} cy={a.y1} r="3" fill="none" stroke={severityColors[a.severity]} strokeWidth="1">
            <animate attributeName="r" from="3" to="12" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.6" to="0" dur="2s" repeatCount="indefinite" />
          </circle>
        ))}
      </svg>

      {/* Tooltip */}
      <AnimatePresence>
        {hoveredThreat && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute z-10 rounded-lg p-3 text-xs pointer-events-none max-w-[200px]"
            style={{
              left: tooltipPos.x + 10,
              top: tooltipPos.y - 10,
              background: 'rgba(26, 15, 60, 0.95)',
              border: '1px solid #7c3aed50',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 8px 32px rgba(76, 29, 149, 0.4)',
            }}
          >
            <div className="space-y-1 font-mono">
              <div><span style={{ color: '#a78bfa' }}>Attacker:</span> <span className="text-destructive">{hoveredThreat.attackerIp}</span></div>
              <div><span style={{ color: '#a78bfa' }}>Target:</span> <span style={{ color: '#c4b5fd' }}>{hoveredThreat.targetIp}</span></div>
              <div><span style={{ color: '#a78bfa' }}>Country:</span> <span style={{ color: '#e9d5ff' }}>{hoveredThreat.country} → {hoveredThreat.targetCountry}</span></div>
              <div><span style={{ color: '#a78bfa' }}>Type:</span> <span style={{ color: '#e9d5ff' }}>{hoveredThreat.attackType}</span></div>
              <div><span style={{ color: '#a78bfa' }}>Port:</span> <span style={{ color: '#e9d5ff' }}>{hoveredThreat.port}</span></div>
              <div><span style={{ color: '#a78bfa' }}>Severity:</span> <span className={`severity-${hoveredThreat.severity} font-bold uppercase`}>{hoveredThreat.severity}</span></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WorldMap;
