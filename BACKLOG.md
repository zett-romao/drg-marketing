# DRG-Marketing — Projeto publicitário da família DRG

Central de **marketing/publicidade** da DR Global. Guarda todas as peças de divulgação
dos produtos DRG num só lugar: landing institucional, landings por produto, artes de
redes sociais, campanhas e material de vendas.

Identidade visual base: design system da `/vendas` do DRG-BuscaNFe
(azul `#152a45` / `#3182ce`, gradiente, cards com ícone, fonte de sistema).

- **Última atualização:** 2026-07-09.
- **🌐 NO AR:** https://drsystems.dev.br (domínio próprio + HTTPS; repo `zett-romao/drg-marketing`, GitHub Pages/main).
- **12 produtos** na família (Kronos, BuscaNFe, Check, Sign, Jurídico, Hidro, Fit, Rently, Garantidora, **Liftalk**, **Sind.ia**, CondoGest).

---

## 🔒 REGRAS TRAVADAS (lock 2026-07-06) — só alterar se o dono pedir "DESTRAVAR/ALTERAR"
1. **Identidade visual**: espelha a `/vendas` do DRG-BuscaNFe — azul `#152a45`/`#3182ce`, gradiente, cards com emoji, fonte de sistema. Dono REJEITOU versão painel escuro/técnico.
2. **Marca**: **DR Systems** · logo conceito "Código" `</>` (`assets/mark.svg` branco p/ barra escura + `assets/favicon.svg` + PNGs de app). Família = **DR-Systems**. Logo sempre sobre fundo branco na barra escura.
   - **Logo exclusiva por produto (opcional)**: um produto pode ter logo própria em `assets/<key>.svg`, declarada no gerador via campo `logo:` — substitui o emoji grande do hero e o favicon daquela landing. **Liftalk** é o 1º com logo própria (`assets/liftalk.svg`: elevador + ondas de voz 4G + pictogramas amarelo/verde da NBR 16858). Padrão mantido: tile branco, paleta azul.
3. **Domínio**: **drsystems.dev.br** (registro.br, A na raiz → 185.199.108–111.153; HTTPS enforced; arquivo `CNAME`).
4. **Fonte única de dados**: cards E planos vêm de `data/site.json`. Home e páginas de produto renderizam via JS com **cache-bust** (`?t=Date.now()`). Nunca hardcodar card/plano no HTML.
5. **Painel `/admin/`**: edita cards, planos e a nota; publica gravando `site.json` via API do GitHub (token fine-grained, Contents R/W, só no localStorage). Fluxo de deploy: **`git pull --rebase` ANTES de push** (o painel também commita).
6. **Páginas de produto** geradas por `tools/gen-produtos.mjs` (rodar após mexer no template). Prévia local por `tools/serve.mjs` (`file://` bloqueia o fetch do JSON).
7. **🔒 Rodapé-assinatura DR Systems (marca-mãe) — padrão da FAMÍLIA, em TODOS os apps e landings** (lock 2026-07-09): 3 linhas centralizadas, **grudadas no fundo** (sticky footer: body flex column + rodapé `margin-top:auto`) — nunca flutua no meio:
   - `</> DR Systems`
   - `Software House · Produtos Multi-Tenant · Engenharia Própria` (**Engenharia Própria** com iniciais maiúsculas)
   - `DR Global Multi Services · CNPJ 49.698.112/0001-57 · Todos os direitos reservados`
   - Rollout feito: Marketing (todas as landings), Sind.ia, Check, Sign, Jurídico, Hidro, BuscaNFe, Fit. **Pendente: CondoGest e Kronos.**
8. **🔒 CTAs de contato/interesse → WhatsApp** (lock 2026-07-09): **NUNCA `mailto:`** (não abre sem cliente de e-mail). Todos os botões "Falar com a gente/Tenho interesse/lista de espera" vão para **`https://wa.me/5511997347272`** com mensagem pré-preenchida. Nº oficial: **11 99734-7272**.
9. **Copy travada**: pill "Software House · Produtos Multi-Tenant"; H1 "Exclusiva arquitetura de desenvolvimento dedicado."; **home reescrita SEM traços "—"** (usar vírgulas; "de ponta a ponta" no lugar de "end-to-end"); **ICP-Brasil** (card próprio); Kronos cobre "Todos os padrões de escalas" e "Monitor da LGPD".
10. **Preços** (2026-07-06/09): Kronos 39/79/149/249 · BuscaNFe 0/49/99/199 · Jurídico 0/89/159/219/269 · Check cortesia(3/mês·6m)/49/149/399 · Sign cortesia(3/mês·6m)/47/119/299 · Hidro 79/139/229/Sob consulta **(comodato + instalação grátis + fidelidade 12m)** · **Sind.ia por unidade: 189(≤50)/289(≤100)/379(≤200)/599(≤400)/Sob medida 599+R$1,20/unid · 30 dias grátis** · Garantidora 8%.
11. **🔒 Sind.ia = 12º produto, LANÇADO** (lock 2026-07-09): **NO AR** em `https://sind-ia.onrender.com/` (síndico digital com IA). Landing `/sindia/` com `status:'live'`, logo própria `assets/sindia.svg` (ícone speech-bubble/prédio, tile branco). Preços via `site.json` (lê ao vivo → editar tabela/painel atualiza a landing sozinha).
12. **Commit + push automático** do Claude a cada alteração (preferência do dono).

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
- [x] **DRG-Liftalk adicionado** (2026-07-07) — 11º produto. Logo exclusiva `assets/liftalk.svg`; landing `liftalk/` (status "Em breve", conteúdo da Cartilha: NBR 16858/EN 81‑28, voz via 4G, central 24h, bateria de backup, autoteste); card na home via `site.json`; contador 10→11 produtos / 9→10 setores; gerador ganhou suporte a `logo:` por produto. **Sem planos ainda** (produto em F0; licença por elevador/mês virá na F4). Hífen não-quebrável em "EN 81‑28" p/ não quebrar no card.
- [ ] Revisar textos/claims de cada produto com o dono (gerados a partir da memória).
- [x] **Preços/planos por produto** ✅ (2026-07-06) — seção "Planos" em cada landing, **editável no /admin** (dados em `data/site.json` → `produtos[].planos[]`). Kronos, BuscaNFe, Jurídico, Check, Sign, Hidro e Garantidora com tabelas; Fit/Rently/CondoGest sem planos ainda. Valores: Hidro subiu (79/139/229/Sob consulta) após pesquisa de mercado; Check/Sign com cortesia "3/mês por 6 meses"; Jurídico com os reais do app (89→269). Dono pode adicionar intermediários pelo painel.
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

## 🌐 Domínio próprio — ✅ NO AR (2026-07-06)
- **https://drsystems.dev.br** (registro.br, DNS do registro.br; registro A na raiz → 185.199.108–111.153). HTTPS ligado (cert Let's Encrypt approved, `https_enforced:true`). `CNAME` no repo. github.io/drg-marketing redireciona pro domínio.
- [x] canonical, CNAME, Pages, HTTPS.
- [ ] (Opcional) adicionar os outros 3 IPs A + `www` CNAME no registro.br p/ redundância — hoje só 1 IP, funciona.

## 💡 A decidir
- [ ] Nome/assinatura comercial única para todas as peças.

---

## Notas técnicas
- Todas as páginas são estáticas e autossuficientes (sem CDN/fonte externa) — abrem com duplo clique.
- Cores/estilo padronizados pela `/vendas` do BuscaNFe para manter a identidade da família DRG.
