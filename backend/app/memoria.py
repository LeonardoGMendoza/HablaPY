"""Banco do HablaPY (SQLite): memória do aluno, uso diário grátis e assinaturas VIP."""
import sqlite3
import threading
import time
from datetime import datetime, timezone
from pathlib import Path

LIMITE_FATOS = 40
LIMITE_HISTORICO = 10
MAX_APARELHOS_POR_EMAIL = 3
ATIVOS = {"authorized"}   # status do Mercado Pago que liberam o VIP


def hoje():
    return datetime.now(timezone.utc).strftime("%Y-%m-%d")


class Memoria:
    def __init__(self, pasta):
        Path(pasta).mkdir(parents=True, exist_ok=True)
        self.db = sqlite3.connect(str(Path(pasta) / "hablapy.db"), check_same_thread=False)
        self.lock = threading.Lock()
        with self.lock:
            self.db.executescript("""
                CREATE TABLE IF NOT EXISTS fatos (aluno TEXT, fato TEXT, criado REAL, PRIMARY KEY (aluno, fato));
                CREATE TABLE IF NOT EXISTS conversa (aluno TEXT, quem TEXT, texto TEXT, criado REAL);
                CREATE TABLE IF NOT EXISTS uso (aluno TEXT, dia TEXT, n INTEGER, PRIMARY KEY (aluno, dia));
                CREATE TABLE IF NOT EXISTS assinatura (email TEXT PRIMARY KEY, status TEXT, assinatura_id TEXT, atualizado REAL);
                CREATE TABLE IF NOT EXISTS aparelho (aluno TEXT PRIMARY KEY, email TEXT, criado REAL);
            """)
            self.db.commit()

    # ---------- memória da conversa ----------
    def fatos(self, aluno):
        with self.lock:
            rows = self.db.execute("SELECT fato FROM fatos WHERE aluno=? ORDER BY criado DESC LIMIT ?",
                                   (aluno, LIMITE_FATOS)).fetchall()
        return [r[0] for r in reversed(rows)]

    def historico(self, aluno):
        with self.lock:
            rows = self.db.execute("SELECT quem, texto FROM conversa WHERE aluno=? ORDER BY criado DESC LIMIT ?",
                                   (aluno, LIMITE_HISTORICO)).fetchall()
        return list(reversed(rows))

    def guardar_turno(self, aluno, pergunta, resposta, fatos_novos=()):
        agora = time.time()
        with self.lock:
            self.db.execute("INSERT INTO conversa VALUES (?,?,?,?)", (aluno, "aluno", pergunta, agora))
            self.db.execute("INSERT INTO conversa VALUES (?,?,?,?)", (aluno, "tutor", resposta, agora + 0.001))
            for f in fatos_novos:
                f = str(f).strip()[:200]
                if f:
                    self.db.execute("INSERT OR IGNORE INTO fatos VALUES (?,?,?)", (aluno, f, agora))
            self.db.commit()

    def esquecer(self, aluno):
        with self.lock:
            for t in ("fatos", "conversa", "uso"):
                self.db.execute(f"DELETE FROM {t} WHERE aluno=?", (aluno,))
            self.db.commit()

    # ---------- limite grátis ----------
    def usar(self, aluno, limite):
        """Conta uma mensagem do dia. Devolve False se o aluno grátis já passou do limite."""
        dia = hoje()
        with self.lock:
            row = self.db.execute("SELECT n FROM uso WHERE aluno=? AND dia=?", (aluno, dia)).fetchone()
            n = row[0] if row else 0
            if n >= limite:
                return False
            self.db.execute("INSERT OR REPLACE INTO uso VALUES (?,?,?)", (aluno, dia, n + 1))
            self.db.commit()
        return True

    # ---------- VIP ----------
    def salvar_assinatura(self, email, status, assinatura_id):
        email = email.strip().lower()
        with self.lock:
            self.db.execute("INSERT OR REPLACE INTO assinatura VALUES (?,?,?,?)", (email, status, assinatura_id, time.time()))
            self.db.commit()

    def assinatura(self, email):
        with self.lock:
            row = self.db.execute("SELECT status, assinatura_id FROM assinatura WHERE email=?", (email.strip().lower(),)).fetchone()
        return {"status": row[0], "id": row[1]} if row else None

    def vincular(self, aluno, email):
        """Liga este aparelho ao e-mail. Cada e-mail pode ter poucos aparelhos (evita dividir uma assinatura com todo mundo)."""
        email = email.strip().lower()
        with self.lock:
            atual = self.db.execute("SELECT email FROM aparelho WHERE aluno=?", (aluno,)).fetchone()
            if atual and atual[0] == email:
                return True
            n = self.db.execute("SELECT COUNT(*) FROM aparelho WHERE email=?", (email,)).fetchone()[0]
            if n >= MAX_APARELHOS_POR_EMAIL:
                return False
            self.db.execute("INSERT OR REPLACE INTO aparelho VALUES (?,?,?)", (aluno, email, time.time()))
            self.db.commit()
        return True

    def email_do_aluno(self, aluno):
        with self.lock:
            row = self.db.execute("SELECT email FROM aparelho WHERE aluno=?", (aluno,)).fetchone()
        return row[0] if row else None

    def eh_vip(self, aluno):
        email = self.email_do_aluno(aluno)
        a = self.assinatura(email) if email else None
        return bool(a and a["status"] in ATIVOS)
