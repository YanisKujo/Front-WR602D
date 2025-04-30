import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

let environmentLoaded = false;

export function createScene(canvas) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;

  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();

  new RGBELoader()
    .setPath('/textures/')
    .load('casino_env.hdr', (hdr) => {
      const envMap = pmremGenerator.fromEquirectangular(hdr).texture;
      scene.environment = envMap;
      scene.background = envMap;
      hdr.dispose();
      pmremGenerator.dispose();
      environmentLoaded = true;
    });

  const ambient = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambient);

  camera.position.set(0, 10, 10);
  camera.lookAt(0, 0, 0);

  return { scene, camera, renderer };
}
