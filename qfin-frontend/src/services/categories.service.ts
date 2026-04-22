import api from "../config/api";
import type { Category, CreateCategoryRequest, UpdateCategoryRequest } from "../types";

const BASE_URL = "/api/categories";

export const getAllCategories = async (): Promise<Category[]> => {
  const response = await api.get<Category[]>(BASE_URL);
  return response.data;
};

export const getCategoriesByType = async (type: 'INCOME' | 'EXPENSE'): Promise<Category[]> => {
  const response = await api.get<Category[]>(`${BASE_URL}/type/${type}`);
  return response.data;
};

export const getMainCategories = async (): Promise<Category[]> => {
  const response = await api.get<Category[]>(`${BASE_URL}/main`);
  return response.data;
};

export const getSubcategories = async (parentId: number): Promise<Category[]> => {
  const response = await api.get<Category[]>(`${BASE_URL}/${parentId}/subcategories`);
  return response.data;
};

export const getCategoryById = async (id: number): Promise<Category> => {
  const response = await api.get<Category>(`${BASE_URL}/${id}`);
  return response.data;
};

export const createCategory = async (data: CreateCategoryRequest): Promise<Category> => {
  const response = await api.post<Category>(BASE_URL, data);
  return response.data;
};

export const updateCategory = async (id: number, data: UpdateCategoryRequest): Promise<Category> => {
  const response = await api.put<Category>(`${BASE_URL}/${id}`, data);
  return response.data;
};

export const deleteCategory = async (id: number): Promise<void> => {
  await api.delete(`${BASE_URL}/${id}`);
};

export const initializeDefaultCategories = async (): Promise<void> => {
  await api.post(`${BASE_URL}/initialize`);
};

export const searchCategories = async (searchTerm: string): Promise<Category[]> => {
  const response = await api.get<Category[]>(`${BASE_URL}/search`, { params: { searchTerm } });
  return response.data;
};

export const filterCategoriesByType = async (type: 'INCOME' | 'EXPENSE'): Promise<Category[]> => {
  const response = await api.get<Category[]>(`${BASE_URL}/filter/type`, { params: { type } });
  return response.data;
};

export const filterCategoriesByNotesPresence = async (hasNotes: boolean): Promise<Category[]> => {
  const response = await api.get<Category[]>(`${BASE_URL}/filter/notes`, { params: { hasNotes } });
  return response.data;
};

export const filterCategoriesByDefault = async (isDefault: boolean): Promise<Category[]> => {
  const response = await api.get<Category[]>(`${BASE_URL}/filter/default`, { params: { isDefault } });
  return response.data;
};
