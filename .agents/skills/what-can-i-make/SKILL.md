---
name: what-can-i-make
description: Suggest and rank EasyPantry recipes from current pantry ingredients, reasonable substitutions, urgency, and any stated constraints.
---

Read the recipe index and pantry and apply any constraints the user supplied.

1. Read `public/recipe-index.md` instead of loading every full recipe file.
2. Read `public/pantry.csv`.
3. For each recipe, assess whether the key ingredients or reasonable substitutes are available:
   - Consider substitutions among similar proteins, such as cod, salmon, or halibut, and among similar greens or other interchangeable ingredients.
   - Assume common pantry staples such as oil, salt, garlic, and onion are available.
4. Use pantry `urgency` to prioritize recipes that consume ingredients that need attention soon.
5. Rank the best options:
   - **Ready to cook:** all or nearly all ingredients are available.
   - **Close:** one or two items are missing but easy to substitute or skip.
   - **Needs shopping:** key ingredients are missing.
6. Present the top suggestions and note any substitutions needed.

Load a full `public/recipes/<slug>/recipe.md` file only when the user asks for the recipe details. This workflow suggests options; it does not update pantry, meal-plan, or shopping-list data.
