// Confere se a landing está em dia com os apps que existem de verdade na máquina.
//
// Uso:
//   node tools/auditar-produtos.mjs          → relatório; sai 1 se houver pendência
//   node tools/auditar-produtos.mjs --aviso  → só avisa; sai sempre 0
//
// Por que existe: o site.json já é fonte única de card/planos/copy, mas ninguém conferia
// se NASCEU APP NOVO. O DRG-Atende24h subiu em 30/07/2026 e entrou na landing só quando o
// dono reclamou. Isto roda no pre-push (.githooks/pre-push) e barra a publicação.
//
// A varredura lê o disco local (C:\Projetos), por isso não roda no GitHub Pages.
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, resolve, delimiter } from 'node:path';
import { homedir } from 'node:os';
import { garantirHooks } from './_hooks.mjs';

const ROOT = process.cwd();
const AVISO = process.argv.includes('--aviso');

garantirHooks();

// Onde os apps da casa moram. Pastas que não existirem são ignoradas em silêncio.
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

// Pasta do disco → key do produto no site.json, quando os nomes não batem.
const APELIDOS = {
  'DR_Global_Git': 'kronos',
  'DRG-Sindico': 'sindia',
  'drg-garantidora': 'garantidora',
  'DRG-Atende24h': 'atende24h'
};

// Pastas que NÃO são produto de prateleira — não devem virar card.
// Mexer aqui é decisão comercial: só entra na lista o que o dono decidiu não vender.
const NAO_E_PRODUTO = {
  'DRG-Marketing': 'é a própria landing',
  'DRG-Platform': 'núcleo interno de arquitetura, não é produto de cliente',
  '_padrao-drg': 'padrões internos',
  'DRG-Garantidora_ANTIGO_NAO_USAR': 'pasta aposentada',
  'DRG-Rently_ANTIGO': 'pasta aposentada'
};

const site = JSON.parse(readFileSync(join(ROOT, 'data', 'site.json'), 'utf8'));
const produtos = site.produtos || [];
const porKey = new Map(produtos.map(p => [p.key, p]));

// ---- 1. varre o disco atrás de pastas de app ----
const vistas = new Set();
const pastas = [];
for (const raiz of RAIZES) {
  if (!existsSync(raiz)) continue;
  let itens = [];
  try { itens = readdirSync(raiz); } catch { continue; }
  for (const nome of itens) {
    if (!/^(drg[-_]|dr_global)/i.test(nome)) continue;
    if (vistas.has(nome.toLowerCase())) continue; // mesma pasta vista por duas raízes
    const caminho = join(raiz, nome);
    try { if (!statSync(caminho).isDirectory()) continue; } catch { continue; }
    vistas.add(nome.toLowerCase());
    pastas.push({ nome, caminho });
  }
}

const keyDaPasta = (nome) =>
  APELIDOS[nome] || nome.replace(/^drg[-_]/i, '').toLowerCase();

// ---- 2. cruza os dois lados ----
const semCard = [];      // app existe no disco, não existe card
const semPasta = [];     // card existe, pasta da landing não foi gerada
const semCopy = [];      // card sem copy de página (a landing sairia vazia)
const ocultos = [];      // no site.json mas fora da home (visivel:false)

for (const { nome } of pastas) {
  if (NAO_E_PRODUTO[nome]) continue;
  const key = keyDaPasta(nome);
  if (!porKey.has(key)) semCard.push({ nome, key });
}

for (const p of produtos) {
  if (!existsSync(join(ROOT, p.key, 'index.html'))) semPasta.push(p.key);
  if (!p.h1) semCopy.push(p.key);
  if (p.visivel === false) ocultos.push(p.key);
}

// ---- 3. relatório ----
const linha = (s) => console.log(s);
linha('');
linha(`📋 Auditoria da landing — ${produtos.length} produtos no site.json, ` +
      `${produtos.filter(p => p.visivel !== false).length} visíveis, ` +
      `${pastas.length} pastas de app no disco.`);
linha('');

let pendencias = 0;

if (semCard.length) {
  pendencias += semCard.length;
  linha('🔴 APP SEM CARD NA LANDING:');
  for (const { nome, key } of semCard) {
    linha(`   • ${nome}  →  não existe produto "${key}" no site.json`);
    linha(`     criar:  node tools/novo-produto.mjs ${key} "Nome" "🙂" "Categoria" [ativo|embreve] [https://app...]`);
    linha(`     ou, se não for produto de venda, declarar em NAO_E_PRODUTO neste arquivo.`);
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

// Copy com marcador TODO do scaffold: publicar assim expõe "TODO" na página.
const comTodo = produtos.filter(p => JSON.stringify(p).includes('TODO')).map(p => p.key);
if (comTodo.length) {
  pendencias += comTodo.length;
  linha('🔴 COPY AINDA COM "TODO" (sai no ar assim): ' + comTodo.join(', '));
  linha('');
}

if (ocultos.length) {
  linha('⚪ Fora da home de propósito (visivel:false): ' + ocultos.join(', '));
  linha('');
}

// Máquina sem os outros repos clonados (ex.: MacBook recém-configurado): a metade
// "app sem card" da auditoria não tem como rodar. Dizer "em dia" aqui seria mentira —
// o push segue liberado, mas com o aviso na cara.
if (!pastas.length) {
  linha('⚠ Não encontrei nenhuma pasta DRG-* nas raízes procuradas:');
  for (const r of RAIZES) linha(`   ${r}`);
  linha('   A conferência de "app sem card" NÃO rodou nesta máquina.');
  linha('   Se os apps estão em outro lugar: DRG_RAIZES="/caminho/dos/projetos" (";" separa no Windows).');
  linha('');
}

if (!pendencias) {
  linha(pastas.length
    ? '✅ Landing em dia: todo app do disco tem card, e todo card tem página.'
    : '✅ Cards e páginas conferem entre si (sem a varredura de apps, ver aviso acima).');
  linha('');
  process.exit(0);
}

linha(`${pendencias} pendência(s).`);
linha('');
process.exit(AVISO ? 0 : 1);
