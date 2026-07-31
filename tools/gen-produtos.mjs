// Gera as landings por produto (uma subpasta cada) a partir de um template único.
// FONTE ÚNICA: data/site.json (cards, planos E copy da página). Não há mais lista aqui.
// Rodar da raiz do projeto:  node tools/gen-produtos.mjs
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();

// Contato oficial da DR Systems (WhatsApp) — usado nos CTAs de interesse/lista de espera.
const WHATS = '5511997347272';
const wa = (msg) => `https://wa.me/${WHATS}?text=${encodeURIComponent(msg)}`;

const ICON = (emoji) =>
  `data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2032%2032'%3E%3Crect%20width='32'%20height='32'%20rx='7'%20fill='%23152a45'/%3E%3Ctext%20x='16'%20y='23'%20font-size='18'%20text-anchor='middle'%3E${emoji}%3C/text%3E%3C/svg%3E`;

function li(arr){ return (arr||[]).map(x=>`          <li>${x}</li>`).join('\n'); }
function feats(arr){
  return (arr||[]).map(f=>`      <div class="feat"><div class="ico">${f.i}</div><h3>${f.h}</h3><p>${f.p}</p></div>`).join('\n');
}
function steps(arr){
  return (arr||[]).map(s=>`      <div class="step"><div class="n"></div><div><h3>${s.h}</h3><p>${s.p}</p></div></div>`).join('\n');
}

