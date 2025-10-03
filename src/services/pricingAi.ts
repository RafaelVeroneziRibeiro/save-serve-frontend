import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('AIzaSyBDq25Gn5b9tRx5lhpAXUni64hPTJsX5gM');

export interface PricingSuggestion {
  precoAtual: number;
  precoSugerido: number;
  estrategia: 'urgente' | 'promocional' | 'competitivo' | 'premium' | 'normal';
  razao: string;
  impactoEstimado: string;
  descontoPercentual: number;
  urgencia: 'alta' | 'media' | 'baixa';
}

export interface ProductPricingData {
  nome: string;
  precoAtual: number;
  precoCusto: number;
  quantidade: number;
  diasAteVencer: number;
  categoria: string;
  vendas30dias?: number;
  precosConcorrencia?: number[];
}

export interface BulkPricingAnalysis {
  urgentes: number;
  promocionais: number;
  estaveis: number;
  resumo: string;
  impacto: string;
  prioridades: Array<{
    produto: string;
    precoAtual: string;
    precoSugerido: string;
    desconto: number;
    urgencia: 'alta' | 'media' | 'baixa';
    acao: string;
  }>;
}

export async function analyzePricingWithAI(product: ProductPricingData): Promise<PricingSuggestion> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `
Você é um especialista em precificação de varejo. Analise o produto e sugira o preço ótimo:

PRODUTO:
- Nome: ${product.nome}
- Preço Atual: R$ ${product.precoAtual.toFixed(2)}
- Custo: R$ ${product.precoCusto.toFixed(2)}
- Margem Atual: ${(((product.precoAtual - product.precoCusto) / product.precoAtual) * 100).toFixed(1)}%
- Quantidade em Estoque: ${product.quantidade} unidades
- Dias até Vencer: ${product.diasAteVencer} dias
- Categoria: ${product.categoria}
${product.vendas30dias ? `- Vendas (30 dias): ${product.vendas30dias} unidades` : ''}
${product.precosConcorrencia ? `- Preços da Concorrência: R$ ${product.precosConcorrencia.join(', R$ ')}` : ''}

CONTEXTO:
- Data: ${new Date().toLocaleDateString('pt-BR')}
- Considere sazonalidade, urgência de venda, competitividade

REGRAS:
- Nunca sugira preço abaixo do custo (exceto em caso EXTREMO de vencimento iminente)
- Produtos vencendo em < 7 dias = desconto agressivo
- Produtos vencendo em 7-30 dias = desconto moderado
- Estoque alto = considerar promoção
- Comparar com concorrência se disponível

Retorne APENAS um JSON válido:
{
  "precoSugerido": 0.00,
  "estrategia": "urgente|promocional|competitivo|premium|normal",
  "razao": "Explicação clara em 1 frase",
  "impactoEstimado": "Descrição do impacto esperado",
  "descontoPercentual": 0,
  "urgencia": "alta|media|baixa"
}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const suggestion = JSON.parse(jsonText);
    
    return {
      precoAtual: product.precoAtual,
      ...suggestion
    };
    
  } catch (error) {
    console.error('Erro na precificação IA:', error);
    return generateFallbackPricing(product);
  }
}

export async function analyzeBulkPricing(products: any[]): Promise<BulkPricingAnalysis> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const resumoProdutos = products.map(p => ({
      nome: p.nome,
      preco: p.valor,
      diasVencer: Math.ceil((new Date(p.dataValidade).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
      quantidade: p.quantidade || 50
    }));

    const prompt = `
Analise estes ${products.length} produtos do estoque e gere um relatório executivo de precificação:

${JSON.stringify(resumoProdutos.slice(0, 50), null, 2)}

Classifique em categorias:
- URGENTES: produtos vencendo em menos de 7 dias
- PROMOCIONAIS: produtos que precisam de desconto (7-30 dias ou estoque alto)
- ESTÁVEIS: produtos que podem manter preço atual

