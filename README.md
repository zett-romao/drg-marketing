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

A auditoria procura as pastas dos apps na **pasta-mãe deste repo** (os `DRG-*` são irmãos
do `DRG-Marketing`), além de `C:\Projetos`, `G:\Meu Drive`, `~/Projetos` e
`~/Documents/Projetos`. Se os seus projetos estiverem em outro lugar:

```text
export DRG_RAIZES="$HOME/Dev/DRG"      # macOS/Linux (";" separa no Windows)
```

Numa máquina onde só este repo está clonado, a auditoria **avisa** que não conseguiu
conferir "app sem card" — e deixa o push passar, em vez de dar um "tudo em dia" falso.

> Landings por produto ficam em subpastas: `kronos/`, `juridico/`, `atende24h/`, etc.
