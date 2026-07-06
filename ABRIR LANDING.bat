@echo off
REM Prévia local do site (mini-servidor Node). Feche esta janela para parar.
cd /d "%~dp0"
start "" http://localhost:8080/
node tools\serve.mjs
