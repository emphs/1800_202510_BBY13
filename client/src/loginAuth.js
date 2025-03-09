import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import firebase from 'firebase/compat/app'; // Compat layer
import 'firebase/compat/auth'; // Compat auth for Firebase UI
import * as firebaseui from 'firebaseui'; // Firebase UI
import {firebaseConfig} from "/src/firebase.js";

const app = firebase.initializeApp(firebaseConfig);
const ui = new firebaseui.auth.AuthUI(firebase.auth());

const uiConfig = {
    callbacks: {
        signInSuccessWithAuthResult: function (authResult, redirectUrl) {
            const user = authResult.user;
            if (authResult.additionalUserInfo.isNewUser) {
                db.collection("users").doc(user.uid).set({
                    name: user.displayName,
                    email: user.email,
                    country: "Canada",
                }).then(function () {
                    console.log("New user added to firestore");
                    window.location.assign("webapp.html");
                }).catch(function (error) {
                    console.log("Error adding new user: " + error);
                });
            } else {
                return true;
            }
            return false;
        }
    },
    // Move uiShown outside of callbacks
    uiShown: function () {
        // The widget is rendered, hide the loader
        document.getElementById('loader').style.display = 'none';
    },
    signInFlow: 'popup',
    signInSuccessUrl: 'webapp.html',
    signInOptions: [
        // Uncomment the providers you want to use
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
    ],
    tosUrl: '<your-tos-url>',
    privacyPolicyUrl: '<your-privacy-policy-url>'
};

// Start the FirebaseUI widget
ui.start('#firebaseui-auth-container', uiConfig);