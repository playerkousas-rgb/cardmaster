import React from 'react';

export type FoilType = 
  | 'none'
  | 'rainbow'
  | 'secret-rare'
  | 'cosmic'
  | 'qcse-25th'
  | 'gold-etched'
  | 'ghost-rare';

interface FoilLayerProps {
  type: FoilType;
  opacity?: number;
  pointerX?: number; // 0 to 100
  pointerY?: number; // 0 to 100
  isHovered?: boolean;
}

export function FoilLayer({
  type = 'rainbow',
  opacity = 1,
  pointerX = 50,
  pointerY = 50,
  isHovered = false,
}: FoilLayerProps) {
  if (type === 'none') return null;

  // Calculate dynamic angle and gradient positions
  const angle = 115 + (pointerX - 50) * 0.8;
  const flareX = pointerX;
  const flareY = pointerY;

  return (
    <div
      className="absolute inset-0 pointer-events-none rounded-[inherit] overflow-hidden z-25 transition-opacity duration-300"
      style={{ opacity }}
    >
      {/* 1. Base Prismatic Sheen */}
      {type === 'rainbow' && (
        <div
          className="absolute inset-0 mix-blend-color-dodge transition-all duration-75"
          style={{
            background: `
              radial-gradient(circle at ${flareX}% ${flareY}%, rgba(255,255,255,0.7) 0%, rgba(255,215,0,0.4) 15%, rgba(255,0,128,0.3) 30%, rgba(0,255,255,0.3) 50%, transparent 75%),
              linear-gradient(${angle}deg, transparent 15%, rgba(255,0,0,0.2) 25%, rgba(255,255,0,0.25) 40%, rgba(0,255,0,0.25) 55%, rgba(0,255,255,0.25) 70%, rgba(138,43,226,0.2) 85%, transparent 100%)
            `,
          }}
        />
      )}

      {/* 2. Secret Rare Lattice / Cross-Hatch */}
      {type === 'secret-rare' && (
        <>
          <div
            className="absolute inset-0 mix-blend-color-dodge opacity-80"
            style={{
              backgroundImage: `
                repeating-linear-gradient(45deg, rgba(255,255,255,0.15) 0px, rgba(255,255,255,0.15) 2px, transparent 2px, transparent 6px),
                repeating-linear-gradient(-45deg, rgba(255,255,255,0.15) 0px, rgba(255,255,255,0.15) 2px, transparent 2px, transparent 6px)
              `,
            }}
          />
          <div
            className="absolute inset-0 mix-blend-screen"
            style={{
              background: `radial-gradient(circle at ${flareX}% ${flareY}%, rgba(255,255,255,0.8) 0%, rgba(236,72,153,0.4) 25%, rgba(59,130,246,0.4) 50%, transparent 80%)`,
            }}
          />
        </>
      )}

      {/* 3. Cosmic Galaxy Sparkle */}
      {type === 'cosmic' && (
        <>
          <div
            className="absolute inset-0 mix-blend-color-dodge opacity-90"
            style={{
              backgroundImage: `
                radial-gradient(circle at 20% 30%, rgba(255,255,255,0.9) 1px, transparent 2px),
                radial-gradient(circle at 75% 20%, rgba(255,255,255,0.9) 1.5px, transparent 3px),
                radial-gradient(circle at 40% 70%, rgba(255,255,255,0.8) 1px, transparent 2px),
                radial-gradient(circle at 85% 80%, rgba(255,255,255,0.9) 2px, transparent 3px),
                radial-gradient(circle at 10% 85%, rgba(255,255,255,0.7) 1px, transparent 2px),
                radial-gradient(circle at 60% 45%, rgba(255,255,255,0.85) 1.5px, transparent 3px)
              `,
              backgroundSize: '80px 80px',
            }}
          />
          <div
            className="absolute inset-0 mix-blend-overlay"
            style={{
              background: `radial-gradient(circle at ${flareX}% ${flareY}%, rgba(168,85,247,0.6) 0%, rgba(56,189,248,0.4) 40%, transparent 75%)`,
            }}
          />
        </>
      )}

      {/* 4. 25th Quarter Century Secret Rare (QCSE Crushed Diamond) */}
      {type === 'qcse-25th' && (
        <>
          <div
            className="absolute inset-0 mix-blend-color-dodge opacity-85"
            style={{
              backgroundImage: `
                radial-gradient(ellipse at center, rgba(254,240,138,0.4) 0%, transparent 70%),
                repeating-linear-gradient(60deg, rgba(255,255,255,0.2) 0px, rgba(255,255,255,0.2) 1px, transparent 1px, transparent 4px),
                repeating-linear-gradient(120deg, rgba(255,255,255,0.2) 0px, rgba(255,255,255,0.2) 1px, transparent 1px, transparent 4px)
              `,
            }}
          />
          <div
            className="absolute inset-0 mix-blend-hard-light"
            style={{
              background: `radial-gradient(circle at ${flareX}% ${flareY}%, rgba(255,255,255,0.9) 0%, rgba(234,179,8,0.5) 20%, rgba(168,85,247,0.4) 45%, transparent 75%)`,
            }}
          />
        </>
      )}

      {/* 5. Gold Etched Foil */}
      {type === 'gold-etched' && (
        <div
          className="absolute inset-0 mix-blend-color-dodge opacity-75"
          style={{
            background: `
              radial-gradient(circle at ${flareX}% ${flareY}%, rgba(255,240,180,0.9) 0%, rgba(217,119,6,0.6) 30%, transparent 70%),
              linear-gradient(${angle}deg, transparent 20%, rgba(254,240,138,0.5) 45%, rgba(245,158,11,0.7) 50%, rgba(254,240,138,0.5) 55%, transparent 80%)
            `,
          }}
        />
      )}

      {/* 6. Ghost Rare */}
      {type === 'ghost-rare' && (
        <div
          className="absolute inset-0 mix-blend-color-dodge opacity-90"
          style={{
            background: `
              radial-gradient(circle at ${flareX}% ${flareY}%, rgba(255,255,255,0.95) 0%, rgba(203,213,225,0.6) 35%, transparent 75%),
              linear-gradient(${angle}deg, transparent 30%, rgba(255,255,255,0.6) 50%, transparent 70%)
            `,
            filter: 'contrast(1.2)',
          }}
        />
      )}

      {/* Subtle edge light reflection */}
      <div
        className="absolute inset-0 border border-white/30 rounded-[inherit] mix-blend-overlay"
        style={{
          background: `linear-gradient(${angle}deg, rgba(255,255,255,0.4) 0%, transparent 40%, rgba(255,255,255,0.3) 100%)`,
        }}
      />
    </div>
  );
}
