window.__smStarted = true;
import { Professor, ehIOS, modoSom } from './professor.js';
import { boasVindas, respostaRapida, registrarVisita, registrarLicao } from './conversa.js';
import { ESTILO, NOME_PROF } from './estilo.js';
import { LICOES } from './conteudo/licoes.js';
import { notaPronuncia, comentario } from './pronuncia.js';
import { conversarIA, statusVip, assinarVip, recuperarVip, agendaAulas, planos, apiUrl } from './tutor.js';
import { T, tx, ORDEM, VOZ_LANG } from './i18n.js';

// ---------- estado (guardado no navegador) ----------
const ler = (k, padrao) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : padrao; } catch (e) { return padrao; } };
const gravar = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };

const doNavegador = (navigator.language || 'pt').slice(0, 2);
let idioma = ler('hp.idioma', ORDEM.includes(doNavegador) ? doNavegador : 'pt');   // idioma do ALUNO (tela e explicações)
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
const t = () => T[idioma];
const L = (v) => tx(v, idioma);
const traducao = (f) => (idioma === 'es' ? '' : L(f.tr));   // em espanhol (imersão) não mostra tradução
const liberada = (l) => l.gratis || vip.vip;

// ---------- professor (avatar realista) ----------
const statusProf = (txt) => { $('#profStatus').textContent = txt || ''; };
let professor = null;
try { professor = new Professor($('#prof')); } catch (e) { console.error(e); statusProf('3D indisponível neste navegador.'); }

async function vestirProfessor() {
  if (!professor) return;
  document.documentElement.style.setProperty('--univ', ESTILO.scrub);
  statusProf(t().carregando);
  try {
    await professor.vestirE(perfil, ESTILO, (ev) => { if (ev.lengthComputable) statusProf(`${t().carregando} ${Math.round(ev.loaded / ev.total * 100)}%`); });
    statusProf('');
  } catch (e) { console.error(e); statusProf('⚠️'); }
}

// ---------- voz: espanhol com voz paraguaia; a explicação com a voz do idioma do aluno ----------
function escolherVoz(lang) {
  if (!('speechSynthesis' in window)) return null;
  const vozes = speechSynthesis.getVoices(), alvo = VOZ_LANG[lang];
  const fem = /female|mujer|mulher|paulina|luciana|francisca|helena|sabina|monica|tania|camila|maria|elena|jenny|aria|samantha|zira|google español|google português|google us english/i;
  const masc = /male|hombre|homem|jorge|diego|daniel|antonio|pablo|mario|alvaro|guy|david|alex/i;
  const gen = perfil.genero === 'mulher' ? fem : masc;
  const doIdioma = vozes.filter(v => v.lang.replace('_', '-').toLowerCase().startsWith(lang));
  const nota = (v) => (v.lang.replace('_', '-') === alvo ? 100 : 0) + (/es-(AR|UY|PY|419|MX|US)/.test(v.lang) ? 20 : 0) + (gen.test(v.name) ? 50 : 0) + (/natural|neural|online|premium|enhanced/i.test(v.name) ? 30 : 0);
  return doIdioma.sort((a, b) => nota(b) - nota(a))[0] || null;
}
if ('speechSynthesis' in window) speechSynthesis.getVoices();

// Voz neural da nuvem: primeiro o servidor do HablaPY; se falhar, o do StudentMedical (mesmas vozes).
// No iPhone é ela que toca ALTO depois do microfone (pelo <audio>, canal de mídia); a voz do aparelho fica baixinha.
const VOZES_NUVEM = () => [apiUrl() + '/api/voz', 'https://studentmedical.sandlj.com.br/api/voz'];
let nuvemFalhou = false;
async function falarTrecho(texto, lang, id) {
  if (!texto || id !== filaFala) return false;
  if (ehIOS || !nuvemFalhou) {
    for (let tentativa = 0; tentativa < (ehIOS ? 2 : 1); tentativa++) {
      for (const url of VOZES_NUVEM()) {
        if (id !== filaFala) return false;
        try {
          await professor.falarNuvem(texto, url, { texto: texto.slice(0, 600), idioma: lang, genero: perfil.genero });
          return id === filaFala;
        } catch (e) { console.warn('voz da nuvem falhou em', url, e); }
      }
      await new Promise(r => setTimeout(r, 500));
    }
    if (!ehIOS) { nuvemFalhou = true; setTimeout(() => { nuvemFalhou = false; }, 30000); }
  }
  if (id !== filaFala) return false;
  await professor.falarComVoz(texto, { lang: VOZ_LANG[lang], voz: escolherVoz(lang) });
  return id === filaFala;
}

