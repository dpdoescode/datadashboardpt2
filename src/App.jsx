import BreedCharts from "./Components/BreedCharts.jsx";
import { useEffect, useMemo, useState } from "react";
import "./App.css";
import CatInfo from "./Components/CatInfo.jsx";
import SideNav from "./Components/SideNav.jsx";

const API_KEY = import.meta.env.VITE_APP_API_KEY;

function App() {
  const [list, setList] = useState([]); // full breed list
  const [filteredResults, setFilteredResults] = useState([]); // visible list
  const [searchInput, setSearchInput] = useState("");
  const [filterOrigin, setFilterOrigin] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllCats = async () => {
      setLoading(true);
      const res = await fetch("https://api.thecatapi.com/v1/breeds", {
        headers: API_KEY ? { "x-api-key": API_KEY } : {},
      });
      const json = await res.json();
      setList(json);
      setFilteredResults(json);
      setLoading(false);
    };

    fetchAllCats().catch((err) => {
      console.error("Fetch error:", err);
      setLoading(false);
    });
  }, []);

  // derives unique origins for the dropdown
  const uniqueOrigins = useMemo(() => {
    const origins = list.map((b) => b.origin || "Unknown");
    return Array.from(new Set(origins)).sort();
  }, [list]);

  // helper: compute average lifespan value for a breed (mean of range)
  const parseLifeSpanAvg = (lifeSpanStr) => {
    if (!lifeSpanStr) return null;
    // typical shape "12 - 15" or "12 - 14"
    const nums = lifeSpanStr
      .split("-")
      .map((s) => s.replace(/[^\d.]/g, "").trim())
      .filter(Boolean)
      .map(Number);
    if (nums.length === 0) return null;
    if (nums.length === 1) return nums[0];
    return (nums[0] + nums[1]) / 2;
  };

  // STATISTICS: compute avg and median lifespans based on filtered results
  const stats = useMemo(() => {
    const lifespans = filteredResults
      .map((b) => parseLifeSpanAvg(b.life_span))
      .filter((n) => typeof n === "number" && !isNaN(n));
    const total = filteredResults.length;
    const avg =
      lifespans.length > 0
        ? lifespans.reduce((a, b) => a + b, 0) / lifespans.length
        : 0;

    const sorted = lifespans.slice().sort((a, b) => a - b);
    let median = 0;
    if (sorted.length > 0) {
      const m = Math.floor(sorted.length / 2);
      median =
        sorted.length % 2 === 0 ? (sorted[m - 1] + sorted[m]) / 2 : sorted[m];
    }

    return {
      total,
      avg: avg || 0,
      median: median || 0,
    };
  }, [filteredResults]);

  // filter + search combined
  const filterCats = (searchValue, originValue) => {
    let filtered = list;

    if (originValue && originValue !== "All") {
      filtered = filtered.filter(
        (cat) =>
          (cat.origin || "Unknown").toLowerCase() === originValue.toLowerCase()
      );
    }

    if (searchValue && searchValue.trim() !== "") {
      const q = searchValue.toLowerCase();
      filtered = filtered.filter(
        (cat) =>
          (cat.name || "").toLowerCase().includes(q) ||
          (cat.temperament || "").toLowerCase().includes(q) ||
          (cat.origin || "").toLowerCase().includes(q)
      );
    }

    setFilteredResults(filtered);
  };

  const handleSearchChange = (val) => {
    setSearchInput(val);
    filterCats(val, filterOrigin);
  };

  const handleFilterChange = (val) => {
    setFilterOrigin(val);
    filterCats(searchInput, val);
  };

  return (
    <div>
      <SideNav />
      <div className="whole-page">
        <h1>🐾 Cat Breed Dashboard</h1>

        <div className="controls">
          <input
            type="text"
            placeholder="Search breeds, temperament, or origin..."
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
          <select
            value={filterOrigin}
            onChange={(e) => handleFilterChange(e.target.value)}
          >
            <option value="All">All Origins</option>
            {uniqueOrigins.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>

        <div className="summary">
          <div className="stat">
            <strong>Total Breeds Displayed:</strong> {stats.total}
          </div>
          <div className="stat">
            <strong>Average Lifespan:</strong>{" "}
            {stats.avg ? stats.avg.toFixed(1) : "—"} years
          </div>
          <div className="stat">
            <strong>Median Lifespan:</strong>{" "}
            {stats.median ? stats.median.toFixed(1) : "—"} years
          </div>
        </div>
        
        <BreedCharts breeds={filteredResults} />

        <div className="list-area">
          {loading ? (
            <p>Loading breeds…</p>
          ) : filteredResults.length > 0 ? (
            <ul className="cat-list">
              {filteredResults.map((cat) => (
                <li key={cat.id}>
                  <CatInfo
                    id={cat.id}
                    name={cat.name}
                    origin={cat.origin}
                    temperament={cat.temperament}
                    image={cat.image?.url}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p>No matching breeds found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
