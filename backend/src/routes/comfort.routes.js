const express = require("express");
const router = express.Router();

const { checkJwt } = require("../config/auth0");
const { getComfortDashboard, getCacheStatus } = require("../services/comfort.service");

// Debug endpoint (cache status)
router.get("/cache-status", (req, res) => {
  res.json(getCacheStatus());
});

// Main endpoint
router.get("/comfort", checkJwt, async (req, res) => {
  try {
    const payload = await getComfortDashboard();
    res.json(payload);
  } catch (err) {
    console.error(err?.response?.data || err.message);
    res.status(err.statusCode || 500).json({
      error: err.statusCode ? err.message : "Failed to compute comfort dashboard",
    });
  }
});

module.exports = router;
