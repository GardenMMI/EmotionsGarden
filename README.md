[![Netlify Status](https://api.netlify.com/api/v1/badges/9090b521-377a-4a04-82c5-21aea5f18f82/deploy-status)](https://app.netlify.com/sites/emotionsgarden/deploys)

# 🌟 Projet Jardin des Emotions en 3D

## 📖 Description
Ce projet est une expérience interactive en 3D utilisant **Babylon.js** pour explorer quatre émotions principales : **Joie, Tristesse, Peur et Colère**. Chaque émotion est représentée par une sphère dans une serre virtuelle. Des interactions permettent de modifier l’environnement et les effets visuels selon l’intensité choisie.

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
- **`/textures/`** : Dossier contenant les textures et images :
  - 🌌 `background.jpg` (fond étoilé par défaut)
  - 🎨 Fonds spécifiques aux émotions : `background-joie.jpg`, `background-triste.jpg`, `background2.jpg` (Peur), `background-colere.jpg`
  - 🌱 Sols : `grass.jpg`, `dark_forest.jpg`, `lava.jpg`
  - 💧 Particules : `water-drop.png` (pluie), `fire.png` (feu), `butterfly.png` (papillons)
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
- 🌞 **Joie** : Fond lumineux, sol herbeux, papillons.
- 🌧️ **Tristesse** : Fond sombre, pluie tombante.
- 👻 **Peur** : Fond brumeux, arbre effrayant, tombes.
- 🌋 **Colère** : Fond volcanique, sol de lave, flammes.

## 🖥️ Prérequis techniques
- ✅ **Navigateur récent** : Chrome, Firefox, Edge.
- 🌐 **Connexion Internet** : Pour Babylon.js via CDN.
- 🖥️ **Serveur local** : Pour éviter les erreurs CORS.
- 🎮 **Carte graphique compatible WebGL** : Rendu fluide garanti.

## 🛑 Difficultés rencontrées & solutions
- **Chargement des objets** 🔄 : Ajout d’un système de suivi.
- **Animations synchronisées** 🎭 : Arrêt explicite des animations avant changement.
- **Optimisation des particules** 🎇 : Limitation du taux d'émission.
- **Compatibilité audio** 🎵 : Délais aléatoires pour éviter les chevauchements.

## ⏳ Points chronophages
- 🎬 **Effets d’intensité** : Animation & équilibrage des effets visuels.
- 🏗️ **Gestion des objets dynamiques** : Chargement & suppression propre des modèles 3D.
- 🎨 **Interface utilisateur** : Ajustement pour une expérience fluide.

## 📌 Remarque
Testez **chaque émotion à toutes les intensités** pour apprécier la progression des effets !
Si un élément ne se charge pas, **vérifiez les chemins** dans `/objs/` et `/textures/`, ou relancez le serveur.

🙏 Merci d’explorer ce projet ! 🚀 N’hésitez pas à signaler tout problème ou à suggérer des améliorations.

