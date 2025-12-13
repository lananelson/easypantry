import { useState, useEffect } from "react";
import Pantry from "./components/Pantry.js";
import ShoppingLists from "./components/ShoppingLists.js";
import MealPlans from "./components/MealPlans.js";
import RecipeView from "./components/RecipeView.js";
import { loadAppState, updateAppState } from "./utils/appState.js";

type Section = "pantry" | "shopping" | "meals";

type Route = { kind: "main" } | { kind: "recipe"; path: string };

function getRouteFromHash(): Route {
  const hash = window.location.hash || "";
  const prefix = "#/recipe/";
  if (hash.startsWith(prefix)) {
    const path = decodeURIComponent(hash.slice(prefix.length));
    return { kind: "recipe", path };
  }
  return { kind: "main" };
}

function App() {
  const [activeSection, setActiveSection] = useState<Section>(() => {
    const state = loadAppState();
    return state.nav?.active || "pantry";
  });
  const [route, setRoute] = useState<Route>(() => getRouteFromHash());
  const isRecipeRoute = route.kind === "recipe";

  useEffect(() => {
    updateAppState({ nav: { active: activeSection } });
  }, [activeSection]);

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(getRouteFromHash());
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return (
    <div className="page">
      {/* Navigation */}
      {!isRecipeRoute && (
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
      )}

      {/* Page Content */}
      <div className="page-wrapper">
        <div className="page-body">
          <div className="container-xl">
            {route.kind === "recipe" ? (
              <RecipeView path={route.path} />
            ) : (
              <>
                {activeSection === "pantry" && <Pantry />}
                {activeSection === "meals" && <MealPlans />}
                {activeSection === "shopping" && <ShoppingLists />}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