let filaFala = 0;
// fala = { es, apoio } -> mostra os dois no balão e fala primeiro o espanhol, depois o apoio no idioma do aluno
async function falar(fala) {
  const id = ++filaFala;
  const balao = $('#balao');
  balao.hidden = false;
  balao.innerHTML = `${fala.es ? `<b class="es">${esc(fala.es)}</b>` : ''}${fala.apoio ? `<span class="pt">${esc(fala.apoio)}</span>` : ''}`;
  if (!professor || !audioLiberado) return true;
  professor.parar();
  modoSom('playback');
  if (fala.es && !(await falarTrecho(fala.es, 'es', id))) return false;
  if (fala.apoio && !(await falarTrecho(fala.apoio, idioma, id))) return false;
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
  falar(boasVindas(perfil, idioma));
}
document.addEventListener('click', (e) => {
  if (!cumprimentou && tela !== 'config' && e.target.closest('#palco') && !e.target.closest('#mic')) setTimeout(cumprimentar, 50);
}, true);

// ---------- telas ----------
function cabecalho() {
  document.documentElement.lang = idioma === 'pt' ? 'pt-BR' : idioma;
  $('#lema').textContent = t().lema;
  $('#xp').textContent = `⭐ ${progresso.pontos} ${t().pontos}`;
  const bv = $('#btnVip');
  bv.textContent = vip.vip ? t().vip : t().serVip;
  bv.classList.toggle('ativo', !!vip.vip);
  $('#btnTrocar').hidden = tela === 'config';
  $('#btnTrocar').title = t().config;
  $('#btnIdioma').textContent = idioma.toUpperCase();
  $('#btnIdioma').setAttribute('aria-label', `${t().idioma}: ${idioma.toUpperCase()}`);
}

function telaConfig() {
  const x = t();
  const opt = (campo, valor, rotulo) => `<button type="button" class="opt" data-campo="${campo}" data-valor="${valor}" aria-pressed="${perfil[campo] === valor}">${rotulo}</button>`;
  return `
    <h2>${x.bemVindo}</h2>
    <p class="aviso">${x.apresenta}</p>
    <div class="campo"><span>${x.idioma}</span><div class="seg">
      ${ORDEM.map(l => `<button type="button" class="opt" data-idioma="${l}" aria-pressed="${idioma === l}">${{ pt: '🇧🇷 Português', es: '🇵🇾 Español', en: '🇺🇸 English' }[l]}</button>`).join('')}</div></div>
    <div class="campo"><label><span>${x.seuNome}</span><input type="text" id="nome" maxlength="18" value="${esc(perfil.nome)}" autocomplete="given-name"></label></div>
    <div class="campo"><span>${x.quemDa}</span><div class="seg">${opt('genero', 'mulher', `👩‍🏫 ${NOME_PROF.mulher}`)}${opt('genero', 'homem', `👨‍🏫 ${NOME_PROF.homem}`)}</div></div>
    <div class="campo"><span>${x.porque}</span><div class="seg">
      ${opt('objetivo', 'medicina', x.medicina)}${opt('objetivo', 'morar', x.morar)}${opt('objetivo', 'turismo', x.turismo)}</div></div>
    <button type="button" class="btn prim" id="salvar">${x.comecarBtn}</button>`;
}

