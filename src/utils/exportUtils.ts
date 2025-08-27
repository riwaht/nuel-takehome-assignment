import { Product, Warehouse } from '../types';

/**
 * Export products data to CSV format
 */
export const exportToCSV = (products: Product[], filename = 'inventory-data.csv') => {
  const headers = ['ID', 'Name', 'SKU', 'Warehouse', 'Stock', 'Demand', 'Status', 'Fill Rate'];
  
  const csvContent = [
    headers.join(','),
    ...products.map(product => {
      const status = product.stock > product.demand ? 'Healthy' : 
                    product.stock === product.demand ? 'Low' : 'Critical';
      const fillRate = product.demand > 0 ? 
                      ((Math.min(product.stock, product.demand) / product.demand) * 100).toFixed(1) : 
                      '100';
      
      return [
        `"${product.id}"`,
        `"${product.name}"`,
        `"${product.sku}"`,
        `"${product.warehouse}"`,
        product.stock,
        product.demand,
        status,
        `${fillRate}%`
      ].join(',');
    })
  ].join('\n');

  downloadFile(csvContent, filename, 'text/csv');
};

/**
 * Export products data to JSON format
 */
export const exportToJSON = (products: Product[], warehouses: Warehouse[], filename = 'inventory-data.json') => {
  const enrichedProducts = products.map(product => {
    const warehouse = warehouses.find(w => w.code === product.warehouse);
    const status = product.stock > product.demand ? 'Healthy' : 
                  product.stock === product.demand ? 'Low' : 'Critical';
    const fillRate = product.demand > 0 ? 
                    ((Math.min(product.stock, product.demand) / product.demand) * 100) : 
                    100;
    
    return {
      ...product,
      status,
      fillRate: Math.round(fillRate * 10) / 10, // Round to 1 decimal
      warehouseInfo: warehouse ? {
        name: warehouse.name,
        city: warehouse.city,
        country: warehouse.country
      } : null
    };
  });

  const exportData = {
    exportDate: new Date().toISOString(),
    totalProducts: products.length,
    totalWarehouses: warehouses.length,
    summary: {
      totalStock: products.reduce((sum, p) => sum + p.stock, 0),
      totalDemand: products.reduce((sum, p) => sum + p.demand, 0),
      criticalProducts: products.filter(p => p.stock < p.demand).length,
      healthyProducts: products.filter(p => p.stock > p.demand).length
    },
    products: enrichedProducts
  };

  const jsonContent = JSON.stringify(exportData, null, 2);
  downloadFile(jsonContent, filename, 'application/json');
};

/**
 * Get reorder suggestions based on current stock levels
 */
export const getReorderSuggestions = (products: Product[]): Product[] => {
  return products
    .filter(product => product.stock < product.demand)
    .sort((a, b) => {
      // Sort by severity (lowest fill rate first)
      const fillRateA = a.demand > 0 ? (a.stock / a.demand) : 1;
      const fillRateB = b.demand > 0 ? (b.stock / b.demand) : 1;
      return fillRateA - fillRateB;
    });
};

/**
 * Get products that can be transferred (have excess stock)
 */
export const getTransferCandidates = (products: Product[]): Product[] => {
  return products
    .filter(product => product.stock > product.demand)
    .sort((a, b) => {
      // Sort by excess stock (highest excess first)
      const excessA = a.stock - a.demand;
      const excessB = b.stock - b.demand;
      return excessB - excessA;
    });
};

/**
 * Analyze warehouse efficiency
 */
export const getWarehouseAnalysis = (products: Product[], warehouses: Warehouse[]) => {
  return warehouses.map(warehouse => {
    const warehouseProducts = products.filter(p => p.warehouse === warehouse.code);
    const totalStock = warehouseProducts.reduce((sum, p) => sum + p.stock, 0);
    const totalDemand = warehouseProducts.reduce((sum, p) => sum + p.demand, 0);
    const fillRate = totalDemand > 0 ? ((totalStock / totalDemand) * 100) : 100;
    const criticalCount = warehouseProducts.filter(p => p.stock < p.demand).length;
    
    return {
      ...warehouse,
      productCount: warehouseProducts.length,
      totalStock,
      totalDemand,
      fillRate: Math.round(fillRate * 10) / 10,
      criticalCount,
      status: fillRate >= 100 ? 'healthy' : fillRate >= 80 ? 'warning' : 'critical'
    };
  });
};

/**
 * Helper function to download a file
 */
const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};
