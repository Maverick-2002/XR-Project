import * as CANNON from 'cannon-es';
import { Vector3 } from 'three'; // Import Vector3 from Three.js

export class Movement {
  constructor(cubeBody, world, camera) {
    this.cubeBody = cubeBody;
    this.world = world;
    this.camera = camera;
    this.keys = {
      a: { pressed: false },
      d: { pressed: false },
      w: { pressed: false },
      s: { pressed: false },
      left: { pressed: false },
      space: { pressed: false },
    };
    this.isJumping = false;
    this.moveSpeed = 15;

    // Event listeners for keydown and keyup
    window.addEventListener('keydown', (event) => this.onKeyDown(event));
    window.addEventListener('keyup', (event) => this.onKeyUp(event));

    // Detect when cube is on the ground
    this.world.addEventListener('postStep', () => {
      this.checkIfGrounded();
    });
  }

  onKeyDown(event) {
    switch (event.code) {
      case 'KeyA':
        this.keys.a.pressed = true;
        break;
      case 'KeyD':
        this.keys.d.pressed = true;
        break;
      case 'KeyW':
        this.keys.w.pressed = true;
        break;
      case 'KeyS':
        this.keys.s.pressed = true;
        break;
      case 'ArrowLeft': // Log cube position when left arrow key is pressed
        console.log('Cube position:', this.cubeBody.position);
        this.keys.left.pressed = true;
        break;
      case 'Space': // Jump
        if (!this.isJumping) {
          this.isJumping = true;
          this.cubeBody.velocity.y = 10; // Apply vertical velocity for jump
        }
        break;
    }
  }

  onKeyUp(event) {
    switch (event.code) {
      case 'KeyA':
        this.keys.a.pressed = false;
        break;
      case 'KeyD':
        this.keys.d.pressed = false;
        break;
      case 'KeyW':
        this.keys.w.pressed = false;
        break;
      case 'KeyS':
        this.keys.s.pressed = false;
        break;
      case 'ArrowLeft':
        this.keys.left.pressed = false;
        break;
      case 'Space':
        this.keys.space.pressed = false;
        break;
    }
  }

  handleMovement() {
    const velocity = this.cubeBody.velocity;

    // Get the camera's forward direction as a normalized Vector3
    const forward = new Vector3();
    this.camera.getWorldDirection(forward);
    forward.normalize();

    // Calculate the desired movement direction based on WASD keys and camera forward
    const direction = new Vector3();
    if (this.keys.d.pressed) {
      direction.crossVectors(forward, this.camera.up); // Move right relative to camera (original)
    } else if (this.keys.a.pressed) {
      direction.crossVectors(forward, this.camera.up).negate(); // Move left relative to camera (invert)
    }

    if (this.keys.w.pressed) {
      direction.copy(forward); // Move forward relative to camera
    } else if (this.keys.s.pressed) {
      direction.copy(forward).negate(); // Move backward relative to camera
    }

    // Apply movement based on direction and speed
    velocity.x = direction.x * this.moveSpeed;
    velocity.z = direction.z * this.moveSpeed;
  }

  // Check if the player is grounded (same as before)
  checkIfGrounded() {
    const groundLevel = 0; // Adjust according to the actual ground level in your scene
    const velocityThreshold = 0.1; // Threshold to consider the player grounded

    // Consider grounded if near ground level and vertical velocity is close to zero
    if (this.cubeBody.position.y <= groundLevel + 0.5 && Math.abs(this.cubeBody.velocity.y) < velocityThreshold) {
      this.isJumping = false; // Reset jump when grounded
    }
  }
}