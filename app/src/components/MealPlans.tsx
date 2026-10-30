import { useEffect, useMemo, useState } from "react";
import type { MealPlan, RecipeSummary, ShoppingList } from "../types.js";
import {
  loadMealPlans,
  loadRecipeIndex,
  loadShoppingList,
  loadShoppingLists,
  recipePhotoUrl,
} from "../utils/dataLoader.js";
import { tintFor } from "./RecipeBrowser.js";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

type DishStatus = "planned" | "made" | "skipped" | "";

interface Dish {
  name: string;
  path?: string;
  status: DishStatus;
  note?: string;
}

interface MealPlansProps {
  onOpenShopping?: () => void;
}

/** "2026-10-26 to 2026-11-01" -> [start, end] at local midnight. */
function parseRange(range: string): [Date, Date] | null {
  const m = range.match(/(\d{4})-(\d{2})-(\d{2})\s+to\s+(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return null;
  return [new Date(+m[1], +m[2] - 1, +m[3]), new Date(+m[4], +m[5] - 1, +m[6])];
}

/** "Oct 26 – Nov 1", with the year only when it isn't the current one. */
function formatRange(plan: MealPlan): string {
  const range = parseRange(plan.dateRange);
  if (!range) return plan.title;
  const [a, b] = range;
  const end = a.getMonth() === b.getMonth() ? `${b.getDate()}` : `${MONTHS[b.getMonth()]} ${b.getDate()}`;
  const year = a.getFullYear() !== new Date().getFullYear() ? `, ${a.getFullYear()}` : "";
  return `${MONTHS[a.getMonth()]} ${a.getDate()} – ${end}${year}`;
}

function weekLabel(plan: MealPlan): string {
  const n = plan.week.match(/W0*(\d+)$/)?.[1];
  return n ? `Week ${n}` : plan.title;
}

/**
 * Dishes with a status. Plans written before statuses existed only log cooked
 * meals under "Meals", so a dish listed there counts as made.
 */
function dishesOf(plan: MealPlan): Dish[] {
  const cooked = plan.meals.map((m) =>
    (m.match(/^\[([^\]]+)\]/)?.[1] ?? m.split(" — ")[0]).trim()
  );
  const dishes: Dish[] = plan.recipes.map((r) => ({
    name: r.name,
    path: r.path,
    note: r.statusNote,
    status: r.status ?? (cooked.includes(r.name) ? "made" : ""),
  }));
  for (const name of cooked) {
    if (name && !dishes.some((d) => d.name === name)) dishes.push({ name, status: "made" });
  }
  return dishes;
}

function slugOf(path?: string): string | undefined {
  return path?.match(/^recipes\/([^/]+)\//)?.[1];
}

const STATUS_LABEL: Record<DishStatus, string> = {
  planned: "Planned",
  made: "✓ Made",
  skipped: "Skipped",
  "": "",
};

export default function MealPlans({ onOpenShopping }: MealPlansProps) {
  const [plans, setPlans] = useState<MealPlan[]>([]);
  const [recipes, setRecipes] = useState<Map<string, RecipeSummary>>(new Map());
  const [shopping, setShopping] = useState<ShoppingList | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([loadMealPlans(), loadRecipeIndex().catch(() => [])])
      .then(([data, index]) => {
        // Week ids look like "2026-W9"; compare numerically so W39 sorts after W9.
        setPlans(
          [...data].sort((a, b) => b.week.localeCompare(a.week, undefined, { numeric: true }))
        );
        setRecipes(new Map(index.map((r) => [r.slug, r])));
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const { hero, isCurrent, upcoming, earlier } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dated = plans.map((p) => ({ p, r: parseRange(p.dateRange) }));
    const current = dated.find((x) => x.r && x.r[0] <= today && today <= x.r[1])?.p;
    const future = dated.filter((x) => x.r && x.r[0] > today).map((x) => x.p).reverse();
    const top = current ?? plans.find((p) => !future.includes(p));
    return {
      hero: top,
      isCurrent: !!current,
      upcoming: future,
      earlier: plans.filter((p) => p !== top && !future.includes(p)),
    };
  }, [plans]);

  // The hero week's shopping list, if one exists, for the "Shopping list" shortcut.
  useEffect(() => {
    if (!hero) return;
    loadShoppingLists()
      .then((ids) => (ids.includes(hero.week) ? loadShoppingList(hero.week) : null))
      .then(setShopping)
      .catch(() => setShopping(null));
  }, [hero]);

  const photoFor = (dish: Dish): string | undefined => {
    const slug = slugOf(dish.path);
    const r = slug ? recipes.get(slug) : undefined;
    if (!r) return undefined;
    return r.photos.length > 0 ? recipePhotoUrl(r.slug, r.photos[0].file) : r.photoUrl;
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger">Error loading meal plans: {error}</div>;
  }

  if (!hero) {
    return <p className="text-muted">No meal plans yet.</p>;
  }

  const heroDishes = dishesOf(hero);
  const counted = heroDishes.filter((d) => d.status !== "skipped");
  const made = counted.filter((d) => d.status === "made").length;

  return (
    <div className="meal-plans">
      <section className="card week-hero">
        <div className="week-hero-head">
          <div>
            <div className="section-eyebrow">
              {isCurrent ? "This week" : "Latest plan"} · {weekLabel(hero)}
            </div>
            <h2 className="week-hero-title">{formatRange(hero)}</h2>
          </div>
          <div className="week-hero-meta">
            {counted.length > 0 && (
              <div className="week-progress">
                <div className="week-progress-bar">
                  <span style={{ width: `${(made / counted.length) * 100}%` }} />
                </div>
                {made} of {counted.length} made
              </div>
            )}
            {shopping && onOpenShopping && (
              <button type="button" className="shop-link" onClick={onOpenShopping}>
                Shopping list · {shopping.items.length} items →
              </button>
            )}
          </div>
        </div>

        {heroDishes.length > 0 ? (
          <div className="dish-grid">
            {heroDishes.map((dish) => (
              <DishTile key={dish.name} dish={dish} photo={photoFor(dish)} />
            ))}
          </div>
        ) : (
          <p className="text-muted mb-0">Nothing planned yet.</p>
        )}

        {hero.ideas.length > 0 && (
          <div className="idea-row">
            <span className="section-eyebrow">Ideas</span>
            {hero.ideas.map((idea) => (
              <span key={idea} className="idea-chip">
                {idea}
              </span>
            ))}
          </div>
        )}
      </section>

      {upcoming.length > 0 && (
        <WeekList title="Coming up" plans={upcoming} photoFor={photoFor} />
      )}
      {earlier.length > 0 && (
        <WeekList title="Earlier weeks" plans={earlier} photoFor={photoFor} />
      )}
    </div>
  );
}

function DishTile({ dish, photo }: { dish: Dish; photo?: string }) {
  const slug = slugOf(dish.path) ?? dish.name;
  const body = (
    <>
      <div className="dish-tile-img" style={{ background: tintFor(slug) }}>
        {photo ? <img src={photo} alt="" loading="lazy" /> : dish.name.charAt(0)}
      </div>
      <div className="dish-tile-body">
        <div className="dish-tile-name">{dish.name}</div>
        {dish.note && <div className="dish-note">{dish.note}</div>}
        {dish.status && (
          <span className={`status-chip ${dish.status}`}>{STATUS_LABEL[dish.status]}</span>
        )}
      </div>
    </>
  );
  const className = `dish-tile ${dish.status}`;
  return dish.path ? (
    <a className={className} href={`#/recipe/${dish.path}`}>
      {body}
    </a>
  ) : (
    <div className={className}>{body}</div>
  );
}

function WeekList({
  title,
  plans,
  photoFor,
}: {
  title: string;
  plans: MealPlan[];
  photoFor: (dish: Dish) => string | undefined;
}) {
  return (
    <section className="mb-4">
      <h3 className="history-title">{title}</h3>
      <div className="card week-list">
        {plans.map((plan) => {
          const dishes = dishesOf(plan);
          return (
            <div className="week-row" key={plan.id}>
              <div className="week-row-when">
                <div className="week-row-title">{weekLabel(plan)}</div>
                <div className="week-row-dates">{formatRange(plan)}</div>
              </div>
              {dishes.length > 0 ? (
                <div className="week-row-dishes">
                  {dishes.map((dish) => (
                    <DishChip key={dish.name} dish={dish} photo={photoFor(dish)} />
                  ))}
                </div>
              ) : (
                <div className="week-row-empty">Nothing planned</div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function DishChip({ dish, photo }: { dish: Dish; photo?: string }) {
  const slug = slugOf(dish.path) ?? dish.name;
  const body = (
    <>
      {photo ? (
        <img className="dish-chip-thumb" src={photo} alt="" loading="lazy" />
      ) : (
        <span className="dish-chip-thumb" style={{ background: tintFor(slug) }}>
          {dish.name.charAt(0)}
        </span>
      )}
      <span className="dish-chip-name">{dish.name}</span>
      {dish.status === "made" && <span className="dish-chip-check">✓</span>}
    </>
  );
  const className = `dish-chip ${dish.status}`;
  return dish.path ? (
    <a className={className} href={`#/recipe/${dish.path}`} title={dish.note || dish.name}>
      {body}
    </a>
  ) : (
    <span className={className} title={dish.note || dish.name}>
      {body}
    </span>
  );
}
