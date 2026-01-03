document.addEventListener("DOMContentLoaded", () => {

    for (let i = 0; i < 30; i++) {
        let spark = document.createElement('div');
        spark.className = 'sparkle';
        spark.style.top = Math.random() * 100 + 'vh';
        spark.style.left = Math.random() * 100 + 'vw';
        spark.style.animationDelay = Math.random() * 3 + 's';

        let size = Math.random() * 6 + 3;
        spark.style.width = size + 'px';
        spark.style.height = size + 'px';

        document.body.appendChild(spark);
    }

    const pointsElement = document.getElementById('pochPlate');
    const targetPoints = parseInt(pointsElement.getAttribute('data-target'));
    animateValue(pointsElement, 0, targetPoints, 1500);
});

function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);


        const easedProgress = 1 - (1 - progress) * (1 - progress);

        obj.innerHTML = Math.floor(easedProgress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

function selectCharacter(element, destination) {

    element.classList.add('chosen');


    const allCards = document.querySelectorAll('.char-card');
    allCards.forEach(card => {
        if (card !== element) {
            card.classList.add('fade-away');
        }
    });


    setTimeout(() => {
        document.getElementById('overlay').classList.add('white-flash');
    }, 600);


    setTimeout(() => {
        window.location.href = destination;
    }, 1100);
}

function toggleModal() {
    const modal = document.getElementById('maintenanceModal');
    modal.classList.toggle('hidden');
}