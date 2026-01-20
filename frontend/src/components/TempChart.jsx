import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;

  const temp = payload?.[0]?.value;
  return (
    <div className="tooltip">
      <div className="tooltipTitle">{label}</div>
      <div className="tooltipRow">
        <span>Temp</span>
        <b>{temp}°C</b>
      </div>
    </div>
  );
}

export default function TempChart({ items }) {
  const data = items.map((x) => ({
    city: x.cityName,
    temp: x.temperatureC,
  }));

  return (
    <div className="chartCard">
      <div className="chartHeader">
        <div>
          <h3>Temperature by City</h3>
          <p className="muted small">Latest snapshot</p>
        </div>
        <div className="chip">Bar chart</div>
      </div>

      <div style={{ width: "100%", height: 280 }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 10, right: 12, bottom: 22, left: 0 }}>
            <defs>
              <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--grad1)" />
                <stop offset="100%" stopColor="var(--grad2)" />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
            <XAxis
              dataKey="city"
              tick={{ fontSize: 12 }}
              interval={0}
              angle={-15}
              height={60}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="temp" fill="url(#tempGradient)" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
