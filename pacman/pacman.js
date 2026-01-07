

const CANVAS_WIDTH = 448;
const CANVAS_HEIGHT = 496;
const TILE_SIZE = 24;
const FPS = 60;

let xSwipe = 0;
let ySwipe = 0;
const swipe_Threshold = 30;

const COLOR_WALL = "#B5EAD7";
const COLOR_WALL_BORDER = "#88D8B0";
const COLOR_BG = "#FFFCF9";


const DIR = { UP: 0, DOWN: 1, LEFT: 2, RIGHT: 3, NONE: 4 };


const assets = {};
const imageSources = {
    pacOpen: '../assets/pacUsagi_Open.png',
    pacClosed: '../assets/pacUsagi_Closed.png',
    ghost1: '../assets/pacHachi.png',
    ghost2: '../assets/pacChi.png',
    ghost3: '../assets/pacKuri.png',
    ghost4: '../assets/pacRakko.png',
    snackMini: '../assets/snackMini.png',
    snackBig: '../assets/snackBig.png',
    heart: '../assets/heart.png'
};

let imagesLoaded = 0;
const totalImages = Object.keys(imageSources).length;


const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 19 * TILE_SIZE;
canvas.height = 21 * TILE_SIZE;

let gameInterval;
let score = 0;
let lives = 3;
let gameState = 'START';
let map = [];
let entities = [];
let powerModeTimer = 0;

// 1 = Wall, 0 = Dot, 2 = Big Dot, 9 = Empty (House), 8 = Door
const LEVEL_MAP = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 2, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 2, 1],
    [1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 0, 1, 1, 1, 9, 1, 9, 1, 1, 1, 0, 1, 1, 1, 1],
    [1, 1, 1, 1, 0, 1, 9, 9, 9, 9, 9, 9, 9, 1, 0, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 1, 9, 9, 9, 9, 9, 9, 9, 1, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 0, 1, 9, 9, 9, 9, 9, 9, 9, 1, 0, 1, 1, 1, 1],
    [1, 1, 1, 1, 0, 1, 9, 1, 1, 1, 1, 1, 9, 1, 0, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
    [1, 2, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 2, 1],
    [1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1],
    [1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];



class Entity {
    constructor(x, y, speed) {
        this.x = x * TILE_SIZE + TILE_SIZE / 2;
        this.y = y * TILE_SIZE + TILE_SIZE / 2;
        this.speed = speed;
        this.dir = DIR.NONE;
        this.nextDir = DIR.NONE;
        this.radius = TILE_SIZE * 0.4;
    }

    getGridPos() {
        return {
            c: Math.floor(this.x / TILE_SIZE),
            r: Math.floor(this.y / TILE_SIZE)
        };
    }

    isCentered() {
        return Math.abs(this.x % TILE_SIZE - TILE_SIZE / 2) < this.speed &&
            Math.abs(this.y % TILE_SIZE - TILE_SIZE / 2) < this.speed;
    }

    canMove(direction) {
        const gp = this.getGridPos();
        let nextR = gp.r;
        let nextC = gp.c;

        if (direction === DIR.UP) nextR--;
        if (direction === DIR.DOWN) nextR++;
        if (direction === DIR.LEFT) nextC--;
        if (direction === DIR.RIGHT) nextC++;

        if (map[nextR] && map[nextR][nextC] === 1) return false;
        return true;
    }

    move() {
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;

        if (this.dir === DIR.UP) this.y -= this.speed;
        if (this.dir === DIR.DOWN) this.y += this.speed;
        if (this.dir === DIR.LEFT) this.x -= this.speed;
        if (this.dir === DIR.RIGHT) this.x += this.speed;
    }
}

class Player extends Entity {
    constructor(x, y) {
        super(x, y, 2);
        this.frameTimer = 0;
        this.isOpen = true;
    }

    update() {
        this.frameTimer++;
        if (this.frameTimer > 10) {
            this.isOpen = !this.isOpen;
            this.frameTimer = 0;
        }

        if (this.isCentered()) {
            this.x = this.getGridPos().c * TILE_SIZE + TILE_SIZE / 2;
            this.y = this.getGridPos().r * TILE_SIZE + TILE_SIZE / 2;

            if (this.nextDir !== DIR.NONE && this.canMove(this.nextDir)) {
                this.dir = this.nextDir;
                this.nextDir = DIR.NONE;
            }

            if (!this.canMove(this.dir)) {
                this.dir = DIR.NONE;
            }
        }

        this.move();
        this.checkCollision();
    }

    checkCollision() {
        const gp = this.getGridPos();

        if (map[gp.r][gp.c] === 0) {
            map[gp.r][gp.c] = 9;
            score += 10;
            updateUI();
            checkWin();
        } else if (map[gp.r][gp.c] === 2) {
            map[gp.r][gp.c] = 9;
            score += 50;
            activatePowerMode();
            updateUI();
            checkWin();
        }
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);

        let angle = 0;
        if (this.dir === DIR.DOWN) angle = Math.PI / 2;
        if (this.dir === DIR.LEFT) angle = Math.PI;
        if (this.dir === DIR.UP) angle = -Math.PI / 2;

        ctx.rotate(angle);
        if (this.dir === DIR.LEFT) {
            ctx.scale(1, -1);
        }

        const img = this.isOpen ? assets.pacOpen : assets.pacClosed;
        ctx.drawImage(img, -10, -10, 20, 20);
        ctx.restore();
    }
}

