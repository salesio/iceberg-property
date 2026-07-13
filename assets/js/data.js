/* ==========================================================================
   IceBerg Property Lda — Data layer
   Products & Properties are seeded here, then merged with anything the
   Admin panel has saved to localStorage, so the public pages always
   reflect the latest content without needing a backend.
   ========================================================================== */

const IB_STORAGE = {
  products: 'iceberg_products_v2',
  properties: 'iceberg_properties_v2',
  auth: 'iceberg_admin_auth'
};

/* ---------- seed: products (from the company profile) ---------- */
const IB_SEED_PRODUCTS = [
  { id:'p1', category:'Galeria de Produtos', name:'Máscaras Cirúrgicas', img:'assets/img/products/mascara-descartavel.jpg', desc:'Produto apresentado na galeria do Perfil da Empresa.' },
  { id:'p2', category:'Galeria de Produtos', name:'Dispensador Automático', img:'assets/img/products/dispensador-automatico.jpg', desc:'Produto apresentado na galeria do Perfil da Empresa.' },
  { id:'p3', category:'Galeria de Produtos', name:'Viseiras Plásticas Azuis', img:'assets/img/no-image.png', desc:'Produto apresentado na galeria do Perfil da Empresa.' },
  { id:'p4', category:'Galeria de Produtos', name:'Óculos de Visão Ampla', img:'assets/img/products/oculos-visao-ampla.jpg', desc:'Produto apresentado na galeria do Perfil da Empresa.' },
  { id:'p5', category:'Galeria de Produtos', name:'Termómetro Digital', img:'assets/img/products/termometro-digital.webp', desc:'Produto apresentado na galeria do Perfil da Empresa.' },
  { id:'p6', category:'Galeria de Produtos', name:'Termómetro Anti-Contacto', img:'assets/img/products/termometro-anti-contacto.jpg', desc:'Produto apresentado na galeria do Perfil da Empresa.' },
  { id:'p7', category:'Galeria de Produtos', name:'Capa-Tudo Promax 1000 Descartável', img:'assets/img/products/capa-tudo-promax.jpg', desc:'Produto apresentado na galeria do Perfil da Empresa.' },
  { id:'p8', category:'Galeria de Produtos', name:'Capa-Tudo Não Tecido com Capuz', img:'assets/img/products/capa-tudo-nao-tecido.jpg', desc:'Produto apresentado na galeria do Perfil da Empresa.' },
  { id:'p9', category:'Galeria de Produtos', name:'QSA 2000 Series Moulded FFP1 Mask', img:'assets/img/products/mascara-cirurgica.jpg', desc:'Produto apresentado na galeria do Perfil da Empresa.' },
  { id:'p10', category:'Galeria de Produtos', name:'QSA 2000 Series FFP2 Mask - 2020', img:'assets/img/products/mascara-cirurgica.jpg', desc:'Produto apresentado na galeria do Perfil da Empresa.' },
];

/* ---------- seed: real-estate properties ---------- */
const IB_SEED_PROPERTIES = [];

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
