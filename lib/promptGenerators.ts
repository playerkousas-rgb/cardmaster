export interface PromptConfig {
  system: 'pokemon' | 'onepiece' | 'yugioh';
  name: string;
  partner?: string;
  pose: string;
  expression: string;
  setting: string;
  details: string;
  atmosphere: string;
  artStylePreset: string;
  cardVariant: string;
  foilType: string;
  cardNumber: string;
  targetMode: 'artwork_only' | 'full_card'; // whether user wants illustration only or full card mockup
}

export function generateStructuredJSON(config: PromptConfig) {
  const { system, name, partner, pose, expression, setting, details, atmosphere, artStylePreset, cardVariant, foilType, cardNumber, targetMode } = config;

  let theme = '';
  if (system === 'pokemon') {
    theme = 'Official Pokémon TCG high-end illustration aesthetic, dynamic full-bleed action scene, vibrant cel-shaded anime style, intense energy effects';
  } else if (system === 'onepiece') {
    theme = 'Official One Piece Card Game aesthetic, dynamic manga-style impact lines, high-saturation cinematic colors';
  } else {
    theme = 'Yu-Gi-Oh! OCG official card art style, intricate fantasy detailing, sharp anime cel-shading';
  }

  return {
    prompt_version: "2.0-ULTRA-TCG",
    target: targetMode === 'artwork_only' ? 'Card Illustration Artwork' : 'Complete Physical Collectible TCG Card',
    subject: `Masterpiece 2D anime style character "${name}"`,
    art_style: {
      preset: artStylePreset || "Hyper-Detailed Anime Cel-Shading",
      rendering: "Vibrant cel-shaded anime style, high contrast, clean sharp linework, dramatic lighting, masterpiece, best quality, ultra detailed, strong motion lines, dynamic composition",
      theme,
      finish: foilType
    },
    character_details: {
      name,
      ...(partner ? { partner_or_companion: partner } : {}),
      pose: pose || "dynamic battle pose full of power and motion",
      expression: expression || "confident, heroic and energetic expression",
    },
    background: {
      setting: setting || "epic battle environment",
      details: details || "energy aura particles, dynamic lighting, high resolution background",
      atmosphere: atmosphere || "dramatic lighting, cinematic atmosphere"
    },
    card_specifications: {
      system: system.toUpperCase(),
      variant: cardVariant,
      card_number: cardNumber,
      aspect_ratio: system === 'yugioh' ? '59:86' : '63:88',
      print_finish: `${foilType.toUpperCase()} Holographic foil, metallic edge embossing`
    }
  };
}

export function generateMidjourneyPrompt(config: PromptConfig): string {
  const { system, name, partner, pose, expression, setting, atmosphere, artStylePreset, targetMode } = config;
  
  let base = `${name}`;
  if (partner) base += ` with ${partner}`;
  if (pose) base += `, ${pose}`;
  if (expression) base += `, ${expression}`;
  if (setting) base += `, in ${setting}`;
  if (atmosphere) base += `, ${atmosphere}`;

  let styleModifier = '';
  if (system === 'pokemon') {
    styleModifier = 'official Pokemon TCG Special Art Rare illustration, vibrant anime cel shading, Ken Sugimori dynamic style, energy particles, dramatic rim lighting';
  } else if (system === 'onepiece') {
    styleModifier = 'official One Piece Card Game manga alt art, Eiichiro Oda color spread style, dynamic perspective, bold ink outlines, vibrant cinematic colors';
  } else {
    styleModifier = 'Yu-Gi-Oh OCG card illustration masterpiece, Kazuki Takahashi dark fantasy style, intricate summon circle, dramatic anime lighting';
  }

  if (targetMode === 'full_card') {
    return `/imagine prompt: ${base}, full collectible trading card frame, holographic foil texture, sharp borders, gold etched details, ${styleModifier}, 8k resolution, masterpiece --ar 2:3 --v 6.0 --style raw`;
  }

  return `/imagine prompt: ${base}, character card illustration, clean borders, ${styleModifier}, masterpiece, best quality, ultra-detailed, 8k --ar 3:4 --v 6.0 --style raw`;
}

export function generateNaturalPrompt(config: PromptConfig): string {
  const { system, name, partner, pose, expression, setting, atmosphere, artStylePreset } = config;
  
  let prompt = `A masterpiece anime card illustration of ${name}`;
  if (partner) prompt += ` alongside ${partner}`;
  if (pose) prompt += `. Character is depicted ${pose}`;
  if (expression) prompt += ` with a ${expression}`;
  if (setting) prompt += `. The scene is set in ${setting}`;
  if (atmosphere) prompt += `, featuring ${atmosphere}`;

  if (system === 'pokemon') {
    prompt += '. Rendered in official Pokémon TCG SAR style with vibrant cel shading, vivid saturated colors, glowing elemental particles, and cinematic action lines.';
  } else if (system === 'onepiece') {
    prompt += '. Rendered in authentic One Piece TCG Manga Alt Art aesthetic with bold brushstrokes, vibrant colors, dynamic speed lines, and cinematic atmosphere.';
  } else {
    prompt += '. Rendered in authentic Yu-Gi-Oh! OCG card art style with sharp anime cel shading, magical summoning glyphs, and high-contrast dramatic fantasy lighting.';
  }

  return prompt;
}
