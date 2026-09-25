/* YADSTORE — ADMIN PAYMENT */
const PAYMENT_METHODS = [
  { id: 'transfer', name: 'Transfer Bank', icon: 'BANK', fee: 0 },
  { id: 'ewallet', name: 'E-Wallet', icon: 'WALLET', fee: 0.02 },
  { id: 'qris', name: 'QRIS', icon: 'QRIS', fee: 0.007 },
  { id: 'va', name: 'Virtual Account', icon: 'VA', fee: 4000 },
  { id: 'cod', name: 'COD', icon: 'COD', fee: 5000 },
];

function calcPayment(amount, methodId) {
  const m = PAYMENT_METHODS.find(function(x) { return x.id === methodId; });
  if (!m) return { total: amount, fee: 0, method: '', icon: '' };
  const fee = m.fee < 1 ? amount * m.fee : m.fee;
  return { method: m.name, icon: m.icon, subtotal: amount, fee: Math.round(fee), total: Math.round(amount + fee) };
}

function renderPaymentPreview() {
  const select = document.getElementById('payMethod');
  const amountEl = document.getElementById('payAmount');
  const resultEl = document.getElementById('payResult');
  if (!select || !amountEl || !resultEl) return;
  const amount = parseFloat(amountEl.value) || 0;
  const r = calcPayment(amount, select.value);
  resultEl.innerHTML =
    '<div style="display:flex;justify-content:space-between;padding:8px 0"><span>Subtotal</span><b>Rp ' + r.subtotal.toLocaleString('id-ID') + '</b></div>' +
    '<div style="display:flex;justify-content:space-between;padding:8px 0"><span>Fee</span><b>Rp ' + r.fee.toLocaleString('id-ID') + '</b></div>' +
    '<div style="display:flex;justify-content:space-between;padding:12px 0;border-top:1px solid var(--border);margin-top:8px;font-size:18px"><span>Total</span><b style="color:var(--primary)">Rp ' + r.total.toLocaleString('id-ID') + '</b></div>';
}

function initPayment() {
  const select = document.getElementById('payMethod');
  const amount = document.getElementById('payAmount');
  if (!select || !amount) return;
  select.innerHTML = PAYMENT_METHODS.map(function(m) {
    return '<option value="' + m.id + '">' + m.name + '</option>';
  }).join('');
  select.addEventListener('change', renderPaymentPreview);
  amount.addEventListener('input', renderPaymentPreview);
  renderPaymentPreview();
}

window.initPayment = initPayment;
