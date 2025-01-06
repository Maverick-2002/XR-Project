import * as CANNON from 'cannon-es';
import { Vector3 } from 'three'; 

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

  
    window.addEventListener('keydown', (event) => this.onKeyDown(event));
    window.addEventListener('keyup', (event) => this.onKeyUp(event));

  
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
      case 'ArrowLeft': 
        console.log('Cube position:', this.cubeBody.position);
        this.keys.left.pressed = true;
        break;
      case 'Space': 
        if (!this.isJumping) {
          this.isJumping = true;
          this.cubeBody.velocity.y = 8; 
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

    
    const forward = new Vector3();
    this.camera.getWorldDirection(forward);
    forward.normalize();

  
    const direction = new Vector3();
    if (this.keys.d.pressed) {
      direction.crossVectors(forward, this.camera.up); 
    } else if (this.keys.a.pressed) {
      direction.crossVectors(forward, this.camera.up).negate(); 
    }

    if (this.keys.w.pressed) {
      direction.copy(forward); 
    } else if (this.keys.s.pressed) {
      direction.copy(forward).negate();
    }


    velocity.x = direction.x * this.moveSpeed;
    velocity.z = direction.z * this.moveSpeed;
  }


  checkIfGrounded() {
    const groundLevel = 0; 
    const velocityThreshold = 0.1;

    if (this.cubeBody.position.y <= groundLevel + 0.5 && Math.abs(this.cubeBody.velocity.y) < velocityThreshold) {
      this.isJumping = false;
    }
  }
}