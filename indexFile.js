/**
 * /// FIREBASE INITIALIZATION ///
 * connects our website to uno's firebase, which helps users sign in-out and save their data 
 * across their devices
 */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCswu6YR_Zcd4htvNaeuVEKqczw9GlrHSI",
    authDomain: "chiikarcade.firebaseapp.com",
    projectId: "chiikarcade",
    storageBucket: "chiikarcade.firebasestorage.app",
    messagingSenderId: "692701231363",
    appId: "1:692701231363:web:aba787e6712a167cd99136"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

/**
 * // FLOATING STUFF IN THE BACKGROUND // 
 * these "navigate" or like control the floating stuff in the background which are 
 * like particles to make it more visually appealing or magical since that's our theme 
 */
(function createParticles() {
    const particleLayer = document.getElementById('particles');
    if (!particleLayer) return;

    const pastelColors = ['#fff7ff', '#dff8ff', '#fbe7f2', '#fef0c7', '#e9dcff'];
    const pixelColors = ['#fff', '#ffd6f0', '#e7f4ff', '#ffd9b6'];
    const rnd = (a, b) => Math.random() * (b - a) + a;

    // this makes the circular and like slightly blurry particles randomly
    // it follows the colors on top (which acts like a sort of guide..? to which color
    // each particle is supposesd to follow )
    for (let i = 0; i < 18; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        const size = rnd(8, 42);
        p.style.width = size + 'px';
        p.style.height = size + 'px';
        p.style.left = rnd(-10, 110) + '%';
        p.style.top = rnd(0, 100) + '%';
        p.style.background = pastelColors[Math.floor(Math.random() * pastelColors.length)];
        p.style.opacity = 0;
        p.style.filter = 'blur(' + rnd(1, 6) + 'px)';
        particleLayer.appendChild(p);
        animateSoft(p, i);
    }

    // this is just whats up there ^^^ but for pixel naman
    for (let i = 0; i < 26; i++) {
        const px = document.createElement('div');
        px.className = 'pixel';
        const size = Math.floor(rnd(6, 14));
        px.style.width = size + 'px';
        px.style.height = size + 'px';
        px.style.left = rnd(0, 100) + '%';
        px.style.top = rnd(0, 100) + '%';
        px.style.background = pixelColors[Math.floor(Math.random() * pixelColors.length)];
        px.style.opacity = 0;
        particleLayer.appendChild(px);
        animatePixel(px, i);
    }

    // floating animation for the first particles which tells em to go vertical 
    function animateSoft(el, seed) {
        const duration = rnd(6000, 14000);
        el.animate([
            { opacity: 0, transform: `translateY(0)scale(0.8)` }, 
            { opacity: rnd(0.35, 0.85), transform: `translateY(-${rnd(6, 40)}px)scale(${rnd(0.9, 1.15)})` }, 
            { opacity: 0, transform: `translateY(-${rnd(40, 90)}px)scale(${rnd(1.05, 1.3)})` }
        ], { duration: duration, iterations: Infinity, delay: (seed % 7) * 160, easing: 'cubic-bezier(.2,.8,.2,1)' });
    }

    // rotating ++ horizontal thing for the pixels
    function animatePixel(el, seed) {
        const duration = rnd(2800, 5400);
        const dirX = (Math.random() > 0.5 ? 1 : -1);
        const drift = rnd(8, 60) * dirX;
        el.animate([
            { opacity: 0, transform: `translate(0px,0px)scale(1)` }, 
            { opacity: rnd(0.5, 0.95), transform: `translate(${drift}px,-${rnd(6, 40)}px)scale(${rnd(0.9, 1.35)})rotate(${rnd(-30, 30)}deg)` }, 
            { opacity: 0, transform: `translate(${drift * 1.2}px,-${rnd(36, 120)}px)scale(${rnd(1.1, 1.6)})rotate(${rnd(-60, 60)}deg)` }
        ], { duration: duration, iterations: Infinity, delay: (seed % 5) * 120, easing: 'cubic-bezier(.2,.8,.2,1)' });
    }
})();

/**
 * CHARACTER EASTER EGG
 * momonga to uno :#
 */
const logo = document.getElementById("logo");
const image = document.getElementById("characterSprite");
const bonusLetter = document.querySelector(".clickHere");
let replacePng = true;

