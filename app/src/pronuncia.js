// Compara o que o aluno falou (reconhecimento de voz) com a frase da aula e dá uma nota de 0 a 100.
const limpar = (s) => String(s || '').toLowerCase()
  .normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[¿¡!?.,;:"'()…-]/g, ' ').replace(/\s+/g, ' ').trim();

function distancia(a, b) {
  const m = a.length, n = b.length;
  if (!m) return n;
  if (!n) return m;
  let ant = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const atual = [i];
    for (let j = 1; j <= n; j++) {
      atual[j] = Math.min(ant[j] + 1, atual[j - 1] + 1, ant[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    ant = atual;
  }
  return ant[n];
}

// Nota por palavras (ordem importa) + por letras (perdoa sotaque pequeno)
export function notaPronuncia(esperado, falado) {
  const e = limpar(esperado), f = limpar(falado);
  if (!e || !f) return { nota: 0, faltando: e ? e.split(' ') : [] };
  const pe = e.split(' '), pf = f.split(' ');
  const porPalavra = 1 - distancia(pe, pf) / Math.max(pe.length, pf.length);
  const porLetra = 1 - distancia(e, f) / Math.max(e.length, f.length);
  const nota = Math.round(Math.max(0, Math.min(1, 0.4 * porPalavra + 0.6 * porLetra)) * 100);
  const ditas = new Set(pf);
  return { nota, faltando: pe.filter(p => !ditas.has(p)) };
}

export function comentario(nota) {
  if (nota >= 90) return { es: '¡Excelente! Suena muy natural.', pt: 'Excelente! Ficou muito natural.', humor: 'feliz' };
  if (nota >= 70) return { es: '¡Muy bien! Casi perfecto.', pt: 'Muito bem! Quase perfeito.', humor: 'feliz' };
  if (nota >= 45) return { es: 'Bien, vamos de nuevo más despacio.', pt: 'Bom, vamos de novo mais devagar.', humor: 'carinho' };
  return { es: 'Tranquilo, escuchá otra vez y repetí conmigo.', pt: 'Calma, ouça de novo e repita comigo.', humor: 'carinho' };
}
