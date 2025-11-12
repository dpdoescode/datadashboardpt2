import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#a4de6c", "#d0ed57"];

const BreedCharts = ({ breeds }) => {
  // Bar chart: average lifespan by breed (top 10)
  const lifespanData = breeds
    .map(b => {
      const nums = b.life_span
        ?.split("-")
        .map(s => s.replace(/[^\d.]/g, "").trim())
        .filter(Boolean)
        .map(Number);
      if (!nums || nums.length === 0) return null;
      const avg = nums.length === 1 ? nums[0] : (nums[0] + nums[1]) / 2;
      return { name: b.name, lifespan: avg };
    })
    .filter(Boolean)
    .sort((a, b) => b.lifespan - a.lifespan)
    .slice(0, 10);

  // Pie chart: number of breeds by origin
  const originCounts = {};
  breeds.forEach(b => {
    const key = b.origin || "Unknown";
    originCounts[key] = (originCounts[key] || 0) + 1;
  });
  const originData = Object.entries(originCounts).map(([name, value]) => ({ name, value }));

  return (
    <div className="charts-container">
      <h2>🐾 Top 10 Breeds by Average Lifespan</h2>
      <BarChart width={600} height={300} data={lifespanData}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="lifespan" fill="#8884d8" />
      </BarChart>

      <h2>🌍 Breeds by Origin</h2>
      <PieChart width={400} height={400}>
        <Pie
          data={originData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={120}
          label
        >
          {originData.map((entry, index) => (
            <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};

export default BreedCharts;
