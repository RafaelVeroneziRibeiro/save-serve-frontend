import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('AIzaSyBDq25Gn5b9tRx5lhpAXUni64hPTJsX5gM');
// ==================== INTERFACES ====================

export interface FruitAnalysis {
    fruta: string;
    estado: 'excelente' | 'bom' | 'regular' | 'ruim' | 'vencido' | 'nao_identificado';
    diasValidade: number;
    confianca: number;
    sinaisVisiveis: string[];
    detalhes: string;
    recomendacoes: string[];
    armazenamento?: {
        tipo: 'temperatura_ambiente' | 'refrigerado' | 'frio';
        temperatura: string;
        umidade: string;
        dicas: string[];
    };
    nutricao?: {
        calorias: number;
        vitaminas: string[];
        beneficios: string[];
        melhorConsumo: string;
    };
    qualidade?: {
        cor: string;
        textura: string;
        firmeza: string;
        maturacao: string;
        defeitos: string[];
    };
    comercial?: {
        adequadoVenda: boolean;
        categoria: 'premium' | 'standard' | 'basico' | 'desconto' | 'descarte';
        precoSugerido: number;
        desconto: number;
    };
}

// ==================== FUNÇÃO PRINCIPAL ====================

export async function analyzeFruitImage(
    imageBase64: string,
    mimeType: string = 'image/jpeg'
): Promise<FruitAnalysis> {
    try {
        console.log('=================================================');
        console.log('🍎 INICIANDO ANÁLISE DE FRUTA COM IA');
        console.log('=================================================');
        console.log('📷 Tipo MIME:', mimeType);
        console.log('📦 Tamanho base64:', imageBase64.length, 'caracteres');
        console.log('📊 Tamanho estimado:', (imageBase64.length * 0.75 / 1024).toFixed(2), 'KB');

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });



        console.log('✅ Modelo Gemini inicializado');
        console.log('   - Model: gemini-pro-vision');
        console.log('   - Temperature: 0.7');
        console.log('   - TopP: 0.9');

        const hoje = new Date().toLocaleDateString('pt-BR');
        console.log('📅 Data atual:', hoje);

        // Remove prefixo data:image se presente
        const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');
        console.log('🧹 Base64 limpo:', cleanBase64.substring(0, 50) + '...');
        console.log('   Comprimento após limpeza:', cleanBase64.length);

        // PROMPT SIMPLIFICADO E DIRETO
        const prompt = `Você vê uma fruta nesta imagem? 

Se SIM: identifique qual é e analise seu estado.
Se NÃO: retorne diasValidade: -1

Responda APENAS com JSON válido (sem markdown, sem \`\`\`):

{
  "fruta": "Maçã|Banana|Laranja|etc",
  "estado": "excelente|bom|regular|ruim|vencido",
  "diasValidade": 0 a 30,
  "confianca": 0 a 1,
  "sinaisVisiveis": ["o que vê"],
  "detalhes": "descrição breve",
  "recomendacoes": ["dicas"]
}

Estados:
- vencido (0d): mofo, podridão severa
- ruim (0-1d): muito deteriorada, manchas grandes
- regular (2-3d): sinais de envelhecimento  
- bom (4-6d): madura, ideal
- excelente (7-14d): fresca, perfeita

IMPORTANTE:
- Maçã com manchas escuras/cortada oxidada = AINDA É MAÇÃ! Estado: ruim/vencido
- Banana muito escura = AINDA É BANANA! Estado: ruim/vencido
- Identifique pelo formato, cor base, textura, sementes
- Só use "nao_identificado" se realmente não houver nenhuma fruta`;

        console.log('📝 Prompt preparado');
        console.log('📤 Enviando requisição para Gemini API...');

        const startTime = Date.now();

        const result = await model.generateContent([
            { text: prompt },
            {
                inlineData: {
                    mimeType: mimeType,
                    data: cleanBase64
                }
            }
        ]);

        const endTime = Date.now();
        console.log('⏱️  Tempo de resposta:', (endTime - startTime), 'ms');

        const response = result.response;
        const text = response.text().trim();

        console.log('=================================================');
        console.log('📥 RESPOSTA RECEBIDA DA IA');
        console.log('=================================================');
        console.log('📏 Tamanho da resposta:', text.length, 'caracteres');
        console.log('📄 RESPOSTA COMPLETA:');
        console.log(text);
        console.log('=================================================');

        // Remove markdown se presente
        let jsonText = text
            .replace(/```json\s*/g, '')
            .replace(/```\s*/g, '')
            .trim();

        console.log('🧹 Após remover markdown:', jsonText.substring(0, 100) + '...');

        // Tenta extrair JSON mesmo se vier com texto extra
        const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            jsonText = jsonMatch[0];
            console.log('✅ JSON extraído com sucesso usando regex');
            console.log('   Tamanho do JSON:', jsonText.length, 'caracteres');
        } else {
            console.warn('⚠️  Não foi possível extrair JSON da resposta');
            console.log('   Tentando parsear o texto completo...');
        }

        let analysis: FruitAnalysis;

        try {
            console.log('🔄 Tentando parsear JSON...');
            analysis = JSON.parse(jsonText);
            console.log('✅ JSON parseado com sucesso!');
            console.log('📊 Objeto resultante:', JSON.stringify(analysis, null, 2));
        } catch (parseError) {
            console.error('❌ ERRO AO PARSEAR JSON');
            console.error('   Erro:', parseError);
            console.error('   JSON que falhou:', jsonText);
            throw new Error('Falha ao parsear resposta JSON da IA');
        }

        console.log('🔍 Validando e sanitizando dados...');

        // Validação e sanitização
        const diasOriginal = analysis.diasValidade;
        const confiancaOriginal = analysis.confianca;

        analysis.diasValidade = Math.max(-1, Math.min(30, Math.round(Number(analysis.diasValidade) || 0)));
        analysis.confianca = Math.max(0, Math.min(1, Number(analysis.confianca) || 0));

        if (diasOriginal !== analysis.diasValidade) {
            console.log('   ⚙️  diasValidade ajustado:', diasOriginal, '→', analysis.diasValidade);
        }
        if (confiancaOriginal !== analysis.confianca) {
            console.log('   ⚙️  confianca ajustado:', confiancaOriginal, '→', analysis.confianca);
        }

        // Garante arrays
        if (!Array.isArray(analysis.sinaisVisiveis)) {
            console.log('   ⚙️  sinaisVisiveis não é array, criando padrão');
            analysis.sinaisVisiveis = ['Análise visual limitada'];
        }

        if (!Array.isArray(analysis.recomendacoes)) {
            console.log('   ⚙️  recomendacoes não é array, criando padrão');
            analysis.recomendacoes = ['Consumir conforme necessidade'];
        }

        console.log('=================================================');
        // Log do resultado
        if (analysis.estado === 'nao_identificado' || analysis.diasValidade === -1) {
            console.warn('⚠️  FRUTA NÃO IDENTIFICADA PELA IA');
            console.log('   Fruta:', analysis.fruta);
            console.log('   Estado:', analysis.estado);
            console.log('   Dias:', analysis.diasValidade);
            console.log('   Detalhes:', analysis.detalhes);
        } else {
            console.log('✅ ANÁLISE CONCLUÍDA COM SUCESSO!');
            console.log('   🍎 Fruta:', analysis.fruta);
            console.log('   📊 Estado:', analysis.estado);
            console.log('   📅 Dias de validade:', analysis.diasValidade);
            console.log('   🎯 Confiança:', (analysis.confianca * 100).toFixed(0) + '%');
            console.log('   👁️  Sinais visíveis:', analysis.sinaisVisiveis.length, 'itens');
            console.log('   💡 Recomendações:', analysis.recomendacoes.length, 'itens');
        }
        console.log('=================================================');

        return analysis;

    } catch (error: any) {
        console.error('=================================================');
        console.error('❌ ERRO CRÍTICO NA ANÁLISE DE FRUTA');
        console.error('=================================================');
        console.error('Tipo do erro:', error.constructor.name);
        console.error('Mensagem:', error.message);
        console.error('Stack:', error.stack);
        console.error('=================================================');

        // Retorna análise fallback informativa
        return generateFallbackFruitAnalysis(error.message);
    }
}

