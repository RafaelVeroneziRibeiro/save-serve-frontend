// ============================================
// 📁 src/services/geminiService.ts
// Serviço de IA com Google Gemini
// ============================================

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('AIzaSyBDq25Gn5b9tRx5lhpAXUni64hPTJsX5gM');

export interface AIAnalysis {
  resumo: string;
  alertas: Array<{
    tipo: 'critico' | 'alerta' | 'aviso' | 'info';
    titulo: string;
    mensagem: string;
    acao: string;
  }>;
  metricas: {
    vencidos: number;
    criticos: number;
    avisos: number;
    estoqueBaixo: number;
  };
  valorEmRisco: number;
}

export async function analyzeInventoryWithAI(products: any[]): Promise<AIAnalysis> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    const hoje = new Date().toISOString().split('T')[0];
    
    const prompt = `
Você é um especialista em gestão de estoque de supermercados. Analise o seguinte inventário e forneça insights:

Data de hoje: ${hoje}

Produtos:
${JSON.stringify(products.map(p => ({
  nome: p.nome,
  quantidade: p.quantidade,
  valor: p.valor,
  dataValidade: p.dataValidade,
  dataEntrada: p.dataEntrada
})), null, 2)}

IMPORTANTE: Retorne APENAS um objeto JSON válido, sem texto adicional, seguindo exatamente esta estrutura:

{
  "resumo": "Análise geral do estoque em uma frase",
  "alertas": [
    {
      "tipo": "critico",
      "titulo": "Título do alerta",
      "mensagem": "Descrição detalhada",
      "acao": "Ação recomendada"
    }
  ],
  "metricas": {
    "vencidos": 0,
    "criticos": 0,
    "avisos": 0,
    "estoqueBaixo": 0
  },
  "valorEmRisco": 0
}

Tipos de alerta:
- "critico": produtos já vencidos
- "alerta": produtos vencendo em até 7 dias
- "aviso": produtos vencendo em 8-30 dias ou estoque baixo
- "info": recomendações gerais

Calcule:
1. Produtos vencidos (dataValidade < hoje)
2. Produtos críticos (vencendo em 7 dias)
3. Produtos em aviso (vencendo em 30 dias)
4. Produtos com estoque baixo (quantidade < 10)
5. Valor em risco (soma do valor dos produtos vencidos e críticos)
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // Remove markdown se houver
    const jsonText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const analysis = JSON.parse(jsonText);
    return analysis;
    
  } catch (error) {
    console.error('Erro ao analisar com IA:', error);
    
    // Fallback: análise básica sem IA
    return generateFallbackAnalysis(products);
  }
}

function generateFallbackAnalysis(products: any[]): AIAnalysis {
  const hoje = new Date();
  const seteDias = new Date(hoje.getTime() + 7 * 24 * 60 * 60 * 1000);
  const trintaDias = new Date(hoje.getTime() + 30 * 24 * 60 * 60 * 1000);

  const vencidos = products.filter(p => new Date(p.dataValidade) < hoje);
  const criticos = products.filter(p => {
    const val = new Date(p.dataValidade);
    return val >= hoje && val <= seteDias;
  });
  const avisos = products.filter(p => {
    const val = new Date(p.dataValidade);
    return val > seteDias && val <= trintaDias;
  });
  const estoqueBaixo = products.filter(p => p.quantidade < 10);

  const valorEmRisco = [...vencidos, ...criticos].reduce(
    (sum, p) => sum + p.valor * p.quantidade, 0
  );

  const alertas = [];
  
  if (vencidos.length > 0) {
    alertas.push({
      tipo: 'critico' as const,
      titulo: `${vencidos.length} produto(s) vencido(s)`,
      mensagem: `Remova: ${vencidos.map(p => p.nome).join(', ')}`,
      acao: 'Remover do estoque imediatamente'
    });
  }

  if (criticos.length > 0) {
    alertas.push({
      tipo: 'alerta' as const,
      titulo: `${criticos.length} produto(s) vencendo em 7 dias`,
      mensagem: `Atenção: ${criticos.map(p => p.nome).join(', ')}`,
      acao: 'Fazer promoção urgente'
    });
  }

  if (estoqueBaixo.length > 0) {
    alertas.push({
      tipo: 'aviso' as const,
      titulo: `${estoqueBaixo.length} produto(s) com estoque baixo`,
      mensagem: `Reabastecer: ${estoqueBaixo.slice(0, 3).map(p => p.nome).join(', ')}`,
      acao: 'Solicitar reposição'
    });
  }

  return {
    resumo: vencidos.length > 0 
      ? `Atenção: ${vencidos.length} produto(s) vencido(s) requer ação imediata!`
      : 'Estoque em condições normais.',
    alertas,
    metricas: {
      vencidos: vencidos.length,
      criticos: criticos.length,
      avisos: avisos.length,
      estoqueBaixo: estoqueBaixo.length
    },
    valorEmRisco
  };
}


// ============================================
// 📁 src/components/tabs/HomeTab.tsx
// HomeTab com IA integrada
// ============================================

import React, { useState, useEffect } from 'react';
import { Package, DollarSign, AlertTriangle, Brain, TrendingDown, Calendar, ShoppingCart, Loader2 } from 'lucide-react';
import { Product } from '../../types';


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
              <p className="text-sm text-slate-500 font-medium">Valor em Risco</p>
              <p className="text-3xl font-bold text-red-600 mt-1">
                R$ {aiAnalysis ? aiAnalysis.valorEmRisco.toFixed(2) : '0.00'}
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