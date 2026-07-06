// Gera as landings por produto (uma subpasta cada) a partir de um template único.
// Rodar da raiz do projeto:  node tools/gen-produtos.mjs
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();

const ICON = (emoji) =>
  `data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2032%2032'%3E%3Crect%20width='32'%20height='32'%20rx='7'%20fill='%23152a45'/%3E%3Ctext%20x='16'%20y='23'%20font-size='18'%20text-anchor='middle'%3E${emoji}%3C/text%3E%3C/svg%3E`;

function li(arr){ return arr.map(x=>`          <li>${x}</li>`).join('\n'); }
function feats(arr){
  return arr.map(f=>`      <div class="feat"><div class="ico">${f.i}</div><h3>${f.h}</h3><p>${f.p}</p></div>`).join('\n');
}
function steps(arr){
  return arr.map(s=>`      <div class="step"><div class="n"></div><div><h3>${s.h}</h3><p>${s.p}</p></div></div>`).join('\n');
}

function page(p){
  const marca = p.marca || 'DRG';
  const heroCta = p.status === 'live'
    ? `<a class="btn btn-primary btn-lg" href="${p.app}" target="_blank" rel="noopener">${p.cta}</a>
      <a class="btn btn-ghost btn-lg" href="#recursos">Ver recursos</a>`
    : `<a class="btn btn-primary btn-lg" href="mailto:zett.romao@gmail.com?subject=Tenho%20interesse%20no%20${marca}-${p.nome}">Entrar na lista de espera</a>
      <a class="btn btn-ghost btn-lg" href="#recursos">Ver recursos</a>`;
  const pill = p.status === 'live'
    ? `<div class="pill">${p.emoji} ${p.cat} · No ar</div>`
    : `<div class="pill">${p.emoji} ${p.cat} · Em breve</div>`;
  const finalCta = p.status === 'live'
    ? `<a class="btn btn-light btn-lg" href="${p.app}" target="_blank" rel="noopener">${p.cta}</a>`
    : `<a class="btn btn-light btn-lg" href="mailto:zett.romao@gmail.com?subject=Tenho%20interesse%20no%20${marca}-${p.nome}">Entrar na lista de espera</a>`;

  return `<!doctype html>
<html lang="pt-br">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${marca}·${p.nome} — ${p.cat} | DR Systems</title>
  <meta name="description" content="${p.desc}" />
  <meta name="theme-color" content="#152a45" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="DR Systems" />
  <meta property="og:title" content="${marca}·${p.nome} — ${p.cat}" />
  <meta property="og:description" content="${p.desc}" />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="icon" href="../assets/favicon.svg" />
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
    <span class="sp"></span>
    ${p.status==='live'
      ? `<a class="btn btn-primary" href="${p.app}" target="_blank" rel="noopener">${p.cta}</a>`
      : `<a class="btn btn-primary" href="mailto:zett.romao@gmail.com?subject=Interesse%20${marca}-${p.nome}">Tenho interesse</a>`}
  </div>
</nav>

<header class="hero">
  <div class="wrap">
    <div class="emojibig">${p.emoji}</div>
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
    <div>${marca}·${p.nome} faz parte da família DR-Systems · <a href="../">ver todos os produtos</a></div>
    <div style="margin-top:8px">DR Global Multi Services · CNPJ 00.000.000/0001-00 · Todos os direitos reservados</div>
  </div>
</footer>

</body>
</html>
`;
}

