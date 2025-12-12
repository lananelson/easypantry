import { useEffect, useState } from "react";
import type { MealPlan } from "../types.js";
import { loadMealPlans } from "../utils/dataLoader.js";

export default function MealPlans() {
  const [plans, setPlans] = useState<MealPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMealPlans()
      .then((data) => {
        setPlans(data);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="card">
        <div className="card-body">
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="card-body">
          <div className="alert alert-danger">
            Error loading meal plans: {error}
          </div>
        </div>
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="card">
        <div className="card-body">
          <p className="text-muted mb-0">No meal plans found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="row row-cards">
      {plans.map((plan) => (
        <div className="col-md-6 col-lg-4" key={plan.id}>
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">{plan.title}</h3>
              <div className="ms-auto">
                <span className="badge bg-blue-lt">{plan.week}</span>
              </div>
            </div>
            <div className="card-body">
              {plan.dateRange && (
                <div className="text-muted mb-3">{plan.dateRange}</div>
              )}

              {plan.ideas.length > 0 && (
                <div className="mb-3">
                  <div className="text-muted text-uppercase small mb-1">
                    Ideas
                  </div>
                  <ul className="list-unstyled mb-0">
                    {plan.ideas.map((idea, index) => (
                      <li key={index}>{idea}</li>
                    ))}
                  </ul>
                </div>
              )}

              {plan.meals.length > 0 && (
                <div className="mb-3">
                  <div className="text-muted text-uppercase small mb-1">
                    Meals
                  </div>
                  <ul className="list-unstyled mb-0">
                    {plan.meals.map((mealText, index) => {
                      const linkMatch = mealText.match(
                        /^\[([^\]]+)\]\(([^)]+)\)/
                      );
                      const label = linkMatch ? linkMatch[1] : mealText;
                      const recipeForMeal = plan.recipes.find(
                        (recipe) => recipe.name === label
                      );
                      const href = recipeForMeal?.path
                        ? `#/recipe/${recipeForMeal.path}`
                        : undefined;

                      return (
                        <li key={index}>
                          {href ? (
                            <a
                              href={href}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {label}
                            </a>
                          ) : (
                            label
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {plan.recipes.length > 0 && (
                <div>
                  <div className="text-muted text-uppercase small mb-1">
                    Recipes
                  </div>
                  <ul className="list-unstyled mb-0">
                    {plan.recipes.map((recipe, index) => {
                      const href = recipe.path
                        ? `#/recipe/${recipe.path}`
                        : undefined;

                      return (
                        <li key={index}>
                          {href ? (
                            <a
                              href={href}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {recipe.name}
                            </a>
                          ) : (
                            recipe.name
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
