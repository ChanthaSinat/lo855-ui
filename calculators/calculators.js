/* Production integration: keep original report loading and include this file
   after the two calculator sections. Observe #accountingList for report updates. */
(() => {
 'use strict';
 const report = document.getElementById('accountingList');
 const view = document.getElementById('viewType');
 const commission = document.getElementById('commissionCalculator');
 const share = document.getElementById('shareCalculator');
 if (!report || !view || !commission || !share) return;
 const get = id => document.getElementById(id);
 const format = new Intl.NumberFormat('en-US', {maximumFractionDigits: 2});
 const usdFormat = new Intl.NumberFormat('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
 function amount(text) {
   const clean = text.replace(/[០-៩]/g, digit => '០១២៣៤៥៦៧៨៩'.indexOf(digit)).replace(/[,\s៛$]/g, '');
   if (!clean || clean === '-' || clean === '—') return 0;
   return /^-?\d+(?:\.\d+)?$/.test(clean) && Number.isFinite(Number(clean)) ? Number(clean) : null;
 }
 function rate(id) {
   const input = get(id);
   return input.value.trim() !== '' && input.validity.valid && Number.isFinite(Number(input.value)) && Number(input.value) >= 0 ? Number(input.value) : null;
 }
 function write(id, value, highlight = false) {
   const el = get(id);
   el.textContent = value === null ? '—' : (id.endsWith('Usd') ? usdFormat.format(value) + '$' : format.format(value) + '៛');
   el.classList.toggle('negative', highlight && value !== null && value < 0);
 }
 const calculate = (base, percentage) => base === null || percentage === null ? null : base * percentage / 100;
 function readRow(type) {
   for (const table of report.querySelectorAll('table')) {
     const header = table.querySelector('thead');
     const row = Array.from(table.rows).find(row => row.closest('table') === table && row.cells.length === (type === '1' ? 11 : 13) && row.cells[0].textContent.trim() === 'សរុប');
     if (!header || !row) continue;
     if (type === '1' && /2D/i.test(header.textContent) && /3D/i.test(header.textContent)) return row;
     if (type === '0' && header.textContent.includes('លទ្ធផល')) return row;
   }
   return null;
 }
 function readTotal(row, key, fallbackIndex) {
   // Prefer named source cells on the real server; support existing markup too.
   if (!row) return null;
   const source = row.querySelector('[data-total="' + key + '"]') || row.cells[fallbackIndex];
   return source ? amount(source.textContent) : null;
 }
 function align() {
   const row = readRow(view.value);
   const panel = view.value === '1' ? commission : share;
   if (!row) return;
   const index = view.value === '1' ? 3 : 1;
   const left = row.cells[index].getBoundingClientRect().left;
   panel.style.setProperty('--calculator-offset', Math.max(0, left - panel.parentElement.getBoundingClientRect().left) + 'px');
 }
 function refresh() {
   commission.hidden = view.value !== '1';
   share.hidden = view.value !== '0';
   const commissionRow = readRow('1');
   const values = [];
   ['2D','3D'].forEach((type,index) => {
     const percentage = rate('commissionRate' + type);
     ['Khr','Usd'].forEach((currency,currencyIndex) => {
       const base = readTotal(commissionRow, type.toLowerCase() + '-' + currency.toLowerCase(), 3 + index * 2 + currencyIndex);
       const result = calculate(base, percentage);
       write('commissionBase' + type + currency, base);
       write('commission' + type + currency, result);
       values[index * 2 + currencyIndex] = result;
     });
   });
   ['Khr','Usd'].forEach((currency,index) => {
     const first = values[index], second = values[index + 2];
     write('commissionTotal' + currency, first === null || second === null ? null : first + second);
   });
   const shareRow = readRow('0');
   ['Khr','Usd'].forEach((currency,index) => {
     const base = readTotal(shareRow, 'result-' + currency.toLowerCase(), index + 1);
     write('shareBase' + currency, base, true);
     write('shareResult' + currency, calculate(base, rate('shareRate')), true);
   });
   align();
 }
 ['commissionRate2D','commissionRate3D'].forEach(id => { get(id).value = ''; });
 ['commissionRate2D','commissionRate3D','shareRate'].forEach(id => get(id).addEventListener('input', refresh));
 view.addEventListener('change', refresh);
 new MutationObserver(refresh).observe(report, {childList:true,subtree:true,characterData:true});
 new ResizeObserver(align).observe(report);
 window.addEventListener('resize', align);
 if (document.fonts) document.fonts.ready.then(align);
 refresh();
})();
