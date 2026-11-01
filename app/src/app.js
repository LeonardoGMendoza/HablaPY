window.__smStarted = true;
import { Professor, ehIOS, modoSom } from './professor.js';
import { boasVindas, respostaRapida, registrarVisita, registrarLicao } from './conversa.js';
import { ESTILO, NOME_PROF } from './estilo.js';
import { LICOES } from './conteudo/licoes.js';
import { notaPronuncia, comentario } from './pronuncia.js';
import { conversarIA, statusVip, assinarVip, recuperarVip, agendaAulas, planos, apiUrl } from './tutor.js';

const VOZ_LANG = { es: 'es-PY', pt: 'pt-BR' };

// ---------- estado (guardado no navegador) ----------
const ler = (k, padrao) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : padrao; } catch (e) { return padrao; } };
const gravar = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };

let perfil = ler('hp.perfil', null);
const novoPerfil = !perfil;
perfil = perfil || { id: 'a' + Math.random().toString(36).slice(2, 10), genero: 'mulher', nome: '', objetivo: 'medicina', email: '' };
perfil.univ = ESTILO.id;
let progresso = ler('hp.progresso', { pontos: 0, feitos: {}, pron: {} });
let vip = ler('hp.vip', { vip: false });
let plano = null, aulas = [];
let tela = novoPerfil ? 'config' : 'trilha';
let licao = null, aba = 'aula', quizIdx = 0, quizAcertos = 0, respondida = false, audioLiberado = false;
let repetindo = -1;           // índice da frase que o aluno está repetindo no microfone
const chat = [];              // conversa com a IA (tela "conversa" ou aba "praticar")

const $ = (s) => document.querySelector(s);
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const liberada = (l) => l.gratis || vip.vip;

// ---------- professor (avatar realista) ----------
const statusProf = (txt) => { $('#profStatus').textContent = txt || ''; };
let professor = null;
try { professor = new Professor($('#prof')); } catch (e) { console.error(e); statusProf('3D indisponível neste navegador.'); }

async function vestirProfessor() {
  if (!professor) return;
  document.documentElement.style.setProperty('--univ', ESTILO.scrub);
  statusProf('Carregando…');
  try {
    await professor.vestirE(perfil, ESTILO, (ev) => { if (ev.lengthComputable) statusProf(`Carregando… ${Math.round(ev.loaded / ev.total * 100)}%`); });
    statusProf('');
  } catch (e) { console.error(e); statusProf('⚠️'); }
}

// ---------- voz: espanhol com voz paraguaia, explicação com voz brasileira ----------
function escolherVoz(lang) {
  if (!('speechSynthesis' in window)) return null;
  const vozes = speechSynthesis.getVoices(), alvo = VOZ_LANG[lang];
  const fem = /female|mujer|mulher|paulina|luciana|francisca|helena|sabina|monica|tania|camila|maria|elena|google español|google português/i;
  const masc = /male|hombre|homem|jorge|diego|daniel|antonio|pablo|mario|alvaro|google/i;
  const gen = perfil.genero === 'mulher' ? fem : masc;
  const doIdioma = vozes.filter(v => v.lang.replace('_', '-').toLowerCase().startsWith(lang));
  const nota = (v) => (v.lang.replace('_', '-') === alvo ? 100 : 0) + (/es-(AR|UY|PY|419|MX|US)/.test(v.lang) ? 20 : 0) + (gen.test(v.name) ? 50 : 0) + (/natural|neural|online|premium|enhanced/i.test(v.name) ? 30 : 0);
  return doIdioma.sort((a, b) => nota(b) - nota(a))[0] || null;
}
if ('speechSynthesis' in window) speechSynthesis.getVoices();

let nuvemFalhou = false;
async function falarTrecho(texto, lang, id) {
  if (!texto || id !== filaFala) return false;
  if (ehIOS || !nuvemFalhou) {
    for (let tentativa = 0; tentativa < (ehIOS ? 2 : 1); tentativa++) {
      if (id !== filaFala) return false;
      try {
        await professor.falarNuvem(texto, apiUrl() + '/api/voz', { texto: texto.slice(0, 600), idioma: lang, genero: perfil.genero });
        return id === filaFala;
      } catch (e) { console.warn('voz da nuvem', e); await new Promise(r => setTimeout(r, 500)); }
    }
    if (!ehIOS) { nuvemFalhou = true; setTimeout(() => { nuvemFalhou = false; }, 30000); }
  }
  if (id !== filaFala) return false;
  await professor.falarComVoz(texto, { lang: VOZ_LANG[lang], voz: escolherVoz(lang) });
  return id === filaFala;
}

