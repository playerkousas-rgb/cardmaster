import React from 'react';

export type EnergyType = 
  | 'fire' | 'water' | 'grass' | 'lightning' | 'psychic' 
  | 'fighting' | 'darkness' | 'metal' | 'dragon' | 'fairy' | 'colorless';

interface EnergyIconProps {
  type: EnergyType | string;
  size?: number | string;
  className?: string;
}

export function EnergyIcon({ type, size = 20, className = '' }: EnergyIconProps) {
  const normType = (type || 'colorless').toLowerCase().trim();

  // Normalize Chinese or alias types
  let resolvedType: EnergyType = 'colorless';
  if (['fire', '火', '炎', 'flame'].includes(normType)) resolvedType = 'fire';
  else if (['water', '水', 'aqua'].includes(normType)) resolvedType = 'water';
  else if (['grass', '草', 'leaf', '木'].includes(normType)) resolvedType = 'grass';
  else if (['lightning', 'electric', '電', '雷', 'light'].includes(normType)) resolvedType = 'lightning';
  else if (['psychic', '超能', '超', 'psy'].includes(normType)) resolvedType = 'psychic';
  else if (['fighting', '格鬥', '鬥', 'fight'].includes(normType)) resolvedType = 'fighting';
  else if (['darkness', 'dark', '惡', '暗', '黑'].includes(normType)) resolvedType = 'darkness';
  else if (['metal', 'steel', '鋼', '鐵'].includes(normType)) resolvedType = 'metal';
  else if (['dragon', '龍', '竜'].includes(normType)) resolvedType = 'dragon';
  else if (['fairy', '妖精', '妖'].includes(normType)) resolvedType = 'fairy';
  else resolvedType = 'colorless';

  const iconStyle = { width: size, height: size };

  switch (resolvedType) {
    case 'fire':
      return (
        <svg viewBox="0 0 100 100" style={iconStyle} className={`inline-block drop-shadow ${className}`}>
          <defs>
            <radialGradient id="fireGrad" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#ff7a18" />
              <stop offset="60%" stopColor="#e52d27" />
              <stop offset="100%" stopColor="#990000" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="50" r="47" fill="url(#fireGrad)" stroke="#ffbe76" strokeWidth="3" />
          <path d="M50 18 C53 32, 68 38, 68 54 C68 66, 60 76, 50 78 C40 76, 32 66, 32 54 C32 40, 44 32, 44 24 C44 24, 38 34, 38 46 C38 52, 42 58, 48 58 C44 52, 46 44, 50 36 C54 44, 56 48, 56 56 C56 62, 52 66, 48 68 C58 66, 62 58, 60 50 C58 42, 50 30, 50 18 Z" fill="#ffffff" />
          <path d="M50 42 C53 48, 55 52, 55 58 C55 64, 50 68, 47 68 C44 68, 41 64, 43 58 C45 52, 49 46, 50 42 Z" fill="#fde047" opacity="0.9" />
        </svg>
      );
    case 'water':
      return (
        <svg viewBox="0 0 100 100" style={iconStyle} className={`inline-block drop-shadow ${className}`}>
          <defs>
            <radialGradient id="waterGrad" cx="45%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="70%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#0369a1" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="50" r="47" fill="url(#waterGrad)" stroke="#bae6fd" strokeWidth="3" />
          <path d="M50 18 C50 18, 72 45, 72 60 C72 73, 62 81, 50 81 C38 81, 28 73, 28 60 C28 45, 50 18, 50 18 Z" fill="#ffffff" />
          <path d="M48 36 C48 36, 62 55, 62 64 C62 72, 55 76, 48 76 C42 76, 38 72, 38 64 C38 56, 48 36, 48 36 Z" fill="#7dd3fc" opacity="0.8" />
        </svg>
      );
    case 'grass':
      return (
        <svg viewBox="0 0 100 100" style={iconStyle} className={`inline-block drop-shadow ${className}`}>
          <defs>
            <radialGradient id="grassGrad" cx="45%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#4ade80" />
              <stop offset="70%" stopColor="#16a34a" />
              <stop offset="100%" stopColor="#14532d" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="50" r="47" fill="url(#grassGrad)" stroke="#bbf7d0" strokeWidth="3" />
          <path d="M50 18 C65 24, 76 42, 74 62 C62 76, 42 78, 28 68 C24 52, 34 32, 50 18 Z" fill="#ffffff" />
          <path d="M50 26 C42 42, 40 60, 48 72 M44 48 C52 50, 60 52, 64 56" stroke="#15803d" strokeWidth="4" strokeLinecap="round" fill="none" />
        </svg>
      );
    case 'lightning':
      return (
        <svg viewBox="0 0 100 100" style={iconStyle} className={`inline-block drop-shadow ${className}`}>
          <defs>
            <radialGradient id="lightGrad" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#ca8a04" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="50" r="47" fill="url(#lightGrad)" stroke="#fef9c3" strokeWidth="3" />
          <polygon points="56,16 28,48 48,48 40,84 72,44 52,44" fill="#ffffff" />
          <polygon points="53,24 35,47 49,47 44,72 65,46 51,46" fill="#fef08a" opacity="0.9" />
        </svg>
      );
    case 'psychic':
      return (
        <svg viewBox="0 0 100 100" style={iconStyle} className={`inline-block drop-shadow ${className}`}>
          <defs>
            <radialGradient id="psyGrad" cx="45%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#e879f9" />
              <stop offset="70%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#581c87" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="50" r="47" fill="url(#psyGrad)" stroke="#f5d0fe" strokeWidth="3" />
          <ellipse cx="50" cy="50" rx="26" ry="18" fill="#ffffff" />
          <circle cx="50" cy="50" r="11" fill="#581c87" />
          <circle cx="53" cy="47" r="4" fill="#ffffff" />
        </svg>
      );
    case 'fighting':
      return (
        <svg viewBox="0 0 100 100" style={iconStyle} className={`inline-block drop-shadow ${className}`}>
          <defs>
            <radialGradient id="fightGrad" cx="45%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#fb923c" />
              <stop offset="70%" stopColor="#c2410c" />
              <stop offset="100%" stopColor="#7c2d12" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="50" r="47" fill="url(#fightGrad)" stroke="#fed7aa" strokeWidth="3" />
          <path d="M30 40 L45 28 L65 30 L72 45 L68 70 L42 75 L30 60 Z" fill="#ffffff" />
          <path d="M42 38 L55 38 M40 48 L62 48 M42 58 L60 58" stroke="#7c2d12" strokeWidth="3.5" strokeLinecap="round" />
        </svg>
      );
    case 'darkness':
      return (
        <svg viewBox="0 0 100 100" style={iconStyle} className={`inline-block drop-shadow ${className}`}>
          <defs>
            <radialGradient id="darkGrad" cx="45%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#64748b" />
              <stop offset="70%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#090d16" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="50" r="47" fill="url(#darkGrad)" stroke="#94a3b8" strokeWidth="3" />
          <path d="M60 22 C42 26 30 42 32 60 C34 74 46 84 62 82 C48 78 40 66 42 52 C44 38 52 28 60 22 Z" fill="#ffffff" />
          <circle cx="64" cy="48" r="5" fill="#ffffff" />
        </svg>
      );
    case 'metal':
      return (
        <svg viewBox="0 0 100 100" style={iconStyle} className={`inline-block drop-shadow ${className}`}>
          <defs>
            <radialGradient id="metalGrad" cx="45%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#e2e8f0" />
              <stop offset="70%" stopColor="#64748b" />
              <stop offset="100%" stopColor="#334155" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="50" r="47" fill="url(#metalGrad)" stroke="#f8fafc" strokeWidth="3" />
          <circle cx="50" cy="50" r="26" fill="#ffffff" stroke="#334155" strokeWidth="3" />
          <circle cx="50" cy="50" r="12" fill="#334155" />
          <circle cx="50" cy="50" r="6" fill="#ffffff" />
        </svg>
      );
    case 'dragon':
      return (
        <svg viewBox="0 0 100 100" style={iconStyle} className={`inline-block drop-shadow ${className}`}>
          <defs>
            <radialGradient id="dragonGrad" cx="45%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="50%" stopColor="#b45309" />
              <stop offset="100%" stopColor="#451a03" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="50" r="47" fill="url(#dragonGrad)" stroke="#fde68a" strokeWidth="3" />
          <path d="M50 20 C62 30 75 42 72 65 C62 60 55 64 50 78 C45 64 38 60 28 65 C25 42 38 30 50 20 Z" fill="#ffffff" />
          <path d="M50 35 L50 68" stroke="#78350f" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );
    case 'fairy':
      return (
        <svg viewBox="0 0 100 100" style={iconStyle} className={`inline-block drop-shadow ${className}`}>
          <defs>
            <radialGradient id="fairyGrad" cx="45%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#f472b6" />
              <stop offset="70%" stopColor="#db2777" />
              <stop offset="100%" stopColor="#831843" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="50" r="47" fill="url(#fairyGrad)" stroke="#fbcfe8" strokeWidth="3" />
          <path d="M50 22 C64 30 74 48 66 64 C58 58 54 62 50 76 C46 62 42 58 34 64 C26 48 36 30 50 22 Z" fill="#ffffff" />
        </svg>
      );
    default:
      // Colorless
      return (
        <svg viewBox="0 0 100 100" style={iconStyle} className={`inline-block drop-shadow ${className}`}>
          <defs>
            <radialGradient id="colorlessGrad" cx="45%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#f1f5f9" />
              <stop offset="70%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#64748b" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="50" r="47" fill="url(#colorlessGrad)" stroke="#ffffff" strokeWidth="3" />
          {/* 6-point star */}
          <polygon points="50,20 57,38 76,38 62,50 68,68 50,56 32,68 38,50 24,38 43,38" fill="#334155" />
          <polygon points="50,26 55,40 70,40 59,49 63,63 50,53 37,63 41,49 30,40 45,40" fill="#ffffff" opacity="0.9" />
        </svg>
      );
  }
}

