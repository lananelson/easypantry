---
name: going-bad
description: Check which perishable pantry items need to be used soon
---

Check which perishable pantry items need to be used soon.

This is a read-only check — no files are edited without your confirmation.

1. **Read** `public/pantry.csv` and filter for rows where `perishable=yes`.

2. **Use git history as an age signal:**
   ```
   git log --follow -- public/pantry.csv
   ```
   Check a few historical snapshots to see when each perishable item first appeared and how long it's been around.

3. **Combine type + age + notes** to assess risk:
   - Very fragile (raw fish, berries, fresh herbs, open containers) → deteriorate fast
   - Moderately fragile (dairy, open condiments, cooked leftovers) → a few days
   - Hardier perishables (hard cheese, sealed items, frozen) → much longer shelf life
   - Use the `notes` field for additional signals ("expires soon", "about a week old", etc.)

4. **Classify each item:**
   - **Urgent** — use today/tomorrow
   - **Soon** — use within a few days
   - **OK** — fine for now

5. **Suggest urgency updates** for items where the current `urgency` value is out of date:
   - Propose bumping up for items that are clearly aging
   - Propose lowering for fresh or sealed items

6. Present findings and proposed changes. Only edit `public/pantry.csv` if the user confirms.

Follow COMMANDS.md § "Pantry: What's Going Bad" for full methodology.
