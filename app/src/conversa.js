// Memória do aluno no aparelho + frases da professora que não precisam da IA (boas-vindas, cumprimentos).
// Cada fala tem a parte em espanhol (falada com voz espanhola) e a explicação em português.
import { LICOES } from './conteudo/licoes.js';
import { NOME_PROF } from './estilo.js';

const ler = (k, p) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : p; } catch (e) { return p; } };
const gravar = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };

export function memoria() {
  return ler('hp.memoria', { visitas: 0, ultimaVisita: 0, ultimaLicao: '' });
}
export function registrarVisita() {
  const m = memoria();
  if (Date.now() - (m.ultimaVisita || 0) > 30 * 60 * 1000) m.visitas = (m.visitas || 0) + 1;
  m.ultimaVisita = Date.now();
  gravar('hp.memoria', m);
}
export function registrarLicao(id) {
  const m = memoria();
  m.ultimaLicao = id;
  gravar('hp.memoria', m);
}

const titulo = (id) => { const l = LICOES.find(x => x.id === id); return l ? l.titulo.pt : ''; };

export function boasVindas(perfil) {
  const m = memoria(), nome = perfil.nome ? ', ' + perfil.nome : '', eu = NOME_PROF[perfil.genero];
  if (m.visitas > 1 && m.ultimaLicao) {
    return {
      es: `¡Hola${nome}! ¡Qué bueno verte otra vez!`,
      pt: `Da última vez a gente estudou "${titulo(m.ultimaLicao)}". Vamos continuar ou praticar conversação?`
    };
  }
  return {
    es: `¡Hola${nome}! Soy ${eu}, tu ${perfil.genero === 'mulher' ? 'profesora' : 'profesor'} de español.`,
    pt: 'Vou te preparar para a vida no Paraguai. Escolha uma lição ou toque no microfone e fale comigo, em espanhol ou em português.'
  };
}

const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[¿¡!?.,;:]/g, ' ').replace(/\s+/g, ' ').trim();

// Respostas rápidas sem servidor. Devolve null quando é para a IA responder.
export function respostaRapida(texto, perfil) {
  const n = norm(texto), nome = perfil.nome ? ', ' + perfil.nome : '';
  if (/^(hola|oi|ola|buenas|buenos dias|buenas tardes|buenas noches|bom dia|boa tarde|boa noite)\b/.test(n) && n.split(' ').length <= 4) {
    return { es: `¡Hola${nome}! ¿Cómo estás?`, pt: 'Responda em espanhol: "Estoy bien, gracias. ¿Y vos?"' };
  }
  if (/^(estoy bien|bien|muy bien|todo bien)\b/.test(n) && n.split(' ').length <= 6) {
    return { es: '¡Qué bueno! ¿Qué querés practicar hoy?', pt: 'Pode escolher uma lição ou continuar conversando.' };
  }
  if (/(gracias|obrigad|aguyje)/.test(n)) return { es: '¡De nada! Para eso estoy.', pt: '' };
  if (/(chau|adios|hasta luego|tchau|ate logo)/.test(n)) return { es: `¡Chau${nome}! ¡Nos vemos!`, pt: 'Bons estudos!' };
  return null;
}
