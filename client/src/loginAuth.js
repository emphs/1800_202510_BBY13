import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import * as firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';

const config = { apiKey: "AIzaSyAMd6uOBKNaq7VjK5rAM5VDBiD3gh6kgR8",
    authDomain: "aa-5607f.firebaseapp.com",
    databaseURL: "https://aa-5607f.firebaseio.com",
    projectId: "aa-5607f",
    storageBucket: "aa-5607f.firebasestorage.app",
    messagingSenderId: "87623476991",
    appId: "1:87623476991:web:bbfaf8e049cdadd0e7ceca",
    measurementId: "G-784Z8S5HZ2" };

const app = initializeApp(config);
const auth = getAuth(app);
const db = getFirestore(app);

const ui = new firebaseui.auth.AuthUI(auth);

ui.start('#firebaseui-auth-container', {
    signInOptions: [
        'password'
    ],
    callbacks: {
        signInSuccessWithAuthResult: (authResult) => {
            const user = authResult.user;
            if (authResult.additionalUserInfo.isNewUser) {
                setDoc(doc(db, 'users', user.uid), { name: user.displayName });
                //TO-DO! Resolve the promise and use the miracle Async function to log users into Dbase

            }
            window.location.assign('/webapp.html');
            return false;
        }
    }
});



















// import firebase from 'firebase/compat/app'; // Compat layer
// import 'firebase/compat/auth'; // Compat auth for Firebase UI
// import * as firebaseui from 'firebaseui'; // Firebase UI
// import {firebaseConfig} from "/src/firebase.js";
//
// const app = firebase.initializeApp(firebaseConfig);
// const ui = new firebaseui.auth.AuthUI(firebase.auth());
//
// const uiConfig = {
//     callbacks: {
//         signInSuccessWithAuthResult: function (authResult, redirectUrl) {
//             const user = authResult.user;
//             if (authResult.additionalUserInfo.isNewUser) {
//                 db.collection("users").doc(user.uid).set({
//                     name: user.displayName,
//                     email: user.email,
//                     country: "Canada",
//                 }).then(function () {
//                     console.log("New user added to firestore");
//                     window.location.assign("webapp.html");
//                 }).catch(function (error) {
//                     console.log("Error adding new user: " + error);
//                 });
//             } else {
//                 return true;
//             }
//             return false;
//         }
//     },
//     // Move uiShown outside of callbacks
//     uiShown: function () {
//         // The widget is rendered, hide the loader
//         document.getElementById('loader').style.display = 'none';
//     },
//     signInFlow: 'popup',
//     signInSuccessUrl: 'webapp.html',
//     signInOptions: [
//         // Uncomment the providers you want to use
//         firebase.auth.EmailAuthProvider.PROVIDER_ID,
//     ],
//     tosUrl: '<your-tos-url>',
//     privacyPolicyUrl: '<your-privacy-policy-url>'
// };
//
// // Start the FirebaseUI widget
// ui.start('#firebaseui-auth-container', uiConfig);