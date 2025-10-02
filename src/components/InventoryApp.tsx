import React, { useState } from 'react';
import { Package, AlertTriangle, Settings, Home, Plus, Edit2, Trash2, Box, Bell, DollarSign } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  category: string;
  stock: number;
  minStock: number;
  price: number;
  lastUpdate: string;
}

interface Alert {
  id: number;
  product: string;
  message: string;
  severity: 'critical' | 'warning';
  date: string;
}

interface FeatureFlags {
  autoAlerts: boolean;
  dynamicPricing: boolean;
  lowStockNotifications: boolean;
  priceHistory: boolean;
  bulkOperations: boolean;
}

interface FormData {
  name: string;
  category: string;
  stock: string;
  minStock: string;
  price: string;
}

type TabType = 'home' | 'stock' | 'manage' | 'alerts' | 'flags';

const InventoryApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: 'Arroz 5kg', category: 'Grãos', stock: 45, minStock: 20, price: 28.90, lastUpdate: '2025-10-01' },
    { id: 2, name: 'Feijão Preto 1kg', category: 'Grãos', stock: 12, minStock: 15, price: 8.50, lastUpdate: '2025-10-02' },
    { id: 3, name: 'Óleo de Soja 900ml', category: 'Óleos', stock: 8, minStock: 10, price: 7.90, lastUpdate: '2025-09-30' },
    { id: 4, name: 'Açúcar Cristal 1kg', category: 'Açúcares', stock: 30, minStock: 20, price: 4.50, lastUpdate: '2025-10-01' },
    { id: 5, name: 'Café Torrado 500g', category: 'Bebidas', stock: 25, minStock: 15, price: 18.90, lastUpdate: '2025-10-02' },
    { id: 6, name: 'Leite Integral 1L', category: 'Laticínios', stock: 5, minStock: 20, price: 5.80, lastUpdate: '2025-10-02' }
  ]);

  const [featureFlags, setFeatureFlags] = useState<FeatureFlags>({
    autoAlerts: true,
    dynamicPricing: false,
    lowStockNotifications: true,
    priceHistory: true,
    bulkOperations: false
  });

  const [editingProduct, setEditingProduct] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '', category: '', stock: '', minStock: '', price: ''
  });

  const alerts: Alert[] = products
    .filter(p => p.stock < p.minStock)
    .map(p => ({
      id: p.id,
      product: p.name,
      message: `Estoque baixo: ${p.stock} unidades (mínimo: ${p.minStock})`,
      severity: p.stock < p.minStock * 0.5 ? 'critical' : 'warning',
      date: new Date().toLocaleDateString('pt-BR')
    }));

  const totalValue = products.reduce((sum, p) => sum + (p.stock * p.price), 0);
  const lowStockCount = products.filter(p => p.stock < p.minStock).length;

  const handleAddProduct = (): void => {
    if (formData.name && formData.stock && formData.price) {
      const newProduct: Product = {
        id: Math.max(...products.map(p => p.id), 0) + 1,
        name: formData.name,
        category: formData.category || 'Outros',
        stock: parseInt(formData.stock),
        minStock: parseInt(formData.minStock) || 10,
        price: parseFloat(formData.price),
        lastUpdate: new Date().toISOString().split('T')[0]
      };
      setProducts([...products, newProduct]);
      setFormData({ name: '', category: '', stock: '', minStock: '', price: '' });
    }
  };

  const handleEditProduct = (product: Product): void => {
    setEditingProduct(product.id);
    setFormData({
      name: product.name,
      category: product.category,
      stock: product.stock.toString(),
      minStock: product.minStock.toString(),
      price: product.price.toString()
    });
  };

  const handleUpdateProduct = (): void => {
    setProducts(products.map(p => 
      p.id === editingProduct 
        ? { 
            ...p, 
            name: formData.name,
            category: formData.category,
            stock: parseInt(formData.stock), 
            minStock: parseInt(formData.minStock), 
            price: parseFloat(formData.price) 
          }
        : p
    ));
    setEditingProduct(null);
    setFormData({ name: '', category: '', stock: '', minStock: '', price: '' });
  };

  const handleDeleteProduct = (id: number): void => {
    setProducts(products.filter(p => p.id !== id));
  };

  const toggleFlag = (flag: keyof FeatureFlags): void => {
    setFeatureFlags({ ...featureFlags, [flag]: !featureFlags[flag] });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
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
            {featureFlags.lowStockNotifications && lowStockCount > 0 && (
              <div className="flex items-center gap-2 bg-red-50 px-3 py-2 rounded-lg">
                <Bell className="text-red-600" size={18} />
                <span className="text-sm font-medium text-red-600">{lowStockCount} alertas</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1">
            {[
              { id: 'home' as TabType, label: 'Home', icon: Home },
              { id: 'stock' as TabType, label: 'Estoque', icon: Box },
              { id: 'manage' as TabType, label: 'Gerenciar', icon: Edit2 },
              { id: 'alerts' as TabType, label: 'Alertas', icon: AlertTriangle },
              { id: 'flags' as TabType, label: 'Feature Flags', icon: Settings }
            ].map(tab => (
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* HOME TAB */}
        {activeTab === 'home' && (
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
                    <p className="text-sm text-slate-500 font-medium">Estoque Baixo</p>
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
                {products.slice(0, 5).map(product => (
                  <div key={product.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-800">{product.name}</p>
                      <p className="text-sm text-slate-500">{product.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-800">{product.stock} un.</p>
                      <p className="text-sm text-green-600">R$ {product.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STOCK TAB */}
        {activeTab === 'stock' && (
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
        )}

        {/* MANAGE TAB */}
        {activeTab === 'manage' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">Gerenciar Produtos</h2>
            
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4">
                {editingProduct ? 'Editar Produto' : 'Adicionar Novo Produto'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Nome do produto"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Categoria"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="number"
                  placeholder="Quantidade"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="number"
                  placeholder="Estoque mínimo"
                  value={formData.minStock}
                  onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Preço (R$)"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
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
                      onClick={() => {
                        setEditingProduct(null);
                        setFormData({ name: '', category: '', stock: '', minStock: '', price: '' });
                      }}
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
                      <p className="font-medium text-slate-800">{product.name}</p>
                      <p className="text-sm text-slate-500">{product.category} • {product.stock} unidades • R$ {product.price.toFixed(2)}</p>
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
        )}

        {/* ALERTS TAB */}
        {activeTab === 'alerts' && (
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
        )}

        {/* FEATURE FLAGS TAB */}
        {activeTab === 'flags' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">Feature Flags</h2>
            <p className="text-slate-600">Ative ou desative funcionalidades do sistema</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: 'autoAlerts' as keyof FeatureFlags, label: 'Alertas Automáticos', desc: 'Notificações em tempo real de estoque baixo' },
                { key: 'dynamicPricing' as keyof FeatureFlags, label: 'Precificação Dinâmica', desc: 'Ajuste automático de preços baseado em demanda' },
                { key: 'lowStockNotifications' as keyof FeatureFlags, label: 'Notificações de Estoque Baixo', desc: 'Badge de alerta no header' },
                { key: 'priceHistory' as keyof FeatureFlags, label: 'Histórico de Preços', desc: 'Rastreamento de alterações de preço' },
                { key: 'bulkOperations' as keyof FeatureFlags, label: 'Operações em Lote', desc: 'Editar múltiplos produtos simultaneamente' }
              ].map(flag => (
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
        )}
      </main>
    </div>
  );
};

export default InventoryApp;