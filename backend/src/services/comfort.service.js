const axios = require("axios");
const NodeCache = require("node-cache");
const fs = require("fs");
const path = require("path");

const { comfortIndex } = require("../utils/comfortIndex");

const API_KEY = process.env.OPENWEATHER_API_KEY;
const TTL = Number(process.env.CACHE_TTL_SECONDS || 300);

// Cache: raw responses & processed output
const rawCache = new NodeCache({ stdTTL: TTL });
const processedCache = new NodeCache({ stdTTL: TTL });

// Debug cache stats
let lastCacheInfo = { processed: "MISS", raw: {} };

/**
 * Read city codes from backend/data/cities.json
 * Supports:
 * 1) Array format: [ {...}, {...} ]
 * 2) Object format: { "List": [ {...}, {...} ] }
 */
function readCityCodes() {
  const filePath = path.join(__dirname, "..", "data", "cities.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  const parsed = JSON.parse(raw);

  const citiesArray = Array.isArray(parsed) ? parsed : parsed.List || [];

  const codes = citiesArray
    .map((c) => c.CityCode ?? c.cityCode ?? c.id ?? c.cityId)
    .filter(Boolean)
    .map((x) => Number(x));

  // Minimum 10 cities required by assignment
  // If your cities.json has less than 10, we will still process what exists.
  return codes.slice(0, 10);
}

async function fetchWeather(cityId) {
  const cacheKey = `weather:${cityId}`;
  const cached = rawCache.get(cacheKey);

  if (cached) {
    lastCacheInfo.raw[cityId] = "HIT";
    return cached;
  }

  lastCacheInfo.raw[cityId] = "MISS";

  const url = `https://api.openweathermap.org/data/2.5/weather?id=${cityId}&appid=${API_KEY}`;
  const { data } = await axios.get(url);
  rawCache.set(cacheKey, data);
  return data;
}

function getCacheStatus() {
  return {
    processed: lastCacheInfo.processed,
    raw: lastCacheInfo.raw,
    rawCacheKeys: rawCache.keys(),
    processedCacheKeys: processedCache.keys(),
    ttlSeconds: TTL,
  };
}

async function getComfortDashboard() {
  if (!API_KEY) {
    const err = new Error("Missing OPENWEATHER_API_KEY in .env");
    err.statusCode = 500;
    throw err;
  }

  // processed output cache
  const processedKey = "comfort:top10";
  const processed = processedCache.get(processedKey);

  if (processed) {
    lastCacheInfo.processed = "HIT";
    return processed;
  }

  lastCacheInfo.processed = "MISS";
  lastCacheInfo.raw = {};

  const cityIds = readCityCodes();

  if (!cityIds.length) {
    const err = new Error(
      "No city codes found. Check backend/data/cities.json (Array or {List:[]})"
    );
    err.statusCode = 500;
    throw err;
  }

  const results = await Promise.all(
    cityIds.map(async (id) => {
      const w = await fetchWeather(id);

      const tempK = w?.main?.temp ?? 0;
      const tempC = tempK - 273.15;

      const humidity = w?.main?.humidity ?? 0;
      const windSpeed = w?.wind?.speed ?? 0;
      const clouds = w?.clouds?.all ?? 0;

      const score = comfortIndex({ tempC, humidity, windSpeed, clouds });

      return {
        cityId: w.id,
        cityName: w.name,
        description: w.weather?.[0]?.description ?? "N/A",
        temperatureC: Number(tempC.toFixed(1)),
        humidity,
        windSpeed,
        clouds,
        comfortScore: score,
      };
    })
  );

  results.sort((a, b) => b.comfortScore - a.comfortScore);

  const ranked = results.map((item, index) => ({
    rank: index + 1,
    ...item,
  }));

  const payload = {
    generatedAt: new Date().toISOString(),
    count: ranked.length,
    items: ranked,
  };

  processedCache.set(processedKey, payload);
  return payload;
}

module.exports = {
  getComfortDashboard,
  getCacheStatus,
};
