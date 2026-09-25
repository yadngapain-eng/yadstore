/* YADSTORE — ADMIN CHART */
let chartInstances = {};

function loadChartJS(cb) {
  if (window.Chart) return cb();
  const s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js';
  s.onload = cb;
  document.head.appendChild(s);
}

function initCharts() {
  loadChartJS(function() {
    renderRevenueChart();
    renderTrafficChart();
    renderCategoryChart();
  });
}

function destroyChart(id) {
  if (chartInstances[id]) { chartInstances[id].destroy(); delete chartInstances[id]; }
}

function renderRevenueChart() {
  const c = document.getElementById('revenueChart');
  if (!c || !window.Chart) return;
  destroyChart('revenue');
  const ctx = c.getContext('2d');
  const grad = ctx.createLinearGradient(0, 0, 0, 300);
  grad.addColorStop(0, 'rgba(0,229,255,.4)');
  grad.addColorStop(1, 'rgba(0,229,255,0)');
  chartInstances.revenue = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Sen','Sel','Rab','Kam','Jum','Sab','Min'],
      datasets: [{ label: 'Revenue', data: [120000,190000,150000,250000,320000,280000,400000],
        borderColor: '#00e5ff', backgroundColor: grad, borderWidth: 3, fill: true, tension: 0.4,
        pointBackgroundColor: '#00e5ff', pointBorderColor: '#fff', pointBorderWidth: 2, pointRadius: 5 }],
    },
    options: { responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: 'rgba(42,49,85,.4)' }, ticks: { color: '#8892b0' } },
        y: { grid: { color: 'rgba(42,49,85,.4)' }, ticks: { color: '#8892b0', callback: function(v) { return 'Rp ' + (v/1000) + 'k'; } } },
      },
    },
  });
}

function renderTrafficChart() {
  const c = document.getElementById('trafficChart');
  if (!c || !window.Chart) return;
  destroyChart('traffic');
  chartInstances.traffic = new Chart(c.getContext('2d'), {
    type: 'doughnut',
    data: { labels: ['Home','Belajar','Store','Article','Lainnya'],
      datasets: [{ data: [35,25,20,15,5],
        backgroundColor: ['#00e5ff','#7c4dff','#ff4081','#ffd54f','#8892b0'],
        borderColor: '#0d1228', borderWidth: 3 }] },
    options: { responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom', labels: { color: '#e8ecff', padding: 16 } } } },
  });
}

function renderCategoryChart() {
  const c = document.getElementById('categoryChart');
  if (!c || !window.Chart) return;
  destroyChart('category');
  chartInstances.category = new Chart(c.getContext('2d'), {
    type: 'bar',
    data: { labels: ['Tutorial','Berita','Opini','Novel','Tips','Karir'],
      datasets: [{ label: 'Artikel', data: [5,4,4,2,3,2],
        backgroundColor: ['rgba(0,229,255,.7)','rgba(124,77,255,.7)','rgba(255,64,129,.7)','rgba(255,213,79,.7)','rgba(0,255,136,.7)','rgba(136,146,176,.7)'],
        borderRadius: 8 }] },
    options: { responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { x: { grid: { display: false }, ticks: { color: '#8892b0' } },
        y: { grid: { color: 'rgba(42,49,85,.4)' }, ticks: { color: '#8892b0' } } } },
  });
}

window.initCharts = initCharts;
window.renderCategoryChart = renderCategoryChart;
