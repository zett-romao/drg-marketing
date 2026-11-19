// Coloca app novo na landing SOZINHO — sem esperar alguém lembrar do Marketing.
//
// Uso:
//   node tools/sincronizar-apps.mjs             → detecta, cria card, gera página, commit + push
//   node tools/sincronizar-apps.mjs --sem-push  → faz tudo, menos commit/push (para conferir)
//
// Por que existe (19/11/2026, o dono: "nada está sendo atualizado automaticamente, já temos
// vários apps novos e não aparecem"): a auditoria (auditar-produtos.mjs) só BARRAVA o push
// do próprio Marketing. App novo nasce em OUTRO repo; se ninguém mexesse no Marketing, nada
// acontecia. Este script fecha o ciclo: roda agendado (ver SINCRONIZAR APPS.bat) e publica.
//
// O que ele faz com um app novo (repo/pasta DRG-* sem card):
//   • cria o card como 🟡 EM BREVE e visível — o dono passa para 🟢 No ar ou ⚫ Oculto num
//     clique no /admin/;
//   • descrição = a "description" do repo no GitHub (ou o 1º parágrafo do README da pasta);
//   • página gerada SÓ com o que é verdade para todo produto da casa (a fundação comum) +
//     a descrição do repo — nada de dor/benefício inventado. Fica marcado `auto: true`
//     até alguém escrever a copy de verdade.
// O que NÃO é produto de venda continua em NAO_E_PRODUTO, no auditar-produtos.mjs.
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, resolve, delimiter } from 'node:path';

const ROOT = process.cwd();
const SEM_PUSH = process.argv.includes('--sem-push');
const sh = (cmd, args, opts = {}) =>
  execFileSync(cmd, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], ...opts }).trim();
const log = (s) => console.log(s);

// 0) parte da versão publicada: o painel /admin/ também grava o site.json no GitHub.
if (!SEM_PUSH) {
  try { sh('git', ['pull', '--rebase', '--autostash', '-q']); }
  catch (e) { log('⚠ git pull falhou — sigo com a cópia local: ' + (e.stderr || e.message).trim()); }
}

// 1) detecção: a MESMA da auditoria (GitHub + disco, apelidos, NAO_E_PRODUTO).
let det;
try {
  const out = sh(process.execPath, ['tools/auditar-produtos.mjs', '--json']);
  det = JSON.parse(out.split('\n').filter(l => l.startsWith('{')).pop());
} catch (e) {
  log('✗ Não consegui rodar a auditoria: ' + (e.stderr || e.message));
  process.exit(1);
}
if (det.githubNota) log('⚠ ' + det.githubNota);
if (det.cego) { log('⚠ Nenhum repo nem pasta de app encontrado — nada a sincronizar.'); process.exit(0); }

const sitePath = join(ROOT, 'data', 'site.json');
const site = JSON.parse(readFileSync(sitePath, 'utf8'));

let dono = '';
try { dono = (sh('git', ['remote', 'get-url', 'origin']).match(/[:/]([^/]+)\/[^/]+?(?:\.git)?$/) || [])[1] || ''; } catch {}

// Nome de vitrine a partir do nome do repo/pasta: "drg-sender" → "Sender", "DRG-APPCare" → "APPCare".
function nomeVitrine(nomes) {
  const pref = nomes.find(n => /[A-Z]/.test(n.replace(/^drg/i, ''))) || nomes[0];
  const base = pref.replace(/^drg[-_]/i, '').replace(/[-_]+/g, ' ').trim();
  return base.charAt(0).toUpperCase() + base.slice(1);
}

