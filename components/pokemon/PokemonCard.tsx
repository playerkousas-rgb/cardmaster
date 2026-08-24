'use client';

import React from 'react';
import { EnergyIcon, parseEnergyCost, EnergyType } from '../shared/EnergyIcons';
import { FoilLayer, FoilType } from '../shared/FoilLayer';

export interface PokemonCardData {
  name: string;
  stage: string; // 'BASIC' | 'STAGE 1' | 'STAGE 2' | 'TAG TEAM' | 'ex' | 'VMAX' | 'TERA';
  partnerPokemon?: string;
  type: string; // '火' | '草' | '水' | '電' | '超能' | '惡' | '龍' | '鋼' | '妖精' | '格鬥' | '無色';
  hp: string;
  cardVariant: 'sar' | 'sv-silver' | 'classic-yellow' | 'gold-ur';
  foilType: FoilType;
  foilOpacity: number;
  
  // Artwork
  imageUrl: string;
  imageZoom: number; // e.g. 1
  imageOffsetX: number; // e.g. 0
  imageOffsetY: number; // e.g. 0
  imageBrightness: number;
  imageContrast: number;

  // Moves
  abilityTitle?: string;
  abilityText?: string;
  move1Name: string;
  move1Energy: string;
  move1Damage: string;
  move1Text: string;
  move2Name: string;
  move2Energy: string;
  move2Damage: string;
  move2Text: string;

  // Footer
  weaknessType?: string;
  weaknessValue?: string;
  resistanceType?: string;
  resistanceValue?: string;
  retreatCost?: number;
  illustrator: string;
  cardNumber: string;
  rarity: string;
  regulationMark: string;
}

interface PokemonCardProps {
  data: PokemonCardData;
  pointerX?: number;
  pointerY?: number;
  isHovered?: boolean;
  innerRef?: React.RefObject<HTMLDivElement>;
}

