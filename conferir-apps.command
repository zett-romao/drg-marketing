#!/bin/sh
# macOS: duplo clique no Finder. Equivale ao "CONFERIR APPS.bat" do Windows.
# A trava de push se instala sozinha (tools/_hooks.mjs roda dentro da auditoria).
cd "$(dirname "$0")" || exit 1
echo
echo " Conferindo se todo app da casa esta na landing..."
echo
node tools/auditar-produtos.mjs
echo
echo "Pressione Enter para fechar."
read -r _
