import React, { useState } from "react";
import {
  DollarSign,
  TrendingUp,
  AlertCircle,
  Brain,
  Loader2,
  Sparkles,
  FileText,
} from "lucide-react";
import {
  analyzePricingWithAI,
  analyzeBulkPricing,
  ProductPricingData,
  PricingSuggestion,
} from "../../services/pricingAi"; // Assumindo este caminho

// ==========================================================
// FUNÇÃO AUXILIAR PARA CÁLCULO DE DESCONTO DINÂMICO (MANTIDA, MAS IGNORADA NA ANÁLISE COM IA)
// ==========================================================
const calculateDynamicDiscount = (daysUntilExpiration: number, quantity: number): number => {
  const MIN_DISCOUNT = 5;
  const MAX_DISCOUNT = 30;

  // 1. Fator de Urgência (Validade):
  const MAX_DAYS_FOR_FULL_URGENCY = 15;
  const MIN_DAYS_FOR_ZERO_URGENCY = 120;
  
  let urgencyFactor = 0;
  if (daysUntilExpiration <= MAX_DAYS_FOR_FULL_URGENCY) {
    urgencyFactor = 1.0;
  } else if (daysUntilExpiration < MIN_DAYS_FOR_ZERO_URGENCY) {
    urgencyFactor = 1.0 - (daysUntilExpiration - MAX_DAYS_FOR_FULL_URGENCY) / (MIN_DAYS_FOR_ZERO_URGENCY - MAX_DAYS_FOR_FULL_URGENCY);
  } else {
    urgencyFactor = 0.0;
  }
  urgencyFactor = Math.max(0, Math.min(1.0, urgencyFactor)); 

  // 2. Fator de Estoque (Quantidade):
  const MAX_QTY_FOR_FULL_STOCK_IMPACT = 5;
  const MIN_QTY_FOR_ZERO_STOCK_IMPACT = 100;

  let stockFactor = 0;
  if (quantity <= MAX_QTY_FOR_FULL_STOCK_IMPACT) {
    stockFactor = 1.0;
  } else if (quantity < MIN_QTY_FOR_ZERO_STOCK_IMPACT) {
    stockFactor = 1.0 - (quantity - MAX_QTY_FOR_FULL_STOCK_IMPACT) / (MIN_QTY_FOR_ZERO_STOCK_IMPACT - MAX_QTY_FOR_FULL_STOCK_IMPACT);
  } else {
    stockFactor = 0.0;
  }
  stockFactor = Math.max(0, Math.min(1.0, stockFactor)); 
  
  // 3. Ponderação dos fatores (Validade tem mais peso que estoque)
  const WEIGHT_URGENCY = 0.7;
  const WEIGHT_STOCK = 0.3;
  const weightedFactor = (urgencyFactor * WEIGHT_URGENCY) + (stockFactor * WEIGHT_STOCK);
  
  // 4. Cálculo do Desconto Final (entre 5% e 30%)
  const discountRange = MAX_DISCOUNT - MIN_DISCOUNT;
  const finalDiscount = MIN_DISCOUNT + (discountRange * weightedFactor);

  return Math.min(MAX_DISCOUNT, Math.max(MIN_DISCOUNT, Math.round(finalDiscount)));
};

interface PricingAIPanelProps {
  products: any[];
}

