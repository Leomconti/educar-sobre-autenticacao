const elements = {
  start: document.getElementById("play"),
  timer: document.getElementById("timer"),
  score: document.getElementById("score"),
  progress: document.getElementById("progress"),
  splashScreen: document.getElementById("splash-screen"),
  gameContainer: document.getElementById("game-container"),
  a2f: document.getElementById("power-a2f"),
  gs: document.getElementById("power-gs"),
  bio: document.getElementById("power-bio"),
  alert: document.getElementById("alert"),
  results: document.getElementById("results"),
  resultClose: document.getElementById("result-close"),
  resultUsageA2f: document.getElementById("a2f-powerup-usage"),
  resultUsageGS: document.getElementById("gs-powerup-usage"),
  resultUsageBIO: document.getElementById("bio-powerup-usage"),
  resultScore: document.getElementById("result-score"),
  resultRightLane: document.getElementById("result-right-lane"),
  resultWrongLane: document.getElementById("result-wrong-lane"),
};

const TOTAL_TIMER = 30;

const powerUps = {
  a: activateA2F,
  s: activatePasswordManager,
  d: activateBiometrics,
};

// const weakPasswords = ["123456", "password", "qwerty", "admin", "12345678", "111111"];
// const strongPasswords = ["P@ssw0rd123!", "Str0ngP@ss!", "C0mpl3xP@ss", "S3cur3P@ssw0rd!", "Un1qu3P@ss123"];

// 0 - aleatoriedade (x => bom)
// 1 - tamanho (x => bom)
// 2 - números (x => bom)
// 3 - letra maiúscula e minúscula (x => bom)
// 4 - caracteres especiais (x => bom)
// 5 - forte ou fraca (x => forte)
const weakPasswords = ["__x___123456", "______password"];
const strongPasswords = ["x_xxxxP@ssw0rd123!", "x_xxxxStr0ngP@ss!"];

let game = null;

elements.start.onclick = (e) => {
  toggleSplashScreenVisibility();
  start();
};

function toggleSplashScreenVisibility() {
  elements.splashScreen.classList.toggle("hidden");
}

function Game() {
  return {
    score: 0,
    sequence: 0,
    interval: null,
    roundAnswers: [],
    totalPasswords: 2,
    timeLeft: TOTAL_TIMER,
    canUseA2f: false,
    canUsePasswordManager: false,
    canUseBiometrics: false,
    a2fUsage: 0,
    passwordManagerUsage: 0,
    bioetricsUsage: 0,
    freeToClickState: false,
    timeoutFreeClick: 4,
    errorToleranteState: false,
    errorTolerance: 3,
    onlyCorrectState: false,
    onlyCorrectLeft: 4,
    rightPasswords: [],
    wrongPasswords: [],
    activatePowerUps: (handler) => document.addEventListener("keydown", handler),
    desactivatePowerUps: (handler) => document.removeEventListener("keydown", handler),
  };
}

function generatePasswords() {
  game.roundAnswers = [];
  elements.gameContainer.replaceChildren();

  if (game.onlyCorrectState) {
    const password = strongPasswords[Math.trunc(Math.random() * strongPasswords.length)];
    elements.gameContainer.appendChild(createPasswordElement(password, 0));
    game.roundAnswers.push(true);
    return;
  }

  const rightPasswordIndex = Math.trunc(Math.random() * game.totalPasswords);
  for (let i = 0; i < game.totalPasswords; ++i) {
    const isCorrect = i === rightPasswordIndex;
    const password = isCorrect
      ? strongPasswords[Math.trunc(Math.random() * strongPasswords.length)]
      : weakPasswords[Math.trunc(Math.random() * weakPasswords.length)];
    elements.gameContainer.appendChild(createPasswordElement(password, i));
    game.roundAnswers.push(isCorrect);
  }
  game.totalPasswords++;
}

function clickWasRight() {
  elements.progress.classList.add("right");
  setTimeout(() => elements.progress.classList.remove("right"), 200);
}

function clickWasWrong() {
  elements.progress.classList.add("wrong");
  setTimeout(() => elements.progress.classList.remove("wrong"), 200);
}

function handlerPasswordClick(index, password) {
  checkPassword(index, password);
  generatePasswords();
  updateUserInterface();
}

function checkPassword(index, password) {
  if (game.freeToClickState) {
    game.score++;
    return;
  }

  if (game.errorToleranteState && !game.roundAnswers[index]) {
    game.errorTolerance--;
    elements.alert.textContent = `Você pode errar por ${game.errorTolerance} tentativa(s)`;
    if (game.errorTolerance === 0) {
      elements.alert.classList.add("hidden");
      game.errorToleranteState = false;
      game.errorTolerance = 3;
    }
    return;
  }

  if (game.onlyCorrectState) {
    game.onlyCorrectLeft--;
    elements.alert.textContent = `Somente a correta por mais ${game.errorTolerance} rodada(s)`;
    if (game.onlyCorrectLeft === 0) {
      elements.alert.classList.add("hidden");
      game.onlyCorrectState = false;
      game.onlyCorrectLeft = 4;
    }
  }

  if (game.roundAnswers[index]) {
    clickWasRight();
    game.score++;
    if (!game.onlyCorrectState) {
      game.sequence++;
    }
    game.rightPasswords.push(password);
    enablePowerUp();
    return;
  }

  clickWasWrong();
  game.timeLeft -= 5;
  game.sequence = 0;
  game.wrongPasswords.push(password);
  disableAllPowerUps();
}

