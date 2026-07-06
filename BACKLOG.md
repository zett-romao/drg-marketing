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
- [ ] **CNPJ real** — hoje está o placeholder `00.000.000/0001-00` no rodapé (razão social: DR Global Multi Services). ➜ AGUARDANDO o número real do dono.
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

## 💡 A decidir
- [ ] **Domínio** oficial: `drglobal.com.br`? `drg.app`? (definir e apontar DNS).
- [ ] Nome/assinatura comercial única para todas as peças.

---

## Notas técnicas
- Todas as páginas são estáticas e autossuficientes (sem CDN/fonte externa) — abrem com duplo clique.
- Cores/estilo padronizados pela `/vendas` do BuscaNFe para manter a identidade da família DRG.
