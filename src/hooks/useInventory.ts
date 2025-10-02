// src/hooks/useInventory.ts

import { useState, useMemo } from 'react';
import { Product, FormData, Alert } from '../types';

const INITIAL_PRODUCTS: Product[] = [
  { id: 1, name: 'Arroz 5kg', category: 'Grãos', stock: 45, minStock: 20, price: 28.90, lastUpdate: '2025-10-01' },
  { id: 2, name: 'Feijão Preto 1kg', category: 'Grãos', stock: 12, minStock: 15, price: 8.50, lastUpdate: '2025-10-02' },
  { id: 3, name: 'Óleo de Soja 900ml', category: 'Óleos', stock: 8, minStock: 10, price: 7.90, lastUpdate: '2025-09-30' },
  { id: 4, name: 'Açúcar Cristal 1kg', category: 'Açúcares', stock: 30, minStock: 20, price: 4.50, lastUpdate: '2025-10-01' },
  { id: 5, name: 'Café Torrado 500g', category: 'Bebidas', stock: 25, minStock: 15, price: 18.90, lastUpdate: '2025-10-02' },
  { id: 6, name: 'Leite Integral 1L', category: 'Laticínios', stock: 5, minStock: 20, price: 5.80, lastUpdate: '2025-10-02' }
];

export const useInventory = (initialProducts: Product[] = INITIAL_PRODUCTS) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [editingProduct, setEditingProduct] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '', category: '', stock: '', minStock: '', price: ''
  });

  const alerts: Alert[] = useMemo(() => products
    .filter(p => p.stock < p.minStock)
    .map(p => ({
      id: p.id,
      product: p.name,
      message: `Estoque baixo: ${p.stock} unidades (mínimo: ${p.minStock})`,
      severity: p.stock < p.minStock * 0.5 ? 'critical' : 'warning',
      date: new Date().toLocaleDateString('pt-BR')
    })), [products]);

  const totalValue = useMemo(() => products.reduce((sum, p) => sum + (p.stock * p.price), 0), [products]);
  const lowStockCount = useMemo(() => alerts.length, [alerts]);

  const resetForm = () => {
    setFormData({ name: '', category: '', stock: '', minStock: '', price: '' });
  };

  const handleAddProduct = (): void => {
    if (formData.name && formData.stock && formData.price) {
      const newProduct: Product = {
        id: Math.max(...products.map(p => p.id), 0) + 1,
        name: formData.name,
        category: formData.category || 'Outros',
        stock: parseInt(formData.stock),
        minStock: parseInt(formData.minStock) || 10,
        price: parseFloat(formData.price),
        lastUpdate: new Date().toISOString().split('T')[0]
      };
      setProducts([...products, newProduct]);
      resetForm();
    }
  };

  const handleEditProduct = (product: Product): void => {
    setEditingProduct(product.id);
    setFormData({
      name: product.name,
      category: product.category,
      stock: product.stock.toString(),
      minStock: product.minStock.toString(),
      price: product.price.toString()
    });
  };

  const handleUpdateProduct = (): void => {
    if (!editingProduct) return;
    setProducts(products.map(p => 
      p.id === editingProduct 
        ? { 
            ...p, 
            name: formData.name,
            category: formData.category,
            stock: parseInt(formData.stock), 
            minStock: parseInt(formData.minStock), 
            price: parseFloat(formData.price),
            lastUpdate: new Date().toISOString().split('T')[0]
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