import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';


import {  doc, setDoc } from 'firebase/firestore';
import * as firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';
import { db, auth} from "./firebase.js";



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