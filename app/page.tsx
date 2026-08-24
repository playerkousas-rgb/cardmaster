'use client';

import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { 
  Sparkles, Download, Copy, Check, Image as ImageIcon, 
  Zap, Flame, Shield, Swords, Wand2, RefreshCw, Layers,
  Sliders, Palette, Eye, Rotate3d, Terminal, Info, ExternalLink,
  ChevronRight, Dices, ZoomIn, Move
} from 'lucide-react';

import { PokemonCard, PokemonCardData } from '@/components/pokemon/PokemonCard';
import { OnePieceCard, OnePieceCardData } from '@/components/onepiece/OnePieceCard';
import { YuGiOhCard, YuGiOhCardData, YGOFrameType } from '@/components/yugioh/YuGiOhCard';
import { TiltCard } from '@/components/shared/TiltCard';
import { FoilType } from '@/components/shared/FoilLayer';
import { pokemonPresets, onePiecePresets, yugiohPresets } from '@/data/presets';
import { 
  generateStructuredJSON, 
  generateMidjourneyPrompt, 
  generateNaturalPrompt,
  PromptConfig 
} from '@/lib/promptGenerators';

export default function TCGStudioPage() {
  const [system, setSystem] = useState<'pokemon' | 'onepiece' | 'yugioh'>('pokemon');
  const [activeTab, setActiveTab] = useState<'artwork' | 'stats' | 'foil' | 'prompts'>('artwork');
  const [loadingAI, setLoadingAI] = useState(false);
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [tilt3DEnabled, setTilt3DEnabled] = useState(true);
  const [exporting, setExporting] = useState(false);

  // Common Prompt Builder Info
  const [characterName, setCharacterName] = useState('貝登堡');
  const [pose, setPose] = useState('右手作童軍三指敬禮，左手手持精靈球');
  const [expression, setExpression] = useState('自信且充滿活力的認真神情');
  const [bgSetting, setBgSetting] = useState('非洲草原上的廣闊平原');
  const [bgDetails, setBgDetails] = useState('遠處有岩石、山丘與稀疏的金合歡樹');
  const [bgAtmosphere, setBgAtmosphere] = useState('金黃色的夕陽，充滿冒險與活力');
  const [aiStylePreset, setAiStylePreset] = useState('official_tcg');
  const [promptTargetMode, setPromptTargetMode] = useState<'artwork_only' | 'full_card'>('artwork_only');

  // Pokémon State
  const [pokemonData, setPokemonData] = useState<PokemonCardData>(pokemonPresets[0].data);

  // One Piece State
  const [onePieceData, setOnePieceData] = useState<OnePieceCardData>(onePiecePresets[0].data);

  // Yu-Gi-Oh State
  const [yugiohData, setYugiohData] = useState<YuGiOhCardData>(yugiohPresets[0].data);

  // Ref for the visual card HTML element to capture
  const cardElementRef = useRef<HTMLDivElement>(null);

  // Handle Preset Loading
  const handleLoadPokemonPreset = (preset: typeof pokemonPresets[0]) => {
    setPokemonData({ ...preset.data });
    setCharacterName(preset.data.name);
    setPose(preset.promptInfo.pose);
    setExpression(preset.promptInfo.expression);
    setBgSetting(preset.promptInfo.background);
  };

  const handleLoadOnePiecePreset = (preset: typeof onePiecePresets[0]) => {
    setOnePieceData({ ...preset.data });
    setCharacterName(preset.data.name);
    setPose(preset.promptInfo.pose);
    setExpression(preset.promptInfo.expression);
    setBgSetting(preset.promptInfo.background);
  };

  const handleLoadYuGiOhPreset = (preset: typeof yugiohPresets[0]) => {
    setYugiohData({ ...preset.data });
    setCharacterName(preset.data.name);
    setPose(preset.promptInfo.pose);
    setExpression(preset.promptInfo.expression);
    setBgSetting(preset.promptInfo.background);
  };

  // Get current card's image URL
  const currentImageUrl = 
    system === 'pokemon' ? pokemonData.imageUrl :
    system === 'onepiece' ? onePieceData.imageUrl :
    yugiohData.imageUrl;

  // Set image URL for current system
  const updateCurrentImageUrl = (url: string) => {
    if (system === 'pokemon') setPokemonData(prev => ({ ...prev, imageUrl: url }));
    else if (system === 'onepiece') setOnePieceData(prev => ({ ...prev, imageUrl: url }));
    else setYugiohData(prev => ({ ...prev, imageUrl: url }));
  };

  // AI Image Generation
  const handleGenerateAIImage = async () => {
    setLoadingAI(true);
    try {
      let promptText = `${characterName}, ${pose}, ${expression}, in ${bgSetting}, ${bgAtmosphere}`;
      if (system === 'pokemon' && pokemonData.partnerPokemon) {
        promptText += ` with partner Pokémon ${pokemonData.partnerPokemon}`;
      }

      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          system,
          stylePreset: aiStylePreset,
          aspect: 'portrait',
        }),
      });

      const data = await res.json();
      if (data.imageUrl) {
        updateCurrentImageUrl(data.imageUrl);
      } else {
        alert('AI 生圖連線較忙碌，請稍後重試！');
      }
    } catch (e) {
      alert('AI 生圖發生異常，請檢查網路連線或稍後再試！');
    } finally {
      setLoadingAI(false);
    }
  };

  // Local File Upload
  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          updateCurrentImageUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // High-Resolution PNG Card Export
  const handleDownloadCard = async () => {
    if (!cardElementRef.current) return;
    setExporting(true);
    try {
      // Create high-res canvas at 4x resolution (300+ DPI print quality)
      const canvas = await html2canvas(cardElementRef.current, {
        scale: 4,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
      });

      const fileName = `${system.toUpperCase()}_${
        system === 'pokemon' ? pokemonData.name : system === 'onepiece' ? onePieceData.name : yugiohData.name
      }_RealTCG_Card.png`;

      const link = document.createElement('a');
      link.download = fileName;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Export error:', err);
      alert('導出高畫質卡牌圖片時遇到阻礙，建議上傳本地圖片或再試一次！');
    } finally {
      setExporting(false);
    }
  };

  // Current Card Prompt Configuration
  const currentPromptConfig: PromptConfig = {
    system,
    name: system === 'pokemon' ? pokemonData.name : system === 'onepiece' ? onePieceData.name : yugiohData.name,
    partner: system === 'pokemon' ? pokemonData.partnerPokemon : undefined,
    pose,
    expression,
    setting: bgSetting,
    details: bgDetails,
    atmosphere: bgAtmosphere,
    artStylePreset: aiStylePreset,
    cardVariant: system === 'pokemon' ? pokemonData.cardVariant : system === 'onepiece' ? onePieceData.cardVariant : yugiohData.frameType,
    foilType: system === 'pokemon' ? pokemonData.foilType : system === 'onepiece' ? onePieceData.foilType : yugiohData.foilType,
    cardNumber: system === 'pokemon' ? pokemonData.cardNumber : system === 'onepiece' ? onePieceData.cardNumber : yugiohData.cardNumber,
    targetMode: promptTargetMode,
  };

  const structuredJSON = generateStructuredJSON(currentPromptConfig);
  const midjourneyPrompt = generateMidjourneyPrompt(currentPromptConfig);
  const naturalPrompt = generateNaturalPrompt(currentPromptConfig);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <main className="min-h-screen bg-[#060913] text-slate-100 py-8 px-3 sm:px-6 selection:bg-cyan-500/30 selection:text-cyan-200">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top App Header */}
        <header className="relative bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800/80 rounded-3xl p-6 shadow-2xl backdrop-blur-xl overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-bold uppercase tracking-widest mb-2 shadow-inner">
                <Sparkles className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
                Ultra-Authentic TCG Studio 2.0
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-white via-cyan-200 to-amber-300 bg-clip-text text-transparent">
                TCG CARD MASTER 真卡製研所
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl">
                高擬真官方卡牌排版 ＋ 3D 全像立體反射 ＋ 免費 AI 一鍵繪圖 ＋ 多平台提示詞工廠
              </p>
            </div>

            {/* System Switcher Buttons */}
            <div className="flex items-center bg-slate-950/90 p-1.5 rounded-2xl border border-slate-800 shadow-inner flex-wrap justify-center gap-1">
              <button
                onClick={() => setSystem('pokemon')}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all ${
                  system === 'pokemon'
                    ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 shadow-[0_0_15px_rgba(250,204,21,0.4)]'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Zap className="w-4 h-4" /> Pokémon 寶可夢
              </button>

              <button
                onClick={() => setSystem('onepiece')}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all ${
                  system === 'onepiece'
                    ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-[0_0_15px_rgba(244,63,94,0.4)]'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Swords className="w-4 h-4" /> One Piece 航海王
              </button>

              <button
                onClick={() => setSystem('yugioh')}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all ${
                  system === 'yugioh'
                    ? 'bg-gradient-to-r from-amber-600 to-orange-700 text-white shadow-[0_0_15px_rgba(217,119,6,0.4)]'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Shield className="w-4 h-4" /> Yu-Gi-Oh! 遊戲王
              </button>
            </div>
          </div>

          {/* Quick Presets Bar */}
          <div className="relative z-10 mt-5 pt-4 border-t border-slate-800/80 flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1 mr-1">
              <Dices className="w-3.5 h-3.5 text-cyan-400" /> 經典範本速載：
            </span>
            {system === 'pokemon' &&
              pokemonPresets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleLoadPokemonPreset(preset)}
                  className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs text-cyan-300 font-semibold transition-all hover:border-cyan-500/50"
                >
                  {preset.label}
                </button>
              ))}

            {system === 'onepiece' &&
              onePiecePresets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleLoadOnePiecePreset(preset)}
                  className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs text-rose-300 font-semibold transition-all hover:border-rose-500/50"
                >
                  {preset.label}
                </button>
              ))}

            {system === 'yugioh' &&
              yugiohPresets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleLoadYuGiOhPreset(preset)}
                  className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs text-amber-300 font-semibold transition-all hover:border-amber-500/50"
                >
                  {preset.label}
                </button>
              ))}
          </div>
        </header>

        {/* Main Grid: Left Controls (7 cols) & Right Live Visual Card (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Studio Controller */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Tab Navigation */}
            <div className="flex bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 gap-1 overflow-x-auto">
              <button
                onClick={() => setActiveTab('artwork')}
                className={`flex-1 min-w-[110px] py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  activeTab === 'artwork'
                    ? 'bg-cyan-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" /> 1. 立繪與 AI
              </button>

              <button
                onClick={() => setActiveTab('stats')}
                className={`flex-1 min-w-[110px] py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  activeTab === 'stats'
                    ? 'bg-cyan-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" /> 2. 數值與排版
              </button>

              <button
                onClick={() => setActiveTab('foil')}
                className={`flex-1 min-w-[110px] py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  activeTab === 'foil'
                    ? 'bg-cyan-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" /> 3. 全息材質
              </button>

              <button
                onClick={() => setActiveTab('prompts')}
                className={`flex-1 min-w-[110px] py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  activeTab === 'prompts'
                    ? 'bg-cyan-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" /> 4. 提示詞工廠
              </button>
            </div>

            {/* TAB 1: Artwork & AI Generation */}
            {activeTab === 'artwork' && (
              <div className="space-y-4">
                {/* AI Generator Box */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-black text-cyan-300 flex items-center gap-2">
                      <Wand2 className="w-4 h-4 text-cyan-400" />
                      免費 AI 一鍵生成卡牌立繪 (FLUX 引擎)
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 font-mono">
                      100% Free & Fast
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">立繪風格預設</label>
                      <select
                        value={aiStylePreset}
                        onChange={(e) => setAiStylePreset(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
                      >
                        <option value="official_tcg">官方 TCG 頂級 SAR 特繪 (滿版動態)</option>
                        <option value="cel_shaded_90s">90 年代動漫賽璐珞 (經典水彩手繪)</option>
                        <option value="manga_ink">尾田風 漫畫墨線 (速度線張力)</option>
                        <option value="dark_fantasy">高橋風 奇幻召喚 (暗黑精細線條)</option>
                        <option value="gold_etched">24K 黃金箔金屬光 (稀有壓紋)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">角色主體名稱</label>
                      <input
                        type="text"
                        value={characterName}
                        onChange={(e) => {
                          setCharacterName(e.target.value);
                          if (system === 'pokemon') setPokemonData(p => ({ ...p, name: e.target.value }));
                          else if (system === 'onepiece') setOnePieceData(p => ({ ...p, name: e.target.value }));
                          else setYugiohData(p => ({ ...p, name: e.target.value }));
                        }}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 font-bold focus:border-cyan-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">動作姿態 (Pose)</label>
                      <input
                        type="text"
                        value={pose}
                        onChange={(e) => setPose(e.target.value)}
                        placeholder="例如：右手作童軍三指敬禮..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">神情 (Expression)</label>
                      <input
                        type="text"
                        value={expression}
                        onChange={(e) => setExpression(e.target.value)}
                        placeholder="例如：自信且充滿活力的神情..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">背景場景 (Setting)</label>
                      <input
                        type="text"
                        value={bgSetting}
                        onChange={(e) => setBgSetting(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">光影氛圍 (Atmosphere)</label>
                      <input
                        type="text"
                        value={bgAtmosphere}
                        onChange={(e) => setBgAtmosphere(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleGenerateAIImage}
                    disabled={loadingAI}
                    className="w-full bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 hover:brightness-110 disabled:opacity-50 text-white font-black py-3 px-4 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
                  >
                    {loadingAI ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                    {loadingAI ? 'AI 正在極速繪製卡牌立繪...' : '✨ 即時生成此角色立繪 (AI Generate)'}
                  </button>
                </div>

                {/* Upload or Image URL & Transform Controls */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
                  <h3 className="text-sm font-black text-cyan-300 flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-cyan-400" />
                    自訂上傳與卡框對齊調整 (Image Transform)
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">上傳本地圖片</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleUploadImage}
                        className="w-full text-xs text-slate-400 file:mr-2 file:py-2 file:px-3 file:rounded-xl file:border-0 file:bg-cyan-500/20 file:text-cyan-300 bg-slate-950 border border-slate-800 rounded-xl p-1.5 cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">直接貼上圖片 URL</label>
                      <input
                        type="text"
                        value={currentImageUrl}
                        onChange={(e) => updateCurrentImageUrl(e.target.value)}
                        placeholder="https://..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Sliders: Zoom, Pan X, Pan Y, Brightness */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    <div>
                      <div className="flex justify-between text-[11px] font-bold text-slate-400 mb-1">
                        <span>縮放 (Zoom)</span>
                        <span className="text-cyan-400 font-mono">
                          {system === 'pokemon' ? pokemonData.imageZoom : system === 'onepiece' ? onePieceData.imageZoom : yugiohData.imageZoom}x
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0.5"
                        max="2.5"
                        step="0.05"
                        value={system === 'pokemon' ? pokemonData.imageZoom : system === 'onepiece' ? onePieceData.imageZoom : yugiohData.imageZoom}
                        onChange={(e) => {
                          const v = parseFloat(e.target.value);
                          if (system === 'pokemon') setPokemonData(p => ({ ...p, imageZoom: v }));
                          else if (system === 'onepiece') setOnePieceData(p => ({ ...p, imageZoom: v }));
                          else setYugiohData(p => ({ ...p, imageZoom: v }));
                        }}
                        className="w-full accent-cyan-400"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] font-bold text-slate-400 mb-1">
                        <span>水平位移 (X)</span>
                        <span className="text-cyan-400 font-mono">
                          {system === 'pokemon' ? pokemonData.imageOffsetX : system === 'onepiece' ? onePieceData.imageOffsetX : yugiohData.imageOffsetX}px
                        </span>
                      </div>
                      <input
                        type="range"
                        min="-150"
                        max="150"
                        step="5"
                        value={system === 'pokemon' ? pokemonData.imageOffsetX : system === 'onepiece' ? onePieceData.imageOffsetX : yugiohData.imageOffsetX}
                        onChange={(e) => {
                          const v = parseInt(e.target.value, 10);
                          if (system === 'pokemon') setPokemonData(p => ({ ...p, imageOffsetX: v }));
                          else if (system === 'onepiece') setOnePieceData(p => ({ ...p, imageOffsetX: v }));
                          else setYugiohData(p => ({ ...p, imageOffsetX: v }));
                        }}
                        className="w-full accent-cyan-400"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] font-bold text-slate-400 mb-1">
                        <span>垂直位移 (Y)</span>
                        <span className="text-cyan-400 font-mono">
                          {system === 'pokemon' ? pokemonData.imageOffsetY : system === 'onepiece' ? onePieceData.imageOffsetY : yugiohData.imageOffsetY}px
                        </span>
                      </div>
                      <input
                        type="range"
                        min="-150"
                        max="150"
                        step="5"
                        value={system === 'pokemon' ? pokemonData.imageOffsetY : system === 'onepiece' ? onePieceData.imageOffsetY : yugiohData.imageOffsetY}
                        onChange={(e) => {
                          const v = parseInt(e.target.value, 10);
                          if (system === 'pokemon') setPokemonData(p => ({ ...p, imageOffsetY: v }));
                          else if (system === 'onepiece') setOnePieceData(p => ({ ...p, imageOffsetY: v }));
                          else setYugiohData(p => ({ ...p, imageOffsetY: v }));
                        }}
                        className="w-full accent-cyan-400"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] font-bold text-slate-400 mb-1">
                        <span>亮度 (Bright)</span>
                        <span className="text-cyan-400 font-mono">
                          {system === 'pokemon' ? pokemonData.imageBrightness : system === 'onepiece' ? onePieceData.imageBrightness : yugiohData.imageBrightness}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="70"
                        max="140"
                        step="5"
                        value={system === 'pokemon' ? pokemonData.imageBrightness : system === 'onepiece' ? onePieceData.imageBrightness : yugiohData.imageBrightness}
                        onChange={(e) => {
                          const v = parseInt(e.target.value, 10);
                          if (system === 'pokemon') setPokemonData(p => ({ ...p, imageBrightness: v }));
                          else if (system === 'onepiece') setOnePieceData(p => ({ ...p, imageBrightness: v }));
                          else setYugiohData(p => ({ ...p, imageBrightness: v }));
                        }}
                        className="w-full accent-cyan-400"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Stats & System Specifications */}
            {activeTab === 'stats' && (
              <div className="space-y-4">
                {/* Pokémon Specific Controls */}
                {system === 'pokemon' && (
                  <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
                    <h3 className="text-sm font-black text-amber-400 flex items-center gap-2">
                      <Zap className="w-4 h-4" /> Pokémon 寶可夢數值設定
                    </h3>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1">卡面版型 (Layout)</label>
                        <select
                          value={pokemonData.cardVariant}
                          onChange={(e) => setPokemonData(p => ({ ...p, cardVariant: e.target.value as any }))}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-amber-300 font-bold"
                        >
                          <option value="sar">SAR 特繪滿版 (推薦)</option>
                          <option value="classic-yellow">經典黃框 (Vintage)</option>
                          <option value="sv-silver">SV 銀光邊框</option>
                          <option value="gold-ur">24K 黃金版 (UR)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1">寶可夢屬性</label>
                        <select
                          value={pokemonData.type}
                          onChange={(e) => setPokemonData(p => ({ ...p, type: e.target.value }))}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-amber-300 font-bold"
                        >
                          {['火', '草', '水', '電', '超能', '惡', '格鬥', '鋼', '龍', '妖精'].map(t => (
                            <option key={t} value={t}>{t} 屬性</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1">卡牌階級 (Stage)</label>
                        <select
                          value={pokemonData.stage}
                          onChange={(e) => setPokemonData(p => ({ ...p, stage: e.target.value }))}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs"
                        >
                          {['BASIC', 'STAGE 1', 'STAGE 2', 'TAG TEAM', 'ex', 'VMAX', 'TERA'].map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1">HP 生命值</label>
                        <input
                          value={pokemonData.hp}
                          onChange={(e) => setPokemonData(p => ({ ...p, hp: e.target.value }))}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs font-bold text-red-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1">主卡名稱</label>
                        <input
                          value={pokemonData.name}
                          onChange={(e) => setPokemonData(p => ({ ...p, name: e.target.value }))}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1">夥伴寶可夢 (可留空)</label>
                        <input
                          value={pokemonData.partnerPokemon || ''}
                          onChange={(e) => setPokemonData(p => ({ ...p, partnerPokemon: e.target.value }))}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs"
                          placeholder="例如：噴火龍"
                        />
                      </div>
                    </div>

                    {/* Ability */}
                    <div className="border-t border-slate-800 pt-3 space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-red-400">特性設定 (Ability)</label>
                        <input
                          value={pokemonData.abilityTitle || ''}
                          onChange={(e) => setPokemonData(p => ({ ...p, abilityTitle: e.target.value }))}
                          placeholder="特性名稱 (如：童軍領袖)"
                          className="w-2/3 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-red-300 font-bold"
                        />
                      </div>
                      <textarea
                        rows={2}
                        value={pokemonData.abilityText || ''}
                        onChange={(e) => setPokemonData(p => ({ ...p, abilityText: e.target.value }))}
                        placeholder="特性詳細效果說明..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300"
                      />
                    </div>

                    {/* Move 1 */}
                    <div className="border-t border-slate-800 pt-3 space-y-2">
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          value={pokemonData.move1Name}
                          onChange={(e) => setPokemonData(p => ({ ...p, move1Name: e.target.value }))}
                          placeholder="招式 1 名稱"
                          className="col-span-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs font-bold"
                        />
                        <input
                          value={pokemonData.move1Energy}
                          onChange={(e) => setPokemonData(p => ({ ...p, move1Energy: e.target.value }))}
                          placeholder="能量 (如: 1草 1無)"
                          className="col-span-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-amber-300 font-mono"
                        />
                        <input
                          value={pokemonData.move1Damage}
                          onChange={(e) => setPokemonData(p => ({ ...p, move1Damage: e.target.value }))}
                          placeholder="傷害 (如: 60)"
                          className="col-span-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-red-400 font-bold"
                        />
                      </div>
                      <input
                        value={pokemonData.move1Text}
                        onChange={(e) => setPokemonData(p => ({ ...p, move1Text: e.target.value }))}
                        placeholder="招式 1 附加效果文字..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300"
                      />
                    </div>

                    {/* Move 2 */}
                    <div className="border-t border-slate-800 pt-3 space-y-2">
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          value={pokemonData.move2Name}
                          onChange={(e) => setPokemonData(p => ({ ...p, move2Name: e.target.value }))}
                          placeholder="招式 2 名稱"
                          className="col-span-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs font-bold"
                        />
                        <input
                          value={pokemonData.move2Energy}
                          onChange={(e) => setPokemonData(p => ({ ...p, move2Energy: e.target.value }))}
                          placeholder="能量 (如: 3火 1無)"
                          className="col-span-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-amber-300 font-mono"
                        />
                        <input
                          value={pokemonData.move2Damage}
                          onChange={(e) => setPokemonData(p => ({ ...p, move2Damage: e.target.value }))}
                          placeholder="傷害 (如: 260)"
                          className="col-span-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-red-400 font-bold"
                        />
                      </div>
                      <input
                        value={pokemonData.move2Text}
                        onChange={(e) => setPokemonData(p => ({ ...p, move2Text: e.target.value }))}
                        placeholder="招式 2 附加效果文字..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300"
                      />
                    </div>

                    {/* Meta: Number, Rarity, Illustrator */}
                    <div className="grid grid-cols-3 gap-2 border-t border-slate-800 pt-3">
                      <div>
                        <label className="block text-[10px] text-slate-400 mb-0.5">編號</label>
                        <input
                          value={pokemonData.cardNumber}
                          onChange={(e) => setPokemonData(p => ({ ...p, cardNumber: e.target.value }))}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-1 text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-400 mb-0.5">稀有度</label>
                        <input
                          value={pokemonData.rarity}
                          onChange={(e) => setPokemonData(p => ({ ...p, rarity: e.target.value }))}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-1 text-xs text-amber-400 font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-400 mb-0.5">畫師 Credit</label>
                        <input
                          value={pokemonData.illustrator}
                          onChange={(e) => setPokemonData(p => ({ ...p, illustrator: e.target.value }))}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-1 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* One Piece Specific Controls */}
                {system === 'onepiece' && (
                  <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
                    <h3 className="text-sm font-black text-rose-400 flex items-center gap-2">
                      <Swords className="w-4 h-4" /> One Piece 航海王卡牌設定
                    </h3>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1">卡面版型</label>
                        <select
                          value={onePieceData.cardVariant}
                          onChange={(e) => setOnePieceData(p => ({ ...p, cardVariant: e.target.value as any }))}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-rose-300 font-bold"
                        >
                          <option value="manga-alt">漫畫白金 (Manga Alt Art)</option>
                          <option value="standard-char">標準角色卡 (Character)</option>
                          <option value="leader">領航卡 (Leader)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1">卡牌顏色</label>
                        <select
                          value={onePieceData.color}
                          onChange={(e) => setOnePieceData(p => ({ ...p, color: e.target.value as any }))}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-amber-300 font-bold"
                        >
                          {['紅', '綠', '藍', '紫', '黑', '黃'].map(c => (
                            <option key={c} value={c}>{c} 色</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1">費用 (Cost)</label>
                        <input
                          value={onePieceData.cost}
                          onChange={(e) => setOnePieceData(p => ({ ...p, cost: e.target.value }))}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs font-bold text-amber-300"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1">戰鬥力 (Power)</label>
                        <input
                          value={onePieceData.power}
                          onChange={(e) => setOnePieceData(p => ({ ...p, power: e.target.value }))}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs font-bold text-amber-300"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1">屬性 (Attribute)</label>
                        <select
                          value={onePieceData.attribute}
                          onChange={(e) => setOnePieceData(p => ({ ...p, attribute: e.target.value }))}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs"
                        >
                          <option value="斬">斬 (Slash)</option>
                          <option value="打">打 (Strike)</option>
                          <option value="射">射 (Ranged)</option>
                          <option value="特">特 (Special)</option>
                          <option value="知">知 (Wisdom)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1">反擊 (Counter)</label>
                        <select
                          value={onePieceData.counter || ''}
                          onChange={(e) => setOnePieceData(p => ({ ...p, counter: e.target.value }))}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-amber-300"
                        >
                          <option value="">無 Counter</option>
                          <option value="+1000">+1000</option>
                          <option value="+2000">+2000</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1">角色名稱</label>
                        <input
                          value={onePieceData.name}
                          onChange={(e) => setOnePieceData(p => ({ ...p, name: e.target.value }))}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs font-bold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">特徵標籤 (Subtitle)</label>
                      <input
                        value={onePieceData.subtitle}
                        onChange={(e) => setOnePieceData(p => ({ ...p, subtitle: e.target.value }))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-amber-300 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">效果敘述 (Effect Text)</label>
                      <textarea
                        rows={3}
                        value={onePieceData.effect}
                        onChange={(e) => setOnePieceData(p => ({ ...p, effect: e.target.value }))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">觸發效果 (Trigger / 可留空)</label>
                      <input
                        value={onePieceData.triggerEffect || ''}
                        onChange={(e) => setOnePieceData(p => ({ ...p, triggerEffect: e.target.value }))}
                        placeholder="【登場時】若我方生命值為 1 以下..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-yellow-300"
                      />
                    </div>
                  </div>
                )}

                {/* Yu-Gi-Oh Specific Controls */}
                {system === 'yugioh' && (
                  <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
                    <h3 className="text-sm font-black text-amber-500 flex items-center gap-2">
                      <Shield className="w-4 h-4" /> Yu-Gi-Oh! 遊戲王卡牌設定
                    </h3>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1">卡片種類 (Frame)</label>
                        <select
                          value={yugiohData.frameType}
                          onChange={(e) => {
                            const ft = e.target.value as YGOFrameType;
                            setYugiohData(p => ({ 
                              ...p, 
                              frameType: ft,
                              isXyzRank: ft === 'xyz',
                              attribute: ft === 'spell' ? 'SPELL' : ft === 'trap' ? 'TRAP' : p.attribute
                            }));
                          }}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-amber-300 font-bold"
                        >
                          <option value="effect">效果怪獸 (橘)</option>
                          <option value="normal">通常怪獸 (黃)</option>
                          <option value="fusion">融合怪獸 (紫)</option>
                          <option value="synchro">同調怪獸 (白)</option>
                          <option value="xyz">超量怪獸 (黑 Xyz)</option>
                          <option value="link">連接怪獸 (藍 Link)</option>
                          <option value="spell">魔法卡 (綠 Spell)</option>
                          <option value="trap">陷阱卡 (紅 Trap)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1">屬性 (Attribute)</label>
                        <select
                          value={yugiohData.attribute}
                          onChange={(e) => setYugiohData(p => ({ ...p, attribute: e.target.value }))}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-amber-300 font-bold"
                        >
                          {['LIGHT', 'DARK', 'EARTH', 'WATER', 'FIRE', 'WIND', 'DIVINE'].map(a => (
                            <option key={a} value={a}>{a}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1">星級 / 階級</label>
                        <input
                          type="number"
                          min={1}
                          max={12}
                          value={yugiohData.level}
                          onChange={(e) => setYugiohData(p => ({ ...p, level: parseInt(e.target.value, 10) || 1 }))}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs font-bold text-amber-300"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1">卡名字體燙金</label>
                        <select
                          value={yugiohData.nameColor}
                          onChange={(e) => setYugiohData(p => ({ ...p, nameColor: e.target.value as any }))}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs"
                        >
                          <option value="gold">金箔雕刻 (Gold Foil)</option>
                          <option value="silver">銀箔 (Silver)</option>
                          <option value="black">黑字 (Normal)</option>
                          <option value="white">白字 (Synchro/Xyz)</option>
                          <option value="red">紅字 (Secret)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1">卡片名稱</label>
                        <input
                          value={yugiohData.name}
                          onChange={(e) => setYugiohData(p => ({ ...p, name: e.target.value }))}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold font-serif"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1">ATK 攻擊力</label>
                        <input
                          value={yugiohData.atk}
                          onChange={(e) => setYugiohData(p => ({ ...p, atk: e.target.value }))}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono font-bold text-red-400"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1">DEF 守備力</label>
                        <input
                          value={yugiohData.def}
                          onChange={(e) => setYugiohData(p => ({ ...p, def: e.target.value }))}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono font-bold text-blue-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">種族與類別括號 (Type Bar)</label>
                      <input
                        value={yugiohData.monsterType}
                        onChange={(e) => setYugiohData(p => ({ ...p, monsterType: e.target.value }))}
                        placeholder="例如：戰士族 ／ 效果"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-serif text-slate-200"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">卡片效果／通常描述 (Effect Text)</label>
                      <textarea
                        rows={4}
                        value={yugiohData.effectText}
                        onChange={(e) => setYugiohData(p => ({ ...p, effectText: e.target.value }))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-serif text-slate-200 leading-relaxed"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: Holographic Foil & Shaders */}
            {activeTab === 'foil' && (
              <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 space-y-5 shadow-xl">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-black text-cyan-300 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    全像全息光影與 3D 視差反射 (Holo Shaders)
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-bold">3D 懸浮互動</span>
                    <button
                      onClick={() => setTilt3DEnabled(!tilt3DEnabled)}
                      className={`px-3 py-1 rounded-full text-xs font-black transition-all ${
                        tilt3DEnabled ? 'bg-cyan-500 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {tilt3DEnabled ? '開啟中' : '已鎖定平面'}
                    </button>
                  </div>
                </div>

                {/* Foil Preset Cards Grid */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2">選擇頂級全息閃膜 (Holographic Foil Finish)</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {[
                      { id: 'rainbow', title: '🌈 全像彩虹', desc: '經典全版對角彩虹閃光' },
                      { id: 'qcse-25th', title: '💎 25週年碎鑽', desc: 'Quarter Century 碎鑽幾何全息' },
                      { id: 'cosmic', title: '🌌 銀河碎星', desc: '星芒星塵粒子閃烁' },
                      { id: 'secret-rare', title: '📐 斜紋十字閃', desc: 'Secret Rare 交叉細紋' },
                      { id: 'gold-etched', title: '👑 24K 金箔雕刻', desc: '奢華立體金屬質感' },
                      { id: 'none', title: '⚪ 平光霧面', desc: '純淨原卡紙質' },
                    ].map((f) => {
                      const currentFoil = 
                        system === 'pokemon' ? pokemonData.foilType :
                        system === 'onepiece' ? onePieceData.foilType :
                        yugiohData.foilType;

                      const isSelected = currentFoil === f.id;

                      return (
                        <button
                          key={f.id}
                          onClick={() => {
                            if (system === 'pokemon') setPokemonData(p => ({ ...p, foilType: f.id as FoilType }));
                            else if (system === 'onepiece') setOnePieceData(p => ({ ...p, foilType: f.id as FoilType }));
                            else setYugiohData(p => ({ ...p, foilType: f.id as FoilType }));
                          }}
                          className={`p-3 rounded-2xl border text-left transition-all ${
                            isSelected
                              ? 'bg-cyan-950/70 border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(34,211,238,0.3)]'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                          }`}
                        >
                          <div className="font-black text-xs">{f.title}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5 leading-tight">{f.desc}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Foil Opacity Slider */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                    <span>全息光澤強度 (Foil Intensity)</span>
                    <span className="text-cyan-400 font-mono">
                      {Math.round(
                        (system === 'pokemon' ? pokemonData.foilOpacity :
                         system === 'onepiece' ? onePieceData.foilOpacity :
                         yugiohData.foilOpacity) * 100
                      )}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={
                      system === 'pokemon' ? pokemonData.foilOpacity :
                      system === 'onepiece' ? onePieceData.foilOpacity :
                      yugiohData.foilOpacity
                    }
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      if (system === 'pokemon') setPokemonData(p => ({ ...p, foilOpacity: v }));
                      else if (system === 'onepiece') setOnePieceData(p => ({ ...p, foilOpacity: v }));
                      else setYugiohData(p => ({ ...p, foilOpacity: v }));
                    }}
                    className="w-full accent-cyan-400"
                  />
                </div>
              </div>
            )}

            {/* TAB 4: Prompt Engine (Midjourney / SD / JSON) */}
            {activeTab === 'prompts' && (
              <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
                <div className="flex justify-between items-center flex-wrap gap-2">
                  <h3 className="text-sm font-black text-cyan-300 flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-cyan-400" />
                    多平台專用提示詞工廠 (Prompt Generators)
                  </h3>

                  {/* Mode switch */}
                  <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px] font-bold">
                    <button
                      onClick={() => setPromptTargetMode('artwork_only')}
                      className={`px-2.5 py-1 rounded-lg transition-all ${
                        promptTargetMode === 'artwork_only' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400'
                      }`}
                    >
                      僅生成卡牌插畫
                    </button>
                    <button
                      onClick={() => setPromptTargetMode('full_card')}
                      className={`px-2.5 py-1 rounded-lg transition-all ${
                        promptTargetMode === 'full_card' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400'
                      }`}
                    >
                      AI 整張真卡 Mockup
                    </button>
                  </div>
                </div>

                {/* 1. Structured JSON (User's favorite) */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-emerald-400">
                      1. 結構化 JSON 提示詞 (Structured JSON Prompt)
                    </span>
                    <button
                      onClick={() => copyToClipboard(JSON.stringify(structuredJSON, null, 2), 'json')}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-emerald-300 font-bold flex items-center gap-1 transition-all"
                    >
                      {copiedType === 'json' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      {copiedType === 'json' ? '已複製 JSON' : '複製 JSON'}
                    </button>
                  </div>
                  <pre className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 font-mono text-[11px] text-emerald-400 max-h-48 overflow-auto whitespace-pre-wrap leading-relaxed">
                    {JSON.stringify(structuredJSON, null, 2)}
                  </pre>
                </div>

                {/* 2. Midjourney V6 command */}
                <div className="space-y-1.5 border-t border-slate-800 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-violet-400">
                      2. Midjourney V6 /imagine 專用指令
                    </span>
                    <button
                      onClick={() => copyToClipboard(midjourneyPrompt, 'mj')}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-violet-300 font-bold flex items-center gap-1 transition-all"
                    >
                      {copiedType === 'mj' ? <Check className="w-3 h-3 text-violet-400" /> : <Copy className="w-3 h-3" />}
                      {copiedType === 'mj' ? '已複製' : '一鍵複製'}
                    </button>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-violet-300 select-all">
                    {midjourneyPrompt}
                  </div>
                </div>

                {/* 3. FLUX & DALL-E Natural Language */}
                <div className="space-y-1.5 border-t border-slate-800 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-amber-400">
                      3. FLUX / DALL-E 自然語言極限增強提示詞
                    </span>
                    <button
                      onClick={() => copyToClipboard(naturalPrompt, 'nat')}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-amber-300 font-bold flex items-center gap-1 transition-all"
                    >
                      {copiedType === 'nat' ? <Check className="w-3 h-3 text-amber-400" /> : <Copy className="w-3 h-3" />}
                      {copiedType === 'nat' ? '已複製' : '一鍵複製'}
                    </button>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-amber-200 select-all leading-relaxed">
                    {naturalPrompt}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Visual Live Card & High-Res Export */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="w-full bg-slate-900/80 border border-slate-800 rounded-3xl p-6 flex flex-col items-center sticky top-6 shadow-2xl backdrop-blur-md">
              
              <div className="w-full flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-black uppercase tracking-wider text-slate-200">
                    即時高擬真卡牌預覽 (Visual Master)
                  </span>
                </div>
                <span className="text-[10px] text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded-full border border-cyan-800 font-mono">
                  {system === 'yugioh' ? '59 × 86 mm' : '63 × 88 mm'}
                </span>
              </div>

              {/* 3D Tilt Card Wrapper */}
              <div className="py-2 flex justify-center items-center">
                <TiltCard
                  enabled={tilt3DEnabled}
                  maxAngle={14}
                  cardRef={cardElementRef}
                >
                  {({ pointerX, pointerY, isHovered }) => {
                    if (system === 'pokemon') {
                      return (
                        <PokemonCard
                          data={pokemonData}
                          pointerX={pointerX}
                          pointerY={pointerY}
                          isHovered={isHovered}
                        />
                      );
                    } else if (system === 'onepiece') {
                      return (
                        <OnePieceCard
                          data={onePieceData}
                          pointerX={pointerX}
                          pointerY={pointerY}
                          isHovered={isHovered}
                        />
                      );
                    } else {
                      return (
                        <YuGiOhCard
                          data={yugiohData}
                          pointerX={pointerX}
                          pointerY={pointerY}
                          isHovered={isHovered}
                        />
                      );
                    }
                  }}
                </TiltCard>
              </div>

              {/* Export Buttons */}
              <div className="w-full mt-6 space-y-2.5">
                <button
                  onClick={handleDownloadCard}
                  disabled={exporting}
                  className="w-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:brightness-110 disabled:opacity-50 text-slate-950 font-black py-3.5 px-4 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(250,204,21,0.3)] transition-all"
                >
                  {exporting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  {exporting ? '正在生成 4K 超高清真卡中...' : '📸 下載 4K 超高畫質真卡 (Print-Ready PNG)'}
                </button>

                <div className="flex items-center justify-between text-[11px] text-slate-400 px-2">
                  <span className="flex items-center gap-1">
                    <Info className="w-3.5 h-3.5 text-cyan-400" />
                    滑鼠懸停即可體驗 3D 視差全像反射
                  </span>
                  <button
                    onClick={() => setTilt3DEnabled(!tilt3DEnabled)}
                    className="text-cyan-400 hover:underline flex items-center gap-1 font-bold"
                  >
                    <Rotate3d className="w-3 h-3" />
                    {tilt3DEnabled ? '鎖定卡面' : '開啟3D'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
