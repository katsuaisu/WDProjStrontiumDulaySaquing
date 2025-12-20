document.addEventListener('DOMContentLoaded', () => {
    const machines = document.querySelectorAll('.machine');

    machines.forEach(machine => {
        machine.addEventListener('mouseenter', () => {
            
            console.log("Hovering machine!");
        });

        machine.addEventListener('mousedown', () => {
            machine.style.transform = 'translateY(-10px) scale(0.95)';
        });

        machine.addEventListener('mouseup', () => {
            machine.style.transform = 'translateY(-25px) scale(1.1)';
        });
    });
});