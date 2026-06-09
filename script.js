// Enhanced Game State with Scoring System
const gameState = {
    currentRoom: 0,
    completedRooms: [],
    collectedClues: [],
    score: 0,
    totalQuestions: 0,
    correctAnswers: 0,
    answeredQuestions: {
        1: [],
        2: [],
        3: [],
        4: [],
        5: []
    },
    leaderboard: JSON.parse(localStorage.getItem('odysseyLeaderboard')) || [],
    playerName: localStorage.getItem('odysseyPlayerName') || '',
    difficulty: 'normal'
};

// Audio Manager
class AudioManager {
    constructor() {
        this.backgroundMusic = this.createAudio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = 0.3;
    }

    createAudio(src) {
        const audio = new Audio(src);
        return audio;
    }

    playBackground() {
        if (this.backgroundMusic.paused) {
            this.backgroundMusic.play().catch(() => {
                console.log('Audio playback blocked by browser');
            });
        }
    }

    stopBackground() {
        this.backgroundMusic.pause();
    }

    playSound(type) {
        // Simple tone generation without external audio files
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        switch(type) {
            case 'correct':
                oscillator.frequency.value = 800;
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.5);
                break;
            case 'wrong':
                oscillator.frequency.value = 300;
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.3);
                break;
            case 'complete':
                oscillator.frequency.value = 1000;
                gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 1);
                break;
        }
    }
}

const audioManager = new AudioManager();

// Scoring System
class ScoreCalculator {
    static calculatePoints(isCorrect, questionType, difficulty) {
        if (!isCorrect) return 0;

        const basePoints = {
            'trueFalse': 10,
            'matching': 15,
            'anagram': 20
        };

        const multiplier = {
            'easy': 1,
            'normal': 1.5,
            'hard': 2
        };

        return (basePoints[questionType] || 10) * multiplier[difficulty];
    }

    static updateLeaderboard(playerName, score) {
        const leaderboard = gameState.leaderboard;
        leaderboard.push({ name: playerName, score: score, date: new Date().toLocaleDateString('el-GR') });
        leaderboard.sort((a, b) => b.score - a.score);
        gameState.leaderboard = leaderboard.slice(0, 10); // Keep top 10
        localStorage.setItem('odysseyLeaderboard', JSON.stringify(gameState.leaderboard));
    }
}

