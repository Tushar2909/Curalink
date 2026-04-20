const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
  })
);

app.use(express.json({ limit: "10mb" }));

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use("/api", require("./routes/search"));

app.get("/", (req, res) => {
  res.send("CuraLink Engine: Operational");
});

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    groqConfigured: !!process.env.GROQ_API_KEY,
    timestamp: new Date().toISOString()
  });
});

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
  console.log(`🔑 GROQ configured: ${!!process.env.GROQ_API_KEY}`);
});

server.timeout = 120000;
server.keepAliveTimeout = 120000;