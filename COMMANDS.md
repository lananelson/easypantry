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

3. **Generate Shopping List**: Use "generate shopping list" command
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

1. Check `weekly-meals/[current-week].md` for all recipes and their needed ingredients
2. Cross-reference with `pantry.csv` to identify what's missing
3. Check `pantry.csv` for items with `quantity=0` AND `stock_requirement="keep in stock"`
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

- `for`: Array of recipe names from the meal plan that need this item (can be empty array)

**Status Values:**

- `active`: Current shopping list in use
- `completed`: Shopping trip completed (list will be collapsed by default on website)

## Pantry: "What's Going Bad" Check

**Command:** "what's going bad" or "check what's going bad"

**High-level methodology (do not over-formalize):**

1. **Start from current data**

   - Look at `public/pantry.csv`
   - Focus on rows with `perishable = yes`

2. **Use git history as a rough age signal**

   - Follow the file across renames (e.g., `pantry.csv` → `public/pantry.csv`) using `git log --follow`
   - Inspect a few historical snapshots (`git show <sha>:pantry.csv` / `public/pantry.csv`) to see when each perishable item first appears and how long it has been around in git

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

## Add Recipe from URL

**Command:** "add recipe from [URL]"

**Process:**

1. Fetch recipe from URL using `web-fetch`
2. Parse ingredients and instructions
3. Create folder: `recipes/[recipe-name]/`
4. Create `recipes/[recipe-name]/media/` folder
5. Create `recipes/[recipe-name]/recipe.md` with parsed content
6. Include source URL in References section

**Recipe Template:**

```markdown
---
title: Recipe Title
category:
prep_time:
cook_time:
servings:
tags: []
---

## Ingredients

- ingredient 1
- ingredient 2

## Instructions

1. Step 1
2. Step 2

## Substitution Notes

- substitution notes here

## References

- Source: [URL]
- Author: [Author Name]
```
