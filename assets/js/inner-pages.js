(function () {
  var page = document.querySelector('.inner-page');
  if (!page) return;

  var navigationPath = window.location.pathname.replace(/\/$/, '').replace(/\.html$/, '');
  if (navigationPath === '/resource' || navigationPath === '/openproject') navigationPath = '/open-science';
  document.querySelectorAll('.site-menu a').forEach(function (link) {
    if (link.getAttribute('href') === navigationPath) link.setAttribute('aria-current', 'page');
  });

  var years = Array.from(page.querySelectorAll('.publication-year'));
  var records = [];
  years.forEach(function (year) {
    Array.from(year.children).forEach(function (paragraph) {
      if (paragraph.tagName !== 'P') return;
      var record = document.createElement('article');
      record.className = 'publication-record';
      paragraph.before(record);
      record.appendChild(paragraph);
      var title = paragraph.querySelector('strong');
      if (title && title.textContent.trim().length >= 10) {
        var heading = document.createElement('h4');
        heading.className = 'publication-title';
        var punctuation = title.nextSibling;
        heading.appendChild(title);
        if (punctuation && punctuation.nodeType === 3 && /^\./.test(punctuation.textContent)) {
          heading.appendChild(document.createTextNode('.'));
          punctuation.textContent = punctuation.textContent.slice(1);
        }
        record.prepend(heading);
      }
      records.push(record);
    });
  });

  var search = page.querySelector('#publication-search');
  if (search && records.length) {
    var searchStatus = page.querySelector('.search-status');
    function filterPublications() {
      var query = search.value.trim().toLocaleLowerCase();
      var count = 0;
      records.forEach(function (record) {
        var matches = record.textContent.toLocaleLowerCase().includes(query);
        record.hidden = !matches;
        if (matches) count += 1;
      });
      years.forEach(function (year) {
        year.hidden = !Array.from(year.querySelectorAll('.publication-record')).some(function (record) { return !record.hidden; });
      });
      searchStatus.textContent = count === 0 ? 'No publications match your search. Try another title, author or journal.' : count + ' publications' + (query ? ' found' : ' in the archive');
    }
    page.querySelector('.library-search').hidden = false;
    search.addEventListener('input', filterPublications);
    page.querySelectorAll('.publication-toolbar a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function () {
        search.value = '';
        filterPublications();
      });
    });
    filterPublications();
  }

  page.querySelectorAll('.science-resources').forEach(function (section) {
    var list = section.querySelector('ol');
    if (!list) return;
    var items = Array.from(list.children);
    var filters = document.createElement('div');
    filters.className = 'resource-filters';
    filters.setAttribute('role', 'group');
    filters.setAttribute('aria-label', 'Filter resources by type');
    var status = document.createElement('p');
    status.className = 'resource-status';
    status.setAttribute('role', 'status');
    var categories = ['All'];
    items.forEach(function (item) {
      var label = item.querySelector('span');
      var category = label ? label.textContent.trim() : 'Other';
      item.dataset.resourceCategory = category;
      if (!categories.includes(category)) categories.push(category);
    });
    categories.forEach(function (category) {
      var button = document.createElement('button');
      button.type = 'button';
      button.textContent = category;
      button.setAttribute('aria-pressed', category === 'All' ? 'true' : 'false');
      button.addEventListener('click', function () {
        filters.querySelectorAll('button').forEach(function (option) { option.setAttribute('aria-pressed', option === button ? 'true' : 'false'); });
        var count = 0;
        items.forEach(function (item) {
          item.hidden = category !== 'All' && item.dataset.resourceCategory !== category;
          if (!item.hidden) {
            count += 1;
            item.dataset.innerMotion = 'visible';
          }
        });
        status.textContent = count + ' resources shown';
      });
      filters.appendChild(button);
    });
    list.before(filters, status);
    status.textContent = items.length + ' resources shown';
  });

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!('IntersectionObserver' in window) || reducedMotion.matches) return;
  var targets = Array.from(page.querySelectorAll('.person, .science-project, .science-resources > ol > li, .position-opportunity, .group-heading'));
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.dataset.innerMotion = 'visible';
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.04 });
  function revealAll() {
    observer.disconnect();
    targets.forEach(function (target) { target.dataset.innerMotion = 'visible'; });
  }
  targets.forEach(function (target, index) {
    target.dataset.innerMotion = 'pending';
    target.style.setProperty('--inner-delay', (index % 3) * 80 + 'ms');
  });
  window.requestAnimationFrame(function () {
    window.requestAnimationFrame(function () {
      if (reducedMotion.matches) return revealAll();
      targets.forEach(function (target) { observer.observe(target); });
    });
  });
  reducedMotion.addEventListener('change', function () { if (reducedMotion.matches) revealAll(); });
  window.addEventListener('pageshow', function (event) { if (event.persisted) revealAll(); });
}());
