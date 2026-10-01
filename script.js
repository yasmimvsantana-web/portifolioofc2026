const EDITOR_PASSWORD = "1234";
let currentRole = null; // null | 'professor' | 'editor'

const SUBJECTS = [
  { key:'natureza',   label:'Natureza' },
  { key:'humanas',    label:'Humanas' },
  { key:'matematica', label:'Matemática' },
  { key:'linguagens', label:'Linguagens' },
  { key:'tecds',       label:'Tec. Desenvolvimento de Sistemas' }
];
const TRIMESTERS = ['tri1','tri2','tri3'];
const TRI_LABELS = { tri1:'1º Trimestre', tri2:'2º Trimestre', tri3:'3º Trimestre' };
const DEFAULT_ACTIVITIES = {
  'tri1-matematica': [
    {
      id: 'matematica-tri1-quebrando-banca-analise',
      title: 'Quebrando a Banca — Análise do Filme',
      link: 'https://docs.google.com/document/d/1ZjQK5TQ5KeB0ISEi5LDO4EVnBgzKs_pTnWHvvM3JYUM/edit?usp=sharing',
      video: '',
      presentation: '',
      description: 'Atividade de filme. Aplicar o pensamento probabilístico e estatístico através da análise do filme. A atividade explorou como a contagem de cartas pode ser usada para prever resultados em eventos aleatórios, além de exigir a criação de um roteiro original que utilize conceitos matemáticos como base da trama. Reflexão: "O filme mostra que o azar no cassino pode ser vencido com estratégia e controle emocional. Aprendi que a matemática é uma ferramenta de poder que, quando bem aplicada, permite prever riscos e tomar decisões mais inteligentes, tanto no jogo quanto na vida real."',
      skills: ['C5', 'H30', 'H31'],
      photos: []
    },
    {
      id: 'matematica-tri1-jogo-quebrando-banca',
      title: 'Jogo Quebrando a Banca',
      link: 'https://www.canva.com/design/DAHHlZabhkA/7Y9Kqmqd7ymQA2wkbePH-A/view',
      video: '',
      presentation: 'https://www.canva.com/design/DAHHlZabhkA/7Y9Kqmqd7ymQA2wkbePH-A/view',
      description: 'Criação de jogo. Desenvolver um jogo original que utilize Análise Combinatória e Probabilidade, inspirado na estratégia do filme Quebrando a Banca. O desafio incluiu criar regras, prototipar o jogo e testar a viabilidade matemática das apostas e estratégias de ganho. Reflexão: "Criamos um jogo que transforma fórmulas em decisões reais. Foi o momento de tirar o Princípio Fundamental da Contagem e as Permutações do papel para ver como eles ditam as chances de vitória."',
      skills: ['C5', 'H30', 'H31'],
      photos: []
    }
  ],
  'tri2-matematica': [
    {
      id: 'matematica-tri2-tempo-tela',
      title: 'Apresentação Estatística — Tempo de Tela x Exaustão Matinal',
      link: 'https://docs.google.com/presentation/d/1TQP93z6lky2vZ-aQi3W0Vm57Z4gi0T1C1LmsqWLROPA/edit?usp=sharing',
      video: '',
      presentation: '',
      description: 'Pesquisa estatística sobre a relação entre o tempo de tela durante a noite e a exaustão matinal de estudantes do Ensino Médio. Foram coletados e analisados dados, utilizando frequências, moda estatística e gráficos para apresentar os resultados. Reflexão: "A atividade foi interessante por relacionar a estatística a uma situação presente no cotidiano dos estudantes. Além de desenvolver conhecimentos matemáticos, possibilitou interpretar dados e refletir sobre os hábitos dos jovens."',
      skills: ['C4', 'H27', 'H28', 'H29'],
      photos: []
    }
  ],
  'tri1-natureza': [
    {
      id: 'natureza-tri1-meme-evolucionismo',
      title: 'Meme sobre Evolucionismo',
      link: 'https://www.canva.com/design/DAHCVYJRHTI/iTMoqveN07zN8NphWVRJxw/view',
      video: '',
      presentation: 'https://www.canva.com/design/DAHCVYJRHTI/iTMoqveN07zN8NphWVRJxw/view',
      description: 'Atividade criativa para explicar a evolução de forma criativa. Criar um arco-íris no qual Darwin reage com ironia a diferentes adaptações, fossilizando o comportamento humano atual. Reflexão: "O humor reside na ilusão de Darwin ao questionar se a seleção natural evoluiu para isso. Foi uma atividade divertida que me permitiu aplicar a teoria biológica de forma sarcástica, percebendo que a evolução nem sempre se parece com progresso quando observamos nossos hábitos modernos."',
      skills: ['C3', 'H15', 'H18'],
      photos: []
    },
    {
      id: 'natureza-tri1-combustiveis-fosseis',
      title: 'Se já sabemos que os combustíveis fósseis poluem, por que ainda usamos?',
      link: 'https://www.canva.com/design/DAHE886JkV4/qRw-Yb2ym9rOJY0XrYvXOg/view',
      video: '',
      presentation: 'https://www.canva.com/design/DAHE886JkV4/qRw-Yb2ym9rOJY0XrYvXOg/view',
      description: 'Apresentação. Analisar por que o mundo ainda não encontrou uma maneira de substituir os combustíveis fósseis. O foco foi compreender a alta densidade energética desses combustíveis e os desafios tecnológicos e estruturais que impedem uma transição rápida. Reflexão: "É preciso entender que setores como o de transportes e o industrial dependem de combustíveis fósseis porque estes fornecem muita energia por volume. Essa dependência é tanto técnica quanto econômica: a infraestrutura global ainda representa um grande obstáculo para as energias limpas."',
      skills: ['C1', 'H1', 'C2', 'H9', 'H11'],
      photos: []
    },
    {
      id: 'natureza-tri1-disputa-eletricidade',
      title: 'Disputa de Eletricidade',
      link: 'https://docs.google.com/document/d/1tgqZuUlZjXz-Muvr2ctU7sftYVhTaL3dBd2NRCxo6i0/edit?usp=sharing',
      video: '',
      presentation: '',
      description: 'Relatório de atividade prática. Analisar na prática os processos de eletrização por atrito e indução. O foco foi entender por que materiais condutores (metais) são atraídos por corpos eletrizados (cano) e como a escolha dos materiais influencia a quantidade de carga gerada. Reflexão: "Foi interessante observar a mágica da física acontecer: ao atritar o cano, criamos um desequilíbrio de elétrons que atraiu o metal por indução. Aprendi que a escolha do metal e do tipo de material para atrito é estratégica, pois a série triboelétrica define quem ganha ou perde mais carga."',
      skills: ['C1', 'H1', 'C2', 'H7', 'H9', 'H11', 'H12'],
      photos: []
    }
  ],
  'tri2-natureza': [
    {
      id: 'natureza-tri2-mural-saude-ambiente',
      title: 'Mural Interativo — Saúde Pública & Meio Ambiente',
      link: '',
      video: '',
      presentation: '',
      description: 'Atividade em grupo sobre impactos ambientais, saúde pública, saneamento básico e prevenção. A participação foi na elaboração de um formulário de perguntas, acessado pelos visitantes por meio de um QR Code. Reflexão: "A atividade foi interessante por unir pesquisa, tecnologia e conscientização, tornando a aprendizagem mais interativa. A participação na criação do formulário também permitiu contribuir de forma criativa para o trabalho em grupo."',
      skills: ['C2', 'C11', 'C3', 'H15', 'H18', 'C4', 'H23'],
      photos: [
        'https://prtfoliodamo.netlify.app/img/mural_natureza_geral.jpg',
        'https://prtfoliodamo.netlify.app/img/mural_natureza.png'
      ]
    },
    {
      id: 'natureza-tri2-estequiometria-industria',
      title: 'Seminário sobre Estequiometria na Indústria',
      link: 'https://docs.google.com/presentation/d/1hTpepTcqyh_MWB4pYwpJPJ8Qa6pa3b9nnobsZVRF0Sg/edit?usp=sharing',
      video: '',
      presentation: '',
      description: 'Seminário e pesquisa sobre a produção de amônia e fertilizantes, abordando o processo Haber-Bosch e sua importância para a agricultura e a segurança alimentar. O trabalho também envolveu aspectos de estequiometria, impactos ambientais, sustentabilidade e dependência de matérias-primas. Reflexão: "A atividade foi interessante por relacionar a Química com a agricultura, a economia e questões ambientais. O estudo da amônia mostrou como os cálculos estequiométricos são importantes para a produção industrial e para o uso eficiente dos recursos."',
      skills: ['C2', 'H6', 'H7', 'H9'],
      photos: []
    },
    {
      id: 'natureza-tri2-cartilha-eletricidade-corpo',
      title: 'Cartilha — Eletricidade e o Corpo Humano',
      link: 'https://www.canva.com/design/DAHS9bozRq8/6JN_2YmM6QKjPI4Vb5bYIA/view',
      video: '',
      presentation: 'https://www.canva.com/design/DAHS9bozRq8/6JN_2YmM6QKjPI4Vb5bYIA/view',
      description: 'Cartilha informativa sobre a relação entre eletricidade e o corpo humano, abordando a condução de impulsos elétricos, os riscos de choques e formas de prevenção. Reflexão: "A atividade foi interessante por relacionar conceitos de Física com situações do cotidiano, permitindo compreender os efeitos da eletricidade no organismo e a importância de adotar medidas de segurança."',
      skills: ['C1', 'H3', 'H4', 'C2', 'H12', 'C4', 'H13'],
      photos: []
    },
    {
      id: 'natureza-tri2-eletroquimica',
      title: 'Portfólio Digital de Eletroquímica',
      link: 'https://sites.google.com/estudante.sesisenai.org.br/gammy/eletroqu%C3%ADmica-no-enem',
      video: '',
      presentation: '',
      description: 'Prática experimental de Eletroquímica, reunindo observações, hipóteses e resultados sobre as transformações de energia presentes nas reações químicas. Reflexão: "A atividade foi importante por aproximar a teoria da prática, permitindo observar os conceitos de Eletroquímica de forma experimental e desenvolver a capacidade de levantar hipóteses e analisar resultados."',
      skills: ['C2', 'H7', 'H9', 'H11'],
      photos: []
    }
  ],
  'tri1-humanas': [
    {
      id: 'humanas-tri1-geopolitica',
      title: 'Geopolítica',
      link: 'https://www.canva.com/design/DAHBNNaCgWs/2ESptS_kLNnj_gVEoGNiSg/view',
      video: '',
      presentation: 'https://www.canva.com/design/DAHBNNaCgWs/2ESptS_kLNnj_gVEoGNiSg/view',
      description: 'Pesquisa e apresentação detalhada sobre um país específico, coletando dados atualizados para permitir a comparação entre diferentes realidades nacionais. Reflexão: "Ao pesquisar os dados reais de uma nação, percebi que a geopolítica não é apenas sobre mapas, mas sobre como economia, localização e indicadores sociais definem o poder de um país no cenário mundial. Essa base de dados foi essencial para nos preparar para o seminário de comparação entre as nações."',
      skills: ['C1', 'H1', 'H2', 'H3', 'H4', 'H5'],
      photos: []
    },
    {
      id: 'humanas-tri1-grande-guerra',
      title: 'A Grande Guerra',
      link: 'https://www.canva.com/design/DAHFtb6yBko/2SWn00G6YYWMpRfyGGa1UA/view',
      video: '',
      presentation: 'https://www.canva.com/design/DAHFtb6yBko/2SWn00G6YYWMpRfyGGa1UA/view',
      description: 'Projeto de jornal histórico. Criar a capa de um jornal standard (75 × 60 cm) no estilo do início do século XX. O desafio foi atuar como um jornalista da época, escrevendo matérias autorais sobre a Grande Guerra e a Revolução Russa, respeitando o contexto político e a nacionalidade escolhida para o periódico. Reflexão: "Foi um exercício intenso de escrita e design histórico. Aprendi como o ponto de vista de um país altera a narrativa de um conflito e o quão denso era o jornalismo antes do domínio das imagens. Formatar tudo no Canva seguindo o padrão da época me ajudou a entender a comunicação como uma ferramenta geopolítica poderosa."',
      skills: ['C3', 'H15', 'H16', 'H20', 'C6', 'H39'],
      photos: []
    },
    {
      id: 'humanas-tri1-imperialismo-congo',
      title: 'Imperialismo no séc. XIX — Exploração do Congo',
      link: 'https://docs.google.com/document/d/199PXoHD51BlJDaAf5dnx6gTPthP0X5F9WR1JoLoNMNg/edit?usp=sharing',
      video: '',
      presentation: '',
      description: 'Trabalho escrito. Analisar como a Segunda Revolução Industrial impulsionou a corrida por colônias na África e Ásia. O trabalho consistiu em criar uma narrativa visual em 5 etapas sobre a história do Congo, desde o período pré-colonial até os dias atuais, focando nos impactos da exploração europeia. Reflexão: "Foi chocante compreender, através do exemplo do Congo, que a missão civilizadora europeia serviu apenas para mascarar um regime de exploração brutal. Aprendi que o desenvolvimento industrial das potências dependeu diretamente da violência colonial e que os problemas atuais do país são heranças dessa partilha forçada."',
      skills: ['C2', 'H8', 'H10', 'H12'],
      photos: []
    }
  ],
  'tri2-humanas': [
    {
      id: 'humanas-tri2-fascismo-italiano',
      title: 'Dossiê Histórico-Analítico — Fascismo Italiano',
      link: 'https://www.canva.com/design/DAHOVO5kCHA/qy2Pg9ep1It-ai1nabor5w/view',
      video: '',
      presentation: 'https://www.canva.com/design/DAHOVO5kCHA/qy2Pg9ep1It-ai1nabor5w/view',
      description: 'Pesquisa e dossiê produzido em dupla, com pesquisa bibliográfica e análise de uma fonte histórica primária para compreender o contexto e os impactos do Fascismo Italiano. Reflexão: "A atividade foi importante por estimular a pesquisa e a análise crítica de fontes históricas, permitindo compreender o Fascismo além dos acontecimentos, considerando também seus interesses, consequências e a visão dos contemporâneos."',
      skills: [],
      photos: []
    },
    {
      id: 'humanas-tri2-maze-runner',
      title: 'Apresentação: Totalitarismo no Cinema — Maze Runner',
      link: 'https://www.canva.com/design/DAHKN-Gc3hQ/quRFOhe7i4a8viN8HV2qhA/view',
      video: '',
      presentation: 'https://www.canva.com/design/DAHKN-Gc3hQ/quRFOhe7i4a8viN8HV2qhA/view',
      description: 'Análise do filme Maze Runner, relacionando cenas, falas e comportamentos com as características dos regimes totalitários estudadas em aula. Reflexão: "A atividade foi interessante por utilizar o cinema como forma de compreender e interpretar conceitos históricos, tornando o conteúdo mais próximo e facilitando a identificação de práticas de controle e poder."',
      skills: ['H10', 'H22', 'H26', 'H27'],
      photos: []
    },
    {
      id: 'humanas-tri2-isto-um-homem',
      title: 'É Isto um Homem? — Desumanização e Pessoas em Situação de Rua',
      link: 'https://www.canva.com/design/DAHNS7Rp3sc/rLCu-9ROec24oQhtwYrhBQ/view',
      video: '',
      presentation: 'https://www.canva.com/design/DAHNS7Rp3sc/rLCu-9ROec24oQhtwYrhBQ/view',
      description: 'Análise que relaciona a leitura de Primo Levi e a desumanização no Holocausto com a realidade das pessoas em situação de rua. Por meio de reportagens, dados e fontes acadêmicas, foram analisados preconceitos e discursos que negam a dignidade desse grupo. Reflexão: "A pesquisa me fez perceber que a desumanização ainda está presente na sociedade atual. Muitas vezes, julgamos pessoas em situação de rua sem compreender suas histórias, o que reforça sua exclusão e invisibilidade."',
      skills: ['H10', 'H22', 'H26', 'H27'],
      photos: []
    }
  ],
  'tri1-linguagens': [
    {
      id: 'linguagens-tri1-paixao-gh',
      title: 'A Paixão de G.H.',
      link: 'https://www.canva.com/design/DAHGfutPX7E/EejBasKT7JZJ2rBsrAmC0w/view',
      video: '',
      presentation: 'https://www.canva.com/design/DAHFCgcj82o/swzynf_V_P_vGalfOEu1ng/view',
      description: 'Habilidades: H4 e H22. Analisar o livro "A Paixão Segundo G.H." pela ótica da Sociologia. A atividade consistiu em apresentar uma mini-aula e criar um mapa conceitual explicando como a invisibilidade das classes sociais e a construção do "nojo" justificam o comportamento da personagem. Reflexão: "Gostei da atividade, pois me ajudou a entender que o surto de G.H. foi, na verdade, a quebra de sua bolha de privilégios. Foi muito interessante notar como o conceito de imundo é inventado pela sociedade para manter as classes sociais separadas."',
      skills: ['H4', 'H22'],
      photos: []
    },
    {
      id: 'linguagens-tri1-game-literario',
      title: 'Game Literário',
      link: 'https://www.canva.com/design/DAHHtGdUNfc/3PL5a4eZF0P7vcvBuJn_IA/view',
      video: '',
      presentation: '',
      description: 'Habilidade: H15. Revisar as escolas literárias brasileiras, do Quinhentismo ao Simbolismo, por meio da pesquisa e da criação de um jogo digital no Wordwall, desenvolvendo conhecimento, organização de ideias, criatividade e trabalho em grupo. Reflexão: "Gostei da atividade, pois foi uma forma diferente e mais dinâmica de aprender literatura. Criar o jogo ajudou a fixar melhor o conteúdo e tornou o estudo mais interessante e interativo."',
      skills: ['H15'],
      photos: []
    }
  ],
  'tri2-linguagens': [
    {
      id: 'linguagens-tri2-videomanifesto',
      title: 'Videomanifesto Modernista',
      link: 'https://www.youtube.com/watch?v=O736ISMCq7s',
      video: 'https://www.youtube.com/watch?v=O736ISMCq7s',
      presentation: '',
      description: 'Atividade em grupo. Habilidades: H3 e H24. A proposta foi criar um videomanifesto sobre um tema atual, apresentando uma opinião com argumentos e criatividade, inspirado nas características dos manifestos modernistas. Reflexão: "Achei a atividade interessante e criativa, pois permite aprender sobre o Modernismo de uma forma diferente. Também ajuda a desenvolver a argumentação, a criatividade e o trabalho em equipe."',
      skills: ['H3', 'H24'],
      photos: []
    },
    {
      id: 'linguagens-tri2-favorite-artist',
      title: 'Favorite Artist, Movie & Song',
      link: 'https://docs.google.com/document/d/1HbWPGETB7_Oilm4NgDBGeQ7WOvAR9ApiIbJO3o-AfiA/edit?usp=sharing',
      video: '',
      presentation: '',
      description: 'Produção textual em inglês. Habilidade: H25. Produção de um texto em inglês sobre um artista, um filme e uma música favoritos, com pesquisa de informações e explicação da importância pessoal de cada escolha. A atividade também trabalhou o Simple Past. Reflexão: "A atividade foi interessante por relacionar o inglês aos gostos pessoais dos alunos, tornando o aprendizado mais dinâmico. Porém, poderia incluir uma apresentação oral para estimular também a comunicação em inglês."',
      skills: ['H25'],
      photos: []
    },
    {
      id: 'linguagens-tri2-autodiagnostico',
      title: 'Dissertação — Autodiagnóstico nas Redes Sociais',
      link: '',
      video: '',
      presentation: '',
      description: 'Redação ENEM. Habilidade: H22. Produção de uma redação sobre os perigos do autodiagnóstico de transtornos mentais nas redes sociais no Brasil, desenvolvendo argumentação e reflexão sobre um tema atual e relevante. Reflexão: "A atividade foi importante por abordar um problema presente no cotidiano, incentivando uma visão crítica sobre o uso das redes sociais e a saúde mental. O tema também permitiu desenvolver a capacidade de argumentação e conscientização."',
      skills: ['H22'],
      photos: []
    }
  ]
};
const API_BASE = window.PORTFOLIO_API_URL || '';

