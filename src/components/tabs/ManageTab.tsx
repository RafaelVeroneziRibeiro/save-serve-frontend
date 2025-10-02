// src/components/tabs/ManageTab.tsx

import React from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Product, FormData } from '../../types';

interface ManageTabProps {
  products: Product[];
  editingProduct: number | null;
  formData: FormData;
  setFormData: (formData: FormData) => void;
  handleAddProduct: () => void;
  handleEditProduct: (product: Product) => void;
  handleUpdateProduct: () => void;
  handleDeleteProduct: (id: number) => void;
  handleCancelEdit: () => void;
}

const ManageTab: React.FC<ManageTabProps> = ({
  products,
  editingProduct,
  formData,
  setFormData,
  handleAddProduct,
  handleEditProduct,
  handleUpdateProduct,
  handleDeleteProduct,
  handleCancelEdit
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Gerenciar Produtos</h2>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4">
          {editingProduct ? 'Editar Produto' : 'Adicionar Novo Produto'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Nome do produto"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="text"
            placeholder="Categoria"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="number"
            placeholder="Quantidade"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="number"
            placeholder="Estoque mínimo"
            value={formData.minStock}
            onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="number"
            step="0.01"
            placeholder="Preço (R$)"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          {editingProduct ? (
            <>
              <button
                onClick={handleUpdateProduct}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Atualizar
              </button>
              <button
                onClick={handleCancelEdit}
                className="px-6 py-2 bg-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-300 transition-colors"
              >
                Cancelar
              </button>
            </>
          ) : (
            <button
              onClick={handleAddProduct}
              className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              <Plus size={18} />
              Adicionar Produto
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Lista de Produtos</h3>
        <div className="space-y-2">
          {products.map(product => (
            <div key={product.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
              <div className="flex-1">
                <p className="font-medium text-slate-800">{product.name}</p>
                <p className="text-sm text-slate-500">{product.category} • {product.stock} unidades • R$ {product.price.toFixed(2)}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditProduct(product)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageTab;