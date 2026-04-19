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
  ::-webkit-scrollbar { width: 8px; }
  ::-webkit-scrollbar-track { background: #f1f5f9; }
  ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
  ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
`;
document.head.appendChild(styleTag);

// 🌐 AUTO-DETECT BACKEND URL
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

  // Update Page Title
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
    { label: "Crohn's Disease", value: "crohn's disease" },
    { label: "Cystic Fibrosis", value: "cystic fibrosis" },
    { label: "Dengue Fever", value: "dengue" },
    { label: "Diabetes Mellitus (Type 1 & 2)", value: "diabetes mellitus" },
    { label: "Endometriosis", value: "endometriosis" },
    { label: "Epilepsy", value: "epilepsy" },
    { label: "Heart Attack (Myocardial Infarction)", value: "myocardial infarction" },
    { label: "Heart Failure", value: "heart failure" },
    { label: "Hemophilia", value: "hemophilia" },
    { label: "Hepatitis C", value: "hepatitis c" },
    { label: "HIV/AIDS", value: "hiv aids" },
    { label: "Hypertension (High Blood Pressure)", value: "hypertension" },
    { label: "Hypothyroidism", value: "hypothyroidism" },
    { label: "Leukemia", value: "leukemia" },
    { label: "Lung Cancer", value: "lung cancer" },
    { label: "Lupus (SLE)", value: "systemic lupus erythematosus" },
    { label: "Malaria", value: "malaria" },
    { label: "Melanoma (Skin Cancer)", value: "melanoma" },
    { label: "Migraine", value: "migraine" },
    { label: "Multiple Sclerosis", value: "multiple sclerosis" },
    { label: "Obesity", value: "obesity" },
    { label: "Pancreatic Cancer", value: "pancreatic cancer" },
    { label: "Parkinson's Disease", value: "parkinson's disease" },
    { label: "PCOS", value: "polycystic ovary syndrome" },
    { label: "Pneumonia", value: "pneumonia" },
    { label: "Prostate Cancer", value: "prostate cancer" },
    { label: "Psoriasis", value: "psoriasis" },
    { label: "Rheumatoid Arthritis", value: "rheumatoid arthritis" },
    { label: "Sickle Cell Anemia", value: "sickle cell disease" },
    { label: "Stroke", value: "stroke" },
    { label: "Tuberculosis (TB)", value: "tuberculosis" }
  ];

  const queryOptions = [
    { label: "Latest Treatment", value: "treatment" },
    { label: "Diagnosis & Screening", value: "diagnosis" },
    { label: "Ongoing Clinical Trials", value: "clinical trials" },
    { label: "Symptoms & Presentation", value: "symptoms" },
    { label: "Recent Advances", value: "latest research" }
  ];

  useEffect(() => {
    if (!loading) return;
    const steps = [
      "📡 Syncing with NIH & Global Repositories...", 
      "🧬 Parsing 2025-2026 Breakthroughs...", 
      "🧪 Cross-Referencing Clinical Trials...", 
      "🧠 CuraLink AI Synthesizing Insights..."
    ];
    let i = 0;
    const interval = setInterval(() => {
      setLoadingText(steps[i % steps.length]);
      i++;
    }, 2000);
    return () => clearInterval(interval);
  }, [loading]);

  const copyToClipboard = () => {
    if (data?.answer) {
      navigator.clipboard.writeText(data.answer);
      alert("Synthesis Report copied to clipboard!");
    }
  };

  const handleSearch = async () => {
    if (!selectedDisease || !query) return alert("Please select Disease and Research Objective.");
    try {
      setLoading(true);
      setData(null);
      // 🛠️ CRITICAL FIX: Added 90s timeout for Render Free Tier stability
      const res = await axios.post(`${BACKEND_URL}/api/search`, {
        patientName: patientName || "User",
        location: location || "Global",
        disease: selectedDisease,
        query
      }, { timeout: 90000 }); 
      
      setData(res.data);
    } catch (err) {
      console.error(err);
      alert("Note: Server is warming up. Please wait 10 seconds and click search again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.overlay}>
        <h1 style={styles.title}>🧬 CuraLink AI</h1>
        <p style={styles.subtitle}>Autonomous Clinical Evidence Synthesis</p>
        
        <div style={styles.card}>
          <div style={styles.inputGroup}>
            <input 
              style={styles.input} 
              placeholder="Recipient Name" 
              onChange={(e) => setPatientName(e.target.value)} 
            />
            <input 
              style={styles.input} 
              placeholder="City, Country" 
              onChange={(e) => setLocation(e.target.value)} 
            />
          </div>
          
          <select style={styles.input} onChange={(e) => setSelectedDisease(e.target.value)}>
            <option value="">-- Clinical Indication --</option>
            {diseasesList.sort((a,b) => a.label.localeCompare(b.label)).map(d => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </select>

          <select style={styles.input} onChange={(e) => setQuery(e.target.value)}>
            <option value="">-- Research Objective --</option>
            {queryOptions.map(q => (
              <option key={q.value} value={q.value}>{q.label}</option>
            ))}
          </select>

          <button 
            style={{...styles.button, backgroundColor: loading ? "#94a3b8" : "#2563eb"}} 
            onClick={handleSearch} 
            disabled={loading}
          >
            {loading ? "Synthesizing Evidence..." : "Initiate Research Pipeline"}
          </button>
        </div>

        {loading && <div className="loading-pulse" style={styles.loading}>{loadingText}</div>}

        {data && (
          <div style={styles.results}>
            <div style={styles.section} className="hover-card">
              <div style={styles.flexHeader}>
                <h2 style={styles.sectionTitle}>🤖 AI Intelligence Synthesis</h2>
                <button onClick={copyToClipboard} style={styles.copyBtn}>Copy Report</button>
              </div>
              <div style={styles.answer}>{data.answer || "Agent is processing... please try once more."}</div>
            </div>

            <div style={styles.bentoGrid}>
              <div style={{...styles.section, flex: 1.8}} className="hover-card">
                <h2 style={styles.sectionTitle}>📚 Scientific Evidence (2024-2026)</h2>
                <div style={styles.scrollArea}>
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
              </div>

              <div style={{...styles.section, flex: 1}} className="hover-card">
                <h2 style={styles.sectionTitle}>🧪 Clinical Trials</h2>
                <div style={styles.scrollArea}>
                  {data.trials?.map((t, i) => (
                    <div key={i} style={styles.trialCard}>
                      <div style={styles.itemTitle}>{t.title}</div>
                      <div style={styles.statusBadge(t.status)}>{t.status}</div>
                      <div style={{fontSize: '12px', color: '#64748b', marginTop: '5px'}}>City: {t.location}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div style={styles.footer}>
              Engineered for Medical Retrieval Accuracy • Data via PubMed Core & ClinicalTrials.gov API
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { fontFamily: "'Inter', system-ui, -apple-system, sans-serif", backgroundColor: "#f8fafc", minHeight: "100vh", color: "#0f172a", padding: "20px" },
  title: { textAlign: 'center', fontSize: '3rem', fontWeight: '900', color: '#1e40af', marginBottom: '5px', letterSpacing: '-1.5px' },
  subtitle: { textAlign: 'center', color: '#64748b', marginBottom: '40px', fontSize: '1.1rem', fontWeight: '500' },
  card: { maxWidth: '750px', margin: '0 auto 50px auto', background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(16px)', padding: '45px', borderRadius: '28px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.08)', border: '1px solid #e2e8f0' },
  inputGroup: { display: 'flex', gap: '15px', marginBottom: '20px' },
  input: { flex: 1, padding: '16px', borderRadius: '14px', border: '1px solid #cbd5e1', fontSize: '16px', backgroundColor: '#fff', outline: 'none' },
  button: { width: '100%', padding: '18px', color: '#fff', border: 'none', borderRadius: '14px', cursor: 'pointer', fontSize: '18px', fontWeight: '800' },
  loading: { textAlign: 'center', marginTop: '30px', fontSize: '1.3rem' },
  results: { maxWidth: '1200px', margin: '0 auto', paddingBottom: '80px' },
  bentoGrid: { display: 'flex', gap: '25px', flexWrap: 'wrap' },
  section: { background: '#fff', padding: '35px', borderRadius: '28px', marginBottom: '25px', border: '1px solid #e2e8f0' },
  flexHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' },
  sectionTitle: { fontSize: '1.35rem', color: '#0f172a', borderLeft: '5px solid #2563eb', paddingLeft: '18px', fontWeight: '800', margin: 0 },
  copyBtn: { padding: '8px 16px', borderRadius: '10px', background: '#f1f5f9', border: '1px solid #e2e8f0', cursor: 'pointer', fontSize: '13px', fontWeight: '700' },
  answer: { whiteSpace: 'pre-wrap', lineHeight: '2', color: '#334155', fontSize: '16.5px' },
  scrollArea: { maxHeight: '600px', overflowY: 'auto', paddingRight: '10px' },
  listItem: { padding: '22px 0', borderBottom: '1px solid #f1f5f9' },
  itemTitle: { fontWeight: '750', fontSize: '17.5px', color: '#1e293b' },
  itemMeta: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  badge: { fontSize: '12px', background: '#eff6ff', padding: '6px 14px', borderRadius: '20px', color: '#1e40af', fontWeight: '700' },
  link: { color: '#2563eb', textDecoration: 'none', fontWeight: '800' },
  trialCard: { padding: '22px', border: '1px solid #fed7aa', backgroundColor: '#fffaf5', marginBottom: '20px', borderRadius: '20px' },
  statusBadge: (status) => ({ display: 'inline-block', padding: '5px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: '900', backgroundColor: status?.includes('RECRUITING') ? '#dcfce7' : '#fef9c3', color: status?.includes('RECRUITING') ? '#166534' : '#1e293b' }),
  footer: { textAlign: 'center', marginTop: '60px', color: '#94a3b8', fontSize: '13px', fontWeight: '700' }
};

export default App;