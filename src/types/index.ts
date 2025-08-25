export interface Product {
  id: string;
  name: string;
  sku: string;
  warehouse: string;
  stock: number;
  demand: number;
}

export interface Warehouse {
  code: string;
  name: string;
  city: string;
  country: string;
}

export interface KPI {
  date: string;
  stock: number;
  demand: number;
}

export type StatusFilter = "All" | "Healthy" | "Low" | "Critical";

export interface Filters {
  search: string;
  warehouse: string | null;
  status: StatusFilter;
}

export interface ProductsPage {
  items: Product[];
  totalCount: number;
  offset: number;
  limit: number;
}

export interface StatusInfo {
  status: string;
  label: string;
  color: string;
  bg?: string;
  rowColor?: string;
}
