import { getAuth, createUserWithEmailAndPassword } from "./fire-base.js";

const auth = getAuth();
let signEmail = document.getElementById('sign-email')
let signPass = document.getElementById('sign-pass')
let signUpBtn = document.getElementById('sign-up')

signUpBtn.addEventListener('click', () => {

    if (signEmail.value.trim() && signPass.value.trim()) {
        createUserWithEmailAndPassword(auth, signEmail.value, signPass.value)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log('User created:', user);
             window.location.href = "index.html";
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error('Error:', errorCode, errorMessage);
                // Log the complete error object for more details
                console.error('Full error details:', error);

            });
    }
    else {
        Swal.fire({
            text: "Insert your data",
            icon: "question"
        });
    }
})

