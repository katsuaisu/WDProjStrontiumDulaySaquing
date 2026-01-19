// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCswu6YR_Zcd4htvNaeuVEKqczw9GlrHSI",
  authDomain: "chiikarcade.firebaseapp.com",
  projectId: "chiikarcade",
  storageBucket: "chiikarcade.firebasestorage.app",
  messagingSenderId: "692701231363",
  appId: "1:692701231363:web:aba787e6712a167cd99136"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

function confirmSub()
{
    return confirm("Are you sure you want to submit the form?")
}

function confirmRes()
{
    return confirm("Are you sure you want to reset the form?")
}

function checkVal(input)
{
    if(input.value.trim() === "")
    {
        input.style.border = "4px solid red";
    }
    
    else
    {
        input.style.border = "";
    }
}

const emailInput = document.getElementById('email');
const passInput = document.getElementById('password');
const btnLogin = document.getElementById('btnLogin');
const btnSignup = document.getElementById('btnSignup');
const btnAnon = document.getElementById('btnAnon');
const errorMsg = document.getElementById('errorMsg');

// Check if already logged in
onAuthStateChanged(auth, (user) => {
    if (user) {
        window.location.href = "index.html";
    }
});

// Helper to show errors
const showError = (error) => {
    const cleanMsg = error.code.replace('auth/', '').replace(/-/g, ' ');
    errorMsg.innerText = cleanMsg;
};

// Event Listeners
btnLogin.addEventListener('click', () => {
    const email = emailInput.value;
    const pass = passInput.value;
    if(!email || !pass) return showError({code: 'Enter email & password'});
    
    signInWithEmailAndPassword(auth, email, pass)
        .then(() => window.location.href = "index.html")
        .catch(showError);
});

btnSignup.addEventListener('click', () => {
    const email = emailInput.value;
    const pass = passInput.value;
    if(!email || !pass) return showError({code: 'Enter email & password'});

    createUserWithEmailAndPassword(auth, email, pass)
        .then(() => window.location.href = "index.html")
        .catch(showError);
});

btnAnon.addEventListener('click', () => {
    signInAnonymously(auth)
        .then(() => window.location.href = "index.html")
        .catch(showError);
});