function page(p){
  const marca = p.marca || 'DRG';
  // Status normalizado: no site.json os produtos usam 'ativo'/'embreve'; o template
  // trabalha com o booleano `live`. ('live'/'soon' antigos continuam aceitos.)
  const live = p.status === 'live' || p.status === 'ativo';
  // CTA secundário opcional (ex.: "Área do síndico" do Sind.ia). Some quando o produto não declara.
  const cta2 = p.ctaSecundario
    ? `<a class="btn btn-ghost btn-lg" href="${p.ctaSecundario.href}" target="_blank" rel="noopener">${p.ctaSecundario.rotulo}</a>`
    : '';

  const heroCta = live
    ? `<a class="btn btn-primary btn-lg" href="${p.app}" target="_blank" rel="noopener">${p.cta}</a>
      ${cta2}
      <a class="btn btn-ghost btn-lg" href="#recursos">Ver recursos</a>`
    : `<a class="btn btn-primary btn-lg" href="${wa('Olá! Tenho interesse no ' + marca + '·' + p.nome + ' e quero entrar na lista de espera.')}" target="_blank" rel="noopener">Entrar na lista de espera</a>
      <a class="btn btn-ghost btn-lg" href="#recursos">Ver recursos</a>`;
  const pill = live
    ? `<div class="pill">${p.emoji} ${p.cat} · No ar</div>`
    : `<div class="pill">${p.emoji} ${p.cat} · Em breve</div>`;
  const finalCta = live
    ? `<a class="btn btn-light btn-lg" href="${p.app}" target="_blank" rel="noopener">${p.cta}</a>
      ${p.ctaSecundario ? `<a class="btn btn-ghost btn-lg" href="${p.ctaSecundario.href}" target="_blank" rel="noopener">${p.ctaSecundario.rotulo}</a>` : ''}`
    : `<a class="btn btn-light btn-lg" href="${wa('Olá! Tenho interesse no ' + marca + '·' + p.nome + ' e quero entrar na lista de espera.')}" target="_blank" rel="noopener">Entrar na lista de espera</a>`;
  // Logo própria do produto (opcional): substitui o emoji grande e o favicon.
  const favicon = p.logo
    ? `<link rel="icon" href="../assets/${p.logo}" />
  <link rel="apple-touch-icon" href="../assets/${p.logo}" />`
    : `<link rel="icon" href="../assets/favicon.svg" />
  <link rel="icon" type="image/png" sizes="32x32" href="../assets/favicon-32.png" />
  <link rel="apple-touch-icon" href="../assets/apple-touch-icon.png" />`;
  const heroMark = p.logo
    ? `<img class="prodlogo" src="../assets/${p.logo}" alt="${marca}·${p.nome}" width="88" height="88" style="display:block;margin:0 auto 10px;width:88px;height:88px" />`
    : `<div class="emojibig">${p.emoji}</div>`;

  return `<!doctype html>
<html lang="pt-br">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${marca}·${p.nome} — ${p.cat} | DR Systems</title>
  <meta name="description" content="${p.descPagina || p.desc}" />
  <meta name="theme-color" content="#152a45" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="DR Systems" />
  <meta property="og:title" content="${marca}·${p.nome} — ${p.cat}" />
  <meta property="og:description" content="${p.descPagina || p.desc}" />
  <meta name="twitter:card" content="summary_large_image" />
  ${favicon}
  <link rel="manifest" href="../manifest.webmanifest" />
  <link rel="stylesheet" href="../assets/style.css" />
</head>
<body>

<div class="back">
  <div class="wrap"><a href="../">← Voltar ao portfólio DR Global</a></div>
</div>

<nav>
  <div class="wrap">
    <a class="brand" href="../"><img class="tile" src="../assets/mark.svg" alt="DR Systems" />DR&nbsp;Systems</a>
    <a class="nav-link" href="#recursos">Recursos</a>
    <a class="nav-link" href="#como">Como funciona</a>
    <a class="nav-link" id="nav-planos" href="#planos" hidden>Planos</a>
    <span class="sp"></span>
    ${live
      ? `<a class="btn btn-primary" href="${p.app}" target="_blank" rel="noopener">${p.cta}</a>`
      : `<a class="btn btn-primary" href="${wa('Olá! Tenho interesse no ' + marca + '·' + p.nome + '.')}" target="_blank" rel="noopener">Tenho interesse</a>`}
  </div>
</nav>

<header class="hero">
  <div class="wrap">
    ${heroMark}
    <div class="prodname">${marca}·<b>${p.nome}</b></div>
    ${pill}
    <h1>${p.h1}</h1>
    <p class="sub">${p.sub}</p>
    <div class="cta">
      ${heroCta}
    </div>
    <div class="mini">${p.mini}</div>
  </div>
</header>

<section>
  <div class="wrap split">
    <div>
      <div class="eyebrow" style="text-align:left">O problema</div>
      <h2 class="tt" style="text-align:left;font-size:28px">${p.doresT}</h2>
      <ul class="bad">
${li(p.dores)}
      </ul>
    </div>
    <div>
      <div class="eyebrow" style="text-align:left">A solução</div>
      <h2 class="tt" style="text-align:left;font-size:28px">${p.solT}</h2>
      <ul>
${li(p.sol)}
      </ul>
    </div>
  </div>
</section>

<section id="recursos" style="background:#fff">
  <div class="wrap">
    <div class="eyebrow">Recursos</div>
    <h2 class="tt">${p.recT}</h2>
    <p class="lead">${p.recL}</p>
    <div class="grid g3">
${feats(p.rec)}
    </div>
  </div>
</section>

<section id="como">
  <div class="wrap">
    <div class="eyebrow">Como funciona</div>
    <h2 class="tt">3 passos e pronto</h2>
    <p class="lead">${p.comoL}</p>
    <div class="steps">
${steps(p.passos)}
    </div>
  </div>
</section>

<section id="planos" class="price" hidden>
  <div class="wrap">
    <div class="eyebrow">Planos</div>
    <h2 class="tt">Preços simples, sem pegadinha</h2>
    <p class="lead">Escolha o plano que cabe no seu momento. Cancele quando quiser.</p>
    <div class="plans" id="planos-root"></div>
    <p class="plans-nota" id="planos-nota" hidden></p>
  </div>
</section>

<script>
(function(){
  var KEY=${JSON.stringify(p.key)};
  function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
  function brl(v){return 'R\\u0024 '+Number(v).toLocaleString('pt-br');}
  fetch('../data/site.json?t='+Date.now(),{cache:'no-store'}).then(function(r){return r.json();}).then(function(cfg){
    var pr=(cfg.produtos||[]).filter(function(x){return x.key===KEY;})[0];
    var pl=(pr&&pr.planos)||[];
    if(!pl.length) return;
    document.getElementById('planos').hidden=false;
    var nv=document.getElementById('nav-planos'); if(nv) nv.hidden=false;
    if(pr.planosNota){ var nt=document.getElementById('planos-nota'); nt.textContent=pr.planosNota; nt.hidden=false; }
    var root=document.getElementById('planos-root');
    root.className='plans n'+Math.min(pl.length,4);
    root.innerHTML=pl.map(function(x){
      var preco=x.precoTexto?esc(x.precoTexto):(Number(x.preco)>0?brl(x.preco)+'<small>'+esc(x.periodo||'/mês')+'</small>':'Grátis');
      var itens=(x.itens||[]).map(function(i){return '<li>'+esc(i)+'</li>';}).join('');
      var cta=esc(x.cta||'Assinar'); var href=esc(x.ctaHref||'https://wa.me/5511997347272?text=Ol%C3%A1!%20Quero%20falar%20com%20a%20DR%20Systems.');
      return '<div class="plan'+(x.destaque?' dest':'')+'">'+
        (x.destaque?'<div class="tag">MAIS POPULAR</div>':'')+
        '<h3>'+esc(x.nome)+'</h3>'+
        '<div class="val">'+preco+'</div>'+
        '<div class="lim">'+esc(x.sub||'')+'</div>'+
        '<ul>'+itens+'</ul>'+
        '<a class="btn '+(x.destaque?'btn-primary':'')+'"'+(x.destaque?'':' style="background:#edf2f7;color:var(--azul2)"')+' href="'+href+'">'+cta+'</a>'+
      '</div>';
    }).join('');
  }).catch(function(e){console.error(e);});
})();
</script>

<section class="final">
  <div class="wrap">
    <h2>${p.finalH}</h2>
    <p>${p.finalP}</p>
    ${finalCta}
  </div>
</section>

<footer>
  <div class="wrap">
    <div class="brand"><img class="tile" src="../assets/mark.svg" alt="DR Systems" style="width:26px;height:26px" />DR&nbsp;Systems</div>
    <div>Software House · Produtos Multi-Tenant · Engenharia Própria</div>
    <div>${marca}·${p.nome} faz parte da família DR-Systems · <a href="../">ver todos os produtos</a></div>
    <div style="margin-top:8px">DR Global Multi Services · CNPJ 49.698.112/0001-57 · Todos os direitos reservados</div>
  </div>
</footer>

</body>
</html>
`;
}

