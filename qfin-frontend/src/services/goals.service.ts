import api from "../config/api";
import type { Goal, CreateGoalRequest } from "../types";

const BASE_URL = "/api/goals";

export const createGoal = async (goalData: CreateGoalRequest): Promise<Goal> => {
  const response = await api.post<Goal>(BASE_URL, goalData);
  return response.data;
};

export const getGoals = async (): Promise<Goal[]> => {
  const response = await api.get<Goal[]>(BASE_URL);
  return response.data;
};

export const getGoalById = async (id: number): Promise<Goal> => {
  const response = await api.get<Goal>(`${BASE_URL}/${id}`);
  return response.data;
};

export const updateGoal = async (id: number, goalData: CreateGoalRequest): Promise<Goal> => {
  const response = await api.put<Goal>(`${BASE_URL}/${id}`, goalData);
  return response.data;
};

export const addToGoal = async (id: number, amount: number): Promise<Goal> => {
  const response = await api.patch<Goal>(`${BASE_URL}/${id}/add`, { amount });
  return response.data;
};

export const deleteGoal = async (id: number): Promise<void> => {
  await api.delete(`${BASE_URL}/${id}`);
};

export const completeGoal = async (id: number): Promise<Goal> => {
  const response = await api.patch<Goal>(`${BASE_URL}/${id}/complete`);
  return response.data;
};
