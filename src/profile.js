// Initialize Firebase Authentication and Firestore
const auth = firebase.auth();
const db = firebase.firestore();

// Handle profile picture upload
document.getElementById('profile-upload').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file) {
        const storageRef = firebase.storage().ref();
        const fileRef = storageRef.child(`profile-pictures/${auth.currentUser.uid}`);
        
        try {
            await fileRef.put(file);
            const photoURL = await fileRef.getDownloadURL();
            await auth.currentUser.updateProfile({ photoURL });
            document.getElementById('profile-picture').src = photoURL;
            
            // Update user document in Firestore
            await db.collection('users').doc(auth.currentUser.uid).update({
                photoURL: photoURL
            });
        } catch (error) {
            console.error("Error uploading profile picture:", error);
            alert("Failed to upload profile picture. Please try again.");
        }
    }
});

// Load user data when page loads
document.addEventListener('DOMContentLoaded', async () => {
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            try {
                const doc = await db.collection('users').doc(user.uid).get();
                const userData = doc.data();
                
                if (userData) {
                    // Fill form with user data
                    document.querySelector('input[placeholder="First Name"]').value = userData.firstName || '';
                    document.querySelector('input[placeholder="Last Name"]').value = userData.lastName || '';
                    document.querySelector('input[type="email"]').value = userData.email || user.email;
                    document.querySelector('textarea').value = userData.bio || '';
                    
                    // Fill social media links
                    document.querySelector('input[placeholder="Twitter profile URL"]').value = userData.twitter || '';
                    document.querySelector('input[placeholder="LinkedIn profile URL"]').value = userData.linkedin || '';
                    document.querySelector('input[placeholder="GitHub profile URL"]').value = userData.github || '';
                    document.querySelector('input[placeholder="Instagram profile URL"]').value = userData.instagram || '';
                    
                    // Set profile picture
                    if (userData.photoURL) {
                        document.getElementById('profile-picture').src = userData.photoURL;
                    }
                }
            } catch (error) {
                console.error("Error loading user data:", error);
                alert("Failed to load profile data. Please refresh the page.");
            }
        } else {
            window.location.href = 'login.html';
        }
    });
});

// Handle form submission
document.querySelector('form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const user = auth.currentUser;
    if (!user) return;

    const updateData = {
        firstName: document.querySelector('input[placeholder="First Name"]').value,
        lastName: document.querySelector('input[placeholder="Last Name"]').value,
        email: document.querySelector('input[type="email"]').value,
        bio: document.querySelector('textarea').value,
        twitter: document.querySelector('input[placeholder="Twitter profile URL"]').value,
        linkedin: document.querySelector('input[placeholder="LinkedIn profile URL"]').value,
        github: document.querySelector('input[placeholder="GitHub profile URL"]').value,
        instagram: document.querySelector('input[placeholder="Instagram profile URL"]').value,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    try {
        // Update profile in Firestore
        await db.collection('users').doc(user.uid).update(updateData);
        
        // Update email in Firebase Auth if changed
        if (updateData.email !== user.email) {
            await user.updateEmail(updateData.email);
        }
        
        // Handle password change if new password is provided
        const newPassword = document.querySelector('input[placeholder="New Password"]').value;
        const confirmPassword = document.querySelector('input[placeholder="Confirm New Password"]').value;
        const currentPassword = document.querySelector('input[placeholder="Current Password"]').value;
        
        if (newPassword && confirmPassword && currentPassword) {
            if (newPassword !== confirmPassword) {
                throw new Error("New passwords don't match");
            }
            
            // Reauthenticate before changing password
            const credential = firebase.auth.EmailAuthProvider.credential(
                user.email,
                currentPassword
            );
            await user.reauthenticateWithCredential(credential);
            await user.updatePassword(newPassword);
        }
        
        alert("Profile updated successfully!");
        window.location.href = 'profile.html';
    } catch (error) {
        console.error("Error updating profile:", error);
        alert("Error updating profile: " + error.message);
    }
}); 