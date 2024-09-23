import * as THREE from 'three';

export class Puzzle {
  constructor(scene, textureURL, position = { x: -7, y: 2, z: 8}, gap = 0.25) {
    this.scene = scene;
    this.textureURL = textureURL;
    this.tiles = [];
    this.position = position; // Set the position
    this.gap = gap; // Set the gap
    this.createPuzzle();
  }

  async createPuzzle() {
    const texture = await this.loadTexture(this.textureURL);
    const tileSize = 2; // Size of each tile
    const tileGeometry = new THREE.PlaneGeometry(tileSize, tileSize);

    // Create a 3x3 grid of tiles, swapping top and bottom rows
    for (let row = 0; row < 3; row++) {
      const actualRow = row === 0 ? 2 : row === 2 ? 0 : row; // Swap top and bottom

      for (let col = 0; col < 3; col++) {
        const tileMaterial = new THREE.MeshStandardMaterial({
          map: this.createTileTexture(texture, col, row), // Use row for original texture extraction
          transparent: true,
          opacity: 1,
          side: THREE.DoubleSide, // Apply texture to both sides
        });

        const tile = new THREE.Mesh(tileGeometry, tileMaterial);
        tile.position.set(
          col * (tileSize + this.gap) - (tileSize + this.gap) + this.position.x,
          actualRow * (tileSize + this.gap) - (tileSize + this.gap) + this.position.y,
          this.position.z + 0.1
        );

        this.scene.add(tile);
        this.tiles.push(tile);
      }
    }
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
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const tileWidth = originalTexture.image.width / 3;
    const tileHeight = originalTexture.image.height / 3;

    canvas.width = tileWidth;
    canvas.height = tileHeight;

    context.drawImage(
      originalTexture.image,
      col * tileWidth, // Source x
      row * tileHeight, // Source y
      tileWidth,        // Source width
      tileHeight,       // Source height
      0,                // Destination x
      0,                // Destination y
      tileWidth,        // Destination width
      tileHeight        // Destination height
    );

    const tileTexture = new THREE.Texture(canvas);
    tileTexture.needsUpdate = true; // Ensure the texture updates
    return tileTexture;
  }
}
