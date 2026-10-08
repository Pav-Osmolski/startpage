(function() {
  const textarea = document.getElementById('search-textarea');
  if (!textarea) return;
  textarea.addEventListener('keydown', event => {
    if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) {
      event.preventDefault();
      textarea.form.requestSubmit();
    }
  });
})();
