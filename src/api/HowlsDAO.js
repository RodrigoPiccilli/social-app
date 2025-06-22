let howls = require('./data/howls.json');

module.exports = {

    // Add A New Howl
    updateHowls: (newHowl) => {

        return new Promise((resolve, reject) => {

            howls.push(newHowl);

            resolve(newHowl);

        });


    },

    // Get All Howls By Specific User
    getHowlsByUser: (userId) => {

        return new Promise((resolve, reject) => {

            let userHowls = Object.values(howls).filter(howl => howl.userId === Number(userId));


            if (userHowls.length > 0) { 
                    
                resolve(userHowls); 
                
            } else {

                reject(new Error('User not found')); 
            }
        });

       
    },
 
    // Get All Howls That Are Supposed To Appear in The User's Feed
    getUserFeed: (userID, followingIDs) => {

        return new Promise((resolve, reject) => {

            let feed = [];

            let userHowls = Object.values(howls).filter(howl => howl.userId === Number(userID));

            if (userHowls.length > 0) { 
                    
                userHowls.forEach(howl => {

                    feed.push(howl);

                })
                
            }

            if(followingIDs.length > 0) {

                for(let i  = 0; i < followingIDs.length; i++) {

                    let howlsList = Object.values(howls).filter(howl => howl.userId === followingIDs[i]);

                    if (howlsList) { 
                        
                        howlsList.forEach(howl => {

                            feed.push(howl);

                        })
                        
                    }

                }
            }

            // if(feed.length > 0) {

                resolve(feed); 

            // } else {

                reject(new Error('User not found')); 
            // }
        });
    },

}
