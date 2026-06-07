const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const highScoreEl = document.getElementById('highScore');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [{x: 10, y: 10}];
let food = {x: 15, y: 15};
let dx = 0;
let dy = 0;
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let gameRunning = false;
let gameLoop;

highScoreEl.textContent = highScore;

function drawGame() {
    if (!gameRunning) return;

    // Move snake
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);

    // Check food eaten
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreEl.textContent = score;
        generateFood();

        // Update high score
        if (score > highScore) {
            highScore = score;
            highScoreEl.textContent = highScore;
            localStorage.setItem('snakeHighScore', highScore);
        }
    } else {
        snake.pop();
    }

    // Check collision
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        gameOver();
        return;
    }

    // Check self collision
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver();
            return;
        }
    }

    // Clear canvas
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    ctx.fillStyle = '#00ff00';
    snake.forEach(segment => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    });

    // Draw food
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
}

function generateFood() {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);

    // Make sure food doesn't spawn on snake
    snake.forEach(segment => {
        if (segment.x === food.x && segment.y === food.y) {
            generateFood();
        }
    });
}

function gameOver() {
    gameRunning = false;
    clearInterval(gameLoop);
    alert(`Game Over! Score: ${score}`);
    startBtn.disabled = false;
}

function startGame() {
    if (gameRunning) return;

    snake = [{x: 10, y: 10}];
    dx = 1; // Start moving right
    dy = 0;
    score = 0;
    scoreEl.textContent = score;
    generateFood();
    gameRunning = true;
    startBtn.disabled = true;

    gameLoop = setInterval(drawGame, 100); // Speed: 100ms
}

function resetGame() {
    gameRunning = false;
    clearInterval(gameLoop);
    snake = [{x: 10, y: 10}];
    dx = 0;
    dy = 0;
    score = 0;
    scoreEl.textContent = score;
    startBtn.disabled = false;

    // Clear canvas
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Keyboard controls
document.addEventListener('keydown', (e) => {
    if (!gameRunning) return;

    switch(e.key) {
        case 'ArrowUp':
            if (dy!== 1) { dx = 0; dy = -1; }
            break;
        case 'ArrowDown':
            if (dy!== -1) { dx = 0; dy = 1; }
            break;
        case 'ArrowLeft':
            if (dx!== 1) { dx = -1; dy = 0; }
            break;
        case 'ArrowRight':
            if (dx!== -1) { dx = 1; dy = 0; }
            break;
    }
});

startBtn.addEventListener('click', startGame);
resetBtn.addEventListener('click', resetGame);

// Initial draw
resetGame();