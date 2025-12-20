const carriage = document.getElementById('clawCarriage');
const assembly = document.getElementById('clawAssembly');
const cable = document.getElementById('clawCable');
const playBtn = document.getElementById('playBtn');
const timerVal = document.getElementById('timerVal');
const leftBtn = document.getElementById('leftBtn');
const rightBtn = document.getElementById('rightBtn');
const plushies = document.querySelectorAll('.plush');
const winPopup = document.getElementById('winPopup');
const prizeDisplay = document.getElementById('prizeDisplay');

const triviaData = {
    "Chiikawa": "Chiikawa (ちいかわ) is the titular character and protagonist of the manga and anime series. They are best friends with Hachiware and Usagi, and spends much of their time hanging out together.",
    "Hachiware": "Hachiware (ハチワレ) is one of the main characters in the Chiikawa manga and anime series. In the series, they are best friends with Chiikawa and Usagi, and are often seen spending time with them on their daily adventures.",
    "Usagi": "Usagi (うさぎ) is one of the main characters in the Chiikawa manga and anime series. In the Chiikawa-verse, they are best friends with Chiikawa and Hachiware, known for their energetic personality and playful antics during their time together.",
    "Momonga": "Momonga (モモンガ) is a secondary character of the Chiikawa manga and anime series. They are a flying squirrel who is often seen begging for attention and praise, stealing food, and causing trouble for other characters. Their name comes from the Japanese word 'momonga', which means flying squirrel.",
    "Kurimanju": "Kuri-Manjū (くりまんじゅう), or Kurimanju/Kuri-Manju, is a character in the Chiikawa series, inspired by the Japanese chestnut bun and a honey badger. He often acts like a middle-age Japanese man, typically seen eating snacks or drinking alcohol, after which he always makes a very loud sigh.",
    "Rakko": "Rakko (ラッコ) is a character in the Chiikawa series. They're a strong and skilled sea otter who’s especially good at hunting. Their name literally means “sea otter” in Japanese.",
    "Shisa": "Shisa (シーサー) is a character in the Chiikawa series. They're a hardworking Lion-Dog, named after the traditional guardian figure from Okinawan mythology. They currently work at Rou Ramen Shop. They are also studying to get their alcohol license. Their dream is to drink with their ramen master, Ramen Yoroi-san, one day.",
    "Anoko": "Anoko (あのこ) is a chimera in the Chiikawa world. Though Anoko has an adorable appearance, they are often seen attacking mob characters and sometimes even eating them.",
    "Kani": "Furuhonya (古本屋) or Kani (かに lit. Crab) is a secondary character in the Chiikawa manga series. They are a street vendor who runs a used bookstore. Originally appeared as a Mob character, Furuhonya revealed their appearance when they befriended Momonga."
    
};

let state = 'idle'; 
let posX = 50;
let timeLeft = 10;
let timerId = null;
let moveId = null;
let isHolding = false;
let caughtPlushie = null;
let slipCheckInterval = null;

function updatePos() { carriage.style.left = posX + '%'; }

function startTimer() {
    timeLeft = 10;
    timerVal.innerText = timeLeft;
    timerId = setInterval(() => {
        timeLeft--;
        timerVal.innerText = timeLeft;
        if (timeLeft <= 0) { clearInterval(timerId); dropClaw(); }
    }, 1000);
}

function dropClaw() {
    if (state !== 'playing') return;
    state = 'dropping';
    clearInterval(timerId);
    playBtn.disabled = true;

    assembly.style.transition = 'top 1.8s cubic-bezier(0.45, 0, 0.55, 1)';
    cable.style.transition = 'top 1.8s cubic-bezier(0.45, 0, 0.55, 1)';
    
    const dropDepth = 310; 
    assembly.style.top = dropDepth + 'px';
    cable.style.top = (dropDepth - 1000) + 'px';

    setTimeout(() => {
        carriage.classList.add('grabbing'); 
        caughtPlushie = checkCollision();
        
        if (caughtPlushie) setTimeout(settleRemainingPlushies, 200);

        setTimeout(() => {
            assembly.style.top = '0px'; 
            cable.style.top = '-1000px';
            state = 'returning';
            
            setTimeout(() => {
                carriage.style.transition = 'left 2.2s cubic-bezier(0.45, 0.05, 0.55, 0.95)';
                posX = -8; 
                updatePos();

                if (isHolding) {
                    let checks = 0;
                    slipCheckInterval = setInterval(() => {
                        checks++;
                        if (Math.random() < 0.08 && checks > 5) {
                            isHolding = false;
                            clearInterval(slipCheckInterval);
                            handleDropFail();
                        }
                    }, 100);
                }
                
                setTimeout(() => {
                    clearInterval(slipCheckInterval);
                    carriage.classList.remove('grabbing');
                    
                    if (isHolding) {
                        isHolding = false;
                        const saved = caughtPlushie;
                        saved.style.transition = 'top 0.8s ease-in, transform 0.8s ease-in';
                        saved.style.top = '160%'; 
                        saved.style.transform += ' rotate(180deg) scale(0.5)';
                        setTimeout(() => showWin(saved), 1000);
                    } else {
                        setTimeout(() => resetGame(), 600);
                    }
                }, 2400); 
            }, 1900);
        }, 1100);
    }, 1900);
}

