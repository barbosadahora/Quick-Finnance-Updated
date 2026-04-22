import React, { useState, useEffect } from 'react';
import { Budget, CreateBudgetRequest, Category } from '../types';
import { createBudget, getBudgets, updateBudget, deleteBudget } from '../services/budget.service';
import { getAllCategories } from '../services/categories.service';
import { toast } from 'react-toastify';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

const Budgets: React.FC = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBudget, setCurrentBudget] = useState<Budget | null>(null);
  const [formData, setFormData] = useState<CreateBudgetRequest>({
    category: '',
    amount: 0,
    startDate: '',
    endDate: '',
    alertThreshold: 0,
  });

  useEffect(() => {
    fetchBudgets();
    fetchCategories();
  }, []);

  const fetchBudgets = async () => {
    try {
      const data = await getBudgets();
      setBudgets(data);
    } catch (error) {
      toast.error('Erro ao buscar orçamentos.');
      console.error('Error fetching budgets:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategories(data.filter(cat => cat.type === 'EXPENSE')); // Budgets usually for expenses
    } catch (error) {
      toast.error('Erro ao buscar categorias.');
      console.error('Error fetching categories:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' || name === 'alertThreshold' ? parseFloat(value) : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentBudget) {
        await updateBudget(currentBudget.id!, formData);
        toast.success('Orçamento atualizado com sucesso!');
      } else {
        await createBudget(formData);
        toast.success('Orçamento criado com sucesso!');
      }
      fetchBudgets();
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      toast.error('Erro ao salvar orçamento.');
      console.error('Error saving budget:', error);
    }
  };

  const handleEdit = (budget: Budget) => {
    setCurrentBudget(budget);
    setFormData({
      category: budget.category,
      amount: budget.amount,
      startDate: budget.startDate,
      endDate: budget.endDate,
      alertThreshold: budget.alertThreshold || 0,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja deletar este orçamento?')) {
      try {
        await deleteBudget(id);
        toast.success('Orçamento deletado com sucesso!');
        fetchBudgets();
      } catch (error) {
        toast.error('Erro ao deletar orçamento.');
        console.error('Error deleting budget:', error);
      }
    }
  };

  const resetForm = () => {
    setCurrentBudget(null);
    setFormData({
      category: '',
      amount: 0,
      startDate: '',
      endDate: '',
      alertThreshold: 0,
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gerenciar Orçamentos</h1>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild>
          <Button onClick={resetForm} className="mb-4">Adicionar Novo Orçamento</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentBudget ? 'Editar Orçamento' : 'Adicionar Orçamento'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="category">Categoria</Label>
              <Select name="category" value={formData.category} onValueChange={(value) => handleSelectChange('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="amount">Valor do Orçamento</Label>
              <Input type="number" name="amount" value={formData.amount} onChange={handleInputChange} required />
            </div>
            <div>
              <Label htmlFor="startDate">Data de Início</Label>
              <Input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} required />
            </div>
            <div>
              <Label htmlFor="endDate">Data de Término</Label>
              <Input type="date" name="endDate" value={formData.endDate} onChange={handleInputChange} required />
            </div>
            <div>
              <Label htmlFor="alertThreshold">Limite de Alerta (%)</Label>
              <Input type="number" name="alertThreshold" value={formData.alertThreshold} onChange={handleInputChange} placeholder="Ex: 80 para 80%" />
            </div>
            <Button type="submit">Salvar Orçamento</Button>
          </form>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {budgets.map(budget => (
          <div key={budget.id} className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold">{budget.category}</h3>
            <p>Valor: {budget.amount}</p>
            <p>Período: {budget.startDate} a {budget.endDate}</p>
            <p>Alerta: {budget.alertThreshold}%</p>
            <div className="mt-2">
              <Button variant="outline" size="sm" className="mr-2" onClick={() => handleEdit(budget)}>Editar</Button>
              <Button variant="destructive" size="sm" onClick={() => handleDelete(budget.id!)}>Deletar</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


export default Budgets;
