import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.166.1/build/three.module.js';
import { RoomEnvironment } from 'https://cdn.jsdelivr.net/npm/three@0.166.1/examples/jsm/environments/RoomEnvironment.js';
const canvas=document.querySelector('#hl-hero-world'),hero=document.querySelector('.hl-hero');
if(canvas&&hero&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
 let renderer,raf=0,visible=true,mouse={x:0,y:0},smooth={x:0,y:0},scroll=0;
 try{
  renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(34,1,.1,100);camera.position.set(0,0,8.2);
  const pmrem=new THREE.PMREMGenerator(renderer),env=new RoomEnvironment();scene.environment=pmrem.fromScene(env,.04).texture;env.dispose();pmrem.dispose();
  scene.add(new THREE.HemisphereLight(0xe7efff,0x342c24,1.25));
  const key=new THREE.DirectionalLight(0xfff0d9,3.2);key.position.set(-3,4,5);scene.add(key);
  const rim=new THREE.DirectionalLight(0x9bb8d9,4.5);rim.position.set(4,2,-4);scene.add(rim);
  const accent=new THREE.PointLight(0xd7ef9b,38,12);accent.position.set(-3,-1,2);scene.add(accent);
  const world=new THREE.Group();world.position.set(2.25,.05,0);scene.add(world);
  const metal=new THREE.MeshPhysicalMaterial({color:0xdce4ed,metalness:.82,roughness:.14,clearcoat:1,clearcoatRoughness:.08,iridescence:.82,iridescenceIOR:1.32,iridescenceThicknessRange:[280,620],envMapIntensity:1.8});
  const glass=new THREE.MeshPhysicalMaterial({color:0xc8d8e8,metalness:.12,roughness:.08,transmission:.52,thickness:.7,ior:1.42,clearcoat:1,iridescence:.7,transparent:true,opacity:.92,envMapIntensity:1.7,side:THREE.DoubleSide});
  const knot=new THREE.Mesh(new THREE.TorusKnotGeometry(1.22,.34,240,36,2,3),metal);knot.rotation.set(.5,.2,-.28);world.add(knot);
  const ringA=new THREE.Mesh(new THREE.TorusGeometry(1.88,.018,12,220),new THREE.MeshStandardMaterial({color:0xd7ef9b,metalness:.72,roughness:.22,emissive:0x27321a,emissiveIntensity:.35}));ringA.rotation.set(1.08,.2,.3);world.add(ringA);
  const ringB=new THREE.Mesh(new THREE.TorusGeometry(2.08,.012,10,220),glass);ringB.rotation.set(.2,1.05,.8);world.add(ringB);
  const orb=new THREE.Mesh(new THREE.IcosahedronGeometry(.43,5),glass);orb.position.set(-1.55,.78,.45);world.add(orb);
  const orb2=new THREE.Mesh(new THREE.IcosahedronGeometry(.2,4),metal);orb2.position.set(1.58,-.92,.25);world.add(orb2);
  const count=360,positions=new Float32Array(count*3);
  for(let i=0;i<count;i++){const radius=2.3+Math.random()*1.5,a=Math.random()*Math.PI*2,b=(Math.random()-.5)*Math.PI;positions[i*3]=Math.cos(a)*Math.cos(b)*radius;positions[i*3+1]=Math.sin(b)*radius;positions[i*3+2]=Math.sin(a)*Math.cos(b)*radius;}
  const pg=new THREE.BufferGeometry();pg.setAttribute('position',new THREE.BufferAttribute(positions,3));world.add(new THREE.Points(pg,new THREE.PointsMaterial({color:0xdbe8cf,size:.018,transparent:true,opacity:.6,sizeAttenuation:true})));
  const resize=()=>{const w=hero.clientWidth,h=hero.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();};new ResizeObserver(resize).observe(hero);resize();
  hero.addEventListener('pointermove',e=>{const r=hero.getBoundingClientRect();mouse.x=(e.clientX-r.left)/r.width-.5;mouse.y=(e.clientY-r.top)/r.height-.5;},{passive:true});
  addEventListener('scroll',()=>{scroll=Math.min(1,Math.max(0,scrollY/Math.max(1,hero.offsetHeight)));},{passive:true});
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible&&!raf)raf=requestAnimationFrame(draw);}).observe(hero);
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0;}else if(visible&&!raf)raf=requestAnimationFrame(draw);});
  const clock=new THREE.Clock();
  function draw(){if(!visible||document.hidden){raf=0;return;}raf=requestAnimationFrame(draw);const t=clock.getElapsedTime();smooth.x+=(mouse.x-smooth.x)*.035;smooth.y+=(mouse.y-smooth.y)*.035;world.rotation.y=.18+Math.sin(t*.16)*.16+smooth.x*.22;world.rotation.x=.12+smooth.y*.16;world.rotation.z=Math.sin(t*.12)*.08;world.position.y=.05+Math.sin(t*.42)*.08-scroll*.34;world.scale.setScalar(1-scroll*.1);knot.rotation.y+=.0018;ringA.rotation.z+=.0011;ringB.rotation.x-=.0008;orb.position.y=.78+Math.sin(t*.7)*.12;renderer.render(scene,camera);}
  canvas.classList.add('is-ready');draw();
 }catch(e){console.warn('HebreroLab 3D unavailable',e);canvas.remove();if(renderer)renderer.dispose();}
}
