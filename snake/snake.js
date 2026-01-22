// game settings
const gridSize = 20;
const tileSize = 24;
const gameSpeed = 120; // bro this is stressing me out so u can like change ths speed since its hard 

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = gridSize * tileSize;
canvas.height = gridSize * tileSize;

// game var thigns
let snake = [];
let direction = 'right';
let nextDirection = 'right';
let food = {};
let score = 0;
let gameRunning = false;
let gameInterval;

// images
let headImg = new Image();
let foodImg = new Image();
let loaded = 0;

headImg.src = '../assets/chiikabuHead.png';
foodImg.src = '../assets/puddingUsagi.png';

headImg.onload = () => {
    loaded++;
    if (loaded === 2) setupGame();
};

foodImg.onload = () => {
    loaded++;
    if (loaded === 2) setupGame();
};

function setupGame() {
    document.getElementById('startBtn').onclick = startGame;
    document.getElementById('restartBtn').onclick = resetGame;

    window.onkeydown = (e) => {
        if (!gameRunning) return;

        if (e.key === 'ArrowUp' && direction !== 'down') {
            nextDirection = 'up';
        } else if (e.key === 'ArrowDown' && direction !== 'up') {
            nextDirection = 'down';
        } else if (e.key === 'ArrowLeft' && direction !== 'right') {
            nextDirection = 'left';
        } else if (e.key === 'ArrowRight' && direction !== 'left') {
            nextDirection = 'right';
        }

        if (e.key.startsWith('Arrow')) {
            e.preventDefault();
        }
    };
}

function startGame() {
    document.getElementById('startScreen').classList.add('hidden');
    document.getElementById('gameOverScreen').classList.add('hidden');

    // reset everything
    snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
    ];
    direction = 'right';
    nextDirection = 'right';
    score = 0;
    gameRunning = true;

    spawnFood();
    updateUI();

    // start game loop
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, gameSpeed);
}

function resetGame() {
    startGame();
}

function spawnFood() {
    let ok = false;
    let newX, newY;

    while (!ok) {
        newX = Math.floor(Math.random() * gridSize);
        newY = Math.floor(Math.random() * gridSize);

        ok = true;
        for (let i = 0; i < snake.length; i++) {
            if (snake[i].x === newX && snake[i].y === newY) {
                ok = false;
            }
        }
    }

    food.x = newX;
    food.y = newY;
}

function gameLoop() {
    // update direction
    direction = nextDirection;

    // move snake
    let headX = snake[0].x;
    let headY = snake[0].y;

    if (direction === 'up') headY--;
    if (direction === 'down') headY++;
    if (direction === 'left') headX--;
    if (direction === 'right') headX++;

    // check if hit wall 
    if (headX < 0 || headX >= gridSize || headY < 0 || headY >= gridSize) {
        gameOver();
        return;
    }

    // check if hit self 
    for (let i = 0; i < snake.length; i++) {
        if (snake[i].x === headX && snake[i].y === headY) {
            gameOver();
            return;
        }
    }

    // add new head 
    snake.unshift({ x: headX, y: headY });

    // check if ate food
    if (headX === food.x && headY === food.y) {
        score += 10;
        updateUI();
        spawnFood();
    } else {
        // remove tail if didn't eat 
        snake.pop();
    }

    draw();
}

function draw() {
    ctx.fillStyle = '#FFFCF5';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // draw snake body
    ctx.fillStyle = '#967867';
    for (let i = 1; i < snake.length; i++) {
        let x = snake[i].x * tileSize;
        let y = snake[i].y * tileSize;
        
        ctx.fillRect(x + 2, y + 2, tileSize - 4, tileSize - 4);
    }

    // draw head
    let headX = snake[0].x * tileSize;
    let headY = snake[0].y * tileSize;
    ctx.drawImage(headImg, headX, headY, tileSize, tileSize);

    // draw food
    ctx.drawImage(foodImg, food.x * tileSize, food.y * tileSize, tileSize, tileSize);
}

function updateUI() {
    document.getElementById('score').textContent = score;
    document.getElementById('length').textContent = snake.length;
}

function gameOver() {
    gameRunning = false;
    clearInterval(gameInterval);

    document.getElementById('gameOverScreen').classList.remove('hidden');
    document.getElementById('finalScore').textContent = score;
}