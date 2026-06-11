# Design de Interface - Quick Finance Mobile

**Orientação:** Portrait (9:16)  
**Uso:** Uma mão (thumb-friendly)  
**Padrão:** Apple Human Interface Guidelines (HIG)

---

## 1. Estrutura de Navegação

O aplicativo utiliza **Tab Bar Navigation** (5 abas) na parte inferior para acesso rápido às principais funcionalidades.

### Abas Principais
1. **Home (Dashboard)** - Visão consolidada financeira
2. **Transactions** - Registro e listagem de transações
3. **Reports** - Análise e exportação de relatórios
4. **Goals** - Metas financeiras
5. **Profile** - Configurações e perfil

---

## 2. Telas Principais

### 2.1. Tela de Login
**Objetivo:** Autenticar o usuário no sistema.

**Layout:**
- Logo do Quick Finance (topo)
- Campo de e-mail
- Campo de senha
- Botão "Entrar"
- Link "Não tem conta? Registre-se"

**Funcionalidade:**
- Validação de e-mail e senha
- Mensagem de erro clara
- Loading indicator durante autenticação

---

### 2.2. Tela de Registro
**Objetivo:** Criar nova conta de usuário.

**Layout:**
- Logo do Quick Finance
- Campo de nome completo
- Campo de e-mail
- Campo de senha
- Campo de confirmação de senha
- Botão "Registrar"
- Link "Já tem conta? Faça login"

**Funcionalidade:**
- Validação de campos
- Verificação de senha forte
- Confirmação de senha

---

### 2.3. Dashboard (Home)
**Objetivo:** Visualizar resumo financeiro do mês atual.

**Layout (scroll vertical):**
1. **Cabeçalho:**
   - Saudação: "Olá, [Nome do Usuário]"
   - Data atual
   - Ícone de menu/perfil (canto superior direito)

2. **Card de Saldo:**
   - Saldo total em grande (ex: R$ 5.234,50)
   - Indicador de tendência (↑ ou ↓)
   - Período (Mês atual)

3. **Cards de Resumo (2 colunas):**
   - Receitas: R$ X.XXX,XX (cor azul)
   - Despesas: R$ X.XXX,XX (cor vermelha)

4. **Gráfico de Categorias:**
   - Gráfico de pizza ou barras
   - Top 5 categorias de despesa

5. **Transações Recentes:**
   - Últimas 5 transações
   - Cada item mostra: ícone, descrição, valor, data

6. **Botão Flutuante:**
   - Ícone de "+" para adicionar nova transação

---

### 2.4. Tela de Transações
**Objetivo:** Registrar, visualizar e gerenciar transações.

**Layout (scroll vertical):**
1. **Filtros (horizontal scroll):**
   - Tipo: Todas, Receitas, Despesas
   - Período: Este mês, Últimos 3 meses, Personalizado
   - Categoria: Dropdown

2. **Lista de Transações:**
   - Cada item: ícone | descrição | valor | data
   - Swipe para editar/deletar (iOS) ou menu de contexto (Android)
   - Agrupado por data

3. **Botão Flutuante (FAB):**
   - "+" para adicionar nova transação

**Modal de Adicionar Transação:**
- Tipo (Receita/Despesa) - Toggle
- Data (date picker)
- Categoria (dropdown)
- Descrição (text input)
- Valor (numeric input)
- Botão "Salvar"

---

### 2.5. Tela de Relatórios
**Objetivo:** Analisar dados financeiros e exportar em PDF/CSV.

**Layout (scroll vertical):**
1. **Filtros:**
   - Data inicial (date picker)
   - Data final (date picker)
   - Tipo: Todas, Receitas, Despesas
   - Categoria: Dropdown

2. **Resumo do Período:**
   - Receitas totais
   - Despesas totais
   - Saldo
   - Número de transações

3. **Detalhamento por Categoria:**
   - Tabela: Categoria | Tipo | Valor | Qtd

4. **Botões de Ação:**
   - "Exportar PDF" (gera e abre/compartilha)
   - "Exportar CSV" (gera e abre/compartilha)

---

### 2.6. Tela de Metas
**Objetivo:** Definir e acompanhar objetivos financeiros.

**Layout (scroll vertical):**
1. **Botão Flutuante (FAB):**
   - "+" para criar nova meta

2. **Lista de Metas:**
   - Card para cada meta:
     - Nome da meta
     - Valor alvo
     - Valor atual (com barra de progresso)
     - Data limite
     - Percentual de conclusão
     - Status (Em progresso, Concluída, Cancelada)

