const axios = require("axios");

async function fetchPubMed(query, limit = 20) {
  try {
    // Adding date constraint to the query for PubMed specifically
    const dateQuery = `(${query}) AND ("2024"[Date - Publication] : "3000"[Date - Publication])`;
    
    const searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(dateQuery)}&retmax=${limit}&retmode=json`;
    const searchRes = await axios.get(searchUrl);
    const ids = searchRes.data.esearchresult.idlist.join(",");

    if (!ids) return [];

    const fetchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${ids}&retmode=json`;
    const fetchRes = await axios.get(fetchUrl);
    const result = fetchRes.data.result;

    return Object.values(result)
      .filter(item => item.uid)
      .map(item => ({
        title: item.title,
        year: item.pubdate ? item.pubdate.split(" ")[0] : "2026",
        authors: item.authors?.map(a => a.name).join(", ") || "Medical Staff",
        source: "PubMed",
        url: `https://pubmed.ncbi.nlm.nih.gov/${item.uid}/`
      }));
  } catch (err) {
    return [];
  }
}

module.exports = { fetchPubMed };