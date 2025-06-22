// User Logged In
let user;

// Current Page
const currentPage = window.location.pathname;

// Fetch Current User Logged In
fetch('/api/users/current')

.then(response => response.json())
.then(data => {

    // Update Header with Current User Info
    document.querySelector("#current-username").textContent = "@" + data.username;
    document.querySelector("#current-username").href = "/" + data.username;
    document.querySelector("#current-user-image").setAttribute("src", data.avatar);
        
    user = data; 
        
    // Fetch Following List for Current User
    return fetch(`/api/users/${user.id}/following/howls`);

})
.then(response => response.json())
.then(followerHowls => {
        
    // Construct Howler Feed for Current User
    constructFeed(followerHowls);

})
.catch(error => {

    console.error('Error fetching user data:', error);
});

// Helper Function to Construct Howler Feed
function constructFeed(feedContent) {

    let feed = [];

    const template = document.querySelector('#howl-template');
    
    // Iterate Through Howls, Fetch User Info, Duplicate Template, and Append to Feed
    feedContent.forEach(howl => {

        fetch(`/api/users/${howl.userId}`)
        .then(response => response.json())
        .then(data => {

            const templateCopy = document.importNode(template.content, true);
            templateCopy.querySelector('img').src = data.avatar;
            templateCopy.querySelector('h5').textContent = `${data.first_name} ${data.last_name}`;
            templateCopy.querySelector('a').textContent = `@${data.username}`;
            templateCopy.querySelector('span').textContent = formatDate(howl.datetime);
            templateCopy.querySelector('a').href = `/${data.username}`;
            templateCopy.querySelector('p').textContent = howl.text;
    
            let wrapper = document.createElement('div');
            wrapper.appendChild(templateCopy);
    
            feed.push({ element: wrapper, datetime: new Date(howl.datetime) });
    
            sortFeed(feed);
        })
        .catch(error => console.error("Error fetching user:", error));
    });

}

// Helper Function to Sort Feed According to Date
function sortFeed(feed) {

    const feedContainer = document.querySelector("#feed");

    feed.sort((a, b) => b.datetime - a.datetime);
    
    feedContainer.innerHTML = "";

    feed.forEach(entry => feedContainer.appendChild(entry.element));

}
    
// Event Listener for Posting Howls
document.querySelector("#post-howl").addEventListener('click', () => {

    const howlText = document.querySelector("#howl-text").value;

    if(howlText === "") {
        return;
    }

    fetch('/api/howl', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userId: user.id,
            datetime: new Date(),
            text: howlText
        })

    })
    .then(response => response.json())
    .then(data => {

        console.log(data);

        location.reload();
 
        document.querySelector("#howl-text").value = "";
 
    })
 
    .catch(error => {
 
        console.error('Error posting howl:', error);
 
    });
 
});

// Helper Function to Format Date and Time for Howls
function formatDate(datetime) {

    const date = new Date(datetime);
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const suffix = ['th', 'st', 'nd', 'rd'][(day % 10 > 3 || [11, 12, 13].includes(day)) ? 0 : day % 10] || 'th';
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; 
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    
    return `${month} ${day}${suffix}, ${year} ${formattedHours}:${formattedMinutes} ${ampm}`;
}

document.querySelector("#logout").addEventListener("click", () => {
    fetch('/api/logout', {
        method: 'POST'
    }).then(() => {
        location.reload(); 
    }).catch(err => console.error("Logout failed:", err));
});


