// src/hooks/useSales.ts

import { useState, useMemo } from 'react';
import { Sale, SaleFormData, SalesSummary } from '../types/sales';

const INITIAL_SALES: Sale[] = [];

export const useSales = (initialSales: Sale[] = INITIAL_SALES) => {
  const [sales, setSales] = useState<Sale[]>(initialSales);
  const [editingSale, setEditingSale] = useState<number | null>(null);
  const [formData, setFormData] = useState<SaleFormData>({
    productId: '',
    quantity: '',
    unitPrice: '',
    customerName: '',
    paymentMethod: 'dinheiro'
  });

  const salesSummary: SalesSummary = useMemo(() => {
    const totalSales = sales.length;
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalPrice, 0);
    const averageTicket = totalSales > 0 ? totalRevenue / totalSales : 0;

    const salesByPaymentMethod = sales.reduce((acc, sale) => {
      acc[sale.paymentMethod] = (acc[sale.paymentMethod] || 0) + sale.totalPrice;
      return acc;
    }, { dinheiro: 0, cartao: 0, pix: 0 } as { dinheiro: number; cartao: number; pix: number });

    const productSales = sales.reduce((acc, sale) => {
      const existing = acc.find(p => p.productName === sale.productName);
      if (existing) {
        existing.totalSold += sale.quantity;
        existing.revenue += sale.totalPrice;
      } else {
        acc.push({
          productName: sale.productName,
          totalSold: sale.quantity,
          revenue: sale.totalPrice
        });
      }
      return acc;
    }, [] as Array<{ productName: string; totalSold: number; revenue: number }>);

    const topProducts = productSales
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    return {
      totalSales,
      totalRevenue,
      averageTicket,
      salesByPaymentMethod,
      topProducts
    };
  }, [sales]);

  const resetForm = () => {
    setFormData({
      productId: '',
      quantity: '',
      unitPrice: '',
      customerName: '',
      paymentMethod: 'dinheiro'
    });
    setEditingSale(null);
  };

  const handleAddSale = (products: any[]) => {
    if (!formData.productId || !formData.quantity || !formData.unitPrice) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const product = products.find(p => p.id === parseInt(formData.productId));
    if (!product) {
      alert('Produto não encontrado.');
      return;
    }

    const quantity = parseInt(formData.quantity);
    const unitPrice = parseFloat(formData.unitPrice);
    const totalPrice = quantity * unitPrice;

    const newSale: Sale = {
      id: Date.now(),
      productId: product.id,
      productName: product.nome,
      quantity,
      unitPrice,
      totalPrice,
      saleDate: new Date().toISOString(),
      customerName: formData.customerName || undefined,
      paymentMethod: formData.paymentMethod,
      createdAt: new Date().toISOString()
    };

    setSales(prev => [newSale, ...prev]);
    resetForm();
  };

  const handleDeleteSale = (saleId: number) => {
    if (confirm('Tem certeza que deseja excluir esta venda?')) {
      setSales(prev => prev.filter(sale => sale.id !== saleId));
    }
  };

  const getSalesByDateRange = (startDate: string, endDate: string) => {
    return sales.filter(sale => {
      const saleDate = new Date(sale.saleDate);
      return saleDate >= new Date(startDate) && saleDate <= new Date(endDate);
    });
  };

  const getSalesByProduct = (productId: number) => {
    return sales.filter(sale => sale.productId === productId);
  };

  return {
    sales,
    salesSummary,
    formData,
    setFormData,
    editingSale,
    setEditingSale,
    handleAddSale,
    handleDeleteSale,
    resetForm,
    getSalesByDateRange,
    getSalesByProduct
  };
};
