/* Bravo Auto Center — script compartilhado por todas as páginas.
   Carregado com "defer": roda depois do HTML pronto, sem bloquear a renderização. */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Ano atual no rodapé
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Letreiro rolante: duplica o conteúdo para o loop ficar contínuo
  var track = document.getElementById('tickerTrack');
  if (track) track.innerHTML += track.innerHTML;

  // Barra superior ganha fundo ao rolar (só na home; nas internas já vem fixa)
  var nav = document.getElementById('nav');
  if (nav && nav.dataset.sticky === 'scroll') {
    var onScroll = function () { nav.classList.toggle('scrolled', window.scrollY > 40); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Menu mobile acessível
  var menu = document.getElementById('mmenu');
  var openBtn = document.querySelector('[data-menu-open]');
  var closeBtn = document.querySelector('[data-menu-close]');
  function setMenu(open) {
    if (!menu) return;
    menu.classList.toggle('open', open);
    menu.setAttribute('aria-hidden', open ? 'false' : 'true');
    if (openBtn) openBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.style.overflow = open ? 'hidden' : '';
    if (open && closeBtn) closeBtn.focus();
  }
  if (openBtn) openBtn.addEventListener('click', function () { setMenu(true); });
  if (closeBtn) closeBtn.addEventListener('click', function () { setMenu(false); if (openBtn) openBtn.focus(); });
  if (menu) {
    menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menu.classList.contains('open')) setMenu(false); });
  }
  window.addEventListener('resize', function () { if (window.innerWidth > 980) setMenu(false); });

  // Revelar seções ao rolar (o conteúdo já está no HTML; isto é só animação)
  var items = document.querySelectorAll('.reveal');
  if (!reduced && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.1 });
    items.forEach(function (i) { io.observe(i); });
  } else {
    items.forEach(function (i) { i.classList.add('is-visible'); });
  }

  // Botão de play sobre vídeos sem controles
  document.querySelectorAll('[data-play]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var v = btn.parentElement.querySelector('video');
      if (!v) return;
      btn.hidden = true;
      v.setAttribute('controls', '');
      v.play();
    });
  });

  // Carrossel de avaliações: troca a cada 10 s, pausa com o mouse em cima
  var carousel = document.getElementById('reviewCarousel');
  if (carousel) {
    var slides = carousel.querySelectorAll('.review-slide');
    var dotsBox = document.getElementById('reviewDots');
    var current = 0, timer = null, INTERVAL = 10000;
    slides.forEach(function (_, i) {
      var d = document.createElement('button');
      d.type = 'button';
      d.setAttribute('aria-label', 'Mostrar avaliação ' + (i + 1));
      d.addEventListener('click', function () { show(i); restart(); });
      dotsBox.appendChild(d);
    });
    var dots = dotsBox.querySelectorAll('button');
    function show(i) {
      slides[current].classList.remove('active');
      dots[current].classList.remove('active');
      current = i;
      slides[current].classList.add('active');
      dots[current].classList.add('active');
    }
    function next() { show((current + 1) % slides.length); }
    function restart() { clearInterval(timer); if (!reduced) timer = setInterval(next, INTERVAL); }
    if (dots.length) dots[0].classList.add('active');
    if (!reduced && slides.length > 1) {
      timer = setInterval(next, INTERVAL);
      carousel.addEventListener('mouseenter', function () { clearInterval(timer); });
      carousel.addEventListener('mouseleave', restart);
      carousel.addEventListener('focusin', function () { clearInterval(timer); });
      carousel.addEventListener('focusout', restart);
    }
  }
})();
