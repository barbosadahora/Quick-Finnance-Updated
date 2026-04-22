import api from "../config/api";

const BASE_URL = "/api/calculators";

export const calculateLoanPayment = async (principal: number, annualInterestRate: number, loanTermInMonths: number): Promise<number> => {
  const response = await api.get<number>(`${BASE_URL}/loan-payment`, { params: { principal, annualInterestRate, loanTermInMonths } });
  return response.data;
};

export const calculateFutureValue = async (principal: number, annualInterestRate: number, years: number, monthlyContribution: number): Promise<number> => {
  const response = await api.get<number>(`${BASE_URL}/future-value`, { params: { principal, annualInterestRate, years, monthlyContribution } });
  return response.data;
};

export const calculateTimeToReachGoal = async (currentSavings: number, monthlySavings: number, annualInterestRate: number, goalAmount: number): Promise<number> => {
  const response = await api.get<number>(`${BASE_URL}/time-to-goal`, { params: { currentSavings, monthlySavings, annualInterestRate, goalAmount } });
  return response.data;
};
