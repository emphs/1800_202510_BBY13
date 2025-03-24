import { app, db, auth } from "/src/firebase.js";
import {
    collection,
    getDocs,
    getDoc,
    addDoc,
    doc,
    updateDoc,
    arrayUnion,
    deleteDoc,
    onSnapshot,
    serverTimestamp
} from 'firebase/firestore';


async function pageUpdateBookmark(bookmarks) {

    console.log(bookmarks);

    if (bookmarks) {
        let cards = document.querySelectorAll('.item');

        cards.forEach(card => {
            let cStrong = card.querySelector('strong').textContent;

            let icon = card.querySelector('.bookmark-btn')?.querySelector('i');

            if (bookmarks.includes(cStrong)) {
                icon?.classList.add('text-warning')
            } else {
                icon?.classList.remove('text-warning');
                icon?.classList.remove('fa-star-filled');
            }

        });
    }
}

async function bookmarkOnclick(e) {

    const user = auth.currentUser;

    console.log(e)
    console.log(user)
    console.log(db)

    let userDoc = await getDoc(doc(db, "users", user.uid));

    console.log(userDoc)

    if (userDoc.exists) {
        let userData = userDoc.data();
        let bookmarks = userData.bookmark || [];

        let cardTitle = e.querySelector("strong").textContent;
        if (bookmarks.includes(cardTitle)) {
            bookmarks = bookmarks.filter(item => item !== cardTitle);
        } else {
            bookmarks.push(cardTitle);
        }

        console.log(bookmarks)
        await updateDoc(doc(db, 'users', user.uid), {
            bookmark: bookmarks
        });

        await pageUpdateBookmark(bookmarks);
    }
}


document.addEventListener('keydown', function (event) {
    if (event.key === 'a') {
        console.log(233)
        let item = document.createElement("div");
        item.classList.add("item");
        item.classList.add("mb-3");
        item.classList.add("p-2");
        item.classList.add("border");
        item.classList.add((Math.random() + 1).toString(36).substring(7));
        item.innerHTML = `
                <strong>dcwe</strong>
                <p>wqx</p>
                <button class="btn btn-sm btn-primary me-2">Edit</button>
                <button class="btn btn-sm btn-danger">Delete</button>
                <button class="btn btn-sm btn-light bookmark-btn">
                    <i class="fa fa-star" aria-hidden="true"></i>
                </button>
            `;

        item.querySelector('i').addEventListener('click', () => {
            bookmarkOnclick(item);
        });
        document.getElementById('itemsList').appendChild(item);
    }
});



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

// Setup real-time listener and initial render
function setupDashboard() {
    const user = auth.currentUser;
    if (user) {
        renderItems();
        const unsubscribe = onSnapshot(collection(db, 'items'), (snapshot) => {
            renderItems();
        });
        return unsubscribe;
    }
}

// Add event listeners
document.getElementById('addItemButton').addEventListener('click', addItem);
document.getElementById('nav-web-app').addEventListener('click', () => {
    window.location.assign('/webapp.html');
});

// Listen to auth state changes
let unsubscribe = null;
auth.onAuthStateChanged((user) => {
    if (user) {
        if (unsubscribe) unsubscribe();
        unsubscribe = setupDashboard();
    } else {
        if (unsubscribe) {
            unsubscribe();
            unsubscribe = null;
        }
        renderItems();
    }
});