// Room Data with Enhanced Content
const roomsData = [
    {
        id: 1,
        title: "🏛️ Δωμάτιο 1: Η Αναχώρηση από την Τροία",
        narration: "Ο Οδυσσέας και οι συνοδοί του έφυγαν από τη Τροία μετά την πολιορκία. Ήταν περήφανος για τη νίκη, αλλά δεν ήξερε ότι θα αντιμετώπιζε δοκιμασίες για δέκα χρόνια ακόμα. Ο Ποσειδώνας, θεός της θάλασσας, ήταν θυμωμένος γιατί ο Οδυσσέας ήταν πολύ υπερήφανος.",
        animation: "trojanShip",
        questions: [
            {
                type: "trueFalse",
                question: "Η Οδύσσεια διαρκεί δέκα χρόνια.",
                answer: true,
                explanation: "Σωστό! Ο Οδυσσέας έκανε δέκα χρόνια για να επιστρέψει στην Ιθάκη."
            },
            {
                type: "trueFalse",
                question: "Ο Ποσειδώνας ήταν υπέρ του Οδυσσέα.",
                answer: false,
                explanation: "Λάθος! Ο Ποσειδώνας ήταν θυμωμένος με τον Οδυσσέα."
            },
            {
                type: "matching",
                question: "Αντιστοίχισε τα πρόσωπα με τις περιγραφές:",
                matches: [
                    { left: "Οδυσσέας", right: "Ήρωας και βασιλιάς της Ιθάκης" },
                    { left: "Ποσειδώνας", right: "Θεός της θάλασσας" },
                    { left: "Αθηνά", right: "Θεά της σοφίας" }
                ]
            },
            {
                type: "anagram",
                question: "Αναγράμματα: Τι λέξη κρύβεται εδώ; ΑΙΑΘ",
                answer: "αθηνα",
                hint: "Θεά της σοφίας"
            }
        ],
        clue: "Η Τροία ήταν σε Ασία Μικρά 🗺️"
    },
    {
        id: 2,
        title: "⚡ Δωμάτιο 2: Ο Κύκλωπας Πολύφημος",
        narration: "Ο Οδυσσέας και οι άνδρες του φτάνουν στο νησί των Κυκλώπων. Ο Πολύφημος, ένας τρομερός κύκλωπας με ένα μόνο μάτι, τους αιχμαλωτίζει και τρώει μερικούς από τους άνδρες του. Ο Οδυσσέας έχει μια ευφυή σχέδιο - του λέει ότι το όνομά του είναι 'Κανείς'. Όταν τυφλώνει τον Κύκλωπα με μια προσχημάτισ, ο Κύκλωπας κλαίει 'Ο Κανείς με τυφλώνει!' και οι άλλοι Κύκλωπες νομίζουν ότι τίποτα δεν συμβαίνει.",
        animation: "cyclopsAttack",
        questions: [
            {
                type: "trueFalse",
                question: "Ο Πολύφημος είχε δύο μάτια.",
                answer: false,
                explanation: "Λάθος! Ο Πολύφημος είχε ένα μόνο μάτι στη μέση του μετώπου."
            },
            {
                type: "trueFalse",
                question: "Ο Οδυσσέας έλεγε ότι ονομάζεται 'Κανείς'.",
                answer: true,
                explanation: "Σωστό! Αυτό ήταν ένα έξυπνο κόλπο για να ξεφύγει."
            },
            {
                type: "matching",
                question: "Αντιστοίχισε τα γεγονότα με τη σειρά τους:",
                matches: [
                    { left: "1ο", right: "Ο Κύκλωπας τρώει μερικούς άνδρες" },
                    { left: "2ο", right: "Ο Οδυσσέας τον τυφλώνει" },
                    { left: "3ο", right: "Οι Έλληνες φρήνουν" }
                ]
            },
            {
                type: "anagram",
                question: "Αναγράμματα: ΦΥΜΛΦΟΠ",
                answer: "πολυφημος",
                hint: "Ο κύκλωπας"
            }
        ],
        clue: "Ο Πολύφημος ήταν γιος του Ποσειδώνα 👁️"
    },
    {
        id: 3,
        title: "🌊 Δωμάτιο 3: Η Κίρκη και η Μαγεία",
        narration: "Ο Οδυσσέας και οι άνδρες του φτάνουν σε ένα νησί όπου μένει η Κίρκη, μια γυναίκα με μαγικές δυνάμεις. Τους δίνει ένα ποτήρι με μαγικό ποτό που τους μετατρέπει σε χοίρους! Ο Οδυσσέας δεν πίνει και ένας θεός του δίνει ένα φυτό για προστασία. Η Κίρκη τελικά γίνεται η φίλη του.",
        animation: "circeTransformation",
        questions: [
            {
                type: "trueFalse",
                question: "Η Κίρκη μετέτρεψε τους άνδρες σε λύκους.",
                answer: false,
                explanation: "Λάθος! Τους μετέτρεψε σε χοίρους."
            },
            {
                type: "trueFalse",
                question: "Ο Οδυσσέας πίνε το μαγικό ποτό της Κίρκης.",
                answer: false,
                explanation: "Λάθος! Ένας θεός του έδωσε προστασία."
            },
            {
                type: "matching",
                question: "Αντιστοίχισε τα χαρακτηριστικά:",
                matches: [
                    { left: "Κίρκη", right: "Μάγισσα με δυνάμεις" },
                    { left: "Μαγικό ποτό", right: "Μετατρέπει σε χοίρους" },
                    { left: "Φυτό προστασίας", right: "Δίνεται από θεό" }
                ]
            },
            {
                type: "anagram",
                question: "Αναγράμματα: ΕΚΙΡ",
                answer: "κιρκη",
                hint: "Η μάγισσα"
            }
        ],
        clue: "Η Κίρκη ήταν θυγατέρα του Ηλίου ☀️"
    },
    {
        id: 4,
        title: "🪦 Δωμάτιο 4: Το Κάτω Κόσμο",
        narration: "Ο Οδυσσέας κατεβαίνει στο κάτω κόσμο για να συμβουλευτεί το φάντασμα του μάντη Τειρεσία. Συναντά τα φαντάσματα των νεκρών, ακόμα και των φίλων του από τη Τροία. Ο Τειρεσίας του προφητεύει για τις δοκιμασίες που θα αντιμετωπίσει και του δίνει συμβουλές για να επιστρέψει ασφαλώς.",
        animation: "underworldJourney",
        questions: [
            {
                type: "trueFalse",
                question: "Ο Τειρεσίας ήταν ένας ζωντανός μάντης.",
                answer: false,
                explanation: "Λάθος! Ο Τειρεσίας ήταν νεκρός και ήταν φάντασμα στο κάτω κόσμο."
            },
            {
                type: "trueFalse",
                question: "Ο Οδυσσέας συνάντησε φίλους του στο κάτω κόσμο.",
                answer: true,
                explanation: "Σωστό! Συνάντησε φαντάσματα φίλων του από τη Τροία."
            },
            {
                type: "matching",
                question: "Αντιστοίχισε τα στοιχεία:",
                matches: [
                    { left: "Κάτω κόσμος", right: "Η αiedra των νεκρών" },
                    { left: "Τειρεσίας", right: "Μάντης και προφήτης" },
                    { left: "Φαντάσματα", right: "Ψυχές νεκρών" }
                ]
            },
            {
                type: "anagram",
                question: "Αναγράμματα: ΑΙΣΕΙΤΡ",
                answer: "τειρεσιας",
                hint: "Ο μάντης"
            }
        ],
        clue: "Ο Τειρεσίας προφήτευσε την επιστροφή του Οδυσσέα ⚗️"
    },
    {
        id: 5,
        title: "🏠 Δωμάτιο 5: Η Επιστροφή στην Ιθάκη",
        narration: "Μετά από δέκα χρόνια δοκιμασιών, ο Οδυσσέας τελικά φτάνει στην Ιθάκη, την πατρίδα του. Αλλά δεν είναι ακόμα το τέλος! Οι μνηστήρες της γυναίκας του Πηνελόπης έχουν εισβάλει στο σπίτι του. Ο Οδυσσέας με τη βοήθεια του γιου του Τηλέμαχου και του πιστού υπηρέτη Ευμαίου σκοτώνει τους μνηστήρες και ανακτά τη γυναίκα και τη δύναμή του.",
        animation: "homecoming",
        questions: [
            {
                type: "trueFalse",
                question: "Η Πηνελόπη ήταν η σύζυγος του Οδυσσέα.",
                answer: true,
                explanation: "Σωστό! Η Πηνελόπη περίμενε τον Οδυσσέα για δέκα χρόνια."
            },
            {
                type: "trueFalse",
                question: "Ο Τηλέμαχος ήταν ο εχθρός του Οδυσσέα.",
                answer: false,
                explanation: "Λάθος! Ο Τηλέμαχος ήταν ο γιος του Οδυσσέα."
            },
            {
                type: "matching",
                question: "Αντιστοίχισε τα πρόσωπα:",
                matches: [
                    { left: "Πηνελόπη", right: "Σύζυγος του Οδυσσέα" },
                    { left: "Τηλέμαχος", right: "Γιος του Οδυσσέα" },
                    { left: "Ευμαίος", right: "Πιστός υπηρέτης" }
                ]
            },
            {
                type: "anagram",
                question: "Αναγράμματα: ΙΚΑΘ",
                answer: "ιθακη",
                hint: "Το σπίτι του Οδυσσέα"
            }
        ],
        clue: "Η Ιθάκη είναι ένα νησί στο Ιόνιο Πέλαγος 🏝️"
    }
];

