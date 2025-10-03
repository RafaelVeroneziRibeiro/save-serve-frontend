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
          {/* Campo Nome */}
          <div className="relative">
            <input
              type="text"
              id="nome"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              className="w-full px-4 pt-6 pb-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent peer"
              placeholder=" "
            />
            <label
              htmlFor="nome"
              className="absolute left-4 top-2 text-xs text-slate-500 transition-all duration-200 peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:text-slate-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-600"
            >
              Nome do Produto *
            </label>
          </div>

          {/* Campo Valor */}
          <div className="relative">
            <input
              type="text"
              id="valor"
              value={formData.valor}
              onChange={(e) => {
                // Remove tudo que não é dígito
                let value = e.target.value.replace(/\D/g, '');
                
                // Se está vazio, define como "0,00"
                if (value === '') {
                  setFormData({ ...formData, valor: '0,00' });
                  return;
                }
                
                // Converte para formato de moeda (sempre 2 casas decimais)
                // Divide por 100 para obter o valor real e formata
                const numericValue = parseInt(value) / 100;
                const formattedValue = numericValue.toLocaleString('pt-BR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                });
                
                setFormData({ ...formData, valor: formattedValue });
              }}
              onFocus={(e) => {
                // Se o valor for "0,00", limpa o campo para facilitar a digitação
                if (e.target.value === '0,00') {
                  setFormData({ ...formData, valor: '' });
                }
              }}
              onBlur={(e) => {
                // Se o campo estiver vazio ao sair do foco, define como "0,00"
                if (e.target.value === '') {
                  setFormData({ ...formData, valor: '0,00' });
                }
              }}
              className="w-full px-4 pt-6 pb-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent peer text-right"
              placeholder=" "
            />
            <label
              htmlFor="valor"
              className="absolute left-4 top-2 text-xs text-slate-500 transition-all duration-200 peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:text-slate-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-600"
            >
              Valor (R$) *
            </label>
          </div>

          {/* Campo Data de Entrada */}
          <div className="relative">
            <input
              type="date"
              id="dataEntrada"
              value={formData.dataEntrada.split('T')[0] || ''}
              onChange={(e) => {
                const currentTime = formData.dataEntrada.includes('T') ? formData.dataEntrada.split('T')[1] : '00:00';
                setFormData({ ...formData, dataEntrada: `${e.target.value}T${currentTime}` });
              }}
              className="w-full px-4 pt-6 pb-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent peer"
              placeholder=" "
              style={{ colorScheme: 'light' }}
            />
            <label
              htmlFor="dataEntrada"
              className="absolute left-4 top-2 text-xs text-slate-500 transition-all duration-200 peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:text-slate-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-600"
            >
              Data de Entrada *
            </label>
          </div>

          {/* Campo Hora de Entrada */}
          <div className="relative">
            <input
              type="time"
              id="horaEntrada"
              value={formData.dataEntrada.split('T')[1] || '00:00'}
              onChange={(e) => {
                const currentDate = formData.dataEntrada.split('T')[0] || new Date().toISOString().split('T')[0];
                setFormData({ ...formData, dataEntrada: `${currentDate}T${e.target.value}` });
              }}
              className="w-full px-4 pt-6 pb-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent peer"
              placeholder=" "
              style={{ colorScheme: 'light' }}
            />
            <label
              htmlFor="horaEntrada"
              className="absolute left-4 top-2 text-xs text-slate-500 transition-all duration-200 peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:text-slate-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-600"
            >
              Hora de Entrada *
            </label>
          </div>

          {/* Campo Data de Saída */}
          <div className="relative">
            <input
              type="date"
              id="dataSaida"
              value={formData.dataSaida.split('T')[0] || ''}
              onChange={(e) => {
                const currentTime = formData.dataSaida.includes('T') ? formData.dataSaida.split('T')[1] : '00:00';
                setFormData({ ...formData, dataSaida: `${e.target.value}T${currentTime}` });
              }}
              className="w-full px-4 pt-6 pb-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent peer"
              placeholder=" "
              style={{ colorScheme: 'light' }}
            />
            <label
              htmlFor="dataSaida"
              className="absolute left-4 top-2 text-xs text-slate-500 transition-all duration-200 peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:text-slate-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-600"
            >
              Data de Saída (Opcional)
            </label>
          </div>

          {/* Campo Hora de Saída */}
          <div className="relative">
            <input
              type="time"
              id="horaSaida"
              value={formData.dataSaida.split('T')[1] || '00:00'}
              onChange={(e) => {
                const currentDate = formData.dataSaida.split('T')[0] || new Date().toISOString().split('T')[0];
                setFormData({ ...formData, dataSaida: `${currentDate}T${e.target.value}` });
              }}
              className="w-full px-4 pt-6 pb-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent peer"
              placeholder=" "
              style={{ colorScheme: 'light' }}
            />
            <label
              htmlFor="horaSaida"
              className="absolute left-4 top-2 text-xs text-slate-500 transition-all duration-200 peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:text-slate-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-600"
            >
              Hora de Saída (Opcional)
            </label>
          </div>

          {/* Campo Data de Validade */}
          <div className="relative">
            <input
              type="date"
              id="dataValidade"
              value={formData.dataValidade}
              onChange={(e) => setFormData({ ...formData, dataValidade: e.target.value })}
              className="w-full px-4 pt-6 pb-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent peer"
              placeholder=" "
            />
            <label
              htmlFor="dataValidade"
              className="absolute left-4 top-2 text-xs text-slate-500 transition-all duration-200 peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:text-slate-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-600"
            >
              Data de Validade *
            </label>
          </div>
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
                <p className="font-medium text-slate-800">{product.nome}</p>
                <p className="text-sm text-slate-500">
                  R$ {product.valor.toFixed(2)} • 
                  Entrada: {new Date(product.dataEntrada).toLocaleDateString('pt-BR')} • 
                  Validade: {new Date(product.dataValidade).toLocaleDateString('pt-BR')}
                  {product.dataSaida && ` • Saída: ${new Date(product.dataSaida).toLocaleDateString('pt-BR')}`}
                </p>
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