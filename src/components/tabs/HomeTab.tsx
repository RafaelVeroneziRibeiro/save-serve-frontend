import React, { useState, useEffect } from 'react';
import { Package, DollarSign, AlertTriangle, Brain, TrendingDown, Calendar, ShoppingCart, Loader2 } from 'lucide-react';
import { Product } from '../../types';
import { analyzeInventoryWithAI, AIAnalysis } from '../../services/aiService';
import { formatCurrency } from '../../utils/dataTransformer'

interface HomeTabProps {
  products: Product[];
  totalValue: number;
  lowStockCount: number;
}

const HomeTab: React.FC<HomeTabProps> = ({ products, totalValue, lowStockCount }) => {
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Análise automática quando produtos mudam
  useEffect(() => {
    if (products.length > 0) {
      analyzeWithAI();
    }
  }, [products]);

  const analyzeWithAI = async () => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const analysis = await analyzeInventoryWithAI(products);
      setAiAnalysis(analysis);
    } catch (err: any) {
      setError('Erro ao analisar com IA');
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getCorTipo = (tipo: string) => {
    switch (tipo) {
      case 'critico': return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', icon: 'text-red-600' };
      case 'alerta': return { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', icon: 'text-orange-600' };
      case 'aviso': return { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', icon: 'text-yellow-600' };
      default: return { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', icon: 'text-blue-600' };
    }
  };

  const getIcone = (tipo: string) => {
    switch (tipo) {
      case 'critico': return AlertTriangle;
      case 'alerta': return Calendar;
      case 'aviso': return TrendingDown;
      default: return ShoppingCart;
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>
      
      {/* Cards de métricas */}
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
              <p className="text-3xl font-bold text-green-600 mt-1">{formatCurrency(totalValue)}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <DollarSign className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">Valor em Risco</p>
              <p className="text-3xl font-bold text-red-600 mt-1">
                {aiAnalysis ? formatCurrency(aiAnalysis.valorEmRisco) : 'R$ 0,00'}
              </p>
              <p className="text-xs text-slate-500 mt-1">Análise por IA</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <AlertTriangle className="text-red-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Painel de IA */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl shadow-md border border-purple-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Brain className="text-purple-600" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Análise com Google Gemini AI</h3>
              <p className="text-sm text-slate-600">Insights gerados por inteligência artificial</p>
            </div>
          </div>
          <button
            onClick={analyzeWithAI}
            disabled={isAnalyzing}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                Analisando...
              </>
            ) : (
              'Atualizar Análise'
            )}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {isAnalyzing ? (
          <div className="bg-white/80 rounded-lg p-8 flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-purple-600 mb-3" size={32} />
            <p className="text-slate-600">A IA está analisando seu estoque...</p>
          </div>
        ) : aiAnalysis ? (
          <>
            {/* Resumo */}
            <div className="bg-white/80 rounded-lg p-4 mb-4">
              <p className="text-sm font-medium text-slate-700">{aiAnalysis.resumo}</p>
            </div>

            {/* Alertas */}
            <div className="space-y-3 mb-4">
              {aiAnalysis.alertas.length === 0 ? (
                <div className="bg-white/80 rounded-lg p-4 text-center text-slate-600">
                  Tudo certo! Nenhuma ação necessária no momento.
                </div>
              ) : (
                aiAnalysis.alertas.map((alerta, index) => {
                  const cores = getCorTipo(alerta.tipo);
                  const Icone = getIcone(alerta.tipo);
                  
                  return (
                    <div key={index} className={`${cores.bg} rounded-lg p-4 border ${cores.border}`}>
                      <div className="flex items-start gap-3">
                        <div className={`${cores.icon} mt-1`}>
                          <Icone size={20} />
                        </div>
                        <div className="flex-1">
                          <h4 className={`font-semibold ${cores.text} mb-1`}>{alerta.titulo}</h4>
                          <p className="text-sm text-slate-600 mb-2">{alerta.mensagem}</p>
                          <button className={`text-xs font-medium ${cores.text} hover:underline`}>
                            → {alerta.acao}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Métricas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-white/80 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-red-600">{aiAnalysis.metricas.vencidos}</p>
                <p className="text-xs text-slate-600 mt-1">Vencidos</p>
              </div>
              <div className="bg-white/80 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-orange-600">{aiAnalysis.metricas.criticos}</p>
                <p className="text-xs text-slate-600 mt-1">Críticos (7d)</p>
              </div>
              <div className="bg-white/80 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-yellow-600">{aiAnalysis.metricas.avisos}</p>
                <p className="text-xs text-slate-600 mt-1">Atenção (30d)</p>
              </div>
              <div className="bg-white/80 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-blue-600">{aiAnalysis.metricas.estoqueBaixo}</p>
                <p className="text-xs text-slate-600 mt-1">Estoque Baixo</p>
              </div>
            </div>
          </>
        ) : null}
      </div>

      {/* Produtos Recentes */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Produtos Recentes</h3>
        <div className="space-y-3">
          {products.slice(-5).reverse().map(product => {
            const validade = new Date(product.dataValidade);
            const hoje = new Date();
            const diasRestantes = Math.ceil((validade.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
            
            let corValidade = 'text-green-600';
            if (diasRestantes < 0) corValidade = 'text-red-600';
            else if (diasRestantes <= 7) corValidade = 'text-orange-600';
            else if (diasRestantes <= 30) corValidade = 'text-yellow-600';

            return (
              <div key={product.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition">
                <div>
                  <p className="font-medium text-slate-800">{product.nome}</p>
                  <p className="text-sm text-slate-500">
                    Entrada: {new Date(product.dataEntrada).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${corValidade}`}>
                    {diasRestantes < 0 ? 'VENCIDO' : `${diasRestantes} dias`}
                  </p>
                  <p className="text-sm text-slate-600">
                    {new Date(product.dataValidade).toLocaleDateString('pt-BR')}
                  </p>
                  <p className="text-sm text-green-600 font-medium">R$ {product.valor.toFixed(2)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HomeTab;