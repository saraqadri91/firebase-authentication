// dashboard.js
// import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js';
// let name = document.getElementById("name")
// let address = document.getElementById("address")
// let phone = document.getElementById("phone")
// let photo = document.getElementById("photo")
// const auth = getAuth();

// // Listen for authentication state changes
// onAuthStateChanged(auth, (user) => {
//     if (user) {
//         // User is signed in
//         console.log('User is signed in:', user);
// document.getElementById('user-info').innerHTML = ` <div class="flex">
//             <div class="img"><img src="${user.photo}" alt="user photo"></div>
//             <div class="text"><h2>${user.name || 'User'}!</h2></div>
//           </div>
//           <p><strong>Name:&nbsp;</strong><span class="pink">${user.name}</span></p>
//           <p><strong>Email:&nbsp;</strong><span class="pink">${user.email}</span></p>
//           <p><strong>Address:&nbsp;</strong><span class="pink">${user.address}</span></p>
//           <p><strong>Phone no:&nbsp;</strong><span class="pink">${user.phone}</span></p>
//           <p><strong>User Id (UID):&nbsp;</strong><span class="pink">${user.uid}</span></p>`
//         // Display user information
//         // document.getElementById('user-info').innerHTML = `
//         //     <h3>Welcome, ${user.displayName || 'User'}!</h3> </br></br></br>
//         //     <p>Email: ${user.email}</p></br></br></br>
//         //     <p>User ID: ${user.uid}</p></br></br></br>
//         //     <img src="${user.photoURL || 'default-profile-pic.png'}" alt="Profile Picture">
//         // `;

//     } else {
//         // User is signed out
//         console.log('No user is signed in. Redirecting to login.');
//         window.location.href = "index.html"; // Redirect to login page
//     }
// });
// document.getElementById('logout').addEventListener('click', () => {
//     signOut(auth).then(() => {
//         console.log('User signed out.');
//         window.location.href = "index.html"; // Redirect to login page after logout
//     }).catch((error) => {
//         console.error('Error signing out:', error.message);
//         Swal.fire({
//             title: 'Error!',
//             text: error.message,
//             icon: 'error',
//             confirmButtonText: 'Try Again'
//         });
//     });
// });


// Import Firestore and Firebase Auth methods
import { getFirestore, collection, getDocs, doc, updateDoc, deleteDoc,addDoc } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js';
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js';

// Initialize Firestore
const db = getFirestore();

// Initialize Firebase Auth
const auth = getAuth();

// Load posts when the page is loaded
window.onload = loadPosts;

// Function to display existing posts from Firestore
async function loadPosts() {
    try {
        // Get posts from Firestore
        const querySnapshot = await getDocs(collection(db, 'posts'));
        
        // Loop through the posts and create cards for each
        querySnapshot.forEach((doc) => {
            const post = doc.data();
            const postId = doc.id;
            
            // Create the post card
            const card = document.createElement('div');
            card.className = 'card mb-3';
            card.innerHTML = `
                <div class="card-header fontStyle">@Posts</div>
                <div class="card-body" style="background-image: url('${post.background || ''}');">
                    <h5 class="card-title fontStyle" id="tile-${postId}">${post.title}</h5>
                    <p class="card-text fontStyle" id="desc-${postId}">${post.description}</p>
                </div>
                <div class="p-3">
                    <button type="button" class="btn mt-4 fontStyle edit-btn">Edit</button>
                    <button type="button" class="btn mt-4 fontStyle delete-btn">Delete</button>
                </div>
            `;

            // Add event listeners to the edit and delete buttons
            const editButton = card.querySelector('.edit-btn');
            const deleteButton = card.querySelector('.delete-btn');

            editButton.addEventListener('click', () => editPost(postId)); // Use postId instead of the event target
            deleteButton.addEventListener('click', (event) => dltPost(event, postId)); // Pass the postId to delete

            // Append the created card to the container
            const newPostContainer = document.getElementById('newPost');
            newPostContainer.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading posts: ', error);
    }
}


// Edit Post Function
async function editPost(postId) {
    const titleElement = document.getElementById(`tile-${postId}`);
    const descElement = document.getElementById(`desc-${postId}`);
    
    // Prompt user to edit post
    const result = await Swal.fire({
        title: 'Edit Post',
        html: `
            <input id="swal-input1" class="swal2-input" value="${titleElement.innerText}">
            <input id="swal-input2" class="swal2-input" value="${descElement.innerText}">
        `,
        showCancelButton: true,
        preConfirm: () => {
            return [
                document.getElementById('swal-input1').value.trim(),
                document.getElementById('swal-input2').value.trim(),
            ];
        },
    });

    if (result.isConfirmed && result.value) {
        const [newTitle, newDesc] = result.value;

        if (newTitle && newDesc) {
            titleElement.innerText = newTitle;
            descElement.innerText = newDesc;
            // Update Firestore with new data
            await updatePost(postId, newTitle, newDesc);
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Title and description cannot be empty!',
            });
        }
    }
}

