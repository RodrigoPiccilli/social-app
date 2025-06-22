// Server Setup
const express = require('express');
const server = express();
const PORT = 3000;

// Routes  
const cookieParser = require('cookie-parser');
const routes = require('./src/routes.js');
server.use(routes);


// Middleware
server.use(express.json());
server.use(cookieParser());
server.use(express.static(__dirname + '/static'));
server.use(express.urlencoded({ extended: true }));

// Server Listening
server.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
