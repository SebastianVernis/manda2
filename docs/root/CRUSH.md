# Manda2 Platform Development Guide

## Build/Test Commands
```bash
# Frontend (cd frontend/)
npm run dev                 # Development server (port 3000)
npm run build              # Production build
npm run lint               # ESLint check
npm test                   # Run all tests
npm run test:watch         # Watch mode testing
npm run test:coverage      # Test coverage report
npx vitest run [pattern]   # Run specific test

# Backend (cd backend/)
npm run dev                # Development with nodemon
npm start                  # Production server (port 5000)
npm run lint               # ESLint backend code

# Full deployment
pm2 start ecosystem.config.js  # Start both services
pm2 status                      # Check status
```

## Code Style Guidelines

**Components:** PascalCase files/exports, organize by role (Cliente/, Admin/, modern/, ui/)
**Variables:** camelCase, Spanish business terms (tienda, repartidor, cliente)
**Imports:** React first, external libs, internal hooks/context, components
**State:** Custom hooks for reusable logic, Context for global state
**Error Handling:** Try-catch with `{ success, error, data }` objects + toast notifications
**Styling:** Bootstrap + Tailwind hybrid, custom `manda2-` prefixed classes
**API:** Centralized apiClient, async/await pattern throughout
**Testing:** Vitest + Testing Library, test files in `__tests__/` folders

Use default exports for components, arrow functions preferred, proper dependency arrays in useEffect.