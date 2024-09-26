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

        // Raycaster for mouse picking
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        // Bind shoot method to the 'click' event on the provided DOM element
        this.domElement.addEventListener('click', (event) => this.onMouseClick(event));

        // Predefined target positions
        this.specificPositions = [
            new THREE.Vector3(-10, 0.3, 12),  // Target 1 position
            new THREE.Vector3(-5, 0.3, 15),   // Target 2 position
            new THREE.Vector3(-13, 0.3, 18), 
            new THREE.Vector3(-8, 0.3, 10),
        ];

        // Spawn targets at predefined locations
        this.spawnTargets();

        // Load bullet spawn sound
        this.bulletSound = new Audio('interface-1-126517.mp3');
        this.bulletSound.volume = 0.5;  // Adjust volume as needed
    }

    onMouseClick(event) {
        // Convert mouse click position to normalized device coordinates (-1 to +1) for raycasting
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        // Update the raycaster with camera and mouse position
        this.raycaster.setFromCamera(this.mouse, this.camera);

        // Cast a ray into the scene to find the point clicked on
        const intersects = this.raycaster.intersectObjects(this.scene.children);

        if (intersects.length > 0) {
            const targetPoint = intersects[0].point; // Get the first intersected point
            this.shoot(targetPoint);
        }
    }

    shoot(targetPoint) {
        // Play bullet sound
        this.bulletSound.play()
        setTimeout(() => {
            this.bulletSound.pause();   // Pause the sound
            this.bulletSound.currentTime = 0;  // Reset sound to the start
        }, 200); // Adjust the duration (in milliseconds) as needed
    ;

        // Create a projectile (e.g., sphere)
        const projectileGeometry = new THREE.SphereGeometry(0.2, 32, 32);
        const projectileMaterial = new THREE.MeshStandardMaterial({ color: '#ff0000' });
        const projectileMesh = new THREE.Mesh(projectileGeometry, projectileMaterial);
        
        // Position the projectile at the player's position
        projectileMesh.position.copy(this.cubeBody.position);
        this.scene.add(projectileMesh);

        // Create a corresponding physics body
        const projectileShape = new CANNON.Sphere(0.2);
        const projectileBody = new CANNON.Body({
            mass: 1,
            position: this.cubeBody.position.clone(),
        });
        projectileBody.addShape(projectileShape);
        this.world.addBody(projectileBody);

        // Calculate direction from the player to the target point
        const shootDirection = new THREE.Vector3();
        shootDirection.subVectors(targetPoint, this.cubeBody.position).normalize();

        // Set the velocity of the projectile towards the target point
        const velocity = shootDirection.multiplyScalar(20); // Adjust speed as necessary
        projectileBody.velocity.set(velocity.x, velocity.y, velocity.z);

        // Add the projectile to the array
        this.projectiles.push({ mesh: projectileMesh, body: projectileBody });

        // Set a timer to destroy the projectile after 3 seconds
        setTimeout(() => {
            this.destroyProjectile(projectileMesh, projectileBody);
        }, 800); // 800 milliseconds = 0.8 seconds
    }

    destroyProjectile(projectileMesh, projectileBody) {
        // Remove projectile mesh from the scene
        this.scene.remove(projectileMesh);

        // Remove projectile body from the physics world
        this.world.removeBody(projectileBody);

        // Optionally filter out the destroyed projectile from the projectiles array
        this.projectiles = this.projectiles.filter(p => p.mesh !== projectileMesh);
    }

    updateProjectiles() {
        // Update the position of each projectile
        this.projectiles.forEach(projectile => {
            projectile.mesh.position.copy(projectile.body.position);
        });
    }

    spawnTargets() {
        // Spawn all targets at predefined positions
        this.specificPositions.forEach(position => {
            this.spawnTarget(position);
        });
    }

    spawnTarget(position) {
        // Create a target block (cube)
        const targetGeometry = new THREE.BoxGeometry(1, 1, 1);
        const targetMaterial = new THREE.MeshStandardMaterial({ color: '#00ff00' });
        const targetMesh = new THREE.Mesh(targetGeometry, targetMaterial);
        targetMesh.position.copy(position);
        this.scene.add(targetMesh);
    
        // Create a corresponding physics body
        const targetShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
        const targetBody = new CANNON.Body({
            mass: 0, // Static object
            position: position.clone(),
        });
        targetBody.addShape(targetShape);
        this.world.addBody(targetBody);
    
        // Initialize hit state
        this.targets.push({ mesh: targetMesh, body: targetBody, hit: false });
    }

    checkCollisions() {
        // Iterate through projectiles and check for collisions with targets
        this.projectiles.forEach(projectile => {
            this.targets.forEach(target => {
                // Check if the target has already been hit
                if (!target.hit) {
                    const distance = target.body.position.distanceTo(projectile.body.position);
                    if (distance < 1) { // Adjust this threshold based on the size of your objects
                        console.log('Target hit!');
                        
                        // Mark the target as hit
                        target.hit = true;
    
                        // Remove the target from the scene and world
                        this.scene.remove(target.mesh);
                        this.world.removeBody(target.body);
    
                        // Remove the target from the array
                        this.targets = this.targets.filter(t => t.mesh !== target.mesh);
    
                        // Destroy the projectile
                        this.destroyProjectile(projectile.mesh, projectile.body);
                    }
                }
            });
        });
    }
}
