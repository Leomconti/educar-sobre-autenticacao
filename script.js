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
  let highestStrength = 0;

  function generateRandomPassword() {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const length = Math.floor(Math.random() * 10) + 4;
    let password = "";

    const type = Math.random();
    if (type < 0.33) {
      // Weak password: only letters
      for (let i = 0; i < length; i++) {
        password += letters.charAt(Math.floor(Math.random() * letters.length));
      }
    } else if (type < 0.66) {
      // Medium password: letters and numbers
      for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * 62));
      }
    } else {
      // Strong password: letters, numbers, and special characters
      for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
      }
    }

    return password;
  }

  function evaluatePassword(password) {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 2;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 2;
    if (/[0-9]/.test(password)) strength += 2;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 3;
    return strength;
  }

  function spawnPassword() {
    const passwordText = generateRandomPassword();
    const passwordStrength = evaluatePassword(passwordText);
    const passwordElement = document.createElement("div");
    passwordElement.className = "password";
    passwordElement.innerHTML = `${passwordText}<br>Strength: ${passwordStrength}`;
    passwordElement.style.top = `${Math.random() * 550}px`;
    passwordElement.style.left = `${Math.random() * 750}px`;

    passwordElement.addEventListener("click", () => {
      if (passwordStrength >= highestStrength) {
        score += passwordStrength * 10;
      } else {
        lives--;
        livesElements[3 - lives - 1].style.color = "grey";
        if (lives === 0) {
          alert("Game Over!");
          score = 0;
          lives = 3;
          highestStrength = 0;
          livesElements.forEach((life) => (life.style.color = "red"));
        }
      }
      passwordsContainer.removeChild(passwordElement);
      recalculateHighestStrength();
      scoreElement.innerText = String(score).padStart(4, "0");
    });

    passwordsContainer.appendChild(passwordElement);
    recalculateHighestStrength();
  }

  function updatePasswordsSafety() {
    const passwords = document.querySelectorAll(".password");
    passwords.forEach((passwordElement) => {
      const passwordText = passwordElement.innerHTML.split("<br>")[0];
      const strength = evaluatePassword(passwordText);
      passwordElement.style.backgroundColor = `rgba(0, 255, 0, ${strength / 10})`;
      passwordElement.innerHTML = `${passwordText}<br>Strength: ${strength}`;
    });
  }

  function recalculateHighestStrength() {
    const passwords = document.querySelectorAll(".password");
    highestStrength = 0;
    passwords.forEach((passwordElement) => {
      const passwordText = passwordElement.innerHTML.split("<br>")[0];
      const strength = evaluatePassword(passwordText);
      if (strength > highestStrength) {
        highestStrength = strength;
      }
    });
  }

  setInterval(spawnPassword, 1000);
  setInterval(updatePasswordsSafety, 1000);
});
