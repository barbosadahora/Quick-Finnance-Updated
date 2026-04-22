import React, { useState } from 'react';
import { calculateLoanPayment, calculateFutureValue, calculateTimeToReachGoal } from '../services/financial-calculators.service';
import { toast } from 'react-toastify';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

const FinancialCalculators: React.FC = () => {
  // Loan Payment Calculator
  const [loanPrincipal, setLoanPrincipal] = useState<number>(0);
  const [loanInterestRate, setLoanInterestRate] = useState<number>(0);
  const [loanTerm, setLoanTerm] = useState<number>(0);
  const [loanPaymentResult, setLoanPaymentResult] = useState<number | null>(null);

  const handleLoanCalculation = async () => {
    try {
      const result = await calculateLoanPayment(loanPrincipal, loanInterestRate, loanTerm);
      setLoanPaymentResult(result);
    } catch (error) {
      toast.error('Erro ao calcular pagamento de empréstimo.');
      console.error('Error calculating loan payment:', error);
      setLoanPaymentResult(null);
    }
  };

  // Future Value Calculator
  const [fvPrincipal, setFvPrincipal] = useState<number>(0);
  const [fvInterestRate, setFvInterestRate] = useState<number>(0);
  const [fvYears, setFvYears] = useState<number>(0);
  const [fvMonthlyContribution, setFvMonthlyContribution] = useState<number>(0);
  const [fvResult, setFvResult] = useState<number | null>(null);

  const handleFutureValueCalculation = async () => {
    try {
      const result = await calculateFutureValue(fvPrincipal, fvInterestRate, fvYears, fvMonthlyContribution);
      setFvResult(result);
    } catch (error) {
      toast.error('Erro ao calcular valor futuro.');
      console.error('Error calculating future value:', error);
      setFvResult(null);
    }
  };

  // Time to Reach Goal Calculator
  const [goalCurrentSavings, setGoalCurrentSavings] = useState<number>(0);
  const [goalMonthlySavings, setGoalMonthlySavings] = useState<number>(0);
  const [goalInterestRate, setGoalInterestRate] = useState<number>(0);
  const [goalAmount, setGoalAmount] = useState<number>(0);
  const [goalTimeResult, setGoalTimeResult] = useState<number | null>(null);

  const handleTimeToGoalCalculation = async () => {
    try {
      const result = await calculateTimeToReachGoal(goalCurrentSavings, goalMonthlySavings, goalInterestRate, goalAmount);
      setGoalTimeResult(result);
    } catch (error) {
      toast.error('Erro ao calcular tempo para atingir a meta.');
      console.error('Error calculating time to goal:', error);
      setGoalTimeResult(null);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Calculadoras Financeiras</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Loan Payment Calculator */}
        <Card>
          <CardHeader>
            <CardTitle>Calculadora de Pagamento de Empréstimo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="loanPrincipal">Principal do Empréstimo</Label>
              <Input type="number" id="loanPrincipal" value={loanPrincipal} onChange={(e) => setLoanPrincipal(parseFloat(e.target.value))} />
            </div>
            <div>
              <Label htmlFor="loanInterestRate">Taxa de Juros Anual (%)</Label>
              <Input type="number" id="loanInterestRate" value={loanInterestRate} onChange={(e) => setLoanInterestRate(parseFloat(e.target.value))} />
            </div>
            <div>
              <Label htmlFor="loanTerm">Prazo do Empréstimo (meses)</Label>
              <Input type="number" id="loanTerm" value={loanTerm} onChange={(e) => setLoanTerm(parseFloat(e.target.value))} />
            </div>
            <Button onClick={handleLoanCalculation}>Calcular</Button>
            {loanPaymentResult !== null && (
              <p className="mt-2">Pagamento Mensal: R$ {loanPaymentResult.toFixed(2)}</p>
            )}
          </CardContent>
        </Card>

        {/* Future Value Calculator */}
        <Card>
          <CardHeader>
            <CardTitle>Calculadora de Valor Futuro</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="fvPrincipal">Capital Inicial</Label>
              <Input type="number" id="fvPrincipal" value={fvPrincipal} onChange={(e) => setFvPrincipal(parseFloat(e.target.value))} />
            </div>
            <div>
              <Label htmlFor="fvInterestRate">Taxa de Juros Anual (%)</Label>
              <Input type="number" id="fvInterestRate" value={fvInterestRate} onChange={(e) => setFvInterestRate(parseFloat(e.target.value))} />
            </div>
            <div>
              <Label htmlFor="fvYears">Período (anos)</Label>
              <Input type="number" id="fvYears" value={fvYears} onChange={(e) => setFvYears(parseFloat(e.target.value))} />
            </div>
            <div>
              <Label htmlFor="fvMonthlyContribution">Contribuição Mensal Adicional</Label>
              <Input type="number" id="fvMonthlyContribution" value={fvMonthlyContribution} onChange={(e) => setFvMonthlyContribution(parseFloat(e.target.value))} />
            </div>
            <Button onClick={handleFutureValueCalculation}>Calcular</Button>
            {fvResult !== null && (
              <p className="mt-2">Valor Futuro: R$ {fvResult.toFixed(2)}</p>
            )}
          </CardContent>
        </Card>

        {/* Time to Reach Goal Calculator */}
        <Card>
          <CardHeader>
            <CardTitle>Calculadora de Tempo para Atingir Meta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="goalCurrentSavings">Economia Atual</Label>
              <Input type="number" id="goalCurrentSavings" value={goalCurrentSavings} onChange={(e) => setGoalCurrentSavings(parseFloat(e.target.value))} />
            </div>
            <div>
              <Label htmlFor="goalMonthlySavings">Economia Mensal</Label>
              <Input type="number" id="goalMonthlySavings" value={goalMonthlySavings} onChange={(e) => setGoalMonthlySavings(parseFloat(e.target.value))} />
            </div>
            <div>
              <Label htmlFor="goalInterestRate">Taxa de Juros Anual (%)</Label>
              <Input type="number" id="goalInterestRate" value={goalInterestRate} onChange={(e) => setGoalInterestRate(parseFloat(e.target.value))} />
            </div>
            <div>
              <Label htmlFor="goalAmount">Valor da Meta</Label>
              <Input type="number" id="goalAmount" value={goalAmount} onChange={(e) => setGoalAmount(parseFloat(e.target.value))} />
            </div>
            <Button onClick={handleTimeToGoalCalculation}>Calcular</Button>
            {goalTimeResult !== null && (
              <p className="mt-2">Tempo para Atingir a Meta: {goalTimeResult.toFixed(0)} meses</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FinancialCalculators;
