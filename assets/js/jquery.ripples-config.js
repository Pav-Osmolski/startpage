$(function() {
  if (typeof $.fn.ripples !== 'function' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  try {
    $('#startpage').ripples({ dropRadius: 50, perturbance: 0.01, resolution: 256 });
  } catch (error) {
    console.warn('Water effect unavailable:', error.message);
  }
});
