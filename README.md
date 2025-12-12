# EasyPantry

A personal pantry management system with meal planning and shopping list generation.

## Features

- **Pantry Inventory**: Track all your pantry items with quantities, locations, and urgency levels
- **Shopping Lists**: Generate shopping lists from meal plans and track out-of-stock items
- **Meal Planning**: Plan weekly meals and track ingredients needed
- **Recipe Management**: Store and organize recipes with ingredients and instructions

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tabler UI framework
- **Data Storage**: CSV files and JSON (static, no backend)
- **Deployment**: GitHub Pages

## Project Structure

```
easypantry/
├── app/                    # React application source
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── utils/         # Utility functions
│   │   └── types.ts       # TypeScript types
│   └── package.json
├── public/                # Static data files
│   ├── pantry.csv        # Pantry inventory
│   ├── shopping-lists/   # Shopping list JSON files
│   ├── recipes/          # Recipe markdown files
│   └── weekly-meals/     # Weekly meal plans
├── docs/                  # Build output (deployed to GitHub Pages)
└── COMMANDS.md           # Workflow documentation
```

## Development

See [app/README.md](app/README.md) for development instructions.

**Requirements**: Node.js 20.19+ or 22.12+

## Deployment

The app is automatically built and deployed to GitHub Pages when changes are pushed to the `main` branch.

## Data Management

All data is stored in static files:

- Pantry items: `public/pantry.csv`
- Shopping lists: `public/shopping-lists/*.json`
- Recipes: `public/recipes/*/recipe.md`
- Meal plans: `public/weekly-meals/*.md`

See [COMMANDS.md](COMMANDS.md) for workflows and commands.
