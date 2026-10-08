(function() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const loader = document.currentScript;
  const version = loader ? new URL(loader.src).searchParams.get('v') : null;

  function loadScript(source) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = version ? `${source}?v=${encodeURIComponent(version)}` : source;
      script.onload = resolve;
      script.onerror = () => reject(new Error(`Unable to load ${source}`));
      document.body.appendChild(script);
    });
  }

  function run(source) {
    loadScript(source).catch(error => console.warn(error.message));
  }

  if (document.getElementById('Date')) run('dist/js/datetime.min.js');
  if (document.querySelector('.textarea')) run('dist/js/search.min.js');
  if (document.querySelector('.stars') && !reducedMotion.matches) run('dist/js/stars.min.js');

  const carousel = document.querySelector('.slick-start');
  const ripples = document.querySelector('.ripples') && !reducedMotion.matches;
  if (!carousel && !ripples) return;

  // Each configuration runs only after its plugin has finished loading.
  loadScript('assets/js/jquery.min.js').then(() => {
    if (carousel) {
      loadScript('assets/js/slick.min.js')
        .then(() => loadScript('dist/js/slick-config.min.js'))
        .catch(error => console.warn(error.message));
    }
    if (ripples) {
      loadScript('assets/js/jquery.ripples.min.js')
        .then(() => loadScript('dist/js/jquery.ripples-config.min.js'))
        .catch(error => console.warn(error.message));
    }
  }).catch(error => console.warn(error.message));
})();
