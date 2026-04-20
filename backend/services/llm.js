const Groq = require("groq-sdk");

// 🌐 Connects to Groq Cloud using the Key from your Render Environment Variables
const groq = new Groq({ 
  apiKey: process.env.GROQ_API_KEY 
});

async function generateAnswer({ patientName, disease, query, location, publications, trials }) {
  try {
    // 🛡️ Guard: Ensure we have data before calling the AI
    if (!publications || publications.length === 0) {
      return "CuraLink retrieved clinical trials but found limited recent peer-reviewed publications to synthesize a full report. Please review the raw sources below.";
    }

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
2. NO DIRECT ADVICE: Use "Evidence suggests" or "Researchers found."
3. ZERO HALLUCINATION: Only use the data provided in the titles above.
4. TIMELINE: Explicitly mention breakthroughs from 2025-2026.

### FORMAT
1. RESEARCH LANDSCAPE: Professional overview of ${disease}.
2. EVIDENCE SYNTHESIS: Summarize findings from the provided 2024-2026 data.
3. CLINICAL TRENDS: Focus on ${query} and relevance to ${location}.
4. MANDATORY DISCLAIMER: End with: "This synthesis is for informational purposes and is not medical advice or a diagnosis."
`;

    // 🚀 Production-grade inference on Groq Cloud
    const response = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile", // Use this specific model for speed/accuracy
      temperature: 0.1, 
      max_tokens: 800,
    });

    return response.choices[0]?.message?.content?.trim() || "Synthesis engine timed out.";
  } catch (err) {
    console.error("🔥 GROQ SYSTEM ERROR:", err.message);
    return "The reasoning engine is offline. Please review the raw data sources below.";
  }
}

module.exports = { generateAnswer };