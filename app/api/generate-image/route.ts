import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { 
      prompt, 
      system = 'pokemon', 
      stylePreset = 'official_tcg',
      model = 'flux',
      aspect = 'portrait' // 'portrait' | 'square'
    } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // 1. Determine style keywords based on preset & system
    let styleKeywords = 'masterpiece, best quality, ultra-detailed 2D anime card illustration, sharp clean linework, vibrant cel-shading, dynamic lighting, 8k resolution';

    if (stylePreset === 'cel_shaded_90s') {
      styleKeywords += ', 90s vintage anime aesthetic, classic Ken Sugimori watercolor vibe, retro anime cel shading';
    } else if (stylePreset === 'manga_ink') {
      styleKeywords += ', Japanese manga ink color spread, bold dynamic brush lines, Eiichiro Oda art style, high impact speedlines';
    } else if (stylePreset === 'dark_fantasy') {
      styleKeywords += ', dark fantasy gothic anime, Kazuki Takahashi Yu-Gi-Oh card style, glowing magic circles, high contrast dramatic lighting';
    } else if (stylePreset === 'gold_etched') {
      styleKeywords += ', gold etched holographic foil background, shiny metallic reflections, luxurious trading card secret rare style';
    } else {
      // official_tcg default
      if (system === 'pokemon') {
        styleKeywords += ', official Pokémon TCG Special Art Rare illustration, radiant elemental aura particles, vibrant saturated colors, full bleed dynamic composition';
      } else if (system === 'onepiece') {
        styleKeywords += ', official One Piece TCG Manga Alternate Art, explosive action pose, bold vivid colors, cinematic depth of field';
      } else if (system === 'yugioh') {
        styleKeywords += ', official Yu-Gi-Oh OCG card artwork, intricate summoning magic seal, sharp cel-shaded anime fantasy monster art';
      }
    }

    const enhancedPrompt = `${prompt}, ${styleKeywords}, high resolution illustration, centered character, no text overlay, no watermarks`;

    const width = aspect === 'square' ? 768 : 768;
    const height = aspect === 'square' ? 768 : 1024;

    // 2. Option A: Hugging Face API if key is present
    const hfToken = process.env.HUGGINGFACE_API_KEY;
    if (hfToken) {
      try {
        const hfModel = 'black-forest-labs/FLUX.1-schnell';
        const hfRes = await fetch(`https://api-inference.huggingface.co/models/${hfModel}`, {
          headers: {
            Authorization: `Bearer ${hfToken}`,
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify({
            inputs: enhancedPrompt,
            parameters: { width, height }
          }),
        });

        if (hfRes.ok) {
          const buffer = await hfRes.arrayBuffer();
          const base64 = Buffer.from(buffer).toString('base64');
          return NextResponse.json({
            imageUrl: `data:image/jpeg;base64,${base64}`,
            provider: 'huggingface',
            prompt: enhancedPrompt,
          });
        }
      } catch (hfErr) {
        console.warn('HuggingFace failed, falling back to Pollinations:', hfErr);
      }
    }

    // 3. Option B: Pollinations.ai (FLUX engine) with seed & width/height
    const seed = Math.floor(Math.random() * 9999999);
    const encoded = encodeURIComponent(enhancedPrompt);
    const imageUrl = `https://image.pollinations.ai/prompt/${encoded}?width=${width}&height=${height}&seed=${seed}&model=${model}&nologo=true`;

    return NextResponse.json({
      imageUrl,
      provider: 'pollinations',
      prompt: enhancedPrompt,
    });
  } catch (err: any) {
    console.error('Image generation error:', err);
    return NextResponse.json({ error: err.message || 'Generation failed' }, { status: 500 });
  }
}
