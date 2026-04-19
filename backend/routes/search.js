const express = require("express");
const router = express.Router();
const { expandQuery } = require("../utils/queryExpansion");
const { fetchOpenAlex } = require("../services/openAlex");
const { fetchPubMed } = require("../services/pubmed");
const { fetchTrials } = require("../services/clinicalTrials");
const { rankResults } = require("../utils/ranker");
const { generateAnswer } = require("../services/llm");

router.post("/search", async (req, res) => {
  try {
    const { disease, query, patientName, location } = req.body;

    if (!disease || !query) return res.status(400).json({ error: "Input required" });

    const expandedQuery = expandQuery({ disease, query });

    // Deep Retrieval (Fetching 30 each for a total pool of 60+)
    const [openAlexRaw, pubMedRaw, trialsRaw] = await Promise.all([
      fetchOpenAlex(expandedQuery, 30).catch(() => []),
      fetchPubMed(expandedQuery, 30).catch(() => []),
      fetchTrials(disease).catch(() => [])
    ]);

    // Intelligent Ranking
    const allPubs = [...openAlexRaw, ...pubMedRaw];
    const topPublications = rankResults(allPubs, query, disease).slice(0, 7);
    const topTrials = trialsRaw.slice(0, 5);

    // Personalized AI Generation
    const answer = await generateAnswer({
      patientName,
      disease,
      query,
      location,
      publications: topPublications,
      trials: topTrials
    });

    res.json({
      answer,
      publications: topPublications,
      trials: topTrials,
      queryInfo: { expandedQuery, poolSize: allPubs.length }
    });

  } catch (err) {
    res.status(500).json({ error: "Pipeline failure. Check API keys and local LLM status." });
  }
});

module.exports = router;