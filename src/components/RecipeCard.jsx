import React from "react";
import { Link } from "react-router-dom";

export default function RecipeCard(props) {
  const { title, image, calories, id, isFavorite = false, onToggleFavorite, onAddToPlan } = props;

  return (
    <div className="col-xl-4 col-md-6 mb-4">
      <article className="recipe-card h-100">
        <button
          type="button"
          className={`favorite-btn ${isFavorite ? "favorite-btn-active" : ""}`}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            if (onToggleFavorite) {
              onToggleFavorite();
            }
          }}
          aria-label={isFavorite ? `Remove ${title} from favorites` : `Add ${title} to favorites`}
          title={isFavorite ? "Remove from favorites" : "Save as favorite"}
        >
          {isFavorite ? "★" : "☆"}
        </button>

        <Link className="text-decoration-none d-flex flex-column h-100" to={`/detail/${title?.toLowerCase()?.split(" ").join("-")}`}>
          <div className="popular-recipe-image" style={{ backgroundImage: `url('${image}')` }}>
            <span className="recipe-chip">Recipe #{id || "-"}</span>
          </div>

          <div className="recipe-meta">
            <h4>{title}</h4>
            <p>{calories ? `${Math.round(calories)} kcal` : "Calories unavailable"}</p>
            {onAddToPlan ? (
              <button
                className="btn btn-sm btn-outline-success"
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  onAddToPlan({ id, title, calories, image });
                }}
              >
                Add to weekly plan
              </button>
            ) : null}
          </div>
        </Link>
      </article>
    </div>
  );
}
