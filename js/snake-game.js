const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

const gridSize = 20;
let snake = [{ x: gridSize, y: gridSize }];
let direction = { x: 1, y: 0 };
let food = spawnFood();
let gameOver = false;

document.addEventListener("keydown", changeDirection);

function gameLoop() {
  if (gameOver) {
    alert("Game Over!");
    return;
  }
  update();
  draw();
  setTimeout(gameLoop, 100);
}

function update() {
  const head = { ...snake[0] };
  head.x += direction.x * gridSize;
  head.y += direction.y * gridSize;

  if (head.x < 0 || head.y < 0 || head.x >= canvas.width || head.y >= canvas.height || snake.some(seg => seg.x === head.x && seg.y === head.y)) {
    gameOver = true;
  } else {
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
      food = spawnFood();
    } else {
      snake.pop();
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "green";
  snake.forEach(segment => ctx.fillRect(segment.x, segment.y, gridSize, gridSize));

  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, gridSize, gridSize);
}

function changeDirection(event) {
  const { key } = event;
  if (key === "ArrowUp" && direction.y === 0) direction = { x: 0, y: -1 };
  else if (key === "ArrowDown" && direction.y === 0) direction = { x: 0, y: 1 };
  else if (key === "ArrowLeft" && direction.x === 0) direction = { x: -1, y: 0 };
  else if (key === "ArrowRight" && direction.x === 0) direction = { x: 1, y: 0 };
}

function spawnFood() {
  return {
    x: Math.floor(Math.random() * canvas.width / gridSize) * gridSize,
    y: Math.floor(Math.random() * canvas.height / gridSize) * gridSize,
  };
}

gameLoop();