let filaFala = 0;
// fala = { es, pt } -> mostra as duas no balão e fala primeiro o espanhol, depois o português
async function falar(fala) {
  const id = ++filaFala;
  const balao = $('#balao');
  balao.hidden = false;
  balao.innerHTML = `${fala.es ? `<b class="es">${esc(fala.es)}</b>` : ''}${fala.pt ? `<span class="pt">${esc(fala.pt)}</span>` : ''}`;
  if (!professor || !audioLiberado) return true;
  professor.parar();
  modoSom('playback');
  if (fala.es && !(await falarTrecho(fala.es, 'es', id))) return false;
  if (fala.pt && fala.falarPt !== false && !(await falarTrecho(fala.pt, 'pt', id))) return false;
  return id === filaFala;
}
function calar() { filaFala++; professor && professor.parar(); }

function liberarAudio() { audioLiberado = true; professor && professor.liberarAudio(); }
document.addEventListener('click', liberarAudio, true);
document.addEventListener('touchend', liberarAudio, true);

let cumprimentou = false;
function cumprimentar() {
  if (cumprimentou) return;
  cumprimentou = true;
  liberarAudio();
  professor && professor.acenar();
  professor && professor.humor('feliz');
  falar(boasVindas(perfil));
}
document.addEventListener('click', (e) => {
  if (!cumprimentou && tela !== 'config' && e.target.closest('#palco') && !e.target.closest('#mic')) setTimeout(cumprimentar, 50);
}, true);

// ---------- telas ----------
function cabecalho() {
  $('#xp').textContent = `⭐ ${progresso.pontos} pontos`;
  const bv = $('#btnVip');
  bv.textContent = vip.vip ? '👑 VIP' : '👑 Seja VIP';
  bv.classList.toggle('ativo', !!vip.vip);
  $('#btnTrocar').hidden = tela === 'config';
}

function telaConfig() {
  const opt = (campo, valor, rotulo) => `<button type="button" class="opt" data-campo="${campo}" data-valor="${valor}" aria-pressed="${perfil[campo] === valor}">${rotulo}</button>`;
  return `
    <h2>Bem-vindo ao HablaPY 🇵🇾</h2>
    <p class="aviso">Espanhol de verdade para quem vai morar ou estudar no Paraguai, com uma professora de IA que conversa com você por voz.</p>
    <div class="campo"><label><span>Seu nome</span><input type="text" id="nome" maxlength="18" value="${esc(perfil.nome)}" autocomplete="given-name"></label></div>
    <div class="campo"><span>Quem vai te dar aula?</span><div class="seg">${opt('genero', 'mulher', `👩‍🏫 ${NOME_PROF.mulher}`)}${opt('genero', 'homem', `👨‍🏫 ${NOME_PROF.homem}`)}</div></div>
    <div class="campo"><span>Por que você vai para o Paraguai?</span><div class="seg">
      ${opt('objetivo', 'medicina', '🩺 Estudar medicina')}${opt('objetivo', 'morar', '🏠 Morar / trabalhar')}${opt('objetivo', 'turismo', '🧳 Viagem')}</div></div>
    <button type="button" class="btn prim" id="salvar">Começar →</button>`;
}

function cardLicao(l) {
  const feito = progresso.feitos[l.id];
  const bloqueada = !liberada(l);
  return `<button type="button" class="tema${bloqueada ? ' bloq' : ''}" data-licao="${l.id}">
    <span class="ic" aria-hidden="true">${l.icone}</span><b>${esc(l.titulo.pt)}</b>
    <span class="sub">${esc(l.titulo.es)} · ${l.nivel}</span>
    ${bloqueada ? '<span class="cadeado">🔒 VIP</span>' : feito != null ? `<span class="feito">✓ ${feito}/${l.quiz.length}</span>` : ''}</button>`;
}

