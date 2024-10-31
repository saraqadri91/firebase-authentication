// app.js
import { getAuth, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js';

const auth = getAuth();

const loginBtn = document.getElementById('log-in');
const logEmail = document.getElementById('logEmail');
const logPass = document.getElementById('logPass');

loginBtn.addEventListener('click', () => {
    const email = logEmail.value.trim();
    const password = logPass.value.trim();

    if (email && password) {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log('User logged in:', user);
                
                Swal.fire({
                    title: 'Success!',
                    text: 'Logging you in, please wait...',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 5000 // Automatically close after 5 seconds
                });

                // Redirect to dashboard after 5 seconds
                setTimeout(() => {
                    window.location.href = "dashboard.html"; // Ensure this URL is correct
                }, 5000);
            })
            .catch((error) => {
                const errorMessage = error.message;
                console.error('Error logging in:', errorMessage);
                Swal.fire({
                    title: 'Error!',
                    text: errorMessage,
                    icon: 'error',
                    confirmButtonText: 'Try Again'
                });
            });
    } else {
        Swal.fire({
            title: 'Input Required',
            text: "Please enter your email and password.",
            icon: "warning"
        });
    }
});

// Register button event
const registerBtn = document.getElementById("register");
registerBtn.addEventListener("click", () => {
    window.location.href = "sign-up.html"; // Redirect to sign-up page
});