function cardLicao(l) {
  const feito = progresso.feitos[l.id];
  const bloqueada = !liberada(l);
  const sub = idioma === 'es' ? l.nivel : `${esc(l.titulo.es)} · ${l.nivel}`;
  return `<button type="button" class="tema${bloqueada ? ' bloq' : ''}" data-licao="${l.id}">
    <span class="ic" aria-hidden="true">${l.icone}</span><b>${esc(L(l.titulo))}</b>
    <span class="sub">${sub}</span>
    ${bloqueada ? '<span class="cadeado">🔒 VIP</span>' : feito != null ? `<span class="feito">✓ ${feito}/${l.quiz.length}</span>` : ''}</button>`;
}

const dataBonita = (iso) => { try { return new Date(iso).toLocaleString({ pt: 'pt-BR', es: 'es-PY', en: 'en-US' }[idioma], { weekday: 'short', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }); } catch (e) { return iso; } };

function telaTrilha() {
  const x = t();
  const proxAula = aulas.find(a => a.quando && Date.parse(a.quando) > Date.now() - 3600e3);
  return `
    <div class="linha-botoes topo">
      <button type="button" class="btn prim" id="irConversa">${x.conversarCom(NOME_PROF[perfil.genero])}</button>
      <button type="button" class="btn" id="irVip">${vip.vip ? x.aulasVivo : x.aulasVivoVip}</button>
    </div>
    ${proxAula ? `<div class="aviso">📅 ${x.proxima}: <b>${esc(proxAula.titulo)}</b> — ${esc(dataBonita(proxAula.quando))}</div>` : ''}
    <h3>${x.trilha}</h3>
    <div class="temas">${LICOES.map(cardLicao).join('')}</div>`;
}

function chatHtml(vazio) {
  return `<div class="chat" id="chat">${chat.length ? chat.map(m => `<div class="msg ${m.quem}">
      ${m.es ? `<div class="es">${esc(m.es)}</div>` : ''}${m.apoio ? `<div class="pt">${esc(m.apoio)}</div>` : ''}
      ${m.correcao ? `<div class="correcao">✏️ ${esc(m.correcao)}</div>` : ''}${m.texto ? esc(m.texto) : ''}</div>`).join('') : `<p class="aviso">${vazio}</p>`}</div>
    <form class="perg" id="formPerg"><input id="txtPerg" type="text" placeholder="${esc(t().placeholder)}" autocomplete="off" required><button class="btn prim" type="submit">${t().enviar}</button></form>`;
}

function telaConversa() {
  const x = t();
  return `<button type="button" class="btn" id="voltarTrilha">${x.licoes}</button>
    <h2>${x.conversaLivre}</h2>
    <p class="aviso">${x.conversaAviso(NOME_PROF[perfil.genero], vip.vip ? 0 : (plano ? plano.limite_gratis : 15))}</p>
    ${chatHtml(x.digaHola)}`;
}

