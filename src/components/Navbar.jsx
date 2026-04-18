import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/Layout.css";

const THEME_STORAGE_KEY = "mf_theme";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/bmr", label: "BMR Calculator" },
  { to: "/target", label: "Meal Target" },
  { to: "/news", label: "Food News" },
  { to: "/profile", label: "Profile" },
];

export default function Navbar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_STORAGE_KEY) || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const isLoggedIn = Boolean(localStorage.getItem("auth") || localStorage.getItem("token"));

  return (
    <header className="app-header sticky-top">
      <nav className="container navbar-shell" aria-label="Main navigation">
        <Link className="brand" to="/">
          <span className="brand-mark">🍽️</span>
          MealsFindByBMR
        </Link>

        <button
          type="button"
          className="mobile-menu-toggle"
          onClick={() => setMenuOpen((current) => !current)}
          aria-expanded={menuOpen}
          aria-label="Toggle menu"
        >
          ☰
        </button>

        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          {navItems.map((item) => (
            <Link
              key={item.to}
              className={`nav-link ${location.pathname === item.to ? "active" : ""}`}
              to={item.to}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}

          <button
            type="button"
            className="theme-switch"
            onClick={() => setTheme((current) => (current === "light" ? "dark" : "light"))}
            aria-label="Toggle light or dark mode"
          >
            {theme === "light" ? "🌙 Dark" : "☀️ Light"}
          </button>

          {isLoggedIn ? (
            <Link
              className="auth-link"
              to="/login"
              onClick={() => {
                localStorage.removeItem("auth");
                localStorage.removeItem("token");
              }}
            >
              Logout
            </Link>
          ) : (
            <Link className="auth-link" to="/login">
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
