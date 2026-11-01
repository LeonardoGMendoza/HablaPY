// Fala com o servidor do HablaPY: tutor de IA (Oracle), status VIP, assinatura (Mercado Pago) e agenda das aulas ao vivo.
const API_BUILD = (import.meta.env && import.meta.env.VITE_API_URL) || 'https://hablapy.sandlj.com.br';

export function apiUrl() {
  const q = new URLSearchParams(location.search).get('api');
  if (q) { try { localStorage.setItem('hp.api', q); } catch (e) {} return q.replace(/\/$/, ''); }
  try { return (localStorage.getItem('hp.api') || API_BUILD).replace(/\/$/, ''); } catch (e) { return API_BUILD; }
}

async function chamar(caminho, opcoes = {}) {
  const r = await fetch(apiUrl() + caminho, {
    method: opcoes.metodo || (opcoes.corpo ? 'POST' : 'GET'),
    headers: opcoes.corpo ? { 'Content-Type': 'application/json' } : {},
    body: opcoes.corpo ? JSON.stringify(opcoes.corpo) : undefined
  });
  let dados = null;
  try { dados = await r.json(); } catch (e) { /* sem corpo */ }
  if (!r.ok) {
    const erro = new Error((dados && dados.detail) || ('HTTP ' + r.status));
    erro.status = r.status;
    throw erro;
  }
  return dados;
}

// Conversa com a professora de IA. cena = situação de prática da lição (opcional).
export async function conversarIA({ texto, perfil, licao, idioma }) {
  try {
    return await chamar('/api/tutor', {
      corpo: {
        aluno: perfil.id, nome: perfil.nome || '', texto, genero: perfil.genero, objetivo: perfil.objetivo || '',
        licao: licao ? licao.id : '', cena: licao ? licao.cena.pt : '', idioma: idioma || 'pt'
      }
    });
  } catch (e) {
    if (e.status === 402) return { limite: true, resposta: null };
    return { resposta: null, erro: true };
  }
}

export const statusVip = (perfil) => chamar('/api/vip/' + encodeURIComponent(perfil.id)).catch(() => ({ vip: false, offline: true }));
export const assinarVip = (perfil, email) => chamar('/api/vip/assinar', { corpo: { aluno: perfil.id, email, nome: perfil.nome || '' } });
export const recuperarVip = (perfil, email) => chamar('/api/vip/recuperar', { corpo: { aluno: perfil.id, email } });
export const agendaAulas = (perfil) => chamar('/api/aulas?aluno=' + encodeURIComponent(perfil.id)).catch(() => ({ aulas: [], offline: true }));
export const planos = () => chamar('/api/vip/plano').catch(() => null);