function telaTrilha() {
  const proxAula = aulas.find(a => a.quando && Date.parse(a.quando) > Date.now() - 3600e3);
  return `
    <div class="linha-botoes topo">
      <button type="button" class="btn prim" id="irConversa">💬 Conversar com ${NOME_PROF[perfil.genero]}</button>
      <button type="button" class="btn" id="irVip">${vip.vip ? '📅 Aulas ao vivo' : '👑 Aulas ao vivo (VIP)'}</button>
    </div>
    ${proxAula ? `<div class="aviso">📅 Próxima aula ao vivo: <b>${esc(proxAula.titulo)}</b> — ${esc(dataBonita(proxAula.quando))}</div>` : ''}
    <h3>Trilha: Vou para o Paraguai</h3>
    <div class="temas">${LICOES.map(cardLicao).join('')}</div>`;
}

function chatHtml(vazio) {
  return `<div class="chat" id="chat">${chat.length ? chat.map(m => `<div class="msg ${m.quem}">
      ${m.es ? `<div class="es">${esc(m.es)}</div>` : ''}${m.pt ? `<div class="pt">${esc(m.pt)}</div>` : ''}
      ${m.correcao ? `<div class="correcao">✏️ ${esc(m.correcao)}</div>` : ''}${m.texto ? esc(m.texto) : ''}</div>`).join('') : `<p class="aviso">${vazio}</p>`}</div>
    <form class="perg" id="formPerg"><input id="txtPerg" type="text" placeholder="Escreva em espanhol (ou toque no microfone)" autocomplete="off" required><button class="btn prim" type="submit">Enviar</button></form>`;
}

function telaConversa() {
  return `<button type="button" class="btn" id="voltarTrilha">← Lições</button>
    <h2>💬 Conversa livre</h2>
    <p class="aviso">Fale do seu dia, da viagem, da faculdade… ${NOME_PROF[perfil.genero]} responde em espanhol, corrige seus erros em português e lembra de você na próxima vez.${vip.vip ? '' : ` Grátis: ${plano ? plano.limite_gratis : 15} mensagens por dia.`}</p>
    ${chatHtml('Toque no microfone e diga "¡Hola!" para começar.')}`;
}

function telaLicao() {
  const l = licao;
  const abas = [['aula', 'Aula'], ['quiz', 'Quiz'], ['praticar', 'Praticar com a IA']]
    .map(([a, n]) => `<button type="button" role="tab" data-aba="${a}" aria-selected="${aba === a}">${n}</button>`).join('');
  let corpo = '';
  if (aba === 'aula') {
    corpo = `<p class="aviso">${esc(l.intro)}</p>
      <p class="dica-uso">👆 Toque numa frase para ouvir. Toque em 🎤 para repetir e ganhar nota de pronúncia.</p>
      <ol class="pontos">${l.frases.map((f, i) => `<li data-i="${i}" tabindex="0">
        <div class="es">${esc(f.es)}</div><div class="pt">${esc(f.pt)}</div>
        ${f.dica ? `<div class="dica">💡 ${esc(f.dica)}</div>` : ''}
        <button type="button" class="repetir" data-rep="${i}" aria-label="Repetir esta frase">🎤</button>
        ${progresso.pron[l.id + ':' + i] != null ? `<span class="nota">${progresso.pron[l.id + ':' + i]}%</span>` : ''}</li>`).join('')}</ol>
      <div class="linha-botoes"><button type="button" class="btn prim" id="ouvir">🔊 Ouvir a aula</button>
      <button type="button" class="btn" id="irQuiz">Fazer o quiz →</button></div>`;
  } else if (aba === 'quiz') {
    if (quizIdx >= l.quiz.length) {
      corpo = `<p class="pergunta">Você acertou ${quizAcertos} de ${l.quiz.length}.</p>
        <div class="linha-botoes"><button type="button" class="btn prim" id="refazer">Refazer</button><button type="button" class="btn" data-aba="praticar">Praticar com a IA →</button></div>`;
    } else {
      const q = l.quiz[quizIdx];
      corpo = `<div class="progresso">${quizIdx + 1} / ${l.quiz.length}</div>
        <p class="pergunta">${esc(q.p)}</p>
        <div class="opcoes">${q.o.map((op, i) => `<button type="button" class="opcao" data-i="${i}">${esc(op)}</button>`).join('')}</div>
        <div id="explica"></div>`;
    }
  } else {
    corpo = `<p class="aviso">🎭 <b>Situação:</b> ${esc(l.cena.pt)}</p>${chatHtml('Toque no microfone ou escreva para responder.')}`;
  }
  return `<button type="button" class="btn" id="voltarTrilha">← Lições</button>
    <h2>${l.icone} ${esc(l.titulo.pt)}</h2><div class="abas" role="tablist">${abas}</div>${corpo}`;
}

