# Marathon 2026

A personal marathon training app to go from 6-7 km runs to a full 42.2 km marathon. Built as a countdown to turning 40.

## The Plan

26 weeks of structured training across 4 phases:

| Phase | Weeks | Weekly Volume | Focus |
|-------|-------|---------------|-------|
| Base Building | 1-8 | 20 - 40 km | Build consistent mileage, re-establish 10km comfort |
| Endurance | 9-16 | 40 - 55 km | Long runs up to 28km, introduce tempo work |
| Peak | 17-22 | 50 - 65 km | Long runs up to 35km, race-pace sessions |
| Taper | 23-26 | 65 - 30 km | Reduce volume, sharpen fitness, race day |

Weekly structure: Mon easy run, Tue tempo/intervals, **Wed strength training**, Thu easy run, Fri long run, Sat/Sun rest. Strength exercises progress across phases — from bodyweight foundations in base building to heavier compound lifts during peak, then back to maintenance during taper. Every 4th week is a step-back recovery week.

## Features

- **Training calendar** — 26-week view with color-coded workouts, current week highlighting, and a "Go to Today" button
- **Workout details** — click any day to see the planned workout type, distance, and pace guidance
- **Run logging** — log actual distance, time, how it felt (1-5), and notes after each run
- **Dashboard** — weekly mileage chart (planned vs actual), long run progression, pace trends, run streak, and completion percentage
- **Dark mode** — toggle between light and dark themes
- **Data backup** — export/import your training logs as JSON

## Getting Started

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

## Tech Stack

- [Vite](https://vite.dev) + [React](https://react.dev) + TypeScript
- [Tailwind CSS](https://tailwindcss.com) v4 for styling
- [Recharts](https://recharts.org) for charts
- [date-fns](https://date-fns.org) for date utilities
- localStorage for data persistence (no backend needed)

## Build

```bash
npm run build
```

Output goes to `dist/` — can be deployed to any static hosting.

## Data

All training data is stored in your browser's localStorage. Use the **Export** button to download a JSON backup, and **Import** to restore it on another device or after clearing browser data.
