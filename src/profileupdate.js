// grab what we need from firebase
import { auth, db } from './firebase.js';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

// shows feedback messages to the user
function showMessage(message, type = 'info') {
    const messageDiv = document.getElementById('updateMessage');
    messageDiv.className = `alert alert-${type} mt-3`;
    messageDiv.style.display = 'block';
    messageDiv.textContent = message;
    
    if (type === 'success') {
        setTimeout(() => {
            window.location.href = 'profile.html';
        }, 1500);
    }
}

let newPhotoURL = null; // Store new photoURL temporarily

// fills the form with user's existing data
async function loadUserData(user) {
    try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        const userData = userDoc.data();

        if (userData) {
            document.getElementById('name').value = userData.name || '';
            document.getElementById('email').value = userData.email || user.email;
            document.getElementById('title').value = userData.title || '';
            document.getElementById('bio').value = userData.bio || '';
            document.getElementById('phone').value = userData.phone || '';
            document.getElementById('location').value = userData.location || '';

            const profilePicture = document.getElementById('profile-picture');
            if (profilePicture) {
                profilePicture.src = userData.photoURL || '../../images/default-avatar.svg';
                profilePicture.onerror = () => {
                    profilePicture.src = 'https://bootdey.com/img/Content/avatar/avatar1.png';
                };
            }
        }
    } catch (error) {
        console.error('Error loading user data:', error);
        showMessage('Failed to load profile data. Please refresh the page.', 'danger');
    }
}

// handles compressing and previewing a new profile picture
async function previewProfilePicture(file) {
    if (!file) return;
    
    try {
        if (!file.type.startsWith('image/')) {
            throw new Error('Please select an image file');
        }

        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            throw new Error('Image size should be less than 5MB');
        }

        const compressImage = (imgFile, maxWidth, maxHeight, quality) => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(imgFile);
                reader.onload = (event) => {
                    const img = new Image();
                    img.src = event.target.result;
                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        let width = img.width;
                        let height = img.height;

                        if (width > height) {
                            if (width > maxWidth) {
                                height = Math.round((height * maxWidth) / width);
                                width = maxWidth;
                            }
                        } else {
                            if (height > maxHeight) {
                                width = Math.round((width * maxHeight) / height);
                                height = maxHeight;
                            }
                        }

                        canvas.width = width;
                        canvas.height = height;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0, width, height);

                        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
                        resolve(compressedBase64);
                    };
                };
            });
        };

        newPhotoURL = await compressImage(file, 400, 400, 0.7);

        document.getElementById('profile-picture').src = newPhotoURL;
    } catch (error) {
        console.error('Error previewing profile picture:', error);
        showMessage(error.message || 'Error previewing profile picture', 'danger');
    }
}

// saves all profile changes, including the profile picture
async function saveProfile(event) {
    event.preventDefault();
    const user = auth.currentUser;
    if (!user) {
        showMessage('Please log in to update your profile.', 'danger');
        return;
    }

    try {
        const updateData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            title: document.getElementById('title').value,
            bio: document.getElementById('bio').value,
            phone: document.getElementById('phone').value,
            location: document.getElementById('location').value,
            updatedAt: serverTimestamp()
        };

        if (newPhotoURL) {
            updateData.photoURL = newPhotoURL;
        }

        if (updateData.email !== user.email) {
            await user.updateEmail(updateData.email);
        }

        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const currentPassword = document.getElementById('currentPassword').value;

        if (newPassword || confirmPassword || currentPassword) {
            if (newPassword !== confirmPassword) {
                throw new Error("New passwords don't match");
            }
            if (!currentPassword) {
                throw new Error("Current password is required to change password");
            }

            const credential = firebase.auth.EmailAuthProvider.credential(
                user.email,
                currentPassword
            );
            await user.reauthenticateWithCredential(credential);
            if (newPassword) {
                await user.updatePassword(newPassword);
            }
        }

        await updateDoc(doc(db, 'users', user.uid), updateData);
        showMessage('Profile updated! Redirecting...', 'success');
    } catch (error) {
        console.error('Error updating profile:', error);
        showMessage(error.message || 'Error updating profile', 'danger');
    }
}

// Set up event listeners when the page loads
document.addEventListener('DOMContentLoaded', () => {
    auth.onAuthStateChanged((user) => {
        if (user) {
            loadUserData(user);
            
            const profileUpload = document.getElementById('profile-upload');
            const profilePicture = document.getElementById('profile-picture');
            
            if (profileUpload && profilePicture) {
                profilePicture.addEventListener('click', () => {
                    profileUpload.click();
                });

                profileUpload.addEventListener('change', async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                        await previewProfilePicture(file);
                    }
                });
            }

            const profileForm = document.getElementById('profile-form');
            if (profileForm) {
                profileForm.addEventListener('submit', saveProfile);
            }
        } else {
            window.location.href = 'login.html';
        }
    });
});
