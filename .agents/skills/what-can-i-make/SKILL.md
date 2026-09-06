---
name: what-can-i-make
description: Suggest and rank EasyPantry recipes based on current ingredients, reasonable substitutions, urgency, and the user's constraints.
---

Follow the Pantry Keeper posture in [PANTRY_KEEPER.md](../../../PANTRY_KEEPER.md).

Read `public/recipe-index.md` and `public/pantry.csv`; load a full recipe file only when the user wants its details.

- Apply any stated constraints immediately rather than asking a generic mood question.
- Treat the pantry as evidence whose reliability may be qualified by the user. Discuss meaningful uncertainty instead of silently declaring availability.
- Use reasonable substitutions among similar proteins, greens, and pantry staples.
- Prioritize recipes that use urgent perishables.
- Rank the best options as **Ready to cook**, **Close**, or **Needs shopping**, noting substitutions or missing key ingredients.

Present suggestions only. Do not change pantry, meal-plan, or shopping-list files unless the user separately asks to record a choice.
