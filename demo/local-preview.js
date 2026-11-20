/* LOCAL DEMO ONLY. Do not deploy this file or the preview templates.
   The real server keeps its existing history.js and AJAX requests. */
(() => {
 const report = document.getElementById('accountingList');
 const view = document.getElementById('viewType');
 let activeView = null;
 function renderPreview() {
   if (activeView !== null) {
     const previous = document.getElementById(activeView === '1' ? 'previewCommissionReport' : 'previewShareReport');
     previous.innerHTML = report.innerHTML;
   }
   const template = document.getElementById(view.value === '1' ? 'previewCommissionReport' : 'previewShareReport');
   report.replaceChildren(template.content.cloneNode(true));
   activeView = view.value;
   enableAmountEditing();
   document.querySelectorAll('.viewType-items').forEach(el => {
     el.style.display = el.classList.contains('viewType-' + view.value) ? '' : 'none';
   });
 }

 const numberFormat = new Intl.NumberFormat('en-US', {maximumFractionDigits: 2});
 const usdFormat = new Intl.NumberFormat('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
 function parseNumber(text) {
   const clean = text.trim().replace(/[០-៩]/g, digit => '០១២៣៤៥៦៧៨៩'.indexOf(digit)).replace(/[,\s៛$]/g, '');
   if (!clean || clean === '-' || clean === '—') return 0;
   return /^-?\d+(?:\.\d+)?$/.test(clean) && Number.isFinite(Number(clean)) ? Number(clean) : null;
 }
 function enableAmountEditing() {
   const table = report.querySelector('table');
   if (!table) return;
   const headings = Array.from(table.querySelector('thead tr').cells).slice(1).map(cell => cell.textContent.trim());
   Array.from(table.rows).forEach(row => {
     if (row.closest('table') !== table || row.parentElement.tagName === 'THEAD') return;
     Array.from(row.cells).slice(1).forEach((cell, index) => {
       const total = row.parentElement.tagName === 'TFOOT';
       const label = (total ? 'Total' : row.cells[0].textContent.trim()) + ' — ' + (headings[Math.floor(index / 2)] || 'Amount') + ' (' + (index % 2 === 0 ? '៛' : '$') + ')';
       cell.contentEditable = 'plaintext-only';
       cell.classList.add('preview-editable');
       cell.dataset.previewCurrency = index % 2 === 0 ? 'khr' : 'usd';
       if (index % 2 === 1 && cell.textContent.trim() !== '') {
         const value = parseNumber(cell.textContent);
         if (value !== null) cell.textContent = usdFormat.format(value);
       }
       cell.setAttribute('role', 'textbox');
       cell.setAttribute('aria-label', label);
       cell.setAttribute('inputmode', 'decimal');
       cell.setAttribute('spellcheck', 'false');
       cell.title = 'Click to edit this local demo amount';
     });
   });
 }
 report.addEventListener('keydown', event => {
   if (event.target.classList.contains('preview-editable') && event.key === 'Enter') {
     event.preventDefault(); event.target.blur();
   }
 });
 report.addEventListener('input', event => {
   const cell = event.target.closest('.preview-editable');
   if (!cell) return;
   const valid = parseNumber(cell.textContent) !== null;
   cell.setAttribute('aria-invalid', String(!valid));
   const table = cell.closest('table');
   // Editing a daily amount sums that column. Totals may also be edited directly.
   if (!valid || cell.parentElement.parentElement.tagName !== 'TBODY') return;
   const index = cell.cellIndex;
   const rows = Array.from(table.tBodies).flatMap(body => Array.from(body.rows));
   const values = rows.filter(row => row.closest('table') === table).map(row => row.cells[index] ? parseNumber(row.cells[index].textContent) : null);
   const total = table.tFoot && table.tFoot.rows[0].cells[index];
   if (total && values.every(value => value !== null)) {
     const allBlank = rows.filter(row => row.closest('table') === table).every(row => row.cells[index] && row.cells[index].textContent.trim() === '');
     total.textContent = allBlank ? '' : (total.dataset.previewCurrency === 'usd' ? usdFormat : numberFormat).format(values.reduce((sum, value) => sum + value, 0));
   }
 });
 report.addEventListener('focusout', event => {
   const cell = event.target.closest('.preview-editable');
   if (!cell) return;
   if (cell.textContent.trim() === '') { cell.textContent = ''; return; }
   const value = parseNumber(cell.textContent);
   if (value !== null) cell.textContent = (cell.dataset.previewCurrency === 'usd' ? usdFormat : numberFormat).format(value);
 });

 document.getElementById('fromDate').value = '2026-11-01';
 document.getElementById('toDate').value = '2026-11-15';
 ['fromDate','toDate'].forEach(id => { document.getElementById(id).readOnly = true; });
 const client = document.getElementById('clientId');
 const selected = Array.from(client.options).find(option => option.textContent.trim() === '154-154Aហាមវ៉ៃ');
 if (selected) client.value = selected.value;
 ['clientId','lottery','isPayment'].forEach(id => { document.getElementById(id).disabled = true; });
 const requestedView = new URLSearchParams(location.search).get('view');
 view.value = requestedView === '0' ? '0' : '1';
 view.addEventListener('change', renderPreview);
 document.querySelectorAll('header a:not([href="./result.html"]):not([href="./payment-list.html"])').forEach(link => link.addEventListener('click', event => event.preventDefault()));
 renderPreview();
})();
