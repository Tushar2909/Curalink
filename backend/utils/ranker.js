function rankResults(results = [], query = "", disease = "") {
  const d = (disease || "").toLowerCase().trim();
  const q = (query || "").toLowerCase().trim();
  const queryWords = q.split(/\s+/);

  const queryMap = {
    treatment: ["treatment", "therapy", "drug", "management", "intervention"],
    diagnosis: ["diagnosis", "detection", "screening", "imaging"],
    symptoms: ["symptom", "clinical", "presentation", "sign", "manifestation"],
    prevention: ["prevention", "risk", "vaccine", "prophylaxis"]
  };

  const queryKeywords = queryMap[q] || queryWords;

  // 🔥 REMOVE DUPLICATES (Same title)
  const uniqueResults = Array.from(new Map(results.map(item => [item.title.toLowerCase(), item])).values());

  return uniqueResults
    .map(item => {
      const title = (item.title || "").toLowerCase();
      let score = 0;

      // 1. EXACT PHRASE MATCH
      if (title.includes(d)) score += 15;

      // 2. QUERY MATCH (STRONG SIGNAL)
      const queryScore = queryKeywords.filter(w => title.includes(w)).length;
      score += queryScore * 10;

      // 3. RECENCY (THE WINNER MAKER)
      const year = parseInt(item.year);
      if (year >= 2024) score += 30; // Massive boost for latest research
      else if (year >= 2020) score += 10;
      else if (year < 2015) score -= 10; // Penalize older data more strictly

      return { ...item, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 8) 
    .map(({ score, ...rest }) => rest);
}

module.exports = { rankResults };