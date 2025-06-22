const express = require('express');
const frontendRouter = express.Router();
const cookieParser = require('cookie-parser'); 

const TOKEN_COOKIE_NAME = "Howler"

frontendRouter.use(cookieParser()); 
frontendRouter.use(express.static('/static'));

const path = require('path');
const html_dir = path.join(__dirname, '../../templates/');

// Frontend Routes
frontendRouter.get('/', (req, res) => {

    if (req.cookies[TOKEN_COOKIE_NAME]) { // If user is logged in
        res.sendFile(html_dir + '/howler.html');
    } else { // If user is not logged in
        res.sendFile(html_dir + '/login.html');
    }
});

frontendRouter.get('/signup', (req, res) => { 
    if (req.cookies[TOKEN_COOKIE_NAME]) { 
        res.redirect("/");
    } else {
        res.sendFile(html_dir + '/signup.html');
    }
});

frontendRouter.get('/:username', (req, res) => { 
    if (req.cookies[TOKEN_COOKIE_NAME]) { // If user is logged in  
        res.sendFile(html_dir + '/userProfile.html');
    } else {
        res.redirect("/");
    }
});



module.exports = frontendRouter;