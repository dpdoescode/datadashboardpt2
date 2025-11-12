import { Link } from "react-router-dom";

const CatInfo = ({ id, name, origin, temperament, image }) => {
  return (
    <div className="cat-card">
      <Link to={`/catDetails/${id}`} className="card-link">
        <div className="img-wrap">
          {image ? (
            <img className="cat-img" src={image} alt={`${name} thumbnail`} />
          ) : (
            <div className="placeholder">No Image</div>
          )}
        </div>

        <div className="card-body">
          <h3>{name}</h3>
          <p>
            <strong>Origin:</strong> {origin || "Unknown"}
          </p>
          <p className="temperament">
            <strong>Temperament:</strong>{" "}
            {temperament ? temperament.slice(0, 120) + (temperament.length>120 ? "…" : "") : "N/A"}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default CatInfo;
