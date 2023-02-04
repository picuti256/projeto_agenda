const mongoose = require('mongoose');
const validator = require('validator');

const LoginSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
});

const LoginModel = mongoose.model('Login', LoginSchema);


class Login {
    constructor(body) {
        this.body = body;

        // Aqui criamos um array que irá registar os erros
        this.errors = [];

        this.user = null;
    }

    // Aqui fazemos a função ser assincrona pois irá fazer conexão com a base de dados.
    async register() {
        this.valid();
        if (this.errors.length > 0) return;

        // Aqui criamos o usuários com as informações obtidas do formulário.
        try {
            this.user = await LoginModel.create(this.body)
        } catch (e) {
            console.log(e)
        }
    }

    valid() {
        // Aqui chamamos a função para limpar o formulário 
        this.cleanUp();
        // validação de cadastro

        // O e-mail precisa ser um e-mail valido. Utilizamos o validator para fazer a verificação, caso tenha erro, adicionamos no nosso array
        if (!validator.isEmail(this.body.email)) this.errors.push('E-mail inválido')

        // A senha precisa ter no minimo 5 caracteres. Aqui fazemos uma validação através do tamanho.
        if (this.body.password.length <= 5) {
            this.errors.push('A senha precisa ter no mínimo 5 caracteres')
        }
    }

    // O cleanUp serve para "limpar" o nosso objeto e assim só envie o e-mail e password para a nossa base de dados, e não envie o csurf junto.
    cleanUp() {
        for (const key in this.body) {
            // Aqui ele faz a verificação se o campo é uma string, caso contrario, ele retornara uma string vazio.
            if (typeof this.body[key] !== 'string') {
                this.body[key] = '';
            }
        }

        this.body = {
            // Aqui indicamos que ele só irá retornar o e-mail e senha 
            email: this.body.email,
            password: this.body.password
        }
    }
}

module.exports = Login;