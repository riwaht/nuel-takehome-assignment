# SupplySight Dashboard

A modern inventory management dashboard built for supply chain professionals. Track stock levels, monitor demand patterns, and manage warehouse operations in real time.

## Features

- Real-time KPIs: Total Stock, Demand, and Fill Rate calculations  
- Interactive Charts: Stock vs demand trends with date range selection  
- Filtering: Search with clear button, warehouse and status filtering  
- Responsive: Optimized for phones, tablets, and desktop  
- Live Updates: Modify demand or transfer stock with immediate UI updates  
- Modern Design: Clean interface with drawer animations and dark mode support  
- Accessibility: Keyboard navigation, focus trapping, and ARIA labels  
- Notifications: Toast messages for errors and success states  
- Enhanced Tables: Alternating rows, critical item highlighting, and tooltips for long text  

## Quick Start

### Requirements
- Node.js 18+  
- npm or yarn

### Installation

1. Clone and navigate to the project
   ```bash
   git clone <repository-url>
   cd nuel-takehome-assignment
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start both servers
   ```bash
   npm run dev:full
   ```

   Or run separately:
   ```bash
   npm run server   # GraphQL server
   npm run dev      # React frontend
   ```

4. Open in browser:
   - Frontend: http://localhost:5173  
   - GraphQL Playground: http://localhost:4000  

## How to Use

1. View KPIs at the top of the dashboard  
2. Analyze stock vs demand trends with date range selection  
3. Filter products by name, SKU, warehouse, or status  
4. Click a product row to update demand or transfer stock  
5. Use on mobile or desktop—the layout adapts automatically  

## Available Commands

| Command | Purpose |
|---------|---------|
| `npm run dev:full` | Start both GraphQL server and React app |
| `npm run dev` | Start React dev server only |
| `npm run server` | Start GraphQL server only |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

## Troubleshooting

- **Port 4000 in use**: `npx kill-port 4000` then restart  
- **Port 5173 in use**: Vite will switch automatically to another port  
- **GraphQL or Apollo errors**: Clear cache and reinstall dependencies  
- **Tailwind CSS not loading**: Clear Vite cache and restart  
- **Blank screen**: Check console for errors and ensure both servers are running  

## Sample Data

The project includes sample products and warehouses to demonstrate functionality. Inventory levels include healthy, low, and critical states.

## Architecture

- Frontend: React 19, Vite, Tailwind CSS  
- Backend: Apollo Server, GraphQL, Express  
- Data: In-memory store with realistic seed data  
- Charts: Recharts  
- Icons: Lucide React  

## Deployment Notes

For production use:
1. Replace mock data with a real database  
2. Add authentication and authorization  
3. Implement server-side filtering and pagination  
4. Set up error monitoring and HTTPS  

---

See NOTES.md for details on technical decisions and trade-offs.