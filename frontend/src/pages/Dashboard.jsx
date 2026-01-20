import { useEffect, useMemo, useState } from "react";
import { fetchComfortData } from "../api/weatherApi";
import Header from "../components/Header";
import ComfortTable from "../components/ComfortTable";
import CityCards from "../components/CityCards";
import TempChart from "../components/TempChart";
import "../styles/dashboard.css";
import { useAuth0 } from "@auth0/auth0-react";

function sortItems(list, sortKey) {
  const arr = [...list];

  switch (sortKey) {
    case "rank":
      return arr.sort((a, b) => a.rank - b.rank);
    case "comfortDesc":
      return arr.sort((a, b) => b.comfortScore - a.comfortScore);
    case "comfortAsc":
      return arr.sort((a, b) => a.comfortScore - b.comfortScore);
    case "tempDesc":
      return arr.sort((a, b) => b.temperatureC - a.temperatureC);
    case "tempAsc":
      return arr.sort((a, b) => a.temperatureC - b.temperatureC);
    case "humidityDesc":
      return arr.sort((a, b) => b.humidity - a.humidity);
    case "windDesc":
      return arr.sort((a, b) => b.windSpeed - a.windSpeed);
    default:
      return arr;
  }
}

export default function Dashboard() {
  const { getAccessTokenSilently, isAuthenticated, isLoading } = useAuth0();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("rank");

  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }

  async function load() {
    try {
      setLoading(true);
      setErr("");

      // wait until Auth0 finished loading
      if (isLoading) return;

      // only fetch when authenticated
      if (!isAuthenticated) {
        setData(null);
        return;
      }

      const json = await fetchComfortData(getAccessTokenSilently);
      setData(json);
    } catch (e) {
      setErr(e?.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [isAuthenticated, isLoading]); // important

  const items = useMemo(() => {
    const list = data?.items || [];
    const q = search.trim().toLowerCase();
    const filtered = q
      ? list.filter((x) => x.cityName.toLowerCase().includes(q))
      : list;

    return sortItems(filtered, sortKey);
  }, [data, search, sortKey]);

  const topCity = items?.[0];
  const avgComfort = items.length
    ? Math.round(items.reduce((s, x) => s + x.comfortScore, 0) / items.length)
    : 0;

  return (
    <div className="page">
      <Header
        search={search}
        setSearch={setSearch}
        onRefresh={load}
        sortKey={sortKey}
        setSortKey={setSortKey}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {loading && <div className="card">Loading...</div>}
      {err && <div className="card error">❌ {err}</div>}

      {data && (
        <>
          <div className="stats">
            <div className="statCard">
              <div className="statLabel">Top City</div>
              <div className="statValue">{topCity ? topCity.cityName : "-"}</div>
              <div className="statSub muted small">
                Comfort: <b>{topCity ? topCity.comfortScore : "-"}</b>
              </div>
            </div>

            <div className="statCard">
              <div className="statLabel">Average Comfort</div>
              <div className="statValue">{avgComfort}</div>
              <div className="statSub muted small">Across {items.length} cities</div>
            </div>

            <div className="statCard">
              <div className="statLabel">Last Updated</div>
              <div className="statValue">
                {new Date(data.generatedAt).toLocaleTimeString()}
              </div>
              <div className="statSub muted small">
                {new Date(data.generatedAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          <TempChart items={items} />
          <ComfortTable items={items} />
          <CityCards items={items} />
        </>
      )}
    </div>
  );
}
