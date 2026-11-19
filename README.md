# DRG-Marketing

Projeto publicitário da família **DRG** (DR Global). Reúne as peças de divulgação dos produtos.

- **`index.html`** — landing institucional (todos os produtos; Kronos em destaque). Servida na raiz do GitHub Pages.
- **`data/site.json`** — fonte única: card, planos e a copy de cada página de produto.
- **`BACKLOG.md`** — plano do projeto e as regras travadas.

Site estático, sem dependências externas. Identidade visual espelha a `/vendas` do DRG-BuscaNFe.

## Atalhos

| O quê | Windows | macOS |
|---|---|---|
| Prévia local (localhost:8080) | `ABRIR LANDING.bat` | `abrir-landing.command` |
| Conferir se todo app tem card | `CONFERIR APPS.bat` | `conferir-apps.command` |
| **Pôr app novo no site sozinho** | `SINCRONIZAR APPS.bat` | `node tools/sincronizar-apps.mjs` |

## O que aparece no site (19/11/2026)

Cada produto tem **um** estado, escolhido no painel `/admin/` num clique — publica na hora:

| Estado | No site |
|---|---|
| 🟢 **No ar** | grupo "No ar · contrate hoje", **sempre antes** dos demais |
| 🟡 **Em breve** | grupo "Em breve", em cinza, depois dos que estão no ar |
| ⚫ **Oculto** | fora da página inicial |

No JSON isso é `visivel:false` (Oculto) ou `status: ativo|embreve`. Dentro de cada grupo
vale a ordem do painel (↑↓ trocam com o vizinho do mesmo grupo).

**App novo entra sozinho:** `tools/sincronizar-apps.mjs` usa a mesma detecção da auditoria
(repos do GitHub + pastas `DRG-*`), cria o card como 🟡 Em breve com a descrição do repo,
gera a página (só com o que vale para todo produto da casa, nada inventado), commita e
publica. O card fica marcado `"auto": true` até alguém escrever a copy de verdade — a
auditoria lista esses casos, sem barrar o push.

Pela linha de comando, em qualquer sistema:

```text
node tools/serve.mjs              # prévia local em http://localhost:8080
node tools/gen-produtos.mjs       # regera as landings a partir do data/site.json
node tools/auditar-produtos.mjs   # confere apps x landing
node tools/novo-produto.mjs <key> "Nome" "🙂" "Categoria" [ativo|embreve] [https://app...]
```

## Codar de outra máquina (PC novo, MacBook)

```text
git clone https://github.com/zett-romao/drg-marketing.git
cd drg-marketing
node tools/auditar-produtos.mjs
```

Só isso. A **trava de publicação** (hook `pre-push` que barra o push quando existe app da
casa sem card na landing) **se instala sozinha** na primeira vez que você roda qualquer
ferramenta do projeto — `core.hooksPath` é configuração local e não vem no clone, então
`tools/_hooks.mjs` a acerta para você.

A auditoria olha **duas fontes**: os **repos da conta no GitHub** (via `gh`, dono lido do
remote `origin`) e as **pastas `DRG-*` do disco**. O GitHub é o que vale em qualquer
máquina — app que nasceu no MacBook e ainda não foi clonado no PC é pego assim. O disco
cobre o contrário: app que ainda nem tem repo.

No disco, ela procura na **pasta-mãe deste repo** (os `DRG-*` são irmãos do
`DRG-Marketing`), além de `C:\Projetos`, `G:\Meu Drive`, `~/Projetos` e
`~/Documents/Projetos`. Se os seus projetos estiverem em outro lugar:

```text
export DRG_RAIZES="$HOME/Dev/DRG"      # macOS/Linux (";" separa no Windows)
node tools/auditar-produtos.mjs --sem-github   # sem rede / sem gh
```

Se nenhuma das duas fontes responder, a auditoria **avisa** que não conseguiu conferir
"app sem card" — e deixa o push passar, em vez de dar um "tudo em dia" falso.

> Landings por produto ficam em subpastas: `kronos/`, `juridico/`, `atende24h/`, etc.
