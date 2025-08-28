# SupplySight Dashboard – Development Notes

## Overview  
Inventory management dashboard built with **React, Tailwind, and GraphQL**. Includes KPI tracking, predictive analytics, interactive visualizations, and mobile-ready design.

## Frontend  
- **React + Vite** for speed, **Tailwind 3.4** for styling  
- **Recharts** for stock/demand trends  
- **Key Features**:  
  - Predictive stock-out alerts with confidence scoring  
  - Warehouse heatmap with click-to-filter  
  - QuickActions floating toolbar (export, bulk ops, presets)  
  - Virtualized tables for large datasets  
- **UX**: responsive, sticky filters, color-coded status, accessible drawer, toasts, dark mode, keyboard navigation

## Backend  
- **Apollo Server (mock)** + **Apollo Client 3.10**  
- In-memory resolvers for filtering, KPIs, mutations  
- **Business Logic**: Fill Rate, status (Healthy/Low/Critical), optimistic UI updates  
- **Note**: Demand values assumed monthly; disclaimer added. Production fix = `demandPeriod` field or historical data

## Challenges & Fixes  
- Tailwind 4.x incompatibility → downgraded  
- Apollo 4.x import issues → stayed on 3.10  
- Mobile drawer issues → custom breakpoints  
- Demand ambiguity → explicit monthly assumption + user disclaimer  

## Performance  
- Virtualized scrolling + pagination  
- Apollo caching with optimistic responses  
- Debounced search (250ms)  
- React.memo, useMemo/useCallback, skeleton loading states  
- Planned: code splitting, WebSocket sync  

## Advanced Features  
- **Predictive Engine**: days-until-empty, overstock detection, alert thresholds  
- **Stock Heatmap**: warehouse health (Critical/Low/Healthy/Excellent)  
- **QuickActions Toolbar**: draggable, adaptive layout, smart tooltips  
- **Layout**: vertical flow, balanced grid, aligned panels  

## Future Improvements  
- **What-If Sandbox**: clone data, test spikes or transfers  
- **Scenario Planner**: save and switch between demand/supply cases  
- **Warehouse Scopes**: RBAC limiting users to specific sites  
- **Health Rules Engine**: custom thresholds via JSON logic/CEL  
- **Audit & Rollback**: ledger-based history with point-in-time views  