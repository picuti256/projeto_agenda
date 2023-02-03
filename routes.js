const express = require('express');
const route = express.Router();

// Controllers
const homeController = require('./src/controllers/homeController');
const loginController = require('./src/controllers/loginController');

// Rota da página inicial
route.get('/', homeController.index);

// Rota de login
route.get('/login/', loginController.index)


module.exports = route;