import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  ShoppingCart,
  Brain,
  Loader2,
  BarChart3,
  Target,
  Lightbulb,
  Calendar,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react';
import {
  analyzeSalesWithAI,
  generateMockSalesData,
  SalesAnalysis,
  SalesData,
  RealSalesData
} from '../../services/salesAnalysisAi';
import { useSales } from '../../hooks/useSales';

interface SalesAnalysisTabProps {
  products: any[];
  sales?: RealSalesData[]; // Dados reais de vendas (opcional)
}

const SalesAnalysisTab: React.FC<SalesAnalysisTabProps> = ({ products, sales: realSales }) => {
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [analysis, setAnalysis] = useState<SalesAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useRealData, setUseRealData] = useState(false);

  useEffect(() => {
    if (realSales && realSales.length > 0) {
      setUseRealData(true);
      setSalesData([]); // Limpar dados mockados
      // Usar dados reais de vendas
      analyzeSales();
    } else {
      setUseRealData(false);
      // Gerar dados mockados de vendas APENAS se não houver vendas reais
      const mockSales = generateMockSalesData(products);
      setSalesData(mockSales);
      
      // Análise automática
      if (mockSales.length > 0) {
        analyzeSales();
      }
    }
  }, [products, realSales]);

  const analyzeSales = async () => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      let result: SalesAnalysis;
      
      // SEMPRE priorizar dados reais se existirem
      if (realSales && realSales.length > 0) {
        console.log('Analisando com dados REAIS:', realSales.length, 'vendas');
        result = await analyzeSalesWithAI(realSales, products);
      } else if (salesData && salesData.length > 0) {
        console.log('Analisando com dados MOCKADOS:', salesData.length, 'vendas');
        result = await analyzeSalesWithAI(salesData, products);
      } else {
        throw new Error('Nenhum dado de venda disponível para análise');
      }
      
      setAnalysis(result);
    } catch (err: any) {
      setError('Erro ao analisar vendas com IA');
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getTendenciaIcon = (tendencia: string) => {
    switch (tendencia) {
      case 'crescendo':
        return <ArrowUpRight className="text-green-600" size={16} />;
      case 'declinando':
        return <ArrowDownRight className="text-red-600" size={16} />;
      default:
        return <Minus className="text-gray-600" size={16} />;
    }
  };

  const getTendenciaColor = (tendencia: string) => {
    switch (tendencia) {
      case 'crescendo':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'declinando':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getImpactoColor = (impacto: string) => {
    switch (impacto) {
      case 'alto':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'medio':
        return 'bg-orange-100 text-orange-700 border-orange-300';
      default:
        return 'bg-green-100 text-green-700 border-green-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-md border border-blue-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <BarChart3 className="text-blue-600" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">
                Análise Inteligente de Vendas
              </h3>
              <p className="text-sm text-slate-600">
                Insights de IA para otimizar seu negócio
              </p>
            </div>
          </div>
          <button
            onClick={analyzeSales}
            disabled={isAnalyzing}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                Analisando...
              </>
            ) : (
              <>
                <Brain size={16} />
                Atualizar Análise
              </>
            )}
          </button>
        </div>

        <div className="bg-white/80 rounded-lg p-4 mb-4">
          <p className="text-sm text-slate-700">
            A IA analisa padrões de compra, comportamento do cliente, sazonalidade e tendências 
            para fornecer insights acionáveis que podem aumentar suas vendas em até 25%.
          </p>
          {realSales && realSales.length > 0 ? (
            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm font-medium text-green-800">
                ✅ Analisando {realSales.length} vendas reais registradas
              </p>
            </div>
          ) : (
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm font-medium text-yellow-800">
                ⚠️ Usando dados de demonstração. Registre vendas reais para análise personalizada.
              </p>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {isAnalyzing ? (
          <div className="bg-white/80 rounded-lg p-8 flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-blue-600 mb-3" size={32} />
            <p className="text-slate-600">A IA está analisando seus dados de vendas...</p>
            <p className="text-sm text-slate-500 mt-1">
              Analisando {useRealData ? (realSales?.length || 0) : salesData.length} transações
              {useRealData ? ' (dados reais)' : ' (dados de demonstração)'}
            </p>
          </div>
        ) : analysis ? (
          <>
            {/* Resumo Executivo */}
            <div className="bg-white/80 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="text-blue-600" size={20} />
                <h4 className="font-semibold text-slate-800">Resumo Executivo</h4>
              </div>
              <p className="text-sm text-slate-700">{analysis.resumo}</p>
            </div>

            {/* Métricas Principais */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white/80 rounded-lg p-4 text-center">
                <div className="bg-green-100 p-2 rounded-lg w-fit mx-auto mb-2">
                  <DollarSign className="text-green-600" size={20} />
                </div>
                <p className="text-2xl font-bold text-green-600">
                  R$ {analysis.metricas.receitaTotal.toFixed(0)}
                </p>
                <p className="text-xs text-slate-600 mt-1">Receita Total</p>
              </div>
              
              <div className="bg-white/80 rounded-lg p-4 text-center">
                <div className="bg-blue-100 p-2 rounded-lg w-fit mx-auto mb-2">
                  <ShoppingCart className="text-blue-600" size={20} />
                </div>
                <p className="text-2xl font-bold text-blue-600">
                  {analysis.metricas.vendasTotal}
                </p>
                <p className="text-xs text-slate-600 mt-1">Transações</p>
              </div>
              
              <div className="bg-white/80 rounded-lg p-4 text-center">
                <div className="bg-purple-100 p-2 rounded-lg w-fit mx-auto mb-2">
                  <Target className="text-purple-600" size={20} />
                </div>
                <p className="text-2xl font-bold text-purple-600">
                  R$ {analysis.metricas.ticketMedio.toFixed(0)}
                </p>
                <p className="text-xs text-slate-600 mt-1">Ticket Médio</p>
              </div>
              
              <div className="bg-white/80 rounded-lg p-4 text-center">
                <div className="bg-orange-100 p-2 rounded-lg w-fit mx-auto mb-2">
                  <TrendingUp className="text-orange-600" size={20} />
                </div>
                <p className="text-2xl font-bold text-orange-600">
                  {analysis.metricas.crescimento > 0 ? '+' : ''}{analysis.metricas.crescimento}%
                </p>
                <p className="text-xs text-slate-600 mt-1">Crescimento</p>
              </div>
            </div>

            {/* Previsões */}
            <div className="bg-white/80 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="text-blue-600" size={20} />
                <h4 className="font-semibold text-slate-800">Previsões da IA</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-sm text-slate-600">Próxima Semana</p>
                  <p className="text-xl font-bold text-blue-600">
                    R$ {analysis.previsoes.proximaSemana.toFixed(0)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-slate-600">Próximo Mês</p>
                  <p className="text-xl font-bold text-green-600">
                    R$ {analysis.previsoes.proximoMes.toFixed(0)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-slate-600">Tendência</p>
                  <div className="flex items-center justify-center gap-1">
                    {analysis.previsoes.tendencia === 'alta' && <TrendingUp className="text-green-600" size={16} />}
                    {analysis.previsoes.tendencia === 'baixa' && <TrendingDown className="text-red-600" size={16} />}
                    {analysis.previsoes.tendencia === 'estavel' && <Minus className="text-gray-600" size={16} />}
                    <span className="text-sm font-medium capitalize">{analysis.previsoes.tendencia}</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {analysis.previsoes.confianca}% confiança
                  </p>
                </div>
              </div>
            </div>

            {/* Top Produtos */}
            <div className="bg-white/80 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Star className="text-yellow-600" size={20} />
                <h4 className="font-semibold text-slate-800">Top Produtos</h4>
              </div>
              <div className="space-y-3">
                {analysis.produtosTop.slice(0, 5).map((produto, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="bg-yellow-100 p-1 rounded text-xs font-bold text-yellow-700">
                        #{index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-slate-800 text-sm">{produto.produto}</p>
                        <p className="text-xs text-slate-500">{produto.categoria}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`px-2 py-1 rounded-full text-xs border ${getTendenciaColor(produto.tendencia)}`}>
                        {getTendenciaIcon(produto.tendencia)}
                        <span className="ml-1 capitalize">{produto.tendencia}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-green-600">
                          R$ {produto.receita.toFixed(0)}
                        </p>
                        <p className="text-xs text-slate-500">{produto.vendas} vendas</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Oportunidades */}
            <div className="bg-white/80 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="text-yellow-600" size={20} />
                <h4 className="font-semibold text-slate-800">Oportunidades de Crescimento</h4>
              </div>
              <div className="space-y-3">
                {analysis.oportunidades.map((oportunidade, index) => (
                  <div key={index} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="font-medium text-slate-800">{oportunidade.titulo}</h5>
                      <span className={`px-2 py-1 rounded-full text-xs border ${getImpactoColor(oportunidade.impacto)}`}>
                        {oportunidade.impacto.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mb-2">{oportunidade.descricao}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-green-600">
                        Potencial: R$ {oportunidade.potencialGanho.toFixed(0)}
                      </p>
                      <button className="text-sm text-blue-600 hover:underline">
                        → {oportunidade.acao}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Insights de Clientes */}
            <div className="bg-white/80 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Users className="text-purple-600" size={20} />
                <h4 className="font-semibold text-slate-800">Insights de Clientes</h4>
              </div>
              <div className="space-y-3">
                {analysis.insightsClientes.map((insight, index) => (
                  <div key={index} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-slate-800">{insight.segmento}</h5>
                      <span className="text-sm text-slate-500 capitalize">
                        Frequência: {insight.frequencia}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mb-2">{insight.comportamento}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-500">Valor médio</p>
                        <p className="text-sm font-bold text-purple-600">
                          R$ {insight.valorMedio.toFixed(0)}
                        </p>
                      </div>
                      <button className="text-sm text-blue-600 hover:underline">
                        → {insight.recomendacao}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default SalesAnalysisTab;
