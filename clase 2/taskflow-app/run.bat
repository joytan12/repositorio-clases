@echo off
chcp 65001 >nul
echo ============================================================
echo   🚀 Iniciando TaskFlow Fullstack (Docker + PostgreSQL)
echo ============================================================
echo.

docker info >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [!] El motor de Docker no parece estar iniciado.
    echo [*] Iniciando Docker Desktop, por favor espera unos segundos...
    start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    echo [*] Esperando a que el servicio de Docker responda...
    :wait_docker
    timeout /t 5 /nobreak >nul
    docker info >nul 2>&1
    if %ERRORLEVEL% NEQ 0 (
        echo     Aun esperando a Docker Desktop...
        goto wait_docker
    )
    echo [OK] Docker Desktop esta listo!
)

echo [*] Construyendo y levantando contenedores con Docker Compose...
docker compose up --build -d

echo.
echo ============================================================
echo   ✨ TaskFlow esta en ejecucion!
echo ============================================================
echo   🌐 Frontend Dashboard : http://localhost:3000
echo   🔌 Backend API REST    : http://localhost:5000
echo   📊 API Health Check   : http://localhost:5000/api/health
echo   🗄️ PostgreSQL Port    : localhost:5432
echo ============================================================
echo.
pause
