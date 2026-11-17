import * as THREE from 'three';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.166.1/examples/jsm/controls/OrbitControls.js';

const root=document.querySelector('#product-scene');
if(root){
  const scene=new THREE.Scene();
  scene.background=new THREE.Color('#080909');
  scene.fog=new THREE.FogExp2('#080909',.027);
  const camera=new THREE.PerspectiveCamera(34,1,.1,100);
  camera.position.set(7.2,3.5,10.5);
  const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.7));
  renderer.shadowMap.enabled=true;
  renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.18;
  renderer.setClearColor(0x080909,0);
  root.prepend(renderer.domElement);

  scene.add(new THREE.HemisphereLight(0xd8e4dc,0x1a1715,1.45));
  const key=new THREE.AreaLight;
  const soft=new THREE.DirectionalLight(0xffe2c0,4.8);soft.position.set(4,8,7);soft.castShadow=true;soft.shadow.mapSize.set(2048,2048);soft.shadow.camera.left=-7;soft.shadow.camera.right=7;soft.shadow.camera.top=7;soft.shadow.camera.bottom=-7;scene.add(soft);
  const rim=new THREE.DirectionalLight(0xa4c7db,4.2);rim.position.set(-6,5,-4);scene.add(rim);
  const strip=new THREE.PointLight(0xf4c98a,28,12);strip.position.set(3,2,4);scene.add(strip);
  const back=new THREE.PointLight(0x8ca9b7,32,15);back.position.set(-4,3,-5);scene.add(back);

  const bottle=new THREE.Group();scene.add(bottle);
  const gold=new THREE.MeshPhysicalMaterial({color:0xc5a36b,metalness:.88,roughness:.2});
  const black=new THREE.MeshPhysicalMaterial({color:0x090a0a,metalness:.72,roughness:.22});
  const glass=new THREE.MeshPhysicalMaterial({color:0xe0eee9,metalness:.04,roughness:.075,transmission:.96,thickness:.8,ior:1.48,transparent:true,opacity:.34,side:THREE.DoubleSide,depthWrite:false});
  const liquid=new THREE.MeshPhysicalMaterial({color:0x9a5731,metalness:.08,roughness:.14,transmission:.48,thickness:1.2,ior:1.34,transparent:true,opacity:.88});
  const darkGlass=new THREE.MeshPhysicalMaterial({color:0x222e2d,metalness:.15,roughness:.1,transmission:.45,thickness:.7,transparent:true,opacity:.55});

  function roundedShape(w,h,r){
    const s=new THREE.Shape(),x=-w/2,y=-h/2;
    s.moveTo(x+r,y);s.lineTo(x+w-r,y);s.quadraticCurveTo(x+w,y,x+w,y+r);
    s.lineTo(x+w,y+h-r);s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
    s.lineTo(x+r,y+h);s.quadraticCurveTo(x,y+h,x,y+h-r);
    s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);return s;
  }
  function extruded(w,h,d,r,material,z=0,bevel=.1){
    const geo=new THREE.ExtrudeGeometry(roundedShape(w,h,r),{depth:d,bevelEnabled:true,bevelSegments:5,steps:1,bevelSize:bevel,bevelThickness:bevel,curveSegments:16});
    geo.center();const mesh=new THREE.Mesh(geo,material);mesh.position.z=z;mesh.castShadow=true;mesh.receiveShadow=true;bottle.add(mesh);return mesh;
  }
  // Liquid core behind the glass shell.
  extruded(1.78,2.58,.64,.25,liquid,-.015,.07).position.y=-.17;
  extruded(2.05,3.12,.82,.31,glass,0,.12);
  // Heavy glass foot and shoulder glints.
  const base=new THREE.Mesh(new THREE.BoxGeometry(1.86,.15,.72),darkGlass);base.position.set(0,-1.48,0);base.castShadow=true;bottle.add(base);
  const neck=new THREE.Mesh(new THREE.CylinderGeometry(.43,.46,.42,64,1,false),glass);neck.position.y=1.7;neck.castShadow=true;bottle.add(neck);
  const collar=new THREE.Mesh(new THREE.CylinderGeometry(.49,.49,.17,64),gold);collar.position.y=1.95;collar.castShadow=true;bottle.add(collar);
  const cap=new THREE.Mesh(new THREE.CylinderGeometry(.4,.43,.88,64,1),black);cap.position.y=2.43;cap.castShadow=true;bottle.add(cap);
  const capTop=new THREE.Mesh(new THREE.CylinderGeometry(.405,.405,.055,64),gold);capTop.position.y=2.88;bottle.add(capTop);
  const capRim=new THREE.Mesh(new THREE.TorusGeometry(.415,.018,12,80),gold);capRim.rotation.x=Math.PI/2;capRim.position.y=2.05;bottle.add(capRim);
  // Original label typography baked into a canvas texture.
  const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=620;
  const ctx=canvas.getContext('2d');ctx.fillStyle='#d9d0b9';ctx.fillRect(0,0,1024,620);
  ctx.strokeStyle='#6d624c';ctx.lineWidth=3;ctx.strokeRect(28,28,968,564);
  ctx.fillStyle='#29251e';ctx.textAlign='center';ctx.font='500 36px Georgia';ctx.fillText('H E B R E R O   L A B',512,170);
  ctx.font='italic 112px Georgia';ctx.fillText('NOIR',512,340);
  ctx.font='26px Arial';ctx.fillText('EAU DE PARFUM  /  001',512,420);
  ctx.font='18px Arial';ctx.fillText('PARIS · SEVILLA · EVERYWHERE',512,490);
  const labelTex=new THREE.CanvasTexture(canvas);labelTex.colorSpace=THREE.SRGBColorSpace;
  const label=new THREE.Mesh(new THREE.PlaneGeometry(1.56,.95),new THREE.MeshStandardMaterial({map:labelTex,roughness:.68,metalness:.08}));label.position.set(0,-.1,.432);bottle.add(label);
  // Thin glass highlight strips on front edges.
  const highlightMat=new THREE.MeshBasicMaterial({color:0xe6f5ee,transparent:true,opacity:.42});
  for(const x of [-.88,.88]){const line=new THREE.Mesh(new THREE.BoxGeometry(.018,2.58,.018),highlightMat);line.position.set(x,0,.443);bottle.add(line);}
  bottle.position.set(1.35,-.15,0);bottle.rotation.y=-.22;

  // Floating chrome rings and suspended dust create depth in the scene.
  const haloMat=new THREE.MeshStandardMaterial({color:0xb99b69,metalness:.85,roughness:.24});
  const halo=new THREE.Mesh(new THREE.TorusGeometry(2.35,.012,12,180),haloMat);halo.rotation.set(1.18,.3,.2);halo.position.set(1.2,.1,-.4);scene.add(halo);
  const halo2=new THREE.Mesh(new THREE.TorusGeometry(2.8,.006,8,180),new THREE.MeshBasicMaterial({color:0xa8b6b0,transparent:true,opacity:.32}));halo2.rotation.set(.8,-.55,.5);halo2.position.set(1.2,.1,-.8);scene.add(halo2);
  const floorMat=new THREE.MeshStandardMaterial({color:0x101313,metalness:.58,roughness:.24});
  const floor=new THREE.Mesh(new THREE.CircleGeometry(200,96),floorMat);floor.rotation.x=-Math.PI/2;floor.position.y=-2.25;floor.receiveShadow=true;scene.add(floor);
  const plinth=new THREE.Mesh(new THREE.CylinderGeometry(2.4,2.55,.18,96),new THREE.MeshStandardMaterial({color:0x252725,metalness:.8,roughness:.3}));plinth.position.set(1.3,-2.13,0);plinth.receiveShadow=true;plinth.castShadow=true;scene.add(plinth);
  const edge=new THREE.Mesh(new THREE.TorusGeometry(2.4,.018,12,120),gold);edge.rotation.x=Math.PI/2;edge.position.set(1.3,-2.03,0);scene.add(edge);
  const dustGeo=new THREE.BufferGeometry(),count=260,positions=new Float32Array(count*3);
  for(let i=0;i<count;i++){positions[i*3]=(Math.random()-.5)*15;positions[i*3+1]=(Math.random()-.5)*9;positions[i*3+2]=(Math.random()-.5)*8;}
  dustGeo.setAttribute('position',new THREE.BufferAttribute(positions,3));
  const dust=new THREE.Points(dustGeo,new THREE.PointsMaterial({color:0xd9c49b,size:.018,transparent:true,opacity:.58}));scene.add(dust);

  const controls=new OrbitControls(camera,renderer.domElement);controls.target.set(1.1,.15,0);controls.enableDamping=true;controls.dampingFactor=.045;controls.enablePan=false;controls.minDistance=7;controls.maxDistance=16;controls.minPolarAngle=.95;controls.maxPolarAngle=2.15;controls.autoRotate=true;controls.autoRotateSpeed=.48;
  let scroll=0,scrollTarget=0,pointerX=0,pointerY=0;
  window.addEventListener('scroll',()=>{scrollTarget=Math.min(1,window.scrollY/Math.max(1,window.innerHeight));},{passive:true});
  root.addEventListener('pointermove',e=>{const r=root.getBoundingClientRect();pointerX=(e.clientX-r.left)/r.width-.5;pointerY=(e.clientY-r.top)/r.height-.5;});
  const resize=()=>{const w=root.clientWidth,h=root.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();};
  new ResizeObserver(resize).observe(root);resize();
  const clock=new THREE.Clock();
  function render(){requestAnimationFrame(render);const t=clock.getElapsedTime();scroll+=(scrollTarget-scroll)*.045;bottle.position.y=-.15+Math.sin(t*.72)*.085-scroll*.65;bottle.rotation.y=-.22+Math.sin(t*.28)*.13+pointerX*.12;bottle.rotation.x=pointerY*.08;halo.rotation.z=t*.11;halo2.rotation.z=-t*.075;dust.rotation.y=t*.018;controls.update();camera.position.x+=((7.2+pointerX*.55)-camera.position.x)*.018;camera.position.y+=((3.5-pointerY*.35-scroll*1.1)-camera.position.y)*.018;renderer.render(scene,camera);}
  render();root.querySelector('.scene-loading')?.classList.add('loaded');
  document.querySelector('.scene-hint')?.addEventListener('click',()=>{controls.autoRotate=!controls.autoRotate;});
  document.querySelector('.hero-3d')?.classList.add('scene-ready');
}