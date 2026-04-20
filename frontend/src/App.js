import { useState, useEffect, useMemo } from "react";
import axios from "axios";

const BACKEND_URL =
  process.env.NODE_ENV === "production"
    ? "https://curalink-3h2f.onrender.com"
    : "http://localhost:5000";

const styleTag = document.createElement("style");
styleTag.innerHTML = `
  :root{
    --bg:#f7f8fc;
    --card:#ffffff;
    --card2:#f3f7ff;
    --text:#0f172a;
    --muted:#64748b;
    --line:#dbe4f0;
    --primary:#2563eb;
    --primary2:#1d4ed8;
    --success:#16a34a;
    --danger:#dc2626;
    --shadow:0 20px 60px rgba(15,23,42,.08);
    --shadow2:0 10px 30px rgba(37,99,235,.12);
    --radius:24px;
  }

  *{box-sizing:border-box}
  html,body,#root{margin:0;min-height:100%}
  body{
    font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    background:
      radial-gradient(circle at top left, rgba(37,99,235,.10), transparent 30%),
      radial-gradient(circle at top right, rgba(59,130,246,.08), transparent 25%),
      linear-gradient(180deg, #f8fbff 0%, #f7f8fc 100%);
    color:var(--text);
  }

  @keyframes fadeUp {
    from { opacity:0; transform: translateY(16px); }
    to { opacity:1; transform: translateY(0); }
  }

  @keyframes pulse {
    0% { opacity: .6; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.015); }
    100% { opacity: .6; transform: scale(1); }
  }

  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }

  .app-shell{
    min-height:100vh;
    padding:24px;
  }

  .hero{
    max-width:1200px;
    margin:0 auto 24px auto;
    padding:32px;
    background: linear-gradient(180deg, rgba(255,255,255,.85), rgba(255,255,255,.72));
    backdrop-filter: blur(12px);
    border:1px solid rgba(219,228,240,.9);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    animation: fadeUp .5s ease both;
  }

  .brand-row{
    display:flex;
    align-items:center;
    justify-content:space-between;
    gap:16px;
    margin-bottom:16px;
  }

  .brand{
    display:flex;
    align-items:center;
    gap:12px;
  }

  .brand-mark{
    width:48px;
    height:48px;
    border-radius:16px;
    display:grid;
    place-items:center;
    background: linear-gradient(135deg, rgba(37,99,235,.14), rgba(59,130,246,.08));
    color:var(--primary);
    border:1px solid rgba(37,99,235,.15);
    flex-shrink:0;
  }

  .title{
    margin:0;
    font-size: clamp(2rem, 1.2rem + 2vw, 3rem);
    line-height:1.05;
    letter-spacing:-0.03em;
  }

  .subtitle{
    margin:8px 0 0 0;
    color:var(--muted);
    font-size:1rem;
    max-width:70ch;
  }

  .hero-chip-row{
    display:flex;
    flex-wrap:wrap;
    gap:10px;
    margin-top:18px;
  }

  .chip{
    padding:10px 14px;
    border-radius:999px;
    border:1px solid rgba(219,228,240,.95);
    background: rgba(255,255,255,.9);
    color: var(--muted);
    font-size: .88rem;
  }

  .panel{
    max-width:1200px;
    margin:0 auto;
  }

  .search-card{
    background:var(--card);
    border:1px solid var(--line);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    padding:24px;
    animation: fadeUp .55s ease both;
  }

  .grid{
    display:grid;
    grid-template-columns: 1fr 1fr;
    gap:14px;
  }

  .field{
    display:flex;
    flex-direction:column;
    gap:8px;
  }

  .label{
    font-size:.9rem;
    font-weight:700;
    color:#334155;
  }

  .input{
    width:100%;
    padding:14px 15px;
    border-radius:16px;
    border:1px solid var(--line);
    background:#fff;
    color:var(--text);
    outline:none;
    transition: transform .2s ease, border-color .2s ease, box-shadow .2s ease;
  }

  .input:focus{
    border-color: rgba(37,99,235,.55);
    box-shadow: 0 0 0 4px rgba(37,99,235,.12);
    transform: translateY(-1px);
  }

  .full{
    margin-top:14px;
  }

  .cta{
    width:100%;
    margin-top:16px;
    padding:15px 18px;
    border:none;
    border-radius:16px;
    background: linear-gradient(135deg, var(--primary), var(--primary2));
    color:#fff;
    font-size:1rem;
    font-weight:800;
    cursor:pointer;
    transition: transform .2s ease, box-shadow .2s ease, opacity .2s ease;
    box-shadow: var(--shadow2);
  }

  .cta:hover{ transform: translateY(-2px); }
  .cta:disabled{
    opacity:.7;
    cursor:not-allowed;
    transform:none;
  }

  .loading-wrap{
    max-width:1200px;
    margin:18px auto 0 auto;
    text-align:center;
  }

  .loading-pulse{
    display:inline-flex;
    gap:10px;
    align-items:center;
    justify-content:center;
    padding:12px 16px;
    border-radius:999px;
    background: rgba(37,99,235,.08);
    color: var(--primary);
    font-weight:800;
    animation: pulse 1.5s ease-in-out infinite;
  }

  .skeleton{
    height:16px;
    border-radius:999px;
    background: linear-gradient(90deg, #e8eef7 25%, #f5f8fc 50%, #e8eef7 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s linear infinite;
  }

  .skeleton-card{
    min-height:140px;
    border-radius:24px;
    border:1px solid var(--line);
    background:var(--card);
    padding:20px;
    display:grid;
    gap:14px;
  }

  .results{
    max-width:1200px;
    margin:24px auto 0 auto;
    display:grid;
    gap:20px;
    animation: fadeUp .5s ease both;
  }

  .summary-bar{
    display:flex;
    flex-wrap:wrap;
    gap:10px;
    margin-top:14px;
  }

  .summary{
    padding:10px 14px;
    border-radius:999px;
    background: rgba(37,99,235,.08);
    color:#1d4ed8;
    font-size:.9rem;
    font-weight:700;
    border:1px solid rgba(37,99,235,.12);
  }

  .section{
    background:var(--card);
    border:1px solid var(--line);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    padding:24px;
    transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease;
  }

  .section:hover{
    transform: translateY(-4px);
    box-shadow: 0 24px 70px rgba(15,23,42,.10);
    border-color: rgba(37,99,235,.22);
  }

  .section-title{
    margin:0 0 14px 0;
    font-size:1.2rem;
    font-weight:900;
    color:#0f172a;
    letter-spacing:-0.02em;
  }

  .answer{
    line-height:1.85;
    color:#334155;
    white-space:pre-wrap;
  }

  .bento{
    display:grid;
    grid-template-columns: 1.5fr .95fr;
    gap:20px;
    align-items:start;
  }

  .pub-list, .trial-list{
    display:grid;
    gap:12px;
  }

  .pub-item, .trial-item{
    padding:16px;
    border-radius:18px;
    background: linear-gradient(180deg, #ffffff, #f9fbff);
    border:1px solid rgba(219,228,240,.95);
  }

  .pub-title, .trial-title{
    font-size:1rem;
    font-weight:800;
    color:#0f172a;
    line-height:1.4;
    margin-bottom:8px;
  }

  .meta-row{
    display:flex;
    flex-wrap:wrap;
    gap:10px;
    align-items:center;
    justify-content:space-between;
  }

  .badge{
    display:inline-flex;
    align-items:center;
    gap:6px;
    padding:6px 10px;
    border-radius:999px;
    background:#eff6ff;
    color:#1d4ed8;
    font-size:.78rem;
    font-weight:800;
  }

  .link{
    color:var(--primary);
    text-decoration:none;
    font-weight:800;
    font-size:.9rem;
  }

  .link:hover{ text-decoration:underline; }

  .trial-meta{
    color:var(--muted);
    font-size:.9rem;
    line-height:1.5;
  }

  .error{
    max-width:1200px;
    margin:18px auto 0 auto;
    padding:16px 18px;
    border-radius:18px;
    border:1px solid rgba(220,38,38,.2);
    background: rgba(254,242,242,.9);
    color: var(--danger);
    font-weight:700;
  }

  .tiny{
    color:var(--muted);
    font-size:.88rem;
  }

  .empty{
    padding:24px;
    border-radius:24px;
    border:1px dashed var(--line);
    color:var(--muted);
    text-align:center;
    background: rgba(255,255,255,.65);
  }

  @media (max-width: 900px){
    .grid, .bento{
      grid-template-columns:1fr;
    }
    .hero, .search-card, .section{
      padding:18px;
    }
    .brand-row{
      align-items:flex-start;
      flex-direction:column;
    }
  }

  @media (max-width: 640px){
    .app-shell{
      padding:14px;
    }
    .input{
      padding:13px 14px;
    }
    .cta{
      padding:14px 16px;
    }
  }
`;
document.head.appendChild(styleTag);

const diseasesList = [
  { label: "Alzheimer's Disease", value: "alzheimer's disease" },
  { label: "Asthma", value: "asthma" },
  { label: "Atrial Fibrillation", value: "atrial fibrillation" },
  { label: "Breast Cancer", value: "breast cancer" },
  { label: "Celiac Disease", value: "celiac disease" },
  { label: "Chronic Kidney Disease", value: "chronic kidney disease" },
  { label: "COPD (Chronic Obstructive Pulmonary Disease)", value: "chronic obstructive pulmonary disease" },
  { label: "COVID-19", value: "covid-19" },
  { label: "Diabetes Mellitus", value: "diabetes mellitus" },
  { label: "Epilepsy", value: "epilepsy" },
  { label: "Heart Failure", value: "heart failure" },
  { label: "Hypertension", value: "hypertension" },
  { label: "Lung Cancer", value: "lung cancer" },
  { label: "Migraine", value: "migraine" },
  { label: "Multiple Sclerosis", value: "multiple sclerosis" },
  { label: "Osteoarthritis", value: "osteoarthritis" },
  { label: "Parkinson's Disease", value: "parkinson's disease" },
  { label: "Rheumatoid Arthritis", value: "rheumatoid arthritis" },
  { label: "Stroke", value: "stroke" },
  { label: "Tuberculosis", value: "tuberculosis" },
  { label: "Depression", value: "depression" },
  { label: "Anxiety Disorder", value: "anxiety disorder" },
  { label: "Breast Cancer (HER2+)", value: "breast cancer" },
  { label: "Prostate Cancer", value: "prostate cancer" },
  { label: "Liver Disease", value: "liver disease" }
];

const queryOptions = [
  { label: "Latest Treatment", value: "treatment" },
  { label: "Diagnosis & Screening", value: "diagnosis" },
  { label: "Ongoing Clinical Trials", value: "clinical trials" },
  { label: "Recent Advances", value: "latest research" },
  { label: "Risk Factors", value: "risk factors" },
  { label: "Prevention", value: "prevention" },
  { label: "Prognosis", value: "prognosis" }
];

function App() {
  const [patientName, setPatientName] = useState("");
  const [location, setLocation] = useState("");
  const [selectedDisease, setSelectedDisease] = useState("");
  const [query, setQuery] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    document.title = "CuraLink AI | Medical Research";
  }, []);

  useEffect(() => {
    if (!loading) return;
    const steps = [
      "Syncing with NIH, PubMed, and OpenAlex...",
      "Parsing recent evidence and trial records...",
      "Synthesizing context-aware medical insights..."
    ];
    let i = 0;
    setLoadingText(steps[0]);
    const interval = setInterval(() => {
      i += 1;
      setLoadingText(steps[i % steps.length]);
    }, 2200);
    return () => clearInterval(interval);
  }, [loading]);

  const selectedDiseaseLabel = useMemo(
    () => diseasesList.find((d) => d.value === selectedDisease)?.label || "",
    [selectedDisease]
  );

  const selectedQueryLabel = useMemo(
    () => queryOptions.find((q) => q.value === query)?.label || "",
    [query]
  );

  const handleSearch = async () => {
    if (!selectedDisease || !query) {
      setErrorMsg("Please select a clinical indication and research objective.");
      return;
    }

    try {
      setLoading(true);
      setData(null);
      setErrorMsg("");

      const res = await axios.post(
        `${BACKEND_URL}/api/search`,
        {
          patientName: patientName || "User",
          location: location || "Global",
          disease: selectedDisease,
          query
        },
        { timeout: 90000 }
      );

      setData(res.data);
    } catch (err) {
      console.error(err);
      setErrorMsg("The AI engine is warming up. Verified evidence is still being retrieved.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <div className="hero">
        <div className="brand-row">
          <div className="brand">
            <div className="brand-mark">🧬</div>
            <div>
              <h1 className="title">CuraLink AI</h1>
              <p className="subtitle">
                Autonomous clinical evidence synthesis for publications, trials, and source-backed reasoning.
              </p>
            </div>
          </div>
        </div>

        <div className="hero-chip-row">
          <div className="chip">PubMed + OpenAlex retrieval</div>
          <div className="chip">ClinicalTrials.gov integration</div>
          <div className="chip">Context-aware synthesis</div>
          <div className="chip">2024–2026 evidence focus</div>
        </div>
      </div>

      <div className="panel">
        <div className="search-card">
          <div className="grid">
            <div className="field">
              <label className="label">Patient / Recipient Name</label>
              <input
                className="input"
                placeholder="Recipient Name"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
              />
            </div>

            <div className="field">
              <label className="label">Location</label>
              <input
                className="input"
                placeholder="City, Country"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>

          <div className="field full">
            <label className="label">Clinical Indication</label>
            <select
              className="input"
              value={selectedDisease}
              onChange={(e) => setSelectedDisease(e.target.value)}
            >
              <option value="">-- Clinical Indication --</option>
              {diseasesList.map((d) => (
                <option key={d.value + d.label} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>

          <div className="field full">
            <label className="label">Research Objective</label>
            <select className="input" value={query} onChange={(e) => setQuery(e.target.value)}>
              <option value="">-- Research Objective --</option>
              {queryOptions.map((q) => (
                <option key={q.value} value={q.value}>
                  {q.label}
                </option>
              ))}
            </select>
          </div>

          <button className="cta" onClick={handleSearch} disabled={loading}>
            {loading ? "Synthesizing..." : "Initiate Research Pipeline"}
          </button>
        </div>

        {(selectedDiseaseLabel || selectedQueryLabel) && (
          <div className="summary-bar" style={{ marginTop: 14 }}>
            {selectedDiseaseLabel && <div className="summary">{selectedDiseaseLabel}</div>}
            {selectedQueryLabel && <div className="summary">{selectedQueryLabel}</div>}
          </div>
        )}
      </div>

      {loading && (
        <div className="loading-wrap">
          <div className="loading-pulse">⚡ {loadingText}</div>
        </div>
      )}

      {errorMsg && <div className="error">{errorMsg}</div>}

      {data && (
        <div className="results">
          <div className="section">
            <h2 className="section-title">🤖 AI Intelligence Synthesis</h2>
            <div className="answer">{data.answer}</div>
            {data.queryInfo?.expandedQuery && (
              <p className="tiny" style={{ marginTop: 14 }}>
                Expanded query: {data.queryInfo.expandedQuery}
              </p>
            )}
          </div>

          <div className="bento">
            <div className="section">
              <h2 className="section-title">📚 Scientific Evidence (2024–2026)</h2>
              {data.publications?.length ? (
                <div className="pub-list">
                  {data.publications.map((p, i) => (
                    <div key={i} className="pub-item">
                      <div className="pub-title">{p.title || "Untitled"}</div>
                      <div className="meta-row">
                        <span className="badge">
                          {p.year || "N/A"} | {p.source || "Source"}
                        </span>
                        <a
                          href={p.url || p.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="link"
                        >
                          Full Text →
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty">No publications were returned for this search.</div>
              )}
            </div>

            <div className="section">
              <h2 className="section-title">🧪 Clinical Trials</h2>
              {data.trials?.length ? (
                <div className="trial-list">
                  {data.trials.map((t, i) => (
                    <div key={i} className="trial-item">
                      <div className="trial-title">{t.title || "Untitled"}</div>
                      <div className="trial-meta">
                        <div>
                          <strong>Status:</strong> {t.status || "Unknown"}
                        </div>
                        <div>
                          <strong>Location:</strong> {t.location || "Not listed"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty">No clinical trials were returned for this search.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {loading && !data && (
        <div className="results">
          <div className="section">
            <div className="skeleton" style={{ width: "40%", height: 22, marginBottom: 14 }} />
            <div className="skeleton" style={{ width: "100%", marginBottom: 10 }} />
            <div className="skeleton" style={{ width: "92%", marginBottom: 10 }} />
            <div className="skeleton" style={{ width: "75%" }} />
          </div>

          <div className="bento">
            <div className="skeleton-card">
              <div className="skeleton" style={{ width: "44%", height: 18 }} />
              <div className="skeleton" style={{ width: "100%" }} />
              <div className="skeleton" style={{ width: "90%" }} />
              <div className="skeleton" style={{ width: "68%" }} />
            </div>

            <div className="skeleton-card">
              <div className="skeleton" style={{ width: "35%", height: 18 }} />
              <div className="skeleton" style={{ width: "100%" }} />
              <div className="skeleton" style={{ width: "88%" }} />
              <div className="skeleton" style={{ width: "72%" }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;