// Scaffold de um produto novo na landing — UM comando.
// Uso:
//   node tools/novo-produto.mjs <key> "Nome" "🙂" "Categoria" [ativo|embreve] [https://app...]
// Exemplo:
//   node tools/novo-produto.mjs radar "Radar" "📡" "Monitoramento" embreve
//
// O que faz:
//   1. Adiciona o produto ao data/site.json (fonte única: card + página + planos).
//      Campos de copy entram como "TODO ..." para você preencher no /admin ou no JSON.
//   2. Regenera as páginas (chama gen-produtos.mjs).
//   3. Imprime o próximo passo do Google Drive (pasta do produto + subpasta "Docs").
//
// Depois é só: preencher a copy no /admin (ou no site.json) e dar commit/push.
import { readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

const [key, nome, emoji, cat, statusArg, app] = process.argv.slice(2);

if (!key || !nome || !emoji || !cat) {
  console.error('Uso: node tools/novo-produto.mjs <key> "Nome" "🙂" "Categoria" [ativo|embreve] [https://app...]');
  process.exit(1);
}
if (!/^[a-z0-9-]+$/.test(key)) {
  console.error(`✗ key inválida: "${key}" (use só letras minúsculas, números e hífen).`);
  process.exit(1);
}

const status = statusArg === 'ativo' ? 'ativo' : 'embreve';
const site = JSON.parse(readFileSync('data/site.json', 'utf8'));

if (site.produtos.some(p => p.key === key)) {
  console.error(`✗ já existe um produto com key "${key}" no site.json.`);
  process.exit(1);
}

const T = 'TODO'; // marcadores para você preencher depois
const novo = {
  key, marca: 'DRG', nome, emoji, cat,
  destaque: false, visivel: true, status, href: `${key}/`,
  cta: status === 'ativo' ? 'Acessar' : 'Tenho interesse',
  ...(status === 'ativo' && app ? { app } : {}),
  desc: `${T}: descrição curta do card (1 frase).`,
  descPagina: `${T}: descrição de SEO (meta) da página, um pouco mais completa.`,
  h1: `${T}: título com <em>destaque</em>.`,
  sub: `${T}: subtítulo do hero explicando o produto.`,
  mini: `${T} · ${T} · ${T}`,
  doresT: `${T}: título do bloco de dores`,
  dores: [`${T}`, `${T}`, `${T}`, `${T}`],
  solT: `${T}: título do bloco de solução`,
  sol: [`${T}`, `${T}`, `${T}`, `${T}`],
  recT: `${T}: título dos recursos`,
  recL: `${T}: linha de apoio dos recursos.`,
  rec: Array.from({ length: 6 }, () => ({ i: '⬜', h: `${T}`, p: `${T}` })),
  comoL: `${T}: linha de apoio do "como funciona".`,
  passos: Array.from({ length: 3 }, () => ({ h: `${T}`, p: `${T}` })),
  finalH: `${T}: chamada final.`,
  finalP: `${T}: frase final de apoio.`,
  planos: []
};

site.produtos.push(novo);
writeFileSync('data/site.json', JSON.stringify(site, null, 2) + '\n', 'utf8');
console.log(`✓ "${nome}" (${key}) adicionado ao site.json como "${status}".`);

// Regenera as páginas a partir da fonte única.
execSync('node tools/gen-produtos.mjs', { stdio: 'inherit' });

console.log(`
──────────────────────────────────────────────
PRÓXIMOS PASSOS para "${nome}":

1) COPY — preencha os campos "TODO" em uma destas vias:
   • painel:  https://drsystems.dev.br/admin/   (edita card e planos)
   • arquivo: data/site.json  → produto "${key}"  (copy completa da página)
   Depois rode:  node tools/gen-produtos.mjs

2) DRIVE — crie a pasta do produto e a subpasta "Docs":
   • Peça ao Claude:  "cria a pasta do ${nome} e a subpasta Docs no Drive e liga no /admin"
     (o Claude cria em 'DR Systems — Marcas', pega os IDs e grava no admin/index.html)
   • Ou manualmente: crie a pasta "${nome}" em 'DR Systems — Marcas', uma subpasta
     "Docs" dentro, e adicione os IDs em MARCA_DRIVE e MARCA_DOCS no admin/index.html.

3) LOGO (opcional): coloque assets/${key}.svg e declare "logo":"${key}.svg" no site.json.

4) Commit + push  →  deploy automático (GitHub Pages).
──────────────────────────────────────────────`);
