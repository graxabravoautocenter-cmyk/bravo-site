const yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  // duplicate ticker content for seamless loop (só existe na home)
  const track = document.getElementById('tickerTrack');
  if(track) track.innerHTML += track.innerHTML;

  // sticky nav background
  const nav = document.getElementById('nav');
  if(nav && !nav.dataset.static){
    window.addEventListener('scroll', ()=> {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive:true });
  }

  // reveal on scroll
  const items = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    const io = new IntersectionObserver((es)=>{
      es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('is-visible'); io.unobserve(e.target); } });
    }, { threshold:0.12 });
    items.forEach(i=>io.observe(i));
  } else { items.forEach(i=>i.classList.add('is-visible')); }

  window.addEventListener('resize', ()=>{
    if(window.innerWidth > 880){ document.getElementById('mmenu')?.classList.remove('open'); }
  });

  // ===== review carousel: rotates every 10s, dots, pause on hover =====
  (function(){
    const carousel = document.getElementById('reviewCarousel');
    if(!carousel) return;
    const slides = carousel.querySelectorAll('.review-slide');
    const dotsBox = document.getElementById('reviewDots');
    let current = 0, timer = null;
    const INTERVAL = 10000;

    slides.forEach((_, i)=>{
      const d = document.createElement('button');
      d.setAttribute('aria-label', 'Avaliação ' + (i+1));
      d.addEventListener('click', ()=>{ show(i); restart(); });
      dotsBox.appendChild(d);
    });
    const dots = dotsBox.querySelectorAll('button');

    function show(i){
      slides[current].classList.remove('active');
      dots[current].classList.remove('active');
      current = i;
      slides[current].classList.add('active');
      dots[current].classList.add('active');
    }
    function next(){ show((current+1) % slides.length); }
    function restart(){ clearInterval(timer); timer = setInterval(next, INTERVAL); }

    dots[0].classList.add('active');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(!reduced && slides.length > 1){
      timer = setInterval(next, INTERVAL);
      carousel.addEventListener('mouseenter', ()=>clearInterval(timer));
      carousel.addEventListener('mouseleave', restart);
    }
  })();
