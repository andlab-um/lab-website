(function () {
  var diagram = document.querySelector('.research-map__constellation');
  if (!diagram) return;

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var active = 0;
  var timer;

  function advance() {
    window.clearTimeout(timer);
    diagram.classList.toggle('is-playing', !reducedMotion.matches && !document.hidden);
    if (reducedMotion.matches || document.hidden) return;
    timer = window.setTimeout(function () {
      active = (active + 1) % 3;
      diagram.setAttribute('data-active-link', String(active));
      advance();
    }, 7000);
  }

  document.addEventListener('visibilitychange', advance);
  reducedMotion.addEventListener('change', advance);
  advance();
}());