const finalPuzzle = {
    clues: [
        "Η Τροία ήταν σε Ασία Μικρά 🗺️",
        "Ο Πολύφημος ήταν γιος του Ποσειδώνα 👁️",
        "Η Κίρκη ήταν θυγατέρα του Ηλίου ☀️",
        "Ο Τειρεσίας προφήτευσε την επιστροφή του Οδυσσέα ⚗️",
        "Η Ιθάκη είναι ένα νησί στο Ιόνιο Πέλαγος 🏝️"
    ],
    answer: "δεκα",
    answerAlternatives: ["10", "δεκα χρονια", "δεκα χρόνια", "δέκα", "δέκα χρόνια"],
    question: "Πόσα χρόνια κράτησε η περιπέτεια του Οδυσσέα;"
};

// Localization
const i18n = {
    el: {
        start: '🚀 Αρχίστε το Escape Room!',
        back: '← Πίσω',
        narration: '🔊 Ακούστε την Αφήγηση',
        score: 'Βαθμολογία: ',
        finalAnswer: 'Η Απάντηση:',
        submit: '✅ Υποβολή',
        correct: 'Σωστό!',
        wrong: 'Λάθος!',
        playerName: 'Όνομα Παίκτη:',
        difficulty: 'Δυσκολία:',
        music: '🔊 Μουσική',
        leaderboard: '🏆 Κατάταξη',
        language: '🌍 Γλώσσα'
    },
    en: {
        start: '🚀 Start Escape Room!',
        back: '← Back',
        narration: '🔊 Listen to Narration',
        score: 'Score: ',
        finalAnswer: 'Your Answer:',
        submit: '✅ Submit',
        correct: 'Correct!',
        wrong: 'Wrong!',
        playerName: 'Player Name:',
        difficulty: 'Difficulty:',
        music: '🔊 Music',
        leaderboard: '🏆 Leaderboard',
        language: '🌍 Language'
    }
};

