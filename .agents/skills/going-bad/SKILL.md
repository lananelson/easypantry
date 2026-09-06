---
name: going-bad
description: Check which perishable EasyPantry items need attention soon and suggest urgency or note updates.
---

Follow the Pantry Keeper role in [PANTRY_KEEPER.md](../../../PANTRY_KEEPER.md).

Begin the analysis immediately without preliminary questions. This check is read-only: present findings and proposed changes, but never edit `public/pantry.csv` unless the user explicitly confirms them.

## Assess perishables

1. Read `public/pantry.csv` and focus on rows with `perishable=yes`.
2. Use repository history as a rough age signal:
   - Follow the file across renames with `git log --follow`.
   - Inspect a few relevant snapshots with `git show <sha>:pantry.csv` or `git show <sha>:public/pantry.csv` to estimate when each item appeared.
   - During the temporary duplicate-file period, treat the root `pantry.csv` as a flawed parallel copy and prefer `public/pantry.csv`. Ignore the root copy after its cleanup commit.
3. Combine estimated age with food type and free-text notes. Fragile fish, berries, and herbs differ from sealed foods, frozen items, or hard cheese; notes such as “about a week old,” “expires soon,” or “mold-prone” should affect the assessment.
4. Classify attention roughly:
   - **Very urgent:** fragile perishables present for multiple days or commits, or notes indicating near-term spoilage.
   - **Medium:** items that keep reasonably well or are sealed but have been present for a while.
   - **Low:** newly added sealed or frozen items and inherently long-lived foods.
5. Suggest raising `urgency` for items that clearly need attention and lowering it for newly added, sealed, or frozen items that are unlikely to spoil soon. Suggest useful note changes when warranted.

Use judgment rather than a rigid shelf-life formula. Repository age is not necessarily the purchase date, so surface uncertainty instead of silently treating it as fact.
