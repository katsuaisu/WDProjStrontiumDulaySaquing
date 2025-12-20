const carriage = document.getElementById('clawCarriage');
const assembly = document.getElementById('clawAssembly');
const cable = document.getElementById('clawCable');
const playBtn = document.getElementById('playBtn');
const timerVal = document.getElementById('timerVal');
const winPopup = document.getElementById('winPopup');
const prizeDisplay = document.getElementById('prizeDisplay');
const joystickKnob = document.getElementById('joystickKnob');
const clawBody = document.querySelector('.machine__crane-claw');
const cardWrapper = document.getElementById('cardWrapper');
const popupOverlay = document.getElementById('winPopup');

const triviaData = {
    "Chiikawa": "Chiikawa (ちいかわ) is the titular character and protagonist of the manga and anime series. They are best friends with Hachiware and Usagi, and spends much of their time hanging out together.",
    "Hachiware": "Hachiware (ハチワレ) is one of the main characters in the Chiikawa manga and anime series. In the series, they are best friends with Chiikawa and Usagi, and are often seen spending time with them on their daily adventures.",
    "Usagi": "Usagi (うさぎ) is one of the main characters in the Chiikawa manga and anime series. In the Chiikawa-verse, they are best friends with Chiikawa and Hachiware, known for their energetic personality and playful antics during their time together.",
    "Momonga": "Momonga (モモンガ) is a secondary character of the Chiikawa manga and anime series. They are a flying squirrel who is often seen begging for attention and praise, stealing food, and causing trouble for other characters. Their name comes from the Japanese word momonga, which means flying squirrel.", 
    "Kurimanju": "Kuri-Manjū (くりまんじゅう), or Kurimanju/Kuri-Manju, is a character in the Chiikawa series, inspired by the Japanese chestnut bun and a honey badger. He often acts like a middle-age Japanese man, typically seen eating snacks or drinking alcohol, after which he always makes a very loud sigh.",
    "Shisa": "Shisa (シーサー) is a character in the Chiikawa series. They're a hardworking Lion-Dog, named after the traditional guardian figure from Okinawan mythology. They currently work at Rou Ramen Shop. They are also studying to get their alcohol license. Their dream is to drink with their ramen master, Ramen Yoroi-san, one day.",
    "Chiikabu": "Chiikabu (ちいかぶ), also known as Kabutomushi, is a deuteragonist and an antagonist in the Chiikawa manga and anime series, specifically during the Chiikabu arc. It made its debut when it jumped on Chiikawa's face while the main trio were exploring a cave.",
    "Anoko": "Anoko (あのこ) is a chimera in the Chiikawa world. Though Anoko has an adorable appearance, they are often seen attacking mob characters and sometimes even eating them.",
    "Kani": "Furuhonya (古本屋) or Kani (かに lit. Crab) is a secondary character in the Chiikawa manga series. They are a street vendor who runs a used bookstore. Originally appeared as a Mob character, Furuhonya revealed their appearance when they befriended Momonga."
};

let state = 'idle'; 
let posX = 50;
let timeLeft = 10;
let timerId = null;
let isHolding = false;
let caughtPlushie = null;

let isJoystickTouching = false;
const maxJoystickDelta = 25;

function handleJoystick(e) {
    if (state !== 'playing' || !isJoystickTouching) return;
    
    const rect = document.getElementById('joystickBase').getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    
    let deltaX = clientX - centerX;
    deltaX = Math.max(-maxJoystickDelta, Math.min(maxJoystickDelta, deltaX));
    
    joystickKnob.style.transform = `translate(${deltaX}px, 0)`;
    
    const moveSpeed = 0.6;
    if (deltaX > 5 && posX < 98) posX += moveSpeed;
    if (deltaX < -5 && posX > 2) posX -= moveSpeed;
    
    carriage.style.left = posX + '%';
}

joystickKnob.onmousedown = () => isJoystickTouching = true;
window.onmousemove = (e) => {
    handleJoystick(e);
    handleCardTilt(e);
};
window.onmouseup = () => {
    isJoystickTouching = false;
    joystickKnob.style.transform = `translate(0, 0)`;
};

joystickKnob.ontouchstart = () => isJoystickTouching = true;
window.ontouchmove = handleJoystick;
window.ontouchend = () => {
    isJoystickTouching = false;
    joystickKnob.style.transform = `translate(0, 0)`;
};

