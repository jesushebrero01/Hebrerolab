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
