import { app, db, auth } from "/src/firebase.js";
import {
    collection,
    getDocs,
    getDoc,
    addDoc,
    doc,
    updateDoc,
    deleteDoc,
    onSnapshot,
    serverTimestamp
} from 'firebase/firestore';

// Function to render items
async function renderItems() {
    const itemsList = document.getElementById('itemsList');
    itemsList.innerHTML = '<h2>Items</h2>';
    const user = auth.currentUser;

    if (!user) {
        itemsList.innerHTML += '<p>Please sign in to view items</p>';
        return;
    }

    try {
        const querySnapshot = await getDocs(collection(db, 'items'));
        itemsList.innerHTML = '<h2>Items</h2>';
        querySnapshot.forEach((docSnapshot) => {
            const data = docSnapshot.data();
            if (data.userId === user.uid) {
                const div = document.createElement('div');
                div.className = 'item mb-3 p-2 border';
                div.innerHTML = `
                    <strong>${data.name}</strong>
                    <p>${data.description || ''}</p>
                `;
                const editButton = document.createElement('button');
                editButton.textContent = 'Edit';
                editButton.className = 'btn btn-sm btn-primary me-2';
                editButton.addEventListener('click', () => updateItem(docSnapshot.id));

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.className = 'btn btn-sm btn-danger';
                deleteButton.addEventListener('click', () => deleteItem(docSnapshot.id));

                div.appendChild(editButton);
                div.appendChild(deleteButton);
                itemsList.appendChild(div);
            }
        });
    } catch (error) {
        console.error("Error getting items: ", error);
    }
}

// Function to render bookmarked items
async function renderBookmarkedItems() {
    const bookmarkedItemsContainer = document.getElementById('bookmarked-items');
    bookmarkedItemsContainer.innerHTML = '';
    const user = auth.currentUser;

    if (!user) return;

    try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            const userData = userDoc.data();
            const bookmarks = userData.bookmarks || [];

            if (bookmarks.length === 0) {
                bookmarkedItemsContainer.innerHTML = '<p>No bookmarked items yet.</p>';
                return;
            }

            bookmarkedItemsContainer.innerHTML = ''; // Clear previous items
            for (const itemId of bookmarks) {
                const itemDoc = await getDoc(doc(db, 'items', itemId));
                if (itemDoc.exists()) {
                    const itemData = itemDoc.data();
                    const div = document.createElement('div');
                    div.className = 'item mb-3 p-2 border';
                    div.innerHTML = `
                        <strong>${itemData.name}</strong>
                        <p>${itemData.description || ''}</p>
                    `;
                    bookmarkedItemsContainer.appendChild(div);
                } else {
                    console.warn(`Item ${itemId} not found in 'items' collection`);
                }
            }
        } else {
            bookmarkedItemsContainer.innerHTML = '<p>No bookmarks available.</p>';
        }
    } catch (error) {
        console.error("Error fetching bookmarked items: ", error);
        bookmarkedItemsContainer.innerHTML = '<p>Error loading bookmarks.</p>';
    }
}

// Add new item
async function addItem() {
    const name = document.getElementById('item-name').value;
    const description = document.getElementById('description').value;
    const user = auth.currentUser;

    if (!user) {
        console.error("No user signed in");
        return;
    }

    if (!name) {
        alert("Please enter a name");
        return;
    }

    try {
        await addDoc(collection(db, 'items'), {
            name: name,
            description: description,
            userId: user.uid,
            timestamp: serverTimestamp()
        });
        document.getElementById('item-name').value = '';
        document.getElementById('description').value = '';
        await renderItems();
    } catch (error) {
        console.error("Error adding item: ", error);
        alert("Failed to add item: " + error.message);
    }
}

// Update item
async function updateItem(id) {
    const newName = prompt('Enter new name:');
    const newDescription = prompt('Enter new description:');
    const user = auth.currentUser;

    if (!user) {
        console.error("No user signed in");
        return;
    }

    if (newName) {
        try {
            await updateDoc(doc(db, 'items', id), {
                name: newName,
                description: newDescription || '',
                userId: user.uid,
                timestamp: serverTimestamp()
            });
            await renderItems();
        } catch (error) {
            console.error("Error updating item: ", error);
            alert("Failed to update item: " + error.message);
        }
    }
}

// Delete item
async function deleteItem(id) {
    const user = auth.currentUser;

    if (!user) {
        console.error("No user signed in");
        return;
    }

    if (confirm('Are you sure you want to delete this item?')) {
        try {
            await deleteDoc(doc(db, 'items', id));
            await renderItems();
        } catch (error) {
            console.error("Error deleting item: ", error);
            alert("Failed to delete item: " + error.message);
        }
    }
}

// Setup dashboard with real-time listeners
function setupDashboard() {
    const user = auth.currentUser;
    if (!user) return;

    // Initial render
    renderItems();
    renderBookmarkedItems();

    // Real-time listeners
    const unsubscribeItems = onSnapshot(collection(db, 'items'), () => {
        renderItems();
    });
    const unsubscribeBookmarks = onSnapshot(doc(db, 'users', user.uid), () => {
        renderBookmarkedItems();
    });

    // Add event listeners only when user is signed in
    document.getElementById('addItemButton').addEventListener('click', addItem);
    document.getElementById('nav-web-app').addEventListener('click', () => {
        window.location.assign('/webapp.html');
    });

    return () => {
        unsubscribeItems();
        unsubscribeBookmarks();
    };
}

// Initialize dashboard
let unsubscribe = null;
function init() {
    auth.onAuthStateChanged((user) => {
        if (user) {
            if (unsubscribe) unsubscribe();
            unsubscribe = setupDashboard();
        } else {
            if (unsubscribe) {
                unsubscribe();
                unsubscribe = null;
            }
            document.getElementById('loaded').classList.remove('hidden');
            document.getElementById('loading').classList.add('hidden');
            document.getElementById('user-signed-in').classList.add('hidden');
            document.getElementById('user-signed-out').classList.remove('hidden');
        }
    });

    // Check initial auth state and render immediately if signed in
    if (auth.currentUser) {
        if (unsubscribe) unsubscribe();
        unsubscribe = setupDashboard();
    }
}

// Start the application
init();