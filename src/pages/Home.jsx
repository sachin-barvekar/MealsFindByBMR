import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import RecipeCard from "../components/RecipeCard";
import "../styles/Home.css";

const FAVORITES_STORAGE_KEY = "favoriteRecipes";
const PLAN_STORAGE_KEY = "weeklyMealPlan";

const fallbackRecipes = [
  { id: 1, title: "Avocado Toast Bowl", recipe_picture: "/images/banana-pancake.png", calories: 350 },
  { id: 2, title: "Smoky Chicken Wrap", recipe_picture: "/images/bomb-chicken.png", calories: 430 },
  { id: 3, title: "Teriyaki Salmon", recipe_picture: "/images/sugarSalmon.webp", calories: 520 },
  { id: 4, title: "Lava Coffee Cake", recipe_picture: "/images/coffe-lava-cake.png", calories: 290 },
  { id: 5, title: "Banana Protein Shake", recipe_picture: "/images/banana-smothie-pop.png", calories: 250 },
  { id: 6, title: "Crispy Chicken Burger", recipe_picture: "/images/new-recipe.png", calories: 580 },
];

const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function Home() {
  const [recipeList, setRecipeList] = React.useState([]);
  const [keyword, setKeyword] = useState("");
  const [sortOrder, setSortOrder] = useState("default");
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [maxCaloriesFilter, setMaxCaloriesFilter] = useState("");
  const [calories, setCalories] = useState("");
  const [meals, setMeals] = useState([]);
  const [mealError, setMealError] = useState("");
  const [isLoadingMeals, setIsLoadingMeals] = useState(false);
  const [insight, setInsight] = useState("");
  const [favorites, setFavorites] = useState(() => {
    const fromStorage = localStorage.getItem(FAVORITES_STORAGE_KEY);
    return fromStorage ? JSON.parse(fromStorage) : [];
  });
  const [weeklyPlan, setWeeklyPlan] = useState(() => {
    const fromStorage = localStorage.getItem(PLAN_STORAGE_KEY);
    return fromStorage ? JSON.parse(fromStorage) : {};
  });

  React.useEffect(() => {
    const requestUrl = `${process.env.REACT_APP_BASE_URL || ""}recipe?limit=12&page=1`;
    axios
      .get(requestUrl)
      .then((response) => {
        const recipeData = response?.data?.data?.length ? response.data.data : fallbackRecipes;
        setRecipeList(recipeData);
      })
      .catch(() => {
        setRecipeList(fallbackRecipes);
      });
  }, []);

  React.useEffect(() => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  React.useEffect(() => {
    localStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify(weeklyPlan));
  }, [weeklyPlan]);

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

    if (maxCaloriesFilter) {
      nextList = nextList.filter((item) => Number(item?.calories || 0) <= Number(maxCaloriesFilter));
    }

    if (sortOrder === "az") {
      nextList.sort((a, b) => a?.title?.localeCompare(b?.title));
    }

    if (sortOrder === "za") {
      nextList.sort((a, b) => b?.title?.localeCompare(a?.title));
    }

    return nextList;
  }, [favorites, keyword, maxCaloriesFilter, recipeList, showOnlyFavorites, sortOrder]);

  const fetchMeals = async () => {
    if (!calories) {
      setMealError("Please fill in your calorie target first.");
      setMeals([]);
      return;
    }

    try {
      setIsLoadingMeals(true);
      setMealError("");
      setInsight("");

      const response = await axios.get(
        `https://api.spoonacular.com/recipes/findByNutrients?apiKey=2f570a74f5234f65a8633fcbd019c909&maxCalories=${calories}&number=9`
      );

      const recommendations = response.data || [];
      setMeals(recommendations);

      if (recommendations.length) {
        const averageCalories =
          recommendations.reduce((total, meal) => total + Number(meal.calories || 0), 0) / recommendations.length;
        setInsight(
          `Great pick! These ${recommendations.length} meals average ${Math.round(
            averageCalories
          )} kcal, which can help keep your daily intake within target.`
        );
      }
    } catch (error) {
      setMeals([]);
      setInsight("");
      setMealError("Meal recommendations are unavailable right now. Please try again in a moment.");
    } finally {
      setIsLoadingMeals(false);
    }
  };

  const handleAddToWeeklyPlan = (meal) => {
    const firstAvailableDay = weekdays.find((day) => !weeklyPlan[day]) || weekdays[0];
    setWeeklyPlan((current) => ({ ...current, [firstAvailableDay]: meal }));
  };

  const clearWeeklyPlan = () => {
    setWeeklyPlan({});
  };

  const dashboardStats = useMemo(
    () => [
      { label: "Total recipes", value: recipeList.length },
      { label: "Favorites saved", value: favorites.length },
      { label: "Meals recommended", value: meals.length },
      { label: "Planned days", value: Object.keys(weeklyPlan).length },
    ],
    [favorites.length, meals.length, recipeList.length, weeklyPlan]
  );

  return (
    <>
      <Navbar />

      <main className="home-page">
        <section className="hero-panel container">
          <div className="hero-copy">
            <p className="hero-badge">Smart food planning platform</p>
            <h1>Transform your meals with a cleaner, smarter, and personalized experience.</h1>
            <p>
              Search healthier recipes, track your favorites, calculate BMR, and build weekly meal plans from one
              dashboard.
            </p>
            <div className="hero-actions">
              <Link className="btn btn-success px-4" to="/bmr">
                Calculate BMR
              </Link>
              <a className="btn btn-outline-success px-4" href="#recipe-explorer">
                Explore Recipes
              </a>
            </div>
          </div>

          <div className="hero-visual">
            <img src="/images/hero.avif" alt="Healthy prepared meals" />
          </div>
        </section>

        <section className="container stats-grid">
          {dashboardStats.map((stat) => (
            <article key={stat.label} className="stat-card">
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </article>
          ))}
        </section>

        <section className="container calorie-finder-panel">
          <div>
            <h2>Get meal ideas by calories</h2>
            <p>Enter your target calories and get high-quality meal recommendations with macro details.</p>
          </div>
          <div className="finder-controls">
            <input
              id="calorieTarget"
              className="form-control"
              type="number"
              min="0"
              placeholder="e.g. 550"
              value={calories}
              onChange={(event) => setCalories(event.target.value)}
            />
            <button onClick={fetchMeals} className="btn btn-success px-4" disabled={isLoadingMeals}>
              {isLoadingMeals ? "Loading..." : "Find Meals"}
            </button>
          </div>
          {mealError ? <p className="text-danger mb-0">{mealError}</p> : null}
          {insight ? <p className="text-success mb-0">{insight}</p> : null}
        </section>

        <section id="recipe-explorer" className="container recipe-explorer-section">
          <div className="recipe-header-row">
            <h2>Recipe Explorer</h2>
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
              <input
                type="number"
                className="form-control"
                placeholder="Max calories"
                value={maxCaloriesFilter}
                onChange={(event) => setMaxCaloriesFilter(event.target.value)}
              />
              <button
                className={`btn ${showOnlyFavorites ? "btn-success" : "btn-outline-success"}`}
                onClick={() => setShowOnlyFavorites((current) => !current)}
              >
                {showOnlyFavorites ? "Favorites On" : "Favorites Only"}
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
                calories={item?.calories}
                id={item?.id}
                isFavorite={favorites.includes(item?.id)}
                onToggleFavorite={() => handleToggleFavorite(item?.id)}
                onAddToPlan={handleAddToWeeklyPlan}
              />
            ))}
          </div>
        </section>

        {meals.length > 0 ? (
          <section className="container mt-4">
            <div className="recipe-header-row">
              <h2>Recommended meals under {calories} calories</h2>
            </div>
            <div className="row mt-3">
              {meals.map((meal) => (
                <div className="col-xl-4 col-md-6 mb-4" key={meal.id}>
                  <article className="meal-card h-100">
                    <img src={meal.image} alt={meal.title} className="meal-image" />
                    <div className="p-3 d-flex flex-column gap-2">
                      <h5>{meal.title}</h5>
                      <div className="macro-grid">
                        <span>Calories: {Math.round(meal.calories || 0)}</span>
                        <span>Protein: {Math.round(meal.protein || 0)}g</span>
                        <span>Fat: {Math.round(meal.fat || 0)}g</span>
                        <span>Carbs: {Math.round(meal.carbs || 0)}g</span>
                      </div>
                      <button className="btn btn-outline-success btn-sm" onClick={() => handleAddToWeeklyPlan(meal)}>
                        Add to weekly plan
                      </button>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <section className="container weekly-plan-section">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <h2>Your weekly meal plan</h2>
            <button className="btn btn-outline-danger btn-sm" onClick={clearWeeklyPlan}>
              Clear plan
            </button>
          </div>
          <div className="weekly-grid">
            {weekdays.map((day) => {
              const item = weeklyPlan[day];
              return (
                <article key={day} className="day-card">
                  <h4>{day}</h4>
                  {item ? (
                    <>
                      <p className="fw-semibold mb-1">{item.title}</p>
                      <p className="mb-0 text-muted">{item.calories ? `${Math.round(item.calories)} kcal` : "Flexible calories"}</p>
                    </>
                  ) : (
                    <p className="text-muted mb-0">No meal planned yet.</p>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
