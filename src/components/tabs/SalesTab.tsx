import React, { useState, useEffect } from 'react';
import { ShoppingCart, Package, TrendingUp, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { produtos } from '../../utils/mock';

// Função para converter formato de data DD/MM/YYYY para YYYY-MM-DD
const convertDateFormat = (dateStr) => {
  if (!dateStr) return null;
  const [day, month, year] = dateStr.split('/');
  return `${year}-${month}-${day}`;
};

// Função para normalizar produtos do mock para o formato esperado
const normalizeProducts = (mockProducts) => {
  return mockProducts.map((p, index) => ({
    id: index + 1,
    nome: p.nome,
    valor: p.valor,
    quantidade: p.quantidade,
    dataEntrada: convertDateFormat(p.data_entrada),
    horaEntrada: p.hora_entrada,
    dataSaida: convertDateFormat(p.data_saida),
    horaSaida: p.hora_saida,
    dataValidade: convertDateFormat(p.data_validade)
  }));
};

const SalesInterface = () => {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('dinheiro');
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const normalizedProducts = normalizeProducts(produtos);
    setProducts(normalizedProducts);
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const availableProducts = products.filter(p => !p.dataSaida && p.quantidade > 0);

  const handleSale = () => {
    if (!selectedProduct) {
      showNotification('Selecione um produto para vender', 'error');
      return;
    }

    const product = products.find(p => p.id === selectedProduct);
    
    if (!product) {
      showNotification('Produto não encontrado', 'error');
      return;
    }

    if (quantity > product.quantidade) {
      showNotification(`Quantidade indisponível. Estoque: ${product.quantidade}`, 'error');
      return;
    }

    if (quantity < 1) {
      showNotification('Quantidade deve ser maior que zero', 'error');
      return;
    }

    const newSale = {
      id: Date.now(),
      productId: product.id,
      productName: product.nome,
      quantity: quantity,
      unitPrice: product.valor,
      totalPrice: product.valor * quantity,
      saleDate: new Date().toISOString(),
      customerName: customerName || 'Cliente',
      paymentMethod,
      createdAt: new Date().toISOString()
    };

    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().split(' ')[0].substring(0, 5);

    setProducts(products.map(p => 
      p.id === selectedProduct 
        ? { 
            ...p, 
            quantidade: p.quantidade - quantity,
            dataSaida: (p.quantidade - quantity) === 0 ? dateStr : p.dataSaida,
            horaSaida: (p.quantidade - quantity) === 0 ? timeStr : p.horaSaida
          }
        : p
    ));

    setSales([newSale, ...sales]);
    showNotification(`Venda registrada! ${quantity} unidade(s) de ${product.nome}`, 'success');

    setQuantity(1);
    setCustomerName('');
    setSelectedProduct(null);
  };

  const getTotalStats = () => {
    const totalSales = sales.length;
    const totalRevenue = sales.reduce((sum, s) => sum + s.totalPrice, 0);
    const totalUnits = sales.reduce((sum, s) => sum + s.quantity, 0);
    const avgTicket = totalSales > 0 ? totalRevenue / totalSales : 0;
    return { totalSales, totalRevenue, totalUnits, avgTicket };
  };

  const stats = getTotalStats();

  const getDaysUntilExpiry = (expiryDate) => {
    if (!expiryDate) return 999;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getExpiryStatus = (daysUntilExpiry) => {
    if (daysUntilExpiry < 0) return { text: 'Vencido', color: 'bg-red-100 text-red-800' };
    if (daysUntilExpiry <= 7) return { text: 'Crítico', color: 'bg-orange-100 text-orange-800' };
    if (daysUntilExpiry <= 30) return { text: 'Atenção', color: 'bg-yellow-100 text-yellow-800' };
    return { text: 'Ok', color: 'bg-green-100 text-green-800' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
          <ShoppingCart className="text-indigo-600" size={40} />
          Sistema de Vendas por Unidade
        </h1>
        <p className="text-gray-600 mb-8">Venda produtos do estoque real por unidade</p>

        {notification && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
            notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {notification.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            {notification.message}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Transações</p>
                <p className="text-3xl font-bold text-gray-800">{stats.totalSales}</p>
              </div>
              <ShoppingCart className="text-blue-500" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Unidades Vendidas</p>
                <p className="text-3xl font-bold text-indigo-600">{stats.totalUnits}</p>
              </div>
              <Package className="text-indigo-500" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Receita Total</p>
                <p className="text-3xl font-bold text-green-600">R$ {stats.totalRevenue.toFixed(2)}</p>
              </div>
              <TrendingUp className="text-green-500" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Ticket Médio</p>
                <p className="text-3xl font-bold text-purple-600">R$ {stats.avgTicket.toFixed(2)}</p>
              </div>
              <TrendingUp className="text-purple-500" size={32} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <ShoppingCart className="text-indigo-600" />
              Nova Venda
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selecione o Produto
                </label>
                <select
                  value={selectedProduct || ''}
                  onChange={(e) => setSelectedProduct(Number(e.target.value))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Selecione um produto...</option>
                  {availableProducts.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.nome} - R$ {product.valor.toFixed(2)} (Estoque: {product.quantidade})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantidade de Unidades
                </label>
                <input
                  type="number"
                  min="1"
                  max={selectedProduct ? products.find(p => p.id === selectedProduct)?.quantidade : 999}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                {selectedProduct && (
                  <p className="text-sm text-gray-500 mt-1">
                    Valor total: R$ {(products.find(p => p.id === selectedProduct)?.valor * quantity).toFixed(2)}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cliente (opcional)
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Nome do cliente"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Método de Pagamento
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="dinheiro">Dinheiro</option>
                  <option value="cartao">Cartão</option>
                  <option value="pix">PIX</option>
                </select>
              </div>

              <button
                onClick={handleSale}
                disabled={!selectedProduct}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <ShoppingCart size={20} />
                Registrar Venda
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Package className="text-indigo-600" />
              Produtos Disponíveis ({availableProducts.length})
            </h2>

            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {availableProducts.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Nenhum produto disponível no momento</p>
              ) : (
                availableProducts.map((product) => {
                  const daysUntilExpiry = getDaysUntilExpiry(product.dataValidade);
                  const expiryStatus = getExpiryStatus(daysUntilExpiry);

                  return (
                    <div
                      key={product.id}
                      className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                        selectedProduct === product.id
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-indigo-300'
                      }`}
                      onClick={() => setSelectedProduct(product.id)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800">{product.nome}</h3>
                          <p className="text-sm text-gray-600">R$ {product.valor.toFixed(2)} por unidade</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${expiryStatus.color}`}>
                          {expiryStatus.text}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Estoque:</span>
                          <span className="font-semibold text-indigo-600">{product.quantidade} unidades</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Validade:</span>
                          <span className="font-semibold">{new Date(product.dataValidade).toLocaleDateString('pt-BR')}</span>
                        </div>
                        <div className="flex justify-between text-sm items-center">
                          <span className="text-gray-600">Vence em:</span>
                          <span className={`font-semibold flex items-center gap-1 ${
                            daysUntilExpiry < 7 ? 'text-red-600' : 'text-gray-800'
                          }`}>
                            <Clock size={14} />
                            {daysUntilExpiry} dias
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Histórico de Vendas ({sales.length})</h2>
          
          {sales.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Nenhuma venda registrada ainda</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Data/Hora</th>
                    <th className="text-left py-3 px-4">Produto</th>
                    <th className="text-left py-3 px-4">Cliente</th>
                    <th className="text-left py-3 px-4">Qtd</th>
                    <th className="text-left py-3 px-4">Valor Unit.</th>
                    <th className="text-left py-3 px-4">Total</th>
                    <th className="text-left py-3 px-4">Pagamento</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.map(sale => (
                    <tr key={sale.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm">
                        {new Date(sale.saleDate).toLocaleString('pt-BR')}
                      </td>
                      <td className="py-3 px-4 text-sm font-medium">{sale.productName}</td>
                      <td className="py-3 px-4 text-sm">{sale.customerName}</td>
                      <td className="py-3 px-4 text-sm font-semibold">{sale.quantity}</td>
                      <td className="py-3 px-4 text-sm">R$ {sale.unitPrice.toFixed(2)}</td>
                      <td className="py-3 px-4 text-sm font-semibold text-green-600">
                        R$ {sale.totalPrice.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-sm capitalize">{sale.paymentMethod}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesInterface;