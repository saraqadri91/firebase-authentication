// dashboard.js
import { getAuth, onAuthStateChanged , signOut} from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js';
let name = document.getElementById("name")
let address = document.getElementById("address")
let phone = document.getElementById("phone")
let photo = document.getElementById("photo")
const auth = getAuth();

// Listen for authentication state changes
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        console.log('User is signed in:', user);
document.getElementById('user-info').innerHTML = ` <div class="flex">
            <div class="img"><img src="${user.photo}" alt="user photo"></div>
            <div class="text"><h2>${user.name || 'User'}!</h2></div>
          </div>
          <p><strong>Name:&nbsp;</strong><span class="pink">${user.name}</span></p>
          <p><strong>Email:&nbsp;</strong><span class="pink">${user.email}</span></p>
          <p><strong>Address:&nbsp;</strong><span class="pink">${user.address}</span></p>
          <p><strong>Phone no:&nbsp;</strong><span class="pink">${user.phone}</span></p>
          <p><strong>User Id (UID):&nbsp;</strong><span class="pink">${user.uid}</span></p>`
        // Display user information
        // document.getElementById('user-info').innerHTML = `
        //     <h3>Welcome, ${user.displayName || 'User'}!</h3> </br></br></br>
        //     <p>Email: ${user.email}</p></br></br></br>
        //     <p>User ID: ${user.uid}</p></br></br></br>
        //     <img src="${user.photoURL || 'default-profile-pic.png'}" alt="Profile Picture">
        // `;
        
    } else {
        // User is signed out
        console.log('No user is signed in. Redirecting to login.');
        window.location.href = "index.html"; // Redirect to login page
    }
});
document.getElementById('logout').addEventListener('click', () => {
    signOut(auth).then(() => {
        console.log('User signed out.');
        window.location.href = "index.html"; // Redirect to login page after logout
    }).catch((error) => {
        console.error('Error signing out:', error.message);
        Swal.fire({
            title: 'Error!',
            text: error.message,
            icon: 'error',
            confirmButtonText: 'Try Again'
        });
    });
});