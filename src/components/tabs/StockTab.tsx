// src/components/tabs/StockTab.tsx

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Product } from '../../types';

interface StockTabProps {
  products: Product[];
}

const StockTab: React.FC<StockTabProps> = ({ products }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Estoque Completo</h2>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left p-4 font-semibold text-slate-700">Produto</th>
              <th className="text-left p-4 font-semibold text-slate-700">Categoria</th>
              <th className="text-center p-4 font-semibold text-slate-700">Estoque</th>
              <th className="text-center p-4 font-semibold text-slate-700">Mín.</th>
              <th className="text-right p-4 font-semibold text-slate-700">Preço</th>
              <th className="text-center p-4 font-semibold text-slate-700">Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="p-4 font-medium text-slate-800">{product.name}</td>
                <td className="p-4 text-slate-600">{product.category}</td>
                <td className="p-4 text-center font-bold text-slate-800">{product.stock}</td>
                <td className="p-4 text-center text-slate-600">{product.minStock}</td>
                <td className="p-4 text-right font-semibold text-green-600">R$ {product.price.toFixed(2)}</td>
                <td className="p-4 text-center">
                  {product.stock < product.minStock ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                      <AlertTriangle size={12} />
                      Baixo
                    </span>
                  ) : (
                    <span className="inline-flex px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      OK
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockTab;