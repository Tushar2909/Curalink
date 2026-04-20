const Groq = require("groq-sdk");

const groq = new Groq({ 
  apiKey: process.env.GROQ_API_KEY 
});

async function generateAnswer({ patientName, disease, query, location, publications, trials }) {
  try {
    if (!publications || publications.length === 0) {
      return "CuraLink retrieved data but needs more publications for a full synthesis. Please see raw sources.";
    }

    // ✂️ Length Guard: Only take top 5 papers to prevent prompt overflow & speed up response
    const paperContext = publications.slice(0, 5).map(p => `(${p.year}) ${p.title}`).join(" | ");
    const trialContext = trials.slice(0, 3).map(t => `${t.title} [${t.status}]`).join(" | ");

    const prompt = `
### IDENTITY: Curalink Medical Research Synthesis Agent.
### MISSION: Synthesize evidence for ${patientName || "Anonymous"}.
### CONTEXT: Disease: ${disease} | Intent: ${query} | Region: ${location || "Global"}
### DATA: 
Papers: ${paperContext}
Trials: ${trialContext}

### RULES:
1. NO DIAGNOSTIC LANGUAGE. Use "Evidence suggests".
2. Focus on 2025-2026 breakthroughs.
3. Be professional and concise.

### FORMAT:
1. RESEARCH LANDSCAPE: Overview.
2. EVIDENCE SYNTHESIS: Findings from 2024-2026.
3. CLINICAL TRENDS: Focus on ${query}.
4. DISCLAIMER: End with "This synthesis is for informational purposes and is not medical advice."
`;

    const response = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      // 🚀 Using Mixtral-8x7b: It's lightning fast and very reliable for free tier
      model: "mixtral-8x7b-32768", 
      temperature: 0.1, 
      max_tokens: 700,
    });

    return response.choices[0]?.message?.content?.trim() || "Synthesis engine timed out.";
  } catch (err) {
    console.error("🔥 GROQ ERROR:", err.message);
    return "The reasoning engine is offline. Please review the raw data sources below.";
  }
}

module.exports = { generateAnswer };