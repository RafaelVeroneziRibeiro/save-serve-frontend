// src/types/index.ts

export interface Product {
  id: number;
  nome: string;
  valor: number;
  quantidade: number; // Campo essencial para controle de estoque
  dataEntrada: string; // Formato ISO 8601: "YYYY-MM-DDTHH:mm:ss.sssZ"
  dataSaida?: string; // Opcional, formato ISO 8601
  dataValidade: string; // Formato "YYYY-MM-DD" para facilitar a criação de Date
  createdAt: string; // Formato ISO 8601
  updatedAt: string; // Formato ISO 8601
}

/**
 * @description Define a estrutura de um alerta do sistema (ex: produto vencendo).
 */
export interface Alert {
  id: number;
  product: string;
  message: string;
  severity: 'critical' | 'warning' | 'info';
  date: string;
}

export interface FeatureFlags {
  autoAlerts: boolean;
  dynamicPricing: boolean;
  lowStockNotifications: boolean;
  priceHistory: boolean;
  bulkOperations: boolean;
}

/**
 * @description Define a estrutura dos dados do formulário para adicionar/editar um produto.
 * Os valores de data são strings para compatibilidade com inputs HTML.
 */
export interface FormData {
  nome: string;
  valor: string; // Mantido como string para formatação de moeda (ex: "1.234,56")
  quantidade: string;
  dataEntrada: string; // Input type="datetime-local"
  dataSaida: string; // Input type="datetime-local"
  dataValidade: string; // Input type="date"
}

export type TabType = 'home' | 'stock' | 'manage' | 'alerts' | 'flags' | 'pricing';