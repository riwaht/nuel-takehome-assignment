# SupplySight Dashboard

An advanced AI-powered inventory management dashboard built for supply chain professionals. Features predictive analytics, interactive visualizations, and comprehensive warehouse management tools.

## ✨ Core Features

### 📊 Real-Time Analytics
- **Smart KPIs**: Total Stock, Demand, and Fill Rate with live calculations  
- **Interactive Charts**: Stock vs demand trends with 7/14/30-day range selection  
- **Advanced Filtering**: Search with autocomplete, warehouse and status filtering  

### 🔮 AI-Powered Predictions
- **Predictive Insights**: Stock-out forecasting with confidence scoring
- **Business Intelligence**: Critical alerts, reorder suggestions, and optimization opportunities
- **Risk Assessment**: Automated urgency classification and timeline predictions

### 🗺️ Visual Management
- **Stock Heatmap**: Interactive warehouse visualization with click-to-filter
- **Color-Coded Health**: Instant visual status across all locations
- **Performance Metrics**: Warehouse efficiency scoring and comparison

### ⚡ Enhanced Interactions
- **Draggable Toolbar**: Floating action buttons with smart positioning
- **Virtualized Tables**: High-performance scrolling for large datasets
- **Smart Tooltips**: Dynamic positioning prevents screen overflow
- **Responsive Design**: Optimized for phones, tablets, and desktop

### 🔧 Professional Tools
- **Live Updates**: Modify demand or transfer stock with immediate UI updates  
- **Data Export**: CSV/JSON export with warehouse context
- **Bulk Operations**: Multi-product transfers and batch updates
- **Modern UX**: Clean interface with animations, dark mode, and accessibility features

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

## 🚀 How to Use

### Dashboard Navigation
1. **KPI Overview**: View total stock, demand, and fill rate at the top
2. **Trend Analysis**: Select 7/14/30-day ranges to analyze stock vs demand patterns
3. **Predictive Insights**: Review AI recommendations in the left analytics panel
4. **Warehouse Heatmap**: Click any colored cell to filter by warehouse location

### Advanced Interactions
5. **Smart Search**: Use the search bar with real-time filtering by name, SKU, or ID
6. **Quick Actions**: Drag the floating blue button anywhere on screen for quick tools
7. **Product Management**: Click any product row for detailed management options
8. **Data Export**: Use the floating toolbar to export filtered data as CSV or JSON

### Performance Features
9. **Large Datasets**: Toggle virtualized scrolling for 500+ products
10. **Mobile Optimized**: Full functionality on phones, tablets, and desktop

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

## 🏗️ Architecture

### Frontend Stack
- **React 19** + **Vite** for blazing fast development
- **TypeScript** for type safety and better DX
- **Tailwind CSS 3.4** for utility-first styling
- **Apollo Client** for GraphQL state management

### Backend Services  
- **Apollo Server** with GraphQL schema
- **Express.js** server with CORS support
- **In-memory data store** with realistic supply chain data

### UI Libraries
- **Recharts** for interactive analytics charts
- **Lucide React** for consistent iconography  
- **Custom Components** for specialized supply chain UX

### Advanced Features
- **Predictive Analytics Engine** with confidence scoring
- **Virtual Scrolling** for large dataset performance
- **Drag & Drop Interface** with collision detection
- **Real-time Calculations** with optimized memoization

## Deployment Notes

For production use:
1. Replace mock data with a real database  
2. Add authentication and authorization  
3. Implement server-side filtering and pagination  
4. Set up error monitoring and HTTPS  

---

See NOTES.md for details on technical decisions and trade-offs.