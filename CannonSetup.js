import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as CANNON from 'cannon-es';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

const world = new CANNON.World();
world.gravity.set(0, -9.82, 0);

const groundBody = new CANNON.Body({
  mass: 0,
  shape: new CANNON.Box(new CANNON.Vec3(2.5, 0.25, 5)),
  position: new CANNON.Vec3(0, -2, 0),
});
world.addBody(groundBody);

const groundGeometry = new THREE.BoxGeometry(5, 0.5, 10);
const groundMaterial = new THREE.MeshStandardMaterial({ color: '#0000ff' });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.position.set(0, -2, 0);
ground.receiveShadow = true;
scene.add(ground);

const cubeBody = new CANNON.Body({
  mass: 1,
  shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)),
  position: new CANNON.Vec3(0, 0, 0),
});
world.addBody(cubeBody);

const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshStandardMaterial({ color: '#00ff00' });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.castShadow = true;
scene.add(cube);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 20, 5);
light.castShadow = true;
scene.add(light);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

camera.position.set(0, 1.5, 5);
cube.add(camera);

const keys = {
  a: { pressed: false },
  d: { pressed: false },
  w: { pressed: false },
  s: { pressed: false }
};

window.addEventListener('keydown', (event) => {
  switch (event.code) {
    case 'KeyA':
      keys.a.pressed = true;
      break;
    case 'KeyD':
      keys.d.pressed = true;
      break;
    case 'KeyW':
      keys.w.pressed = true;
      break;
    case 'KeyS':
      keys.s.pressed = true;
      break;
  }
});

window.addEventListener('keyup', (event) => {
  switch (event.code) {
    case 'KeyA':
      keys.a.pressed = false;
      break;
    case 'KeyD':
      keys.d.pressed = false;
      break;
    case 'KeyW':
      keys.w.pressed = false;
      break;
    case 'KeyS':
      keys.s.pressed = false;
      break;
  }
});

const loader = new GLTFLoader();
loader.load('https://cdn.glitch.global/9840aa6a-2e73-4088-b83c-d68a4642d7be/low_poly_game_level.glb?v=1727015272543', function (gltf) {
  gltf.scene.scale.set(5, 5, 5);
  gltf.scene.position.set(0, 0, 0);
  scene.add(gltf.scene);
});

function handlePlayerMovement() {
  const moveSpeed = 5;
  const velocity = cubeBody.velocity;

  if (keys.a.pressed) {
    velocity.x = -moveSpeed;
  } else if (keys.d.pressed) {
    velocity.x = moveSpeed;
  } else {
    velocity.x = 0;
  }

  if (keys.w.pressed) {
    velocity.z = -moveSpeed;
  } else if (keys.s.pressed) {
    velocity.z = moveSpeed;
  } else {
    velocity.z = 0;
  }
}

cubeBody.angularVelocity.set(0, 0, 0);
cubeBody.angularDamping = 1;
cubeBody.fixedRotation = true;
cubeBody.updateMassProperties();

function animate() {
  requestAnimationFrame(animate);
  world.step(1 / 60);
  handlePlayerMovement();
  cube.position.copy(cubeBody.position);
  cube.quaternion.copy(cubeBody.quaternion);
  renderer.render(scene, camera);
}

animate();
