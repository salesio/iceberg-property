/* ==========================================================================
   IceBerg Property Lda — Data layer
   Products & Properties are seeded here, then merged with anything the
   Admin panel has saved to localStorage, so the public pages always
   reflect the latest content without needing a backend.
   ========================================================================== */

const IB_STORAGE = {
  products: 'iceberg_products_v1',
  properties: 'iceberg_properties_v1',
  auth: 'iceberg_admin_auth'
};

/* ---------- seed: products (from the company profile) ---------- */
const IB_SEED_PRODUCTS = [
  { id:'p1', category:'Protecção Individual', name:'Máscara Cirúrgica Descartável', img:'assets/img/products/mascara-descartavel.jpg', desc:'Máscara de 3 camadas, uso único, elástico auricular macio. Vendida em caixas.' },
  { id:'p2', category:'Protecção Individual', name:'Máscara QSA 2000 FFP1/FFP2', img:'assets/img/products/mascara-cirurgica.jpg', desc:'Máscara moldada de alta filtração, indicada para ambientes industriais e de saúde.' },
  { id:'p3', category:'Protecção Individual', name:'Luvas Descartáveis em Nitrilo', img:'assets/img/products/luvas-descartaveis.png', desc:'Luvas sem pó, resistentes, disponíveis em vários tamanhos, caixa com 100 unidades.' },
  { id:'p4', category:'Protecção Individual', name:'Óculos de Visão Ampla', img:'assets/img/products/oculos-visao-ampla.jpg', desc:'Óculos de protecção panorâmicos, antiembaciamento, banda ajustável.' },
  { id:'p5', category:'Protecção Individual', name:'Capa-Tudo Promax 1000 Descartável', img:'assets/img/products/capa-tudo-promax.jpg', desc:'Fato de protecção integral descartável, costuras seladas, ideal para ambientes de risco biológico.' },
  { id:'p6', category:'Protecção Individual', name:'Capa-Tudo Não Tecido com Capuz', img:'assets/img/products/capa-tudo-nao-tecido.jpg', desc:'Vestuário de protecção leve e respirável, com capuz integrado.' },
  { id:'p7', category:'Higienização', name:'Dispensador Automático de Sabão', img:'assets/img/products/dispensador-automatico.jpg', desc:'Dispensador touch-free de 700ml, sensor automático, ideal para espaços públicos.' },
  { id:'p8', category:'Equipamento Médico', name:'Termómetro Digital Infravermelho', img:'assets/img/products/termometro-digital.webp', desc:'Medição rápida e sem contacto da temperatura corporal, leitura digital.' },
  { id:'p9', category:'Equipamento Médico', name:'Termómetro de Parede Anti-Contacto', img:'assets/img/products/termometro-anti-contacto.jpg', desc:'Solução fixa para entradas de edifícios, medição automática ao aproximar a mão.' },
  { id:'p10', category:'Equipamento Médico', name:'Maca Hospitalar com Rodas', img:'assets/img/products/maca-hospitalar-rodas.jpg', desc:'Maca ajustável em altura, grades laterais rebatíveis, suporte de soro incluído.' },
  { id:'p11', category:'Equipamento Médico', name:'Maca Padiola de Transporte', img:'assets/img/products/maca-padiola.webp', desc:'Maca de transporte com rodas, estrutura reforçada, encosto reclinável.' },
  { id:'p12', category:'Equipamento Médico', name:'Kit Portátil de Primeiros Socorros', img:'assets/img/products/kit-primeiros-socorros.jpg', desc:'Mala completa de primeiros socorros para uso em campo, escritório ou viatura.' },
];