let currentLanguage = localStorage.getItem('odysseyLanguage') || 'el';

function t(key) {
    return i18n[currentLanguage][key] || i18n['el'][key];
}

// Start Game
function startEscapeRoom() {
    const playerName = prompt('Εισάγετε το όνομά σας:');
    if (playerName) {
        gameState.playerName = playerName;
        localStorage.setItem('odysseyPlayerName', playerName);
        audioManager.playBackground();
        hideSection("introSection");
        showSection("roomSelectionSection");
    }
}

// Enter Room
function enterRoom(roomNumber) {
    const room = roomsData[roomNumber - 1];
    if (!room) return;

    gameState.currentRoom = roomNumber;
    showSection("roomContentSection");
    
    document.getElementById("roomTitle").textContent = room.title;
    document.getElementById("narrationText").textContent = room.narration;
    
    // Draw animation
    drawAnimation(room.animation);
    
    // Display questions
    displayQuestions(room.questions, roomNumber);
    
    // Update progress
    updateProgress();
}

// Draw Animations (same as before)
function drawAnimation(type) {
    const svg = document.getElementById("animationSVG");
    svg.innerHTML = "";
    
    switch(type) {
        case "trojanShip":
            drawTrojanShip(svg);
            break;
        case "cyclopsAttack":
            drawCyclops(svg);
            break;
        case "circeTransformation":
            drawCirce(svg);
            break;
        case "underworldJourney":
            drawUnderworld(svg);
            break;
        case "homecoming":
            drawHomecoming(svg);
            break;
    }
}

function drawTrojanShip(svg) {
    const wave = document.createElementNS("http://www.w3.org/2000/svg", "path");
    wave.setAttribute("d", "M0,200 Q50,150 100,200 T200,200 T300,200");
    wave.setAttribute("stroke", "#0099cc");
    wave.setAttribute("stroke-width", "3");
    wave.setAttribute("fill", "none");
    svg.appendChild(wave);
    
    const ship = document.createElementNS("http://www.w3.org/2000/svg", "g");
    
    const hull = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
    hull.setAttribute("cx", "250");
    hull.setAttribute("cy", "180");
    hull.setAttribute("rx", "80");
    hull.setAttribute("ry", "40");
    hull.setAttribute("fill", "#8B4513");
    ship.appendChild(hull);
    
    const mast = document.createElementNS("http://www.w3.org/2000/svg", "line");
    mast.setAttribute("x1", "250");
    mast.setAttribute("y1", "140");
    mast.setAttribute("x2", "250");
    mast.setAttribute("y2", "50");
    mast.setAttribute("stroke", "#654321");
    mast.setAttribute("stroke-width", "3");
    ship.appendChild(mast);
    
    const sail = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    sail.setAttribute("points", "250,60 250,160 350,120");
    sail.setAttribute("fill", "#fff");
    sail.setAttribute("opacity", "0.8");
    ship.appendChild(sail);
    
    svg.appendChild(ship);
    animateElement(ship, "translateX", 0, 200, 3);
}

