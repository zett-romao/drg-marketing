@echo off
chcp 65001 >nul
title DR Systems - Conferir apps x landing
cd /d "%~dp0"
REM A trava de push se instala sozinha: tools/_hooks.mjs roda dentro da auditoria.
echo.
echo  Conferindo se todo app da casa esta na landing...
echo.
node tools\auditar-produtos.mjs
echo.
pause
