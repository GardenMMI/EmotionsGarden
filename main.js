const canvas = document.getElementById("renderCanvas");
if (!canvas) {
    throw new Error("Canvas manquant");
}
const engine = new BABYLON.Engine(canvas, true);

// Déclarer les variables GUI et de chargement dans une portée globale
let infoButton, descriptionModal, closeButton, intensityPanel, intensityButtons, loader;
let elementsToLoad = 0; // Déplacer ici
let elementsLoaded = 0; // Déplacer ici

const checkAllElementsLoaded = () => {
    if (elementsLoaded >= elementsToLoad) {
        loader.isVisible = false;
    }
};

const loadElement = (promise) => {
    elementsToLoad++;
    promise.then(() => {
        elementsLoaded++;
        checkAllElementsLoaded();
    }).catch((error) => {
        console.error("Erreur lors du chargement :", error);
        elementsLoaded++;
        checkAllElementsLoaded();
    });
};

// Grass
let grass = null;
let grassClones = [];
const grassPositions = [
    new BABYLON.Vector3(-110, -10, -50),
    new BABYLON.Vector3(90, -10, -120),
    new BABYLON.Vector3(-80, -10, 50),
    new BABYLON.Vector3(10, -10, 90),
    new BABYLON.Vector3(140, -10, 80)
];
const loadGrass = (scene) => { // Ajouter scene comme paramètre
    if (!grass) {
        loadElement(BABYLON.SceneLoader.ImportMeshAsync("", "/objs/", "grass.glb", scene).then((result) => {
            grass = result.meshes[0];
            grass.position = grassPositions[0];
            grass.scaling = new BABYLON.Vector3(0.5, 0.5, 0.5);
            grass.isPickable = false;

            // Create clones with fixed positions
            grassPositions.slice(1).forEach((pos, index) => {
                const clone = grass.clone(`grass_clone_${index}`);
                clone.position = pos;
                clone.scaling = new BABYLON.Vector3(0.5, 0.5, 0.5);
                clone.isPickable = false;
                grassClones.push(clone);
            });
        }));
    }
};

// Pond Flower
let pondFlower = null;
const loadPondFlower = (scene) => { 
    if (!pondFlower) {
        loadElement(BABYLON.SceneLoader.ImportMeshAsync("", "/objs/", "pond_flower.glb", scene).then((result) => {
            pondFlower = result.meshes[0];
            pondFlower.position = new BABYLON.Vector3(30, 0, 30);
            pondFlower.scaling = new BABYLON.Vector3(10, 10, 10);
            pondFlower.isPickable = false;
        }));
    }
};

// Jap Door
let JapDoor = null;
const loadJapDoor = (scene) => { // Ajouter scene comme paramètre
    if (!JapDoor) {
        loadElement(BABYLON.SceneLoader.ImportMeshAsync("", "/objs/", "jap_door.glb", scene).then((result) => {
            JapDoor = result.meshes[0];
            JapDoor.position = new BABYLON.Vector3(140, 0, 0);
            JapDoor.scaling = new BABYLON.Vector3(5, 5, 5);
            JapDoor.rotation = new BABYLON.Vector3(0, Math.PI / 2, 0); 
            JapDoor.isPickable = false;
        }));
    }
};

// Jap Tree
let treeJap = null;
const loadTreeJap = (scene) => { // Ajouter scene comme paramètre
    if (!treeJap) {
        loadElement(BABYLON.SceneLoader.ImportMeshAsync("", "/objs/", "tree_jap.glb", scene).then((result) => {
            treeJap = result.meshes[0];
            treeJap.position = new BABYLON.Vector3(-40, -40, -80);
            treeJap.scaling = new BABYLON.Vector3(40, 40, 40);
            treeJap.rotation = new BABYLON.Vector3(0, Math.PI / 2, 0); 
            treeJap.isPickable = false;
        }));
    }
};

