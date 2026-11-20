/* Local demo navigation shared by both pages. */
(() => {
 document.addEventListener('click', event => {
   const link = event.target.closest('header a[data-local-page]');
   if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
   event.preventDefault();
   event.stopImmediatePropagation();
   window.location.assign(link.getAttribute('href'));
 }, true);
})();