class Ghost extends Entity {
    constructor(x, y, imgKey) {
        super(x, y, 1.5);
        this.imgKey = imgKey;
        this.isEaten = false;
        this.dir = [DIR.LEFT, DIR.RIGHT][Math.floor(Math.random() * 2)];
    }

    update() {
        this.speed = (powerModeTimer > 0) ? 1 : 1.5;

        if (this.isCentered()) {
            this.x = this.getGridPos().c * TILE_SIZE + TILE_SIZE / 2;
            this.y = this.getGridPos().r * TILE_SIZE + TILE_SIZE / 2;

            const options = [];
            if (this.dir !== DIR.DOWN && this.canMove(DIR.UP)) options.push(DIR.UP);
            if (this.dir !== DIR.UP && this.canMove(DIR.DOWN)) options.push(DIR.DOWN);
            if (this.dir !== DIR.RIGHT && this.canMove(DIR.LEFT)) options.push(DIR.LEFT);
            if (this.dir !== DIR.LEFT && this.canMove(DIR.RIGHT)) options.push(DIR.RIGHT);

            if (options.length > 0) {
                if (powerModeTimer > 0) {
                    this.dir = options[Math.floor(Math.random() * options.length)];
                } else {
                    if (Math.random() < 0.3) {
                        this.dir = this.getChaseDir(options);
                    } else {
                        this.dir = options[Math.floor(Math.random() * options.length)];
                    }
                }
            } else {
                if (this.dir === DIR.UP) this.dir = DIR.DOWN;
                else if (this.dir === DIR.DOWN) this.dir = DIR.UP;
                else if (this.dir === DIR.LEFT) this.dir = DIR.RIGHT;
                else if (this.dir === DIR.RIGHT) this.dir = DIR.LEFT;
            }
        }
        this.move();
    }

    getChaseDir(options) {
        let bestDir = options[0];
        let minDst = 999999;

        options.forEach(opt => {
            let simX = this.x;
            let simY = this.y;
            if (opt === DIR.UP) simY -= TILE_SIZE;
            if (opt === DIR.DOWN) simY += TILE_SIZE;
            if (opt === DIR.LEFT) simX -= TILE_SIZE;
            if (opt === DIR.RIGHT) simX += TILE_SIZE;

            const dist = Math.hypot(simX - player.x, simY - player.y);
            if (dist < minDst) {
                minDst = dist;
                bestDir = opt;
            }
        });
        return bestDir;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);

        if (powerModeTimer > 0) {
            ctx.globalAlpha = 0.6 + Math.sin(Date.now() / 50) * 0.2;
        }

        const img = assets[this.imgKey];
        ctx.drawImage(img, -11, -11, 22, 22);

        ctx.restore();
    }
}



let player;
let ghosts = [];

function loadImages() {
    for (let key in imageSources) {
        const img = new Image();
        img.src = imageSources[key];
        img.onload = () => {
            imagesLoaded++;
            if (imagesLoaded === totalImages) {
                initGame();
            }
        };
        assets[key] = img;
    }
}

function initGame() {
    document.getElementById('startBtn').addEventListener('click', startGame);
    document.getElementById('restartBtn').addEventListener('click', resetGame);

    window.addEventListener('keydown', (e) => {
        if (gameState !== 'PLAYING') return;
        if (['ArrowUp', 'w', 'W'].includes(e.key)) player.nextDir = DIR.UP;
        if (['ArrowDown', 's', 'S'].includes(e.key)) player.nextDir = DIR.DOWN;
        if (['ArrowLeft', 'a', 'A'].includes(e.key)) player.nextDir = DIR.LEFT;
        if (['ArrowRight', 'd', 'D'].includes(e.key)) player.nextDir = DIR.RIGHT;
        if (e.key.startsWith('Arrow')) e.preventDefault();
    });
}
    canvas.addEventListener('touchstart', (e) => {
        if(gameState !== 'PLAYING') return;

        const touch = e.touches[0];
        xSwipe = touch.clientX;
        ySwipe = touch.clientY;
    });

    canvas.addEventListener('touchend', (e) => {

        if(gameState !== 'PLAYING') 
            {
                return;
            }

        const touch = e.changedTouches[0];
        const changeInX = touch.clientX - xSwipe;
        const changeInY = touch.clientY - ySwipe;
        
        if((Math.abs(changeInX) < swipe_Threshold) && (Math.abs(changeInY) < swipe_Threshold)) 
            {
                return; //this ignores small movements >:3
            }

        if(Math.abs(changeInX) > Math.abs(changeInY)) //for horizontal movement
            {
                if(changeInX > 0) 
                {
                    player.nextDir = DIR.RIGHT;
                }

                else
                {
                    player.nextDir = DIR.LEFT;
                }
            }

        else //for vertical movement
            {
                if(changeInY > 0)
                {
                    player.nextDir = DIR.DOWN;
                }

                else
                {
                    player.nextDir = DIR.UP;
                }
            } 
});

