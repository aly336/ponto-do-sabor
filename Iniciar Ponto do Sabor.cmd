@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Instale o Node.js 22 ou superior para usar a previa local.
  pause
  exit /b 1
)
echo Abra http://localhost:5173 no navegador.
node server.mjs
