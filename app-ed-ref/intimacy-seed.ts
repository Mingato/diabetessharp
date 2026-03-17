import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { intimacyPositions, romanceTips } from "../drizzle/schema";

async function seedIntimacy() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL!);
  const db = drizzle(connection);

  // ── Positions ──────────────────────────────────────────────────────────────
  const positions = [
    // CLASSIC
    {
      name: "Missionário Elevado",
      category: "classic" as const,
      difficulty: "beginner" as const,
      description: "A posição clássica com um toque especial: coloque um travesseiro sob os quadris dela para elevar a pelve. Isso muda o ângulo de penetração e intensifica o prazer de ambos.",
      benefits: "Contato visual profundo, conexão emocional intensa, estimulação do ponto G facilitada pela elevação dos quadris.",
      tips: "Mantenha contato visual e sussurre palavras de afirmação. Varie o ritmo — alterne movimentos lentos e profundos com mais acelerados para criar antecipação.",
      programWeekUnlock: 1,
    },
    {
      name: "Colher Íntima",
      category: "romantic" as const,
      difficulty: "beginner" as const,
      description: "Ambos deitados de lado, você por trás dela em posição de concha. Penetração suave com acesso às mãos para explorar o corpo dela enquanto abraça.",
      benefits: "Máxima intimidade emocional, ideal para momentos de reconexão, estimulação do clitóris com as mãos facilitada, sensação de proteção e segurança.",
      tips: "Beije o pescoço e a nuca dela suavemente. Use as mãos para acariciar o abdômen, seios e clitóris simultaneamente. Perfeito para manhãs lentas.",
      programWeekUnlock: 1,
    },
    {
      name: "Cavaleira",
      category: "classic" as const,
      difficulty: "beginner" as const,
      description: "Ela fica em cima, controlando o ritmo, profundidade e ângulo. Você fica deitado, podendo usar as mãos livremente para explorar o corpo dela.",
      benefits: "Ela controla o prazer dela, você pode relaxar e apreciar, visão privilegiada do corpo dela, suas mãos ficam livres para estimulação adicional.",
      tips: "Segure os quadris dela com firmeza mas gentileza. Faça movimentos ascendentes para encontrar os movimentos dela. Diga o quanto ela é linda nessa posição.",
      programWeekUnlock: 1,
    },
    {
      name: "Doggy Style Romântico",
      category: "sensual" as const,
      difficulty: "beginner" as const,
      description: "Versão mais íntima do estilo clássico: incline-se sobre ela, apoiando o peso nos braços, e aproxime o rosto do pescoço dela. Penetração profunda com toque corporal total.",
      benefits: "Penetração profunda, estimulação do ponto G, contato corporal total, acesso ao pescoço e ouvidos para beijos e sussurros.",
      tips: "Segure as mãos dela entrelaçadas. Beije o pescoço e sussurre no ouvido. Varie entre movimentos lentos e profundos. Evite ser mecânico — seja presente e atento.",
      programWeekUnlock: 1,
    },
    {
      name: "Abraço Profundo",
      category: "intimate" as const,
      difficulty: "beginner" as const,
      description: "Frente a frente, ela envolve as pernas em torno da sua cintura enquanto você a abraça completamente. Movimentos lentos e circulares em vez de lineares.",
      benefits: "Máximo contato corporal, beijos durante o ato, conexão emocional profunda, estimulação do clitóris pelo contato pélvico.",
      tips: "Foque nos beijos e no contato dos corpos. Movimentos lentos e circulares são mais eficazes que rápidos. Olhe nos olhos dela e diga o que sente.",
      programWeekUnlock: 2,
    },
    // ROMANTIC
    {
      name: "Cadeira do Amor",
      category: "romantic" as const,
      difficulty: "intermediate" as const,
      description: "Você sentado em uma cadeira ou beira da cama, ela sentada em seu colo de frente para você. Permite beijos, abraços e contato visual enquanto ela controla o ritmo.",
      benefits: "Contato visual e beijos constantes, ela controla o prazer, suas mãos livres para o corpo dela, sensação de intimidade de casal.",
      tips: "Segure o rosto dela enquanto se beijam. Acaricie as costas e cabelo. Essa posição é ideal para criar conexão emocional profunda.",
      programWeekUnlock: 2,
    },
    {
      name: "Lotus Tântrico",
      category: "intimate" as const,
      difficulty: "intermediate" as const,
      description: "Você sentado com as pernas cruzadas (posição de lótus ou semi-lótus), ela sentada em seu colo de frente, envolvendo a cintura com as pernas. Movimentos lentos e respiração sincronizada.",
      benefits: "Conexão espiritual e emocional profunda, respiração sincronizada amplifica o prazer, contato total dos corpos, ideal para prática tântrica.",
      tips: "Sincronize a respiração com ela. Inspire juntos, expire juntos. Movimentos mínimos — foque na energia e conexão. Olhem nos olhos um do outro por pelo menos 30 segundos.",
      programWeekUnlock: 3,
    },
    {
      name: "Dança Íntima",
      category: "romantic" as const,
      difficulty: "beginner" as const,
      description: "Em pé, frente a frente, ela com uma perna elevada apoiada em você. Penetração enquanto se abraçam e dançam lentamente. Ideal com música suave ao fundo.",
      benefits: "Muito romântico, permite beijos e abraços, sensação de dança íntima, ótimo para criar memórias especiais.",
      tips: "Coloque uma música lenta que ela ame. Segure ela firmemente. Beije o pescoço e sussurre o quanto ela é especial. Mova-se ao ritmo da música.",
      programWeekUnlock: 2,
    },
    // SENSUAL
    {
      name: "Arco-Íris",
      category: "sensual" as const,
      difficulty: "intermediate" as const,
      description: "Ela deitada de costas, pernas elevadas e apoiadas nos seus ombros. Você ajoelhado, controlando o ângulo e profundidade. Permite penetração profunda e estimulação do ponto G.",
      benefits: "Penetração muito profunda, estimulação intensa do ponto G, você controla o ritmo, visão privilegiada do corpo dela.",
      tips: "Comece devagar para ela se adaptar. Use as mãos para estimular o clitóris simultaneamente. Mantenha contato visual para verificar o prazer dela.",
      programWeekUnlock: 2,
    },
    {
      name: "Cavaleira Reversa",
      category: "sensual" as const,
      difficulty: "intermediate" as const,
      description: "Ela em cima de frente para os seus pés. Você tem visão das costas e quadris dela. Ela controla completamente o movimento enquanto você pode usar as mãos nas costas e quadris.",
      benefits: "Estimulação diferente para ambos, ela controla o prazer, você pode massagear as costas dela, ângulo único de penetração.",
      tips: "Segure os quadris dela para dar suporte. Massageie as costas e glúteos. Deixe ela encontrar o ângulo ideal para o prazer dela.",
      programWeekUnlock: 2,
    },
    {
      name: "Sereia",
      category: "sensual" as const,
      difficulty: "intermediate" as const,
      description: "Ela deitada de lado com as pernas juntas e levemente dobradas. Você por trás, penetrando com as pernas dela juntas, criando maior pressão e sensação.",
      benefits: "Sensação intensa pela pressão das pernas juntas, ótima estimulação do clitóris, você pode abraçar ela completamente.",
      tips: "Comece devagar. A pressão das pernas juntas intensifica muito a sensação. Use uma mão para estimular o clitóris e a outra para acariciar os seios.",
      programWeekUnlock: 3,
    },
    // PLAYFUL
    {
      name: "Espelho",
      category: "playful" as const,
      difficulty: "intermediate" as const,
      description: "Ambos sentados frente a frente, ela no seu colo. Posicione um espelho ao lado para que ambos possam se ver. Cria uma experiência visual única e excitante.",
      benefits: "Experiência visual estimulante, conexão visual com ela, permite ver o que normalmente não se vê, muito excitante para ambos.",
      tips: "Certifique-se que ela está confortável com a ideia. Foque nos olhos dela no espelho. Comente o quanto ela é linda. Crie um ambiente com velas para a iluminação perfeita.",
      programWeekUnlock: 4,
    },
    {
      name: "Bambolê",
      category: "playful" as const,
      difficulty: "intermediate" as const,
      description: "Ela em cima, mas em vez de movimentos verticais, faz movimentos circulares e de vai-e-vem. Você pode guiar os quadris dela com as mãos para encontrar o ritmo perfeito.",
      benefits: "Estimulação do clitóris pelo movimento circular, ela descobre o ângulo perfeito, muito prazeroso para ambos, divertido e lúdico.",
      tips: "Guie os quadris dela com as mãos suavemente. Incentive ela a experimentar diferentes movimentos circulares. Sorria e se divirta — o prazer é mútuo.",
      programWeekUnlock: 2,
    },
    {
      name: "Escorpião",
      category: "playful" as const,
      difficulty: "advanced" as const,
      description: "Ela deitada de bruços, você sobre ela. As pernas dela dobradas para cima, os pés apontando para o teto. Penetração com ângulo único e profundo.",
      benefits: "Ângulo de penetração único, estimulação diferente do ponto G, sensação de aventura e novidade.",
      tips: "Certifique-se que ela está confortável. Comece devagar para encontrar o ângulo ideal. Apoie o peso nos braços para não sobrecarregar ela.",
      programWeekUnlock: 5,
    },
    // ADVANCED
    {
      name: "Ponte do Prazer",
      category: "advanced" as const,
      difficulty: "advanced" as const,
      description: "Ela faz uma ponte (apoiada em mãos e pés com o corpo arqueado para cima). Você ajoelhado entre as pernas dela. Requer flexibilidade dela mas proporciona sensações únicas.",
      benefits: "Estimulação muito intensa, ângulo único, sensação de aventura, fortalece a confiança do casal.",
      tips: "Só tente se ela tiver boa flexibilidade. Comece com uma versão mais simples — ela apoiada nos cotovelos. Certifique-se que ela está confortável em todos os momentos.",
      programWeekUnlock: 8,
    },
    {
      name: "Tesoura",
      category: "advanced" as const,
      difficulty: "advanced" as const,
      description: "Ambos deitados de lado mas em direções opostas, formando um 'X' com os corpos. As pernas entrelaçadas. Movimento de tesoura lento e sensual.",
      benefits: "Sensação completamente diferente, muito íntimo apesar do ângulo incomum, ótimo para exploração e novidade.",
      tips: "Requer comunicação constante. Comecem devagar para encontrar o ritmo. Riam juntos se não sair perfeito — faz parte da aventura.",
      programWeekUnlock: 6,
    },
    // INTIMATE
    {
      name: "Ninho de Amor",
      category: "intimate" as const,
      difficulty: "beginner" as const,
      description: "Ambos deitados de lado, frente a frente, com as pernas entrelaçadas. Penetração suave enquanto se abraçam e beijam. O movimento é mínimo — foco na conexão.",
      benefits: "Máxima intimidade emocional, ideal para reconexão após conflitos, sensação de segurança e amor, ótimo para casais de longa data.",
      tips: "Foque nos beijos longos e abraços. Diga o quanto você a ama. Essa posição é sobre conexão, não performance. Respire junto com ela.",
      programWeekUnlock: 1,
    },
    {
      name: "Tântrico de Pé",
      category: "intimate" as const,
      difficulty: "intermediate" as const,
      description: "Em pé, frente a frente, ela com as costas na parede. Olhos nos olhos, respiração sincronizada, movimentos lentos e intencionais. Foco total na presença.",
      benefits: "Muito intenso emocionalmente, contato visual constante, sensação de poder e masculinidade, ela se sente desejada e protegida.",
      tips: "Coloque as mãos no rosto dela. Olhe nos olhos dela por longos momentos. Diga o que sente. Movimentos lentos criam mais tensão e prazer que movimentos rápidos.",
      programWeekUnlock: 3,
    },
  ];

  // ── Romance Tips ──────────────────────────────────────────────────────────
  const tips = [
    // SEDUCTION
    { category: "seduction" as const, difficulty: "easy" as const, title: "O Olhar de 3 Segundos", content: "O contato visual prolongado é uma das ferramentas de sedução mais poderosas. Quando estiver conversando com ela, mantenha contato visual por 3 segundos antes de desviar o olhar com um leve sorriso.", actionStep: "Hoje, pratique manter contato visual por 3 segundos em cada conversa. Não quebre o olhar primeiro — deixe ela fazer isso." },
    { category: "seduction" as const, difficulty: "medium" as const, title: "A Mensagem Inesperada", content: "Mande uma mensagem no meio do dia sem razão aparente, apenas dizendo algo específico e genuíno sobre ela. Não 'oi, tudo bem?' — algo como 'Lembrei do jeito que você ri e sorri sozinho aqui.'", actionStep: "Agora mesmo, mande uma mensagem para ela com uma observação específica e genuína. Sem esperar resposta ou retorno." },
    { category: "seduction" as const, difficulty: "easy" as const, title: "Toque com Intenção", content: "O toque casual mas intencional cria tensão sexual de forma natural. Um toque leve no braço ao fazer uma piada, guiar ela pela cintura ao passar por uma porta, afastar um cabelo do rosto dela.", actionStep: "Hoje, encontre 3 momentos naturais para tocar ela de forma leve e intencional. Observe a reação dela." },
    { category: "seduction" as const, difficulty: "bold" as const, title: "O Sussurro Estratégico", content: "Em um ambiente barulhento, aproxime-se do ouvido dela para 'falar melhor'. A proximidade física e o hálito quente no ouvido são extremamente estimulantes. Diga algo completamente inocente — o efeito vem da proximidade.", actionStep: "Na próxima vez que estiverem em um lugar barulhento, use esse pretexto para se aproximar. Diga algo simples mas com voz baixa e calma." },
    { category: "seduction" as const, difficulty: "medium" as const, title: "Desapareça por 24 Horas", content: "Paradoxalmente, a ausência estratégica aumenta o desejo. Após um período de atenção intensa, fique um dia sem contato. Deixe ela sentir sua falta. Quando voltar, o impacto é muito maior.", actionStep: "Se vocês têm conversado muito, fique hoje sem iniciar contato. Deixe ela iniciar. Observe o que acontece." },
    { category: "seduction" as const, difficulty: "easy" as const, title: "Elogio Específico e Raro", content: "Elogios genéricos ('você é linda') perdem impacto. Elogios específicos e inesperados ficam na memória. 'A forma como você explica as coisas com as mãos é irresistível' vale 10x mais que 'você é bonita'.", actionStep: "Observe ela hoje e encontre algo específico e genuíno para elogiar — algo que ela provavelmente nunca ouviu antes." },
    // ROMANCE
    { category: "romance" as const, difficulty: "easy" as const, title: "Ritual do Café da Manhã", content: "Prepare o café da manhã favorito dela sem aviso prévio. Não precisa ser elaborado — o gesto conta mais que a sofisticação. Uma xícara de café do jeito que ela gosta já é um ato de amor.", actionStep: "Amanhã cedo, prepare o café da manhã favorito dela antes que ela acorde. Deixe uma nota pequena ao lado." },
    { category: "romance" as const, difficulty: "medium" as const, title: "O Jantar Surpresa", content: "Reserve um restaurante que ela mencionou querer ir ou cozinhe o prato favorito dela. A chave é a surpresa — não peça opinião, apenas organize e convide. 'Hoje à noite você está livre? Tenho algo para você.'", actionStep: "Esta semana, organize um jantar surpresa. Pesquise o restaurante que ela mencionou ou aprenda a fazer o prato favorito dela." },
    { category: "romance" as const, difficulty: "easy" as const, title: "Nota Escrita à Mão", content: "Em um mundo digital, uma nota escrita à mão tem valor imenso. Deixe uma nota pequena em algum lugar que ela vai encontrar — bolsa, espelho do banheiro, dentro do livro que ela está lendo.", actionStep: "Escreva uma nota de 2-3 linhas à mão e esconda em algum lugar que ela vai encontrar hoje ou amanhã." },
    { category: "romance" as const, difficulty: "medium" as const, title: "Recrie o Primeiro Encontro", content: "Volte ao lugar do primeiro encontro de vocês ou recrie a situação. A nostalgia é um afrodisíaco poderoso. Diga: 'Lembra quando viemos aqui pela primeira vez? Quero reviver isso com você.'", actionStep: "Planeje uma versão do primeiro encontro de vocês para este mês. Pesquise o lugar, reserve, e convide com antecedência." },
    { category: "romance" as const, difficulty: "easy" as const, title: "Flores Sem Motivo", content: "Flores em datas especiais são esperadas. Flores em uma terça-feira aleatória são inesquecíveis. Não precisa ser um buquê elaborado — três flores do mercado com uma nota simples têm mais impacto.", actionStep: "Hoje ou amanhã, compre flores simples e entregue sem nenhuma razão especial. 'Só porque pensei em você.'" },
    { category: "romance" as const, difficulty: "bold" as const, title: "Viagem Surpresa de Final de Semana", content: "Organize uma viagem de final de semana sem revelar o destino. 'Separe a sexta e o sábado, vou te buscar às 18h. Traga roupas para dois dias.' O mistério e a iniciativa são extremamente atraentes.", actionStep: "Planeje uma viagem surpresa para o próximo mês. Pesquise um destino que ela adoraria, reserve hotel e transporte antes de contar." },
    // COMMUNICATION
    { category: "communication" as const, difficulty: "easy" as const, title: "Escuta Ativa Real", content: "Quando ela falar sobre o dia dela, largue o celular, vire o corpo para ela e faça perguntas de acompanhamento. 'E como você se sentiu com isso?' mostra que você realmente ouviu.", actionStep: "Na próxima conversa, deixe o celular virado para baixo. Faça pelo menos 2 perguntas de acompanhamento sobre o que ela contou." },
    { category: "communication" as const, difficulty: "medium" as const, title: "Valide Antes de Resolver", content: "Quando ela compartilha um problema, o instinto masculino é resolver. Mas ela frequentemente quer ser ouvida primeiro. Diga: 'Isso parece muito difícil. Como você está se sentindo?' antes de oferecer soluções.", actionStep: "Hoje, quando ela compartilhar algo difícil, valide os sentimentos dela por pelo menos 2 minutos antes de oferecer qualquer solução." },
    { category: "communication" as const, difficulty: "easy" as const, title: "Perguntas Profundas", content: "Substitua 'como foi seu dia?' por perguntas mais profundas: 'Qual foi o momento mais satisfatório da sua semana?' ou 'O que você está animada para fazer nos próximos meses?'", actionStep: "Esta semana, use pelo menos uma pergunta profunda por dia em vez das perguntas rotineiras." },
    { category: "communication" as const, difficulty: "bold" as const, title: "Carta de Gratidão", content: "Escreva uma carta de 1 página expressando gratidão por ela — qualidades específicas, momentos que você ama, por que a vida é melhor com ela. Entregue pessoalmente ou deixe para ela encontrar.", actionStep: "Reserve 20 minutos hoje para escrever essa carta. Seja específico e genuíno. Não precisa ser perfeita — precisa ser verdadeira." },
    // CONFIDENCE
    { category: "confidence" as const, difficulty: "easy" as const, title: "Tome a Iniciativa", content: "Mulheres são atraídas por homens que sabem o que querem. Em vez de 'o que você quer fazer hoje?', diga 'Vamos fazer X hoje. Você vai adorar.' A iniciativa e a confiança são extremamente atraentes.", actionStep: "Hoje, tome pelo menos uma decisão sem consultar ela primeiro. Planeje algo e convide — não pergunte." },
    { category: "confidence" as const, difficulty: "medium" as const, title: "Postura de Poder", content: "A linguagem corporal comunica confiança antes de você falar uma palavra. Ombros para trás, queixo levemente elevado, passos lentos e deliberados. Ocupe espaço — não se encolha.", actionStep: "Hoje, preste atenção à sua postura o dia todo. Corrija sempre que perceber que está encolhido ou com ombros caídos." },
    { category: "confidence" as const, difficulty: "easy" as const, title: "Voz Mais Grave e Lenta", content: "Homens que falam devagar e com voz grave são percebidos como mais confiantes e atraentes. Não force — apenas desacelere o ritmo da fala e respire antes de responder.", actionStep: "Nas próximas conversas, faça uma pausa de 1-2 segundos antes de responder. Fale mais devagar que o normal." },
    { category: "confidence" as const, difficulty: "bold" as const, title: "Diga Não com Elegância", content: "Homens que concordam com tudo são percebidos como fracos. Ter opiniões e limites próprios é atraente. Quando discordar, diga com calma: 'Vejo diferente. Acho que...' sem se desculpar.", actionStep: "Hoje, se você discordar de algo, expresse sua opinião com calma e sem se desculpar. Mantenha a posição com gentileza." },
    // TOUCH
    { category: "touch" as const, difficulty: "easy" as const, title: "Massagem de 10 Minutos", content: "Ofereça uma massagem nos ombros e pescoço sem expectativa de retorno. Apenas porque ela merece. O toque não sexual que gera prazer cria conexão profunda e confiança.", actionStep: "Esta semana, ofereça uma massagem de 10 minutos nos ombros dela. Sem expectativas — apenas para ela relaxar." },
    { category: "touch" as const, difficulty: "easy" as const, title: "O Abraço de 20 Segundos", content: "Pesquisas mostram que abraços de pelo menos 20 segundos liberam oxitocina — o hormônio do vínculo. A maioria dos abraços dura 3 segundos. Quando abraçar ela, segure por 20 segundos.", actionStep: "Hoje, quando abraçar ela, conte mentalmente até 20. Não solte antes. Observe a diferença na qualidade da conexão." },
    { category: "touch" as const, difficulty: "medium" as const, title: "Mapa do Prazer", content: "Pergunte a ela: 'Posso descobrir os lugares do seu corpo que você mais gosta de ser tocada?' Explore lentamente, prestando atenção nas reações dela. Sem pressa, sem objetivo além de aprender.", actionStep: "Na próxima vez que estiverem íntimos, dedique 15 minutos apenas para explorar e descobrir o que ela mais gosta, sem expectativa de sexo." },
    { category: "touch" as const, difficulty: "easy" as const, title: "Toque Casual Frequente", content: "Casais felizes se tocam frequentemente de forma não sexual: mão na cintura ao passar, segurar a mão ao caminhar, acariciar o cabelo enquanto assistem TV. Esses toques mantêm a conexão viva.", actionStep: "Hoje, encontre 5 momentos para tocar ela de forma carinhosa e não sexual. Mão na mão, ombro, costas." },
    // MINDSET
    { category: "mindset" as const, difficulty: "easy" as const, title: "Presença Total", content: "O maior presente que você pode dar a ela é sua presença total. Quando estiverem juntos, guarde o celular, desligue a TV e esteja 100% presente. Ela sente quando você está mentalmente ausente.", actionStep: "Esta noite, passe pelo menos 30 minutos com ela sem nenhuma tela. Conversa, jogo de cartas, cozinhar juntos — qualquer coisa com presença total." },
    { category: "mindset" as const, difficulty: "medium" as const, title: "Invista em Você Mesmo", content: "A coisa mais atraente que você pode fazer é trabalhar em si mesmo. Exercício, leitura, novas habilidades, ambições. Um homem que cresce constantemente é irresistível. Ela quer alguém que a inspire.", actionStep: "Hoje, dedique 1 hora para algo que melhore você — exercício, leitura, aprender algo novo. Não para impressionar ela, mas para ser sua melhor versão." },
    { category: "mindset" as const, difficulty: "easy" as const, title: "Gratidão Expressa", content: "Não assuma que ela sabe que você é grato por ela. Diga explicitamente: 'Sou muito grato por ter você na minha vida. Você me faz querer ser um homem melhor.' Especificidade é chave.", actionStep: "Hoje, diga a ela algo específico pelo qual você é grato. Não genérico — algo concreto que ela fez ou é." },
    // DATE IDEAS
    { category: "date_idea" as const, difficulty: "easy" as const, title: "Piquenique ao Pôr do Sol", content: "Prepare uma cesta com os petiscos favoritos dela, uma garrafa de vinho ou suco especial, e uma manta. Encontre um lugar com boa vista para o pôr do sol. Simples, romântico e memorável.", actionStep: "Esta semana, pesquise o melhor lugar para ver o pôr do sol na sua cidade. Planeje o piquenique para o próximo final de semana." },
    { category: "date_idea" as const, difficulty: "medium" as const, title: "Aula de Culinária a Dois", content: "Escolham uma receita desafiadora para fazer juntos. Cozinhar junto é íntimo, divertido e cria memórias. Coloque uma playlist que ela ame, abra um vinho e transformem o processo em um evento.", actionStep: "Esta semana, proponha: 'Vamos escolher uma receita que nunca fizemos e cozinhar juntos no sábado?' Deixe ela escolher o prato." },
    { category: "date_idea" as const, difficulty: "easy" as const, title: "Noite de Cinema em Casa", content: "Crie uma experiência de cinema em casa: pipoca gourmet, bebidas especiais, luzes apagadas, ela escolhe o filme. O cuidado nos detalhes transforma uma noite comum em algo especial.", actionStep: "Esta semana, organize uma noite de cinema em casa. Prepare a pipoca do jeito que ela gosta e deixe ela escolher o filme sem reclamar." },
    { category: "date_idea" as const, difficulty: "bold" as const, title: "Aventura ao Amanhecer", content: "Acorde ela às 5h com café pronto e diga: 'Vamos ver o nascer do sol.' Leve para um lugar especial. A espontaneidade e o esforço de acordar cedo por ela são extremamente românticos.", actionStep: "Planeje uma saída ao amanhecer para o próximo final de semana. Pesquise o melhor lugar para ver o nascer do sol na sua cidade." },
    // MORNING RITUAL
    { category: "morning_ritual" as const, difficulty: "easy" as const, title: "Bom Dia com Intenção", content: "A primeira mensagem do dia define o tom. Em vez de 'bom dia', envie algo que mostre que você pensou nela: 'Bom dia. Espero que seu dia seja tão incrível quanto você é.'", actionStep: "Amanhã cedo, antes de qualquer outra coisa, envie uma mensagem de bom dia personalizada e genuína para ela." },
    { category: "morning_ritual" as const, difficulty: "easy" as const, title: "Café Preparado com Amor", content: "Se morarem juntos, prepare o café dela antes que ela acorde. Se não, envie uma mensagem no horário que ela costuma tomar café: 'Estou tomando café pensando em você. Bom dia.'", actionStep: "Amanhã, prepare ou envie uma mensagem no horário do café dela. Pequenos gestos consistentes constroem relacionamentos sólidos." },
    { category: "morning_ritual" as const, difficulty: "medium" as const, title: "Afirmação Matinal", content: "Toda manhã, antes de ver o celular, pense em uma coisa específica que você aprecia nela. Isso treina seu cérebro para focar no positivo e muda como você interage com ela durante o dia.", actionStep: "Amanhã, antes de pegar o celular, pense em uma qualidade específica dela que você aprecia. Considere compartilhar com ela." },
  ];

  console.log("Seeding intimacy positions...");
  for (const pos of positions) {
    await db.insert(intimacyPositions).values(pos).onDuplicateKeyUpdate({ set: { name: pos.name } });
  }
  console.log(`✓ ${positions.length} positions seeded`);

  console.log("Seeding romance tips...");
  for (const tip of tips) {
    await db.insert(romanceTips).values(tip).onDuplicateKeyUpdate({ set: { title: tip.title } });
  }
  console.log(`✓ ${tips.length} romance tips seeded`);

  await connection.end();
  console.log("Intimacy seed complete!");
}

seedIntimacy().catch(console.error);
