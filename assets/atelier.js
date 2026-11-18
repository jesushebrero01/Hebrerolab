document.addEventListener('DOMContentLoaded',()=>{
 const menu=document.querySelector('.atelier-menu'),nav=document.querySelector('.atelier-nav');
 if(menu&&nav)menu.addEventListener('click',()=>{const open=nav.classList.toggle('is-open');menu.setAttribute('aria-expanded',String(open));});
 const videos=[...document.querySelectorAll('.atelier video')];
 if('IntersectionObserver'in window){
  const observer=new IntersectionObserver(entries=>entries.forEach(({target,isIntersecting})=>{
   if(isIntersecting){if(target.readyState===0)target.load();target.play().catch(()=>{});}
   else if(!target.closest('.atelier-hero'))target.pause();
  }),{rootMargin:'180px 0px',threshold:.08});
  videos.forEach(v=>observer.observe(v));
 }else videos.forEach(v=>v.play().catch(()=>{}));
 const reveal=[...document.querySelectorAll('.atelier-reveal')];
 if('IntersectionObserver'in window){
  const io=new IntersectionObserver(entries=>entries.forEach(({target,isIntersecting})=>{if(isIntersecting){target.classList.add('is-visible');io.unobserve(target);}}),{threshold:.12});
  reveal.forEach(el=>io.observe(el));
 }else reveal.forEach(el=>el.classList.add('is-visible'));
 document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
});