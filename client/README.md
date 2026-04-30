# Client

This frontend is intentionally small right now so it stays easy to deploy and easy to grow.

## Current structure

- `src/main.tsx`: Vite entry point
- `src/App.tsx`: top-level app shell
- `src/index.css`: global styles
- `src/lib/api.ts`: shared Axios client and token refresh flow

## Why it is small

Folders like `features`, `hooks`, `router`, and `store` were removed because they were empty placeholders. Add them back only when real code needs them.

## Commands

- `npm run dev`: start the local dev server
- `npm run build`: production build
- `npm run lint`: lint the code
