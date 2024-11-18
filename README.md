# Structure du projet

## Fichiers et leurs fonctions

### MainScene.js
- `constructor(container)`
- `initScene()`
- `addObject(object)`
- `addMap(width, height)`
- `addGrid(width, height)`
- `addBasicLights()`
- `start()`

### Hero.js
- `constructor(modelPath, stats, name)`
- `chargerModel(position)`
- `jouerAnimation(nom)`
- `walk(destination)`
- `attack(target)`
- `update(deltaTime)`

### CameraManager.js
- `constructor(scene, container)`
- `onWindowResize(container)`
- `followObject(object, smooth)`

### index.js
- `initGame()`
- `playTurn(scene)`
- `nextTurn(scene)`
- `endGame(winnerName)`
- `generateValidDestination(player, gridWidth, gridHeight)`
- `updateHealthBar(character, healthBarId)`

### selectHero.mjs (si applicable)
- Sélection du héros
- Événements d’interaction
- Transmission des choix au jeu principal
