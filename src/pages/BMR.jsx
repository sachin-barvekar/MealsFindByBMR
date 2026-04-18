import React, { useMemo, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import "../styles/Tools.css";

const activityFactors = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  athlete: 1.9,
};

function BMR() {
  const [gender, setGender] = useState("male");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [activity, setActivity] = useState("moderate");

  const bmr = useMemo(() => {
    if (!age || !weight || !height) return 0;

    if (gender === "male") {
      return 88.362 + 13.397 * Number(weight) + 4.799 * Number(height) - 5.677 * Number(age);
    }

    return 447.593 + 9.247 * Number(weight) + 3.098 * Number(height) - 4.33 * Number(age);
  }, [age, gender, height, weight]);

  const maintenanceCalories = useMemo(() => Math.round(bmr * activityFactors[activity]), [activity, bmr]);

  return (
    <>
      <Navbar />
      <main className="tool-page">
        <section className="container">
          <article className="tool-card">
            <h1 className="h2">Advanced BMR & Calorie Planner</h1>
            <p>
              Calculate your BMR, estimate maintenance calories, and get cutting/bulking targets instantly with an
              upgraded interface.
            </p>

            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Gender</label>
                <select value={gender} onChange={(e) => setGender(e.target.value)} className="form-select">
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label">Age (years)</label>
                <input type="number" value={age} onChange={(e) => setAge(e.target.value)} className="form-control" min="0" />
              </div>

              <div className="col-md-6">
                <label className="form-label">Weight (kg)</label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="form-control"
                  min="0"
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Height (cm)</label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="form-control"
                  min="0"
                />
              </div>

              <div className="col-12">
                <label className="form-label">Activity level</label>
                <select value={activity} onChange={(e) => setActivity(e.target.value)} className="form-select">
                  <option value="sedentary">Sedentary (desk job)</option>
                  <option value="light">Light activity (1-3 workouts/week)</option>
                  <option value="moderate">Moderate activity (3-5 workouts/week)</option>
                  <option value="active">Very active (6-7 workouts/week)</option>
                  <option value="athlete">Athlete / intense training</option>
                </select>
              </div>
            </div>

            <div className="metrics-grid">
              <div className="metric">
                <h4>{bmr ? `${Math.round(bmr)} kcal` : "-"}</h4>
                <p>Basal Metabolic Rate (BMR)</p>
              </div>
              <div className="metric">
                <h4>{bmr ? `${maintenanceCalories} kcal` : "-"}</h4>
                <p>Estimated maintenance calories</p>
              </div>
              <div className="metric">
                <h4>{bmr ? `${Math.max(maintenanceCalories - 450, 1200)} kcal` : "-"}</h4>
                <p>Suggested fat-loss target</p>
              </div>
            </div>

            <div className="mt-3">
              <h2 className="h5">Recommended calorie ranges</h2>
              <ul>
                <li>Lean cut: {bmr ? `${Math.max(maintenanceCalories - 500, 1200)} kcal/day` : "Fill inputs first"}</li>
                <li>Maintenance: {bmr ? `${maintenanceCalories} kcal/day` : "Fill inputs first"}</li>
                <li>Lean bulk: {bmr ? `${maintenanceCalories + 250} kcal/day` : "Fill inputs first"}</li>
              </ul>
            </div>
          </article>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default BMR;
