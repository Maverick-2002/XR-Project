import * as THREE from 'three';
import * as CANNON from 'cannon-es';

export class Door {
  constructor(scene, world, options) {
    this.scene = scene;
    this.world = world;
    this.options = options;
    this.destination = options.destination; 
    this.createDoor();
  }

  createDoor() {
    const { width, height, depth, position } = this.options;

  
    const doorGeometry = new THREE.BoxGeometry(width, height, depth);
    const doorMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 }); 
    this.doorMesh = new THREE.Mesh(doorGeometry, doorMaterial);
    this.doorMesh.position.set(position.x, position.y, position.z);
    this.scene.add(this.doorMesh);
    this.doorMesh.visible = false;

    
    this.doorBody = new CANNON.Body({ mass: 0 }); 
    const doorShape = new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2));
    this.doorBody.addShape(doorShape);
    this.doorBody.position.set(position.x, position.y, position.z);
    this.world.addBody(this.doorBody);
  }

  passThrough(player) {

    const playerPosition = player.position || (player.body && player.body.position);

   

    const distance = playerPosition.distanceTo(this.doorMesh.position);

    if (distance < 1.5) { 
      console.log('You passed through the door!');
      player.position.set(this.destination.x, this.destination.y, this.destination.z);
      if (player.body) {
        player.body.position.set(this.destination.x, this.destination.y, this.destination.z);
      }
    }
  }
}
