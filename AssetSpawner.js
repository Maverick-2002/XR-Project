import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export class AssetSpawner {
  constructor(scene) {
    this.scene = scene;
    this.loader = new GLTFLoader();
  }

  spawnAsset(url, position) {
    this.loader.load(url, (gltf) => {
      gltf.scene.position.copy(position);
      this.scene.add(gltf.scene);
    }, undefined, (error) => {
      console.error('An error occurred while loading the asset:', error);
    });
  }
}
