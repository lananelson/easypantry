# EasyPantry Commands

This file contains reusable commands/workflows for managing the pantry system.

## Meal Planning Workflow

**Overview:**

Meal planning follows a progressive workflow from ideas to recipes to shopping lists.

**Process:**

1. **Start with Ideas**: Add meal ideas to the "Ideas" section of `weekly-meals/[week].md`

   - Simple list of meal concepts (e.g., "Baked salmon", "Cod chowder")
   - No details needed at this stage

2. **Develop Recipes**: Move ideas to the "Recipes" section when ready to plan

   - **For recipes with full documentation**: Link to recipe file and list ingredients

     - Format: `### [Recipe Name](../recipes/recipe-name/recipe.md)`
     - List all ingredients with status: `✓` (have it) or `(need to buy)`
     - Note substitutions inline (e.g., "use Fontina ✓" instead of "Melting cheese")

   - **For simple recipes**: Add ingredients list without creating recipe file
     - Format: `### Recipe Name` (no link)
     - List basic ingredients with status: `✓` (have it) or `(need to buy)`
     - Do NOT include cooking method in meal plan

3. **Log Meals Cooked**: Use a "Meals" section in the weekly file

   - After you actually cook something, add an entry under `## Meals` in `weekly-meals/[week].md`
   - Link each meal back to the corresponding recipe heading in the same file (e.g., `[Birria Tacos](#birria-tacos)`)
   - Optionally note what pantry items were used or finished

4. **Generate Shopping List**: Use "generate shopping list" command
   - Extracts all "(need to buy)" items from meal plan
   - Adds out-of-stock pantry staples (quantity=0, stock_requirement="keep in stock")
   - Creates `shopping-lists/[week].json` with items linked to recipes

**Meal Plan Format:**

```markdown
---
week: YYYY-WXX
date_range: YYYY-MM-DD to YYYY-MM-DD
---

# Week XX - Month YYYY

## Ideas

- Meal idea 1
- Meal idea 2

## Meals

- [Full Recipe Name](#full-recipe-name) — optional notes about when you cooked it or what you used

## Recipes

### [Full Recipe Name](../recipes/recipe-name/recipe.md)

**Ingredients needed:**

- Ingredient 1 ✓
- Ingredient 2 (need to buy)
- Ingredient 3 (use substitute instead ✓)

### Simple Recipe Name

**Ingredients needed:**

- Ingredient 1 ✓
- Ingredient 2 ✓
```

## Generate Shopping List

**Command:** "generate shopping list" or "regenerate shopping list"

**Process:**

