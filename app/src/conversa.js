// Memória do aluno no aparelho + falas da professora que não precisam da IA (boas-vindas, cumprimentos).
// Cada fala: { es } em espanhol (voz paraguaia) + { apoio } no idioma do aluno (pt/en/es).
import { LICOES } from './conteudo/licoes.js';
import { NOME_PROF } from './estilo.js';
import { tx } from './i18n.js';

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

const titulo = (id, idioma) => { const l = LICOES.find(x => x.id === id); return l ? tx(l.titulo, idioma) : ''; };

export function boasVindas(perfil, idioma) {
  const m = memoria(), nome = perfil.nome ? ', ' + perfil.nome : '', eu = NOME_PROF[perfil.genero];
  const prof = perfil.genero === 'mulher' ? 'profesora' : 'profesor';
  if (m.visitas > 1 && m.ultimaLicao) {
    const t = titulo(m.ultimaLicao, idioma);
    return {
      es: `¡Hola${nome}! ¡Qué bueno verte otra vez!`,
      apoio: {
        pt: `Da última vez a gente estudou "${t}". Vamos continuar ou praticar conversação?`,
        en: `Last time we studied "${t}". Shall we continue or practice conversation?`,
        es: `La última vez estudiamos "${t}". ¿Seguimos o practicamos conversación?`
      }[idioma]
    };
  }
  return {
    es: `¡Hola${nome}! Soy ${eu}, tu ${prof} de español.`,
    apoio: {
      pt: 'Vou te preparar para a vida no Paraguai. Escolha uma lição ou toque no microfone e fale comigo.',
      en: "I'll get you ready for life in Paraguay. Pick a lesson or tap the microphone and talk to me.",
      es: 'Te voy a preparar para vivir en Paraguay. Elegí una lección o tocá el micrófono y hablá conmigo.'
    }[idioma]
  };
}

const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[¿¡!?.,;:]/g, ' ').replace(/\s+/g, ' ').trim();

// Respostas rápidas quando o servidor não responde. Devolve null quando não sabe.
export function respostaRapida(texto, perfil, idioma) {
  const n = norm(texto), nome = perfil.nome ? ', ' + perfil.nome : '';
  const A = (pt, en, es) => ({ pt, en, es }[idioma]);
  if (/^(hola|oi|ola|hello|hi|buenas|buenos dias|buenas tardes|buenas noches|bom dia|boa tarde|boa noite)\b/.test(n) && n.split(' ').length <= 4) {
    return { es: `¡Hola${nome}! ¿Cómo estás?`, apoio: A('Responda em espanhol: "Estoy bien, gracias. ¿Y vos?"', 'Answer in Spanish: "Estoy bien, gracias. ¿Y vos?"', 'Respondé: "Estoy bien, gracias. ¿Y vos?"') };
  }
  if (/^(estoy bien|bien|muy bien|todo bien)\b/.test(n) && n.split(' ').length <= 6) {
    return { es: '¡Qué bueno! ¿Qué querés practicar hoy?', apoio: A('Pode escolher uma lição ou continuar conversando.', 'Pick a lesson or keep talking.', 'Elegí una lección o seguimos charlando.') };
  }
  if (/(gracias|obrigad|thank|aguyje)/.test(n)) return { es: '¡De nada! Para eso estoy.', apoio: '' };
  if (/(chau|adios|hasta luego|tchau|ate logo|bye)/.test(n)) return { es: `¡Chau${nome}! ¡Nos vemos!`, apoio: '' };
  return null;
}
