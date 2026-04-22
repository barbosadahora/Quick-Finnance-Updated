// Definições de tipo compartilhadas para a aplicação

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Transaction {
  id: number;
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  category: string;
  description: string;
  date: string;
  isRecurring?: boolean;
  recurrenceInterval?: string;
  dueDate?: string;
  notes?: string;
}

export interface CreateTransactionRequest {
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  category: string;
  description: string;
  date: string;
  isRecurring?: boolean;
  recurrenceInterval?: string;
  dueDate?: string;
  notes?: string;
}

export interface Financing {
  id?: number;
  name: string;
  totalAmount: number;
  remainingAmount: number;
  monthlyPayment: number;
  type: string;
  endDate: string;
}

export interface CreateFinancingRequest {
  name: string;
  totalAmount: number;
  remainingAmount: number;
  monthlyPayment: number;
  type: string;
  endDate: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface UpdateProfileRequest {
  name: string;
  email: string;
}

export interface Statistics {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}

export interface Goal {
  id?: number;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string;
  description?: string;
  alertThreshold?: number;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
}

export interface CreateGoalRequest {
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string;
  description?: string;
  alertThreshold?: number;
}

export interface Budget {
  id?: number;
  category: string;
  amount: number;
  startDate: string;
  endDate: string;
  alertThreshold?: number;
}

export interface CreateBudgetRequest {
  category: string;
  amount: number;
  startDate: string;
  endDate: string;
  alertThreshold?: number;
}

export interface Category {
  id: number;
  name: string;
  type: 'INCOME' | 'EXPENSE';
  parentId?: number | null;
  isDefault: boolean;
  userId: number;
  color?: string;
  icon?: string;
  notes?: string;
}

export interface CreateCategoryRequest {
  name: string;
  type: 'INCOME' | 'EXPENSE';
  parentId?: number | null;
  color?: string;
  icon?: string;
  notes?: string;
}

export interface UpdateCategoryRequest {
  name: string;
  parentId?: number | null;
  color?: string;
  icon?: string;
  notes?: string;
}
