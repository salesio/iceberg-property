/* ==========================================================================
   IceBerg Property Lda — Admin panel
   NOTE: This is a client-side-only demo gate (no real backend/auth).
   Data is stored in the browser's localStorage. Good for a single-editor
   internal tool; for multi-user production use, connect this to a real
   backend + authentication before relying on it.
   ========================================================================== */

const ADMIN_PASSWORD = 'iceberg2024';

document.addEventListener('DOMContentLoaded', function(){

  const loginWrap = document.getElementById('loginWrap');
  const dashWrap = document.getElementById('dashWrap');
  const btnLogout = document.getElementById('btnLogout');

  function showDash(){
    loginWrap.classList.add('d-none');
    dashWrap.classList.remove('d-none');
    btnLogout.classList.remove('d-none');
    refreshAll();
  }
  function showLogin(){
    dashWrap.classList.add('d-none');
    loginWrap.classList.remove('d-none');
    btnLogout.classList.add('d-none');
  }

  if(sessionStorage.getItem(IB_STORAGE.auth) === '1'){ showDash(); }

  document.getElementById('loginForm').addEventListener('submit', function(e){
    e.preventDefault();
    const val = document.getElementById('loginPass').value;
    if(val === ADMIN_PASSWORD){
      sessionStorage.setItem(IB_STORAGE.auth, '1');
      document.getElementById('loginError').classList.add('d-none');
      showDash();
    }else{
      document.getElementById('loginError').classList.remove('d-none');
    }
  });

  document.getElementById('togglePass').addEventListener('click', function(){
    const inp = document.getElementById('loginPass');
    inp.type = inp.type === 'password' ? 'text' : 'password';
    this.querySelector('i').className = inp.type === 'password' ? 'bi bi-eye' : 'bi bi-eye-slash';
  });

  btnLogout.addEventListener('click', function(){
    sessionStorage.removeItem(IB_STORAGE.auth);
    showLogin();
  });

  /* tabs */
  document.querySelectorAll('#adminTabs [data-tab]').forEach(btn=>{
    btn.addEventListener('click', function(){
      document.querySelectorAll('#adminTabs [data-tab]').forEach(b=>b.classList.remove('active'));
      this.classList.add('active');
      const tab = this.dataset.tab;
      document.getElementById('tabProps').classList.toggle('d-none', tab!=='props');
      document.getElementById('tabProds').classList.toggle('d-none', tab!=='prods');
    });
  });

  document.getElementById('btnResetData').addEventListener('click', function(){
    if(confirm('Isto vai repor as propriedades e produtos para os valores originais, apagando quaisquer alterações. Continuar?')){
      localStorage.removeItem(IB_STORAGE.products);
      localStorage.removeItem(IB_STORAGE.properties);
      refreshAll();
    }
  });

  /* ---------------- PROPERTIES ---------------- */
  const propModal = new bootstrap.Modal(document.getElementById('propModal'));

  function refreshProps(){
    const list = ibGetProperties();
    document.getElementById('propCount').textContent = list.length;
    document.getElementById('statProps').textContent = list.length;
    document.getElementById('statVenda').textContent = list.filter(p=>p.estado==='Venda').length;
    document.getElementById('statArrend').textContent = list.filter(p=>p.estado==='Arrendamento').length;
    document.getElementById('propTableBody').innerHTML = list.map((p,i)=>`
      <tr>
        <td><div class="admin-thumb-svg">${ibPropSvg(p.tipo, i)}</div></td>
        <td class="fw-semibold">${p.title}</td>
        <td>${p.tipo}</td>
        <td><span class="ib-badge-soft" style="background:${p.estado==='Venda'?'rgba(53,169,74,.12)':'rgba(21,155,214,.12)'};color:${p.estado==='Venda'?'#257A36':'#0C7AAE'}">${p.estado}</span></td>
        <td>${ibFmtPrice(p)}</td>
        <td>${p.localizacao}</td>
        <td>${p.destaque ? '<i class="bi bi-star-fill text-warning"></i>' : '<i class="bi bi-star text-secondary"></i>'}</td>
        <td class="text-end">
          <button class="btn btn-sm btn-ib-outline me-1" data-edit-prop="${p.id}"><i class="bi bi-pencil"></i></button>
          <button class="btn btn-sm btn-outline-danger" data-del-prop="${p.id}"><i class="bi bi-trash"></i></button>
        </td>
      </tr>`).join('') || `<tr><td colspan="8" class="text-center text-secondary py-4">Ainda não há propriedades. Adicione a primeira.</td></tr>`;

    document.querySelectorAll('[data-edit-prop]').forEach(b=> b.addEventListener('click', ()=> openPropModal(b.dataset.editProp)));
    document.querySelectorAll('[data-del-prop]').forEach(b=> b.addEventListener('click', ()=> deleteProp(b.dataset.delProp)));
  }

  function openPropModal(id){
    const form = document.getElementById('propForm');
    form.reset();
    if(id){
      const p = ibGetProperties().find(x=>x.id===id);
      document.getElementById('propModalTitle').textContent = 'Editar Propriedade';
      document.getElementById('propId').value = p.id;
      document.getElementById('propTitle').value = p.title;
      document.getElementById('propTipo').value = p.tipo;
      document.getElementById('propEstado').value = p.estado;
      document.getElementById('propPreco').value = p.preco;
      document.getElementById('propMoeda').value = p.moeda;
      document.getElementById('propLoc').value = p.localizacao;
      document.getElementById('propArea').value = p.area;
      document.getElementById('propQuartos').value = p.quartos;
      document.getElementById('propWc').value = p.wc;
      document.getElementById('propDesc').value = p.desc;
      document.getElementById('propDestaque').checked = !!p.destaque;
    }else{
      document.getElementById('propModalTitle').textContent = 'Adicionar Propriedade';
      document.getElementById('propId').value = '';
    }
    propModal.show();
  }

  document.getElementById('btnAddProp').addEventListener('click', ()=> openPropModal(null));

  document.getElementById('propForm').addEventListener('submit', function(e){
    e.preventDefault();
    const list = ibGetProperties();
    const id = document.getElementById('propId').value || ibUid('r');
    const item = {
      id,
      title: document.getElementById('propTitle').value.trim(),
      tipo: document.getElementById('propTipo').value,
      estado: document.getElementById('propEstado').value,
      preco: document.getElementById('propPreco').value.trim(),
      moeda: document.getElementById('propMoeda').value.trim(),
      localizacao: document.getElementById('propLoc').value.trim(),
      area: Number(document.getElementById('propArea').value) || 0,
      quartos: Number(document.getElementById('propQuartos').value) || 0,
      wc: Number(document.getElementById('propWc').value) || 0,
      desc: document.getElementById('propDesc').value.trim(),
      destaque: document.getElementById('propDestaque').checked
    };
    const idx = list.findIndex(x=>x.id===id);
    if(idx>-1) list[idx] = item; else list.push(item);
    ibSetProperties(list);
    propModal.hide();
    refreshProps();
  });

  function deleteProp(id){
    if(!confirm('Eliminar esta propriedade?')) return;
    ibSetProperties(ibGetProperties().filter(x=>x.id!==id));
    refreshProps();
  }

  /* ---------------- PRODUCTS ---------------- */
  const prodModal = new bootstrap.Modal(document.getElementById('prodModal'));

  function refreshProds(){
    const list = ibGetProducts();
    document.getElementById('prodCount').textContent = list.length;
    document.getElementById('statProd').textContent = list.length;

    const cats = [...new Set(list.map(p=>p.category))];
    document.getElementById('catList').innerHTML = cats.map(c=>`<option value="${c}">`).join('');

    document.getElementById('prodTableBody').innerHTML = list.map(p=>`
      <tr>
        <td><img src="${p.img}" class="admin-thumb" onerror="this.src='assets/img/no-image.png'"></td>
        <td class="fw-semibold">${p.name}</td>
        <td><span class="ib-badge-soft">${p.category}</span></td>
        <td class="text-truncate" style="max-width:280px;">${p.desc}</td>
        <td class="text-end">
          <button class="btn btn-sm btn-ib-outline me-1" data-edit-prod="${p.id}"><i class="bi bi-pencil"></i></button>
          <button class="btn btn-sm btn-outline-danger" data-del-prod="${p.id}"><i class="bi bi-trash"></i></button>
        </td>
      </tr>`).join('') || `<tr><td colspan="5" class="text-center text-secondary py-4">Ainda não há produtos. Adicione o primeiro.</td></tr>`;

    document.querySelectorAll('[data-edit-prod]').forEach(b=> b.addEventListener('click', ()=> openProdModal(b.dataset.editProd)));
    document.querySelectorAll('[data-del-prod]').forEach(b=> b.addEventListener('click', ()=> deleteProd(b.dataset.delProd)));
  }

  function openProdModal(id){
    const form = document.getElementById('prodForm');
    form.reset();
    if(id){
      const p = ibGetProducts().find(x=>x.id===id);
      document.getElementById('prodModalTitle').textContent = 'Editar Produto';
      document.getElementById('prodId').value = p.id;
      document.getElementById('prodName').value = p.name;
      document.getElementById('prodCat').value = p.category;
      document.getElementById('prodImg').value = p.img;
      document.getElementById('prodDesc').value = p.desc;
    }else{
      document.getElementById('prodModalTitle').textContent = 'Adicionar Produto';
      document.getElementById('prodId').value = '';
    }
    prodModal.show();
  }

  document.getElementById('btnAddProd').addEventListener('click', ()=> openProdModal(null));

  document.getElementById('prodForm').addEventListener('submit', function(e){
    e.preventDefault();
    const list = ibGetProducts();
    const id = document.getElementById('prodId').value || ibUid('p');
    const item = {
      id,
      name: document.getElementById('prodName').value.trim(),
      category: document.getElementById('prodCat').value.trim(),
      img: document.getElementById('prodImg').value.trim() || 'assets/img/no-image.png',
      desc: document.getElementById('prodDesc').value.trim()
    };
    const idx = list.findIndex(x=>x.id===id);
    if(idx>-1) list[idx] = item; else list.push(item);
    ibSetProducts(list);
    prodModal.hide();
    refreshProds();
  });

  function deleteProd(id){
    if(!confirm('Eliminar este produto?')) return;
    ibSetProducts(ibGetProducts().filter(x=>x.id!==id));
    refreshProds();
  }

  function refreshAll(){ refreshProps(); refreshProds(); }
});
