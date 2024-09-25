export class GameManager {
    constructor() {
        this.gameOver = false;
        this.startScreen = document.getElementById('start-screen');
        this.endScreen = document.getElementById('end-screen');
        this.startButton = document.getElementById('start-button');
        this.resetButton = document.getElementById('reset-button');

        // Bind the start and reset button events
        this.startButton.addEventListener('click', () => this.startGame());
        this.resetButton.addEventListener('click', () => this.resetGame());

        // Show the start screen at the beginning
        this.showStartScreen();
    }

    showStartScreen() {
        this.startScreen.style.display = 'flex';
        this.endScreen.style.display = 'none';
    }

    startGame() {
        this.startScreen.style.display = 'none';
        this.endScreen.style.display = 'none';
        this.gameOver = false;
        

        // Call an external function to actually start the game
        if (typeof this.onStart === 'function') {
            this.onStart(); // Notify when the game should start
        }
    }

    resetGame() {
        this.endScreen.style.display = 'none';
        this.gameOver = false;
        isGameRunning = false;

        // Call an external function to reset the game
        if (typeof this.onReset === 'function') {
            this.onReset(); // Notify when the game should reset
        }
    }

    showEndScreen() {
        this.endScreen.style.display = 'flex';
        this.gameOver = true;
    }
}
function checkGameOver(cubeBody) {
    const endCoordinates = new CANNON.Vec3(-12.5, 0.8, 75.5); // The target coordinates
    const distanceThreshold = 1; // Allowable distance to trigger the end condition

    // Calculate the distance between the player and the end coordinates
    const distance = endCoordinates.distanceTo(cubeBody.position);
    
    // Check if the player is within the threshold distance
    if (distance < distanceThreshold) {
        console.log("Game Over!");
        this.showEndScreen(); // Show end screen when the game is over
    }
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    if (isGameRunning) { // Check if the game is running
        world.step(1 / 60);
        cubeBody.angularVelocity.set(0, 0, 0);
    
        // Handle movement
        movement.handleMovement();
    
        // Update cube position and rotation
        cube.position.copy(cubeBody.position);
        cube.quaternion.copy(cubeBody.quaternion);
        
        // Follow the cube with the camera
        camera.position.set(cube.position.x, cube.position.y + 1.5, cube.position.z);
    
        // Check if the player is near any door to pass through
        doors.forEach(door => {
            door.passThrough(cubeBody);  // Check with the cube body
        });
        
        // Check for game over condition
        gameManager.checkGameOver(cubeBody); // Pass the cube body to check position
    }

    // Render the scene
    renderer.render(scene, camera);
}


