// Preço da landing sai do MESMO lugar onde o sistema cobra — nunca de cópia manual.
//
// Uso:
//   node tools/sincronizar-precos.mjs             → atualiza data/site.json com os preços do app
//   node tools/sincronizar-precos.mjs --conferir  → só confere; sai 1 se defasado (é o portão do pre-push)
//   node tools/sincronizar-precos.mjs --offline   → não consulta a rede; sai 0 (máquina sem internet)
//
// 🔴 POR QUE EXISTE: o preço vivia em DOIS lugares — na tabela do app (onde se cobra de verdade)
// e no site.json (onde se vende). Dois lugares sempre divergem, e o primeiro a descobrir é o
// cliente, na página de venda, com o valor errado na cara. Em 18/08/2026 a landing anunciava
// Essencial R$ 190 enquanto o sistema já cobrava R$ 270.
//
// A fonte é a vitrine pública do app (`/api/public/plans`), que publica SÓ plano público — o
// plano Full é privado e não pode aparecer em vitrine nenhuma.
//
// 🔒 ÂNCORA = `faixas`, a lista de ids de plano que o card representa. Parear por ORDEM quebra
// no primeiro card que não é 1-para-1: "Corporativo" dobra 601-800 e 800+ de propósito, para a
// landing não virar 6 colunas. Com a âncora, o script sabe o que é reagrupamento comercial e o
// que é preço defasado.
//
// 🔒 O que ele MEXE: preço e limite de unidades. O que NUNCA mexe: nome comercial, bullets, CTA,
// destaque, e card com `precoTexto` ("Sob consulta") — isso é copy, decisão humana. Preço é dado.

import { readFileSync, writeFileSync } from 'node:fs';

const CONFERIR = process.argv.includes('--conferir');
const OFFLINE = process.argv.includes('--offline') || process.env.DRG_SEM_REDE === '1';

const FONTES = [
  { key: 'condo', nome: 'DRG-Condo', api: 'https://drg-condo.onrender.com/api/public/plans' }
];

const valor = (texto) => Number(String(texto).replace(/[^\d,]/g, '').replace(',', '.')) || 0;

async function buscar(url) {
  // Render free dorme: a 1ª chamada leva ~30s. Timeout generoso de propósito — o portão dizer
  // "não consegui conferir" é muito pior do que esperar meio minuto.
  const controle = new AbortController();
  const relogio = setTimeout(() => controle.abort(), 90_000);
  try {
    const r = await fetch(url, { signal: controle.signal, headers: { 'cache-control': 'no-cache' } });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return await r.json();
  } finally { clearTimeout(relogio); }
}

/** Na 1ª execução os cards ainda não têm âncora: casa pelo teto de unidades escrito no `sub`. */
function ancorar(cards, faixas) {
  const semAncora = cards.filter((c) => !c.faixas);
  if (!semAncora.length) return;
  for (const card of cards) {
    if (card.faixas) continue;
    const teto = Number(String(card.sub || '').match(/(\d+)\s*unidades/)?.[1] || 0);
    if (card.precoTexto || !teto) {
      // card de texto ("Sob consulta"): fica com TODAS as faixas acima do último card numérico
      const numericos = cards.filter((c) => !c.precoTexto).map((c) => Number(String(c.sub).match(/(\d+)/)?.[1] || 0));
      const maiorNumerico = Math.max(0, ...numericos);
      card.faixas = faixas.filter((f) => (f.maxUnidades ?? Infinity) > maiorNumerico).map((f) => f.id);
    } else {
      card.faixas = faixas.filter((f) => f.maxUnidades === teto).map((f) => f.id);
    }
  }
}

if (OFFLINE) {
  console.log('sincronizar-precos: --offline, conferência pulada.');
  process.exit(0);
}

const site = JSON.parse(readFileSync('data/site.json', 'utf8'));
let defasados = 0;
let mexeu = false;
let falhou = false;

