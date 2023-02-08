const Login = require('../models/LoginModel')

exports.index = (req, res) => {
    if(req.session.user) return res.render('login-logado')
    return res.render('login');
}

exports.register = async (req, res) => {

    try {
        // Aqui chamamos o metodo construtor enviando a nossa requisição
        const login = new Login(req.body);
        // aqui chamamos a função de registro feito no nosso model
        await login.register();

        // Aqui enviamos os erros que apareceram ao nosso usuário. Se for digitado um e-mail invalido ou se a senha não for compativel, será enviado uma flash message.
        if (login.errors.length > 0) {
            req.flash('errors', login.errors);
            req.session.save(() => {
                return res.redirect('/login/')
            });
            return
        }
        req.flash('success', 'Seu usuário foi criado com sucesso!');
        req.session.save(() => {
            return res.redirect('/login/')
        });
    } catch (e) {
        console.log(e)
        return res.render('404')
    }
}

exports.login = async (req, res) => {

    try {
        // Aqui chamamos o metodo construtor enviando a nossa requisição
        const login = new Login(req.body);
        // aqui chamamos a função de login feito no nosso model
        await login.login();

        // Aqui enviamos os erros que apareceram ao nosso usuário. Se for digitado um e-mail invalido ou se a senha não for compativel, será enviado uma flash message.
        if (login.errors.length > 0) {
            req.flash('errors', login.errors);
            req.session.save(() => {
                return res.redirect('/login/')
            });
            return
        }

        req.flash('success', 'Logado com sucesso!');
        req.session.user = login.user;
        req.session.save(() => {
            return res.redirect('/login/')
        });
    } catch (e) {
        console.log(e)
        return res.render('404')
    }
}

exports.logout = (req, res) => {
    req.session.destroy();
    res.redirect('/login/');
}