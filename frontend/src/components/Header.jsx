export default function Header({
  search,
  setSearch,
  onRefresh,
  sortKey,
  setSortKey,
  theme,
  toggleTheme,
}) {
  return (
    <header className="topbar hero">
      <div className="heroLeft">
        <div className="heroKicker">Weather Analytics</div>
        <h1 className="heroTitle">Comfort Dashboard</h1>
        <p className="heroSub">
          Ranked cities using a custom Comfort Index (0–100) based on Temperature,
          Humidity, Wind & Clouds.
        </p>
      </div>

      <div className="actions heroActions">
        <select
          className="select"
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value)}
          aria-label="Sort"
        >
          <option value="rank">Sort: Rank</option>
          <option value="comfortDesc">Sort: Comfort (High → Low)</option>
          <option value="comfortAsc">Sort: Comfort (Low → High)</option>
          <option value="tempDesc">Sort: Temp (High → Low)</option>
          <option value="tempAsc">Sort: Temp (Low → High)</option>
          <option value="humidityDesc">Sort: Humidity (High → Low)</option>
          <option value="windDesc">Sort: Wind (High → Low)</option>
        </select>

        <input
          className="search"
          placeholder="Search city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button className="btn ghost" onClick={toggleTheme}>
          {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
        </button>

        <button className="btn" onClick={onRefresh}>
          Refresh
        </button>
      </div>
    </header>
  );
}