function drawCyclops(svg) {
    const cyclops = document.createElementNS("http://www.w3.org/2000/svg", "g");
    
    const body = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    body.setAttribute("cx", "300");
    body.setAttribute("cy", "200");
    body.setAttribute("r", "80");
    body.setAttribute("fill", "#666");
    cyclops.appendChild(body);
    
    const eye = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    eye.setAttribute("cx", "300");
    eye.setAttribute("cy", "180");
    eye.setAttribute("r", "40");
    eye.setAttribute("fill", "#ff6b6b");
    cyclops.appendChild(eye);
    
    const pupil = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    pupil.setAttribute("cx", "300");
    pupil.setAttribute("cy", "180");
    pupil.setAttribute("r", "20");
    pupil.setAttribute("fill", "#000");
    cyclops.appendChild(pupil);
    
    const mouth = document.createElementNS("http://www.w3.org/2000/svg", "path");
    mouth.setAttribute("d", "M280,230 Q300,250 320,230");
    mouth.setAttribute("stroke", "#000");
    mouth.setAttribute("stroke-width", "3");
    mouth.setAttribute("fill", "none");
    cyclops.appendChild(mouth);
    
    svg.appendChild(cyclops);
    animateElement(eye, "opacity", 1, 0, 2);
}

function drawCirce(svg) {
    const circe = document.createElementNS("http://www.w3.org/2000/svg", "g");
    
    const dress = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    dress.setAttribute("points", "250,150 200,300 300,300");
    dress.setAttribute("fill", "#ff69b4");
    circe.appendChild(dress);
    
    const head = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    head.setAttribute("cx", "250");
    head.setAttribute("cy", "120");
    head.setAttribute("r", "30");
    head.setAttribute("fill", "#f4a460");
    circe.appendChild(head);
    
    const hair = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    hair.setAttribute("cx", "250");
    hair.setAttribute("cy", "100");
    hair.setAttribute("r", "40");
    hair.setAttribute("fill", "#d2691e");
    circe.appendChild(hair);
    
    const wand = document.createElementNS("http://www.w3.org/2000/svg", "line");
    wand.setAttribute("x1", "280");
    wand.setAttribute("y1", "160");
    wand.setAttribute("x2", "380");
    wand.setAttribute("y2", "100");
    wand.setAttribute("stroke", "#ffff00");
    wand.setAttribute("stroke-width", "4");
    circe.appendChild(wand);
    
    for (let i = 0; i < 5; i++) {
        const spark = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        spark.setAttribute("cx", 380 + Math.random() * 40);
        spark.setAttribute("cy", 100 + Math.random() * 40);
        spark.setAttribute("r", "3");
        spark.setAttribute("fill", "#ffff00");
        circe.appendChild(spark);
    }
    
    svg.appendChild(circe);
}

function drawUnderworld(svg) {
    const ground = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    ground.setAttribute("width", "500");
    ground.setAttribute("height", "500");
    ground.setAttribute("fill", "#1a1a1a");
    svg.appendChild(ground);
    
    for (let i = 0; i < 3; i++) {
        const ghost = document.createElementNS("http://www.w3.org/2000/svg", "g");
        
        const body = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        body.setAttribute("cx", 100 + i * 150);
        body.setAttribute("cy", "150");
        body.setAttribute("r", "30");
        body.setAttribute("fill", "#ffffff");
        body.setAttribute("opacity", "0.7");
        ghost.appendChild(body);
        
        const eye1 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        eye1.setAttribute("cx", 90 + i * 150);
        eye1.setAttribute("cy", "140");
        eye1.setAttribute("r", "5");
        eye1.setAttribute("fill", "#000");
        ghost.appendChild(eye1);
        
        const eye2 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        eye2.setAttribute("cx", 110 + i * 150);
        eye2.setAttribute("cy", "140");
        eye2.setAttribute("r", "5");
        eye2.setAttribute("fill", "#000");
        ghost.appendChild(eye2);
        
        svg.appendChild(ghost);
    }
}

