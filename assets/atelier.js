document.addEventListener('DOMContentLoaded',()=>{
 const menu=document.querySelector('.atelier-menu'),nav=document.querySelector('.atelier-nav');
 if(menu&&nav)menu.addEventListener('click',()=>{const open=nav.classList.toggle('is-open');menu.setAttribute('aria-expanded',String(open));});

 // The welcome screen is a one-way entrance: once passed, it is removed
 // from the document and remembered for this browser tab session.
 const entry=document.querySelector('.atelier-entry');
 const dismissEntry=()=>{
  if(!entry||document.documentElement.classList.contains('entry-dismissed'))return;
  const oldHeight=entry.getBoundingClientRect().height;
  const oldScroll=window.scrollY;
  document.documentElement.classList.add('entry-dismissed');
  try{sessionStorage.setItem('hebrerolab-entry-dismissed','1')}catch(e){}
  entry.remove();
  window.scrollTo(0,Math.max(0,oldScroll-oldHeight));
 };
 if(entry){
  if(document.documentElement.classList.contains('entry-dismissed'))entry.remove();
  else{
   let entryTicking=false;
   const checkEntry=()=>{
    if(window.scrollY>=window.innerHeight*.68)dismissEntry();
    entryTicking=false;
   };
   const onEntryScroll=()=>{if(!entryTicking){window.requestAnimationFrame(checkEntry);entryTicking=true;}};
   window.addEventListener('scroll',onEntryScroll,{passive:true});
   checkEntry();
  }
 }

 // Scroll-driven parallax on the real Hubble photograph.
 let spaceTicking=false;
 const updateSpace=()=>{
  document.documentElement.style.setProperty('--space-shift',(-window.scrollY*.08).toFixed(1)+'px');
  spaceTicking=false;
 };
 const onSpaceScroll=()=>{if(!spaceTicking){window.requestAnimationFrame(updateSpace);spaceTicking=true;}};
 updateSpace();
 window.addEventListener('scroll',onSpaceScroll,{passive:true});

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