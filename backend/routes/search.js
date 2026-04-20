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

    if (!disease || !query) {
      return res.status(400).json({ error: "Input required" });
    }

    const expandedQuery = expandQuery({ disease, query });

    const [openAlexRaw, pubMedRaw, trialsRaw] = await Promise.all([
      fetchOpenAlex(expandedQuery, 30).catch((err) => {
        console.error("OpenAlex error:", err.message);
        return [];
      }),
      fetchPubMed(expandedQuery, 30).catch((err) => {
        console.error("PubMed error:", err.message);
        return [];
      }),
      fetchTrials(disease).catch((err) => {
        console.error("Trials error:", err.message);
        return [];
      })
    ]);

    const allPubs = [...openAlexRaw, ...pubMedRaw];
    const topPublications = rankResults(allPubs, query, disease).slice(0, 7);
    const topTrials = (trialsRaw || []).slice(0, 5);

    let answer = "";
    try {
      answer = await Promise.race([
        generateAnswer({
          patientName,
          disease,
          query,
          location,
          publications: topPublications,
          trials: topTrials
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Timeout")), 45000)
        )
      ]);
    } catch (aiErr) {
      console.error("⚠️ AI Generation Slow or Offline:", aiErr.message);
      answer = "The reasoning engine is offline. Please review the raw data sources below.";
    }

    return res.json({
      answer,
      publications: topPublications,
      trials: topTrials,
      queryInfo: {
        expandedQuery,
        poolSize: allPubs.length
      }
    });
  } catch (err) {
    console.error("🔥 Pipeline Crash:", err);
    return res.status(500).json({ error: "Internal Pipeline Error" });
  }
});

module.exports = router;