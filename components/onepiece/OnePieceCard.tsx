'use client';

import React from 'react';
import { OPAttributeBadge, OPCostBadge, OPPowerBadge, OPCounterBadge, OPAttribute } from '../shared/OnePieceIcons';
import { FoilLayer, FoilType } from '../shared/FoilLayer';

export interface OnePieceCardData {
  name: string;
  cardType: 'CHARACTER' | 'LEADER' | 'EVENT' | 'STAGE';
  color: '紅' | '綠' | '藍' | '紫' | '黑' | '黃';
  cost: string | number;
  power: string | number;
  attribute: OPAttribute | string; // 斬, 打, 射, 特, 知
  counter?: string; // e.g. '+1000', '+2000', '0'
  cardVariant: 'manga-alt' | 'standard-char' | 'leader';
  foilType: FoilType;
  foilOpacity: number;

  // Artwork
  imageUrl: string;
  imageZoom: number;
  imageOffsetX: number;
  imageOffsetY: number;
  imageBrightness: number;
  imageContrast: number;

  // Text details
  subtitle: string; // e.g. "四皇 / 童軍之父"
  effect: string;
  triggerEffect?: string;

  // Meta
  cardNumber: string; // e.g. "OP05-119"
  rarity: string; // "SEC", "SR", "P-SEC", "SP", "L"
  illustrator: string;
}

interface OnePieceCardProps {
  data: OnePieceCardData;
  pointerX?: number;
  pointerY?: number;
  isHovered?: boolean;
  innerRef?: React.RefObject<HTMLDivElement>;
}

// Color palettes for One Piece card frames
const opColorStyles: Record<string, {
  border: string;
  bgGrad: string;
  bannerBg: string;
  glow: string;
  tagColor: string;
}> = {
  '紅': {
    border: 'border-red-600',
    bgGrad: 'from-red-950 via-red-900 to-black',
    bannerBg: 'bg-gradient-to-r from-red-900 via-red-700 to-red-900',
    glow: 'shadow-[0_0_20px_rgba(239,68,68,0.4)]',
    tagColor: 'bg-red-800 text-red-100',
  },
  '綠': {
    border: 'border-emerald-600',
    bgGrad: 'from-emerald-950 via-green-900 to-black',
    bannerBg: 'bg-gradient-to-r from-emerald-900 via-emerald-700 to-emerald-900',
    glow: 'shadow-[0_0_20px_rgba(16,185,129,0.4)]',
    tagColor: 'bg-emerald-800 text-emerald-100',
  },
  '藍': {
    border: 'border-sky-600',
    bgGrad: 'from-blue-950 via-sky-900 to-black',
    bannerBg: 'bg-gradient-to-r from-blue-900 via-sky-700 to-blue-900',
    glow: 'shadow-[0_0_20px_rgba(14,165,233,0.4)]',
    tagColor: 'bg-blue-800 text-blue-100',
  },
  '紫': {
    border: 'border-purple-600',
    bgGrad: 'from-purple-950 via-purple-900 to-black',
    bannerBg: 'bg-gradient-to-r from-purple-900 via-purple-700 to-purple-900',
    glow: 'shadow-[0_0_20px_rgba(168,85,247,0.4)]',
    tagColor: 'bg-purple-800 text-purple-100',
  },
  '黑': {
    border: 'border-zinc-700',
    bgGrad: 'from-neutral-950 via-zinc-900 to-black',
    bannerBg: 'bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-900',
    glow: 'shadow-[0_0_20px_rgba(113,113,122,0.4)]',
    tagColor: 'bg-zinc-800 text-zinc-100',
  },
  '黃': {
    border: 'border-amber-500',
    bgGrad: 'from-amber-950 via-yellow-900 to-black',
    bannerBg: 'bg-gradient-to-r from-yellow-800 via-amber-600 to-yellow-800',
    glow: 'shadow-[0_0_20px_rgba(245,158,11,0.4)]',
    tagColor: 'bg-yellow-800 text-amber-100',
  },
};

