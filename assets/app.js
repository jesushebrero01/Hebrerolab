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
  gsap.utils.toArray('.hl-manifesto-grid,.hl-work-heading,.hl-work-card,.hl-statement-copy,.hl-capabilities-intro,.hl-capability-card,.hl-capabilities-foot,.hl-cta,.page-intro .eyebrow,.page-intro h1,.page-intro p,.studio-hero-copy,.studio-process-intro,.studio-process-step,.work-hero-copy,.work-hero-visual,.work-card,.studio-grid,.contact-layout').forEach((el,i)=>{
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


/* Signature interactions: cursor, reading progress, card response and adaptive media */
document.addEventListener('DOMContentLoaded',()=>{
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const progress=document.createElement('div');progress.className='hl-scroll-progress';progress.innerHTML='<span></span>';document.body.appendChild(progress);
 const bar=progress.firstElementChild;
 const updateProgress=()=>{const max=document.documentElement.scrollHeight-innerHeight;bar.style.transform='scaleX('+(max>0?scrollY/max:0)+')';};
 addEventListener('scroll',updateProgress,{passive:true});addEventListener('resize',updateProgress);updateProgress();
 if(!reduced&&matchMedia('(hover:hover) and (pointer:fine)').matches){
  const cursor=document.createElement('div');cursor.className='hl-cursor';document.body.appendChild(cursor);
  let x=-100,y=-100,tx=-100,ty=-100,raf=0;
  addEventListener('pointermove',e=>{tx=e.clientX;ty=e.clientY;if(!raf)raf=requestAnimationFrame(draw);},{passive:true});
  function draw(){x+=(tx-x)*.24;y+=(ty-y)*.24;cursor.style.left=x+'px';cursor.style.top=y+'px';if(Math.abs(tx-x)+Math.abs(ty-y)>.2)raf=requestAnimationFrame(draw);else raf=0;}
  document.querySelectorAll('a,button,input,textarea,select').forEach(el=>{el.addEventListener('pointerenter',()=>cursor.classList.add('is-active'));el.addEventListener('pointerleave',()=>cursor.classList.remove('is-active'));});
  addEventListener('pointermove',()=>cursor.classList.add('is-visible'),{once:true});
 }
 if(!reduced&&matchMedia('(pointer:fine)').matches){
  document.querySelectorAll('.hl-work-card').forEach(card=>{
   card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.transform='perspective(1100px) rotateY('+(x*2.8)+'deg) rotateX('+(-y*2.2)+'deg) translateY(-3px)';});
   card.addEventListener('pointerleave',()=>card.style.transform='');
  });
 }
 const videos=[...document.querySelectorAll('video')];
 if('IntersectionObserver'in window){
  const observer=new IntersectionObserver(entries=>entries.forEach(({target,isIntersecting})=>{
   if(isIntersecting){if(target.readyState===0)target.load();target.play?.().catch(()=>{});}else if(!target.classList.contains('hl-bg-video'))target.pause?.();
  }),{rootMargin:'220px 0px',threshold:.05});
  videos.forEach(v=>observer.observe(v));
 }
});

/* Editorial image and project interactions on inner pages */
document.addEventListener('DOMContentLoaded',()=>{
 if(matchMedia('(prefers-reduced-motion: reduce)').matches||!matchMedia('(pointer:fine)').matches)return;
 document.querySelectorAll('.work-card').forEach(card=>{
  const photo=card.querySelector('.work-photo');
  if(!photo)return;
  card.addEventListener('pointermove',e=>{
   const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
   card.style.transform='perspective(1200px) rotateY('+(x*2.2)+'deg) rotateX('+(-y*1.8)+'deg) translateY(-3px)';
   photo.style.backgroundPosition=(50+x*3)+'% '+(50+y*3)+'%';
  });
  card.addEventListener('pointerleave',()=>{card.style.transform='';photo.style.backgroundPosition='';});
 });
});
