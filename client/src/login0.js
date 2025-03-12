/*
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the
 * License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * FirebaseUI initialization to be used in a Single Page application context.
 */

import {  doc, setDoc } from 'firebase/firestore';
import * as firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';
import { db, auth} from "./firebase.js";

function getUiConfig() {
    return {
        'callbacks': {
            // Called when the user has been successfully signed in.
            'signInSuccessWithAuthResult': async (authResult, redirectUrl) => {
                const user = authResult.user;
                const isNewUser = authResult.additionalUserInfo?.isNewUser;

                console.log(user)
                if (user) {
                    handleSignedInUser(user);
                }
                if (isNewUser) {
                    await setDoc(doc(db, 'users', user.uid), {
                        name: user.displayName || 'None',
                        email: user.email,
                        createdAt: Date.now()
                    });
                    console.log(`New user ${user.uid} added to Firestore`);

                }
                return false;
            }
        },
        // Opens IDP Providers sign-in flow in a popup.
        'signInFlow': 'popup',
        'signInOptions': [
            {
                provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                // Required to enable ID token credentials for this provider.
                clientId: CLIENT_ID
            },
            {
                provider: firebase.auth.FacebookAuthProvider.PROVIDER_ID,
                scopes :[
                    'public_profile',
                    'email',
                    'user_likes',
                    'user_friends'
                ]
            },
            firebase.auth.TwitterAuthProvider.PROVIDER_ID,
            firebase.auth.GithubAuthProvider.PROVIDER_ID,
            {
                provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
                // Whether the display name should be displayed in Sign Up page.
                requireDisplayName: true,
                signInMethod: "password", // "emailLink"
            },
            {
                provider: 'microsoft.com',
                loginHintKey: 'login_hint'
            },
            {
                provider: 'apple.com',
            },
            firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
        ],
        // Terms of service url.
        'tosUrl': 'https://www.google.com',
        // Privacy policy url.
        'privacyPolicyUrl': 'https://#',
        // 'credentialHelper': CLIENT_ID && CLIENT_ID != 'YOUR_OAUTH_CLIENT_ID' ?
        //     firebaseui.auth.CredentialHelper.GOOGLE_YOLO :
        //     firebaseui.auth.CredentialHelper.NONE,
        // 'adminRestrictedOperation': {
        //     status: 'false'
        // }
    };
}

// Initialize the FirebaseUI Widget using Firebase.
let ui = new firebaseui.auth.AuthUI(firebase.auth());
// Disable auto-sign in.
ui.disableAutoSignIn();


/**
 * @return {string} The URL of the FirebaseUI standalone widget.
 */
function getWidgetUrl() {
    return '/widget#recaptcha=' + getRecaptchaMode() + '&emailSignInMethod=' +
        getEmailSignInMethod() + '&disableEmailSignUpStatus=' +
        getDisableSignUpStatus() + '&adminRestrictedOperationStatus=' +
        getAdminRestrictedOperationStatus();
}

/**
 * Displays the UI for a signed in user.
 * @param {!firebase.User} user
 */
let handleSignedInUser = function(user) {
    document.getElementById('user-signed-in').style.display = 'block';
    document.getElementById('user-signed-out').style.display = 'none';
    document.getElementById('name').textContent = user.displayName;
    document.getElementById('email').textContent = user.email;
    document.getElementById('phone').textContent = user.phoneNumber;
};


/**
 * Displays the UI for a signed out user.
 */
let handleSignedOutUser = function() {
    document.getElementById('user-signed-in').style.display = 'none';
    document.getElementById('user-signed-out').style.display = 'block';
    ui.start('#firebaseui-container', getUiConfig());
};

// Listen to change in auth state so it displays the correct UI for when
// the user is signed in or not.
firebase.auth().onAuthStateChanged(function(user) {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('loaded').style.display = 'block';
    user ? handleSignedInUser(user) : handleSignedOutUser();
});

/**
 * Deletes the user's account.
 */
let deleteAccount = function() {
    firebase.auth().currentUser.delete().catch(function(error) {
        if (error.code == 'auth/requires-recent-login') {
            // The user's credential is too old. She needs to sign in again.
            firebase.auth().signOut().then(function() {
                // The timeout allows the message to be displayed after the UI has
                // changed to the signed out state.
                setTimeout(function() {
                    alert('Please sign in again to delete your account.');
                }, 1);
            });
        }
    });
};

window.addEventListener('load', () => {
    {
        document.getElementById('sign-out').addEventListener('click', function() {
            firebase.auth().signOut();
        });
        document.getElementById('delete-account').addEventListener('click', function() {
            deleteAccount();
        });
        document.getElementById('nav-web-app').addEventListener('click', function() {
            window.location.assign('/webapp.html');
        });
    }
});
