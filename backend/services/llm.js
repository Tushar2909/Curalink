const axios = require("axios");

async function generateAnswer({ patientName, disease, query, location, publications, trials }) {
  try {
    const prompt = `
### IDENTITY
You are Curalink, a medical research synthesis agent.

### MISSION
Provide a high-fidelity synthesis of peer-reviewed evidence for user: ${patientName || "Anonymous"}.

### CONTEXT
Disease: ${disease} | Intent: ${query} | Region: ${location || "Global"}

### DATA INPUTS
Papers: ${publications.map(p => `(${p.year}) ${p.title}`).join(" | ")}
Trials: ${trials.map(t => `${t.title} [Status: ${t.status}]`).join(" | ")}

### CLINICAL GUARDRAILS
1. NO DIAGNOSTIC LANGUAGE: Never say "you have" or "given your condition."
2. NO SEVERITY ASSUMPTION: Never assume severity (mild/chronic).
3. NO DIRECT ADVICE: Use "Evidence suggests" or "Researchers found."
4. ZERO HALLUCINATION: Only use the data provided in the Paper/Trial titles.

### FORMAT
1. RESEARCH LANDSCAPE: Professional overview of ${disease}.
2. EVIDENCE SYNTHESIS: Synthesize findings from 2024-2026 data. Mention study years.
3. CLINICAL TRENDS: Focus on ${query} and relevance to ${location}.
4. MANDATORY DISCLAIMER: End with: "This synthesis is for informational purposes and is not medical advice or a diagnosis."
`;

    const response = await axios.post("http://localhost:11434/api/generate", {
      model: "phi3",
      prompt,
      stream: false,
      options: { 
        temperature: 0.0,
        num_predict: 750, // Increased for full completion
        stop: ["<|end|>", "<|endoftext|>"]
      }
    });

    return response.data?.response?.trim() || "Synthesis failed.";
  } catch (err) {
    return "The reasoning engine is offline. Please review the raw data sources below.";
  }
}

module.exports = { generateAnswer };