document.addEventListener("DOMContentLoaded",()=>{
  const loader=document.querySelector(".loader");
  if(loader) setTimeout(()=>loader.classList.add("done"),450);
  document.querySelectorAll("[data-year]").forEach(el=>el.textContent=new Date().getFullYear());
  const toggle=document.querySelector(".menu-toggle"),nav=document.querySelector(".main-nav");
  if(toggle&&nav){toggle.addEventListener("click",()=>{const open=nav.classList.toggle("open");toggle.setAttribute("aria-expanded",String(open));});}
  const revealItems=document.querySelectorAll(".reveal");
  if("IntersectionObserver" in window){const io=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("visible");io.unobserve(entry.target);}}),{threshold:.12});revealItems.forEach(el=>io.observe(el));}else revealItems.forEach(el=>el.classList.add("visible"));
  if(window.gsap&&window.ScrollTrigger){gsap.registerPlugin(ScrollTrigger);gsap.utils.toArray(".project-card,.principle,.work-item").forEach(el=>gsap.from(el,{y:35,opacity:0,duration:.8,ease:"power2.out",scrollTrigger:{trigger:el,start:"top 88%"}}));}
  document.querySelectorAll(".filter").forEach(button=>button.addEventListener("click",()=>{document.querySelectorAll(".filter").forEach(b=>b.classList.remove("active"));button.classList.add("active");const filter=button.dataset.filter;document.querySelectorAll(".work-item").forEach(item=>{item.hidden=filter!=="all"&&item.dataset.category!==filter;});}));
  const form=document.querySelector("#contact-form");
  if(form) form.addEventListener("submit",event=>{event.preventDefault();const data=new FormData(form);const subject=encodeURIComponent("Nuevo contacto desde HebreroLab — "+data.get("subject"));const body=encodeURIComponent("Nombre: "+data.get("name")+"\nEmail: "+data.get("email")+"\nTipo: "+data.get("subject")+"\n\n"+data.get("message"));window.location.href="mailto:hola@hebrerolab.com?subject="+subject+"&body="+body;});
});
