require('dotenv').config(); //Variaveis de ambientes

const express = require('express'); //Importação do Express
const app = express();

//Conecta na nossa base de dados.
const mongoose = require('mongoose');
mongoose.connect(process.env.CONNECTIONSTRING)
    .then(() => {
        console.log('Conectado a base de dados');
        //Emite um sinal
        app.emit('pronto');
    })
    .catch(e => console.error(e));

//Aqui a gente está fazendo a conexão de sessão
const session = require('express-session'); // Para identificar o navegador de um cliente(cookie)
const MongoStore = require('connect-mongo'); // Aqui é utilizado para salvar as sessões na base de dados
const flash = require('connect-flash'); // Mensagens rápidas salvas em sessões.

const routes = require('./routes'); //Importação dos routes
const path = require('path'); // Importação do Path
const helmet = require('helmet'); // Segurança 
const csrf = require('csurf'); // csrf tokens (segurança).
const { middlewareGlobal, checkCsrfError, csrfMiddleware } = require('./src/middlewares/middleware'); //importação do middleware (Middleware são funções que são executadas na rota)

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Parte estatica (pasta public, utilizando o path como caminho absoluto), outros arquivos estaticos são JS, CSS, imagens.
app.use(express.static(path.resolve(__dirname, 'public')));

//Configurações da sessão
const sessionOptions = session({
    secret: 'eahsdiuhaiuhdsapiueahdsauhaeuhdasiuaehash',
    // Aqui é onde será salvo a sessão
    store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }),
    resave: false,
    saveUninitialized: false,
    //Quanto tempo vai ser a duração do cookie
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 dias em milesimos de segundo
        httpOnly: true
    }
});

app.use(sessionOptions);
app.use(flash());

//Parte de views(utilizando path como caminho absoluto)
app.set('views', path.resolve(__dirname, 'src', 'views'));

//Aqui é a engine que utilizamos para visualizar nossas views, aqui utilizamos o EJS
app.set('view engine', 'ejs');


app.use(csrf());
//Middleware
app.use(middlewareGlobal);
app.use(csrfMiddleware);
app.use(checkCsrfError);

//Rotas
app.use(routes);

//Essa função só irá executar quando conectar ao banco de dados
app.on('pronto', () => {
    //Console para mostrar que estamos logado no servidor
    app.listen(3000, () => {
        console.log('Acessar http://localhost:3000')
        console.log('Inciando servidor na porta 3000')
    });
})

