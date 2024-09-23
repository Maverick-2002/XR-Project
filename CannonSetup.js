import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as CANNON from 'cannon-es';
import { Movement } from './Movement.js';
import { AssetSpawner } from './AssetSpawner.js';
import { MouseCoordinates } from './MouseCoordinates.js';
import { RoomBoundary } from './RoomBoundary.js';
import { Door } from './Door.js'; // Make sure to import your Door class

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

const world = new CANNON.World();
world.gravity.set(0, -9.82, 0);

// Create room boundaries
const rooms = [
new RoomBoundary(scene, world, { width: 4, height: 5, depth: 35, boundaryThickness: 0.1, position: { x: -11, y: 1, z: -21 }, visible: false }),
new RoomBoundary(scene, world, { width: 15, height: 5, depth: 25, boundaryThickness: 0.1, position: { x: -7.5, y: 1, z: 10 }, visible: false }),
new RoomBoundary(scene, world, { width: 15, height: 5, depth: 35, boundaryThickness: 0.1, position: { x: -7.5, y: 1, z: 42 }, visible: true }),
new RoomBoundary(scene, world, { width: 10, height: 5, depth: 5, boundaryThickness: 0.1, position: { x: -20.5, y: 1, z: 57 }, visible: true }),
new RoomBoundary(scene, world, { width: 20, height: 5, depth: 15, boundaryThickness: 0.1, position: { x: -15.5, y: 1, z: 68 }, visible: true }),
];
// Create multiple doors
const doors = [
  new Door(scene, world, { width: 2.5, height: 3, depth: 0.1, position: { x: -11.5, y: 0.8, z: -2 },visible: true, destination: { x: -11.6, y: -0.4, z: -5 }  }),
  new Door(scene, world, { width: 2.5, height: 3, depth: 0.1, position: { x: -11.5, y: 0.8, z: -4 },visible: true, destination: { x: -11.6, y: -0.4, z: -1 }  }),
  new Door(scene, world, { width: 2.5, height: 3, depth: 0.1, position: { x: -7.5, y: 0.8, z: 22.5 },visible: true, destination: { x: -7.4, y: -0.4, z: 28}  }),
  new Door(scene, world, { width: 2.5, height: 3, depth: 0.1, position: { x: -7.5, y: 0.8, z: 25 },visible: true, destination: { x: -7.4, y: -0.4, z: 21 }  }),
  new Door(scene, world, { width: 2.5, height: 3, depth: 0.1, position: { x: -12.5, y: 0.8, z: 75.5 },visible: true, destination: { x: -20, y: 1, z: 0 }  }),//Finish Line
  new Door(scene, world, { width: 0.1, height: 2, depth: 4.5, position: { x: -14.5, y: -0.4, z: 57 },visible: true, destination: { x: -17.5, y: -0.4, z: 57 }  }),
  new Door(scene, world, { width: 0.1, height: 2, depth: 4.5, position: { x: -16, y: -0.4, z: 57 },visible: true, destination: { x: -12.5, y: -0.4, z: 57 }  }),
  new Door(scene, world, { width: 2, height: 4, depth: 0, position: { x: -23, y: 1, z: 59 },visible: true, destination: { x: -23, y: 1, z: 64}  }),
  new Door(scene, world, { width: 2, height: 4, depth: 0, position: { x: -23, y: 1, z: 61 },visible: true, destination: { x: -23, y: 1, z: 57.5 }  }),
];

const pillars =[
  new RoomBoundary(scene, world, { width: 1, height: 6, depth: 1, boundaryThickness: 0.1, position: { x: -10.7, y: 1.5, z: 39 }, visible: false }),
  new RoomBoundary(scene, world, { width: 1, height: 6, depth: 1, boundaryThickness: 0.1, position: { x: -4.4, y: 1.5, z: 39 }, visible: false }),
  new RoomBoundary(scene, world, { width: 1, height: 6, depth: 1, boundaryThickness: 0.1, position: { x: -10.7, y: 1.5, z: 28.5 }, visible: false }),
  new RoomBoundary(scene, world, { width: 1, height: 6, depth: 1, boundaryThickness: 0.1, position: { x: -4.4, y: 1.5, z: 28.5}, visible: false }),
  new RoomBoundary(scene, world, { width: 1, height: 6, depth: 1, boundaryThickness: 0.1, position: { x: -10.7, y: 1.5, z: 49 }, visible: false }),
  new RoomBoundary(scene, world, { width: 1, height: 6, depth: 1, boundaryThickness: 0.1, position: { x: -4.4, y: 1.5, z: 49 }, visible: false}),
]
// Create the player cube
const cubeBody = new CANNON.Body({
  mass: 1,
  position: new CANNON.Vec3(-2, 5, 0),
  fixedRotation: true // Prevents rotation
});
const cubeShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
cubeBody.addShape(cubeShape);
world.addBody(cubeBody);

const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshStandardMaterial({ color: '#00ff00' });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.castShadow = true;
scene.add(cube);

// Lighting
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 20, 5);
light.castShadow = true;
scene.add(light);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Camera setup
camera.position.set(0, 1.5, 5);
const mouseCoordinates = new MouseCoordinates(camera, scene);
const movement = new Movement(cubeBody, world); // Pass the world to handle jumping logic

const assetSpawner = new AssetSpawner(scene, world);

// Function to save camera position and rotation
function saveCameraPosition() {
  const cameraData = {
    position: { x: camera.position.x, y: camera.position.y, z: camera.position.z },
    rotation: { x: camera.rotation.x, y: camera.rotation.y, z: camera.rotation.z }
  };
  localStorage.setItem('cameraPosition', JSON.stringify(cameraData));
}

// Function to load camera position and rotation
function loadCameraPosition() {
  const savedData = localStorage.getItem('cameraPosition');
  if (savedData) {
    const cameraData = JSON.parse(savedData);
    camera.position.set(cameraData.position.x, cameraData.position.y, cameraData.position.z);
    camera.rotation.set(cameraData.rotation.x, cameraData.rotation.y, cameraData.rotation.z);
  }
}

// Call this function when initializing your scene
loadCameraPosition();
window.addEventListener('beforeunload', saveCameraPosition);



// Animation loop
function animate() {
  requestAnimationFrame(animate);
  world.step(1 / 60);
  cubeBody.angularVelocity.set(0, 0, 0);

  // Handle movement
  movement.handleMovement();

  // Update cube position and rotation
  cube.position.copy(cubeBody.position);
  cube.quaternion.copy(cubeBody.quaternion);

  // Check if the player is near any door to pass through
  doors.forEach(door => {
    door.passThrough(cubeBody);  // Check with the player's position (cube position)
  });

  // Render the scene
  renderer.render(scene, camera);
}

animate();
