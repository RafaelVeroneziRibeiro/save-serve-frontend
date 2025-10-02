import React, { useState } from 'react';
import { useInventory } from './hooks/useInventory';
import { TabType, FeatureFlags } from './types';
import Header from './components/layout/Header';
import Navigation from './components/layout/Navigation';
import HomeTab from './components/tabs/HomeTab';
import StockTab from './components/tabs/StockTab';
import ManageTab from './components/tabs/ManageTab';
import AlertsTab from './components/tabs/AlertsTab';
import FeatureFlagsTab from './components/tabs/FeatureFlagsTab';

// Importando a nova página de autenticação
import AuthPage from './pages/Login';

// Componente do Dashboard de Inventário
const InventoryDashboard: React.FC<{ onLogout: () => void; userName: string; }> = ({ onLogout, userName }) => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const inventory = useInventory();
  // ... outras lógicas como feature flags poderiam ficar aqui

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'home':
        return <HomeTab products={inventory.products} totalValue={inventory.totalValue} lowStockCount={inventory.lowStockCount} />;
      case 'stock':
        return <StockTab products={inventory.products} />;
      case 'manage':
        return <ManageTab {...inventory} />;
      case 'alerts':
        return <AlertsTab alerts={inventory.alerts} />;
      // case 'flags':
      //   return <FeatureFlagsTab featureFlags={featureFlags} toggleFlag={toggleFlag} />;
      default:
        return <h2>Tab não encontrada</h2>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header 
        lowStockCount={inventory.lowStockCount} 
        showNotifications={true} // Simplificado por agora
        onLogout={onLogout}
        userName={userName} // Passando o nome do usuário para o Header
      />
      <Navigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />
      <main className="max-w-7xl mx-auto px-4 py-6">
        {renderActiveTab()}
      </main>
    </div>
  );
};


// Componente principal que controla a aplicação
const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState('');

  const handleLoginSuccess = (userName: string) => {
    setCurrentUser(userName);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setCurrentUser('');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <AuthPage onLoginSuccess={handleLoginSuccess} />;
  }

  return <InventoryDashboard onLogout={handleLogout} userName={currentUser} />;
};

export default App;