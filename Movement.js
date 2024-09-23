import * as CANNON from 'cannon-es';

export class Movement {
  constructor(cubeBody, world) {
    this.cubeBody = cubeBody;
    this.world = world;
    this.keys = {
      a: { pressed: false },
      d: { pressed: false },
      w: { pressed: false },
      s: { pressed: false },
      left: { pressed: false },
      space: { pressed: false },
    };
    this.isJumping = false;

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
    const moveSpeed = 20;
    const velocity = this.cubeBody.velocity;

    // Horizontal movement (A and D keys)
    if (this.keys.a.pressed) {
      velocity.x = -moveSpeed;
    } else if (this.keys.d.pressed) {
      velocity.x = moveSpeed;
    } else {
      velocity.x = 0;
    }

    // Forward/Backward movement (W and S keys)
    if (this.keys.w.pressed) {
      velocity.z = -moveSpeed;
    } else if (this.keys.s.pressed) {
      velocity.z = moveSpeed;
    } else {
      velocity.z = 0;
    }
  }

  // Check if the player is grounded
  checkIfGrounded() {
    const groundLevel = 0; // Adjust according to the actual ground level in your scene
    const velocityThreshold = 0.1; // Threshold to consider the player grounded

    // Consider grounded if near ground level and vertical velocity is close to zero
    if (this.cubeBody.position.y <= groundLevel + 0.5 && Math.abs(this.cubeBody.velocity.y) < velocityThreshold) {
      this.isJumping = false; // Reset jump when grounded
    }
  }
}
