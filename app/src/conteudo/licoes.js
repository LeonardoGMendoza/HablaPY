// Trilha "Vou para o Paraguai": espanhol do dia a dia, da faculdade e do hospital para brasileiros.
// Cada lição: frases (o professor fala em espanhol e mostra a tradução), quiz e uma cena para praticar com a IA.
// gratis: true = aberta para todos; false = só VIP.

export const LICOES = [
  {
    id: 'saludos', icone: '👋', gratis: true, nivel: 'A1',
    titulo: { pt: 'Cumprimentos e apresentação', es: 'Saludos y presentaciones' },
    intro: 'Vamos aprender a cumprimentar e a se apresentar. No Paraguai muita gente usa "vos" no lugar de "tú": "¿Vos sos de Brasil?".',
    frases: [
      { es: '¡Hola! ¿Cómo estás?', pt: 'Oi! Como você está?' },
      { es: 'Buenos días. Buenas tardes. Buenas noches.', pt: 'Bom dia. Boa tarde. Boa noite.' },
      { es: 'Me llamo Leonardo. ¿Y vos, cómo te llamás?', pt: 'Eu me chamo Leonardo. E você, como se chama?', dica: '"Vos" + "llamás" é o jeito paraguaio e argentino. "Tú te llamas" também é entendido.' },
      { es: 'Soy de Brasil. Vengo de São Paulo.', pt: 'Sou do Brasil. Venho de São Paulo.' },
      { es: 'Mucho gusto. Encantado.', pt: 'Muito prazer. Encantado.', dica: 'Mulher diz "encantada".' },
      { es: 'Vine a estudiar medicina.', pt: 'Vim estudar medicina.', dica: 'Em espanhol vem um "a": "vine A estudiar". Em português não: "vim estudar".' },
      { es: 'Hablo un poco de español. ¿Podés hablar más despacio?', pt: 'Falo um pouco de espanhol. Pode falar mais devagar?' },
      { es: '¡Nos vemos! ¡Hasta luego!', pt: 'A gente se vê! Até logo!' }
    ],
    quiz: [
      { p: 'Como se diz "muito prazer"?', o: ['Mucho placer', 'Mucho gusto', 'Muy prazer'], c: 1, e: '"Mucho gusto" é o normal. "Placer" existe, mas não se usa para se apresentar.' },
      { p: 'No Paraguai, "¿Vos sos de Brasil?" quer dizer…', o: ['Você é do Brasil?', 'Vocês são do Brasil?', 'Sua avó é do Brasil?'], c: 0, e: '"Vos sos" = "você é" no voseo paraguaio.' },
      { p: 'Para pedir que falem devagar:', o: ['¿Podés hablar más rápido?', '¿Podés hablar más despacio?', '¿Podés hablar más devagar?'], c: 1, e: '"Despacio" = devagar. "Devagar" não existe em espanhol.' },
      { p: '"Buenas noches" se usa…', o: ['Só para ir dormir', 'À noite, para chegar ou sair', 'De manhã'], c: 1, e: 'Serve para cumprimentar e para se despedir à noite.' }
    ],
    cena: { pt: 'Você chegou na faculdade e conhece um colega paraguaio no primeiro dia.', inicio: '¡Hola! ¿Sos nuevo acá? Yo me llamo Diego. ¿Y vos?' }
  },
  {
    id: 'falsos', icone: '⚠️', gratis: true, nivel: 'A1',
    titulo: { pt: 'Falsos amigos (cuidado!)', es: 'Falsos amigos' },
    intro: 'Palavras parecidas com o português, mas com outro significado. São as que mais fazem brasileiro passar vergonha!',
    frases: [
      { es: 'Estoy embarazada.', pt: 'Estou GRÁVIDA.', dica: 'Envergonhado é "avergonzado".' },
      { es: 'La comida está exquisita.', pt: 'A comida está DELICIOSA.', dica: '"Exquisito" é elogio, não "esquisito". Esquisito = "raro".' },
      { es: 'Trabajo en una oficina.', pt: 'Trabalho num ESCRITÓRIO.', dica: 'Oficina mecânica = "taller".' },
      { es: '¿Cuál es tu apellido?', pt: 'Qual é o seu SOBRENOME?', dica: 'Apelido = "apodo".' },
      { es: 'Esperame un rato.', pt: 'Me espere um MOMENTO.', dica: 'O bicho rato é "ratón".' },
      { es: 'Vamos a cenar a las nueve.', pt: 'Vamos JANTAR às nove.', dica: 'Cena de filme = "escena".' },
      { es: 'Este jamón está rico. El presunto es él.', pt: 'Este PRESUNTO está gostoso. O SUSPEITO é ele.', dica: 'Presunto em espanhol é "jamón"; "presunto" = suspeito.' },
      { es: 'No me acuerdo. Me despierto temprano.', pt: 'Não me LEMBRO. Eu ACORDO cedo.', dica: '"Acordarse" = lembrar. Acordar = "despertarse".' }
    ],
    quiz: [
      { p: '"Estoy embarazada" significa…', o: ['Estou envergonhada', 'Estou grávida', 'Estou embaraçada'], c: 1, e: 'Embarazada = grávida. Muito cuidado com essa!' },
      { p: 'Como se diz "sobrenome"?', o: ['Apodo', 'Sobrenombre', 'Apellido'], c: 2, e: 'Apellido = sobrenome. Apodo = apelido.' },
      { p: '"Esperame un rato" quer dizer…', o: ['Espere um momento', 'Espere o rato', 'Espere rápido'], c: 0, e: 'Rato = momento, um tempinho.' },
      { p: 'Se a comida está "exquisita", ela está…', o: ['Estranha', 'Deliciosa', 'Estragada'], c: 1, e: 'Exquisito é um elogio forte.' }
    ],
    cena: { pt: 'Você está jantando na casa de uma família paraguaia e quer elogiar a comida e se apresentar.', inicio: '¡Bienvenido a casa! ¿Te gusta la sopa paraguaya?' }
  },
  {
    id: 'plata', icone: '💵', gratis: true, nivel: 'A1',
    titulo: { pt: 'Números, dinheiro e preços', es: 'Números, plata y precios' },
    intro: 'No Paraguai a moeda é o guarani (₲). Os preços têm muitos zeros, então treine os números grandes. Dinheiro, na rua, é "plata".',
    frases: [
      { es: '¿Cuánto cuesta? ¿Cuánto sale?', pt: 'Quanto custa?', dica: '"¿Cuánto sale?" é muito usado no Paraguai e na Argentina.' },
      { es: 'Son veinticinco mil guaraníes.', pt: 'São vinte e cinco mil guaranis.' },
      { es: 'Cien mil, doscientos mil, quinientos mil.', pt: 'Cem mil, duzentos mil, quinhentos mil.', dica: '"Cien" sozinho; "ciento" antes de outro número: ciento veinte.' },
      { es: '¿Aceptan tarjeta o solo efectivo?', pt: 'Aceitam cartão ou só dinheiro?' },
      { es: '¿Tenés cambio? No tengo sencillo.', pt: 'Você tem troco? Não tenho dinheiro trocado.' },
      { es: 'Me falta el vuelto.', pt: 'Falta o meu troco.', dica: 'O troco que você recebe é "el vuelto".' },
      { es: 'Está muy caro. ¿Me hacés un descuento?', pt: 'Está muito caro. Me dá um desconto?' },
      { es: '¿Dónde hay un cajero automático?', pt: 'Onde tem um caixa eletrônico?' }
    ],
    quiz: [
      { p: 'Como se diz "troco" (o dinheiro que volta)?', o: ['El troco', 'El vuelto', 'La vuelta del dinero'], c: 1, e: 'No Paraguai se diz "el vuelto".' },
      { p: '"Cien mil" é…', o: ['100.000', '1.000.000', '10.000'], c: 0, e: 'Cien mil = cem mil.' },
      { p: '"Efectivo" quer dizer…', o: ['Cartão', 'Dinheiro vivo', 'Efetivo do exército'], c: 1, e: 'Pagar en efectivo = pagar em dinheiro.' },
      { p: 'Como se escreve 120?', o: ['Cien veinte', 'Ciento veinte', 'Cento vinte'], c: 1, e: '"Ciento" quando vem outro número depois.' }
    ],
    cena: { pt: 'Você está comprando numa despensa (mercadinho de bairro) e quer saber preços e pagar.', inicio: '¡Buenas! ¿Qué vas a llevar?' }
  },
  {
    id: 'compras', icone: '🛒', gratis: true, nivel: 'A1',
    titulo: { pt: 'No mercado e na despensa', es: 'En el súper y la despensa' },
    intro: 'Comida do dia a dia e as palavras que mudam do Brasil para o Paraguai.',
    frases: [
      { es: 'Quisiera un kilo de tomate y medio kilo de cebolla.', pt: 'Eu queria um quilo de tomate e meio quilo de cebola.' },
      { es: '¿Tienen leche, huevos y pan?', pt: 'Vocês têm leite, ovos e pão?' },
      { es: 'Una docena de chipa, por favor.', pt: 'Uma dúzia de chipa, por favor.', dica: 'Chipa é o pão de queijo paraguaio. "La chipa".' },
      { es: 'Necesito aceite, arroz y fideos.', pt: 'Preciso de óleo, arroz e macarrão.', dica: '"Aceite" é óleo; azeite de oliva = "aceite de oliva".' },
      { es: '¿Dónde están las bolsas?', pt: 'Onde estão as sacolas?' },
      { es: 'Una yerba para tereré.', pt: 'Uma erva para tereré.', dica: 'Tereré é o chimarrão gelado, bebida símbolo do Paraguai.' },
      { es: 'Esto está vencido.', pt: 'Isto está vencido (fora da validade).' },
      { es: '¿Me das una bolsa? Gracias, ¡buen día!', pt: 'Me dá uma sacola? Obrigado, bom dia!' }
    ],
    quiz: [
      { p: '"Fideos" são…', o: ['Feijão', 'Macarrão', 'Figos'], c: 1, e: 'Fideos = macarrão.' },
      { p: 'O tereré é…', o: ['Uma comida de milho', 'Erva-mate gelada', 'Um doce'], c: 1, e: 'Tereré = erva-mate com água gelada.' },
      { p: '"Aceite" é…', o: ['Óleo', 'Azeitona', 'Aceitar'], c: 0, e: 'Aceite = óleo (de cozinha).' },
      { p: 'Para pedir com educação: "Eu queria…"', o: ['Quería tener', 'Quisiera', 'Yo queria'], c: 1, e: '"Quisiera…" é o jeito educado de pedir.' }
    ],
    cena: { pt: 'Você está no supermercado e não acha alguns produtos. Pergunte ao funcionário.', inicio: '¡Hola! ¿Te puedo ayudar en algo?' }
  },
  {
    id: 'alquiler', icone: '🏠', gratis: true, nivel: 'A2',
    titulo: { pt: 'Alugar casa ou quarto', es: 'Alquilar un departamento' },
    intro: 'Frases para procurar moradia, falar com o dono e entender o contrato. Leia tudo antes de assinar!',
    frases: [
      { es: 'Busco un departamento cerca de la facultad.', pt: 'Procuro um apartamento perto da faculdade.' },
      { es: '¿Cuánto es el alquiler por mes?', pt: 'Quanto é o aluguel por mês?' },
      { es: '¿Está incluida la luz, el agua y el internet?', pt: 'Luz, água e internet estão incluídas?' },
      { es: '¿Hay que pagar depósito o garantía?', pt: 'Precisa pagar depósito ou caução?' },
      { es: '¿Está amueblado? ¿Tiene aire acondicionado?', pt: 'É mobiliado? Tem ar-condicionado?', dica: 'No verão do Paraguai o ar-condicionado faz muita diferença.' },
      { es: 'Quisiera verlo antes de firmar el contrato.', pt: 'Queria ver antes de assinar o contrato.' },
      { es: 'Busco una pieza para compartir.', pt: 'Procuro um quarto para dividir.', dica: '"Pieza" = quarto em vários países do sul.' },
      { es: 'Se rompió la ducha. ¿Cuándo la pueden arreglar?', pt: 'O chuveiro quebrou. Quando podem consertar?' }
    ],
    quiz: [
      { p: '"Amueblado" quer dizer…', o: ['Mobiliado', 'Alugado', 'Amassado'], c: 0, e: 'Amueblado = com móveis.' },
      { p: 'Como se diz "aluguel"?', o: ['Aluguer', 'Alquiler', 'Arriendo'], c: 1, e: 'Alquiler (arriendo se usa em outros países).' },
      { p: '"Se rompió la ducha" significa…', o: ['O chuveiro quebrou', 'A ducha está rompida no contrato', 'Acabou a água'], c: 0, e: 'Romperse = quebrar.' },
      { p: '"Pieza" no Paraguai é…', o: ['Peça de carro', 'Quarto', 'Prédio'], c: 1, e: 'Alquilar una pieza = alugar um quarto.' }
    ],
    cena: { pt: 'Você liga para o dono de um apartamento anunciado e quer saber preço, o que está incluso e visitar.', inicio: 'Hola, sí, habla Ramón. ¿Por el departamento que publiqué?' }
  },
  {
    id: 'transporte', icone: '🚌', gratis: true, nivel: 'A2',
    titulo: { pt: 'Ônibus, táxi e direções', es: 'Colectivo, taxi y direcciones' },
    intro: 'Ônibus no Paraguai é "colectivo". Aprenda a perguntar caminhos e a pegar condução.',
    frases: [
      { es: '¿Qué colectivo me lleva al centro?', pt: 'Que ônibus me leva ao centro?' },
      { es: '¿Dónde queda la parada?', pt: 'Onde fica o ponto de ônibus?', dica: '"Quedar" = ficar (localização).' },
      { es: 'Seguí derecho dos cuadras y doblá a la izquierda.', pt: 'Siga reto duas quadras e vire à esquerda.', dica: '"Derecho" = reto; "a la derecha" = à direita. Cuidado!' },
      { es: 'Está a la vuelta de la esquina.', pt: 'Fica virando a esquina.' },
      { es: '¿Me avisás cuando lleguemos?', pt: 'Você me avisa quando chegarmos?' },
      { es: 'Bajo en la próxima, por favor.', pt: 'Desço no próximo, por favor.' },
      { es: 'Pedí un auto por la aplicación.', pt: 'Chamei um carro pelo aplicativo.', dica: 'Carro = "auto" ou "coche"; no Paraguai, mais "auto".' },
      { es: '¿Cuánto tarda en llegar?', pt: 'Quanto tempo demora para chegar?' }
    ],
    quiz: [
      { p: '"Seguí derecho" quer dizer…', o: ['Vire à direita', 'Siga reto', 'Siga pela direita'], c: 1, e: 'Derecho = reto. A la derecha = à direita.' },
      { p: 'Ônibus no Paraguai se diz…', o: ['Ómnibus', 'Bus ou colectivo', 'Camión'], c: 1, e: 'Colectivo (ou bus).' },
      { p: '"¿Dónde queda?" significa…', o: ['Onde fica?', 'Onde caiu?', 'Quando volta?'], c: 0, e: 'Quedar = ficar/localizar-se.' },
      { p: '"Doblá a la izquierda" é…', o: ['Dobre o papel', 'Vire à esquerda', 'Siga à direita'], c: 1, e: 'Doblar = virar (numa rua).' }
    ],
    cena: { pt: 'Você se perdeu indo para a faculdade e pede informação a uma senhora na rua.', inicio: '¿Estás perdido, mi hijo? ¿A dónde querés ir?' }
  },
  {
    id: 'tramites', icone: '📄', gratis: false, nivel: 'A2',
    titulo: { pt: 'Documentos e burocracia', es: 'Trámites y documentos' },
    intro: 'Frases para resolver documentos, agendar atendimento e entender o que pedem. Confirme sempre as regras atuais no órgão oficial.',
    frases: [
      { es: 'Necesito sacar un turno.', pt: 'Preciso agendar um atendimento.', dica: '"Turno" = horário marcado, agendamento.' },
      { es: '¿Qué documentos tengo que traer?', pt: 'Que documentos preciso trazer?' },
      { es: 'Traje mi pasaporte y una fotocopia.', pt: 'Trouxe meu passaporte e uma cópia.' },
      { es: '¿Tiene que estar autenticado o apostillado?', pt: 'Precisa ser autenticado ou apostilado?' },
      { es: '¿En qué ventanilla me atienden?', pt: 'Em qual guichê me atendem?' },
      { es: 'Vengo por el carnet de residencia.', pt: 'Venho pela carteira de residência.' },
      { es: 'Me falta un sello. ¿Dónde lo consigo?', pt: 'Falta um carimbo. Onde eu consigo?' },
      { es: '¿Cuánto tiempo tarda el trámite?', pt: 'Quanto tempo demora o processo?' }
    ],
    quiz: [
      { p: '"Sacar un turno" é…', o: ['Fazer hora extra', 'Agendar um atendimento', 'Tirar uma foto'], c: 1, e: 'Turno = horário marcado.' },
      { p: '"Ventanilla" é…', o: ['Janela de casa', 'Guichê de atendimento', 'Ventilador'], c: 1, e: 'Ventanilla = guichê.' },
      { p: '"Sello" é…', o: ['Selo de carta só', 'Carimbo', 'Assinatura'], c: 1, e: 'Sello = carimbo (e também selo).' },
      { p: '"Trámite" é…', o: ['Processo burocrático', 'Trâmite de trem', 'Transporte'], c: 0, e: 'Hacer un trámite = resolver um processo/documento.' }
    ],
    cena: { pt: 'Você está num guichê de atendimento público para dar entrada num documento de residência.', inicio: 'Buenos días. ¿Qué trámite viene a hacer?' }
  },
  {
    id: 'facultad', icone: '🎓', gratis: false, nivel: 'A2',
    titulo: { pt: 'Na faculdade', es: 'En la facultad' },
    intro: 'Matrícula, aulas, provas e conversa com professores e colegas.',
    frases: [
      { es: 'Quiero inscribirme en el primer semestre.', pt: 'Quero me matricular no primeiro semestre.' },
      { es: '¿Cuándo empiezan las clases?', pt: 'Quando começam as aulas?' },
      { es: 'Profe, ¿puede repetir la última parte?', pt: 'Professor, pode repetir a última parte?', dica: '"Profe" é carinhoso e muito usado.' },
      { es: 'No entendí la consigna del trabajo práctico.', pt: 'Não entendi o enunciado do trabalho prático.' },
      { es: '¿Cuándo es el parcial? ¿Y el examen final?', pt: 'Quando é a prova parcial? E o exame final?' },
      { es: '¿Me prestás tus apuntes?', pt: 'Me empresta suas anotações?', dica: '"Apuntes" = anotações/caderno.' },
      { es: 'Hagamos un grupo de estudio.', pt: 'Vamos fazer um grupo de estudo.' },
      { es: 'Aprobé anatomía. Reprobé bioquímica.', pt: 'Passei em anatomia. Reprovei em bioquímica.' }
    ],
    quiz: [
      { p: '"Apuntes" são…', o: ['Anotações', 'Apontadores', 'Pontos extras'], c: 0, e: 'Apuntes = anotações de aula.' },
      { p: '"Aprobé" quer dizer…', o: ['Aprovei (passei)', 'Provei comida', 'Aprendi'], c: 0, e: 'Aprobar = passar na matéria.' },
      { p: 'O "parcial" é…', o: ['Uma prova no meio do semestre', 'Meio período', 'Um desconto'], c: 0, e: 'Parcial = prova parcial.' },
      { p: '"Inscribirme" significa…', o: ['Escrever um texto', 'Matricular-me', 'Assinar um livro'], c: 1, e: 'Inscribirse = matricular-se.' }
    ],
    cena: { pt: 'Você foi falar com a secretaria da faculdade sobre matrícula e horários.', inicio: 'Buenas tardes, secretaría académica. ¿En qué te puedo ayudar?' }
  },
  {
    id: 'farmacia', icone: '💊', gratis: false, nivel: 'A2',
    titulo: { pt: 'Farmácia e consulta', es: 'En la farmacia y el médico' },
    intro: 'Para quando você mesmo precisar de atendimento.',
    frases: [
      { es: 'Me duele la cabeza y la garganta.', pt: 'Estou com dor de cabeça e de garganta.' },
      { es: 'Tengo fiebre desde ayer.', pt: 'Estou com febre desde ontem.' },
      { es: 'Estoy resfriado. Tengo tos.', pt: 'Estou resfriado. Estou com tosse.' },
      { es: '¿Necesito receta para este remedio?', pt: 'Preciso de receita para este remédio?' },
      { es: 'Soy alérgico a la penicilina.', pt: 'Sou alérgico à penicilina.' },
      { es: '¿Dónde queda la guardia más cercana?', pt: 'Onde fica o pronto-socorro mais perto?', dica: '"Guardia" ou "urgencias" = pronto-socorro.' },
      { es: 'Me siento mareado.', pt: 'Estou com tontura.', dica: 'Mareado = tonto, com tontura.' },
      { es: '¿Cada cuántas horas lo tomo?', pt: 'De quantas em quantas horas eu tomo?' }
    ],
    quiz: [
      { p: '"Mareado" é…', o: ['Com tontura', 'Com fome', 'Molhado do mar'], c: 0, e: 'Mareo = tontura.' },
      { p: 'Pronto-socorro se diz…', o: ['Guardia / urgencias', 'Pronto auxilio', 'Socorro rápido'], c: 0, e: 'La guardia = pronto-socorro.' },
      { p: '"Tos" é…', o: ['Tosse', 'Todos', 'Tontura'], c: 0, e: 'Tengo tos = estou com tosse.' },
      { p: '"Receta" na farmácia é…', o: ['Receita de bolo', 'Receita médica', 'Recibo'], c: 1, e: 'Receta médica.' }
    ],
    cena: { pt: 'Você está gripado e vai à farmácia explicar os sintomas.', inicio: 'Buenas, ¿qué necesitás?' }
  },
  {
    id: 'medico', icone: '🩺', gratis: false, nivel: 'B1',
    titulo: { pt: 'Espanhol médico: anamnese', es: 'Español médico: anamnesis' },
    intro: 'Perguntas que você vai fazer aos pacientes nos estágios. Fale de "usted" com pacientes.',
    frases: [
      { es: 'Buenos días, soy estudiante de medicina. ¿Qué le pasa?', pt: 'Bom dia, sou estudante de medicina. O que o senhor tem?' },
      { es: '¿Desde cuándo tiene el dolor?', pt: 'Desde quando está com a dor?' },
      { es: '¿Dónde le duele? Muéstreme con el dedo.', pt: 'Onde dói? Me mostre com o dedo.' },
      { es: '¿El dolor se va hacia algún lado?', pt: 'A dor irradia para algum lugar?' },
      { es: '¿Toma algún medicamento? ¿Es alérgico a algo?', pt: 'Toma algum remédio? É alérgico a alguma coisa?' },
      { es: 'Respire hondo. Ahora suelte el aire.', pt: 'Respire fundo. Agora solte o ar.' },
      { es: 'Voy a tomarle la presión.', pt: 'Vou medir a sua pressão.' },
      { es: 'Acuéstese boca arriba, por favor.', pt: 'Deite de barriga para cima, por favor.' }
    ],
    quiz: [
      { p: '"Respire hondo" é…', o: ['Respire fundo', 'Respire rápido', 'Prenda a respiração'], c: 0, e: 'Hondo = fundo.' },
      { p: 'Com pacientes, o mais respeitoso é usar…', o: ['Vos', 'Tú', 'Usted'], c: 2, e: '"Usted" é a forma formal.' },
      { p: '"Tomar la presión" é…', o: ['Medir a pressão', 'Tomar um remédio', 'Fazer pressão'], c: 0, e: 'Tomar la presión arterial.' },
      { p: '"Boca arriba" quer dizer…', o: ['De bruços', 'De barriga para cima', 'De boca aberta'], c: 1, e: 'Boca abajo = de bruços.' }
    ],
    cena: { pt: 'Você é estudante no estágio e vai fazer a anamnese de um paciente com dor abdominal. Fale de "usted".', inicio: 'Buen día, doctor. Me duele mucho la panza desde anoche.' }
  },
  {
    id: 'guarani', icone: '🧉', gratis: false, nivel: 'Extra',
    titulo: { pt: 'Guarani básico do dia a dia', es: 'Guaraní básico' },
    intro: 'O Paraguai tem duas línguas oficiais: espanhol e guarani. Muita gente mistura as duas (o "jopara"). Saber umas palavras abre portas!',
    frases: [
      { es: "Mba'éichapa.", pt: 'Como vai? (em guarani)', dica: 'Resposta comum: "Iporã" (bem).' },
      { es: 'Iporã.', pt: 'Bem / bom / bonito.' },
      { es: 'Aguyje. Aguyjevete.', pt: 'Obrigado. Muito obrigado (mais formal).' },
      { es: 'Jaha.', pt: 'Vamos.' },
      { es: 'Ndaipóri.', pt: 'Não tem / não há.' },
      { es: 'Che.', pt: 'Eu / meu.', dica: 'Também aparece em frases como "che ra\'a" (meu amigo).' }
    ],
    quiz: [
      { p: '"Aguyje" é…', o: ['Água', 'Obrigado', 'Tchau'], c: 1, e: 'Aguyje = obrigado.' },
      { p: '"Mba\'éichapa" serve para…', o: ['Perguntar como vai', 'Pedir comida', 'Se despedir'], c: 0, e: 'É o cumprimento "como vai?".' },
      { p: 'As línguas oficiais do Paraguai são…', o: ['Espanhol e português', 'Espanhol e guarani', 'Só espanhol'], c: 1, e: 'Espanhol e guarani.' }
    ],
    cena: { pt: 'Você está tomando tereré com colegas paraguaios que misturam espanhol e guarani.', inicio: "¡Mba'éichapa! ¿Querés tereré?" }
  }
];
