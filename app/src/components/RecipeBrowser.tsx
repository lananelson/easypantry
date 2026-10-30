import { useEffect, useMemo, useState } from "react";
import type { RecipeSummary } from "../types.js";
import { loadRecipeIndex, recipePhotoUrl } from "../utils/dataLoader.js";

/** Below this width a card photo is shown uncropped instead of stretched. */
const SMALL_CARD_PHOTO = 400;

/** Sources with at least this many recipes get their own one-click pill. */
const TOP_SOURCE_MIN = 3;

const PERSONAL_SOURCE = "Personal & clippings";
const KIND_LABELS: Record<string, string> = {
  book: "Cookbooks",
  web: "Websites & magazines",
  personal: "Personal",
};

/** Soft background for recipes without a photo, stable per recipe. */
const PLACEHOLDER_TINTS = [
  "#f4e9dc",
  "#e6efe3",
  "#f6e3e1",
  "#e3ebf3",
  "#efe8f4",
  "#f3efd9",
];

export function tintFor(slug: string): string {
  let hash = 0;
  for (const ch of slug) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return PLACEHOLDER_TINTS[hash % PLACEHOLDER_TINTS.length];
}

function stored(key: string): string {
  const value = sessionStorage.getItem(key) || "";
  return value === "All" ? "" : value; // older sessions stored "All" for no filter
}

