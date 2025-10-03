// src/hooks/useInventory.ts

import { useState, useMemo } from 'react';
import { Product, FormData, Alert } from '../types';
import { produtos as rawProdutos } from '../utils/mock'; // 1. Importa os dados BRUTOS
import { transformMockData } from '../utils/dataTransformer'; // 2. Importa a FUNÇÃO de transformação

// 3. EXECUTA a transformação aqui, de forma segura.
const initialData = transformMockData(rawProdutos);

const LOW_STOCK_THRESHOLD = 10;

// 4. Usa os dados já transformados como valor padrão.
export const useInventory = (initialProducts: Product[] = initialData) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  
  // O restante do seu hook continua exatamente igual...
  const [editingProduct, setEditingProduct] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>({
    nome: '', valor: '', quantidade: '', dataEntrada: '', dataSaida: '', dataValidade: ''
  });

  const alerts: Alert[] = useMemo(() => {
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return products
      .filter(p => new Date(p.dataValidade) <= sevenDaysFromNow)
      .map(p => {
        const validade = new Date(p.dataValidade);
        const daysUntilExpiry = Math.ceil((validade.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        const isExpired = daysUntilExpiry <= 0;
        
        return {
          id: p.id,
          product: p.nome,
          message: isExpired 
            ? `Produto vencido: ${p.nome} (venceu em ${validade.toLocaleDateString('pt-BR')})`
            : `Produto próximo do vencimento: ${p.nome} (vence em ${daysUntilExpiry} dias)`,
          severity: isExpired ? 'critical' : 'warning',
          date: new Date().toLocaleDateString('pt-BR')
        };
      });
  }, [products]);

  const totalValue = useMemo(() => products.reduce((sum, p) => sum + (p.valor * p.quantidade), 0), [products]);
  
  const lowStockCount = useMemo(() => products.filter(p => p.quantidade < LOW_STOCK_THRESHOLD).length, [products]);

  const formatToDateTimeLocal = (isoString: string): string => {
    if (!isoString) return '';
    const date = new Date(isoString);
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().slice(0, 16);
  };

  const resetForm = () => {
    setFormData({ nome: '', valor: '', quantidade: '', dataEntrada: '', dataSaida: '', dataValidade: '' });
  };

  const handleAddProduct = (): void => {
    if (formData.nome && formData.valor && formData.quantidade && formData.dataEntrada && formData.dataValidade) {
      const now = new Date().toISOString();
      const valorNumerico = parseFloat(formData.valor.replace(/\./g, '').replace(',', '.'));
      const quantidadeNumerica = parseInt(formData.quantidade, 10);

      const newProduct: Product = {
        id: Math.max(0, ...products.map(p => p.id)) + 1,
        nome: formData.nome,
        valor: valorNumerico,
        quantidade: quantidadeNumerica,
        dataEntrada: new Date(formData.dataEntrada).toISOString(),
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
    const valorFormatado = product.valor.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    setFormData({
      nome: product.nome,
      valor: valorFormatado,
      quantidade: String(product.quantidade),
      dataEntrada: formatToDateTimeLocal(product.dataEntrada),
      dataSaida: product.dataSaida ? formatToDateTimeLocal(product.dataSaida) : '',
      dataValidade: product.dataValidade
    });
  };

  const handleUpdateProduct = (): void => {
    if (!editingProduct) return;
    
    const valorNumerico = parseFloat(formData.valor.replace(/\./g, '').replace(',', '.'));
    const quantidadeNumerica = parseInt(formData.quantidade, 10);

    setProducts(products.map(p => 
      p.id === editingProduct 
        ? { 
            ...p, 
            nome: formData.nome,
            valor: valorNumerico,
            quantidade: quantidadeNumerica,
            dataEntrada: new Date(formData.dataEntrada).toISOString(),
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