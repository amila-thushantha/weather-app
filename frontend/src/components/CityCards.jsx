function badge(rank) {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return "⭐";
}

export default function CityCards({ items }) {
  return (
    <div className="cards">
      {items.map((x) => (
        <div
          className={`cityCard ${x.rank <= 3 ? "cardTop" : ""}`}
          key={x.cityId}
        >
          <div className="row">
            <div>
              <div className="rank">
                {badge(x.rank)} #{x.rank}
              </div>
              <h2>{x.cityName}</h2>
              <div className="muted small">{x.description}</div>
            </div>

            <div className="big">{x.comfortScore}</div>
          </div>

          <div className="grid">
            <div className="kv">
              <span>Temp</span>
              <b>{x.temperatureC}°C</b>
            </div>
            <div className="kv">
              <span>Humidity</span>
              <b>{x.humidity}%</b>
            </div>
            <div className="kv">
              <span>Wind</span>
              <b>{x.windSpeed} m/s</b>
            </div>
            <div className="kv">
              <span>Clouds</span>
              <b>{x.clouds}%</b>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