// Background colors and gradients for Pokemon card frames
const typeThemeMap: Record<string, {
  bgGrad: string;
  borderGrad: string;
  headerGrad: string;
  accentColor: string;
  pillBg: string;
  innerBg: string;
}> = {
  '火': {
    bgGrad: 'from-orange-600 via-red-600 to-amber-700',
    borderGrad: 'from-amber-300 via-orange-400 to-red-600',
    headerGrad: 'from-red-700 via-orange-600 to-amber-500',
    accentColor: '#dc2626',
    pillBg: 'bg-red-800 text-white',
    innerBg: 'bg-gradient-to-b from-amber-50/95 to-orange-50/95',
  },
  '水': {
    bgGrad: 'from-sky-600 via-blue-600 to-cyan-800',
    borderGrad: 'from-sky-200 via-blue-400 to-indigo-600',
    headerGrad: 'from-blue-700 via-sky-600 to-cyan-500',
    accentColor: '#0284c7',
    pillBg: 'bg-blue-800 text-white',
    innerBg: 'bg-gradient-to-b from-sky-50/95 to-blue-50/95',
  },
  '草': {
    bgGrad: 'from-emerald-600 via-green-600 to-teal-800',
    borderGrad: 'from-green-200 via-emerald-400 to-teal-600',
    headerGrad: 'from-green-700 via-emerald-600 to-lime-500',
    accentColor: '#16a34a',
    pillBg: 'bg-emerald-800 text-white',
    innerBg: 'bg-gradient-to-b from-green-50/95 to-emerald-50/95',
  },
  '電': {
    bgGrad: 'from-amber-400 via-yellow-500 to-amber-600',
    borderGrad: 'from-yellow-100 via-amber-300 to-yellow-500',
    headerGrad: 'from-amber-500 via-yellow-400 to-amber-300',
    accentColor: '#ca8a04',
    pillBg: 'bg-amber-600 text-slate-950',
    innerBg: 'bg-gradient-to-b from-yellow-50/95 to-amber-50/95',
  },
  '超能': {
    bgGrad: 'from-purple-600 via-fuchsia-700 to-indigo-900',
    borderGrad: 'from-fuchsia-300 via-purple-400 to-indigo-600',
    headerGrad: 'from-purple-800 via-fuchsia-700 to-purple-500',
    accentColor: '#9333ea',
    pillBg: 'bg-purple-900 text-white',
    innerBg: 'bg-gradient-to-b from-purple-50/95 to-fuchsia-50/95',
  },
  '惡': {
    bgGrad: 'from-slate-700 via-zinc-800 to-stone-950',
    borderGrad: 'from-slate-400 via-zinc-500 to-slate-800',
    headerGrad: 'from-slate-900 via-zinc-800 to-stone-700',
    accentColor: '#334155',
    pillBg: 'bg-slate-950 text-slate-200 border border-slate-700',
    innerBg: 'bg-gradient-to-b from-slate-100/95 to-slate-200/95',
  },
  '格鬥': {
    bgGrad: 'from-orange-700 via-amber-800 to-stone-900',
    borderGrad: 'from-orange-300 via-amber-600 to-stone-700',
    headerGrad: 'from-orange-800 via-amber-700 to-amber-600',
    accentColor: '#c2410c',
    pillBg: 'bg-orange-950 text-orange-200',
    innerBg: 'bg-gradient-to-b from-orange-50/95 to-amber-50/95',
  },
  '鋼': {
    bgGrad: 'from-slate-400 via-zinc-400 to-slate-600',
    borderGrad: 'from-slate-200 via-zinc-300 to-slate-500',
    headerGrad: 'from-slate-600 via-zinc-500 to-slate-400',
    accentColor: '#475569',
    pillBg: 'bg-slate-700 text-white',
    innerBg: 'bg-gradient-to-b from-slate-50/95 to-zinc-100/95',
  },
  '龍': {
    bgGrad: 'from-amber-600 via-yellow-700 to-slate-900',
    borderGrad: 'from-yellow-300 via-amber-500 to-yellow-600',
    headerGrad: 'from-amber-700 via-yellow-600 to-stone-800',
    accentColor: '#b45309',
    pillBg: 'bg-amber-900 text-amber-100',
    innerBg: 'bg-gradient-to-b from-amber-50/95 to-stone-100/95',
  },
  '妖精': {
    bgGrad: 'from-pink-400 via-pink-500 to-rose-600',
    borderGrad: 'from-pink-200 via-rose-300 to-pink-500',
    headerGrad: 'from-pink-600 via-rose-500 to-pink-400',
    accentColor: '#db2777',
    pillBg: 'bg-pink-700 text-white',
    innerBg: 'bg-gradient-to-b from-pink-50/95 to-rose-50/95',
  },
};