function telaLicao() {
  const x = t(), l = licao;
  const abas = [['aula', x.aula], ['quiz', x.quiz], ['praticar', x.praticar]]
    .map(([a, n]) => `<button type="button" role="tab" data-aba="${a}" aria-selected="${aba === a}">${n}</button>`).join('');
  let corpo = '';
  if (aba === 'aula') {
    corpo = `<p class="aviso">${esc(L(l.intro))}</p>
      <p class="dica-uso">${x.dicaUso}</p>
      <ol class="pontos">${l.frases.map((f, i) => `<li data-i="${i}" tabindex="0">
        <div class="es">${esc(f.es)}</div>${traducao(f) ? `<div class="pt">${esc(traducao(f))}</div>` : ''}
        ${f.dica ? `<div class="dica">💡 ${esc(L(f.dica))}</div>` : ''}
        <button type="button" class="repetir" data-rep="${i}" aria-label="${esc(x.repetirFrase)}">🎤</button>
        ${progresso.pron[l.id + ':' + i] != null ? `<span class="nota">${progresso.pron[l.id + ':' + i]}%</span>` : ''}</li>`).join('')}</ol>
      <div class="linha-botoes"><button type="button" class="btn prim" id="ouvir">${x.ouvirAula}</button>
      <button type="button" class="btn" id="irQuiz">${x.fazerQuiz}</button></div>`;
  } else if (aba === 'quiz') {
    if (quizIdx >= l.quiz.length) {
      corpo = `<p class="pergunta">${x.resultado(quizAcertos, l.quiz.length)}</p>
        <div class="linha-botoes"><button type="button" class="btn prim" id="refazer">${x.refazer}</button><button type="button" class="btn" data-aba="praticar">${x.praticarIA}</button></div>`;
    } else {
      const q = l.quiz[quizIdx];
      corpo = `<div class="progresso">${quizIdx + 1} / ${l.quiz.length}</div>
        <p class="pergunta">${esc(L(q.p))}</p>
        <div class="opcoes">${q.o.map((op, i) => `<button type="button" class="opcao" data-i="${i}">${esc(L(op))}</button>`).join('')}</div>
        <div id="explica"></div>`;
    }
  } else {
    corpo = `<p class="aviso">🎭 <b>${x.situacao}:</b> ${esc(L(l.cena))}</p>${chatHtml(x.respondaMic)}`;
  }
  return `<button type="button" class="btn" id="voltarTrilha">${x.licoes}</button>
    <h2>${l.icone} ${esc(L(l.titulo))}</h2><div class="abas" role="tablist">${abas}</div>${corpo}`;
}

function telaVip() {
  const x = t();
  const preco = plano ? `R$ ${Number(plano.preco).toFixed(2).replace('.', ',')}${x.porMes}` : '';
  const lista = aulas.length ? `<ul class="aulas">${aulas.map(a => `<li><b>${esc(a.titulo)}</b><span>${esc(dataBonita(a.quando))}${a.descricao ? ' · ' + esc(a.descricao) : ''}</span>
      ${a.link ? `<a class="btn prim mini" href="${esc(a.link)}" target="_blank" rel="noopener">${x.entrarAula}</a>` : `<span class="cadeado">${x.soVip}</span>`}</li>`).join('')}</ul>`
    : `<p class="aviso">${x.semAulas}</p>`;
  if (vip.vip) {
    return `<button type="button" class="btn" id="voltarTrilha">${x.licoes}</button>
      <h2>${x.vipVoce}</h2><p class="aviso">${x.vipTudo}</p><h3>${x.proximasAulas}</h3>${lista}`;
  }
  return `<button type="button" class="btn" id="voltarTrilha">${x.licoes}</button>
    <h2>${x.vipTitulo} ${preco ? `<small class="preco">${preco}</small>` : ''}</h2>
    <ul class="beneficios">${x.beneficios.map(b => `<li>${b}</li>`).join('')}</ul>
    <div class="campo"><label><span>${x.seuEmail}</span><input type="email" id="email" value="${esc(perfil.email || '')}" autocomplete="email" placeholder="voce@email.com"></label></div>
    <div class="linha-botoes"><button type="button" class="btn prim" id="assinar">${x.assinar}</button>
    <button type="button" class="btn" id="jaSou">${x.jaSou}</button></div>
    <p class="msg-vip" id="msgVip" aria-live="polite">${plano && !plano.pagamento_ativo ? x.pagamentoOff : ''}</p>
    <h3>${x.proximasAulas}</h3>${lista}`;
}

function render() {
  cabecalho();
  const telas = { config: telaConfig, trilha: telaTrilha, licao: telaLicao, conversa: telaConversa, vip: telaVip };
  $('#painel').innerHTML = (telas[tela] || telaTrilha)();
  ligar();
  const c = $('#chat'); if (c && c.lastElementChild) c.lastElementChild.scrollIntoView({ block: 'nearest' });
}

function trocarIdioma(novo) {
  calar();
  idioma = novo;
  gravar('hp.idioma', idioma);
  render();
  estadoMic($('#mic').dataset.estado);
  if (cumprimentou && tela !== 'config') falar(boasVindas(perfil, idioma));
}

