// Action Listener For Login Form
document.querySelector("form").addEventListener('submit', event => {
    
    // Prevent Normal Form Behavior
    event.preventDefault();
    
    // Get Info of User Attempting to Login
    const firstName = document.querySelector("#first-name").value;
    const lastName = document.querySelector("#last-name").value;
    const username = document.querySelector("#username").value;
    const password = document.querySelector("#password").value;

    // Send POST Request to Server to Authenticate User
    fetch('/api/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            firstName: firstName,
            lastName: lastName,
            username: username,
            password: password
        })
    })
    .then(response => response.json())
    .then(data => {

        console.log(data);

        // If User is Already Part of System
        if (data.user) {
            
            document.querySelector("#invalid").style.display = "none";
            location.reload();

        } else { // If the User is part of the System
            document.querySelector("#invalid").style.display = "block";
        }
    })
    .catch(error => console.error("Error:", error));
});

// Action Listener For Login 
document.querySelector("#log-in").addEventListener('click', () => {
    window.location.href = "/";
})
