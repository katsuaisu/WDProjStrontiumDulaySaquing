const claw = document.getElementById('claw');
const clawBody = document.querySelector('.claw-body');
const playBtnWrapper = document.querySelector('.play-btn-wrapper');
const btnLabel = document.getElementById('btn-label');
const timerText = document.getElementById('timer-text');
const arrows = document.querySelectorAll('.arrow-btn');
const plushies = document.querySelectorAll('.plush');
const chuteArea = document.getElementById('chute-area');
const machineContainer = document.querySelector('.machine-container');

let gameState = 'IDLE'; 
let clawX = 50; 
let clawY = 10; 
let gameTimer = null;
let timeLeft = 10;
let moveInterval = null;

const MOVEMENT_SPEED = 0.8; 
const DROP_POSITION = 400; 
const CHUTE_POSITION_X = 15; 

playBtnWrapper.addEventListener('click', handleMainButton);

arrows.forEach(arrow => {
    arrow.addEventListener('mousedown', (e) => startMoving(e.target.dataset.dir, e.target));
    arrow.addEventListener('mouseup', (e) => stopMoving(e.target));
    arrow.addEventListener('mouseleave', (e) => stopMoving(e.target));
    
    arrow.addEventListener('touchstart', (e) => {
        e.preventDefault(); 
        startMoving(e.target.dataset.dir, e.target);
    });
    arrow.addEventListener('touchend', (e) => stopMoving(e.target));
});

function handleMainButton() {
    if (gameState === 'IDLE') {
        startGame();
    } else if (gameState === 'PLAYING') {
        initiateDrop();
    }
}

function startGame() {
    gameState = 'PLAYING';
    btnLabel.innerText = 'DROP!';
    timerText.innerText = '10';
    timeLeft = 10;
    
    arrows.forEach(a => a.classList.remove('disabled'));

    gameTimer = setInterval(() => {
        timeLeft--;
        timerText.innerText = timeLeft < 10 ? `0${timeLeft}` : timeLeft;
        
        if (timeLeft <= 0) {
            initiateDrop();
        }
    }, 1000);
}

function startMoving(direction, btnElement) {
    if (gameState !== 'PLAYING') return;
    if (btnElement.classList.contains('disabled')) return;
    
    if (moveInterval) clearInterval(moveInterval);

    moveInterval = setInterval(() => {
        if (direction === 'left') clawX = Math.max(5, clawX - MOVEMENT_SPEED);
        if (direction === 'right') clawX = Math.min(90, clawX + MOVEMENT_SPEED);
        if (direction === 'up') clawY = Math.max(5, clawY - MOVEMENT_SPEED);
        if (direction === 'down') clawY = Math.min(30, clawY + MOVEMENT_SPEED);

        updateClawPosition();
    }, 16);
}

function stopMoving(btnElement) {
    if (gameState !== 'PLAYING') return;
    if (!moveInterval) return;
    
    clearInterval(moveInterval);
    moveInterval = null;
    
    if (btnElement) {
        btnElement.classList.add('disabled');
    }
}

function updateClawPosition() {
    claw.style.left = `${clawX}%`;
    claw.style.top = `${clawY - 100}px`; 
}

function initiateDrop() {
    if (gameState !== 'PLAYING') return;
    
    gameState = 'DROPPING';
    clearInterval(gameTimer);
    if (moveInterval) clearInterval(moveInterval);
    
    btnLabel.innerText = '...';
    document.querySelector('.display-screen').classList.add('flashing');
    
    let currentTop = parseInt(claw.style.top) || -90;
    claw.style.transition = "top 2s ease-in";
    claw.style.top = `${DROP_POSITION}px`;

    setTimeout(() => {
        attemptCatch();
    }, 2000); 
}

function attemptCatch() {
    document.querySelector('.display-screen').classList.remove('flashing');
    claw.classList.add('grabbing');
    
    let caughtPlush = null;
    const clawRect = clawBody.getBoundingClientRect();

    plushies.forEach(plush => {
        if (caughtPlush) return;
        
        const plushRect = plush.getBoundingClientRect();
        
        const hOverlap = clawRect.left < plushRect.right && clawRect.right > plushRect.left;
        const vOverlap = Math.abs((clawRect.bottom - 20) - plushRect.bottom) < 50; 
        
        const distance = Math.hypot(
            (clawRect.left + clawRect.width/2) - (plushRect.left + plushRect.width/2),
            (clawRect.top + clawRect.height/2) - (plushRect.top + plushRect.height/2)
        );

        if (distance < 60) { 
            caughtPlush = plush;
        }
    });

    if (caughtPlush) {
        caughtPlush.classList.add('caught');
        clawBody.appendChild(caughtPlush);
        timerText.innerText = "GOTCHA";
    } else {
        timerText.innerText = "MISS";
    }

    setTimeout(() => {
        returnToChute(caughtPlush);
    }, 1000);
}

function returnToChute(caughtPlush) {
    claw.style.transition = "top 2s ease-out";
    claw.style.top = `-50px`; 
    
    setTimeout(() => {
        claw.style.transition = "left 2s ease-in-out";
        claw.style.left = `${CHUTE_POSITION_X}%`;
        
        setTimeout(() => {
            claw.classList.remove('grabbing');
            
            if (caughtPlush) {
                caughtPlush.classList.remove('caught');
                caughtPlush.classList.add('falling');
                machineContainer.appendChild(caughtPlush); 
                
                timerText.innerText = "WINNER!";
                
                setTimeout(() => {
                    alert(`You collected ${caughtPlush.id}!`);
                    caughtPlush.remove(); 
                }, 1000);
            }
            
            setTimeout(resetGame, 1500);

        }, 2000); 
    }, 2000); 
}

function resetGame() {
    gameState = 'IDLE';
    btnLabel.innerText = 'PLAY';
    timerText.innerText = 'READY';
    
    claw.style.transition = "left 1s ease, top 1s ease";
    clawX = 50;
    clawY = 10;
    updateClawPosition();
    
    arrows.forEach(a => a.classList.remove('disabled'));
}