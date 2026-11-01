"""Assinatura VIP pelo Mercado Pago (Pix ou cartão), usando a API de assinaturas (preapproval) sem biblioteca extra.

Fluxo:
1. O app chama /api/vip/assinar -> criamos uma assinatura "pending" e devolvemos o link (init_point) do Mercado Pago.
2. O aluno paga lá. O Mercado Pago chama o nosso webhook (/api/mercadopago/webhook) com o id da assinatura.
3. Conferimos a assinatura direto na API (nunca confiamos só no aviso) e liberamos o VIP se o status for "authorized".
"""
import hashlib
import hmac
import json
import os
import urllib.error
import urllib.request

API = "https://api.mercadopago.com"


class MercadoPagoErro(Exception):
    pass


class MercadoPago:
    def __init__(self, token, segredo_webhook="", abrir=urllib.request.urlopen):
        self.token, self.segredo, self._abrir = token, segredo_webhook, abrir

    def _chamar(self, metodo, caminho, corpo=None):
        dados = json.dumps(corpo).encode("utf-8") if corpo is not None else None
        req = urllib.request.Request(API + caminho, data=dados, method=metodo, headers={
            "Authorization": f"Bearer {self.token}", "Content-Type": "application/json"})
        try:
            with self._abrir(req, timeout=20) as r:
                return json.loads(r.read().decode("utf-8"))
        except urllib.error.HTTPError as erro:
            detalhe = erro.read().decode("utf-8", "replace")[:300]
            raise MercadoPagoErro(f"Mercado Pago respondeu {erro.code}: {detalhe}") from erro
        except (urllib.error.URLError, TimeoutError) as erro:
            raise MercadoPagoErro("Mercado Pago fora do ar") from erro

    def criar_assinatura(self, email, aluno, valor, motivo, volta_url):
        corpo = {
            "reason": motivo,
            "external_reference": aluno,
            "payer_email": email,
            "back_url": volta_url,
            "status": "pending",
            "auto_recurring": {"frequency": 1, "frequency_type": "months",
                               "transaction_amount": round(float(valor), 2), "currency_id": "BRL"},
        }
        r = self._chamar("POST", "/preapproval", corpo)
        if not r.get("init_point"):
            raise MercadoPagoErro("Mercado Pago não devolveu o link de pagamento")
        return {"id": r.get("id"), "url": r["init_point"], "status": r.get("status", "pending")}

    def consultar(self, assinatura_id):
        r = self._chamar("GET", f"/preapproval/{assinatura_id}")
        return {"id": r.get("id"), "status": r.get("status"), "email": (r.get("payer_email") or "").lower(),
                "aluno": r.get("external_reference") or ""}

    def assinatura_valida(self, x_signature, x_request_id, data_id):
        """Confere a assinatura secreta do webhook (x-signature: "ts=...,v1=...")."""
        if not self.segredo:
            return True   # sem segredo configurado: ainda é seguro porque sempre consultamos a API antes de liberar
        partes = dict(p.split("=", 1) for p in (x_signature or "").split(",") if "=" in p)
        ts, v1 = partes.get("ts", "").strip(), partes.get("v1", "").strip()
        if not ts or not v1:
            return False
        manifesto = f"id:{str(data_id).lower()};request-id:{x_request_id or ''};ts:{ts};"
        esperado = hmac.new(self.segredo.encode(), manifesto.encode(), hashlib.sha256).hexdigest()
        return hmac.compare_digest(esperado, v1)


def mercadopago_do_ambiente(env=os.environ):
    token = env.get("MP_ACCESS_TOKEN", "").strip()
    return MercadoPago(token, env.get("MP_WEBHOOK_SECRET", "").strip()) if token else None
