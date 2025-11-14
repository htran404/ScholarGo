// Firebase CDN imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-analytics.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-storage.js";

// ========================================================================================
// IMPORTANT: PLEASE CONFIGURE YOUR FIREBASE PROJECT
// ========================================================================================
// The configuration below is a placeholder. You must replace it with your own
// Firebase project's configuration for the application to function correctly.
//
// An incorrect or missing configuration is a common cause of errors such as:
// - "Firebase: Error (auth/network-request-failed)"
// - "Firebase: Error (auth/configuration-not-found)"
// - "INVALID_ARGUMENT: API key not valid"
//
// How to get your Firebase config:
// 1. Go to the Firebase Console: https://console.firebase.google.com/
// 2. Select your project (or create a new one).
// 3. In the sidebar, click the gear icon > Project settings.
// 4. In the "General" tab, scroll down to the "Your apps" section.
// 5. If you don't have a web app, click the web icon (</>) to create one.
// 6. Find your web app and click on "Config" under "Firebase SDK snippet".
// 7. Copy the entire configuration object and paste it below, replacing the placeholders.
// ========================================================================================
const firebaseConfig = {
  apiKey: "AIzaSyBoIQTmqXhsipSxBVP6Vy5LPM3pNpHF39c",
  authDomain: "scholargo-561c5.firebaseapp.com",
  projectId: "scholargo-561c5",
  storageBucket: "scholargo-561c5.firebasestorage.app",
  messagingSenderId: "350392914792",
  appId: "1:350392914792:web:3a4aa4743af5284364bcdd",
  measurementId: "G-KKN0RQYS5M"
};
// Initialize core Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);

// Export services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);