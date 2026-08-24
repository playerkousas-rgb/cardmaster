# TCG Prompt & Card Studio - Pro Max (Next.js + Vercel)

這是一個專為 TCG 卡牌（Pokémon 寶可夢、One Piece 航海王、Yu-Gi-Oh! 遊戲王）設計的 AI 提示詞生成器與即時卡牌製圖平台。

## ✨ 核心特色
1. **即時 AI 免費生圖**：內建整合 Pollinations (FLUX) 引擎，免註冊、免 API Key，一鍵為卡牌生成專屬日系動漫立繪！
2. **多系統視覺卡牌渲染**：支援 3 大卡牌系統實時預覽，支援卡牌屬性、技能、費用、攻防值與稀有度設定。
3. **超高清 PNG 導出**：支援 3 倍超高解析度卡牌圖片直接下載。
4. **結構化 JSON 輸出**：保留最完整的 AI 繪圖專用 JSON 格式與一鍵複製功能。

## 🚀 快速部署至 GitHub ＋ Vercel

### 1. 本地開發測試
```bash
npm install
npm run dev
```
打開瀏覽器訪問 `http://localhost:3000`。

### 2. 部署至 Vercel
1. 將此資料夾內的所有代碼 Push 至您的 GitHub Repository（例如 `tcg-card-studio`）。
2. 前往 [Vercel](https://vercel.com/)，點選 **Add New Project** 並 Import 該 Repo。
3. （選填）若想使用 Hugging Face 的 Animagine / FLUX 模型，在 Environment Variables 加入 `HUGGINGFACE_API_KEY`；若不填則系統會自動使用完全免費且免金鑰的 Pollinations 引擎。
4. 點擊 **Deploy** 即可在 1 分鐘內獲得專屬公開網址！
