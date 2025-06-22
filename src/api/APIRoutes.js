const express = require('express');
const cookieParser = require('cookie-parser');

const apiRouter = express.Router();

const TOKEN_COOKIE_NAME = "Howler"

apiRouter.use(cookieParser());
apiRouter.use(express.json());


const { generateToken, removeToken, TokenMiddleware } = require('../middleware/TokenMiddleware');


// Data Access Objects
const UsersDAO = require('../api/UsersDAO');
const FollowsDAO = require('../api/FollowsDAO');
const HowlsDAO = require('../api/HowlsDAO');

// User Login
apiRouter.post('/login', (req, res) => {

    const { username, password } = req.body;

    if(!username || !password) {

        return res.status(400).json({error: "No Credentials"});

    }

    UsersDAO.getUserByCredentials(username, password)
    .then(user => {
        generateToken(req, res, user)
        res.json({user: user})
    })
    .catch(error => {

        res.status(error.code || 500).json({ error: error.message })
        
    })

});

// User Logout
apiRouter.post('/logout', (req, res) => {

    removeToken(req, res);
    res.json({ message: "User logged out successfully" });

});

// Get Current Authenticated User
apiRouter.get('/users/current', TokenMiddleware, (req, res) => {

    const user = req.user;

    if (!user) {
        return res.status(401).json({ message: "User not authenticated" });
    } else {

        res.json(user);

    }

});

// Sign Up New User
apiRouter.post('/signup', (req, res) => {

    const { firstName, lastName, username, password } = req.body;

    if(!firstName || !lastName || !username || !password) {

        return res.status(400).json({error: "No Credentials"});

    }

    UsersDAO.signUpUser(firstName, lastName, username, password)
    .then(user => {
        generateToken(req, res, user)
        res.json({user: user})
    })
    .catch(error => {

        res.status(error.code || 500).json({ error: error.message })
        
    })



});



// Create New Howl
apiRouter.post('/howl', TokenMiddleware, (req, res) => {

    const newHowl = req.body;

    HowlsDAO.updateHowls(newHowl)
    .then(() => {

        res.json({ message: 'Data received successfully', receivedData: newHowl });

    })
    .catch(() => {
        res.status(404).json({ message: "Howls Not Found" });
    });

});

// Get Howl Posted By Specific User
apiRouter.get('/users/:userId/howls', TokenMiddleware, (req, res) => {

    const userID = req.params.userId;

    HowlsDAO.getHowlsByUser(userID)
        .then(userHowls => {

            res.json(userHowls);
        })
        .catch(() => {
            res.status(404).json({ message: "Howls Not Found" });
        });
    
});

// Get Howl Posted By All Users Followed By Current User, Including Current User's Howls.
apiRouter.get('/users/:userId/following/howls',TokenMiddleware, (req, res) => {

    const userID = req.params.userId;
// ERROR IS HERE!: WE ARENT ABLE TO GET ANY FOLLOWING, SO WE ARENT ABLE TO CONSTRUCT FEED!

    FollowsDAO.getFollowing(userID)
    .then(followingIDs => {

        return HowlsDAO.getUserFeed(userID, followingIDs);
    })
    .then(followerHowls => {
        res.json(followerHowls);

    })
    .catch((error) => {

        res.status(404).json({ message: "Howls Not Found" });
    });


});

// Get Specific User Using ID
apiRouter.get('/users/:userId', TokenMiddleware, (req, res) => {

    const userID = req.params.userId;

    UsersDAO.getUserByID(userID)
        .then(user => {
            res.json(user);
        })
        .catch(() => {
            res.status(404).json({ message: "User not found" });
        });
});

// Get Specific User Using Username
apiRouter.get('/users/username/:username',TokenMiddleware, (req, res) => {

    const username = req.params.username;

    UsersDAO.getUserByName(username)
        .then(user => {
            res.json(user);
        })
        .catch(() => {
            res.status(404).json({ message: "User not found + HERE!" });
        });
});

// Get Following List from Specific User
apiRouter.get('/users/:userId/following', TokenMiddleware, (req, res) => {
    
    const userID = req.params.userId;

    FollowsDAO.getFollowing(userID)
    .then(following => {
        res.json(following);
    })
    .catch(() => {
        res.status(404).json({ message: "User not found" });
    });

});

// Follow Specific User
apiRouter.post('/users/follow',TokenMiddleware, (req, res) => {

    const follower = req.body.follower;
    const followee = req.body.followee;

    FollowsDAO.follow(follower, followee)
    .then(followingList => {
        res.json(followingList);
    })
    .catch(() => {
        res.status(404).json({ message: "Cannot Follow" });
    });

});

// Unfollow Specific User
apiRouter.post('/users/unfollow', TokenMiddleware, (req, res) => {

    const follower = req.body.follower;
    const followee = req.body.followee;

    FollowsDAO.unfollow(follower, followee)
    .then(followingList => {
        res.json(followingList);
    })
    .catch(() => {
        res.status(404).json({ message: "Cannot Unfollow" });
    });
});


module.exports = apiRouter;