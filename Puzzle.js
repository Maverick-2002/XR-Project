import * as THREE from 'three';

export class Puzzle {
  constructor(scene, textureURL, position = { x: -7, y: 2, z: 8 }, gap = 0.25, camera, timerUI) {
    this.scene = scene;
    this.textureURL = textureURL;
    this.tiles = [];
    this.position = position;
    this.gap = gap;
    this.camera = camera;
    this.line = null;
    this.selectedTileIndex = null;
    this.timerUI = timerUI;

    // Raycaster and mouse vector for interaction
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    // Add event listener for right-click
    window.addEventListener('contextmenu', this.onMouseRightClick.bind(this), false);

    // Create puzzle grid
    this.createPuzzle().then(() => {
      // Start the memory game after the puzzle is created
      this.startMemoryGame();
    });
  }

  async createPuzzle() {
    const texture = await this.loadTexture(this.textureURL);
    const tileSize = 2; // Size of each tile
    const tileGeometry = new THREE.PlaneGeometry(tileSize, tileSize);

    // Create a 3x3 grid of tiles
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const tileMaterial = new THREE.MeshBasicMaterial({
          color: 0xff0000, // Default red color for all tiles
          side: THREE.DoubleSide, // Render on both sides
        });

        const tile = new THREE.Mesh(tileGeometry, tileMaterial);
        tile.position.set(
          col * (tileSize + this.gap) - (tileSize + this.gap) + this.position.x,
          row * (tileSize + this.gap) - (tileSize + this.gap) + this.position.y,
          this.position.z + 0.1
        );

        this.scene.add(tile);
        this.tiles.push(tile);
      }
    }

    // Select a random tile to apply the puzzle texture
    const randomTileIndex = Math.floor(Math.random() * this.tiles.length);
    const puzzleTileMaterial = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });
    this.tiles[randomTileIndex].material = puzzleTileMaterial; // Set the puzzle texture on the random tile
    this.selectedTileIndex = randomTileIndex;
  }

  async loadTexture(url) {
    return new Promise((resolve) => {
      const textureLoader = new THREE.TextureLoader();
      textureLoader.load(url, (texture) => {
        resolve(texture);
      });
    });
  }

  startMemoryGame() {
    // Show the texture on the selected tile
    this.tiles[this.selectedTileIndex].visible = true;

    // Start the 10-second timer
    if (this.timerUI && this.timerUI.startTimer) {
      this.timerUI.startTimer(10, () => {
        // Hide the puzzle tile after 10 seconds
        this.tiles[this.selectedTileIndex].visible = false;

        // Start another 10-second timer for the player to find the correct tile
        this.timerUI.startTimer(10, () => {
          console.log("Time's up! The puzzle tile was not found.");
        });
      });
    } else {
      console.error("Timer UI or startTimer method is not defined.");
    }
  }

  onMouseRightClick(event) {
    event.preventDefault();

    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.tiles);

    this.showRaycastLine();

    if (intersects.length > 0) {
      const selectedTile = intersects[0].object;
      const selectedTileIndex = this.tiles.indexOf(selectedTile);

      // Check if the player selected the correct tile during the memory game
      if (selectedTileIndex === this.selectedTileIndex) {
        console.log("Puzzle tile found!");
      }
    }
  }

  // Function to visualize the raycast line
  showRaycastLine() {
    if (this.line) {
      this.scene.remove(this.line);
    }

    const rayStart = this.camera.position.clone();
    const rayDirection = this.raycaster.ray.direction.clone().normalize();
    const rayEnd = rayStart.clone().add(rayDirection.multiplyScalar(100));

    const points = [rayStart, rayEnd];
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 5 });

    this.line = new THREE.Line(geometry, material);
    this.scene.add(this.line);
  }
}
