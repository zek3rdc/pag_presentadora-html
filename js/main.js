//Toggling Menu
const showMenu = (toggleId, navId) => {
  const toggle = document.getElementById(toggleId);
  const nav = document.getElementById(navId);

  if(toggle && nav) {
      toggle.addEventListener('click', () => {
          nav.classList.toggle('show');
      })
  }
}

showMenu('nav-toggle', 'nav-menu');

//Toggling Active Link
const navLink = document.querySelectorAll('.nav-link');

function linkAction() {
  navLink.forEach(n => n.classList.remove('active'));
  this.classList.add('active');

  const navMenu = document.getElementById('nav-menu');
  navMenu.classList.remove('show');
}

navLink.forEach(n => n.addEventListener('click', linkAction));

// Scroll Reveal

const sr = ScrollReveal({
  origin: 'top',
  distance: '80px',
  duration: 2000,
  reset: true
})

sr.reveal('.home-title', {} )
sr.reveal('.button', {delay: 200} )
sr.reveal('.home-img', {delay: 400} )
sr.reveal('.home-social', {delay: 400,} )

sr.reveal('.about-img', {} )
sr.reveal('.about-subtitle', {delay: 200} )
sr.reveal('.about-text', {delay: 400} )

sr.reveal('.skills-subtitle', {delay: 100} )
sr.reveal('.skills-text', {delay: 150} )
sr.reveal('.skills-data', {interval: 200} )
sr.reveal('.skills-img', {delay: 400} )

sr.reveal('.work-img', {interval: 200} )

sr.reveal('.contact-input', {interval: 200} )

//objeto

import * as THREE from 'https://cdn.skypack.dev/three@0.136.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls.js';
import { OBJLoader } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/loaders/OBJLoader.js';
import { FontLoader } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/geometries/TextGeometry.js';
import { EffectComposer } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/postprocessing/UnrealBloomPass.js';
import { GlitchPass } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/postprocessing/GlitchPass.js';
import { ShaderPass } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/postprocessing/ShaderPass.js';
import { gsap } from 'https://cdn.skypack.dev/gsap@3.9.1';

// Selecciona el contenedor donde se va a renderizar la escena
const container = document.getElementById('three-container');

// Configura la escena, cámara y renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Agrega geometría básica
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = (color1, color2) => `
  varying vec2 vUv;
  void main() {
    vec2 center = vec2(0.5, 0.5);
    float distance = distance(vUv, center);
    vec3 color = mix(${color1}, ${color2}, distance);
    gl_FragColor = vec4(color, 1.0);
  }
`;

const getRandomColor = () => {
  return `vec3(${Math.random().toFixed(2)}, ${Math.random().toFixed(2)}, ${Math.random().toFixed(2)})`;
};

let material = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragmentShader(getRandomColor(), getRandomColor()),
  wireframe: true,
  side: THREE.DoubleSide
});

const geometries = [
  new THREE.BoxGeometry(6, 6, 6),
  new THREE.CircleGeometry(6, 32),
  new THREE.CylinderGeometry(3, 3, 6, 32),
  new THREE.ConeGeometry(3, 6, 32),
  new THREE.PlaneGeometry(6, 6),
  new THREE.RingGeometry(2, 6, 32),
  new THREE.SphereGeometry(4, 64, 64),
  new THREE.TorusGeometry(3, 1, 16, 100),
  new THREE.TorusKnotGeometry(3, 1, 100, 16),
  new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(-3, 0, 0), new THREE.Vector3(0, 3, 0), new THREE.Vector3(3, 0, 0)]), 64, 1, 8, false),
  new THREE.PolyhedronGeometry([1, 1, 1, -1, -1, -1, 1, -1, 1, -1, 1, -1], [0, 1, 2, 1, 2, 3, 2, 3, 0, 3, 0, 1], 6, 2),
  new THREE.DodecahedronGeometry(6),
  new THREE.IcosahedronGeometry(6),
  new THREE.OctahedronGeometry(6),
  new THREE.TetrahedronGeometry(6)
];

let currentGeometryIndex = 0;
let mesh = new THREE.Mesh(geometries[currentGeometryIndex], material);
scene.add(mesh);

let wireframeEnabled = true;
window.addEventListener('dblclick', () => {
  scene.remove(mesh);
  currentGeometryIndex = (currentGeometryIndex + 1) % geometries.length;
  wireframeEnabled = !wireframeEnabled;
  material = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader(getRandomColor(), getRandomColor()),
    wireframe: wireframeEnabled,
    side: THREE.DoubleSide
  });
  mesh = new THREE.Mesh(geometries[currentGeometryIndex], material);
  scene.add(mesh);
});

camera.position.z = 10;

// Post-processing effects
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const glitchPass = new GlitchPass();
glitchPass.goWild = false;
glitchPass.SPORADIC = true;
glitchPass.delay = [8.5, 9.5];
glitchPass.duration = [0.0005, 0.00025];
glitchPass.blending = THREE.ScreenBlending;
composer.addPass(glitchPass);

const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
bloomPass.threshold = 0.21;
bloomPass.strength = 0.2;
bloomPass.radius = 1.05;
composer.addPass(bloomPass);

let noisePass;
const noiseShader = {
  uniforms: {
    'tDiffuse': { value: null },
    'amount': { value: 0.1 }
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float amount;
    varying vec2 vUv;
    float rand(vec2 co) {
      return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
    }
    void main() {
      vec4 color = texture2D(tDiffuse, vUv);
      float noise = rand(gl_FragCoord.xy) * amount;
      gl_FragColor = vec4(color.rgb + noise, color.a);
    }
  `
};
noisePass = new ShaderPass(noiseShader);
composer.addPass(noisePass);

function animate() {
  requestAnimationFrame(animate);
  mesh.rotation.x += 0.01;
  mesh.rotation.y += 0.01;
  renderer.render(scene, camera);
  controls.update();
  composer.render();
}

animate();

window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
  composer.setSize(container.clientWidth, container.clientHeight);
}

//color
document.body.style.background = 'linear-gradient(135deg, #000000 0%, #333333 100%)';