Retorne APENAS JSON válido:
{
  "urgentes": 0,
  "promocionais": 0,
  "estaveis": 0,
  "resumo": "Análise executiva em 2 frases sobre a situação geral",
  "impacto": "Impacto financeiro estimado das mudanças sugeridas",
  "prioridades": [
    {
      "produto": "nome do produto",
      "precoAtual": "0.00",
      "precoSugerido": "0.00",
      "desconto": 0,
      "urgencia": "alta|media|baixa",
      "acao": "ação específica recomendada"
    }
  ]
}

Liste as 5 maiores prioridades por urgência.
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    return JSON.parse(jsonText);
    
  } catch (error) {
    console.error('Erro na análise em massa:', error);
    return generateFallbackBulkAnalysis(products);
  }
}

function generateFallbackPricing(product: ProductPricingData): PricingSuggestion {
  let precoSugerido = product.precoAtual;
  let estrategia: PricingSuggestion['estrategia'] = 'normal';
  let razao = 'Preço mantido';
  let urgencia: PricingSuggestion['urgencia'] = 'baixa';

  if (product.diasAteVencer <= 3) {
    precoSugerido = Math.max(product.precoAtual * 0.5, product.precoCusto);
    estrategia = 'urgente';
    razao = 'Vencimento iminente - desconto urgente para evitar perda total';
    urgencia = 'alta';
  } else if (product.diasAteVencer <= 7) {
    precoSugerido = product.precoAtual * 0.7;
    estrategia = 'promocional';
    razao = 'Vencendo em 7 dias - promoção necessária para acelerar vendas';
    urgencia = 'alta';
  } else if (product.diasAteVencer <= 30) {
    precoSugerido = product.precoAtual * 0.9;
    estrategia = 'promocional';
    razao = 'Vencendo em 30 dias - pequeno desconto preventivo';
    urgencia = 'media';
  } else if (product.quantidade > 100) {
    precoSugerido = product.precoAtual * 0.9;
    estrategia = 'promocional';
    razao = 'Estoque alto - incentivar rotatividade';
    urgencia = 'media';
  }

  const descontoPercentual = ((product.precoAtual - precoSugerido) / product.precoAtual) * 100;

  return {
    precoAtual: product.precoAtual,
    precoSugerido: Number(precoSugerido.toFixed(2)),
    estrategia,
    razao,
    impactoEstimado: descontoPercentual > 0 
      ? `Desconto de ${descontoPercentual.toFixed(0)}% pode aumentar vendas em até 3x`
      : 'Manter preço atual mantém margem de lucro estável',
    descontoPercentual: Number(descontoPercentual.toFixed(1)),
    urgencia
  };
}

function generateFallbackBulkAnalysis(products: any[]): BulkPricingAnalysis {
  let urgentes = 0;
  let promocionais = 0;
  let estaveis = 0;

  const prioridades: BulkPricingAnalysis['prioridades'] = [];

  products.forEach(p => {
    const dias = Math.ceil((new Date(p.dataValidade).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    
    if (dias <= 7) {
      urgentes++;
      if (prioridades.length < 5) {
        prioridades.push({
          produto: p.nome,
          precoAtual: p.valor.toFixed(2),
          precoSugerido: (p.valor * 0.7).toFixed(2),
          desconto: 30,
          urgencia: 'alta',
          acao: 'Aplicar desconto urgente de 30%'
        });
      }
    } else if (dias <= 30) {
      promocionais++;
    } else {
      estaveis++;
    }
  });

  return {
    urgentes,
    promocionais,
    estaveis,
    resumo: `Detectados ${urgentes} produtos críticos que precisam de ação imediata. ${promocionais} produtos podem ser promovidos preventivamente.`,
    impacto: `Aplicando os descontos sugeridos, estima-se redução de perda por vencimento em até 60% e aumento de vendas em 40%.`,
    prioridades: prioridades.slice(0, 5)
  };
}