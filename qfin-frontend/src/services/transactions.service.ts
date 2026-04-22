import api from "../config/api";
import type { Transaction, CreateTransactionRequest, Statistics } from "../types";

const BASE_URL = "/api/transactions";

export const getTransactions = async (): Promise<Transaction[]> => {
  const response = await api.get<Transaction[]>(BASE_URL);
  return response.data;
};

export const getTransactionById = async (id: number): Promise<Transaction> => {
  const response = await api.get<Transaction>(`${BASE_URL}/${id}`);
  return response.data;
};

export const createTransaction = async (transactionData: CreateTransactionRequest): Promise<Transaction> => {
  const response = await api.post<Transaction>(BASE_URL, transactionData);
  return response.data;
};

export const updateTransaction = async (id: number, transactionData: CreateTransactionRequest): Promise<Transaction> => {
  const response = await api.put<Transaction>(`${BASE_URL}/${id}`, transactionData);
  return response.data;
};

export const deleteTransaction = async (id: number): Promise<void> => {
  await api.delete(`${BASE_URL}/${id}`);
};

export const getStatistics = async (): Promise<Statistics> => {
  const response = await api.get<Statistics>(`${BASE_URL}/statistics`);
  return response.data;
};

export const searchTransactions = async (searchTerm: string): Promise<Transaction[]> => {
  const response = await api.get<Transaction[]>(`${BASE_URL}/search`, { params: { searchTerm } });
  return response.data;
};

export const filterTransactionsByDateRange = async (startDate: string, endDate: string): Promise<Transaction[]> => {
  const response = await api.get<Transaction[]>(`${BASE_URL}/filter/date`, { params: { startDate, endDate } });
  return response.data;
};

export const filterTransactionsByCategory = async (category: string): Promise<Transaction[]> => {
  const response = await api.get<Transaction[]>(`${BASE_URL}/filter/category`, { params: { category } });
  return response.data;
};

export const filterTransactionsByType = async (type: string): Promise<Transaction[]> => {
  const response = await api.get<Transaction[]>(`${BASE_URL}/filter/type`, { params: { type } });
  return response.data;
};