if (bonusLetter && image) {
    bonusLetter.addEventListener("click", function () {
        if (replacePng) image.src = "assets/photoOfMe.png";
        else image.src = "assets/chiksomething.png";
        replacePng = !replacePng;
    });
}

/**
 * PFP SELECTION
 * basically how to change ur pfp onclick
 * its just an array lol
 */
const pfpOptions = [
    "assets/chiPfp.png",
    "assets/hachiPfp.png",
    "assets/usagiPfp.png",
    "assets/momongaPfp.png"
];
let currentPfpIndex = 0;
let isSignup = false;

/**
 * ui and authentication stuff
 */
document.addEventListener('DOMContentLoaded', () => {
    // selectors on which "screen" to show
    const backdrop = document.getElementById('loginBackdrop');
    const anonBtn = document.getElementById('anonBtn');
    const loginBtn = document.getElementById('doLoginBtn');
    const toggleBtn = document.getElementById('toggleMode');
    const title = document.getElementById('loginTitle');
    const emailInput = document.getElementById('emailInput');
    const passwordInput = document.getElementById('passwordInput');
    const userHud = document.getElementById('userProfileHud');
    const displayEmail = document.getElementById('displayEmail');
    const logoutBtn = document.getElementById('logoutBtn');
    const pfpImg = document.getElementById('currentUserPfp');

    // hiding the login overlay
    function closePopup() {
        backdrop.style.opacity = '0';
        setTimeout(() => backdrop.style.display = 'none', 500);
    }

    // showing the login overlay
    function showPopup() {
        backdrop.style.display = 'flex';
        setTimeout(() => backdrop.style.opacity = '1', 10);
    }

    // anonymous
    anonBtn.addEventListener('click', closePopup);

    // login to signup toggle 
    toggleBtn.addEventListener('click', () => {
        isSignup = !isSignup;
        title.innerText = isSignup ? "Sign Up !" : "Welcome !";
        loginBtn.innerText = isSignup ? "Create Account" : "Login";
        toggleBtn.innerText = isSignup ? "Have an account? Login" : "Sign Up instead?";
    });

    // auth request (creds to firebase for help lol)
    //
    loginBtn.addEventListener('click', async () => {
        const email = emailInput.value;
        const password = passwordInput.value;

        if (!email || !password) {
            alert("Please enter both email and password!");
            return;
        }

        loginBtn.innerText = "Processing...";

        try {
            if (isSignup) {
                await createUserWithEmailAndPassword(auth, email, password);
                alert("Account created successfully!");
            } else {
                await signInWithEmailAndPassword(auth, email, password);
                alert("Login successful!");
            }
        } catch (error) {
            console.error("Firebase Auth Error:", error);
            let cleanMessage = error.message.replace("Firebase: ", "").replace("auth/", "");
            alert("Error: " + cleanMessage);
            loginBtn.innerText = isSignup ? "Create Account" : "Login";
        }
    });

    // logging out 
    logoutBtn.addEventListener('click', () => {
        signOut(auth).catch((err) => console.error(err));
    });

    // pfp onclick
    pfpImg.addEventListener('click', () => {
        currentPfpIndex = (currentPfpIndex + 1) % pfpOptions.length;
        pfpImg.src = pfpOptions[currentPfpIndex];
    });

    // updates the interface once logged in 
    onAuthStateChanged(auth, (user) => {
        if (user) {
            closePopup();
            userHud.style.display = 'flex';
            displayEmail.innerText = user.email.split('@')[0]; // basically shows ur user (which is ur email but wo the @)
            if (logo) logo.style.opacity = '0.5';
        } else {
            showPopup();
            userHud.style.display = 'none';
            if (logo) logo.style.opacity = '1';
            loginBtn.innerText = "Login";
        }
    });

    //cursor work
    document.querySelectorAll('button, a, .pfp-container').forEach(el => {
        el.addEventListener('mouseenter', () => el.style.cursor = "url('assets/cursorMomonga2.png'), pointer");
        el.addEventListener('mouseleave', () => el.style.cursor = "url('assets/cursorMomonga.png'), auto");
    });

    /**
     * i hate music
     * mute / unmute
     */
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

    // stopping autoplay by like only playing music once smth is clicked 
    document.addEventListener('click', () => {
        if (music.paused && musicToggle.innerText === "PLAY MUSIC") {
            music.play().then(() => {
                musicToggle.innerText = "MUTE";
            }).catch(err => console.log("Autoplay blocked until user interaction."));
        }
    }, { once: true });
});