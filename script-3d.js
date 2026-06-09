// =======================
// 3D ESCAPE ROOM - Three.js Implementation
// =======================

// Game State
const gameState = {
    currentRoom: 1,
    completedRooms: [],
    collectedClues: [],
    score: 0,
    totalQuestions: 0,
    correctAnswers: 0,
    answeredQuestions: {},
    playerName: localStorage.getItem('odysseyPlayerName') || '',
    difficulty: 'normal',
    leaderboard: JSON.parse(localStorage.getItem('odysseyLeaderboard')) || []
};

// Three.js Setup
let scene, camera, renderer;
let currentRoom3D = null;
let interactableObjects = [];
let player = {
    position: new THREE.Vector3(0, 1.8, 0),
    velocity: new THREE.Vector3(0, 0, 0),
    speed: 0.1,
    jumpPower: 0.5,
    isJumping: false
};

// Room Data with 3D descriptions
const roomsData = [
    {
        id: 1,
        title: "🏛️ Δωμάτιο 1: Η Αναχώρηση από την Τροία",
        narration: "Ο Οδυσσέας και οι συνοδοί του έφυγαν από τη Τροία μετά την πολιορκία.",
        questions: [
            {
                type: "trueFalse",
                question: "Η Οδύσσεια διαρκεί δέκα χρόνια.",
                answer: true
            },
            {
                type: "trueFalse",
                question: "Ο Ποσειδώνας ήταν υπέρ του Οδυσσέα.",
                answer: false
            }
        ],
        clue: "Η Τροία ήταν σε Ασία Μικρά 🗺️"
    },
    {
        id: 2,
        title: "⚡ Δωμάτιο 2: Ο Κύκλωπας Πολύφημος",
        narration: "Ο Οδυσσέας και οι άνδρες του συναντούν το φοβερό κτήνος του Κύκλωπα.",
        questions: [
            {
                type: "trueFalse",
                question: "Ο Πολύφημος είχε δύο μάτια.",
                answer: false
            }
        ],
        clue: "Ο Πολύφημος ήταν γιος του Ποσειδώνα 👁️"
    },
    {
        id: 3,
        title: "🌊 Δωμάτιο 3: Η Κίρκη και η Μαγεία",
        narration: "Ο Οδυσσέας φτάνει σε ένα νησί όπου μένει η μάγισσα Κίρκη.",
        questions: [
            {
                type: "trueFalse",
                question: "Η Κίρκη μετέτρεψε τους άνδρες σε χοίρους.",
                answer: true
            }
        ],
        clue: "Η Κίρκη ήταν θυγατέρα του Ηλίου ☀️"
    },
    {
        id: 4,
        title: "🪦 Δωμάτιο 4: Το Κάτω Κόσμο",
        narration: "Ο Οδυσσέας κατεβαίνει στο κάτω κόσμο για να συμβουλευτεί το φάντασμα του μάντη.",
        questions: [
            {
                type: "trueFalse",
                question: "Ο Τειρεσίας ήταν ένας ζωντανός μάντης.",
                answer: false
            }
        ],
        clue: "Ο Τειρεσίας προφήτευσε την επιστροφή του Οδυσσέα ⚗️"
    },
    {
        id: 5,
        title: "🏠 Δωμάτιο 5: Η Επιστροφή στην Ιθάκη",
        narration: "Μετά από δέκα χρόνια δοκιμασιών, ο Οδυσσέας τελικά επιστρέφει στη πατρίδα του.",
        questions: [
            {
                type: "trueFalse",
                question: "Η Πηνελόπη περίμενε τον Οδυσσέα για δέκα χρόνια.",
                answer: true
            }
        ],
        clue: "Η Ιθάκη είναι ένα νησί στο Ιόνιο Πέλαγος 🏝️"
    }
];

// Initialize Game
function init() {
    // Scene Setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a);
    scene.fog = new THREE.Fog(0x1a1a1a, 100, 1000);

    // Camera Setup
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.copy(player.position);

    // Renderer Setup
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.getElementById('canvas-container').appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(50, 50, 50);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Event Listeners
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', onWindowResize);
    document.addEventListener('click', onClick);

    // Start Animation Loop
    hideLoadingScreen();
}

