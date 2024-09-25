import * as THREE from 'three';
import * as CANNON from 'cannon-es'; // Import Cannon.js

export class Maze {
  constructor(scene, world, position = { x: 0, y: 0, z: 0 }, wallSize = 2.5, wallHeight = 5) {
    this.scene = scene;
    this.world = world; // Pass in the Cannon.js world
    this.position = position; // Position where the maze will start
    this.wallSize = wallSize; // Size of each wall unit (scaled down)
    this.wallHeight = wallHeight; // Height of the walls
    this.mazeData = [
      [1, 1, 1, 1, 1, 0],
      [1, 1, 0, 0, 0, 0],
      [1, 0, 0, 1, 1, 0],
      [1, 0, 1, 0, 0, 0],
      [0, 0, 0, 1, 0, 1],
      [1, 1, 0, 1, 1, 1]
    ]; // 6x6 maze layout
    this.createMaze();
  }

  createMaze() {
    // Create Three.js wall geometry and material
    const wallGeometry = new THREE.BoxGeometry(this.wallSize, this.wallHeight, this.wallSize);
    const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x3f8729 });

    for (let row = 0; row < this.mazeData.length; row++) {
      for (let col = 0; col < this.mazeData[row].length; col++) {
        if (this.mazeData[row][col] === 1) {
          // Create the Three.js wall mesh
          const wall = new THREE.Mesh(wallGeometry, wallMaterial);
          wall.position.set(
            col * this.wallSize + this.position.x,
            this.wallHeight / 2 + this.position.y,
            row * this.wallSize + this.position.z
          );
          wall.castShadow = true;
          this.scene.add(wall);

          // Create the corresponding Cannon.js body for the wall
          const wallShape = new CANNON.Box(new CANNON.Vec3(this.wallSize / 2, this.wallHeight / 2, this.wallSize / 2));
          const wallBody = new CANNON.Body({ mass: 0 }); // Static body (mass 0)
          wallBody.addShape(wallShape);
          wallBody.position.set(
            col * this.wallSize + this.position.x,
            this.wallHeight / 2 + this.position.y,
            row * this.wallSize + this.position.z
          );
          this.world.addBody(wallBody); // Add wall to Cannon.js world
        }
      }
    }
  }
}
