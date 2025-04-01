// Import Firebase instances from the API file
import { auth, db } from './firebase.js';
import { doc, getDoc } from 'firebase/firestore';

// Function to format date
function formatDate(timestamp) {
    if (!timestamp) return 'N/A';
    
    // If timestamp is already a number (milliseconds), directly create a Date object
    const date = new Date(timestamp);  // This converts the milliseconds to a Date object
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date);
}

// Function to update profile information
function updateProfileInfo(user, userData) {
    console.log("updating profile info:", userData);
    
    // profile picture
    const profilePic = document.getElementById('profile-picture');
    const loadingIndicator = document.getElementById('profile-loading');
    
    if (profilePic) {
        if (loadingIndicator) loadingIndicator.style.display = 'block';
        
        // Create a new image object to preload
        const img = new Image();
        img.onload = function() {
            profilePic.src = this.src;
            if (loadingIndicator) loadingIndicator.style.display = 'none';
        };
        img.onerror = function() {
            profilePic.src = '../../images/default-avatar.svg';
            if (loadingIndicator) loadingIndicator.style.display = 'none';
        };
        img.src = userData.photoURL || '../../images/default-avatar.svg';
    }

    // name and bio
    const userName = document.getElementById('user-name');
    if (userName) {
        userName.textContent = `${userData.name}`.trim() || 'Anonymous User';
    }

    const bioShort = document.getElementById('user-bio-short');
    if (bioShort) {
        bioShort.textContent = userData.title || '';
    }

    const bio = document.getElementById('user-bio');
    if (bio) {
        bio.textContent = userData.bio || 'No bio available';
    }

    // contact info
    const joinDate = document.getElementById('join-date');
    if (joinDate) {
        joinDate.textContent = formatDate(userData.createdAt) || 'N/A';  // updated to use create_at field
    }

    const location = document.getElementById('user-location');
    if (location) {
        location.textContent = userData.location || 'Not specified';
    }
    
    const userEmail = document.getElementById('user-email');
    if (userEmail) {
        userEmail.textContent = userData.email || user.email;
        userEmail.href = `mailto:${userData.email || user.email}`;
    }
    
    const phone = document.getElementById('user-phone');
    if (phone) {
        phone.textContent = userData.phone || 'Not specified';
    }
}

// Fetch user data from Firestore
async function getUserData(userId) {
    try {
        const userDocRef = doc(db, 'users', userId);
        const docSnapshot = await getDoc(userDocRef);
        if (docSnapshot.exists()) {
            return docSnapshot.data();
        } else {
            console.log("No such document!");
            return null;
        }
    } catch (error) {
        console.error("Error getting user data:", error);
        return null;
    }
}

// handle signing out
async function handleSignOut() {
    try {
        await auth.signOut();
        console.log("Signed out successfully");
        localStorage.removeItem('loggedInUserId'); // Clear stored user ID
        window.location.href = 'dashboard.html';
    } catch (error) {
        console.error('Error signing out:', error);
        alert('Error signing out. Please try again.');
    }
}

// Initialize the page
async function initializePage() {
    try {
        console.log("Initializing page...");
        
        // Set up sign out button
        const signOutBtn = document.getElementById('signOutBtn');
        if (signOutBtn) {
            console.log("Found sign out button, adding click handler");
            signOutBtn.addEventListener('click', handleSignOut);
        } else {
            console.error("Couldn't find sign out button");
            throw new Error("Sign out button not found");
        }

        // Check if user is logged in
        const user = auth.currentUser;
        if (user) {
            console.log("User is logged in:", user.email);
            const userData = await getUserData(user.uid);  // Use the updated getUserData function
            if (userData) {
                updateProfileInfo(user, userData);
            }
        } else {
            console.log("No user logged in, waiting for auth state change");
        }
    } catch (error) {
        console.error("Error initializing page:", error);
    }
}

// Listen for authentication state changes
auth.onAuthStateChanged(async (user) => {
    console.log("Auth state changed:", user ? "logged in" : "logged out");
    
    if (user) {
        try {
            const userData = await getUserData(user.uid);  // Use the updated getUserData function
            if (userData) {
                updateProfileInfo(user, userData);
            }
        } catch (error) {
            console.error('Error loading user data:', error);
            alert('Failed to load profile data. Please refresh the page.');
        }
    } else {
        console.log("No user logged in, redirecting to login page");
        window.location.href = 'dashboard.html';
    }
});

// Initialize when the DOM is ready
document.addEventListener('DOMContentLoaded', initializePage);