/* ---------- seed: real-estate properties ---------- */
const IB_SEED_PROPERTIES = [
  { id:'r1', title:'Vivenda T4 com Quintal', tipo:'Vivenda', estado:'Venda', preco:'8.500.000', moeda:'MT', localizacao:'Bairro Central, Nampula', quartos:4, wc:3, area:320, destaque:true, img:'assets/img/web/2234842_H_18.jpg',
    desc:'Vivenda espaçosa em zona residencial tranquila, com quintal amplo, garagem para duas viaturas e acabamentos modernos. Excelente para famílias que procuram conforto e segurança.' },
  { id:'r2', title:'Apartamento T2 Mobilado', tipo:'Apartamento', estado:'Arrendamento', preco:'35.000', moeda:'MT/mês', localizacao:'Muhala, Nampula', quartos:2, wc:1, area:85, destaque:true, img:'assets/img/web/images (2).jpg',
    desc:'Apartamento moderno e totalmente mobilado, próximo de escolas e centros comerciais, ideal para profissionais e pequenas famílias.' },
  { id:'r3', title:'Armazém Logístico', tipo:'Armazém', estado:'Arrendamento', preco:'120.000', moeda:'MT/mês', localizacao:'Zona Industrial, Nampula', quartos:0, wc:2, area:1200, destaque:true, img:'assets/img/web/photorealistic-scene-with-warehouse-logistics-operations (1).jpg',
    desc:'Amplo espaço de armazenagem com acesso facilitado para camiões, pé direito alto e escritório administrativo anexo.' },
  { id:'r4', title:'Terreno para Construção', tipo:'Terreno', estado:'Venda', preco:'2.200.000', moeda:'MT', localizacao:'Marrere, Nampula', quartos:0, wc:0, area:900, destaque:false, img:'assets/img/web/Resize1-3.jpg',
    desc:'Terreno plano com documentação regularizada, localizado em zona de expansão urbana, pronto para construção.' },
  { id:'r5', title:'Escritório Corporativo', tipo:'Escritório', estado:'Arrendamento', preco:'60.000', moeda:'MT/mês', localizacao:'Bairro Central, Nampula', quartos:0, wc:1, area:150, destaque:false, img:'assets/img/web/parallax-image-marketing-page.90.jpg',
    desc:'Espaço de escritório em edifício central, open-space adaptável, com estacionamento privativo.' },
  { id:'r6', title:'Vivenda T3 Moderna', tipo:'Vivenda', estado:'Venda', preco:'6.100.000', moeda:'MT', localizacao:'Namicopo, Nampula', quartos:3, wc:2, area:210, destaque:false, img:'assets/img/web/GettyImages-1151832961.jpg',
    desc:'Vivenda recente com acabamentos de qualidade, cozinha equipada e varanda ampla com vista aberta.' },
];

/* ---------- storage helpers ---------- */
function ibLoad(key, seed){
  try{
    const raw = localStorage.getItem(key);
    if(!raw) return seed.slice();
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : seed.slice();
  }catch(e){ return seed.slice(); }
}
function ibSave(key, data){
  localStorage.setItem(key, JSON.stringify(data));
}
function ibGetProducts(){ return ibLoad(IB_STORAGE.products, IB_SEED_PRODUCTS); }
function ibGetProperties(){ return ibLoad(IB_STORAGE.properties, IB_SEED_PROPERTIES); }
function ibSetProducts(data){ ibSave(IB_STORAGE.products, data); }
function ibSetProperties(data){ ibSave(IB_STORAGE.properties, data); }
function ibUid(prefix){ return prefix + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2,6); }

/* ---------- property placeholder illustration ---------- */
const IB_PROP_ICON = {
  'Vivenda': 'M4 22 L4 12 L16 4 L28 12 L28 22 Z M12 22 V15 H20 V22',
  'Apartamento': 'M6 4 H26 V28 H6 Z M10 8 H14 V12 H10 Z M18 8 H22 V12 H18 Z M10 15 H14 V19 H10 Z M18 15 H22 V19 H18 Z',
  'Armazém': 'M3 24 L3 13 L16 5 L29 13 L29 24 Z M3 24 H29 M8 24 V17 H13 V24 M19 24 V17 H24 V24',
  'Terreno': 'M2 24 L9 10 L14 18 L18 8 L30 24 Z',
  'Escritório': 'M6 28 V6 H26 V28 M10 10 H13 M17 10 H20 M10 14 H13 M17 14 H20 M10 18 H13 M17 18 H20 M13 28 V22 H19 V28'
};
function ibPropSvg(tipo, seedIdx){
  const path = IB_PROP_ICON[tipo] || IB_PROP_ICON['Vivenda'];
  const palettes = [
    ['#0E2144','#159BD6'], ['#0E2144','#35A94A'], ['#16305E','#159BD6'], ['#0C7AAE','#0E2144']
  ];
  const [c1,c2] = palettes[seedIdx % palettes.length];
  return `<svg viewBox="0 0 220 160" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id="g${seedIdx}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/>
      </linearGradient>
      <pattern id="hex${seedIdx}" width="18" height="16" patternUnits="userSpaceOnUse">
        <path d="M4.5 0 L13.5 0 L18 8 L13.5 16 L4.5 16 L0 8 Z" fill="none" stroke="#ffffff" stroke-opacity="0.06"/>
      </pattern>
    </defs>
    <rect width="220" height="160" fill="url(#g${seedIdx})"/>
    <rect width="220" height="160" fill="url(#hex${seedIdx})"/>
    <g transform="translate(94,64) scale(1.1)">
      <path d="${path}" fill="none" stroke="#ffffff" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round" opacity="0.92"/>
    </g>
  </svg>`;
}

/* Seed-image fallback keeps older localStorage listings visually up to date. */
function ibPropMedia(p, seedIdx){
  const seed = IB_SEED_PROPERTIES.find(item => item.id === p.id);
  const img = p.img || (seed && seed.img);
  return img
    ? `<img class="ib-prop-img" src="${img}" alt="${p.title}" loading="lazy" onerror="this.replaceWith(document.createRange().createContextualFragment(ibPropSvg('${p.tipo}', ${seedIdx})))">`
    : ibPropSvg(p.tipo, seedIdx);
}

function ibFmtPrice(p){ return p.preco + ' ' + p.moeda; }
