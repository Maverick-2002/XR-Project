import * as THREE from 'three'; // Import THREE
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as CANNON from 'cannon-es';

export class AssetSpawner {
  constructor(scene, world) {
    this.scene = scene;
    this.world = world; // Reference to the Cannon.js world
    this.loader = new GLTFLoader();
    this.assets = [
      {
        url: 'https://cdn.glitch.global/9840aa6a-2e73-4088-b83c-d68a4642d7be/low_poly_game_level.glb?v=1727015272543',
        scale: { x: 2, y: 2, z: 2 },
        position: { x: 0, y: 0, z: 0 }
      },
      // Add more assets here
    ];
    this.loadAssets();
  }

  loadAssets() {
    this.assets.forEach((asset) => {
      this.loader.load(asset.url, (gltf) => {
        const model = gltf.scene;
        model.scale.set(asset.scale.x, asset.scale.y, asset.scale.z);
        model.position.set(asset.position.x, asset.position.y, asset.position.z);
        this.scene.add(model);
        
        // Create a bounding box for the model
        const box = new THREE.Box3().setFromObject(model);
        
        // Get dimensions of the loaded asset
        const size = new THREE.Vector3();
        box.getSize(size);
        console.log('Width:', size.x, 'Height:', size.y, 'Depth:', size.z);
        
        // Create a Cannon body for the floor
        const floorBody = new CANNON.Body({ mass: 0 });
        const floorShape = new CANNON.Box(new CANNON.Vec3(size.x / 2, 0.1, size.z / 2)); // Adjust shape size as necessary
        floorBody.addShape(floorShape);
        
        // Position the floor body below the asset
        floorBody.position.set(-1,-1,-1);
        this.world.addBody(floorBody); // Add the body to the Cannon world

        // Create boundaries around the asset based on its size
        this.createBoundaries(size, asset.position);

      }, undefined, (error) => {
        console.error('Error loading asset:', error);
      });
    });
  }

  createBoundaries(size, position) {
    const boundaryThickness = 0.1; // Thickness of the walls
    const boundaryHeight = size.y; // Height of the boundary (can be adjusted)

    // Boundaries are placed around the asset
    const boundaries = [
      { position: new THREE.Vector3(position.x, position.y, position.z - size.z / 2 - boundaryThickness / 2), scale: [size.x, boundaryHeight, boundaryThickness] }, // Back wall
      { position: new THREE.Vector3(position.x, position.y, position.z + size.z / 2 + boundaryThickness / 2), scale: [size.x, boundaryHeight, boundaryThickness] }, // Front wall
      { position: new THREE.Vector3(position.x - size.x / 2 - boundaryThickness / 2, position.y, position.z), scale: [boundaryThickness, boundaryHeight, size.z] }, // Left wall
      { position: new THREE.Vector3(position.x + size.x / 2 + boundaryThickness / 2, position.y, position.z), scale: [boundaryThickness, boundaryHeight, size.z] }  // Right wall
    ];

    boundaries.forEach(boundary => {
      // Create Three.js mesh for visualization (optional, can be made invisible)
      const boundaryGeometry = new THREE.BoxGeometry(...boundary.scale);
      const boundaryMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000, wireframe: true }); // Red for visualization
      const boundaryMesh = new THREE.Mesh(boundaryGeometry, boundaryMaterial);
      boundaryMesh.position.copy(boundary.position);
      this.scene.add(boundaryMesh);

      // Create corresponding CANNON.js bodies for collision
      const boundaryBody = new CANNON.Body({ mass: 0 });
      const boundaryShape = new CANNON.Box(new CANNON.Vec3(boundary.scale[0] / 2, boundary.scale[1] / 2, boundary.scale[2] / 2)); // Half extents
      boundaryBody.addShape(boundaryShape);
      boundaryBody.position.set(boundary.position.x, boundary.position.y, boundary.position.z);
      this.world.addBody(boundaryBody);
    });
  }
}
