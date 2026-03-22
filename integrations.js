async function extractNota(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target.result;
      const base64 = dataUrl.split(',')[1];
      const mimeType = file.type || 'image/png';

      try {
        const res = await fetch('http://localhost:3001/extract', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ base64, mimeType }),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Erro ao extrair nota');
        }
        resolve(await res.json());
      } catch (err) {
        reject(err);
      }
    };
    reader.readAsDataURL(file);
  });
}

function postNota(nova) {
  return fetch('http://localhost:3000/notas_fiscais', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(nova),
  }).then((res) => {
    if (!res.ok) throw new Error('Erro ao salvar nota');
    return res.json();
  });
}

function fetchNotas() {
  return fetch('http://localhost:3000/notas_fiscais').then((res) => {
    if (!res.ok) throw new Error('Erro ao buscar notas');
    return res.json();
  });
}
