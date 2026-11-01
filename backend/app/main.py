"""API do HablaPY: professora de espanhol (IA da Oracle), voz, VIP pelo Mercado Pago e agenda das aulas ao vivo."""
import hmac
import json
import os
import re
import threading
import time
from collections import defaultdict, deque
from datetime import datetime, timezone
from pathlib import Path

from fastapi import FastAPI, Header, HTTPException, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from .config import carregar_env

carregar_env()

from .ia import Tutor, oracle_do_ambiente  # noqa: E402
from .memoria import Memoria  # noqa: E402
from .pagamentos import MercadoPagoErro, mercadopago_do_ambiente  # noqa: E402
from .voz import voz_do_ambiente  # noqa: E402

DADOS = Path(os.getenv("HABLAPY_DATA_DIR", "./data"))
PRECO = float(os.getenv("HP_VIP_PRECO", "29.90"))
LIMITE_GRATIS = int(os.getenv("HP_LIMITE_GRATIS", "15"))
APP_URL = os.getenv("HP_APP_URL", "https://leonardogmendoza.github.io/HablaPY/demo/")
ADMIN_TOKEN = os.getenv("HP_ADMIN_TOKEN", "")

app = FastAPI(title="HablaPY API", version="0.1.0")
origens = [o.strip() for o in os.getenv("HP_ORIGENS", "http://localhost:5173,http://localhost:8000,https://leonardogmendoza.github.io").split(",") if o.strip()]
app.add_middleware(CORSMiddleware, allow_origins=origens, allow_methods=["GET", "POST", "PUT", "DELETE"], allow_headers=["*"])

memoria = Memoria(str(DADOS))
tutor = Tutor(oracle_do_ambiente(), memoria)
voz = voz_do_ambiente(tutor.chat)
mp = mercadopago_do_ambiente()
ID_OK = re.compile(r"^[a-zA-Z0-9_-]{1,40}$")
EMAIL_OK = re.compile(r"^[^@\s]{1,64}@[^@\s]{1,120}\.[^@\s]{2,20}$")
_pedidos = defaultdict(deque)
_lock_aulas = threading.Lock()


def limitar(request: Request, maximo=30, janela=60):
    """Protege o custo da Oracle: no máximo 30 pedidos (ou 120 falas) por minuto por IP."""
    ip = request.headers.get("cf-connecting-ip") or request.headers.get("x-real-ip") or (request.client.host if request.client else "?")
    agora, fila = time.time(), _pedidos[(ip, maximo)]
    while fila and agora - fila[0] > janela:
        fila.popleft()
    if len(fila) >= maximo:
        raise HTTPException(429, "Muitos pedidos. Espere um minuto.")
    fila.append(agora)


def checar_aluno(aluno):
    if not ID_OK.match(aluno or ""):
        raise HTTPException(422, "Identificador inválido.")


def checar_email(email):
    email = (email or "").strip().lower()
    if not EMAIL_OK.match(email):
        raise HTTPException(422, "E-mail inválido.")
    return email


class Pergunta(BaseModel):
    aluno: str = Field("demo", max_length=40)
    nome: str = Field("", max_length=60)
    texto: str = Field(..., min_length=1, max_length=600)
    genero: str = Field("mulher", max_length=10)
    objetivo: str = Field("", max_length=20)
    licao: str = Field("", max_length=30)
    cena: str = Field("", max_length=300)
    idioma: str = Field("pt", max_length=5)


class TextoVoz(BaseModel):
    texto: str = Field(..., min_length=1, max_length=600)
    idioma: str = Field("es", max_length=5)
    genero: str = Field("mulher", max_length=10)


class PedidoVip(BaseModel):
    aluno: str = Field(..., max_length=40)
    email: str = Field(..., max_length=200)
    nome: str = Field("", max_length=60)


class Aula(BaseModel):
    titulo: str = Field(..., max_length=120)
    quando: str = Field(..., max_length=40, description="Data e hora ISO, ex.: 2026-11-10T19:00:00-03:00")
    link: str = Field(..., max_length=300, description="Link do Google Meet")
    descricao: str = Field("", max_length=300)


VOZES = {  # vozes neurais da Azure: espanhol do Paraguai, português do Brasil e inglês
    "es": {"mulher": "es-PY-TaniaNeural", "homem": "es-PY-MarioNeural"},
    "pt": {"mulher": "pt-BR-FranciscaNeural", "homem": "pt-BR-AntonioNeural"},
    "en": {"mulher": "en-US-JennyNeural", "homem": "en-US-GuyNeural"},
}


@app.get("/api/saude")
def saude():
    return {"ok": True, "ia": tutor.chat is not None, "voz": voz is not None, "pagamento": mp is not None}


@app.post("/api/tutor")
def perguntar(p: Pergunta, request: Request):
    limitar(request)
    checar_aluno(p.aluno)
    vip = memoria.eh_vip(p.aluno)
    if not vip and not memoria.usar(p.aluno, LIMITE_GRATIS):
        raise HTTPException(402, "Limite grátis de hoje atingido.")
    r = tutor.responder(p.aluno, p.texto, p.nome, p.genero, p.objetivo, p.cena, p.idioma if p.idioma in ("pt", "es", "en") else "pt")
    return {**r, "vip": vip}


@app.delete("/api/memoria/{aluno}")
def apagar_memoria(aluno: str):
    checar_aluno(aluno)
    memoria.esquecer(aluno)
    return {"ok": True}


@app.post("/api/voz")
def falar(t: TextoVoz, request: Request):
    limitar(request, maximo=120)
    if voz is None:
        raise HTTPException(503, "Voz da nuvem não configurada.")
    nome_voz = VOZES.get(t.idioma, VOZES["es"]).get(t.genero, VOZES["es"]["mulher"])
    try:
        audio = voz(t.texto, nome_voz)
    except Exception as erro:  # noqa: BLE001
        raise HTTPException(503, "Voz da nuvem indisponível.") from erro
    return Response(content=audio, media_type="audio/mpeg", headers={"Cache-Control": "public, max-age=86400"})


