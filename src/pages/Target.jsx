import React, { useMemo, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import RecipeCard from "../components/RecipeCard";
import "../styles/Tools.css";

const Target = () => {
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [meals, setMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchMeals = async () => {
    if (!calories) {
      setError("Please enter at least your max calories.");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const response = await axios.get(
        `https://api.spoonacular.com/recipes/findByNutrients?apiKey=2f570a74f5234f65a8633fcbd019c909&maxCalories=${calories}&minProtein=${protein || 0}&maxCarbs=${carbs || 1000}&number=12`
      );

      setMeals(response.data || []);
    } catch (err) {
      setMeals([]);
      setError("We could not fetch meals right now. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const summary = useMemo(() => {
    if (!meals.length) return null;

    const totals = meals.reduce(
      (acc, meal) => {
        acc.calories += Number(meal.calories || 0);
        acc.protein += Number(meal.protein || 0);
        acc.carbs += Number(meal.carbs || 0);
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0 }
    );

    return {
      avgCalories: Math.round(totals.calories / meals.length),
      avgProtein: Math.round(totals.protein / meals.length),
      avgCarbs: Math.round(totals.carbs / meals.length),
    };
  }, [meals]);

  return (
    <>
      <Navbar />
      <main className="tool-page">
        <section className="container">
          <article className="tool-card">
            <h1 className="h2">Meal Target Finder</h1>
            <p>Filter meals by calories and macros to match your nutrition goals with better precision.</p>

            <div className="row g-3 align-items-end">
              <div className="col-md-4">
                <label className="form-label">Max Calories</label>
                <input type="number" value={calories} onChange={(e) => setCalories(e.target.value)} className="form-control" />
              </div>

              <div className="col-md-4">
                <label className="form-label">Min Protein (g)</label>
                <input type="number" value={protein} onChange={(e) => setProtein(e.target.value)} className="form-control" />
              </div>

              <div className="col-md-4">
                <label className="form-label">Max Carbs (g)</label>
                <input type="number" value={carbs} onChange={(e) => setCarbs(e.target.value)} className="form-control" />
              </div>
            </div>

            <button onClick={fetchMeals} className="btn btn-success mt-3" disabled={isLoading}>
              {isLoading ? "Finding meals..." : "Find Meals"}
            </button>
            {error ? <p className="text-danger mt-2 mb-0">{error}</p> : null}

            {summary ? (
              <div className="metrics-grid mt-4">
                <div className="metric">
                  <h4>{summary.avgCalories}</h4>
                  <p>Average calories</p>
                </div>
                <div className="metric">
                  <h4>{summary.avgProtein} g</h4>
                  <p>Average protein</p>
                </div>
                <div className="metric">
                  <h4>{summary.avgCarbs} g</h4>
                  <p>Average carbs</p>
                </div>
              </div>
            ) : null}
          </article>

          <section className="mt-4">
            <div className="row">
              {meals.map((meal) => (
                <RecipeCard key={meal.id} image={meal.image} id={meal.id} title={meal.title} calories={meal.calories} />
              ))}
            </div>
          </section>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Target;