function drawHomecoming(svg) {
    const house = document.createElementNS("http://www.w3.org/2000/svg", "g");
    
    const walls = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    walls.setAttribute("x", "150");
    walls.setAttribute("y", "150");
    walls.setAttribute("width", "200");
    walls.setAttribute("height", "150");
    walls.setAttribute("fill", "#cd853f");
    house.appendChild(walls);
    
    const roof = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    roof.setAttribute("points", "150,150 350,150 250,80");
    roof.setAttribute("fill", "#8b4513");
    house.appendChild(roof);
    
    const door = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    door.setAttribute("x", "225");
    door.setAttribute("y", "200");
    door.setAttribute("width", "50");
    door.setAttribute("height", "100");
    door.setAttribute("fill", "#654321");
    house.appendChild(door);
    
    const window1 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    window1.setAttribute("x", "170");
    window1.setAttribute("y", "170");
    window1.setAttribute("width", "40");
    window1.setAttribute("height", "40");
    window1.setAttribute("fill", "#87ceeb");
    house.appendChild(window1);
    
    svg.appendChild(house);
    
    const flag = document.createElementNS("http://www.w3.org/2000/svg", "g");
    const flagPole = document.createElementNS("http://www.w3.org/2000/svg", "line");
    flagPole.setAttribute("x1", "350");
    flagPole.setAttribute("y1", "100");
    flagPole.setAttribute("x2", "350");
    flagPole.setAttribute("y2", "180");
    flagPole.setAttribute("stroke", "#333");
    flagPole.setAttribute("stroke-width", "3");
    flag.appendChild(flagPole);
    
    const flagCloth = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    flagCloth.setAttribute("points", "350,110 380,110 375,130");
    flagCloth.setAttribute("fill", "#ff6b6b");
    flag.appendChild(flagCloth);
    
    svg.appendChild(flag);
}

// Display Questions with Scoring
function displayQuestions(questions, roomNumber) {
    const container = document.getElementById("questionsContainer");
    container.innerHTML = "";
    gameState.totalQuestions += questions.length;
    
    questions.forEach((question, index) => {
        const questionEl = document.createElement("div");
        questionEl.className = "question";
        
        let questionHTML = `<h4>Ερώτηση ${index + 1}:</h4><p class="question-text">${question.question}</p>`;
        
        if (question.type === "trueFalse") {
            questionHTML += `
                <div class="true-false-options">
                    <button class="option-btn" onclick="checkTrueFalse(${roomNumber}, ${index}, true, '${question.explanation}', '${question.type}')">✅ Σωστό</button>
                    <button class="option-btn" onclick="checkTrueFalse(${roomNumber}, ${index}, false, '${question.explanation}', '${question.type}')">❌ Λάθος</button>
                </div>
            `;
        } else if (question.type === "matching") {
            questionHTML += `<div class="matching-container">`;
            question.matches.forEach((match, i) => {
                questionHTML += `
                    <div class="matching-item" onclick="selectMatch(this)">${match.left}</div>
                    ${i === 0 ? '<div class="matching-arrow">→</div>' : ''}
                    <div class="matching-item" onclick="selectMatch(this)">${match.right}</div>
                `;
            });
            questionHTML += `</div>`;
        } else if (question.type === "anagram") {
            questionHTML += `
                <p style="font-size: 1.3em; font-weight: bold; color: #667eea; margin: 15px 0;">${question.question.split(": ")[1]}</p>
                <input type="text" class="anagram-answer-input" placeholder="Γράψε την απάντηση εδώ..." onkeypress="if(event.key==='Enter') checkAnagram(${roomNumber}, ${index}, this.value, '${question.answer}', '${question.hint}', '${question.type}')">
                <small style="color: #999; margin-top: 5px;">💡 Υπόδειξη: ${question.hint}</small>
            `;
        }
        
        questionEl.innerHTML = questionHTML;
        container.appendChild(questionEl);
    });
    
    // Display score
    const scoreDisplay = document.createElement('div');
    scoreDisplay.className = 'score-display';
    scoreDisplay.innerHTML = `<h3>💎 Βαθμολογία: ${gameState.score}</h3>`;
    container.parentElement.insertBefore(scoreDisplay, container);
}

// Check True/False Answer with Scoring
function checkTrueFalse(roomNumber, questionIndex, selectedAnswer, explanation, questionType) {
    const questions = roomsData[roomNumber - 1].questions;
    const correct = questions[questionIndex].answer === selectedAnswer;
    
    const buttons = document.querySelectorAll(".true-false-options button");
    buttons.forEach(btn => btn.disabled = true);
    
    const correctBtn = document.querySelector(`.true-false-options button:nth-child(${selectedAnswer ? 1 : 2})`);
    
    if (correct) {
        const points = ScoreCalculator.calculatePoints(true, questionType, gameState.difficulty);
        gameState.score += points;
        gameState.correctAnswers++;
        correctBtn.classList.add("correct");
        audioManager.playSound('correct');
        showAthenaMessage("🎉 Πολύ σωστά! +" + points + " πόντοι! " + explanation);
        recordAnswer(roomNumber, questionIndex, true);
    } else {
        correctBtn.classList.add("incorrect");
        audioManager.playSound('wrong');
        showAthenaMessage("❌ Δυστυχώς λάθος! " + explanation);
        recordAnswer(roomNumber, questionIndex, false);
    }
    
    updateScoreDisplay();
    setTimeout(checkRoomCompletion, 2000);
}