// ==================== FUNÇÕES AUXILIARES ====================

function generateFallbackFruitAnalysis(errorMessage?: string): FruitAnalysis {
    console.log('⚠️ Usando análise fallback');

    return {
        fruta: 'Erro na análise',
        estado: 'nao_identificado',
        diasValidade: -1,
        confianca: 0,
        sinaisVisiveis: [
            'Não foi possível processar a imagem',
            errorMessage || 'Erro desconhecido na análise'
        ],
        detalhes: 'Ocorreu um erro ao analisar a imagem. Por favor, tente novamente com uma foto diferente.',
        recomendacoes: [
            'Verifique se a foto está clara e bem iluminada',
            'Certifique-se de que a fruta está visível',
            'Tente tirar a foto mais próxima',
            'Use iluminação natural se possível',
            'Tente novamente em alguns segundos'
        ]
    };
}

// ==================== ANÁLISE EM LOTE ====================

export async function analyzeBatchFruits(
    images: Array<{ base64: string; mimeType?: string }>
): Promise<{
    totalFrutas: number;
    frutasIdentificadas: number;
    analises: FruitAnalysis[];
}> {
    try {
        console.log(`🍎 Iniciando análise em lote de ${images.length} imagens...`);

        const analises: FruitAnalysis[] = [];

        for (let i = 0; i < images.length; i++) {
            console.log(`\n📸 Analisando imagem ${i + 1}/${images.length}...`);

            const result = await analyzeFruitImage(
                images[i].base64,
                images[i].mimeType || 'image/jpeg'
            );

            analises.push(result);

            // Delay entre requisições
            if (i < images.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        const frutasIdentificadas = analises.filter(
            a => a.estado !== 'nao_identificado' && a.diasValidade >= 0
        ).length;

        console.log(`\n✅ Análise em lote concluída: ${frutasIdentificadas}/${images.length} frutas identificadas`);

        return {
            totalFrutas: images.length,
            frutasIdentificadas,
            analises
        };

    } catch (error) {
        console.error('❌ Erro na análise em lote:', error);
        throw error;
    }
}

// ==================== UTILITÁRIOS ====================

export function getEstadoColor(estado: string): string {
    switch (estado) {
        case 'excelente': return 'green';
        case 'bom': return 'blue';
        case 'regular': return 'yellow';
        case 'ruim': return 'orange';
        case 'vencido': return 'red';
        default: return 'gray';
    }
}

export function getEstadoEmoji(estado: string): string {
    switch (estado) {
        case 'excelente': return '🌟';
        case 'bom': return '✅';
        case 'regular': return '⚠️';
        case 'ruim': return '🔴';
        case 'vencido': return '💀';
        default: return '❓';
    }
}

export function calcularValorComDesconto(
    precoOriginal: number,
    desconto: number
): number {
    return precoOriginal * (1 - desconto / 100);
}