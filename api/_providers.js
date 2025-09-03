// Helper providers for YouTube, Google, TikTok
// These functions try to fetch real data if API keys/endpoints provided via env.
// Otherwise they return fallback dummy data so the system still works offline.

async function fetchYouTubeTrending(limit=5) {
  const key = process.env.YT_API_KEY || null;
  if (!key) {
    return Array.from({length: limit}).map((_,i)=>({title:`Dummy YouTube Video ${i+1}`, channel:`Channel ${i+1}`}));
  }
  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&regionCode=ID&maxResults=${limit}&key=${key}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('YT HTTP ' + res.status);
    const j = await res.json();
    return (j.items||[]).map(it=>({title: it.snippet.title, channel: it.snippet.channelTitle}));
  } catch(e) {
    console.warn('YouTube fetch failed',e);
    return Array.from({length: limit}).map((_,i)=>({title:`Fallback YouTube ${i+1}`, channel:`Channel ${i+1}`}));
  }
}

async function fetchGoogleSearch(q='trending', limit=5) {
  // No official free Google Search API here; return dummy results.
  // If you have a custom search API endpoint, set GOOGLE_CUSTOM_SEARCH_URL env to call it.
  const custom = process.env.GOOGLE_CUSTOM_SEARCH_URL || null;
  if (custom) {
    try {
      const url = custom + '?q=' + encodeURIComponent(q) + '&limit=' + limit;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Custom Search HTTP ' + res.status);
      const j = await res.json();
      return j.items || [];
    } catch(e) {
      console.warn('Custom Google fetch failed', e);
    }
  }
  return Array.from({length: limit}).map((_,i)=>({title:`Dummy Google Result ${i+1} for ${q}`, link:`https://example.com/${i+1}`}));
}

async function fetchTikTokTrending(limit=5) {
  // TikTok official API is restricted. Return dummy or use custom endpoint via TIKTOK_CUSTOM_URL env.
  const custom = process.env.TIKTOK_CUSTOM_URL || null;
  if (custom) {
    try {
      const url = custom + '?limit=' + limit;
      const res = await fetch(url);
      if (!res.ok) throw new Error('TikTok custom HTTP ' + res.status);
      const j = await res.json();
      return j.items || [];
    } catch(e) {
      console.warn('TikTok custom fetch failed', e);
    }
  }
  return Array.from({length: limit}).map((_,i)=>({title:`Dummy TikTok ${i+1}`, author:`Creator${i+1}`}));
}

module.exports = { fetchYouTubeTrending, fetchGoogleSearch, fetchTikTokTrending };
