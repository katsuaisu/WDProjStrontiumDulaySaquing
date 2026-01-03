document.addEventListener('DOMContentLoaded', () => {
    const unoTrigger = document.getElementById('unoTrigger');
    const reiTrigger = document.getElementById('reiTrigger');

    function makeItRain(imageSrc) {
        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                const drop = document.createElement('img');
                drop.src = imageSrc;
                drop.classList.add('falling-item');

                const startLeft = Math.random() * 95;
                const size = Math.random() * 70 + 60;
                const duration = Math.random() * 2 + 1.5;
                const rotationDir = Math.random() > 0.5 ? 1 : -1;

                drop.style.left = startLeft + 'vw';
                drop.style.width = size + 'px';
                drop.style.animationDuration = duration + 's';

                document.body.appendChild(drop);
                setTimeout(() => { drop.remove(); }, duration * 1000);
            }, i * 80);
        }
    }

    if (unoTrigger) {
        unoTrigger.addEventListener('click', () => {
            makeItRain('../assets/uno_baby_pic.png');
        });
    }

    if (reiTrigger) {
        reiTrigger.addEventListener('click', () => {
            makeItRain('../assets/rei_baby_pic.png');
        });
    }
});