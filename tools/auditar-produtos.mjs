// Confere se a landing está em dia com os apps que a casa realmente tem.
//
// Uso:
//   node tools/auditar-produtos.mjs               → relatório; sai 1 se houver pendência
//   node tools/auditar-produtos.mjs --aviso       → só avisa; sai sempre 0
//   node tools/auditar-produtos.mjs --sem-github  → não consulta o GitHub (offline)
//
// Por que existe: o site.json já é fonte única de card/planos/copy, mas ninguém conferia
// se NASCEU APP NOVO. O DRG-Atende24h subiu em 30/07/2026 e entrou na landing só quando o
// dono reclamou. Roda no pre-push (.githooks/pre-push) e barra a publicação.
//
// 🔴 DUAS FONTES, de propósito:
//   1. REPOS DA CONTA no GitHub (`gh repo list`) — a fonte que vale em qualquer máquina.
//   2. Pastas do disco — pega o app que ainda nem tem repo.
// Só o disco não bastava: o Atende24h NASCEU NO MACBOOK, então uma auditoria rodando no
// PC não veria pasta nenhuma e diria "em dia" — justamente o que ela existe para evitar.
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, resolve, delimiter } from 'node:path';
import { homedir } from 'node:os';
import { garantirHooks } from './_hooks.mjs';

const ROOT = process.cwd();
const AVISO = process.argv.includes('--aviso');
const SEM_GITHUB = process.argv.includes('--sem-github') || process.env.DRG_SEM_GITHUB === '1';

garantirHooks();

// Onde os apps da casa moram no disco. Pastas inexistentes são ignoradas em silêncio.
// A raiz que sempre vale é a PASTA-MÃE desta aqui: os DRG-* são irmãos do DRG-Marketing
// em qualquer máquina (C:\Projetos no PC, ~/Projetos ou ~/Dev no MacBook).
// Layout fora do padrão: DRG_RAIZES="/caminho/um:/caminho/dois" (";" separa no Windows)
// — quando definida, essa variável SUBSTITUI a lista padrão.
const RAIZES = (process.env.DRG_RAIZES
  ? process.env.DRG_RAIZES.split(delimiter).filter(Boolean)
  : [
      resolve(ROOT, '..'),
      'C:\\Projetos',
      'G:\\Meu Drive',
      join(homedir(), 'Projetos'),
      join(homedir(), 'Documents', 'Projetos')
    ]
).filter((v, i, a) => a.indexOf(v) === i);

// Nome (de pasta ou de repo) → key do produto no site.json, quando não batem.
const APELIDOS = {
  'dr_global_git': 'kronos',   // pasta do Kronos no PC
  'drg-sistema': 'kronos',     // nome do repo do Kronos no GitHub
  'drg-sindico': 'sindia'      // o produto se chama Sind.ia
};

// O que NÃO é produto de prateleira — não deve virar card. A chave é a key derivada,
// então vale tanto para pasta quanto para repo. Mexer aqui é decisão comercial.
const NAO_E_PRODUTO = {
  'marketing': 'é a própria landing',
  'platform': 'núcleo interno de arquitetura, não é produto de cliente',
  'padrao-drg': 'padrões internos',
  'garantidora_antigo_nao_usar': 'pasta aposentada',
  'rently_antigo': 'pasta aposentada'
};

const site = JSON.parse(readFileSync(join(ROOT, 'data', 'site.json'), 'utf8'));
const produtos = site.produtos || [];
const porKey = new Map(produtos.map(p => [p.key, p]));

const keyDe = (nome) => {
  const n = nome.toLowerCase();
  return APELIDOS[n] || n.replace(/^drg[-_]/, '');
};

// ---- 1. fonte A: repos da conta no GitHub ----
// O dono da conta sai do remote `origin`, então isto funciona em qualquer clone.
const repos = [];
let githubNota = '';
if (SEM_GITHUB) {
  githubNota = 'GitHub não consultado (--sem-github).';
} else {
  try {
    const url = execFileSync('git', ['remote', 'get-url', 'origin'],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    const dono = (url.match(/[:/]([^/]+)\/[^/]+?(?:\.git)?$/) || [])[1];
    if (!dono) throw new Error('remote sem dono');
    const json = execFileSync('gh', ['repo', 'list', dono, '--limit', '200', '--json', 'name'],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], timeout: 20000 });
    for (const r of JSON.parse(json)) {
      if (/^(drg[-_]|dr_global)/i.test(r.name)) repos.push(r.name);
    }
  } catch {
    githubNota = 'Não consegui listar os repos (gh ausente, sem login ou sem rede). ' +
                 'A conferência valeu só pelo disco desta máquina.';
  }
}

