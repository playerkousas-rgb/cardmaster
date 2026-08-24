'use client';

import React from 'react';
import { YuGiOhAttributeIcon, YuGiOhLevelStar, YuGiOhRankStar, YuGiOhHologramStamp, YuGiOhAttr } from '../shared/YuGiOhIcons';
import { FoilLayer, FoilType } from '../shared/FoilLayer';

export type YGOFrameType = 
  | 'effect' 
  | 'normal' 
  | 'fusion' 
  | 'synchro' 
  | 'xyz' 
  | 'link' 
  | 'spell' 
  | 'trap';

export interface YuGiOhCardData {
  name: string;
  nameColor: 'gold' | 'silver' | 'black' | 'white' | 'red';
  frameType: YGOFrameType;
  attribute: YuGiOhAttr | string; // LIGHT, DARK, EARTH, WATER, FIRE, WIND, DIVINE, SPELL, TRAP
  level: number; // 1 to 12
  isXyzRank?: boolean;

  // Monster / Card Type
  monsterType: string; // e.g. "龍族 / 效果" or "戰士族 / 同調 / 效果"
  spellTrapType?: string; // e.g. "通常", "永續", "速攻", "裝備", "場地", "儀式", "反擊"

  // Stats
  atk: string;
  def: string;
  linkRating?: number;

  // Lore / Effect
  effectText: string;

  // Artwork
  imageUrl: string;
  imageZoom: number;
  imageOffsetX: number;
  imageOffsetY: number;
  imageBrightness: number;
  imageContrast: number;

  // Meta
  cardNumber: string; // e.g. "DDX-001" or "RC04-JP001"
  passcode: string; // 8 digits e.g. "83719402"
  edition: string; // "1st Edition" or "LIMITED EDITION"
  foilType: FoilType;
  foilOpacity: number;
  hologramGold?: boolean;
}

interface YuGiOhCardProps {
  data: YuGiOhCardData;
  pointerX?: number;
  pointerY?: number;
  isHovered?: boolean;
  innerRef?: React.RefObject<HTMLDivElement>;
}

// Frame color configurations
const frameStyles: Record<YGOFrameType, {
  outerBg: string;
  innerBg: string;
  borderColor: string;
  textColor: string;
  boxBg: string;
  titleDefaultColor: string;
}> = {
  effect: {
    outerBg: 'bg-gradient-to-b from-[#c26a2b] via-[#a34b18] to-[#5c2507]',
    innerBg: 'bg-[#b85a1f]',
    borderColor: 'border-[#451a03]',
    textColor: 'text-slate-950',
    boxBg: 'bg-[#fef3c7]/95 text-slate-950 border-[#78350f]',
    titleDefaultColor: 'text-slate-950',
  },
  normal: {
    outerBg: 'bg-gradient-to-b from-[#d4a359] via-[#b8853b] to-[#784e1b]',
    innerBg: 'bg-[#c9954a]',
    borderColor: 'border-[#451a03]',
    textColor: 'text-slate-950',
    boxBg: 'bg-[#fef3c7]/95 text-slate-950 border-[#78350f]',
    titleDefaultColor: 'text-slate-950',
  },
  fusion: {
    outerBg: 'bg-gradient-to-b from-[#9d4edd] via-[#7b2cbf] to-[#3c096c]',
    innerBg: 'bg-[#8338ec]',
    borderColor: 'border-[#240046]',
    textColor: 'text-white',
    boxBg: 'bg-[#f3e8ff]/95 text-slate-950 border-[#581c87]',
    titleDefaultColor: 'text-white',
  },
  synchro: {
    outerBg: 'bg-gradient-to-b from-[#f8fafc] via-[#e2e8f0] to-[#94a3b8]',
    innerBg: 'bg-[#f1f5f9]',
    borderColor: 'border-[#475569]',
    textColor: 'text-slate-950',
    boxBg: 'bg-[#ffffff]/95 text-slate-950 border-[#475569]',
    titleDefaultColor: 'text-slate-950',
  },
  xyz: {
    outerBg: 'bg-gradient-to-b from-[#18181b] via-[#09090b] to-[#000000]',
    innerBg: 'bg-[#09090b]',
    borderColor: 'border-[#27272a]',
    textColor: 'text-white',
    boxBg: 'bg-[#18181b]/95 text-slate-100 border-[#3f3f46]',
    titleDefaultColor: 'text-white',
  },
  link: {
    outerBg: 'bg-gradient-to-b from-[#1e40af] via-[#1e3a8a] to-[#0f172a]',
    innerBg: 'bg-[#1e3a8a]',
    borderColor: 'border-[#172554]',
    textColor: 'text-white',
    boxBg: 'bg-[#0f172a]/95 text-slate-100 border-[#1d4ed8]',
    titleDefaultColor: 'text-white',
  },
  spell: {
    outerBg: 'bg-gradient-to-b from-[#14b8a6] via-[#0f766e] to-[#042f2e]',
    innerBg: 'bg-[#0d9488]',
    borderColor: 'border-[#042f2e]',
    textColor: 'text-white',
    boxBg: 'bg-[#ccfbf1]/95 text-slate-950 border-[#115e59]',
    titleDefaultColor: 'text-white',
  },
  trap: {
    outerBg: 'bg-gradient-to-b from-[#e11d48] via-[#be123c] to-[#4c0519]',
    innerBg: 'bg-[#be185d]',
    borderColor: 'border-[#4c0519]',
    textColor: 'text-white',
    boxBg: 'bg-[#ffe4e6]/95 text-slate-950 border-[#9f1239]',
    titleDefaultColor: 'text-white',
  },
};

