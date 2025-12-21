document.addEventListener('DOMContentLoaded', () => {
    const machines = document.querySelectorAll('.machine');

    machines.forEach(machine => {
        // Optional: Add sound effect logic here later
        
        machine.addEventListener('mousedown', () => {
            // Slight press effect
            machine.style.transform = 'translateY(-15px) scale(1.05)';
        });

        machine.addEventListener('mouseup', () => {
            // Release returns to hover state (defined in CSS as -20px scale 1.1)
            machine.style.removeProperty('transform');
        });
        
        // Removed the mouseenter console.log to keep it clean
    });
});