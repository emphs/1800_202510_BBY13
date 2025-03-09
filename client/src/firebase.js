// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAMd6uOBKNaq7VjK5rAM5VDBiD3gh6kgR8",
    authDomain: "aa-5607f.firebaseapp.com",
    databaseURL: "https://aa-5607f.firebaseio.com",
    projectId: "aa-5607f",
    storageBucket: "aa-5607f.firebasestorage.app",
    messagingSenderId: "87623476991",
    appId: "1:87623476991:web:bbfaf8e049cdadd0e7ceca",
    measurementId: "G-784Z8S5HZ2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export {app, auth, db};
