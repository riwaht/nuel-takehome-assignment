# SupplySight Dashboard – Development Notes

Repository: [github.com/riwaht/nuel-takehome-assignment](https://github.com/riwaht/nuel-takehome-assignment)

## Overview  
Built a React + Tailwind + GraphQL dashboard for inventory management. The focus was on KPIs, predictive analytics, visualizations, and a responsive design. My goal was to get a working prototype with complete business logic and realistic features, rather than polishing every detail of the UX.

### Frontend  
React with Vite was used for quick iteration and Tailwind 3.4 for styling since 4.x caused PostCSS issues. Recharts handles the stock vs demand trends.  
The layout follows a vertical flow: KPIs, chart, filters, then a product table. I added predictive stock-out alerts, a warehouse heatmap, a floating QuickActions toolbar, and virtualized tables for larger datasets.  
On the UX side I implemented sticky filters, color-coded statuses, a product drawer, toast notifications, dark mode, and keyboard navigation. There are still smaller UX bugs that I would clean up with more time.

### Backend  
A mock Apollo Server provides GraphQL queries and mutations, while Apollo Client 3.10 handles caching and optimistic updates (4.x had import issues).  
The core rules are straightforward:  
- Fill rate = (Σ min(stock, demand) / Σ demand) × 100  
- Status logic: Healthy, Low, or Critical  

Demand values were ambiguous, so I made the assumption that they were monthly and added a disclaimer. In production I would add a `demandPeriod` field or rely on historical data.

### Challenges and Fixes  
During development several challenges came up that shaped the solution. Tailwind 4.x and Apollo 4.x had compatibility issues, so I downgraded both. The drawer layout broke on mobile and required custom breakpoints. The bigger challenge was with the data itself — demand values lacked context, so I had to stop and think about how to handle it consistently. These choices were about getting stable functionality in place, even if it meant leaving polish for later.

### Performance  
Performance was a focus while still building features. Virtualized scrolling handles 500+ rows, Apollo caching with `previousData` avoids flicker, and debounced search reduces extra queries. Skeleton loaders and memoization (`useMemo`, `useCallback`) keep things smooth. With more time I’d work on code splitting, WebSocket sync, and service worker caching. There is also room to optimize UX performance in small ways once the business features are locked down.

### Advanced Features  
Beyond the basics, I implemented a predictive engine for days-until-empty and overstock alerts, a warehouse heatmap with click-to-filter, a draggable QuickActions toolbar with bulk actions and exports, and a consistent grid layout for analytics and tables. These were built to showcase how the system could evolve into a more complete supply chain tool.

### Production Gaps  
This prototype demonstrates the core ideas, but a production system would need more: authentication and RBAC with JWT, a proper PostgreSQL schema with ACID transactions and migrations, Docker/Kubernetes for deployment, monitoring and logging, robust testing from unit to E2E, and compliance features like GDPR handling and audit trails.

### Future Improvements  
With more time I would focus on fixing smaller UX bugs and making the interface smoother. I would also expand performance work to handle production-scale datasets. On the feature side, I see value in a what-if sandbox to simulate spikes or transfers, a scenario planner for comparing supply/demand cases, warehouse scopes for role-based access, a configurable health rules engine, and audit/rollback features with an append-only ledger.

Overall, I prioritized business features and data logic over perfect UX polish in this first pass. The project surfaces real challenges — from compatibility issues to ambiguous data — and shows how those were addressed while keeping the bigger picture in mind.