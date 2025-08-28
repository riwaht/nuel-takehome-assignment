
# SupplySight Dashboard – Development Notes

## Overview
Advanced inventory management dashboard built with **React, Tailwind, and GraphQL**. Features KPI tracking, AI-powered predictions, interactive visualizations, and comprehensive supply chain management tools.

## Frontend
- **React + Vite** for fast development and hot reload  
- **Tailwind 3.4** (downgraded from 4.x due to PostCSS issues)  
- **Recharts** for stock vs demand visualization  
- **Advanced Components**:
  - **Predictive Insights**: AI-powered stock-out forecasting with confidence scoring
  - **Stock Heatmap**: Interactive warehouse visualization with click-to-filter
  - **QuickActions Toolbar**: Draggable FAB with circular/linear action buttons
  - **Virtualized Tables**: Performance-optimized scrolling for large datasets
  - **Smart Tooltips**: Dynamic positioning with collision detection
- **UI Decisions**:  
  - Mobile-first responsive design  
  - Sticky top bar and filters  
  - Color-coded status (Healthy/Low/Critical)  
  - Drawer for product details and actions  
  - Clean vertical dashboard layout with optimal information density
- **UX Enhancements**:  
  - Toast notifications with contextual messaging
  - Dark mode support with proper contrast ratios
  - Keyboard navigation, ARIA labels, focus trapping  
  - Table polish: alternating rows, tooltips, row highlighting  
  - Inline form validation with real-time feedback
  - Drag-and-drop interactions with visual feedback

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
- **Virtualized Scrolling**: Implemented for large product datasets (500+ items)
- **Smart Pagination**: Default 10 rows/page with toggle for virtual mode
- **Apollo Caching**: Minimizes GraphQL requests and enables optimistic updates
- **Component Optimization**: 
  - React.memo for expensive components
  - useMemo/useCallback for heavy calculations
  - RequestAnimationFrame for smooth animations
- **Loading States**: Skeleton components prevent layout shifts
- **Debounced Search**: 250ms delay reduces API calls
- **Planned**: Code splitting, WebSocket live sync, service worker caching

## Advanced Features Implemented

### Predictive Analytics Engine
- **Algorithm**: Daily demand calculation (monthly demand ÷ 30)
- **Stock-out Prediction**: Real-time days-until-empty calculations
- **Confidence Scoring**: Dynamic confidence levels (60-95%) based on urgency
- **Business Rules**:
  - Critical: ≤7 days stock remaining (red alerts)
  - Warning: 8-14 days remaining (yellow alerts)  
  - Opportunity: Overstock detection (green suggestions)
- **Warehouse Context**: Performance scoring affects recommendation confidence

### Interactive Stock Heatmap
- **Visual Health Scoring**: Color-coded warehouse performance (0-120% scale)
- **Click-to-Filter**: Click any cell to filter products by warehouse
- **Status Categories**: Critical (<80%), Low (80-99%), Healthy (100-119%), Excellent (≥120%)
- **Real-time Updates**: Reflects current inventory levels instantly

### QuickActions Floating Toolbar
- **Draggable Interface**: Smooth drag-and-drop positioning with momentum
- **Adaptive Layout**: Circular layout (center screen) vs linear layout (near edges)
- **Smart Positioning**: Per-button viewport collision detection
- **Tooltip System**: Dynamic placement prevents screen overflow
- **Action Menu**: Export (CSV/JSON), bulk transfer, reorder suggestions, filter presets

### Enhanced Dashboard Layout
- **Information Architecture**: Optimized 5-row vertical layout
- **Responsive Grid**: Balanced two-column analytics section
- **Height Matching**: Predictive insights and heatmap panels align perfectly
- **Clean Hierarchy**: KPIs → Charts → Analytics → Search → Table flow

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
