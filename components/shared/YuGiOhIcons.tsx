import React from 'react';

export type YuGiOhAttr = 'LIGHT' | 'DARK' | 'EARTH' | 'WATER' | 'FIRE' | 'WIND' | 'DIVINE' | 'SPELL' | 'TRAP';

interface AttributeIconProps {
  attr: YuGiOhAttr | string;
  size?: number | string;
  className?: string;
}

export function YuGiOhAttributeIcon({ attr, size = 32, className = '' }: AttributeIconProps) {
  const norm = (attr || 'LIGHT').toUpperCase().trim();
  const style = { width: size, height: size };

  // Mapping attribute to Kanji & Colors
  const attrData: Record<string, { kanji: string; grad: [string, string, string]; border: string; textGrad: string }> = {
    LIGHT: { kanji: '光', grad: ['#fef08a', '#eab308', '#854d0e'], border: '#fef9c3', textGrad: '#ffffff' },
    DARK: { kanji: '闇', grad: ['#d8b4fe', '#7e22ce', '#3b0764'], border: '#f3e8ff', textGrad: '#ffffff' },
    EARTH: { kanji: '地', grad: ['#d97706', '#92400e', '#451a03'], border: '#fde68a', textGrad: '#ffffff' },
    WATER: { kanji: '水', grad: ['#38bdf8', '#0284c7', '#082f49'], border: '#bae6fd', textGrad: '#ffffff' },
    FIRE: { kanji: '炎', grad: ['#fb923c', '#dc2626', '#7f1d1d'], border: '#ffedd5', textGrad: '#ffffff' },
    WIND: { kanji: '風', grad: ['#4ade80', '#16a34a', '#064e3b'], border: '#bbf7d0', textGrad: '#ffffff' },
    DIVINE: { kanji: '神', grad: ['#fde047', '#ca8a04', '#713f12'], border: '#fef08a', textGrad: '#ffffff' },
    SPELL: { kanji: '魔', grad: ['#2dd4bf', '#0f766e', '#134e4a'], border: '#99f6e4', textGrad: '#ffffff' },
    TRAP: { kanji: '罠', grad: ['#f472b6', '#be185d', '#701a75'], border: '#fbcfe8', textGrad: '#ffffff' },
  };

  const current = attrData[norm] || attrData['LIGHT'];

  return (
    <svg viewBox="0 0 100 100" style={style} className={`inline-block drop-shadow-md select-none ${className}`}>
      <defs>
        <radialGradient id={`attrGrad_${norm}`} cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor={current.grad[0]} />
          <stop offset="60%" stopColor={current.grad[1]} />
          <stop offset="100%" stopColor={current.grad[2]} />
        </radialGradient>
        <filter id={`attrGlow_${norm}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#000" floodOpacity="0.8" />
        </filter>
      </defs>
      {/* Outer Ring */}
      <circle cx="50" cy="50" r="48" fill="#111827" stroke={current.border} strokeWidth="3" />
      <circle cx="50" cy="50" r="43" fill={`url(#attrGrad_${norm})`} />
      {/* Inner Highlight Ring */}
      <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
      {/* Kanji Character with Kanji Gothic Calligraphy */}
      <text
        x="50"
        y="66"
        textAnchor="middle"
        fill="#ffffff"
        fontFamily="'Zen Kaku Gothic New', 'Noto Sans TC', sans-serif"
        fontWeight="900"
        fontSize="52"
        filter={`url(#attrGlow_${norm})`}
        letterSpacing="-2"
      >
        {current.kanji}
      </text>
    </svg>
  );
}

// Yu-Gi-Oh Monster Level Star (Red Orb with Yellow Star)
export function YuGiOhLevelStar({ size = 18 }: { size?: number }) {
  return (
    <svg viewBox="0 0 100 100" style={{ width: size, height: size }} className="inline-block drop-shadow select-none">
      <defs>
        <radialGradient id="lvlStarGrad" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#ff7a18" />
          <stop offset="50%" stopColor="#dc2626" />
          <stop offset="100%" stopColor="#7f1d1d" />
        </radialGradient>
        <radialGradient id="starInnerGrad" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#fffbeb" />
          <stop offset="60%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#d97706" />
        </radialGradient>
      </defs>
      {/* Outer red sphere */}
      <circle cx="50" cy="50" r="48" fill="#450a0a" stroke="#ca8a04" strokeWidth="2" />
      <circle cx="50" cy="50" r="44" fill="url(#lvlStarGrad)" />
      {/* 5-pointed Star inside */}
      <polygon
        points="50,15 61,38 86,38 66,54 73,78 50,64 27,78 34,54 14,38 39,38"
        fill="url(#starInnerGrad)"
        stroke="#78350f"
        strokeWidth="2"
      />
    </svg>
  );
}

// Yu-Gi-Oh Xyz Rank Star (Black Orb with Gold Star, aligned Left)
export function YuGiOhRankStar({ size = 18 }: { size?: number }) {
  return (
    <svg viewBox="0 0 100 100" style={{ width: size, height: size }} className="inline-block drop-shadow select-none">
      <defs>
        <radialGradient id="rankStarGrad" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="60%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#020617" />
        </radialGradient>
        <radialGradient id="goldStarGrad" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="60%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#854d0e" />
        </radialGradient>
      </defs>
      {/* Black sphere */}
      <circle cx="50" cy="50" r="48" fill="#000000" stroke="#facc15" strokeWidth="2" />
      <circle cx="50" cy="50" r="44" fill="url(#rankStarGrad)" />
      {/* Gold 5-pointed Star */}
      <polygon
        points="50,15 61,38 86,38 66,54 73,78 50,64 27,78 34,54 14,38 39,38"
        fill="url(#goldStarGrad)"
        stroke="#451a03"
        strokeWidth="2"
      />
    </svg>
  );
}

// Konami Official Security Hologram Seal (Eye of Anubis 3D Square Stamp)
export function YuGiOhHologramStamp({ gold = true, size = 20 }: { gold?: boolean; size?: number }) {
  return (
    <div
      style={{ width: size, height: size }}
      className={`relative rounded-[1px] overflow-hidden border border-amber-400/80 shadow-md ${
        gold
          ? 'bg-gradient-to-br from-amber-200 via-yellow-400 to-amber-600'
          : 'bg-gradient-to-br from-slate-200 via-slate-400 to-slate-600'
      }`}
      title="Official Security Hologram"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/60 via-transparent to-black/30 animate-pulse" />
      {/* Eye of Anubis miniature silhouette */}
      <svg viewBox="0 0 100 100" className="w-full h-full p-0.5 opacity-90">
        <circle cx="50" cy="50" r="42" fill="none" stroke="#78350f" strokeWidth="4" />
        <path d="M22 50 Q50 25 78 50 Q50 75 22 50 Z" fill="none" stroke="#78350f" strokeWidth="5" />
        <circle cx="50" cy="50" r="10" fill="#78350f" />
        <path d="M50 70 L50 86 M38 65 L28 80 M62 65 L72 80" stroke="#78350f" strokeWidth="4" strokeLinecap="round" />
      </svg>
    </div>
  );
}
