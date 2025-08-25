import { Product } from '../../types';

// Extract the KPI calculation logic for testing
export const calculateKPIs = (products: Product[]) => {
  const totalStock = products.reduce((sum, product) => sum + product.stock, 0);
  const totalDemand = products.reduce((sum, product) => sum + product.demand, 0);
  const fillRate = totalDemand > 0 
    ? ((products.reduce((sum, product) => sum + Math.min(product.stock, product.demand), 0) / totalDemand) * 100)
    : 0;

  return {
    totalStock,
    totalDemand,
    fillRate
  };
};

// Test helper to create mock products
const createMockProduct = (id: string, stock: number, demand: number): Product => ({
  id,
  name: `Product ${id}`,
  sku: `SKU-${id}`,
  warehouse: 'TEST',
  stock,
  demand
});

describe('KPI Calculations', () => {
  describe('calculateKPIs', () => {
    it('should return 0 fill rate when demand is 0', () => {
      const products = [
        createMockProduct('1', 100, 0),
        createMockProduct('2', 50, 0)
      ];
      
      const result = calculateKPIs(products);
      
      expect(result.totalStock).toBe(150);
      expect(result.totalDemand).toBe(0);
      expect(result.fillRate).toBe(0);
    });

    it('should calculate fill rate correctly with mixed products', () => {
      const products = [
        createMockProduct('1', 100, 80),  // Can fulfill 80/80 = 100%
        createMockProduct('2', 30, 50),   // Can fulfill 30/50 = 60%
        createMockProduct('3', 20, 20)    // Can fulfill 20/20 = 100%
      ];
      
      const result = calculateKPIs(products);
      
      expect(result.totalStock).toBe(150);
      expect(result.totalDemand).toBe(150);
      // Fill rate = (80 + 30 + 20) / 150 * 100 = 130/150 * 100 = 86.67%
      expect(result.fillRate).toBeCloseTo(86.67, 2);
    });

    it('should handle large values correctly', () => {
      const products = [
        createMockProduct('1', 1000000, 900000),
        createMockProduct('2', 500000, 600000),
        createMockProduct('3', 2000000, 1500000)
      ];
      
      const result = calculateKPIs(products);
      
      expect(result.totalStock).toBe(3500000);
      expect(result.totalDemand).toBe(3000000);
      // Fill rate = (900000 + 500000 + 1500000) / 3000000 * 100 = 2900000/3000000 * 100 = 96.67%
      expect(result.fillRate).toBeCloseTo(96.67, 2);
    });

    it('should handle perfect fill rate (100%)', () => {
      const products = [
        createMockProduct('1', 100, 80),
        createMockProduct('2', 50, 40),
        createMockProduct('3', 30, 20)
      ];
      
      const result = calculateKPIs(products);
      
      expect(result.totalStock).toBe(180);
      expect(result.totalDemand).toBe(140);
      // All demand can be fulfilled: (80 + 40 + 20) / 140 * 100 = 100%
      expect(result.fillRate).toBe(100);
    });

    it('should handle zero fill rate (no stock)', () => {
      const products = [
        createMockProduct('1', 0, 100),
        createMockProduct('2', 0, 50)
      ];
      
      const result = calculateKPIs(products);
      
      expect(result.totalStock).toBe(0);
      expect(result.totalDemand).toBe(150);
      expect(result.fillRate).toBe(0);
    });

    it('should handle empty products array', () => {
      const products: Product[] = [];
      
      const result = calculateKPIs(products);
      
      expect(result.totalStock).toBe(0);
      expect(result.totalDemand).toBe(0);
      expect(result.fillRate).toBe(0);
    });

    it('should handle single product scenarios', () => {
      // Overstocked
      const oversupplied = [createMockProduct('1', 100, 50)];
      expect(calculateKPIs(oversupplied).fillRate).toBe(100);
      
      // Understocked
      const undersupplied = [createMockProduct('2', 30, 100)];
      expect(calculateKPIs(undersupplied).fillRate).toBe(30);
      
      // Exact match
      const exactMatch = [createMockProduct('3', 75, 75)];
      expect(calculateKPIs(exactMatch).fillRate).toBe(100);
    });

    // Edge case: floating point precision
    it('should handle decimal calculations correctly', () => {
      const products = [
        createMockProduct('1', 33, 100),  // Can fulfill 33/100
        createMockProduct('2', 33, 100),  // Can fulfill 33/100
        createMockProduct('3', 34, 100)   // Can fulfill 34/100
      ];
      
      const result = calculateKPIs(products);
      
      expect(result.fillRate).toBeCloseTo(33.33, 2);
    });
  });
});
