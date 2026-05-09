# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

CMSC335 Final Project — **Baker's Notebook**: a Node.js/Express/MongoDB app for discovering baking recipes via TheMealDB and saving favorites to a personal notebook. Due May 15, 2026 at 3:30 PM; deploy to Render before submission.

## Commands

```bash
npm install       # install dependencies
npm start         # run the app (node app.js)
npm run dev       # run with nodemon (auto-restart on file changes)
```

Copy `.env.example` to `.env` and set `MONGODB_URI` before running.

## Architecture

Server-side rendered Express app using EJS templates. No frontend build step.

- **app.js** — Express setup, MongoDB connection via `MONGODB_URI`, mounts routes at `/` and `/cookbook`
- **routes/index.js** — `GET /` (home, featured desserts), `GET /search` (TheMealDB search), `GET /recipe/:id` (full recipe detail)
- **routes/cookbook.js** — `GET /cookbook` (list saved), `POST /cookbook` (save/upsert), `DELETE /cookbook/:id` (remove)
- **models/SavedRecipe.js** — Mongoose schema: `mealId` (unique), `name`, `category`, `thumbnail`, `notes`, `difficulty`
- **views/** — EJS templates; `views/partials/header.ejs` and `footer.ejs` are included in every page
- **public/css/styles.css** — All styling; Google Fonts (Playfair Display + Lato) are loaded in `header.ejs`

TheMealDB base URL: `https://www.themealdb.com/api.json/v1/1` — no API key required.
- `GET /filter.php?c=Dessert` — list of dessert meals used on the home page
- `GET /search.php?s={query}` — search by name
- `GET /lookup.php?i={id}` — full meal detail (ingredients, instructions, YouTube link)

Saving a recipe uses `findOneAndUpdate` with `upsert: true` so re-saving updates notes/difficulty without creating duplicates. Delete uses `method-override` — the cookbook view sends a hidden `_method=DELETE` field in a POST form.
