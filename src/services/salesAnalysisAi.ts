import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('AIzaSyBDq25Gn5b9tRx5lhpAXUni64hPTJsX5gM');

export interface SalesData {                                                                                                                                                                                                      
  produto: string;
  quantidadeVendida: number;
  valorVenda: number;
  dataVenda: string;
  categoria: string;
  margemLucro: number;
  cliente: string;
  metodoPagamento: 'dinheiro' | 'cartao' | 'pix';
}

// Interface para dados reais de vendas
export interface RealSalesData {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  saleDate: string;                                                                                                                   
  customerName?: string;
  paymentMethod: 'dinheiro' | 'cartao' | 'pix';
  createdAt: string;
}
                                                                                  
export interface SalesTrend {
  periodo: string;
  vendas: number;
  receita: number;
  produtosVendidos: number;
  ticketMedio: number;
}

export interface ProductPerformance {
  produto: string;
  categoria: string;
  vendas: number;
  receita: number;
  margemMedia: number;
  tendencia: 'crescendo' | 'estavel' | 'declinando';
  sazonalidade: string;
  recomendacao: string;
}

export interface CustomerInsight {
  segmento: string;
  comportamento: string;
  preferencias: string[];
  valorMedio: number;
  frequencia: string;
  recomendacao: string;
}

export interface SalesAnalysis {
  resumo: string;
  tendencias: SalesTrend[];
  produtosTop: ProductPerformance[];
  insightsClientes: CustomerInsight[];
  oportunidades: Array<{
    tipo: 'produto' | 'categoria' | 'cliente' | 'promocao';
    titulo: string;
    descricao: string;
    impacto: 'alto' | 'medio' | 'baixo';
    acao: string;
    potencialGanho: number;
  }>;
  metricas: {
    vendasTotal: number;
    receitaTotal: number;
    ticketMedio: number;
    crescimento: number;
    produtosMaisVendidos: number;
    categoriaTop: string;
  };
  previsoes: {
    proximaSemana: number;
    proximoMes: number;
    tendencia: 'alta' | 'estavel' | 'baixa';
    confianca: number;
  };
}