const dataBonita = (iso) => { try { return new Date(iso).toLocaleString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }); } catch (e) { return iso; } };

function telaVip() {
  const preco = plano ? `R$ ${Number(plano.preco).toFixed(2).replace('.', ',')}/mês` : '';
  const lista = aulas.length ? `<ul class="aulas">${aulas.map(a => `<li><b>${esc(a.titulo)}</b><span>${esc(dataBonita(a.quando))}${a.descricao ? ' · ' + esc(a.descricao) : ''}</span>
      ${a.link ? `<a class="btn prim mini" href="${esc(a.link)}" target="_blank" rel="noopener">Entrar na aula</a>` : '<span class="cadeado">🔒 só VIP</span>'}</li>`).join('')}</ul>`
    : '<p class="aviso">Nenhuma aula ao vivo marcada ainda. Assim que o professor marcar, ela aparece aqui.</p>';
  if (vip.vip) {
    return `<button type="button" class="btn" id="voltarTrilha">← Lições</button>
      <h2>👑 Você é VIP</h2>
      <p class="aviso">Todas as lições liberadas, conversa sem limite com a IA e aulas ao vivo com o professor.</p>
      <h3>Aulas ao vivo</h3>${lista}`;
  }
  return `<button type="button" class="btn" id="voltarTrilha">← Lições</button>
    <h2>👑 HablaPY VIP ${preco ? `<small class="preco">${preco}</small>` : ''}</h2>
    <ul class="beneficios">
      <li>🎥 Aulas ao vivo com professor nativo (espanhol e guarani do Paraguai)</li>
      <li>📚 Todas as lições: documentos, faculdade, farmácia, espanhol médico e guarani</li>
      <li>💬 Conversa ilimitada com a professora de IA</li>
      <li>❌ Cancele quando quiser pelo Mercado Pago</li>
    </ul>
    <div class="campo"><label><span>Seu e-mail (o mesmo do Mercado Pago)</span><input type="email" id="email" value="${esc(perfil.email || '')}" autocomplete="email" placeholder="voce@email.com"></label></div>
    <div class="linha-botoes"><button type="button" class="btn prim" id="assinar">Assinar com Pix ou cartão</button>
    <button type="button" class="btn" id="jaSou">Já sou VIP neste e-mail</button></div>
    <p class="msg-vip" id="msgVip" aria-live="polite"></p>
    <h3>Próximas aulas ao vivo</h3>${lista}`;
}

function render() {
  cabecalho();
  const telas = { config: telaConfig, trilha: telaTrilha, licao: telaLicao, conversa: telaConversa, vip: telaVip };
  $('#painel').innerHTML = (telas[tela] || telaTrilha)();
  ligar();
  const c = $('#chat'); if (c && c.lastElementChild) c.lastElementChild.scrollIntoView({ block: 'nearest' });
}

// ---------- aula ----------
async function ouvirFrase(i) {
  const f = licao.frases[i];
  document.querySelectorAll('.pontos li').forEach(li => li.classList.toggle('atual', +li.dataset.i === i));
  const li = document.querySelector(`.pontos li[data-i="${i}"]`); if (li) li.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  return falar({ es: f.es, pt: f.pt });
}

function abrirLicao(id) {
  const l = LICOES.find(x => x.id === id);
  if (!liberada(l)) { abrirVip(); falar({ es: '¡Esta lección es VIP!', pt: 'Assine o VIP para liberar esta lição e as aulas ao vivo.', falarPt: true }); return; }
  licao = l; registrarLicao(id);
  tela = 'licao'; aba = 'aula'; quizIdx = 0; quizAcertos = 0; repetindo = -1; chat.length = 0;
  render();
  falar({ es: `Vamos con: ${l.titulo.es}.`, pt: l.intro });
}

async function abrirVip() {
  tela = 'vip'; render();
  const [p, s, a] = await Promise.all([planos(), statusVip(perfil), agendaAulas(perfil)]);
  if (p) plano = p;
  if (s && !s.offline) { vip = s; gravar('hp.vip', vip); }
  aulas = (a && a.aulas) || [];
  if (tela === 'vip') render();
}

