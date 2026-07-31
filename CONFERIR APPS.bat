@echo off
chcp 65001 >nul
title DR Systems - Conferir apps x landing
cd /d "%~dp0"
echo.
echo  Conferindo se todo app da casa esta na landing...
echo.
node tools\auditar-produtos.mjs
echo.
pause
