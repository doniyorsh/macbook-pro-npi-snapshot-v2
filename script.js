(function () {
  var dots = Array.prototype.slice.call(document.querySelectorAll('.nav-dots a'));
  var slides = dots.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  if (!dots.length) return;

  // The page scrolls inside <body>; fall back to window if that ever changes.
  var scroller = document.body;

  var current = -1, hideTimer = null;

  function setActive(i) {
    if (i === current) return;
    current = i;
    dots.forEach(function (d, n) {
      d.classList.toggle('active', n === i);
      d.classList.remove('show-name');
    });
    // Show the slide name when the slide opens, then let it fade away.
    clearTimeout(hideTimer);
    dots[i].classList.add('show-name');
    hideTimer = setTimeout(function () { dots[i].classList.remove('show-name'); }, 1800);
  }

  function update() {
    var mid = window.innerHeight / 2, best = 0, bestDist = Infinity;
    slides.forEach(function (s, i) {
      if (!s) return;
      var r = s.getBoundingClientRect();
      var dist = (r.top <= mid && r.bottom >= mid) ? 0 : Math.min(Math.abs(r.top - mid), Math.abs(r.bottom - mid));
      if (dist < bestDist) { bestDist = dist; best = i; }
    });
    setActive(best);
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { update(); ticking = false; });
  }

  scroller.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  dots.forEach(function (d, i) { d.addEventListener('click', function () { setActive(i); }); });
  update();
})();
