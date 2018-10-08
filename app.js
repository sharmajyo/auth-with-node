var express = require('express');
var app = express();
var db = require('./db');

var UserController = require('./user/UserController');
app.use('/users', UserController);

const AuthController = require('./auth/authController');
app.use('/api/auth', AuthController);
module.exports = app;