# ---------- VIP ----------
@app.get("/api/vip/plano")
def plano():
    return {"preco": PRECO, "moeda": "BRL", "limite_gratis": LIMITE_GRATIS, "pagamento_ativo": mp is not None}


@app.get("/api/vip/{aluno}")
def status_vip(aluno: str):
    checar_aluno(aluno)
    return {"vip": memoria.eh_vip(aluno)}


@app.post("/api/vip/assinar")
def assinar(p: PedidoVip, request: Request):
    limitar(request, maximo=10)
    checar_aluno(p.aluno)
    email = checar_email(p.email)
    if mp is None:
        raise HTTPException(503, "Pagamento ainda não configurado.")
    atual = memoria.assinatura(email)
    if atual and atual["status"] == "authorized":
        if not memoria.vincular(p.aluno, email):
            raise HTTPException(409, "Este e-mail já está em uso em muitos aparelhos.")
        return {"url": APP_URL + "?vip=ok", "ja_vip": True}
    if not memoria.vincular(p.aluno, email):
        raise HTTPException(409, "Este e-mail já está em uso em muitos aparelhos.")
    try:
        a = mp.criar_assinatura(email, p.aluno, PRECO, "HablaPY VIP - espanhol para o Paraguai", APP_URL + "?vip=ok")
    except MercadoPagoErro as erro:
        raise HTTPException(502, str(erro)) from erro
    memoria.salvar_assinatura(email, a["status"], a["id"])
    return {"url": a["url"]}


@app.post("/api/vip/recuperar")
def recuperar(p: PedidoVip, request: Request):
    limitar(request, maximo=10)
    checar_aluno(p.aluno)
    email = checar_email(p.email)
    a = memoria.assinatura(email)
    if a and a["status"] != "authorized" and a["id"] and mp is not None:
        try:   # o aviso pode ter atrasado: confere direto no Mercado Pago
            info = mp.consultar(a["id"])
            memoria.salvar_assinatura(email, info["status"] or a["status"], a["id"])
            a = memoria.assinatura(email)
        except MercadoPagoErro:
            pass
    if not a or a["status"] != "authorized":
        return {"vip": False}
    if not memoria.vincular(p.aluno, email):
        raise HTTPException(409, "Este e-mail já está em uso em muitos aparelhos.")
    return {"vip": True}


@app.post("/api/mercadopago/webhook")
async def webhook(request: Request, x_signature: str = Header(""), x_request_id: str = Header("")):
    try:
        corpo = await request.json()
    except Exception:  # noqa: BLE001
        corpo = {}
    q = request.query_params
    tipo = q.get("type") or q.get("topic") or corpo.get("type") or corpo.get("topic") or ""
    data_id = q.get("data.id") or q.get("id") or (corpo.get("data") or {}).get("id") or ""
    if mp is None or tipo not in ("subscription_preapproval", "preapproval") or not data_id:
        return {"ok": True, "ignorado": True}
    if not mp.assinatura_valida(x_signature, x_request_id, data_id):
        raise HTTPException(401, "Assinatura do webhook inválida.")
    try:
        info = mp.consultar(data_id)
    except MercadoPagoErro as erro:
        raise HTTPException(502, str(erro)) from erro   # o Mercado Pago tenta de novo depois
    if info["email"]:
        memoria.salvar_assinatura(info["email"], info["status"], info["id"])
        if info["aluno"] and ID_OK.match(info["aluno"]):
            memoria.vincular(info["aluno"], info["email"])
    return {"ok": True}


# ---------- aulas ao vivo ----------
def _arquivo_aulas():
    return DADOS / "aulas.json"


def _ler_aulas():
    try:
        return json.loads(_arquivo_aulas().read_text(encoding="utf-8"))
    except (FileNotFoundError, ValueError):
        return []


def _quando(a):
    try:
        d = datetime.fromisoformat(a["quando"])
        return d if d.tzinfo else d.replace(tzinfo=timezone.utc)
    except (KeyError, ValueError):
        return None


@app.get("/api/aulas")
def ver_aulas(aluno: str = ""):
    vip = bool(aluno) and ID_OK.match(aluno) and memoria.eh_vip(aluno)
    agora = datetime.now(timezone.utc).timestamp()
    proximas = [a for a in _ler_aulas() if _quando(a) and _quando(a).timestamp() > agora - 3 * 3600]
    proximas.sort(key=lambda a: _quando(a).timestamp())
    return {"aulas": [{"titulo": a["titulo"], "quando": a["quando"], "descricao": a.get("descricao", ""),
                       "link": a["link"] if vip else ""} for a in proximas[:10]], "vip": bool(vip)}


@app.put("/api/admin/aulas")
def salvar_aulas(aulas: list[Aula], x_admin_token: str = Header("")):
    if not ADMIN_TOKEN or not hmac.compare_digest(x_admin_token, ADMIN_TOKEN):
        raise HTTPException(401, "Token de administrador inválido.")
    for a in aulas:
        if _quando(a.model_dump()) is None:
            raise HTTPException(422, f"Data inválida: {a.quando}")
        if not a.link.startswith("https://"):
            raise HTTPException(422, "O link precisa começar com https://")
    DADOS.mkdir(parents=True, exist_ok=True)
    with _lock_aulas:
        _arquivo_aulas().write_text(json.dumps([a.model_dump() for a in aulas], ensure_ascii=False, indent=2), encoding="utf-8")
    return {"ok": True, "total": len(aulas)}
