const Groq = require("groq-sdk");

async function generateAnswer({ patientName, disease, query, location, publications, trials }) {
  try {
    if (!process.env.GROQ_API_KEY) {
      console.error("🔥 GROQ_API_KEY is missing in Environment Variables!");
      return "The reasoning engine is offline due to a configuration sync. Please review the raw data sources below.";
    }

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });

    const safePublications = Array.isArray(publications) ? publications : [];
    const safeTrials = Array.isArray(trials) ? trials : [];

    if (safePublications.length === 0) {
      return "CuraLink retrieved clinical trials but requires more publication data for a full synthesis.";
    }

    const paperContext = safePublications
      .slice(0, 5)
      .map((p, i) => `Pub ${i + 1}: (${p.year || "N/A"}) ${p.title || "Untitled"} | ${p.source || "Unknown source"} | ${p.url || p.link || "No URL"}`)
      .join("\n");

    const trialContext = safeTrials
      .slice(0, 3)
      .map((t, i) => `Trial ${i + 1}: ${t.title || "Untitled"} | ${t.status || "Unknown status"} | ${t.location || "Location not listed"}`)
      .join("\n");

    const prompt = `
You are CuraLink AI, a medical evidence synthesis assistant.

Patient Name: ${patientName || "User"}
Disease: ${disease || "Not specified"}
Location: ${location || "Not specified"}
Research Objective: ${query || "General medical research"}

Publications:
${paperContext || "No publications available"}

Clinical Trials:
${trialContext || "No clinical trials available"}

Write a concise synthesis under 180 words.
Use cautious language such as "Evidence suggests" or "Recent studies indicate".
Do not provide diagnosis or treatment advice.
If trial activity is limited or early-stage, say so.
End with:
This synthesis is for informational purposes and is not medical advice.
`;

    const response = await groq.chat.completions.create({
      model: "mixtral-8x7b-32768",
      messages: [
        {
          role: "system",
          content:
            "You summarize only the provided evidence. Do not hallucinate. Do not give medical advice."
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
      console.error("🔥 Groq returned empty content:", JSON.stringify(response, null, 2));
      return "The reasoning engine is offline. Please review the raw data sources below.";
    }

    return content;
  } catch (err) {
    console.error("🔥 GROQ SYSTEM ERROR:", {
      message: err.message,
      status: err?.status,
      response: err?.response?.data,
      error: err?.error
    });
    return "The reasoning engine is offline. Please review the raw data sources below.";
  }
}

module.exports = { generateAnswer };