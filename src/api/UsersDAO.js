// Import User Data
let users = require('./data/users.json');

let follows = require('./data/follows.json');

const crypto = require('crypto');

function getFilteredUser(user) {
    return {
      "id": user.id,
      "first_name": user.first_name,
      "last_name": user.last_name,
      "username": user.username,
      "avatar": user.avatar
    }
}

function generateSalt() {
    return crypto.randomBytes(20).toString('hex');
}

module.exports = {

    getUserByCredentials: (username, password) => {

        return new Promise((resolve, reject) => {

            const user = Object.values(users).find(user => user.username === username);

            if(!user) {

                reject(new Error('User not found')); 
                return;

            } 

            crypto.pbkdf2(password, user.salt, 100000, 64, 'sha512', (err, derivedKey) => {
                if (err) { 

                  reject({code: 500, message: "Error hashing password " + err});
                  return;
                }

                const digest = derivedKey.toString('hex');

                if (user.password == digest) {
                    resolve(getFilteredUser(user));
                }
                else {
                    reject({code: 401, message: "Invalid password"});
                }
              });
                
        });

    },

    signUpUser: (firstName, lastName, username, password) => {

        return new Promise((resolve, reject) => {

            if(Object.values(users).find(user => user.username === username)) {
                reject(new Error('Username is already taken.')); 
                return;
            } 

            let newUserId = Object.keys(users).length + 1;
            let salt = generateSalt();

            crypto.pbkdf2(password, salt, 100000, 64, 'sha512', (err, derivedKey) => {
                
                if (err) { 
                    reject({code: 500, message: "Error hashing password " + err});
                    return;
                }



                const digest = derivedKey.toString('hex');

                let newUser = {
                    id: newUserId,
                    first_name: firstName,
                    last_name: lastName,
                    username: username,
                    avatar: "https://robohash.org/veniamdoloresenim.png?size=64x64&set=set1",
                    salt: salt,
                    password: digest
                }

                users[newUserId] = newUser;

                resolve(getFilteredUser(newUser));
            
            });            
        });


    },

    // Get All Users
    getUsers: () => {

        return new Promise((resolve, reject) => {
            resolve(Object.values(users));
        });

    },
 
    // Get Specific User by Username
    getUserByName: (username) => {
        return new Promise((resolve, reject) => {

            const user = Object.values(users).find(user => user.username === username);

            if(user) {

                resolve(user); 

            } else {

                reject(new Error('User not found')); 
            }
        });
    },

    // Get Specific User by ID
    getUserByID: (userID) => {
        return new Promise((resolve, reject) => {

            const user = Object.values(users).find(user => user.id === Number(userID));

            if(user) {

                resolve(user); 

            } else {

                reject(new Error('User not found!')); 
            }
        });
    },

}