function handleCardTilt(e) {
    if (winPopup.style.display !== 'flex') return;
    
    const rect = cardWrapper.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    const rotateY = (mouseX / (window.innerWidth / 2)) * 20;
    const rotateX = -(mouseY / (window.innerHeight / 2)) * 20;

    cardWrapper.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
}

function startTimer() {
    timeLeft = 10;
    timerVal.innerText = timeLeft;
    timerId = setInterval(() => {
        timeLeft--;
        timerVal.innerText = timeLeft;
        if (timeLeft <= 0) dropClaw();
    }, 1000);
}

function dropClaw() {
    if (state !== 'playing') return;
    state = 'dropping';
    clearInterval(timerId);
    
    assembly.style.transition = 'top 1.5s ease-in';
    cable.style.transition = 'top 1.5s ease-in';
    assembly.style.top = '310px';
    cable.style.top = '-690px';

    setTimeout(() => {
        clawBody.classList.add('grabbing');
        caughtPlushie = checkCollision();
        
        setTimeout(() => {
            assembly.style.top = '0px';
            cable.style.top = '-1000px';
            state = 'returning';
            
            setTimeout(() => {
                carriage.style.transition = 'left 2s linear';
                posX = -5;
                carriage.style.left = posX + '%';

                let slipCheck = setInterval(() => {
                    if (isHolding && Math.random() < 0.08) {
                        isHolding = false;
                        clearInterval(slipCheck);
                        handleDropFail();
                    }
                }, 400);

                setTimeout(() => {
                    clearInterval(slipCheck);
                    clawBody.classList.remove('grabbing');
                    if (isHolding) {
                        isHolding = false;
                        const p = caughtPlushie;
                        p.style.transition = 'top 0.8s ease-in';
                        p.style.top = '150%';
                        setTimeout(() => showWin(p), 800);
                    } else {
                        setTimeout(resetGame, 500);
                    }
                }, 2100);
            }, 1600);
        }, 1000);
    }, 1600);
}

function checkCollision() {
    const clawRect = assembly.getBoundingClientRect();
    let target = null;
    document.querySelectorAll('.plush').forEach(p => {
        if (p.style.opacity === '0') return;
        const pRect = p.getBoundingClientRect();
        const dist = Math.sqrt(
            Math.pow((clawRect.left + clawRect.width/2) - (pRect.left + pRect.width/2), 2) +
            Math.pow((clawRect.top + clawRect.height - 20) - (pRect.top + pRect.height/2), 2)
        );
        if (dist < 60) target = p;
    });

    if (target) {
        isHolding = true;
        const shelf = document.getElementById('plushieShelf').getBoundingClientRect();
        const follow = () => {
            if (isHolding) {
                const c = assembly.getBoundingClientRect();
                target.style.left = (c.left - shelf.left + 25) + 'px';
                target.style.top = (c.top - shelf.top + 45) + 'px';
                requestAnimationFrame(follow);
            }
        };
        follow();
        return target;
    }
    return null;
}

function handleDropFail() {
    if (!caughtPlushie) return;
    const p = caughtPlushie;
    p.style.transition = 'top 0.5s ease-in, left 0.5s ease-out';
    p.style.top = '70%';
    p.style.left = (35 + Math.random() * 40) + '%';
    setTimeout(resetGame, 600);
}

function showWin(plush) {
    const name = plush.getAttribute('data-name');
    document.getElementById('charName').innerText = name.toUpperCase();
    document.getElementById('charTrivia').innerText = triviaData[name];
    prizeDisplay.innerHTML = `<img src="${plush.src}">`;
    winPopup.style.display = 'flex';
}

function resetGame() {
    state = 'idle';
    posX = 50;
    carriage.style.transition = 'none';
    carriage.style.left = '50%';
    playBtn.innerText = 'PLAY';
    timerVal.innerText = '10';
    if (caughtPlushie && !isHolding && parseInt(caughtPlushie.style.top) > 100) {
        caughtPlushie.style.opacity = '0';
    }
    caughtPlushie = null;
    isHolding = false;
    cardWrapper.style.transform = 'rotateX(0deg) rotateY(0deg)';
}

playBtn.onclick = () => {
    if (state === 'idle') { state = 'playing'; playBtn.innerText = 'DROP!'; startTimer(); }
    else if (state === 'playing') dropClaw();
};

function closePopup() { winPopup.style.display = 'none'; resetGame(); }