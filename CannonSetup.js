import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as CANNON from 'cannon-es';
import { Movement } from './Movement.js';
import { AssetSpawner } from './AssetSpawner.js';
import { MouseCoordinates } from './MouseCoordinates.js';
import { RoomBoundary } from './RoomBoundary.js';
import { Door } from './Door.js';
import { Maze } from './Maze.js';
import { GameManager } from './GameManager.js';
import { Shooting } from './Shooting.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1.5, 5);
const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const minimapRenderer = new THREE.WebGLRenderer();
minimapRenderer.setSize(180, 180); // Set size for minimap
minimapRenderer.domElement.style.position = 'absolute';
minimapRenderer.domElement.style.top = '10px'; // Position it on top left corner
minimapRenderer.domElement.style.right = '10px'; // Position it on top right corner
document.body.appendChild(minimapRenderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

const world = new CANNON.World();
world.gravity.set(0, -9.82, 0);

// Create room boundaries
const rooms = [
    new RoomBoundary(scene, world, { width: 4, height: 5, depth: 35, boundaryThickness: 0.1, position: { x: -11, y: 1, z: -21 }, visible: false }),
    new RoomBoundary(scene, world, { width: 15, height: 5, depth: 25, boundaryThickness: 0.1, position: { x: -7.5, y: 1, z: 10 }, visible: false }),
    new RoomBoundary(scene, world, { width: 15, height: 5, depth: 35, boundaryThickness: 0.1, position: { x: -7.5, y: 1, z: 42 }, visible: false }),
    new RoomBoundary(scene, world, { width: 10, height: 5, depth: 5, boundaryThickness: 0.1, position: { x: -20.5, y: 1, z: 57 }, visible: false }),
    new RoomBoundary(scene, world, { width: 20, height: 5, depth: 15, boundaryThickness: 0.1, position: { x: -15.5, y: 1, z: 68 }, visible: false }),
];

// Create multiple doors
const doors = [
    new Door(scene, world, { width: 2.5, height: 3, depth: 0.1, position: { x: -11.5, y: 0.8, z: -2 }, destination: { x: -11.6, y: -0.4, z: -5 } }),
    new Door(scene, world, { width: 2.5, height: 3, depth: 0.1, position: { x: -11.5, y: 0.8, z: -4 }, destination: { x: -11.6, y: -0.4, z: -1 } }),
    new Door(scene, world, { width: 2.5, height: 3, depth: 0.1, position: { x: -7.5, y: 0.8, z: 22.5 }, destination: { x: -7.4, y: -0.4, z: 28 } }),
    new Door(scene, world, { width: 2.5, height: 3, depth: 0.1, position: { x: -7.5, y: 0.8, z: 25 }, destination: { x: -7.4, y: -0.4, z: 21 } }),
    new Door(scene, world, { width: 2.5, height: 3, depth: 0.1, position: { x: -12.5, y: 0.8, z: 75.5 }, destination: { x: -12.5, y: 0.8, z: 78.5 } }),
    new Door(scene, world, { width: 0.1, height: 2, depth: 4.5, position: { x: -14.5, y: -0.4, z: 57 }, destination: { x: -17.5, y: -0.4, z: 57 } }),
    new Door(scene, world, { width: 0.1, height: 2, depth: 4.5, position: { x: -16, y: -0.4, z: 57 }, destination: { x: -12.5, y: -0.4, z: 57 } }),
    new Door(scene, world, { width: 2, height: 4, depth: 0, position: { x: -23, y: 1, z: 59 }, destination: { x: -23, y: 1, z: 64 } }),
    new Door(scene, world, { width: 2, height: 4, depth: 0, position: { x: -23, y: 1, z: 61 }, destination: { x: -23, y: 1, z: 57.5 } }),
];

const pillars = [
    new RoomBoundary(scene, world, { width: 1, height: 6, depth: 1, boundaryThickness: 0.1, position: { x: -10.7, y: 1.5, z: 39 }, visible: false }),
    new RoomBoundary(scene, world, { width: 1, height: 6, depth: 1, boundaryThickness: 0.1, position: { x: -4.4, y: 1.5, z: 39 }, visible: false }),
    new RoomBoundary(scene, world, { width: 1, height: 6, depth: 1, boundaryThickness: 0.1, position: { x: -10.7, y: 1.5, z: 28.5 }, visible: false }),
    new RoomBoundary(scene, world, { width: 1, height: 6, depth: 1, boundaryThickness: 0.1, position: { x: -4.4, y: 1.5, z: 28.5 }, visible: false }),
    new RoomBoundary(scene, world, { width: 1, height: 6, depth: 1, boundaryThickness: 0.1, position: { x: -10.7, y: 1.5, z: 49 }, visible: false }),
    new RoomBoundary(scene, world, { width: 1, height: 6, depth: 1, boundaryThickness: 0.1, position: { x: -4.4, y: 1.5, z: 49 }, visible: false }),
];

// Create the player cube
const cubeBody = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(-11.5, -0.4, -26),
    fixedRotation: true // Prevents rotation
});
const cubeShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
cubeBody.addShape(cubeShape);
world.addBody(cubeBody);

