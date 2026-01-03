const cursor = document.getElementById('cursor');
const bg = document.querySelector('.pixel-bg');
const modal = document.getElementById('modal');
const buyBtn = document.getElementById('buyBtn');
const closeBtn = document.getElementById('closeModal');

document.addEventListener('mousemove', (e) => {
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;

    const x = (window.innerWidth / 2 - e.clientX) / 90;
    const y = (window.innerHeight / 2 - e.clientY) / 90;
    if (bg) bg.style.transform = `scale(1.1) translate(${x}px, ${y}px)`;
});

const targets = document.querySelectorAll('button, .cursor-item, .bg-preview-box, .floating-chik');
targets.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
});

buyBtn.addEventListener('click', () => {
    modal.style.display = 'flex';
});

closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
});

function spawnSparkle() {
    const s = document.createElement('div');
    s.className = 'sparkle';
    const container = document.querySelector('.character-container');

    if (container) {
        const rect = container.getBoundingClientRect();
        s.style.left = Math.random() * rect.width + 'px';
        s.style.top = Math.random() * rect.height + 'px';
        s.style.setProperty('--tx', (Math.random() - 0.5) * 120 + 'px');
        s.style.setProperty('--ty', (Math.random() - 0.5) * 120 + 'px');
        document.querySelector('.sparkle-container').appendChild(s);
        setTimeout(() => s.remove(), 1000);
    }
}

setInterval(spawnSparkle, 200);

document.addEventListener('click', (e) => {
    const bolt = document.createElement('div');
    bolt.className = 'click-heart';
    bolt.innerHTML = '⚡';
    bolt.style.left = e.clientX + 'px';
    bolt.style.top = e.clientY + 'px';
    document.body.appendChild(bolt);
    setTimeout(() => bolt.remove(), 1000);
});