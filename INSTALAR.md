# Atualização — Ajuda & Suporte (F1)

## Arquivos para copiar no seu projeto:

### 1. Novo arquivo:
app/(tabs)/help.tsx  →  coloque em:  app\(tabs)\help.tsx

### 2. Arquivo atualizado:
app/(tabs)/_layout.tsx  →  substitua:  app\(tabs)\_layout.tsx

## Como instalar:

No PowerShell, dentro da pasta do projeto:

```powershell
# Copie o help.tsx novo
Copy-Item "C:\Downloads\qfin-help-update\app\(tabs)\help.tsx" "app\(tabs)\help.tsx" -Force

# Substitua o _layout.tsx
Copy-Item "C:\Downloads\qfin-help-update\app\(tabs)\_layout.tsx" "app\(tabs)\_layout.tsx" -Force
```

Depois reinicie o Expo:
```powershell
npx expo start --clear
```

## O que foi adicionado:
- Aba "Ajuda" com ícone ? na barra inferior
- Atalho F1 para abrir ajuda (no browser)
- Manual completo com 9 seções e FAQ
- Dicas de uso, atalhos de teclado e gestos
- Página de suporte com informações do app
