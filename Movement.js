import * as CANNON from 'cannon-es';

export class Movement {
  constructor(cubeBody) {
    this.cubeBody = cubeBody;
    this.keys = {
      a: { pressed: false },
      d: { pressed: false },
      w: { pressed: false },
      s: { pressed: false },
      left: { pressed: false }
    };

    // Event listeners for keydown and keyup
    window.addEventListener('keydown', (event) => this.onKeyDown(event));
    window.addEventListener('keyup', (event) => this.onKeyUp(event));
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
}
