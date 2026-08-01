#!/bin/sh
# macOS: duplo clique no Finder. Equivale ao "ABRIR LANDING.bat" do Windows.
# Feche esta janela para parar o servidor.
cd "$(dirname "$0")" || exit 1
open http://localhost:8080/
node tools/serve.mjs
