const express = require('express');
const route = express.Router();

// Controllers
const homeController = require('./src/controllers/homeController');
const loginController = require('./src/controllers/loginController');
const contatoController = require('./src/controllers/contatoController');

const { loginRequired } = require('./src/middlewares/middleware')

// Rotas da página inicial
route.get('/', homeController.index);

// Rotas de login
route.get('/login/', loginController.index)
route.post('/login/register', loginController.register)
route.post('/login/login', loginController.login)
route.get('/login/logout', loginController.logout)

// Rotas de contato
route.get('/contato/', loginRequired, contatoController.index)
route.post('/contato/register', loginRequired, contatoController.register)
route.get('/contato/:id', loginRequired, contatoController.editIndex)

module.exports = route;