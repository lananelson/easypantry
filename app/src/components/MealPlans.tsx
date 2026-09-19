import { useEffect, useState } from "react";
import type { MealPlan, MealPlanRecipe } from "../types.js";
import { loadMealPlans } from "../utils/dataLoader.js";

export default function MealPlans() {
  const [plans, setPlans] = useState<MealPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMealPlans()
      .then((data) => {
        // Sort meal plans in reverse chronological order (newest first)
        // Week ids look like "2026-W9"; compare numerically so W39 sorts after W9.
        const sorted = [...data].sort((a, b) =>
          b.week.localeCompare(a.week, undefined, { numeric: true })
        );
        setPlans(sorted);
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
                        /^\[([^\]]+)\]\(([^)]+)\)/,
                      );
                      const label = linkMatch ? linkMatch[1] : mealText;
                      const recipeForMeal = plan.recipes.find(
                        (recipe) => recipe.name === label,
                      );
                      const href = recipeForMeal?.path
                        ? `#/recipe/${recipeForMeal.path}`
                        : undefined;

                      return (
                        <li key={index}>
                          {href ? (
                            <a href={href}>{label}</a>
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
                  <div className="d-flex flex-column gap-2">
                    {plan.recipes.map((recipe, index) => (
                      <PlannedDish key={index} dish={recipe} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

const STATUS_BADGE: Record<NonNullable<MealPlanRecipe["status"]>, string> = {
  planned: "bg-blue-lt",
  made: "bg-green-lt",
  skipped: "bg-secondary-lt",
};

function IngredientLine({ text }: { text: string }) {
  const needToBuy = /\(need to buy\)/i.test(text);
  const have = text.includes("✓");
  return (
    <li className={needToBuy ? "text-orange" : have ? "" : "text-muted"}>
      {text}
    </li>
  );
}

function PlannedDish({ dish }: { dish: MealPlanRecipe }) {
  const skipped = dish.status === "skipped";
  const hasDetails =
    dish.ingredients.length > 0 ||
    dish.variations.length > 0 ||
    dish.inspiredBy.length > 0;

  return (
    <div className={`planned-dish ${skipped ? "planned-dish-skipped" : ""}`}>
      <div className="d-flex align-items-start gap-2">
        <div className="flex-fill">
          {dish.path ? (
            <a href={`#/recipe/${dish.path}`} className="planned-dish-name">
              {dish.name}
            </a>
          ) : (
            <span className="planned-dish-name">{dish.name}</span>
          )}
          {dish.statusNote && (
            <div className="small text-muted fst-italic">{dish.statusNote}</div>
          )}
        </div>
        {dish.status && (
          <span className={`badge ${STATUS_BADGE[dish.status]}`}>
            {dish.status}
          </span>
        )}
      </div>

      {hasDetails && (
        <details className="mt-1">
          <summary className="small text-muted">
            ingredients
            {dish.variations.length > 0 &&
              ` · ${dish.variations.length} variation${
                dish.variations.length > 1 ? "s" : ""
              }`}
          </summary>
          {dish.inspiredBy.length > 0 && (
            <div className="small text-muted mt-1">
              Inspired by:
              <ul className="mb-2 ps-3">
                {dish.inspiredBy.map((link, i) => (
                  <li key={i}>
                    {link.path ? (
                      <a href={`#/recipe/${link.path}`}>{link.name}</a>
                    ) : (
                      link.name
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {dish.ingredients.length > 0 && (
            <ul className="small mb-2 mt-1 ps-3">
              {dish.ingredients.map((item, i) => (
                <IngredientLine key={i} text={item} />
              ))}
            </ul>
          )}
          {dish.variations.map((variation, vi) => (
            <div key={vi} className="mb-2">
              <div className="small fw-bold">{variation.name}</div>
              <ul className="small mb-0 ps-3">
                {variation.ingredients.map((item, i) => (
                  <IngredientLine key={i} text={item} />
                ))}
              </ul>
            </div>
          ))}
        </details>
      )}
    </div>
  );
}
