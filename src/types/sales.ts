// src/types/sales.ts

export interface Sale {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  saleDate: string;
  customerName?: string;
  paymentMethod: 'dinheiro' | 'cartao' | 'pix';
  createdAt: string;
}

export interface SaleFormData {
  productId: string;
  quantity: string;
  unitPrice: string;
  customerName: string;
  paymentMethod: 'dinheiro' | 'cartao' | 'pix';
}

export interface SalesSummary {
  totalSales: number;
  totalRevenue: number;
  averageTicket: number;
  salesByPaymentMethod: {
    dinheiro: number;
    cartao: number;
    pix: number;
  };
  topProducts: Array<{
    productName: string;
    totalSold: number;
    revenue: number;
  }>;
}
