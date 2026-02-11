// Elements
const envelope = document.getElementById("envelope-container");
const unlockScreen = document.getElementById("unlock-container");
const letter = document.getElementById("letter-container");
const noBtn = document.querySelector(".no-btn");
const yesBtn = document.querySelector(".btn[alt='Yes']");

const title = document.getElementById("letter-title");
const catImg = document.getElementById("letter-cat");
const buttons = document.getElementById("letter-buttons");
const finalText = document.getElementById("final-text");
const backgroundMusic = document.getElementById("background-music");

// Unlock elements
const progressBar = document.getElementById("progress-bar");
const progressCount = document.getElementById("progress-count");
const taskInstruction = document.getElementById("task-instruction");
const interactiveZone = document.getElementById("interactive-zone");

// Unlock progress
let currentTask = 0;
let tasksCompleted = 0;
const totalTasks = 5;

// Click Envelope

envelope.addEventListener("click", () => {
    envelope.style.display = "none";
    unlockScreen.style.display = "flex";

    // Start background music
    backgroundMusic.play().catch(error => {
        console.log("Autoplay was prevented:", error);
    });

    setTimeout(() => {
        document.querySelector(".unlock-window").classList.add("open");
        startUnlockTasks();
    }, 50);
});

// Quiz Questions
const quizQuestions = [
    {
        type: "multiple-choice",
        question: "Quelle était notre premier rendez-vous ?",
        choices: [
            { text: "A : À l'escalade", correct: true },
            { text: "B : Au cinéma", correct: false },
            { text: "C : Dans un bar", correct: false },
            { text: "D : Dans un parc", correct: false }
        ]
    },
    {
        type: "text",
        question: "Le lieu le plus insolite où on a RAAAWR ? 🦁",
        answer: "parc" // Must contain this word
    },
    {
        type: "multiple-choice",
        question: "Où est-ce qu'on s'est embrassés la 1ère fois ?",
        choices: [
            { text: "A : Sur un banc", correct: false },
            { text: "B : Devant chez toi", correct: true },
            { text: "C : Au lapin", correct: false },
            { text: "D : Dans un parc", correct: false }
        ]
    },
    {
        type: "multi-click",
        question: "Tu m'aimes comment ?",
        requiredClicks: 3,
        choices: [
            { text: "Bien ?", correct: true },
            { text: "Oui", correct: false },
            { text: "Un peu", correct: false },
            { text: "Beaucoup !", correct: false }
        ]
    },
    {
        type: "multiple-choice",
        question: "T'as pleuré à Paris ? (hihi)",
        choices: [
            { text: "A : Oui beaucoup", correct: true },
            { text: "B : Oui un peu", correct: true },
            { text: "C : Oui énormément", correct: true },
            { text: "D : Oui", correct: true }
        ]
    },
];

function startUnlockTasks() {
    loadTask(0);
}

