import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.166.1/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.166.1/examples/jsm/loaders/GLTFLoader.js';

const root=document.querySelector('[data-spin-viewer]');
if(root){
 const wrap=root.querySelector('.spin-canvas-wrap'),canvas=root.querySelector('.spin-canvas'),loaderEl=root.querySelector('.spin-loader');
 const scene=new THREE.Scene();scene.background=null;
 const camera=new THREE.PerspectiveCamera(32,1,.01,100);camera.position.set(0,1.2,5.8);
 const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'high-performance'});
 renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.7));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;
 scene.add(new THREE.HemisphereLight(0xfff4e5,0x6b6257,2.1));
 const key=new THREE.DirectionalLight(0xfff2df,3.2);key.position.set(-3,5,5);scene.add(key);
 const fill=new THREE.DirectionalLight(0xffffff,2.1);fill.position.set(4,2,-3);scene.add(fill);
 const rim=new THREE.DirectionalLight(0xd8e7f2,2.4);rim.position.set(0,3,-5);scene.add(rim);
 const product=new THREE.Group();scene.add(product);
 let model=null,baseRotation=0,velocity=0,dragging=false,lastX=0,lastTime=0,activeNote='glass';
 const loader=new GLTFLoader();
 loader.load('https://grab3d.com/dl/perfume-bottle/perfume-bottle.glb',gltf=>{
   model=gltf.scene;product.add(model);
   const box=new THREE.Box3().setFromObject(model),size=box.getSize(new THREE.Vector3()),center=box.getCenter(new THREE.Vector3());
   model.position.sub(center);
   const max=Math.max(size.x,size.y,size.z);model.scale.setScalar(2.35/max);
   camera.position.set(0,0.35,5.3);camera.lookAt(0,0,0);
   const floor=new THREE.Mesh(new THREE.CircleGeometry(1.65,80),new THREE.MeshBasicMaterial({color:0x877d70,transparent:true,opacity:.10}));floor.rotation.x=-Math.PI/2;floor.position.y=-1.27;scene.add(floor);
   loaderEl.classList.add('loaded');
   positionHotspots();
 },undefined,error=>{console.error('Spin Viewer model load failed',error);loaderEl.innerHTML='MODEL COULD NOT LOAD · <a href="https://grab3d.com/models/props/perfume-bottle/" target="_blank" rel="noopener">OPEN SOURCE MODEL</a>';});
 const resize=()=>{const w=wrap.clientWidth,h=wrap.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();};new ResizeObserver(resize).observe(wrap);resize();
 const hotspotMap={glass:new THREE.Vector3(0,-.15,.35),cap:new THREE.Vector3(0,.75,0),base:new THREE.Vector3(0,-.85,0)};
 function positionHotspots(){if(!model)return;const points={glass:hotspotMap.glass,cap:hotspotMap.cap,base:hotspotMap.base};Object.entries(points).forEach(([name,p])=>{const v=p.clone().applyMatrix4(product.matrixWorld).project(camera);const b=wrap.getBoundingClientRect();const x=(v.x*.5+.5)*b.width,y=(-v.y*.5+.5)*b.height;const el=wrap.querySelector('[data-note="'+name+'"]');if(el){el.style.left=x+'px';el.style.top=y+'px';el.style.opacity=v.z<1?'1':'0';}});}
 const setNote=name=>{activeNote=name;root.querySelectorAll('.spin-note').forEach(el=>el.classList.toggle('active',el.dataset.notePanel===name));root.querySelectorAll('.spin-hotspot').forEach(el=>el.classList.toggle('active',el.dataset.note===name));};
 root.querySelectorAll('.spin-hotspot').forEach(el=>el.addEventListener('click',()=>setNote(el.dataset.note)));
 root.querySelector('.spin-reset')?.addEventListener('click',()=>{baseRotation=0;velocity=0;product.rotation.set(0,0,0);setNote('glass');});
 const down=e=>{dragging=true;lastX=e.clientX;lastTime=performance.now();velocity=0;wrap.setPointerCapture?.(e.pointerId);};
 const move=e=>{if(!dragging)return;const now=performance.now(),dt=Math.max(8,now-lastTime);const dx=e.clientX-lastX;baseRotation+=dx*.009;velocity=(dx*.009)/(dt/16.67);lastX=e.clientX;lastTime=now;};
 const up=()=>{dragging=false;};
 wrap.addEventListener('pointerdown',down);wrap.addEventListener('pointermove',move);wrap.addEventListener('pointerup',up);wrap.addEventListener('pointercancel',up);wrap.addEventListener('lostpointercapture',up);
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;let raf;
 const animate=()=>{raf=requestAnimationFrame(animate);if(!dragging){baseRotation+=velocity;velocity*=.94;if(Math.abs(velocity)<.00005)velocity=0;}product.rotation.y=baseRotation;product.rotation.x+=(0-product.rotation.x)*.035;renderer.render(scene,camera);positionHotspots();};animate();
 window.addEventListener('beforeunload',()=>cancelAnimationFrame(raf),{once:true});
}
