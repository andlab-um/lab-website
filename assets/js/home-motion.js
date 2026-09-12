(function () {
  var hero = document.querySelector('.home-hero');
  var roadmap = document.querySelector('.research-map');
  if (!hero || !roadmap || !('IntersectionObserver' in window)) return;

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var targets = [];
  var revealObserver;

  function addTargets(selector, step, initialDelay) {
    document.querySelectorAll(selector).forEach(function (element, index) {
      element.style.setProperty('--reveal-delay', (initialDelay + index * step) + 'ms');
      element.setAttribute('data-reveal', '');
      targets.push(element);
    });
  }

  addTargets('.home-hero .home-title-line__text', 180, 80);
  addTargets('.home-hero .lab-intro', 0, 560);
  addTargets('.home-hero .lab-logo', 0, 220);
  addTargets('.research-map__eyebrow', 0, 0);
  addTargets('.research-map__header .home-title-line__text', 180, 80);
  addTargets('.research-map__intro', 0, 360);
  addTargets('.research-map__stage', 70, 0);
  addTargets('.research-map__method', 160, 100);
  addTargets('.research-map__context', 160, 180);
  addTargets('.research-map__constellation', 0, 180);
  addTargets('.research-map__closing', 0, 0);
  addTargets('.research-directions .section-heading', 0, 0);
  addTargets('.direction-reveal', 220, 120);

  function showAll() {
    if (revealObserver) revealObserver.disconnect();
    targets.forEach(function (element) {
      element.setAttribute('data-motion-state', 'visible');
    });
  }

  if (!reducedMotion.matches) {
    revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var element = entry.target.hasAttribute('data-reveal') ? entry.target : entry.target.querySelector('[data-reveal]');
        element.setAttribute('data-motion-state', 'visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.08 });

    targets.forEach(function (element) {
      element.setAttribute('data-motion-state', 'pending');
    });
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        if (reducedMotion.matches) return showAll();
        targets.forEach(function (element) {
          revealObserver.observe(element.classList.contains('home-title-line__text') ? element.parentElement : element);
        });
      });
    });
  } else {
    showAll();
  }

  var visibilityObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      entry.target.classList.toggle('motion-in-view', entry.isIntersecting);
    });
  });
  visibilityObserver.observe(hero);
  visibilityObserver.observe(roadmap);

  function syncMotion() {
    var running = !document.hidden && !reducedMotion.matches;
    hero.classList.toggle('motion-running', running);
    roadmap.classList.toggle('motion-running', running);
    if (reducedMotion.matches) showAll();
  }

  reducedMotion.addEventListener('change', syncMotion);
  document.addEventListener('visibilitychange', syncMotion);
  window.addEventListener('pageshow', function (event) {
    if (event.persisted) showAll();
    syncMotion();
  });
  syncMotion();
}());
