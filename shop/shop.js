        
        for(let i=0; i<20; i++) {
            let spark = document.createElement('div');
            spark.className = 'sparkle';
            spark.style.top = Math.random() * 100 + 'vh';
            spark.style.left = Math.random() * 100 + 'vw';
            spark.style.animationDelay = Math.random() * 2 + 's';
            document.body.appendChild(spark);
        }

        function selectCharacter(element, destination) {
           
            element.classList.add('chosen');

            
            const allCards = document.querySelectorAll('.char-card');
            allCards.forEach(card => {
                if(card !== element) {
                    card.style.opacity = '0.3';
                    card.style.transform = 'scale(0.9)';
                }
            });

    

            
            setTimeout(() => {
                document.getElementById('overlay').classList.add('fade-out');
            }, 600);

            
            setTimeout(() => {
                window.location.href = destination;
            }, 1400);
        }