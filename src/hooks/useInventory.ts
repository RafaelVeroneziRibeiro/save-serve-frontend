// src/hooks/useInventory.ts

import { useState, useMemo } from 'react';
import { Product, FormData, Alert } from '../types';

const INITIAL_PRODUCTS: Product[] = [
  { 
    id: 1, 
    nome: 'Arroz 5kg', 
    valor: 28.90, 
    dataEntrada: '2025-01-15T10:30:00', 
    dataSaida: undefined, 
    dataValidade: '2026-01-15', 
    createdAt: '2025-01-15T10:30:00', 
    updatedAt: '2025-01-15T10:30:00' 
  },
  { 
    id: 2, 
    nome: 'Feijão Preto 1kg', 
    valor: 8.50, 
    dataEntrada: '2025-01-16T14:20:00', 
    dataSaida: undefined, 
    dataValidade: '2026-01-16', 
    createdAt: '2025-01-16T14:20:00', 
    updatedAt: '2025-01-16T14:20:00' 
  },
  { 
    id: 3, 
    nome: 'Óleo de Soja 900ml', 
    valor: 7.90, 
    dataEntrada: '2025-01-14T09:15:00', 
    dataSaida: undefined, 
    dataValidade: '2025-12-14', 
    createdAt: '2025-01-14T09:15:00', 
    updatedAt: '2025-01-14T09:15:00' 
  },
  { 
    id: 4, 
    nome: 'Açúcar Cristal 1kg', 
    valor: 4.50, 
    dataEntrada: '2025-01-15T11:45:00', 
    dataSaida: undefined, 
    dataValidade: '2026-01-15', 
    createdAt: '2025-01-15T11:45:00', 
    updatedAt: '2025-01-15T11:45:00' 
  },
  { 
    id: 5, 
    nome: 'Café Torrado 500g', 
    valor: 18.90, 
    dataEntrada: '2025-01-16T16:30:00', 
    dataSaida: undefined, 
    dataValidade: '2026-01-16', 
    createdAt: '2025-01-16T16:30:00', 
    updatedAt: '2025-01-16T16:30:00' 
  },
  { 
    id: 6, 
    nome: 'Leite Integral 1L', 
    valor: 5.80, 
    dataEntrada: '2025-01-16T08:00:00', 
    dataSaida: undefined, 
    dataValidade: '2025-01-23', 
    createdAt: '2025-01-16T08:00:00', 
    updatedAt: '2025-01-16T08:00:00' 
  }
];

export const useInventory = (initialProducts: Product[] = INITIAL_PRODUCTS) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [editingProduct, setEditingProduct] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>({
    nome: '', valor: '', dataEntrada: '', dataSaida: '', dataValidade: ''
  });

  const alerts: Alert[] = useMemo(() => {
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return products
      .filter(p => {
        const validade = new Date(p.dataValidade);
        return validade <= sevenDaysFromNow;
      })
      .map(p => {
        const validade = new Date(p.dataValidade);
        const daysUntilExpiry = Math.ceil((validade.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        const isExpired = daysUntilExpiry <= 0;
        
        return {
          id: p.id,
          product: p.nome,
          message: isExpired 
            ? `Produto vencido: ${p.nome} (vencimento: ${validade.toLocaleDateString('pt-BR')})`
            : `Produto próximo do vencimento: ${p.nome} (vence em ${daysUntilExpiry} dias)`,
          severity: isExpired ? 'critical' : 'warning',
          date: new Date().toLocaleDateString('pt-BR')
        };
      });
  }, [products]);

  const totalValue = useMemo(() => products.reduce((sum, p) => sum + p.valor, 0), [products]);
  const lowStockCount = useMemo(() => alerts.length, [alerts]);

  // Função para converter ISO string para formato datetime-local
  const formatToDateTimeLocal = (isoString: string): string => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const resetForm = () => {
    setFormData({ nome: '', valor: '', dataEntrada: '', dataSaida: '', dataValidade: '' });
  };

  const handleAddProduct = (): void => {
    if (formData.nome && formData.valor && formData.dataEntrada && formData.dataValidade) {
      const now = new Date().toISOString();
      // Converte valor formatado brasileiro para número (remove pontos e substitui vírgula por ponto)
      const valorNumerico = parseFloat(formData.valor.replace(/\./g, '').replace(',', '.'));
      const newProduct: Product = {
        id: Math.max(...products.map(p => p.id), 0) + 1,
        nome: formData.nome,
        valor: valorNumerico,
        dataEntrada: formData.dataEntrada ? new Date(formData.dataEntrada).toISOString() : '',
        dataSaida: formData.dataSaida ? new Date(formData.dataSaida).toISOString() : undefined,
        dataValidade: formData.dataValidade,
        createdAt: now,
        updatedAt: now
      };
      setProducts([...products, newProduct]);
      resetForm();
    }
  };

  const handleEditProduct = (product: Product): void => {
    setEditingProduct(product.id);
    // Converte valor numérico para formato brasileiro
    const valorFormatado = product.valor.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    setFormData({
      nome: product.nome,
      valor: valorFormatado,
      dataEntrada: formatToDateTimeLocal(product.dataEntrada),
      dataSaida: product.dataSaida ? formatToDateTimeLocal(product.dataSaida) : '',
      dataValidade: product.dataValidade
    });
  };

  const handleUpdateProduct = (): void => {
    if (!editingProduct) return;
    // Converte valor formatado brasileiro para número (remove pontos e substitui vírgula por ponto)
    const valorNumerico = parseFloat(formData.valor.replace(/\./g, '').replace(',', '.'));
    setProducts(products.map(p => 
      p.id === editingProduct 
        ? { 
            ...p, 
            nome: formData.nome,
            valor: valorNumerico,
            dataEntrada: formData.dataEntrada ? new Date(formData.dataEntrada).toISOString() : '',
            dataSaida: formData.dataSaida ? new Date(formData.dataSaida).toISOString() : undefined,
            dataValidade: formData.dataValidade,
            updatedAt: new Date().toISOString()
          }
        : p
    ));
    setEditingProduct(null);
    resetForm();
  };
  
  const handleCancelEdit = (): void => {
    setEditingProduct(null);
    resetForm();
  };

  const handleDeleteProduct = (id: number): void => {
    setProducts(products.filter(p => p.id !== id));
  };

  return {
    products,
    editingProduct,
    formData,
    setFormData,
    alerts,
    totalValue,
    lowStockCount,
    handleAddProduct,
    handleEditProduct,
    handleUpdateProduct,
    handleDeleteProduct,
    handleCancelEdit
  };
};