// ---- 2. fonte B: pastas do disco ----
const vistas = new Set();
const pastas = [];
for (const raiz of RAIZES) {
  if (!existsSync(raiz)) continue;
  let itens = [];
  try { itens = readdirSync(raiz); } catch { continue; }
  for (const nome of itens) {
    if (!/^(drg[-_]|dr_global)/i.test(nome)) continue;
    if (vistas.has(nome.toLowerCase())) continue; // mesma pasta vista por duas raízes
    try { if (!statSync(join(raiz, nome)).isDirectory()) continue; } catch { continue; }
    vistas.add(nome.toLowerCase());
    pastas.push(nome);
  }
}

// ---- 3. junta as duas fontes: key → de onde ela veio ----
const apps = new Map();
const anota = (nome, origem) => {
  const key = keyDe(nome);
  if (NAO_E_PRODUTO[key]) return;
  if (!apps.has(key)) apps.set(key, { nomes: new Set(), origens: new Set() });
  apps.get(key).nomes.add(nome);
  apps.get(key).origens.add(origem);
};
for (const r of repos) anota(r, 'GitHub');
for (const p of pastas) anota(p, 'disco');

// ---- 4. cruza com o site.json ----
const semCard = [...apps.entries()].filter(([key]) => !porKey.has(key));
const semPasta = produtos.filter(p => !existsSync(join(ROOT, p.key, 'index.html'))).map(p => p.key);
const semCopy = produtos.filter(p => !p.h1).map(p => p.key);
const comTodo = produtos.filter(p => JSON.stringify(p).includes('TODO')).map(p => p.key);
const ocultos = produtos.filter(p => p.visivel === false).map(p => p.key);

// ---- 5. relatório ----
const linha = (s) => console.log(s);
linha('');
linha(`📋 Auditoria da landing — ${produtos.length} produtos no site.json ` +
      `(${produtos.filter(p => p.visivel !== false).length} visíveis) · ` +
      `${repos.length} repos na conta · ${pastas.length} pastas no disco.`);
linha('');

let pendencias = 0;

if (semCard.length) {
  pendencias += semCard.length;
  linha('🔴 APP SEM CARD NA LANDING:');
  for (const [key, info] of semCard) {
    linha(`   • ${[...info.nomes].join(' / ')}  (${[...info.origens].join(' + ')})  →  sem produto "${key}" no site.json`);
    linha(`     criar:  node tools/novo-produto.mjs ${key} "Nome" "🙂" "Categoria" [ativo|embreve] [https://app...]`);
    linha(`     ou, se não for produto de venda, declarar "${key}" em NAO_E_PRODUTO neste arquivo.`);
  }
  linha('');
}

if (semPasta.length) {
  pendencias += semPasta.length;
  linha('🔴 CARD SEM PÁGINA GERADA: ' + semPasta.join(', '));
  linha('   rodar: node tools/gen-produtos.mjs');
  linha('');
}

if (semCopy.length) {
  pendencias += semCopy.length;
  linha('🔴 CARD SEM COPY DE PÁGINA (a landing não é gerada): ' + semCopy.join(', '));
  linha('   preencher h1/sub/dores/sol/rec/passos no /admin ou no data/site.json.');
  linha('');
}

if (comTodo.length) {
  pendencias += comTodo.length;
  linha('🔴 COPY AINDA COM "TODO" (sai no ar assim): ' + comTodo.join(', '));
  linha('');
}

if (ocultos.length) {
  linha('⚪ Fora da home de propósito (visivel:false): ' + ocultos.join(', '));
  linha('');
}

// Nenhuma das duas fontes respondeu: a metade "app sem card" simplesmente não rodou.
// Dizer "em dia" aqui seria mentira — avisa e deixa o push passar.
const cego = !repos.length && !pastas.length;
if (githubNota) { linha('⚠ ' + githubNota); linha(''); }
if (cego) {
  linha('⚠ Não encontrei repo nem pasta de app. A conferência de "app sem card" NÃO rodou.');
  linha('   Raízes procuradas no disco:');
  for (const r of RAIZES) linha(`     ${r}`);
  linha('   Apps em outro lugar: DRG_RAIZES="/caminho/dos/projetos" (";" separa no Windows).');
  linha('');
}

if (!pendencias) {
  linha(cego
    ? '✅ Cards e páginas conferem entre si (sem a varredura de apps, ver aviso acima).'
    : '✅ Landing em dia: todo app da casa tem card, e todo card tem página.');
  linha('');
  process.exit(0);
}

linha(`${pendencias} pendência(s).`);
linha('');
process.exit(AVISO ? 0 : 1);
