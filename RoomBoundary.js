import * as THREE from 'three';
import * as CANNON from 'cannon-es';

export class RoomBoundary {
  constructor(scene, world, options = {}) {
    this.scene = scene;
    this.world = world;

    // Default options for room dimensions and boundary thickness
    this.options = {
      width: options.width || 10,
      height: options.height || 5,
      depth: options.depth || 10,
      boundaryThickness: options.boundaryThickness || 0.1,
      position: options.position || { x: 0, y: 0, z: 0 },
      visible: options.visible !== undefined ? options.visible : true // Set visibility option
    };

    this.boundaries = [];
    this.createBoundaries();
  }

  createBoundaries() {
    const { width, height, depth, boundaryThickness, position } = this.options;

    // Define the positions of the walls
    const wallPositions = [
      { position: new THREE.Vector3(position.x, position.y, position.z - depth / 2 - boundaryThickness / 2), scale: [width, height, boundaryThickness] }, // Back wall
      { position: new THREE.Vector3(position.x, position.y, position.z + depth / 2 + boundaryThickness / 2), scale: [width, height, boundaryThickness] }, // Front wall
      { position: new THREE.Vector3(position.x - width / 2 - boundaryThickness / 2, position.y, position.z), scale: [boundaryThickness, height, depth] }, // Left wall
      { position: new THREE.Vector3(position.x + width / 2 + boundaryThickness / 2, position.y, position.z), scale: [boundaryThickness, height, depth] }  // Right wall
    ];

    wallPositions.forEach(wall => {
      this.createWall(wall.position, wall.scale);
    });
  }

  createWall(position, scale) {
    // Create Three.js mesh for the wall
    const wallGeometry = new THREE.BoxGeometry(...scale);
    const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00, wireframe: true }); // Green for visualization
    const wallMesh = new THREE.Mesh(wallGeometry, wallMaterial);
    wallMesh.position.copy(position);
    wallMesh.visible = this.options.visible; // Set visibility based on options
    this.scene.add(wallMesh);

    // Create corresponding CANNON.js body for collision
    const wallBody = new CANNON.Body({ mass: 0 });
    const wallShape = new CANNON.Box(new CANNON.Vec3(scale[0] / 2, scale[1] / 2, scale[2] / 2)); // Half extents
    wallBody.addShape(wallShape);
    wallBody.position.set(position.x, position.y, position.z);
    this.world.addBody(wallBody);

    // Store boundary info
    this.boundaries.push({ mesh: wallMesh, body: wallBody });
  }

  // Optional: Method to move the entire room boundary
  moveBoundaries(offset) {
    this.boundaries.forEach(({ mesh, body }) => {
      mesh.position.add(offset);
      body.position.vadd(new CANNON.Vec3(offset.x, offset.y, offset.z), body.position);
    });
  }
}
