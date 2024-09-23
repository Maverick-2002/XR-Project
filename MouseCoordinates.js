import * as THREE from 'three';

export class MouseCoordinates {
  constructor(camera, scene) {
    this.camera = camera;
    this.scene = scene;

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    // Bind event listeners
    window.addEventListener('mousemove', this.onMouseMove.bind(this));
    window.addEventListener('mousedown', this.onMouseDown.bind(this));
    window.addEventListener('keydown', this.onKeyDown.bind(this));
  }

  onMouseMove(event) {
    // Normalize mouse coordinates to [-1, 1]
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  onMouseDown(event) {
    // Check for left mouse button click
    if (event.button === 0) { // 0 is the left mouse button
      this.logCoordinates();
    }
  }

  onKeyDown(event) {
    // Check if the "L" key is pressed
    if (event.key === 'l' || event.key === 'L') {
      this.logCoordinates();
    }
  }

  logCoordinates() {
    // Update the raycaster
    this.raycaster.setFromCamera(this.mouse, this.camera);

    // Check for intersections with objects in the scene
    const intersects = this.raycaster.intersectObjects(this.scene.children);

    if (intersects.length > 0) {
      // Get the first intersected object
      const intersectedObject = intersects[0];

      // Get the coordinates
      const coordinates = intersectedObject.point; // This is a Vector3

      console.log('Mouse coordinates in 3D:', coordinates);
    }
  }

  // Optional: Clean up event listeners
  dispose() {
    window.removeEventListener('mousemove', this.onMouseMove.bind(this));
    window.removeEventListener('mousedown', this.onMouseDown.bind(this));
    window.removeEventListener('keydown', this.onKeyDown.bind(this));
  }
}
