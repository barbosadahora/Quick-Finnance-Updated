import api from "../config/api";
import { Budget, CreateBudgetRequest } from "../types";

const BASE_URL = "/api/budgets";

export const createBudget = async (budgetData: CreateBudgetRequest): Promise<Budget> => {
  const response = await api.post<Budget>(BASE_URL, budgetData);
  return response.data;
};

export const getBudgets = async (): Promise<Budget[]> => {
  const response = await api.get<Budget[]>(BASE_URL);
  return response.data;
};

export const getBudgetById = async (id: number): Promise<Budget> => {
  const response = await api.get<Budget>(`${BASE_URL}/${id}`);
  return response.data;
};

export const updateBudget = async (id: number, budgetData: CreateBudgetRequest): Promise<Budget> => {
  const response = await api.put<Budget>(`${BASE_URL}/${id}`, budgetData);
  return response.data;
};

export const deleteBudget = async (id: number): Promise<void> => {
  await api.delete(`${BASE_URL}/${id}`);
};

export const getBudgetsByCategory = async (category: string): Promise<Budget[]> => {
  const response = await api.get<Budget[]>(`${BASE_URL}/filter/category`, { params: { category } });
  return response.data;
};

export const getBudgetsByDateRange = async (startDate: string, endDate: string): Promise<Budget[]> => {
  const response = await api.get<Budget[]>(`${BASE_URL}/filter/date`, { params: { startDate, endDate } });
  return response.data;
};

export const getBudgetsWithAlerts = async (): Promise<Budget[]> => {
  const response = await api.get<Budget[]>(`${BASE_URL}/alerts`);
  return response.data;
};
