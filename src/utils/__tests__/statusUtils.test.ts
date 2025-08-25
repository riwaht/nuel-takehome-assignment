import { Product } from '../../types';

// Extract the status calculation logic for testing
export const getProductStatus = (stock: number, demand: number) => {
  if (stock > demand) {
    return {
      status: 'healthy' as const,
      label: 'Healthy',
      color: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400',
      rowColor: ''
    };
  } else if (stock === demand) {
    return {
      status: 'low' as const,
      label: 'Low', 
      color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400',
      rowColor: ''
    };
  } else {
    return {
      status: 'critical' as const,
      label: 'Critical',
      color: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400',
      rowColor: 'bg-red-50/70 dark:bg-red-900/30'
    };
  }
};

describe('Product Status Calculation', () => {
  describe('getProductStatus', () => {
    it('should return "critical" when stock < demand', () => {
      const result = getProductStatus(5, 10);
      
      expect(result.status).toBe('critical');
      expect(result.label).toBe('Critical');
      expect(result.rowColor).toBe('bg-red-50/70 dark:bg-red-900/30');
    });

    it('should return "low" when stock = demand', () => {
      const result = getProductStatus(10, 10);
      
      expect(result.status).toBe('low');
      expect(result.label).toBe('Low');
      expect(result.rowColor).toBe('');
    });

    it('should return "healthy" when stock > demand', () => {
      const result = getProductStatus(15, 10);
      
      expect(result.status).toBe('healthy');
      expect(result.label).toBe('Healthy');
      expect(result.rowColor).toBe('');
    });

    // Edge cases
    it('should handle zero values correctly', () => {
      expect(getProductStatus(0, 5).status).toBe('critical');
      expect(getProductStatus(5, 0).status).toBe('healthy');
      expect(getProductStatus(0, 0).status).toBe('low');
    });

    it('should handle large numbers correctly', () => {
      expect(getProductStatus(1000000, 999999).status).toBe('healthy');
      expect(getProductStatus(999999, 1000000).status).toBe('critical');
      expect(getProductStatus(1000000, 1000000).status).toBe('low');
    });
  });
});
