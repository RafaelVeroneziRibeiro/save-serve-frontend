// src/types/index.ts

export interface Product {
  id: number;
  name: string;
  category: string;
  stock: number;
  minStock: number;
  price: number;
  lastUpdate: string;
}

export interface Alert {
  id: number;
  product: string;
  message: string;
  severity: 'critical' | 'warning';
  date: string;
}

export interface FeatureFlags {
  autoAlerts: boolean;
  dynamicPricing: boolean;
  lowStockNotifications: boolean;
  priceHistory: boolean;
  bulkOperations: boolean;
}

export interface FormData {
  name: string;
  category: string;
  stock: string;
  minStock: string;
  price: string;
}

export type TabType = 'home' | 'stock' | 'manage' | 'alerts' | 'flags';