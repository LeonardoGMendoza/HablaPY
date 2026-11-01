"""Professora de espanhol do HablaPY: conversa em espanhol do Paraguai e corrige o aluno em português (IA da Oracle)."""
import base64
import json
import logging
import os
import re
import threading

log = logging.getLogger("hablapy.ia")
CHAT_MODEL = os.getenv("HP_MODELO", "cohere.command-a-03-2025")
HUMORES = {"feliz", "carinho", "neutro"}
NOMES = {"mulher": "Sofía", "homem": "Mateo"}
OBJETIVOS = {
    "medicina": "vai estudar medicina no Paraguai",
    "morar": "vai morar ou trabalhar no Paraguai",
    "turismo": "vai viajar para o Paraguai",
}

ERRO = {"resposta": "Perdón, tuve un problema. ¿Me lo repetís?", "traducao": "Desculpe, tive um problema. Pode repetir?",
        "correcao": "", "humor": "neutro", "modo": "erro"}
SEM_IA = {"resposta": "Todavía no estoy conectada al servidor.", "traducao": "A IA do servidor ainda não foi configurada.",
          "correcao": "", "humor": "neutro", "modo": "sem-ia"}

PERSONA = """Você é {prof}, {papel} de espanhol do aplicativo HablaPY, conversando por voz com {aluno}, um(a) brasileiro(a) que {objetivo}.
Seu trabalho é fazer o aluno FALAR espanhol com confiança, como um bom professor nativo paraguaio e paciente.
Regras:
- "resposta": SEMPRE em espanhol simples do Paraguai (pode usar "vos": "¿vos sabés?"), no máximo 3 frases curtas, porque será falada em voz alta. Termine quase sempre com UMA pergunta para o aluno continuar falando.
- Ajuste o nível ao aluno: se ele escreve pouco ou com muitos erros, use frases bem curtas e palavras comuns.
- "traducao": a tradução da sua resposta para o português do Brasil.
- "correcao": se o aluno errou no espanhol (ou falou em português), explique em PORTUGUÊS, em 1 ou 2 frases curtas, como seria o certo, citando a frase correta em espanhol. Cuidado especial com falsos cognatos (embarazada, exquisito, oficina, apellido, rato…). Se ele acertou, deixe "" ou faça um elogio curto.
- {cena}
- Use palavras e costumes do Paraguai quando fizer sentido (guaraníes, colectivo, tereré, chipa, despensa), mas não invente preços, leis, prazos ou regras de imigração: se perguntarem, diga que é melhor confirmar no órgão oficial.
- Você é uma IA: não diga que é humano. Não fale de política.
- "fatos_novos": guarde em português o que ajuda nas próximas conversas (cidade para onde vai, faculdade, quando viaja, dificuldades que se repetem). Nada de dados sensíveis.
- "humor": "feliz" (acerto, conversa leve), "carinho" (incentivo depois de erro), "neutro".

Responda SOMENTE com um JSON válido, sem texto fora dele:
{{"resposta": "...", "traducao": "...", "correcao": "...", "fatos_novos": ["..."], "humor": "feliz" | "carinho" | "neutro"}}"""

CENA_LIVRE = 'Conversa livre: siga o assunto do aluno e puxe temas do dia a dia no Paraguai.'
CENA_ROLE = ('CENA DE PRÁTICA (role-play): {cena} Você interpreta a OUTRA pessoa da cena (não a professora) e mantém o '
             'personagem; a correção em português continua no campo "correcao".')


def montar_prompt(texto, nome="", genero="mulher", objetivo="", cena="", fatos=(), historico=()):
    partes = [PERSONA.format(
        prof=NOMES.get(genero, NOMES["mulher"]),
        papel="a professora" if genero != "homem" else "o professor",
        aluno=nome or "o aluno",
        objetivo=OBJETIVOS.get(objetivo, OBJETIVOS["morar"]),
        cena=CENA_ROLE.format(cena=cena.strip()[:300]) if cena.strip() else CENA_LIVRE)]
    partes.append("O que você já sabe sobre o aluno:\n" + ("\n".join(f"- {f}" for f in fatos) if fatos else "- (nada ainda)"))
    if historico:
        partes.append("Conversa recente:\n" + "\n".join(f"{'Aluno' if q == 'aluno' else 'Professora'}: {t}" for q, t in historico))
    partes.append(f'O aluno disse: "{texto}"')
    partes.append("Agora responda com o JSON.")
    return "\n\n".join(partes)