// Create 3D Room
function create3DRoom(roomNumber) {
    // Clear previous room
    if (currentRoom3D) {
        scene.remove(currentRoom3D);
    }

    currentRoom3D = new THREE.Group();
    const room = roomsData[roomNumber - 1];

    // Create room based on room number
    switch(roomNumber) {
        case 1:
            createTrojanRoom(currentRoom3D);
            break;
        case 2:
            createCyclopsRoom(currentRoom3D);
            break;
        case 3:
            createCirceRoom(currentRoom3D);
            break;
        case 4:
            createUnderworldRoom(currentRoom3D);
            break;
        case 5:
            createHomecomeRoom(currentRoom3D);
            break;
    }

    scene.add(currentRoom3D);
    player.position.set(0, 1.8, 0);
    player.velocity.set(0, 0, 0);
    camera.position.copy(player.position);
}

// Room Creators
function createTrojanRoom(group) {
    // Floor
    const floorGeometry = new THREE.PlaneGeometry(100, 100);
    const floorMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x8B7355,
        roughness: 0.8
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    group.add(floor);

    // Walls
    createWall(group, 0, 5, 50, 10, 100);
    createWall(group, 0, 5, -50, 10, 100);
    createWall(group, 50, 5, 0, 10, 100);
    createWall(group, -50, 5, 0, 10, 100);

    // Trojan Ship
    const shipGroup = new THREE.Group();
    
    // Hull
    const hullGeometry = new THREE.ConeGeometry(8, 25, 8);
    const hullMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    const hull = new THREE.Mesh(hullGeometry, hullMaterial);
    hull.position.set(-30, 3, -20);
    hull.castShadow = true;
    hull.receiveShadow = true;
    shipGroup.add(hull);

    // Mast
    const mastGeometry = new THREE.CylinderGeometry(0.5, 0.5, 20, 8);
    const mastMaterial = new THREE.MeshStandardMaterial({ color: 0x654321 });
    const mast = new THREE.Mesh(mastGeometry, mastMaterial);
    mast.position.set(-30, 15, -20);
    mast.castShadow = true;
    shipGroup.add(mast);

    // Sail
    const sailGeometry = new THREE.PlaneGeometry(15, 18);
    const sailMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const sail = new THREE.Mesh(sailGeometry, sailMaterial);
    sail.position.set(-20, 12, -20);
    sail.castShadow = true;
    shipGroup.add(sail);

    group.add(shipGroup);

    // Interactive object
    const questionBox = new THREE.Mesh(
        new THREE.BoxGeometry(5, 5, 5),
        new THREE.MeshStandardMaterial({ color: 0xFFD700, emissive: 0xFF6B00 })
    );
    questionBox.position.set(20, 2.5, 0);
    questionBox.castShadow = true;
    questionBox.userData = { type: 'question', roomId: 1 };
    group.add(questionBox);
    interactableObjects.push(questionBox);
}

function createCyclopsRoom(group) {
    // Floor
    const floorGeometry = new THREE.PlaneGeometry(100, 100);
    const floorMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x696969,
        roughness: 0.9
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    group.add(floor);

    // Cave walls
    createWall(group, 0, 5, 50, 10, 100, 0x4a4a4a);
    createWall(group, 0, 5, -50, 10, 100, 0x4a4a4a);
    
    // Cyclops
    const cyclopsGroup = new THREE.Group();
    
    // Body
    const bodyGeometry = new THREE.SphereGeometry(8, 32, 32);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x666666 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.set(30, 8, -25);
    body.castShadow = true;
    body.receiveShadow = true;
    cyclopsGroup.add(body);

    // Eye
    const eyeGeometry = new THREE.SphereGeometry(2, 32, 32);
    const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000 });
    const eye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    eye.position.set(30, 12, -17);
    eye.castShadow = true;
    cyclopsGroup.add(eye);

    group.add(cyclopsGroup);

    // Interactive object
    const questionBox = new THREE.Mesh(
        new THREE.BoxGeometry(5, 5, 5),
        new THREE.MeshStandardMaterial({ color: 0xFFD700, emissive: 0xFF6B00 })
    );
    questionBox.position.set(-30, 2.5, 0);
    questionBox.castShadow = true;
    questionBox.userData = { type: 'question', roomId: 2 };
    group.add(questionBox);
    interactableObjects.push(questionBox);
}

