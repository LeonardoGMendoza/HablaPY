// Trilha "Vou para o Paraguai": espanhol do dia a dia, da faculdade e do hospital.
// O aluno aprende ESPANHOL; as explicações vêm no idioma dele: pt (brasileiros), en (falantes de inglês) ou es (imersão).
// Cada frase: es (o que se aprende), tr (tradução pt/en), dica opcional. gratis: false = só VIP.

export const LICOES = [
  {
    id: 'saludos', icone: '👋', gratis: true, nivel: 'A1',
    titulo: { pt: 'Cumprimentos e apresentação', es: 'Saludos y presentaciones', en: 'Greetings and introductions' },
    intro: {
      pt: 'Vamos aprender a cumprimentar e a se apresentar. No Paraguai muita gente usa "vos" no lugar de "tú": "¿Vos sos de Brasil?".',
      es: 'Vamos a aprender a saludar y presentarte. En Paraguay mucha gente usa "vos" en lugar de "tú": "¿Vos sos de Brasil?".',
      en: 'Let\'s learn to greet people and introduce yourself. In Paraguay many people use "vos" instead of "tú": "¿Vos sos de Brasil?".'
    },
    frases: [
      { es: '¡Hola! ¿Cómo estás?', tr: { pt: 'Oi! Como você está?', en: 'Hi! How are you?' } },
      { es: 'Buenos días. Buenas tardes. Buenas noches.', tr: { pt: 'Bom dia. Boa tarde. Boa noite.', en: 'Good morning. Good afternoon. Good evening.' } },
      { es: 'Me llamo Leonardo. ¿Y vos, cómo te llamás?', tr: { pt: 'Eu me chamo Leonardo. E você, como se chama?', en: 'My name is Leonardo. And you, what\'s your name?' },
        dica: { pt: '"Vos" + "llamás" é o jeito paraguaio e argentino. "Tú te llamas" também é entendido.', es: '"Vos te llamás" es la forma paraguaya y argentina; "tú te llamas" también se entiende.', en: '"Vos te llamás" is the Paraguayan/Argentine form; "tú te llamas" is also understood.' } },
      { es: 'Soy de Brasil. Vengo de São Paulo.', tr: { pt: 'Sou do Brasil. Venho de São Paulo.', en: 'I\'m from Brazil. I come from São Paulo.' } },
      { es: 'Mucho gusto. Encantado.', tr: { pt: 'Muito prazer. Encantado.', en: 'Nice to meet you. Delighted.' },
        dica: { pt: 'Mulher diz "encantada".', es: 'Una mujer dice "encantada".', en: 'A woman says "encantada".' } },
      { es: 'Vine a estudiar medicina.', tr: { pt: 'Vim estudar medicina.', en: 'I came to study medicine.' },
        dica: { pt: 'Em espanhol vem um "a": "vine A estudiar". Em português não: "vim estudar".', es: 'Después de "venir" va "a": "vine a estudiar".', en: 'After "venir" comes "a": "vine a estudiar".' } },
      { es: 'Hablo un poco de español. ¿Podés hablar más despacio?', tr: { pt: 'Falo um pouco de espanhol. Pode falar mais devagar?', en: 'I speak a little Spanish. Can you speak more slowly?' } },
      { es: '¡Nos vemos! ¡Hasta luego!', tr: { pt: 'A gente se vê! Até logo!', en: 'See you! See you later!' } }
    ],
    quiz: [
      { p: { pt: 'Como se diz "muito prazer"?', es: '¿Qué se dice al conocer a alguien?', en: 'How do you say "nice to meet you"?' }, o: ['Mucho placer', 'Mucho gusto', 'Muy prazer'], c: 1,
        e: { pt: '"Mucho gusto" é o normal. "Placer" existe, mas não se usa para se apresentar.', es: '"Mucho gusto" es lo normal; "placer" no se usa para presentarse.', en: '"Mucho gusto" is the normal phrase; "placer" isn\'t used for introductions.' } },
      { p: { pt: 'No Paraguai, "¿Vos sos de Brasil?" quer dizer…', es: 'En Paraguay, "¿Vos sos de Brasil?" es lo mismo que…', en: 'In Paraguay, "¿Vos sos de Brasil?" means…' },
        o: [{ pt: 'Você é do Brasil?', es: '¿Tú eres de Brasil?', en: 'Are you from Brazil?' }, { pt: 'Vocês são do Brasil?', es: '¿Ustedes son de Brasil?', en: 'Are you all from Brazil?' }, { pt: 'Sua avó é do Brasil?', es: '¿Tu abuela es de Brasil?', en: 'Is your grandma from Brazil?' }], c: 0,
        e: { pt: '"Vos sos" = "você é" no voseo paraguaio.', es: '"Vos sos" es igual a "tú eres".', en: '"Vos sos" = "you are" (voseo).' } },
      { p: { pt: 'Para pedir que falem devagar:', es: 'Para pedir que hablen lento:', en: 'To ask someone to speak slowly:' }, o: ['¿Podés hablar más rápido?', '¿Podés hablar más despacio?', '¿Podés hablar más devagar?'], c: 1,
        e: { pt: '"Despacio" = devagar. "Devagar" não existe em espanhol.', es: '"Despacio" es lento; "devagar" es portugués.', en: '"Despacio" = slowly; "devagar" is Portuguese.' } },
      { p: { pt: '"Buenas noches" se usa…', es: '"Buenas noches" se usa…', en: '"Buenas noches" is used…' },
        o: [{ pt: 'Só para ir dormir', es: 'Solo para ir a dormir', en: 'Only before going to bed' }, { pt: 'À noite, para chegar ou sair', es: 'De noche, al llegar o al irse', en: 'At night, when arriving or leaving' }, { pt: 'De manhã', es: 'A la mañana', en: 'In the morning' }], c: 1,
        e: { pt: 'Serve para cumprimentar e para se despedir à noite.', es: 'Sirve para saludar y despedirse de noche.', en: 'It works for both hello and goodbye at night.' } }
    ],
    cena: { pt: 'Você chegou na faculdade e conhece um colega paraguaio no primeiro dia.', es: 'Llegaste a la facultad y conocés a un compañero paraguayo el primer día.', en: 'You arrive at college and meet a Paraguayan classmate on the first day.',
      inicio: '¡Hola! ¿Sos nuevo acá? Yo me llamo Diego. ¿Y vos?' }
  },
  {
    id: 'falsos', icone: '⚠️', gratis: true, nivel: 'A1',
    titulo: { pt: 'Falsos amigos (cuidado!)', es: 'Falsos amigos', en: 'False friends (careful!)' },
    intro: {
      pt: 'Palavras parecidas com o português, mas com outro significado. São as que mais fazem brasileiro passar vergonha!',
      es: 'Palabras que se parecen al portugués (o al inglés) pero significan otra cosa. ¡Las que más vergüenza hacen pasar!',
      en: 'Words that look like Portuguese or English but mean something else. These cause the most embarrassing mistakes!'
    },
    frases: [
      { es: 'Estoy embarazada.', tr: { pt: 'Estou GRÁVIDA.', en: 'I\'m PREGNANT.' },
        dica: { pt: 'Envergonhado é "avergonzado".', es: 'Si te da vergüenza, decí "estoy avergonzado".', en: 'Embarrassed is "avergonzado", not "embarazado"!' } },
      { es: 'La comida está exquisita.', tr: { pt: 'A comida está DELICIOSA.', en: 'The food is DELICIOUS.' },
        dica: { pt: '"Exquisito" é elogio, não "esquisito". Esquisito = "raro".', es: '"Exquisito" es un elogio; lo extraño es "raro".', en: '"Exquisito" is a compliment.' } },
      { es: 'Trabajo en una oficina.', tr: { pt: 'Trabalho num ESCRITÓRIO.', en: 'I work in an OFFICE.' },
        dica: { pt: 'Oficina mecânica = "taller".', es: 'El lugar donde arreglan autos es el "taller".', en: 'A car repair shop is a "taller".' } },
      { es: '¿Cuál es tu apellido?', tr: { pt: 'Qual é o seu SOBRENOME?', en: 'What\'s your LAST NAME?' },
        dica: { pt: 'Apelido = "apodo".', es: 'El nombre cariñoso es el "apodo".', en: 'A nickname is an "apodo".' } },
      { es: 'Esperame un rato.', tr: { pt: 'Me espere um MOMENTO.', en: 'Wait for me a MOMENT.' },
        dica: { pt: 'O bicho rato é "ratón".', es: 'El animal es "ratón".', en: 'The animal (mouse/rat) is "ratón".' } },
      { es: 'Vamos a cenar a las nueve.', tr: { pt: 'Vamos JANTAR às nove.', en: 'Let\'s have DINNER at nine.' },
        dica: { pt: 'Cena de filme = "escena".', es: 'La parte de una película es una "escena".', en: 'A movie scene is an "escena".' } },
      { es: 'Este jamón está rico. El presunto es él.', tr: { pt: 'Este PRESUNTO está gostoso. O SUSPEITO é ele.', en: 'This HAM is tasty. HE is the SUSPECT.' },
        dica: { pt: 'Presunto em espanhol é "jamón"; "presunto" = suspeito.', es: '"Presunto" significa sospechoso.', en: '"Presunto" means alleged/suspect.' } },
      { es: 'No me acuerdo. Me despierto temprano.', tr: { pt: 'Não me LEMBRO. Eu ACORDO cedo.', en: 'I don\'t REMEMBER. I WAKE UP early.' },
        dica: { pt: '"Acordarse" = lembrar. Acordar = "despertarse".', es: '"Acordarse" es recordar; "despertarse" es dejar de dormir.', en: '"Acordarse" = to remember; "despertarse" = to wake up.' } }
    ],
    quiz: [
      { p: { pt: '"Estoy embarazada" significa…', es: '"Estoy embarazada" significa…', en: '"Estoy embarazada" means…' },
        o: [{ pt: 'Estou envergonhada', es: 'Tengo vergüenza', en: 'I\'m embarrassed' }, { pt: 'Estou grávida', es: 'Voy a tener un bebé', en: 'I\'m pregnant' }, { pt: 'Estou embaraçada', es: 'Estoy confundida', en: 'I\'m confused' }], c: 1,
        e: { pt: 'Embarazada = grávida. Muito cuidado com essa!', es: 'Embarazada = va a tener un bebé. ¡Cuidado!', en: 'Embarazada = pregnant. Be careful with this one!' } },
      { p: { pt: 'Como se diz "sobrenome"?', es: '¿Cómo se llama el nombre de familia?', en: 'How do you say "last name"?' }, o: ['Apodo', 'Sobrenombre', 'Apellido'], c: 2,
        e: { pt: 'Apellido = sobrenome. Apodo = apelido.', es: 'El apellido es el nombre de familia; el apodo es un nombre cariñoso.', en: 'Apellido = last name. Apodo = nickname.' } },
      { p: { pt: '"Esperame un rato" quer dizer…', es: '"Esperame un rato" quiere decir…', en: '"Esperame un rato" means…' },
        o: [{ pt: 'Espere um momento', es: 'Esperá un momento', en: 'Wait a moment' }, { pt: 'Espere o rato', es: 'Esperá al ratón', en: 'Wait for the mouse' }, { pt: 'Espere rápido', es: 'Esperá rápido', en: 'Wait quickly' }], c: 0,
        e: { pt: 'Rato = momento, um tempinho.', es: 'Un rato = un momento.', en: 'Un rato = a little while.' } },
      { p: { pt: 'Se a comida está "exquisita", ela está…', es: 'Si la comida está "exquisita", está…', en: 'If the food is "exquisita", it is…' },
        o: [{ pt: 'Estranha', es: 'Rara', en: 'Weird' }, { pt: 'Deliciosa', es: 'Riquísima', en: 'Delicious' }, { pt: 'Estragada', es: 'Podrida', en: 'Spoiled' }], c: 1,
        e: { pt: 'Exquisito é um elogio forte.', es: 'Exquisito es un gran elogio.', en: 'Exquisito is a strong compliment.' } }
    ],
    cena: { pt: 'Você está jantando na casa de uma família paraguaia e quer elogiar a comida e se apresentar.', es: 'Estás cenando en la casa de una familia paraguaya y querés elogiar la comida y presentarte.', en: 'You\'re having dinner with a Paraguayan family and want to praise the food and introduce yourself.',
      inicio: '¡Bienvenido a casa! ¿Te gusta la sopa paraguaya?' }
  },
  {
    id: 'plata', icone: '💵', gratis: true, nivel: 'A1',
    titulo: { pt: 'Números, dinheiro e preços', es: 'Números, plata y precios', en: 'Numbers, money and prices' },
    intro: {
      pt: 'No Paraguai a moeda é o guarani (₲). Os preços têm muitos zeros, então treine os números grandes. Dinheiro, na rua, é "plata".',
      es: 'En Paraguay la moneda es el guaraní (₲). Los precios tienen muchos ceros: practicá los números grandes. En la calle, el dinero es "plata".',
      en: 'Paraguay\'s currency is the guaraní (₲). Prices have lots of zeros, so practice big numbers. On the street, money is "plata".'
    },
    frases: [
      { es: '¿Cuánto cuesta? ¿Cuánto sale?', tr: { pt: 'Quanto custa?', en: 'How much is it?' },
        dica: { pt: '"¿Cuánto sale?" é muito usado no Paraguai e na Argentina.', es: '"¿Cuánto sale?" se usa mucho en Paraguay y Argentina.', en: '"¿Cuánto sale?" is very common in Paraguay and Argentina.' } },
      { es: 'Son veinticinco mil guaraníes.', tr: { pt: 'São vinte e cinco mil guaranis.', en: 'It\'s twenty-five thousand guaraníes.' } },
      { es: 'Cien mil, doscientos mil, quinientos mil.', tr: { pt: 'Cem mil, duzentos mil, quinhentos mil.', en: 'One hundred thousand, two hundred thousand, five hundred thousand.' },
        dica: { pt: '"Cien" sozinho; "ciento" antes de outro número: ciento veinte.', es: '"Cien" solo; "ciento" antes de otro número: ciento veinte.', en: '"Cien" alone; "ciento" before another number: ciento veinte (120).' } },
      { es: '¿Aceptan tarjeta o solo efectivo?', tr: { pt: 'Aceitam cartão ou só dinheiro?', en: 'Do you take cards or cash only?' } },
      { es: '¿Tenés cambio? No tengo sencillo.', tr: { pt: 'Você tem troco? Não tenho dinheiro trocado.', en: 'Do you have change? I don\'t have small bills.' } },
      { es: 'Me falta el vuelto.', tr: { pt: 'Falta o meu troco.', en: 'I\'m missing my change.' },
        dica: { pt: 'O troco que você recebe é "el vuelto".', es: 'Lo que te devuelven es "el vuelto".', en: 'The change you get back is "el vuelto".' } },
      { es: 'Está muy caro. ¿Me hacés un descuento?', tr: { pt: 'Está muito caro. Me dá um desconto?', en: 'It\'s too expensive. Can you give me a discount?' } },
      { es: '¿Dónde hay un cajero automático?', tr: { pt: 'Onde tem um caixa eletrônico?', en: 'Where is there an ATM?' } }
    ],
    quiz: [
      { p: { pt: 'Como se diz "troco" (o dinheiro que volta)?', es: '¿Cómo se llama la plata que te devuelven?', en: 'What do you call the change you get back?' }, o: ['El troco', 'El vuelto', 'La vuelta del dinero'], c: 1,
        e: { pt: 'No Paraguai se diz "el vuelto".', es: 'En Paraguay se dice "el vuelto".', en: 'In Paraguay it\'s "el vuelto".' } },
      { p: { pt: '"Cien mil" é…', es: '"Cien mil" es…', en: '"Cien mil" is…' }, o: ['100.000', '1.000.000', '10.000'], c: 0,
        e: { pt: 'Cien mil = cem mil.', es: 'Cien mil = 100.000.', en: 'Cien mil = 100,000.' } },
      { p: { pt: '"Efectivo" quer dizer…', es: 'Pagar "en efectivo" es pagar con…', en: '"Efectivo" means…' },
        o: [{ pt: 'Cartão', es: 'Tarjeta', en: 'Card' }, { pt: 'Dinheiro vivo', es: 'Billetes y monedas', en: 'Cash' }, { pt: 'Efetivo do exército', es: 'Soldados', en: 'Army troops' }], c: 1,
        e: { pt: 'Pagar en efectivo = pagar em dinheiro.', es: 'En efectivo = con billetes y monedas.', en: 'Pagar en efectivo = pay in cash.' } },
      { p: { pt: 'Como se escreve 120?', es: '¿Cómo se escribe 120?', en: 'How do you write 120?' }, o: ['Cien veinte', 'Ciento veinte', 'Cento vinte'], c: 1,
        e: { pt: '"Ciento" quando vem outro número depois.', es: '"Ciento" cuando sigue otro número.', en: '"Ciento" when another number follows.' } }
    ],
    cena: { pt: 'Você está comprando numa despensa (mercadinho de bairro) e quer saber preços e pagar.', es: 'Estás comprando en una despensa del barrio y querés saber precios y pagar.', en: 'You\'re shopping at a "despensa" (corner store) and want to ask prices and pay.',
      inicio: '¡Buenas! ¿Qué vas a llevar?' }
  },
  {
    id: 'compras', icone: '🛒', gratis: true, nivel: 'A1',
    titulo: { pt: 'No mercado e na despensa', es: 'En el súper y la despensa', en: 'At the supermarket' },
    intro: {
      pt: 'Comida do dia a dia e as palavras que mudam do Brasil para o Paraguai.',
      es: 'Comida de todos los días y las palabras típicas de Paraguay.',
      en: 'Everyday food and the words Paraguayans actually use.'
    },
    frases: [
      { es: 'Quisiera un kilo de tomate y medio kilo de cebolla.', tr: { pt: 'Eu queria um quilo de tomate e meio quilo de cebola.', en: 'I\'d like a kilo of tomatoes and half a kilo of onions.' } },
      { es: '¿Tienen leche, huevos y pan?', tr: { pt: 'Vocês têm leite, ovos e pão?', en: 'Do you have milk, eggs and bread?' } },
      { es: 'Una docena de chipa, por favor.', tr: { pt: 'Uma dúzia de chipa, por favor.', en: 'A dozen chipa, please.' },
        dica: { pt: 'Chipa é o pão de queijo paraguaio. "La chipa".', es: 'La chipa es el pancito de queso típico de Paraguay.', en: 'Chipa is Paraguay\'s cheese bread.' } },
      { es: 'Necesito aceite, arroz y fideos.', tr: { pt: 'Preciso de óleo, arroz e macarrão.', en: 'I need oil, rice and pasta.' },
        dica: { pt: '"Aceite" é óleo; azeite de oliva = "aceite de oliva".', es: '"Aceite de oliva" es el de oliva.', en: '"Aceite" is cooking oil; olive oil is "aceite de oliva".' } },
      { es: '¿Dónde están las bolsas?', tr: { pt: 'Onde estão as sacolas?', en: 'Where are the bags?' } },
      { es: 'Una yerba para tereré.', tr: { pt: 'Uma erva para tereré.', en: 'Some yerba for tereré.' },
        dica: { pt: 'Tereré é o chimarrão gelado, bebida símbolo do Paraguai.', es: 'El tereré es la yerba con agua fría, la bebida nacional.', en: 'Tereré is cold yerba mate, Paraguay\'s national drink.' } },
      { es: 'Esto está vencido.', tr: { pt: 'Isto está vencido (fora da validade).', en: 'This is past its expiry date.' } },
      { es: '¿Me das una bolsa? Gracias, ¡buen día!', tr: { pt: 'Me dá uma sacola? Obrigado, bom dia!', en: 'Can I have a bag? Thanks, have a good day!' } }
    ],
    quiz: [
      { p: { pt: '"Fideos" são…', es: 'Los "fideos" son…', en: '"Fideos" are…' },
        o: [{ pt: 'Feijão', es: 'Porotos', en: 'Beans' }, { pt: 'Macarrão', es: 'Pasta', en: 'Pasta' }, { pt: 'Figos', es: 'Higos', en: 'Figs' }], c: 1,
        e: { pt: 'Fideos = macarrão.', es: 'Fideos = pasta.', en: 'Fideos = pasta/noodles.' } },
      { p: { pt: 'O tereré é…', es: 'El tereré es…', en: 'Tereré is…' },
        o: [{ pt: 'Uma comida de milho', es: 'Una comida de maíz', en: 'A corn dish' }, { pt: 'Erva-mate gelada', es: 'Yerba con agua fría', en: 'Cold yerba mate' }, { pt: 'Um doce', es: 'Un dulce', en: 'A dessert' }], c: 1,
        e: { pt: 'Tereré = erva-mate com água gelada.', es: 'Tereré = yerba con agua bien fría.', en: 'Tereré = yerba mate with ice-cold water.' } },
      { p: { pt: '"Aceite" é…', es: 'El "aceite" sirve para…', en: '"Aceite" is…' },
        o: [{ pt: 'Óleo', es: 'Cocinar y freír', en: 'Oil' }, { pt: 'Azeitona', es: 'Comer de postre', en: 'An olive' }, { pt: 'Aceitar', es: 'Firmar papeles', en: 'To accept' }], c: 0,
        e: { pt: 'Aceite = óleo (de cozinha).', es: 'Aceite = para cocinar.', en: 'Aceite = cooking oil.' } },
      { p: { pt: 'Para pedir com educação: "Eu queria…"', es: 'Para pedir con educación:', en: 'To ask politely, "I\'d like…":' }, o: ['Quería tener', 'Quisiera', 'Yo queria'], c: 1,
        e: { pt: '"Quisiera…" é o jeito educado de pedir.', es: '"Quisiera…" es la forma educada.', en: '"Quisiera…" is the polite form.' } }
    ],
    cena: { pt: 'Você está no supermercado e não acha alguns produtos. Pergunte ao funcionário.', es: 'Estás en el súper y no encontrás algunos productos. Preguntale al empleado.', en: 'You\'re at the supermarket and can\'t find some products. Ask the employee.',
      inicio: '¡Hola! ¿Te puedo ayudar en algo?' }
  },
  {
    id: 'alquiler', icone: '🏠', gratis: true, nivel: 'A2',
    titulo: { pt: 'Alugar casa ou quarto', es: 'Alquilar un departamento', en: 'Renting a place' },
    intro: {
      pt: 'Frases para procurar moradia, falar com o dono e entender o contrato. Leia tudo antes de assinar!',
      es: 'Frases para buscar dónde vivir, hablar con el dueño y entender el contrato. ¡Leé todo antes de firmar!',
      en: 'Phrases to find a place, talk to the landlord and understand the contract. Read everything before signing!'
    },
    frases: [
      { es: 'Busco un departamento cerca de la facultad.', tr: { pt: 'Procuro um apartamento perto da faculdade.', en: 'I\'m looking for an apartment near the college.' } },
      { es: '¿Cuánto es el alquiler por mes?', tr: { pt: 'Quanto é o aluguel por mês?', en: 'How much is the rent per month?' } },
      { es: '¿Está incluida la luz, el agua y el internet?', tr: { pt: 'Luz, água e internet estão incluídas?', en: 'Are electricity, water and internet included?' } },
      { es: '¿Hay que pagar depósito o garantía?', tr: { pt: 'Precisa pagar depósito ou caução?', en: 'Is there a deposit or guarantee to pay?' } },
      { es: '¿Está amueblado? ¿Tiene aire acondicionado?', tr: { pt: 'É mobiliado? Tem ar-condicionado?', en: 'Is it furnished? Does it have air conditioning?' },
        dica: { pt: 'No verão do Paraguai o ar-condicionado faz muita diferença.', es: 'En el verano paraguayo el aire acondicionado es clave.', en: 'In Paraguay\'s summer, AC makes a huge difference.' } },
      { es: 'Quisiera verlo antes de firmar el contrato.', tr: { pt: 'Queria ver antes de assinar o contrato.', en: 'I\'d like to see it before signing the contract.' } },
      { es: 'Busco una pieza para compartir.', tr: { pt: 'Procuro um quarto para dividir.', en: 'I\'m looking for a room to share.' },
        dica: { pt: '"Pieza" = quarto em vários países do sul.', es: '"Pieza" = habitación.', en: '"Pieza" = room in South American Spanish.' } },
      { es: 'Se rompió la ducha. ¿Cuándo la pueden arreglar?', tr: { pt: 'O chuveiro quebrou. Quando podem consertar?', en: 'The shower broke. When can you fix it?' } }
    ],
    quiz: [
      { p: { pt: '"Amueblado" quer dizer…', es: 'Un departamento "amueblado" tiene…', en: '"Amueblado" means…' },
        o: [{ pt: 'Mobiliado', es: 'Muebles', en: 'Furnished' }, { pt: 'Alugado', es: 'Inquilinos', en: 'Rented' }, { pt: 'Amassado', es: 'Paredes rotas', en: 'Crumpled' }], c: 0,
        e: { pt: 'Amueblado = com móveis.', es: 'Amueblado = con muebles.', en: 'Amueblado = with furniture.' } },
      { p: { pt: 'Como se diz "aluguel"?', es: '¿Cómo se dice lo que pagás por vivir en una casa ajena?', en: 'How do you say "rent"?' }, o: ['Aluguer', 'Alquiler', 'Rentado'], c: 1,
        e: { pt: 'Alquiler.', es: 'El alquiler.', en: 'Alquiler.' } },
      { p: { pt: '"Se rompió la ducha" significa…', es: '"Se rompió la ducha" significa que…', en: '"Se rompió la ducha" means…' },
        o: [{ pt: 'O chuveiro quebrou', es: 'La ducha no funciona', en: 'The shower broke' }, { pt: 'Rasgou o contrato', es: 'Se rompió el contrato', en: 'The contract was torn' }, { pt: 'Acabou a água', es: 'No hay agua en el barrio', en: 'The water ran out' }], c: 0,
        e: { pt: 'Romperse = quebrar.', es: 'Romperse = dejar de funcionar.', en: 'Romperse = to break.' } },
      { p: { pt: '"Pieza" no Paraguai é…', es: 'En Paraguay, una "pieza" es…', en: 'In Paraguay a "pieza" is…' },
        o: [{ pt: 'Peça de carro', es: 'Un repuesto de auto', en: 'A car part' }, { pt: 'Quarto', es: 'Una habitación', en: 'A room' }, { pt: 'Prédio', es: 'Un edificio', en: 'A building' }], c: 1,
        e: { pt: 'Alquilar una pieza = alugar um quarto.', es: 'Alquilar una pieza = alquilar una habitación.', en: 'Alquilar una pieza = rent a room.' } }
    ],
    cena: { pt: 'Você liga para o dono de um apartamento anunciado e quer saber preço, o que está incluso e visitar.', es: 'Llamás al dueño de un departamento publicado para saber el precio, qué incluye y visitarlo.', en: 'You call the owner of an advertised apartment to ask the price, what\'s included and to visit.',
      inicio: 'Hola, sí, habla Ramón. ¿Por el departamento que publiqué?' }
  },
  {
    id: 'transporte', icone: '🚌', gratis: true, nivel: 'A2',
    titulo: { pt: 'Ônibus, táxi e direções', es: 'Colectivo, taxi y direcciones', en: 'Bus, taxi and directions' },
    intro: {
      pt: 'Ônibus no Paraguai é "colectivo". Aprenda a perguntar caminhos e a pegar condução.',
      es: 'En Paraguay el bus es el "colectivo". Aprendé a preguntar cómo llegar y a moverte.',
      en: 'In Paraguay the bus is "el colectivo". Learn to ask for directions and get around.'
    },
    frases: [
      { es: '¿Qué colectivo me lleva al centro?', tr: { pt: 'Que ônibus me leva ao centro?', en: 'Which bus takes me downtown?' } },
      { es: '¿Dónde queda la parada?', tr: { pt: 'Onde fica o ponto de ônibus?', en: 'Where is the bus stop?' },
        dica: { pt: '"Quedar" = ficar (localização).', es: '"Quedar" = estar ubicado.', en: '"Quedar" = to be located.' } },
      { es: 'Seguí derecho dos cuadras y doblá a la izquierda.', tr: { pt: 'Siga reto duas quadras e vire à esquerda.', en: 'Go straight two blocks and turn left.' },
        dica: { pt: '"Derecho" = reto; "a la derecha" = à direita. Cuidado!', es: '"Derecho" = sin doblar; "a la derecha" = lado derecho.', en: '"Derecho" = straight on; "a la derecha" = to the right!' } },
      { es: 'Está a la vuelta de la esquina.', tr: { pt: 'Fica virando a esquina.', en: 'It\'s just around the corner.' } },
      { es: '¿Me avisás cuando lleguemos?', tr: { pt: 'Você me avisa quando chegarmos?', en: 'Will you tell me when we get there?' } },
      { es: 'Bajo en la próxima, por favor.', tr: { pt: 'Desço no próximo, por favor.', en: 'I\'m getting off at the next stop, please.' } },
      { es: 'Pedí un auto por la aplicación.', tr: { pt: 'Chamei um carro pelo aplicativo.', en: 'I ordered a car through the app.' },
        dica: { pt: 'Carro = "auto" ou "coche"; no Paraguai, mais "auto".', es: 'En Paraguay se dice más "auto" que "coche".', en: 'Car = "auto" (more common in Paraguay than "coche").' } },
      { es: '¿Cuánto tarda en llegar?', tr: { pt: 'Quanto tempo demora para chegar?', en: 'How long does it take to get there?' } }
    ],
    quiz: [
      { p: { pt: '"Seguí derecho" quer dizer…', es: '"Seguí derecho" quiere decir…', en: '"Seguí derecho" means…' },
        o: [{ pt: 'Vire à direita', es: 'Doblá a la derecha', en: 'Turn right' }, { pt: 'Siga reto', es: 'Seguí sin doblar', en: 'Go straight' }, { pt: 'Siga pela direita', es: 'Caminá por la derecha', en: 'Keep to the right' }], c: 1,
        e: { pt: 'Derecho = reto. A la derecha = à direita.', es: 'Derecho = sin doblar.', en: 'Derecho = straight. A la derecha = to the right.' } },
      { p: { pt: 'Ônibus no Paraguai se diz…', es: 'En Paraguay el bus también se llama…', en: 'In Paraguay a bus is called…' }, o: ['Ómnibus', 'Colectivo', 'Camión'], c: 1,
        e: { pt: 'Colectivo (ou bus).', es: 'Colectivo.', en: 'Colectivo (or bus).' } },
      { p: { pt: '"¿Dónde queda?" significa…', es: '"¿Dónde queda?" pregunta…', en: '"¿Dónde queda?" means…' },
        o: [{ pt: 'Onde fica?', es: 'La ubicación', en: 'Where is it?' }, { pt: 'Onde caiu?', es: 'Dónde se cayó', en: 'Where did it fall?' }, { pt: 'Quando volta?', es: 'Cuándo vuelve', en: 'When does it return?' }], c: 0,
        e: { pt: 'Quedar = ficar/localizar-se.', es: 'Quedar = estar ubicado.', en: 'Quedar = to be located.' } },
      { p: { pt: '"Doblá a la izquierda" é…', es: '"Doblá a la izquierda" es…', en: '"Doblá a la izquierda" is…' },
        o: [{ pt: 'Dobre o papel', es: 'Doblar un papel', en: 'Fold the paper' }, { pt: 'Vire à esquerda', es: 'Girar a la izquierda', en: 'Turn left' }, { pt: 'Siga à direita', es: 'Seguir a la derecha', en: 'Keep right' }], c: 1,
        e: { pt: 'Doblar = virar (numa rua).', es: 'Doblar en una calle = girar.', en: 'Doblar = to turn (at a street).' } }
    ],
    cena: { pt: 'Você se perdeu indo para a faculdade e pede informação a uma senhora na rua.', es: 'Te perdiste yendo a la facultad y le preguntás a una señora en la calle.', en: 'You got lost going to college and ask a lady on the street for directions.',
      inicio: '¿Estás perdido, mi hijo? ¿A dónde querés ir?' }
  },
  {
    id: 'tramites', icone: '📄', gratis: false, nivel: 'A2',
    titulo: { pt: 'Documentos e burocracia', es: 'Trámites y documentos', en: 'Paperwork and documents' },
    intro: {
      pt: 'Frases para resolver documentos, agendar atendimento e entender o que pedem. Confirme sempre as regras atuais no órgão oficial.',
      es: 'Frases para hacer trámites, sacar turno y entender qué te piden. Confirmá siempre las reglas actuales en la oficina oficial.',
      en: 'Phrases for paperwork, booking appointments and understanding what\'s required. Always check current rules with the official office.'
    },
    frases: [
      { es: 'Necesito sacar un turno.', tr: { pt: 'Preciso agendar um atendimento.', en: 'I need to book an appointment.' },
        dica: { pt: '"Turno" = horário marcado, agendamento.', es: 'Turno = hora reservada.', en: '"Turno" = appointment slot.' } },
      { es: '¿Qué documentos tengo que traer?', tr: { pt: 'Que documentos preciso trazer?', en: 'What documents do I need to bring?' } },
      { es: 'Traje mi pasaporte y una fotocopia.', tr: { pt: 'Trouxe meu passaporte e uma cópia.', en: 'I brought my passport and a photocopy.' } },
      { es: '¿Tiene que estar autenticado o apostillado?', tr: { pt: 'Precisa ser autenticado ou apostilado?', en: 'Does it need to be certified or apostilled?' } },
      { es: '¿En qué ventanilla me atienden?', tr: { pt: 'Em qual guichê me atendem?', en: 'Which counter do I go to?' } },
      { es: 'Vengo por el carnet de residencia.', tr: { pt: 'Venho pela carteira de residência.', en: 'I\'m here for the residence card.' } },
      { es: 'Me falta un sello. ¿Dónde lo consigo?', tr: { pt: 'Falta um carimbo. Onde eu consigo?', en: 'I\'m missing a stamp. Where do I get it?' } },
      { es: '¿Cuánto tiempo tarda el trámite?', tr: { pt: 'Quanto tempo demora o processo?', en: 'How long does the process take?' } }
    ],
    quiz: [
      { p: { pt: '"Sacar un turno" é…', es: '"Sacar un turno" es…', en: '"Sacar un turno" is…' },
        o: [{ pt: 'Fazer hora extra', es: 'Trabajar de más', en: 'Work overtime' }, { pt: 'Agendar um atendimento', es: 'Reservar una hora', en: 'Book an appointment' }, { pt: 'Tirar uma foto', es: 'Sacar una foto', en: 'Take a photo' }], c: 1,
        e: { pt: 'Turno = horário marcado.', es: 'Turno = hora reservada.', en: 'Turno = appointment.' } },
      { p: { pt: '"Ventanilla" é…', es: 'En una oficina, la "ventanilla" es…', en: 'A "ventanilla" is…' },
        o: [{ pt: 'Janela de casa', es: 'La ventana de tu casa', en: 'A house window' }, { pt: 'Guichê de atendimento', es: 'Donde te atienden', en: 'A service counter' }, { pt: 'Ventilador', es: 'Un ventilador', en: 'A fan' }], c: 1,
        e: { pt: 'Ventanilla = guichê.', es: 'Ventanilla = puesto de atención.', en: 'Ventanilla = service counter.' } },
      { p: { pt: '"Sello" é…', es: 'Un "sello" en un documento es…', en: '"Sello" is…' },
        o: [{ pt: 'Só selo de carta', es: 'Solo una estampilla', en: 'Only a postage stamp' }, { pt: 'Carimbo', es: 'La marca oficial', en: 'An official stamp' }, { pt: 'Assinatura', es: 'Una firma', en: 'A signature' }], c: 1,
        e: { pt: 'Sello = carimbo (e também selo).', es: 'Sello = marca oficial con tinta.', en: 'Sello = official stamp.' } },
      { p: { pt: '"Trámite" é…', es: 'Un "trámite" es…', en: 'A "trámite" is…' },
        o: [{ pt: 'Processo burocrático', es: 'Un proceso con papeles', en: 'A bureaucratic process' }, { pt: 'Um trem', es: 'Un tren', en: 'A train' }, { pt: 'Transporte', es: 'Un transporte', en: 'Transportation' }], c: 0,
        e: { pt: 'Hacer un trámite = resolver um processo/documento.', es: 'Hacer un trámite = resolver papeles.', en: 'Hacer un trámite = deal with paperwork.' } }
    ],
    cena: { pt: 'Você está num guichê de atendimento público para dar entrada num documento de residência.', es: 'Estás en una ventanilla pública para iniciar el trámite de residencia.', en: 'You\'re at a public service counter to apply for a residence document.',
      inicio: 'Buenos días. ¿Qué trámite viene a hacer?' }
  },
  {
    id: 'facultad', icone: '🎓', gratis: false, nivel: 'A2',
    titulo: { pt: 'Na faculdade', es: 'En la facultad', en: 'At college' },
    intro: {
      pt: 'Matrícula, aulas, provas e conversa com professores e colegas.',
      es: 'Inscripción, clases, exámenes y charlas con profes y compañeros.',
      en: 'Enrollment, classes, exams and talking with teachers and classmates.'
    },
    frases: [
      { es: 'Quiero inscribirme en el primer semestre.', tr: { pt: 'Quero me matricular no primeiro semestre.', en: 'I want to enroll in the first semester.' } },
      { es: '¿Cuándo empiezan las clases?', tr: { pt: 'Quando começam as aulas?', en: 'When do classes start?' } },
      { es: 'Profe, ¿puede repetir la última parte?', tr: { pt: 'Professor, pode repetir a última parte?', en: 'Teacher, can you repeat the last part?' },
        dica: { pt: '"Profe" é carinhoso e muito usado.', es: '"Profe" es cariñoso y muy común.', en: '"Profe" is friendly and very common.' } },
      { es: 'No entendí la consigna del trabajo práctico.', tr: { pt: 'Não entendi o enunciado do trabalho prático.', en: 'I didn\'t understand the instructions for the assignment.' } },
      { es: '¿Cuándo es el parcial? ¿Y el examen final?', tr: { pt: 'Quando é a prova parcial? E o exame final?', en: 'When is the midterm? And the final exam?' } },
      { es: '¿Me prestás tus apuntes?', tr: { pt: 'Me empresta suas anotações?', en: 'Can you lend me your notes?' },
        dica: { pt: '"Apuntes" = anotações/caderno.', es: 'Apuntes = lo que anotás en clase.', en: '"Apuntes" = class notes.' } },
      { es: 'Hagamos un grupo de estudio.', tr: { pt: 'Vamos fazer um grupo de estudo.', en: 'Let\'s make a study group.' } },
      { es: 'Aprobé anatomía. Reprobé bioquímica.', tr: { pt: 'Passei em anatomia. Reprovei em bioquímica.', en: 'I passed anatomy. I failed biochemistry.' } }
    ],
    quiz: [
      { p: { pt: '"Apuntes" são…', es: 'Los "apuntes" son…', en: '"Apuntes" are…' },
        o: [{ pt: 'Anotações', es: 'Lo que anotás en clase', en: 'Notes' }, { pt: 'Apontadores', es: 'Sacapuntas', en: 'Pencil sharpeners' }, { pt: 'Pontos extras', es: 'Puntos extra', en: 'Extra points' }], c: 0,
        e: { pt: 'Apuntes = anotações de aula.', es: 'Apuntes = notas de clase.', en: 'Apuntes = class notes.' } },
      { p: { pt: '"Aprobé" quer dizer…', es: '"Aprobé" quiere decir…', en: '"Aprobé" means…' },
        o: [{ pt: 'Passei na matéria', es: 'Pasé la materia', en: 'I passed' }, { pt: 'Provei comida', es: 'Probé comida', en: 'I tasted food' }, { pt: 'Aprendi', es: 'Aprendí', en: 'I learned' }], c: 0,
        e: { pt: 'Aprobar = passar na matéria.', es: 'Aprobar = pasar.', en: 'Aprobar = to pass.' } },
      { p: { pt: 'O "parcial" é…', es: 'El "parcial" es…', en: 'The "parcial" is…' },
        o: [{ pt: 'Uma prova no meio do semestre', es: 'Un examen a mitad de semestre', en: 'A midterm exam' }, { pt: 'Meio período', es: 'Medio tiempo', en: 'Part time' }, { pt: 'Um desconto', es: 'Un descuento', en: 'A discount' }], c: 0,
        e: { pt: 'Parcial = prova parcial.', es: 'Parcial = examen del medio.', en: 'Parcial = midterm.' } },
      { p: { pt: '"Inscribirme" significa…', es: '"Inscribirme" significa…', en: '"Inscribirme" means…' },
        o: [{ pt: 'Escrever um texto', es: 'Escribir un texto', en: 'Write a text' }, { pt: 'Matricular-me', es: 'Anotarme en el curso', en: 'Enroll' }, { pt: 'Assinar um livro', es: 'Firmar un libro', en: 'Sign a book' }], c: 1,
        e: { pt: 'Inscribirse = matricular-se.', es: 'Inscribirse = anotarse.', en: 'Inscribirse = to enroll.' } }
    ],
    cena: { pt: 'Você foi falar com a secretaria da faculdade sobre matrícula e horários.', es: 'Fuiste a la secretaría de la facultad a preguntar por la inscripción y los horarios.', en: 'You go to the college office to ask about enrollment and schedules.',
      inicio: 'Buenas tardes, secretaría académica. ¿En qué te puedo ayudar?' }
  },
  {
    id: 'farmacia', icone: '💊', gratis: false, nivel: 'A2',
    titulo: { pt: 'Farmácia e consulta', es: 'En la farmacia y el médico', en: 'Pharmacy and doctor' },
    intro: {
      pt: 'Para quando você mesmo precisar de atendimento.',
      es: 'Para cuando vos mismo necesites atención.',
      en: 'For when you need care yourself.'
    },
    frases: [
      { es: 'Me duele la cabeza y la garganta.', tr: { pt: 'Estou com dor de cabeça e de garganta.', en: 'I have a headache and a sore throat.' } },
      { es: 'Tengo fiebre desde ayer.', tr: { pt: 'Estou com febre desde ontem.', en: 'I\'ve had a fever since yesterday.' } },
      { es: 'Estoy resfriado. Tengo tos.', tr: { pt: 'Estou resfriado. Estou com tosse.', en: 'I have a cold. I have a cough.' } },
      { es: '¿Necesito receta para este remedio?', tr: { pt: 'Preciso de receita para este remédio?', en: 'Do I need a prescription for this medicine?' } },
      { es: 'Soy alérgico a la penicilina.', tr: { pt: 'Sou alérgico à penicilina.', en: 'I\'m allergic to penicillin.' } },
      { es: '¿Dónde queda la guardia más cercana?', tr: { pt: 'Onde fica o pronto-socorro mais perto?', en: 'Where is the nearest emergency room?' },
        dica: { pt: '"Guardia" ou "urgencias" = pronto-socorro.', es: 'Guardia o urgencias = emergencias.', en: '"Guardia" or "urgencias" = ER.' } },
      { es: 'Me siento mareado.', tr: { pt: 'Estou com tontura.', en: 'I feel dizzy.' },
        dica: { pt: 'Mareado = tonto, com tontura.', es: 'Mareado = con la cabeza que da vueltas.', en: 'Mareado = dizzy.' } },
      { es: '¿Cada cuántas horas lo tomo?', tr: { pt: 'De quantas em quantas horas eu tomo?', en: 'How often (every how many hours) do I take it?' } }
    ],
    quiz: [
      { p: { pt: '"Mareado" é…', es: 'Estar "mareado" es…', en: '"Mareado" means…' },
        o: [{ pt: 'Com tontura', es: 'Sentir que todo da vueltas', en: 'Dizzy' }, { pt: 'Com fome', es: 'Tener hambre', en: 'Hungry' }, { pt: 'Molhado do mar', es: 'Mojado del mar', en: 'Wet from the sea' }], c: 0,
        e: { pt: 'Mareo = tontura.', es: 'Mareo = la cabeza da vueltas.', en: 'Mareo = dizziness.' } },
      { p: { pt: 'Pronto-socorro se diz…', es: 'El lugar de emergencias del hospital es…', en: 'The ER is called…' }, o: ['La guardia', 'El pronto auxilio', 'El socorro rápido'], c: 0,
        e: { pt: 'La guardia = pronto-socorro.', es: 'La guardia (o urgencias).', en: 'La guardia (or urgencias).' } },
      { p: { pt: '"Tos" é…', es: 'La "tos" es…', en: '"Tos" is…' },
        o: [{ pt: 'Tosse', es: 'Lo que hacés con la garganta irritada', en: 'A cough' }, { pt: 'Todos', es: 'Todas las personas', en: 'Everyone' }, { pt: 'Tontura', es: 'Mareo', en: 'Dizziness' }], c: 0,
        e: { pt: 'Tengo tos = estou com tosse.', es: 'Tengo tos.', en: 'Tengo tos = I have a cough.' } },
      { p: { pt: '"Receta" na farmácia é…', es: 'En la farmacia, la "receta" es…', en: 'At the pharmacy, a "receta" is…' },
        o: [{ pt: 'Receita de bolo', es: 'Instrucciones de cocina', en: 'A cooking recipe' }, { pt: 'Receita médica', es: 'El papel del médico', en: 'A prescription' }, { pt: 'Recibo', es: 'Un comprobante', en: 'A receipt' }], c: 1,
        e: { pt: 'Receta médica.', es: 'La receta del médico.', en: 'Receta médica = prescription.' } }
    ],
    cena: { pt: 'Você está gripado e vai à farmácia explicar os sintomas.', es: 'Estás engripado y vas a la farmacia a explicar tus síntomas.', en: 'You have the flu and go to the pharmacy to explain your symptoms.',
      inicio: 'Buenas, ¿qué necesitás?' }
  },
  {
    id: 'medico', icone: '🩺', gratis: false, nivel: 'B1',
    titulo: { pt: 'Espanhol médico: anamnese', es: 'Español médico: anamnesis', en: 'Medical Spanish: patient history' },
    intro: {
      pt: 'Perguntas que você vai fazer aos pacientes nos estágios. Fale de "usted" com pacientes.',
      es: 'Preguntas para los pacientes en las prácticas. Con pacientes, hablá de "usted".',
      en: 'Questions you\'ll ask patients during clinical rotations. Use "usted" with patients.'
    },
    frases: [
      { es: 'Buenos días, soy estudiante de medicina. ¿Qué le pasa?', tr: { pt: 'Bom dia, sou estudante de medicina. O que o senhor tem?', en: 'Good morning, I\'m a medical student. What\'s wrong?' } },
      { es: '¿Desde cuándo tiene el dolor?', tr: { pt: 'Desde quando está com a dor?', en: 'Since when have you had the pain?' } },
      { es: '¿Dónde le duele? Muéstreme con el dedo.', tr: { pt: 'Onde dói? Me mostre com o dedo.', en: 'Where does it hurt? Show me with your finger.' } },
      { es: '¿El dolor se va hacia algún lado?', tr: { pt: 'A dor irradia para algum lugar?', en: 'Does the pain spread anywhere?' } },
      { es: '¿Toma algún medicamento? ¿Es alérgico a algo?', tr: { pt: 'Toma algum remédio? É alérgico a alguma coisa?', en: 'Do you take any medication? Are you allergic to anything?' } },
      { es: 'Respire hondo. Ahora suelte el aire.', tr: { pt: 'Respire fundo. Agora solte o ar.', en: 'Take a deep breath. Now breathe out.' } },
      { es: 'Voy a tomarle la presión.', tr: { pt: 'Vou medir a sua pressão.', en: 'I\'m going to take your blood pressure.' } },
      { es: 'Acuéstese boca arriba, por favor.', tr: { pt: 'Deite de barriga para cima, por favor.', en: 'Please lie on your back.' } }
    ],
    quiz: [
      { p: { pt: '"Respire hondo" é…', es: '"Respire hondo" es…', en: '"Respire hondo" is…' },
        o: [{ pt: 'Respire fundo', es: 'Tomar mucho aire', en: 'Take a deep breath' }, { pt: 'Respire rápido', es: 'Respirar rápido', en: 'Breathe fast' }, { pt: 'Prenda a respiração', es: 'No respirar', en: 'Hold your breath' }], c: 0,
        e: { pt: 'Hondo = fundo.', es: 'Hondo = profundo.', en: 'Hondo = deep.' } },
      { p: { pt: 'Com pacientes, o mais respeitoso é usar…', es: 'Con pacientes, lo más respetuoso es usar…', en: 'With patients, the most respectful form is…' }, o: ['Vos', 'Tú', 'Usted'], c: 2,
        e: { pt: '"Usted" é a forma formal.', es: '"Usted" es la forma formal.', en: '"Usted" is the formal form.' } },
      { p: { pt: '"Tomar la presión" é…', es: '"Tomar la presión" es…', en: '"Tomar la presión" is…' },
        o: [{ pt: 'Medir a pressão', es: 'Medir la presión arterial', en: 'Take blood pressure' }, { pt: 'Tomar um remédio', es: 'Tomar un remedio', en: 'Take a medicine' }, { pt: 'Fazer pressão', es: 'Apretar fuerte', en: 'Press hard' }], c: 0,
        e: { pt: 'Tomar la presión arterial.', es: 'Medir la presión arterial.', en: 'Measure blood pressure.' } },
      { p: { pt: '"Boca arriba" quer dizer…', es: '"Boca arriba" quiere decir…', en: '"Boca arriba" means…' },
        o: [{ pt: 'De bruços', es: 'Con la panza hacia abajo', en: 'Face down' }, { pt: 'De barriga para cima', es: 'Con la espalda en la camilla', en: 'On your back' }, { pt: 'De boca aberta', es: 'Con la boca abierta', en: 'Mouth open' }], c: 1,
        e: { pt: 'Boca abajo = de bruços.', es: 'Boca abajo es al revés.', en: 'Boca abajo = face down.' } }
    ],
    cena: { pt: 'Você é estudante no estágio e vai fazer a anamnese de um paciente com dor abdominal. Fale de "usted".', es: 'Sos estudiante en prácticas y vas a hacer la anamnesis de un paciente con dolor abdominal. Hablá de "usted".', en: 'You\'re a medical student taking the history of a patient with abdominal pain. Use "usted".',
      inicio: 'Buen día, doctor. Me duele mucho la panza desde anoche.' }
  },
  {
    id: 'guarani', icone: '🧉', gratis: false, nivel: 'Extra',
    titulo: { pt: 'Guarani básico do dia a dia', es: 'Guaraní básico', en: 'Basic Guarani' },
    intro: {
      pt: 'O Paraguai tem duas línguas oficiais: espanhol e guarani. Muita gente mistura as duas (o "jopara"). Saber umas palavras abre portas!',
      es: 'Paraguay tiene dos idiomas oficiales: español y guaraní. Mucha gente mezcla los dos (el "jopara"). ¡Saber unas palabras abre puertas!',
      en: 'Paraguay has two official languages: Spanish and Guarani. Many people mix them ("jopara"). A few words open doors!'
    },
    frases: [
      { es: "Mba'éichapa.", tr: { pt: 'Como vai? (em guarani)', en: 'How are you? (in Guarani)' },
        dica: { pt: 'Resposta comum: "Iporã" (bem).', es: 'Respuesta común: "Iporã" (bien).', en: 'Common answer: "Iporã" (good).' } },
      { es: 'Iporã.', tr: { pt: 'Bem / bom / bonito.', en: 'Good / fine / pretty.' } },
      { es: 'Aguyje. Aguyjevete.', tr: { pt: 'Obrigado. Muito obrigado (mais formal).', en: 'Thanks. Thank you very much (more formal).' } },
      { es: 'Jaha.', tr: { pt: 'Vamos.', en: 'Let\'s go.' } },
      { es: 'Ndaipóri.', tr: { pt: 'Não tem / não há.', en: 'There isn\'t any.' } },
      { es: 'Che.', tr: { pt: 'Eu / meu.', en: 'I / my.' },
        dica: { pt: 'Também aparece em frases como "che ra\'a" (meu amigo).', es: 'Aparece en "che ra\'a" (mi amigo).', en: 'As in "che ra\'a" (my friend).' } }
    ],
    quiz: [
      { p: { pt: '"Aguyje" é…', es: '"Aguyje" es…', en: '"Aguyje" is…' },
        o: [{ pt: 'Água', es: 'Agua', en: 'Water' }, { pt: 'Obrigado', es: 'Gracias', en: 'Thank you' }, { pt: 'Tchau', es: 'Chau', en: 'Bye' }], c: 1,
        e: { pt: 'Aguyje = obrigado.', es: 'Aguyje = gracias.', en: 'Aguyje = thank you.' } },
      { p: { pt: '"Mba\'éichapa" serve para…', es: '"Mba\'éichapa" sirve para…', en: '"Mba\'éichapa" is used to…' },
        o: [{ pt: 'Perguntar como vai', es: 'Preguntar cómo estás', en: 'Ask how someone is' }, { pt: 'Pedir comida', es: 'Pedir comida', en: 'Order food' }, { pt: 'Se despedir', es: 'Despedirse', en: 'Say goodbye' }], c: 0,
        e: { pt: 'É o cumprimento "como vai?".', es: 'Es el saludo "¿cómo estás?".', en: 'It\'s the greeting "how are you?".' } },
      { p: { pt: 'As línguas oficiais do Paraguai são…', es: 'Los idiomas oficiales de Paraguay son…', en: 'Paraguay\'s official languages are…' },
        o: [{ pt: 'Espanhol e português', es: 'Español y portugués', en: 'Spanish and Portuguese' }, { pt: 'Espanhol e guarani', es: 'Español y guaraní', en: 'Spanish and Guarani' }, { pt: 'Só espanhol', es: 'Solo español', en: 'Only Spanish' }], c: 1,
        e: { pt: 'Espanhol e guarani.', es: 'Español y guaraní.', en: 'Spanish and Guarani.' } }
    ],
    cena: { pt: 'Você está tomando tereré com colegas paraguaios que misturam espanhol e guarani.', es: 'Estás tomando tereré con compañeros paraguayos que mezclan español y guaraní.', en: 'You\'re drinking tereré with Paraguayan classmates who mix Spanish and Guarani.',
      inicio: "¡Mba'éichapa! ¿Querés tereré?" }
  }
];
