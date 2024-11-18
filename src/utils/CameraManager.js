class CameraManager {
    constructor(scene, container) {
        this.scene = scene;

        // Initialisation de la caméra
        this.camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 20, 60);
        this.camera.lookAt(0, 5, 0);

        this.scene.add(this.camera);

        // Gestion des redimensionnements
        window.addEventListener("resize", () => this.onWindowResize(container));
    }
    onWindowResize(container) {
        this.camera.aspect = container.clientWidth / container.clientHeight;
        this.camera.updateProjectionMatrix();
    }
    followObject(object, smooth = true) {
        return new Promise((resolve) => {
            if (object && object.model) {
                const target = object.model.position;

                if (smooth) {
                    console.log(`La caméra se déplace en douceur vers ${object.name}.`);
                    new TWEEN.Tween(this.camera.position)
                        .to({ x: target.x, y: target.y + 10, z: target.z + 20 }, 1000)
                        .easing(TWEEN.Easing.Quadratic.InOut)
                        .onUpdate(() => {
                            this.camera.lookAt(target);
                        })
                        .onComplete(() => {
                            console.log(`Caméra centrée sur ${object.name}.`);
                            resolve();
                        })
                        .start();
                } else {
                    this.camera.position.set(target.x, target.y + 10, target.z + 20);
                    this.camera.lookAt(target);
                    console.log(`Caméra instantanément positionnée sur ${object.name}.`);
                    resolve();
                }
            } else {
                console.warn("Objet invalide ou modèle non chargé.");
                resolve();
            }
        });
    }
}
  
  
  