1. Check `weekly-meals/[current-week].md` for all recipes and their needed ingredients.
2. Cross-reference with `public/pantry.csv` to identify what's missing.
3. Handle `stock_requirement="keep in stock"` items when quantity will be 0 (now or after this week's meals):

   - If the item is **not used** in any recipe this week (pure restock):

     - If `vendor` is blank: add a restock item with `for: ["restock"]`.
     - If `vendor` is set (e.g. "Costco"): ask "Are you going to [vendor] on this trip?" and only add it (with `for: ["restock"]`) if yes.

   - If the item **is used** in at least one recipe this week:
     - Treat it as a normal ingredient and add it with `for: [recipe names]` (do not add `"restock"` and do not ask about `vendor`).

4. Create/update `shopping-lists/[current-week].json` with:
   - JSON format with metadata (title, week, created date, status)
   - Items array with name and "for" fields
   - Status defaults to "active" for new lists

**Shopping List JSON Format:**

```json
{
  "title": "Shopping List - Week XX (Date Range)",
  "week": "YYYY-WXX",
  "created": "YYYY-MM-DD",
  "status": "active",
  "completed_date": null,
  "items": [{ "name": "Item name", "for": ["recipe 1", "recipe 2"] }]
}
```

**Field Descriptions:**

- `for`: Array of reasons this item is on the list.
  - Usually recipe names from the meal plan (e.g. `["birria tacos", "cod chowder"]`).
  - For pure restock items (not used in any recipe this week), use `["restock"]`.

**Status Values:**

- `active`: Current shopping list in use
- `completed`: Shopping trip completed (list will be collapsed by default on website)

## Update Pantry Data

**Command:** "update pantry", "I ate something", "we are out of"

**High-level approach:**

- Treat this as a request to edit **pantry data only**, in `public/pantry.csv`
  - Add, remove, or adjust rows and field values (e.g., quantity, location, notes)
  - Do **not** change the CSV schema (header row or column order)
  - Follow the user's instructions literally; don't invent pantry changes that weren't requested
  - **Never use "n.a." in any field** - leave fields blank instead (empty string between commas)
  - When an item's quantity is reduced to **0**:
    - If `stock_requirement` is empty/zero, **remove that row from the CSV** (the item is gone)
    - If `stock_requirement` is non-empty (e.g. `keep in stock`), keep the row with quantity `0` so it still shows up as a keep-in-stock item
  - When the change is clearly tied to a specific meal or recipe (e.g., "we made birria quesadillas" and reduced related ingredients):
    - Look at the current week's `weekly-meals/[week].md`
  - If the recipe exists under `## Recipes`, **suggest** updating the meal plan by:
    - Adding or updating an entry under `## Meals` that links back to the recipe heading (e.g., `[Birria Tacos](#birria-tacos)`)
    - Optionally noting which key pantry items were used or finished
  - Ask the user before applying any changes to the meal plan file

## Log Meals Retroactively

**Command:** "log meals retroactively" or "backfill meals"

**High-level approach:**

- Treat this as a **read-only analysis step** over history that produces **suggested meal log updates**, not direct edits.
- Focus on the current week's files:
  - `public/pantry.csv` (and any prior `pantry.csv` path) using `git log --follow`
  - `public/weekly-meals/[week].md` for that week

**Process (loosely):**

1. **Identify the current week**

   - Use the `week:` frontmatter in `weekly-meals/[week].md` or the week the user mentions.

2. **Scan pantry history for meal-like changes**

   - Use `git log --follow -- public/pantry.csv` (and older `pantry.csv` if needed) to inspect commits for this week.
   - **Temporary migration quirk (agent bug):** there was a short-lived period where both a root `pantry.csv` and `public/pantry.csv` existed at once. When you're analyzing _that_ week, remember some edits might have landed in the wrong file; prefer `public/pantry.csv` as the intended source of truth. After the cleanup commit that deleted the root `pantry.csv`, you can ignore it and only follow `public/pantry.csv` going forward.
   - Look for rows that are likely **meals** or cooked dishes (e.g., prepared foods, leftovers, items whose names match recipes or ideas) whose quantities dropped or were removed during the week.

3. **Match changes to the weekly meal plan**

   - Compare those meal-like items and their dates to the `## Ideas` and `## Recipes` sections in `weekly-meals/[week].md`.
   - For each recipe, consider it a **candidate cooked meal** if:
     - A matching prepared item (e.g., "Birria quesadillas") shows consumption in pantry history, or
     - Several of its core ingredients clearly decreased around the same time.

4. **Propose retroactive meal log entries**

   - For each candidate recipe, **suggest** a simple entry under `## Meals` that links back to the recipe heading (e.g., `- [Birria Tacos](#birria-tacos)`).
   - Keep notes minimal and high-level (e.g., "logged retroactively" if you want); avoid trying to infer quantities cooked, leftovers, or other fine‑grained details.
   - Present these as suggestions to the user ("It looks like you probably made: ...").

5. **Apply only with confirmation**

   - Do not edit `weekly-meals/[week].md` automatically.
   - Only add or modify `## Meals` entries after the user explicitly confirms which suggested meals were actually made.

6. **Ask about anything missing**
   - After presenting suggestions, explicitly ask the user if there were any other meals cooked during the week that were **not** inferred from pantry history.
   - If they name additional meals, add simple `## Meals` entries for them:
     - Link to the appropriate recipe heading when one exists in the file.
     - If there is no recipe heading, just use the meal name as plain text.
   - As above, keep this lightweight — no need to record how much was cooked or leftover.

## Pantry: "What's Going Bad" Check

**Command:** "what's going bad" or "check what's going bad"

**High-level methodology (do not over-formalize):**

1. **Start from current data**

   - Look at `public/pantry.csv`
   - Focus on rows with `perishable = yes`

2. **Use git history as a rough age signal**

   - Follow the file across renames (e.g., `pantry.csv` → `public/pantry.csv`) using `git log --follow`
   - Inspect a few historical snapshots (`git show <sha>:pantry.csv` / `public/pantry.csv`) to see when each perishable item first appears and how long it has been around in git
   - **Migration quirk (agent bug, time-bounded):** for one short period there were _two_ pantry CSVs (`pantry.csv` at the root and `public/pantry.csv`). When you're looking at that window in history, treat the root `pantry.csv` as a flawed parallel copy and prefer `public/pantry.csv` for the real state. After the cleanup that removed the root file, you can stop looking back at the duplicate entirely.

3. **Combine type + age + notes**

   - Consider how fragile the item is (e.g., raw fish, berries, herbs vs. sealed dates or hard cheese)
   - Use free-text `notes` (e.g., "About a week old", "Expires soon", "mold-prone") to adjust your sense of risk

4. **Classify attention level (roughly)**

   - Very urgent: fragile perishables that have been in the pantry for multiple days/commits or have notes indicating near-term spoilage
   - Medium: items that keep reasonably well or are sealed but have been around for a while
   - Low: sealed or frozen items that are new or inherently long-lived

5. **Optionally suggest `urgency` updates**
   - Suggest bumping `urgency` up for items that clearly need attention soon (e.g., open kombucha in a warm location, old fish, berries, herbs)
   - Suggest lowering `urgency` for newly added, sealed, or frozen items that are unlikely to go bad soon

This is intentionally high-level: use judgment rather than strict rules, and surface recommendations to the user instead of silently editing `public/pantry.csv`.

**Important:** The "what's going bad" check itself must be read-only. It should _never_ directly edit `public/pantry.csv`; instead, it should propose concrete changes (e.g., updated `urgency` values or notes) and only apply them when explicitly confirmed by the user.

## What Can I Make

**Command:** "what can I make", "recipe suggestions", "what should I cook"

**High-level approach:**

- Use `public/recipe-index.md` (auto-generated ingredient index) instead of reading full recipe files
- This saves tokens while preserving Claude's ability to reason about substitutions

**Process:**

1. Read `public/recipe-index.md` to see all recipes and their ingredients
2. Read `public/pantry.csv` to see what's available
3. For each recipe, assess:
   - Do I have the key ingredients (or reasonable substitutes)?
   - Consider similar proteins (cod ↔ salmon ↔ halibut), similar greens, etc.
   - Common pantry staples (oil, salt, garlic, onion) can be assumed available
4. Rank recipes by feasibility:
   - **Ready to cook**: Have all or nearly all ingredients
   - **Close**: Missing 1-2 items that are easy to substitute or skip
   - **Needs shopping**: Missing key ingredients
5. Present top suggestions with notes on any substitutions needed

**Notes:**

- The recipe index is auto-generated from recipe files via git pre-commit hook
- If user wants full recipe details, load the specific `public/recipes/[slug]/recipe.md` file
- Consider `urgency` field in pantry.csv - prioritize recipes that use items going bad soon

## Add Recipe

**Commands:**

- "add recipe from [URL]"
- "add recipe from image" / "add recipe from photo"
- "add recipe" (with text provided by user)

**Process:**

1. **Get recipe content:**

   - **From URL**: Fetch recipe using `web-fetch` and parse ingredients and instructions
   - **From image**: Ask user for the image/screenshot, then transcribe the content
   - **From text**: Use the recipe text provided by the user

2. **Choose a recipe slug:**

   - Lowercase, dash-separated (e.g., "alice-waters-caesar-salad")
   - Remove apostrophes and special characters
   - Keep it unique, readable, and descriptive but not too long

3. **Create folder structure:**

   - Create folder: `public/recipes/[recipe-slug]/`
   - (Optional) Create `public/recipes/[recipe-slug]/media/` folder for images

4. **Create recipe file:**

   - Create `public/recipes/[recipe-slug]/recipe.md` with standard frontmatter and headings
   - Follow the template structure below

5. **Document the source:**

   - **From URL**: Include source URL in `## References` section
   - **From image or text**: Ask user where the recipe came from (cookbook title, author, website, personal notes) and record in `## References` section

6. **Recipe index update:**
   - The recipe index (`public/recipe-index.md`) is auto-regenerated on commit via git pre-commit hook
   - No manual action needed - just commit the new recipe file

**Tag rules:**

- Frontmatter `tags` must be either `[]` or a subset of the approved tags in `public/approved_tags.csv`
- Do NOT create new tags - only use approved tags or leave empty

**Ayurvedic field rules:**

- Frontmatter `ayurvedic` is a free-form array for Ayurvedic characteristics
- No pre-approved list needed - add relevant Ayurvedic attributes as appropriate
- Common attributes include: dosha effects (vata-balancing, pitta-aggravating, etc.), digestive qualities (easy-to-digest, gas-producing, etc.), thermal qualities (warming, cooling), food combining issues (incompatible-fish-dairy, etc.), and qualities (sattvic, rajasic, tamasic)
- Can be empty `[]` if no specific Ayurvedic considerations

**Heading structure rules:**

- Use ONLY level-2 headings (`##`) - no subsections (`###`)
- Required headings in order: `## Ingredients`, `## Instructions`, `## References`
- Optional heading: `## Notes` (goes between Instructions and References)
- Do NOT add extra headings outside this structure
- For ingredient groupings, use inline notes in parentheses instead of subsections (e.g., "1 1/2 tablespoons olive oil (for croutons)")

**Recipe Template:**

```markdown
---
title: Recipe Title
category:
prep_time:
cook_time:
servings:
tags: []
ayurvedic: []
---

## Ingredients

- ingredient 1
- ingredient 2

## Instructions

1. Step 1
2. Step 2

## Notes

- notes here

## References

- Source: [URL or Book Title]
- Author: [Author Name]
```