TRIMESTERS.forEach(tri => {
  const wrap = document.getElementById('subjects-' + tri);
  const grid = document.createElement('div');
  grid.className = 'subjects';
  SUBJECTS.forEach(s => {
    const card = document.createElement('div');
    card.className = 'subject-card';
    card.dataset.tri = tri;
    card.dataset.subject = s.key;
    card.innerHTML = `
      <h3>${s.label}</h3>
      <div class="subject-hint">Faça login como editora para adicionar atividades.</div>
      <span class="subject-count" style="display:none;"></span>
    `;
    card.addEventListener('click', () => {
      if(currentRole === 'editor' || currentRole === 'professor') openSubjectModal(tri, s.key, s.label);
    });
    grid.appendChild(card);
  });
  wrap.appendChild(grid);
});

const editableTextIds = ['nameText','bioText','porqueText','estudosText','cEmail','cLocal','cInsta'];

async function storageGet(key){
  if(key.startsWith('activities:')){
    const localValue = localStorage.getItem('portfolio:' + key);
    if(localValue !== null) return { value: localValue };
    const [tri, subject] = key.slice('activities:'.length).split('-');
    try{
      const response = await fetch(`${API_BASE}/api/activities/${tri}/${subject}`);
      if(!response.ok) throw new Error('Não foi possível carregar as atividades.');
      const activities = await response.json();
      return { value: JSON.stringify(activities.length ? activities : DEFAULT_ACTIVITIES[`${tri}-${subject}`] || []) };
    }catch(error){
      const defaults = DEFAULT_ACTIVITIES[`${tri}-${subject}`];
      if(defaults) return { value: JSON.stringify(defaults) };
      throw error;
    }
  }
  if(window.storage && typeof window.storage.get === 'function') return window.storage.get(key, true);
  const value = localStorage.getItem('portfolio:' + key);
  return value === null ? null : { value };
}

