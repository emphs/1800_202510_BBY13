// readmore.js
import { auth, db } from './firebase.js';
import { doc, getDoc, updateDoc, arrayUnion, onSnapshot } from 'firebase/firestore';

// Dynamically import Bootstrap CSS (already in your code)
const bootstrapCSS = document.createElement('link');
bootstrapCSS.rel = 'stylesheet';
bootstrapCSS.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css';
bootstrapCSS.integrity = 'sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN';
bootstrapCSS.crossOrigin = 'anonymous';
document.head.appendChild(bootstrapCSS);

// Import custom CSS
const customCSS = document.createElement('link');
customCSS.rel = 'stylesheet';
customCSS.href = '/src/styles/readmore.css';
document.head.appendChild(customCSS);

// Get item ID from URL
const urlParams = new URLSearchParams(window.location.search);
const itemId = urlParams.get('itemId');

async function loadItemDetails() {
    if (!itemId) {
        document.getElementById('item-id').textContent = 'Not specified';
        document.getElementById('item-description').textContent = 'No item selected';
        document.getElementById('item-name').textContent = 'Error';
        return;
    }

    try {
        const itemDocRef = doc(db, 'items', itemId);
        const itemDoc = await getDoc(itemDocRef);

        if (itemDoc.exists()) {
            const itemData = itemDoc.data();
            document.getElementById('item-name').textContent = itemData.name || 'Unnamed Item';
            document.getElementById('item-id').textContent = itemId;
            document.getElementById('item-description').textContent = itemData.description || 'No description';

            // Add UserName above Item ID
            const userNameElement = document.createElement('p');
            userNameElement.innerHTML = `<strong>UserName:</strong> ${itemData.userName || 'None'}`;
            const itemIdElement = document.getElementById('item-id').parentElement;
            itemIdElement.parentElement.insertBefore(userNameElement, itemIdElement);
        } else {
            document.getElementById('item-description').textContent = 'Item not found';
        }
    } catch (error) {
        console.error('Error loading item:', error);
        document.getElementById('item-description').textContent = 'Error loading item';
    }
}

function renderComments(comments) {
    const commentsContainer = document.getElementById('comments-container');
    commentsContainer.innerHTML = '';

    if (!comments || comments.length === 0) {
        commentsContainer.innerHTML = '<p>No comments yet.</p>';
        return;
    }

    comments.forEach(comment => {
        const commentDiv = document.createElement('div');
        commentDiv.className = 'comment mb-2 p-2 border rounded';
        commentDiv.innerHTML = `
            <strong>${comment.username}</strong>
            <p class="mb-0">${comment.text}</p>
            <small class="text-muted">${new Date(comment.timestamp).toLocaleString()}</small>
        `;
        commentsContainer.appendChild(commentDiv);
    });
}

async function addComment() {
    const user = auth.currentUser;
    if (!user) {
        alert('Please log in to comment');
        window.location.assign('/dashboard.html');
        return;
    }

    const commentText = document.getElementById('comment-input').value.trim();
    if (!commentText) {
        alert('Please enter a comment');
        return;
    }

    try {
        const itemDocRef = doc(db, 'items', itemId);
        const comment = {
            username: user.displayName || user.email.split('@')[0],
            text: commentText,
            timestamp: Date.now()
        };

        await updateDoc(itemDocRef, {
            comments: arrayUnion(comment)
        });

        document.getElementById('comment-input').value = '';
    } catch (error) {
        console.error('Error adding comment:', error);
        alert('Failed to add comment: ' + error.message);
    }
}

function setupCommentsListener() {
    if (!itemId) return;

    const itemDocRef = doc(db, 'items', itemId);
    onSnapshot(itemDocRef, (doc) => {
        if (doc.exists()) {
            const itemData = doc.data();
            renderComments(itemData.comments);
        }
    }, (error) => {
        console.error('Error in comments listener:', error);
    });
}

function setupListeners() {
    document.getElementById('back-to-webapp').addEventListener('click', () => {
        window.location.href = '/webapp.html';
    });

    document.getElementById('submit-comment').addEventListener('click', addComment);
}

function init() {
    auth.onAuthStateChanged((user) => {
        if (!user) {
            document.getElementById('comment-input').disabled = true;
            document.getElementById('submit-comment').disabled = true;
            loadItemDetails();
            setupCommentsListener();
        } else {
            document.getElementById('comment-input').disabled = false;
            document.getElementById('submit-comment').disabled = false;
            loadItemDetails();
            setupCommentsListener();
            setupListeners();
        }
    });
}

init();