@echo off
chcp 65001 >nul
cls
echo ╔════════════════════════════════════════════════════════════╗
echo ║                                                            ║
echo ║          🚀 QUICK FINANCE - INICIALIZAÇÃO COMPLETA         ║
echo ║                                                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM ============================================
REM   VERIFICAÇÃO DE PRÉ-REQUISITOS
REM ============================================

echo [1/5] 🔍 Verificando pré-requisitos...
echo.

REM Verificar Java
echo ► Verificando Java...
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo    ❌ Java não encontrado!
    echo    📥 Instale Java 17+: https://adoptium.net/
    echo.
    pause
    exit /b 1
)
for /f "tokens=3" %%g in ('java -version 2^>^&1 ^| findstr /i "version"') do (
    set JAVA_VERSION=%%g
)
echo    ✅ Java encontrado: %JAVA_VERSION%

REM Verificar JDK (javac)
echo ► Verificando JDK (javac)...
javac -version >nul 2>&1
if %errorlevel% neq 0 (
    echo    ❌ JDK não encontrado! Apenas JRE detectado.
    echo    📥 Instale JDK 17+: https://adoptium.net/
    echo.
    pause
    exit /b 1
)
for /f "tokens=3" %%g in ('javac -version 2^>^&1 ^| findstr /i "javac"') do (
    set JAVAC_VERSION=%%g
)
echo    ✅ JDK encontrado: %JAVAC_VERSION%

REM Verificar Node.js
echo ► Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo    ❌ Node.js não encontrado!
    echo    📥 Instale Node.js 18+: https://nodejs.org/
    echo.
    pause
    exit /b 1
)
for /f %%i in ('node --version') do set NODE_VERSION=%%i
echo    ✅ Node.js encontrado: %NODE_VERSION%

REM Verificar npm
echo ► Verificando npm...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo    ❌ npm não encontrado!
    echo.
    pause
    exit /b 1
)
for /f %%i in ('npm --version') do set NPM_VERSION=%%i
echo    ✅ npm encontrado: v%NPM_VERSION%

echo.
echo ════════════════════════════════════════════════════════════
echo.

REM ============================================
REM   CONFIGURAÇÃO DO BANCO DE DADOS
REM ============================================

echo [2/5] 🗄️  Configurando banco de dados...
echo.

REM Verificar PostgreSQL
where psql >nul 2>&1
if %errorlevel% equ 0 (
    echo ► PostgreSQL encontrado!
    echo.
    echo    Deseja configurar PostgreSQL agora?
    echo    [1] Sim - Configurar PostgreSQL
    echo    [2] Não - Usar H2 (banco em memória)
    echo.
    choice /c 12 /n /m "    Escolha (1 ou 2): "
    
    if errorlevel 2 (
        echo.
        echo    ℹ️  Usando H2 Database (banco em memória)
        echo    ℹ️  Console H2 disponível em: http://localhost:8080/h2-console
        echo.
    ) else (
        echo.
        echo    🔧 Executando configuração do PostgreSQL...
        call configurar-postgresql.bat
        if %errorlevel% neq 0 (
            echo.
            echo    ⚠️  Erro na configuração do PostgreSQL
            echo    ℹ️  Continuando com H2 Database...
            echo.
        )
    )
) else (
    echo ► PostgreSQL não encontrado
    echo    ℹ️  Usando H2 Database (banco em memória)
    echo    ℹ️  Para usar PostgreSQL, instale: https://www.postgresql.org/download/
    echo.
)

echo ════════════════════════════════════════════════════════════
echo.

REM ============================================
REM   INSTALAÇÃO DE DEPENDÊNCIAS
REM ============================================

echo [3/5] 📦 Instalando dependências...
echo.

REM Backend - Maven
echo ► Verificando dependências do Backend (Maven)...
cd qfin-backend\qfin-backend
if exist "target" (
    echo    ℹ️  Projeto já compilado anteriormente
) else (
    echo    🔄 Primeira compilação - isso pode levar alguns minutos...
)
echo.

REM Frontend - npm
echo ► Instalando dependências do Frontend (npm)...
cd ..\..\qfin-frontend
if exist "node_modules" (
    echo    ✅ Dependências já instaladas
) else (
    echo    🔄 Instalando pacotes npm...
    call npm install --silent
    if %errorlevel% equ 0 (
        echo    ✅ Dependências instaladas com sucesso!
    ) else (
        echo    ❌ Erro ao instalar dependências
        cd ..
        pause
        exit /b 1
    )
)
cd ..

echo.
echo ════════════════════════════════════════════════════════════
echo.

REM ============================================
REM   COMPILAÇÃO DO BACKEND
REM ============================================

echo [4/5] 🔨 Compilando Backend...
echo.

cd qfin-backend\qfin-backend
echo ► Compilando projeto Spring Boot...
call mvnw.cmd clean package -DskipTests -q
if %errorlevel% equ 0 (
    echo    ✅ Backend compilado com sucesso!
) else (
    echo    ❌ Erro na compilação do backend
    cd ..\..
    pause
    exit /b 1
)
cd ..\..

echo.
echo ════════════════════════════════════════════════════════════
echo.

REM ============================================
REM   RESUMO E INSTRUÇÕES
REM ============================================

echo [5/5] ✅ Inicialização concluída!
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                    🎉 TUDO PRONTO!                         ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 📋 PRÓXIMOS PASSOS:
echo.
echo    1️⃣  Iniciar o Backend:
echo       Execute: iniciar-backend.bat
echo       URL: http://localhost:8080
echo.
echo    2️⃣  Iniciar o Frontend (em outro terminal):
echo       Execute: iniciar-frontend.bat
echo       URL: http://localhost:5173
echo.
echo ════════════════════════════════════════════════════════════
echo.
echo 📚 DOCUMENTAÇÃO:
echo    • GUIA-INICIALIZACAO.md - Guia completo de inicialização
echo    • README-POSTGRESQL.md - Configuração PostgreSQL
echo    • GUIA-DE-TESTES.md - Como testar a aplicação
echo.
echo ════════════════════════════════════════════════════════════
echo.
echo 🔑 CREDENCIAIS PADRÃO (PostgreSQL):
echo    Banco: qfindb
echo    Usuário: qfinuser
echo    Senha: qfinpass123
echo.
echo ════════════════════════════════════════════════════════════
echo.

REM Perguntar se deseja iniciar os servidores
echo Deseja iniciar os servidores agora?
echo [1] Sim - Iniciar Backend e Frontend
echo [2] Não - Iniciar manualmente depois
echo.
choice /c 12 /n /m "Escolha (1 ou 2): "

if errorlevel 2 (
    echo.
    echo ℹ️  Execute os scripts quando estiver pronto:
    echo    - iniciar-backend.bat
    echo    - iniciar-frontend.bat
    echo.
    pause
    exit /b 0
)

echo.
echo ════════════════════════════════════════════════════════════
echo.
echo 🚀 Iniciando servidores...
echo.
echo ⚠️  IMPORTANTE:
echo    • O Backend será iniciado nesta janela
echo    • Uma nova janela será aberta para o Frontend
echo    • Mantenha ambas as janelas abertas
echo.
pause

REM Iniciar Frontend em nova janela
start "Quick Finance - Frontend" cmd /k "cd qfin-frontend && npm run dev"

REM Aguardar um pouco
timeout /t 3 /nobreak >nul

REM Iniciar Backend nesta janela
echo.
echo ════════════════════════════════════════════════════════════
echo   BACKEND INICIANDO...
echo ════════════════════════════════════════════════════════════
echo.
cd qfin-backend\qfin-backend
call mvnw.cmd spring-boot:run
