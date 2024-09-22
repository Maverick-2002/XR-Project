import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as CANNON from 'cannon-es';

// Initialize Three.js scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

// Initialize Cannon.js physics world
const world = new CANNON.World();
world.gravity.set(0, -9.82, 0); // Set gravity in m/s²

// Create ground in Cannon.js
const groundBody = new CANNON.Body({
  mass: 0, // Static ground (mass = 0 means it won't move)
  shape: new CANNON.Plane(),
});
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0); // Rotate to make it horizontal
world.addBody(groundBody);

// Create ground in Three.js
const groundGeometry = new THREE.PlaneGeometry(50, 50);
const groundMaterial = new THREE.MeshStandardMaterial({ color: '#808080' });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2; // Rotate to make it horizontal
ground.receiveShadow = true;
scene.add(ground);

// Create a dynamic cube in Cannon.js
const cubeBody = new CANNON.Body({
  mass: 1, // Set mass to give it gravity
  shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)), // Box shape
  position: new CANNON.Vec3(0, 0, 0), // Initial position
});
world.addBody(cubeBody);

// Create a dynamic cube in Three.js
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshStandardMaterial({ color: '#00ff00' });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.castShadow = true;
scene.add(cube);

// Lighting
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 5);
light.castShadow = true;
scene.add(light);

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Step the physics world
  world.step(1 / 60); // 60 fps

  // Copy coordinates from Cannon.js to Three.js
  cube.position.copy(cubeBody.position);
  cube.quaternion.copy(cubeBody.quaternion);

  renderer.render(scene, camera);
}

camera.position.z = 10;
animate();