function createCirceRoom(group) {
    // Floor
    const floorGeometry = new THREE.PlaneGeometry(100, 100);
    const floorMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x2d5016,
        roughness: 0.7
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    group.add(floor);

    // Magical forest
    for (let i = 0; i < 10; i++) {
        const treeGeometry = new THREE.ConeGeometry(5, 15, 8);
        const treeMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22 });
        const tree = new THREE.Mesh(treeGeometry, treeMaterial);
        tree.position.set(
            (Math.random() - 0.5) * 80,
            7.5,
            (Math.random() - 0.5) * 80
        );
        tree.castShadow = true;
        group.add(tree);
    }

    // Circe's potion
    const potionGeometry = new THREE.CylinderGeometry(2, 2, 8, 16);
    const potionMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xFF1493,
        emissive: 0xFF69B4,
        metalness: 0.5
    });
    const potion = new THREE.Mesh(potionGeometry, potionMaterial);
    potion.position.set(0, 4, -30);
    potion.castShadow = true;
    group.add(potion);

    // Interactive object
    const questionBox = new THREE.Mesh(
        new THREE.BoxGeometry(5, 5, 5),
        new THREE.MeshStandardMaterial({ color: 0xFFD700, emissive: 0xFF6B00 })
    );
    questionBox.position.set(35, 2.5, 0);
    questionBox.castShadow = true;
    questionBox.userData = { type: 'question', roomId: 3 };
    group.add(questionBox);
    interactableObjects.push(questionBox);
}

function createUnderworldRoom(group) {
    // Dark floor
    const floorGeometry = new THREE.PlaneGeometry(100, 100);
    const floorMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x1a1a1a,
        roughness: 1
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    group.add(floor);

    // Dark walls
    createWall(group, 0, 5, 50, 10, 100, 0x0a0a0a);
    createWall(group, 0, 5, -50, 10, 100, 0x0a0a0a);

    // Spirits (glowing spheres)
    for (let i = 0; i < 5; i++) {
        const spiritGeometry = new THREE.SphereGeometry(3, 16, 16);
        const spiritMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xffffff,
            emissive: 0x6495ED,
            metalness: 0.5
        });
        const spirit = new THREE.Mesh(spiritGeometry, spiritMaterial);
        spirit.position.set(
            (Math.random() - 0.5) * 60,
            10 + Math.random() * 20,
            (Math.random() - 0.5) * 60
        );
        spirit.castShadow = true;
        group.add(spirit);
    }

    // Interactive object
    const questionBox = new THREE.Mesh(
        new THREE.BoxGeometry(5, 5, 5),
        new THREE.MeshStandardMaterial({ color: 0xFFD700, emissive: 0xFF6B00 })
    );
    questionBox.position.set(-35, 2.5, 0);
    questionBox.castShadow = true;
    questionBox.userData = { type: 'question', roomId: 4 };
    group.add(questionBox);
    interactableObjects.push(questionBox);
}

function createHomecomeRoom(group) {
    // Grass floor
    const floorGeometry = new THREE.PlaneGeometry(100, 100);
    const floorMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x32CD32,
        roughness: 0.8
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    group.add(floor);

    // House
    const houseGroup = new THREE.Group();

    // Walls
    const wallGeometry = new THREE.BoxGeometry(20, 15, 20);
    const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xCD853F });
    const walls = new THREE.Mesh(wallGeometry, wallMaterial);
    walls.position.set(0, 7.5, 0);
    walls.castShadow = true;
    walls.receiveShadow = true;
    houseGroup.add(walls);

    // Roof
    const roofGeometry = new THREE.ConeGeometry(16, 10, 4);
    const roofMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.set(0, 22.5, 0);
    roof.castShadow = true;
    houseGroup.add(roof);

    // Door
    const doorGeometry = new THREE.BoxGeometry(4, 8, 0.5);
    const doorMaterial = new THREE.MeshStandardMaterial({ color: 0x654321 });
    const door = new THREE.Mesh(doorGeometry, doorMaterial);
    door.position.set(0, 4, 10.25);
    door.castShadow = true;
    houseGroup.add(door);

    group.add(houseGroup);

    // Interactive object
    const questionBox = new THREE.Mesh(
        new THREE.BoxGeometry(5, 5, 5),
        new THREE.MeshStandardMaterial({ color: 0xFFD700, emissive: 0xFF6B00 })
    );
    questionBox.position.set(35, 2.5, 0);
    questionBox.castShadow = true;
    questionBox.userData = { type: 'question', roomId: 5 };
    group.add(questionBox);
    interactableObjects.push(questionBox);
}

// Helper function to create walls
function createWall(group, x, y, z, height, width, color = 0x808080) {
    const wallGeometry = new THREE.BoxGeometry(width, height, 1);
    const wallMaterial = new THREE.MeshStandardMaterial({ color: color });
    const wall = new THREE.Mesh(wallGeometry, wallMaterial);
    wall.position.set(x, y, z);
    wall.castShadow = true;
    wall.receiveShadow = true;
    group.add(wall);
}

// Event Handlers
const keys = {};

function onKeyDown(e) {
    keys[e.key.toLowerCase()] = true;
}

