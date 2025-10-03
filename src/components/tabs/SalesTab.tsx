import React, { useState } from 'react';
import {
  ShoppingCart,
  Plus,
  Trash2,
  DollarSign,
  Calendar,
  User,
  CreditCard,
  TrendingUp,
  Package,
  Receipt
} from 'lucide-react';
import { useSales } from '../../hooks/useSales';
import { Sale } from '../../types/sales';

interface SalesTabProps {
  products: any[];
}

const SalesTab: React.FC<SalesTabProps> = ({ products }) => {
  const {
    sales,
    salesSummary,
    formData,
    setFormData,
    handleAddSale,
    handleDeleteSale,
    resetForm
  } = useSales();

  const [showForm, setShowForm] = useState(false);

  const selectedProduct = products.find(p => p.id === parseInt(formData.productId));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAddSale(products);
    setShowForm(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Vendas</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          <Plus size={20} />
          Nova Venda
        </button>
      </div>

      {/* Resumo de Vendas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">Total de Vendas</p>
              <p className="text-3xl font-bold text-slate-800 mt-1">{salesSummary.totalSales}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <ShoppingCart className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">Receita Total</p>
              <p className="text-3xl font-bold text-green-600 mt-1">
                {formatCurrency(salesSummary.totalRevenue)}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <DollarSign className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">Ticket Médio</p>
              <p className="text-3xl font-bold text-purple-600 mt-1">
                {formatCurrency(salesSummary.averageTicket)}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <TrendingUp className="text-purple-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">Produtos Vendidos</p>
              <p className="text-3xl font-bold text-orange-600 mt-1">
                {salesSummary.topProducts.length}
              </p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <Package className="text-orange-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Formulário de Nova Venda */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Registrar Nova Venda</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Seleção de Produto */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Produto *
                </label>
                <select
                  value={formData.productId}
                  onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Selecione um produto</option>
                  {products.map(product => (
                    <option key={product.id} value={product.id}>
                      {product.nome} - {formatCurrency(product.valor)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantidade */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Quantidade *
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: 2"
                  required
                />
              </div>

              {/* Preço Unitário */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Preço Unitário *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.unitPrice}
                  onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: 10.50"
                  required
                />
                {selectedProduct && (
                  <p className="text-xs text-slate-500 mt-1">
                    Preço sugerido: {formatCurrency(selectedProduct.valor)}
                  </p>
                )}
              </div>

              {/* Método de Pagamento */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Método de Pagamento *
                </label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="dinheiro">Dinheiro</option>
                  <option value="cartao">Cartão</option>
                  <option value="pix">PIX</option>
                </select>
              </div>

              {/* Nome do Cliente */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Nome do Cliente (Opcional)
                </label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: João Silva"
                />
              </div>
            </div>

            {/* Total Calculado */}
            {formData.quantity && formData.unitPrice && (
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-green-800">Total da Venda:</span>
                  <span className="text-2xl font-bold text-green-600">
                    {formatCurrency(parseFloat(formData.quantity) * parseFloat(formData.unitPrice))}
                  </span>
                </div>
              </div>
            )}

            {/* Botões */}
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition font-medium"
              >
                Registrar Venda
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="flex-1 bg-slate-200 text-slate-700 py-2 px-4 rounded-lg hover:bg-slate-300 transition font-medium"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de Vendas */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Histórico de Vendas</h3>
        
        {sales.length === 0 ? (
          <div className="text-center py-8">
            <Receipt className="mx-auto text-slate-400 mb-3" size={48} />
            <p className="text-slate-500">Nenhuma venda registrada ainda.</p>
            <p className="text-sm text-slate-400 mt-1">Clique em "Nova Venda" para começar.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sales.map(sale => (
              <div key={sale.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition">
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <ShoppingCart className="text-green-600" size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">{sale.productName}</p>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <Package size={14} />
                        {sale.quantity} unidades
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign size={14} />
                        {formatCurrency(sale.unitPrice)} cada
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {formatDate(sale.saleDate)}
                      </span>
                      {sale.customerName && (
                        <span className="flex items-center gap-1">
                          <User size={14} />
                          {sale.customerName}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <CreditCard size={14} />
                        {sale.paymentMethod}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">
                      {formatCurrency(sale.totalPrice)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteSale(sale.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Excluir venda"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Top Produtos */}
      {salesSummary.topProducts.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Top Produtos Vendidos</h3>
          <div className="space-y-3">
            {salesSummary.topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="bg-yellow-100 p-1 rounded text-sm font-bold text-yellow-700">
                    #{index + 1}
                  </div>
                  <span className="font-medium text-slate-800">{product.productName}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-green-600">
                    {formatCurrency(product.revenue)}
                  </p>
                  <p className="text-xs text-slate-500">{product.totalSold} unidades</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesTab;
