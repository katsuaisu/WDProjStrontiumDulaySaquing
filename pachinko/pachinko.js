const CONFIG = {
    gravity: 0.35,
    friction: 0.98,
    bounce: 0.6,
    ballRadius: 17,
    pinRadius: 13,
    subSteps: 4,
    spawnY: 60
};

let state = {
    score: 0,
    ballsLeft: 15,
    combo: 0,
    comboTimer: null,
    mouseX: 0,
    balls: [],
    pins: [],
    pockets: [],
    gameActive: true
};

const els = {
    board: document.getElementById('board'),
    pinsContainer: document.getElementById('pins-container'),
    ballsContainer: document.getElementById('balls-container'),
    particlesContainer: document.getElementById('particles-container'),
    dropper: document.getElementById('dropper'),
    score: document.getElementById('score-display'),
    ballCount: document.getElementById('ball-count'),
    hachi: document.getElementById('hachiCheer'),
    usa: document.getElementById('usaCheer'),
    combo: document.getElementById('comboText'),
    resetBtn: document.getElementById('reset-btn'),
    modal: document.getElementById('game-over-modal'),
    finalScore: document.getElementById('final-score-display'),
    modalRestart: document.getElementById('modal-restart')
};

function init() {
    setupPins();
    setupPockets();
    
    els.board.addEventListener('mousemove', (e) => {
        if (!state.gameActive) return;
        const rect = els.board.getBoundingClientRect();
        state.mouseX = e.clientX - rect.left;
        const clampedX = Math.max(30, Math.min(rect.width - 30, state.mouseX));
        els.dropper.style.left = `${clampedX}px`;
    });

    els.board.addEventListener('mousedown', () => {
        if (state.gameActive) spawnBall(state.mouseX);
    });

    els.resetBtn.addEventListener('click', resetGame);
    els.modalRestart.addEventListener('click', resetGame);

    requestAnimationFrame(gameLoop);
}

function resetGame() {
    state.score = 0;
    state.ballsLeft = 15;
    state.gameActive = true;
    state.balls.forEach(b => b.el.remove());
    state.balls = [];
    els.modal.classList.add('hidden');
    updateUI();
}

function showGameOver() {
    state.gameActive = false;
    els.finalScore.innerText = state.score;
    els.modal.classList.remove('hidden');
}

function setupPins() {
    els.pinsContainer.innerHTML = '';
    state.pins = [];
    const rows = 11;
    const cols = 8;
    const spacingX = 480 / cols;
    const spacingY = 55;
    
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (r % 2 === 0 && c === cols - 1) continue;
            
            let x = (c * spacingX) + (spacingX / 2) + (r % 2 === 0 ? 0 : spacingX / 2);
            let y = 120 + (r * spacingY);

            x += (Math.random() - 0.5) * 15;
            y += (Math.random() - 0.5) * 10;

            if (x < 30 || x > 450) continue;

            const el = document.createElement('div');
            el.className = 'pin';
            el.style.left = `${x}px`;
            el.style.top = `${y}px`;
            els.pinsContainer.appendChild(el);

            state.pins.push({ x, y, el, cooldown: 0 });
        }
    }
}

function setupPockets() {
    const domPockets = document.querySelectorAll('.pocket');
    state.pockets = Array.from(domPockets).map(el => {
        const rect = el.getBoundingClientRect();
        const boardRect = els.board.getBoundingClientRect();
        
        const x = (rect.left - boardRect.left) + (rect.width / 2);
        const y = (rect.top - boardRect.top) + (rect.height / 2);
        
        return {
            x, y,
            radius: rect.width / 2.5,
            score: parseInt(el.dataset.score),
            type: el.classList.contains('main-pocket') ? 'main' : 'side',
            el
        };
    });
}

function spawnBall(x) {
    if (state.ballsLeft <= 0) return;
    
    const boardWidth = els.board.offsetWidth;
    x = Math.max(20, Math.min(boardWidth - 20, x));

    state.ballsLeft--;
    updateUI();

    const el = document.createElement('div');
    el.className = 'chiika-ball';
    els.ballsContainer.appendChild(el);
    
    els.dropper.classList.add('shoot');
    setTimeout(() => els.dropper.classList.remove('shoot'), 150);

    state.balls.push({
        x: x,
        y: CONFIG.spawnY,
        vx: (Math.random() - 0.5) * 2,
        vy: 0,
        rotation: 0,
        vRot: (Math.random() - 0.5) * 5,
        el: el,
        active: true
    });
}