function onKeyUp(e) {
    keys[e.key.toLowerCase()] = false;
}

function onMouseMove(e) {
    // Mouse look implementation
}

function onClick(e) {
    // Check for interactable objects
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(interactableObjects);
    if (intersects.length > 0) {
        const obj = intersects[0].object;
        if (obj.userData.type === 'question') {
            showQuestion(obj.userData.roomId);
        }
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Game Functions
function startGame() {
    const playerName = prompt('Εισάγετε το όνομά σας:');
    if (playerName) {
        gameState.playerName = playerName;
        localStorage.setItem('odysseyPlayerName', playerName);
        document.getElementById('introOverlay').classList.remove('active');
        gameState.currentRoom = 1;
        create3DRoom(1);
        updateInfoPanel();
        animate();
    }
}

function showQuestion(roomId) {
    const room = roomsData[roomId - 1];
    const question = room.questions[0];
    
    document.getElementById('questionTitle').textContent = room.title;
    document.getElementById('questionText').textContent = question.question;
    
    const optionsDiv = document.getElementById('questionOptions');
    optionsDiv.innerHTML = '';
    
    if (question.type === 'trueFalse') {
        const trueBtn = document.createElement('button');
        trueBtn.className = 'option-btn';
        trueBtn.textContent = '✅ Σωστό';
        trueBtn.onclick = () => checkAnswer(roomId, true, question.answer);
        
        const falseBtn = document.createElement('button');
        falseBtn.className = 'option-btn';
        falseBtn.textContent = '❌ Λάθος';
        falseBtn.onclick = () => checkAnswer(roomId, false, question.answer);
        
        optionsDiv.appendChild(trueBtn);
        optionsDiv.appendChild(falseBtn);
    }
    
    document.getElementById('questionPanel').classList.remove('hidden');
}

function checkAnswer(roomId, answer, correct) {
    const isCorrect = answer === correct;
    const points = isCorrect ? 20 * (gameState.difficulty === 'hard' ? 2 : 1) : 0;
    
    if (isCorrect) {
        gameState.score += points;
        gameState.correctAnswers++;
        alert(`✅ Σωστό! +${points} πόντοι!`);
        if (!gameState.completedRooms.includes(roomId)) {
            gameState.completedRooms.push(roomId);
        }
        closeQuestion();
        updateInfoPanel();
    } else {
        alert('❌ Λάθος! Δοκίμασε ξανά.');
    }
}

function closeQuestion() {
    document.getElementById('questionPanel').classList.add('hidden');
}

function updateInfoPanel() {
    const room = roomsData[gameState.currentRoom - 1];
    document.getElementById('roomName').textContent = room.title;
    document.getElementById('scoreDisplay').textContent = `Βαθμολογία: ${gameState.score}`;
    document.getElementById('roomProgress').textContent = `Δωμάτιο: ${gameState.currentRoom}/5`;
}

function hideLoadingScreen() {
    document.getElementById('loadingScreen').classList.add('hidden');
}

// Audio Manager
function toggleMusic() {
    console.log('Music toggled');
}

function showLeaderboard() {
    const leaderboardList = gameState.leaderboard
        .sort((a, b) => b.score - a.score)
        .slice(0, 10)
        .map((entry, index) => `${index + 1}. ${entry.name} - ${entry.score} πόντοι`)
        .join('\n');
    alert('🏆 ΚΑΤΆΤΑΞΗ ΠΑΙΧΝΙΔΙΏΝ 🏆\n\n' + (leaderboardList || 'Δεν υπάρχουν στοιχεία ακόμα'));
}

function changeLanguage(lang) {
    localStorage.setItem('odysseyLanguage', lang);
}

function setDifficulty(difficulty) {
    gameState.difficulty = difficulty;
}

// Update Player Position
function updatePlayer() {
    const moveSpeed = 0.2;
    
    if (keys['w']) camera.position.z -= moveSpeed;
    if (keys['a']) camera.position.x -= moveSpeed;
    if (keys['s']) camera.position.z += moveSpeed;
    if (keys['d']) camera.position.x += moveSpeed;
    if (keys[' '] && !player.isJumping) {
        player.velocity.y = player.jumpPower;
        player.isJumping = true;
    }
    
    // Gravity
    player.velocity.y -= 0.01;
    if (camera.position.y <= 1.8) {
        camera.position.y = 1.8;
        player.isJumping = false;
    } else {
        camera.position.y += player.velocity.y;
    }
}

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    
    updatePlayer();
    
    renderer.render(scene, camera);
}

// Initialize on page load
window.addEventListener('load', init);
