const mongoose = require('mongoose');
const validator = require('validator')

const ContatoSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    sobrenome: { type: String, required: false, default: '' },
    email: { type: String, required: false, default: '' },
    telefone: { type: String, required: false, default: '' },
    criadoEm: { type: Date, default: Date.now },
});

const ContatoModel = mongoose.model('Contato', ContatoSchema);


// Aqui usamos o metodo contrutor ao invés de classe.
function Contato(body) {
    this.body = body;
    this.errors = [];
    this.contato = null;
};

Contato.buscaPorId = async function (id) {
    if (typeof id !== 'string') return;
    const contato = await ContatoModel.findById(id);
    return contato;
};

Contato.prototype.register = async function () {
    // Aqui novamente fazemos a verificação do contato antes de cadastrar ele.
    this.valid();

    if (this.errors.length > 0) return;

    // Aqui é onde é criado definitivamente o contato.
    this.contato = await ContatoModel.create(this.body);
};

Contato.prototype.valid = function () {
    // Aqui chamamos a função para limpar o formulário 
    this.cleanUp();
    // validação de cadastro

    // O e-mail precisa ser um e-mail valido. Utilizamos o validator para fazer a verificação, caso tenha erro, adicionamos no nosso array
    if (this.body.email && !validator.isEmail(this.body.email)) this.errors.push('E-mail inválido');
    if (!this.body.nome) this.errors.push('Nome é um campo obrigatório')
    if (!this.body.email && !this.body.telefone) {
        this.errors.push('É necessário cadastrar um telefone ou e-mail do contato.')
    }

};

// O cleanUp serve para "limpar" o nosso objeto e assim só envie o e-mail e password para a nossa base de dados, e não envie o csurf junto.
Contato.prototype.cleanUp = function () {
    for (const key in this.body) {
        // Aqui ele faz a verificação se o campo é uma string, caso contrario, ele retornara uma string vazio.
        if (typeof this.body[key] !== 'string') {
            this.body[key] = '';
        }
    }

    this.body = {
        // Aqui indicamos que ele só irá retornar o e-mail e senha 
        nome: this.body.nome,
        sobrenome: this.body.sobrenome,
        email: this.body.email,
        telefone: this.body.telefone,
    };
};

Contato.prototype.edit = async function (id) {
    if (typeof id !== 'string') return;
    this.valid();
    if (this.errors.length > 0) return;
    this.contato = await ContatoModel.findByIdAndUpdate(id, this.body, { new: true });
}

module.exports = Contato;