// ---------- aula ----------
async function ouvirFrase(i) {
  const f = licao.frases[i];
  document.querySelectorAll('.pontos li').forEach(li => li.classList.toggle('atual', +li.dataset.i === i));
  const li = document.querySelector(`.pontos li[data-i="${i}"]`); if (li) li.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  return falar({ es: f.es, apoio: traducao(f) });
}

function abrirLicao(id) {
  const l = LICOES.find(x => x.id === id);
  if (!liberada(l)) { abrirVip(); falar({ es: '¡Esta lección es VIP!', apoio: t().licaoVip }); return; }
  licao = l; registrarLicao(id);
  tela = 'licao'; aba = 'aula'; quizIdx = 0; quizAcertos = 0; repetindo = -1; chat.length = 0;
  render();
  falar({ es: `${t().vamosCom} ${l.titulo.es}.`, apoio: L(l.intro) });
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
let esperandoIA = false;
async function mandarParaIA(texto) {
  if (esperandoIA) return;   // uma pergunta por vez: evita respostas em cima de respostas
  esperandoIA = true;
  let fala = null;
  try { fala = await perguntarIA(texto); } finally { esperandoIA = false; }
  if (fala) return falar(fala);   // fala depois de liberar: dá para perguntar de novo enquanto ela fala
}
async function perguntarIA(texto) {
  chat.push({ quem: 'eu', texto });
  render();
  estadoMic('pensando');
  const r = await conversarIA({ texto, perfil, licao: aba === 'praticar' ? licao : null, idioma });
  estadoMic('pronto');
  if (r.limite) {
    const fala = { es: '¡Llegaste al límite de hoy!', apoio: t().limite };
    chat.push({ quem: 'ia', ...fala }); render(); return fala;
  }
  if (!r.resposta) {
    const local = respostaRapida(texto, perfil, idioma) || { es: 'Perdón, no te escuché bien.', apoio: t().semServidor };
    chat.push({ quem: 'ia', ...local }); render(); return local;
  }
  if (r.vip !== undefined && r.vip !== vip.vip) { vip.vip = r.vip; gravar('hp.vip', vip); }
  chat.push({ quem: 'ia', es: r.resposta, apoio: idioma === 'es' ? '' : r.traducao, correcao: r.correcao });
  render();
  professor && professor.humor(r.humor || 'neutro');
  // fala a resposta em espanhol e, se houver, a correção no idioma do aluno
  return { es: r.resposta, apoio: r.correcao || '' };
}

// ---------- eventos ----------
function ligar() {
  document.querySelectorAll('[data-idioma]').forEach(b => b.onclick = () => trocarIdioma(b.dataset.idioma));
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
    if (aba === 'praticar') { chat.push({ quem: 'ia', es: licao.cena.inicio }); render(); falar({ es: licao.cena.inicio, apoio: t().respondaEs }); }
  });
  document.querySelectorAll('.pontos li').forEach(li => {
    li.onclick = (e) => { if (e.target.closest('.repetir')) return; calar(); repetindo = -1; ouvirFrase(+li.dataset.i); };
    li.onkeydown = (e) => { if (e.key === 'Enter') li.click(); };
  });
  document.querySelectorAll('.repetir').forEach(b => b.onclick = async (e) => {
    e.stopPropagation(); liberarAudio(); calar();
    repetindo = +b.dataset.rep;
    document.querySelectorAll('.pontos li').forEach(li => li.classList.toggle('atual', +li.dataset.i === repetindo));
    await falar({ es: licao.frases[repetindo].es, apoio: t().repitaSinal });
    ouvir();
  });

  const ouvirBtn = $('#ouvir');
  if (ouvirBtn) ouvirBtn.onclick = async () => {
    if (ouvirBtn.dataset.tocando) { calar(); delete ouvirBtn.dataset.tocando; ouvirBtn.textContent = t().ouvirAula; return; }
    ouvirBtn.dataset.tocando = '1'; ouvirBtn.textContent = t().parar;
    for (let i = 0; i < licao.frases.length; i++) {
      const continua = await ouvirFrase(i);
      if (continua === false || !ouvirBtn.dataset.tocando) break;
    }
    document.querySelectorAll('.pontos li').forEach(li => li.classList.remove('atual'));
    professor && professor.gesto('thumbup', 2);
    delete ouvirBtn.dataset.tocando; ouvirBtn.textContent = t().ouvirAula;
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
    $('#explica').innerHTML = `<div class="explica">${ok ? t().certo : t().quase}${esc(L(q.e))}</div><div class="linha-botoes"><button type="button" class="btn prim" id="proxima">${t().proximaQ}</button></div>`;
    $('#proxima').onclick = () => {
      quizIdx++; respondida = false; professor && professor.humor('neutro');
      if (quizIdx >= licao.quiz.length) {
        progresso.feitos[licao.id] = Math.max(progresso.feitos[licao.id] || 0, quizAcertos);
        gravar('hp.progresso', progresso);
        render(); falar({ es: quizAcertos === licao.quiz.length ? '¡Perfecto!' : '¡Bien hecho!', apoio: t().voceAcertou(quizAcertos, licao.quiz.length) });
      } else { render(); lerPergunta(); }
    };
    cabecalho(); gravar('hp.progresso', progresso);
    falar({ es: ok ? '¡Correcto!' : 'Casi.', apoio: L(q.e) });
  });

  const form = $('#formPerg');
  if (form) form.onsubmit = (e) => {
    e.preventDefault();
    const texto = $('#txtPerg').value.trim();
    if (texto) { liberarAudio(); calar(); mandarParaIA(texto); }
  };

  const email = $('#email'); if (email) email.oninput = () => { perfil.email = email.value.trim(); gravar('hp.perfil', perfil); };
  const msg = (txt) => { const m = $('#msgVip'); if (m) m.textContent = txt; };
  const emailOk = () => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(perfil.email || '');
  const assinar = $('#assinar');
  if (assinar) assinar.onclick = async () => {
    if (plano && !plano.pagamento_ativo) return msg(t().pagamentoOff);
    if (!emailOk()) return msg(t().emailInvalido);
    assinar.disabled = true; msg(t().abrindoMP);
    try { const r = await assinarVip(perfil, perfil.email); location.href = r.url; }
    catch (e) { msg(e.status === 503 ? t().pagamentoOff : t().erroPagamento + e.message); assinar.disabled = false; }
  };
  const jaSou = $('#jaSou');
  if (jaSou) jaSou.onclick = async () => {
    if (!emailOk()) return msg(t().emailAssinatura);
    try {
      const r = await recuperarVip(perfil, perfil.email);
      vip = r; gravar('hp.vip', vip);
      if (r.vip) { msg(t().vipLiberado); abrirVip(); } else msg(t().semAssinatura);
    } catch (e) { msg(e.message); }
  };
}

