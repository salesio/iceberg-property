/* ==========================================================================
   IceBerg Property Lda — shared front-end behaviour
   ========================================================================== */
document.addEventListener('DOMContentLoaded', function () {

  /* navbar scroll state */
  const nav = document.querySelector('.ib-navbar');
  function onScroll(){
    if(!nav) return;
    if(window.scrollY > 24){ nav.classList.add('is-scrolled'); }
    else{ nav.classList.remove('is-scrolled'); }
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive:true });

  /* active nav link */
  const here = (location.pathname.split('/').pop() || 'index.html');
  document.querySelectorAll('.ib-navbar .nav-link').forEach(a=>{
    const href = a.getAttribute('href');
    if(href === here || (here === '' && href === 'index.html')){
      a.classList.add('active');
    }
  });

  /* reveal on scroll */
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el=> io.observe(el));

  /* back to top */
  const toTop = document.querySelector('.ib-totop');
  if(toTop){
    window.addEventListener('scroll', ()=>{
      if(window.scrollY > 500) toTop.classList.add('show'); else toTop.classList.remove('show');
    }, { passive:true });
    toTop.addEventListener('click', ()=> window.scrollTo({top:0, behavior:'smooth'}));
  }

  /* collapse mobile menu after clicking a link */
  document.querySelectorAll('.ib-navbar .nav-link').forEach(a=>{
    a.addEventListener('click', ()=>{
      const collapse = document.getElementById('ibNavCollapse');
      if(collapse && collapse.classList.contains('show')){
        bootstrap.Collapse.getOrCreateInstance(collapse).hide();
      }
    });
  });

  /* contact form (front-end only demo) */
  const contactForm = document.getElementById('ibContactForm');
  if(contactForm){
    contactForm.addEventListener('submit', function(e){
      e.preventDefault();
      if(!contactForm.checkValidity()){
        e.stopPropagation();
        contactForm.classList.add('was-validated');
        return;
      }
      document.getElementById('ibContactSuccess').classList.remove('d-none');
      contactForm.reset();
      contactForm.classList.remove('was-validated');
      contactForm.classList.add('d-none');
    });
  }

  /* footer year */
  document.querySelectorAll('.ib-year').forEach(el=> el.textContent = new Date().getFullYear());
});
