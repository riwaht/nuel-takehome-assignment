# SupplySight Dashboard – Development Notes

## Overview  
Built a React + Tailwind + GraphQL dashboard for inventory management. Focused on KPIs, predictive analytics, visualizations, and responsive design.

### Frontend  
React with Vite for fast iteration and Tailwind 3.4 for styling (4.x had PostCSS issues). Recharts powers the stock vs demand trends.  
The layout follows a vertical flow: KPIs, chart, filters, then a product table. Enhancements include predictive stock-out alerts, a warehouse heatmap, a floating QuickActions toolbar, and virtualized tables for large datasets.  
UX refinements: sticky filters, color-coded statuses, an accessible drawer, toast notifications, dark mode, and keyboard navigation.

### Backend  
A mock Apollo Server provides GraphQL queries and mutations. Apollo Client 3.10 handles caching and optimistic updates (4.x had import issues).  
Business rules:  
- Fill rate = (Σ min(stock, demand) / Σ demand) × 100  
- Status logic: Healthy, Low, or Critical  
Demand values were ambiguous, so I assumed monthly demand and added a disclaimer. A production system would include a `demandPeriod` field or historical data.

### Challenges and Fixes  
- Tailwind 4.x and Apollo 4.x caused compatibility issues → downgraded both  
- Mobile drawer broke layouts → fixed with custom breakpoints  
- Demand ambiguity → documented assumption and surfaced it to users  

### Performance  
Virtualized scrolling handles 500+ rows smoothly. Apollo caching with `previousData` avoids flicker. A 250ms debounce on search reduces extra queries. Skeleton loaders prevent layout shifts. Memoization (`useMemo`, `useCallback`) keeps renders efficient.  
Future work: code splitting, WebSocket sync, service worker caching.

### Advanced Features  
- Predictive engine for days-until-empty and overstock alerts  
- Heatmap showing warehouse health with click-to-filter  
- QuickActions toolbar with draggable, adaptive layout and bulk actions  
- Grid layout aligning analytics and tables consistently  

### Production Gaps  
Prototype works, but production would require:  
- Security: JWT auth with RBAC, MFA, GraphQL query limits  
- Database: PostgreSQL schema with ACID transactions, migrations, backups  
- Infrastructure: Docker/Kubernetes, CI/CD, health checks, IaC configs  
- Monitoring: structured logs, metrics, alerts, error boundaries  
- Testing: unit, integration, E2E, contract tests, accessibility checks  
- Compliance: GDPR handling, audit trails, ERP/WMS integration  

### Future Improvements  
- What-if sandbox for simulating demand spikes or transfers  
- Scenario planner to save and compare different supply/demand cases  
- Warehouse scopes for restricted role-based access  
- Health rules engine for configurable thresholds  
- Audit and rollback with append-only ledger and point-in-time queries  