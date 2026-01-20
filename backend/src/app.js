const express = require("express");
const cors = require("cors");

const comfortRoutes = require("./routes/comfort.routes");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "Backend running " });
});

// routes
app.use("/api", comfortRoutes);

module.exports = app;
