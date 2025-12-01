# Repository Guidelines

## Project Structure & Module Organization
- Root: `index.html`, `vite.config.js`, `.env` (use `.env.example` as template).
- Source: `src/`
  - `pages/` (role-based views like `Admin/`, `Tienda/`, `Cliente/`, `Repartidor/`, plus `Home.jsx`, `Login.jsx`, `Register.jsx`, `VerifyOTP.jsx`).
  - `components/` (UI pieces: `Navbar.jsx`, `Footer.jsx`, `OTPInput.jsx`, etc.).
  - `services/` (`apiClient.js` for Axios and API helpers).
  - `context/` (`AuthContext.jsx` for auth state).
  - `styles/` (`global.css`).
  - `utils/`, `hooks/` for shared helpers and hooks.

## Build, Test, and Development Commands
- `npm run dev`: Start local dev server (Vite) at localhost.
- `npm run build`: Production build to `dist/`.
- `npm run preview`: Preview the production build locally.
- `npm run lint`: Run ESLint on `js`/`jsx` files and fail on warnings.

## Coding Style & Naming Conventions
- Language: ES Modules + React 18 (JSX), React Router, React Query.
- Indentation: 2 spaces; use single quotes; avoid semicolons to match existing code.
- Components and pages: PascalCase filenames (e.g., `MyComponent.jsx`).
- Hooks: prefix with `use` (e.g., `useAuth`); utilities in `src/utils` use camelCase.
- Linting: ESLint with `react`, `react-hooks`, and `react-refresh` plugins. Fix issues before committing.

## Testing Guidelines
- No test framework is configured yet. If adding tests, prefer Vitest + React Testing Library.
- Place tests alongside files as `*.test.jsx` or under `src/__tests__/`.
- Aim for meaningful unit tests of components, hooks, and services.

## Commit & Pull Request Guidelines
- Commits: Use Conventional Commits (e.g., `feat: add OTP input`, `fix: handle 401 in apiClient`). Keep scope small and messages imperative.
- Branches: `feature/<short-scope>`, `fix/<short-scope>`, `chore/<short-scope>`.
- PRs: Include clear description, linked issues, and screenshots/GIFs for UI changes. Note env/config impacts. Ensure `npm run lint` passes and builds locally.

## Security & Configuration Tips
- Use Vite env vars with `VITE_` prefix. Copy `.env.example` → `.env` and never commit secrets.
- Key vars: `VITE_API_URL`, `VITE_GOOGLE_MAPS_API_KEY`, `VITE_APP_NAME`, `VITE_DEBUG`.
- Avoid hardcoding URLs/keys; read from `import.meta.env`.
