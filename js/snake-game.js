const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

const gridSize = 20;
let snake = [{ x: gridSize, y: gridSize }];
let direction = { x: 1, y: 0 };
let food = spawnFood();
let gameOver = false;

// Listen for arrow key inputs
document.addEventListener("keydown", changeDirection);

function gameLoop() {
  if (gameOver) {
    if (confirm("Game Over! Restart?")) {
      restartGame();
    }
    return;
  }
  update();
  draw();
  setTimeout(gameLoop, 100);
}

function update() {
  const head = { ...snake[0] };

  // Update the head's position based on direction
  head.x += direction.x * gridSize;
  head.y += direction.y * gridSize;

  // Wall wrapping: Bring the snake to the opposite side if it crosses the canvas boundary
  if (head.x < 0) head.x = canvas.width - gridSize;
  if (head.y < 0) head.y = canvas.height - gridSize;
  if (head.x >= canvas.width) head.x = 0;
  if (head.y >= canvas.height) head.y = 0;

  // Check for self-collision
  if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
    gameOver = true;
    return;
  }

  // Add new head to the snake
  snake.unshift(head);

  // Check if the snake eats food
  if (head.x === food.x && head.y === food.y) {
    food = spawnFood(); // Respawn food
  } else {
    snake.pop(); // Remove the tail if no food is eaten
  }
}

function draw() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the snake
  ctx.fillStyle = "green";
  snake.forEach(segment => {
    ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
  });

  // Draw the food (red dot)
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc(
    food.x + gridSize / 2,
    food.y + gridSize / 2,
    gridSize / 2,
    0,
    Math.PI * 2
  );
  ctx.fill();
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

function restartGame() {
  snake = [{ x: gridSize, y: gridSize }];
  direction = { x: 1, y: 0 };
  food = spawnFood();
  gameOver = false;
  gameLoop();
}

// Start the game loop
gameLoop();
