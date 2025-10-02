// src/components/layout/Navigation.tsx

import React from 'react';
import { Home, Box, Edit2, AlertTriangle, Settings } from 'lucide-react';
import { TabType } from '../../types';

interface NavigationProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const TABS = [
  { id: 'home' as TabType, label: 'Home', icon: Home },
  { id: 'stock' as TabType, label: 'Estoque', icon: Box },
  { id: 'manage' as TabType, label: 'Gerenciar', icon: Edit2 },
  { id: 'alerts' as TabType, label: 'Alertas', icon: AlertTriangle },
  { id: 'flags' as TabType, label: 'Feature Flags', icon: Settings }
];

const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex gap-1">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;