// ---------- conversa com a IA ----------
async function mandarParaIA(texto) {
  chat.push({ quem: 'eu', texto });
  render();
  const rapida = !apiUrl() ? respostaRapida(texto, perfil) : null;
  if (rapida) { chat.push({ quem: 'ia', ...rapida }); render(); return falar(rapida); }
  estadoMic('pensando');
  const r = await conversarIA({ texto, perfil, licao: aba === 'praticar' ? licao : null });
  estadoMic('pronto');
  if (r.limite) {
    const fala = { es: '¡Llegaste al límite de hoy!', pt: 'As mensagens grátis de hoje acabaram. Volte amanhã ou assine o VIP para conversar sem limite.' };
    chat.push({ quem: 'ia', ...fala }); render(); return falar(fala);
  }
  if (!r.resposta) {
    const local = respostaRapida(texto, perfil) || { es: 'Perdón, no te escuché bien.', pt: 'Estou sem conexão com o servidor agora. Tente de novo em instantes.' };
    chat.push({ quem: 'ia', ...local }); render(); return falar(local);
  }
  if (r.vip !== undefined && r.vip !== vip.vip) { vip.vip = r.vip; gravar('hp.vip', vip); }
  chat.push({ quem: 'ia', es: r.resposta, pt: r.traducao, correcao: r.correcao });
  render();
  professor && professor.humor(r.humor || 'neutro');
  // fala a resposta em espanhol e, se houver, a correção em português
  return falar({ es: r.resposta, pt: r.correcao || '' });
}

