/* Source mapping between the captured daily report and payment-list.html. */
(() => {
 const view = new URLSearchParams(location.search).get('view') === '0' ? '0' : '1';
 const colors = {'2d-khr':'source-blue','2d-usd':'source-green','3d-khr':'source-purple','3d-usd':'source-orange','result-khr':'source-blue','result-usd':'source-green'};
 document.querySelectorAll('[data-result-source]').forEach(cell => {
  const key = cell.dataset.resultSource;
  const belongs = view === '0' ? key.startsWith('result-') : !key.startsWith('result-');
  if (belongs) cell.classList.add('source-linked',colors[key],'cross-result-source');
  cell.title = key.startsWith('result-') ? 'Daily result used by Share for 2026-11-01' : 'Raw daily amount used in the Commission report for 2026-11-01';
 });
 const link = document.querySelector('header a[href="./payment-list.html"]');
 if (link) link.href = './payment-list.html?view=' + view;
 // The shared navigation helper continues to follow the link's local href.
})();
