class MainScene {
  constructor(container) {
    this.container = container;

    // Initialisation de la scène
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Optionnel : rend les ombres plus douces


    container.appendChild(this.renderer.domElement);

    // Gestion de la caméra
    this.cameraManager = new CameraManager(this.scene, container);

    // Initialisation des lumières, carte et grille
    this.addBasicLights();
    this.addMap(80, 80);
    this.addGrid(80, 80);

    // Objets dynamiques
    this.dynamicObjects = [];

    console.log('MainScene initialisée.');
  }
  addBasicLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Couleur blanche, intensité 1
    directionalLight.position.set(50, 100, 50);
    directionalLight.castShadow = true;
    
    this.scene.add(directionalLight);

    console.log('Lumières ajoutées à la scène.');
  }
  addMap(width , height ) {
    const textureLoader = new THREE.TextureLoader();
    const mapTexture = textureLoader.load('./textures/map.jpg');

    const mapGeometry = new THREE.PlaneGeometry(width, height);
    const mapMaterial = new THREE.MeshStandardMaterial({ map: mapTexture });
    this.mapMesh = new THREE.Mesh(mapGeometry, mapMaterial);

    this.mapMesh.rotation.x = -Math.PI / 2;
    this.mapMesh.position.set(0, 0, 0);
    this.scene.add(this.mapMesh);

    console.log(`Carte ajoutée avec taille ${width}x${height}.`);
  }
  addGrid(width = 65, height = 70) {
    const divisions = 10;
    this.grid = new THREE.GridHelper(width, divisions, 0x000000, 0xffffff);
    this.grid.position.set(0, -0.99, 0);
    this.scene.add(this.grid);

    console.log(`Grille ajoutée avec dimensions ${width}x${height}.`);
  }
  addObject(object) {
    this.scene.add(object.model);
    this.dynamicObjects.push(object);

    console.log(`${object.name} ajouté à la scène.`);
  }
  animate() {
    requestAnimationFrame(() => this.animate());

    const deltaTime = this.clock.getDelta();

    // Mettre à jour les objets dynamiques
    this.dynamicObjects.forEach((object) => {
      if (object.update) object.update(deltaTime);
    });

    TWEEN.update();
    this.renderer.render(this.scene, this.cameraManager.camera);
  }
  start() {
    this.clock = new THREE.Clock();
    
    console.log('Animation démarrée.');
    this.animate();
  }
}







