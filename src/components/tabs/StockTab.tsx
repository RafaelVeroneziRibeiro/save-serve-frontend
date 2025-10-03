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
              <th className="text-left p-4 font-semibold text-slate-700">Data Entrada</th>
              <th className="text-left p-4 font-semibold text-slate-700">Data Saída</th>
              <th className="text-left p-4 font-semibold text-slate-700">Data Validade</th>
              <th className="text-right p-4 font-semibold text-slate-700">Valor</th>
              <th className="text-center p-4 font-semibold text-slate-700">Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => {
              const now = new Date();
              const validade = new Date(product.dataValidade);
              const daysUntilExpiry = Math.ceil((validade.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
              const isExpired = daysUntilExpiry <= 0;
              const isExpiringSoon = daysUntilExpiry <= 7;
              
              return (
                <tr key={product.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-4 font-medium text-slate-800">{product.nome}</td>
                  <td className="p-4 text-slate-600">{new Date(product.dataEntrada).toLocaleDateString('pt-BR')}</td>
                  <td className="p-4 text-slate-600">
                    {product.dataSaida ? new Date(product.dataSaida).toLocaleDateString('pt-BR') : '-'}
                  </td>
                  <td className="p-4 text-slate-600">{new Date(product.dataValidade).toLocaleDateString('pt-BR')}</td>
                  <td className="p-4 text-right font-semibold text-green-600">R$ {product.valor.toFixed(2)}</td>
                  <td className="p-4 text-center">
                    {isExpired ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                        <AlertTriangle size={12} />
                        Vencido
                      </span>
                    ) : isExpiringSoon ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                        <AlertTriangle size={12} />
                        Vencendo
                      </span>
                    ) : (
                      <span className="inline-flex px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        OK
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockTab;