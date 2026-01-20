import ScoreBar from "./ScoreBar";

function badge(rank) {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return "⭐";
}

function pillClass(rank) {
  if (rank === 1) return "pill gold";
  if (rank === 2) return "pill silver";
  if (rank === 3) return "pill bronze";
  return "pill";
}

export default function ComfortTable({ items }) {
  return (
    <div className="tableCard">
      <div className="tableTitleRow">
        <div>
          <h3 className="sectionTitle">City Ranking</h3>
          <p className="muted small">Most comfortable cities appear at the top.</p>
        </div>
        <div className="chip">Desktop table</div>
      </div>

      <div className="tableWrap">
        <table className="table">
          <thead>
            <tr>
              <th className="colRank">Rank</th>
              <th>City</th>
              <th>Weather</th>
              <th className="num">Temp</th>
              <th className="num">Humidity</th>
              <th className="num">Wind</th>
              <th className="num">Clouds</th>
              <th className="num">Comfort</th>
            </tr>
          </thead>

          <tbody>
            {items.map((x) => (
              <tr key={x.cityId} className={x.rank <= 3 ? "topRow topPulse" : ""}>
                <td className="colRank">
                  <span className={pillClass(x.rank)}>
                    {badge(x.rank)} #{x.rank}
                  </span>
                </td>

                <td className="cityCell">
                  <div className="cityName">{x.cityName}</div>
                  <div className="muted small">ID: {x.cityId}</div>
                </td>

                <td className="weatherCell">
                  <span className="weatherPill">{x.description}</span>
                </td>

                <td className="num">{x.temperatureC}°C</td>
                <td className="num">{x.humidity}%</td>
                <td className="num">{x.windSpeed} m/s</td>
                <td className="num">{x.clouds}%</td>

                <td className="num">
                  <ScoreBar value={x.comfortScore} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
