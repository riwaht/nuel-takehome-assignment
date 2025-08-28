# SupplySight Dashboard

A prototype inventory dashboard with KPIs, predictive analytics, and interactive visualizations. Built with React, GraphQL, and Tailwind.

## Features
- KPIs for stock, demand, and fill rate  
- Stock vs demand charts with 7/14/30-day ranges  
- Predictive alerts for stock-outs and reorders  
- Warehouse heatmap with click-to-filter  
- Virtualized tables for large datasets  
- Draggable toolbar with quick actions and exports  
- Responsive design with dark mode and accessibility

## Quick Start
1. Clone repo and install
   ```bash
   git clone <repository-url>
   cd nuel-takehome-assignment
   npm install
   ```
2. Run both servers
   ```bash
   npm run dev:full
   ```
   Or separately: `npm run server` and `npm run dev`

3. Open in browser  
   - Frontend: http://localhost:5173  
   - GraphQL Playground: http://localhost:4000  

## Architecture
- Frontend: React 19 + Vite, TypeScript, Tailwind 3.4  
- Backend: Apollo Server, Express.js, in-memory data  
- UI: Recharts, Lucide React, custom hooks (debounce, focus trap, virtualization)

## Limitations
- Demand values assumed monthly (documented)  
- In-memory storage resets on restart  
- No authentication or RBAC  
- Prototype scale, not production-ready  

See DEV_NOTES.md for design decisions and production gaps.
