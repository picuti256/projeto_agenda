const Login = require('../models/LoginModel')

exports.index = (req, res) => {
    res.render('login');
}

exports.register = async (req, res) => {
    // Aqui chamamos o metodo construtor enviando a nossa requisição
    const login = new Login(req.body);
    // aqui chamamos a função de registro feito no nosso model
    await login.register();

    // Aqui enviamos os erros que apareceram ao nosso usuário. Se
    if(login.errors.length > 0) {
        req.flash('errors', login.errors);
        req.session.save(() => {
            res.redirect('/login/')
        });

        return
    }

    res.send(login.errors);
}