export function PokemonCard({
  data,
  pointerX = 50,
  pointerY = 50,
  isHovered = false,
  innerRef,
}: PokemonCardProps) {
  const theme = typeThemeMap[data.type] || typeThemeMap['火'];
  const move1Energies = parseEnergyCost(data.move1Energy);
  const move2Energies = parseEnergyCost(data.move2Energy);

  const isFullArt = data.cardVariant === 'sar';
  const isGold = data.cardVariant === 'gold-ur';
  const isClassicYellow = data.cardVariant === 'classic-yellow';
  const isSilver = data.cardVariant === 'sv-silver';

  // Outer border styling
  let outerBorderClass = 'border-[10px] rounded-[22px]';
  if (isClassicYellow) {
    outerBorderClass += ' border-[#ffd000] shadow-[inset_0_0_8px_rgba(180,83,9,0.5)]';
  } else if (isSilver) {
    outerBorderClass += ' border-[#e2e8f0] shadow-[inset_0_0_10px_rgba(148,163,184,0.6)]';
  } else if (isGold) {
    outerBorderClass += ' border-[#facc15] shadow-[inset_0_0_12px_rgba(202,138,4,0.8),0_0_20px_rgba(250,204,21,0.4)]';
  } else {
    // SAR / Full Art
    outerBorderClass += ' border-[#e5e7eb]/80 shadow-[inset_0_0_12px_rgba(255,255,255,0.4)]';
  }

  return (
    <div
      ref={innerRef}
      className={`w-[360px] h-[504px] relative rounded-[22px] select-none text-slate-900 overflow-hidden font-sans shadow-2xl flex flex-col justify-between ${outerBorderClass} ${
        isGold
          ? 'bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-700'
          : isFullArt
          ? 'bg-slate-950'
          : `bg-gradient-to-br ${theme.bgGrad}`
      }`}
      style={{
        boxSizing: 'border-box',
        aspectRatio: '63/88',
      }}
    >
      {/* 1. Holographic Foil Effect Layer */}
      <FoilLayer
        type={data.foilType}
        opacity={data.foilOpacity}
        pointerX={pointerX}
        pointerY={pointerY}
        isHovered={isHovered}
      />

      {/* 2. Full-Bleed Artwork for SAR / Full Art */}
      {isFullArt && (
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src={data.imageUrl}
            alt="Card Full Art"
            className="w-full h-full object-cover transition-transform"
            style={{
              transform: `scale(${data.imageZoom}) translate(${data.imageOffsetX}px, ${data.imageOffsetY}px)`,
              filter: `brightness(${data.imageBrightness}%) contrast(${data.imageContrast}%)`,
            }}
          />
          {/* Subtle gradient vignette to keep text readable */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/75 pointer-events-none" />
        </div>
      )}

      {/* 3. Top Header Bar */}
      <div className="relative z-10 px-2.5 pt-2 pb-1 flex justify-between items-center">
        {/* Left: Stage Badge + Name */}
        <div className="flex items-center gap-1.5 min-w-0">
          <div className="px-1.5 py-0.5 rounded-[4px] bg-gradient-to-r from-amber-400 to-yellow-500 border border-amber-600 shadow-sm flex items-center">
            <span className="text-[8px] font-black uppercase text-amber-950 tracking-wider font-sans">
              {data.stage}
            </span>
          </div>
          <div className="truncate">
            <span
              className={`font-black text-sm tracking-tight drop-shadow-sm ${
                isFullArt || isGold ? 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]' : 'text-slate-900'
              }`}
            >
              {data.name}
            </span>
            {data.partnerPokemon && (
              <span className={`text-[10px] ml-1 font-bold ${isFullArt ? 'text-amber-300' : 'text-slate-700'}`}>
                & {data.partnerPokemon}
              </span>
            )}
          </div>
        </div>

        {/* Right: HP & Energy Type */}
        <div className="flex items-center gap-1 shrink-0">
          <span className="text-[9px] font-black font-sans uppercase text-red-600 drop-shadow-sm">HP</span>
          <span className="text-lg font-black font-bebas tracking-wide text-red-600 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
            {data.hp}
          </span>
          <EnergyIcon type={data.type} size={22} className="ml-0.5" />
        </div>
      </div>

      {/* 4. Framed Artwork (for Classic Yellow, Silver, or Gold) */}
      {!isFullArt && (
        <div className="relative z-10 mx-2 my-0.5 rounded-[8px] overflow-hidden border-[3px] border-amber-300/80 shadow-[inset_0_2px_6px_rgba(0,0,0,0.6),0_2px_8px_rgba(0,0,0,0.4)] bg-slate-950 h-[190px]">
          <img
            src={data.imageUrl}
            alt="Pokemon Card Artwork"
            className="w-full h-full object-cover"
            style={{
              transform: `scale(${data.imageZoom}) translate(${data.imageOffsetX}px, ${data.imageOffsetY}px)`,
              filter: `brightness(${data.imageBrightness}%) contrast(${data.imageContrast}%)`,
            }}
          />
          {/* Subtle glossy sheen */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />
        </div>
      )}

      {/* SAR Spacer when Full Art */}
      {isFullArt && <div className="flex-1" />}

      {/* 5. Ability & Attacks Container */}
      <div
        className={`relative z-10 mx-2 mb-1 p-2 rounded-[10px] space-y-1.5 shadow-md backdrop-blur-[2px] ${
          isFullArt
            ? 'bg-slate-950/80 border border-amber-300/40 text-white'
            : isGold
            ? 'bg-amber-100/90 border border-amber-500/60 text-slate-950'
            : `${theme.innerBg} border border-amber-200/80 text-slate-900`
        }`}
      >
        {/* Ability (if present) */}
        {data.abilityTitle && (
          <div className="border-b border-amber-300/30 pb-1">
            <div className="flex items-center gap-1.5">
              <span className="px-1.5 py-0.2 text-[8px] font-black uppercase rounded bg-red-600 text-white tracking-wide shadow-sm">
                特性
              </span>
              <span className="font-black text-[11px] text-red-600 font-sans tracking-tight">
                {data.abilityTitle}
              </span>
            </div>
            {data.abilityText && (
              <p className={`text-[9px] leading-tight mt-0.5 ${isFullArt ? 'text-slate-200' : 'text-slate-700'}`}>
                {data.abilityText}
              </p>
            )}
          </div>
        )}

        {/* Move 1 */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <div className="flex items-center gap-0.5">
                {move1Energies.map((e, idx) => (
                  <EnergyIcon key={idx} type={e} size={15} />
                ))}
              </div>
              <span className="font-bold text-xs tracking-tight ml-1">{data.move1Name}</span>
            </div>
            <span className="font-black text-sm font-bebas tracking-wide text-amber-500 drop-shadow-sm">
              {data.move1Damage}
            </span>
          </div>
          {data.move1Text && (
            <p className={`text-[8.5px] leading-tight mt-0.5 ${isFullArt ? 'text-slate-300' : 'text-slate-600'}`}>
              {data.move1Text}
            </p>
          )}
        </div>

        {/* Move 2 */}
        {data.move2Name && (
          <div className="flex flex-col border-t border-amber-300/20 pt-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <div className="flex items-center gap-0.5">
                  {move2Energies.map((e, idx) => (
                    <EnergyIcon key={idx} type={e} size={15} />
                  ))}
                </div>
                <span className="font-bold text-xs tracking-tight ml-1">{data.move2Name}</span>
              </div>
              <span className="font-black text-sm font-bebas tracking-wide text-red-500 drop-shadow-sm">
                {data.move2Damage}
              </span>
            </div>
            {data.move2Text && (
              <p className={`text-[8.5px] leading-tight mt-0.5 ${isFullArt ? 'text-slate-300' : 'text-slate-600'}`}>
                {data.move2Text}
              </p>
            )}
          </div>
        )}

        {/* Weakness, Resistance, Retreat Line */}
        <div className="flex justify-between items-center text-[8px] font-bold border-t border-amber-300/30 pt-1 text-slate-400">
          <div className="flex items-center gap-1">
            <span>弱點</span>
            {data.weaknessType && <EnergyIcon type={data.weaknessType} size={11} />}
            <span className="text-red-500 font-black">{data.weaknessValue || '×2'}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>抵抗力</span>
            {data.resistanceType ? (
              <>
                <EnergyIcon type={data.resistanceType} size={11} />
                <span className="text-blue-500 font-black">{data.resistanceValue || '-30'}</span>
              </>
            ) : (
              <span>--</span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <span>撤退</span>
            <div className="flex gap-0.5">
              {Array.from({ length: data.retreatCost || 1 }).map((_, i) => (
                <EnergyIcon key={i} type="colorless" size={11} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 6. Official Bottom Bar */}
      <div
        className={`relative z-10 px-2.5 pb-1 flex justify-between items-center text-[7.5px] font-mono tracking-tight font-bold ${
          isFullArt ? 'text-slate-300 drop-shadow' : 'text-slate-900'
        }`}
      >
        <div className="flex items-center gap-1.5">
          <span className="px-1 py-0.2 rounded-[2px] bg-slate-900 text-white font-bold text-[7px]">
            {data.regulationMark || 'G'}
          </span>
          <span className="font-sans">Illus. {data.illustrator || '5ban Graphics'}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span>{data.cardNumber || 'SV8a 121/187'}</span>
          <span className="text-amber-400 font-black tracking-widest">{data.rarity || 'SAR'}</span>
          <span className="text-[6.5px] opacity-80 font-sans hidden sm:inline">©Pokémon/Nintendo</span>
        </div>
      </div>
    </div>
  );
}
