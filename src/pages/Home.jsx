import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import RecipeCard from "../components/RecipeCard";
import axios from "axios";

const FAVORITES_STORAGE_KEY = "favoriteRecipes";

export default function Home() {
  const [recipeList, setRecipeList] = React.useState([]);
  const [keyword, setKeyword] = useState("");
  const [sortOrder, setSortOrder] = useState("default");
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [calories, setCalories] = useState("");
  const [meals, setMeals] = useState([]);
  const [mealError, setMealError] = useState("");
  const [isLoadingMeals, setIsLoadingMeals] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    const fromStorage = localStorage.getItem(FAVORITES_STORAGE_KEY);
    return fromStorage ? JSON.parse(fromStorage) : [];
  });

  React.useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}recipe?limit=12&page=1`)
      .then((response) => {
        const recipeData = response?.data?.data?.slice(1) || [];
        setRecipeList(recipeData);
      })
      .catch(() => {
        setRecipeList([]);
      });
  }, []);

  React.useEffect(() => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const handleToggleFavorite = (recipeId) => {
    setFavorites((previous) =>
      previous.includes(recipeId) ? previous.filter((item) => item !== recipeId) : [...previous, recipeId]
    );
  };

  const filteredRecipes = useMemo(() => {
    let nextList = [...recipeList];

    if (keyword.trim()) {
      const normalized = keyword.toLowerCase();
      nextList = nextList.filter((item) => item?.title?.toLowerCase().includes(normalized));
    }

    if (showOnlyFavorites) {
      nextList = nextList.filter((item) => favorites.includes(item.id));
    }

    if (sortOrder === "az") {
      nextList.sort((a, b) => a?.title?.localeCompare(b?.title));
    }

    if (sortOrder === "za") {
      nextList.sort((a, b) => b?.title?.localeCompare(a?.title));
    }

    return nextList;
  }, [favorites, keyword, recipeList, showOnlyFavorites, sortOrder]);

  const fetchMeals = async () => {
    if (!calories) {
      setMealError("Please fill in your calorie target first.");
      setMeals([]);
      return;
    }

    try {
      setIsLoadingMeals(true);
      setMealError("");
      const response = await axios.get(
        `https://api.spoonacular.com/recipes/findByNutrients?apiKey=2f570a74f5234f65a8633fcbd019c909&maxCalories=${calories}&number=6`
      );
      setMeals(response.data || []);
    } catch (error) {
      setMeals([]);
      setMealError("Meal recommendations are unavailable right now. Please try again in a moment.");
    } finally {
      setIsLoadingMeals(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="bg-yellow" style={{ zIndex: -1 }} />

      <div className="container hero display-4">
        <div className="row align-item-center flex-column-reverse gap-5 flex-lg-row py-5" style={{ minHeight: "80vh" }}>
          <div className="hero-col col-md-7 col-xs-12 order-2 order-md-1 hero-left mb-5">
            <Link className="hero-nav" to="/bmr">
              First, calculate your BMR here →
            </Link>
            <p className="hero-text">
              Discover Recipe <br />
              &amp; Delicious Food
            </p>
            <p className="hero-subtitle">Search recipes faster, bookmark favorites, and get quick meal ideas by calories.</p>

            <div className="calorie-search-wrap mt-4">
              <label htmlFor="calorieTarget" className="form-label mb-2 small text-muted fw-bold">
                Daily calorie target
              </label>
              <div className="d-flex gap-2 flex-wrap">
                <input
                  id="calorieTarget"
                  className="form-control"
                  type="number"
                  min="0"
                  placeholder="e.g. 500"
                  value={calories}
                  onChange={(event) => setCalories(event.target.value)}
                />
                <button onClick={fetchMeals} className="btn btn-success px-4" disabled={isLoadingMeals}>
                  {isLoadingMeals ? "Loading..." : "Find Meals"}
                </button>
              </div>
              {mealError ? <p className="text-danger mt-2 mb-0">{mealError}</p> : null}
            </div>
          </div>

          <div className="col-md-auto" />
          <div className="col-md-5 hero">
            <img src="/images/hero.png" alt="Hero" />
          </div>
        </div>
      </div>

      <section className="main-section-recipe">
        <div className="container position-relative">
          <div className="row mb-5">
            <div className="col-md-3 popular-recipe-text-box">
              <h3>New Recipe</h3>
            </div>
          </div>
          <div className="row align-items-center">
            <div className="col-md-6">
              <div className="new-recipe-box" />
              <img src="/images/new-recipe.png" alt="New Recipe" />
            </div>
            <div className="col-md-5 justify-content-between">
              <h4>Crispy Chicken Burger</h4>
              <hr style={{ width: "10vh" }} />
              <p>
                Indulge in the ultimate savory delight - a succulent, crispy chicken patty served with gourmet
                toppings, all tucked into a perfectly toasted burger bun.
              </p>
              <Link className="text-decoration-none" to="/detail/crispy-chicken-burger">
                <button className="btn">Learn More</button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="popular-recipe">
        <div className="container">
          <div className="recipe-header-row">
            <h3 className="popular-recipe-title mb-0">Popular Recipe</h3>
            <div className="recipe-toolbar">
              <input
                type="text"
                placeholder="Search recipes"
                className="form-control"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
              />
              <select className="form-select" value={sortOrder} onChange={(event) => setSortOrder(event.target.value)}>
                <option value="default">Sort: Default</option>
                <option value="az">Sort: A - Z</option>
                <option value="za">Sort: Z - A</option>
              </select>
              <button
                className={`btn ${showOnlyFavorites ? "btn-success" : "btn-outline-success"}`}
                onClick={() => setShowOnlyFavorites((current) => !current)}
              >
                {showOnlyFavorites ? "Showing Favorites" : "Favorites Only"}
              </button>
            </div>
          </div>

          <p className="recipe-counter">Showing {filteredRecipes.length} recipes</p>

          <div className="row">
            {filteredRecipes.map((item) => (
              <RecipeCard
                key={item?.id}
                title={item?.title}
                image={item?.recipe_picture}
                id={item?.id}
                isFavorite={favorites.includes(item?.id)}
                onToggleFavorite={() => handleToggleFavorite(item?.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {meals.length > 0 ? (
        <section className="recommended-meals-section">
          <div className="container">
            <h3 className="popular-recipe-title">Meals under {calories} calories</h3>
            <div className="row mt-4">
              {meals.map((meal) => (
                <div className="col-lg-4 col-md-6 mb-3" key={meal.id}>
                  <div className="meal-card h-100">
                    <img src={meal.image} alt={meal.title} className="meal-image" />
                    <div className="p-3">
                      <h5>{meal.title}</h5>
                      <p className="mb-1">Calories: {Math.round(meal.calories || 0)}</p>
                      <p className="mb-1">Protein: {Math.round(meal.protein || 0)}g</p>
                      <p className="mb-0">Fat: {Math.round(meal.fat || 0)}g</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <Footer />
    </>
  );
}
