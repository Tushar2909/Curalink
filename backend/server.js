const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' })); // Handles large abstracts

// Request Logger (useful for your own debugging)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use("/api", require("./routes/search"));

app.get("/", (req, res) => {
  res.send("CuraLink Engine: Operational");
});

// Global Error Handler - keeps the server alive if an API fails
app.use((err, req, res, next) => {
  console.error("🔥 SYSTEM ERROR:", err.stack);
  res.status(500).json({ error: "Medical Reasoning Engine encountered an error." });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 CuraLink Backend active on port ${PORT}`);
});