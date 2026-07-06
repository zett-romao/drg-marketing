# DRG-Marketing — Projeto publicitário da família DRG

Central de **marketing/publicidade** da DR Global. Guarda todas as peças de divulgação
dos produtos DRG num só lugar: landing institucional, landings por produto, artes de
redes sociais, campanhas e material de vendas.

Identidade visual base: design system da `/vendas` do DRG-BuscaNFe
(azul `#152a45` / `#3182ce`, gradiente, cards com ícone, fonte de sistema).

- **Última atualização:** 2026-07-06.
- **🌐 NO AR:** https://zett-romao.github.io/drg-marketing/ (repo `zett-romao/drg-marketing`, GitHub Pages/main).

---

## 📁 Estrutura da pasta
```
DRG-Marketing/
├── index.html                    ← landing institucional (raiz = Pages)
├── BACKLOG.md                    ← este arquivo
├── README.md
├── ABRIR LANDING.bat             ← abre a landing no navegador
└── (futuro) kronos/  juridico/  redes-sociais/  assets/ ...
```
> Landings por produto entram em subpastas (`kronos/`, `juridico/`...).
> Peças de redes sociais/campanhas em `redes-sociais/`, `campanhas/`, `assets/`.

---

## Entregas

### 1. Landing institucional (`landing-institucional/index.html`) — ✅ PRONTA
Página única apresentando os 10 produtos da família DRG, com o Kronos em destaque.

- [x] Visual espelhado da `/vendas` do BuscaNFe (mesmas cores e componentes).
- [x] Estrutura: nav → hero gradiente → faixa de números → produtos (fundo azul) → engenharia → CTA final → footer.
- [x] **Kronos** como carro-chefe: RH ponta a ponta + contabilidade integrada (eSocial, encargos, planilha do contador, LGPD/blockchain).
- [x] Grid dos demais produtos com ícone, descrição e status.
- [x] Links reais dos que estão no ar: BuscaNFe, Check, Sign, Jurídico, Hidro, Kronos, Fit.
- [x] Seção "Engenharia": 6 diferenciais comuns (multi-tenant, blockchain, Asaas, PWA offline, super-admin, alertas omnicanal).
- [x] Responsivo + `prefers-reduced-motion`.

## 🔜 Próximo (curto prazo)
- [x] **Publicar a landing institucional** → GitHub Pages: https://zett-romao.github.io/drg-marketing/ (2026-07-06).
- [x] **Logo DR Systems** (conceito "Código" `</>`, SVG em `assets/mark.svg` + `assets/favicon.svg`) aplicada em nav+footer+favicon das 11 páginas (2026-07-06). Rebrand DR Global → **DR Systems**; família **DR-Systems**.
- [x] **CNPJ real** no rodapé: DR Global Multi Services · CNPJ **49.698.112/0001-57** (obtido do Kronos, 2026-07-06).
- [x] **Nome do produto no topo** do hero das páginas de produto (antes só aparecia o emoji).
- [ ] ⚠️ Conferir razão social: no Kronos o CNPJ 49.698.112/0001-57 está como *"D.R. Global - Gestão de Condomínios, Imóveis, Assessoria Financeira e Administrativa Ltda"*; no site usamos "DR Global Multi Services". Confirmar qual usar.
- [ ] Confirmar status "Em breve" de **Rently, Garantidora, CondoGest** — ligar link quando cada um puder ser divulgado.
- [ ] Revisar rotas de destino (Sign/Jurídico vão pra vendas/signup — confirmar).
- [ ] Canal de **contato** além do e-mail (WhatsApp comercial?).

## 📌 Médio prazo — mais peças (por isso virou "Marketing")
- [x] **Landing dedicada por produto** (10 subpastas) no mesmo visual — geradas por `tools/gen-produtos.mjs` (2026-07-06). Kronos/BuscaNFe/Check/Sign/Jurídico/Hidro/Fit com link real; Rently/Garantidora/CondoGest como "lista de espera".
- [x] **SEO por página**: title, meta description, Open Graph e favicon em cada landing.
- [ ] Revisar textos/claims de cada produto com o dono (gerados a partir da memória).
- [ ] Adicionar **preços/planos** onde já existirem (BuscaNFe, Kronos, Hidro).
- [ ] **Artes para redes sociais** (posts, stories, capa) reaproveitando a identidade DRG.
- [ ] **SEO** em cada página: title, meta description, Open Graph, favicon.
- [ ] **Analytics** de visitas e cliques por produto.
- [ ] Prova social: depoimentos / logos de clientes.
- [ ] Formulário de **captação de leads** (em vez de só `mailto:`).
- [ ] Kit de **campanha** (e-mail marketing, banner, texto padrão).

## 📱 Responsivo + ícone de app — FEITO (2026-07-06)
- [x] Landing e painel `/admin/` responsivos (nav no celular esconde botão secundário; hero/títulos fluidos com clamp; painel em 1 coluna no mobile).
- [x] **Logo na aba do navegador** (favicon SVG + `assets/favicon-32.png`).
- [x] **Ícone de app** (tela inicial do celular): `assets/icon-192.png`, `icon-512.png`, `apple-touch-icon.png` (gerados da logo `</>` via Chrome headless) + `manifest.webmanifest` (name "DR Systems", theme #152a45). Aplicado na home, nas 10 páginas de produto e no admin.

## 🛠️ Painel de edição — FEITO (2026-07-06)
- [x] Cards da home passam a vir de `data/site.json` (fonte única; home renderiza via JS).
- [x] **Painel privado `/admin/`**: login com token do GitHub (fine-grained, Contents R/W no repo `drg-marketing`), edita mostrar/ocultar, ativo/em breve, textos, emoji, ordem (↑↓), destaque e adicionar/remover; botão **Salvar e publicar** grava `data/site.json` via API do GitHub → Pages atualiza sozinho (~1 min). Token fica só no navegador (localStorage).
- [x] Prévia local via `node tools/serve.mjs` (o `ABRIR LANDING.bat` já sobe o servidor) — necessário porque `file://` bloqueia a leitura do JSON.
- [ ] **Falta o dono criar o token** (passo a passo dentro do próprio painel). URL do painel: https://zett-romao.github.io/drg-marketing/admin/
- [ ] Futuro: painel controla os cards da HOME; as páginas de detalhe (`kronos/` etc.) ainda vêm do gerador — avaliar unificar.

## 💡 A decidir
- [ ] **Domínio** oficial: `drglobal.com.br`? `drg.app`? (definir e apontar DNS).
- [ ] Nome/assinatura comercial única para todas as peças.

---

## Notas técnicas
- Todas as páginas são estáticas e autossuficientes (sem CDN/fonte externa) — abrem com duplo clique.
- Cores/estilo padronizados pela `/vendas` do BuscaNFe para manter a identidade da família DRG.