function handleDropFail() {
    if (!caughtPlushie) return;
    const p = caughtPlushie;
    p.style.transition = 'top 0.6s cubic-bezier(0.35, 0, 0.65, 1), transform 0.6s ease';
    p.style.top = '70%';
    p.style.transform += ` rotate(${Math.random() * 90 - 45}deg)`;
    setTimeout(() => resetGame(), 800);
}

function settleRemainingPlushies() {
    plushies.forEach(p => {
        if (p === caughtPlushie || p.style.opacity === '0') return;
        const currentTop = parseInt(p.style.top);
        if (currentTop < 65) {
            p.style.top = (65 + Math.random() * 5) + '%';
            p.style.transform = `rotate(${Math.random() * 40 - 20}deg)`;
        }
    });
}

function checkCollision() {
    const clawRect = assembly.getBoundingClientRect();
    let target = null;

    plushies.forEach(p => {
        if (p.style.opacity === '0') return;
        const pRect = p.getBoundingClientRect();
        const dist = Math.sqrt(
            Math.pow((clawRect.left + clawRect.width/2) - (pRect.left + pRect.width/2), 2) +
            Math.pow((clawRect.top + clawRect.height - 30) - (pRect.top + pRect.height/2), 2)
        );

        if (dist < 75 && !target) target = p;
    });

    if (target) {
        isHolding = true;
        target.style.transition = 'none';
        const shelfRect = document.getElementById('plushieShelf').getBoundingClientRect();
        const initialRotation = target.style.transform || 'rotate(0deg)';
        
        const follow = () => {
            if (isHolding) {
                const cRect = assembly.getBoundingClientRect();
                target.style.left = (cRect.left - shelfRect.left + (cRect.width/2) - (target.offsetWidth/2)) + 'px';
                target.style.top = (cRect.top - shelfRect.top + 15) + 'px';
                target.style.transform = initialRotation; 
                requestAnimationFrame(follow);
            }
        };
        follow();
        return target;
    }
    return null;
}

function showWin(plush) {
    const name = plush.getAttribute('data-name');
    document.getElementById('charName').innerText = name.toUpperCase();
    document.getElementById('charTrivia').innerText = triviaData[name] || "A very special friend!";
    prizeDisplay.innerHTML = `<img src="${plush.src}">`;
    winPopup.style.display = 'flex';
}

function closePopup() {
    winPopup.style.display = 'none';
    resetGame();
}

function resetGame() {
    state = 'idle'; 
    posX = 50;
    carriage.style.transition = 'none'; 
    updatePos();
    assembly.style.top = '0px'; 
    cable.style.top = '-1000px';
    playBtn.disabled = false; 
    playBtn.innerText = 'PLAY';
    timerVal.innerText = '10';
    if(caughtPlushie && !isHolding) {
        if(parseInt(caughtPlushie.style.top) > 100) caughtPlushie.style.opacity = '0';
        caughtPlushie.style.transition = 'top 0.8s ease, left 0.8s ease, transform 0.8s ease';
    }
    caughtPlushie = null;
    isHolding = false;
    clearInterval(slipCheckInterval);
}

playBtn.onclick = () => {
    if (state === 'idle') { state = 'playing'; playBtn.innerText = 'DROP!'; startTimer(); }
    else if (state === 'playing') dropClaw();
};

const handleMove = (dir) => {
    if (state !== 'playing') return;
    if (moveId) return;
    moveId = setInterval(() => {
        if (dir === 'left' && posX > 1) posX -= 0.85;
        else if (dir === 'right' && posX < 98) posX += 0.85;
        else clearInterval(moveId);
        updatePos();
    }, 16);
};

const stopMove = () => { clearInterval(moveId); moveId = null; };
leftBtn.onmousedown = () => handleMove('left');
rightBtn.onmousedown = () => handleMove('right');
window.onmouseup = stopMove;
leftBtn.ontouchstart = (e) => { e.preventDefault(); handleMove('left'); };
rightBtn.ontouchstart = (e) => { e.preventDefault(); handleMove('right'); };
window.ontouchend = stopMove;