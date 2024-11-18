function Hero(modelPath, stats = {}, name = "Unknown") {
  this.modelPath = modelPath; // Chemin vers le modèle GLB
  this.model = null; // Contiendra le modèle 3D chargé
  this.mixer = null; // Gère les animations du modèle
  this.actions = {}; // Stockera les animations disponibles
  this.name = name; // Identifiant du personnage

  // Caractéristiques du personnage
  this.health = stats.health || 100; // Santé du personnage
  this.attackPower = stats.attackPower || 10; // Puissance d'attaque
  this.attackRange = stats.attackRange || 1; // Portée d'attaque
  this.moveRange = stats.moveRange || 3; // Portée de déplacement
}

Hero.prototype.chargerModel = function (position = { x: 0, y: 0, z: 0 }) {
  const loader = new THREE.GLTFLoader();
  return new Promise((resolve, reject) => {
    loader.load(
      this.modelPath,
      (gltf) => {
        this.model = gltf.scene; // Le modèle est chargé
        this.model.position.set(position.x, position.y, position.z); // Place le modèle
        this.model.scale.set(8.5, 8.5, 8.5); // Taille ajustée

        console.log(`Modèle ${this.name} chargé avec succès.`);

        this.mixer = new THREE.AnimationMixer(this.model);
        gltf.animations.forEach((clip) => {
          this.actions[clip.name] = this.mixer.clipAction(clip);
        });

        resolve(this.model);
      },
      undefined,
      (error) => {
        console.error("Erreur lors du chargement du modèle :", error);
        reject(error);
      }
    );
  });
};

Hero.prototype.jouerAnimation = function (nom) {
  if (this.actions[nom]) {
    Object.values(this.actions).forEach((action) => action.stop());
    this.actions[nom].reset().play();
    console.log(`Animation "${nom}" jouée pour ${this.name}.`);
  }
};

Hero.prototype.walk = function (destination, gridWidth, gridHeight) {
  const startX = Math.round(this.model.position.x);
  const startZ = Math.round(this.model.position.z);
  const targetX = Math.min(Math.max(destination.x, -gridWidth / 2), gridWidth / 2);
  const targetZ = Math.min(Math.max(destination.z, -gridHeight / 2), gridHeight / 2);

  const distance = Math.abs(targetX - startX) + Math.abs(targetZ - startZ);
  if (distance > this.moveRange) {
    console.warn(`${this.name} : Destination hors de portée.`);
    return Promise.resolve();
  }

  console.log(`${this.name} commence à marcher vers (${targetX}, ${targetZ}).`);
  this.jouerAnimation("walk");

  const steps = distance;
  const stepDuration = 500;
  let currentStep = 0;

  return new Promise((resolve) => {
    const interval = setInterval(() => {
      if (currentStep >= steps) {
        clearInterval(interval);
        this.jouerAnimation("idle");
        console.log(`${this.name} a atteint sa destination.`);
        resolve();
        return;
      }

      if (currentStep < Math.abs(targetX - startX)) {
        this.model.position.x += Math.sign(targetX - startX);
      } else {
        this.model.position.z += Math.sign(targetZ - startZ);
      }

      currentStep++;
    }, stepDuration);
  });
};

Hero.prototype.attack = function (target) {
  if (!target || target.health <= 0) {
    console.warn(`${this.name} n'a aucune cible valide.`);
    return Promise.resolve();
  }

  console.log(`${this.name} attaque ${target.name} pour ${this.attackPower} dégâts.`);
  this.jouerAnimation("attack-melee-left");

  return new Promise((resolve) => {
    setTimeout(() => {
      target.health = Math.max(0, target.health - this.attackPower);
      console.log(`Santé restante de ${target.name} : ${target.health}`);

      // Mettre à jour l'interface utilisateur
      updateHealthBar(target, target.name === "Hero" ? "#hero-stats" : "#evil-stats");

      if (target.health === 0) {
        console.log(`${target.name} est KO.`);
        target.jouerAnimation("die");
      } else {
        target.jouerAnimation("fall");
      }

      setTimeout(() => {
        this.jouerAnimation("idle");
        resolve();
      }, 3000);
    }, 500);
  });
};


Hero.prototype.update = function (deltaTime) {
  if (this.mixer) {
    this.mixer.update(deltaTime);
  }
};
