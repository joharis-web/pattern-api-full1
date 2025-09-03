import { fetchYouTubeTrending } from './_providers.js';

export default async function handler(req, res) {
  try {
    const items = await fetchYouTubeTrending(6);
    res.status(200).json({source:'youtube', items});
  } catch(err) {
    res.status(500).json({error: String(err)});
  }
}

