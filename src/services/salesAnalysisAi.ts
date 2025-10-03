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
    
    const produtosVendidos = products.filter(p => p.dataSaida);
    console.log('🛒 Produtos vendidos encontrados:', produtosVendidos.length);
    
    if (produtosVendidos.length === 0) {
      throw new Error('Nenhum produto vendido encontrado para análise');
    }
    
    const totalUnidadesVendidas = produtosVendidos.reduce((sum, p) => sum + p.quantidade, 0);
    const receitaTotal = produtosVendidos.reduce((sum, p) => sum + (p.valor * p.quantidade), 0);
    const totalTransacoes = produtosVendidos.length;
    
    const dadosVendas = produtosVendidos.map(produto => ({
      produto: produto.nome,
      quantidade: produto.quantidade,
      valor: produto.valor * produto.quantidade,
      data: produto.dataSaida,
      categoria: 'Geral',
      margem: 0.3,
      pagamento: 'dinheiro'
    }));

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

    const estoqueAtual = products.filter(p => !p.dataSaida).map(p => ({
      nome: p.nome,
      valor: p.valor,
      quantidade: p.quantidade,
      validade: p.dataValidade,
      diasVencer: Math.ceil((new Date(p.dataValidade).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    }));

    const prompt = `
Você é um especialista em análise de vendas e comportamento do consumidor para supermercados.

DATA ATUAL: ${hoje}

IMPORTANTE - CONTAGEM DE VENDAS:
- Total de UNIDADES vendidas: ${totalUnidadesVendidas} unidades
- Total de TRANSAÇÕES: ${totalTransacoes} vendas
- Receita total: R$ ${receitaTotal.toFixed(2)}
- USE ${totalUnidadesVendidas} como valor de "vendas" nas métricas

PRODUTOS VENDIDOS:
${JSON.stringify(detalhesProdutosVendidos, null, 2)}

DADOS DE VENDAS:
${JSON.stringify(dadosVendas, null, 2)}

ESTOQUE ATUAL:
${JSON.stringify(estoqueAtual, null, 2)}

Retorne APENAS um JSON válido seguindo esta estrutura:

{
  "resumo": "Análise executiva em 2-3 frases",
  "tendencias": [
    {
      "periodo": "semana 1",
      "vendas": ${totalUnidadesVendidas},
      "receita": ${receitaTotal.toFixed(2)},
      "produtosVendidos": ${totalUnidadesVendidas},
      "ticketMedio": ${(receitaTotal / totalTransacoes).toFixed(2)}
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
      "sazonalidade": "descrição",
      "recomendacao": "recomendação"
    }
  ],
  "insightsClientes": [
    {
      "segmento": "tipo de cliente",
      "comportamento": "descrição",
      "preferencias": ["pref1", "pref2"],
      "valorMedio": 0,
      "frequencia": "alta|media|baixa",
      "recomendacao": "recomendação"
    }
  ],
  "oportunidades": [
    {
      "tipo": "produto|categoria|cliente|promocao",
      "titulo": "título",
      "descricao": "descrição",
      "impacto": "alto|medio|baixo",
      "acao": "ação",
      "potencialGanho": 0
    }
  ],
  "metricas": {
    "vendasTotal": ${totalUnidadesVendidas},
    "receitaTotal": ${receitaTotal.toFixed(2)},
    "ticketMedio": ${(receitaTotal / totalTransacoes).toFixed(2)},
    "crescimento": 0,
    "produtosMaisVendidos": 0,
    "categoriaTop": "Geral"
  },
  "previsoes": {
    "proximaSemana": 0,
    "proximoMes": 0,
    "tendencia": "alta|estavel|baixa",
    "confianca": 0
  }
}

CRÍTICO: Use ${totalUnidadesVendidas} como valor de vendasTotal nas métricas.
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const parsed = JSON.parse(jsonText);
    
    parsed.metricas.vendasTotal = totalUnidadesVendidas;
    parsed.metricas.receitaTotal = receitaTotal;
    parsed.metricas.ticketMedio = receitaTotal / totalTransacoes;
    
    return parsed;
    
  } catch (error) {
    console.error('Erro na análise de vendas IA:', error);
    return generateFallbackSalesAnalysis(products);
  }
}

function generateFallbackSalesAnalysis(products: any[]): SalesAnalysis {
  const produtosVendidos = products.filter(p => p.dataSaida);
  
  if (produtosVendidos.length === 0) {
    return {
      resumo: 'Nenhum produto vendido encontrado para análise.',
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
  
  const totalUnidadesVendidas = produtosVendidos.reduce((sum, p) => sum + p.quantidade, 0);
  const totalTransacoes = produtosVendidos.length;
  const receitaTotal = produtosVendidos.reduce((sum, p) => sum + (p.valor * p.quantidade), 0);
  const ticketMedio = receitaTotal / totalTransacoes;

  const produtosMap = new Map();
  produtosVendidos.forEach(produto => {
    const atual = produtosMap.get(produto.nome) || { vendas: 0, receita: 0, margem: 0 };
    produtosMap.set(produto.nome, {
      vendas: atual.vendas + produto.quantidade,
      receita: atual.receita + (produto.valor * produto.quantidade),
      margem: 0.3
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

  const resumo = `Análise de ${totalUnidadesVendidas} unidades vendidas em ${totalTransacoes} transações mostrando receita de R$ ${receitaTotal.toFixed(2)}.`;

  return {
    resumo,
    tendencias: [
      {
        periodo: 'Período Atual',
        vendas: totalUnidadesVendidas,
        receita: receitaTotal,
        produtosVendidos: totalUnidadesVendidas,
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
        titulo: 'Promoção de produtos',
        descricao: 'Criar estratégias para aumentar vendas',
        impacto: 'medio',
        acao: 'Implementar promoções',
        potencialGanho: receitaTotal * 0.1
      }
    ],
    metricas: {
      vendasTotal: totalUnidadesVendidas,
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

export function generateMockSalesData(products: any[]): SalesData[] {
  const categorias = ['Alimentos', 'Bebidas', 'Limpeza', 'Higiene', 'Padaria'];
  const metodosPagamento: ('dinheiro' | 'cartao' | 'pix')[] = ['dinheiro', 'cartao', 'pix'];
  const clientes = ['Cliente A', 'Cliente B', 'Cliente C', 'Cliente D', 'Cliente E'];
  
  const vendas: SalesData[] = [];
  const hoje = new Date();
  
  for (let i = 0; i < 30; i++) {
    const data = new Date(hoje);
    data.setDate(data.getDate() - i);
    
    const vendasDoDia = Math.floor(Math.random() * 6) + 3;
    
    for (let j = 0; j < vendasDoDia; j++) {
      const produto = products[Math.floor(Math.random() * products.length)];
      const quantidade = Math.floor(Math.random() * 5) + 1;
      const margem = 0.3 + Math.random() * 0.4;
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