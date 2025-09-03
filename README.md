# Pattern API - Full (YouTube / TikTok / Google integration)

This repository is a ready-to-deploy template for Vercel. It contains serverless API endpoints that aggregate
data from YouTube, TikTok, and Google (or provide dummy fallbacks) and produce a 4-digit patterned number with interpretations.

## Files (important)
- /api/_providers.js       -> provider functions (YouTube, Google, TikTok). Uses env vars:
    - YT_API_KEY (optional) -> if present, real YouTube data will be fetched.
    - GOOGLE_CUSTOM_SEARCH_URL (optional) -> custom search endpoint if you have one.
    - TIKTOK_CUSTOM_URL (optional) -> custom tiktok provider endpoint if you have one.
- /api/youtube.js          -> simple wrapper endpoint
- /api/google.js           -> simple wrapper endpoint
- /api/tiktok.js           -> simple wrapper endpoint
- /api/pattern.js          -> main aggregator that returns the patterned number + interpretation
- package.json             -> project config
- pattern-frontend.html    -> frontend that calls /api/pattern (included below)

## Deploy to Vercel (step-by-step)
1. Fork or upload this repo to GitHub.
2. Go to https://vercel.com and import the GitHub repo (New Project → Import).
3. Set environment variables in Vercel dashboard if you have API keys:
   - YT_API_KEY (YouTube Data API v3 key)
   - GOOGLE_CUSTOM_SEARCH_URL (optional)
   - TIKTOK_CUSTOM_URL (optional)
4. Deploy. After deploy, your API will be at:
   https://your-vercel-app.vercel.app/api/pattern

## Frontend usage
Open `pattern-frontend.html` and set endpoint to `https://your-vercel-app.vercel.app/api/pattern`

## Notes
- TikTok & Google parts use dummy data unless you provide custom endpoints.
- YouTube requires an API key to fetch real trending videos.
- This template is optimized for quick deploy from your phone to Vercel.