// ---------- eventos ----------
function ligar() {
  document.querySelectorAll('[data-campo]').forEach(b => b.onclick = async () => {
    perfil[b.dataset.campo] = b.dataset.valor; render();
    if (b.dataset.campo === 'genero') await vestirProfessor();
  });
  const nome = $('#nome'); if (nome) nome.oninput = () => { perfil.nome = nome.value.trim(); };
  const salvar = $('#salvar');
  if (salvar) salvar.onclick = async () => {
    liberarAudio(); gravar('hp.perfil', perfil);
    tela = 'trilha'; render();
    await vestirProfessor();
    cumprimentou = false; cumprimentar();
  };

  document.querySelectorAll('[data-licao]').forEach(b => b.onclick = () => { liberarAudio(); calar(); abrirLicao(b.dataset.licao); });
  const vt = $('#voltarTrilha'); if (vt) vt.onclick = () => { calar(); tela = 'trilha'; repetindo = -1; render(); };
  const ic = $('#irConversa'); if (ic) ic.onclick = () => { calar(); tela = 'conversa'; licao = null; aba = ''; chat.length = 0; render(); if (!cumprimentou) cumprimentar(); };
  const iv = $('#irVip'); if (iv) iv.onclick = () => { calar(); abrirVip(); };

  document.querySelectorAll('[data-aba]').forEach(b => b.onclick = () => {
    calar(); aba = b.dataset.aba; repetindo = -1;
    if (aba === 'quiz') { quizIdx = 0; quizAcertos = 0; respondida = false; }
    if (aba === 'praticar') chat.length = 0;
    render();
    if (aba === 'quiz') lerPergunta();
    if (aba === 'praticar') { chat.push({ quem: 'ia', es: licao.cena.inicio }); render(); falar({ es: licao.cena.inicio, pt: 'Responda em espanhol, pelo microfone ou escrevendo.' }); }
  });
  document.querySelectorAll('.pontos li').forEach(li => {
    li.onclick = (e) => { if (e.target.closest('.repetir')) return; calar(); repetindo = -1; ouvirFrase(+li.dataset.i); };
    li.onkeydown = (e) => { if (e.key === 'Enter') li.click(); };
  });
  document.querySelectorAll('.repetir').forEach(b => b.onclick = async (e) => {
    e.stopPropagation(); liberarAudio(); calar();
    repetindo = +b.dataset.rep;
    document.querySelectorAll('.pontos li').forEach(li => li.classList.toggle('atual', +li.dataset.i === repetindo));
    await falar({ es: licao.frases[repetindo].es, pt: 'Agora repita depois do sinal.', falarPt: true });
    ouvir();
  });

  const ouvirBtn = $('#ouvir');
  if (ouvirBtn) ouvirBtn.onclick = async () => {
    if (ouvirBtn.dataset.tocando) { calar(); delete ouvirBtn.dataset.tocando; ouvirBtn.textContent = '🔊 Ouvir a aula'; return; }
    ouvirBtn.dataset.tocando = '1'; ouvirBtn.textContent = '⏹ Parar';
    for (let i = 0; i < licao.frases.length; i++) {
      const continua = await ouvirFrase(i);
      if (continua === false || !ouvirBtn.dataset.tocando) break;
    }
    document.querySelectorAll('.pontos li').forEach(li => li.classList.remove('atual'));
    professor && professor.gesto('thumbup', 2);
    delete ouvirBtn.dataset.tocando; ouvirBtn.textContent = '🔊 Ouvir a aula';
  };
  const irQuiz = $('#irQuiz'); if (irQuiz) irQuiz.onclick = () => { calar(); aba = 'quiz'; quizIdx = 0; quizAcertos = 0; respondida = false; render(); lerPergunta(); };
  const refazer = $('#refazer'); if (refazer) refazer.onclick = () => { quizIdx = 0; quizAcertos = 0; respondida = false; render(); lerPergunta(); };

  document.querySelectorAll('.opcao').forEach(b => b.onclick = () => {
    if (respondida) return;
    respondida = true;
    const q = licao.quiz[quizIdx], i = +b.dataset.i, ok = i === q.c;
    document.querySelectorAll('.opcao').forEach(o => { o.disabled = true; if (+o.dataset.i === q.c) o.classList.add('certa'); });
    if (!ok) b.classList.add('errada');
    if (ok) { quizAcertos++; progresso.pontos += 10; professor && professor.humor('feliz'); professor && professor.gesto('thumbup', 2); }
    else { professor && professor.humor('carinho'); }
    $('#explica').innerHTML = `<div class="explica">${ok ? '¡Correcto! ' : 'Casi. '}${esc(q.e)}</div><div class="linha-botoes"><button type="button" class="btn prim" id="proxima">Próxima →</button></div>`;
    $('#proxima').onclick = () => {
      quizIdx++; respondida = false; professor && professor.humor('neutro');
      if (quizIdx >= licao.quiz.length) {
        progresso.feitos[licao.id] = Math.max(progresso.feitos[licao.id] || 0, quizAcertos);
        gravar('hp.progresso', progresso);
        render(); falar({ es: quizAcertos === licao.quiz.length ? '¡Perfecto!' : '¡Bien hecho!', pt: `Você acertou ${quizAcertos} de ${licao.quiz.length}.` });
      } else { render(); lerPergunta(); }
    };
    cabecalho(); gravar('hp.progresso', progresso);
    falar({ es: ok ? '¡Correcto!' : 'Casi.', pt: q.e });
  });

  const form = $('#formPerg');
  if (form) form.onsubmit = (e) => {
    e.preventDefault();
    const texto = $('#txtPerg').value.trim();
    if (texto) { liberarAudio(); calar(); mandarParaIA(texto); }
  };

  const email = $('#email'); if (email) email.oninput = () => { perfil.email = email.value.trim(); gravar('hp.perfil', perfil); };
  const msg = (t) => { const m = $('#msgVip'); if (m) m.textContent = t; };
  const emailOk = () => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(perfil.email || '');
  const assinar = $('#assinar');
  if (assinar) assinar.onclick = async () => {
    if (!emailOk()) return msg('Digite um e-mail válido.');
    assinar.disabled = true; msg('Abrindo o Mercado Pago…');
    try { const r = await assinarVip(perfil, perfil.email); location.href = r.url; }
    catch (e) { msg('Não consegui abrir o pagamento agora: ' + e.message); assinar.disabled = false; }
  };
  const jaSou = $('#jaSou');
  if (jaSou) jaSou.onclick = async () => {
    if (!emailOk()) return msg('Digite o e-mail que você usou na assinatura.');
    try {
      const r = await recuperarVip(perfil, perfil.email);
      vip = r; gravar('hp.vip', vip);
      if (r.vip) { msg('VIP liberado neste aparelho! 🎉'); abrirVip(); } else msg('Não encontrei assinatura ativa nesse e-mail.');
    } catch (e) { msg(e.message); }
  };
}

function lerPergunta() {
  if (licao && quizIdx < licao.quiz.length) falar({ es: '', pt: licao.quiz[quizIdx].p });
}

$('#btnTrocar').onclick = () => { calar(); tela = 'config'; render(); };
$('#btnVip').onclick = () => { liberarAudio(); calar(); abrirVip(); };

