// src/types/index.ts

export interface Product {
  id: number; // Frontend usa number, mas representa Long do backend
  nome: string;
  valor: number;
  dataEntrada: string;
  dataSaida?: string;
  dataValidade: string;
  createdAt: string;
  updatedAt: string;
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
  nome: string;
  valor: string;
  dataEntrada: string;
  dataSaida: string;
  dataValidade: string;
}

export type TabType = 'home' | 'stock' | 'manage' | 'alerts' | 'flags';