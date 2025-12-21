document.addEventListener('DOMContentLoaded', () => {
    const machines = document.querySelectorAll('.machine');

    machines.forEach(machine => {
        // sound maybe
        
        machine.addEventListener('mousedown', () => {
            
            machine.style.transform = 'translateY(-15px) scale(1.05)';
        });

        machine.addEventListener('mouseup', () => {
           
            machine.style.removeProperty('transform');
        });
        
        
    });
});