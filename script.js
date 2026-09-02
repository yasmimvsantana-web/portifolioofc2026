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
    const [tri, subject] = key.slice('activities:'.length).split('-');
    const response = await fetch(`${API_BASE}/api/activities/${tri}/${subject}`);
    if(!response.ok) throw new Error('Não foi possível carregar as atividades.');
    return { value: JSON.stringify(await response.json()) };
  }
  if(window.storage && typeof window.storage.get === 'function') return window.storage.get(key, true);
  const value = localStorage.getItem('portfolio:' + key);
  return value === null ? null : { value };
}

async function storageSet(key, value){
  if(key.startsWith('activities:')){
    const [tri, subject] = key.slice('activities:'.length).split('-');
    const response = await fetch(`${API_BASE}/api/activities/${tri}/${subject}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-editor-token': EDITOR_PASSWORD },
      body: value
    });
    if(!response.ok) throw new Error('Não foi possível salvar as atividades.');
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
