const Groq = require("groq-sdk");
require('dotenv').config(); 

async function generateAnswer({ patientName, disease, query, location, publications, trials }) {
  try {
    // 🛡️ Safety Check: If Key is missing, don't crash, just log and return
    if (!process.env.GROQ_API_KEY) {
      console.error("🔥 GROQ_API_KEY is missing in Environment Variables!");
      return "The reasoning engine is offline due to a configuration sync. Please review the raw data sources below.";
    }

    const groq = new Groq({ 
      apiKey: process.env.GROQ_API_KEY 
    });

    if (!publications || publications.length === 0) {
      return "CuraLink retrieved clinical trials but requires more publication data for a full synthesis.";
    }

    // Narrowing the context for ultra-fast response on free tier
    const paperContext = publications.slice(0, 3).map(p => `(${p.year}) ${p.title}`).join(" | ");
    const trialContext = trials.slice(0, 2).map(t => `${t.title}`).join(" | ");

    const prompt = `
### IDENTITY: Curalink Medical Synthesis Agent.
### CONTEXT: ${disease} research for ${patientName || "User"}.
### DATA: 
Papers: ${paperContext}
Trials: ${trialContext}

### TASK:
1. Synthesize 2025-2026 trends for ${query}.
2. Use "Evidence suggests". NO medical advice or diagnosis.
3. Keep it professional and under 150 words.
4. End with: "This synthesis is for informational purposes and is not medical advice."
`;

    const response = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "mixtral-8x7b-32768", 
      temperature: 0.1, 
      max_tokens: 500,
    });

    return response.choices[0]?.message?.content?.trim() || "Synthesis failed.";
  } catch (err) {
    console.error("🔥 GROQ SYSTEM ERROR:", err.message);
    return "The reasoning engine is offline. Please review the raw data sources below.";
  }
}

module.exports = { generateAnswer };