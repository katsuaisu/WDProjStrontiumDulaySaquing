document.addEventListener('DOMContentLoaded', () => {
    
    // MACHINE ANIMATIONS
    const machines = document.querySelectorAll('.machine');
    const machineShelf = document.querySelector('.machine-shelf'); // selecting the continaer to disblae clikcs

    machines.forEach(machine => {
        machine.addEventListener('mousedown', () => {
            machine.style.transform = 'translateY(-15px) scale(1.05)';
        });
        machine.addEventListener('mouseup', () => {
            machine.style.removeProperty('transform');
        });
    });

    // THE HILLLSS ARE ALIIVE WITH THE SOOUUNDD OF MUSIIICCC
    const music = document.getElementById('bgMusic');
    const musicToggle = document.getElementById('musicToggle');

    musicToggle.addEventListener('click', () => {
        if (music.paused) {
            music.play();
            musicToggle.innerText = "MUTE";
        } else {
            if (music.muted) {
                music.muted = false;
                musicToggle.innerText = "MUTE";
            } else {
                music.muted = true;
                musicToggle.innerText = "UNMUTE";
            }
        }
    });

    document.addEventListener('click', () => {
        if (music.paused && musicToggle.innerText === "PLAY MUSIC") {
            music.play().then(() => {
                musicToggle.innerText = "MUTE";
            }).catch(err => console.log("Autoplay blocked until interaction"));
        }
    }, { once: true });


    // dialogue logic 
    const dialogueContainer = document.getElementById('chiikawaDialogue');
    const chiText = document.getElementById('chiText');
    const chiExpression = document.getElementById('chiExpression');

    const script = [
        {
            text: "Wa...!! It's the Arcade Room!!",
            img: "../assets/shockedChiikawa.png"
        },
        {
            text: "There are so many games to play...",
            img: "../assets/happyChiikawa.png"
        },
        {
            text: "Which one should we try first? I heard Usagi's Snack Run is the hardest..",
            img: "../assets/thinkingChiikawa.png"
        },
        {
            text: "But I think the Yoroi-Sans haven't finished the Slot Machine..",
            img: "../assets/shockedChiikawa.png"
        },
        {
            text: "Anyways...Enjoy playing! Make sure to vote my website if you love the games :)",
            img: "../assets/happyChiikawa.png"
        }
    ];

    let step = 0;
    let isTyping = false;
    let typeInterval;
    
    // this is basically js the typing animaiton 
    function typeWriter(text) {
        if (!chiText) return;
        chiText.innerHTML = "";
        isTyping = true;
        let i = 0;
        clearInterval(typeInterval);

        typeInterval = setInterval(() => {
            if (i < text.length) {
                chiText.innerHTML += text.charAt(i);
                i++;
            } else {
                clearInterval(typeInterval);
                isTyping = false;
            }
        }, 40);
    }

    function advanceDialogue() {
        // if dialogue ends
        if (step >= script.length) {
            dialogueContainer.style.opacity = '0';
            setTimeout(() => {
                dialogueContainer.style.display = 'none';
                // this re enables the machines
                machineShelf.style.pointerEvents = 'auto'; 
            }, 500);
            return;
        }

        if (isTyping) {
            clearInterval(typeInterval);
            chiText.innerHTML = script[step].text;
            isTyping = false;
            return;
        }

        const currentLine = script[step];
        if (chiExpression) chiExpression.src = currentLine.img;
        typeWriter(currentLine.text);
        step++;
    }

    // start 
    setTimeout(() => {
        // this disables clicking on the machines while the dialogue is dialogueing 
        if(machineShelf) machineShelf.style.pointerEvents = 'none';
        
        dialogueContainer.style.display = 'flex';
        setTimeout(() => {
            dialogueContainer.style.opacity = '1';
            advanceDialogue();
        }, 100);
    }, 1000);

    dialogueContainer.addEventListener('click', advanceDialogue);
});