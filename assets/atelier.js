document.addEventListener('DOMContentLoaded',()=>{
 const menu=document.querySelector('.atelier-menu'),nav=document.querySelector('.atelier-nav');
 if(menu&&nav)menu.addEventListener('click',()=>{const open=nav.classList.toggle('is-open');menu.setAttribute('aria-expanded',String(open));});

 // The brand entrance fades away progressively as the visitor scrolls into the homepage.
 const entry=document.querySelector('.atelier-entry');
 if(entry){
  let ticking=false;
  const updateEntry=()=>{
   const distance=Math.max(1,window.innerHeight*.72);
   const progress=Math.min(1,Math.max(0,window.scrollY/distance));
   entry.style.opacity=String(1-progress);
   entry.style.transform='translateY('+(-progress*5)+'%) scale('+(1-progress*.025)+')';
   entry.style.pointerEvents=progress>.96?'none':'auto';
   ticking=false;
  };
  const onScroll=()=>{if(!ticking){window.requestAnimationFrame(updateEntry);ticking=true;}};
  updateEntry();
  window.addEventListener('scroll',onScroll,{passive:true});
  window.addEventListener('resize',updateEntry);
 }

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
 const form=document.querySelector('#contact-form');
 if(form)form.addEventListener('submit',e=>{
  e.preventDefault();const data=new FormData(form);
  const subject=encodeURIComponent('Nuevo contacto HebreroLab — '+data.get('subject'));
  const body=encodeURIComponent('Nombre: '+data.get('name')+'\\nEmail: '+data.get('email')+'\\nProyecto: '+data.get('subject')+'\\n\\n'+data.get('message'));
  location.href='mailto:hola@hebrerolab.com?subject='+subject+'&body='+body;
 });
 document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
});