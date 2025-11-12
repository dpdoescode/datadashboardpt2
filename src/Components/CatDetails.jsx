import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const API_KEY = import.meta.env.VITE_APP_API_KEY;

function CatDetails() {
  const { id } = useParams();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchDetails = async () => {
      setLoading(true);
      const res = await fetch(`https://api.thecatapi.com/v1/breeds/${id}`, {
        headers: API_KEY ? { "x-api-key": API_KEY } : {},
      });
      const json = await res.json();
      setDetails(json);
      setLoading(false);
    };

    fetchDetails().catch((err) => {
      console.error("Details fetch error:", err);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <p>Loading details…</p>;
  if (!details) return <p>No details available.</p>;

  return (
    <div className="cat-details">
      <h1>{details.name}</h1>
      {details.image?.url ? (
        <img className="details-img" src={details.image.url} alt={details.name} />
      ) : (
        <div className="details-noimg">No image available</div>
      )}
      <div className="details-grid">
        <div>
          <strong>Origin:</strong> {details.origin}
        </div>
        <div>
          <strong>Temperament:</strong> {details.temperament}
        </div>
        <div>
          <strong>Life span:</strong> {details.life_span} years
        </div>
        <div>
          <strong>Weight:</strong> {details.weight?.metric} kg (metric)
        </div>
        <div className="full-description">
          <strong>Description:</strong>
          <p>{details.description}</p>
        </div>
        {details.wikipedia_url && (
          <div>
            <a href={details.wikipedia_url} target="_blank" rel="noreferrer">
              Read more on Wikipedia
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default CatDetails;
