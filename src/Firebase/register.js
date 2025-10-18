// register.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

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

// ✅ Register form logic
const registerForm = document.getElementById('registerForm');
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const fullName = document.getElementById('fullName').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save full name in Firebase Auth profile
    await updateProfile(user, { displayName: fullName });

    alert('✅ Account created successfully!');
    window.location.href = "dashboard.html"; // redirect to dashboard
  } catch (error) {
    console.error(error);
    alert(`❌ ${error.message}`);
  }
});