const PricingAIPanel: React.FC<PricingAIPanelProps> = ({ products }) => {
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [suggestion, setSuggestion] = useState<PricingSuggestion | null>(null);
  const [bulkAnalysis, setBulkAnalysis] = useState<any | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isBulkAnalyzing, setIsBulkAnalyzing] = useState(false);

  const analyzePricing = async (product: any) => {
    setSelectedProduct(product);
    setIsAnalyzing(true);
    setSuggestion(null);
    setBulkAnalysis(null);

    try {
      const daysAteVencer = Math.ceil(
        (new Date(product.dataValidade).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      );
      
      // ==========================================================
      // CORREÇÃO: O CÁLCULO LOCAL FOI REMOVIDO DAQUI. 
      // A função 'analyzePricingWithAI' agora é responsável por 
      // retornar o preço sugerido e o desconto calculados pela IA.
      // ==========================================================

      const pricingData: ProductPricingData = {
        nome: product.nome,
        precoAtual: product.valor,
        precoCusto: product.valor * 0.6, // Simulação de Custo
        quantidade: product.quantidade || 50,
        diasAteVencer: daysAteVencer,
        categoria: product.categoria || "Geral",
        vendas30dias: Math.floor(Math.random() * 100), // Simulação de Vendas
        precosConcorrencia: [
          product.valor * 0.95,
          product.valor * 1.05,
          product.valor * 0.98,
        ], // Simulação de Concorrência
      };

      // Chama o serviço de IA para obter a sugestão
      const result = await analyzePricingWithAI(pricingData);
      
      // USANDO O RESULTADO DIRETO DA IA, que contém o preço e desconto calculados
      setSuggestion(result);
      
    } catch (error) {
      console.error("Erro:", error);
      // O fallback já é tratado dentro da função analyzePricingWithAI
    } finally {
      setIsAnalyzing(false);
    }
  };

  const analyzeAllProducts = async () => {
    setIsBulkAnalyzing(true);
    setBulkAnalysis(null);
    setSelectedProduct(null);
    setSuggestion(null);

    try {
      const result = await analyzeBulkPricing(products);
      setBulkAnalysis(result);
    } catch (error) {
      console.error("Erro na análise em massa:", error);
      // O fallback já é tratado dentro da função analyzeBulkPricing
    } finally {
      setIsBulkAnalyzing(false);
    }
  };

  const getEstrategiaColor = (estrategia: string) => {
    switch (estrategia) {
      case "urgente":
        return "bg-red-100 text-red-700 border-red-300";
      case "promocional":
        return "bg-orange-100 text-orange-700 border-orange-300";
      case "competitivo":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "premium":
        return "bg-purple-100 text-purple-700 border-purple-300";
      default:
        return "bg-green-100 text-green-700 border-green-300";
    }
  };

  const getUrgenciaIcon = (urgencia: string) => {
    switch (urgencia) {
      case "alta":
        return <AlertCircle className="text-red-600" size={20} />;
      case "media":
        return <TrendingUp className="text-orange-600" size={20} />;
      default:
        return <Sparkles className="text-green-600" size={20} />;
    }
  };

  // Mostrar 10 produtos mais relevantes (críticos e promocionais)
  const relevantProducts = products
    .sort((a, b) => {
      const daysA = Math.ceil((new Date(a.dataValidade).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      const daysB = Math.ceil((new Date(b.dataValidade).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      
      return daysA - daysB; // Ordena do mais urgente para o menos
    })
    .slice(0, 10);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-md border border-green-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-green-100 p-2 rounded-lg">
            <DollarSign className="text-green-600" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">
              Precificação Dinâmica com IA
            </h3>
            <p className="text-sm text-slate-600">
              Otimize preços baseado em múltiplos fatores
            </p>
          </div>
        </div>

        <div className="bg-white/80 rounded-lg p-4 mb-4">
          <p className="text-sm text-slate-700">
            A IA analisa: validade, estoque, concorrência, sazonalidade,
            histórico de vendas e margem de lucro para sugerir o preço ideal que
            maximiza lucro sem perder competitividade.
          </p>
        </div>

        {/* Botão Analisar Todos */}
        <button
          onClick={analyzeAllProducts}
          disabled={isBulkAnalyzing}
          className="w-full mb-6 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition disabled:opacity-50 font-semibold"
        >
          {isBulkAnalyzing ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Analisando {products.length} produtos...
            </>
          ) : (
            <>
              <FileText size={20} />
              Analisar Todos os Produtos ({products.length})
            </>
          )}
        </button>

        {/* Loading Análise em Massa */}
        {isBulkAnalyzing && (
          <div className="bg-white/80 rounded-lg p-8 flex flex-col items-center justify-center mb-6">
            <Loader2 className="animate-spin text-purple-600 mb-3" size={40} />
            <p className="text-slate-700 font-medium">
              Analisando todo o estoque com IA...
            </p>
            <p className="text-sm text-slate-500 mt-2">
              Isso pode levar alguns segundos
            </p>
          </div>
        )}

        {/* Resultado Análise em Massa */}
        {bulkAnalysis && !isBulkAnalyzing && (
          <div className="bg-white rounded-lg border-2 border-purple-300 p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="text-purple-600" size={24} />
              <h4 className="font-bold text-lg text-slate-800">
                Relatório Completo - {products.length} Produtos
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <p className="text-sm text-red-600 font-medium mb-1">
                  Ação Urgente
                </p>
                <p className="text-3xl font-bold text-red-700">
                  {bulkAnalysis.urgentes}
                </p>
                <p className="text-xs text-red-600 mt-1">produtos críticos</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <p className="text-sm text-orange-600 font-medium mb-1">
                  Promoção
                </p>
                <p className="text-3xl font-bold text-orange-700">
                  {bulkAnalysis.promocionais}
                </p>
                <p className="text-xs text-orange-600 mt-1">
                  produtos para promoção
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-sm text-green-600 font-medium mb-1">
                  Estáveis
                </p>
                <p className="text-3xl font-bold text-green-700">
                  {bulkAnalysis.estaveis}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  mantêm preço atual
                </p>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <p className="text-sm font-semibold text-blue-800 mb-2">
                Resumo Executivo:
              </p>
              <p className="text-sm text-blue-700">{bulkAnalysis.resumo}</p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg mb-4">
              <p className="text-sm font-semibold text-purple-800 mb-2">
                Impacto Financeiro Estimado:
              </p>
              <p className="text-sm text-purple-700">{bulkAnalysis.impacto}</p>
            </div>

            <div className="space-y-3">
              <p className="font-semibold text-slate-800 text-sm">
                Top 5 Prioridades:
              </p>
              {bulkAnalysis.prioridades.map((item: any, i: number) => (
                <div
                  key={i}
                  className="bg-slate-50 p-3 rounded-lg border border-slate-200"
                >
                  <div className="flex items-start justify-between mb-1">
                    <p className="font-medium text-slate-800 text-sm">
                      {item.produto}
                    </p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        item.urgencia === "alta"
                          ? "bg-red-100 text-red-700"
                          : item.urgencia === "media"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {item.urgencia}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">{item.acao}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-slate-500">
                      De R$ {item.precoAtual} → R$ {item.precoSugerido}
                    </span>
                    <span className="text-xs font-medium text-green-600">
                      {item.desconto > 0 ? `-${item.desconto}%` : "Manter"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lista de produtos individuais */}
        {!bulkAnalysis && (
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-800 mb-3">
              Ou analise produtos individuais:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {relevantProducts.map((product) => { // Agora contém produtos críticos e promocionais
                const days = Math.ceil(
                  (new Date(product.dataValidade).getTime() -
                    new Date().getTime()) /
                    (1000 * 60 * 60 * 24)
                );

                return (
                  <button
                    key={product.id}
                    onClick={() => analyzePricing(product)}
                    disabled={isAnalyzing}
                    className="bg-white p-4 rounded-lg border border-slate-200 hover:border-green-400 transition text-left disabled:opacity-50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-slate-800 text-sm">
                        {product.nome}
                      </p>
                      <Brain className="text-green-600" size={16} />
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600">
                        R$ {product.valor.toFixed(2)}
                      </span>
                      <span
                        className={`${
                          days <= 30 ? "text-red-600" : days <= 60 ? "text-orange-600" : "text-slate-600"
                        }`}
                      >
                        {days}d restantes
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Loading Individual */}
        {isAnalyzing && (
          <div className="mt-6 bg-white/80 rounded-lg p-6 flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-green-600 mb-3" size={32} />
            <p className="text-slate-600">Analisando precificação com IA...</p>
            <p className="text-sm text-slate-500 mt-1">
              Considerando múltiplos fatores de mercado
            </p>
          </div>
        )}

        {/* Resultado Individual */}
        {suggestion && selectedProduct && !isAnalyzing && (
          <div className="mt-6 bg-white rounded-lg border-2 border-green-300 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="font-bold text-lg text-slate-800">
                  {selectedProduct.nome}
                </h4>
                <span
                  className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium border ${getEstrategiaColor(
                    suggestion.estrategia
                  )}`}
                >
                  Estratégia: {suggestion.estrategia.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {getUrgenciaIcon(suggestion.urgencia)}
                <span className="text-xs font-medium text-slate-600">
                  Urgência {suggestion.urgencia}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">Preço Atual</p>
                <p className="text-2xl font-bold text-slate-800">
                  R$ {suggestion.precoAtual.toFixed(2)}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-xs text-green-600 mb-1">
                  Preço Sugerido pela IA
                </p>
                <p className="text-2xl font-bold text-green-700">
                  R$ {suggestion.precoSugerido.toFixed(2)}
                </p>
              </div>
            </div>

            {suggestion.descontoPercentual > 0 && (
              <div className="bg-orange-50 p-3 rounded-lg mb-4">
                <p className="text-sm font-medium text-orange-800">
                  Desconto de {suggestion.descontoPercentual.toFixed(0)}%
                </p>
                <p className="text-xs text-orange-600 mt-1">
                  Economia para o cliente: R${" "}
                  {(suggestion.precoAtual - suggestion.precoSugerido).toFixed(
                    2
                  )}
                </p>
              </div>
            )}

            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <p className="text-sm font-semibold text-blue-800 mb-2">
                Razão da Sugestão:
              </p>
              <p className="text-sm text-blue-700">{suggestion.razao}</p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm font-semibold text-purple-800 mb-2">
                Impacto Estimado:
              </p>
              <p className="text-sm text-purple-700">{suggestion.impactoEstimado}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PricingAIPanel;