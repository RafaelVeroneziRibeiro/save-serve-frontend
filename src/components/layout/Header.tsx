// src/components/layout/Header.tsx
import React, { useState } from "react";
import { Package, Bell, LogOut, UserCircle, DollarSign, X } from "lucide-react";

interface HeaderProps {
  lowStockCount: number;
  showNotifications: boolean;
  onLogout: () => void;
  userName: string;
  products?: any[]; // Adicione esta prop
}

const Header: React.FC<HeaderProps> = ({
  lowStockCount,
  showNotifications,
  onLogout,
  userName,
  products = [],
}) => {
  const [showPricingModal, setShowPricingModal] = useState(false);

  return (
    <>
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Package className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">
                  MercadoStock
                </h1>
                <p className="text-xs text-slate-500">
                  Sistema de Controle de Estoque com IA
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              {/* Botão Precificação IA */}
              <button
                onClick={() => setShowPricingModal(true)}
                className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-sm"
              >
                <DollarSign size={18} />
                <span className="text-sm font-medium">Precificação IA</span>
              </button>

              {showNotifications && lowStockCount > 0 && (
                <div className="flex items-center gap-2 text-red-600">
                  <Bell size={18} />
                  <span className="text-sm font-medium">
                    {lowStockCount} alertas
                  </span>
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

      {/* Modal de Precificação */}
      {showPricingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">
                Precificação Dinâmica com IA
              </h2>
              <button
                onClick={() => setShowPricingModal(false)}
                className="text-slate-500 hover:text-slate-700 transition"
              >
                <X size={24} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
