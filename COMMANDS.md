# EasyPantry Commands

This file contains reusable commands/workflows for managing the pantry system.

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
