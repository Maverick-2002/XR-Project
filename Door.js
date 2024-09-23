import * as THREE from 'three';
import * as CANNON from 'cannon-es';

export class Door {
  constructor(scene, world, options) {
    this.scene = scene;
    this.world = world;
    this.options = options;

    this.isOpen = options.visible || false; // Set initial open state based on the visible argument
    this.destination = options.destination; // Position to teleport to
    this.createDoor();
  }

  createDoor() {
    const { width, height, depth, position } = this.options;

    // Create Three.js mesh for the door
    const doorGeometry = new THREE.BoxGeometry(width, height, depth);
    const doorMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 }); // Brown for door
    this.doorMesh = new THREE.Mesh(doorGeometry, doorMaterial);
    this.doorMesh.position.set(position.x, position.y, position.z);
    this.doorMesh.visible = this.isOpen; // Set initial visibility based on isOpen
    this.scene.add(this.doorMesh);

    // Create corresponding CANNON.js body for collision
    this.doorBody = new CANNON.Body({ mass: 0 }); // Static body
    const doorShape = new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2));
    this.doorBody.addShape(doorShape);
    this.doorBody.position.set(position.x, position.y, position.z);
    this.world.addBody(this.doorBody);
  }

  toggle() {
    this.isOpen = !this.isOpen;
    this.doorMesh.visible = this.isOpen; // Toggle visibility as a simple open/close action
  }

  passThrough(player) {
    // Ensure player has the expected properties
    const playerPosition = player.position || (player.body && player.body.position);
    
    if (!playerPosition) {
      console.error('Player does not have a valid position');
      return;
    }

    const distance = playerPosition.distanceTo(this.doorMesh.position);
    
    if (this.isOpen && distance < 1.5) { // Adjust distance as needed
      console.log('You passed through the door!');
      // Teleport the player to the destination
      player.position.set(this.destination.x, this.destination.y, this.destination.z);
      // Optional: Update player body position if using physics
      if (player.body) {
        player.body.position.set(this.destination.x, this.destination.y, this.destination.z);
      }
    } else if (!this.isOpen) {
      console.log('The door is closed!');
    }
  }
}