function loadTask(taskIndex) {
    if (taskIndex >= quizQuestions.length) {
        completeUnlock();
        return;
    }

    interactiveZone.innerHTML = "";

    const quiz = quizQuestions[taskIndex];
    taskInstruction.textContent = quiz.question;

    // Multiple choice question
    if (quiz.type === "multiple-choice") {
        const choicesContainer = document.createElement("div");
        choicesContainer.className = "quiz-choices";

        quiz.choices.forEach((choice) => {
            const choiceBtn = document.createElement("button");
            choiceBtn.className = "quiz-choice";
            choiceBtn.textContent = choice.text;

            choiceBtn.addEventListener("click", () => {
                // Disable all buttons
                const allButtons = choicesContainer.querySelectorAll(".quiz-choice");
                allButtons.forEach(btn => btn.style.pointerEvents = "none");

                if (choice.correct) {
                    // Correct answer
                    choiceBtn.classList.add("correct");

                    setTimeout(() => {
                        tasksCompleted++;
                        updateProgress();
                        loadTask(taskIndex + 1);
                    }, 1000);
                } else {
                    // Wrong answer
                    choiceBtn.classList.add("wrong");

                    setTimeout(() => {
                        choiceBtn.classList.remove("wrong");
                        // Re-enable buttons for retry
                        allButtons.forEach(btn => btn.style.pointerEvents = "auto");
                    }, 800);
                }
            });

            choicesContainer.appendChild(choiceBtn);
        });

        interactiveZone.appendChild(choicesContainer);
    }

    // Text input question
    else if (quiz.type === "text") {
        const inputContainer = document.createElement("div");
        inputContainer.className = "text-input-container";

        const textInput = document.createElement("input");
        textInput.type = "text";
        textInput.className = "quiz-text-input";
        textInput.placeholder = "Tape ta réponse ici...";

        const submitBtn = document.createElement("button");
        submitBtn.className = "quiz-submit-btn";
        submitBtn.textContent = "Valider";

        const feedback = document.createElement("p");
        feedback.className = "quiz-feedback";

        submitBtn.addEventListener("click", () => {
            const userAnswer = textInput.value.toLowerCase().trim();
            const correctAnswer = quiz.answer.toLowerCase();

            if (userAnswer.includes(correctAnswer)) {
                // Correct answer
                feedback.textContent = "✅ Correct !";
                feedback.style.color = "#4caf50";
                textInput.classList.add("correct-input");
                submitBtn.disabled = true;
                textInput.disabled = true;

                setTimeout(() => {
                    tasksCompleted++;
                    updateProgress();
                    loadTask(taskIndex + 1);
                }, 1500);
            } else {
                // Wrong answer
                feedback.textContent = "❌ Essaie encore !";
                feedback.style.color = "#f44336";
                textInput.classList.add("wrong-input");

                setTimeout(() => {
                    feedback.textContent = "";
                    textInput.classList.remove("wrong-input");
                    textInput.value = "";
                    textInput.focus();
                }, 1000);
            }
        });

        // Allow Enter key to submit
        textInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                submitBtn.click();
            }
        });

        inputContainer.appendChild(textInput);
        inputContainer.appendChild(submitBtn);
        inputContainer.appendChild(feedback);
        interactiveZone.appendChild(inputContainer);

        // Auto-focus the input
        setTimeout(() => textInput.focus(), 100);
    }

    // Multi-click question
    else if (quiz.type === "multi-click") {
        const choicesContainer = document.createElement("div");
        choicesContainer.className = "quiz-choices";
        let clickCount = 0;

        quiz.choices.forEach((choice) => {
            const choiceBtn = document.createElement("button");
            choiceBtn.className = "quiz-choice";
            choiceBtn.textContent = choice.text;

            if (choice.correct) {
                choiceBtn.addEventListener("click", () => {
                    clickCount++;

                    // Update button text with progress
                    choiceBtn.textContent = `${choice.text} (${clickCount}/${quiz.requiredClicks})`;

                    // Add visual feedback
                    choiceBtn.style.background = "#ffe4e9";
                    choiceBtn.style.transform = "scale(1.05)";

                    setTimeout(() => {
                        choiceBtn.style.transform = "scale(1)";
                    }, 200);

                    // Check if required clicks reached
                    if (clickCount >= quiz.requiredClicks) {
                        choiceBtn.classList.add("correct");
                        const allButtons = choicesContainer.querySelectorAll(".quiz-choice");
                        allButtons.forEach(btn => btn.style.pointerEvents = "none");

                        setTimeout(() => {
                            tasksCompleted++;
                            updateProgress();
                            loadTask(taskIndex + 1);
                        }, 1000);
                    }
                });
            } else {
                // Wrong answers
                choiceBtn.addEventListener("click", () => {
                    choiceBtn.classList.add("wrong");

                    setTimeout(() => {
                        choiceBtn.classList.remove("wrong");
                    }, 800);
                });
            }

            choicesContainer.appendChild(choiceBtn);
        });

        interactiveZone.appendChild(choicesContainer);
    }
}

function updateProgress() {
    const progressPercent = (tasksCompleted / totalTasks) * 100;
    progressBar.style.width = progressPercent + "%";
    progressCount.textContent = tasksCompleted;
}

function completeUnlock() {
    taskInstruction.textContent = "T'as réussi ma vie !!!";
    interactiveZone.innerHTML = '<p style="font-size: 50px; animation: pulse 1s infinite;">🎉</p>';

    setTimeout(() => {
        unlockScreen.style.display = "none";
        letter.style.display = "flex";

        setTimeout(() => {
            document.querySelector(".letter-window").classList.add("open");
        }, 50);
    }, 2000);
}

// Logic to move the NO btn

function moveNoButton() {
    const min = 200;
    const max = 200;

    const distance = Math.random() * (max - min) + min;
    const angle = Math.random() * Math.PI * 2;

    const moveX = Math.cos(angle) * distance;
    const moveY = Math.sin(angle) * distance;

    noBtn.style.transition = "transform 0.3s ease";
    noBtn.style.transform = `translate(${moveX}px, ${moveY}px)`;
}

// Mouse event for desktop
noBtn.addEventListener("mouseover", moveNoButton);

// Touch events for mobile/tablet
noBtn.addEventListener("touchstart", (e) => {
    e.preventDefault();
    moveNoButton();
});

noBtn.addEventListener("touchmove", (e) => {
    e.preventDefault();
});

noBtn.addEventListener("click", (e) => {
    e.preventDefault();
    moveNoButton();
});

// Logic to make YES btn to grow

// let yesScale = 1;

// yesBtn.style.position = "relative"
// yesBtn.style.transformOrigin = "center center";
// yesBtn.style.transition = "transform 0.3s ease";

// noBtn.addEventListener("click", () => {
//     yesScale += 2;

//     if (yesBtn.style.position !== "fixed") {
//         yesBtn.style.position = "fixed";
//         yesBtn.style.top = "50%";
//         yesBtn.style.left = "50%";
//         yesBtn.style.transform = `translate(-50%, -50%) scale(${yesScale})`;
//     }else{
//         yesBtn.style.transform = `translate(-50%, -50%) scale(${yesScale})`;
//     }
// });

// YES is clicked

yesBtn.addEventListener("click", () => {
    title.textContent = "RAAAAAAWR!";

    catImg.src = "cat_dance.gif";

    document.querySelector(".letter-window").classList.add("final");

    buttons.style.display = "none";

    finalText.style.display = "block";
});
