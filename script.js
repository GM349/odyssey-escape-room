// Game State
const gameState = {
    currentRoom: 0,
    completedRooms: [],
    collectedClues: [],
    answeredQuestions: {
        1: [],
        2: [],
        3: [],
        4: [],
        5: []
    }
};

// Room Data
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
        narration: "Ο Οδυσσέας και οι άνδρες του φτάνουν στο νησί των Κυκλώπων. Ο Πολύφημος, ένας τρομερός κύκλωπας με ένα μόνο μάτι, τους αιχμαλωτίζει και τρώει μερικούς από τους άνδρες του. Ο Οδυσσέας έχει μια ευφυή σχέδιο - του λέει ότι το όνομά του είναι 'Κανείς'. Όταν τυφλώνει τον Κύκλωπα με μια προσγ, ο Κύκλωπας κλαίει 'Ο Κανείς με τυφλώνει!' και οι άλλοι Κύκλωπες νομίζουν ότι τίποτα δεν συμβαίνει.",
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

// Start Game
function startEscapeRoom() {
    hideSection("introSection");
    showSection("roomSelectionSection");
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

// Draw Animations
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
    // Sea waves
    const wave = document.createElementNS("http://www.w3.org/2000/svg", "path");
    wave.setAttribute("d", "M0,200 Q50,150 100,200 T200,200 T300,200");
    wave.setAttribute("stroke", "#0099cc");
    wave.setAttribute("stroke-width", "3");
    wave.setAttribute("fill", "none");
    svg.appendChild(wave);
    
    // Ship
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
    
    // Animate ship
    animateElement(ship, "translateX", 0, 200, 3);
}

function drawCyclops(svg) {
    const cyclops = document.createElementNS("http://www.w3.org/2000/svg", "g");
    
    // Body
    const body = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    body.setAttribute("cx", "300");
    body.setAttribute("cy", "200");
    body.setAttribute("r", "80");
    body.setAttribute("fill", "#666");
    cyclops.appendChild(body);
    
    // Eye
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
    
    // Mouth
    const mouth = document.createElementNS("http://www.w3.org/2000/svg", "path");
    mouth.setAttribute("d", "M280,230 Q300,250 320,230");
    mouth.setAttribute("stroke", "#000");
    mouth.setAttribute("stroke-width", "3");
    mouth.setAttribute("fill", "none");
    cyclops.appendChild(mouth);
    
    svg.appendChild(cyclops);
    
    // Animate eye blinking (getting blind)
    animateElement(eye, "opacity", 1, 0, 2);
}

