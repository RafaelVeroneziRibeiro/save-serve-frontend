import React from 'react';
import {
  ShoppingCart,
  DollarSign,
  Calendar,
  TrendingUp,
  Package,
  Receipt
} from 'lucide-react';

interface SalesTabProps {
  products: any[];
}

const SalesTab: React.FC<SalesTabProps> = ({ products }) => {

  // Produtos que já saíram (têm data de saída)
  const produtosVendidos = products.filter(p => p.dataSaida);
  
  // Calcular métricas baseadas nos produtos vendidos
  const vendasSummary = {
    totalSales: produtosVendidos.length,
    totalRevenue: produtosVendidos.reduce((sum, p) => sum + (p.valor * p.quantidade), 0),
    averageTicket: produtosVendidos.length > 0 ? produtosVendidos.reduce((sum, p) => sum + (p.valor * p.quantidade), 0) / produtosVendidos.length : 0,
    salesByPaymentMethod: { dinheiro: 0, cartao: 0, pix: 0 }, // Não temos essa info nos produtos
    topProducts: produtosVendidos
      .reduce((acc, p) => {
        const existing = acc.find(item => item.productName === p.nome);
        if (existing) {
          existing.totalSold += p.quantidade;
          existing.revenue += (p.valor * p.quantidade);
        } else {
          acc.push({
            productName: p.nome,
            totalSold: p.quantidade,
            revenue: p.valor * p.quantidade
          });
        }
        return acc;
      }, [] as Array<{ productName: string; totalSold: number; revenue: number }>)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)
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
        <div className="text-sm text-slate-500">
          Vendas baseadas em produtos com data de saída
        </div>
      </div>

      {/* Resumo de Vendas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">Produtos Vendidos</p>
              <p className="text-3xl font-bold text-slate-800 mt-1">{vendasSummary.totalSales}</p>
              <p className="text-xs text-slate-500 mt-1">Produtos com data de saída</p>
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
                {formatCurrency(vendasSummary.totalRevenue)}
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
                {formatCurrency(vendasSummary.averageTicket)}
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
              <p className="text-sm text-slate-500 font-medium">Tipos de Produtos</p>
              <p className="text-3xl font-bold text-orange-600 mt-1">
                {vendasSummary.topProducts.length}
              </p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <Package className="text-orange-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Informação sobre como registrar vendas */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="bg-blue-100 p-1 rounded">
            <ShoppingCart className="text-blue-600" size={16} />
          </div>
          <h4 className="font-medium text-blue-800">Como registrar vendas</h4>
        </div>
        <p className="text-sm text-blue-700">
          Para registrar uma venda, vá para a aba <strong>"Gerenciar"</strong> e adicione uma <strong>data de saída</strong> ao produto vendido. 
          Os produtos com data de saída aparecerão automaticamente aqui como vendas.
        </p>
      </div>

      {/* Lista de Produtos Vendidos */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Produtos Vendidos</h3>
        
        {produtosVendidos.length === 0 ? (
          <div className="text-center py-8">
            <Receipt className="mx-auto text-slate-400 mb-3" size={48} />
            <p className="text-slate-500">Nenhum produto vendido ainda.</p>
            <p className="text-sm text-slate-400 mt-1">Adicione data de saída aos produtos na aba "Gerenciar".</p>
          </div>
        ) : (
          <div className="space-y-3">
            {produtosVendidos.map(produto => {
              const dataEntrada = new Date(produto.dataEntrada);
              const dataSaida = new Date(produto.dataSaida!);
              const diasNoEstoque = Math.ceil((dataSaida.getTime() - dataEntrada.getTime()) / (1000 * 60 * 60 * 24));
              const valorTotal = produto.valor * produto.quantidade;
              
              return (
                <div key={produto.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition">
                  <div className="flex items-center gap-4">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <ShoppingCart className="text-green-600" size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{produto.nome}</p>
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                          <Package size={14} />
                          {produto.quantidade} unidades
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign size={14} />
                          {formatCurrency(produto.valor)} cada
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          Saída: {formatDate(produto.dataSaida!)}
                        </span>
                        <span className="flex items-center gap-1">
                          <TrendingUp size={14} />
                          {diasNoEstoque} dias no estoque
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">
                      {formatCurrency(valorTotal)}
                    </p>
                    <p className="text-xs text-slate-500">
                      {formatCurrency(produto.valor)} × {produto.quantidade}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Top Produtos */}
      {vendasSummary.topProducts.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Top Produtos Vendidos</h3>
          <div className="space-y-3">
            {vendasSummary.topProducts.map((product, index) => (
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
