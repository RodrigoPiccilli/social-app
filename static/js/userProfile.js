// Current Page
const currentPage = window.location.pathname;

// User Currently Logged In
let user = null;

// List of Users Logged In User Is Following
let following = [];

// Fetch Logged in User
fetch('/api/users/current')
.then(response => response.json())
.then(data => {

    // Update Header with Logged In User Data
    document.querySelector("#current-username").textContent = "@" + data.username;
    document.querySelector("#current-user-image").setAttribute("src", data.avatar);
    document.querySelector("#current-username").href = "/" + data.username;

    user = data;
    
    return fetch(`api/users/${user.id}/following`);

})
.then(response => response.json())
.then(followingList => {

    // Set Logged In User's Following List
    following = followingList;

    // Fetch User Data for Specified User
    return fetch(`/api/users/username${currentPage}`)

.then(response => response.json())
.then(userData => {
    
    // Update User Profile with User Data
    document.querySelector("#user-image").setAttribute("src", userData.avatar);
    document.querySelector("#user-first-last").textContent = userData.first_name + " " + userData.last_name;
    document.querySelector("#username").textContent = "@" + userData.username;
    
    // If User is Following Specified User
    if(user.username !== userData.username) {
    
        document.querySelector("#follow").style.display = "block";
        
        if(following.includes(userData.id)) {
    
            document.querySelector("#follow").textContent = "Unfollow";
                   
        } else {
                        
            document.querySelector("#follow").textContent = "Follow";

        }
                
        document.querySelector("#follow").addEventListener("click", () => {

            if(document.querySelector("#follow").textContent === "Unfollow") {
                    
                fetch(`/api/users/unfollow`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            follower: user.id,
                            followee: userData.id
                        })
                })
                .then(response => response.json())
                .then(data => {
    
                    document.querySelector("#follow").textContent = "Follow";
    
                })
                .catch(error => {
    
                    console.error('Error fetching user data:', error);
    
                });
    
            } else if(document.querySelector("#follow").textContent === "Follow") {
                        
                fetch(`/api/users/follow`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                        body: JSON.stringify({
                            follower: user.id,
                            followee: userData.id
                        })
                    })
                    .then(response => response.json())
                    .then(data => {
    
                        document.querySelector("#follow").textContent = "Unfollow";
    
                    })
                    .catch(error => {
    
                        console.error('Error fetching user data:', error);
    
                    });
    
            }
        });
    
    }
    
    // Fetch User's Followers
    return fetch(`api/users/${userData.id}/following`);
    
})
.then(response => response.json())
.then(followers => {

    const template = document.querySelector('#following-template');
    
    const followingList = document.querySelector("#following");
            
    
    for(let i = 0; i < followers.length; i++) {
    
        // Iterate Through Followers, Fetching User Data, and Adding to Following List
        fetch(`/api/users/${followers[i]}`)
        .then(response => response.json())
        .then(data => {
    
            const templateCopy = document.importNode(template.content, true);
    
            templateCopy.querySelector('img').src = data.avatar;
    
            templateCopy.querySelector('h3').textContent = data.first_name + " " + data.last_name;
    
            templateCopy.querySelector('a').textContent = "@" + data.username;
                    
            templateCopy.querySelector('a').href = "/" + data.username;
    
            followingList.appendChild(templateCopy);
    
    
        });
        
    }
    
})
.catch(error => {
            
    console.error('Error fetching user data:', error);
            
});
    
})
.catch(error => {

    console.error('Error fetching user data:', error);

});

// Fetch User Howls
let userInfo;

fetch(`/api/users/username${currentPage}`)
.then(response => response.json())   
.then(userData => {

    userInfo = userData;

    return fetch(`api/users/${userData.id}/howls`);

})
.then(response => response.json())
.then(userHowls => {

    constructUserFeed(userHowls);

})
.catch(error => {

    console.error('Error fetching user data:', error);

});

// Helper Function to Construct Feed for Specific User
function constructUserFeed(userHowls) {

    userHowls.sort((a, b) => new Date(b.datetime) - new Date(a.datetime));

    const feed = document.querySelector("#user-howls"); 

    const template = document.getElementById('howl-template');

    for(let i = 0; i < userHowls.length; i++) {

        const templateCopy = document.importNode(template.content, true);

        templateCopy.querySelector('img').src = userInfo.avatar;
        templateCopy.querySelector('h5').textContent = userInfo.first_name + " " + userInfo.last_name;
        templateCopy.querySelector('a').textContent = "@" + userInfo.username;
        templateCopy.querySelector('span').textContent = formatDate(userHowls[i].datetime);
        templateCopy.querySelector('a').href = "/" + userInfo.username;
        templateCopy.querySelector('p').textContent = userHowls[i].text;

        feed.appendChild(templateCopy);

    }
    

}

// Helper Function to Formate Date and Time for Howls
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
    fetch('api/logout', {
        method: 'POST'
    }).then(() => {
        window.location.href = '/'; 
    }).catch(err => console.error("Logout failed:", err));
});