const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshStandardMaterial({ color: '#00ff00' });
// Set cube visible to false
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.visible = true;  // Make the cube invisible
cube.castShadow = true;
scene.add(cube);

// Lighting
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 20, 5);
light.castShadow = true;
scene.add(light);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);



const minimapCamera = new THREE.OrthographicCamera(
    -20, 20, 20, -20, 0.1, 1000 // Adjust the view size to fit the maze
);
minimapCamera.position.set(10, 50, 10); // High above the maze
minimapCamera.lookAt(10, 0, 10); // Pointing downwards at the maze



// Rotate the camera to look back 180 degrees around the Y-axis
camera.rotation.y = Math.PI; // 180 degrees in radians
const mouseCoordinates = new MouseCoordinates(camera, scene);
// Assuming you have a camera object named 'camera' defined somewhere
const movement = new Movement(cubeBody, world, camera); // Pass the world to handle jumping logic
const maze = new Maze(scene, world, { x: -13.5, y: -2, z: 38 }, 2.5, 6);
const assetSpawner = new AssetSpawner(scene, world);
const gameManager = new GameManager(scene, camera, world, renderer);
let isGameRunning = false;
const shooting = new Shooting(scene, world, cubeBody, camera, renderer.domElement); // Pass the camera here

gameManager.onStart = function() {
    isGameRunning = true; // Set the game running flag
    animate(); // Start the animation loop
};

gameManager.onReset = function() {
    console.log("Game reset!");

    // Reset player position
    cubeBody.position.set(-11.5, -0.4, -26);
    cubeBody.velocity.set(0, 0, 0);
    cubeBody.angularVelocity.set(0, 0, 0);
};

function showEndScene() {
    console.log("Game Over! You've reached the end!");
    isGameRunning = false; // Stop the game loop

    // Display end message
    const endMessage = document.createElement('div');
    endMessage.style.position = 'absolute';
    endMessage.style.width = '100%';
    endMessage.style.textAlign = 'center';
    endMessage.style.top = '50%';
    endMessage.style.transform = 'translateY(-50%)';
    endMessage.style.color = 'white';
    endMessage.style.fontSize = '48px';
    endMessage.innerHTML = "Congratulations! You've reached the end!";
    document.body.appendChild(endMessage);
}

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
    
    // Check if the cube has reached the end position
    if (cube.position.z > 75.5) {
        showEndScene(); // Call the end scene function
        return; // Exit the animate loop
    }

    // Follow the cube with the camera
    camera.position.set(cube.position.x, cube.position.y + 1.5, cube.position.z);

    // Check if the player is near any door to pass through
    doors.forEach(door => {
        door.passThrough(cubeBody);  // Check with the cube body
    });
    
    renderer.render(scene, camera);
    minimapRenderer.render(scene, minimapCamera);
 


    shooting.updateProjectiles(); // Update projectiles
    shooting.checkCollisions(); 
}

// Start the game when ready
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space' && !isGameRunning) {
        gameManager.start(); // Call start method
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});
