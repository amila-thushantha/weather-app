function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

/**
 * Comfort Index score (0 - 100)
 * Uses 4 parameters: Temperature, Humidity, Wind Speed, Cloudiness
 * - tempC ideal ~24 (tolerance +/- 12)
 * - humidity ideal ~50 (tolerance +/- 40)
 * - wind ideal ~3 m/s (tolerance +/- 7)
 * - clouds ideal ~20 (tolerance +/- 80) small weight
 */
function comfortIndex({ tempC, humidity, windSpeed, clouds }) {
  const tempIdeal = 24;
  const humIdeal = 50;
  const windIdeal = 3;
  const cloudIdeal = 20;

  const tempScore = 100 - (Math.abs(tempC - tempIdeal) / 12) * 100;
  const humScore = 100 - (Math.abs(humidity - humIdeal) / 40) * 100;
  const windScore = 100 - (Math.abs(windSpeed - windIdeal) / 7) * 100;
  const cloudScore = 100 - (Math.abs(clouds - cloudIdeal) / 80) * 100;

  const score =
    0.45 * tempScore +
    0.30 * humScore +
    0.20 * windScore +
    0.05 * cloudScore;

  return clamp(Math.round(score), 0, 100);
}

module.exports = { comfortIndex };
