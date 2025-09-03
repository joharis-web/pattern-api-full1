import { fetchGoogleSearch } from './_providers.js';

export default async function handler(req, res) {
  const q = req.query.q || 'trending';
  try {
    const items = await fetchGoogleSearch(q, 6);
    res.status(200).json({source:'google', query:q, items});
  } catch(err) {
    res.status(500).json({error: String(err)});
  }
}
