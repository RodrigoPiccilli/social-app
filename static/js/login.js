// Action Listener For Login Form
document.querySelector("form").addEventListener('submit', event => {
    
    // Prevent Normal Form Behavior
    event.preventDefault();
    
    // Get Username of User Attempting to Login
    const username = document.querySelector("#username").value;
    const password = document.querySelector("#password").value;

    // Send POST Request to Server to Authenticate User
    fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    })
    .then(response => response.json())
    .then(data => {

        // If User is Not Part of the System
        if (data.user) {
            document.querySelector("#invalid").style.display = "none";
            document.querySelector("#username").value = ""
            document.querySelector("#password").value = ""
            location.reload();
        } else { // If the User is part of the System
            document.querySelector("#invalid").style.display = "block"; // Display Invalid Username / Password Message

        }
    })
    .catch(error => console.error("Error:", error));
});

// Action Listener For Signup 
document.querySelector("#sign-up").addEventListener('click', () => {
    window.location.href = "/signup";
})
