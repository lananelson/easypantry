Update pantry inventory in `public/pantry.csv`.

$ARGUMENTS

(Describe what changed — e.g. "we finished the salmon", "I bought olive oil and eggs", "we made birria tacos".)

1. **Read** `public/pantry.csv` to see current state.

2. **Apply the described changes:**
   - Add new items (with appropriate category, quantity, unit, location, perishable, urgency)
   - Adjust quantities for items used or restocked
   - Remove items when quantity hits 0 AND `stock_requirement` is empty
   - Keep rows with `stock_requirement="keep in stock"` even at quantity 0

3. **Never use "n.a."** — leave fields blank (empty string) instead.

4. **If the change is tied to a recipe** (e.g., "we made X"):
   - Check the current week's `public/weekly-meals/[week].md`
   - If the recipe exists under `## Recipes`, suggest adding a `## Meals` entry linking to it
   - Ask the user before editing the meal plan file

5. Show the diff of proposed changes and confirm before writing.

Follow COMMANDS.md § "Update Pantry Data" for full rules.
