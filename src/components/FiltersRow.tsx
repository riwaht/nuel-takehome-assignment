import React, { ChangeEvent, useMemo } from 'react';
import { Search, Warehouse, Filter } from 'lucide-react';
import { StatusFilter, Warehouse as WarehouseType } from '../types';

interface FiltersRowProps {
  search: string;
  warehouse: string | null;
  status: StatusFilter;
  warehouses: WarehouseType[];
  onSearchChange: (search: string) => void;
  onWarehouseChange: (warehouse: string | null) => void;
  onStatusChange: (status: StatusFilter) => void;
  loading: boolean;
}

const FiltersRow = ({ 
  search, 
  warehouse, 
  status, 
  warehouses, 
  onSearchChange, 
  onWarehouseChange, 
  onStatusChange, 
  loading 
}: FiltersRowProps): JSX.Element => {
  
  // Memoized options to prevent re-renders
  const statusOptions = useMemo(() => [
    { value: 'All', label: 'All Status' },
    { value: 'Healthy', label: '🟢 Healthy' },
    { value: 'Low', label: '🟡 Low' },
    { value: 'Critical', label: '🔴 Critical' }
  ], []);

  const warehouseOptions = useMemo(
    () => warehouses.map(w => ({ label: `${w.name} (${w.code})`, value: w.code })),
    [warehouses]
  );

  // Stable event handlers
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>): void => {
    onSearchChange(e.target.value);
  };

  const handleWarehouseChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    const value = e.target.value;
    onWarehouseChange(value === 'all' ? null : value);
  };

  const handleStatusChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    onStatusChange(e.target.value as StatusFilter);
  };

  return (
    <div className="bg-white dark:bg-brand-navy rounded-2xl shadow-lg border border-brand-grayMid/30 dark:border-brand-navy/50 p-6 mb-6 hover:shadow-xl transition-all duration-300">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
        {/* Search Input */}
        <div className="relative group flex-1 sm:flex-none sm:w-80 lg:w-96">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
            <Search className="h-5 w-5 text-brand-grayText/50 dark:text-brand-grayLight/50 group-focus-within:text-brand-blue transition-colors duration-200" />
          </div>
          <input
            type="text"
            placeholder="Search products by name, SKU, or ID..."
            value={search}
            onChange={handleSearchChange}
            className="input-field w-full pl-11 py-3 pr-4 text-sm bg-brand-grayLight/50 dark:bg-brand-navy/30 hover:bg-brand-grayLight dark:hover:bg-brand-navy/60 focus:bg-white dark:focus:bg-brand-navy placeholder:text-brand-grayText/50 dark:placeholder:text-brand-grayLight/50 transition-colors duration-200"
          />
        </div>

        {/* Warehouse Dropdown */}
        <div className="relative group sm:w-48 lg:w-56">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
            <Warehouse className="h-5 w-5 text-brand-grayText/50 dark:text-brand-grayLight/50 group-focus-within:text-brand-blue transition-colors duration-200" />
          </div>
          <select
            value={warehouse || 'all'}
            onChange={handleWarehouseChange}
            disabled={loading}
            className="input-field pl-11 py-3 text-sm bg-brand-grayLight/50 dark:bg-brand-navy/30 hover:bg-brand-grayLight dark:hover:bg-brand-navy/60 focus:bg-white dark:focus:bg-brand-navy disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <option value="all">All Warehouses</option>
            {warehouseOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Status Dropdown */}
        <div className="relative group sm:w-44 lg:w-48">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
            <Filter className="h-5 w-5 text-brand-grayText/50 dark:text-brand-grayLight/50 group-focus-within:text-brand-blue transition-colors duration-200" />
          </div>
          <select
            value={status}
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

export default React.memo(FiltersRow);