// Descrição: GitHub primeiro; senão o 1º parágrafo de texto do README da pasta.
function descricao(nomes, origens) {
  if (origens.includes('GitHub') && dono) {
    for (const n of nomes) {
      try {
        const d = JSON.parse(sh('gh', ['repo', 'view', `${dono}/${n}`, '--json', 'description'], { timeout: 15000 })).description;
        if (d) return d.replace(/^DRG[-·]\S+\s*[—–-]\s*/i, '').trim();
      } catch {}
    }
  }
  const raizes = process.env.DRG_RAIZES
    ? process.env.DRG_RAIZES.split(delimiter).filter(Boolean)
    : [resolve(ROOT, '..'), 'C:\\Projetos', 'G:\\Meu Drive'];
  for (const r of raizes) for (const n of nomes) {
    const readme = ['README.md', 'readme.md', 'Readme.md'].map(f => join(r, n, f)).find(existsSync);
    if (!readme) continue;
    const par = readFileSync(readme, 'utf8').split(/\r?\n\r?\n/)
      .map(s => s.replace(/\s+/g, ' ').trim())
      .find(s => s && !/^[#>|`!<\-*]/.test(s) && s.length > 30);
    if (par) return par.slice(0, 220);
  }
  return '';
}

const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const hoje = new Date().toISOString().slice(0, 10);
const criados = [];

for (const app of det.semCard) {
  const { key, nomes, origens } = app;
  if (!/^[a-z0-9-]+$/.test(key)) { log(`⚠ ${nomes.join('/')}: key "${key}" inválida para URL — pulei (declarar em APELIDOS).`); continue; }
  const nome = nomeVitrine(nomes);
  const desc = descricao(nomes, origens) || `Novo produto da família DR Systems.`;
  const d = esc(desc);
  site.produtos.push({
    key, marca: 'DRG', nome, emoji: '✨', cat: 'Novo produto',
    destaque: false, visivel: true, status: 'embreve', href: `${key}/`,
    cta: 'Tenho interesse',
    auto: true, autoEm: hoje, autoOrigem: `${nomes.join(' / ')} (${origens.join(' + ')})`,
    desc,
    descPagina: `DRG·${nome}: ${desc}`,
    h1: `DRG·${esc(nome)}, <em>em breve</em>.`,
    sub: d,
    mini: 'Lista de espera aberta · Aviso no lançamento pelo WhatsApp',
    doresT: 'O que ele resolve',
    dores: [d],
    solT: 'Construído sobre a fundação DR Systems',
    sol: [
      'Multi-tenant isolado: o dado de um cliente nunca aparece para outro.',
      'Funciona no navegador e no celular, sem instalar nada.',
      'Painel central de contas, planos e licenças.',
      'Suporte direto com a equipe que desenvolve o sistema.'
    ],
    recT: 'A base que todo produto herda',
    recL: 'Recursos comuns da família DR Systems; os específicos deste produto chegam com o lançamento.',
    rec: [
      { i: '🏢', h: 'Multi-tenant isolado', p: 'Isolamento por conta, com segurança por design em toda rota.' },
      { i: '📴', h: 'PWA', p: 'Abre no navegador e no celular, com cache versionado.' },
      { i: '🛡️', h: 'Licenças centralizadas', p: 'Contas, planos e controle de uso num painel só.' },
      { i: '🔔', h: 'Alertas', p: 'E-mail, WhatsApp e push no celular.' }
    ],
    comoL: 'Como acompanhar o lançamento.',
    passos: [
      { h: 'Entre na lista de espera', p: 'Um clique no botão abre o WhatsApp da DR Systems.' },
      { h: 'Avisamos no lançamento', p: 'Você recebe a novidade antes de abrir para todos.' },
      { h: 'Implantação acompanhada', p: 'A equipe que desenvolveu o sistema acompanha o início.' }
    ],
    finalH: `Quer ser avisado quando o DRG·${esc(nome)} abrir?`,
    finalP: 'Entre na lista de espera e fale direto com a equipe.',
    planos: []
  });
  criados.push(`${nome} (${key})`);
  log(`✓ card criado: DRG·${nome} → 🟡 Em breve — "${desc}"`);
}

if (criados.length) writeFileSync(sitePath, JSON.stringify(site, null, 2) + '\n', 'utf8');

// 2) sempre regera as páginas: cobre também o card criado à mão no /admin/ sem página.
sh(process.execPath, ['tools/gen-produtos.mjs']);

const mudou = sh('git', ['status', '--porcelain']).length > 0;
if (!mudou) { log('✅ Landing em dia: nenhum app novo.'); process.exit(0); }
if (SEM_PUSH) { log('ℹ --sem-push: alterações ficaram só no disco.'); process.exit(0); }

// 3) publica. Só o que este script mexe; nada mais do working tree entra no commit.
try {
  sh('git', ['add', 'data/site.json', 'index.html', ...criados.map(c => c.match(/\((.+)\)$/)[1])]);
  for (const k of site.produtos.map(p => p.key)) if (existsSync(join(ROOT, k))) sh('git', ['add', k]);
  const msg = criados.length
    ? `Apps novos na landing (automático): ${criados.join(', ')} — entram como Em breve`
    : 'Landing: páginas regeradas (automático)';
  sh('git', ['commit', '-q', '-m', msg + '\n\nGerado por tools/sincronizar-apps.mjs']);
  sh('git', ['push', '-q'], { timeout: 120000 });
  log('🚀 Publicado: ' + msg + '. O site atualiza em cerca de 1 minuto.');
} catch (e) {
  log('✗ Não publiquei: ' + ((e.stderr || '') + (e.stdout || '') || e.message).trim());
  process.exit(1);
}
