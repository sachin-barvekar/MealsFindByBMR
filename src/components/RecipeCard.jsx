import React from "react";
import { Link } from "react-router-dom";

export default function RecipeCard(props) {
  const { title, image, calories, id, isFavorite = false, onToggleFavorite } = props;

  return (
    <div className="col-lg-4 col-md-6 col-xs-12 mb-4">
      <article className="recipe-card h-100">
        <button
          type="button"
          className={`favorite-btn ${isFavorite ? "favorite-btn-active" : ""}`}
          onClick={(event) => {
            event.preventDefault();
            if (onToggleFavorite) {
              onToggleFavorite();
            }
          }}
          aria-label={isFavorite ? `Remove ${title} from favorites` : `Add ${title} to favorites`}
          title={isFavorite ? "Remove from favorites" : "Save as favorite"}
        >
          {isFavorite ? "★" : "☆"}
        </button>

        <Link className="text-decoration-none" to={`/detail/${title?.toLowerCase()?.split(" ").join("-")}`}>
          <div className="popular-recipe-image" style={{ backgroundImage: `url('${image}')` }}>
            <h3 style={{ textShadow: "0px 0px 2px rgba(0, 0, 0, 0.8)" }}>{title}</h3>
          </div>
          <div className="recipe-meta">
            <span>Recipe ID: {id || "-"}</span>
            <span>Calories: {calories || "N/A"}</span>
          </div>
        </Link>
      </article>
    </div>
  );
}
