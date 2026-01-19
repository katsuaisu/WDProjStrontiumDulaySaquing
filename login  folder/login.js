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