/* Local saved result-page preview only; do not replace the real result.js. */
(() => {
 const date = document.getElementById('txtdate');
 if (date) { date.value = '2026-11-01'; date.readOnly = true; }
 const client = document.getElementById('clientId');
 const label = document.getElementById('select2-clientId-container');
 if (client && label) {
   const saved = Array.from(client.options).find(option => option.textContent.trim() === label.textContent.trim());
   if (saved) client.value = saved.value;
 }
 ['timeId','clientId','show_type'].forEach(id => {
   const el = document.getElementById(id);
   if (el) { el.disabled = true; el.title = 'Saved local report'; }
 });
 const combo = document.querySelector('[aria-labelledby="select2-clientId-container"]');
 if (combo) { combo.setAttribute('aria-disabled','true'); combo.setAttribute('tabindex','-1'); }
 document.querySelectorAll('header a:not([href^="./result.html"]):not([href^="./payment-list.html"])').forEach(link => link.addEventListener('click', event => event.preventDefault()));
})();
