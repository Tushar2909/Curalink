const Groq = require("groq-sdk");

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
      console.error("GROQ_API_KEY is missing in Environment Variables!");
      return "AI synthesis is currently unavailable due to a configuration issue. Please review the verified evidence sources below.";
    }

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });

    const safePublications = Array.isArray(publications) ? publications : [];
    const safeTrials = Array.isArray(trials) ? trials : [];

    if (safePublications.length === 0 && safeTrials.length === 0) {
      return "CuraLink could not gather enough evidence for synthesis. Please review the retrieved results and try a broader query.";
    }

    const paperContext = safePublications
      .slice(0, 7)
      .map(
        (p, i) =>
          `Pub ${i + 1}: (${p.year || "N/A"}) ${p.title || "Untitled"} | ${p.source || "Unknown source"} | ${p.url || p.link || "No URL"}`
      )
      .join("\n");

    const trialContext = safeTrials
      .slice(0, 5)
      .map(
        (t, i) =>
          `Trial ${i + 1}: ${t.title || "Untitled"} | ${t.status || "Unknown status"} | ${t.location || "Location not listed"}`
      )
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

Instructions:
- Write a concise synthesis under 180 words.
- Use cautious language such as "Evidence suggests" or "Recent studies indicate".
- Do not provide diagnosis or treatment advice.
- Only summarize the provided evidence.
- Mention if clinical trial activity appears limited, early-stage, ongoing, or completed.
- Keep the tone professional, clinical, and clear.
- End with exactly:
This synthesis is for informational purposes and is not medical advice.
`;

    const response = await groq.chat.completions.create({
      model: "mixtral-8x7b-32768",
      messages: [
        {
          role: "system",
          content:
            "You summarize only the provided medical evidence. Do not hallucinate. Do not provide diagnosis. Do not give treatment advice."
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
      console.error("Groq returned empty content:", JSON.stringify(response, null, 2));
      return "AI synthesis is temporarily unavailable. Please review the raw data sources below.";
    }

    return content;
  } catch (err) {
    console.error("GROQ SYSTEM ERROR:", {
      message: err.message,
      status: err?.status,
      response: err?.response?.data,
      error: err?.error
    });

    return "AI synthesis is temporarily unavailable. Please review the raw data sources below.";
  }
}

module.exports = { generateAnswer };