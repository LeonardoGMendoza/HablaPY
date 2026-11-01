import hashlib
import hmac
import io
import json
import os
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from app.ia import Tutor, interpretar, montar_prompt  # noqa: E402
from app.memoria import Memoria  # noqa: E402
from app.pagamentos import MercadoPago  # noqa: E402


class IAFalsa:
    def __init__(self, resposta):
        self.resposta, self.prompts = resposta, []

    def __call__(self, prompt, **_):
        self.prompts.append(prompt)
        return self.resposta


RESPOSTA = json.dumps({"resposta": "¡Muy bien! ¿Y cuándo viajás?", "traducao": "Muito bem! E quando você viaja?",
                       "correcao": 'Diga "estoy embarazado" só se estiver grávido 😄: o certo é "estoy avergonzado".',
                       "fatos_novos": ["vai para Ciudad del Este"], "humor": "feliz"})


class TestTutor(unittest.TestCase):
    def setUp(self):
        self.mem = Memoria(tempfile.mkdtemp())

    def test_interpretar_json_com_lixo(self):
        d = interpretar("Claro:\n```json\n" + RESPOSTA + "\n```")
        self.assertEqual(d["traducao"], "Muito bem! E quando você viaja?")
        self.assertIn("avergonzado", d["correcao"])
        self.assertEqual(d["humor"], "feliz")

    def test_interpretar_texto_solto(self):
        d = interpretar("Hola, ¿cómo estás?")
        self.assertEqual(d["resposta"], "Hola, ¿cómo estás?")
        self.assertEqual(d["correcao"], "")

    def test_prompt_cena_e_memoria(self):
        p = montar_prompt("Hola", nome="Leo", objetivo="medicina", cena="Você está na farmácia.", fatos=["vai em março"])
        self.assertIn("estudar medicina", p)
        self.assertIn("Você está na farmácia.", p)
        self.assertIn("vai em março", p)
        livre = montar_prompt("Hola")
        self.assertIn("Conversa livre", livre)

    def test_responder_guarda_memoria(self):
        ia = IAFalsa(RESPOSTA)
        r = Tutor(ia, self.mem).responder("a1", "Estoy embarazado de hablar", nome="Leo")
        self.assertEqual(r["modo"], "ia")
        self.assertIn("vai para Ciudad del Este", self.mem.fatos("a1"))
        Tutor(ia, self.mem).responder("a1", "Otra cosa")
        self.assertIn("Ciudad del Este", ia.prompts[-1])

    def test_sem_ia(self):
        self.assertEqual(Tutor(None, self.mem).responder("a1", "hola")["modo"], "sem-ia")

    def test_ia_com_erro(self):
        def quebra(*_, **__):
            raise RuntimeError("fora")
        self.assertEqual(Tutor(quebra, self.mem).responder("a1", "hola")["modo"], "erro")


class TestMemoriaVip(unittest.TestCase):
    def setUp(self):
        self.mem = Memoria(tempfile.mkdtemp())

    def test_limite_diario(self):
        self.assertTrue(all(self.mem.usar("a1", 3) for _ in range(3)))
        self.assertFalse(self.mem.usar("a1", 3))
        self.assertTrue(self.mem.usar("a2", 3))

    def test_vip_por_email(self):
        self.mem.vincular("a1", "Leo@Mail.com")
        self.assertFalse(self.mem.eh_vip("a1"))
        self.mem.salvar_assinatura("leo@mail.com", "authorized", "pre1")
        self.assertTrue(self.mem.eh_vip("a1"))
        self.mem.salvar_assinatura("leo@mail.com", "cancelled", "pre1")
        self.assertFalse(self.mem.eh_vip("a1"))

    def test_poucos_aparelhos_por_email(self):
        for i in range(3):
            self.assertTrue(self.mem.vincular(f"a{i}", "x@y.com"))
        self.assertFalse(self.mem.vincular("a9", "x@y.com"))
        self.assertTrue(self.mem.vincular("a1", "x@y.com"))   # o mesmo aparelho de novo continua OK


class RespostaFalsa(io.BytesIO):
    def __enter__(self):
        return self

    def __exit__(self, *a):
        return False


class TestMercadoPago(unittest.TestCase):
    def test_criar_assinatura(self):
        pedidos = []

        def abrir(req, timeout):
            pedidos.append(req)
            return RespostaFalsa(json.dumps({"id": "pre1", "init_point": "https://mp/checkout", "status": "pending"}).encode())
        mp = MercadoPago("TOKEN", abrir=abrir)
        r = mp.criar_assinatura("leo@mail.com", "a1", 29.9, "VIP", "https://app/?vip=ok")
        self.assertEqual(r["url"], "https://mp/checkout")
        corpo = json.loads(pedidos[0].data)
        self.assertEqual(corpo["auto_recurring"]["transaction_amount"], 29.9)
        self.assertEqual(corpo["auto_recurring"]["currency_id"], "BRL")
        self.assertEqual(corpo["external_reference"], "a1")
        self.assertEqual(pedidos[0].get_header("Authorization"), "Bearer TOKEN")

    def test_assinatura_do_webhook(self):
        mp = MercadoPago("T", "segredo")
        v1 = hmac.new(b"segredo", b"id:pre1;request-id:req9;ts:1700;", hashlib.sha256).hexdigest()
        self.assertTrue(mp.assinatura_valida(f"ts=1700,v1={v1}", "req9", "PRE1"))
        self.assertFalse(mp.assinatura_valida("ts=1700,v1=errado", "req9", "pre1"))
        self.assertFalse(mp.assinatura_valida("", "req9", "pre1"))


