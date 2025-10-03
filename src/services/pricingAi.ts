import { GoogleGenerativeAI } from '@google/generative-ai';

// ⚠️ ATENÇÃO: SUBSTITUA ESTA CHAVE COM SUA CHAVE REAL E CONSIDERE USAR VARIÁVEIS DE AMBIENTE ⚠️
const API_KEY = 'AIzaSyBDq25Gn5b9tRx5lhpAXUni64hPTJsX5gM'; 
const genAI = new GoogleGenerativeAI(API_KEY);

// ==========================================================
// INTERFACES
// ==========================================================

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

// ==========================================================
// FUNÇÕES DE ANÁLISE COM IA (GEMINI)
// ==========================================================

export async function analyzePricingWithAI(product: ProductPricingData): Promise<PricingSuggestion> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    // Calcula Margem Atual para o Prompt
    const margemAtual = (((product.precoAtual - product.precoCusto) / product.precoAtual) * 100).toFixed(1);

    const prompt = `
Você é um especialista em precificação de varejo. Analise o produto e sugira o preço ótimo:

PRODUTO:
- Nome: ${product.nome}
- Preço Atual: R$ ${product.precoAtual.toFixed(2)}
- Custo: R$ ${product.precoCusto.toFixed(2)}
- Margem Atual: ${margemAtual}%
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
    // Limpeza para remover blocos de código JSON ('```json' e '```')
    const jsonText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const suggestion = JSON.parse(jsonText);
    
    // Combina o preço atual de volta ao resultado e garante o tipo
    return {
      precoAtual: product.precoAtual,
      ...suggestion
    } as PricingSuggestion; 
    
  } catch (error) {
    console.error('Erro na precificação IA:', error);
    // Em caso de falha da IA, chama o fallback
    return generateFallbackPricing(product);
  }
}

export async function analyzeBulkPricing(products: any[]): Promise<BulkPricingAnalysis> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    // Prepara um resumo de dados para o modelo (limite de 50 para evitar excesso de tokens)
    const resumoProdutos = products.map(p => ({
      nome: p.nome,
      preco: p.valor,
      // Calcula dias restantes para vencer
      diasVencer: Math.ceil((new Date(p.dataValidade).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
      quantidade: p.quantidade || 50 // Valor padrão
    }));

    const prompt = `
Analise estes ${products.length} produtos do estoque e gere um relatório executivo de precificação:

DADOS DE PRODUTOS (amostra de ${Math.min(products.length, 50)}):
${JSON.stringify(resumoProdutos.slice(0, 50), null, 2)}

Classifique em categorias:
- URGENTES: produtos vencendo em menos de 7 dias ou estoque excessivo
- PROMOCIONAIS: produtos que precisam de desconto (7-30 dias ou estoque alto)
- ESTÁVEIS: produtos que podem manter preço atual

nessas categorias (URGENTES, PROMOCIONAIS, ESTÁVEIS), pode mudar um pouco a classificação das regras conforme julgar necessário.

Responda APENAS com JSON válido (sem texto fora do JSON, sem comentários), no formato:
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

Regras adicionais:
- O campo "desconto" deve ser um número inteiro representando a % de desconto sugerido.
- O "precoSugerido" deve ser menor que "precoAtual" apenas quando houver desconto; caso contrário, mantenha o mesmo valor.
- Liste prioridades em ordem de urgência (alta > média > baixa) e impacto financeiro.
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    // Limpeza para remover blocos de código JSON ('```json' e '```')
    const jsonText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    return JSON.parse(jsonText) as BulkPricingAnalysis;
    
  } catch (error) {
    console.error('Erro na análise em massa:', error);
    // Em caso de falha da IA, chama o fallback
    return generateFallbackBulkAnalysis(products);
  }
}


// ==========================================================
// FUNÇÕES DE FALLBACK (LÓGICA SIMPLES)
// ==========================================================

/**
 * Gera uma sugestão de preço baseada em regras simples (sem IA) em caso de falha.
 */
function generateFallbackPricing(product: ProductPricingData): PricingSuggestion {
  let precoSugerido = product.precoAtual;
  let estrategia: PricingSuggestion['estrategia'] = 'normal';
  let razao = 'Preço mantido';
  let urgencia: PricingSuggestion['urgencia'] = 'baixa';

  // Regra 1: Vencimento Iminente (< 3 dias)
  if (product.diasAteVencer <= 3) {
    // Desconto de 50%, mas nunca abaixo do custo
    precoSugerido = Math.max(product.precoAtual * 0.5, product.precoCusto);
    estrategia = 'urgente';
    razao = 'Vencimento iminente - desconto urgente para evitar perda total';
    urgencia = 'alta';
  // Regra 2: Vencimento Próximo (4-7 dias)
  } else if (product.diasAteVencer <= 7) {
    precoSugerido = product.precoAtual * 0.7; // 30% off
    estrategia = 'promocional';
    razao = 'Vencendo em 7 dias - promoção necessária para acelerar vendas';
    urgencia = 'alta';
  // Regra 3: Vencimento Moderado (8-30 dias)
  } else if (product.diasAteVencer <= 30) {
    precoSugerido = product.precoAtual * 0.9; // 10% off
    estrategia = 'promocional';
    razao = 'Vencendo em 30 dias - pequeno desconto preventivo';
    urgencia = 'media';
  // Regra 4: Estoque Alto (> 100 unidades)
  } else if (product.quantidade > 100) {
    precoSugerido = product.precoAtual * 0.9; // 10% off
    estrategia = 'promocional';
    razao = 'Estoque alto - incentivar rotatividade';
    urgencia = 'media';
  }

  const descontoPercentual = ((product.precoAtual - precoSugerido) / product.precoAtual) * 100;
  const descontoArredondado = Number(descontoPercentual.toFixed(1));

  return {
    precoAtual: product.precoAtual,
    precoSugerido: Number(precoSugerido.toFixed(2)),
    estrategia,
    razao,
    impactoEstimado: descontoPercentual > 0 
      ? `Desconto de ${descontoArredondado.toFixed(0)}% pode aumentar vendas em até 3x`
      : 'Manter preço atual mantém margem de lucro estável',
    descontoPercentual: descontoArredondado,
    urgencia
  };
}

/**
 * Gera uma análise em massa baseada em regras simples (sem IA) em caso de falha.
 */
function generateFallbackBulkAnalysis(products: any[]): BulkPricingAnalysis {
  let urgentes = 0;
  let promocionais = 0;
  let estaveis = 0;

  const prioridades: BulkPricingAnalysis['prioridades'] = [];

  products.forEach(p => {
    // Calcula dias restantes (garante que p.dataValidade está correto)
    const dias = Math.ceil((new Date(p.dataValidade).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    const precoAtual = p.valor || 100;
    
    if (dias <= 7) {
      urgentes++;
      // Limita a lista de prioridades
      if (prioridades.length < 5) { 
        prioridades.push({
          produto: p.nome,
          precoAtual: precoAtual.toFixed(2),
          precoSugerido: (precoAtual * 0.7).toFixed(2),
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
  
  const topPrioridades = prioridades.slice(0, 5);
  
  return {
    urgentes,
    promocionais,
    estaveis,
    resumo: `Detectados ${urgentes} produtos críticos que precisam de ação imediata. ${promocionais} produtos podem ser promovidos preventivamente.`,
    impacto: `Aplicando os descontos sugeridos, estima-se redução de perda por vencimento em até 60% e aumento de vendas em 40%.`,
    prioridades: topPrioridades
  };
}