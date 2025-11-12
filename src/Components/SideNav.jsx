import { useEffect, useState } from "react";

function SideNav() {
  const [fact, setFact] = useState("");

  useEffect(() => {
    const fetchFact = async () => {
      try {
        const res = await fetch("https://catfact.ninja/fact");
        const json = await res.json();
        setFact(json.fact);
      } catch (err) {
        console.error("Cat fact error:", err);
        setFact("Cats purr at frequencies that can help heal bone and tissue.");
      }
    };
    fetchFact();
  }, []);

  return (
    <aside className="sidenav">
      <h3>🐱 Random Cat Fact</h3>
      <p>{fact}</p>
    </aside>
  );
}

export default SideNav;
