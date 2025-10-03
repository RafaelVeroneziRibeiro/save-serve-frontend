// src/services/pricingAI.ts
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