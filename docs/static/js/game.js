// игра
const gameArea = document.getElementById("gameArea");
const shark = document.getElementById("shark");
const timerElement = document.getElementById("timer");
const probability_creating_coins = 0.05;
const probability_creating_jellyfish = 0.01;
const coins_speed = 2;
const jelly_speed = 1;
let isDragging = false;
let currentX;
let initialX;
let xOffset = 0;
let coins = [];
let jellyfish = [];
let score = 0;
let gameStartTime;
let gameTimeout;
let requestAnimationId;
let gameRunning = false;

// Функция для создания падающих объектов
function createObject(type) {
  const obj = document.createElement("div");
  obj.classList.add(type);
  obj.style.left = Math.random() * (gameArea.offsetWidth - 30) + "px";
  obj.style.top = "-30px";
  gameArea.appendChild(obj);
  return obj;
}

// Функция для обновления положения падающих объектов
function updateObjects() {
  coins.forEach((coin) => {
    coin.style.top = `${parseInt(coin.style.top) + coins_speed}px`;
    if (parseInt(coin.style.top) > gameArea.offsetHeight) {
      gameArea.removeChild(coin);
      coins = coins.filter((c) => c !== coin);
    }
  });

  jellyfish.forEach((jelly) => {
    jelly.style.top = `${parseInt(jelly.style.top) + jelly_speed}px`;
    if (parseInt(jelly.style.top) > gameArea.offsetHeight) {
      gameArea.removeChild(jelly);
      jellyfish = jellyfish.filter((j) => j !== jelly);
    }
  });
}

// Функция для проверки столкновений
function checkCollisions() {
  coins.forEach((coin) => {
    const sharkRect = shark.getBoundingClientRect();
    const coinRect = coin.getBoundingClientRect();

    if (
      sharkRect.left < coinRect.right &&
      sharkRect.right > coinRect.left &&
      sharkRect.top < coinRect.bottom &&
      sharkRect.bottom > coinRect.top
    ) {
      gameArea.removeChild(coin);
      coins = coins.filter((c) => c !== coin);
      score++;
      document.getElementById("score").textContent = `Счет: ${score}`;
    }
  });

  jellyfish.forEach((jelly) => {
    const sharkRect = shark.getBoundingClientRect();
    const jellyRect = jelly.getBoundingClientRect();

    if (
      sharkRect.left < jellyRect.right &&
      sharkRect.right > jellyRect.left &&
      sharkRect.top < jellyRect.bottom &&
      sharkRect.bottom > jellyRect.top
    ) {
      score = 0;
      document.getElementById("score").textContent = `Счет: ${score}`;
    }
  });
}

// Функция для сброса игры
function resetGame() {
  coins.forEach((coin) => gameArea.removeChild(coin));
  jellyfish.forEach((jelly) => gameArea.removeChild(jelly));
  coins = [];
  jellyfish = [];
  gameStartTime = null;
  clearTimeout(gameTimeout);
  // timerElement.textContent = "30";
  cancelAnimationFrame(requestAnimationId);
  gameRunning = false;
}

// Обработчик событий для перемещения акулы
shark.addEventListener("mousedown", dragStart);
shark.addEventListener("mouseup", dragEnd);
shark.addEventListener("mousemove", drag);
shark.addEventListener("touchstart", dragStart);
shark.addEventListener("touchend", dragEnd);
shark.addEventListener("touchmove", drag);

function dragStart(e) {
  if (e.type === "touchstart") {
    initialX = e.touches[0].clientX - xOffset;
  } else {
    initialX = e.clientX - xOffset;
  }
  isDragging = true;
}

function dragEnd(e) {
  initialX = currentX;
  isDragging = false;
}

function drag(e) {
  if (isDragging) {
    e.preventDefault();
    if (e.type === "touchmove") {
      currentX = e.touches[0].clientX - initialX;
    } else {
      currentX = e.clientX - initialX;
    }
    xOffset = currentX;
    setTranslate(currentX, 0, shark);
  }
}

function setTranslate(xPos, yPos, el) {
  el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
}

// Функция для обновления таймера
function updateTimer() {
  if (!gameRunning) return;

  const elapsed = Date.now() - gameStartTime;
  const remaining = Math.max(30000 - elapsed, 0);
  timerElement.textContent = Math.floor(remaining / 1000);

  if (remaining === 0) {
    endGame();
  } else {
    requestAnimationId = requestAnimationFrame(updateTimer);
  }
}

// Функция для завершения игры
function endGame() {
  clearTimeout(gameTimeout);
  gameRunning = false;
  resetGame();
  gameArea.parentElement.innerHTML =
    `<div id='Game_over'><span>Game over</span><br><span>you earn ${score} money</span></div>` +
    gameArea.parentElement.innerHTML;
}

// Главный игровой цикл
function gameLoop() {
  if (!gameRunning) return;

  if (Math.random() < probability_creating_coins) {
    coins.push(createObject("coin"));
  }
  if (Math.random() < probability_creating_jellyfish) {
    jellyfish.push(createObject("jellyfish"));
  }
  updateObjects();
  checkCollisions();
  requestAnimationFrame(gameLoop);
}

// Запуск игры
function startGame() {
  gameRunning = true;
  gameLoop();
  gameStartTime = Date.now();
  updateTimer();
  gameTimeout = setTimeout(endGame, 30000);
}

startGame();
