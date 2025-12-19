
const claw = document.getElementById('claw-system');
const playBtn = document.getElementById('playBtn');
const playText = document.getElementById('play-text');
const timerDisplay = document.getElementById('timer-text');
const btnLeft = document.getElementById('btnLeft');
const btnRight = document.getElementById('btnRight');
const plushZone = document.querySelector('.plush-zone');


const CLAW_SPEED = 0.8; 
const GRAB_TOLERANCE = 90; 


let state = 'IDLE'; 
let clawX = 50; 
let moveDirection = 0; 
let gameLoopID;
let timerInterval;
let timeLeft = 10;

function gameLoop() {
  if (state === 'PLAYING') {
    clawX += moveDirection * CLAW_SPEED;
    if (clawX < 10) clawX = 10;
    if (clawX > 90) clawX = 90;
    claw.style.left = clawX + '%';
  }
  requestAnimationFrame(gameLoop);
}
gameLoopID = requestAnimationFrame(gameLoop);


playBtn.addEventListener('click', () => {
  if (state === 'IDLE') startGame();
  else if (state === 'PLAYING') dropClaw();
});

function startGame() {
  state = 'PLAYING';
  playText.textContent = "DROP!";
  timeLeft = 10;
  timerDisplay.textContent = timeLeft;

  timerInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = timeLeft;
    if (timeLeft <= 0) dropClaw();
  }, 1000);
}

const startMove = (dir) => { if(state === 'PLAYING') moveDirection = dir; };
const stopMove = () => { moveDirection = 0; };

btnLeft.addEventListener('mousedown', () => startMove(-1));
btnLeft.addEventListener('mouseup', stopMove);
btnLeft.addEventListener('mouseleave', stopMove);

btnRight.addEventListener('mousedown', () => startMove(1));
btnRight.addEventListener('mouseup', stopMove);
btnRight.addEventListener('mouseleave', stopMove);



function dropClaw() {
  if (state !== 'PLAYING') return;
  state = 'DROPPING';
  clearInterval(timerInterval);
  moveDirection = 0; 
  
  // 1. Drop
  claw.style.transition = "top 1.5s ease-in-out";
  claw.style.top = "65%"; 

  setTimeout(() => {
    attemptGrab();
  }, 1500);
}

function attemptGrab() {
  state = 'GRABBING';
  claw.classList.add('grabbing');

  const caughtPlush = checkCollision();

  setTimeout(() => {
    // 2. Rise
    state = 'RISING';
    claw.style.top = "0%"; 

    if (caughtPlush) {
      
      caughtPlush.style.left = ''; 
      caughtPlush.style.top = ''; 
      claw.appendChild(caughtPlush);
    }

    setTimeout(() => {
      moveToChute(caughtPlush);
    }, 1500);

  }, 600);
}

function moveToChute(caughtPlush) {
  state = 'RETURNING';
  claw.style.transition = "left 2s linear, top 1s"; 
  claw.style.left = "15%";

  setTimeout(() => {
    // 3. Release
    claw.classList.remove('grabbing'); 
    
    if (caughtPlush) {
      caughtPlush.style.transition = "top 0.5s ease-in, opacity 0.5s";
      caughtPlush.style.top = "300px"; // Drop out of frame
      caughtPlush.style.opacity = "0";
      
      setTimeout(() => {
        caughtPlush.remove();
        resetGame("WIN!");
      }, 500);
    } else {
      resetGame("AGAIN");
    }
  }, 2100);
}

function resetGame(msg) {
  playText.textContent = msg;
  setTimeout(() => {
    state = 'IDLE';
    playText.textContent = "PLAY";
    claw.style.transition = "none"; 
    clawX = 50;
    claw.style.left = "50%";
    timerDisplay.textContent = "10";
  }, 1500);
}

function checkCollision() {
  const clawRect = claw.getBoundingClientRect();
  const plushies = document.querySelectorAll('.plush-zone .plush-wrapper');
  
  let target = null;
  let minDist = 9999;

  plushies.forEach(p => {
    const pRect = p.getBoundingClientRect();
    
    
    const clawCX = clawRect.left + (clawRect.width / 2);
    const clawCY = clawRect.bottom - 10; 
    
    const plushCX = pRect.left + (pRect.width / 2);
    const plushCY = pRect.top + (pRect.height / 2); 

    const dist = Math.hypot(clawCX - plushCX, clawCY - plushCY);

    if (dist < GRAB_TOLERANCE && dist < minDist) {
      minDist = dist;
      target = p;
    }
  });

  return target;
}