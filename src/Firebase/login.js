import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

// 🔥 Your Firebase Config
const firebaseConfig = {

  apiKey: "AIzaSyDXNgAu_cq5TAbgRcr3AMHx1i-Hq1fMcNY",

  authDomain: "hackknight-8b54b.firebaseapp.com",

  projectId: "hackknight-8b54b",

  storageBucket: "hackknight-8b54b.firebasestorage.app",

  messagingSenderId: "155631921225",

  appId: "1:155631921225:web:26e2429e7a2f69bc0eb798",

  measurementId: "G-2XYN60V47D"

};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ✅ Email/password login
const loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert('✅ Logged in successfully!');
    // Redirect to the main React app
    window.location.href = "/";
  } catch (error) {
    console.error(error);
    alert(`❌ ${error.message}`);
  }
});

// ✅ Google login
const googleLoginBtn = document.getElementById('googleLogin');
const provider = new GoogleAuthProvider();

googleLoginBtn.addEventListener('click', async () => {
  try {
    await signInWithPopup(auth, provider);
    alert('✅ Google login successful!');
    window.location.href = "/";
  } catch (error) {
    console.error(error);
    alert(`❌ ${error.message}`);
  }
});