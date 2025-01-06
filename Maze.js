import * as THREE from 'three';
import * as CANNON from 'cannon-es'; 

export class Maze {
  constructor(scene, world, position = { x: 0, y: 0, z: 0 }, wallSize = 2.5, wallHeight = 5) {
    this.scene = scene;
    this.world = world; 
    this.position = position; 
    this.wallSize = wallSize;
    this.wallHeight = wallHeight; 
    this.mazeData = [
      [1, 1, 1, 1, 1, 0],
      [1, 1, 0, 0, 0, 0],
      [1, 0, 0, 1, 1, 0],
      [1, 0, 1, 0, 0, 0],
      [0, 0, 0, 1, 0, 1],
      [1, 1, 0, 1, 1, 1]
    ]; 

    this.textureLoader = new THREE.TextureLoader();
    this.wallTexture = this.textureLoader.load('https://cdn.glitch.global/9840aa6a-2e73-4088-b83c-d68a4642d7be/Screenshot%202024-09-25%20134211.png?v=1727251984445', (texture) => {

      texture.wrapS = THREE.RepeatWrapping;  // Wrap horizontally
      texture.wrapT = THREE.RepeatWrapping;  // Wrap vertically
      texture.repeat.set(this.wallSize / 2, this.wallHeight / 2); 
    });

    this.createMaze();
  }

  createMaze() {
  
    const wallGeometry = new THREE.BoxGeometry(this.wallSize, this.wallHeight, this.wallSize);
    const wallMaterial = new THREE.MeshStandardMaterial({ map: this.wallTexture }); 

    for (let row = 0; row < this.mazeData.length; row++) {
      for (let col = 0; col < this.mazeData[row].length; col++) {
        if (this.mazeData[row][col] === 1) {
          const wall = new THREE.Mesh(wallGeometry, wallMaterial);
          wall.position.set(
            col * this.wallSize + this.position.x,
            this.wallHeight / 2 + this.position.y,
            row * this.wallSize + this.position.z
          );
          wall.castShadow = true;
          this.scene.add(wall);
          const wallShape = new CANNON.Box(new CANNON.Vec3(this.wallSize / 2, this.wallHeight / 2, this.wallSize / 2));
          const wallBody = new CANNON.Body({ mass: 0 }); 
          wallBody.addShape(wallShape);
          wallBody.position.set(
            col * this.wallSize + this.position.x,
            this.wallHeight / 2 + this.position.y,
            row * this.wallSize + this.position.z
          );
          this.world.addBody(wallBody); 
        }
      }
    }
  }
}
