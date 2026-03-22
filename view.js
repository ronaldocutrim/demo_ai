const status = document.getElementById('status');
const grid = document.getElementById('grid');

const formatPreco = (preco) =>
  preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const formatData = (data) =>
  new Date(data + 'T00:00:00').toLocaleDateString('pt-BR');

function renderNota(nota) {
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <div class="card-header">
      <span class="empresa">${nota.empresa}</span>
      <span class="preco">${formatPreco(nota.preco)}</span>
    </div>
    <p class="descricao">${String(nota.descricao).replace(/\n/g, '<br>')}</p>
    <div class="card-footer">
      <span>&#128205; ${nota.local}</span>
      <span>&#128197; ${formatData(nota.data)}</span>
    </div>
  `;
  grid.appendChild(card);
}

const fileInput       = document.getElementById('file-input');
document.getElementById('drop-zone').addEventListener('click', () => fileInput.click());
const filePreview     = document.getElementById('file-preview');
const previewFilename = document.getElementById('preview-filename');
const previewContent  = document.getElementById('preview-content');
const fileBtn         = document.getElementById('file-btn');
const previewLoading  = document.getElementById('preview-loading');
const extractResult   = document.getElementById('extract-result');
const extractDl       = document.getElementById('extract-dl');

function showExtractResult(nota) {
  const labels = { empresa: 'Empresa', descricao: 'Descrição', preco: 'Preço', data: 'Data', local: 'Local' };
  extractDl.innerHTML = Object.entries(labels).map(([key, label]) => {
    const raw = key === 'preco' ? formatPreco(nota[key]) : key === 'data' ? formatData(nota[key]) : nota[key];
    const value = key === 'descricao' ? String(raw).replace(/\n/g, '<br>') : raw;
    return `<dt>${label}</dt><dd>${value}</dd>`;
  }).join('');
  extractResult.classList.add('visible');
}

fileInput.addEventListener('change', async () => {
  const file = fileInput.files[0];
  if (!file) return;
  loadPreview(file);
  extractResult.classList.remove('visible');
  extractDl.innerHTML = '';
  previewLoading.classList.add('visible');
  try {
    const nota = await extractNota(file);
    fileBtn._nota = nota;
    showExtractResult(nota);
  } catch (err) {
    status.innerHTML = `<p class="erro">${err.message}</p>`;
  } finally {
    previewLoading.classList.remove('visible');
  }
});

function clearPanel() {
  fileInput.value = '';
  filePreview.classList.remove('visible');
  previewContent.src = '';
  fileBtn.disabled = true;
  fileBtn._file = null;
  fileBtn._nota = null;
  previewLoading.classList.remove('visible');
  extractResult.classList.remove('visible');
  extractDl.innerHTML = '';
}

document.getElementById('clear-file').addEventListener('click', clearPanel);

function loadPreview(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    previewFilename.textContent = file.name;
    previewContent.src = e.target.result;
    filePreview.classList.add('visible');
    fileBtn.disabled = false;
    fileBtn._file = file;
  };
  reader.readAsDataURL(file);
}


fileBtn.addEventListener('click', async () => {
  if (!fileBtn._nota) return;
  try {
    const saved = await postNota(fileBtn._nota);
    renderNota(saved);
    clearPanel();
  } catch (err) {
    status.innerHTML = `<p class="erro">${err.message}</p>`;
  }
});

// Initial load
status.innerHTML = '<p class="info">Carregando...</p>';

fetchNotas()
  .then((notas) => {
    status.innerHTML = '';
    if (notas.length === 0) {
      status.innerHTML = '<p class="info">Nenhuma nota fiscal encontrada.</p>';
      return;
    }
    notas.forEach(renderNota);
  })
  .catch((err) => {
    status.innerHTML = `<p class="erro">${err.message}</p>`;
  });