**Modal de Criar Meta:**
- Nome da meta
- Valor alvo
- Data limite
- Descrição (opcional)
- Botão "Criar"

---

### 2.7. Tela de Financiamentos
**Objetivo:** Gerenciar empréstimos e financiamentos.

**Layout (scroll vertical):**
1. **Resumo de Financiamentos:**
   - Total de financiamentos ativos
   - Valor total restante
   - Próximo vencimento

2. **Lista de Financiamentos:**
   - Card para cada financiamento:
     - Nome
     - Tipo (Empréstimo, Financiamento de Carro, Hipoteca, etc.)
     - Valor total
     - Valor restante
     - Parcela mensal
     - Data final
     - Barra de progresso

3. **Botão Flutuante (FAB):**
   - "+" para adicionar novo financiamento

---

### 2.8. Tela de Perfil
**Objetivo:** Gerenciar configurações e informações da conta.

**Layout (scroll vertical):**
1. **Informações do Usuário:**
   - Avatar (ou iniciais)
   - Nome
   - E-mail

2. **Opções:**
   - Editar Perfil
   - Alterar Senha
   - Preferências de Notificação
   - Idioma/Moeda
   - Modo Escuro/Claro
   - Sobre o App
   - Sair

---

### 2.9. Modal de Ajuda (F1)
**Objetivo:** Exibir manual do usuário.

**Layout:**
- Título: "Manual do Usuário"
- Conteúdo em Markdown (renderizado)
- Scroll vertical
- Botão "Fechar" ou swipe down para fechar

---

## 3. Paleta de Cores

| Elemento | Cor | Hex |
| :--- | :--- | :--- |
| **Primária** | Azul | #0a7ea4 |
| **Fundo** | Branco (Light) / Cinza Escuro (Dark) | #ffffff / #151718 |
| **Texto Principal** | Cinza Escuro (Light) / Branco (Dark) | #11181C / #ECEDEE |
| **Texto Secundário** | Cinza Médio | #687076 |
| **Receitas** | Verde | #22C55E |
| **Despesas** | Vermelho | #EF4444 |
| **Alerta** | Laranja | #F59E0B |
| **Sucesso** | Verde | #22C55E |

---

## 4. Componentes Reutilizáveis

- **Button:** Primário, Secundário, Outline
- **Card:** Surface com sombra
- **Input:** Text, Number, Date, Dropdown
- **Modal:** Dialog com overlay
- **Tab Bar:** Navegação inferior
- **FAB (Floating Action Button):** Ícone + para ações principais
- **ProgressBar:** Para metas e financiamentos
- **Chart:** Gráfico de pizza/barras para análise

---

## 5. Fluxos Principais

### Fluxo de Login
1. Usuário abre o app
2. Vê tela de login
3. Insere e-mail e senha
4. Clica "Entrar"
5. App valida credenciais com backend
6. Se OK → Navega para Dashboard
7. Se erro → Exibe mensagem de erro

### Fluxo de Adicionar Transação
1. Usuário clica FAB (+) na tela de Transações
2. Modal abre
3. Usuário preenche: tipo, data, categoria, descrição, valor
4. Clica "Salvar"
5. App envia para backend
6. Se OK → Fecha modal e atualiza lista
7. Se erro → Exibe mensagem de erro

### Fluxo de Exportar Relatório
1. Usuário acessa tela de Relatórios
2. Define filtros (data, tipo, categoria)
3. Clica "Exportar PDF" ou "Exportar CSV"
4. App faz requisição ao backend
5. Backend gera arquivo
6. App recebe arquivo e abre/compartilha
7. Usuário pode salvar ou compartilhar

---

## 6. Considerações de Acessibilidade

- **Tamanho de Toque:** Mínimo 44x44 pt para botões
- **Contraste:** Razão de contraste mínima 4.5:1 para texto
- **Fonte:** Tamanho mínimo 14pt para corpo de texto
- **Ícones:** Sempre com rótulo de texto
- **Feedback:** Haptic feedback em ações principais
- **Atalho F1:** Abre ajuda em qualquer tela

---

## 7. Responsividade

- **Smartphone (320-480px):** Layout single-column
- **Tablet (481-768px):** Layout multi-column onde apropriado
- **Orientação:** Suporta portrait e landscape (com ajustes)

---

## 8. Animações (Subtis)

- **Transição entre telas:** Fade in/out (200ms)
- **Press feedback:** Scale 0.97 (80ms)
- **Haptic:** Light impact em botões primários
- **Carregamento:** Spinner simples

