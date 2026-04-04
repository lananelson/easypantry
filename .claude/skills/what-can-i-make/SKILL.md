---
name: what-can-i-make
description: Suggest recipes based on what's currently in the pantry
argument-hint: "[constraints]"
---

Suggest recipes based on what's currently in the pantry.

$ARGUMENTS

(Optional: add constraints like "vegetarian", "quick", "use the salmon", etc.)

1. **Read** `public/recipe-index.md` — this lists all recipes and their key ingredients (token-efficient; avoids loading full recipe files).

2. **Read** `public/pantry.csv` — note what's available, quantities, and urgency levels.

3. **For each recipe, assess feasibility:**
   - **Ready to cook** — have all or nearly all ingredients
   - **Close** — missing 1–2 items that are easy to substitute or skip
   - **Needs shopping** — missing key ingredients
   - Common staples (oil, salt, garlic, onion, butter) can be assumed available
   - Consider substitutions: similar proteins (cod ↔ salmon ↔ halibut), similar greens, etc.

4. **Prioritize** recipes that use high-urgency or perishable items going bad soon.

5. **Present top suggestions** (Ready first, then Close) with:
   - What you have
   - Any substitutions needed
   - Why it's prioritized (e.g., "uses the fish that needs to go")

6. If the user wants full recipe details, load `public/recipes/[slug]/recipe.md`.

Follow COMMANDS.md § "What Can I Make" for full approach.
