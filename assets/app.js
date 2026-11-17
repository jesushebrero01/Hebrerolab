document.addEventListener('DOMContentLoaded',()=>{document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());const toggle=document.querySelector('.menu-toggle'),nav=document.querySelector('.main-nav');if(toggle&&nav)toggle.addEventListener('click',()=>nav.classList.toggle('open'));document.querySelectorAll('.filter').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.filter').forEach(x=>x.classList.remove('active'));btn.classList.add('active');document.querySelectorAll('.work-card').forEach(card=>{card.hidden=btn.dataset.filter!=='all'&&card.dataset.category!==btn.dataset.filter;});}));const form=document.querySelector('#contact-form');if(form)form.addEventListener('submit',e=>{e.preventDefault();const d=new FormData(form);const subject=encodeURIComponent('Nuevo contacto HebreroLab — '+d.get('subject'));const body=encodeURIComponent('Nombre: '+d.get('name')+'\nEmail: '+d.get('email')+'\nProyecto: '+d.get('subject')+'\n\n'+d.get('message'));location.href='mailto:hola@hebrerolab.com?subject='+subject+'&body='+body;});});

/* ScrollExpand — native JavaScript adaptation of the React Bits interaction */
(() => {
  const root = document.querySelector('[data-scroll-expand]');
  if (!root) return;
  const track = root.querySelector('.scroll-expand-track');
  const stage = root.querySelector('.scroll-expand-stage');
  const frame = root.querySelector('.scroll-expand-frame');
  const media = root.querySelector('.scroll-expand-media');
  const title = root.querySelector('.scroll-expand-title');
  const hint = root.querySelector('.scroll-expand-hint');
  const scrim = root.querySelector('.scroll-expand-scrim');
  const overlay = root.querySelector('.scroll-expand-overlay');
  if (!track || !stage || !frame || !media) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let target = 0, current = 0, raf = 0, stageH = 0;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const smooth = (a,b,x) => { const t=clamp((x-a)/(b-a),0,1); return t*t*(3-2*t); };
  const measure = () => {
    stageH = window.innerHeight;
    stage.style.height = stageH + 'px';
    track.style.height = (stageH * 2.25) + 'px';
    stage.style.setProperty('--se-title-size', Math.min(84, Math.max(32, window.innerWidth*.075))+'px');
    updateTarget();
    current = target;
    render(current);
  };
  const updateTarget = () => {
    const top = track.getBoundingClientRect().top;
    target = clamp(-top/(stageH*1.2),0,1);
  };
  const render = p => {
    const e=smooth(0,1,p), w=42+(100-42)*e, h=58+(100-58)*e;
    const ix=(100-w)/2, iy=(100-h)/2, radius=24*(1-e);
    frame.style.clipPath = `inset(${iy}% ${ix}% ${iy}% ${ix}% round ${radius}px)`;
    media.style.transform = `scale(${1.35-.35*e})`;
    scrim.style.opacity = String(.5*e);
    const out=smooth(.4,.88,p);
    title.style.opacity=String(1-out);
    title.style.transform=`translate3d(0,${-28*out}px,0) scale(${1+.06*out})`;
    const gone=smooth(0,.12,p);
    hint.style.opacity=String(1-gone);
    hint.style.transform=`translate3d(0,${8*gone}px,0)`;
    const inn=smooth(.68,1,p);
    overlay.style.opacity=String(inn);
    overlay.style.transform=`translate3d(0,${18*(1-inn)}px,0)`;
  };
  const tick = () => {
    current += (target-current)*.12;
    if(Math.abs(target-current)<.0005){current=target;raf=0;}
    render(current);
    if(raf) raf=requestAnimationFrame(tick);
  };
  const onScroll = () => {
    updateTarget();
    if(reduced){current=target;render(current);return;}
    if(!raf) raf=requestAnimationFrame(tick);
  };
  window.addEventListener('scroll',onScroll,{passive:true});
  window.addEventListener('resize',measure);
  measure();
})();


/* GSAP motion direction — restrained, editorial, scroll-led */
document.addEventListener('DOMContentLoaded',()=>{
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduced||!window.gsap||!window.ScrollTrigger)return;
  gsap.registerPlugin(ScrollTrigger);
  gsap.utils.toArray('.hl-manifesto-grid,.hl-work-heading,.hl-work-card,.hl-statement-copy,.hl-cta').forEach((el,i)=>{
    gsap.fromTo(el,{y:42,opacity:0},{y:0,opacity:1,duration:.95,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 86%',once:true}});
  });
  gsap.utils.toArray('.hl-section-label').forEach(el=>{
    gsap.fromTo(el,{opacity:0,x:-18},{opacity:1,x:0,duration:.7,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 90%',once:true}});
  });
  const heroVideo=document.querySelector('.hl-bg-video');
  if(heroVideo){heroVideo.addEventListener('loadedmetadata',()=>{heroVideo.play().catch(()=>{});},{once:true});}
  document.querySelectorAll('video').forEach(v=>{
    v.addEventListener('error',()=>{v.classList.add('video-failed');},{once:true});
    if(v.readyState>=2)v.play().catch(()=>{});
  });
});

/* Pointer interaction, editorial reveals and viewport-aware video playback */
document.addEventListener('DOMContentLoaded',()=>{
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 if(!reduced&&matchMedia('(pointer:fine)').matches){
  document.querySelectorAll('.hl-work-card').forEach(card=>{
   card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.transform='perspective(1100px) rotateY('+(x*3.2)+'deg) rotateX('+(-y*2.6)+'deg) translateY(-4px)';});
   card.addEventListener('pointerleave',()=>card.style.transform='');
  });
 }
 if(window.gsap&&window.ScrollTrigger&&!reduced){
  gsap.registerPlugin(ScrollTrigger);
  gsap.utils.toArray('.hl-manifesto h2,.hl-work-heading h2,.hl-statement-copy h2,.hl-cta h2').forEach(el=>gsap.fromTo(el,{y:54,opacity:0,rotateX:5},{y:0,opacity:1,rotateX:0,duration:1.05,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 88%',once:true}}));
  gsap.utils.toArray('.hl-services-line span').forEach((el,i)=>gsap.fromTo(el,{y:18,opacity:0},{y:0,opacity:1,duration:.65,delay:i*.07,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 92%',once:true}}));
  gsap.utils.toArray('.hl-section-label').forEach(el=>ScrollTrigger.create({trigger:el,start:'top 88%',once:true,onEnter:()=>el.classList.add('is-visible')}));
 }
 const videos=[...document.querySelectorAll('video:not(.hl-bg-video)')];
 if('IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>entries.forEach(({target,isIntersecting})=>{if(isIntersecting)target.play?.().catch(()=>{});else target.pause?.();}),{rootMargin:'180px 0px',threshold:.08});videos.forEach(v=>observer.observe(v));}
});
