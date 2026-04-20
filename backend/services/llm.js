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
      console.error("GROQ_API_KEY is missing in environment variables.");
      return "Evidence retrieval completed successfully. Structured AI synthesis is temporarily unavailable due to a configuration issue.";
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
          `Publication ${i + 1}: ${p.title || "Untitled"} | Year: ${p.year || "N/A"} | Source: ${p.source || "Unknown"} | URL: ${p.url || p.link || "No URL"}`
      )
      .join("\n");

    const trialContext = safeTrials
      .slice(0, 5)
      .map(
        (t, i) =>
          `Trial ${i + 1}: ${t.title || "Untitled"} | Status: ${t.status || "Unknown"} | Location: ${t.location || "Not listed"}`
      )
      .join("\n");

    const prompt = `
You are CuraLink AI, a clinical evidence synthesis assistant.

Patient Name: ${patientName || "User"}
Clinical Indication: ${disease || "Not specified"}
Location: ${location || "Not specified"}
Research Objective: ${query || "General medical research"}

Publications:
${paperContext || "No publications available"}

Clinical Trials:
${trialContext || "No clinical trials available"}

Instructions:
- Write a concise structured synthesis in under 180 words.
- Use cautious language like "Evidence suggests" or "Recent studies indicate".
- Do not hallucinate or invent evidence.
- Do not provide diagnosis or treatment advice.
- Summarize only the evidence provided above.
- Mention whether the trial landscape appears ongoing, limited, recruiting, or completed.
- End with exactly:
This synthesis is for informational purposes and is not medical advice.
`;

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content:
            "You summarize only the provided clinical evidence. Do not hallucinate. Do not provide diagnosis. Do not give treatment advice."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.2,
      max_completion_tokens: 300
    });

    const content = response?.choices?.[0]?.message?.content?.trim();

    if (!content) {
      console.error("Groq returned empty content:", JSON.stringify(response, null, 2));
      return "Evidence retrieval completed successfully. Structured AI synthesis is temporarily unavailable at the moment.";
    }

    return content;
  } catch (err) {
    console.error("GROQ SYSTEM ERROR:", {
      message: err.message,
      status: err?.status,
      response: err?.response?.data,
      error: err?.error
    });

    return "Evidence retrieval completed successfully. Structured AI synthesis is temporarily unavailable at the moment.";
  }
}

module.exports = { generateAnswer };
