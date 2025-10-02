// src/components/tabs/AlertsTab.tsx

import React from 'react';
import { AlertTriangle, Package } from 'lucide-react';
import { Alert } from '../../types';

interface AlertsTabProps {
  alerts: Alert[];
}

const AlertsTab: React.FC<AlertsTabProps> = ({ alerts }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Últimos Alertas</h2>
      
      {alerts.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="text-green-600" size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Tudo certo!</h3>
          <p className="text-slate-600">Não há alertas de estoque no momento.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map(alert => (
            <div key={alert.id} className={`bg-white rounded-xl shadow-sm border-l-4 p-6 ${
              alert.severity === 'critical' ? 'border-red-500' : 'border-yellow-500'
            }`}>
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-lg ${
                  alert.severity === 'critical' ? 'bg-red-100' : 'bg-yellow-100'
                }`}>
                  <AlertTriangle className={
                    alert.severity === 'critical' ? 'text-red-600' : 'text-yellow-600'
                  } size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-slate-800">{alert.product}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      alert.severity === 'critical' 
                        ? 'bg-red-100 text-red-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {alert.severity === 'critical' ? 'Crítico' : 'Atenção'}
                    </span>
                  </div>
                  <p className="text-slate-600">{alert.message}</p>
                  <p className="text-sm text-slate-400 mt-2">Data: {alert.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AlertsTab;