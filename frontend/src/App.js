import { useState, useEffect } from "react";
import axios from "axios";

// 🚀 Production-Grade Global Styles
const styleTag = document.createElement("style");
styleTag.innerHTML = `
  @keyframes pulse {
    0% { opacity: 0.6; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.01); }
    100% { opacity: 0.6; transform: scale(1); }
  }
  .loading-pulse {
    animation: pulse 1.5s infinite ease-in-out;
    color: #2563eb;
    font-weight: 700;
  }
  .hover-card {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  }
  .hover-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
    border-color: #2563eb !important;
  }
`;
document.head.appendChild(styleTag);

const BACKEND_URL = process.env.NODE_ENV === 'production' 
  ? "https://curalink-3h2f.onrender.com" 
  : "http://localhost:5000";

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

  const diseasesList = [
    { label: "Alzheimer's Disease", value: "alzheimer's disease" },
    { label: "Asthma", value: "asthma" },
    { label: "Atrial Fibrillation", value: "atrial fibrillation" },
    { label: "Breast Cancer", value: "breast cancer" },
    { label: "Celiac Disease", value: "celiac disease" },
    { label: "Chronic Kidney Disease", value: "chronic kidney disease" },
    { label: "COPD (Lung Disease)", value: "chronic obstructive pulmonary disease" },
    { label: "COVID-19", value: "covid-19" },
    { label: "Diabetes Mellitus", value: "diabetes mellitus" },
    { label: "Epilepsy", value: "epilepsy" },
    { label: "Hypertension", value: "hypertension" },
    { label: "Parkinson's Disease", value: "parkinson's disease" },
    { label: "Stroke", value: "stroke" }
    // ... (You can keep your full list here)
  ];

  const queryOptions = [
    { label: "Latest Treatment", value: "treatment" },
    { label: "Diagnosis & Screening", value: "diagnosis" },
    { label: "Ongoing Clinical Trials", value: "clinical trials" },
    { label: "Recent Advances", value: "latest research" }
  ];

  useEffect(() => {
    if (!loading) return;
    const steps = [
      "📡 Syncing with NIH & Global Repositories...", 
      "🧬 Parsing 2025-2026 Breakthroughs...", 
      "🧠 CuraLink AI Synthesizing Insights..."
    ];
    let i = 0;
    const interval = setInterval(() => {
      setLoadingText(steps[i % steps.length]);
      i++;
    }, 2500);
    return () => clearInterval(interval);
  }, [loading]);

  const handleSearch = async () => {
    if (!selectedDisease || !query) return alert("Please select Disease and Research Objective.");
    try {
      setLoading(true);
      setData(null);
      setErrorMsg("");
      const res = await axios.post(`${BACKEND_URL}/api/search`, {
        patientName: patientName || "User",
        location: location || "Global",
        disease: selectedDisease,
        query
      }, { timeout: 90000 }); 
      
      setData(res.data);
    } catch (err) {
      console.error(err);
      setErrorMsg("The AI Engine is warming up. Please wait 10 seconds and click the button again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🧬 CuraLink AI</h1>
      <p style={styles.subtitle}>Autonomous Clinical Evidence Synthesis</p>
      
      <div style={styles.card}>
        <div style={styles.inputGroup}>
          <input style={styles.input} placeholder="Recipient Name" onChange={(e) => setPatientName(e.target.value)} />
          <input style={styles.input} placeholder="City, Country" onChange={(e) => setLocation(e.target.value)} />
        </div>
        
        <select style={styles.input} onChange={(e) => setSelectedDisease(e.target.value)}>
          <option value="">-- Clinical Indication --</option>
          {diseasesList.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
        </select>

        <select style={styles.input} onChange={(e) => setQuery(e.target.value)}>
          <option value="">-- Research Objective --</option>
          {queryOptions.map(q => <option key={q.value} value={q.value}>{q.label}</option>)}
        </select>

        <button 
          style={{...styles.button, backgroundColor: loading ? "#94a3b8" : "#2563eb"}} 
          onClick={handleSearch} 
          disabled={loading}
        >
          {loading ? "Synthesizing..." : "Initiate Research Pipeline"}
        </button>
      </div>

      {loading && <div className="loading-pulse" style={styles.loading}>{loadingText}</div>}
      
      {errorMsg && (
        <div style={styles.errorBox}>
          <p>{errorMsg}</p>
        </div>
      )}

      {data && (
        <div style={styles.results}>
          <div style={styles.section} className="hover-card">
            <h2 style={styles.sectionTitle}>🤖 AI Intelligence Synthesis</h2>
            <div style={styles.answer}>{data.answer}</div>
          </div>

          <div style={styles.bentoGrid}>
            <div style={{...styles.section, flex: 1.5}} className="hover-card">
              <h2 style={styles.sectionTitle}>📚 Scientific Evidence (2024-2026)</h2>
              {data.publications?.map((p, i) => (
                <div key={i} style={styles.listItem}>
                  <div style={styles.itemTitle}>{p.title}</div>
                  <div style={styles.itemMeta}>
                    <span style={styles.badge}>{p.year} | {p.source}</span>
                    <a href={p.url} target="_blank" rel="noreferrer" style={styles.link}>Full Text →</a>
                  </div>
                </div>
              ))}
            </div>

            <div style={{...styles.section, flex: 1}} className="hover-card">
              <h2 style={styles.sectionTitle}>🧪 Clinical Trials</h2>
              {data.trials?.map((t, i) => (
                <div key={i} style={styles.trialCard}>
                  <div style={styles.itemTitle}>{t.title}</div>
                  <div style={{fontSize: '12px', color: '#64748b'}}>{t.status} | {t.location}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { fontFamily: "'Inter', sans-serif", backgroundColor: "#f8fafc", minHeight: "100vh", padding: "20px" },
  title: { textAlign: 'center', fontSize: '2.5rem', fontWeight: '900', color: '#1e40af' },
  subtitle: { textAlign: 'center', color: '#64748b', marginBottom: '30px' },
  card: { maxWidth: '700px', margin: '0 auto', background: '#fff', padding: '40px', borderRadius: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' },
  inputGroup: { display: 'flex', gap: '10px', marginBottom: '15px' },
  input: { width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #cbd5e1', marginBottom: '15px', outline: 'none' },
  button: { width: '100%', padding: '16px', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' },
  loading: { textAlign: 'center', marginTop: '20px' },
  errorBox: { maxWidth: '700px', margin: '20px auto', padding: '15px', borderRadius: '12px', backgroundColor: '#fef2f2', border: '1px solid #ef4444', color: '#b91c1c', textAlign: 'center' },
  results: { maxWidth: '1100px', margin: '40px auto' },
  bentoGrid: { display: 'flex', gap: '20px', flexWrap: 'wrap' },
  section: { background: '#fff', padding: '25px', borderRadius: '24px', border: '1px solid #e2e8f0', marginBottom: '20px' },
  sectionTitle: { fontSize: '1.2rem', color: '#1e293b', fontWeight: '800', marginBottom: '15px' },
  answer: { lineHeight: '1.8', color: '#334155' },
  listItem: { padding: '15px 0', borderBottom: '1px solid #f1f5f9' },
  itemTitle: { fontWeight: '700', color: '#1e293b', marginBottom: '5px' },
  itemMeta: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  badge: { fontSize: '11px', background: '#eff6ff', padding: '4px 10px', borderRadius: '12px', color: '#1e40af' },
  link: { color: '#2563eb', textDecoration: 'none', fontSize: '13px', fontWeight: 'bold' },
  trialCard: { padding: '15px', background: '#f8fafc', borderRadius: '16px', marginBottom: '10px', border: '1px solid #e2e8f0' }
};

export default App;