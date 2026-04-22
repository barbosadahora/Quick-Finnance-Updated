import React, { useState, useEffect } from 'react';
import { Category, CreateCategoryRequest, UpdateCategoryRequest } from '../types';
import * as categoriesService from '../services/categories.service';
import { toast } from 'react-toastify';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { Plus, Edit, Trash2, Search, Filter } from 'lucide-react';

const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CreateCategoryRequest>({
    name: '',
    type: 'EXPENSE',
    color: '#000000',
    icon: 'tag',
    notes: '',
    parentId: undefined,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'INCOME' | 'EXPENSE'>('all');
  const [filterNotes, setFilterNotes] = useState<'all' | 'hasNotes' | 'noNotes'>('all');

  useEffect(() => {
    fetchCategories();
  }, [searchTerm, filterType, filterNotes]);

  const fetchCategories = async () => {
    try {
      let fetchedCategories: Category[] = [];
      if (searchTerm) {
        fetchedCategories = await categoriesService.searchCategories(searchTerm);
      } else if (filterType !== 'all') {
        fetchedCategories = await categoriesService.filterCategoriesByType(filterType);
      } else if (filterNotes === 'hasNotes') {
        fetchedCategories = await categoriesService.filterCategoriesByNotesPresence(true);
      } else if (filterNotes === 'noNotes') {
        fetchedCategories = await categoriesService.filterCategoriesByNotesPresence(false);
      } else {
        fetchedCategories = await categoriesService.getAllCategories();
      }
      setCategories(fetchedCategories);
    } catch (error) {
      toast.error('Erro ao buscar categorias.');
      console.error('Error fetching categories:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
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
      if (currentCategory) {
        await categoriesService.updateCategory(currentCategory.id!, formData as UpdateCategoryRequest);
        toast.success('Categoria atualizada com sucesso!');
      } else {
        await categoriesService.createCategory(formData);
        toast.success('Categoria criada com sucesso!');
      }
      fetchCategories();
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      toast.error('Erro ao salvar categoria.');
      console.error('Error saving category:', error);
    }
  };

  const handleEdit = (category: Category) => {
    setCurrentCategory(category);
    setFormData({
      name: category.name,
      type: category.type,
      color: category.color || '#000000',
      icon: category.icon || 'tag',
      notes: category.notes || '',
      parentId: category.parentId || undefined,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja deletar esta categoria?')) {
      try {
        await categoriesService.deleteCategory(id);
        toast.success('Categoria deletada com sucesso!');
        fetchCategories();
      } catch (error) {
        toast.error('Erro ao deletar categoria.');
        console.error('Error deleting category:', error);
      }
    }
  };

  const resetForm = () => {
    setCurrentCategory(null);
    setFormData({
      name: '',
      type: 'EXPENSE',
      color: '#000000',
      icon: 'tag',
      notes: '',
      parentId: undefined,
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gerenciar Categorias</h1>

      <div className="flex items-center space-x-2 mb-4">
        <Input
          type="text"
          placeholder="Buscar categorias..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select value={filterType} onValueChange={(value: 'all' | 'INCOME' | 'EXPENSE') => setFilterType(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Tipos</SelectItem>
            <SelectItem value="INCOME">Receita</SelectItem>
            <SelectItem value="EXPENSE">Despesa</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterNotes} onValueChange={(value: 'all' | 'hasNotes' | 'noNotes') => setFilterNotes(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por Notas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as Notas</SelectItem>
            <SelectItem value="hasNotes">Com Notas</SelectItem>
            <SelectItem value="noNotes">Sem Notas</SelectItem>
          </SelectContent>
        </Select>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}><Plus className="mr-2 h-4 w-4" /> Adicionar Categoria</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{currentCategory ? 'Editar Categoria' : 'Adicionar Categoria'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nome</Label>
                <Input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
              </div>
              <div>
                <Label htmlFor="type">Tipo</Label>
                <Select name="type" value={formData.type} onValueChange={(value) => handleSelectChange('type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INCOME">Receita</SelectItem>
                    <SelectItem value="EXPENSE">Despesa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="color">Cor</Label>
                <Input type="color" name="color" value={formData.color} onChange={handleInputChange} />
              </div>
              <div>
                <Label htmlFor="icon">Ícone (Nome do Lucide Icon)</Label>
                <Input type="text" name="icon" value={formData.icon} onChange={handleInputChange} placeholder="Ex: tag, home, car" />
              </div>
              <div>
                <Label htmlFor="notes">Notas</Label>
                <Textarea name="notes" value={formData.notes} onChange={handleInputChange} />
              </div>
              <div>
                <Label htmlFor="parentId">Categoria Pai (Opcional)</Label>
                <Select name="parentId" value={formData.parentId ? String(formData.parentId) : ''} onValueChange={(value) => handleSelectChange('parentId', value === '' ? undefined : parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria pai" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Nenhuma</SelectItem>
                    {categories.filter(cat => cat.id !== currentCategory?.id).map(cat => (
                      <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit">Salvar Categoria</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(category => (
          <Card key={category.id} className="relative">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {/* Render Lucide Icon dynamically if possible, otherwise use fallback */}
                <span style={{ color: category.color }}>{category.icon}</span>
                {category.name}
              </CardTitle>
              <CardDescription>{category.type}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Notas: {category.notes || 'Nenhuma'}</p>
              <div className="absolute top-4 right-4 flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(category)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(category.id!)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CategoryManagement;
