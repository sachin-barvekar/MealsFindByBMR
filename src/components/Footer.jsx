import React from "react";
import { Link } from "react-router-dom";
import "../styles/Layout.css";

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="container footer-content">
        <div>
          <h2>Eat Better, Feel Better.</h2>
          <p>
            Build your meal routine with calorie-smart recipes, BMR insights, and practical planning tools that keep
            you consistent every day.
          </p>
        </div>

        <div className="footer-links">
          <Link to="/">Explore Recipes</Link>
          <Link to="/bmr">Calculate BMR</Link>
          <Link to="/target">Find by Calories</Link>
        </div>
      </div>
      <p className="footer-note">© {new Date().getFullYear()} MealsFindByBMR · Crafted for healthier choices.</p>
    </footer>
  );
}
