[![Netlify Status](https://api.netlify.com/api/v1/badges/9090b521-377a-4a04-82c5-21aea5f18f82/deploy-status)](https://app.netlify.com/sites/emotionsgarden/deploys)

# 🌟 Projet Jardin des Émotions en 3D

## 📖 Description
Ce projet est une expérience interactive en 3D utilisant **Babylon.js** pour explorer quatre émotions principales : **Joie, Tristesse, Peur et Colère**. Chaque émotion est représentée par une sphère dans une serre virtuelle. Des interactions permettent de modifier l’environnement et les effets visuels selon l’intensité choisie, avec des éléments dynamiques comme Chucky pour intensifier la Peur.

## 📑 Table des Matières
- [Description](#-description)
- [Contenu de l’archive ZIP](#-contenu-de-larchive-zip)
- [Dépendances externes](#-dépendances-externes)
- [Installation & Exécution](#-installation--exécution)
- [Interactions disponibles](#-interactions-disponibles)
- [Prérequis techniques](#-prérequis-techniques)
- [Difficultés rencontrées & solutions](#-difficultés-rencontrées--solutions)
- [Points chronophages](#-points-chronophages)
- [Remarque](#-remarque)

## 📂 Contenu de l’archive ZIP

### 📁 Structure des dossiers
- **`index.html`** : Fichier principal à ouvrir dans un navigateur pour lancer le projet.
- **`main.js`** : Script JavaScript contenant la logique du projet.
- **`/objs/`** : Dossier contenant les modèles 3D au format `.glb` :
  - 🌿 `serre.glb` (la serre centrale)
  - 🌳 `tree1.glb`, `tree2.glb`, `tree3.glb` (arbres normaux)
  - 👻 `horror_tree.glb` (arbre effrayant pour la Peur)
  - 🪦 `tombstone1.glb`, `tombstone2.glb` (tombes pour la Peur)
  - 🪑 `bench.glb` (banc)
  - 🍂 `pine_cone.glb` (pomme de pin)
  - 🌼 `flower1.glb`, `flower2.glb`, `flower3.glb`, `flower4.glb` (fleurs pour la Joie)
  - 🔥 `dead-tree.glb` (arbre mort pour la Colère)
  - 🌱 `grass.glb` (herbes décoratives)
  - 🌸 `pond_flower.glb` (fleur d’étang)
  - 🚪 `jap_door.glb` (porte japonaise)
  - 🌸 `tree_jap.glb` (arbre japonais)
  - 🎃 `chucky.glb` (modèle de Chucky pour la Peur, intensités 2 et 3)
- **`/textures/`** : Dossier contenant les textures et images :
  - 🌌 `background.jpg` (fond étoilé par défaut)
  - 🎨 Fonds spécifiques aux émotions : `background-joie.jpg`, `background-triste.jpg`, `background2.jpg` (Peur), `background-colere.jpg`
  - 🌱 Sols : `grass.jpg`, `dark_forest.jpg`, `lava.jpg`
  - 💧 Particules : `water-drop.png` (pluie), `fire.png` (feu), `butterfly.png` (papillons), `explosion.png` (explosion)
  - 🎭 Screamer pour la Peur : `screamer.png`
  - ℹ️ Icône d’info : `info-icon.png`


## 🔗 Dépendances externes
Le projet utilise **Babylon.js** et **Babylon.GUI**, chargés via **CDN** dans `index.html`. Une connexion Internet est requise pour les télécharger.

## 🛠️ Installation & Exécution
1. **Décompressez** l’archive ZIP dans un dossier local.
2. **Vérifiez** la présence des dossiers **/objs/** et **/textures/** à la racine.
3. **Lancez un serveur local** via terminal :
   ```sh
   npx http-server .
   ```
4. **Accédez au projet** via `http://localhost:8080`.
5. **Profitez de l’expérience interactive** 🎮 !

## 🎮 Interactions disponibles

### 🏞️ Navigation
- **Caméra** :
  - 🎥 Rotation : clic gauche + mouvement
  - 🔍 Zoom : molette
  - 📦 Déplacement : clic droit + mouvement

### 🎭 Sélection des émotions
- Quatre sphères colorées représentent les émotions :
  - 🟡 **Joie** (Jaune, à gauche)
  - 🟣 **Peur** (Violet, au centre)
  - 🔴 **Colère** (Rouge, à droite)
  - 🔵 **Tristesse** (Bleu, devant)
- **Interaction** : Cliquez sur une sphère pour modifier l’environnement.

### 📊 Panneau d’intensité
Une fois une émotion sélectionnée, un panneau permet d’ajuster l’intensité :
- 🔹 **Intensité 1** : Faible (ex. Légère satisfaction pour Joie)
- 🔸 **Intensité 2** : Moyenne (ex. Bonheur modéré pour Joie)
- 🔺 **Intensité 3** : Forte (ex. Euphorie pour Joie)

### 🌈 Effets par émotion
- 🌞 **Joie** : Fond lumineux, sol herbeux, papillons, fleurs animées.
- 🌧️ **Tristesse** : Fond sombre, pluie tombante, arbres oscillants.
- 👻 **Peur** :
  - Intensité 1 : Fond brumeux, arbre effrayant.
  - Intensité 2 : Ajout de tombes et Chucky (loin, petit).
  - Intensité 3 : Brouillard dense, tonnerre fréquent, Chucky plus proche et plus grand, screamer.
- 🌋 **Colère** : Fond volcanique, sol de lave, flammes, explosions à intensité 3.

### 🏡 Scène d’accueil
- Avant de sélectionner une émotion, la scène affiche une serre entourée d’herbes, d’une fleur d’étang, d’une porte japonaise et d’un arbre japonais.

## 🖥️ Prérequis techniques
- ✅ **Navigateur récent** : Chrome, Firefox, Edge.
- 🌐 **Connexion Internet** : Pour Babylon.js via CDN.
- 🖥️ **Serveur local** : Pour éviter les erreurs CORS.
- 🎮 **Carte graphique compatible WebGL** : Rendu fluide garanti.

## 🛑 Difficultés rencontrées & solutions
- **Chargement des objets** 🔄 : Ajout d’un système de suivi avec `loadElement` pour gérer les promesses.
- **Animations synchronisées** 🎭 : Arrêt explicite des animations avant changement pour éviter les conflits.
- **Optimisation des particules** 🎇 : Limitation du taux d’émission et ajustement des tailles.
- **Gestion dynamique de Chucky** 👹 : Suppression et rechargement conditionnel selon l’intensité et l’humeur.
- **Compatibilité audio** 🎵 : Délais aléatoires pour éviter les chevauchements des sons de tonnerre.

## ⏳ Points chronophages
- 🎬 **Effets d’intensité** : Animation et équilibrage des effets visuels (ex. mouvement de Chucky).
- 🏗️ **Gestion des objets dynamiques** : Chargement et suppression propre des modèles 3D (ex. `grass.glb`, `chucky.glb`).
- 🎨 **Interface utilisateur** : Ajustement des panneaux et boutons pour une expérience fluide.

## 📌 Remarque
Testez **chaque émotion à toutes les intensités** pour apprécier la progression des effets, notamment l’apparition progressive de Chucky dans la Peur ! Si un élément ne se charge pas, **vérifiez les chemins** dans `/objs/` et `/textures/`, ou relancez le serveur.

🙏 Merci d’explorer ce projet ! 🚀 N’hésitez pas à signaler tout problème ou à suggérer des améliorations.

---

### Principaux ajustements effectués :
1. **Contenu de l’archive ZIP** :
  - Ajout des nouveaux modèles 3D : `grass.glb`, `pond_flower.glb`, `jap_door.glb`, `tree_jap.glb`, et `chucky.glb`.
  - Ajout de `explosion.png` dans les textures (utilisé pour les particules d’explosion dans Colère).

2. **Interactions disponibles** :
  - Ajout d’une sous-section **Scène d’accueil** pour mentionner les nouveaux éléments visibles au démarrage.
  - Détail des effets de la **Peur** pour inclure Chucky à l’intensité 2 (loin, petit) et 3 (proche, grand), avec ses positions et tailles spécifiques.

3. **Difficultés rencontrées & solutions** :
  - Placer les différents objets s’est révélé compliqué, nous avons donc utilisé une technique consistant à indiquer les coordonnées du clic pour ensuite positionner les objets et modèles 3D.
4. **Points chronophages** :
  - Ajout de la gestion du mouvement de Chucky comme tâche chronophage.

5. **Remarque** :
  - Encouragement à tester les intensités de la Peur pour observer l’évolution de Chucky.
