import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as CANNON from 'cannon-es';

export class AssetSpawner {
  constructor(scene, world) {
    this.scene = scene;
    this.world = world;
    this.loader = new GLTFLoader();
    this.assets = [
      {
        url: 'https://cdn.glitch.global/9840aa6a-2e73-4088-b83c-d68a4642d7be/low_poly_game_level.glb?v=1727015272543',
        scale: { x: 2, y: 2, z: 2 },
        position: { x: 0, y: 0, z: 0 }
      },
    ];
    this.loadAssets();
  }

  loadAssets() {
    this.assets.forEach((asset) => {
      this.loader.load(asset.url, (gltf) => {
        const model = gltf.scene;
        model.scale.set(asset.scale.x, asset.scale.y, asset.scale.z);
        model.position.set(asset.position.x, asset.position.y, asset.position.z);
        this.scene.add(model);
        const box = new THREE.Box3().setFromObject(model);
        const size = new THREE.Vector3();
        box.getSize(size);
        console.log('Width:', size.x, 'Height:', size.y, 'Depth:', size.z);
        const floorBody = new CANNON.Body({ mass: 0 });
        const floorShape = new CANNON.Box(new CANNON.Vec3(size.x / 2, 0.1, size.z / 2)); 
        floorBody.addShape(floorShape);
        floorBody.position.set(-1,-1,-1);
        this.world.addBody(floorBody); 
        
      }, undefined, (error) => {
        console.error('Error loading asset:', error);
      });
    });
  }
}


