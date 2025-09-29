# Bookshelf — Vue 3 + Vite

A simple Bookshelf app built with Vue 3, TypeScript, Pinia, Vue Router, Vite, and Tailwind CSS. It ships with a mock API powered by `json-server`.

## Prerequisites

- **Node.js**: ^20.19.0 or >=22.12.0 (as defined in `package.json` engines)
- **npm**: comes with Node.js

Verify versions:

```bash
node -v
npm -v
```

## Install dependencies

```bash
npm install
```

## Environment configuration

The frontend reads the API base URL from an environment variable:

- `VITE_API_BASE_URL`

Create a local env file from the example and adjust as needed:

```bash
cp .env.example .env
```

Default value in the example points to the mock API: `http://localhost:3001`.

## Development

Run the mock API (json-server):

```bash
npm run mock:api
```

This serves REST endpoints from `db.json` at `http://localhost:3001`.

Run the frontend dev server (Vite):

```bash
npm run dev
```

By default Vite serves the app on `http://localhost:5173`.

You can run both in separate terminals. The app will use the URL configured in `VITE_API_BASE_URL`.

### Mock API endpoints

- **GET** `/books`
- **GET** `/books/:id`
- **POST** `/books`
- **PUT** `/books/:id`
- **DELETE** `/books/:id`

Data lives in `db.json`. Changes via the API will be written back to that file.

## Scripts

- `npm run dev`: start Vite dev server
- `npm run mock:api`: start json-server at `http://localhost:3001` with simulated latency
- `npm run build`: type-check then build for production
- `npm run preview`: preview the production build locally
- `npm run type-check`: run `vue-tsc --build`
- `npm run lint`: run ESLint with auto-fix
- `npm run format`: format `src/` with Prettier

## Build

Create a production build:

```bash
npm run build
```

The output will be in `dist/`.

Preview the build locally:

```bash
npm run preview
```

## Configuration notes

- **API base URL**: set `VITE_API_BASE_URL` (e.g., `http://localhost:3001`).
  - Use Vite env files (`.env`, `.env.local`) and access via `import.meta.env.VITE_API_BASE_URL`.
- **Aliases**: `@` resolves to `src/` (see `vite.config.ts`).
- **Styling**: Tailwind CSS is enabled via `@tailwindcss/vite`.

## Project structure (high level)

- `src/`
  - `views/`: route views (list, detail, new, edit)
  - `components/`: reusable UI components (tables, forms, modals, toast)
  - `services/`: API facades (`ApiFacade.ts`, `BooksFacade.ts`)
  - `stores/`: Pinia stores
  - `router/`: Vue Router setup
  - `types/`: TypeScript types (e.g., `book.ts`)
  - `constraints/`: form validation helpers
  - `utils/`: utilities (debounce, toast)
- `db.json`: seed data for json-server

## Troubleshooting

- **Port conflicts**:
  - If `5173` is taken, Vite will prompt to use another port; update any external references if needed.
  - If `3001` is taken, change the mock API port in the `mock:api` script and update `VITE_API_BASE_URL`.
- **CORS issues**: Ensure the mock server is running at the URL configured in `VITE_API_BASE_URL`.
- **Type errors**: Run `npm run type-check` for diagnostics.

## License

This project is for educational/demo purposes.
