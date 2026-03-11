// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAt_fwbyWGYgUGContjg3-nTqRzm0nHHPM",
  authDomain: "portfolio-aeefb.firebaseapp.com",
  projectId: "portfolio-aeefb",
  storageBucket: "portfolio-aeefb.firebasestorage.app",
  messagingSenderId: "753060911459",
  appId: "1:753060911459:web:2d51d890cd3c47f4d61b56",
  measurementId: "G-8SHYX4C4S5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const storage = getStorage(app);