// Check Anagram Answer with Scoring
function checkAnagram(roomNumber, questionIndex, userAnswer, correctAnswer, hint, questionType) {
    const correct = userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase();
    const input = document.querySelector(".anagram-answer-input");
    input.disabled = true;
    
    if (correct) {
        const points = ScoreCalculator.calculatePoints(true, questionType, gameState.difficulty);
        gameState.score += points;
        gameState.correctAnswers++;
        input.style.borderColor = "#4caf50";
        input.style.backgroundColor = "#e8f5e9";
        audioManager.playSound('correct');
        showAthenaMessage("🎉 Σωστό! Έβρες τη σωστή λέξη! +" + points + " πόντοι!");
        recordAnswer(roomNumber, questionIndex, true);
    } else {
        input.style.borderColor = "#f44336";
        input.style.backgroundColor = "#ffebee";
        audioManager.playSound('wrong');
        showAthenaMessage("❌ Δυστυχώς λάθος! Δοκίμασε ξανά. Υπόδειξη: " + hint);
        recordAnswer(roomNumber, questionIndex, false);
    }
    
    updateScoreDisplay();
    setTimeout(checkRoomCompletion, 2000);
}

function updateScoreDisplay() {
    const scoreDisplay = document.querySelector('.score-display h3');
    if (scoreDisplay) {
        scoreDisplay.textContent = `💎 Βαθμολογία: ${gameState.score}`;
    }
}

// Select Match
function selectMatch(element) {
    element.classList.toggle("selected");
}

// Athena Helper
function showAthenaMessage(message) {
    const helper = document.getElementById("athenaHelper");
    const text = document.getElementById("athenaText");
    text.textContent = message;
    helper.classList.remove("hidden");
}

function closeAthena() {
    document.getElementById("athenaHelper").classList.add("hidden");
}

// Record Answer
function recordAnswer(roomNumber, questionIndex, correct) {
    if (!gameState.answeredQuestions[roomNumber]) {
        gameState.answeredQuestions[roomNumber] = [];
    }
    gameState.answeredQuestions[roomNumber][questionIndex] = correct;
}

// Check Room Completion
function checkRoomCompletion() {
    const roomNumber = gameState.currentRoom;
    const questions = roomsData[roomNumber - 1].questions;
    const answers = gameState.answeredQuestions[roomNumber];
    
    let allAnswered = true;
    questions.forEach((_, index) => {
        if (answers[index] === undefined) {
            allAnswered = false;
        }
    });
    
    if (allAnswered) {
        completeRoom();
    }
}

// Complete Room
function completeRoom() {
    const roomNumber = gameState.currentRoom;
    
    if (!gameState.completedRooms.includes(roomNumber)) {
        gameState.completedRooms.push(roomNumber);
        gameState.collectedClues.push(roomsData[roomNumber - 1].clue);
    }
    
    const clueDisplay = document.getElementById("clueDisplay");
    document.getElementById("clueText").textContent = roomsData[roomNumber - 1].clue;
    clueDisplay.classList.remove("hidden");
    
    audioManager.playSound('complete');
    
    if (roomNumber < 5) {
        const nextRoomCard = document.getElementById(`room-${roomNumber + 1}-card`);
        if (nextRoomCard) {
            nextRoomCard.classList.remove("locked");
            nextRoomCard.querySelector(".status").textContent = "🔓 Διαθέσιμο";
        }
    } else {
        setTimeout(() => {
            hideSection("roomContentSection");
            showFinalPuzzle();
        }, 2000);
    }
    
    updateProgress();
}

// Show Final Puzzle
function showFinalPuzzle() {
    showSection("finalPuzzleSection");
    
    document.getElementById("finalQuestion").textContent = finalPuzzle.question;
    
    const collectedCluesDiv = document.getElementById("collectedClues");
    collectedCluesDiv.innerHTML = "";
    gameState.collectedClues.forEach(clue => {
        const clueItem = document.createElement("div");
        clueItem.className = "clue-item";
        clueItem.textContent = clue;
        collectedCluesDiv.appendChild(clueItem);
    });
}

