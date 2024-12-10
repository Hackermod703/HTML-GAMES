// Select the canvas and set up context
const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

// Score element
const scoreElement = document.getElementById("score");

// Game settings
const gridSize = 20;
let snake = [{ x: gridSize, y: gridSize }];
let direction = { x: 1, y: 0 };
let food = null; // No food initially
let score = 0;
let gameOver = false;

// Food timers
let foodTimer;
let removeFoodTimer;

// Event listeners for keyboard controls
document.addEventListener("keydown", changeDirection);

// Mobile controls
document.getElementById("up").addEventListener("click", () => changeDirection({ key: "ArrowUp" }));
document.getElementById("down").addEventListener("click", () => changeDirection({ key: "ArrowDown" }));
document.getElementById("left").addEventListener("click", () => changeDirection({ key: "ArrowLeft" }));
document.getElementById("right").addEventListener("click", () => changeDirection({ key: "ArrowRight" }));

function gameLoop() {
  if (gameOver) {
    if (confirm("Game Over! Do you want to restart?")) {
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

  // Wall wrapping: move the snake to the opposite side if it crosses the boundary
  if (head.x < 0) head.x = canvas.width - gridSize;
  if (head.y < 0) head.y = canvas.height - gridSize;
  if (head.x >= canvas.width) head.x = 0;
  if (head.y >= canvas.height) head.y = 0;

  // Check for self-collision
  if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
    gameOver = true;
    return;
  }

  // Add the new head to the snake
  snake.unshift(head);

  // Check if the snake eats the food
  if (food && head.x === food.x && head.y === food.y) {
    score++;  // Increase score
    document.getElementById("score").textContent = score;  // Update score display
    food = null; // Remove the food
    clearTimeout(removeFoodTimer); // Stop the removal timer
    spawnFoodWithDelay(); // Spawn a new food after 10 seconds
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

  // Draw the food
  if (food) {
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
}

function changeDirection(event) {
  const { key } = event;
  if (key === "ArrowUp" && direction.y === 0) direction = { x: 0, y: -1 };
  else if (key === "ArrowDown" && direction.y === 0) direction = { x: 0, y: 1 };
  else if (key === "ArrowLeft" && direction.x === 0) direction = { x: -1, y: 0 };
  else if (key === "ArrowRight" && direction.x === 0) direction = { x: 1, y: 0 };
}

function spawnFood() {
  food = {
    x: Math.floor(Math.random() * canvas.width / gridSize) * gridSize,
    y: Math.floor(Math.random() * canvas.height / gridSize) * gridSize,
  };

  // Set a timer to remove the food after 30 seconds
  removeFoodTimer = setTimeout(() => {
    food = null; // Remove the food
  }, 30000);
}

function spawnFoodWithDelay() {
  // Spawn food after 10 seconds
  foodTimer = setTimeout(spawnFood, 10000);
}

function restartGame() {
  // Reset game state
  snake = [{ x: gridSize, y: gridSize }];
  direction = { x: 1, y: 0 };
  food = null;
  score = 0;
  document.getElementById("score").textContent = score; // Reset score display
  gameOver = false;

  // Clear any existing timers
  clearTimeout(foodTimer);
  clearTimeout(removeFoodTimer);

  // Start the food spawning process
  spawnFoodWithDelay();

  gameLoop();
}

// Start the food spawning process
spawnFoodWithDelay();

// Start the game loop
gameLoop();
