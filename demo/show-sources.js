/* Matching report and calculator totals stay highlighted. */
(() => {
 const report = document.getElementById('accountingList');
 const view = document.getElementById('viewType');
 const maps = {
  '1': [
   ['2d-khr','commissionBase2DKhr',3,'source-blue'],
   ['2d-usd','commissionBase2DUsd',4,'source-green'],
   ['3d-khr','commissionBase3DKhr',5,'source-purple'],
   ['3d-usd','commissionBase3DUsd',6,'source-orange']
  ],
  '0': [
   ['result-khr','shareBaseKhr',1,'source-blue'],
   ['result-usd','shareBaseUsd',2,'source-green']
  ]
 };
 function refresh() {
  document.querySelectorAll('.source-linked,.trace-daily').forEach(cell => cell.classList.remove('source-linked','source-blue','source-green','source-purple','source-orange','trace-daily','trace-2d-khr','trace-2d-usd','trace-3d-khr','trace-3d-usd','trace-result-khr','trace-result-usd'));
  const table = report.querySelector('table');
  const row = table && table.tFoot && table.tFoot.rows[0];
  if (table) Array.from(table.tBodies).forEach(body => Array.from(body.rows).forEach(daily => {
   if (!daily.cells[0]) return;
   const date = daily.cells[0].textContent.trim().slice(0,10);
   if (date !== '2026-11-01') return;
   let link = daily.cells[0].querySelector('a[data-report-source]');
   if (!link) {
    link = document.createElement('a');
    link.dataset.reportSource = 'true';
    link.textContent = date;
    link.title = 'Open this day’s breakdown in the local result page';
    daily.cells[0].replaceChildren(link);
   }
   const href = './result.html?view=' + view.value + '&date=' + date;
   if (link.getAttribute('href') !== href) link.setAttribute('href',href);
   (maps[view.value] || []).forEach(([key,id,index,color]) => {
    const dailyCell = daily.cells[index];
    if (!dailyCell) return;
    dailyCell.classList.add('trace-daily','trace-' + key);
    dailyCell.title = 'Daily amount for 2026-11-01. Click the date to see its matching result-page source. The range total includes all displayed dates.';
   });

  }));

  (maps[view.value] || []).forEach(([key,id,index,color]) => {
   const source = report.querySelector('[data-total="' + key + '"]') || (row && row.cells[index]);
   const target = document.getElementById(id);
   if (source && target) [source,target].forEach(cell => cell.classList.add('source-linked',color));
  });
 }
 view.addEventListener('change',refresh);
 new MutationObserver(refresh).observe(report,{childList:true,subtree:true,characterData:true});
 refresh();
})();
