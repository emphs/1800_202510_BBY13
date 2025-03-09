import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import * as firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';

const config = {
    apiKey: "AIzaSyAMd6uOBKNaq7VjK5rAM5VDBiD3gh6kgR8",
    authDomain: "aa-5607f.firebaseapp.com",
    databaseURL: "https://aa-5607f.firebaseio.com",
    projectId: "aa-5607f",
    storageBucket: "aa-5607f.firebasestorage.app",
    messagingSenderId: "87623476991",
    appId: "1:87623476991:web:bbfaf8e049cdadd0e7ceca",
    measurementId: "G-784Z8S5HZ2"
};

const app = initializeApp(config);
const auth = getAuth(app);
const db = getFirestore(app);

const ui = new firebaseui.auth.AuthUI(auth);

ui.start('#firebaseui-auth-container', {
    signInOptions: [
        'password'
    ],
    callbacks: {
        signInSuccessWithAuthResult: async (authResult) => {
            const user = authResult.user;
            const isNewUser = authResult.additionalUserInfo.isNewUser;

            try {
                if (isNewUser) {
                    // Log user into Firestore with async/await
                    await setDoc(doc(db, 'users', user.uid), {
                        name: user.displayName || 'Anonymous', // Fallback if displayName is null
                        email: user.email, // Add email since it's available
                        createdAt: Date.now() // Optional timestamp
                    });
                    console.log(`New user ${user.uid} added to Firestore`);
                } else {
                    console.log(`Existing user ${user.uid} signed in`);
                }
                // Redirect only after Firestore operation completes
                window.location.assign('/webapp.html');
            } catch (error) {
                console.error('Error adding user to Firestore:', error);
                // Redirect even on error, or handle differently
                window.location.assign('/webapp.html');
            }

            return false; // Prevent FirebaseUI default redirect
        },
        signInFailure: (error) => {
            console.error('Sign-in failed:', error);
            return Promise.resolve();
        }
    }
});