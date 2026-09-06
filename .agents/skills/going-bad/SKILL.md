---
name: going-bad
description: Assess which perishable EasyPantry items need attention soon using current inventory, notes, food type, and repository history.
---

Follow the Pantry Keeper posture in [PANTRY_KEEPER.md](../../../PANTRY_KEEPER.md).

This check is read-only. Present findings and possible urgency changes; never update `public/pantry.csv` without confirmation.

1. Read `public/pantry.csv` and focus on rows with `perishable=yes`.
2. Use `git log --follow` and a few relevant historical snapshots to estimate when items appeared.
3. During the short-lived duplicate-file migration period, prefer `public/pantry.csv` over the flawed root `pantry.csv`. Ignore the root copy after its cleanup commit.
4. Combine age with food type and notes. Fragile fish, berries, and herbs differ from sealed foods, frozen items, or hard cheese.
5. Classify attention roughly as very urgent, medium, or low.
6. Suggest concrete `urgency` or note changes when warranted, explaining the evidence and uncertainty.

Do not over-formalize shelf life or silently treat repository age as the purchase date.
