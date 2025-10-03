// src/components/tabs/HomeTab.tsx

import React from 'react';
import { Package, DollarSign, AlertTriangle } from 'lucide-react';
import { Product } from '../../types';

interface HomeTabProps {
  products: Product[];
  totalValue: number;
  lowStockCount: number;
}

const HomeTab: React.FC<HomeTabProps> = ({ products, totalValue, lowStockCount }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">Total de Produtos</p>
              <p className="text-3xl font-bold text-slate-800 mt-1">{products.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Package className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">Valor Total</p>
              <p className="text-3xl font-bold text-green-600 mt-1">R$ {totalValue.toFixed(2)}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <DollarSign className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">Produtos Vencendo</p>
              <p className="text-3xl font-bold text-red-600 mt-1">{lowStockCount}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <AlertTriangle className="text-red-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Produtos Recentes</h3>
        <div className="space-y-3">
          {products.slice(-5).reverse().map(product => (
            <div key={product.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div>
                <p className="font-medium text-slate-800">{product.nome}</p>
                <p className="text-sm text-slate-500">
                  Entrada: {new Date(product.dataEntrada).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-slate-800">
                  Validade: {new Date(product.dataValidade).toLocaleDateString('pt-BR')}
                </p>
                <p className="text-sm text-green-600">R$ {product.valor.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeTab;