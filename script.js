document.addEventListener("DOMContentLoaded", () => {
  const gameContainer = document.getElementById("game-container");
  const passwordsContainer = document.getElementById("passwords-container");
  const scoreElement = document.getElementById("score");
  const livesElements = [
    document.getElementById("life1"),
    document.getElementById("life2"),
    document.getElementById("life3"),
  ];

  const passwords = [
    "123456",
    "password",
    "123456789",
    "12345678",
    "12345",
    "1234567",
    "admin",
    "1234",
    "letmein",
    "qwerty",
    "XK#GT!2C$N#PLBUS",
  ];

  let score = 0;
  let lives = 3;

  function spawnPassword() {
    const passwordText = passwords[Math.floor(Math.random() * passwords.length)];
    const passwordElement = document.createElement("div");
    passwordElement.className = "password";
    passwordElement.innerText = passwordText;
    passwordElement.style.top = `${Math.random() * 550}px`;
    passwordElement.style.left = `${Math.random() * 750}px`;

    passwordElement.addEventListener("click", () => {
      if (passwordText === "XK#GT!2C$N#PLBUS") {
        score += 100;
      } else {
        lives--;
        livesElements[3 - lives - 1].style.color = "grey";
        if (lives === 0) {
          alert("Game Over!");
          score = 0;
          lives = 3;
          livesElements.forEach((life) => (life.style.color = "red"));
        }
      }
      scoreElement.innerText = String(score).padStart(4, "0");
      passwordsContainer.removeChild(passwordElement);
    });

    passwordsContainer.appendChild(passwordElement);
  }

  setInterval(spawnPassword, 1000);
});