async function storageSet(key, value){
  if(key.startsWith('activities:')){
    localStorage.setItem('portfolio:' + key, value);
    const [tri, subject] = key.slice('activities:'.length).split('-');
    try{
      await fetch(`${API_BASE}/api/activities/${tri}/${subject}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-editor-token': EDITOR_PASSWORD },
        body: value
      });
    }catch(error){}
    return true;
  }
  if(window.storage && typeof window.storage.set === 'function') return window.storage.set(key, value, true);
  localStorage.setItem('portfolio:' + key, value);
  return true;
}

const photoImg = document.getElementById('photoImg');
const photoPlaceholder = document.getElementById('photoPlaceholder');
const photoInput = document.getElementById('photoInput');
const uploadBtn = document.getElementById('uploadBtn');
const heroName = document.getElementById('heroName');

function goTo(pageName){
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + pageName).classList.add('active');
  window.scrollTo(0,0);
  applyRoleUI();
}

function enterAsProfessor(){ currentRole = 'professor'; goTo('portfolio'); refreshAllSubjectCards(); }

function checkEditorPass(){
  const val = document.getElementById('editorPass').value.trim();
  const errorEl = document.getElementById('editorError');
  if(val === EDITOR_PASSWORD){
    errorEl.classList.remove('show');
    currentRole = 'editor';
    goTo('portfolio');
    refreshAllSubjectCards();
  }else{
    errorEl.classList.add('show');
  }
}

function applyRoleUI(){
  const editing = currentRole === 'editor';
  editableTextIds.forEach(id => document.getElementById(id).contentEditable = editing);
  document.querySelectorAll('.upload-btn').forEach(el => el.classList.toggle('show', editing));
  document.getElementById('saveBtn').classList.toggle('show', editing);
  const label = currentRole === 'professor' ? 'Modo: Professor (visualização)' : (currentRole === 'editor' ? 'Modo: Editor' : '');
  ['roleTag','roleTagT1','roleTagT2','roleTagT3'].forEach(id => {
    const el = document.getElementById(id);
    if(el){ el.classList.toggle('show', !!currentRole); el.textContent = label; }
  });
  document.querySelectorAll('.subject-card').forEach(card => {
    const viewingActivities = editing || currentRole === 'professor';
    card.classList.toggle('editable', viewingActivities);
    const hint = card.querySelector('.subject-hint');
    const count = card.querySelector('.subject-count');
    if(editing){
      hint.textContent = 'Clique para adicionar atividades';
      count.style.display = 'inline-block';
    }else if(currentRole === 'professor'){
      hint.textContent = 'Clique para visualizar as atividades';
      count.style.display = 'inline-block';
    }else{
      hint.textContent = 'Faça login como editora para adicionar atividades.';
      count.style.display = 'none';
    }
  });
}

async function refreshAllSubjectCards(){
  if(currentRole !== 'editor' && currentRole !== 'professor') return;
  for(const card of document.querySelectorAll('.subject-card')){
    const tri = card.dataset.tri, subj = card.dataset.subject;
    try{
      const r = await storageGet('activities:'+tri+'-'+subj);
      const arr = r && r.value ? JSON.parse(r.value) : [];
      card.querySelector('.subject-count').textContent = arr.length + (arr.length === 1 ? ' atividade' : ' atividades');
    }catch(e){
      card.querySelector('.subject-count').textContent = '0 atividades';
    }
  }
}

function renderPills(sourceId, targetId){
  const text = document.getElementById(sourceId).innerText;
  const items = text.split(',').map(s=>s.trim()).filter(Boolean);
  document.getElementById(targetId).innerHTML = items.map(i=>`<span class="pill-tag">${i}</span>`).join('');
}

async function loadContent(){
  for(const id of editableTextIds){
    try{
      const r = await storageGet('field:'+id);
      if(r && r.value) document.getElementById(id).innerHTML = r.value;
    }catch(e){}
  }
  try{
    const foto = await storageGet('foto');
    if(foto && foto.value){
      photoImg.src = foto.value;
      photoImg.classList.add('show');
      photoPlaceholder.style.display = 'none';
    }
  }catch(e){}
  heroName.innerHTML = document.getElementById('nameText').innerHTML;
  applyRoleUI();
}

async function saveAll(){
  try{
    for(const id of editableTextIds){
      await storageSet('field:'+id, document.getElementById(id).innerHTML);
    }
    if(photoImg.src && photoImg.src.startsWith('data:')){
      await storageSet('foto', photoImg.src);
    }
    heroName.innerHTML = document.getElementById('nameText').innerHTML;
    const msg = document.getElementById('saveMsg');
    msg.classList.add('show');
    setTimeout(() => msg.classList.remove('show'), 2000);
  }catch(e){
    alert('Não foi possível salvar agora. Tente novamente.');
  }
}

document.querySelectorAll('.upload-btn').forEach(btn => btn.addEventListener('click', () => photoInput.click()));
photoInput.addEventListener('change', async () => {
  const file = photoInput.files[0];
  if(!file) return;
  if(!file.type.startsWith('image/')) return;
  try{
    const dataUrl = await compressImage(file, 1200, 0.8);
    photoImg.src = dataUrl;
    photoImg.classList.add('show');
    photoPlaceholder.style.display = 'none';
  }catch(e){
    alert('Não foi possível carregar essa imagem.');
  }
});
document.getElementById('saveBtn').addEventListener('click', saveAll);
document.getElementById('editorPass').addEventListener('keydown', (e) => { if(e.key === 'Enter') checkEditorPass(); });

/* ============ QUADRO DE ATIVIDADES ============ */
let modalContext = null; // {tri, subjectKey, label}
let pendingPhotos = [];
let editingActivityId = null;
const activityPhotoIndexes = {};

function compressImage(file, maxDim, quality){
  maxDim = maxDim || 800; quality = quality || 0.75;
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let w = img.width, h = img.height;
        if(w > maxDim || h > maxDim){
          if(w > h){ h = Math.round(h * maxDim / w); w = maxDim; }
          else { w = Math.round(w * maxDim / h); h = maxDim; }
        }
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

async function openSubjectModal(tri, subjectKey, label){
  modalContext = { tri, subjectKey, label };
  editingActivityId = null;
  pendingPhotos = [];
  document.getElementById('modalTri').textContent = TRI_LABELS[tri];
  document.getElementById('modalSubject').textContent = label;
  document.getElementById('actTitle').value = '';
  document.getElementById('actLink').value = '';
  document.getElementById('actVideo').value = '';
  document.getElementById('actPresentation').value = '';
  document.getElementById('actDescription').value = '';
  document.getElementById('actSkills').value = '';
  document.getElementById('actPhotoPreview').innerHTML = '';
  document.getElementById('actPhotos').value = '';
  document.getElementById('addActivityBtn').textContent = 'Adicionar atividade';
  document.getElementById('cancelActivityEdit').style.display = 'none';
  document.querySelector('.modal-form').style.display = currentRole === 'editor' ? 'block' : 'none';
  document.getElementById('subjectModal').classList.add('show');
  await renderActivityList();
}

async function editActivity(id){
  if(currentRole !== 'editor' || !modalContext) return;
  const activities = await loadActivities(modalContext.tri, modalContext.subjectKey);
  const activity = activities.find(item => item.id === id);
  if(!activity) return;
  editingActivityId = id;
  document.getElementById('actTitle').value = activity.title || '';
  document.getElementById('actLink').value = activity.link || '';
  document.getElementById('actVideo').value = activity.video || '';
  document.getElementById('actPresentation').value = activity.presentation || '';
  document.getElementById('actDescription').value = activity.description || '';
  document.getElementById('actSkills').value = (activity.skills || []).join(', ');
  pendingPhotos = (activity.photos || []).slice();
  renderPhotoPreview();
  document.getElementById('addActivityBtn').textContent = 'Salvar alterações';
  document.getElementById('cancelActivityEdit').style.display = 'inline-block';
  document.querySelector('.modal-form').scrollIntoView({ behavior:'smooth', block:'start' });
}

function cancelActivityEdit(){
  editingActivityId = null;
  pendingPhotos = [];
  document.getElementById('actTitle').value = '';
  document.getElementById('actLink').value = '';
  document.getElementById('actVideo').value = '';
  document.getElementById('actPresentation').value = '';
  document.getElementById('actDescription').value = '';
  document.getElementById('actSkills').value = '';
  document.getElementById('actPhotos').value = '';
  document.getElementById('addActivityBtn').textContent = 'Adicionar atividade';
  document.getElementById('cancelActivityEdit').style.display = 'none';
  renderPhotoPreview();
}

function changeActivityPhoto(activityId, direction){
  const currentIndex = activityPhotoIndexes[activityId] || 0;
  activityPhotoIndexes[activityId] = Math.max(0, currentIndex + direction);
  renderActivityList();
}

function getSafeHttpUrl(rawUrl){
  try{
    const url = new URL(rawUrl);
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : null;
  }catch(e){
    return null;
  }
}

function getEmbeddedUrl(rawUrl, type){
  if(!rawUrl) return null;
  try{
    const safeUrl = getSafeHttpUrl(rawUrl);
    if(!safeUrl) return null;
    const url = new URL(safeUrl);
    const host = url.hostname.toLowerCase();
    if(type === 'video'){
      if(host === 'youtu.be') return `https://www.youtube-nocookie.com/embed/${url.pathname.slice(1)}`;
      if(host === 'youtube.com' || host === 'www.youtube.com' || host === 'm.youtube.com'){
        const videoId = url.searchParams.get('v') || url.pathname.match(/\/embed\/([^/]+)/)?.[1];
        return videoId ? `https://www.youtube-nocookie.com/embed/${videoId}` : null;
      }
      if(host === 'vimeo.com'){
        const videoId = url.pathname.match(/\/(\d+)/)?.[1];
        return videoId ? `https://player.vimeo.com/video/${videoId}` : null;
      }
      if(host === 'player.vimeo.com') return url.href;
    }
    if(type === 'presentation'){
      if(host === 'docs.google.com' && url.pathname.includes('/presentation/')){
        const presentationId = url.pathname.match(/\/presentation\/d\/([^/]+)/)?.[1];
        return presentationId ? `https://docs.google.com/presentation/d/${presentationId}/embed` : null;
      }
      if(host === 'canva.com' || host === 'www.canva.com'){
        return url.href.includes('?') ? `${url.href}&embed` : `${url.href}?embed`;
      }
    }
  }catch(e){}
  return null;
}

function renderEmbeddedMedia(rawUrl, label, type){
  const safeUrl = getSafeHttpUrl(rawUrl);
  if(!safeUrl) return '';
  const embedUrl = getEmbeddedUrl(safeUrl, type);
  if(!embedUrl) return `<div class="activity-media"><div class="activity-media-label">${label}</div><a class="activity-media-link" href="${safeUrl}" target="_blank" rel="noopener noreferrer">Abrir ${label.toLowerCase()}</a></div>`;
  return `<div class="activity-media"><div class="activity-media-label">${label}</div><iframe src="${embedUrl}" title="${label}" loading="lazy" allowfullscreen></iframe></div>`;
}

function closeSubjectModal(){
  document.getElementById('subjectModal').classList.remove('show');
  refreshAllSubjectCards();
  modalContext = null;
  editingActivityId = null;
}

async function loadActivities(tri, subjectKey){
  try{
    const r = await storageGet('activities:'+tri+'-'+subjectKey);
    return r && r.value ? JSON.parse(r.value) : [];
  }catch(e){ return []; }
}

async function saveActivities(tri, subjectKey, arr){
  await storageSet('activities:'+tri+'-'+subjectKey, JSON.stringify(arr));
}

async function renderActivityList(){
  const list = document.getElementById('modalActivities');
  const arr = await loadActivities(modalContext.tri, modalContext.subjectKey);
  if(arr.length === 0){
    list.innerHTML = '<p class="empty-activities">Nenhuma atividade adicionada ainda.</p>';
    return;
  }
  list.innerHTML = arr.map(act => `
    <div class="activity-card">
      <div class="activity-side">
        ${act.photos && act.photos.length ? (() => {
          const photoIndex = Math.min(activityPhotoIndexes[act.id] || 0, act.photos.length - 1);
          activityPhotoIndexes[act.id] = photoIndex;
          return `<div class="activity-photos">
            <img src="${act.photos[photoIndex]}" alt="Foto da atividade ${photoIndex + 1}">
            ${act.photos.length > 1 ? `<button class="photo-nav prev" aria-label="Foto anterior" onclick="changeActivityPhoto('${act.id}', -1)">&#8249;</button><button class="photo-nav next" aria-label="Próxima foto" onclick="changeActivityPhoto('${act.id}', 1)">&#8250;</button><div class="photo-position">${photoIndex + 1} / ${act.photos.length}</div>` : ''}
          </div>`;
        })() : ''}
        ${act.skills && act.skills.length ? `<div class="activity-skills">${act.skills.map(sk=>`<span>${sk}</span>`).join('')}</div>` : ''}
      </div>
      <div class="activity-side">
        ${act.title ? `<h3 class="activity-title">${act.title}</h3>` : ''}
        ${act.description ? `<p class="activity-desc">${act.description}</p>` : ''}
        ${act.link ? `<a class="activity-link" href="${act.link}" target="_blank" rel="noopener noreferrer">Abrir link da atividade</a>` : ''}
        ${renderEmbeddedMedia(act.video, 'Vídeo', 'video')}
        ${renderEmbeddedMedia(act.presentation, 'Apresentação', 'presentation')}
        ${currentRole === 'editor' ? `<button class="activity-edit" onclick="editActivity('${act.id}')">Editar atividade</button><button class="activity-delete" onclick="deleteActivity('${act.id}')">Remover</button>` : ''}
      </div>
    </div>
  `).join('');
}

async function deleteActivity(id){
  const arr = await loadActivities(modalContext.tri, modalContext.subjectKey);
  const filtered = arr.filter(a => a.id !== id);
  await saveActivities(modalContext.tri, modalContext.subjectKey, filtered);
  await renderActivityList();
}

document.getElementById('actPhotos').addEventListener('change', async (e) => {
  const files = Array.from(e.target.files);
  for(const file of files){
    try{
      const dataUrl = await compressImage(file);
      pendingPhotos.push(dataUrl);
    }catch(err){}
  }
  renderPhotoPreview();
});

function renderPhotoPreview(){
  const wrap = document.getElementById('actPhotoPreview');
  wrap.innerHTML = pendingPhotos.map((p, i) => `
    <div class="thumb"><img src="${p}"><button class="rm" onclick="removePendingPhoto(${i})">✕</button></div>
  `).join('');
}
function removePendingPhoto(i){ pendingPhotos.splice(i,1); renderPhotoPreview(); }

document.getElementById('addActivityBtn').addEventListener('click', async () => {
  const title = document.getElementById('actTitle').value.trim();
  const link = document.getElementById('actLink').value.trim();
  const video = document.getElementById('actVideo').value.trim();
  const presentation = document.getElementById('actPresentation').value.trim();
  const description = document.getElementById('actDescription').value.trim();
  const skillsRaw = document.getElementById('actSkills').value.trim();
  if(!title && !link && !video && !presentation && !description && pendingPhotos.length === 0 && !skillsRaw){
    alert('Adicione ao menos uma foto, descrição ou habilidade.');
    return;
  }
  const skills = skillsRaw ? skillsRaw.split(',').map(s=>s.trim()).filter(Boolean) : [];
  const activity = { id: editingActivityId || Date.now().toString(), title, link, video, presentation, description, skills, photos: pendingPhotos.slice() };
  try{
    const arr = await loadActivities(modalContext.tri, modalContext.subjectKey);
    if(editingActivityId){
      const activityIndex = arr.findIndex(item => item.id === editingActivityId);
      if(activityIndex !== -1) arr[activityIndex] = activity;
    }else{
      arr.push(activity);
    }
    await saveActivities(modalContext.tri, modalContext.subjectKey, arr);
    cancelActivityEdit();
    await renderActivityList();
  }catch(e){
    alert('Não foi possível salvar a atividade agora. Tente novamente.');
  }
});

document.getElementById('cancelActivityEdit').addEventListener('click', cancelActivityEdit);

loadContent();
