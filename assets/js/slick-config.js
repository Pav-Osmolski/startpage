$(function() {
  if (typeof $.fn.slick !== 'function') return;
  $('.slick-start').slick({
    arrows: true,
    dots: true,
    infinite: true,
    speed: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 150,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
    cssEase: 'linear',
    regionLabel: 'More bookmarks'
  });
});
