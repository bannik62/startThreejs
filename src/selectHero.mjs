function SelectHero(container) {
  this.container = container;

  // Initialisation de la scène
  this.scene = new THREE.Scene();
  this.renderer = new THREE.WebGLRenderer({ antialias: true });
  this.renderer.setSize(container.clientWidth, container.clientHeight);
  this.renderer.shadowMap.enabled = true;

  container.appendChild(this.renderer.domElement);

  // Caméra et lumière pour la scène de sélection
  this.camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
  this.camera.position.set(0, 10, 30);
  this.camera.lookAt(0, 0, 0);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(10, 20, 10);
  this.scene.add(light);

  // Modèle du héros
  this.heroModel = null;

  console.log('Sélection du héros initialisée.');
}

SelectHero.prototype.loadHero = function (modelPath) {
  const loader = new THREE.GLTFLoader();

  return new Promise((resolve, reject) => {
    loader.load(
      modelPath,
      (gltf) => {
        this.heroModel = gltf.scene;
        this.heroModel.position.set(0, -5, 0);
        this.heroModel.scale.set(8.5, 8.5, 8.5);

        this.scene.add(this.heroModel);
        console.log('Héros chargé pour sélection.');
        resolve();
      },
      undefined,
      (error) => {
        console.error('Erreur lors du chargement du héros.', error);
        reject(error);
      }
    );
  });
};

SelectHero.prototype.animate = function () {
  requestAnimationFrame(() => this.animate());
  this.renderer.render(this.scene, this.camera);
};

SelectHero.prototype.start = function () {
  console.log('Animation pour sélection du héros démarrée.');
  this.animate();
};
