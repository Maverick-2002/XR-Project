import * as THREE from 'three';
import * as CANNON from 'cannon-es';

export class Shooting {
    constructor(scene, world, cubeBody, camera, domElement) {
        this.scene = scene;
        this.world = world;
        this.cubeBody = cubeBody;
        this.camera = camera;
        this.domElement = domElement; // The DOM element to capture mouse clicks
        this.projectiles = [];
        this.targets = [];
        this.score = 0;

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        this.domElement.addEventListener('click', (event) => this.onMouseClick(event));

        this.specificPositions = [
            new THREE.Vector3(-10, 0.3, 12), 
            new THREE.Vector3(-5, 0.3, 15),  
            new THREE.Vector3(-13, 0.3, 18), 
            new THREE.Vector3(-8, 0.3, 10),
        ];
        this.spawnTargets();

        this.bulletSound = new Audio('interface-1-126517.mp3');
        this.bulletSound.volume = 0.5;
        this.updateScoreDisplay();
    }

    onMouseClick(event) {
        
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.scene.children);

        if (intersects.length > 0) {
            const targetPoint = intersects[0].point; 
            this.shoot(targetPoint);
        }
    }

    shoot(targetPoint) {

        this.bulletSound.play();
        setTimeout(() => {
            this.bulletSound.pause();
            this.bulletSound.currentTime = 0;  
        }, 200); 

        const projectileGeometry = new THREE.SphereGeometry(0.2, 32, 32);
        const projectileMaterial = new THREE.MeshStandardMaterial({ color: '#ff0000' });
        const projectileMesh = new THREE.Mesh(projectileGeometry, projectileMaterial);
        
        projectileMesh.position.copy(this.cubeBody.position);
        this.scene.add(projectileMesh);

        const projectileShape = new CANNON.Sphere(0.2);
        const projectileBody = new CANNON.Body({
            mass: 1,
            position: this.cubeBody.position.clone(),
        });
        projectileBody.addShape(projectileShape);
        this.world.addBody(projectileBody);
        const shootDirection = new THREE.Vector3();
        shootDirection.subVectors(targetPoint, this.cubeBody.position).normalize();
        const velocity = shootDirection.multiplyScalar(20);
        projectileBody.velocity.set(velocity.x, velocity.y, velocity.z);
        this.projectiles.push({ mesh: projectileMesh, body: projectileBody });
        setTimeout(() => {
            this.destroyProjectile(projectileMesh, projectileBody);
        }, 800);
    }

    destroyProjectile(projectileMesh, projectileBody) {
        this.scene.remove(projectileMesh);
        this.world.removeBody(projectileBody);
        this.projectiles = this.projectiles.filter(p => p.mesh !== projectileMesh);
    }

    updateProjectiles() {
        this.projectiles.forEach(projectile => {
            projectile.mesh.position.copy(projectile.body.position);
        });
    }

    spawnTargets() {
        this.specificPositions.forEach(position => {
            this.spawnTarget(position);
        });
    }

    spawnTarget(position) {
        const targetGeometry = new THREE.BoxGeometry(1, 1, 1);
        const targetMaterial = new THREE.MeshStandardMaterial({ color: '#f0ff00' });
        const targetMesh = new THREE.Mesh(targetGeometry, targetMaterial);
        targetMesh.position.copy(position);
        this.scene.add(targetMesh);
        const targetShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
        const targetBody = new CANNON.Body({
            mass: 0, 
            position: position.clone(),
        });
        targetBody.addShape(targetShape);
        this.world.addBody(targetBody);
        this.targets.push({ mesh: targetMesh, body: targetBody, hit: false });
    }

    checkCollisions() {
        this.projectiles.forEach(projectile => {
            this.targets.forEach(target => {
                if (!target.hit) {
                    const distance = target.body.position.distanceTo(projectile.body.position);
                    if (distance < 1) {
                        console.log('Target hit!');
                        this.score += 10;
                        this.updateScoreDisplay(); 
                        this.scene.remove(target.mesh);
                        this.world.removeBody(target.body);
                        this.targets = this.targets.filter(t => t.mesh !== target.mesh);
                        this.destroyProjectile(projectile.mesh, projectile.body);
                    }
                }
            });
        });
    }

    updateScoreDisplay() {
        const scoreDisplay = document.getElementById('score-display');
        if (scoreDisplay) {
            scoreDisplay.textContent = `Score: ${this.score}`;
        }
    }
}