for (const fonte of FONTES) {
  const produto = (site.produtos || []).find((p) => p.key === fonte.key);
  if (!produto?.planos?.length) { console.log(`⚠️  ${fonte.nome}: sem planos no site.json — pulando.`); continue; }

  let vitrine;
  try {
    vitrine = await buscar(fonte.api);
  } catch (erro) {
    // 🔒 Não conseguir conferir NÃO é "está tudo certo". Se o portão desse verde aqui, o dia em
    // que o app estivesse fora do ar seria justamente o dia em que o preço errado passaria.
    console.error(`\n🚫 ${fonte.nome}: não deu para conferir o preço (${erro.message}).`);
    console.error(`   Fonte: ${fonte.api}`);
    console.error(`   Se for queda do app e o push for urgente: --offline (ou git push --no-verify).`);
    falhou = true;
    continue;
  }

  const faixas = vitrine.planos.filter((p) => p.tipo === 'faixa' && p.mensalidade);
  ancorar(produto.planos, faixas);

  const problemas = [];
  for (const card of produto.planos) {
    const minhas = faixas.filter((f) => (card.faixas || []).includes(f.id));
    if (!minhas.length) { problemas.push(`- ${card.nome}: a(s) faixa(s) ${(card.faixas || []).join(', ') || '?'} não existem mais no app`); continue; }

    // card de texto ("Sob consulta") só precisa continuar cobrindo faixas que existem
    if (card.precoTexto) continue;

    if (minhas.length > 1) { problemas.push(`- ${card.nome}: cobre ${minhas.length} faixas mas mostra UM preço — use precoTexto ou separe o card`); continue; }

    const faixa = minhas[0];
    const preco = valor(faixa.mensalidade);
    const sub = faixa.maxUnidades ? `até ${faixa.maxUnidades} unidades no total` : 'sem limite de unidades';
    if (card.preco !== preco) { problemas.push(`~ ${card.nome}: site R$ ${card.preco} → app R$ ${preco}`); if (!CONFERIR) { card.preco = preco; mexeu = true; } }
    if (card.sub !== sub) { problemas.push(`~ ${card.nome}: "${card.sub}" → "${sub}"`); if (!CONFERIR) { card.sub = sub; mexeu = true; } }
  }

  // 🔒 Duas faixas com o MESMO preço: quem sobe de 200 para 300 unidades paga igual, e na página
  // de venda isso lê como erro de digitação. Quase sempre É erro — alguém editou uma faixa e
  // esqueceu a outra. Não é defasagem entre site e app, então avisa sem barrar o push.
  const porPreco = {};
  for (const f of faixas) (porPreco[f.mensalidade] ||= []).push(f.titulo);
  for (const [preco, titulos] of Object.entries(porPreco)) {
    if (titulos.length > 1) {
      console.log(`\n⚠️  ${fonte.nome}: ${titulos.length} faixas com o MESMO preço (${preco}):`);
      console.log(`   ${titulos.join(" · ")}`);
      console.log('   Na vitrine isso parece erro de digitação. Confira a tabela de planos no app.');
    }
  }

  // faixa do app que nenhum card cobre = preço que o cliente não vê
  const cobertas = new Set(produto.planos.flatMap((c) => c.faixas || []));
  for (const f of faixas) {
    if (!cobertas.has(f.id)) problemas.push(`+ ${f.titulo} (${f.mensalidade}) existe no app e NÃO aparece na landing`);
  }

  if (!problemas.length) { console.log(`✓ ${fonte.nome}: landing em dia com o app (assinatura ${vitrine.assinatura}).`); continue; }

  defasados++;
  console.log(`\n🔴 ${fonte.nome}: a landing está DEFASADA em relação ao app`);
  for (const p of problemas) console.log(`   ${p}`);

  if (!CONFERIR) {
    produto.precosSincronizadosEm = new Date().toISOString().slice(0, 10);
    produto.precosAssinatura = vitrine.assinatura;
    mexeu = true;
  }
}

if (mexeu) {
  writeFileSync('data/site.json', JSON.stringify(site, null, 2) + '\n');
  console.log('\n✓ data/site.json atualizado. Confira e faça commit.');
}

if (falhou) process.exitCode = 1;
else if (defasados && CONFERIR) {
  console.log('\n🚫 Push barrado: a página de VENDA anunciaria preço diferente do que o sistema cobra.');
  console.log('   Resolva com: node tools/sincronizar-precos.mjs');
  process.exitCode = 1;
}
