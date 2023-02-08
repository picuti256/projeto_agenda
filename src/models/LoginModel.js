const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');

// Aqui criamos a parte de login no nosso banco de dados
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

    async login() {
        this.valid();
        if (this.errors.length > 0) return;
        this.user = await LoginModel.findOne({ email: this.body.email });
        if (!this.user) {
            this.errors.push('Usuário invalido.')
            return;
        };

        // Aqui usamos o bcrypt para comparar a senha, tendo em vista que ela está em harsh
        if (!bcryptjs.compareSync(this.body.password, this.user.password)) {
            this.errors.push('Senha invalida.');
            this.user = null;
            return
        }
    }

    // Aqui fazemos a função ser assincrona pois irá fazer conexão com a base de dados.
    async register() {
        this.valid();
        if (this.errors.length > 0) return;

        // Aqui chamamos o metodo para verificar se o usuário já existe na base de dados.
        await this.userExists();
        if (this.errors.length > 0) return;

        // Aqui fazemos um hash da senha, garantindo uma segurança maior para o nosso usuário.
        const salt = bcryptjs.genSaltSync();
        this.body.password = bcryptjs.hashSync(this.body.password, salt);

        // Aqui criamos o usuários com as informações obtidas do formulário.
        this.user = await LoginModel.create(this.body)
    }

    // Aqui verificamos na base de dados 
    async userExists() {
        // Aqui verificamos um registro na base de dados se o e-mail que está sendo enviado já existe.
        this.user = await LoginModel.findOne({ email: this.body.email })
        if (this.user) this.errors.push('Usuário já cadastrado.')
    }

    valid() {
        // Aqui chamamos a função para limpar o formulário 
        this.cleanUp();
        // validação de cadastro

        // O e-mail precisa ser um e-mail valido. Utilizamos o validator para fazer a verificação, caso tenha erro, adicionamos no nosso array
        if (!validator.isEmail(this.body.email)) this.errors.push('E-mail inválido')

        // A senha precisa ter no minimo 5 caracteres. Aqui fazemos uma validação através do tamanho.
        if (this.body.password.length < 5) {
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