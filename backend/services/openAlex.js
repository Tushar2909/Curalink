const axios = require("axios");

async function fetchOpenAlex(query) {
  try {
    // 🔥 KEY FIX: restrict search to TITLE only
    const url = `https://api.openalex.org/works?filter=title.search:${encodeURIComponent(query)}&per-page=10`;

    const res = await axios.get(url);

    return (res.data.results || []).map(item => ({
      title: item.title,
      abstract: item.abstract_inverted_index ? "Available" : "No abstract",
      year: item.publication_year,
      source: "OpenAlex",
      url: item.id
    }));

  } catch (err) {
    console.error("OpenAlex Error:", err.message);
    return [];
  }
}

module.exports = { fetchOpenAlex };