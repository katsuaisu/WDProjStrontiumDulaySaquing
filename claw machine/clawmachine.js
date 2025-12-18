const claw = document.getElementById('claw');
const rod = document.getElementById('rod');
const playBtn = document.getElementById('playBtn');
const timerText = document.getElementById('timerText');
const dropBtn = document.getElementById('manualDropBtn');
const dirButtons = document.querySelectorAll('.dir-btn');
const plushies = document.querySelectorAll('.plush');

let gameState = 'IDLE'; 
let timeLeft = 10;
let timerInterval;
let clawX = 50; 
let clawY = 0;  
let moveInterval;


const MIN_X = 5;
const MAX_X = 95;


playBtn.addEventListener('click', () => {
    if (gameState !== 'IDLE') return;
    
    gameState = 'PLAYING';
    timeLeft = 10;
    timerText.innerText = timeLeft;
    dropBtn.disabled = false;
    
  
    dirButtons.forEach(btn => btn.classList.remove('locked'));

    timerInterval = setInterval(() => {
        timeLeft--;
        timerText.innerText = timeLeft;
        if (timeLeft <= 0) {
            triggerDrop();
        }
    }, 1000);
});


dirButtons.forEach(btn => {
    btn.addEventListener('mousedown', () => {
        if (gameState !== 'PLAYING' || btn.classList.contains('locked')) return;
        
        const direction = btn.dataset.dir;
        moveInterval = setInterval(() => {
            if (direction === 'left' && clawX > MIN_X) clawX -= 1;
            if (direction === 'right' && clawX < MAX_X) clawX += 1;
            claw.style.left = `${clawX}%`;
        }, 20);
    });

    btn.addEventListener('mouseup', () => {
        clearInterval(moveInterval);
        if (gameState === 'PLAYING') {
            btn.classList.add('locked'); 
        }
    });
});


dropBtn.addEventListener('click', triggerDrop);

function triggerDrop() {
    if (gameState !== 'PLAYING') return;
    
    gameState = 'DROPPING';
    clearInterval(timerInterval);
    dropBtn.disabled = true;
    
    
    let depth = 0;
    const dropSpeed = setInterval(() => {
        depth += 5;
        claw.style.top = depth + 'px';
        
        if (depth >= 250) { 
            clearInterval(dropSpeed);
            grabSequence();
        }
    }, 20);
}

function grabSequence() {
    claw.classList.add('grabbing');
    
    
    let target = null;
    const clawRect = claw.getBoundingClientRect();

    plushies.forEach(p => {
        const pRect = p.getBoundingClientRect();
        const dist = Math.hypot(clawRect.x - pRect.x, clawRect.y - pRect.y);
        if (dist < 60) target = p;
    });

    setTimeout(() => {
     
        let depth = 250;
        const liftSpeed = setInterval(() => {
            depth -= 5;
            claw.style.top = depth + 'px';
            if (target) {
                target.style.top = (depth + 40) + 'px';
                target.style.left = `${clawX}%`;
            }

            if (depth <= 0) {
                clearInterval(liftSpeed);
                returnToChute(target);
            }
        }, 20);
    }, 600);
}

function returnToChute(caughtItem) {
    
    const slideSpeed = setInterval(() => {
        if (clawX > MIN_X) {
            clawX -= 1;
            claw.style.left = `${clawX}%`;
            if (caughtItem) caughtItem.style.left = `${clawX}%`;
        } else {
            clearInterval(slideSpeed);
            release(caughtItem);
        }
    }, 20);
}

function release(item) {
    claw.classList.remove('grabbing');
    if (item) {
        item.style.top = '400px'; 
        item.style.opacity = '0';
        setTimeout(() => alert("You caught a " + item.dataset.name + "!"), 500);
    }
    
   
    setTimeout(() => {
        gameState = 'IDLE';
        timerText.innerText = '--';
        clawX = 50;
        claw.style.left = '50%';
    }, 1000);
}