function startGame() {
    document.getElementById('startScreen').classList.add('hidden');
    document.getElementById('gameOverScreen').classList.add('hidden');

    map = LEVEL_MAP.map(row => [...row]);
    score = 0;
    lives = 3;
    powerModeTimer = 0;
    updateUI();

    respawnEntities();
    gameState = 'PLAYING';
    gameLoop();
}

function resetGame() {
    startGame();
}

function respawnEntities() {
    player = new Player(9, 15);
    ghosts = [
        new Ghost(8, 9, 'ghost1'),
        new Ghost(9, 9, 'ghost2'),
        new Ghost(10, 9, 'ghost3'),
        new Ghost(9, 8, 'ghost4')
    ];
}

function activatePowerMode() {
    powerModeTimer = 8 * 60;
}

function checkWin() {
    let pelletsLeft = 0;
    for (let r = 0; r < map.length; r++) {
        for (let c = 0; c < map[r].length; c++) {
            if (map[r][c] === 0 || map[r][c] === 2) pelletsLeft++;
        }
    }
    if (pelletsLeft === 0) {
        gameOver(true);
    }
}

function handleEntityCollisions() {
    const hitbox = TILE_SIZE / 2;
    ghosts.forEach((ghost, index) => {
        const dx = player.x - ghost.x;
        const dy = player.y - ghost.y;
        const dist = Math.hypot(dx, dy);

        if (dist < hitbox) {
            if (powerModeTimer > 0) {
                score += 200;
                ghost.x = 9 * TILE_SIZE + TILE_SIZE / 2;
                ghost.y = 9 * TILE_SIZE + TILE_SIZE / 2;
                updateUI();
            } else {
                lives--;
                updateUI();
                if (lives <= 0) {
                    gameOver(false);
                } else {
                    respawnEntities();
                }
            }
        }
    });
}

function gameOver(win) {
    gameState = 'GAMEOVER';
    const screen = document.getElementById('gameOverScreen');
    const title = document.getElementById('gameResult');
    const finalScore = document.getElementById('finalScore');

    screen.classList.remove('hidden');
    title.innerText = win ? "You Win!" : "Game Over";
    title.style.color = win ? "#B5EAD7" : "#FF9AA2";
    finalScore.innerText = score;
}

function updateUI() {
    document.getElementById('score').innerText = score;
    const livesDiv = document.getElementById('lives');
    livesDiv.innerHTML = '';
    for (let i = 0; i < lives; i++) {
        const img = document.createElement('img');
        img.src = assets.heart.src;
        livesDiv.appendChild(img);
    }
}



function gameLoop() {
    if (gameState !== 'PLAYING') return;

    player.update();
    ghosts.forEach(g => g.update());
    if (powerModeTimer > 0) powerModeTimer--;
    handleEntityCollisions();

    draw();
    requestAnimationFrame(gameLoop);
}

function draw() {
    ctx.fillStyle = COLOR_BG;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let r = 0; r < map.length; r++) {
        for (let c = 0; c < map[r].length; c++) {
            const tile = map[r][c];
            const x = c * TILE_SIZE;
            const y = r * TILE_SIZE;

            if (tile === 1) {

                ctx.fillStyle = COLOR_WALL_BORDER;
                ctx.beginPath();
                if (ctx.roundRect) {
                    ctx.roundRect(x + 1, y + 1, TILE_SIZE - 2, TILE_SIZE - 2, 8);
                } else {
                    ctx.rect(x + 1, y + 1, TILE_SIZE - 2, TILE_SIZE - 2);
                }
                ctx.fill();


                ctx.fillStyle = COLOR_WALL;
                ctx.beginPath();
                if (ctx.roundRect) {
                    ctx.roundRect(x + 4, y + 4, TILE_SIZE - 8, TILE_SIZE - 8, 4);
                } else {
                    ctx.rect(x + 4, y + 4, TILE_SIZE - 8, TILE_SIZE - 8);
                }
                ctx.fill();
            } else if (tile === 0) {
                ctx.drawImage(assets.snackMini, x + 8, y + 8, 8, 8);
            } else if (tile === 2) {
                ctx.drawImage(assets.snackBig, x + 4, y + 4, 16, 16);
            }
        }
    }

    player.draw();
    ghosts.forEach(g => g.draw());
}

loadImages();