// Function to update post in Firestore
async function updatePost(postId, title, description) {
    try {
        const postRef = doc(db, 'posts', postId);
        await updateDoc(postRef, {
            title: title,
            description: description,
        });
    } catch (error) {
        console.error('Error updating post: ', error);
    }
}

// Delete Post Function
async function dltPost(event, postId) {
    const postCard = event.target.closest('.card');

    // Confirm post deletion
    const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
        try {
            // Delete post from Firestore
            await deleteDoc(doc(db, 'posts', postId));
            // Remove post from the page
            postCard.remove();
            Swal.fire('Deleted!', 'Your post has been deleted.', 'success');
        } catch (error) {
            console.error('Error deleting post: ', error);
        }
    }
}

// Firebase Authentication: Listen for authentication state changes
document.getElementById("user-info").addEventListener("click", () => {
    // Firebase Authentication State Change Listener
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // If the user is signed in, display user information in SweetAlert
            Swal.fire({
                title: 'User Information',
                html: `
                    <div class="flex">
                        <div class="img"><img src="${user.photoURL || 'default-profile-pic.png'}" alt="user photo" style="width: 100px; height: 100px; object-fit: cover;"></div>
                        <div class="text"><h2>${user.displayName || 'User'}!</h2></div>
                    </div>
                    <p><strong>Name:&nbsp;</strong><span class="pink">${user.displayName || 'User'}</span></p>
                    <p><strong>Email:&nbsp;</strong><span class="pink">${user.email}</span></p>
                    <p><strong>User Id (UID):&nbsp;</strong><span class="pink">${user.uid}</span></p>
                `,
                icon: 'info',
                confirmButtonText: 'Close'
            });
        } else {
            // If no user is signed in, redirect to login page
            console.log('No user is signed in. Redirecting to login.');
            window.location.href = 'index.html'; // Redirect to login page
        }
    });
});



// Logout function
document.getElementById('logout').addEventListener('click', () => {
    signOut(auth)
        .then(() => {
            console.log('User signed out.');
            window.location.href = 'index.html'; // Redirect to login page after logout
        })
        .catch((error) => {
            console.error('Error signing out:', error.message);
            Swal.fire({
                title: 'Error!',
                text: error.message,
                icon: 'error',
                confirmButtonText: 'Try Again',
            });
        });
});

// Image selection for background
let background; // For storing the selected background image
function selectImg(src, element) {
    background = src;

    // Remove 'selectedImg' class from all images
    document.querySelectorAll('.small-Img').forEach((img) => img.classList.remove('selectedImg'));

    // Add 'selectedImg' class to the clicked image
    element.classList.add('selectedImg');
}

// Attach event listeners dynamically for image selection
document.querySelectorAll('.small-Img').forEach((img) => {
    img.addEventListener('click', (event) => {
        const src = event.target.getAttribute('src');
        selectImg(src, event.target);
    });
});

// Post submission function
let submitpost = async () => {
    const postTitle = document.getElementById('postTitle').value.trim();
    const postDesc = document.getElementById('postDesc').value.trim();
    const newPost = document.getElementById('newPost');

    if (!newPost) {
        console.error("Element with id 'newPost' not found!");
        return;
    }

    if (!postTitle || !postDesc) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please fill in both the title and description!',
        });
        return;
    }

    const postId = Date.now(); // Temporarily using timestamp for the postId
    try {
        // Add post data to Firestore
        const docRef = await addDoc(collection(db, 'posts'), {
            title: postTitle,
            description: postDesc,
            background: background,
            timestamp: postId,
        });

        // Create card element
        const card = document.createElement('div');
        card.className = 'card mb-3';

        card.innerHTML = `
            <div class="card-header fontStyle">@Posts</div>
            <div class="card-body" style="background-image: url('${background || ''}');">
                <h5 class="card-title fontStyle" id="tile-${postId}">${postTitle}</h5>
                <p class="card-text fontStyle" id="desc-${postId}">${postDesc}</p>
            </div>
            <div class="p-3">
                <button type="button" class="btn mt-4 fontStyle edit-btn">Edit</button>
                <button type="button" class="btn mt-4 fontStyle delete-btn">Delete</button>
            </div>
        `;

        // Add event listeners for the edit and delete buttons
        const editButton = card.querySelector('.edit-btn');
        const deleteButton = card.querySelector('.delete-btn');

        editButton.addEventListener('click', () => editPost(docRef.id)); // Use Firestore document ID
        deleteButton.addEventListener('click', (event) => dltPost(event, docRef.id)); // Pass docRef.id for delete

        // Append the card to the newPost container
        newPost.appendChild(card);

        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Your work has been saved',
            showConfirmButton: false,
            timer: 1500,
        });

        // Clear form fields
        document.getElementById('postTitle').value = '';
        document.getElementById('postDesc').value = '';
    } catch (error) {
        console.error('Error adding document: ', error);
    }
};
// Attach event listener for submit button
document.getElementById('submit').addEventListener('click', submitpost);
