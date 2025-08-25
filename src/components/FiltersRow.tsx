import { Search, Warehouse, Filter } from 'lucide-react';
import { ChangeEvent, useState, useEffect, useCallback } from 'react';
import { Filters, Warehouse as WarehouseType } from '../types';

interface FiltersRowProps {
  filters: Filters;
  warehouses: WarehouseType[];
  onFilterChange: (filters: Partial<Filters>) => void;
  loading: boolean;
}

const FiltersRow = ({ filters, warehouses, onFilterChange, loading }: FiltersRowProps): JSX.Element => {
  const [localSearch, setLocalSearch] = useState<string>(filters.search);
  
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'healthy', label: '🟢 Healthy' },
    { value: 'low', label: '🟡 Low' },
    { value: 'critical', label: '🔴 Critical' }
  ];

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (localSearch !== filters.search) {
        onFilterChange({ search: localSearch });
      }
    }, 300); // 300ms debounce delay

    return () => clearTimeout(timeoutId);
  }, [localSearch, onFilterChange, filters.search]);

  // Sync local search with external filters
  useEffect(() => {
    setLocalSearch(filters.search);
  }, [filters.search]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setLocalSearch(e.target.value);
  };

  const handleWarehouseChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    onFilterChange({ warehouse: e.target.value });
  };

  const handleStatusChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    onFilterChange({ status: e.target.value });
  };

  return (
    <div className="bg-white dark:bg-brand-navy rounded-2xl shadow-lg border border-brand-grayMid/30 dark:border-brand-navy/50 p-6 mb-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-brand-grayText dark:text-brand-grayLight mb-1">Filter Products</h3>
        <p className="text-sm text-brand-grayText/70 dark:text-brand-grayLight/70">Search and filter your inventory</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Search Box */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            {loading && localSearch !== filters.search ? (
              <div className="h-4 w-4 border-2 border-brand-blue border-t-transparent rounded-full animate-spin" />
            ) : (
              <Search className="h-5 w-5 text-brand-grayText/50 dark:text-brand-grayLight/50 group-focus-within:text-brand-blue transition-colors duration-200" />
            )}
          </div>
          <input
            type="text"
            placeholder="Search by name, SKU, or ID..."
            value={localSearch}
            onChange={handleSearchChange}
            className="input-field pl-11 py-3 text-sm bg-brand-grayLight/50 dark:bg-brand-navy/30 hover:bg-brand-grayLight dark:hover:bg-brand-navy/60 focus:bg-white dark:focus:bg-brand-navy transition-colors duration-200"
          />
        </div>

        {/* Warehouse Dropdown */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
            <Warehouse className="h-5 w-5 text-brand-grayText/50 dark:text-brand-grayLight/50 group-focus-within:text-brand-blue transition-colors duration-200" />
          </div>
          <select
            value={filters.warehouse}
            onChange={handleWarehouseChange}
            disabled={loading}
            className="input-field pl-11 py-3 text-sm bg-brand-grayLight/50 dark:bg-brand-navy/30 hover:bg-brand-grayLight dark:hover:bg-brand-navy/60 focus:bg-white dark:focus:bg-brand-navy disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <option value="all">All Warehouses</option>
            {warehouses.map((warehouse) => (
              <option key={warehouse.code} value={warehouse.code}>
                {warehouse.name} ({warehouse.code})
              </option>
            ))}
          </select>
        </div>

        {/* Status Dropdown */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
            <Filter className="h-5 w-5 text-brand-grayText/50 dark:text-brand-grayLight/50 group-focus-within:text-brand-blue transition-colors duration-200" />
          </div>
          <select
            value={filters.status}
            onChange={handleStatusChange}
            className="input-field pl-11 py-3 text-sm bg-brand-grayLight/50 dark:bg-brand-navy/30 hover:bg-brand-grayLight dark:hover:bg-brand-navy/60 focus:bg-white dark:focus:bg-brand-navy transition-colors duration-200"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default FiltersRow;
