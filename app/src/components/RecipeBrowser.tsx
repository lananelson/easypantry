import { useEffect, useMemo, useState } from "react";
import type { RecipeSummary } from "../types.js";
import { loadRecipeIndex, recipePhotoUrl } from "../utils/dataLoader.js";

/** Below this width a card photo is shown uncropped instead of stretched. */
const SMALL_CARD_PHOTO = 400;

/** Soft background for recipes without a photo, stable per recipe. */
const PLACEHOLDER_TINTS = [
  "#f4e9dc",
  "#e6efe3",
  "#f6e3e1",
  "#e3ebf3",
  "#efe8f4",
  "#f3efd9",
];

function tintFor(slug: string): string {
  let hash = 0;
  for (const ch of slug) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return PLACEHOLDER_TINTS[hash % PLACEHOLDER_TINTS.length];
}

export default function RecipeBrowser() {
  const [recipes, setRecipes] = useState<RecipeSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState(
    () => sessionStorage.getItem("recipes.query") || ""
  );
  // Tags are hand-curated in recipe frontmatter; "All" means no tag filter.
  const [tag, setTag] = useState(
    () => sessionStorage.getItem("recipes.tag") || "All"
  );

  useEffect(() => {
    loadRecipeIndex()
      .then((data) => {
        setRecipes(data);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    sessionStorage.setItem("recipes.query", query);
    sessionStorage.setItem("recipes.tag", tag);
  }, [query, tag]);

  const tagCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const r of recipes)
      for (const t of r.tags) counts.set(t, (counts.get(t) || 0) + 1);
    return [...counts.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([name, count]) => ({ name, count }));
  }, [recipes]);

  const visible = useMemo(() => {
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    return recipes.filter((r) => {
      if (tag !== "All" && !r.tags.includes(tag)) return false;
      if (terms.length === 0) return true;
      const haystack = [r.title, ...r.tags, ...r.ingredients]
        .join(" ")
        .toLowerCase();
      return terms.every((t) => haystack.includes(t));
    });
  }, [recipes, query, tag]);

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
    return <div className="alert alert-danger">Error loading recipes: {error}</div>;
  }

  return (
    <div className="recipe-browser">
      <div className="d-flex flex-wrap align-items-end gap-3 mb-3">
        <div>
          <h2 className="page-title mb-1">Recipes</h2>
          <div className="text-muted">
            {visible.length === recipes.length
              ? `${recipes.length} recipes`
              : `${visible.length} of ${recipes.length}`}
          </div>
        </div>
        <div className="ms-auto recipe-search">
          <input
            type="search"
            className="form-control"
            placeholder="Search by name or ingredient — e.g. zucchini dill"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="d-flex flex-wrap gap-2 mb-4">
        {[{ name: "All", count: recipes.length }, ...tagCounts].map((g) => (
          <button
            key={g.name}
            type="button"
            className={`btn btn-sm btn-pill ${
              tag === g.name ? "btn-dark" : "btn-outline-secondary"
            }`}
            onClick={() => setTag(g.name)}
          >
            {g.name} <span className="ms-1 opacity-75">{g.count}</span>
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="text-muted py-5 text-center">
          Nothing matches “{query}”.
        </div>
      ) : (
        <div className="row row-cards">
          {visible.map((r) => (
            <div className="col-6 col-md-4 col-xl-3" key={r.slug}>
              <a
                className="card card-link recipe-card h-100"
                href={`#/recipe/recipes/${r.slug}/recipe.md`}
              >
                {r.photos.length > 0 ? (
                  <img
                    className={`recipe-card-img ${
                      r.photos[0].width > 0 && r.photos[0].width < SMALL_CARD_PHOTO
                        ? "recipe-card-img-small"
                        : ""
                    }`}
                    style={{ background: tintFor(r.slug) }}
                    src={recipePhotoUrl(r.slug, r.photos[0].file)}
                    alt=""
                    loading="lazy"
                  />
                ) : (
                  <div
                    className="recipe-card-img recipe-card-placeholder"
                    style={{ background: tintFor(r.slug) }}
                  >
                    {r.title.charAt(0)}
                  </div>
                )}
                <div className="card-body p-3">
                  <div className="recipe-card-title">{r.title}</div>
                  {!r.hasInstructions && (
                    <div className="text-muted small mt-1">ingredients only</div>
                  )}
                </div>
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