function enablePowerUp() {
  if (game.sequence >= 9 && !game.canUseBiometrics) {
    game.canUseBiometrics = true;
    elements.bio.classList.add("enabled");
    return;
  }

  if (game.sequence >= 6 && !game.canUsePasswordManager) {
    game.canUsePasswordManager = true;
    elements.gs.classList.add("enabled");
    return;
  }

  if (game.sequence >= 3 && !game.canUseA2f) {
    game.canUseA2f = true;
    elements.a2f.classList.add("enabled");
    return;
  }
}

function disableAllPowerUps() {
  game.canUseA2f = false;
  game.canUsePasswordManager = false;
  game.canUseBiometrics = false;
  elements.a2f.classList.remove("enabled");
  elements.gs.classList.remove("enabled");
  elements.bio.classList.remove("enabled");
}

function createPasswordElement(password, index) {
  const passwordElement = document.createElement("div");
  passwordElement.classList.add("password");
  passwordElement.textContent = getOnlyPassword(password);
  passwordElement.onclick = () => handlerPasswordClick(index, password);
  return passwordElement;
}

function start() {
  game = Game();
  disableAllPowerUps();
  updateUserInterface();
  elements.gameContainer.replaceChildren();
  game.activatePowerUps(handlerKeydownEvent);
  setTimeout(() => {
    game.interval = setInterval(executeGameLoop, 1000);
    generatePasswords();
  }, 1000);
}

function executeGameLoop() {
  game.timeLeft--;
  if (game.timeLeft <= 0) {
    game.timeLeft = 0;
    end();
  }
  updateUserInterface();
}

function end() {
  clearInterval(game.interval);
  game.desactivatePowerUps(handlerKeydownEvent);
  toggleSplashScreenVisibility();
  showResults();
}

function updateUserInterface() {
  elements.timer.textContent = game.timeLeft;
  elements.progress.style.width = `${(game.timeLeft / TOTAL_TIMER) * 100}%`;
  elements.score.textContent = game.score.toString().padStart(4, "0");
}

function activateA2F() {
  if (game.canUseA2f) {
    game.a2fUsage++;
    disableAllPowerUps();
    game.sequence = 0;
    game.errorToleranteState = true;
    elements.alert.textContent = `Você pode errar por ${game.errorTolerance} tentativa(s)`;
    elements.alert.classList.remove("hidden");
  }
}

function activatePasswordManager() {
  if (game.canUsePasswordManager) {
    game.passwordManagerUsage++;
    disableAllPowerUps();
    game.sequence = 0;
    game.freeToClickState = true;
    elements.alert.classList.remove("hidden");
    elements.alert.textContent = `O clique à vontade acaba em ${game.timeoutFreeClick--}s`;
    const handle = setInterval(() => {
      elements.alert.textContent = `O clique à vontade acaba em ${game.timeoutFreeClick--}s`;
    }, 1000);
    setTimeout(() => {
      elements.alert.classList.add("hidden");
      clearInterval(handle);
      game.freeToClickState = false;
      game.timeoutFreeClick = 4;
    }, 4000);
  }
}

function activateBiometrics() {
  if (game.canUseBiometrics) {
    game.bioetricsUsage++;
    disableAllPowerUps();
    game.sequence = 0;
    game.onlyCorrectState = true;
    generatePasswords();
    elements.alert.textContent = `Somente a correta por mais ${game.errorTolerance} rodada(s)`;
    elements.alert.classList.remove("hidden");
  }
}

function handlerKeydownEvent(event) {
  const keyLowerCase = event.key.toLowerCase();
  if (powerUps.hasOwnProperty(keyLowerCase)) {
    powerUps[keyLowerCase]();
  }
}

function showResults() {
  elements.results.style.display = "flex";
  loadResultInfo();
}

elements.resultClose.onclick = (e) => {
  elements.results.style.display = "none";
};

function loadResultInfo() {
  elements.resultScore.textContent = game.score.toString().padStart(4, "0");
  elements.resultUsageA2f.textContent = game.a2fUsage;
  elements.resultUsageGS.textContent = game.passwordManagerUsage;
  elements.resultUsageBIO.textContent = game.bioetricsUsage;

  game.rightPasswords.forEach((p) => {
    const strength = p[5] === "x" ? "Forte" : "Fraca";
    elements.resultRightLane.innerHTML += getResultPasswordCard(strength, p);
  });

  game.wrongPasswords.forEach((p) => {
    const strength = p[5] === "x" ? "Forte" : "Fraca";
    elements.resultWrongLane.innerHTML += getResultPasswordCard(strength, p);
  });
}

function getResultPasswordCard(strength, password) {
  let pfeatures = "";
  getPasswordFeatures(password).forEach((f) => {
    pfeatures += `<span class="rptip">${f}</span>`;
  });
  return `
    <div class="result-password-card">
      <span class="rptype" id="result-password-type">${strength}</span>
      <span class="rptitle" id="result-password">${getOnlyPassword(password)}</span>
      <div id="result-password-tips">${pfeatures}</div>
    </div>
  `;
}

function getOnlyPassword(password) {
  return password.substring(6);
}

function getPasswordFeatures(password) {
  const features = [];
  const p = password.substring(0, 4);

  // aleatoriedade
  if (p[0] === "x") features.push("Alta Aleatoriedade");
  else features.push("Baixa Aleatoriedade");

  // tamanho
  if (p[1] === "x") features.push("Longa");
  else features.push("Curta");

  // números
  if (p[2] === "x") features.push("Contém Números");
  else features.push("Não Contém Números");

  // letra maiúscula e minúscula
  if (p[3] === "x") features.push("Letras em Caixa Baixa e Alta");
  else features.push("Não tem Letras em Caixa Alta e Baixa");

  // caracteres especiais
  if (p[4] === "x") features.push("Possui Caracteres Especiais");
  else features.push("Não Possui Caracteres Especiais");

  return features;
}
