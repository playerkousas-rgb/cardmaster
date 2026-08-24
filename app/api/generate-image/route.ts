import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt, system, model = 'flux' } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // 1. 構建高質量 TCG 動漫風格 Prompt
    let enhancedPrompt = `masterpiece, best quality, ultra detailed anime card artwork, dynamic battle pose, vibrant cel shading, cinematic lighting, 8k resolution, ${prompt}`;
    
    if (system === 'pokemon') {
      enhancedPrompt += ', official pokemon card game illustration style, energy particles, full bleed action';
    } else if (system === 'onepiece') {
      enhancedPrompt += ', official one piece tcg manga style, high impact speed lines, bold vivid colors';
    } else if (system === 'yugioh') {
      enhancedPrompt += ', yu-gi-oh ocg card illustration style, intricate fantasy summoning magic';
    }

    // 2. 方案 A：使用 Hugging Face 免費 Token (若有設定環境變數)
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
            parameters: { width: 768, height: 768 }
          }),
        });

        if (hfRes.ok) {
          const buffer = await hfRes.arrayBuffer();
          const base64 = Buffer.from(buffer).toString('base64');
          return NextResponse.json({
            imageUrl: `data:image/jpeg;base64,${base64}`,
            provider: 'huggingface',
          });
        }
      } catch (hfErr) {
        console.warn('HuggingFace failed, falling back to Pollinations:', hfErr);
      }
    }

    // 3. 方案 B：使用 100% 免費、免 API Key 的 Pollinations.ai (FLUX 引擎)
    const seed = Math.floor(Math.random() * 9999999);
    const encoded = encodeURIComponent(enhancedPrompt);
    const imageUrl = `https://image.pollinations.ai/prompt/${encoded}?width=768&height=768&seed=${seed}&model=${model}&nologo=true`;

    return NextResponse.json({
      imageUrl,
      provider: 'pollinations',
    });
  } catch (err: any) {
    console.error('Image generation error:', err);
    return NextResponse.json({ error: err.message || 'Generation failed' }, { status: 500 });
  }
}