def interpretar(texto):
    texto = (texto or "").strip()
    bloco = re.search(r"\{.*\}", texto, re.S)
    if bloco:
        try:
            d = json.loads(bloco.group(0))
            resposta = str(d.get("resposta") or "").strip()
            if resposta:
                fatos = d.get("fatos_novos") or []
                fatos = fatos if isinstance(fatos, list) else [fatos]
                humor = str(d.get("humor") or "neutro").lower()
                return {"resposta": resposta, "traducao": str(d.get("traducao") or "").strip(),
                        "correcao": str(d.get("correcao") or "").strip(),
                        "fatos_novos": [str(f) for f in fatos if f], "humor": humor if humor in HUMORES else "neutro"}
        except (ValueError, AttributeError, TypeError):
            pass
    limpo = re.sub(r"```(json)?", "", texto).strip()
    return {"resposta": limpo, "traducao": "", "correcao": "", "fatos_novos": [], "humor": "neutro"}


class OracleChat:
    """Igual ao do VinaCare/StudentMedical: importa o SDK só no primeiro uso."""

    def __init__(self, config, compartment_id):
        self.config, self.compartment_id, self._client = config, compartment_id, None
        self._lock = threading.Lock()

    def __call__(self, prompt, max_tokens=450, temperature=0.5):
        import oci  # noqa: PLC0415

        with self._lock:
            if self._client is None:
                oci.config.validate_config(self.config)
                self._client = oci.generative_ai_inference.GenerativeAiInferenceClient(config=self.config, timeout=(10, 45))
        m = oci.generative_ai_inference.models
        detalhe = m.ChatDetails(
            compartment_id=self.compartment_id,
            serving_mode=m.OnDemandServingMode(model_id=CHAT_MODEL),
            chat_request=m.CohereChatRequest(message=prompt, max_tokens=max_tokens, temperature=temperature))
        return self._client.chat(detalhe).data.chat_response.text.strip()


def oracle_do_ambiente(env=os.environ):
    chave = env.get("OCI_KEY_CONTENT", "")
    if not chave and env.get("OCI_KEY_B64"):
        chave = base64.b64decode(env["OCI_KEY_B64"]).decode("utf-8")
    campos = {"user": env.get("OCI_USER"), "fingerprint": env.get("OCI_FINGERPRINT"),
              "tenancy": env.get("OCI_TENANCY"), "region": env.get("OCI_REGION"), "key_content": chave}
    compartimento = env.get("OCI_COMPARTMENT_ID")
    if not all(campos.values()) or not compartimento:
        return None
    return OracleChat(campos, compartimento)


class Tutor:
    def __init__(self, chat, memoria):
        self.chat, self.memoria = chat, memoria

    def responder(self, aluno, texto, nome="", genero="mulher", objetivo="", cena=""):
        texto = (texto or "").strip()[:600]
        if not texto:
            return {**ERRO, "resposta": "¡Hola! Contame algo.", "traducao": "Oi! Me conte alguma coisa.", "modo": "vazio"}
        if self.chat is None:
            return dict(SEM_IA)
        prompt = montar_prompt(texto, nome, genero, objetivo, cena, self.memoria.fatos(aluno), self.memoria.historico(aluno))
        try:
            dados = interpretar(self.chat(prompt))
        except Exception as erro:  # noqa: BLE001
            log.warning("Oracle falhou: %s", type(erro).__name__)
            return dict(ERRO)
        if not dados["resposta"]:
            return dict(ERRO)
        self.memoria.guardar_turno(aluno, texto, dados["resposta"], dados["fatos_novos"])
        return {"resposta": dados["resposta"], "traducao": dados["traducao"], "correcao": dados["correcao"],
                "humor": dados["humor"], "modo": "ia"}
