# SupplySight Dashboard

A modern inventory management dashboard built for supply chain professionals. Track stock levels, monitor demand patterns, and manage warehouse operations in real-time.

![Dashboard Features](https://img.shields.io/badge/Features-KPI_Cards,_Charts,_Filters,_Mobile_Responsive-blue)
![Tech Stack](https://img.shields.io/badge/Stack-React_+_Tailwind_+_GraphQL-green)

## ✨ Key Features

- **📊 Real-time KPIs**: Total Stock, Demand, and Fill Rate calculations
- **📈 Interactive Charts**: Stock vs Demand trends with date range selection
- **🔍 Advanced Filtering**: Search by name/SKU, filter by warehouse and status
- **📱 Mobile Responsive**: Fully optimized for phones, tablets, and desktop
- **⚡ Live Updates**: Instant UI updates when modifying demand or transferring stock
- **🎨 Modern Design**: Clean, professional interface with smooth animations

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+** (check with `node --version`)
- **npm** or **yarn**

### Installation & Setup

1. **Clone and navigate to the project**
   ```bash
   git clone <repository-url>
   cd nuel-takehome-assignment
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start both servers** (recommended)
   ```bash
   npm run dev:full
   ```
   
   Or run separately in two terminals:
   ```bash
   # Terminal 1 - GraphQL Server
   npm run server
   
   # Terminal 2 - React App  
   npm run dev
   ```

4. **Open the dashboard**
   - **Frontend**: http://localhost:5173
   - **GraphQL Playground**: http://localhost:4000

## 🎯 How to Use

1. **View KPIs**: See total stock, demand, and fill rate at the top
2. **Analyze Trends**: Use the date range dropdown (7d/14d/30d) to view stock vs demand charts
3. **Filter Products**: Search by name/SKU or filter by warehouse/status
4. **Manage Inventory**: Click any product row to update demand or transfer stock between warehouses
5. **Mobile Access**: Use on your phone - the interface adapts perfectly

## 🛠 Available Commands

| Command | Purpose |
|---------|---------|
| `npm run dev:full` | Start both GraphQL server and React app |
| `npm run dev` | Start React development server only |
| `npm run server` | Start GraphQL server only |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

## 🔧 Troubleshooting

### Common Issues & Solutions

#### ❌ "Port 4000 already in use"
```bash
# Kill the process using port 4000
npx kill-port 4000
# or
lsof -ti:4000 | xargs kill -9

# Then restart
npm run server
```

#### ❌ "Port 5173 already in use"
**Solution**: Vite will automatically try port 5174, 5175, etc. Check the terminal output for the correct port.

#### ❌ GraphQL/Apollo Client errors
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

#### ❌ Tailwind CSS not loading
```bash
# Clear Vite cache and restart
rm -rf node_modules/.vite
npm run dev
```

#### ❌ "Module not found" errors
1. Ensure you're in the correct directory: `cd nuel-takehome-assignment`
2. Reinstall dependencies: `npm install`
3. Check Node.js version: `node --version` (need 18+)

#### ❌ Blank white screen
1. Check browser console for errors
2. Ensure both servers are running (ports 4000 and 5173)
3. Try refreshing or opening in an incognito window

### Development Tips

- **Hot Reload**: Changes to React components update instantly
- **GraphQL Playground**: Visit http://localhost:4000 to test queries
- **Mobile Testing**: Use browser dev tools' device simulation
- **Network Tab**: Check if API calls are working in browser dev tools

## 📊 Sample Data

The dashboard comes with 12 sample products across 4 warehouses:
- **Products**: Hex bolts, steel washers, nuts, bearings, fittings, etc.
- **Warehouses**: Bangalore (BLR-A), Pune (PNQ-C), Delhi (DEL-B), Mumbai (MUM-D)
- **Statuses**: Mix of Healthy, Low, and Critical inventory levels

## 🏗 Architecture

- **Frontend**: React 19 + Vite + Tailwind CSS 3.4
- **Backend**: Apollo Server + GraphQL + Express
- **Data**: In-memory store with realistic supply chain data
- **Charts**: Recharts for interactive visualizations
- **Icons**: Lucide React for consistent iconography

## 📱 Browser Support

- **Chrome/Edge**: 88+
- **Firefox**: 85+  
- **Safari**: 14+
- **Mobile**: iOS Safari 14+, Android Chrome 88+

## 🚢 Production Deployment

For production use:
1. Replace mock data with a real database
2. Add authentication and authorization
3. Implement server-side filtering and pagination
4. Set up proper error monitoring
5. Configure HTTPS and security headers

---

**Need help?** Check the [NOTES.md](NOTES.md) file for detailed technical decisions and development insights.

Built with ❤️ for modern supply chain management.