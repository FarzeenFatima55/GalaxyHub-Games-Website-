const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const statusText = document.getElementById("statusText");

let running = false;
let animationId;

/* Images */
const shipImg = new Image();
shipImg.src = "meteor.png";

const dodgeImg = new Image();
dodgeImg.src = "dodg.png";

/* Player (SINGLE SHIP) */
const player = {
  x: 170,
  y: 420,
  width: 55,
  height: 55,
  speed: 20
};

/* MULTIPLE METEORS */
let meteors = [];

/* Create meteors */
function createMeteors(count) {
  meteors = [];
  for (let i = 0; i < count; i++) {
    meteors.push({
      x: Math.random() * (canvas.width - 50),
      y: Math.random() * -500,
      size: 50,
      speed: 3 + Math.random() * 2
    });
  }
}

/* Controls */
window.addEventListener("keydown", movePlayer);
startBtn.addEventListener("click", startGame);
resetBtn.addEventListener("click", resetGame);

/* Start Game */
function startGame() {
  if (!running) {
    running = true;
    statusText.innerText = "Survive!";
    createMeteors(4); // 🔥 number of dodges
    gameLoop();
  }
}

/* Main Game Loop */
function gameLoop() {
  if (!running) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawPlayer();
  drawMeteors();
  moveMeteors();
  checkCollisions();

  animationId = requestAnimationFrame(gameLoop);
}

/* Draw Ship */
function drawPlayer() {
  ctx.drawImage(shipImg, player.x, player.y, player.width, player.height);
}

/* Draw ALL Meteors */
function drawMeteors() {
  meteors.forEach(meteor => {
    ctx.drawImage(dodgeImg, meteor.x, meteor.y, meteor.size, meteor.size);
  });
}

/* Move ALL Meteors */
function moveMeteors() {
  meteors.forEach(meteor => {
    meteor.y += meteor.speed;

    if (meteor.y > canvas.height) {
      meteor.y = -meteor.size;
      meteor.x = Math.random() * (canvas.width - meteor.size);
    }
  });
}

/* Player Movement */
function movePlayer(e) {
  if (!running) return;

  if (e.key === "ArrowLeft" && player.x > 0) {
    player.x -= player.speed;
  }

  if (e.key === "ArrowRight" && player.x < canvas.width - player.width) {
    player.x += player.speed;
  }
}

/* Collision Check (Ship vs ALL Meteors) */
function checkCollisions() {
  meteors.forEach(meteor => {
    if (
      meteor.x < player.x + player.width &&
      meteor.x + meteor.size > player.x &&
      meteor.y < player.y + player.height &&
      meteor.y + meteor.size > player.y
    ) {
      gameOver();
    }
  });
}

/* Game Over */
function gameOver() {
  running = false;
  cancelAnimationFrame(animationId);
  statusText.innerText = "GAME OVER!";
}

/* Reset Game */
function resetGame() {
  running = false;
  cancelAnimationFrame(animationId);

  player.x = 170;
  meteors = [];

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  statusText.innerText = "Press Start to Play";
}