// Utility to parse energy string like "2火1無" or "3草" into icon array
export function parseEnergyCost(str: string): EnergyType[] {
  if (!str) return [];
  const result: EnergyType[] = [];
  
  // Try pattern like "2草" or "2草 1無" or "grass,grass,colorless"
  const tokens = str.split(/[\s,]+/);
  
  for (const token of tokens) {
    const match = token.match(/^(\d+)?(.*)$/);
    if (match) {
      const count = parseInt(match[1] || '1', 10);
      const name = match[2] || token;
      
      let type: EnergyType = 'colorless';
      const n = name.toLowerCase().trim();
      if (['火', 'fire', '炎'].includes(n)) type = 'fire';
      else if (['水', 'water'].includes(n)) type = 'water';
      else if (['草', 'grass', '木'].includes(n)) type = 'grass';
      else if (['電', '雷', 'lightning', 'electric'].includes(n)) type = 'lightning';
      else if (['超', '超能', 'psychic'].includes(n)) type = 'psychic';
      else if (['鬥', '格鬥', 'fighting'].includes(n)) type = 'fighting';
      else if (['惡', '暗', 'darkness', 'dark'].includes(n)) type = 'darkness';
      else if (['鋼', 'metal', 'steel'].includes(n)) type = 'metal';
      else if (['龍', 'dragon'].includes(n)) type = 'dragon';
      else if (['妖', '妖精', 'fairy'].includes(n)) type = 'fairy';
      else type = 'colorless';

      for (let i = 0; i < Math.min(count, 8); i++) {
        result.push(type);
      }
    }
  }

  return result.length > 0 ? result : ['colorless'];
}
