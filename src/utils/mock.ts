import { Product } from '../types';

const categorias = ['Alimentos', 'Bebidas', 'Higiene', 'Limpeza', 'Padaria', 'Açougue', 'Hortifruti', 'Frios'];

const produtos = {
  'Alimentos': ['Arroz', 'Feijão', 'Macarrão', 'Óleo', 'Açúcar', 'Sal', 'Farinha', 'Molho Tomate', 'Biscoito', 'Café'],
  'Bebidas': ['Coca-Cola', 'Guaraná', 'Suco', 'Água Mineral', 'Cerveja', 'Vinho', 'Refrigerante', 'Energético'],
  'Higiene': ['Shampoo', 'Sabonete', 'Pasta Dente', 'Papel Higiênico', 'Desodorante', 'Fralda', 'Absorvente'],
  'Limpeza': ['Detergente', 'Sabão Pó', 'Amaciante', 'Desinfetante', 'Água Sanitária', 'Esponja', 'Pano'],
  'Padaria': ['Pão Francês', 'Pão Forma', 'Bolo', 'Torta', 'Croissant', 'Sonho', 'Rosca'],
  'Açougue': ['Carne Bovina', 'Frango', 'Porco', 'Linguiça', 'Bacon', 'Salsicha', 'Hambúrguer'],
  'Hortifruti': ['Tomate', 'Alface', 'Cenoura', 'Batata', 'Cebola', 'Banana', 'Maçã', 'Laranja'],
  'Frios': ['Presunto', 'Queijo', 'Mortadela', 'Salame', 'Iogurte', 'Manteiga', 'Requeijão']
};

const marcas = ['Nestle', 'Unilever', 'Coca-Cola', 'Ambev', 'Sadia', 'Perdigão', 'Qualy', 'Camil', 'Aurora'];

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

export function generateMockProducts(count: number = 500): Product[] {
  const products: Product[] = [];
  const hoje = new Date();
  const umAnoAtras = new Date(hoje.getFullYear() - 1, hoje.getMonth(), hoje.getDate());
  const umAnoFuturo = new Date(hoje.getFullYear() + 1, hoje.getMonth(), hoje.getDate());

  for (let i = 1; i <= count; i++) {
    const categoria = categorias[Math.floor(Math.random() * categorias.length)];
    const produtosCategoria = produtos[categoria as keyof typeof produtos];
    const nomeProduto = produtosCategoria[Math.floor(Math.random() * produtosCategoria.length)];
    const marca = marcas[Math.floor(Math.random() * marcas.length)];
    
    const dataEntrada = randomDate(umAnoAtras, hoje);
    
    // Criar alguns produtos vencidos propositalmente (10%)
    let dataValidade: Date;
    const rand = Math.random();
    if (rand < 0.1) {
      // 10% vencidos
      dataValidade = randomDate(umAnoAtras, hoje);
    } else if (rand < 0.2) {
      // 10% vencendo em 7 dias
      const seteDias = new Date(hoje.getTime() + 7 * 24 * 60 * 60 * 1000);
      dataValidade = randomDate(hoje, seteDias);
    } else if (rand < 0.35) {
      // 15% vencendo em 30 dias
      const trintaDias = new Date(hoje.getTime() + 30 * 24 * 60 * 60 * 1000);
      const seteDias = new Date(hoje.getTime() + 7 * 24 * 60 * 60 * 1000);
      dataValidade = randomDate(seteDias, trintaDias);
    } else {
      // 65% com validade normal
      dataValidade = randomDate(hoje, umAnoFuturo);
    }

    // Alguns produtos já saíram (20%)
    const dataSaida = Math.random() < 0.2 ? randomDate(dataEntrada, hoje) : undefined;

    products.push({
      id: i,
      nome: `${nomeProduto} ${marca}`,
      categoria,
      quantidade: Math.floor(Math.random() * 100) + 1,
      valor: parseFloat((Math.random() * 50 + 1).toFixed(2)),
      dataEntrada: dataEntrada.toISOString().split('T')[0],
      dataValidade: dataValidade.toISOString().split('T')[0],
      dataSaida: dataSaida?.toISOString().split('T')[0]
    });
  }

  return products;
}