class TestApi(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        try:
            from fastapi.testclient import TestClient
        except ImportError:  # httpx não instalado
            raise unittest.SkipTest("fastapi/httpx não instalados")
        cls.tmp = tempfile.mkdtemp()
        os.environ.update({"HABLAPY_DATA_DIR": cls.tmp, "HP_ADMIN_TOKEN": "adm", "HP_LIMITE_GRATIS": "2",
                           "MP_ACCESS_TOKEN": "", "AZURE_SPEECH_KEY": ""})
        for k in ("OCI_USER", "OCI_COMPARTMENT_ID"):
            os.environ.pop(k, None)
        import importlib
        import app.main as main
        cls.main = importlib.reload(main)
        cls.main.tutor.chat = IAFalsa(RESPOSTA)
        cls.c = TestClient(cls.main.app)

    def test_limite_gratis_e_vip(self):
        for _ in range(2):
            self.assertEqual(self.c.post("/api/tutor", json={"aluno": "g1", "texto": "hola"}).status_code, 200)
        self.assertEqual(self.c.post("/api/tutor", json={"aluno": "g1", "texto": "hola"}).status_code, 402)
        self.main.memoria.vincular("g1", "pago@mail.com")
        self.main.memoria.salvar_assinatura("pago@mail.com", "authorized", "p1")
        r = self.c.post("/api/tutor", json={"aluno": "g1", "texto": "hola"})
        self.assertEqual(r.status_code, 200)
        self.assertTrue(r.json()["vip"])
        self.assertTrue(self.c.get("/api/vip/g1").json()["vip"])

    def test_recuperar_vip(self):
        self.main.memoria.salvar_assinatura("ana@mail.com", "authorized", "p2")
        self.assertTrue(self.c.post("/api/vip/recuperar", json={"aluno": "cel2", "email": "ANA@mail.com"}).json()["vip"])
        self.assertFalse(self.c.post("/api/vip/recuperar", json={"aluno": "cel3", "email": "ninguem@mail.com"}).json()["vip"])
        self.assertEqual(self.c.post("/api/vip/recuperar", json={"aluno": "cel3", "email": "invalido"}).status_code, 422)

    def test_assinar_sem_mercadopago(self):
        r = self.c.post("/api/vip/assinar", json={"aluno": "a5", "email": "a5@mail.com"})
        self.assertEqual(r.status_code, 503)

    def test_aulas_link_so_para_vip(self):
        aulas = [{"titulo": "Conversação: alugar casa", "quando": "2099-01-10T19:00:00-03:00", "link": "https://meet.google.com/abc-defg-hij"}]
        self.assertEqual(self.c.put("/api/admin/aulas", json=aulas, headers={"X-Admin-Token": "errado"}).status_code, 401)
        self.assertEqual(self.c.put("/api/admin/aulas", json=aulas, headers={"X-Admin-Token": "adm"}).status_code, 200)
        self.assertEqual(self.c.get("/api/aulas?aluno=zz").json()["aulas"][0]["link"], "")
        self.main.memoria.vincular("v9", "vip9@mail.com")
        self.main.memoria.salvar_assinatura("vip9@mail.com", "authorized", "p9")
        self.assertIn("meet.google.com", self.c.get("/api/aulas?aluno=v9").json()["aulas"][0]["link"])

    def test_webhook_ignorado_sem_mp(self):
        self.assertTrue(self.c.post("/api/mercadopago/webhook?type=subscription_preapproval&data.id=x", json={}).json()["ignorado"])

    def test_webhook_libera_vip(self):
        class MPFalso:
            def assinatura_valida(self, *_):
                return True

            def consultar(self, pid):
                return {"id": pid, "status": "authorized", "email": "novo@mail.com", "aluno": "cel7"}
        antigo, self.main.mp = self.main.mp, MPFalso()
        try:
            r = self.c.post("/api/mercadopago/webhook?type=subscription_preapproval&data.id=pre77", json={})
            self.assertEqual(r.status_code, 200)
            self.assertTrue(self.c.get("/api/vip/cel7").json()["vip"])
        finally:
            self.main.mp = antigo


if __name__ == "__main__":
    unittest.main()