export function YuGiOhCard({
  data,
  pointerX = 50,
  pointerY = 50,
  isHovered = false,
  innerRef,
}: YuGiOhCardProps) {
  const frame = frameStyles[data.frameType] || frameStyles.effect;
  const isMonster = !['spell', 'trap'].includes(data.frameType);
  const isXyz = data.frameType === 'xyz' || data.isXyzRank;
  const isLink = data.frameType === 'link';

  // Title color styling
  let titleColorClass = frame.titleDefaultColor;
  let titleStyle: React.CSSProperties = {};
  if (data.nameColor === 'gold') {
    titleColorClass = 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-400 to-yellow-100 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] font-black';
  } else if (data.nameColor === 'silver') {
    titleColorClass = 'text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-slate-300 to-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]';
  } else if (data.nameColor === 'white') {
    titleColorClass = 'text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]';
  } else if (data.nameColor === 'red') {
    titleColorClass = 'text-red-600 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]';
  } else if (data.nameColor === 'black') {
    titleColorClass = 'text-slate-950';
  }

  const starCount = Math.min(Math.max(data.level || 1, 1), 12);

  return (
    <div
      ref={innerRef}
      className={`w-[360px] h-[524px] relative rounded-[14px] select-none text-slate-900 overflow-hidden font-sans border-[8px] ${frame.borderColor} shadow-2xl flex flex-col justify-between ${frame.outerBg}`}
      style={{
        boxSizing: 'border-box',
        aspectRatio: '59/86',
      }}
    >
      {/* 1. Foil Overlay */}
      <FoilLayer
        type={data.foilType}
        opacity={data.foilOpacity}
        pointerX={pointerX}
        pointerY={pointerY}
        isHovered={isHovered}
      />

      {/* 2. Top Name & Attribute Header */}
      <div className="relative z-10 mx-1.5 mt-1.5 px-2 py-0.5 rounded-[4px] bg-gradient-to-b from-[#fef3c7]/95 to-[#fde68a]/95 border-2 border-[#78350f]/80 shadow flex items-center justify-between">
        <h1
          className={`font-serif font-black text-sm tracking-wide truncate max-w-[260px] ${titleColorClass}`}
          style={titleStyle}
        >
          {data.name}
        </h1>
        <YuGiOhAttributeIcon
          attr={data.frameType === 'spell' ? 'SPELL' : data.frameType === 'trap' ? 'TRAP' : data.attribute}
          size={24}
        />
      </div>

      {/* 3. Level / Rank Stars or Spell/Trap Bar */}
      <div className="relative z-10 px-2 py-0.5 flex items-center min-h-[22px]">
        {isMonster && (
          <div className={`w-full flex items-center gap-0.5 ${isXyz ? 'justify-start pl-1' : 'justify-end pr-1'}`}>
            {isXyz && <span className="text-[9px] font-black font-serif text-amber-400 mr-1">RANK</span>}
            {Array.from({ length: starCount }).map((_, i) => (
              isXyz ? <YuGiOhRankStar key={i} size={15} /> : <YuGiOhLevelStar key={i} size={15} />
            ))}
          </div>
        )}

        {!isMonster && (
          <div className="w-full flex justify-end items-center pr-2">
            <span className="font-serif font-black text-xs text-white tracking-widest drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
              【{data.frameType === 'spell' ? '魔法卡' : '陷阱卡'}
              {data.spellTrapType && data.spellTrapType !== '通常' ? `  /${data.spellTrapType}` : ''}】
            </span>
          </div>
        )}
      </div>

      {/* 4. Square Card Artwork Box */}
      <div className="relative z-10 mx-3 rounded-[3px] overflow-hidden border-[3px] border-[#78350f] shadow-[inset_0_2px_6px_rgba(0,0,0,0.8),0_2px_4px_rgba(0,0,0,0.5)] bg-slate-950 h-[210px]">
        <img
          src={data.imageUrl}
          alt={data.name}
          className="w-full h-full object-cover"
          style={{
            transform: `scale(${data.imageZoom}) translate(${data.imageOffsetX}px, ${data.imageOffsetY}px)`,
            filter: `brightness(${data.imageBrightness}%) contrast(${data.imageContrast}%)`,
          }}
        />
      </div>

      {/* Card Set Number beneath art on right */}
      <div className="relative z-10 px-3 text-right">
        <span className="text-[8px] font-mono font-black text-amber-200 tracking-wider drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
          {data.cardNumber || 'DDX-001'}
        </span>
      </div>

      {/* 5. Effect / Monster Lore Container */}
      <div className="relative z-10 mx-1.5 mb-1">
        <div className={`rounded-[4px] border-2 p-1.5 flex flex-col justify-between shadow-md min-h-[110px] ${frame.boxBg}`}>
          {/* Monster Type / Race Bracket */}
          {isMonster && (
            <div className="font-serif font-black text-[10px] tracking-tight pb-0.5 border-b border-[#78350f]/20">
              【 {data.monsterType || '戰士族 ／ 效果'} 】
            </div>
          )}

          {/* Effect Lore Text */}
          <p className="text-[8.5px] leading-snug font-serif text-slate-900 line-clamp-4 my-0.5 flex-1 select-text">
            {data.effectText}
          </p>

          {/* ATK / DEF Bar (For Monsters) */}
          {isMonster && (
            <div className="flex justify-end items-center gap-3 font-serif font-black text-xs border-t border-[#78350f]/30 pt-0.5 text-slate-950">
              <div>
                ATK/ <span className="font-mono text-xs">{data.atk || '3000'}</span>
              </div>
              {!isLink ? (
                <div>
                  DEF/ <span className="font-mono text-xs">{data.def || '2500'}</span>
                </div>
              ) : (
                <div className="text-blue-700">
                  LINK- <span className="font-mono text-xs">{data.linkRating || 4}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 6. Yu-Gi-Oh Bottom Bar: Passcode & Konami Hologram */}
      <div className="relative z-10 px-2 pb-0.5 flex justify-between items-center text-[7.5px] font-mono font-bold text-amber-100">
        {/* Passcode & Edition */}
        <div className="flex items-center gap-2">
          <span>{data.passcode || '83719402'}</span>
          <span className="text-[7px] text-amber-300 font-sans">{data.edition || '1st Edition'}</span>
        </div>

        {/* Center Copyright */}
        <div className="text-[6.5px] font-sans opacity-80 hidden sm:inline">
          ©Studio Dice/SHUEISHA, TV TOKYO, KONAMI
        </div>

        {/* Hologram Stamp in bottom-right corner */}
        <div className="shrink-0">
          <YuGiOhHologramStamp gold={data.hologramGold ?? true} size={18} />
        </div>
      </div>
    </div>
  );
}
