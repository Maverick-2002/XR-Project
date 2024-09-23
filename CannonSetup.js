import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as CANNON from 'cannon-es';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Movement } from './Movement.js';
import { AssetSpawner } from './AssetSpawner.js';
import { CameraCoordinates } from './CameraCoordinates.js';
import { MouseCoordinates } from './MouseCoordinates.js';
import { RoomBoundary } from './RoomBoundary.js'; // Adjust the path as needed

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

const world = new CANNON.World();
world.gravity.set(0, -9.82, 0);

const room1 = new RoomBoundary(scene, world, { width: 4, height: 5, depth: 20, boundaryThickness: 0.1, position: { x: -11, y: 0, z: -13 } });
const room2 = new RoomBoundary(scene, world, { width: 15, height: 5, depth: 25, boundaryThickness: 0.1, position: { x:-7.5, y:0, z:10 },visible:false });


const cubeBody = new CANNON.Body({
  mass: 1,
  position: new CANNON.Vec3(-2, 5, 0),
  angularVelocity: new CANNON.Vec3(0, 0, 0), // Set initial angular velocity to zero
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

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 20, 5);
light.castShadow = true;
scene.add(light);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

camera.position.set(0, 1.5, 5);
const mouseCoordinates = new MouseCoordinates(camera, scene);

const movement = new Movement(cubeBody);
const assetSpawner = new AssetSpawner(scene, world);
const cameraOffset = new THREE.Vector3(0, 1.5, 5); // Adjust this for desired offset
const cameraCoordinates = new CameraCoordinates(camera);

function animate() {
  requestAnimationFrame(animate);
  world.step(1 / 60);
  cubeBody.angularVelocity.set(0, 0, 0);
  
  // Handle movement
  movement.handleMovement();

  // Update cube position and rotation
  cube.position.copy(cubeBody.position);
  cube.quaternion.copy(cubeBody.quaternion);

  // Update camera position to follow the cube
  camera.position.copy(cube.position).add(cameraOffset);
  camera.lookAt(cube.position); // Make the camera look at the cube

  // Render the scene
  renderer.render(scene, camera);
  cameraCoordinates.update();
}

animate();