// ---------- microfone ----------
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
let rec = null, ouvindo = false, ouvido = '';
function estadoMic(e) {
  $('#mic').dataset.estado = e;
  $('#dicaVoz').textContent = e === 'ouvindo' ? (repetindo >= 0 ? 'Repita agora…' : 'Te escucho…') : e === 'pensando' ? 'Pensando…' : (cumprimentou ? 'Toque e fale' : 'Toque para começar');
}

async function voceDisse(texto) {
  texto = (texto || '').trim();
  estadoMic('pronto');
  if (!texto) return;
  if (repetindo >= 0 && licao) {   // modo pronúncia
    const i = repetindo; repetindo = -1;
    const { nota, faltando } = notaPronuncia(licao.frases[i].es, texto);
    const chave = licao.id + ':' + i;
    progresso.pron[chave] = Math.max(progresso.pron[chave] || 0, nota);
    if (nota >= 70) progresso.pontos += 5;
    gravar('hp.progresso', progresso);
    const c = comentario(nota);
    professor && professor.humor(c.humor);
    if (nota >= 90) professor && professor.gesto('thumbup', 2);
    render();
    return falar({ es: `${c.es}`, pt: `Nota ${nota}. Eu entendi: "${texto}".${faltando.length && nota < 90 ? ' Treine: ' + faltando.slice(0, 3).join(', ') + '.' : ''}` });
  }
  if (tela === 'licao' && aba !== 'praticar') { aba = 'praticar'; chat.length = 0; }
  if (tela !== 'licao' && tela !== 'conversa') { tela = 'conversa'; chat.length = 0; }
  return mandarParaIA(texto);
}

function ouvir() {
  if (!rec) { $('#balao').hidden = false; $('#balao').textContent = 'Este navegador não ouve a voz. Use o Chrome ou o Safari.'; return; }
  try { modoSom('play-and-record'); rec.lang = 'es-PY'; ouvido = ''; rec.start(); ouvindo = true; estadoMic('ouvindo'); }
  catch (er) { $('#dicaVoz').textContent = 'Não entendi. Toque e fale de novo.'; }
}

if (SR) {
  rec = new SR(); rec.interimResults = true; rec.continuous = false;
  rec.onresult = (e) => {
    let txt = '', final = false;
    for (const r of e.results) { txt += r[0].transcript; if (r.isFinal) final = true; }
    ouvido = txt;
    $('#balao').hidden = false; $('#balao').textContent = '🎤 ' + txt;
    if (final) { ouvindo = false; try { rec.abort(); } catch (er) {} modoSom('playback'); const fala = ouvido; ouvido = ''; voceDisse(fala); }
  };
  rec.onerror = (e) => { modoSom('playback'); ouvindo = false; ouvido = ''; estadoMic('pronto'); if (e.error === 'not-allowed') $('#dicaVoz').textContent = 'Libere o microfone no cadeado da barra de endereço.'; };
  rec.onend = () => { modoSom('playback'); if (!ouvindo) return; ouvindo = false; if (ouvido) { const f = ouvido; ouvido = ''; voceDisse(f); } else { repetindo = -1; estadoMic('pronto'); } };
}
$('#mic').onclick = (e) => {
  e.stopPropagation();
  liberarAudio();
  if (!cumprimentou && tela !== 'config') { cumprimentar(); estadoMic('pronto'); return; }
  if ($('#mic').dataset.estado === 'pensando') return;
  if (ouvindo) { try { rec.stop(); } catch (er) {} return; }
  calar();
  ouvir();
};

// ---------- início ----------
render();
estadoMic('pronto');
vestirProfessor();
registrarVisita();
if (!novoPerfil) { const b = boasVindas(perfil); $('#balao').hidden = false; $('#balao').innerHTML = `<b class="es">${esc(b.es)}</b><span class="pt">${esc(b.pt)}</span>`; }
// volta do Mercado Pago: confere o VIP
const voltouPagamento = /[?&](vip|status|preapproval_id)=/.test(location.search);
Promise.all([planos(), statusVip(perfil), agendaAulas(perfil)]).then(([p, s, a]) => {
  if (p) plano = p;
  if (s && !s.offline) { vip = s; gravar('hp.vip', vip); }
  aulas = (a && a.aulas) || [];
  if (voltouPagamento) { abrirVip(); history.replaceState(null, '', location.pathname); }
  else if (tela === 'trilha') render();
});
