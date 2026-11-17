import * as THREE from 'three';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.166.1/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'https://cdn.jsdelivr.net/npm/three@0.166.1/examples/jsm/environments/RoomEnvironment.js';

const root = document.querySelector('#product-scene');
if (root) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#e8e2d8');
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.set(4.25, 2.1, 7.7);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.65));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  renderer.setClearColor('#e8e2d8', 1);
  root.prepend(renderer.domElement);

  // A studio environment is essential for believable glass: it gives the bottle
  // real shapes to reflect instead of relying on a flat transparent material.
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  scene.environment = pmrem.fromScene(room, 0.04).texture;
  room.dispose();
  pmrem.dispose();

  const key = new THREE.DirectionalLight(0xfff5e8, 3.2);
  key.position.set(-4, 7, 5);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.left = -4; key.shadow.camera.right = 4;
  key.shadow.camera.top = 5; key.shadow.camera.bottom = -4;
  key.shadow.bias = -0.00015;
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xffffff, 2.0);
  fill.position.set(5, 3, 2);
  scene.add(fill);
  const rim = new THREE.DirectionalLight(0xd7e6f0, 3.6);
  rim.position.set(1, 5, -5);
  scene.add(rim);
  const warm = new THREE.PointLight(0xe6b879, 34, 12);
  warm.position.set(-3, 1.4, 3.5);
  scene.add(warm);

  const product = new THREE.Group();
  scene.add(product);
  const bottle = new THREE.Group();
  product.add(bottle);

  const glass = new THREE.MeshPhysicalMaterial({
    color: 0xffffff, metalness: 0, roughness: 0.035, transmission: 1,
    thickness: 0.22, ior: 1.5, transparent: false, envMapIntensity: 1.8,
    clearcoat: 1, clearcoatRoughness: 0.025, attenuationColor: new THREE.Color('#e8d7bd'),
    attenuationDistance: 2.4
  });
  const liquidMat = new THREE.MeshPhysicalMaterial({
    color: '#b66d37', metalness: 0, roughness: 0.12, transmission: 0.22,
    thickness: 0.5, ior: 1.34, envMapIntensity: 1.1,
    attenuationColor: new THREE.Color('#a44e1e'), attenuationDistance: 1.4
  });
  const gold = new THREE.MeshPhysicalMaterial({ color: '#b88b50', metalness: 0.92, roughness: 0.19, envMapIntensity: 1.6 });
  const goldLight = new THREE.MeshPhysicalMaterial({ color: '#e4c58d', metalness: 0.88, roughness: 0.16 });
  const black = new THREE.MeshPhysicalMaterial({ color: '#171715', metalness: 0.18, roughness: 0.16, clearcoat: 1, clearcoatRoughness: 0.08 });

  function lathe(points, material, segments = 128) {
    const geometry = new THREE.LatheGeometry(points.map(([r, y]) => new THREE.Vector2(r, y)), segments);
    geometry.computeVertexNormals();
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true; mesh.receiveShadow = true;
    bottle.add(mesh);
    return mesh;
  }

  // Thick, closed glass wall with a broad base, curved shoulders and a narrow neck.
  const shellProfile = [
    [0.00,-1.72],[0.48,-1.72],[0.61,-1.69],[0.66,-1.62],[0.67,-1.48],
    [0.67,-0.25],[0.66,0.22],[0.62,0.48],[0.52,0.67],[0.35,0.82],
    [0.255,0.91],[0.245,1.00],[0.245,1.28],[0.29,1.31],[0.29,1.39],
    [0.255,1.42],[0.215,1.39],[0.215,1.03],[0.23,0.94],[0.39,0.78],
    [0.55,0.62],[0.59,0.42],[0.60,-1.43],[0.56,-1.54],[0.00,-1.54]
  ];
  lathe(shellProfile, glass, 160);

  // Amber fragrance fill and a clean, slightly domed meniscus.
  const liquidProfile = [
    [0,-1.49],[0.54,-1.49],[0.575,-1.43],[0.575,-0.36],
    [0.57,-0.31],[0.54,-0.285],[0.48,-0.30],[0.38,-0.32],[0,-0.32]
  ];
  lathe(liquidProfile, liquidMat, 128);

  // Heavy optical-glass foot, visible as a bright refracting band.
  const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.625,0.65,0.15,128), glass);
  foot.position.y = -1.62; foot.castShadow = true; bottle.add(foot);
  const baseLine = new THREE.Mesh(new THREE.TorusGeometry(0.645,0.012,12,128), new THREE.MeshPhysicalMaterial({color:'#fff9ec',roughness:.08,metalness:.05,transparent:true,opacity:.6}));
  baseLine.rotation.x = Math.PI/2; baseLine.position.y = -1.54; bottle.add(baseLine);

  // Neck, crimped metal collar, atomizer button and nozzle.
  const neckRing = new THREE.Mesh(new THREE.CylinderGeometry(.285,.285,.12,96), gold);
  neckRing.position.y = 1.38; bottle.add(neckRing);
  const collar = new THREE.Mesh(new THREE.CylinderGeometry(.27,.275,.2,96), goldLight);
  collar.position.y = 1.51; bottle.add(collar);
  const collarBand = new THREE.Mesh(new THREE.TorusGeometry(.27,.012,10,96), gold);
  collarBand.rotation.x = Math.PI/2; collarBand.position.y = 1.57; bottle.add(collarBand);
  const pumpStem = new THREE.Mesh(new THREE.CylinderGeometry(.09,.10,.18,48), new THREE.MeshStandardMaterial({color:'#ddd8cd',metalness:.72,roughness:.24}));
  pumpStem.position.y = 1.68; bottle.add(pumpStem);
  const actuator = new THREE.Mesh(new THREE.CylinderGeometry(.12,.14,.13,48), new THREE.MeshPhysicalMaterial({color:'#f2eee5',metalness:.42,roughness:.2}));
  actuator.position.y = 1.79; bottle.add(actuator);
  const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(.035,.045,.12,24), gold);
  nozzle.rotation.z = Math.PI/2; nozzle.position.set(.13,1.8,0); bottle.add(nozzle);
  const nozzleHole = new THREE.Mesh(new THREE.CircleGeometry(.022,24), black);
  nozzleHole.position.set(.192,1.8,0); nozzleHole.rotation.y = Math.PI/2; bottle.add(nozzleHole);

  // Weighted, lacquered cap with a fine machined gold detail.
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(.34,.35,.72,128,1), black);
  cap.position.y = 2.19; cap.castShadow = true; bottle.add(cap);
  const capTop = new THREE.Mesh(new THREE.CylinderGeometry(.337,.337,.035,128), new THREE.MeshPhysicalMaterial({color:'#282723',metalness:.24,roughness:.18}));
  capTop.position.y = 2.57; bottle.add(capTop);
  const capRim = new THREE.Mesh(new THREE.TorusGeometry(.345,.012,12,128), goldLight);
  capRim.rotation.x = Math.PI/2; capRim.position.y = 1.84; bottle.add(capRim);

  // Front label: restrained, crisp typography and a subtle paper surface.
  const labelCanvas = document.createElement('canvas');
  labelCanvas.width = 1200; labelCanvas.height = 760;
  const c = labelCanvas.getContext('2d');
  c.fillStyle = '#e8dfcd'; c.fillRect(0,0,1200,760);
  c.strokeStyle = '#a88d67'; c.lineWidth = 5; c.strokeRect(24,24,1152,712);
  c.fillStyle = '#25221d'; c.textAlign = 'center';
  c.font = '500 40px Georgia'; c.fillText('H E B R E R O   L A B',600,190);
  c.strokeStyle = '#b69a72'; c.lineWidth = 2; c.beginPath(); c.moveTo(330,250); c.lineTo(870,250); c.stroke();
  c.font = 'italic 178px Georgia'; c.fillText('NOIR',600,470);
  c.font = '500 34px Arial'; c.fillText('EAU DE PARFUM',600,555);
  c.font = '24px Arial'; c.fillText('001  /  SEVILLA',600,625);
  const labelTexture = new THREE.CanvasTexture(labelCanvas);
  labelTexture.colorSpace = THREE.SRGBColorSpace;
  const label = new THREE.Mesh(new THREE.PlaneGeometry(.98,.62), new THREE.MeshPhysicalMaterial({map:labelTexture,roughness:.82,metalness:0}));
  label.position.set(0,-.02,.675); bottle.add(label);
  const labelFoil = new THREE.Mesh(new THREE.PlaneGeometry(.98,.012), goldLight);
  labelFoil.position.set(0,.315,.678); bottle.add(labelFoil);

  product.position.set(1.55,-.05,0);
  product.rotation.y = -.28;
  product.scale.setScalar(1.03);

  // A sculptural plinth and a seamless warm studio floor.
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(200,200), new THREE.MeshStandardMaterial({color:'#d7d0c5',roughness:.78,metalness:0}));
  floor.rotation.x = -Math.PI/2; floor.position.y = -1.91; floor.receiveShadow = true; scene.add(floor);
  const plinthMat = new THREE.MeshPhysicalMaterial({color:'#c8bba7',roughness:.28,metalness:.12,clearcoat:.6});
  const plinth = new THREE.Mesh(new THREE.CylinderGeometry(1.38,1.48,.24,128),plinthMat);
  plinth.position.set(1.55,-1.79,0); plinth.castShadow=true; plinth.receiveShadow=true; scene.add(plinth);
  const plinthEdge = new THREE.Mesh(new THREE.TorusGeometry(1.38,.012,12,128),gold);
  plinthEdge.rotation.x=Math.PI/2;plinthEdge.position.set(1.55,-1.66,0);scene.add(plinthEdge);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(.95,.22,0); controls.enableDamping=true; controls.dampingFactor=.055;
  controls.enablePan=false; controls.enableZoom=false;
  controls.minPolarAngle=1.05; controls.maxPolarAngle=2.0;
  controls.autoRotate=true; controls.autoRotateSpeed=.38;

  let pointerX=0, pointerY=0, scrollTarget=0, scroll=0;
  root.addEventListener('pointermove', e => {
    const rect=root.getBoundingClientRect();
    pointerX=(e.clientX-rect.left)/rect.width-.5;
    pointerY=(e.clientY-rect.top)/rect.height-.5;
  });
  window.addEventListener('scroll',()=>{scrollTarget=Math.min(1,window.scrollY/Math.max(1,window.innerHeight));},{passive:true});
  const resize=()=>{const w=root.clientWidth,h=root.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();};
  const observer=new ResizeObserver(resize);observer.observe(root);resize();
  const clock=new THREE.Clock();
  function animate(){
    requestAnimationFrame(animate);
    const t=clock.getElapsedTime();
    scroll+=(scrollTarget-scroll)*.035;
    product.position.y=-.05+Math.sin(t*.65)*.025-scroll*.25;
    product.rotation.y=-.28+Math.sin(t*.22)*.045+pointerX*.10;
    product.rotation.x=pointerY*.035;
    controls.update();
    camera.position.x+=(4.25+pointerX*.22-camera.position.x)*.012;
    camera.position.y+=(2.1-pointerY*.16-scroll*.3-camera.position.y)*.012;
    renderer.render(scene,camera);
  }
  animate();
  root.querySelector('.scene-loading')?.classList.add('loaded');
  const hint=root.querySelector('.scene-hint');
  hint?.addEventListener('click',()=>{controls.autoRotate=!controls.autoRotate;});
  document.querySelector('.hero-3d')?.classList.add('scene-ready');
}