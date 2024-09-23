import * as THREE from 'three'; // Import THREE
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as CANNON from 'cannon-es';

export class AssetSpawner {
  constructor(scene, world, options = {}) {
    this.scene = scene;
    this.world = world; // Reference to the Cannon.js world
    this.loader = new GLTFLoader();
    this.boundaries = []; // Store boundaries for movement

    // Default values for asset size and boundary options, can be overridden via options
    this.assetDimensions = options.assetDimensions || { width: 15, height: 5, depth: 25 };
    this.boundaryOptions = options.boundaryOptions || { thickness: 0.1, height: this.assetDimensions.height };

    // Asset details
    this.assets = [
      {
        url: 'https://cdn.glitch.global/9840aa6a-2e73-4088-b83c-d68a4642d7be/low_poly_game_level.glb?v=1727015272543',
        scale: { x: 2, y: 2, z: 2 },
        position: { x: 0, y: 0, z: 0 }
      },
      // Add more assets here if needed
    ];

    // Load assets and setup the boundaries
    this.loadAssets();
  }

  loadAssets() {
    this.assets.forEach((asset) => {
      this.loader.load(asset.url, (gltf) => {
        const model = gltf.scene;
        model.scale.set(asset.scale.x, asset.scale.y, asset.scale.z);
        model.position.set(asset.position.x, asset.position.y, asset.position.z);
        this.scene.add(model);

        
        const box = new THREE.Box3().setFromObject(model);
        // Get dimensions of the loaded asset
        const size2 = new THREE.Vector3();
        box.getSize(size2);
        // Create a Cannon body for the floor
        const floorBody = new CANNON.Body({ mass: 0 });
        const floorShape = new CANNON.Box(new CANNON.Vec3(size2.x / 2, 0.1, size2.z / 2)); // Adjust shape size as necessary
        floorBody.addShape(floorShape);

        // Position the floor body under the asset
        floorBody.position.set(-1,-1,-1);
        this.world.addBody(floorBody); // Add the body to the Cannon world

         // Create a bounding box for the model (adjustable size based on user input)
         const size = new THREE.Vector3(this.assetDimensions.width, this.assetDimensions.height, this.assetDimensions.depth);
         console.log('Width:', size.x, 'Height:', size.y, 'Depth:', size.z);
 
        // Create boundaries around the asset based on its size
        this.createBoundaries(size, asset.position);

        // Move boundaries to the left after loading
        this.moveBoundaries(new THREE.Vector3(-7.5, 0, 10)); // Move 1 unit to the left

      }, undefined, (error) => {
        console.error('Error loading asset:', error);
      });
    });
  }

  createBoundaries(size, position) {
    const boundaryThickness = this.boundaryOptions.thickness; // Thickness of the walls
    const boundaryHeight = this.boundaryOptions.height; // Height of the boundary

    // Boundaries are placed around the asset using user-provided dimensions
    const boundaries = [
      { position: new THREE.Vector3(position.x, position.y, position.z - size.z / 2 - boundaryThickness / 2), scale: [size.x, boundaryHeight, boundaryThickness] }, // Back wall
      { position: new THREE.Vector3(position.x, position.y, position.z + size.z / 2 + boundaryThickness / 2), scale: [size.x, boundaryHeight, boundaryThickness] }, // Front wall
      { position: new THREE.Vector3(position.x - size.x / 2 - boundaryThickness / 2, position.y, position.z), scale: [boundaryThickness, boundaryHeight, size.z] }, // Left wall
      { position: new THREE.Vector3(position.x + size.x / 2 + boundaryThickness / 2, position.y, position.z), scale: [boundaryThickness, boundaryHeight, size.z] }  // Right wall
    ];

    boundaries.forEach(boundary => {
      // Create Three.js mesh for visualization (optional, can be made invisible)
      const boundaryGeometry = new THREE.BoxGeometry(...boundary.scale);
      const boundaryMaterial = new THREE.MeshStandardMaterial({ wireframe: true }); // Red for visualization
      const boundaryMesh = new THREE.Mesh(boundaryGeometry, boundaryMaterial);
      boundaryMesh.position.copy(boundary.position);
      this.scene.add(boundaryMesh);
      boundaryMesh.visible = false;

      // Create corresponding CANNON.js bodies for collision
      const boundaryBody = new CANNON.Body({ mass: 0 });
      const boundaryShape = new CANNON.Box(new CANNON.Vec3(boundary.scale[0] / 2, boundary.scale[1] / 2, boundary.scale[2] / 2)); // Half extents
      boundaryBody.addShape(boundaryShape);
      boundaryBody.position.set(boundary.position.x, boundary.position.y, boundary.position.z);
      this.world.addBody(boundaryBody);

      // Store the boundary for movement
      this.boundaries.push({ mesh: boundaryMesh, body: boundaryBody });
    });
  }

  moveBoundaries(offset) {
    // Move all boundaries by the given offset (a THREE.Vector3)
    this.boundaries.forEach(({ mesh, body }) => {
      // Move the Three.js mesh
      mesh.position.add(offset);
      console.log("Boundary Pos:"+ mesh.position.y)

      // Move the CANNON.js body
      body.position.vadd(new CANNON.Vec3(offset.x, offset.y, offset.z), body.position);
    });
  }
}