const PRODUTOS = [
  {
    key:'kronos', emoji:'👥', nome:'Kronos', cat:'RH ponta a ponta', status:'live',
    app:'https://zett-romao.github.io/drg-sistema/cadastro.html', cta:'Criar conta grátis',
    desc:'Kronos: todo o RH num sistema só — ponto, folha, escalas, benefícios, eSocial e contabilidade pronta pro contador, com trilha LGPD em blockchain.',
    h1:'Todo o RH da sua empresa <em>num sistema só</em>.',
    sub:'Do ponto à rescisão — com folha, escalas, benefícios, eSocial e a contabilidade pronta para o contador. Tudo com trilha LGPD carimbada em blockchain.',
    mini:'Apuração automática · Regras da CLT embutidas · Dados isolados por empresa',
    doresT:'Fechar o RH na mão consome seu mês', dores:[
      'Fechar a folha planilha por planilha, todo mês',
      'Ponto em papel ou relógio que não conversa com a folha',
      'eSocial e encargos calculados por fora, com risco de multa',
      'Contador cobrando os dados que faltam'],
    solT:'O Kronos apura tudo sozinho', sol:[
      'Folha apurada automaticamente pela batida de ponto',
      'Ponto eletrônico integrado, com tolerância legal e escalas',
      'eSocial, encargos e rescisão calculados pelo sistema',
      'Planilha contábil pronta pro contador num clique'],
    recT:'Um RH completo, de verdade', recL:'Ponto, folha e contabilidade no mesmo lugar — sem exportar de um pra outro.',
    rec:[
      {i:'⏱️',h:'Ponto eletrônico',p:'Batida com tolerância legal (Súmula 366), escalas 12×36 e 6×1, banco de horas e faltas apuradas ao vivo.'},
      {i:'🧾',h:'Folha de pagamento',p:'Proventos, descontos, adiantamento, férias e 13º — competência fechada com trava por período.'},
      {i:'📊',h:'Contabilidade & eSocial',p:'Planilha do contador, rubricas, encargos e eventos do eSocial gerando XML.'},
      {i:'🏖️',h:'Benefícios & escalas',p:'VT, VR e VA e escalas como fonte única; feriados nacionais aplicados automaticamente.'},
      {i:'🔐',h:'LGPD + blockchain',p:'Termo de consentimento, semáforo LGPD e carimbo de tempo OpenTimestamps nativo.'},
      {i:'📄',h:'Holerite & rescisão',p:'Holerite com assinatura do colaborador e rescisão que fecha a folha sozinha.'}],
    comoL:'Você configura a empresa uma vez. O dia a dia é a batida alimentando a folha.',
    passos:[
      {h:'Cadastre a empresa e a equipe',p:'Admissão, jornada e escala de cada colaborador.'},
      {h:'O ponto alimenta a folha',p:'Cada batida vira apuração automática, com as regras da CLT.'},
      {h:'Feche a competência e exporte',p:'Holerite, guias e a planilha pro contador num clique.'}],
    finalH:'Pronto para fechar a folha sem dor de cabeça?',
    finalP:'Comece agora e deixe o Kronos apurar o RH inteiro por você.'
  },
  {
    key:'buscanfe', emoji:'🔎', nome:'BuscaNFe', cat:'Captura fiscal', status:'live',
    app:'https://drg-buscanfe.onrender.com/vendas', cta:'Começar teste grátis',
    desc:'BuscaNFe: baixa automaticamente as NF-e emitidas contra seus CNPJs/CPFs, por competência. XML, DANFE em PDF e planilha pro contador, direto da SEFAZ.',
    h1:'Nunca mais perca uma <em>nota fiscal</em> emitida contra você.',
    sub:'O BuscaNFe baixa automaticamente todas as NF-e emitidas contra seus CNPJs e CPFs, organizadas por competência. XML, DANFE em PDF e planilha prontos pro contador.',
    mini:'Sem instalação · Roda sozinho na nuvem · Certificado criptografado no cofre',
    doresT:'Baixar nota uma a uma é perda de tempo', dores:[
      'Entrar no portal da SEFAZ manualmente todo mês',
      'Notas que passam despercebidas e viram problema no fisco',
      'Contador cobrando o XML que você esqueceu de baixar',
      'Nenhum controle de quanto entrou por competência'],
    solT:'O robô que cuida disso por você', sol:[
      'Coleta automática de tempos em tempos, sozinho',
      'Todas as notas organizadas por mês (competência)',
      'Exporta XML, DANFE em PDF e planilha num clique',
      'Alerta de vencimento do certificado e visão de totais'],
    recT:'Tudo pra dominar suas notas', recL:'Feito pra empresas e escritórios de contabilidade que querem parar de baixar nota na mão.',
    rec:[
      {i:'🤖',h:'Coleta automática',p:'Puxa as NF-e da SEFAZ sozinho, sem você clicar em nada. Ligou, esqueceu.'},
      {i:'🗂️',h:'Por competência',p:'Escolhe o mês e vê todas as notas, com totais e valores somados.'},
      {i:'📥',h:'XML · PDF · Planilha',p:'Baixa o XML oficial, o DANFE em PDF e a planilha pronta pro contador.'},
      {i:'🔐',h:'Cofre seguro',p:'Seu certificado A1 fica criptografado. Cada cliente vê só os próprios dados.'},
      {i:'🏢',h:'Multi-empresa',p:'Monitore vários CNPJs/CPFs numa conta só — ideal pra contabilidade.'},
      {i:'🔔',h:'Sem surpresas',p:'Aviso de vencimento do certificado e controle do que já foi capturado.'}],
    comoL:'Você configura uma vez. O resto é no automático.',
    passos:[
      {h:'Cadastre a empresa',p:'Informe o CNPJ ou CPF que você quer monitorar.'},
      {h:'Envie o certificado A1',p:'O arquivo do certificado fica guardado com segurança no cofre.'},
      {h:'A coleta roda sozinha',p:'O servidor consulta a SEFAZ periodicamente e organiza cada NF-e por competência.'}],
    finalH:'Pronto para nunca mais perder uma nota?',
    finalP:'Crie sua conta em minutos e deixe o robô trabalhar por você.'
  },
  {
    key:'check', emoji:'📨', nome:'Check', cat:'Prova de entrega', status:'live',
    app:'https://drg-check-app.onrender.com/login', cta:'Acessar',
    desc:'Check: notificações com prova de entrega e cadeia de custódia em três camadas — hash SHA-256, carimbo de tempo em blockchain e PDF probatório.',
    h1:'Notificações com <em>prova de entrega</em> que vale como documento.',
    sub:'Envie avisos e notificações com cadeia de custódia em três camadas: hash SHA-256 do conteúdo, carimbo de tempo em blockchain e PDF probatório com toda a trilha.',
    mini:'Base legal MP 2.200-2 · WhatsApp oficial · Dados isolados por conta',
    doresT:'“Não recebi” — e você não consegue provar', dores:[
      'A pessoa alega que nunca recebeu o aviso',
      'Print de tela não tem valor como prova',
      'AR dos Correios é caro e demora dias',
      'Sem registro de quando e para quem foi enviado'],
    solT:'Prova técnica de ponta a ponta', sol:[
      'Cada envio gera o hash SHA-256 do conteúdo',
      'Carimbo de tempo ancorado em blockchain (OpenTimestamps)',
      'PDF probatório com toda a cadeia de custódia',
      'Envio por WhatsApp oficial com webhook assinado'],
    recT:'Cada aviso vira documento', recL:'Para quem precisa notificar e ter como comprovar depois.',
    rec:[
      {i:'🔗',h:'Cadeia de custódia',p:'Três camadas de prova (conteúdo, tempo e documento) ligadas entre si.'},
      {i:'⛓️',h:'Carimbo em blockchain',p:'Carimbo de tempo com OpenTimestamps — imutável e verificável por qualquer um.'},
      {i:'📄',h:'PDF probatório',p:'Um documento com hash, data e trilha completa do envio.'},
      {i:'💬',h:'WhatsApp oficial',p:'Envio pela API oficial do WhatsApp, com template aprovado e webhook assinado.'},
      {i:'⚖️',h:'Base legal',p:'Amparado pela MP 2.200-2 (ICP-Brasil) para documentos eletrônicos.'},
      {i:'🏢',h:'Multi-tenant',p:'Cada cliente com seus dados isolados e suas próprias notificações.'}],
    comoL:'Escreva, envie e guarde a prova. Simples assim.',
    passos:[
      {h:'Escreva a notificação',p:'Monte o aviso e escolha o destinatário.'},
      {h:'Envie pelo canal',p:'Dispare por WhatsApp oficial ou pelo canal configurado.'},
      {h:'Baixe a prova',p:'Receba o PDF probatório com hash e carimbo de tempo.'}],
    finalH:'Notifique com prova de verdade.',
    finalP:'Comece a registrar seus avisos com cadeia de custódia em blockchain.'
  },
  {
    key:'sign', emoji:'✍️', nome:'Sign', cat:'Assinatura eletrônica', status:'live',
    app:'https://drg-sign-app.onrender.com/vendas', cta:'Conhecer',
    desc:'Sign: assinatura eletrônica de documentos com validade jurídica — identificação por CPF, IP, geolocalização e hash em cada folha.',
    h1:'Assine documentos com <em>validade jurídica</em> e trilha de auditoria.',
    sub:'Assinatura eletrônica com identificação por CPF e data de nascimento, IP, geolocalização e hash em cada folha. Selfie e OTP opcionais para reforçar a prova.',
    mini:'Base legal MP 2.200-2 · Hash por folha · Reusa o motor probatório do Check',
    doresT:'Papel, cartório e ida-e-volta', dores:[
      'Imprimir, assinar, escanear e reenviar',
      'Sem prova de quem realmente assinou',
      'Documentos espalhados por e-mail',
      'Reconhecer firma custa tempo e dinheiro'],
    solT:'Assinatura 100% digital', sol:[
      'Assine em qualquer dispositivo, sem imprimir',
      'Identificação por CPF+nascimento, IP e geolocalização',
      'Hash em cada folha garante a integridade',
      'Trilha de auditoria com base legal MP 2.200-2'],
    recT:'Prova em cada assinatura', recL:'Do contrato ao aceite, com trilha que segura em qualquer questionamento.',
    rec:[
      {i:'🆔',h:'Identificação do signatário',p:'CPF e data de nascimento obrigatórios; selfie e OTP opcionais.'},
      {i:'📍',h:'IP + geolocalização',p:'Registro de onde e de qual dispositivo cada assinatura partiu.'},
      {i:'#️⃣',h:'Hash por folha',p:'Cada página recebe um hash — qualquer alteração é detectável.'},
      {i:'🤳',h:'Selfie / OTP',p:'Camadas extras de verificação quando o documento pede mais segurança.'},
      {i:'🧾',h:'Trilha de auditoria',p:'Todo o histórico do documento, do envio ao aceite.'},
      {i:'🔗',h:'Motor do Check',p:'Reaproveita a cadeia de custódia probatória do DRG-Check.'}],
    comoL:'Suba, convide e receba assinado — com a prova junto.',
    passos:[
      {h:'Suba o documento',p:'Envie o PDF que precisa ser assinado.'},
      {h:'Convide os signatários',p:'Cada um assina identificado, no próprio dispositivo.'},
      {h:'Baixe o assinado',p:'Documento final com hash, IP, geo e trilha de auditoria.'}],
    finalH:'Assine com segurança jurídica.',
    finalP:'Conheça o DRG-Sign e acabe com o papel e o cartório.'
  },
  {
    key:'juridico', emoji:'⚖️', nome:'Jurídico', cat:'Gestão de advocacia', status:'live',
    app:'https://drg-juridico-app.onrender.com/signup', cta:'Criar conta',
    desc:'Jurídico: gestão de escritório de advocacia com monitoramento de publicações (DJEN/DataJud), prazos, execução penal, livro-caixa e peças com IA.',
    h1:'O escritório de advocacia inteiro, <em>sob controle</em>.',
    sub:'Monitore publicações do DJEN e do DataJud, calcule prazos, controle a execução penal e o livro-caixa — com apoio de IA para produzir peças.',
    mini:'Publicações automáticas · Agenda de prazos · Dados isolados por escritório',
    doresT:'Um prazo perdido custa caro', dores:[
      'Perder prazo por publicação que ninguém viu',
      'Controlar processos em planilha',
      'Calcular prazos processuais na mão',
      'Prestação de contas do cliente confusa'],
    solT:'O escritório organizado', sol:[
      'Monitoramento automático de publicações (DJEN/DataJud)',
      'Agenda de prazos e compromissos com aviso',
      'Calculadoras Cível, Penal e Trabalhista + execução penal',
      'Livro-caixa e prestação de contas por processo'],
    recT:'Da publicação à prestação de contas', recL:'Tudo o que o escritório precisa para não perder prazo nem cliente.',
    rec:[
      {i:'📰',h:'Monitoramento DJEN',p:'Publicações capturadas automaticamente e ligadas aos andamentos.'},
      {i:'📅',h:'Prazos & agenda',p:'Calculadoras de prazo e agenda com aviso ao advogado e ao cliente.'},
      {i:'⛓️',h:'Execução penal',p:'Progressão, livramento e marcos que caem direto na agenda.'},
      {i:'💰',h:'Livro-caixa',p:'Prestação de contas por processo, balancete e conciliação.'},
      {i:'🤖',h:'Peças com IA',p:'Geração de peças com IA, por cota de plano.'},
      {i:'🔎',h:'Verificação de OAB',p:'Checagem de CPF/CNPJ e titularidade da OAB antes de monitorar.'}],
    comoL:'Cadastre uma vez e receba as publicações no piloto automático.',
    passos:[
      {h:'Cadastre a OAB e os processos',p:'Informe os números que quer acompanhar.'},
      {h:'Receba as publicações',p:'O sistema monitora DJEN/DataJud e avisa cada novidade.'},
      {h:'Aja dentro do prazo',p:'Prazos calculados, agenda organizada e peças com apoio de IA.'}],
    finalH:'Nunca mais perca um prazo.',
    finalP:'Crie a conta do seu escritório e coloque as publicações no automático.'
  },
  {
    key:'hidro', emoji:'💧', nome:'Hidro', cat:'IoT · nível de água', status:'live',
    app:'https://drg-hidro.onrender.com/', cta:'Acessar',
    desc:'Hidro: monitoramento IoT do nível das caixas d’água com sensor ESP32 e alertas por e-mail, WhatsApp e push antes de faltar ou transbordar.',
    h1:'Saiba o nível das suas caixas d’água <em>em tempo real</em>.',
    sub:'Um sensor ultrassônico em ESP32 mede o nível continuamente e avisa você por e-mail, WhatsApp e push antes de faltar — ou transbordar.',
    mini:'Sensor 4G · Alertas com histerese · Acompanhe pelo celular',
    doresT:'Água é problema só quando falta', dores:[
      'Descobrir que a caixa esvaziou só quando falta água',
      'Bomba ligada à toa, gastando energia',
      'Subir no telhado pra conferir o nível',
      'Transbordamento desperdiçando água e dinheiro'],
    solT:'O nível na palma da mão', sol:[
      'Nível medido continuamente pelo sensor',
      'Alertas automáticos com histerese (sem spam)',
      'Acompanhe de qualquer lugar pelo celular',
      'Avisa por e-mail, WhatsApp e push'],
    recT:'Monitore antes do problema acontecer', recL:'Ideal para residências, condomínios, sítios e empresas com reservatório.',
    rec:[
      {i:'📡',h:'Sensor ESP32',p:'Sensor ultrassônico com conexão 4G, medindo o nível o tempo todo.'},
      {i:'📈',h:'Nível em tempo real',p:'Veja a porcentagem de cada caixa direto no painel.'},
      {i:'🔔',h:'Alertas por contato',p:'Defina quem recebe e por qual canal — e-mail, WhatsApp ou push.'},
      {i:'💧',h:'Falta e transbordo',p:'Avisa tanto no nível baixo quanto no nível alto, com histerese.'},
      {i:'⚙️',h:'Planos Lite e Pro',p:'Do monitoramento simples ao acompanhamento avançado.'},
      {i:'🏢',h:'Multi-tenant',p:'Cada cliente com seus reservatórios e alertas isolados.'}],
    comoL:'Instale o sensor, conecte e pronto — os alertas chegam sozinhos.',
    passos:[
      {h:'Instale o sensor na caixa',p:'O ESP32 fica na tampa e mede o nível por ultrassom.'},
      {h:'Conecte à sua conta',p:'O sensor envia os dados para o painel pela rede 4G.'},
      {h:'Receba os alertas',p:'Defina os limites e seja avisado antes de faltar ou transbordar.'}],
    finalH:'Nunca mais fique sem água de surpresa.',
    finalP:'Acesse o painel e comece a monitorar suas caixas d’água.'
  },
  {
    key:'fit', emoji:'🏋️', nome:'Fit', cat:'Gestão de academia', status:'live',
    app:'https://drg-fit.vercel.app', cta:'Acessar',
    desc:'Fit: gestão de academia com cadastro de alunos, planos, controle de acesso e agendamentos, numa plataforma rápida e moderna.',
    h1:'Sua academia organizada, <em>do aluno ao acesso</em>.',
    sub:'Cadastro de alunos, planos, controle de acesso e agendamentos numa plataforma rápida e moderna, feita para o dia a dia da academia.',
    mini:'Rápido no celular · Controle de acesso · Situação de pagamento à vista',
    doresT:'Academia não se gerencia no caderno', dores:[
      'Controle de alunos em caderno ou planilha',
      'Não saber quem está em dia com o pagamento',
      'Catraca que não conversa com o cadastro',
      'Agendamento de aulas no grupo de WhatsApp'],
    solT:'Tudo num painel só', sol:[
      'Cadastro completo de alunos e planos',
      'Situação de pagamento à vista',
      'Controle de acesso integrado',
      'Agendamento de aulas organizado'],
    recT:'A academia no controle', recL:'Do primeiro cadastro ao controle de quem entra.',
    rec:[
      {i:'🧑‍🤝‍🧑',h:'Alunos & planos',p:'Cadastro completo, com plano e histórico de cada aluno.'},
      {i:'🚪',h:'Controle de acesso',p:'Libera a entrada de quem está em dia e ativo.'},
      {i:'📆',h:'Agendamentos',p:'Aulas e horários organizados, sem bagunça no zap.'},
      {i:'💳',h:'Situação financeira',p:'Veja rapidamente quem está adimplente.'},
      {i:'📱',h:'Rápido no celular',p:'Interface moderna que funciona bem no telefone.'},
      {i:'⚡',h:'Tecnologia atual',p:'Construído em Next.js e Supabase, leve e escalável.'}],
    comoL:'Cadastre, configure e acompanhe — tudo num lugar.',
    passos:[
      {h:'Cadastre os alunos',p:'Dados, plano e situação de cada um.'},
      {h:'Defina planos e acesso',p:'Configure os planos e as regras de entrada.'},
      {h:'Acompanhe num painel',p:'Alunos, acessos e agenda sempre à mão.'}],
    finalH:'Deixe a academia rodar redondo.',
    finalP:'Acesse o DRG-Fit e organize alunos, planos e acesso.'
  },
  {
    key:'rently', emoji:'🏠', nome:'Rently', cat:'Locações', status:'soon', marca:'DRG',
    desc:'Rently: gestão de locações de imóveis de ponta a ponta — contratos, análise de crédito e cobrança, com segurança em camadas.',
    h1:'Gestão de locações <em>de ponta a ponta</em>.',
    sub:'Da elaboração do contrato à cobrança, com análise de crédito integrada e segurança em camadas. Tudo organizado por imóvel e locatário.',
    mini:'Em desenvolvimento · Entre na lista para ser avisado no lançamento',
    doresT:'Locação dá trabalho em cada etapa', dores:[
      'Contrato de locação feito do zero toda vez',
      'Inadimplência sem régua de cobrança',
      'Análise de crédito manual e demorada',
      'Documentos do imóvel espalhados'],
    solT:'Do contrato à cobrança, num lugar', sol:[
      'Elaboração assistida de contratos',
      'Cobrança com régua e recebimento',
      'Análise de crédito integrada (Serasa)',
      'Tudo organizado por imóvel e locatário'],
    recT:'Locação sem retrabalho', recL:'Feito para imobiliárias e proprietários que querem previsibilidade.',
    rec:[
      {i:'📝',h:'Contratos',p:'Elaboração assistida, com cláusulas prontas e personalizáveis.'},
      {i:'💳',h:'Cobrança',p:'Régua de cobrança e recebimento dos aluguéis.'},
      {i:'📊',h:'Análise de crédito',p:'Consulta integrada para aprovar o locatário com segurança.'},
      {i:'🔐',h:'Segurança 2FA',p:'Acesso protegido com autenticação em dois fatores.'},
      {i:'🏢',h:'Multi-tenant',p:'Cada imobiliária com seus imóveis e dados isolados.'},
      {i:'📄',h:'Documentos',p:'Tudo do imóvel e do contrato guardado e organizado.'}],
    comoL:'Simples do anúncio ao recebimento.',
    passos:[
      {h:'Cadastre imóvel e locatário',p:'Dados do imóvel e do interessado.'},
      {h:'Gere o contrato',p:'Contrato pronto após a análise de crédito.'},
      {h:'Acompanhe a cobrança',p:'Recebimento e régua de inadimplência no painel.'}],
    finalH:'Quer locar sem dor de cabeça?',
    finalP:'Entre na lista e seja avisado assim que o DRG-Rently abrir.'
  },
  {
    key:'garantidora', emoji:'🛡️', nome:'Garantidora', cat:'Cobrança garantida', status:'soon', marca:'DRG',
    desc:'Garantidora: cobrança garantida de condomínios, com antecipação de recebíveis e régua de inadimplência. Receita previsível todo mês.',
    h1:'Condomínio recebe <em>todo mês</em>, mesmo com inadimplência.',
    sub:'Cobrança garantida de condomínios, com antecipação de recebíveis e régua de inadimplência. O condomínio ganha previsibilidade; o síndico deixa de ser cobrador.',
    mini:'Em desenvolvimento · Entre na lista para ser avisado no lançamento',
    doresT:'Inadimplência fura o caixa', dores:[
      'Inadimplência furando o caixa do condomínio',
      'Síndico virando cobrador dos vizinhos',
      'Sem previsibilidade de receita',
      'Acordo de dívida feito no improviso'],
    solT:'Receita garantida e organizada', sol:[
      'Receita garantida ao condomínio todo mês',
      'Régua de cobrança automatizada',
      'Antecipação de recebíveis',
      'Gestão da carteira de inadimplentes'],
    recT:'Previsibilidade para o condomínio', recL:'Para administradoras e síndicos que querem caixa estável.',
    rec:[
      {i:'💰',h:'Receita garantida',p:'O condomínio recebe o previsto, independente da inadimplência.'},
      {i:'📆',h:'Régua de atraso',p:'Cobrança automática em etapas, do lembrete ao acordo.'},
      {i:'⚡',h:'Antecipação',p:'Antecipe recebíveis quando precisar de caixa.'},
      {i:'📇',h:'Carteira',p:'Gestão completa dos inadimplentes e acordos.'},
      {i:'📊',h:'Painel',p:'Visão clara da receita e da inadimplência.'},
      {i:'🏢',h:'Multi-condomínio',p:'Uma conta para administrar vários condomínios.'}],
    comoL:'Ative e receba garantido.',
    passos:[
      {h:'Cadastre o condomínio',p:'Unidades, valores e inadimplentes.'},
      {h:'Ative a régua',p:'Defina as etapas da cobrança automática.'},
      {h:'Receba garantido',p:'Caixa previsível todo mês, com antecipação quando precisar.'}],
    finalH:'Caixa previsível para o seu condomínio.',
    finalP:'Entre na lista e seja avisado quando a DRG-Garantidora abrir.'
  },
  {
    key:'condogest', emoji:'🏢', nome:'CondoGest', cat:'Gestão condominial', status:'soon', marca:'GDR',
    desc:'CondoGest: gestão condominial completa, do financeiro à comunicação com os moradores, feita para o síndico.',
    h1:'A gestão do condomínio <em>completa</em>, num lugar só.',
    sub:'Do financeiro à comunicação com os moradores — tudo organizado para o síndico administrar sem planilha e sem grupo de WhatsApp lotado.',
    mini:'Em validação · Entre na lista para ser avisado no lançamento',
    doresT:'Síndico faz tudo no improviso', dores:[
      'Financeiro do condomínio no papel',
      'Comunicação com moradores dispersa',
      'Boletos e prestação de contas confusos',
      'Reserva de área comum anotada no caderno'],
    solT:'O condomínio organizado', sol:[
      'Financeiro e prestação de contas organizados',
      'Canal de comunicação com os moradores',
      'Controle de cobranças',
      'Reserva de áreas comuns online'],
    recT:'Tudo do condomínio num painel', recL:'Para síndicos e administradoras que querem parar de improvisar.',
    rec:[
      {i:'💰',h:'Financeiro',p:'Receitas, despesas e saldo do condomínio sempre atualizados.'},
      {i:'📣',h:'Comunicação',p:'Avisos e comunicados que chegam a todos os moradores.'},
      {i:'🧾',h:'Prestação de contas',p:'Transparência com os moradores, sem planilha solta.'},
      {i:'📆',h:'Reservas',p:'Reserva de salão e áreas comuns direto pelo sistema.'},
      {i:'👥',h:'Moradores',p:'Cadastro de unidades e moradores organizado.'},
      {i:'📱',h:'PWA',p:'Funciona no celular como aplicativo, inclusive offline.'}],
    comoL:'Configure uma vez e gerencie tudo online.',
    passos:[
      {h:'Cadastre o condomínio',p:'Unidades, moradores e áreas comuns.'},
      {h:'Configure o dia a dia',p:'Financeiro, comunicados e reservas.'},
      {h:'Gerencie online',p:'Tudo num painel, sem papel e sem improviso.'}],
    finalH:'Administre o condomínio sem improviso.',
    finalP:'Entre na lista e seja avisado quando o GDR-CondoGest abrir.'
  },
];

let n = 0;
for (const p of PRODUTOS){
  const dir = join(ROOT, p.key);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), page(p), 'utf8');
  n++;
  console.log('✓', p.key + '/index.html');
}
console.log(`\n${n} landings geradas.`);
