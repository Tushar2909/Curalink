function expandQuery({ disease, query }) {
  let d = (disease || "").toLowerCase().trim();
  const q = (query || "").toLowerCase().trim();

  // Mapping common terms to Medical Subject Headings (MeSH)
  let normalized = d;
  if (d.includes("blood pressure")) normalized = "hypertension";
  else if (d.includes("heart attack")) normalized = "myocardial infarction";
  else if (d.includes("tb")) normalized = "tuberculosis";
  else if (d.includes("sugar")) normalized = "diabetes mellitus";

  const queryMap = {
    treatment: "therapeutic use management drug therapy intervention",
    diagnosis: "diagnosis pathology screening detection",
    symptoms: "clinical manifestations signs symptoms",
    prevention: "prophylaxis prevention control vaccine",
    "latest research": "recent breakthroughs clinical trials 2025 2026"
  };

  const intent = queryMap[q] || q;

  // Use boolean logic for PubMed/OpenAlex compatibility
  return `("${d}" OR "${normalized}") AND (${intent})`;
}

module.exports = { expandQuery };