export function OnePieceCard({
  data,
  pointerX = 50,
  pointerY = 50,
  isHovered = false,
  innerRef,
}: OnePieceCardProps) {
  const colorTheme = opColorStyles[data.color] || opColorStyles['紅'];
  const isMangaAlt = data.cardVariant === 'manga-alt';
  const isLeader = data.cardVariant === 'leader' || data.cardType === 'LEADER';

  return (
    <div
      ref={innerRef}
      className={`w-[360px] h-[504px] relative rounded-[20px] select-none text-white overflow-hidden font-sans border-[6px] ${colorTheme.border} ${colorTheme.glow} shadow-2xl flex flex-col justify-between bg-black`}
      style={{
        boxSizing: 'border-box',
        aspectRatio: '63/88',
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

      {/* 2. Card Artwork Layer */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={data.imageUrl}
          alt={data.name}
          className="w-full h-full object-cover"
          style={{
            transform: `scale(${data.imageZoom}) translate(${data.imageOffsetX}px, ${data.imageOffsetY}px)`,
            filter: `brightness(${data.imageBrightness}%) contrast(${data.imageContrast}%)`,
          }}
        />
        {/* Dynamic vignette / manga shading */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/60 pointer-events-none" />
        
        {/* Manga Speedlines pattern if Manga-Alt */}
        {isMangaAlt && (
          <div
            className="absolute inset-0 opacity-15 pointer-events-none mix-blend-overlay"
            style={{
              backgroundImage: 'repeating-radial-gradient(circle at 50% 50%, transparent 0, transparent 10px, rgba(255,255,255,0.4) 11px, transparent 12px)',
            }}
          />
        )}
      </div>

      {/* 3. Top Section: Cost, Attribute, Power */}
      <div className="relative z-10 p-2.5 flex justify-between items-start">
        {/* Top Left: Cost & Attribute */}
        <div className="flex items-center gap-1.5">
          <OPCostBadge cost={data.cost} size={42} />
          <OPAttributeBadge attr={data.attribute} size={28} className="mt-1" />
        </div>

        {/* Top Right: Counter (if character) & Power Badge */}
        <div className="flex flex-col items-end gap-1.5">
          <OPPowerBadge power={data.power} />
          {data.counter && <OPCounterBadge counter={data.counter} />}
        </div>
      </div>

      {/* Spacer to push name and effect to bottom */}
      <div className="flex-1" />

      {/* 4. Bottom Section: Name Banner, Subtitle, Effect Box */}
      <div className="relative z-10 px-2.5 pb-2 space-y-1.5">
        {/* Name Banner & Affiliations */}
        <div className="flex flex-col gap-0.5">
          {/* Subtitle / Traits */}
          {data.subtitle && (
            <div className="self-start">
              <span className="px-2 py-0.5 rounded-full bg-black/80 border border-amber-400/60 text-[8.5px] font-bold text-amber-300 tracking-wide">
                {data.subtitle}
              </span>
            </div>
          )}

          {/* Large Stylized Character Name */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black font-bebas tracking-wider text-amber-200 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] text-stroke">
              {data.name}
            </h2>
            <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-gradient-to-r from-amber-500 to-yellow-600 text-black border border-amber-300 shadow">
              {data.cardType}
            </span>
          </div>
        </div>

        {/* Effect Box */}
        <div className="bg-slate-950/85 backdrop-blur-md rounded-[10px] border border-amber-400/50 p-2 text-white shadow-xl space-y-1">
          {/* Main Effect */}
          <div className="text-[9.5px] leading-relaxed text-slate-100 font-sans">
            {/* Format keywords like 【登場時】 or 【ドン!!×1】 */}
            {data.effect}
          </div>

          {/* Trigger Effect if present */}
          {data.triggerEffect && (
            <div className="border-t border-amber-400/30 pt-1 flex items-start gap-1">
              <span className="px-1.5 py-0.2 rounded bg-yellow-500 text-black font-black text-[7.5px] uppercase">
                トリガー
              </span>
              <span className="text-[8.5px] leading-tight text-amber-200">{data.triggerEffect}</span>
            </div>
          )}
        </div>

        {/* 5. Official One Piece Footer Meta */}
        <div className="flex justify-between items-center text-[7.5px] font-mono tracking-wider font-bold text-amber-400/90 pt-0.5 px-0.5">
          <div className="flex items-center gap-1.5">
            <span className="text-white bg-slate-900 px-1 py-0.2 rounded border border-slate-700">
              {data.cardNumber || 'OP05-119'}
            </span>
            <span className="text-amber-300">{data.rarity || 'SEC'}</span>
          </div>

          <div className="flex items-center gap-1 text-[7px] text-slate-300">
            <span>Illus. {data.illustrator || 'Eiichiro Oda'}</span>
            <span className="hidden sm:inline">©E.O./S. ©B.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
