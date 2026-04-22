import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { useEffect } from "react";
import type { Transaction, Category } from '../types';
import * as categoriesService from "../services/categories.service";

interface TransactionFormProps {
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
}

export function TransactionForm({ onAddTransaction }: TransactionFormProps) {
  const [type, setType] = useState<'INCOME' | 'EXPENSE'>('INCOME');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceInterval, setRecurrenceInterval] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoriesService.getAllCategories();
        setAvailableCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !category || !description) return;

    const transactionDate = new Date().toISOString().split('T')[0];

    onAddTransaction({
      type,
      amount: parseFloat(amount),
      category,
      description,
      date: transactionDate,
      isRecurring,
      recurrenceInterval: isRecurring ? recurrenceInterval : undefined,
      dueDate: isRecurring ? dueDate : undefined,
      notes: notes || undefined,
    });

    setAmount('');
    setCategory('');
    setDescription('');
    setIsRecurring(false);
    setRecurrenceInterval('');
    setDueDate('');
    setNotes('');
  };



  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2" style={{ color: '#1E3A8A' }}>
          <Plus className="h-5 w-5" />
          Nova Transação
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <Button
              type="button"
              variant={type === 'INCOME' ? 'default' : 'outline'}
              onClick={() => setType('INCOME')}
              className="flex-1"
              style={type === 'INCOME' ? { backgroundColor: '#059669', borderColor: '#059669' } : { borderColor: '#059669', color: '#059669' }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Receita
            </Button>
            <Button
              type="button"
              variant={type === 'EXPENSE' ? 'default' : 'outline'}
              onClick={() => setType('EXPENSE')}
              className="flex-1"
              style={type === 'EXPENSE' ? { backgroundColor: '#DC2626', borderColor: '#DC2626' } : { borderColor: '#DC2626', color: '#DC2626' }}
            >
              <Minus className="h-4 w-4 mr-2" />
              Despesa
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Valor</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0,00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoria</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {availableCategories.filter(cat => cat.type === type).map((cat) => (
                  <SelectItem key={cat.id} value={cat.name}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              placeholder="Descrição da transação"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isRecurring"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <Label htmlFor="isRecurring">Transação Recorrente?</Label>
          </div>

          {isRecurring && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="recurrenceInterval">Intervalo de Recorrência</Label>
                <Select value={recurrenceInterval} onValueChange={setRecurrenceInterval}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DAILY">Diário</SelectItem>
                    <SelectItem value="WEEKLY">Semanal</SelectItem>
                    <SelectItem value="MONTHLY">Mensal</SelectItem>
                    <SelectItem value="ANNUALLY">Anual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Próxima Data de Vencimento</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes">Notas (Opcional)</Label>
            <Textarea
              id="notes"
              placeholder="Adicione notas adicionais..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full"
            style={{ backgroundColor: '#1E3A8A', borderColor: '#1E3A8A' }}
          >
            Adicionar Transação
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}