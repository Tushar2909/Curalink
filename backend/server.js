const express = require("express");
const cors = require("cors");
const app = express();

// 🚀 Production-Grade CORS
app.use(cors({
  origin: "*", // Allows Vercel to communicate freely
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json({ limit: '10mb' })); 

// 📡 Request Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// 🛣️ Routes
app.use("/api", require("./routes/search"));

app.get("/", (req, res) => {
  res.send("CuraLink Engine: Operational");
});

// 🛑 Global Error Handler
app.use((err, req, res, next) => {
  console.error("🔥 SYSTEM ERROR:", err.stack);
  res.status(500).json({ 
    error: "Medical Reasoning Engine encountered an error.",
    details: err.message 
  });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 CuraLink Backend active on port ${PORT}`);
});

// ⚡ CRITICAL FIX: Increase server timeouts for slow AI generations
server.timeout = 120000; // 120 seconds
server.keepAliveTimeout = 120000;