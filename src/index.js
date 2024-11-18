document.addEventListener('DOMContentLoaded', function () {
  console.log('Document chargé.');

  // Récupération des écrans et du conteneur de scène
  const startScreen = document.getElementById('start-screen');
  const selectScreen = document.getElementById('select-screen');
  const gameScreen = document.getElementById('game-screen');
  const container = document.querySelector('.scene-container');

  let currentTurn = 0; // Gestion du tour actuel
  let participants = []; // Liste des participants (Héros et Ennemi)

  // Bouton de démarrage
  document.getElementById('start-button').addEventListener('click', function () {
    console.log('Passage à l\'écran de sélection.');
    startScreen.classList.remove('active');
    selectScreen.classList.add('active');
  });

  // Bouton de sélection du héros
  document.getElementById('select-hero-button').addEventListener('click', function () {
    console.log('Passage à la scène principale.');
    selectScreen.classList.remove('active');
    gameScreen.classList.add('active');
    initGame();
  });

  // Fonction pour initialiser le jeu
  function initGame() {
    console.log('Initialisation du jeu.');
    const mainScene = new MainScene(container);

    // Création des personnages
    const hero = new Hero('../public/models/GLB/character-male-a.glb', { health: 100, attackPower: 25, attackRange: 10, moveRange: 10 }, 'Hero');
    const evil = new Hero('../public/models/GLB/character-male-b.glb', { health: 120, attackPower: 15, attackRange: 10, moveRange: 10 }, 'Evil');

    participants = [hero, evil];

    // Chargement des modèles
    Promise.all([
      hero.chargerModel({ x: -5, y: 0, z: 0 }),
      evil.chargerModel({ x: 8, y: 0, z: 0 }),
    ]).then(function () {
      console.log('Héros et ennemis chargés.');

      mainScene.addObject(hero);
      mainScene.addObject(evil);

      playTurn(mainScene); // Lancement du premier tour
      mainScene.start(); // Démarrage de l'animation
    }).catch(function (err) {
      console.error('Erreur lors du chargement des modèles.', err);
    });
  }

  // Fonction pour gérer les tours
  async function playTurn(scene) {
    const activePlayer = participants[currentTurn];
    const enemyPlayer = participants[(currentTurn + 1) % participants.length];

    console.log(`Tour du joueur : ${activePlayer.name}.`);

    // Suivi de la caméra sur le joueur actif
    await scene.cameraManager.followObject(activePlayer, true);

    // Calcul de la distance entre le joueur actif et son ennemi
    const distance = Math.sqrt(
      Math.pow(activePlayer.model.position.x - enemyPlayer.model.position.x, 2) +
      Math.pow(activePlayer.model.position.z - enemyPlayer.model.position.z, 2)
    );

    if (distance <= activePlayer.attackRange) {
      console.log(`${activePlayer.name} attaque ${enemyPlayer.name}.`);
      await activePlayer.attack(enemyPlayer);

      // Mise à jour des statistiques après l'attaque
      updateHealthBar(enemyPlayer, enemyPlayer.name === "Hero" ? "#hero-stats" : "#evil-stats");

      if (enemyPlayer.health <= 0) {
        console.log(`${enemyPlayer.name} est mort.`);
        endGame(activePlayer.name);
      } else {
        nextTurn(scene);
      }
    } else {
      console.log(`${activePlayer.name} se déplace.`);
      const destination = generateValidDestination(activePlayer, 65, 70);
      await activePlayer.walk(destination, 65, 70);

      nextTurn(scene);
    }
  }

  // Fonction pour passer au tour suivant
  function nextTurn(scene) {
    currentTurn = (currentTurn + 1) % participants.length;
    playTurn(scene);
  }

  // Fonction pour générer une destination valide
  function generateValidDestination(player, gridWidth, gridHeight) {
    const x = Math.round(player.model.position.x);
    const z = Math.round(player.model.position.z);

    let targetX, targetZ, distance;

    do {
      targetX = x + Math.floor(Math.random() * (2 * player.moveRange + 1)) - player.moveRange;
      targetZ = z + Math.floor(Math.random() * (2 * player.moveRange + 1)) - player.moveRange;

      targetX = Math.min(Math.max(targetX, -gridWidth / 2), gridWidth / 2);
      targetZ = Math.min(Math.max(targetZ, -gridHeight / 2), gridHeight / 2);

      distance = Math.abs(targetX - x) + Math.abs(targetZ - z);
    } while (distance > player.moveRange);

    console.log(`Destination générée pour ${player.name} : (${targetX}, ${targetZ}).`);
    return { x: targetX, z: targetZ };
  }

  // Fonction pour afficher la victoire et terminer le jeu
  function endGame(winnerName) {
    alert(`${winnerName} gagne !`);
    location.reload();
    console.log('Fin du jeu.');
  }

  // Fonction pour mettre à jour l'interface utilisateur
function updateHealthBar(character, healthBarId) {
  const statsContainer = document.querySelector(healthBarId);

  if (!statsContainer) {
    console.warn(`Le conteneur pour les statistiques de ${character.name || "personnage inconnu"} est introuvable.`);
    return;
  }

  // Mise à jour de la barre de santé
  const healthBarInner = statsContainer.querySelector('.health-bar-inner');
  const maxHealth = character instanceof Hero ? 100 : 120;
  const healthPercentage = Math.max(0, (character.health / maxHealth) * 100);

  if (healthBarInner) {
    healthBarInner.style.width = `${healthPercentage}%`;
  } else {
    console.warn(`Barre de santé introuvable pour ${character.name || "personnage inconnu"}.`);
  }

  // Mise à jour des statistiques
  const baseId = healthBarId.replace('#', '').split('-')[0]; // Supprime '#' et récupère la base
  const healthText = statsContainer.querySelector(`#${baseId}-health`);
  const attackText = statsContainer.querySelector(`#${baseId}-attack`);
  const rangeText = statsContainer.querySelector(`#${baseId}-range`);

  if (healthText) healthText.textContent = `Health: ${character.health}`;
  if (attackText) attackText.textContent = `Attack: ${character.attackPower}`;
  if (rangeText) rangeText.textContent = `Range: ${character.moveRange}`;

  console.log(`Statistiques mises à jour pour ${character.name}.`);
}
  window.updateHealthBar = updateHealthBar;

});
