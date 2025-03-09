import { app, db, auth } from "/src/firebase.js";
import {
    collection,
    getDocs,
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
        querySnapshot.forEach((docSnapshot) => {
            const data = docSnapshot.data();
            if (data.userId === user.uid) {
                const div = document.createElement('div');
                div.className = 'item';
                div.innerHTML = `
                    <strong>${data.name}</strong>
                    <p>${data.description || ''}</p>
                `;
                const editButton = document.createElement('button');
                editButton.textContent = 'Edit';
                editButton.addEventListener('click', () => updateItem(docSnapshot.id));

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
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

// Add new item
async function addItem() {
    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const user = auth.currentUser;

    if (!user) {
        console.error("No user signed in");
        return;
    }

    try {
        await addDoc(collection(db, 'items'), {
            name: name,
            description: description,
            userId: user.uid,
            timestamp: serverTimestamp()
        });
        document.getElementById('name').value = '';
        document.getElementById('description').value = '';
        await renderItems();
    } catch (error) {
        console.error("Error adding item: ", error);
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
        }
    }
}

// Initial render and setup
renderItems();
onSnapshot(collection(db, 'items'), (snapshot) => {
    renderItems();
});

// Add event listener for the "Add Item" button
document.getElementById('addItemButton').addEventListener('click', addItem);