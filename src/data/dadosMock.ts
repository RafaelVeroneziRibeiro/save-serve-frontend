// dadosMock.ts

/**
 * @description Define a estrutura de um objeto de Produto, incluindo a quantidade em estoque.
 */
export interface Produto {
  nome: string;
  valor: number;
  quantidade: number; // Nova propriedade adicionada
  data_entrada: string;
  hora_entrada: string;
  data_saida: string | null;
  hora_saida: string | null;
  data_validade: string;
}

/**
 * @description Array com 200 produtos fictícios para uso em desenvolvimento.
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
  },
  {
    "nome": "Monitor LED 24' LG Full HD",
    "valor": 899.00,
    "quantidade": 18,
    "data_entrada": "05/09/2025",
    "hora_entrada": "09:45",
    "data_saida": null,
    "hora_saida": null,
    "data_validade": "05/09/2030"
  },
  {
    "nome": "Shampoo Pantene Restauração 400ml",
    "valor": 25.50,
    "quantidade": 40,
    "data_entrada": "12/09/2025",
    "hora_entrada": "13:00",
    "data_saida": "19/09/2025",
    "hora_saida": "18:00",
    "data_validade": "12/09/2027"
  },
  {
    "nome": "Creme Dental Colgate Total 12 90g",
    "valor": 5.99,
    "quantidade": 130,
    "data_entrada": "28/09/2025",
    "hora_entrada": "17:10",
    "data_saida": null,
    "hora_saida": null,
    "data_validade": "28/09/2027"
  },
  {
    "nome": "Biscoito Recheado Negresco",
    "valor": 3.89,
    "quantidade": 200,
    "data_entrada": "25/09/2025",
    "hora_entrada": "10:30",
    "data_saida": "02/10/2025",
    "hora_saida": "11:00",
    "data_validade": "25/04/2026"
  },
  {
    "nome": "Manteiga com Sal Aviação 200g",
    "valor": 14.90,
    "quantidade": 35,
    "data_entrada": "02/10/2025",
    "hora_entrada": "08:00",
    "data_saida": null,
    "hora_saida": null,
    "data_validade": "02/01/2026"
  },
  {
    "nome": "Achocolatado em Pó Nescau 400g",
    "valor": 9.99,
    "quantidade": 88,
    "data_entrada": "11/09/2025",
    "hora_entrada": "15:25",
    "data_saida": null,
    "hora_saida": null,
    "data_validade": "11/09/2026"
  },
  {
    "nome": "Queijo Mussarela Fatiado 200g",
    "valor": 11.00,
    "quantidade": 28,
    "data_entrada": "03/10/2025",
    "hora_entrada": "07:00",
    "data_saida": null,
    "hora_saida": null,
    "data_validade": "18/10/2025"
  },
  {
    "nome": "Presunto Cozido Fatiado Sadia 200g",
    "valor": 8.50,
    "quantidade": 32,
    "data_entrada": "03/10/2025",
    "hora_entrada": "07:05",
    "data_saida": null,
    "hora_saida": null,
    "data_validade": "20/10/2025"
  },
  {
    "nome": "Bandeja de Iogurte Grego Vigor",
    "valor": 13.49,
    "quantidade": 42,
    "data_entrada": "29/09/2025",
    "hora_entrada": "11:00",
    "data_saida": "01/10/2025",
    "hora_saida": "12:30",
    "data_validade": "25/10/2025"
  },
  {
    "nome": "Smartphone Samsung Galaxy S23",
    "valor": 4500.00,
    "quantidade": 10,
    "data_entrada": "10/07/2025",
    "hora_entrada": "14:50",
    "data_saida": "15/07/2025",
    "hora_saida": "10:00",
    "data_validade": "10/07/2030"
  },
  {
    "nome": "Carregador Portátil (Power Bank) 10000mAh",
    "valor": 120.00,
    "quantidade": 33,
    "data_entrada": "01/09/2025",
    "hora_entrada": "18:00",
    "data_saida": null,
    "hora_saida": null,
    "data_validade": "01/09/2029"
  },
  {
    "nome": "Farinha de Trigo Dona Benta 1kg",
    "valor": 5.50,
    "quantidade": 110,
    "data_entrada": "08/09/2025",
    "hora_entrada": "09:20",
    "data_saida": "20/09/2025",
    "hora_saida": "13:40",
    "data_validade": "08/05/2026"
  },
  {
    "nome": "Macarrão Espaguete Renata 500g",
    "valor": 4.20,
    "quantidade": 140,
    "data_entrada": "08/09/2025",
    "hora_entrada": "09:22",
    "data_saida": null,
    "hora_saida": null,
    "data_validade": "08/09/2027"
  },
  {
    "nome": "Extrato de Tomate Elefante 340g",
    "valor": 6.80,
    "quantidade": 75,
    "data_entrada": "14/09/2025",
    "hora_entrada": "16:15",
    "data_saida": "28/09/2025",
    "hora_saida": "10:00",
    "data_validade": "14/03/2027"
  },
  {
    "nome": "Limpador Multiuso Veja Power Fusion",
    "valor": 9.90,
    "quantidade": 65,
    "data_entrada": "19/08/2025",
    "hora_entrada": "11:50",
    "data_saida": null,
    "hora_saida": null,
    "data_validade": "19/08/2028"
  },
  {
    "nome": "Papel Higiênico Neve Folha Dupla 12 Rolos",
    "valor": 22.90,
    "quantidade": 50,
    "data_entrada": "21/09/2025",
    "hora_entrada": "10:10",
    "data_saida": null,
    "hora_saida": null,
    "data_validade": "21/09/2030"
  },
  {
    "nome": "Lava-Louças Líquido Ypê 500ml",
    "valor": 3.19,
    "quantidade": 90,
    "data_entrada": "23/09/2025",
    "hora_entrada": "14:30",
    "data_saida": null,
    "hora_saida": null,
    "data_validade": "23/09/2027"
  },
  {
    "nome": "Cerveja Heineken Long Neck 330ml",
    "valor": 5.49,
    "quantidade": 180,
    "data_entrada": "01/10/2025",
    "hora_entrada": "19:00",
    "data_saida": "02/10/2025",
    "hora_saida": "20:00",
    "data_validade": "01/06/2026"
  },
  {
    "nome": "Vinho Tinto Chileno Casillero del Diablo 750ml",
    "valor": 55.90,
    "quantidade": 22,
    "data_entrada": "20/09/2025",
    "hora_entrada": "12:00",
    "data_saida": null,
    "hora_saida": null,
    "data_validade": "20/09/2035"
  },
  // --- SEGUNDA LISTA (170 PRODUTOS) ---
  {
    "nome": "Caderno Universitário Tilibra 10 Matérias",
    "valor": 35.90,
    "quantidade": 60,
    "data_entrada": "15/01/2025",
    "hora_entrada": "10:00",
    "data_saida": "20/02/2025",
    "hora_saida": "15:30",
    "data_validade": "15/01/2035"
  },
  {
    "nome": "Caneta Esferográfica BIC Cristal (Azul)",
    "valor": 2.50,
    "quantidade": 500,
    "data_entrada": "15/01/2025",
    "hora_entrada": "10:05",
    "data_saida": null,
    "hora_saida": null,
    "data_validade": "15/01/2028"
  },
  {
    "nome": "Detergente Líquido Limpol 500ml",
    "valor": 2.99,
    "quantidade": 115,
    "data_entrada": "10/09/2025",
    "hora_entrada": "08:15",
    "data_saida": null,
    "hora_saida": null,
    "data_validade": "10/09/2027"
  },
  {
    "nome": "Água Sanitária Qboa 1L",
    "valor": 4.50,
    "quantidade": 70,
    "data_entrada": "11/09/2025",
    "hora_entrada": "09:30",
    "data_saida": "25/09/2025",
    "hora_saida": "14:00",
    "data_validade": "11/03/2026"
  },
  {
    "nome": "Suco de Laranja Natural One 900ml",
    "valor": 12.90,
    "quantidade": 25,
    "data_entrada": "01/10/2025",
    "hora_entrada": "07:00",
    "data_saida": null,
    "hora_saida": null,
    "data_validade": "15/11/2025"
  },
  {
    "nome": "Filé de Frango Congelado Sadia 1kg",
    "valor": 22.50,
    "quantidade": 48,
    "data_entrada": "28/09/2025",
    "hora_entrada": "11:45",
    "data_saida": null,
    "hora_saida": null,
    "data_validade": "28/03/2026"
  },
  {
    "nome": "Batata Palha Elma Chips 120g",
    "valor": 8.99,
    "quantidade": 92,
    "data_entrada": "19/09/2025",
    "hora_entrada": "16:20",
    "data_saida": "30/09/2025",
    "hora_saida": "18:00",
    "data_validade": "19/12/2025"
  },
  {
    "nome": "HD Externo Seagate 1TB",
    "valor": 350.00,
    "quantidade": 12,
    "data_entrada": "05/06/2025",
    "hora_entrada": "14:00",
    "data_saida": null,
    "hora_saida": null,
    "data_validade": "05/06/2030"
  },
  {
    "nome": "SSD Kingston A400 480GB",
    "valor": 280.00,
    "quantidade": 20,
    "data_entrada": "12/07/2025",
    "hora_entrada": "10:30",
    "data_saida": "15/08/2025",
    "hora_saida": "11:00",
    "data_validade": "12/07/2030"
  },
  {
    "nome": "Memória RAM Corsair Vengeance 8GB DDR4",
    "valor": 210.00,
    "quantidade": 38,
    "data_entrada": "18/07/2025",
    "hora_entrada": "11:00",
    "data_saida": null,
    "hora_saida": null,
    "data_validade": "18/07/2035"
  },
  {
    "nome": "Fonte ATX Corsair CV550 550W",
    "valor": 350.00,
    "quantidade": 17,
    "data_entrada": "19/07/2025",
    "hora_entrada": "10:00",
    "data_saida": null,
    "hora_saida": null,
    "data_validade": "19/07/2032"
  },
  {
    "nome": "Placa de Vídeo RTX 3060 Gigabyte",
    "valor": 2500.00,
    "quantidade": 8,
    "data_entrada": "01/05/2025",
    "hora_entrada": "15:00",
    "data_saida": "10/06/2025",
    "hora_saida": "12:00",
    "data_validade": "01/05/2031"
  },
  {
    "nome": "Azeite de Oliva Extra Virgem Gallo 500ml",
    "valor": 39.90,
    "quantidade": 53,
    "data_entrada": "17/09/2025",
    "hora_entrada": "08:45",
    "data_saida": null,
    "hora_saida": null,
    "data_validade": "17/09/2027"
  },
  {
    "nome": "Sal Grosso para Churrasco Cisne 1kg",
    "valor": 4.29,
    "quantidade": 67,
    "data_entrada": "05/09/2025",
    "hora_entrada": "17:00",
    "data_saida": null,
    "hora_saida": null,
    "data_validade": "05/09/2030"
  },
  {
    "nome": "Carvão Vegetal 3kg",
    "valor": 15.00,
    "quantidade": 40,
    "data_entrada": "04/10/2025",
    "hora_entrada": "09:00",
    "data_saida": "04/10/2025",
    "hora_saida": "11:00",
    "data_validade": "04/10/2035"
  },
  {
    "nome": "Desodorante Aerosol Rexona Invisible 150ml",
    "valor": 16.90,
    "quantidade": 85,
    "data_entrada": "13/09/2025",
    "hora_entrada": "14:20",
    "data_saida": null,
    "hora_saida": null,
    "data_validade": "13/09/2027"
  },
  {
    "nome": "Fio Dental Johnson & Johnson 100m",
    "valor": 12.50,
    "quantidade": 100,
    "data_entrada": "14/09/2025",
    "hora_entrada": "11:10",
    "data_saida": null,
    "hora_saida": null,
    "data_validade": "14/09/2028"
  },
  {
    "nome": "Cotonetes Johnson's 75 Unidades",
    "valor": 6.99,
    "quantidade": 125,
    "data_entrada": "15/09/2025",
    "hora_entrada": "10:00",
    "data_saida": "22/09/2025",
    "hora_saida": "16:45",
    "data_validade": "15/09/2030"
  },
  {
    "nome": "Cadeira de Escritório Presidente",
    "valor": 899.90,
    "quantidade": 9,
    "data_entrada": "10/08/2025",
    "hora_entrada": "09:00",
    "data_saida": null,
    "hora_saida": null,
    "data_validade": "10/08/2035"
  },
  {
    "nome": "Webcam Full HD 1080p Logitech C920",
    "valor": 450.00,
    "quantidade": 14,
    "data_entrada": "11/08/2025",
    "hora_entrada": "11:30",
    "data_saida": "15/09/2025",
    "hora_saida": "10:00",
    "data_validade": "11/08/2030"
  },
  // Adicionando mais produtos para chegar a 200
  {
    "nome": "Amaciante de Roupas Downy Concentrado 500ml",
    "valor": 18.90,
    "quantidade": 62,
    "data_entrada": "21/08/2025",
    "hora_entrada": "14:00",
    "data_saida": null,
    "hora_saida": null,
    "data_validade": "21/08/2027"
  },
  {
    "nome": "Tira Manchas Vanish em Pó 450g",
    "valor": 25.00,
    "quantidade": 38,
    "data_entrada": "22/08/2025",
    "hora_entrada": "15:15",
    "data_saida": null,
    "hora_saida": null,
    "data_validade": "22/02/2027"
  },
  {
    "nome": "Cápsulas de Café Nespresso (Intenso) 10 un.",
    "valor": 29.90,
    "quantidade": 110,
    "data_entrada": "01/10/2025",
    "hora_entrada": "10:00",
    "data_saida": null,
    "hora_saida": null,
    "data_validade": "01/08/2026"
  },
  {
    "nome": "Saco de Lixo Embalixo 30L (20 sacos)",
    "valor": 8.90,
    "quantidade": 130,
    "data_entrada": "19/09/2025",
    "hora_entrada": "09:40",
    "data_saida": null,
    "hora_saida": null,
    "data_validade": "19/09/2035"
  },
  {
    "nome": "Lâmpada de LED Philips 9W (Branca)",
    "valor": 12.00,
    "quantidade": 99,
    "data_entrada": "01/09/2025",
    "hora_entrada": "11:00",
    "data_saida": "15/09/2025",
    "hora_saida": "17:30",
    "data_validade": "01/09/2030"
  },
  {
    "nome": "Filtro de Papel para Café Melitta 103",
    "valor": 7.50,
    "quantidade": 140,
    "data_entrada": "29/09/2025",
    "hora_entrada": "16:00",
    "data_saida": null,
    "hora_saida": null,
    "data_validade": "29/09/2030"
  },
  {
    "nome": "Açúcar Refinado União 1kg",
    "valor": 5.89,
    "quantidade": 105,
    "data_entrada": "28/09/2025",
    "hora_entrada": "08:00",
    "data_saida": null,
    "hora_saida": null,
    "data_validade": "28/09/2027"
  },
  {
    "nome": "Milho para Pipoca Yoki 500g",
    "valor": 6.50,
    "quantidade": 82,
    "data_entrada": "14/09/2025",
    "hora_entrada": "13:30",
    "data_saida": null,
    "hora_saida": null,
    "data_validade": "14/03/2027"
  },
  {
    "nome": "Leite Condensado Moça Lata 395g",
    "valor": 7.99,
    "quantidade": 93,
    "data_entrada": "23/09/2025",
    "hora_entrada": "10:20",
    "data_saida": "01/10/2025",
    "hora_saida": "11:00",
    "data_validade": "23/03/2027"
  },
  {
    "nome": "Creme de Leite Nestlé Caixinha 200g",
    "valor": 4.50,
    "quantidade": 112,
    "data_entrada": "23/09/2025",
    "hora_entrada": "10:21",
    "data_saida": null,
    "hora_saida": null,
    "data_validade": "23/12/2026"
  },
  {
    "nome": "Chocolate em Barra Lacta Ao Leite 90g",
    "valor": 6.99,
    "quantidade": 150,
    "data_entrada": "02/10/2025",
    "hora_entrada": "15:00",
    "data_saida": null,
    "hora_saida": null,
    "data_validade": "02/07/2026"
  },
  {
    "nome": "Pilha Alcalina Duracell AA (4 unidades)",
    "valor": 24.90,
    "quantidade": 78,
    "data_entrada": "10/08/2025",
    "hora_entrada": "14:10",
    "data_saida": null,
    "hora_saida": null,
    "data_validade": "10/08/2035"
  },
  {
    "nome": "Papel Toalha Kitchen (2 rolos)",
    "valor": 9.99,
    "quantidade": 66,
    "data_entrada": "27/09/2025",
    "hora_entrada": "11:30",
    "data_saida": null,
    "hora_saida": null,
    "data_validade": "27/09/2035"
  },
  {
    "nome": "Esponja de Aço Bombril (8 unidades)",
    "valor": 5.00,
    "quantidade": 135,
    "data_entrada": "18/09/2025",
    "hora_entrada": "09:00",
    "data_saida": null,
    "hora_saida": null,
    "data_validade": "18/09/2035"
  },
  {
    "nome": "Headset Gamer HyperX Cloud II",
    "valor": 599.00,
    "quantidade": 11,
    "data_entrada": "20/07/2025",
    "hora_entrada": "16:00",
    "data_saida": "25/08/2025",
    "hora_saida": "10:00",
    "data_validade": "20/07/2030"
  },
  {
    "nome": "Cabo HDMI 2.0 Ugreen 2m",
    "valor": 89.90,
    "quantidade": 44,
    "data_entrada": "21/07/2025",
    "hora_entrada": "10:00",
    "data_saida": null,
    "hora_saida": null,
    "data_validade": "21/07/2035"
  },
  {
    "nome": "Roteador Wireless Intelbras Action RG 1200",
    "valor": 249.00,
    "quantidade": 23,
    "data_entrada": "25/07/2025",
    "hora_entrada": "11:45",
    "data_saida": null,
    "hora_saida": null,
    "data_validade": "25/07/2030"
  },
  {
    "nome": "Maionese Hellmann's 500g",
    "valor": 11.90,
    "quantidade": 58,
    "data_entrada": "26/09/2025",
    "hora_entrada": "13:00",
    "data_saida": null,
    "hora_saida": null,
    "data_validade": "26/04/2026"
  },
  {
    "nome": "Ketchup Heinz 397g",
    "valor": 14.50,
    "quantidade": 61,
    "data_entrada": "26/09/2025",
    "hora_entrada": "13:01",
    "data_saida": null,
    "hora_saida": null,
    "data_validade": "26/09/2026"
  },
  {
    "nome": "Mostarda Heinz 255g",
    "valor": 9.90,
    "quantidade": 47,
    "data_entrada": "26/09/2025",
    "hora_entrada": "13:02",
    "data_saida": null,
    "hora_saida": null,
    "data_validade": "26/09/2026"
  }
]