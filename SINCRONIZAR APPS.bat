@echo off
chcp 65001 >nul
title DR Systems - Sincronizar apps com a landing
cd /d "%~dp0"
REM Acha app novo (GitHub + disco), cria o card como Em breve, gera a pagina e publica.
REM Com o argumento "agendado" (tarefa do Windows) grava log e nao pausa.
if "%1"=="agendado" (
  echo ==== %date% %time% >> "%TEMP%\drg-marketing-sincronizar.log"
  node tools\sincronizar-apps.mjs >> "%TEMP%\drg-marketing-sincronizar.log" 2>&1
  exit /b
)
echo.
node tools\sincronizar-apps.mjs
echo.
pause
