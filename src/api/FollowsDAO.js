// Import Follow Data
let follows = require('./data/follows.json');

module.exports = {

    // Get List of Users Followed By Specified User
    getFollowing: (userID) => {

        return new Promise((resolve, reject) => {

            const user = Object.values(follows).find(list => list.userId === Number(userID));

            if(user) {

                resolve(user.following); 

            } else {

                resolve([]);
                // reject(new Error('User not found')); 
            }
 
        });

       

    },

    // Add Followee to User's Following List
    follow: (follower, followee) => {

        return new Promise((resolve, reject) => {

            const user = Object.values(follows).find(list => list.userId === Number(follower));

            if(user) {

                user.following.push(Number(followee));

                resolve(user.following); 

            } else {

                reject(new Error('User not found')); 
            }

          

        });


    },

    // Remove Followee from User's Following List
    unfollow: (follower, followee) => {

        return new Promise((resolve, reject) => {

            const user = Object.values(follows).find(list => list.userId === Number(follower));

            if(user) {

                user.following = user.following.filter(id => id !== Number(followee));

                resolve(user.following); 

            } else {

                reject(new Error('User not found')); 
            }

          

        });
    }
}