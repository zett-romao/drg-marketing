// Cloudflare Pages Function — GET /api/neon-uso
// Roda no SERVIDOR (não no navegador): a NEON_API_KEY vive num secret do Pages e
// NUNCA é exposta ao cliente. Devolve só números agregados de consumo do Neon,
// pra alimentar o medidor no /admin/.
//
// Configurar no Cloudflare Pages → Settings → Environment variables (encrypted):
//   NEON_API_KEY = a chave de organização criada em console.neon.tech
//
// Org do zett: org-quiet-cake-65531216 (embutida abaixo).

const ORG_ID = 'org-quiet-cake-65531216';
const BASE = 'https://console.neon.tech/api/v2';
const LIMITE_FREE = 100; // CU-hrs/mês do plano Free (linha de referência)

function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status: status || 200,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}

export async function onRequestGet(context) {
  const key = context.env.NEON_API_KEY;
  if (!key) {
    return json({ ok: false, erro: 'NEON_API_KEY não configurada no Cloudflare Pages.' }, 500);
  }

  const h = { Authorization: 'Bearer ' + key, Accept: 'application/json' };

  try {
    // Lista os projetos da organização. O objeto do projeto já traz o consumo
    // acumulado do período de faturamento corrente (compute_time_seconds etc.).
    const r = await fetch(
      `${BASE}/projects?org_id=${encodeURIComponent(ORG_ID)}&limit=200`,
      { headers: h }
    );
    if (!r.ok) {
      const txt = await r.text();
      return json({ ok: false, erro: `Neon respondeu ${r.status}`, detalhe: txt.slice(0, 300) }, 502);
    }
    const data = await r.json();
    const projetos = (data.projects || []).map((p) => {
      const computeSeg = Number(p.compute_time_seconds || 0);
      const storageBytes = Number(p.synthetic_storage_size || 0);
      return {
        nome: p.name || p.id,
        cuHrs: +(computeSeg / 3600).toFixed(2),
        storageMB: +(storageBytes / (1024 * 1024)).toFixed(1),
      };
    });
    projetos.sort((a, b) => b.cuHrs - a.cuHrs);

    const totalCuHrs = +projetos.reduce((s, p) => s + p.cuHrs, 0).toFixed(2);

    return json({
      ok: true,
      limiteFree: LIMITE_FREE,
      totalCuHrs,
      projetos,
      // reset da cota Neon é sempre dia 1º; o cliente calcula a projeção
      atualizadoEm: new Date().toISOString(),
    });
  } catch (e) {
    return json({ ok: false, erro: 'Falha ao consultar o Neon', detalhe: String(e).slice(0, 300) }, 500);
  }
}
