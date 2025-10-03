import React from 'react';
import { Package, Bell, LogOut, UserCircle } from 'lucide-react';

interface HeaderProps {
  lowStockCount: number;
  showNotifications: boolean;
  onLogout: () => void;
  userName: string;
}

const Header: React.FC<HeaderProps> = ({ lowStockCount, showNotifications, onLogout, userName }) => {
  return (
    <header className="bg-white shadow-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Package className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">MercadoStock</h1>
              <p className="text-xs text-slate-500">Sistema de Controle de Estoque</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            {showNotifications && lowStockCount > 0 && (
              <div className="flex items-center gap-2 text-red-600">
                <Bell size={18} />
                <span className="text-sm font-medium">{lowStockCount} alertas</span>
              </div>
            )}

            <div className="flex items-center gap-2 text-slate-600">
              <UserCircle size={20} />
              <span className="text-sm font-medium">{userName}</span>
            </div>

            <button 
              onClick={onLogout} 
              className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-red-600 transition-colors"
            >
              <LogOut size={16} />
              Sair
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;