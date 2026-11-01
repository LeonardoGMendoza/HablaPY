# HablaPY 🇵🇾

**Espanhol para brasileiros que vão morar ou estudar medicina no Paraguai**, com uma professora de IA 3D que conversa por voz, corrige seus erros em português e lembra de você — e aulas ao vivo com professor nativo para assinantes VIP.

Feito a partir do [StudentMedical](https://github.com/LeonardoGMendoza/StudentMedical) (mesmo avatar realista, voz e servidor).

## O que já faz

- **Professora 3D** (Sofía) ou **professor** (Mateo), com boca sincronizada, gestos e roupa com as cores do Paraguai.
- **Trilha "Vou para o Paraguai"** — 11 lições: cumprimentos, falsos amigos, dinheiro (guaraníes), mercado, alugar casa, ônibus, documentos, faculdade, farmácia, **espanhol médico (anamnese)** e **guarani básico**.
  - Cada frase: toque para ouvir em espanhol (voz do Paraguai) + tradução e dica.
  - 🎤 **Nota de pronúncia**: o aluno repete a frase e recebe nota de 0 a 100.
  - **Quiz** com explicação e **role-play com a IA** (o aluno conversa com o dono do apartamento, a farmacêutica, o paciente…).
- **Conversa livre** com a IA: responde em espanhol simples, mostra a tradução e corrige o aluno em português (de olho nos falsos cognatos).
- **VIP pelo Mercado Pago** (Pix ou cartão, assinatura mensal): libera todas as lições, conversa sem limite e o link das **aulas ao vivo no Google Meet**.
- Grátis: 6 lições + 15 mensagens por dia com a IA (configurável).

## Estrutura

```
app/                      site (Vite), igual ao StudentMedical
  src/app.js               telas: trilha, lição, conversa, VIP
  src/conteudo/licoes.js   TODAS as lições (fácil de editar e aumentar)
  src/pronuncia.js         nota de pronúncia
  src/estilo.js            cores da roupa e nomes dos professores
  src/professor.js         avatar 3D (TalkingHead)
backend/                  API FastAPI
  app/ia.py                professora de IA (Oracle Generative AI)
  app/pagamentos.py        assinatura Mercado Pago + webhook
  app/memoria.py           memória do aluno, limite grátis e VIP (SQLite)
  app/voz.py               voz neural (Azure: es-PY e pt-BR)
```

## Rodar no PC

```bash
cd app
npm install
npm run dev          # abre em http://localhost:5173
npm run build        # gera ../demo para o GitHub Pages
```

Servidor:
```bash
cd backend
pip install -r requirements.txt
copy .env.example .env      # e preencha
uvicorn app.main:app --reload
python -m unittest discover -s tests     # testes (precisa de: pip install httpx)
```

## Colocar no ar (mesma VPS do VinaCare/StudentMedical)

1. No Cloudflare, crie o subdomínio `hablapy.sandlj.com.br` apontando para a VPS.
2. Na VPS: `docker build -t hablapy backend && docker run -d --name hablapy --restart always --env-file backend/.env -v hablapy-data:/data -p 8020:8000 hablapy` e aponte o proxy (Nginx/Caddy) para a porta 8020.
3. **Mercado Pago** → *Suas integrações* → crie a aplicação, copie o **Access Token de produção** para `MP_ACCESS_TOKEN`.
   Em **Webhooks**, cadastre `https://hablapy.sandlj.com.br/api/mercadopago/webhook`, marque o evento **Planos e assinaturas** e copie a **assinatura secreta** para `MP_WEBHOOK_SECRET`.
4. **Azure Speech** (a mesma chave do VinaCare) em `AZURE_SPEECH_KEY` — é ela que fala com sotaque do Paraguai.

## Marcar uma aula ao vivo

Crie a reunião no Google Agenda/Meet e cadastre (troque o token):
```bash
curl -X PUT https://hablapy.sandlj.com.br/api/admin/aulas \
  -H "X-Admin-Token: SEU_TOKEN" -H "Content-Type: application/json" \
  -d @backend/aulas-exemplo.json
```
Quem é VIP vê o botão **Entrar na aula**; quem não é vê a data com cadeado (vitrine para assinar).

## Observações

- O VIP fica ligado ao **e-mail** usado no Mercado Pago; cada e-mail pode ser usado em até 3 aparelhos ("Já sou VIP neste e-mail").
- As lições não substituem orientação oficial: para documentos e imigração, a professora sempre manda confirmar no órgão oficial.
