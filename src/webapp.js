import { auth, db } from './firebase.js';
import { collection, getDocs, doc, getDoc, updateDoc, arrayUnion, setDoc } from 'firebase/firestore';

// Constants
const GRID_SIZE = 16; // 4x4 grid

// Utility functions for showing/hiding elements
const showElement = (id) => document.getElementById(id).classList.remove('d-none');
const hideElement = (id) => document.getElementById(id).classList.add('d-none');

// Shuffle array function (Fisher-Yates shuffle)
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// Create an empty card
const createEmptyCard = () => {
  const card = document.createElement('div');
  card.className = 'col-6 col-md-4 col-lg-3 mb-3';
  card.innerHTML = `
    <div class="card h-100">
      <div class="card-body d-flex flex-column">
        <h5 class="card-title text-muted">Empty Slot</h5>
        <p class="card-text flex-grow-1 text-muted">No item available</p>
      </div>
    </div>
  `;
  return card;
};

// Show notification
const showNotification = (message, type = 'success') => {
  const notification = document.createElement('div');
  notification.className = `alert alert-${type} alert-dismissible fade show fixed-top mx-auto mt-3`;
  notification.style.maxWidth = '300px';
  notification.style.zIndex = '1050';
  notification.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 3000); // Auto-dismiss after 3 seconds
};

// Bookmark an item
const bookmarkItem = async (itemId, itemName) => {
  const user = auth.currentUser;
  if (!user) {
    showNotification('Please log in to bookmark items.', 'warning');
    setTimeout(() => window.location.assign('/dashboard.html'), 1500);
    return;
  }

  try {
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      // Document exists, update it
      const userData = userDoc.data();
      const bookmarks = userData.bookmarks || [];

      if (!bookmarks.includes(itemId)) {
        await updateDoc(userDocRef, {
          bookmarks: arrayUnion(itemId)
        });
        showNotification(`"${itemName}" added to bookmarks!`);
      } else {
        showNotification(`"${itemName}" is already bookmarked.`, 'info');
      }
    } else {
      // Document doesn't exist, create it with the bookmark
      await setDoc(userDocRef, {
        bookmarks: [itemId]
      });
      showNotification(`"${itemName}" added to bookmarks!`);
    }
  } catch (error) {
    console.error('Error bookmarking item:', error);
    showNotification('Error adding bookmark.', 'danger');
  }
};

// Fetch and render 16 random items
const renderRandomItems = async () => {
  try {
    const itemsContainer = document.getElementById('items-container');
    itemsContainer.innerHTML = ''; // Clear previous content

    const querySnapshot = await getDocs(collection(db, 'items'));
    const allItems = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    if (allItems.length === 0) {
      hideElement('items-container');
      showElement('no-items');
      return;
    }

    // Shuffle items and take first 16 (or all if less than 16)
    const shuffledItems = shuffleArray([...allItems]);
    const displayItems = shuffledItems.slice(0, GRID_SIZE);

    // Pad with empty cards if less than 16
    while (displayItems.length < GRID_SIZE) {
      displayItems.push(null);
    }

    displayItems.forEach((item) => {
      const itemElement = document.createElement('div');
      itemElement.className = 'col-6 col-md-4 col-lg-3 mb-3';
      if (item) {
        itemElement.innerHTML = `
          <div class="card h-100 clickable-card" data-item-id="${item.id}">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${item.name || 'Unnamed Item'}</h5>
              <p class="card-text flex-grow-1">${item.description || 'No description'}</p>
              <button class="btn btn-sm btn-outline-warning bookmark-btn mt-auto">Bookmark</button>
            </div>
          </div>
        `;
        // Add click event for readmore
        itemElement.querySelector('.clickable-card').addEventListener('click', (e) => {
          if (e.target.classList.contains('bookmark-btn')) return; // Prevent navigation on bookmark click
          if (!auth.currentUser) {
            showNotification('Please log in to read more.', 'warning');
            setTimeout(() => window.location.assign('/dashboard.html'), 1500);
            return;
          }
          window.location.href = `/readmore.html?itemId=${item.id}`;
        });
        // Add bookmark event
        itemElement.querySelector('.bookmark-btn').addEventListener('click', () => bookmarkItem(item.id, item.name));
      } else {
        itemElement.appendChild(createEmptyCard().firstElementChild);
      }
      itemsContainer.appendChild(itemElement);
    });

    showElement('items-container');
    hideElement('no-items');
  } catch (error) {
    console.error('Error fetching random items:', error);
    document.getElementById('items-container').innerHTML = `
      <div class="col-12 text-danger text-center">Error loading items: ${error.message}</div>
    `;
  }
};

// Authentication state handler
const handleAuthState = () => {
  auth.onAuthStateChanged((user) => {
    if (user) {
      hideElement('loading');
      showElement('content');
      renderRandomItems();
    } else {
      showNotification('Please log in to access this page.', 'warning');
      setTimeout(() => window.location.assign('/dashboard.html'), 1500);
    }
  });
};

// Event listeners setup
const setupListeners = () => {
  document.getElementById('back-to-dashboard').addEventListener('click', () => {
    window.location.assign('/dashboard.html');
  });

  document.getElementById('new-random-items').addEventListener('click', renderRandomItems);
};

// Initialize the application
const init = () => {
  handleAuthState();
  setupListeners();
};

// Start the application
init();