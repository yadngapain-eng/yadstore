/* YADSTORE — ADMIN UPLOAD */
async function uploadImage(file, folder) {
  return new Promise(function(resolve, reject) {
    if (!file) return reject(new Error('No file'));
    if (file.size > 5 * 1024 * 1024) return reject(new Error('File terlalu besar (max 5MB)'));
    if (!file.type.startsWith('image/')) return reject(new Error('File harus gambar'));
    const reader = new FileReader();
    reader.onload = async function(e) {
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: e.target.result, folder: folder || 'yadstore/products' }),
        });
        const data = await res.json();
        if (!res.ok || !data.ok) throw new Error(data.error || 'Upload gagal');
        resolve(data.url);
      } catch (err) { reject(err); }
    };
    reader.onerror = function() { reject(new Error('Gagal baca file')); };
    reader.readAsDataURL(file);
  });
}

function setupUpload(inputId, previewId, hiddenId) {
  const input = document.getElementById(inputId);
  const preview = document.getElementById(previewId);
  const hidden = document.getElementById(hiddenId);
  if (!input) return;
  input.addEventListener('change', async function(e) {
    const file = e.target.files[0];
    if (!file) return;
    preview.innerHTML = '<span style="color:var(--text-muted);font-size:12px">Uploading...</span>';
    try {
      const url = await uploadImage(file, 'yadstore');
      if (hidden) hidden.value = url;
      preview.innerHTML = '<img src="' + url + '" style="max-width:120px;max-height:120px;border-radius:8px;border:1px solid var(--border)">';
      if (typeof toast === 'function') toast('Gambar diupload', 'success');
    } catch (err) {
      preview.innerHTML = '<span style="color:var(--pink);font-size:12px">' + err.message + '</span>';
    }
  });
}

window.uploadImage = uploadImage;
window.setupUpload = setupUpload;
