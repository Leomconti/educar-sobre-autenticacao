document.addEventListener("DOMContentLoaded", () => {
  const gameContainer = document.getElementById("game-container");
  const passwordsContainer = document.getElementById("passwords-container");
  const scoreElement = document.getElementById("score");
  const livesElements = [
    document.getElementById("life1"),
    document.getElementById("life2"),
    document.getElementById("life3"),
  ];

  let score = 0;
  let lives = 3;

  function generateRandomPassword() {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    const length = Math.floor(Math.random() * 10) + 8; // Password length between 8 and 18
    let password = "";
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  function evaluatePassword(password) {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    return strength;
  }

  function spawnPassword() {
    const passwordText = generateRandomPassword();
    const passwordElement = document.createElement("div");
    passwordElement.className = "password";
    passwordElement.innerText = passwordText;
    passwordElement.style.top = `${Math.random() * 550}px`;
    passwordElement.style.left = `${Math.random() * 750}px`;

    passwordElement.addEventListener("click", () => {
      const passwordStrength = evaluatePassword(passwordText);
      if (passwordStrength >= 4) {
        score += passwordStrength * 10;
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

  function updatePasswordsSafety() {
    const passwords = document.querySelectorAll(".password");
    passwords.forEach((passwordElement) => {
      const passwordText = passwordElement.innerText;
      const strength = evaluatePassword(passwordText);
      passwordElement.style.backgroundColor = `rgba(0, 255, 0, ${strength / 6})`;
    });
  }

  setInterval(spawnPassword, 1000);
  setInterval(updatePasswordsSafety, 1000);
});
