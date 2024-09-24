import * as THREE from 'three';

export class Puzzle {
  constructor(scene, textureURL, position = { x: -7, y: 2, z: 8 }, gap = 0.25, camera) {
    this.scene = scene;
    this.textureURL = textureURL;
    this.tiles = [];
    this.position = position; // Set the position
    this.gap = gap; // Set the gap
    this.emptyTileIndex = 8; // Initially, the last tile is empty
    this.camera = camera; // Camera used for raycasting
    this.line = null; // Line to visualize the ray

    // Raycaster and mouse vector for interaction
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    // Add event listener for right-click
    window.addEventListener('contextmenu', this.onMouseRightClick.bind(this), false);

    // Create puzzle grid
    this.createPuzzle();
  }

  async createPuzzle() {
    const texture = await this.loadTexture(this.textureURL);
    const tileSize = 2; // Size of each tile
    const tileGeometry = new THREE.PlaneGeometry(tileSize, tileSize);

    // Create a 3x3 grid of tiles
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const tileMaterial = new THREE.MeshBasicMaterial({
          map: this.createTileTexture(texture, col, row),
          side: THREE.DoubleSide, // Make sure the texture is rendered on both sides
        });

        const tile = new THREE.Mesh(tileGeometry, tileMaterial);
        tile.position.set(
          col * (tileSize + this.gap) - (tileSize + this.gap) + this.position.x, // Adjust position with gap
          row * (tileSize + this.gap) - (tileSize + this.gap) + this.position.y, // Adjust position with gap
          this.position.z + 0.1 // Ensure it's above the ground
        );

        this.scene.add(tile);
        this.tiles.push(tile);
      }
    }

    // Set the last tile as the empty tile
    this.tiles[this.emptyTileIndex].visible = false; // Hide the empty tile
  }

  async loadTexture(url) {
    return new Promise((resolve) => {
      const textureLoader = new THREE.TextureLoader();
      textureLoader.load(url, (texture) => {
        resolve(texture);
      });
    });
  }

  createTileTexture(originalTexture, col, row) {
    const tileWidth = 1 / 3; // Each tile takes 1/3 of the texture width
    const tileHeight = 1 / 3; // Each tile takes 1/3 of the texture height

    const tileTexture = originalTexture.clone();
    tileTexture.repeat.set(tileWidth, tileHeight);
    tileTexture.offset.set(col * tileWidth, row * tileHeight);
    tileTexture.needsUpdate = true; // Notify Three.js that the texture needs to be updated

    return tileTexture;
  }

  onMouseRightClick(event) {
    // Prevent the default context menu from showing up on right-click
    event.preventDefault();

    // Convert mouse click to normalized device coordinates
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Set the raycaster
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.tiles);

    // Visualize raycast with a line
    this.showRaycastLine();

    if (intersects.length > 0) {
      const selectedTile = intersects[0].object;
      const selectedTileIndex = this.tiles.indexOf(selectedTile);

      // Check if the selected tile is adjacent to the empty tile
      if (this.isAdjacent(selectedTileIndex, this.emptyTileIndex)) {
        this.swapTiles(selectedTileIndex, this.emptyTileIndex);
        this.emptyTileIndex = selectedTileIndex; // Update the empty tile index
      }
    }
  }

  isAdjacent(tileIndex1, tileIndex2) {
    const row1 = Math.floor(tileIndex1 / 3);
    const col1 = tileIndex1 % 3;
    const row2 = Math.floor(tileIndex2 / 3);
    const col2 = tileIndex2 % 3;

    // Check if the tiles are adjacent
    return (
      (Math.abs(row1 - row2) === 1 && col1 === col2) || 
      (Math.abs(col1 - col2) === 1 && row1 === row2)
    );
  }

  swapTiles(index1, index2) {
    const tempPosition = this.tiles[index1].position.clone();
    this.tiles[index1].position.copy(this.tiles[index2].position);
    this.tiles[index2].position.copy(tempPosition);

    // Hide the empty tile and show the moved tile
    this.tiles[index2].visible = true;
    this.tiles[index1].visible = false; // Set the moved tile to be the empty one
  }

  // Function to visualize the raycast line
  showRaycastLine() {
    if (this.line) {
      this.scene.remove(this.line); // Remove the previous line if it exists
    }

    const rayStart = this.camera.position.clone();
    const rayDirection = this.raycaster.ray.direction.clone().normalize();
    const rayEnd = rayStart.clone().add(rayDirection.multiplyScalar(100)); // Extend the line 100 units

    const points = [rayStart, rayEnd];
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 5 }); // Red line

    this.line = new THREE.Line(geometry, material);
    this.scene.add(this.line);
  }
}