// ---- Fonte única: lê os produtos do data/site.json e gera uma página por produto ----
const site = JSON.parse(readFileSync(join(ROOT, 'data', 'site.json'), 'utf8'));
const produtos = (site.produtos || []).filter(p => p && p.key);

let n = 0, semCopy = [];
for (const p of produtos){
  // Sem o mínimo de copy (h1), a página sai vazia — pula e avisa.
  if (!p.h1){ semCopy.push(p.key); continue; }
  const dir = join(ROOT, p.key);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), page(p), 'utf8');
  n++;
  console.log('✓', p.key + '/index.html');
}
console.log(`\n${n} landings geradas a partir de data/site.json.`);
if (semCopy.length) console.log('⚠ produtos sem copy de página (não gerados):', semCopy.join(', '));

// ---- Lista do <noscript> da home: também sai do site.json (nada de nome hardcodado) ----
// A home renderiza os cards por JS; o <noscript> é o que buscador e leitor sem JS enxergam.
// Sem isso a lista envelhece calada (foi o que aconteceu: Charge, Pulse, View e Atende24h
// ficaram de fora dela mesmo já estando no site.json).
{
  const homePath = join(ROOT, 'index.html');
  const html = readFileSync(homePath, 'utf8');
  const INI = '<!-- PRODUTOS:INICIO';
  const FIM = '<!-- PRODUTOS:FIM -->';
  const a = html.indexOf(INI), b = html.indexOf(FIM);
  if (a === -1 || b === -1) {
    console.log('⚠ marcadores PRODUTOS:INICIO/FIM não encontrados no index.html — lista do <noscript> não atualizada.');
  } else {
    const links = produtos
      .filter(p => p.visivel !== false)
      .map(p => `<a href="${p.href || p.key + '/'}" style="color:var(--clara)">${p.nome}</a>`)
      .join(', ');
    const bloco =
      `${INI} — gerado por tools/gen-produtos.mjs a partir de data/site.json. Não editar à mão. -->\n` +
      `      <p class="lead">Produtos: ${links}.</p>\n      `;
    const visiveis = produtos.filter(p => p.visivel !== false).length;
    // O contador da faixa de números também é recalculado (o JS já o corrige em tempo
    // de execução; isto evita o número velho piscar antes do fetch e no <noscript>).
    const novoHtml = (html.slice(0, a) + bloco + html.slice(b))
      .replace(/(id="stat-produtos">)\d+(<)/, `$1${visiveis}$2`);
    writeFileSync(homePath, novoHtml, 'utf8');
    console.log('✓ index.html — lista do <noscript> e contador atualizados com', visiveis, 'produtos.');
  }
}
