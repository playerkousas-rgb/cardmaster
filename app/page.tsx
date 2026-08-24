'use client';

import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { 
  Sparkles, Download, Copy, Check, Image as ImageIcon, 
  Zap, Flame, Shield, Swords, Wand2, RefreshCw 
} from 'lucide-react';

export default function TCGStudioPage() {
  const [system, setSystem] = useState<'pokemon' | 'onepiece' | 'yugioh'>('pokemon');
  const [loadingAI, setLoadingAI] = useState(false);
  const [copied, setCopied] = useState(false);

  // 表單資料
  const [name, setName] = useState('貝登堡');
  const [pose, setPose] = useState('右手作童軍三指敬禮，左手手持精靈球');
  const [expression, setExpression] = useState('自信且充滿活力的認真神情');
  const [bgSetting, setBgSetting] = useState('非洲草原上的廣闊平原');
  const [bgDetails, setBgDetails] = useState('遠處有岩石、山丘與稀疏的樹木');
  const [bgAtmosphere, setBgAtmosphere] = useState('金黃色的夕陽，充滿冒險與活力');

  // Pokémon 專屬
  const [partnerPokemon, setPartnerPokemon] = useState('噴火龍');
  const [pokemonType, setPokemonType] = useState('火');
  const [pokeHp, setPokeHp] = useState('330');
  const [move1Name, setMove1Name] = useState('指令');
  const [move1Energy, setMove1Energy] = useState('2草');
  const [move1Damage, setMove1Damage] = useState('50');
  const [move1Text, setMove1Text] = useState('暈眩場上寶可夢並做成小量傷害。');
  const [move2Name, setMove2Name] = useState('召喚');
  const [move2Energy, setMove2Energy] = useState('5火');
  const [move2Damage, setMove2Damage] = useState('250');
  const [move2Text, setMove2Text] = useState('召喚其他寶可夢協助攻擊。');
  const [ability, setAbility] = useState('特能：領袖，在場時其他寶可夢增加 30 點攻擊。');
  const [pokeCardNumber, setPokeCardNumber] = useState('G F 121/728');
  const [finishPokemon, setFinishPokemon] = useState('Full Art Rainbow Holographic Foil');

  // One Piece 專屬
  const [opColor, setOpColor] = useState('紅');
  const [opCost, setOpCost] = useState('10');
  const [opPower, setOpPower] = useState('12000');
  const [opCardName, setOpCardName] = useState('貝登堡‧維爾');
  const [opSubtitle, setOpSubtitle] = useState('四皇 / 童軍之父');
  const [opEffect, setOpEffect] = useState('登場時，所有童軍卡牌進場並獲得強力攻擊加成。');
  const [opCardNumber, setOpCardNumber] = useState('P-041');
  const [finishOp, setFinishOp] = useState('Alt Art Parallel Rare');

  // Yu-Gi-Oh 專屬
  const [ygName, setYgName] = useState('童軍之父 貝登堡');
  const [ygAttr, setYgAttr] = useState('LIGHT');
  const [ygLevel, setYgLevel] = useState(10);
  const [ygAtk, setYgAtk] = useState('∞');
  const [ygDef, setYgDef] = useState('∞');
  const [ygEffect, setYgEffect] = useState('這張卡在規則上也當作「貝登堡」卡使用。召喚·特殊召喚成功時，可以從卡組把1張「貝登堡」相關卡加入手牌。');
  const [ygCardNumber, setYgCardNumber] = useState('DDX-001');
  const [finishYg, setFinishYg] = useState('QCSE 25th Anniversary Crushed Diamond');

  // 卡牌立繪
  const [cardImage, setCardImage] = useState<string>(
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80'
  );

  const cardRef = useRef<HTMLDivElement>(null);

  // 調用後端 AI 生圖
  const handleGenerateAIImage = async () => {
    setLoadingAI(true);
    try {
      let promptText = `${name}, ${pose}, ${expression}, in ${bgSetting}, ${bgAtmosphere}`;
      if (system === 'pokemon') promptText += ` with partner ${partnerPokemon}, ${pokemonType} element aura`;
      
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptText, system }),
      });

      const data = await res.json();
      if (data.imageUrl) {
        setCardImage(data.imageUrl);
      }
    } catch (e) {
      alert('AI 生圖連線較忙碌，請稍後重試！');
    } finally {
      setLoadingAI(false);
    }
  };

  // 上傳本地圖片
  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) setCardImage(event.target.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 下載卡牌 PNG
  const handleDownloadCard = async () => {
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
      });
      const link = document.createElement('a');
      link.download = `${system.toUpperCase()}_${name}_Card.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      alert('導出圖片發生問題，建議您直接上傳本機圖片重試。');
    }
  };

  // 產出 JSON 提示詞
  const structuredJSON: any = {
    subject: `2D anime style character "${name}" based on reference photo`,
    art_style: {
      rendering: "Vibrant cel-shaded anime style, high contrast, clean sharp linework, dramatic lighting, masterpiece, best quality, ultra detailed, strong motion lines, dynamic composition",
      theme: system === 'pokemon' 
        ? "Official Pokémon TCG high-end illustration aesthetic, dynamic full-bleed action scene, vibrant cel-shaded 90s anime style, intense energy effects"
        : system === 'onepiece'
        ? "Official One Piece Card Game aesthetic, dynamic manga-style impact lines, high-saturation cinematic colors"
        : "Yu-Gi-Oh! OCG official card art style, intricate fantasy detailing, sharp anime cel-shading"
    },
    character_details: {
      name,
      pose: pose || "dynamic battle pose full of power",
      expression: expression || "confident and energetic expression",
      ...(system === 'pokemon' ? { partner_pokemon: { name: partnerPokemon, type: pokemonType } } : {})
    },
    background: {
      setting: bgSetting || "epic battle scene",
      details: bgDetails || "",
      atmosphere: bgAtmosphere || ""
    },
    card_layout: {
      dimensions: "Standard 63x88mm card ratio, full-bleed illustration with proper TCG borders",
      system: system.toUpperCase(),
      card_number: system === 'pokemon' ? pokeCardNumber : system === 'onepiece' ? opCardNumber : ygCardNumber,
      finish: system === 'pokemon' ? finishPokemon : system === 'onepiece' ? finishOp : finishYg
    }
  };

  const copyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(structuredJSON, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 屬性顏色對應
  const pokemonTypeGradients: Record<string, string> = {
    "火": "from-red-300 via-red-500 to-red-800",
    "草": "from-green-300 via-green-500 to-green-800",
    "水": "from-blue-300 via-blue-500 to-blue-800",
    "電": "from-yellow-200 via-yellow-400 to-amber-700",
    "超能": "from-purple-300 via-purple-500 to-purple-900",
    "惡": "from-slate-400 via-slate-600 to-slate-950",
    "龍": "from-amber-200 via-amber-500 to-slate-800",
    "鋼": "from-gray-300 via-slate-400 to-gray-700",
    "妖精": "from-pink-300 via-pink-400 to-pink-700",
  };

  const onepieceColorBorders: Record<string, string> = {
    "紅": "border-red-500 shadow-[0_0_25px_rgba(239,68,68,0.5)]",
    "綠": "border-green-500 shadow-[0_0_25px_rgba(34,197,94,0.5)]",
    "藍": "border-blue-500 shadow-[0_0_25px_rgba(59,130,246,0.5)]",
    "紫": "border-purple-500 shadow-[0_0_25px_rgba(168,85,247,0.5)]",
    "黑": "border-slate-600 shadow-[0_0_25px_rgba(100,116,139,0.5)]",
    "黃": "border-yellow-500 shadow-[0_0_25px_rgba(234,179,8,0.5)]",
  };

  return (
    <main className="min-h-screen bg-[#070b14] text-slate-100 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-bold mb-3 tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5" /> Next.js + Vercel + Free AI Image Engine
          </div>
          <h1 className="text-3xl md:text-5xl font-black bg-gradient-to-r from-cyan-400 via-teal-300 to-violet-500 bg-clip-text text-transparent">
            TCG PROMPT & CARD STUDIO
          </h1>
          <p className="text-slate-400 mt-2 text-xs md:text-sm">
            免費 AI 繪圖連動 ＋ 視覺卡牌即時生成 ＋ 結構化 JSON 輸出
          </p>
        </div>

        {/* 系統切換 */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl p-2 mb-8 flex justify-center gap-3 flex-wrap">
          {(['pokemon', 'onepiece', 'yugioh'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSystem(s)}
              className={`px-6 md:px-8 py-3 rounded-2xl text-xs md:text-sm font-bold transition-all flex items-center gap-2 ${
                system === s
                  ? 'bg-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(34,211,238,0.4)]'
                  : 'hover:bg-slate-800 text-slate-400'
              }`}
            >
              {s === 'pokemon' && <Zap className="w-4 h-4" />}
              {s === 'onepiece' && <Swords className="w-4 h-4" />}
              {s === 'yugioh' && <Shield className="w-4 h-4" />}
              {s === 'pokemon' ? 'Pokémon 寶可夢' : s === 'onepiece' ? 'One Piece 航海王' : 'Yu-Gi-Oh! 遊戲王'}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* 左側表單 (佔 7 欄) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. 立繪與 AI 生圖 */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
              <h2 className="text-cyan-400 font-bold mb-3 flex items-center gap-2 text-sm md:text-base">
                <ImageIcon className="w-4 h-4" /> 卡牌立繪圖片 (Artwork)
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">上傳自訂圖片</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUploadImage}
                    className="w-full text-xs text-slate-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:bg-cyan-500/20 file:text-cyan-300 bg-slate-950 border border-slate-800 rounded-2xl p-1.5 cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">免費 AI 一鍵生成立繪</label>
                  <button
                    onClick={handleGenerateAIImage}
                    disabled={loadingAI}
                    className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:brightness-110 disabled:opacity-50 text-white font-bold py-2.5 px-4 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md"
                  >
                    {loadingAI ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                    {loadingAI ? 'AI 繪圖運算中...' : '即時 AI 生成立繪 (FLUX 引擎)'}
                  </button>
                </div>
              </div>
            </div>

            {/* 2. 角色基本資訊 */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-3">
              <h2 className="text-cyan-400 font-bold text-sm md:text-base">角色基礎設定</h2>
              <div>
                <label className="block text-xs text-slate-400 mb-1">名稱</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2.5 text-sm font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">動作姿態 (Pose)</label>
                <textarea
                  rows={2}
                  value={pose}
                  onChange={(e) => setPose(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2 text-xs md:text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">神情表現 (Expression)</label>
                <input
                  type="text"
                  value={expression}
                  onChange={(e) => setExpression(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2 text-xs md:text-sm"
                />
              </div>
            </div>

            {/* 3. 背景設定 */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-3">
              <h2 className="text-cyan-400 font-bold text-sm md:text-base">Background (背景設定)</h2>
              <div>
                <label className="block text-xs text-slate-400 mb-1">場景 (Setting)</label>
                <input
                  type="text"
                  value={bgSetting}
                  onChange={(e) => setBgSetting(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2 text-xs md:text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">環境細節 (Details)</label>
                <textarea
                  rows={2}
                  value={bgDetails}
                  onChange={(e) => setBgDetails(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2 text-xs md:text-sm"
                />
              </div>
            </div>

            {/* 4. 系統專屬設定 */}
            {system === 'pokemon' && (
              <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4">
                <h2 className="text-cyan-400 font-bold text-sm md:text-base">Pokémon 卡牌數值</h2>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">夥伴寶可夢</label>
                    <input
                      type="text"
                      value={partnerPokemon}
                      onChange={(e) => setPartnerPokemon(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">精靈屬性</label>
                    <select
                      value={pokemonType}
                      onChange={(e) => setPokemonType(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2 text-sm"
                    >
                      {['火', '草', '水', '電', '超能', '惡', '龍', '鋼', '妖精'].map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">招式 1 (名稱 / 傷害)</label>
                    <div className="flex gap-2">
                      <input
                        value={move1Name}
                        onChange={(e) => setMove1Name(e.target.value)}
                        className="w-2/3 bg-slate-950 border border-slate-800 rounded-2xl px-3 py-1.5 text-xs"
                      />
                      <input
                        value={move1Damage}
                        onChange={(e) => setMove1Damage(e.target.value)}
                        className="w-1/3 bg-slate-950 border border-slate-800 rounded-2xl px-3 py-1.5 text-xs text-amber-400 font-bold"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">招式 2 (名稱 / 傷害)</label>
                    <div className="flex gap-2">
                      <input
                        value={move2Name}
                        onChange={(e) => setMove2Name(e.target.value)}
                        className="w-2/3 bg-slate-950 border border-slate-800 rounded-2xl px-3 py-1.5 text-xs"
                      />
                      <input
                        value={move2Damage}
                        onChange={(e) => setMove2Damage(e.target.value)}
                        className="w-1/3 bg-slate-950 border border-slate-800 rounded-2xl px-3 py-1.5 text-xs text-amber-400 font-bold"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">特性說明 (Ability)</label>
                  <textarea
                    rows={2}
                    value={ability}
                    onChange={(e) => setAbility(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3 py-2 text-xs"
                  />
                </div>
              </div>
            )}

            {system === 'onepiece' && (
              <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-3">
                <h2 className="text-cyan-400 font-bold text-sm md:text-base">One Piece 航海王設定</h2>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">費用 (Cost)</label>
                    <input
                      value={opCost}
                      onChange={(e) => setOpCost(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3 py-2 text-xs font-bold text-amber-300"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">戰鬥力 (Power)</label>
                    <input
                      value={opPower}
                      onChange={(e) => setOpPower(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3 py-2 text-xs font-bold text-amber-300"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">卡牌顏色</label>
                    <select
                      value={opColor}
                      onChange={(e) => setOpColor(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3 py-2 text-xs"
                    >
                      {['紅', '綠', '藍', '紫', '黑', '黃'].map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">特徵標籤 (Subtitle)</label>
                  <input
                    value={opSubtitle}
                    onChange={(e) => setOpSubtitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">效果文字 (Effect)</label>
                  <textarea
                    rows={3}
                    value={opEffect}
                    onChange={(e) => setOpEffect(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3 py-2 text-xs"
                  />
                </div>
              </div>
            )}

            {system === 'yugioh' && (
              <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-3">
                <h2 className="text-cyan-400 font-bold text-sm md:text-base">Yu-Gi-Oh! 遊戲王設定</h2>
                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">屬性</label>
                    <select
                      value={ygAttr}
                      onChange={(e) => setYgAttr(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-2 py-1.5 text-xs"
                    >
                      {['LIGHT', 'DARK', 'DIVINE', 'FIRE', 'WATER', 'WIND', 'EARTH'].map((a) => (
                        <option key={a} value={a}>{a}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">星級 (Level)</label>
                    <input
                      type="number"
                      value={ygLevel}
                      onChange={(e) => setYgLevel(parseInt(e.target.value) || 1)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-2 py-1.5 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">ATK</label>
                    <input
                      value={ygAtk}
                      onChange={(e) => setYgAtk(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-2 py-1.5 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">DEF</label>
                    <input
                      value={ygDef}
                      onChange={(e) => setYgDef(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-2 py-1.5 text-xs font-bold"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">怪獸效果說明</label>
                  <textarea
                    rows={3}
                    value={ygEffect}
                    onChange={(e) => setYgEffect(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3 py-2 text-xs"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 右側：即時卡牌渲染與下載 (佔 5 欄) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 flex flex-col items-center sticky top-6">
              <h2 className="text-cyan-400 font-bold text-base mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> 即時卡牌渲染 (Visual Card)
              </h2>

              {/* 卡牌容器 */}
              <div className="w-[330px] h-[470px] relative">
                
                {/* 1. Pokémon 卡牌 */}
                {system === 'pokemon' && (
                  <div
                    ref={cardRef}
                    className={`w-full h-full rounded-[18px] p-2.5 text-slate-900 flex flex-col justify-between relative overflow-hidden font-sans border-[3px] border-[#fef08a] select-none bg-gradient-to-br ${pokemonTypeGradients[pokemonType] || 'from-amber-200 to-amber-600'} shadow-2xl`}
                  >
                    <div className="holo-overlay absolute inset-0 z-20"></div>
                    <div className="relative z-10 flex justify-between items-center px-2 py-1 bg-amber-100/90 rounded-t-lg border-b border-amber-300">
                      <div className="flex items-center gap-1">
                        <span className="text-[9px] font-black uppercase bg-amber-500 text-white px-1.5 py-0.2 rounded">TAG TEAM</span>
                        <span className="font-black text-xs">{name} & {partnerPokemon}</span>
                      </div>
                      <span className="font-black text-sm text-red-600 font-orbitron">{pokeHp} HP</span>
                    </div>

                    <div className="relative z-10 w-full h-[175px] bg-slate-950 rounded-md overflow-hidden border-2 border-amber-300 my-1">
                      <img src={cardImage} alt="Artwork" className="w-full h-full object-cover" />
                    </div>

                    <div className="relative z-10 bg-amber-50/95 rounded-b-lg p-2 flex flex-col justify-between text-xs space-y-1">
                      <div className="border-b border-amber-200 pb-1">
                        <span className="bg-red-600 text-white text-[8px] px-1 rounded font-black mr-1">特性</span>
                        <span className="text-[10px] text-slate-700">{ability}</span>
                      </div>
                      <div className="flex justify-between font-bold text-xs">
                        <span>{move1Name} ({move1Energy})</span>
                        <span className="text-amber-700 font-black font-orbitron">{move1Damage}</span>
                      </div>
                      <div className="flex justify-between font-bold text-xs">
                        <span>{move2Name} ({move2Energy})</span>
                        <span className="text-red-600 font-black font-orbitron">{move2Damage}</span>
                      </div>
                    </div>

                    <div className="relative z-10 flex justify-between text-[8px] font-bold text-amber-950 px-1">
                      <span>SKW SCOUT EDITION</span>
                      <span>{pokeCardNumber} ★★★</span>
                    </div>
                  </div>
                )}

                {/* 2. One Piece 卡牌 */}
                {system === 'onepiece' && (
                  <div
                    ref={cardRef}
                    className={`w-full h-full rounded-[18px] p-2.5 text-white flex flex-col justify-between relative overflow-hidden font-sans border-4 bg-slate-950 select-none ${onepieceColorBorders[opColor] || 'border-amber-500'}`}
                  >
                    <div className="holo-overlay absolute inset-0 z-20"></div>
                    <div className="relative z-10 flex justify-between items-start">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-300 to-amber-600 border-2 border-white flex flex-col items-center justify-center shadow-lg">
                        <span className="text-[6px] font-black uppercase text-slate-900">COST</span>
                        <span className="text-base font-black font-bebas text-slate-950">{opCost}</span>
                      </div>
                      <div className="px-2.5 py-0.5 bg-red-600/90 rounded-full border border-amber-300 flex items-center gap-1 shadow-lg">
                        <span className="text-[8px] font-black text-amber-200">POWER</span>
                        <span className="text-sm font-black font-bebas text-white">{opPower}</span>
                      </div>
                    </div>

                    <div className="relative z-10 w-full h-[215px] rounded-lg overflow-hidden border border-amber-400/40 my-1 bg-slate-950">
                      <img src={cardImage} alt="Artwork" className="w-full h-full object-cover" />
                    </div>

                    <div className="relative z-10 bg-slate-900/90 border border-amber-400/50 rounded-lg p-2 space-y-1">
                      <div className="flex justify-between items-center">
                        <h3 className="text-xs font-black text-amber-300">{opCardName || name}</h3>
                        <span className="text-[8px] bg-red-950 text-red-200 px-1.5 py-0.2 rounded font-bold">{opSubtitle}</span>
                      </div>
                      <p className="text-[9px] text-slate-300 line-clamp-3">{opEffect}</p>
                    </div>

                    <div className="relative z-10 flex justify-between text-[7px] text-amber-400 font-mono px-1">
                      <span>LEADER / CHARACTER</span>
                      <span>{opCardNumber} SEC</span>
                    </div>
                  </div>
                )}

                {/* 3. Yu-Gi-Oh 卡牌 */}
                {system === 'yugioh' && (
                  <div
                    ref={cardRef}
                    className="w-full h-full rounded-[16px] p-2.5 text-slate-900 flex flex-col justify-between relative overflow-hidden font-sans border-[3px] border-[#d97706] bg-gradient-to-b from-[#c27b38] to-[#4a280c] select-none"
                  >
                    <div className="holo-overlay absolute inset-0 z-20"></div>
                    <div className="relative z-10 flex justify-between items-center px-2 py-0.5 bg-amber-100/95 rounded border border-amber-900 shadow">
                      <span className="font-bold text-[11px] text-slate-950 truncate font-cinzel">{ygName || name}</span>
                      <span className="text-[9px] font-black bg-amber-600 text-white px-1.5 py-0.2 rounded">{ygAttr}</span>
                    </div>

                    <div className="relative z-10 flex justify-end px-2 py-0.5 text-[9px] text-amber-400 tracking-tighter">
                      {"⭐".repeat(Math.min(Math.max(ygLevel, 1), 12))}
                    </div>

                    <div className="relative z-10 w-full h-[185px] bg-slate-900 border-2 border-amber-800 rounded overflow-hidden my-0.5">
                      <img src={cardImage} alt="Artwork" className="w-full h-full object-cover" />
                    </div>

                    <div className="relative z-10 bg-amber-100/95 rounded border border-amber-900 p-1.5 flex flex-col justify-between text-slate-950 flex-1">
                      <p className="text-[8px] leading-tight text-slate-800 line-clamp-3">{ygEffect}</p>
                      <div className="flex justify-end gap-3 text-[10px] font-black font-cinzel border-t border-amber-300 pt-0.5">
                        <div>ATK / <span className="text-red-700">{ygAtk}</span></div>
                        <div>DEF / <span className="text-blue-800">{ygDef}</span></div>
                      </div>
                    </div>

                    <div className="relative z-10 flex justify-between text-[7px] text-amber-200 font-mono px-1">
                      <span>83719402</span>
                      <span>{ygCardNumber} (25th QCSE)</span>
                    </div>
                  </div>
                )}
              </div>

              {/* 下載按鈕 */}
              <button
                onClick={handleDownloadCard}
                className="w-full mt-6 bg-gradient-to-r from-amber-500 to-yellow-400 hover:brightness-110 text-slate-950 font-black py-3 px-4 rounded-2xl text-xs md:text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <Download className="w-4 h-4" /> 下載高畫質卡牌圖片 (PNG)
              </button>
            </div>
          </div>
        </div>

        {/* 底部 JSON 輸出 */}
        <div className="mt-8 bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
          <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
            <h3 className="text-base md:text-lg font-bold text-cyan-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Structured JSON Prompt（AI 繪圖專用提示詞）
            </h3>
            <button
              onClick={copyJSON}
              className="bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-cyan-500/30 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? '已複製！' : '一鍵複製 JSON'}
            </button>
          </div>
          <pre className="bg-slate-950 p-6 rounded-2xl border border-slate-800 font-mono text-xs text-emerald-400 overflow-auto max-h-[300px] whitespace-pre-wrap leading-relaxed">
            {JSON.stringify(structuredJSON, null, 2)}
          </pre>
        </div>
      </div>
    </main>
  );
}
