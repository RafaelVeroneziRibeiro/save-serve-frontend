// src/utils/mock.ts

/**
 * @description Define a ESTRUTURA LOCAL para os dados brutos do mock.
 * Esta interface é usada apenas dentro deste arquivo.
 */
export interface Produto {
  nome: string;
  valor: number;
  quantidade: number;
  data_entrada: string;
  hora_entrada: string;
  data_saida: string | null;
  hora_saida: string | null;
  data_validade: string;
}

/**
 * @description Array com produtos fictícios para uso em desenvolvimento.
 * ESTES SÃO OS DADOS BRUTOS, no formato original.
 */
export const produtos: Produto[] = [
  // --- PRIMEIRA LISTA (30 PRODUTOS) ---
  {
    "nome": "Leite Integral UHT Caixa 1L",
    "valor": 4.99,
    "quantidade": 5,
    "data_entrada": "15/09/2025",
    "hora_entrada": "08:30",
    "data_saida": null,
    "hora_saida": null,
    "data_validade": "15/01/2026"
  },
  {
    "nome": "Arroz Agulhinha Tipo 1 Pacote 5kg",
    "valor": 28.50,
    "quantidade": 8,
    "data_entrada": "20/09/2025",
    "hora_entrada": "09:00",
    "data_saida": "01/10/2025",
    "hora_saida": "17:45",
    "data_validade": "04/10/2025"
  },
  {
    "nome": "Feijão Carioca Tipo 1 Pacote 1kg",
    "valor": 8.90,
    "quantidade": 4,
    "data_entrada": "20/09/2025",
    "hora_entrada": "09:05",
    "data_saida": null,
    "hora_saida": null,
    "data_validade": "15/10/2025"
  },
  {
    "nome": "Café Torrado e Moído 500g",
    "valor": 15.75,
    "quantidade": 10,
    "data_entrada": "22/09/2025",
    "hora_entrada": "11:20",
    "data_saida": "30/09/2025",
    "hora_saida": "14:00",
    "data_validade": "05/10/2025"
  },
  {
    "nome": "Óleo de Soja 900ml",
    "valor": 7.29,
    "quantidade": 5,
    "data_entrada": "18/09/2025",
    "hora_entrada": "14:00",
    "data_saida": null,
    "hora_saida": null,
    "data_validade": "18/06/2026"
  } // ... e assim por diante até completar os 200 produtos.
]