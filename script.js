
// =====================================
// TYPEMASTER - SMART TYPING ANALYZER
// =====================================

// 1. Typing passages

const passages = {
    easy: [
        "Practice makes a person better. Every day is a new opportunity to learn something useful and improve our skills.",
        "A good student manages time, studies regularly and works hard to achieve personal and academic goals.",
        "Computers help people solve problems, communicate with others and complete many daily tasks."
    ],

    medium: [
        "Technology is transforming our world. Computers and digital tools help students explore knowledge, solve problems and develop creative ideas.",
        "Success requires patience, dedication and regular practice. Small improvements every day can create meaningful results in the future.",
        "Communication is an important skill in education and professional life. Clear writing helps people express their thoughts effectively."
    ],

    hard: [
        "Artificial intelligence combines mathematics, algorithms and computing power to develop intelligent systems capable of analyzing complex information.",
        "Programming requires logical reasoning, creativity and problem-solving abilities. Consistent experimentation helps developers create reliable applications.",
        "Digital transformation has revolutionized communication, education and business through innovative technologies and intelligent computing systems."
    ]
};

// 2. Select HTML elements

const registration = document.getElementById("registration");
const testSection = document.getElementById("testSection");
const resultSection = document.getElementById("resultSection");

const userForm = document.getElementById("userForm");

const input = document.getElementById("typingInput");
const passageBox = document.getElementById("passage");

const difficulty = document.getElementById("difficulty");
const duration = document.getElementById("duration");

// 3. Variables

let student = {};
let currentText = "";

let timer = null;
let timeLeft = 60;
let testDuration = 60;

let started = false;
let finished = false;

let startTime = 0;

// 4. User registration

userForm.addEventListener("submit", function(event) {

    event.preventDefault();

    student.name = document.getElementById("name").value.trim();
    student.age = document.getElementById("age").value;
    student.email = document.getElementById("email").value.trim();
    student.role = document.getElementById("occupation").value;

    if (!student.name || !student.role) {
        alert("Please complete all required details.");
        return;
    }

    document.getElementById("welcomeName").textContent =
        student.name;

    document.getElementById("welcomeRole").textContent =
        student.role + " | Age: " + student.age;

    registration.classList.add("hidden");
    testSection.classList.remove("hidden");

    loadPassage();

});

// 5. Load random typing passage

function loadPassage() {

    const level = difficulty.value;
    const selectedPassages = passages[level];

    currentText = selectedPassages[
        Math.floor(Math.random() * selectedPassages.length)
    ];

    document.getElementById("levelBadge").textContent =
        level.toUpperCase();

    passageBox.innerHTML = "";

    currentText.split("").forEach(function(character, index) {

        const span = document.createElement("span");

        span.textContent = character;

        if (index === 0) {
            span.classList.add("current");
        }

        passageBox.appendChild(span);

    });

    resetTest();

}

// 6. Start test

function startTest() {

    if (started || finished) return;

    testDuration = Number(duration.value);
    timeLeft = testDuration;

    started = true;
    startTime = Date.now();

    input.disabled = false;
    input.focus();

    document.getElementById("startBtn").textContent =
        "Test Running...";

    timer = setInterval(function() {

        timeLeft--;

        document.getElementById("time").textContent =
            timeLeft;

        updateStatistics();

        if (timeLeft <= 0) {
            finishTest();
        }

    }, 1000);

}

// 7. Calculate typing speed and accuracy

function updateStatistics() {

    const typed = input.value;

    let correct = 0;
    let errors = 0;

    for (let i = 0; i < typed.length; i++) {

        if (typed[i] === currentText[i]) {
            correct++;
        } else {
            errors++;
        }

    }

    const elapsedMinutes =
        (Date.now() - startTime) / 60000;

    const speed = elapsedMinutes > 0
        ? Math.round((correct / 5) / elapsedMinutes)
        : 0;

    const accuracy = typed.length > 0
        ? Math.round((correct / typed.length) * 100)
        : 100;

    // Update dashboard

    document.getElementById("wpm").textContent = speed;

    document.getElementById("accuracy").textContent =
        accuracy + "%";

    document.getElementById("errors").textContent =
        errors;

    // Calculate progress

    const progress = Math.round(
        (typed.length / currentText.length) * 100
    );

    document.getElementById("progressBar").style.width =
        progress + "%";

    document.getElementById("progressText").textContent =
        progress + "%";

    // Highlight typed characters

    const letters = passageBox.querySelectorAll("span");

    letters.forEach(function(letter, index) {

        letter.className = "";

        if (index < typed.length) {

            if (typed[index] === currentText[index]) {
                letter.classList.add("correct");
            } else {
                letter.classList.add("incorrect");
            }

        }

        if (index === typed.length && !finished) {
            letter.classList.add("current");
        }

    });

    // Finish when passage is completed

    if (typed.length >= currentText.length) {
        finishTest();
    }

}

// 8. Detect typing activity

input.addEventListener("input", function() {

    if (!started || finished) return;

    // Do not allow extra characters

    if (input.value.length > currentText.length) {
        input.value = input.value.slice(0, currentText.length);
    }

    updateStatistics();

});

// 9. Finish test

function finishTest() {

    if (!started || finished) return;

    finished = true;
    started = false;

    clearInterval(timer);

    input.disabled = true;

    const typed = input.value;

    let correct = 0;
    let errors = 0;

    for (let i = 0; i < typed.length; i++) {

        if (typed[i] === currentText[i]) {
            correct++;
        } else {
            errors++;
        }

    }

    const elapsedMinutes = Math.max(
        (Date.now() - startTime) / 60000,
        1 / 60000
    );

    const speed = Math.round(
        (correct / 5) / elapsedMinutes
    );

    const accuracy = typed.length > 0
        ? Math.round((correct / typed.length) * 100)
        : 0;

    // Display final results

    document.getElementById("resultName").textContent =
        "Congratulations, " + student.name + "!";

    document.getElementById("finalWpm").textContent =
        speed + " WPM";

    document.getElementById("finalAccuracy").textContent =
        accuracy + "%";

    document.getElementById("finalErrors").textContent =
        errors;

    document.getElementById("finalCorrect").textContent =
        correct;

    // Generate performance report

    generateFeedback(speed, accuracy, errors);

    resultSection.classList.remove("hidden");

    document.getElementById("startBtn").textContent =
        "Test Completed";

    resultSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}

// 10. Generate personalized improvement suggestions

function generateFeedback(speed, accuracy, errors) {

    let title = "";
    let message = "";

    if (speed >= 50 && accuracy >= 95) {

        title = "Excellent Performance! 🌟";

        message =
            "Your typing performance is excellent. You have achieved good speed and accuracy. Keep challenging yourself with advanced passages.";

    } else if (speed >= 30 && accuracy >= 85) {

        title = "Very Good Performance!";

        message =
            "You are developing good typing skills. A little more regular practice can help you achieve even better results.";

    } else if (speed >= 15) {

        title = "Good Beginning!";

        message =
            "You have a good starting point. Focus on improving your accuracy and gradually increase your typing speed.";

    } else {

        title = "Keep Practicing!";

        message =
            "Every expert starts as a beginner. Take your time, learn proper typing techniques and practice regularly.";

    }

    document.getElementById("performanceTitle").textContent =
        title;

    document.getElementById("performanceMessage").textContent =
        message;

    // Create improvement suggestions

    let tips = [];

    if (accuracy < 85) {

        tips.push(
            "Focus on accuracy before trying to type faster."
        );

    }

    if (speed < 30) {

        tips.push(
            "Practice typing for 10 to 15 minutes every day."
        );

    }

    if (errors > 5) {

        tips.push(
            "Slow down and carefully read the passage before typing."
        );

    }

    if (accuracy >= 95) {

        tips.push(
            "Your accuracy is strong. Maintain it while gradually increasing speed."
        );

    }

    if (speed >= 40) {

        tips.push(
            "Try difficult passages to challenge your typing abilities."
        );

    }

    tips.push(
        "Learn the correct finger positions on the keyboard."
    );

    tips.push(
        "Sit comfortably and maintain a relaxed typing posture."
    );

    tips.push(
        "Repeat the test regularly and compare your progress."
    );

    // Display suggestions

    const tipsList = document.getElementById("tipsList");

    tipsList.innerHTML = "";

    tips.forEach(function(tip) {

        const li = document.createElement("li");

        li.textContent = tip;

        tipsList.appendChild(li);

    });

}

// 11. Restart the test

function resetTest() {

    clearInterval(timer);

    started = false;
    finished = false;

    timeLeft = Number(duration.value);
    testDuration = timeLeft;

    input.value = "";
    input.disabled = true;

    document.getElementById("wpm").textContent = "0";

    document.getElementById("accuracy").textContent =
        "100%";

    document.getElementById("errors").textContent = "0";

    document.getElementById("time").textContent =
        timeLeft;

    document.getElementById("progressBar").style.width =
        "0%";

    document.getElementById("progressText").textContent =
        "0%";

    resultSection.classList.add("hidden");

    document.getElementById("startBtn").textContent =
        "Start Test";

    const letters = passageBox.querySelectorAll("span");

    letters.forEach(function(letter, index) {

        letter.className = "";

        if (index === 0) {
            letter.classList.add("current");
        }

    });

}

// 12. Button controls

document.getElementById("startBtn").addEventListener(
    "click", startTest
);

document.getElementById("restartBtn").addEventListener(
    "click", resetTest
);

document.getElementById("newBtn").addEventListener(
    "click", loadPassage
);

// 13. Difficulty and duration changes

difficulty.addEventListener("change", loadPassage);

duration.addEventListener("change", resetTest);

// 14. Take another test

document.getElementById("againBtn").addEventListener(
    "click", function() {

        loadPassage();

        testSection.scrollIntoView({
            behavior: "smooth"
        });

    }
);

// 15. Change user

function goHome() {

    clearInterval(timer);

    started = false;
    finished = false;

    student = {};

    userForm.reset();

    input.value = "";
    input.disabled = true;

    testSection.classList.add("hidden");
    resultSection.classList.add("hidden");
    registration.classList.remove("hidden");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}

document.getElementById("changeUser").addEventListener(
    "click", goHome
);

document.getElementById("homeBtn").addEventListener(
    "click", goHome
);
