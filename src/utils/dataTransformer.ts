// src/utils/dataTransformer.ts

import { Product } from '../types'; // Importa o tipo final da aplicação
import { Produto as MockProduto } from './mock'; // Importa o tipo local do mock

/**
 * Converte uma data e hora no formato brasileiro (DD/MM/YYYY, HH:mm) para uma string ISO 8601.
 */
const parseBrDateTimeToISO = (dateStr: string, timeStr: string): string => {
  const [day, month, year] = dateStr.split('/');
  return new Date(`${year}-${month}-${day}T${timeStr || '00:00:00'}`).toISOString();
};

/**
 * Converte uma data no formato brasileiro (DD/MM/YYYY) para o formato "YYYY-MM-DD".
 */
const parseBrDateToISODate = (dateStr: string): string => {
  const [day, month, year] = dateStr.split('/');
  return `${year}-${month}-${day}`;
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

/**
 * Transforma a lista de produtos do mock para o formato `Product` que a aplicação utiliza.
 * ESTA É A ÚNICA FUNÇÃO EXPORTADA.
 */
export const transformMockData = (mockData: MockProduto[]): Product[] => {
  return mockData.map((p, index) => {
    const now = new Date().toISOString();
    return {
      id: index + 1,
      nome: p.nome,
      valor: p.valor,
      quantidade: p.quantidade,
      dataEntrada: parseBrDateTimeToISO(p.data_entrada, p.hora_entrada),
      dataSaida: p.data_saida && p.hora_saida ? parseBrDateTimeToISO(p.data_saida, p.hora_saida) : undefined,
      dataValidade: parseBrDateToISODate(p.data_validade),
      createdAt: now,
      updatedAt: now,
    };
  });
};