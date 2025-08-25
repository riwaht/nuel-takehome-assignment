
# SupplySight Dashboard – Development Notes

## Overview
Inventory management dashboard built with **React, Tailwind, and GraphQL**. Provides KPI tracking, charts, filtering, and mobile responsiveness.

## Frontend
- **React + Vite** for fast development and hot reload  
- **Tailwind 3.4** (downgraded from 4.x due to PostCSS issues)  
- **Recharts** for stock vs demand visualization  
- **UI Decisions**:  
  - Mobile-first responsive design  
  - Sticky top bar and filters  
  - Color-coded status (Healthy/Low/Critical)  
  - Drawer for product details and actions  
- **UX Enhancements**:  
  - Toast notifications instead of alerts  
  - Dark mode fixes (contrast, borders)  
  - Keyboard navigation, ARIA labels, focus trapping  
  - Table polish: alternating rows, tooltips, row highlighting  
  - Inline form validation with error messages  

## Backend
- **Apollo Server (mock)** simulates GraphQL API  
- **Apollo Client 3.10** (avoided 4.x due to import errors)  
- In-memory data store with resolvers for filtering, mutations, and KPI calculations  
- **Business Logic**:  
  - Fill Rate = `(Σ min(stock, demand) / Σ demand) × 100`  
  - Status rules = Healthy (stock > demand), Low (=), Critical (<)  
  - Optimistic mutations for instant UI updates  

## Challenges & Fixes
- Tailwind 4.x PostCSS incompatibility → downgraded to 3.4  
- Apollo 4.x ES module errors → used 3.10  
- Drawer responsiveness on mobile → custom breakpoints and touch handling  

## Testing & Quality
- Unit tests for KPI and status logic  
- Zero console logs in production  
- Type safety enforced, no `any` types  

## Performance
- Pagination (10 rows/page) to reduce DOM size  
- Apollo caching minimizes requests  
- Component-level loading states to prevent layout shift  
- Planned: virtual scrolling, code splitting, WebSocket live sync  

# Future Improvements

## Data & Scenarios
- **What-If Sandbox**: Simulate demand spikes or transfers against a cloned dataset, compare KPIs to live values.  
  *Tech*: `Scenario` tables in Postgres, Prisma migrations, resolvers scoped by `scenarioId`.

- **Scenario Planner**: Save multiple “scenarios” (e.g., surge demand, supply delay) and switch between them.  
  *Tech*: same schema as sandbox, UI toggle between live and scenario contexts.

## Access & Permissions
- **Warehouse Scopes**: Users only see assigned warehouses, auditors get time-boxed access.  
  *Tech*: RBAC with role/permission tables, row-level filters in GraphQL resolvers, JWT claims for warehouse IDs.

## Business Rules
- **Health Rules Engine**: Define custom thresholds (e.g., Critical if stock < 1.2×7-day demand).  
  *Tech*: store JSON logic or CEL expressions, evaluate in resolvers, cache compiled rules.

## Data Integrity
- **Audit & Rollback**: View inventory as of any past date, undo erroneous transfers.  
  *Tech*: append-only `InventoryLedger`, window queries for point-in-time state, rollback via compensating transaction.
