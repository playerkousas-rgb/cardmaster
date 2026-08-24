import React from 'react';

export type OPAttribute = '斬' | '打' | '射' | '特' | '知' | 'slash' | 'strike' | 'ranged' | 'special' | 'wisdom';

interface OPAttrBadgeProps {
  attr: OPAttribute | string;
  size?: number;
  className?: string;
}

export function OPAttributeBadge({ attr, size = 26, className = '' }: OPAttrBadgeProps) {
  const norm = (attr || '斬').toLowerCase().trim();
  let label = '斬';
  let bgGrad = 'from-amber-400 to-amber-700';
  let iconSvg = (
    // Swords
    <path d="M30 70 L70 30 M65 25 L75 35 M25 75 L35 65 M30 70 L22 78 M70 30 L78 22" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" />
  );

  if (['打', 'strike', 'punch'].includes(norm)) {
    label = '打';
    bgGrad = 'from-red-500 to-red-800';
    iconSvg = (
      // Fist
      <circle cx="50" cy="50" r="22" fill="#ffffff" />
    );
  } else if (['射', 'ranged', 'shoot', 'gun'].includes(norm)) {
    label = '射';
    bgGrad = 'from-blue-500 to-blue-800';
    iconSvg = (
      // Crosshair / arrow
      <path d="M50 20 L50 80 M20 50 L80 50 M50 35 A15 15 0 0 1 50 65 A15 15 0 0 1 50 35" fill="none" stroke="#ffffff" strokeWidth="5" />
    );
  } else if (['特', 'special', 'magic'].includes(norm)) {
    label = '特';
    bgGrad = 'from-purple-500 to-purple-800';
    iconSvg = (
      // Sparkle
      <polygon points="50,20 58,42 80,50 58,58 50,80 42,58 20,50 42,42" fill="#ffffff" />
    );
  } else if (['知', 'wisdom', 'mind', 'intel'].includes(norm)) {
    label = '知';
    bgGrad = 'from-emerald-500 to-emerald-800';
    iconSvg = (
      // Book / eye
      <circle cx="50" cy="50" r="18" fill="none" stroke="#ffffff" strokeWidth="6" />
    );
  }

  return (
    <div
      style={{ width: size, height: size }}
      className={`relative inline-flex items-center justify-center rounded-full bg-gradient-to-br ${bgGrad} border-2 border-amber-300 shadow-md ${className}`}
      title={`Attribute: ${label}`}
    >
      <span className="text-[11px] font-black text-white font-sans drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
        {label}
      </span>
    </div>
  );
}

// One Piece Cost Hexagon Badge
export function OPCostBadge({ cost, size = 44 }: { cost: string | number; size?: number }) {
  return (
    <div
      style={{ width: size, height: size }}
      className="relative flex flex-col items-center justify-center select-none filter drop-shadow-[0_3px_5px_rgba(0,0,0,0.6)]"
    >
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id="opCostGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="40%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#854d0e" />
          </linearGradient>
        </defs>
        <polygon
          points="50,3 93,25 93,75 50,97 7,75 7,25"
          fill="url(#opCostGrad)"
          stroke="#ffffff"
          strokeWidth="3"
        />
        <polygon
          points="50,8 87,28 87,72 50,92 13,72 13,28"
          fill="#1e1b18"
          stroke="#fde047"
          strokeWidth="2"
        />
      </svg>
      <span className="relative z-10 text-[8px] font-black uppercase text-amber-300 tracking-wider leading-none mt-1">
        COST
      </span>
      <span className="relative z-10 text-xl font-black font-bebas text-white leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
        {cost}
      </span>
    </div>
  );
}

// One Piece Power Shield Badge
export function OPPowerBadge({ power }: { power: string | number }) {
  return (
    <div className="relative inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-red-700 via-red-600 to-amber-700 rounded-full border-2 border-amber-300 shadow-[0_2px_8px_rgba(0,0,0,0.7)] select-none">
      <span className="text-[9px] font-black uppercase tracking-wider text-amber-200">POWER</span>
      <span className="text-base font-black font-bebas text-white tracking-wide drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
        {power}
      </span>
    </div>
  );
}

// One Piece Counter Badge
export function OPCounterBadge({ counter = '+1000' }: { counter?: string }) {
  if (!counter || counter === '0' || counter === 'none') return null;
  return (
    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-900/90 border border-amber-400/80 shadow-md">
      <span className="text-[8px] font-black text-amber-300 uppercase">COUNTER</span>
      <span className="text-xs font-black font-bebas text-amber-100">{counter}</span>
    </div>
  );
}