export default function RecipeBrowser() {
  const [recipes, setRecipes] = useState<RecipeSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState(() => stored("recipes.query"));
  // One tag and one source at a time; "" means no filter. Clicking an active pill clears it.
  const [tag, setTag] = useState(() => stored("recipes.tag"));
  const [source, setSource] = useState(() => stored("recipes.source"));
  // Which filter the single pill row shows; the other stays applied.
  const [facet, setFacet] = useState<"tags" | "source">(() =>
    stored("recipes.facet") === "source" ? "source" : "tags"
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
    sessionStorage.setItem("recipes.source", source);
    sessionStorage.setItem("recipes.facet", facet);
  }, [query, tag, source, facet]);

  const tagCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const r of recipes)
      for (const t of r.tags) counts.set(t, (counts.get(t) || 0) + 1);
    return [...counts.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([name, count]) => ({ name, count }));
  }, [recipes]);

  const { topSources, otherSourceGroups } = useMemo(() => {
    const counts = new Map<string, { count: number; kind: string }>();
    for (const r of recipes) {
      if (!r.source) continue;
      const entry = counts.get(r.source) || { count: 0, kind: r.sourceKind || "book" };
      entry.count++;
      counts.set(r.source, entry);
    }
    const all = [...counts.entries()].map(([name, v]) => ({ name, ...v }));
    const top = all
      .filter((s) => s.count >= TOP_SOURCE_MIN)
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
    const groups = ["book", "web", "personal"]
      .map((kind) => ({
        kind,
        items: all
          .filter((s) => s.count < TOP_SOURCE_MIN && s.kind === kind)
          .sort((a, b) => a.name.localeCompare(b.name)),
      }))
      .filter((g) => g.items.length > 0);
    return { topSources: top, otherSourceGroups: groups };
  }, [recipes]);

  const visible = useMemo(() => {
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    return recipes.filter((r) => {
      if (tag && !r.tags.includes(tag)) return false;
      if (source && r.source !== source) return false;
      if (terms.length === 0) return true;
      const haystack = [
        r.title,
        ...r.tags,
        ...r.ingredients,
        r.source ?? "",
        r.author ?? "",
        r.references ?? "",
      ]
        .join(" ")
        .toLowerCase();
      return terms.every((t) => haystack.includes(t));
    });
  }, [recipes, query, tag, source]);

  const filtered = !!(query || tag || source);
  const clearAll = () => {
    setQuery("");
    setTag("");
    setSource("");
  };
  const sourceIsTop = topSources.some((s) => s.name === source);

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
      <div className="recipe-browser-head">
        <div>
          <h2 className="page-title mb-1">Recipes</h2>
          <div className="text-muted">
            {filtered ? (
              <>
                {visible.length} of {recipes.length} ·{" "}
                <button type="button" className="link-button" onClick={clearAll}>
                  Clear filters
                </button>
              </>
            ) : (
              `${recipes.length} recipes`
            )}
          </div>
        </div>
        <div className="recipe-search">
          <input
            type="search"
            className="form-control"
            placeholder="Search recipes, ingredients, cookbooks, authors…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="recipe-filters">
        <div className="facet-switch" role="tablist" aria-label="Filter by">
          <button
            type="button"
            role="tab"
            aria-selected={facet === "tags"}
            className={facet === "tags" ? "active" : ""}
            onClick={() => setFacet("tags")}
          >
            Tags
            {tag && <span className="facet-value">· {tag}</span>}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={facet === "source"}
            className={facet === "source" ? "active" : ""}
            onClick={() => setFacet("source")}
          >
            Source
            {source && (
              <span className="facet-value">
                · {source === PERSONAL_SOURCE ? "Personal" : source}
              </span>
            )}
          </button>
        </div>
        {facet === "tags" ? (
          <div className="filter-pills">
            {tagCounts.map((t) => (
              <button
                key={t.name}
                type="button"
                className={`filter-pill${tag === t.name ? " active" : ""}`}
                aria-pressed={tag === t.name}
                onClick={() => setTag(tag === t.name ? "" : t.name)}
              >
                {t.name}
                <span className="filter-count">{tag === t.name ? "×" : t.count}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="filter-pills">
            {topSources.map((s) => (
              <button
                key={s.name}
                type="button"
                className={`filter-pill${source === s.name ? " active" : ""}`}
                aria-pressed={source === s.name}
                onClick={() => setSource(source === s.name ? "" : s.name)}
              >
                {s.name === PERSONAL_SOURCE ? "Personal" : s.name}
                <span className="filter-count">{source === s.name ? "×" : s.count}</span>
              </button>
            ))}
            {source && !sourceIsTop && (
              <button
                type="button"
                className="filter-pill active"
                aria-pressed
                onClick={() => setSource("")}
              >
                {source}
                <span className="filter-count">×</span>
              </button>
            )}
            {otherSourceGroups.length > 0 && (
              <select
                className="filter-select"
                aria-label="More sources"
                value=""
                onChange={(e) => e.target.value && setSource(e.target.value)}
              >
                <option value="">More sources…</option>
                {otherSourceGroups.map((g) => (
                  <optgroup key={g.kind} label={KIND_LABELS[g.kind]}>
                    {g.items.map((s) => (
                      <option key={s.name} value={s.name}>
                        {s.name}
                        {s.count > 1 ? ` (${s.count})` : ""}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            )}
          </div>
        )}
      </div>

      {visible.length === 0 ? (
        <div className="text-muted py-5 text-center">
          No recipes match these filters.{" "}
          <button type="button" className="link-button" onClick={clearAll}>
            Clear filters
          </button>
        </div>
      ) : (
        <div className="row row-cards">
          {visible.map((r) => (
            <div className="col-6 col-md-4 col-xl-3" key={r.slug}>
              <a
                className="card card-link recipe-card h-100"
                href={`#/recipe/recipes/${r.slug}/recipe.md`}
              >
                {r.photos.length > 0 || r.photoUrl ? (
                  <img
                    className={`recipe-card-img ${
                      r.photos.length > 0 &&
                      r.photos[0].width > 0 &&
                      r.photos[0].width < SMALL_CARD_PHOTO
                        ? "recipe-card-img-small"
                        : ""
                    }`}
                    style={{ background: tintFor(r.slug) }}
                    src={
                      r.photos.length > 0
                        ? recipePhotoUrl(r.slug, r.photos[0].file)
                        : r.photoUrl
                    }
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
                  {r.source && (
                    <div className="recipe-card-source">
                      {r.source === PERSONAL_SOURCE ? "Personal" : r.source}
                    </div>
                  )}
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
