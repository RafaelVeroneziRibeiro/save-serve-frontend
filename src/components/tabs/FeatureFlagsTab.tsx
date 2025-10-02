// src/components/tabs/FeatureFlagsTab.tsx

import React from 'react';
import { Settings } from 'lucide-react';
import { FeatureFlags } from '../../types';

interface FeatureFlagsTabProps {
  featureFlags: FeatureFlags;
  toggleFlag: (flag: keyof FeatureFlags) => void;
}

const FLAGS_CONFIG = [
  { key: 'autoAlerts' as keyof FeatureFlags, label: 'Alertas Automáticos', desc: 'Notificações em tempo real de estoque baixo' },
  { key: 'dynamicPricing' as keyof FeatureFlags, label: 'Precificação Dinâmica', desc: 'Ajuste automático de preços baseado em demanda' },
  { key: 'lowStockNotifications' as keyof FeatureFlags, label: 'Notificações de Estoque Baixo', desc: 'Badge de alerta no header' },
  { key: 'priceHistory' as keyof FeatureFlags, label: 'Histórico de Preços', desc: 'Rastreamento de alterações de preço' },
  { key: 'bulkOperations' as keyof FeatureFlags, label: 'Operações em Lote', desc: 'Editar múltiplos produtos simultaneamente' }
];

const FeatureFlagsTab: React.FC<FeatureFlagsTabProps> = ({ featureFlags, toggleFlag }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Feature Flags</h2>
      <p className="text-slate-600">Ative ou desative funcionalidades do sistema</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {FLAGS_CONFIG.map(flag => (
          <div key={flag.key} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-bold text-slate-800 mb-1">{flag.label}</h3>
                <p className="text-sm text-slate-600">{flag.desc}</p>
              </div>
              <button
                onClick={() => toggleFlag(flag.key)}
                className={`ml-4 relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  featureFlags[flag.key] ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    featureFlags[flag.key] ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className={`px-2 py-1 rounded-full font-medium ${
                featureFlags[flag.key] 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-slate-100 text-slate-600'
              }`}>
                {featureFlags[flag.key] ? 'ATIVO' : 'INATIVO'}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
          <Settings size={20} />
          Como funcionam as Feature Flags?
        </h3>
        <p className="text-blue-800 text-sm">
          As feature flags permitem ativar ou desativar funcionalidades do sistema sem precisar fazer deploy. 
          Isso é útil para testar novas features, fazer releases graduais e desabilitar rapidamente features problemáticas.
        </p>
      </div>
    </div>
  );
};

export default FeatureFlagsTab;