function lerPergunta() {
  if (licao && quizIdx < licao.quiz.length) falar({ es: '', apoio: L(licao.quiz[quizIdx].p) });
}

$('#btnTrocar').onclick = () => { calar(); tela = 'config'; render(); };
$('#btnVip').onclick = () => { liberarAudio(); calar(); abrirVip(); };
$('#btnIdioma').onclick = () => { liberarAudio(); trocarIdioma(ORDEM[(ORDEM.indexOf(idioma) + 1) % ORDEM.length]); };

// ---------- microfone ----------
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
let rec = null, ouvindo = false, ouvido = '';
function estadoMic(e) {
  $('#mic').dataset.estado = e;
  $('#mic').setAttribute('aria-label', t().falar);
  $('#dicaVoz').textContent = e === 'ouvindo' ? (repetindo >= 0 ? t().repita : t().ouvindo) : e === 'pensando' ? t().pensando : (cumprimentou ? t().falar : t().comecar);
}

// O Safari do iPhone às vezes entrega o mesmo resultado 2 ou 3 vezes: só aceitamos UMA fala por vez de microfone
let ultimaFala = '', ultimaFalaEm = 0;
async function voceDisse(texto) {
  texto = (texto || '').trim();
  estadoMic('pronto');
  if (!texto) return;
  if (texto === ultimaFala && Date.now() - ultimaFalaEm < 4000) return;
  ultimaFala = texto; ultimaFalaEm = Date.now();
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
    return falar({ es: c.es, apoio: `${t().nota(nota, texto)}${faltando.length && nota < 90 ? ' ' + t().treine + ' ' + faltando.slice(0, 3).join(', ') + '.' : ''}` });
  }
  if (tela === 'licao' && aba !== 'praticar') { aba = 'praticar'; chat.length = 0; }
  if (tela !== 'licao' && tela !== 'conversa') { tela = 'conversa'; chat.length = 0; }
  return mandarParaIA(texto);
}

function ouvir() {
  if (!rec) { $('#balao').hidden = false; $('#balao').textContent = t().semMic; return; }
  try { modoSom('play-and-record'); rec.lang = 'es-PY'; ouvido = ''; pendente = null; rec.start(); ouvindo = true; estadoMic('ouvindo'); }
  catch (er) { $('#dicaVoz').textContent = t().naoEntendi; }
}

// No iPhone, enquanto o microfone ainda está aberto, o som sai pelo alto-falante de ligação (baixinho ou mudo).
// Por isso só respondemos DEPOIS que o reconhecimento terminou de verdade (evento "end") e o som voltou para mídia.
let pendente = null, timerPendente = null;
function responderQuandoMicFechar(texto) {
  pendente = texto;
  clearTimeout(timerPendente);
  timerPendente = setTimeout(soltarPendente, 1200);   // garantia, caso o "end" não chegue
}
function soltarPendente() {
  clearTimeout(timerPendente);
  if (pendente == null) return;
  const f = pendente; pendente = null;
  modoSom('playback');
  setTimeout(() => voceDisse(f), ehIOS ? 350 : 0);
}

if (SR) {
  rec = new SR(); rec.interimResults = true; rec.continuous = false;
  rec.onresult = (e) => {
    if (!ouvindo) return;   // resultado atrasado/repetido depois que já paramos de ouvir: ignora
    let txt = '', final = false;
    for (const r of e.results) { txt += r[0].transcript; if (r.isFinal) final = true; }
    ouvido = txt;
    $('#balao').hidden = false; $('#balao').textContent = '🎤 ' + txt;
    if (final) { ouvindo = false; const fala = ouvido; ouvido = ''; responderQuandoMicFechar(fala); try { rec.abort(); } catch (er) { soltarPendente(); } }
  };
  rec.onerror = (e) => { modoSom('playback'); ouvindo = false; ouvido = ''; if (pendente == null) estadoMic('pronto'); if (e.error === 'not-allowed') $('#dicaVoz').textContent = t().micBloqueado; };
  rec.onend = () => {
    modoSom('playback');
    if (pendente != null) return soltarPendente();
    if (!ouvindo) return;
    ouvindo = false;
    if (ouvido) { const f = ouvido; ouvido = ''; pendente = f; soltarPendente(); } else { repetindo = -1; estadoMic('pronto'); }
  };
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
if (!novoPerfil) { const b = boasVindas(perfil, idioma); $('#balao').hidden = false; $('#balao').innerHTML = `<b class="es">${esc(b.es)}</b><span class="pt">${esc(b.apoio)}</span>`; }
// volta do Mercado Pago: confere o VIP
const voltouPagamento = /[?&](vip|status|preapproval_id)=/.test(location.search);
Promise.all([planos(), statusVip(perfil), agendaAulas(perfil)]).then(([p, s, a]) => {
  if (p) plano = p;
  if (s && !s.offline) { vip = s; gravar('hp.vip', vip); }
  aulas = (a && a.aulas) || [];
  if (voltouPagamento) { abrirVip(); history.replaceState(null, '', location.pathname); }
  else if (tela === 'trilha' || tela === 'vip') render();
});
