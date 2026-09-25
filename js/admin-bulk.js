/* YADSTORE — ADMIN BULK */
function exportProductsCSV() {
  const store = typeof getStore === 'function' ? getStore() : { products: [] };
  const headers = ['id','name','icon','type','buyPrice','markup','ops','sellPrice','stock','featured','active','desc'];
  const rows = (store.products || []).map(function(p) {
    return headers.map(function(h) {
      let v = p[h];
      if (typeof v === 'string' && (v.indexOf(',') !== -1 || v.indexOf('"') !== -1)) {
        v = '"' + v.replace(/"/g, '""') + '"';
      }
      return v === undefined || v === null ? '' : v;
    }).join(',');
  });
  const csv = [headers.join(',')].concat(rows).join('\n');
  downloadBlob(csv, 'yadstore-products-' + today() + '.csv', 'text/csv');
  if (typeof toast === 'function') toast('CSV diexport', 'success');
}

function exportArticlesCSV() {
  const store = typeof getStore === 'function' ? getStore() : { articles: [] };
  const headers = ['id','title','category','author','date','readTime','cover','status','excerpt'];
  const rows = (store.articles || []).map(function(a) {
    return headers.map(function(h) {
      let v = a[h];
      if (typeof v === 'string' && (v.indexOf(',') !== -1 || v.indexOf('"') !== -1)) {
        v = '"' + v.replace(/"/g, '""') + '"';
      }
      return v === undefined || v === null ? '' : v;
    }).join(',');
  });
  const csv = [headers.join(',')].concat(rows).join('\n');
  downloadBlob(csv, 'yadstore-articles-' + today() + '.csv', 'text/csv');
  if (typeof toast === 'function') toast('CSV diexport', 'success');
}

function importProductsCSV(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const rows = parseCSV(e.target.result);
      if (rows.length < 2) throw new Error('File kosong');
      const headers = rows[0];
      const products = [];
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (!row[0]) continue;
        const obj = {};
        headers.forEach(function(h, idx) { obj[h] = row[idx] || ''; });
        obj.buyPrice = parseFloat(obj.buyPrice) || 0;
        obj.markup = parseFloat(obj.markup) || 0;
        obj.ops = parseFloat(obj.ops) || 0;
        obj.sellPrice = parseFloat(obj.sellPrice) || 0;
        obj.stock = parseInt(obj.stock) || 0;
        obj.featured = obj.featured === 'true';
        obj.active = obj.active !== 'false';
        if (!obj.id) obj.id = 'prod-' + Date.now() + '-' + i;
        products.push(obj);
      }
      if (!products.length) throw new Error('Tidak ada produk valid');
      if (!confirm('Import ' + products.length + ' produk? Data lama ditimpa.')) return;
      const store = getStore();
      store.products = products;
      saveStore(store);
      if (typeof logActivity === 'function') logActivity('Import ' + products.length + ' produk', 'BULK');
      if (typeof toast === 'function') toast(products.length + ' produk diimport', 'success');
      setTimeout(function() { location.reload(); }, 1000);
    } catch (err) {
      if (typeof toast === 'function') toast(err.message, 'error');
    }
  };
  reader.readAsText(file);
  event.target.value = '';
}

function importArticlesCSV(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const rows = parseCSV(e.target.result);
      if (rows.length < 2) throw new Error('File kosong');
      const headers = rows[0];
      const articles = [];
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (!row[0]) continue;
        const obj = {};
        headers.forEach(function(h, idx) { obj[h] = row[idx] || ''; });
        obj.readTime = parseInt(obj.readTime) || 5;
        if (!obj.id) obj.id = 'art-' + Date.now() + '-' + i;
        if (!obj.content) obj.content = '<p>' + (obj.excerpt || '') + '</p>';
        articles.push(obj);
      }
      if (!articles.length) throw new Error('Tidak ada artikel valid');
      if (!confirm('Import ' + articles.length + ' artikel? Data lama ditimpa.')) return;
      const store = getStore();
      store.articles = articles;
      saveStore(store);
      if (typeof logActivity === 'function') logActivity('Import ' + articles.length + ' artikel', 'BULK');
      if (typeof toast === 'function') toast(articles.length + ' artikel diimport', 'success');
      setTimeout(function() { location.reload(); }, 1000);
    } catch (err) {
      if (typeof toast === 'function') toast(err.message, 'error');
    }
  };
  reader.readAsText(file);
  event.target.value = '';
}

function parseCSV(text) {
  const rows = [];
  let row = [], cell = '', inQ = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i], n = text[i + 1];
    if (inQ) {
      if (c === '"' && n === '"') { cell += '"'; i++; }
      else if (c === '"') inQ = false;
      else cell += c;
    } else {
      if (c === '"') inQ = true;
      else if (c === ',') { row.push(cell); cell = ''; }
      else if (c === '\n' || c === '\r') {
        if (cell !== '' || row.length) {
          row.push(cell);
          if (row.some(function(x) { return x !== ''; })) rows.push(row);
          row = []; cell = '';
        }
        if (c === '\r' && n === '\n') i++;
      }
      else cell += c;
    }
  }
  if (cell !== '' || row.length) {
    row.push(cell);
    if (row.some(function(x) { return x !== ''; })) rows.push(row);
  }
  return rows;
}

function downloadBlob(content, filename, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

function today() {
  return new Date().toISOString().split('T')[0];
}

window.exportProductsCSV = exportProductsCSV;
window.exportArticlesCSV = exportArticlesCSV;
window.importProductsCSV = importProductsCSV;
window.importArticlesCSV = importArticlesCSV;