// Submit Final Answer
function submitFinalAnswer() {
    const answer = document.getElementById("finalAnswer").value.toLowerCase().trim();
    const resultMessage = document.getElementById("finalResultMessage");
    
    const isCorrect = finalPuzzle.answerAlternatives.some(alt => 
        alt.toLowerCase().trim() === answer
    );
    
    if (isCorrect) {
        resultMessage.className = "success";
        resultMessage.textContent = "✅ Σωστό! Έβρες την απάντηση! Ο Οδυσσέας έκανε δέκα χρόνια για να επιστρέψει!";
        resultMessage.classList.remove("hidden");
        
        gameState.score += 50; // Bonus for final puzzle
        
        setTimeout(() => {
            hideSection("finalPuzzleSection");
            ScoreCalculator.updateLeaderboard(gameState.playerName, gameState.score);
            showSection("completionSection");
            displayFinalStats();
        }, 2000);
    } else {
        resultMessage.className = "error";
        resultMessage.textContent = "❌ Λάθος! Προσπάθησε ξανά. Σκέψου πόσα χρόνια κράτησε η περιπέτεια...";
        resultMessage.classList.remove("hidden");
    }
}

function displayFinalStats() {
    const statsDiv = document.createElement('div');
    statsDiv.className = 'final-stats';
    statsDiv.innerHTML = `
        <h3>📊 Τελικά Στατιστικά</h3>
        <p>Παίκτης: <strong>${gameState.playerName}</strong></p>
        <p>Τελική Βαθμολογία: <strong>${gameState.score} πόντοι</strong></p>
        <p>Σωστές Απαντήσεις: <strong>${gameState.correctAnswers}/${gameState.totalQuestions}</strong></p>
        <p>Ποσοστό: <strong>${Math.round((gameState.correctAnswers / gameState.totalQuestions) * 100)}%</strong></p>
    `;
    document.querySelector('.completion-content').appendChild(statsDiv);
}

// Update Progress
function updateProgress() {
    const progress = (gameState.completedRooms.length / 5) * 100;
    document.getElementById("progressFill").style.width = progress + "%";
}

// Navigation
function goBackToRoomSelection() {
    hideSection("roomContentSection");
    showSection("roomSelectionSection");
}

function restartGame() {
    location.reload();
}

function showLeaderboard() {
    const leaderboardList = gameState.leaderboard.map((entry, index) => 
        `<div class="leaderboard-entry">${index + 1}. ${entry.name} - ${entry.score} πόντοι (${entry.date})</div>`
    ).join('');
    
    alert('🏆 ΚΑΤΆΤΑΞΗ ΠΑΙΧΝΙΔΙΏΝ 🏆\n\n' + (leaderboardList || 'Δεν υπάρχουν στοιχεία ακόμα'));
}

function changeLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('odysseyLanguage', lang);
    location.reload();
}

function toggleMusic() {
    const btn = event.target;
    if (audioManager.backgroundMusic.paused) {
        audioManager.playBackground();
        btn.textContent = '🔊 Μουσική (Ενεργή)';
    } else {
        audioManager.stopBackground();
        btn.textContent = '🔇 Μουσική (Σιωπηλή)';
    }
}

function setDifficulty(difficulty) {
    gameState.difficulty = difficulty;
    console.log('Δυσκολία ορίστηκε σε: ' + difficulty);
}

// Show/Hide Sections
function showSection(sectionId) {
    document.getElementById(sectionId).classList.add("active");
}

function hideSection(sectionId) {
    document.getElementById(sectionId).classList.remove("active");
}

// Animate Element
function animateElement(element, property, from, to, duration) {
    let startTime = Date.now();
    const animate = () => {
        const progress = (Date.now() - startTime) / (duration * 1000);
        if (progress < 1) {
            const value = from + (to - from) * progress;
            if (property === "translateX") {
                element.style.transform = `translateX(${value}px)`;
            } else if (property === "opacity") {
                element.style.opacity = value;
            }
            requestAnimationFrame(animate);
        }
    };
    animate();
}

// Play Narration with Text-to-Speech
function playNarration() {
    const text = document.getElementById("narrationText").textContent;
    if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = currentLanguage === 'el' ? 'el-GR' : 'en-US';
        utterance.rate = 0.9;
        speechSynthesis.speak(utterance);
    }
}
