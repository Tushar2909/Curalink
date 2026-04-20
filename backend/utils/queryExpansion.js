function expandQuery({ disease, query }) {
  const d = (disease || "").toLowerCase().trim();
  const q = (query || "").toLowerCase().trim();

  const diseaseMap = {
    "alzheimer's disease": "alzheimer disease dementia",
    alzheimer: "alzheimer disease dementia",
    asthma: "asthma bronchial asthma",
    "atrial fibrillation": "atrial fibrillation arrhythmia",
    "breast cancer": "breast cancer mammary carcinoma",
    "celiac disease": "celiac disease gluten sensitive enteropathy",
    "chronic kidney disease": "chronic kidney disease ckd renal insufficiency",
    "chronic obstructive pulmonary disease": "copd chronic obstructive pulmonary disease",
    copd: "chronic obstructive pulmonary disease",
    "covid-19": "covid-19 sars-cov-2 coronavirus",
    "diabetes mellitus": "diabetes mellitus type 2 type 1 hyperglycemia",
    epilepsy: "epilepsy seizure disorder",
    hypertension: "hypertension high blood pressure",
    "parkinson's disease": "parkinson disease parkinsonism",
    stroke: "stroke cerebrovascular accident",
    "heart failure": "heart failure congestive heart failure",
    "lung cancer": "lung cancer pulmonary neoplasm",
    migraine: "migraine headache disorder",
    "multiple sclerosis": "multiple sclerosis demyelinating disease",
    osteoarthritis: "osteoarthritis degenerative joint disease",
    "rheumatoid arthritis": "rheumatoid arthritis autoimmune arthritis",
    tuberculosis: "tuberculosis tb mycobacterium tuberculosis",
    depression: "depression major depressive disorder",
    "anxiety disorder": "anxiety disorder generalized anxiety panic disorder",
    "prostate cancer": "prostate cancer prostatic neoplasm",
    "liver disease": "liver disease hepatic disease cirrhosis"
  };

  const intentMap = {
    treatment: "therapeutic use drug therapy intervention management",
    diagnosis: "diagnosis screening detection biomarkers",
    "clinical trials": "clinical trials recruiting completed randomized study",
    "latest research": "recent advances breakthrough 2024 2025 2026",
    "risk factors": "risk factors epidemiology prognosis",
    prevention: "prevention prophylaxis lifestyle intervention",
    prognosis: "prognosis outcomes survival"
  };

  const normalizedDisease = diseaseMap[d] || d;
  const intent = intentMap[q] || q;

  return `("${d}" OR "${normalizedDisease}") AND (${intent})`;
}

module.exports = { expandQuery };