export async function analyzeSalesWithAI(salesData: SalesData[], products: any[]): Promise<SalesAnalysis>;
export async function analyzeSalesWithAI(realSalesData: RealSalesData[], products: any[]): Promise<SalesAnalysis>;
export async function analyzeSalesWithAI(salesData: SalesData[] | RealSalesData[], products: any[]): Promise<SalesAnalysis> {
  try {
    console.log('🔍 Iniciando análise de vendas com IA...');
    console.log('📊 Dados recebidos:', salesData.length, 'transações');
    console.log('📦 Produtos no estoque:', products.length);
    
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const hoje = new Date().toLocaleDateString('pt-BR');
    
    // FOCAR APENAS EM PRODUTOS VENDIDOS (com data de saída)
    const produtosVendidos = products.filter(p => p.dataSaida);
    console.log('🛒 Produtos vendidos encontrados:', produtosVendidos.length);
    
    if (produtosVendidos.length === 0) {
      throw new Error('Nenhum produto vendido encontrado para análise');
    }
    
    // Preparar dados para análise baseados APENAS nos produtos vendidos
    const dadosVendas = produtosVendidos.map(produto => ({
      produto: produto.nome,
      quantidade: produto.quantidade,
      valor: produto.valor * produto.quantidade, // Valor total da venda
      data: produto.dataSaida,
      categoria: 'Geral',
      margem: 0.3, // Margem padrão estimada
      pagamento: 'dinheiro' // Padrão, pois não temos essa info nos produtos
    }));

    // Detalhes dos produtos vendidos para análise
    const detalhesProdutosVendidos = produtosVendidos.map(p => ({
      nome: p.nome,
      valor: p.valor,
      quantidade: p.quantidade,
      dataEntrada: p.dataEntrada,
      dataSaida: p.dataSaida,
      dataValidade: p.dataValidade,
      diasNoEstoque: Math.ceil((new Date(p.dataSaida!).getTime() - new Date(p.dataEntrada).getTime()) / (1000 * 60 * 60 * 24)),
      diasAteVencer: Math.ceil((new Date(p.dataValidade).getTime() - new Date(p.dataSaida!).getTime()) / (1000 * 60 * 60 * 24))
    }));

    // Produtos em estoque (sem data de saída) - apenas para contexto
    const estoqueAtual = products.filter(p => !p.dataSaida).map(p => ({
      nome: p.nome,
      valor: p.valor,
      quantidade: p.quantidade,
      validade: p.dataValidade,
      diasVencer: Math.ceil((new Date(p.dataValidade).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    }));

    const prompt = `
Você é um especialista em análise de vendas e comportamento do consumidor para supermercados. Analise APENAS os produtos que foram vendidos (têm data de saída):

DATA ATUAL: ${hoje}

PRODUTOS VENDIDOS (${detalhesProdutosVendidos.length} produtos que saíram do estoque):
${JSON.stringify(detalhesProdutosVendidos, null, 2)}

DADOS DE VENDAS BASEADOS NOS PRODUTOS VENDIDOS (${dadosVendas.length} vendas):
${JSON.stringify(dadosVendas, null, 2)}

ESTOQUE ATUAL (produtos não vendidos - ${estoqueAtual.length} produtos):
${JSON.stringify(estoqueAtual, null, 2)}

IMPORTANTE: 
- Use APENAS os produtos que têm data de saída (foram vendidos)
- NÃO invente ou adicione dados fictícios
- Foque na análise dos produtos que realmente saíram do estoque
- Considere o tempo que cada produto ficou no estoque antes de sair

IMPORTANTE: Retorne APENAS um JSON válido seguindo esta estrutura exata:

{
  "resumo": "Análise executiva em 2-3 frases sobre o desempenho geral",
  "tendencias": [
    {
      "periodo": "semana 1",
      "vendas": 0,
      "receita": 0,
      "produtosVendidos": 0,
      "ticketMedio": 0
    }
  ],
  "produtosTop": [
    {
      "produto": "nome do produto",
      "categoria": "categoria",
      "vendas": 0,
      "receita": 0,
      "margemMedia": 0,
      "tendencia": "crescendo|estavel|declinando",
      "sazonalidade": "descrição da sazonalidade",
      "recomendacao": "recomendação específica"
    }
  ],
  "insightsClientes": [
    {
      "segmento": "tipo de cliente",
      "comportamento": "descrição do comportamento",
      "preferencias": ["preferência 1", "preferência 2"],
      "valorMedio": 0,
      "frequencia": "alta|media|baixa",
      "recomendacao": "recomendação para este segmento"
    }
  ],
  "oportunidades": [
    {
      "tipo": "produto|categoria|cliente|promocao",
      "titulo": "título da oportunidade",
      "descricao": "descrição detalhada",
      "impacto": "alto|medio|baixo",
      "acao": "ação específica recomendada",
      "potencialGanho": 0
    }
  ],
  "metricas": {
    "vendasTotal": 0,
    "receitaTotal": 0,
    "ticketMedio": 0,
    "crescimento": 0,
    "produtosMaisVendidos": 0,
    "categoriaTop": "nome da categoria"
  },
  "previsoes": {
    "proximaSemana": 0,
    "proximoMes": 0,
    "tendencia": "alta|estavel|baixa",
    "confianca": 0
  }
}

ANÁLISE DEVE CONSIDERAR:
1. Padrões de compra por dia da semana e horário
2. Correlação entre produtos (o que é comprado junto)
3. Sazonalidade e tendências de mercado
4. Comportamento por método de pagamento
5. Produtos com estoque baixo vs alta demanda
6. Oportunidades de cross-selling
7. Segmentação de clientes por valor e frequência
8. Previsão de demanda baseada em histórico
9. Otimização de preços baseada em elasticidade
10. Estratégias de retenção de clientes
11. TEMPO NO ESTOQUE: Analise quantos dias os produtos ficaram no estoque antes de sair
12. ROTATIVIDADE: Identifique produtos que saem rápido vs produtos que ficam muito tempo
13. PADRÕES TEMPORAIS: Analise se há horários/dias específicos com mais saídas
14. EFICIÊNCIA: Produtos que saem próximo ao vencimento vs produtos que saem rapidamente

Seja específico e acionável nas recomendações.
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    return JSON.parse(jsonText);
    
  } catch (error) {
    console.error('Erro na análise de vendas IA:', error);
    return generateFallbackSalesAnalysis(products);
  }
}

function generateFallbackSalesAnalysis(products: any[]): SalesAnalysis {
  // FOCAR APENAS EM PRODUTOS VENDIDOS (com data de saída)
  
  const produtosVendidos = products.filter(p => p.dataSaida);
  
  if (produtosVendidos.length === 0) {
    return {
      resumo: 'Nenhum produto vendido encontrado para análise. Registre produtos com data de saída para obter insights.',
      tendencias: [],
      produtosTop: [],
      insightsClientes: [],
      oportunidades: [],
      metricas: {
        vendasTotal: 0,
        receitaTotal: 0,
        ticketMedio: 0,
        crescimento: 0,
        produtosMaisVendidos: 0,
        categoriaTop: 'N/A'
      },
      previsoes: {
        proximaSemana: 0,
        proximoMes: 0,
        tendencia: 'estavel',
        confianca: 0
      }
    };
  }
  
  // Calcular métricas baseadas APENAS nos produtos vendidos
  const totalTransacoes = produtosVendidos.length;
  const receitaTotal = produtosVendidos.reduce((sum, p) => sum + (p.valor * p.quantidade), 0);
  const ticketMedio = receitaTotal / totalTransacoes;
  
  // Calcular tempo médio no estoque
  const temposEstoque = produtosVendidos.map(p => {
    const entrada = new Date(p.dataEntrada);
    const saida = new Date(p.dataSaida);
    return Math.ceil((saida.getTime() - entrada.getTime()) / (1000 * 60 * 60 * 24));
  });
  const tempoMedioEstoque = temposEstoque.reduce((sum, tempo) => sum + tempo, 0) / temposEstoque.length;

  // Agrupar produtos vendidos por nome
  const produtosMap = new Map<string, { vendas: number; receita: number; margem: number }>();
  produtosVendidos.forEach(produto => {
    const atual = produtosMap.get(produto.nome) || { vendas: 0, receita: 0, margem: 0 };
    produtosMap.set(produto.nome, {
      vendas: atual.vendas + produto.quantidade,
      receita: atual.receita + (produto.valor * produto.quantidade),
      margem: 0.3 // Margem padrão
    });
  });

  const produtosTop = Array.from(produtosMap.entries())
    .map(([produto, dados]) => ({
      produto,
      categoria: 'Geral',
      vendas: dados.vendas,
      receita: dados.receita,
      margemMedia: dados.margem,
      tendencia: 'estavel' as const,
      sazonalidade: 'Produto com demanda constante',
      recomendacao: 'Manter estoque adequado'
    }))
    .sort((a, b) => b.vendas - a.vendas)
    .slice(0, 5);

  const resumoBase = `Análise de ${totalTransacoes} produtos vendidos mostra receita total de R$ ${receitaTotal.toFixed(2)} com ticket médio de R$ ${ticketMedio.toFixed(2)}.`;
  const resumoCompleto = `${resumoBase} Produtos ficaram em média ${tempoMedioEstoque.toFixed(0)} dias no estoque antes de sair.`;

  return {
    resumo: resumoCompleto,
    tendencias: [
      {
        periodo: 'Última semana',
        vendas: Math.floor(totalTransacoes * 0.3),
        receita: Math.floor(receitaTotal * 0.3),
        produtosVendidos: Math.floor(totalTransacoes * 0.3),
        ticketMedio: ticketMedio
      }
    ],
    produtosTop,
    insightsClientes: [
      {
        segmento: 'Clientes Frequentes',
        comportamento: 'Compram regularmente produtos básicos',
        preferencias: ['Produtos de primeira necessidade', 'Marcas conhecidas'],
        valorMedio: ticketMedio * 1.2,
        frequencia: 'alta',
        recomendacao: 'Criar programa de fidelidade'
      }
    ],
    oportunidades: [
      {
        tipo: 'promocao',
        titulo: 'Promoção de produtos com estoque alto',
        descricao: 'Produtos com estoque elevado podem ser promovidos para aumentar rotatividade',
        impacto: 'medio',
        acao: 'Criar promoções semanais',
        potencialGanho: receitaTotal * 0.1
      }
    ],
    metricas: {
      vendasTotal: totalTransacoes, // Número de transações, não unidades
      receitaTotal,
      ticketMedio,
      crescimento: 0,
      produtosMaisVendidos: produtosTop.length,
      categoriaTop: 'Geral'
    },
    previsoes: {
      proximaSemana: Math.floor(receitaTotal * 0.25),
      proximoMes: Math.floor(receitaTotal * 1.1),
      tendencia: 'estavel',
      confianca: 75
    }
  };
}

// Função para gerar dados mockados de vendas
export function generateMockSalesData(products: any[]): SalesData[] {
  const categorias = ['Alimentos', 'Bebidas', 'Limpeza', 'Higiene', 'Padaria'];
  const metodosPagamento: ('dinheiro' | 'cartao' | 'pix')[] = ['dinheiro', 'cartao', 'pix'];
  const clientes = ['Cliente A', 'Cliente B', 'Cliente C', 'Cliente D', 'Cliente E'];
  
  const vendas: SalesData[] = [];
  const hoje = new Date();
  
  // Gerar vendas dos últimos 30 dias
  for (let i = 0; i < 30; i++) {
    const data = new Date(hoje);
    data.setDate(data.getDate() - i);
    
    // 3-8 vendas por dia
    const vendasDoDia = Math.floor(Math.random() * 6) + 3;
    
    for (let j = 0; j < vendasDoDia; j++) {
      const produto = products[Math.floor(Math.random() * products.length)];
      const quantidade = Math.floor(Math.random() * 5) + 1;
      const margem = 0.3 + Math.random() * 0.4; // 30-70% de margem
      const valorVenda = produto.valor * quantidade;
      
      vendas.push({
        produto: produto.nome,
        quantidadeVendida: quantidade,
        valorVenda: valorVenda,
        dataVenda: data.toISOString(),
        categoria: categorias[Math.floor(Math.random() * categorias.length)],
        margemLucro: margem,
        cliente: clientes[Math.floor(Math.random() * clientes.length)],
        metodoPagamento: metodosPagamento[Math.floor(Math.random() * metodosPagamento.length)]
      });
    }
  }
  
  return vendas.sort((a, b) => new Date(b.dataVenda).getTime() - new Date(a.dataVenda).getTime());
}
