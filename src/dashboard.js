// dashboard.js
import { app, db, auth } from "./firebase.js";
import {
    collection,
    getDocs,
    getDoc,
    addDoc,
    doc,
    updateDoc,
    deleteDoc,
    onSnapshot,
    serverTimestamp,
    arrayRemove
} from 'firebase/firestore';

// Note: Add SweetAlert2 via CDN in your HTML (see below), no import needed for CDN approach

async function migratePost() {
    const user = auth.currentUser;
    if (!user) {
        alert("Please sign in to migrate posts");
        return;
    }

    try {
        const querySnapshot = await getDocs(collection(db, 'items'));
        const updates = [];

        querySnapshot.forEach((docSnapshot) => {
            const data = docSnapshot.data();
            if (data.userId === user.uid) {
                updates.push(updateDoc(docSnapshot.ref, {
                    userName: user.displayName || 'None',
                    lastModified: serverTimestamp()
                }));
            }
        });
        await Promise.all(updates);
        alert(`Migrated ${updates.length} posts`);
        renderItems();
    } catch (error) {
        console.error("Error migrating posts: ", error);
        alert("Migration failed: " + error.message);
    }
}

async function renderItems() {
    const itemsList = document.getElementById('itemsList');
    itemsList.innerHTML = '<h5 class="card-title">Your Created Items</h5>';
    const user = auth.currentUser;

    if (!user) {
        itemsList.innerHTML += '<p>Please sign in to view items</p>';
        return;
    }

    try {
        const querySnapshot = await getDocs(collection(db, 'items'));
        let hasItems = false;
        querySnapshot.forEach((docSnapshot) => {
            const data = docSnapshot.data();
            if (data.userId === user.uid) {
                hasItems = true;
                const div = document.createElement('div');
                div.className = 'item mb-3 p-2 border';
                div.innerHTML = `
                    <strong>${data.name}</strong>
                    <p>${data.description || ''}</p>
                    <small class="text-muted">Posted by: ${data.userName || 'None'}</small>
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
        if (!hasItems) {
            itemsList.innerHTML += '<p>No items created yet.</p>';
        }
    } catch (error) {
        console.error("Error getting items: ", error);
        itemsList.innerHTML += '<p>Error loading items.</p>';
    }
}

async function removeBookmark(itemId) {
    const user = auth.currentUser;
    if (!user) return;

    try {
        const userDocRef = doc(db, 'users', user.uid);
        await updateDoc(userDocRef, {
            bookmarks: arrayRemove(itemId)
        });
    } catch (error) {
        console.error("Error removing bookmark: ", error);
        alert("Failed to remove bookmark: " + error.message);
    }
}

async function renderBookmarkedItems() {
    const bookmarkedItemsContainer = document.getElementById('bookmarked-items');
    const contentDiv = bookmarkedItemsContainer.querySelector('.card-body');
    const title = contentDiv.querySelector('.card-title');
    contentDiv.innerHTML = '';
    contentDiv.appendChild(title);
    const user = auth.currentUser;

    if (!user) return;

    try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            const userData = userDoc.data();
            const bookmarks = userData.bookmarks || [];

            if (bookmarks.length === 0) {
                contentDiv.innerHTML += '<p>No bookmarked items yet.</p>';
                return;
            }

            for (const itemId of bookmarks) {
                const itemDoc = await getDoc(doc(db, 'items', itemId));
                if (itemDoc.exists()) {
                    const itemData = itemDoc.data();
                    const div = document.createElement('div');
                    div.className = 'item mb-3 p-2 border';

                    const clickableContent = document.createElement('div');
                    clickableContent.className = 'clickable-content';
                    clickableContent.style.cursor = 'pointer';
                    clickableContent.innerHTML = `
                        <strong>${itemData.name}</strong>
                        <p>${itemData.description || ''}</p>
                        <small class="text-muted">Posted by: ${itemData.userName || 'None'}</small>
                    `;
                    clickableContent.addEventListener('click', (e) => {
                        if (e.target.tagName !== 'BUTTON') {
                            window.location.href = `/readmore.html?itemId=${itemId}`;
                        }
                    });

                    const deleteBookmarkButton = document.createElement('button');
                    deleteBookmarkButton.textContent = 'Delete Bookmark';
                    deleteBookmarkButton.className = 'btn btn-sm btn-warning mt-2';
                    deleteBookmarkButton.addEventListener('click', (e) => {
                        e.stopPropagation();
                        removeBookmark(itemId);
                    });

                    div.appendChild(clickableContent);
                    div.appendChild(deleteBookmarkButton);
                    contentDiv.appendChild(div);
                } else {
                    console.warn(`Item ${itemId} not found in 'items' collection`);
                }
            }
        } else {
            contentDiv.innerHTML += '<p>No bookmarks available.</p>';
        }
    } catch (error) {
        console.error("Error fetching bookmarked items: ", error);
        contentDiv.innerHTML += '<p>Error loading bookmarks.</p>';
    }
}

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
            userName: user.displayName || 'None',
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

async function updateItem(id) {
    const user = auth.currentUser;

    if (!user) {
        console.error("No user signed in");
        return;
    }

    // Fetch current item data to pre-fill the form
    const itemDoc = await getDoc(doc(db, 'items', id));
    if (!itemDoc.exists()) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Item not found!',
        });
        return;
    }
    const currentData = itemDoc.data();

    // Use SweetAlert2 to prompt for new name and description
    const { value: formValues } = await Swal.fire({
        title: 'Edit Item',
        html:
            '<input id="swal-input1" class="swal2-input" placeholder="New Name" value="' + (currentData.name || '') + '">' +
            '<textarea id="swal-input2" class="swal2-textarea" placeholder="New Description">' + (currentData.description || '') + '</textarea>',
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Save',
        preConfirm: () => {
            const newName = document.getElementById('swal-input1').value.trim();
            const newDescription = document.getElementById('swal-input2').value.trim();
            if (!newName) {
                Swal.showValidationMessage('Name is required');
                return false;
            }
            return [newName, newDescription];
        }
    });

    if (formValues) {
        const [newName, newDescription] = formValues;
        try {
            await updateDoc(doc(db, 'items', id), {
                name: newName,
                description: newDescription || '',
                userId: user.uid,
                userName: user.displayName || 'None',
                timestamp: serverTimestamp()
            });
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Item updated successfully!',
                timer: 1500,
                showConfirmButton: false
            });
            await renderItems();
        } catch (error) {
            console.error("Error updating item: ", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to update item: ' + error.message,
            });
        }
    }
}

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

function setupDashboard() {
    const user = auth.currentUser;
    if (!user) return;

    renderItems();
    renderBookmarkedItems();

    const unsubscribeItems = onSnapshot(collection(db, 'items'), () => {
        renderItems();
    });
    const unsubscribeBookmarks = onSnapshot(doc(db, 'users', user.uid), () => {
        renderBookmarkedItems();
    });

    document.getElementById('addItemButton').addEventListener('click', addItem);
    document.getElementById('nav-web-app-mobile').addEventListener('click', () => {
        window.location.assign('/webapp.html');
    });

    const migrateButton = document.getElementById('migrate-posts');
    if (migrateButton) {
        migrateButton.addEventListener('click', migratePost);
    }

    return () => {
        unsubscribeItems();
        unsubscribeBookmarks();
    };
}

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

    if (auth.currentUser) {
        if (unsubscribe) unsubscribe();
        unsubscribe = setupDashboard();
    }
}

init();