const createScene = () => {
    const scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0, 0, 0.1, 1);

    // État actuel de l'humeur et intensité
    let currentMood = null;
    let currentIntensity = 1; // 1 = faible, 2 = moyen, 3 = fort

    // Descriptions pédagogiques complètes des émotions et niveaux d'intensité
    const moodData = {
        "Joie": {
            description: "Qu’est-ce que c’est ? La joie est une émotion positive qui surgit quand on vit quelque chose d’agréable, comme réussir un défi, passer du temps avec des proches ou admirer un beau paysage. Elle nous donne de l’énergie et une envie de partager ce bonheur.\nPourquoi on la ressent ? Elle est liée à la satisfaction de nos besoins (amour, reconnaissance, plaisir) et active des zones du cerveau comme le système de récompense (dopamine).\nSignes physiques : Sourire, rire, sensation de légèreté, cœur qui bat plus vite d’excitation.\nRôle : Elle renforce nos liens sociaux et nous motive à répéter ce qui nous rend heureux.",
            intensities: [
                { name: "Légère satisfaction", desc: "Une petite joie, calme et discrète, comme terminer une tâche ou voir une fleur jolie." },
                { name: "Bonheur modéré", desc: "Un contentement qui donne envie de sourire, comme après une bonne nouvelle ou un moment avec des amis." },
                { name: "Euphorie", desc: "Un bonheur explosif et communicatif, comme célébrer une grande victoire !" }
            ]
        },
        "Triste": {
            description: "Qu’est-ce que c’est ? La tristesse apparaît quand on perd quelque chose d’important (un proche, un rêve, une opportunité) ou qu’on se sent seul. C’est une émotion qui nous ralentit et nous pousse à réfléchir.\nPourquoi on la ressent ? Elle nous aide à accepter une perte et à demander du soutien. Elle est liée à une baisse de certains neurotransmetteurs comme la sérotonine.\nSignes physiques : Larmes, boule dans la gorge, fatigue, envie de se replier sur soi.\nRôle : Elle nous permet de faire le deuil et de signaler aux autres qu’on a besoin d’aide.",
            intensities: [
                { name: "Mélancolie légère", desc: "Un sentiment nostalgique ou pensif, comme regarder la pluie par la fenêtre." },
                { name: "Chagrin modéré", desc: "Une tristesse plus marquée, avec les larmes proches, après une déception." },
                { name: "Désespoir profond", desc: "Une tristesse écrasante, comme après une perte majeure, où tout semble lourd." }
            ]
        },
        "Peur": {
            description: "Qu’est-ce que c’est ? La peur est une réaction face à un danger, réel ou imaginaire. Elle nous alerte pour nous protéger, comme quand on entend un bruit bizarre la nuit.\nPourquoi on la ressent ? Elle est déclenchée par l’amygdale (une partie du cerveau) qui active le mode 'survie' (adrénaline). C’est une émotion instinctive.\nSignes physiques : Cœur qui s’accélère, sueurs, tremblements, envie de fuir ou de se cacher.\nRôle : Elle nous prépare à réagir vite (combattre ou fuir) pour rester en sécurité.",
            intensities: [
                { name: "Inquiétude légère", desc: "Une petite tension ou un doute, alerte mais pas de panique." },
                { name: "Angoisse modérée", desc: "Une peur croissante, comme si quelque chose te suivait dans le noir." },
                { name: "Terreur intense", desc: "Une panique totale face à un danger imminent, où la survie domine." }
            ]
        },
        "Colere": {
            description: "Qu’est-ce que c’est ? La colère surgit quand on se sent attaqué, injustement traité ou bloqué dans un objectif. C’est une énergie puissante qui pousse à agir.\nPourquoi on la ressent ? Elle est liée à une montée d’adrénaline et à un sentiment d’injustice ou de frustration.\nSignes physiques : Mâchoire serrée, chaleur au visage, muscles tendus, voix qui monte.\nRôle : Elle nous aide à défendre nos droits ou à surmonter des obstacles, mais mal gérée, elle peut devenir destructrice.",
            intensities: [
                { name: "Irritation légère", desc: "Un agacement contrôlé, comme quand quelqu’un te coupe la parole." },
                { name: "Frustration modérée", desc: "Une colère qui monte, avec envie de crier, face à une injustice répétée." },
                { name: "Rage explosive", desc: "Une colère hors de contrôle, prête à tout détruire, face à une frustration extrême." }
            ]
        }
    };

    // Initialize loader
    loader = new BABYLON.GUI.Rectangle("loader");
    loader.background = "black";
    loader.color = "white";
    loader.thickness = 0;
    loader.zIndex = 5;
    loader.isVisible = true;
    const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    advancedTexture.addControl(loader);

    const loaderText = new BABYLON.GUI.TextBlock("loaderText");
    loaderText.text = "Chargement...";
    loaderText.color = "white";
    loaderText.fontSize = 20;
    loaderText.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    loaderText.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    loader.addControl(loaderText);

    // Charger la serre
    loadElement(BABYLON.SceneLoader.ImportMeshAsync("", "/objs/", "serre.glb", scene).then((result) => {
        result.meshes.forEach((mesh) => {
            mesh.position = new BABYLON.Vector3(0, 0, 0);
            mesh.scaling = new BABYLON.Vector3(14, 14, 14);
            mesh.isPickable = false;
        });
    }));

    // Load elements only in the first scene
    if (currentMood === null) { // Only load these elements in the home scene
        loadGrass(scene);
        loadPondFlower(scene);
        loadJapDoor(scene);
        loadTreeJap(scene);
    }

    // Arbres normaux
    let tree1 = null, tree2 = null, tree3 = null;
    let tree1Clones = [], tree2Clones = [], tree3Clones = [];
    const tree1Position = new BABYLON.Vector3(-39.72, 0, -129.58);
    const tree2Position = new BABYLON.Vector3(23.30, 0, -133.51);
    const tree3Position = new BABYLON.Vector3(75.49, 0, -100.81);
    const tree1AdditionalPositions = [
        new BABYLON.Vector3(113.59, 0, -53.78),
        new BABYLON.Vector3(95.70, 0, 96.76)
    ];
    const tree2AdditionalPositions = [
        new BABYLON.Vector3(12.90, 0, 129.00),
        new BABYLON.Vector3(-112.00, 0, 61.72)
    ];
    const tree3AdditionalPositions = [
        new BABYLON.Vector3(-128.41, 0, -21.89),
        new BABYLON.Vector3(-99.39, 0, -99.80)
    ];

    const loadNormalTrees = () => {
        if (!tree1) {
            loadElement(BABYLON.SceneLoader.ImportMeshAsync("", "/objs/", "tree1.glb", scene).then((result) => {
                tree1 = result.meshes[0];
                tree1.position = tree1Position;
                tree1.scaling = new BABYLON.Vector3(4.7, 4.7, 4.7);
                tree1.isPickable = false;
                tree1AdditionalPositions.forEach((pos, index) => {
                    const clone = tree1.clone(`tree1_clone_${index}`);
                    clone.position = pos;
                    clone.scaling = new BABYLON.Vector3(4.7, 4.7, 4.7);
                    clone.isPickable = false;
                    tree1Clones.push(clone);
                });
            }));
        }
        if (!tree2) {
            loadElement(BABYLON.SceneLoader.ImportMeshAsync("", "/objs/", "tree2.glb", scene).then((result) => {
                tree2 = result.meshes[0];
                tree2.position = tree2Position;
                tree2.scaling = new BABYLON.Vector3(0.8, 0.8, 0.8);
                tree2.isPickable = false;
                tree2AdditionalPositions.forEach((pos, index) => {
                    const clone = tree2.clone(`tree2_clone_${index}`);
                    clone.position = pos;
                    clone.scaling = new BABYLON.Vector3(0.8, 0.8, 0.8);
                    clone.isPickable = false;
                    tree2Clones.push(clone);
                });
            }));
        }
        if (!tree3) {
            loadElement(BABYLON.SceneLoader.ImportMeshAsync("", "/objs/", "tree3.glb", scene).then((result) => {
                tree3 = result.meshes[0];
                tree3.position = tree3Position;
                tree3.scaling = new BABYLON.Vector3(1.2, 1.2, 1.2);
                tree3.isPickable = false;
                tree3AdditionalPositions.forEach((pos, index) => {
                    const clone = tree3.clone(`tree3_clone_${index}`);
                    clone.position = pos;
                    clone.scaling = new BABYLON.Vector3(1.2, 1.2, 1.2);
                    clone.isPickable = false;
                    tree3Clones.push(clone);
                });
            }));
        }
    };

    // Horror tree
    let horrorTree = null;
    const loadHorrorTree = () => {
        if (horrorTree) {
            horrorTree.dispose();
            horrorTree = null;
        }
        if (currentMood === "Peur") {
            loadElement(BABYLON.SceneLoader.ImportMeshAsync("", "/objs/", "horror_tree.glb", scene).then((result) => {
                if (currentMood === "Peur") {
                    horrorTree = result.meshes[0];
                    horrorTree.position = new BABYLON.Vector3(60, -0.3, -100);
                    horrorTree.rotation = new BABYLON.Vector3(0, -8, 0);
                    horrorTree.scaling = new BABYLON.Vector3(25, 25, 25);
                    horrorTree.isPickable = false;
                } else {
                    result.meshes.forEach(mesh => mesh.dispose());
                }
            }));
        }
    };

    // Modèle Chucky pour Peur (intensité 2 et 3)
    let chucky = null;
    const loadChucky = () => {
        if (chucky) {
            chucky.dispose();
            chucky = null;
        }
        if (currentMood === "Peur" && currentIntensity >= 2) {
            loadElement(BABYLON.SceneLoader.ImportMeshAsync("", "/objs/", "chucky.glb", scene).then((result) => {
                if (currentMood === "Peur" && currentIntensity >= 2) {
                    chucky = result.meshes[0];
                    if (currentIntensity === 2) {
                        chucky.position = new BABYLON.Vector3(0, 0, -50); // Position à intensité 2
                        chucky.scaling = new BABYLON.Vector3(0.1, 0.1, 0.1); // Taille à intensité 2
                        chucky.rotation = new BABYLON.Vector3(0, Math.PI, 0); // Tourne Chucky dos au joueur
                    } else if (currentIntensity === 3) {
                        chucky.position = new BABYLON.Vector3(-20, 0, 50); // Plus près à intensité 3
                        chucky.scaling = new BABYLON.Vector3(0.2, 0.2, 0.2); // Plus grand à intensité 3
                        chucky.rotation = new BABYLON.Vector3(0, 0, 0); // Tourne Chucky face au joueur
                    }
                    chucky.isPickable = false;
                } else {
                    result.meshes.forEach(mesh => mesh.dispose());
                }
            }));
        }
    };

    // Tombes pour Peur
    let tombstones = [];
    const tombstonePositions = [
        new BABYLON.Vector3(-60, -3, -90),
        new BABYLON.Vector3(100, -3, 0),
    ];
    const loadTombstones = () => {
        tombstones.forEach(tomb => tomb.dispose());
        tombstones = [];
        if (currentMood === "Peur" && currentIntensity >= 2) {
            tombstonePositions.forEach((pos, index) => {
                loadElement(BABYLON.SceneLoader.ImportMeshAsync("", "/objs/", `tombstone${index + 1}.glb`, scene).then((result) => {
                    const tomb = result.meshes[0];
                    tomb.position = pos;
                    tomb.scaling = new BABYLON.Vector3(25, 25, 25);
                    tomb.isPickable = false;
                    tombstones.push(tomb);
                }));
            });
        }
    };

    // Banc
    let bench = null;
    const loadBench = () => {
        if (!bench) {
            loadElement(BABYLON.SceneLoader.ImportMeshAsync("", "/objs/", "bench.glb", scene).then((result) => {
                bench = result.meshes[0];
                bench.position = new BABYLON.Vector3(-50, 0, 100);
                bench.scaling = new BABYLON.Vector3(25, 25, 25);
                bench.rotation = new BABYLON.Vector3(0, -10, 0);
                bench.isPickable = false;
            }));
        }
    };
    loadBench();

    // Pommes de pin
    let pineCone = null, pineConeClones = [];
    const pineConePositions = [
        new BABYLON.Vector3(-35, 0, -125),
        new BABYLON.Vector3(25, 0, -130),
        new BABYLON.Vector3(80, 0, -95),
        new BABYLON.Vector3(-110, 0, 60),
        new BABYLON.Vector3(-95, 0, -95)
    ];
    const loadPineCones = () => {
        if (!pineCone) {
            loadElement(BABYLON.SceneLoader.ImportMeshAsync("", "/objs/", "pine_cone.glb", scene).then((result) => {
                pineCone = result.meshes[0];
                pineCone.position = pineConePositions[0];
                pineCone.scaling = new BABYLON.Vector3(1, 1, 1);
                pineCone.isPickable = false;
                pineConePositions.slice(1).forEach((pos, index) => {
                    const clone = pineCone.clone(`pine_cone_clone_${index}`);
                    clone.position = pos;
                    clone.scaling = new BABYLON.Vector3(1, 1, 1);
                    clone.isPickable = false;
                    pineConeClones.push(clone);
                });
            }));
        }
    };

    // Sol
    const ground = BABYLON.MeshBuilder.CreateDisc("ground", { radius: 195, tessellation: 10 }, scene);
    ground.rotation.x = Math.PI / 2;
    ground.position.y = -0.1;
    ground.rotation.y = Math.PI / 10;
    ground.material = new BABYLON.StandardMaterial("groundMat", scene);
    ground.material.diffuseTexture = new BABYLON.Texture("/textures/grass.jpg", scene);
    ground.material.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
    ground.isPickable = false;

    // Fond étoilé
    let currentDome = new BABYLON.PhotoDome("starDome", "/textures/background.jpg", { resolution: 32, size: 1000 }, scene);
    currentDome.isPickable = false;

    // Humeurs
    const moods = [
        { name: "Joie", sphere: null, position: new BABYLON.Vector3(-150, 5, 0), color: new BABYLON.Color3(1, 0.85, 0.3), background: "/textures/background-joie.jpg", groundTexture: "/textures/grass.jpg" },
        { name: "Peur", sphere: null, position: new BABYLON.Vector3(0, 4, -110), color: new BABYLON.Color3(0.4, 0.2, 1), background: "/textures/background2.jpg", groundTexture: "/textures/dark_forest.jpg" },
        { name: "Colere", sphere: null, position: new BABYLON.Vector3(80, 4, 0), color: new BABYLON.Color3(1, 0.3, 0.3), background: "/textures/background-colere.jpg", groundTexture: "/textures/lava.jpg" },
        { name: "Triste", sphere: null, position: new BABYLON.Vector3(0, 4, 110), color: new BABYLON.Color3(0.3, 0.5, 1), background: "/textures/background-triste.jpg", groundTexture: "/textures/grass.jpg" }
    ];

    const glowLayer = new BABYLON.GlowLayer("glow", scene);
    glowLayer.intensity = 0.1;
    moods.forEach((mood) => {
        const sphere = BABYLON.MeshBuilder.CreateSphere(mood.name, { diameter: 8 }, scene);
        sphere.position = mood.position;
        sphere.material = new BABYLON.StandardMaterial(`${mood.name}Mat`, scene);
        sphere.material.emissiveColor = mood.color;
        sphere.material.specularColor = new BABYLON.Color3(1, 1, 1);
        sphere.metadata = { name: mood.name, background: mood.background, groundTexture: mood.groundTexture };
        sphere.isPickable = true;
        mood.sphere = sphere;
    });

    // Caméra
    const camera = new BABYLON.ArcRotateCamera("cam", Math.PI / 2, Math.PI / 2, 0, new BABYLON.Vector3(0, 30, 0), scene);
    camera.attachControl(canvas, true);
    camera.lowerRadiusLimit = 80;
    camera.upperRadiusLimit = 600;
    camera.lowerBetaLimit = 0.1;
    camera.upperBetaLimit = Math.PI;

    // Lumière
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7;
    const moodLight = new BABYLON.PointLight("moodLight", new BABYLON.Vector3(0, 50, 0), scene);
    moodLight.intensity = 0;

    // Pluie
    const rain = new BABYLON.ParticleSystem("rain", 20000, scene);
    rain.particleTexture = new BABYLON.Texture("textures/water-drop.png", scene);
    rain.emitter = new BABYLON.Vector3(0, 150, 0);
    rain.minEmitBox = new BABYLON.Vector3(-120, -50, -150);
    rain.maxEmitBox = new BABYLON.Vector3(100, 0, 100);
    rain.color1 = new BABYLON.Color4(0.7, 0.8, 1.0, 0.8);
    rain.color2 = new BABYLON.Color4(0.5, 0.7, 1.0, 0.6);
    rain.colorDead = new BABYLON.Color4(0, 0, 1, 0);
    rain.minSize = 1;
    rain.maxSize = 2;
    rain.direction1 = new BABYLON.Vector3(0, -1, 0);
    rain.direction2 = new BABYLON.Vector3(0, -1, 0);
    rain.gravity = new BABYLON.Vector3(0, -190.81, 0);
    rain.blendMode = BABYLON.ParticleSystem.BLENDMODE_STANDARD;

    // Feu
    const fire = new BABYLON.ParticleSystem("fire", 300, scene);
    fire.particleTexture = new BABYLON.Texture("/textures/fire.png", scene);
    fire.emitter = currentDome;
    fire.minEmitBox = new BABYLON.Vector3(-190, 0, -170);
    fire.maxEmitBox = new BABYLON.Vector3(200, -1, 200);
    fire.color1 = new BABYLON.Color4(1, 0.5, 0, 1);
    fire.color2 = new BABYLON.Color4(1, 0, 0, 1);
    fire.colorDead = new BABYLON.Color4(0.5, 0.2, 0, 0);
    fire.minSize = 15;
    fire.maxSize = 20;
    fire.direction1 = new BABYLON.Vector3(-0.1, 1, -0.1);
    fire.direction2 = new BABYLON.Vector3(0.1, 1.5, 0.1);
    fire.gravity = new BABYLON.Vector3(0, 0, 0);
    fire.blendMode = BABYLON.ParticleSystem.BLENDMODE_ADD;
    fire.updateFunction = function(particles) {
        for (let index = 0; index < particles.length; index++) {
            let particle = particles[index];
            particle.age += this._scaledUpdateSpeed;
            if (particle.age >= particle.lifeTime) {
                this.recycleParticle(particle);
                continue;
            }
            let ratio = particle.age / particle.lifeTime;
            particle.size = fire.minSize + (fire.maxSize - fire.minSize) * ratio;
            particle.position.x += particle.direction.x * this._scaledUpdateSpeed;
            particle.position.y += particle.direction.y * this._scaledUpdateSpeed;
            particle.position.z += particle.direction.z * this._scaledUpdateSpeed;
            let distanceFromCenter = BABYLON.Vector3.Distance(particle.position, BABYLON.Vector3.Zero());
            if (distanceFromCenter > 175) {
                let normalizedPos = particle.position.normalize().scale(175);
                particle.position = normalizedPos;
            }
        }
    };

    // Explosion
    const explosion = new BABYLON.ParticleSystem("explosion", 50, scene);
    explosion.particleTexture = new BABYLON.Texture("/textures/explosion.png", scene);
    explosion.emitter = new BABYLON.Vector3(0, 0, 0);
    explosion.minEmitBox = new BABYLON.Vector3(-150, 0, -150);
    explosion.maxEmitBox = new BABYLON.Vector3(150, 50, 150);
    explosion.color1 = new BABYLON.Color4(1, 0.5, 0, 1);
    explosion.color2 = new BABYLON.Color4(1, 0, 0, 1);
    explosion.colorDead = new BABYLON.Color4(0, 0, 0, 0);
    explosion.minSize = 20;
    explosion.maxSize = 40;
    explosion.emitRate = 10;
    explosion.minLifeTime = 0.5;
    explosion.maxLifeTime = 1.0;
    explosion.direction1 = new BABYLON.Vector3(-1, 1, -1);
    explosion.direction2 = new BABYLON.Vector3(1, 2, 1);
    explosion.gravity = new BABYLON.Vector3(0, -10, 0);
    explosion.blendMode = BABYLON.ParticleSystem.BLENDMODE_ADD;

    // Tonnerre
    const createThunderSystem = () => {
        const thunderLight = new BABYLON.PointLight("thunderLight", new BABYLON.Vector3(0, 100, 0), scene);
        thunderLight.intensity = 0;
        thunderLight.diffuse = new BABYLON.Color3(0.8, 0.9, 1);
        thunderLight.specular = new BABYLON.Color3(1, 1, 1);
        const thunderSounds = [
            new BABYLON.Sound("thunder1", "sounds/thunder1.mp3", scene, null, { autoplay: false, loop: false }),
            new BABYLON.Sound("thunder2", "sounds/thunder2.mp3", scene, null, { autoplay: false, loop: false }),
            new BABYLON.Sound("thunder3", "sounds/thunder3.mp3", scene, null, { autoplay: false, loop: false })
        ];
        const triggerThunder = () => {
            const randomSound = thunderSounds[Math.floor(Math.random() * thunderSounds.length)];
            thunderLight.intensity = 2.0;
            setTimeout(() => thunderLight.intensity = 0, 100 + Math.random() * 200);
            setTimeout(() => randomSound.play(), Math.random() * 500);
        };
        let thunderInterval = null;
        const startThunder = (interval) => {
            if (!thunderInterval) {
                thunderInterval = setInterval(triggerThunder, interval);
            }
        };
        const stopThunder = () => {
            if (thunderInterval) {
                clearInterval(thunderInterval);
                thunderInterval = null;
            }
            thunderLight.intensity = 0;
        };
        return { startThunder, stopThunder };
    };
    const thunderSystem = createThunderSystem();

    // Papillons
    const butterflies = new BABYLON.ParticleSystem("butterflies", 4000, scene);
    butterflies.particleTexture = new BABYLON.Texture("textures/butterfly.png", scene);
    butterflies.emitter = new BABYLON.Vector3(0, 20, 0);
    butterflies.minEmitBox = new BABYLON.Vector3(-195, 0, -195);
    butterflies.maxEmitBox = new BABYLON.Vector3(150, 10, 150);
    butterflies.color1 = new BABYLON.Color4(1, 0.8, 0, 1);
    butterflies.color2 = new BABYLON.Color4(1, 1, 0, 1);
    butterflies.minSize = 3;
    butterflies.maxSize = 5;

    // GUI
    const notification = new BABYLON.GUI.TextBlock("notification");
    notification.text = "";
    notification.color = "white";
    notification.background = "black";
    notification.fontSize = 15;
    notification.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    notification.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    notification.paddingTop = "20px";
    notification.paddingRight = "20px";
    advancedTexture.addControl(notification);

    infoButton = BABYLON.GUI.Button.CreateImageOnlyButton("infoButton", "/textures/info-icon.png");
    infoButton.width = "50px";
    infoButton.background = "white";
    infoButton.height = "30px";
    infoButton.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    infoButton.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    infoButton.top = "60px";
    infoButton.paddingRight = "20px";
    infoButton.isVisible = false;
    infoButton.cornerRadius = 20;
    infoButton.thickness = 0;
    infoButton.metadata = { className: "info-button" };
    advancedTexture.addControl(infoButton);

    descriptionModal = new BABYLON.GUI.Rectangle("descriptionModal");
    descriptionModal.width = "500px";
    descriptionModal.height = "400px";
    descriptionModal.background = "rgb(0, 0, 0)";
    descriptionModal.color = "grey";
    descriptionModal.thickness = 2;
    descriptionModal.cornerRadius = 20;
    descriptionModal.isVisible = false;
    descriptionModal.metadata = { className: "description-modal" };
    advancedTexture.addControl(descriptionModal);

    const modalText = new BABYLON.GUI.TextBlock("modalText");
    modalText.text = "";
    modalText.color = "white";
    modalText.fontSize = 18;
    modalText.textWrapping = true;
    modalText.paddingLeft = "20px";
    modalText.paddingTop = "20px";
    modalText.paddingRight = "20px";
    modalText.cornerRadius = 20;
    modalText.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    modalText.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    descriptionModal.addControl(modalText);

    closeButton = BABYLON.GUI.Button.CreateSimpleButton("closeButton", "Fermer");
    closeButton.width = "100px";
    closeButton.height = "40px";
    closeButton.color = "white";
    closeButton.background = "black";
    closeButton.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    closeButton.top = "-20px";
    closeButton.cornerRadius = 20;
    closeButton.metadata = { className: "close-button" };
    closeButton.onPointerUpObservable.add(() => {
        descriptionModal.isVisible = false;
    });
    descriptionModal.addControl(closeButton);

    infoButton.onPointerUpObservable.add(() => {
        if (currentMood && moodData[currentMood]) {
            modalText.text = moodData[currentMood].description;
            descriptionModal.isVisible = true;
        }
    });

    const screamerModal = new BABYLON.GUI.Rectangle("screamerModal");
    screamerModal.width = 1.0;
    screamerModal.height = 1.0;
    screamerModal.thickness = 0;
    screamerModal.background = "transparent";
    screamerModal.isVisible = false;
    advancedTexture.addControl(screamerModal);

    const screamerImage = new BABYLON.GUI.Image("screamerImage", "/textures/screamer.png");
    screamerImage.stretch = BABYLON.GUI.Image.STRETCH_FILL;
    screamerImage.width = 1.0;
    screamerImage.height = 1.0;
    screamerModal.addControl(screamerImage);

    const screamerSound = new BABYLON.Sound("screamerSound", "/sounds/scream.mp3", scene, null, { autoplay: false, loop: false, volume: 1.0 });

    const triggerScreamer = (callback) => {
        screamerModal.isVisible = true;
        screamerSound.play();
        setTimeout(() => {
            screamerModal.isVisible = false;
            if (callback) callback();
        }, 1000);
    };

    const stopFireInstantly = () => {
        fire.stop();
        fire.reset();
    };

    let deadTree = null;
    let flowers = [];

    intensityPanel = new BABYLON.GUI.StackPanel("intensityPanel");
    intensityPanel.isVertical = true;
    intensityPanel.width = "200px";
    intensityPanel.paddingLeft = "20px";
    intensityPanel.paddingTop = "15px";
    intensityPanel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    intensityPanel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    intensityPanel.isVisible = false;
    intensityPanel.metadata = { className: "intensity-panel" };
    advancedTexture.addControl(intensityPanel);

    intensityButtons = [];
    for (let i = 1; i <= 3; i++) {
        const button = BABYLON.GUI.Button.CreateSimpleButton(`intensity${i}`, "");
        button.metadata = { className: `intensity-button intensity-button-${i}` };
        button.height = "40px";
        button.color = "white";
        button.cornerRadius = 20;
        button.background = i === currentIntensity ? "black" : "black";
        button.paddingTop = "10px";
        button.fontSize = 13;
        button.onPointerUpObservable.add(() => {
            currentIntensity = i;
            intensityButtons.forEach((btn, idx) => {
                btn.background = (idx + 1 === i) ? moods.find(mood => mood.name === currentMood).color.toHexString() : "black";
            });
            updateMoodEffects();
        });
        intensityPanel.addControl(button);
        intensityButtons.push(button);
    }

    // Met à jour les noms des boutons en fonction de l'humeur
    const updateIntensityButtonNames = () => {
        if (currentMood && moodData[currentMood]) {
            intensityButtons.forEach((button, index) => {
                button.children[0].text = moodData[currentMood].intensities[index].name;
            });
        }
    };

    // Fonction pour mettre à jour les effets selon l'intensité
    const updateMoodEffects = () => {
        if (!currentMood) return;

        const intensityDesc = moodData[currentMood].intensities[currentIntensity - 1].desc;
        butterflies.stop();
        rain.stop();
        stopFireInstantly();
        explosion.stop();
        thunderSystem.stopThunder();
        moodLight.intensity = 0;
        scene.fogDensity = 0;
        scene.animationsEnabled = true;

        // Arrêter toutes les animations existantes et supprimer Chucky si intensité < 2 pour "Peur"
        flowers.forEach(flower => {
            if (flower && flower.animations.length > 0) {
                scene.stopAnimation(flower);
                flower.animations = [];
            }
        });
        [tree1, tree2, tree3, ...tree1Clones, ...tree2Clones, ...tree3Clones].forEach(tree => {
            if (tree && tree.animations.length > 0) {
                scene.stopAnimation(tree);
                tree.animations = [];
            }
        });
        if (horrorTree && horrorTree.animations.length > 0) {
            scene.stopAnimation(horrorTree);
            horrorTree.animations = [];
        }
        if (deadTree && deadTree.animations.length > 0) {
            scene.stopAnimation(deadTree);
            deadTree.animations = [];
        }
        if (chucky) {
            if (currentMood !== "Peur" || currentIntensity < 2) {
                chucky.dispose();
                chucky = null;
            } else if (chucky.animations && chucky.animations.length > 0) {
                scene.stopAnimation(chucky);
                chucky.animations = [];
            }
        }

        updateButtonColors();

        switch (currentMood) {
            case "Joie":
                butterflies.emitRate = 50 * currentIntensity;
                butterflies.minEmitPower = 0.5 * currentIntensity;
                butterflies.maxEmitPower = 1 * currentIntensity;
                butterflies.start();
                if (currentIntensity === 1) {
                    moodLight.intensity = 0.5;
                    moodLight.diffuse = new BABYLON.Color3(1, 0.8, 0);
                    const pulse = new BABYLON.Animation("pulse", "intensity", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
                    pulse.setKeys([{ frame: 0, value: 0.5 }, { frame: 15, value: 0.7 }, { frame: 30, value: 0.5 }]);
                    moodLight.animations = [pulse];
                    scene.beginAnimation(moodLight, 0, 30, true);
                } else if (currentIntensity === 2) {
                    moodLight.intensity = 1;
                    moodLight.diffuse = new BABYLON.Color3(1, 0.9, 0);
                    const pulse = new BABYLON.Animation("pulse", "intensity", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
                    pulse.setKeys([{ frame: 0, value: 1 }, { frame: 30, value: 1.5 }, { frame: 60, value: 1 }]);
                    moodLight.animations = [pulse];
                    scene.beginAnimation(moodLight, 0, 60, true);
                    flowers.forEach(flower => {
                        const sway = new BABYLON.Animation("sway", "rotation.y", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
                        sway.setKeys([{ frame: 0, value: 0 }, { frame: 15, value: 0.1 }, { frame: 30, value: 0 }]);
                        flower.animations = [sway];
                        scene.beginAnimation(flower, 0, 30, true);
                    });
                } else if (currentIntensity === 3) {
                    moodLight.intensity = 2;
                    moodLight.diffuse = new BABYLON.Color3(1, 1, 0);
                    const strobe = new BABYLON.Animation("strobe", "intensity", 120, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
                    strobe.setKeys([{ frame: 0, value: 2 }, { frame: 30, value: 0.5 }, { frame: 60, value: 2 }, { frame: 90, value: 0.5 }, { frame: 120, value: 2 }]);
                    moodLight.animations = [strobe];
                    scene.beginAnimation(moodLight, 0, 120, true);
                    flowers.forEach(flower => {
                        const dance = new BABYLON.Animation("dance", "scaling", 60, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
                        dance.setKeys([{ frame: 0, value: new BABYLON.Vector3(1, 1, 1) }, { frame: 30, value: new BABYLON.Vector3(1.2, 1.2, 1.2) }, { frame: 60, value: new BABYLON.Vector3(1, 1, 1) }]);
                        flower.animations = [dance];
                        scene.beginAnimation(flower, 0, 60, true);
                    });
                }
                break;

            case "Triste":
                rain.emitRate = 2000 * currentIntensity;
                rain.minEmitPower = 5 * currentIntensity;
                rain.maxEmitPower = 10 * currentIntensity;
                rain.start();
                if (currentIntensity === 1) {
                    moodLight.intensity = 0.3;
                    moodLight.diffuse = new BABYLON.Color3(0.5, 0.5, 0.5);
                } else if (currentIntensity === 2) {
                    moodLight.intensity = 0.2;
                    [tree1, tree2, tree3, ...tree1Clones, ...tree2Clones, ...tree3Clones].forEach(tree => {
                        if (tree) {
                            const bend = new BABYLON.Animation("bend", "rotation.z", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
                            bend.setKeys([{ frame: 0, value: 0 }, { frame: 15, value: 0.05 }, { frame: 30, value: 0 }]);
                            tree.animations = [bend];
                            scene.beginAnimation(tree, 0, 30, true);
                        }
                    });
                } else if (currentIntensity === 3) {
                    moodLight.intensity = 0.1;
                    [tree1, tree2, tree3, ...tree1Clones, ...tree2Clones, ...tree3Clones].forEach(tree => {
                        if (tree) {
                            const shake = new BABYLON.Animation("shake", "rotation.z", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
                            shake.setKeys([{ frame: 0, value: 0 }, { frame: 15, value: 0.1 }, { frame: 30, value: -0.1 }, { frame: 45, value: 0.1 }, { frame: 60, value: 0 }]);
                            tree.animations = [shake];
                            scene.beginAnimation(tree, 0, 60, true);
                        }
                    });
                }
                break;

            case "Peur":
                loadTombstones();
                scene.fogMode = BABYLON.Scene.FOGMODE_EXP;
                scene.fogColor = new BABYLON.Color3(0.5, 0.5, 0.5);
                if (horrorTree) {
                    if (currentIntensity === 1) {
                        moodLight.intensity = 0.2;
                        moodLight.diffuse = new BABYLON.Color3(0.4, 0.1, 1);
                        const flicker = new BABYLON.Animation("flicker", "intensity", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
                        flicker.setKeys([{ frame: 0, value: 0.2 }, { frame: 15, value: 0.3 }, { frame: 30, value: 0.2 }]);
                        moodLight.animations = [flicker];
                        scene.beginAnimation(moodLight, 0, 30, true);
                        const tremble = new BABYLON.Animation("tremble", "rotation.y", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
                        tremble.setKeys([{ frame: 0, value: -8 }, { frame: 15, value: -8.05 }, { frame: 30, value: -8 }]);
                        horrorTree.animations = [tremble];
                        scene.beginAnimation(horrorTree, 0, 30, true);
                    } else if (currentIntensity === 2) {
                        scene.fogDensity = 0.0001;
                        thunderSystem.startThunder(5000);
                        moodLight.intensity = 0.5;
                        moodLight.diffuse = new BABYLON.Color3(0.4, 0.1, 1);
                        const flicker = new BABYLON.Animation("flicker", "intensity", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
                        flicker.setKeys([{ frame: 0, value: 0.5 }, { frame: 15, value: 0 }, { frame: 30, value: 0.5 }, { frame: 45, value: 0 }, { frame: 60, value: 0.5 }]);
                        moodLight.animations = [flicker];
                        scene.beginAnimation(moodLight, 0, 60, true);
                        loadChucky(); // Charger Chucky à intensité 2
                        if (chucky) {
                            const sway = new BABYLON.Animation("sway", "rotation.y", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
                            sway.setKeys([{ frame: 0, value: Math.PI }, { frame: 30, value: Math.PI + 0.1 }, { frame: 60, value: Math.PI }]);
                            chucky.animations = [sway];
                            scene.beginAnimation(chucky, 0, 60, true);
                        }
                    } else if (currentIntensity === 3) {
                        scene.fogDensity = 0.0004;
                        thunderSystem.startThunder(2000);
                        moodLight.intensity = 1;
                        moodLight.diffuse = new BABYLON.Color3(0.4, 0.1, 1);
                        const strobe = new BABYLON.Animation("strobe", "intensity", 120, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
                        strobe.setKeys([{ frame: 0, value: 1 }, { frame: 30, value: 0 }, { frame: 60, value: 1 }, { frame: 90, value: 0 }, { frame: 120, value: 1 }]);
                        moodLight.animations = [strobe];
                        scene.beginAnimation(moodLight, 0, 120, true);
                        setTimeout(() => triggerScreamer(() => {}), 500);
                        loadChucky(); // Charger Chucky à intensité 3 (plus près et plus grand)
                        if (chucky) {
                            const sway = new BABYLON.Animation("sway", "rotation.y", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
                            sway.setKeys([{ frame: 0, value: Math.PI }, { frame: 30, value: Math.PI + 0.2 }, { frame: 60, value: Math.PI }]);
                            chucky.animations = [sway];
                            scene.beginAnimation(chucky, 0, 60, true);
                        }
                    }
                }
                break;

            case "Colere":
                fire.emitRate = 400 * currentIntensity * currentIntensity;
                fire.minEmitPower = 5 * currentIntensity;
                fire.maxEmitPower = 10 * currentIntensity;
                fire.start();
                explosion.stop();
                if (deadTree) {
                    if (currentIntensity === 1) {
                        moodLight.intensity = 0.5;
                        moodLight.diffuse = new BABYLON.Color3(1, 0.2, 0);
                        const crack = new BABYLON.Animation("crack", "rotation.y", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
                        crack.setKeys([{ frame: 0, value: 0 }, { frame: 15, value: 0.05 }, { frame: 30, value: 0 }]);
                        deadTree.animations = [crack];
                        scene.beginAnimation(deadTree, 0, 30, true);
                        scene.fogMode = BABYLON.Scene.FOGMODE_EXP;
                        scene.fogColor = new BABYLON.Color3(0.5, 0, 0);
                        scene.fogDensity = 0.0001;
                    } else if (currentIntensity === 2) {
                        thunderSystem.startThunder(5000);
                        moodLight.intensity = 1.2;
                        moodLight.diffuse = new BABYLON.Color3(1, 0.1, 0);
                        const pulse = new BABYLON.Animation("pulse", "intensity", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
                        pulse.setKeys([{ frame: 0, value: 1.2 }, { frame: 30, value: 1.8 }, { frame: 60, value: 1.2 }]);
                        moodLight.animations = [pulse];
                        scene.beginAnimation(moodLight, 0, 60, true);
                        const shake = new BABYLON.Animation("shake", "rotation.y", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
                        shake.setKeys([{ frame: 0, value: 0 }, { frame: 7, value: 0.15 }, { frame: 15, value: -0.15 }, { frame: 23, value: 0.15 }, { frame: 30, value: 0 }]);
                        deadTree.animations = [shake];
                        scene.beginAnimation(deadTree, 0, 30, true);
                        scene.fogDensity = 0.0003;
                    } else if (currentIntensity === 3) {
                        thunderSystem.startThunder(1500);
                        moodLight.intensity = 2.5;
                        moodLight.diffuse = new BAScreamerModalABYLON.Color3(1, 0, 0);
                        const strobe = new BABYLON.Animation("strobe", "intensity", 120, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
                        strobe.setKeys([{ frame: 0, value: 2.5 }, { frame: 20, value: 0.8 }, { frame: 40, value: 2.5 }, { frame: 60, value: 0.8 }, { frame: 80, value: 2.5 }]);
                        moodLight.animations = [strobe];
                        scene.beginAnimation(moodLight, 0, 120, true);
                        const burn = new BABYLON.Animation("burn", "rotation.y", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
                        burn.setKeys([{ frame: 0, value: 0 }, { frame: 15, value: 0.3 }, { frame: 30, value: -0.3 }, { frame: 45, value: 0.3 }, { frame: 60, value: 0 }]);
                        deadTree.animations = [burn];
                        scene.beginAnimation(deadTree, 0, 60, true);
                        scene.fogDensity = 0.0006;
                        explosion.emitRate = 20;
                        explosion.start();
                    }
                }
                break;
        }
        notification.text = intensityDesc;
    };

    const updateButtonColors = () => {
        if (currentMood && moodData[currentMood]) {
            const moodColor = moods.find(mood => mood.name === currentMood).color;
            intensityButtons.forEach(button => {
                button.background = button.metadata.className.includes(`intensity-button-${currentIntensity}`) ? moodColor.toHexString() : "black";
                button.onPointerEnterObservable.add(() => {
                    button.background = moodColor.toHexString();
                });
                button.onPointerOutObservable.add(() => {
                    button.background = button.metadata.className.includes(`intensity-button-${currentIntensity}`) ? moodColor.toHexString() : "black";
                });
                button.onPointerDownObservable.add(() => {
                    button.background = moodColor.toHexString();
                });
                button.onPointerUpObservable.add(() => {
                    button.background = button.metadata.className.includes(`intensity-button-${currentIntensity}`) ? moodColor.toHexString() : "black";
                });
            });
        }
    };

    // Gestion des clics
    scene.onPointerObservable.add((pointerInfo) => {
        if (pointerInfo.type === BABYLON.PointerEventTypes.POINTERDOWN) {
            const pickResult = pointerInfo.pickInfo;
            if (pickResult.hit && pickResult.pickedMesh && pickResult.pickedMesh.metadata && moodData[pickResult.pickedMesh.metadata.name]) {
                const mesh = pickResult.pickedMesh;
                const newBackground = mesh.metadata.background;
                const newGroundTexture = mesh.metadata.groundTexture;

                currentMood = mesh.metadata.name;
                currentIntensity = 1;

                updateIntensityButtonNames();
                intensityPanel.isVisible = true;
                infoButton.isVisible = true;

                loader.isVisible = true;
                elementsToLoad = 0;
                elementsLoaded = 0;

                butterflies.stop();
                rain.stop();
                stopFireInstantly();
                explosion.stop();
                thunderSystem.stopThunder();
                screamerModal.isVisible = false;
                tombstones.forEach(tomb => tomb.dispose());
                tombstones = [];

                if (tree1) { tree1.dispose(); tree1 = null; }
                if (tree2) { tree2.dispose(); tree2 = null; }
                if (tree3) { tree3.dispose(); tree3 = null; }
                tree1Clones.forEach(clone => clone.dispose()); tree1Clones = [];
                tree2Clones.forEach(clone => clone.dispose()); tree2Clones = [];
                tree3Clones.forEach(clone => clone.dispose()); tree3Clones = [];
                if (pineCone) { pineCone.dispose(); pineCone = null; }
                pineConeClones.forEach(clone => clone.dispose()); pineConeClones = [];
                if (bench) { bench.dispose(); bench = null; }
                if (horrorTree && currentMood !== "Peur") { horrorTree.dispose(); horrorTree = null; }
                if (deadTree) { deadTree.dispose(); deadTree = null; }
                if (chucky) { chucky.dispose(); chucky = null; } // Supprimer Chucky lors du changement d'humeur
                flowers.forEach(flower => { if (flower) flower.dispose(); }); flowers = [];
                if (JapDoor) { JapDoor.dispose(); JapDoor = null;  }
                if (pondFlower) { pondFlower.dispose(); pondFlower = null; }
                if (treeJap) {treeJap.dispose(); treeJap = null; }
                if (grass) {grass.dispose(); grass = null; }
                if (grassClones) {grassClones.forEach(clone => clone.dispose()); grassClones = [];}


                switch (currentMood) {
                    case "Joie":
                        loadNormalTrees();
                        loadBench();
                        loadPineCones();
                        const flowerFiles = ["flower1.glb", "flower2.glb", "flower3.glb", "flower4.glb"];
                        const positions = [
                            new BABYLON.Vector3(50, -10, 50),
                            new BABYLON.Vector3(-50, -10, 50),
                            new BABYLON.Vector3(50, -10, -50),
                            new BABYLON.Vector3(-50, -10, -50)
                        ];
                        flowerFiles.forEach((file, index) => {
                            loadElement(BABYLON.SceneLoader.ImportMeshAsync("", "/objs/", file, scene).then((result) => {
                                const flower = result.meshes[0];
                                flower.position = positions[index];
                                flower.scaling = new BABYLON.Vector3(1, 1, 1);
                                flower.isPickable = false;
                                flowers[index] = flower;
                            }));
                        });
                        break;
                    case "Peur":
                        loadBench();
                        loadHorrorTree();
                        loadTombstones();
                        break;
                    case "Colere":
                        loadElement(BABYLON.SceneLoader.ImportMeshAsync("", "/objs/", "dead-tree.glb", scene).then((result) => {
                            deadTree = result.meshes[0];
                            deadTree.position = new BABYLON.Vector3(50, -5, -50);
                            deadTree.scaling = new BABYLON.Vector3(4, 4, 4);
                            deadTree.isPickable = false;
                        }));
                        break;
                    case "Triste":
                        loadNormalTrees();
                        loadBench();
                        loadPineCones();
                        break;
                }

                if (currentDome) currentDome.dispose();
                currentDome = new BABYLON.PhotoDome("starDome", newBackground, { resolution: 32, size: 1000 }, scene);
                currentDome.isPickable = false;
                ground.material.diffuseTexture = new BABYLON.Texture(newGroundTexture, scene);

                notification.text = moodData[currentMood].intensities[0].desc;
                updateMoodEffects();

                console.log(`Background changé pour : ${currentMood} (${newBackground})`);
                updateButtonColors();
            }
        }
    });

    return scene;
};

const scene = createScene();

engine.runRenderLoop(() => {
    scene.render();
});

window.addEventListener("resize", () => {
    engine.resize();
});