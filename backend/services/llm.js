const Groq = require("groq-sdk");
require("dotenv").config();

async function generateAnswer({
  patientName,
  disease,
  query,
  location,
  publications,
  trials
}) {
  try {
    if (!process.env.GROQ_API_KEY) {
      console.error("🔥 GROQ_API_KEY is missing in environment variables.");
      return "The reasoning engine is offline due to a configuration issue. Please review the raw data sources below.";
    }

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });

    if (!publications || publications.length === 0) {
      return "CuraLink retrieved clinical trials but requires more publication data for a full synthesis.";
    }

    const paperContext = publications
      .slice(0, 5)
      .map((p, i) => {
        return `${i + 1}. (${p.year || "N/A"}) ${p.title || "Untitled"} | ${p.source || "Unknown source"}`;
      })
      .join("\n");

    const trialContext = (trials || [])
      .slice(0, 3)
      .map((t, i) => {
        return `${i + 1}. ${t.title || "Untitled trial"} | ${t.status || "Unknown status"} | ${t.location || "Location not listed"}`;
      })
      .join("\n");

    const prompt = `
You are CuraLink AI, a medical research synthesis assistant.

Patient Name: ${patientName || "User"}
Disease: ${disease || "Not specified"}
Research Objective: ${query || "General medical research"}
Location: ${location || "Not specified"}

Publications:
${paperContext || "No publications available"}

Clinical Trials:
${trialContext || "No clinical trials available"}

Instructions:
- Write a concise evidence synthesis in under 180 words.
- Focus on recent and relevant research trends.
- Use cautious language like "Evidence suggests" or "Recent studies indicate".
- Do not provide diagnosis or treatment advice.
- Mention if trial activity appears limited or early-stage.
- End with exactly:
"This synthesis is for informational purposes and is not medical advice."
`;

    const response = await groq.chat.completions.create({
      model: "mixtral-8x7b-32768",
      messages: [
        {
          role: "system",
          content:
            "You are a careful medical evidence synthesis assistant. You summarize only provided evidence, avoid hallucinations, and never give direct medical advice."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.2,
      max_tokens: 400
    });

    const content = response?.choices?.[0]?.message?.content?.trim();

    if (!content) {
      console.error("🔥 Groq returned an empty response:", JSON.stringify(response, null, 2));
      return "The reasoning engine is offline. Please review the raw data sources below.";
    }

    return content;
  } catch (err) {
    console.error(
      "🔥 GROQ SYSTEM ERROR:",
      err?.response?.error || err?.response?.data || err.message || err
    );
    return "The reasoning engine is offline. Please review the raw data sources below.";
  }
}

module.exports = { generateAnswer };