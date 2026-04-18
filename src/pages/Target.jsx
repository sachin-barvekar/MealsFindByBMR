import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import RecipeCard from "../components/RecipeCard";

const Target = () => {
  const [calories, setCalories] = useState('');
  const [meals, setMeals] = useState([]);

  const handleCaloriesChange = (e) => {
    setCalories(e.target.value);
  };

  const fetchMeals = async () => {
    try {
      const response = await axios.get(
        `https://api.spoonacular.com/recipes/findByNutrients?apiKey=2f570a74f5234f65a8633fcbd019c909&maxCalories=${calories}`
      );
      setMeals(response.data);
    } catch (error) {
      console.error('Error fetching meals:', error);
    }
  };

  return (
      <>
      <Navbar />
      <div className="container mt-5">
    
      {/* <Sidebar></Sidebar> */}
        <div className="card p-4">
          <h1 className="card-title h3">Meal Finder</h1>
          <div className="mb-3">
            <label className="form-label">Enter maximum calories:</label>
            <input
              type="number"
              value={calories}
              onChange={handleCaloriesChange}
              className="form-control w-25"
            />
          </div>
          <button
            onClick={fetchMeals}
            className="btn btn-success"
            style={{width: '150px'}}
          >
            Find Meals
          </button>
        </div>
        
  </div>
  <br />
  <br />
  <br />
  <br />
        <section id="popular-recipe">
                <div className="container">
                    <h3 className="popular-recipe-title">The Meals are: </h3>
                    <div className="row">
                        {meals.map((meal) => (
                            <RecipeCard
                            image={meal.image}
                            id={meal.id}
                            title={meal.title}
                            calories= {meal.calories}
                            />
                        ))}
                    </div>
                </div>
            </section>

    <Footer />
    </>
  );
};

export default Target;
