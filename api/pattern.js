import { fetchYouTubeTrending, fetchGoogleSearch, fetchTikTokTrending } from './_providers.js';

// Patterned number generator endpoint
// This endpoint aggregates data from providers and produces a 4-digit patterned number
// plus interpretation fields (shio, zodiac, dream, erek).
export default async function handler(req, res) {
  try {
    // Try to get provider data (providers return dummy if keys not present)
    const [yt, google, tiktok] = await Promise.all([
      fetchYouTubeTrending(5),
      fetchGoogleSearch('trending', 5),
      fetchTikTokTrending(5)
    ]);

    // Build keywords from top titles
    const keywords = [];
    yt.forEach(i=>keywords.push(i.title));
    google.forEach(i=>keywords.push(i.title||i.snippet||String(i)));
    tiktok.forEach(i=>keywords.push(i.title));

    const words = keywords.join(' | ').slice(0, 200);

    // Create a deterministic-ish 4-digit number from the combined keywords + date
    const base = words + '|' + new Date().toISOString().slice(0,10);
    // simple hash -> numeric
    function simpleHash(s){ let h=0; for(let i=0;i<s.length;i++){ h=(h<<5)-h + s.charCodeAt(i); h |= 0; } return Math.abs(h); }
    const hash = simpleHash(base).toString();
    const number = parseInt(hash.slice(-4).padStart(4,'0'),10);

    // Interpretation (basic)
    const shioList = ["Tikus","Kerbau","Macan","Kelinci","Naga","Ular","Kuda","Kambing","Monyet","Ayam","Anjing","Babi"];
    const shio = shioList[new Date().getFullYear() % 12];
    const zodiac = (()=>{ const d=new Date(); const m=d.getMonth()+1; const day=d.getDate(); if((m==1 && day<=20)||(m==12 && day>=22)) return 'Capricorn'; if(m==1) return 'Aquarius'; if(m==2) return 'Pisces'; if(m==3) return 'Aries'; if(m==4) return 'Taurus'; if(m==5) return 'Gemini'; if(m==6) return 'Cancer'; if(m==7) return 'Leo'; if(m==8) return 'Virgo'; if(m==9) return 'Libra'; if(m==10) return 'Scorpio'; return 'Sagittarius'; })();

    // Simple dream/erek mapping heuristics
    const dreamMap = { 'ular': '90', 'laut':'82', 'rumah':'34', 'perjalanan':'59', 'emas':'68', 'uang':'95' };
    const erekMap = { 'teman':'23', 'rumah':'46', 'kekayaan':'88', 'awal':'11', 'uang':'95' };
    let foundDream='-'; let foundErek='-';
    const low = words.toLowerCase();
    for(const k of Object.keys(dreamMap)){ if(low.includes(k)){ foundDream = `${k} -> ${dreamMap[k]}`; break; } }
    for(const k of Object.keys(erekMap)){ if(low.includes(k)){ foundErek = `${k} -> ${erekMap[k]}`; break; } }

    // pattern flags
    const digits = String(number).padStart(4,'0').split('').map(Number);
    const counts = {}; digits.forEach(n=>counts[n]=(counts[n]||0)+1);
    const dominant = Object.entries(counts).sort((a,b)=>b[1]-a[1])[0][0];
    const hasPair = Object.values(counts).some(c=>c>=2);

    res.status(200).json({
      date: new Date().toISOString(),
      number: String(number).padStart(4,'0'),
      shio, zodiac, dream: foundDream, erek: foundErek,
      keywords: keywords.slice(0,400),
      pattern: {dominant, hasPair}
    });

  } catch(err) {
    res.status(500).json({error: String(err)});
  }
}
