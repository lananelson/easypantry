import { useState, useEffect } from "react";
import Pantry from "./components/Pantry.js";
import ShoppingLists from "./components/ShoppingLists.js";
import { loadAppState, updateAppState } from "./utils/appState.js";

type Section = "pantry" | "shopping" | "meals";

function App() {
  const [activeSection, setActiveSection] = useState<Section>(() => {
    const state = loadAppState();
    return state.nav?.active || "pantry";
  });

  useEffect(() => {
    updateAppState({ nav: { active: activeSection } });
  }, [activeSection]);

  return (
    <div className="page">
      {/* Navigation */}
      <header className="navbar navbar-expand-md d-print-none">
        <div className="container-xl">
          {/* BEGIN NAVBAR TOGGLER */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbar-menu"
            aria-controls="navbar-menu"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          {/* END NAVBAR TOGGLER */}

          {/* BEGIN NAVBAR MENU */}
          <div className="collapse navbar-collapse" id="navbar-menu">
            <div className="d-flex flex-column flex-md-row flex-fill align-items-stretch align-items-md-center">
              <ul className="navbar-nav">
                <li
                  className={`nav-item ${
                    activeSection === "pantry" ? "active" : ""
                  }`}
                >
                  <a
                    className="nav-link"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveSection("pantry");
                    }}
                  >
                    <span className="nav-link-title">Pantry</span>
                  </a>
                </li>
                <li
                  className={`nav-item ${
                    activeSection === "meals" ? "active" : ""
                  }`}
                >
                  <a
                    className="nav-link"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveSection("meals");
                    }}
                  >
                    <span className="nav-link-title">Meal Plans</span>
                  </a>
                </li>
                <li
                  className={`nav-item ${
                    activeSection === "shopping" ? "active" : ""
                  }`}
                >
                  <a
                    className="nav-link"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveSection("shopping");
                    }}
                  >
                    <span className="nav-link-title">Shopping Lists</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          {/* END NAVBAR MENU */}
        </div>
      </header>

      {/* Page Content */}
      <div className="page-wrapper">
        <div className="page-body">
          <div className="container-xl">
            {activeSection === "pantry" && <Pantry />}
            {activeSection === "shopping" && <ShoppingLists />}
            {activeSection === "meals" && (
              <div className="card">
                <div className="card-body">
                  <h2>Meal Plans</h2>
                  <p>Coming soon...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
