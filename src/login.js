// login.js
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import * as firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';
import { db, auth } from "./firebase.js";

function getUiConfig() {
    return {
        'callbacks': {
            'signInSuccessWithAuthResult': async (authResult, redirectUrl) => {
                const user = authResult.user;

                console.log('Sign-in result:', { uid: user.uid });

                if (user) {
                    handleSignedInUser(user);

                    // Wait briefly to ensure auth state syncs
                    await new Promise(resolve => setTimeout(resolve, 1000));

                    const userDocRef = doc(db, 'users', user.uid);
                    const userDoc = await getDoc(userDocRef);
                    if (!userDoc.exists()) {
                        try {
                            console.log('Auth state before setDoc:', auth.currentUser?.uid);
                            await setDoc(userDocRef, {
                                name: user.displayName || 'None',
                                posts: [],
                                email: user.email,
                                email_verified: user.emailVerified,
                                cellphone: user.phoneNumber || null,
                                provider: authResult.additionalUserInfo?.providerId || 'unknown',
                                created_at: serverTimestamp(),
                                last_login_at: serverTimestamp(),
                            }, { merge: true });

                            console.log(`User ${user.uid} successfully added to Firestore`);
                        } catch (error) {
                            console.error('Error adding user to Firestore:', error);
                        }
                    } else {
                        console.log(`User ${user.uid} already exists in Firestore`);
                    }
                }

                return false; // Prevent redirect
            },
        },
        'signInFlow': 'popup',
        'signInOptions': [
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            firebase.auth.FacebookAuthProvider.PROVIDER_ID,
            firebase.auth.TwitterAuthProvider.PROVIDER_ID,
            firebase.auth.GithubAuthProvider.PROVIDER_ID,
            firebase.auth.EmailAuthProvider.PROVIDER_ID,
            'microsoft.com',
            'apple.com',
            firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
        ],
        'tosUrl': 'https://www.google.com',
        'privacyPolicyUrl': 'https://#',
    };
}

let ui = new firebaseui.auth.AuthUI(firebase.auth());
ui.disableAutoSignIn();

function getWidgetUrl() {
    return '/widget#recaptcha=' + getRecaptchaMode() + '&emailSignInMethod=' +
        getEmailSignInMethod() + '&disableEmailSignUpStatus=' +
        getDisableSignUpStatus() + '&adminRestrictedOperationStatus=' +
        getAdminRestrictedOperationStatus();
}

let handleSignedInUser = function(user) {
    document.getElementById('user-signed-in').style.display = 'block';
    document.getElementById('user-signed-out').style.display = 'none';
    document.getElementById('user-name').textContent = user.displayName || 'User';
    document.getElementById('email').textContent = user.email;
};

let handleSignedOutUser = function() {
    document.getElementById('user-signed-in').style.display = 'none';
    document.getElementById('user-signed-out').style.display = 'block';
    ui.start('#firebaseui-container', getUiConfig());
};

firebase.auth().onAuthStateChanged(function(user) {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('loaded').style.display = 'block';
    user ? handleSignedInUser(user) : handleSignedOutUser();
});

let deleteAccount = function() {
    firebase.auth().currentUser.delete().catch(function(error) {
        if (error.code == 'auth/requires-recent-login') {
            firebase.auth().signOut().then(function() {
                setTimeout(function() {
                    alert('Please sign in again to delete your account.');
                }, 1);
            });
        }
    });
};

window.addEventListener('load', () => {
    document.getElementById('sign-out-mobile').addEventListener('click', function() {
        firebase.auth().signOut();
    });
    document.getElementById('delete-account-mobile').addEventListener('click', function() {
        deleteAccount();
    });
    document.getElementById('nav-web-app-mobile').addEventListener('click', function() {
        window.location.assign('/webapp');
    });
});