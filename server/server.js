import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

// GraphQL Schema
const typeDefs = `
  type Warehouse {
    code: ID!
    name: String!
    city: String!
    country: String!
  }

  type Product {
    id: ID!
    name: String!
    sku: String!
    warehouse: String!
    stock: Int!
    demand: Int!
  }

  type KPI {
    date: String!
    stock: Int!
    demand: Int!
  }

  type Query {
    products(search: String, status: String, warehouse: String): [Product!]!
    warehouses: [Warehouse!]!
    kpis(range: String!): [KPI!]!
  }

  type Mutation {
    updateDemand(id: ID!, demand: Int!): Product!
    transferStock(id: ID!, from: String!, to: String!, qty: Int!): Product!
  }
`;

// Mock Data
const warehouses = [
  { code: "BLR-A", name: "Bangalore Alpha", city: "Bangalore", country: "India" },
  { code: "PNQ-C", name: "Pune Central", city: "Pune", country: "India" },
  { code: "DEL-B", name: "Delhi Beta", city: "New Delhi", country: "India" },
  { code: "MUM-D", name: "Mumbai Delta", city: "Mumbai", country: "India" }
];

let products = [
  { "id": "P-1001", "name": "12mm Hex Bolt", "sku": "HEX-12-100", "warehouse": "BLR-A", "stock": 180, "demand": 120 },
  { "id": "P-1002", "name": "Steel Washer", "sku": "WSR-08-500", "warehouse": "BLR-A", "stock": 50, "demand": 80 },
  { "id": "P-1003", "name": "M8 Nut", "sku": "NUT-08-200", "warehouse": "PNQ-C", "stock": 80, "demand": 80 },
  { "id": "P-1004", "name": "Bearing 608ZZ", "sku": "BRG-608-50", "warehouse": "DEL-B", "stock": 24, "demand": 120 },
  { "id": "P-1005", "name": "Stainless Steel Bolt", "sku": "SSB-10-75", "warehouse": "BLR-A", "stock": 200, "demand": 150 },
  { "id": "P-1006", "name": "Rubber Gasket", "sku": "RGS-20-100", "warehouse": "MUM-D", "stock": 45, "demand": 60 },
  { "id": "P-1007", "name": "Aluminum Rod", "sku": "ALR-16-200", "warehouse": "PNQ-C", "stock": 90, "demand": 90 },
  { "id": "P-1008", "name": "Carbon Steel Pipe", "sku": "CSP-25-150", "warehouse": "DEL-B", "stock": 30, "demand": 100 },
  { "id": "P-1009", "name": "Brass Fitting", "sku": "BFT-12-80", "warehouse": "BLR-A", "stock": 120, "demand": 80 },
  { "id": "P-1010", "name": "PVC Connector", "sku": "PVC-15-120", "warehouse": "MUM-D", "stock": 75, "demand": 75 },
  { "id": "P-1011", "name": "Steel Wire", "sku": "SWR-08-300", "warehouse": "PNQ-C", "stock": 40, "demand": 160 },
  { "id": "P-1012", "name": "Copper Tube", "sku": "CPT-20-180", "warehouse": "DEL-B", "stock": 85, "demand": 70 }
];

// Generate mock KPI data for different ranges
const generateKPIs = (range) => {
  const days = range === '7d' ? 7 : range === '14d' ? 14 : 30;
  const kpis = [];
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Simulate some variation in stock and demand
    const baseStock = products.reduce((sum, p) => sum + p.stock, 0);
    const baseDemand = products.reduce((sum, p) => sum + p.demand, 0);
    
    const stockVariation = Math.floor(Math.random() * 200) - 100;
    const demandVariation = Math.floor(Math.random() * 150) - 75;
    
    kpis.push({
      date: date.toISOString().split('T')[0],
      stock: Math.max(0, baseStock + stockVariation),
      demand: Math.max(0, baseDemand + demandVariation)
    });
  }
  
  return kpis;
};

// Resolvers
const resolvers = {
  Query: {
    products: (_, { search, status, warehouse }) => {
      let filteredProducts = [...products];
      
      // Filter by search
      if (search) {
        const searchLower = search.toLowerCase();
        filteredProducts = filteredProducts.filter(product =>
          product.name.toLowerCase().includes(searchLower) ||
          product.sku.toLowerCase().includes(searchLower) ||
          product.id.toLowerCase().includes(searchLower)
        );
      }
      
      // Filter by warehouse
      if (warehouse && warehouse !== 'all') {
        filteredProducts = filteredProducts.filter(product => product.warehouse === warehouse);
      }
      
      // Filter by status
      if (status && status !== 'all') {
        filteredProducts = filteredProducts.filter(product => {
          const productStatus = product.stock > product.demand ? 'healthy' : 
                               product.stock === product.demand ? 'low' : 'critical';
          return productStatus === status;
        });
      }
      
      return filteredProducts;
    },
    
    warehouses: () => warehouses,
    
    kpis: (_, { range }) => generateKPIs(range)
  },
  
  Mutation: {
    updateDemand: (_, { id, demand }) => {
      const product = products.find(p => p.id === id);
      if (!product) {
        throw new Error(`Product with id ${id} not found`);
      }
      
      product.demand = demand;
      return product;
    },
    
    transferStock: (_, { id, from, to, qty }) => {
      const product = products.find(p => p.id === id);
      if (!product) {
        throw new Error(`Product with id ${id} not found`);
      }
      
      if (product.warehouse !== from) {
        throw new Error(`Product is not in warehouse ${from}`);
      }
      
      if (product.stock < qty) {
        throw new Error(`Insufficient stock. Available: ${product.stock}, Requested: ${qty}`);
      }
      
      // Update the product's warehouse and stock
      product.warehouse = to;
      // For simplicity, we'll keep the same stock level after transfer
      // In a real system, this would involve more complex logic
      
      return product;
    }
  }
};

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const PORT = 4000;

// Start the server using the standalone server
const { url } = await startStandaloneServer(server, {
  listen: { port: PORT },
  context: async () => {
    return {};
  },
});

console.log(`🚀 GraphQL Server ready at ${url}`);
