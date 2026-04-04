Generate or regenerate the shopping list for the target week.

$ARGUMENTS

(Optional: pass a vendor name, e.g. `/shopping-list Costco`, to include vendor-specific restock items.)

1. **Determine target week** from today's date. If ambiguous (late in the week), confirm with user.

2. **Read** `public/weekly-meals/[week].md` — collect all ingredients marked `(need to buy)` and which recipe each belongs to.

3. **Read** `public/pantry.csv` — collect all items with `quantity=0` and `stock_requirement="keep in stock"` as restock candidates.
   - If a vendor was specified, also include out-of-stock items likely carried by that vendor.

4. **Build the items array:**
   - Ingredients from meal plan → `"for": ["recipe name"]`
   - Pure restock items (not used in any recipe this week) → `"for": ["restock"]`
   - Items used in a recipe AND needing restock → `"for": ["recipe name"]` (treat as ingredient)

5. **Write** `public/shopping-lists/[week].json`:

```json
{
  "title": "Week XX (Mon DD-DD, YYYY)",
  "week": "YYYY-WXX",
  "created": "YYYY-MM-DD",
  "status": "active",
  "completed_date": null,
  "items": [
    { "name": "Item name", "for": ["recipe 1"] }
  ]
}
```

6. If `public/shopping-lists/index.json` doesn't include this week, add it.

7. Show the user the generated list and confirm before writing.

Follow COMMANDS.md § "Generate Shopping List" for full rules.
