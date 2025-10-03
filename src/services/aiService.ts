// src/services/aiService.ts
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
Você é um especialista em gestão de estoque. Analise o inventário abaixo:

Data de hoje: ${hoje}         

Produtos:
${JSON.stringify(products.map(p => ({
  nome: p.nome,
  quantidade: p.quantidade,
  valor: p.valor,
  dataValidade: p.dataValidade
})), null, 2)}

Retorne APENAS um JSON válido neste formato exato:

{
  "resumo": "Análise em uma frase",
  "alertas": [
    {
      "tipo": "critico",
      "titulo": "Título",
      "mensagem": "Descrição",
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

Tipos: "critico" (vencidos), "alerta" (7 dias), "aviso" (30 dias), "info" (geral)
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    return JSON.parse(jsonText);
    
  } catch (error) {
    console.error('Erro na IA:', error);
    return generateFallback(products);
  }
}

function generateFallback(products: any[]): AIAnalysis {
  const hoje = new Date();
  const vencidos = products.filter(p => new Date(p.dataValidade) < hoje);
  
  return {
    resumo: vencidos.length > 0 
      ? `${vencidos.length} produto(s) vencido(s) detectado(s)` 
      : 'Estoque em boas condições',
    alertas: vencidos.length > 0 ? [{
      tipo: 'critico',
      titulo: `${vencidos.length} produto(s) vencido(s)`,
      mensagem: vencidos.map(p => p.nome).join(', '),
      acao: 'Remover do estoque'
    }] : [],
    metricas: {
      vencidos: vencidos.length,
      criticos: 0,
      avisos: 0,
      estoqueBaixo: 0
    },
    valorEmRisco: vencidos.reduce((sum, p) => sum + p.valor * p.quantidade, 0)
  };
}