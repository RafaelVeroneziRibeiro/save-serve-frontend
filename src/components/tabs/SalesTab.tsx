import React, { useState } from 'react';
import { ShoppingCart, Package, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

const SalesInterface = () => {
  const [batches, setBatches] = useState([
    {
      id: 1,
      nome: 'Arroz Tipo 1 - 5kg',
      quantidade: 50,
      quantidadeVendida: 15,
      valor: 25.90,
      dataEntrada: '2025-01-15',
      dataValidade: '2025-12-31'
    },
    {
      id: 2,
      nome: 'Feijão Preto - 1kg',
      quantidade: 100,
      quantidadeVendida: 45,
      valor: 8.50,
      dataEntrada: '2025-01-20',
      dataValidade: '2025-10-31'
    },
    {
      id: 3,
      nome: 'Óleo de Soja - 900ml',
      quantidade: 30,
      quantidadeVendida: 28,
      valor: 6.99,
      dataEntrada: '2025-02-01',
      dataValidade: '2026-02-01'
    }
  ]);

  const [sales, setSales] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('dinheiro');
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSale = () => {
    if (!selectedBatch) {
      showNotification('Selecione um lote para vender', 'error');
      return;
    }

    const batch = batches.find(b => b.id === selectedBatch);
    const disponivel = batch.quantidade - batch.quantidadeVendida;

    if (quantity > disponivel) {
      showNotification(`Quantidade indisponível. Disponível: ${disponivel}`, 'error');
      return;
    }

    if (quantity < 1) {
      showNotification('Quantidade deve ser maior que zero', 'error');
      return;
    }

    const newSales = [];
    for (let i = 0; i < quantity; i++) {
      newSales.push({
        id: Date.now() + i,
        productId: batch.id,
        productName: batch.nome,
        batchId: batch.id,
        quantity: 1,
        unitPrice: batch.valor,
        totalPrice: batch.valor,
        saleDate: new Date().toISOString(),
        customerName: customerName || 'Cliente',
        paymentMethod,
        createdAt: new Date().toISOString()
      });
    }

    setBatches(batches.map(b => 
      b.id === selectedBatch 
        ? { ...b, quantidadeVendida: b.quantidadeVendida + quantity }
        : b
    ));

    setSales([...sales, ...newSales]);

    showNotification(`${quantity} unidade(s) vendida(s)! ${newSales.length} venda(s) registrada(s).`, 'success');

    setQuantity(1);
    setCustomerName('');
  };

  const getBatchStatus = (batch) => {
    const disponivel = batch.quantidade - batch.quantidadeVendida;
    const percentual = (batch.quantidadeVendida / batch.quantidade) * 100;
    
    if (disponivel === 0) return { text: 'Esgotado', color: 'bg-red-100 text-red-800' };
    if (percentual >= 80) return { text: 'Estoque Baixo', color: 'bg-yellow-100 text-yellow-800' };
    return { text: 'Disponível', color: 'bg-green-100 text-green-800' };
  };

  const getTotalStats = () => {
    const totalSales = sales.length;
    const totalRevenue = sales.reduce((sum, s) => sum + s.totalPrice, 0);
    const avgTicket = totalSales > 0 ? totalRevenue / totalSales : 0;

    return { totalSales, totalRevenue, avgTicket };
  };

  const stats = getTotalStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
          <ShoppingCart className="text-indigo-600" size={40} />
          Sistema de Vendas por Unidade
        </h1>
        <p className="text-gray-600 mb-8">Venda produtos por unidade e acompanhe cada transação</p>

        {notification && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
            notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {notification.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            {notification.message}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total de Vendas</p>
                <p className="text-3xl font-bold text-gray-800">{stats.totalSales}</p>
              </div>
              <ShoppingCart className="text-blue-500" size={32} />
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
                <p className="text-3xl font-bold text-indigo-600">R$ {stats.avgTicket.toFixed(2)}</p>
              </div>
              <Package className="text-indigo-500" size={32} />
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
                  Selecione o Lote
                </label>
                <select
                  value={selectedBatch || ''}
                  onChange={(e) => setSelectedBatch(Number(e.target.value))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Selecione um lote...</option>
                  {batches.map(batch => {
                    const disponivel = batch.quantidade - batch.quantidadeVendida;
                    return (
                      <option key={batch.id} value={batch.id} disabled={disponivel === 0}>
                        {batch.nome} - R$ {batch.valor.toFixed(2)} (Disponível: {disponivel})
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantidade
                </label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                {selectedBatch && (
                  <p className="text-sm text-gray-500 mt-1">
                    Valor total: R$ {(batches.find(b => b.id === selectedBatch)?.valor * quantity).toFixed(2)}
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
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingCart size={20} />
                Registrar Venda
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Package className="text-indigo-600" />
              Lotes Disponíveis
            </h2>

            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {batches.map(batch => {
                const disponivel = batch.quantidade - batch.quantidadeVendida;
                const percentual = (batch.quantidadeVendida / batch.quantidade) * 100;
                const status = getBatchStatus(batch);
                const batchSales = sales.filter(s => s.batchId === batch.id);

                return (
                  <div
                    key={batch.id}
                    className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      selectedBatch === batch.id
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-indigo-300'
                    }`}
                    onClick={() => disponivel > 0 && setSelectedBatch(batch.id)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{batch.nome}</h3>
                        <p className="text-sm text-gray-600">R$ {batch.valor.toFixed(2)} por unidade</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status.color}`}>
                        {status.text}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Total:</span>
                        <span className="font-semibold">{batch.quantidade} unidades</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Vendidas:</span>
                        <span className="font-semibold text-blue-600">{batch.quantidadeVendida} unidades</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Disponível:</span>
                        <span className="font-semibold text-green-600">{disponivel} unidades</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Vendas registradas:</span>
                        <span className="font-semibold">{batchSales.length} transações</span>
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Progresso</span>
                        <span>{percentual.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-indigo-600 h-2 rounded-full transition-all"
                          style={{ width: `${percentual}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Últimas Vendas</h2>
          
          {sales.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Nenhuma venda registrada ainda</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">ID</th>
                    <th className="text-left py-3 px-4">Produto</th>
                    <th className="text-left py-3 px-4">Cliente</th>
                    <th className="text-left py-3 px-4">Qtd</th>
                    <th className="text-left py-3 px-4">Valor</th>
                    <th className="text-left py-3 px-4">Pagamento</th>
                    <th className="text-left py-3 px-4">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.slice(-10).reverse().map(sale => (
                    <tr key={sale.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm">#{sale.id}</td>
                      <td className="py-3 px-4 text-sm">{sale.productName}</td>
                      <td className="py-3 px-4 text-sm">{sale.customerName}</td>
                      <td className="py-3 px-4 text-sm">{sale.quantity}</td>
                      <td className="py-3 px-4 text-sm font-semibold text-green-600">
                        R$ {sale.totalPrice.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-sm capitalize">{sale.paymentMethod}</td>
                      <td className="py-3 px-4 text-sm">
                        {new Date(sale.saleDate).toLocaleString('pt-BR')}
                      </td>
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