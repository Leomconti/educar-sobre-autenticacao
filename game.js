const passwordContainer = document.getElementById("password-container");
const timerElement = document.getElementById("time-left");
const progressElement = document.getElementById("progress");
const scoreElement = document.getElementById("score");
const resultElement = document.getElementById("result");
const finalScoreElement = document.getElementById("final-score");
const powerUsageElement = document.getElementById("power-usage");
const passwordSummaryElement = document.getElementById("password-summary");
const restartButton = document.getElementById("restart");

const a2fButton = document.getElementById("a2f");
const passwordManagerButton = document.getElementById("password-manager");
const biometricsButton = document.getElementById("biometrics");

const powerInfoElement = document.getElementById("power-info");
const powerDescriptionElement = document.getElementById("power-description");
const closeInfoButton = document.getElementById("close-info");

let timeLeft = 60;
let score = 0;
let gameInterval;
let passwords = [];
let powerUsage = { a2f: 0, passwordManager: 0, biometrics: 0 };
let passwordSummary = { correct: [], incorrect: [] };

const weakPasswords = ["123456", "password", "qwerty", "admin", "12345678", "111111"];
const strongPasswords = ["P@ssw0rd123!", "Str0ngP@ss!", "C0mpl3xP@ss", "S3cur3P@ssw0rd!", "Un1qu3P@ss123"];

function startGame() {
  timeLeft = 60;
  score = 0;
  powerUsage = { a2f: 0, passwordManager: 0, biometrics: 0 };
  passwordSummary = { correct: [], incorrect: [] };
  updateUI();
  generatePasswords();
  gameInterval = setInterval(updateGame, 1000);
}

function updateGame() {
  timeLeft--;
  if (timeLeft <= 0) {
    endGame();
  }
  updateUI();
}

function generatePasswords() {
  passwordContainer.innerHTML = "";
  passwords = [];
  for (let i = 0; i < 5; i++) {
    const isStrong = Math.random() < 0.5;
    const password = isStrong
      ? strongPasswords[Math.floor(Math.random() * strongPasswords.length)]
      : weakPasswords[Math.floor(Math.random() * weakPasswords.length)];
    passwords.push({ text: password, isStrong });
    const passwordElement = document.createElement("div");
    passwordElement.classList.add("password");
    passwordElement.textContent = password;
    passwordElement.addEventListener("click", () => checkPassword(i));
    passwordContainer.appendChild(passwordElement);
  }
}

function checkPassword(index) {
  const password = passwords[index];
  if (password.isStrong) {
    score++;
    passwordSummary.correct.push(password.text);
  } else {
    timeLeft -= 5;
    passwordSummary.incorrect.push(password.text);
  }
  generatePasswords();
  updateUI();
}

function updateUI() {
  timerElement.textContent = timeLeft;
  progressElement.style.width = `${(timeLeft / 60) * 100}%`;
  scoreElement.textContent = score.toString().padStart(4, "0");
}

function endGame() {
  clearInterval(gameInterval);
  resultElement.classList.remove("hidden");
  finalScoreElement.textContent = score;
  powerUsageElement.innerHTML = `
        <p>A2F: ${powerUsage.a2f}</p>
        <p>Gerenciador de Senhas: ${powerUsage.passwordManager}</p>
        <p>Biometria: ${powerUsage.biometrics}</p>
    `;
  passwordSummaryElement.innerHTML = `
        <h3>Senhas Corretas:</h3>
        <ul>${passwordSummary.correct.map((p) => `<li>${p}</li>`).join("")}</ul>
        <h3>Senhas Incorretas:</h3>
        <ul>${passwordSummary.incorrect.map((p) => `<li>${p}</li>`).join("")}</ul>
    `;
}

restartButton.addEventListener("click", () => {
  resultElement.classList.add("hidden");
  startGame();
});

function activateA2F() {
  powerUsage.a2f++;
  // Implement A2F power logic here
  console.log("A2F activated");
}

function activatePasswordManager() {
  powerUsage.passwordManager++;
  // Implement Password Manager power logic here
  console.log("Password Manager activated");
}

function activateBiometrics() {
  powerUsage.biometrics++;
  timeLeft += 1.5;
  updateUI();
  console.log("Biometrics activated");
}

a2fButton.addEventListener("click", activateA2F);
passwordManagerButton.addEventListener("click", activatePasswordManager);
biometricsButton.addEventListener("click", activateBiometrics);

document.querySelectorAll(".info-icon").forEach((icon) => {
  icon.addEventListener("click", (event) => {
    event.stopPropagation();
    const powerName = event.target.closest(".power").id;
    showPowerInfo(powerName);
  });
});

function showPowerInfo(powerName) {
  const powerInfo = {
    a2f: "Autenticação de dois fatores (A2F) é um método de autenticação que utiliza dois fatores para verificar a identidade do usuário, como uma senha e um código enviado por SMS.",
    "password-manager":
      "Gerenciador de Senhas ajuda a criar, armazenar e gerenciar senhas fortes e únicas para suas contas online, garantindo maior segurança.",
    biometrics:
      "Biometria utiliza características físicas únicas, como impressões digitais ou reconhecimento facial, para verificar a identidade do usuário.",
  };
  powerInfoElement.querySelector("h2").textContent = "Informações do Poder";
  powerDescriptionElement.textContent = powerInfo[powerName];
  powerInfoElement.classList.remove("hidden");
}

closeInfoButton.addEventListener("click", () => {
  powerInfoElement.classList.add("hidden");
});

document.addEventListener("keydown", (event) => {
  if (event.key === "a" || event.key === "A") {
    activateA2F();
  } else if (event.key === "s" || event.key === "S") {
    activatePasswordManager();
  } else if (event.key === "d" || event.key === "D") {
    activateBiometrics();
  }
});

startGame();