function gameLoop() {
    const boardWidth = els.board.offsetWidth;
    const boardHeight = els.board.offsetHeight;

    state.balls.forEach(ball => {
        if (!ball.active) return;

        const dt = 1 / CONFIG.subSteps;
        
        for (let step = 0; step < CONFIG.subSteps; step++) {
            ball.vy += CONFIG.gravity * dt;
            
            ball.x += ball.vx;
            ball.y += ball.vy;

            if (ball.x < CONFIG.ballRadius) {
                ball.x = CONFIG.ballRadius;
                ball.vx *= -CONFIG.bounce;
            } else if (ball.x > boardWidth - CONFIG.ballRadius) {
                ball.x = boardWidth - CONFIG.ballRadius;
                ball.vx *= -CONFIG.bounce;
            }

            state.pins.forEach(pin => {
                if (pin.cooldown > 0) return;

                const dx = ball.x - pin.x;
                const dy = ball.y - pin.y;
                const distSq = dx*dx + dy*dy;
                const minDist = CONFIG.ballRadius + CONFIG.pinRadius;

                if (distSq < minDist * minDist) {
                    const angle = Math.atan2(dy, dx);
                    
                    const dist = Math.sqrt(distSq);
                    const overlap = minDist - dist;
                    ball.x += Math.cos(angle) * overlap;
                    ball.y += Math.sin(angle) * overlap;

                    const speed = Math.sqrt(ball.vx*ball.vx + ball.vy*ball.vy);
                    
                    const chaosAngle = angle + (Math.random() - 0.5) * 0.5; 
                    
                    ball.vx = Math.cos(chaosAngle) * speed * 0.8;
                    ball.vy = Math.sin(chaosAngle) * speed * 0.8;
                    
                    ball.vRot = (Math.random() - 0.5) * 20;

                    triggerPinHit(pin);
                }
            });
        }

        ball.rotation += ball.vRot;
        ball.vx *= CONFIG.friction;

        checkPockets(ball);

        if (ball.y > boardHeight + 50) {
            removeBall(ball);
            resetCombo();
        }

        ball.el.style.transform = `translate(${ball.x - CONFIG.ballRadius}px, ${ball.y - CONFIG.ballRadius}px) rotate(${ball.rotation}deg)`;
    });

    state.pins.forEach(p => { if (p.cooldown > 0) p.cooldown--; });

    requestAnimationFrame(gameLoop);
}

function checkPockets(ball) {
    for (let pocket of state.pockets) {
        const dx = ball.x - pocket.x;
        const dy = ball.y - pocket.y;
        const dist = Math.sqrt(dx*dx + dy*dy);

        if (dist < pocket.radius + 10) {
            scorePoints(pocket.score, pocket.type);
            createSparkles(pocket.x, pocket.y, pocket.type === 'main' ? '#cdb4db' : '#ffb7c5');
            removeBall(ball);
            return;
        }
    }
}

function scorePoints(amount, type) {
    state.combo++;
    if (state.comboTimer) clearTimeout(state.comboTimer);
    state.comboTimer = setTimeout(resetCombo, 3000);

    const comboBonus = (state.combo - 1) * 10;
    const total = amount + comboBonus;
    state.score += total;
    
    updateUI();

    if (type === 'main' || state.combo > 3) {
        triggerMascot('usa');
        showFloatingText(`+${total}`, 'big');
    } else {
        triggerMascot('hachi');
    }

    if (state.combo > 1) {
        els.combo.innerText = `${state.combo} COMBO!`;
        els.combo.classList.remove('show');
        void els.combo.offsetWidth;
        els.combo.classList.add('show');
    }
}

function removeBall(ball) {
    ball.active = false;
    ball.el.remove();
    state.balls = state.balls.filter(b => b !== ball);

    if (state.ballsLeft === 0 && state.balls.length === 0) {
        setTimeout(showGameOver, 500);
    }
}

function triggerPinHit(pin) {
    pin.cooldown = 10;
    pin.el.classList.remove('hit');
    void pin.el.offsetWidth;
    pin.el.classList.add('hit');
    
    if (Math.random() > 0.5) createSparkles(pin.x, pin.y, '#fff3b0', 2);
}

function resetCombo() {
    state.combo = 0;
}

function updateUI() {
    els.score.innerText = state.score;
    els.ballCount.innerText = state.ballsLeft;
}

function triggerMascot(name) {
    const el = els[name];
    el.classList.remove('pop-in');
    void el.offsetWidth;
    el.classList.add('pop-in');
}

function createSparkles(x, y, color, count=5) {
    for(let i=0; i<count; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.left = `${x}px`;
        p.style.top = `${y}px`;
        p.style.background = color;
        
        const tx = (Math.random() - 0.5) * 100;
        const ty = (Math.random() - 0.5) * 100;
        
        p.style.setProperty('--tx', `${tx}px`);
        p.style.setProperty('--ty', `${ty}px`);
        
        els.particlesContainer.appendChild(p);
        setTimeout(() => p.remove(), 800);
    }
}

function showFloatingText(txt, size) {
    els.combo.innerText = txt;
    els.combo.classList.remove('show');
    void els.combo.offsetWidth;
    els.combo.classList.add('show');
}

init();