function drawCirce(svg) {
    const circe = document.createElementNS("http://www.w3.org/2000/svg", "g");
    
    // Dress
    const dress = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    dress.setAttribute("points", "250,150 200,300 300,300");
    dress.setAttribute("fill", "#ff69b4");
    circe.appendChild(dress);
    
    // Head
    const head = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    head.setAttribute("cx", "250");
    head.setAttribute("cy", "120");
    head.setAttribute("r", "30");
    head.setAttribute("fill", "#f4a460");
    circe.appendChild(head);
    
    // Hair
    const hair = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    hair.setAttribute("cx", "250");
    hair.setAttribute("cy", "100");
    hair.setAttribute("r", "40");
    hair.setAttribute("fill", "#d2691e");
    circe.appendChild(hair);
    
    // Magic wand
    const wand = document.createElementNS("http://www.w3.org/2000/svg", "line");
    wand.setAttribute("x1", "280");
    wand.setAttribute("y1", "160");
    wand.setAttribute("x2", "380");
    wand.setAttribute("y2", "100");
    wand.setAttribute("stroke", "#ffff00");
    wand.setAttribute("stroke-width", "4");
    circe.appendChild(wand);
    
    // Magic sparks
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
    // Underground
    const ground = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    ground.setAttribute("width", "500");
    ground.setAttribute("height", "500");
    ground.setAttribute("fill", "#1a1a1a");
    svg.appendChild(ground);
    
    // Ghosts
    for (let i = 0; i < 3; i++) {
        const ghost = document.createElementNS("http://www.w3.org/2000/svg", "g");
        
        const body = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        body.setAttribute("cx", 100 + i * 150);
        body.setAttribute("cy", 150);
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
    // House
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
    
    // Flag waving
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

// Display Questions
function displayQuestions(questions, roomNumber) {
    const container = document.getElementById("questionsContainer");
    container.innerHTML = "";
    
    questions.forEach((question, index) => {
        const questionEl = document.createElement("div");
        questionEl.className = "question";
        
        let questionHTML = `<h4>Ερώτηση ${index + 1}:</h4><p class="question-text">${question.question}</p>`;
        
        if (question.type === "trueFalse") {
            questionHTML += `
                <div class="true-false-options">
                    <button class="option-btn" onclick="checkTrueFalse(${roomNumber}, ${index}, true, '${question.explanation}')">✅ Σωστό</button>
                    <button class="option-btn" onclick="checkTrueFalse(${roomNumber}, ${index}, false, '${question.explanation}')">❌ Λάθος</button>
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
                <input type="text" class="anagram-answer-input" placeholder="Γράψε την απάντηση εδώ..." onkeypress="if(event.key==='Enter') checkAnagram(${roomNumber}, ${index}, this.value, '${question.answer}', '${question.hint}')">
                <small style="color: #999; margin-top: 5px;">💡 Υπόδειξη: ${question.hint}</small>
            `;
        }
        
        questionEl.innerHTML = questionHTML;
        container.appendChild(questionEl);
    });
}

// Check True/False Answer
function checkTrueFalse(roomNumber, questionIndex, selectedAnswer, explanation) {
    const questions = roomsData[roomNumber - 1].questions;
    const correct = questions[questionIndex].answer === selectedAnswer;
    
    const buttons = document.querySelectorAll(".true-false-options button");
    buttons.forEach(btn => btn.disabled = true);
    
    const correctBtn = document.querySelector(`.true-false-options button:nth-child(${selectedAnswer ? 1 : 2})`);
    if (correct) {
        correctBtn.classList.add("correct");
        showAthenaMessage("Πολύ σωστά! " + explanation);
        recordAnswer(roomNumber, questionIndex, true);
    } else {
        correctBtn.classList.add("incorrect");
        showAthenaMessage("Δυστυχώς λάθος! " + explanation);
        recordAnswer(roomNumber, questionIndex, false);
    }
    
    setTimeout(checkRoomCompletion, 2000);
}

// Check Anagram Answer
function checkAnagram(roomNumber, questionIndex, userAnswer, correctAnswer, hint) {
    const correct = userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase();
    const input = document.querySelector(".anagram-answer-input");
    input.disabled = true;
    
    if (correct) {
        input.style.borderColor = "#4caf50";
        input.style.backgroundColor = "#e8f5e9";
        showAthenaMessage("Σωστό! Έβρες τη σωστή λέξη!");
        recordAnswer(roomNumber, questionIndex, true);
    } else {
        input.style.borderColor = "#f44336";
        input.style.backgroundColor = "#ffebee";
        showAthenaMessage("Δυστυχώς λάθος! Δοκίμασε ξανά. Υπόδειξη: " + hint);
        recordAnswer(roomNumber, questionIndex, false);
    }
    
    setTimeout(checkRoomCompletion, 2000);
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
    
    // Show clue
    const clueDisplay = document.getElementById("clueDisplay");
    document.getElementById("clueText").textContent = roomsData[roomNumber - 1].clue;
    clueDisplay.classList.remove("hidden");
    
    // Unlock next room
    if (roomNumber < 5) {
        const nextRoomCard = document.getElementById(`room-${roomNumber + 1}-card`);
        if (nextRoomCard) {
            nextRoomCard.classList.remove("locked");
            nextRoomCard.querySelector(".status").textContent = "🔓 Διαθέσιμο";
        }
    } else {
        // All rooms completed, show final puzzle
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
        
        setTimeout(() => {
            hideSection("finalPuzzleSection");
            showSection("completionSection");
        }, 2000);
    } else {
        resultMessage.className = "error";
        resultMessage.textContent = "❌ Λάθος! Προσπάθησε ξανά. Σκέψου πόσα χρόνια κράτησε η περιπέτεια...";
        resultMessage.classList.remove("hidden");
    }
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

// Play Narration (Text-to-Speech)
function playNarration() {
    const text = document.getElementById("narrationText").textContent;
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'el-GR';
        utterance.rate = 0.9;
        speechSynthesis.speak(utterance);
    }
}
