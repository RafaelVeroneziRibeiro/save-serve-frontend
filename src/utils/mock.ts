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
    "quantidade": 120,
    "data_entrada": "15/09/2025",
    "hora_entrada": "08:30",
    "data_saida": null,
    "hora_saida": null,
    "data_validade": "15/01/2026"
  },
  {
    "nome": "Arroz Agulhinha Tipo 1 Pacote 5kg",
    "valor": 28.50,
    "quantidade": 80,
    "data_entrada": "20/09/2025",
    "hora_entrada": "09:00",
    "data_saida": "01/10/2025",
    "hora_saida": "17:45",
    "data_validade": "20/09/2026"
  },
  {
    "nome": "Feijão Carioca Tipo 1 Pacote 1kg",
    "valor": 8.90,
    "quantidade": 95,
    "data_entrada": "20/09/2025",
    "hora_entrada": "09:05",
    "data_saida": null,
    "hora_saida": null,
    "data_validade": "20/03/2027"
  },
  {
    "nome": "Café Torrado e Moído 500g",
    "valor": 15.75,
    "quantidade": 60,
    "data_entrada": "22/09/2025",
    "hora_entrada": "11:20",
    "data_saida": "30/09/2025",
    "hora_saida": "14:00",
    "data_validade": "22/05/2026"
  },
  {
    "nome": "Óleo de Soja 900ml",
    "valor": 7.29,
    "quantidade": 150,
    "data_entrada": "18/09/2025",
    "hora_entrada": "14:00",
    "data_saida": null,
    "hora_saida": null,
    "data_validade": "18/06/2026"
  },
  {
    "nome": "Sabão em Pó Tixan Ypê 1kg",
    "valor": 12.99,
    "quantidade": 45,
    "data_entrada": "10/09/2025",
    "hora_entrada": "07:45",
    "data_saida": "25/09/2025",
    "hora_saida": "10:10",
    "data_validade": "10/09/2028"
  },
  {
    "nome": "Refrigerante Coca-Cola 2L",
    "valor": 9.50,
    "quantidade": 77,
    "data_entrada": "30/09/2025",
    "hora_entrada": "16:00",
    "data_saida": null,
    "hora_saida": null,
    "data_validade": "30/03/2026"
  },
  {
    "nome": "Pão de Forma Integral Wickbold",
    "valor": 10.20,
    "quantidade": 30,
    "data_entrada": "01/10/2025",
    "hora_entrada": "06:15",
    "data_saida": "03/10/2025",
    "hora_saida": "09:00",
    "data_validade": "10/10/2025"
  },
  {
    "nome": "Notebook Gamer Acer Nitro 5",
    "valor": 5499.00,
    "quantidade": 15,
    "data_entrada": "01/08/2025",
    "hora_entrada": "10:00",
    "data_saida": null,
    "hora_saida": null,
    "data_validade": "01/08/2030"
  },
  {
    "nome": "Mouse sem Fio Logitech M170",
    "valor": 89.90,
    "quantidade": 55,
    "data_entrada": "15/08/2025",
    "hora_entrada": "11:30",
    "data_saida": "20/08/2025",
    "hora_saida": "15:20",
    "data_validade": "15/08/2028"
  },
  {
    "nome": "Teclado Mecânico Redragon Kumara",
    "valor": 299.90,
    "quantidade": 25,
    "data_entrada": "20/08/2025",
    "hora_entrada": "14:10",
    "data_saida": null,
    "hora_saida": null,
    "data_validade": "20/08/2028"
  } // ... e assim por diante até completar os 200 produtos.
]